$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot

function Assert-Before {
    param(
        [string]$Text,
        [string]$Earlier,
        [string]$Later,
        [string]$Message
    )

    $earlierIndex = $Text.IndexOf($Earlier, [StringComparison]::Ordinal)
    $laterIndex = $Text.IndexOf($Later, [StringComparison]::Ordinal)
    if ($earlierIndex -lt 0 -or $laterIndex -lt 0 -or $earlierIndex -ge $laterIndex) {
        throw $Message
    }
}

$eliteGroup = Get-Content -Raw (Join-Path $root "project/assets/Script/Views/LyEliteGroup.ts")
$loadInfo = [regex]::Match($eliteGroup, 'private loadInfoData\(\): void\{(?s:.*?)\r?\n\s*\}\r?\n\s*private refrehPage').Value
if ([string]::IsNullOrEmpty($loadInfo)) {
    throw "could not locate LyEliteGroup.loadInfoData"
}

Assert-Before $loadInfo `
    "tlevel = element3.resonanceLevel" `
    "let isTopLevel" `
    "LyEliteGroup must read the server resonance level before computing max-level state"

if ($loadInfo -notmatch 'let maxLevel\s*=\s*LocaleData\.getOneTypeEncyclopedia\(element\.resonance_id\)\.length') {
    throw "LyEliteGroup must name the configured maximum resonance level"
}
if ($loadInfo -notmatch 'let isTopLevel\s*=\s*tlevel\s*>=\s*maxLevel\s*\?\s*2\s*:\s*1') {
    throw "LyEliteGroup must treat server levels at or above the configured maximum as top level"
}

Write-Output "CLIENT_RESKIN_COMPLETION_CONTRACT_OK"
