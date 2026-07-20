$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $PSScriptRoot
$utilsPath = Join-Path $repoRoot 'project/assets/Script/Kernel/UtilsUI.ts'
$varValPath = Join-Path $repoRoot 'project/assets/Script/Values/VarVal.ts'
$evolutionPath = Join-Path $repoRoot 'project/tools/common/xmls/Evolution.xml'
$equipPath = Join-Path $repoRoot 'project/tools/common/xmls/Equip.xml'

$utilsSource = Get-Content -Raw -LiteralPath $utilsPath
$varValSource = Get-Content -Raw -LiteralPath $varValPath
$evolution = [xml](Get-Content -Raw -LiteralPath $evolutionPath)
$equip = [xml](Get-Content -Raw -LiteralPath $equipPath)

$level50 = $evolution.root.evolution.item | Where-Object { [int]$_.level -eq 50 }
if ($null -eq $level50) {
    throw 'Evolution level 50 must remain present for the fishing boundary regression.'
}

$qualityById = @{}
foreach ($quality in $equip.root.quality.item) {
    $qualityById[[int]$quality.id] = $quality
}

$level50Qualities = @($level50.quality -split ',' | ForEach-Object { [int]$_ })
if ($level50Qualities.Count -eq 0) {
    throw 'Evolution level 50 must define fishing equipment qualities.'
}
foreach ($quality in $level50Qualities) {
    if (-not $qualityById.ContainsKey($quality)) {
        throw "Evolution level 50 references missing equipment quality $quality."
    }
    if ([int]$qualityById[$quality].star -ne 16) {
        throw "Evolution level 50 quality $quality must exercise the tier-16 equipment effect boundary."
    }
}

if ($varValSource -notmatch 'equip_15\s*:\s*"8119"') {
    throw 'The last available equipment frame effect must remain equip_15 (model 8119).'
}
if ($varValSource -match '\bequip_16\s*:') {
    throw 'This regression assumes there is no dedicated equip_16 spine resource; use it directly if one is added.'
}

if ($utilsSource -notmatch 'const\s+equipEffectId\s*=\s*VarVal\.UI_EFF\["equip_"\s*\+\s*qualityType\]\s*\|\|\s*VarVal\.UI_EFF\.equip_15') {
    throw 'High-quality equipment must fall back to the last available frame effect instead of passing undefined to the spine loader.'
}
if ($utilsSource -notmatch 'loader_spine_equip\s*&&\s*equipEffectId') {
    throw 'Equipment effect loading must guard both the loader and resolved model id.'
}
if ($utilsSource -match 'loadSpineEffAndShow\(loader_spine_equip,\s*VarVal\.UI_EFF\["equip_"\s*\+\s*qualityType\]') {
    throw 'Equipment rendering must not pass an unchecked effect lookup to loadSpineEffAndShow.'
}
if ($utilsSource -notmatch 'con_star\.pageCount\s*>\s*0') {
    throw 'Equipment star rendering must guard the FairyGUI controller page count.'
}
if ($utilsSource -notmatch 'selectedIndex\s*=\s*\(Math\.max\(starNum,\s*1\)\s*-\s*1\)\s*%\s*con_star\.pageCount') {
    throw 'Equipment stars must cycle within the FairyGUI controller pages for reused high-quality tiers.'
}

$tier16Qualities = @($equip.root.quality.item | Where-Object { [int]$_.star -eq 16 } | Sort-Object { [int]$_.id })
if ($tier16Qualities.Count -le 5) {
    throw 'This regression must exercise more qualities than the five FairyGUI star pages.'
}
foreach ($quality in $tier16Qualities) {
    $starCount = @($tier16Qualities | Where-Object { [int]$_.id -le [int]$quality.id }).Count
    $selectedIndex = ($starCount - 1) % 5
    if ($selectedIndex -lt 0 -or $selectedIndex -ge 5) {
        throw "Equipment quality $($quality.id) resolves to invalid star controller index $selectedIndex."
    }
}

Write-Host 'FISHING_HIGH_QUALITY_EQUIP_CONTRACT_OK'
