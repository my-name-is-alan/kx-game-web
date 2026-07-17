param(
    [string]$SourcePath = (Join-Path $PSScriptRoot '..\project\assets\Script\Views\LyLogo.ts')
)

$ErrorActionPreference = 'Stop'
$source = Get-Content -Raw -LiteralPath $SourcePath

if ($source -match 'VarVal\.PRELOAD_FGUIS\[name\]\s*\?\s*false\s*:\s*true') {
    throw 'FairyGUI packages still depend on the unavailable placeholder-atlas runtime extensions'
}

if ($source -notmatch '(?s)PlatformAPI\.loadUiPackage\(.*?\},\s*name,\s*false\s*\);') {
    throw 'FairyGUI packages must preload real atlases before views can create bitmap fonts'
}

Write-Output 'FAIRYGUI_REAL_ATLAS_PRELOAD_CONTRACT_OK'
