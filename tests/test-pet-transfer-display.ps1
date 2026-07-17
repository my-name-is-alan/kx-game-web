$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$viewsRoot = Join-Path $root "project/assets/Script/Views"
$helperPath = Join-Path $viewsRoot "PetTransferDisplay.ts"
$viewFiles = @("LyPet.ts", "LyPetDevourpet.ts", "LyPetTisp.ts", "LyPetRefreshBuff.ts", "LyBuddyChoose.ts")

if (-not (Test-Path $helperPath)) {
    throw "PetTransferDisplay.ts is missing"
}

$helper = Get-Content -Raw $helperPath
foreach ($expected in @(
    "PET_TRANSFER_MAX = 3996",
    "PET_LEGACY_VISUAL_MAX = 40",
    "function petTransferVisual",
    "function petTransferProgress",
    "function petBuffLevel",
    "function petBuffValue"
)) {
    if ($helper -notmatch [regex]::Escape($expected)) {
        throw "transfer display helper is missing: $expected"
    }
}

foreach ($name in $viewFiles) {
    $path = Join-Path $viewsRoot $name
    $text = Get-Content -Raw $path
    if ($text -notmatch 'PetTransferDisplay') {
        throw "$name does not use PetTransferDisplay"
    }
    if ($text -match 'Math\.floor\([^\r\n]*devourLevel[^\r\n]*/\s*5\)' -or
        $text -match 'devourLevel\s*%\s*5') {
        throw "$name still calculates unbounded star resources directly"
    }
    if ($text -match 'petTransferProgress\(') {
        throw "$name injects extended transfer progress into a compact label"
    }
}

$allViews = ($viewFiles | ForEach-Object { Get-Content -Raw (Join-Path $viewsRoot $_) }) -join "`n"
if ($allViews -match 'petBuffLevel\(') {
    throw "compact passive badges must not render the extended /999 formatter"
}

$tips = Get-Content -Raw (Join-Path $viewsRoot "LyPetBuffTips.ts")
if ($tips -notmatch 'petBuffValue\(' -or $tips -match 'buffParams\[buffData\.buffLevel\s*-\s*1\]') {
    throw "passive effect tips do not support levels above ten"
}

$utilsUI = Get-Content -Raw (Join-Path $root "project/assets/Script/Kernel/UtilsUI.ts")
if ($utilsUI -match 'petBuffLevel\(' -or $utilsUI -notmatch 'String\(buffData\.buffLevel\)') {
    throw "shared pet passive renderer must keep the original compact numeric level"
}

$devour = Get-Content -Raw (Join-Path $viewsRoot "LyPetDevourpet.ts")
if ($devour -notmatch 'Math\.min\(PET_TRANSFER_MAX,[\s\S]*?this\.devourerPet\.devourLevel[\s\S]*?preyPet\.devourLevel[\s\S]*?\+ 1\)') {
    throw "transfer preview must add target total, material total, and the current transfer before clamping"
}
if ($helper -notmatch 'return `Lv\$\{boundedInteger\(level, maximum\)\}/\$\{maximum\}`') {
    throw "passive level formatter must use LvN/999"
}

$metaPath = "$helperPath.meta"
if (-not (Test-Path -LiteralPath $metaPath -PathType Leaf)) {
    throw "PetTransferDisplay.ts.meta is missing"
}

Write-Output "PET_TRANSFER_DISPLAY_OK"
