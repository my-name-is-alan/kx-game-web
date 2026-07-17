$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repo = Split-Path -Parent $PSScriptRoot
$project = Join-Path $repo 'project'
$vendor = Join-Path $repo 'FairyGUI-cocoscreator-ccc3.0/source'
$expectedDependency = 'file:../FairyGUI-cocoscreator-ccc3.0/source'

function Fail([string]$Message) {
    throw "[fairygui compatibility contract] $Message"
}

function Assert-Contains([string]$Text, [string]$Needle, [string]$Label) {
    if (-not $Text.Contains($Needle, [StringComparison]::Ordinal)) {
        Fail "$Label is missing '$Needle'"
    }
}

function Assert-Ordered([string]$Text, [string]$First, [string]$Second, [string]$Label) {
    $firstAt = $Text.IndexOf($First, [StringComparison]::Ordinal)
    $secondAt = $Text.IndexOf($Second, [StringComparison]::Ordinal)
    if ($firstAt -lt 0 -or $secondAt -lt 0 -or $secondAt -le $firstAt) {
        Fail "$Label does not keep '$Second' after '$First'"
    }
}

$packageJson = Get-Content -Raw -LiteralPath (Join-Path $project 'package.json') | ConvertFrom-Json
if ([string]$packageJson.dependencies.'fairygui-cc' -cne $expectedDependency) {
    Fail "project/package.json must pin fairygui-cc to $expectedDependency"
}

$sourceText = Get-Content -Raw -LiteralPath (Join-Path $vendor 'src/GComponent.ts')
Assert-Contains $sourceText 'private _invertedMask' 'tracked TypeScript source'
Assert-Contains $sourceText 'this._invertedMask = inverted' 'tracked TypeScript source'
Assert-Contains $sourceText 'SPRITE_STENCIL' 'tracked TypeScript source'
Assert-Contains $sourceText 'GRAPHICS_ELLIPSE' 'tracked TypeScript source'
Assert-Contains $sourceText 'GRAPHICS_RECT' 'tracked TypeScript source'
Assert-Contains $sourceText 'this._customMask.inverted = this._invertedMask' 'tracked TypeScript source'
Assert-Ordered $sourceText 'this._customMask.type' 'this._customMask.inverted = this._invertedMask' 'tracked TypeScript source'

$distPath = Join-Path $vendor 'dist/fairygui.mjs'
$distText = Get-Content -Raw -LiteralPath $distPath
$distHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $distPath).Hash
Assert-Contains $distText 'freeSpine()' 'tracked distributed module'
Assert-Contains $distText 'scanAll(callback)' 'tracked distributed module'
Assert-Contains $distText 'Mask.Type.SPRITE_STENCIL' 'tracked distributed module'
Assert-Contains $distText 'Mask.Type.GRAPHICS_ELLIPSE' 'tracked distributed module'
Assert-Contains $distText 'Mask.Type.GRAPHICS_RECT' 'tracked distributed module'
Assert-Contains $distText 'this._customMask.inverted = this._invertedMask' 'tracked distributed module'
if ($distText.Contains('Mask.Type.IMAGE_STENCIL', [StringComparison]::Ordinal)) {
    Fail 'tracked distributed module still uses deprecated IMAGE_STENCIL'
}
Assert-Ordered $distText 'this._customMask.type' 'this._customMask.inverted = this._invertedMask' 'tracked distributed module'

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

    $installedPath = Join-Path $testProject 'node_modules/fairygui-cc/dist/fairygui.mjs'
    $installedHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $installedPath).Hash
    if ($installedHash -cne $distHash) {
        Fail "clean npm ci installed FairyGUI hash $installedHash instead of the tracked local build $distHash"
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

Write-Host 'FAIRYGUI_COMPATIBILITY_DEPENDENCY_CONTRACT_OK'
