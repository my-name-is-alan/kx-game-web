$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot

function Get-One {
    param($Rows, [scriptblock]$Predicate, [string]$Message)
    $matches = @($Rows | Where-Object $Predicate)
    if ($matches.Count -ne 1) { throw "$Message; got $($matches.Count) rows" }
    return $matches[0]
}

$bonuses = Get-Content -Raw (Join-Path $root "project/assets/resources/data/Bonuses.json") | ConvertFrom-Json
if (@($bonuses._root[0]._bonuses[0]._item | Where-Object { $_.bonusesId -eq "201" }).Count -ne 0) {
    throw "generated Bonuses.json still contains retired reward group 201"
}

$combatPower = Get-Content -Raw (Join-Path $root "project/assets/resources/data/CombatPower.json") | ConvertFrom-Json
$health18 = Get-One $combatPower._root[0]._base[0]._item { $_.attr -eq "health" -and $_.id -eq "18" } "generated CombatPower health level 18 is missing"
if ($health18.attrValueUpper -ne "8000000000") {
    throw "generated CombatPower.json does not include the server high-range health curve"
}

$evolution = Get-Content -Raw (Join-Path $root "project/assets/resources/data/Evolution.json") | ConvertFrom-Json
$level16 = Get-One $evolution._root[0]._evolution[0]._item { $_.level -eq "16" } "generated Evolution level 16 is missing"
if ($level16.bonusesId1 -ne "500005" -or $level16.bonusesId2 -ne "500015") {
    throw "generated Evolution.json differs from server reward groups at level 16"
}

$items = Get-Content -Raw (Join-Path $root "project/assets/resources/data/Items.json") | ConvertFrom-Json
$ice = Get-One $items._root[0]._item { $_.id -eq "120030" } "generated item 120030 is missing"
$soulSand = Get-One $items._root[0]._item { $_.id -eq "120040" } "generated item 120040 is missing"
if ($ice.icon -ne "Props-xuanbing") { throw "item 120030 must use the matching xuanbing icon" }
if ($soulSand.getParam -ne "35") { throw "item 120040 must retain its valid acquisition guide" }

$activitiesXml = [xml](Get-Content -Raw (Join-Path $root "project/tools/common/xmls/Activities.xml"))
$activitiesJson = Get-Content -Raw (Join-Path $root "project/assets/resources/data/Activities.json") | ConvertFrom-Json
$xmlBazaar = @($activitiesXml.root.activity | Where-Object { $_.id -eq "102" }).shop.item
$jsonBazaar = @(($activitiesJson._root[0]._activity | Where-Object { $_.id -eq "102" })._shop[0]._item)
if ($xmlBazaar.Count -ne $jsonBazaar.Count) {
    throw "generated Activities.json bazaar row count differs from Activities.xml"
}
foreach ($xmlRow in $xmlBazaar) {
    $jsonRow = Get-One $jsonBazaar { $_.id -eq $xmlRow.id } "generated bazaar row $($xmlRow.id) is missing"
    foreach ($attribute in $xmlRow.Attributes) {
        if ($jsonRow.($attribute.Name) -cne $attribute.Value) {
            throw "generated bazaar row $($xmlRow.id) field $($attribute.Name) differs from Activities.xml"
        }
    }
}

$tasks = Get-Content -Raw (Join-Path $root "project/assets/resources/data/Task.json") | ConvertFrom-Json
foreach ($activeEscortTaskId in @("10050", "10051")) {
    if (@($tasks._root[0]._item | Where-Object { $_.id -eq $activeEscortTaskId }).Count -ne 1) {
        throw "generated Task.json lost active escort task $activeEscortTaskId"
    }
}

$pet = Get-Content -Raw (Join-Path $root "project/assets/resources/data/Pet.json") | ConvertFrom-Json
$petRoot = $pet._root[0]
foreach ($field in @("petDesc", "petEncyDesc", "petSummonDesc")) {
    $description = $petRoot.$field
    if ($description -notlike "*@四、洗练-1.*" -or $description -notlike "*洗练<br/>2.每次洗练*") {
        throw "generated Pet.json $field is missing the wash section separators"
    }
    if ($description -like "*羁绊六、洗练*" -or $description -like "*提升3.重复*" -or $description -like "*星级<br/>3.侠侣的属性*") {
        throw "generated Pet.json $field still contains malformed companion help numbering"
    }
}
if ($petRoot.petDesc -cne $petRoot.petEncyDesc -or $petRoot.petDesc -cne $petRoot.petSummonDesc) {
    throw "generated Pet.json companion help fields must share one canonical description"
}

Write-Output "SHARED_DATA_GENERATION_OK"
