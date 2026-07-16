$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot

function Assert-Matches {
    param(
        [string]$Text,
        [string]$Pattern,
        [string]$Message
    )

    if ($Text -notmatch $Pattern) {
        throw $Message
    }
}

function Assert-Equal {
    param(
        $Actual,
        $Expected,
        [string]$Message
    )

    if ($Actual -ne $Expected) {
        throw "$Message. Expected '$Expected', got '$Actual'"
    }
}

$petXmlPath = Join-Path $root "project/tools/common/xmls/Pet.xml"
$petJsonPath = Join-Path $root "project/assets/resources/data/Pet.json"
$petXml = Get-Content -Raw $petXmlPath
$petJson = Get-Content -Raw $petJsonPath | ConvertFrom-Json
$groups = @($petJson._root[0]._refreshBuffGroup[0]._refreshBuffGroup)

Assert-Matches $petXml 'lockCnt="0" costID="1,120012,5"' "client XML lockCnt=0 cost is wrong"
Assert-Matches $petXml 'lockCnt="1" costID="1,120012,10;1,120013,15"' "client XML lockCnt=1 cost is wrong"
Assert-Matches $petXml 'lockCnt="2" costID="1,120012,20;1,120013,25"' "client XML lockCnt=2 cost is wrong"
Assert-Matches $petXml 'lockCnt="3" costID="1,120012,30;1,120013,35"' "client XML lockCnt=3 cost is wrong"
if ($petXml -match 'lockCnt="4"|160001|161003') {
    throw "client XML still contains the obsolete refresh contract"
}

Assert-Equal $groups.Count 4 "client JSON must expose four refresh cost rows"
Assert-Equal (($groups.lockCnt) -join ",") "0,1,2,3" "client JSON lock counts are wrong"
Assert-Equal (($groups.costID) -join "|") "1,120012,5|1,120012,10;1,120013,15|1,120012,20;1,120013,25|1,120012,30;1,120013,35" "client JSON costs are wrong"

$errorCodes = Get-Content -Raw (Join-Path $root "project/assets/Script/Values/PErrCode.ts")
Assert-Matches $errorCodes 'pet_clear_skill_not_level\s*=\s*775' "client level error code must match the server"

$gameServerData = Get-Content -Raw (Join-Path $root "project/assets/Script/Kernel/GameServerData.ts")
$exploreHandler = [regex]::Match($gameServerData, 'public on_explore\(args: any\): void\{(?s:.*?)\r?\n\s*\}\r?\n\s*public on_addExploreStamina').Value
if ([string]::IsNullOrEmpty($exploreHandler)) {
    throw "could not locate on_explore handler"
}
Assert-Matches $exploreHandler '(?s)if \(args\.companionAttrs\).*companionData\.companionAttrs\s*=\s*args\.companionAttrs' "on_explore must merge companionAttrs when returned"

$companionLevel = Get-Content -Raw (Join-Path $root "project/assets/Script/Views/LyCompanionLevel.ts")
Assert-Matches $companionLevel 'ui://LyCompanion/companion_bg\{0\}' "companion level quality frame uses the wrong package"

$eliteGet = Get-Content -Raw (Join-Path $root "project/assets/Script/Views/LyEliteGet.ts")
Assert-Matches $eliteGet 'ui://LyEliteMonster/frame_get\{0\}' "elite get quality frame uses the wrong package"
if ($eliteGet -match 'proto\.quality\s*-\s*1') {
    throw "elite quality must not be shifted"
}

$companionBin = [Text.Encoding]::UTF8.GetString([IO.File]::ReadAllBytes((Join-Path $root "project/assets/resources/ui/LyCompanion.bin")))
$eliteBin = [Text.Encoding]::UTF8.GetString([IO.File]::ReadAllBytes((Join-Path $root "project/assets/resources/ui/LyEliteMonster.bin")))
Assert-Matches $companionBin 'companion_bg1' "LyCompanion package is missing companion_bg1"
Assert-Matches $companionBin 'companion_bg4' "LyCompanion package is missing companion_bg4"
Assert-Matches $eliteBin 'frame_get2' "LyEliteMonster package is missing frame_get2"
Assert-Matches $eliteBin 'frame_get6' "LyEliteMonster package is missing frame_get6"

Write-Output "PET_COMPANION_CLIENT_CONTRACT_OK"
