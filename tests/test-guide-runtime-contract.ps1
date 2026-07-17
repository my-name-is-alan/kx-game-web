$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$eventSource = Get-Content -Raw (Join-Path $repoRoot 'FairyGUI-cocoscreator-ccc3.0/source/src/event/Event.ts')
$inputSource = Get-Content -Raw (Join-Path $repoRoot 'FairyGUI-cocoscreator-ccc3.0/source/src/event/InputProcessor.ts')
$guideSource = Get-Content -Raw (Join-Path $repoRoot 'project/assets/Script/Views/LyGuideStart.ts')
$distSource = Get-Content -Raw (Join-Path $repoRoot 'FairyGUI-cocoscreator-ccc3.0/source/dist/fairygui.mjs')

foreach ($source in @($eventSource, $distSource)) {
    if ($source -notmatch 'CLICK_BEFORE\s*[:=].*fui_click_before') {
        throw 'FairyGUI must expose CLICK_BEFORE for guide target detection.'
    }
    if ($source -notmatch 'TOUCH_END_LATE\s*[:=].*fui_touch_end_late') {
        throw 'FairyGUI must expose TOUCH_END_LATE for guide completion ordering.'
    }
}

$beforeIndex = $inputSource.IndexOf('FUIEvent.CLICK_BEFORE')
$clickIndex = $inputSource.IndexOf('FUIEvent.CLICK, true', $beforeIndex + 1)
$lateIndex = $inputSource.IndexOf('FUIEvent.TOUCH_END_LATE', $clickIndex + 1)
if ($beforeIndex -lt 0 -or $clickIndex -lt 0 -or $lateIndex -lt 0 -or
    -not ($beforeIndex -lt $clickIndex -and $clickIndex -lt $lateIndex)) {
    throw 'Guide click events must dispatch in CLICK_BEFORE -> CLICK -> TOUCH_END_LATE order.'
}

if ($guideSource -notmatch 'localToGlobalRect\(' -or $guideSource -notmatch 'globalToLocalRect\(') {
    throw 'Guide target geometry must be converted as a world rectangle.'
}
if ($guideSource -match 'width\s*\*\s*gggObject\.scaleX' -or
    $guideSource -match 'height\s*\*\s*gggObject\.scaleY') {
    throw 'Guide target geometry must not ignore ancestor transforms.'
}

Write-Host 'Guide runtime contract passed.'
