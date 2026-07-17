$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repo = Split-Path -Parent $PSScriptRoot
$project = Join-Path $repo 'project'
$vendor = Join-Path $repo 'FairyGUI-cocoscreator-ccc3.0/source'
$expectedDependency = 'file:../FairyGUI-cocoscreator-ccc3.0/source'

function Fail([string]$Message) {
    throw "[fairygui mask dependency contract] $Message"
}

function Assert-DeferredMaskInversion(
    [string]$Path,
    [string]$Label,
    [string]$SetMaskMarker,
    [string]$ReadyMarker,
    [string]$NextMethodMarker
) {
    $text = Get-Content -Raw -LiteralPath $Path
    $setMaskAt = $text.IndexOf($SetMaskMarker, [StringComparison]::Ordinal)
    $readyAt = if ($setMaskAt -ge 0) {
        $text.IndexOf($ReadyMarker, $setMaskAt, [StringComparison]::Ordinal)
    }
    else {
        -1
    }
    if ($setMaskAt -lt 0 -or $readyAt -lt 0) {
        Fail "$Label does not expose the expected setMask/onMaskReady implementation"
    }

    $setMaskBody = $text.Substring($setMaskAt, $readyAt - $setMaskAt)
    if ($setMaskBody.Contains('this._customMask.inverted = inverted', [StringComparison]::Ordinal)) {
        Fail "$Label writes Mask.inverted before the mask renderer is ready"
    }
    if (-not $setMaskBody.Contains('this._inverted = inverted', [StringComparison]::Ordinal)) {
        Fail "$Label does not retain the requested inversion state"
    }

    $nextMethodAt = $text.IndexOf($NextMethodMarker, $readyAt, [StringComparison]::Ordinal)
    if ($nextMethodAt -lt 0) {
        Fail "$Label is missing the method boundary after onMaskReady"
    }
    $readyBody = $text.Substring($readyAt, $nextMethodAt - $readyAt)
    $typeAt = $readyBody.LastIndexOf('this._customMask.type', [StringComparison]::Ordinal)
    $invertedAt = $readyBody.IndexOf('this._customMask.inverted = this._inverted', [StringComparison]::Ordinal)
    if ($typeAt -lt 0 -or $invertedAt -lt 0 -or $invertedAt -lt $typeAt) {
        Fail "$Label must apply Mask.inverted after selecting the renderer type"
    }
}

$packageJson = Get-Content -Raw -LiteralPath (Join-Path $project 'package.json') | ConvertFrom-Json
if ([string]$packageJson.dependencies.'fairygui-cc' -cne $expectedDependency) {
    Fail "project/package.json must pin fairygui-cc to $expectedDependency"
}

Assert-DeferredMaskInversion `
    (Join-Path $vendor 'src/GComponent.ts') `
    'tracked TypeScript source' `
    'public setMask(' `
    'private onMaskReady()' `
    'private onMaskContentChanged()'
Assert-DeferredMaskInversion `
    (Join-Path $vendor 'dist/fairygui.mjs') `
    'tracked distributed module' `
    'setMask(value, inverted) {' `
    "`n    onMaskReady() {" `
    "`n    onMaskContentChanged() {"

$testRoot = Join-Path ([IO.Path]::GetTempPath()) ('hdhive-fairygui-contract-' + [guid]::NewGuid().ToString('N'))
$testProject = Join-Path $testRoot 'project'
$testVendor = Join-Path $testRoot 'FairyGUI-cocoscreator-ccc3.0/source'
New-Item -ItemType Directory -Path $testProject,$testVendor -Force | Out-Null
try {
    Copy-Item -LiteralPath (Join-Path $project 'package.json'),(Join-Path $project 'package-lock.json') -Destination $testProject
    Copy-Item -LiteralPath (Join-Path $vendor 'package.json') -Destination $testVendor
    Copy-Item -LiteralPath (Join-Path $vendor 'dist') -Destination $testVendor -Recurse

    Push-Location $testProject
    try {
        & npm ci --ignore-scripts --no-audit --no-fund | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Fail "clean npm ci failed with exit code $LASTEXITCODE"
        }
    }
    finally {
        Pop-Location
    }

    $trackedHash = (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $vendor 'dist/fairygui.mjs')).Hash
    $installedHash = (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $testProject 'node_modules/fairygui-cc/dist/fairygui.mjs')).Hash
    if ($installedHash -cne $trackedHash) {
        Fail "clean npm ci installed FairyGUI hash $installedHash instead of tracked hash $trackedHash"
    }
}
finally {
    if (Test-Path -LiteralPath $testRoot) {
        $resolved = [IO.Path]::GetFullPath($testRoot)
        $tempPrefix = [IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
        if ($resolved.StartsWith($tempPrefix, [StringComparison]::OrdinalIgnoreCase) -and
            (Split-Path -Leaf $resolved).StartsWith('hdhive-fairygui-contract-', [StringComparison]::Ordinal)) {
            Remove-Item -LiteralPath $resolved -Recurse -Force
        }
    }
}

Write-Host 'FAIRYGUI_MASK_DEPENDENCY_CONTRACT_OK'
