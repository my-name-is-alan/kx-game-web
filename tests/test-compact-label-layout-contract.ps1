$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$compactCompanionViews = @(
    'LyBuddyChoose.ts',
    'LyPet.ts',
    'LyPetDevourpet.ts',
    'LyPetRefreshBuff.ts',
    'LyPetTisp.ts'
)
$compactCompanionSource = ($compactCompanionViews | ForEach-Object {
    Get-Content -Raw -LiteralPath (Join-Path $repoRoot "project/assets/Script/Views/$_")
}) -join "`n"
$refreshSource = Get-Content -Raw -LiteralPath (Join-Path $repoRoot 'project/assets/Script/Views/LyPetRefreshBuff.ts')
$veinSource = Get-Content -Raw -LiteralPath (Join-Path $repoRoot 'project/assets/Script/Views/LyVein.ts')

if ($compactCompanionSource -match 'petTransferProgress\(') {
    throw 'Existing compact companion labels must not append transfer progress.'
}

if ($refreshSource -match 'label_level\.text\s*=\s*petBuffLevel\(') {
    throw 'The compact passive-skill level badge must not append the global maximum.'
}

if ($veinSource -notmatch 'btn_back\.text\s*=\s*""') {
    throw 'The cultivation back button must explicitly suppress its package title.'
}

Write-Output 'Compact label layout contract passed.'
