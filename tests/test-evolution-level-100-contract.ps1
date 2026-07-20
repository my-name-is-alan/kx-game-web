$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $PSScriptRoot
$xmlRoot = Join-Path $repoRoot 'project/tools/common/xmls'
$jsonRoot = Join-Path $repoRoot 'project/assets/resources/data'

function Get-One {
    param($Rows, [scriptblock]$Predicate, [string]$Message)
    $matches = @($Rows | Where-Object $Predicate)
    if ($matches.Count -ne 1) { throw "$Message; got $($matches.Count) rows" }
    return $matches[0]
}

function Assert-FieldsEqual {
    param($XmlRow, $JsonRow, [string[]]$Fields, [string]$Message)
    foreach ($field in $Fields) {
        if ([string]$XmlRow.$field -cne [string]$JsonRow.$field) {
            throw "$Message field $field differs: XML=$($XmlRow.$field), JSON=$($JsonRow.$field)"
        }
    }
}

$evolutionXml = [xml](Get-Content -Raw -LiteralPath (Join-Path $xmlRoot 'Evolution.xml'))
$evolutionJson = Get-Content -Raw -LiteralPath (Join-Path $jsonRoot 'Evolution.json') | ConvertFrom-Json
$equipXml = [xml](Get-Content -Raw -LiteralPath (Join-Path $xmlRoot 'Equip.xml'))
$equipJson = Get-Content -Raw -LiteralPath (Join-Path $jsonRoot 'Equip.json') | ConvertFrom-Json

$evolutionXmlRows = @($evolutionXml.root.evolution.item)
$evolutionJsonRows = @($evolutionJson._root[0]._evolution[0]._item)
$qualityXmlRows = @($equipXml.root.quality.item)
$qualityJsonRows = @($equipJson._root[0]._quality[0]._item)
$equipXmlRows = @($equipXml.root.equip.item)
$equipJsonRows = @($equipJson._root[0]._equip[0]._item)

foreach ($rows in @($evolutionXmlRows, $evolutionJsonRows)) {
    $levelIds = @($rows | ForEach-Object { [int]$_.level } | Sort-Object)
    if ($levelIds.Count -ne 100 -or ($levelIds -join ',') -ne ((1..100) -join ',')) {
        throw 'Evolution XML and JSON must each contain exactly levels 1 through 100.'
    }
}

foreach ($level in 58..100) {
    $xmlRow = Get-One $evolutionXmlRows { [int]$_.level -eq $level } "Evolution XML level $level is missing or duplicated"
    $jsonRow = Get-One $evolutionJsonRows { [int]$_.level -eq $level } "Evolution JSON level $level is missing or duplicated"
    Assert-FieldsEqual $xmlRow $jsonRow @('level', 'money', 'time', 'bonusesId1', 'bonusesId2', 'quality', 'qualityDropWeight') "Evolution level $level"
}

$level100 = Get-One $evolutionXmlRows { $_.level -eq '100' } 'Evolution level 100 is missing'
if ($level100.money -ne '45000000' -or $level100.time -ne '177933') {
    throw 'Evolution level 100 cost/time does not follow the configured progression.'
}
if ($level100.quality -ne '92,93,94,95,96,97,98,99,100' -or $level100.qualityDropWeight -ne '5353,2873,1018,497,187,62,9,1,0') {
    throw 'Evolution level 100 quality window or weights changed unexpectedly.'
}

foreach ($rows in @($qualityXmlRows, $qualityJsonRows)) {
    $qualityIds = @($rows | ForEach-Object { [int]$_.id } | Sort-Object)
    if ($qualityIds.Count -ne 100 -or ($qualityIds -join ',') -ne ((1..100) -join ',')) {
        throw 'Equipment XML and JSON must each contain exactly qualities 1 through 100.'
    }
}

foreach ($quality in 58..100) {
    $xmlRow = Get-One $qualityXmlRows { [int]$_.id -eq $quality } "Equipment XML quality $quality is missing or duplicated"
    $jsonRow = Get-One $qualityJsonRows { [int]$_.id -eq $quality } "Equipment JSON quality $quality is missing or duplicated"
    Assert-FieldsEqual $xmlRow $jsonRow @('id', 'name', 'star', 'combatAttrValue', 'resistanceAttrValue') "Equipment quality $quality"
    if ($xmlRow.star -ne '16' -or $xmlRow.combatAttrValue -ne '419.1' -or $xmlRow.resistanceAttrValue -ne '191.1') {
        throw "Equipment quality $quality must retain the controlled tier-16 special attributes."
    }
}

foreach ($quality in 85..100) {
    $xmlRows = @($equipXmlRows | Where-Object { [int]$_.quality -eq $quality })
    $jsonRows = @($equipJsonRows | Where-Object { [int]$_.quality -eq $quality })
    if ($xmlRows.Count -ne 12 -or $jsonRows.Count -ne 12) {
        throw "Equipment quality $quality must define all 12 slots in XML and JSON."
    }
    foreach ($xmlRow in $xmlRows) {
        $jsonRow = Get-One $jsonRows { $_.id -eq $xmlRow.id } "Equipment JSON prototype $($xmlRow.id) is missing or duplicated"
        Assert-FieldsEqual $xmlRow $jsonRow @('id', 'quality', 'slot', 'name', 'icon') "Equipment prototype $($xmlRow.id)"
        if ([string]::IsNullOrWhiteSpace([string]$xmlRow.name) -or [string]::IsNullOrWhiteSpace([string]$xmlRow.icon)) {
            throw "Equipment prototype $($xmlRow.id) must retain a visible name and icon."
        }
    }
}

foreach ($rows in @($equipXmlRows, $equipJsonRows)) {
    $ids = @($rows | ForEach-Object { [int]$_.id })
    if (@($ids | Select-Object -Unique).Count -ne $ids.Count) {
        throw 'Equipment prototype ids must remain globally unique through quality 100.'
    }
}

$quality100Ids = @($equipXmlRows | Where-Object { $_.quality -eq '100' } | ForEach-Object { [int]$_.id } | Sort-Object)
$expectedQuality100Ids = @(10200, 10300, 10400, 10500, 10600, 10700, 10800, 10900, 11000, 11100, 11200, 11300)
if (($quality100Ids -join ',') -ne ($expectedQuality100Ids -join ',')) {
    throw "Equipment quality 100 prototype ids changed: $($quality100Ids -join ',')"
}

Write-Host 'EVOLUTION_100_CLIENT_CONTRACT_OK levels=100 qualities=100 slotsAtQuality100=12'
