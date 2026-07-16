$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$viewsRoot = Join-Path $root "project/assets/Script/Views"
$helperPath = Join-Path $viewsRoot "PetTransferDisplay.ts"
$viewFiles = @(
    "LyPet.ts",
    "LyPetDevourpet.ts",
    "LyPetTisp.ts",
    "LyPetRefreshBuff.ts",
    "LyBuddyChoose.ts"
)

if (-not (Test-Path $helperPath)) {
    throw "PetTransferDisplay.ts is missing"
}

$helper = Get-Content -Raw $helperPath
foreach ($expected in @(
    "PET_TRANSFER_MAX = 3996",
    "PET_LEGACY_VISUAL_MAX = 40",
    "function petTransferVisual",
    "function petTransferProgress",
    "function petBuffLevel"
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
}

$allViews = ($viewFiles | ForEach-Object { Get-Content -Raw (Join-Path $viewsRoot $_) }) -join "`n"
if ($allViews -notmatch 'petTransferProgress\(') {
    throw "extended total progress is not displayed numerically"
}
if ($allViews -notmatch 'petBuffLevel\(') {
    throw "extended passive levels are not displayed through the bounded formatter"
}

Write-Output "PET_TRANSFER_DISPLAY_OK"
