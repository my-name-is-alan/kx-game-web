$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot

function Assert-Equal {
    param($Actual, $Expected, [string]$Message)
    if ($Actual -ne $Expected) {
        throw "$Message. Expected '$Expected', got '$Actual'"
    }
}

function Get-ById {
    param($Nodes, [string]$Id, [string]$Message)
    $node = @($Nodes | Where-Object { $_.id -eq $Id })
    Assert-Equal $node.Count 1 $Message
    return $node[0]
}

$itemsXml = [xml](Get-Content -Raw (Join-Path $root "project/tools/common/xmls/Items.xml"))
$activitiesXml = [xml](Get-Content -Raw (Join-Path $root "project/tools/common/xmls/Activities.xml"))
$bonusesXml = [xml](Get-Content -Raw (Join-Path $root "project/tools/common/xmls/Bonuses.xml"))
$itemsJson = Get-Content -Raw (Join-Path $root "project/assets/resources/data/Items.json") | ConvertFrom-Json
$activitiesJson = Get-Content -Raw (Join-Path $root "project/assets/resources/data/Activities.json") | ConvertFrom-Json
$bonusesJson = Get-Content -Raw (Join-Path $root "project/assets/resources/data/Bonuses.json") | ConvertFrom-Json

foreach ($itemId in @("120012", "120013")) {
    $xmlItem = Get-ById $itemsXml.root.item $itemId "client XML item $itemId must exist once"
    $jsonItem = Get-ById $itemsJson._root[0]._item $itemId "client JSON item $itemId must exist once"
    Assert-Equal $xmlItem.useDesc "侠侣洗练" "client XML item $itemId use description is wrong"
    Assert-Equal $xmlItem.getParam "2,11" "client XML item $itemId acquisition guide is wrong"
    Assert-Equal $jsonItem.useDesc "侠侣洗练" "client JSON item $itemId use description is wrong"
    Assert-Equal $jsonItem.getParam "2,11" "client JSON item $itemId acquisition guide is wrong"
}

$xmlShop = (Get-ById $activitiesXml.root.activity "102" "client XML bazaar must exist once").shop.item
$jsonShop = (Get-ById $activitiesJson._root[0]._activity "102" "client JSON bazaar must exist once")._shop[0]._item
foreach ($shopId in @("14", "15")) {
    $xmlRow = Get-ById $xmlShop $shopId "client XML bazaar row $shopId must exist once"
    $jsonRow = Get-ById $jsonShop $shopId "client JSON bazaar row $shopId must exist once"
    Assert-Equal $jsonRow.itemId $xmlRow.itemId "client bazaar row $shopId item differs between XML and JSON"
    Assert-Equal $jsonRow.count $xmlRow.count "client bazaar row $shopId count differs between XML and JSON"
    Assert-Equal $jsonRow.stone $xmlRow.stone "client bazaar row $shopId price differs between XML and JSON"
    Assert-Equal $jsonRow.Discount_Type $xmlRow.Discount_Type "client bazaar row $shopId type differs between XML and JSON"
    Assert-Equal $jsonRow.openID $xmlRow.openID "client bazaar row $shopId unlock differs between XML and JSON"
}

$xmlDrops = @($bonusesXml.root.bonuses.item | Where-Object { $_.bonusesId -eq "300301" })
$jsonDrops = @($bonusesJson._root[0]._bonuses[0]._item | Where-Object { $_.bonusesId -eq "300301" })
foreach ($dropId in @("300305", "300306")) {
    $xmlDrop = Get-ById $xmlDrops $dropId "client XML Invasion drop $dropId must exist once"
    $jsonDrop = Get-ById $jsonDrops $dropId "client JSON Invasion drop $dropId must exist once"
    Assert-Equal $jsonDrop.protoId $xmlDrop.protoId "client Invasion drop $dropId item differs between XML and JSON"
    Assert-Equal $jsonDrop.count $xmlDrop.count "client Invasion drop $dropId count differs between XML and JSON"
    Assert-Equal $jsonDrop.rate $xmlDrop.rate "client Invasion drop $dropId rate differs between XML and JSON"
}

$strVal = Get-Content -Raw (Join-Path $root "project/assets/Script/Values/StrVal.ts")
$guideManager = Get-Content -Raw (Join-Path $root "project/assets/Script/Kernel/GuideManager.ts")
if ($strVal -notmatch 'GUIDE_TYPE\.ACTIVITY_SHOP.*"商铺"' -or $strVal -notmatch 'GUIDE_TYPE\.INVASION.*"魔教来袭"') {
    throw "client acquisition labels are missing"
}
if ($guideManager -notmatch 'guideType == VarVal\.GUIDE_TYPE\.INVASION') {
    throw "client Invasion guide route is missing"
}

Write-Output "PET_REFRESH_ACQUISITION_CLIENT_OK"
