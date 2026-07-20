$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $PSScriptRoot
$viewPath = Join-Path $repoRoot 'project/assets/Script/Views/LyEvolution.ts'
$evolutionPath = Join-Path $repoRoot 'project/tools/common/xmls/Evolution.xml'

$source = Get-Content -Raw -LiteralPath $viewPath
$evolution = [xml](Get-Content -Raw -LiteralPath $evolutionPath)
$levels = @($evolution.root.evolution.item | ForEach-Object { [int]$_.level })
$maxLevel = ($levels | Measure-Object -Maximum).Maximum

if ($maxLevel -lt 50) {
    throw 'The configured fishing level ceiling must continue to exercise the high-level boundary.'
}
if ($source -notmatch 'let\s+levelNext\s*=\s*LocaleData\.getEvolutionByLevel\(baseInfo\.evolutionLevel\s*\+\s*1\)') {
    throw 'The level-up red point must resolve the next configured evolution level once.'
}
if ($source -notmatch 'if\s*\(!levelNext\s*\|\|\s*baseInfo\.evolveFinishTime\s*!=\s*0\)\s*\{\s*return\s+false') {
    throw 'The level-up red point must return false when the player is already at the configured maximum.'
}
if ($source -match 'getEvolutionByLevel\(baseInfo\.evolutionLevel\s*\+\s*1\)\.money') {
    throw 'The level-up red point must not dereference money from a missing next-level configuration.'
}
if ($source -notmatch 'this\.levelNextQua\s*=\s*\[\]\s*this\.levelNextWei\s*=\s*\[\]') {
    throw 'The fishing view must initialize empty next-level probability arrays at the maximum level.'
}
if ($source -notmatch 'this\.label_des2\.text\s*=\s*this\.levelNext\s*\?') {
    throw 'The fishing view must not display a nonexistent next level at the configured maximum.'
}
if ($source -notmatch 'if\s*\(!this\.levelNext\)\s*\{\s*return\s*\}') {
    throw 'The fishing upgrade action must ignore clicks when no next level exists.'
}
if ($source -notmatch 'else\s*\{\s*this\.c1Con\.selectedIndex\s*=\s*0\s*this\.img_no\.visible\s*=\s*true\s*this\.img_ing\.visible\s*=\s*false\s*this\.group_up\.visible\s*=\s*false') {
    throw 'The fishing view must render a non-upgrade state at the configured maximum.'
}

Write-Host "EVOLUTION_MAX_LEVEL_CONTRACT_OK maxLevel=$maxLevel"
