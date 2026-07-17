param(
    [string]$SourcePath = (Join-Path $PSScriptRoot '..\project\assets\Script\Kernel\ViewDispatcher.ts')
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $SourcePath)) {
    throw "ViewDispatcher source not found: $SourcePath"
}

$source = Get-Content -LiteralPath $SourcePath -Raw
$methodMatch = [regex]::Match(
    $source,
    '(?s)private static viewRecreateFguiGObjectEx\(.*?\n    \}\r?\n\r?\n    /\*\*\r?\n     \* 刷新动态资源显示。'
)

if (-not $methodMatch.Success) {
    throw 'viewRecreateFguiGObjectEx method boundary not found'
}

$method = $methodMatch.Value

if ($method -match 'fgui\.getFontByName\s*\(') {
    throw 'Font refresh must not call the optional fgui.getFontByName export directly'
}

if ($method -notmatch 'obj\.font\s*=\s*null' -or $method -notmatch 'obj\.font\s*=\s*fontName') {
    throw 'Font refresh must force FairyGUI GTextField.font to re-resolve the registered font'
}

Write-Output 'PASS: font refresh uses the public GTextField.font setter without the optional getter export'
