$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot

function Read-RepoFile([string]$RelativePath) {
    return Get-Content -LiteralPath (Join-Path $repoRoot $RelativePath) -Raw
}

function Assert-Contains([string]$Text, [string]$Needle, [string]$Message) {
    if (-not $Text.Contains($Needle)) {
        throw $Message
    }
}

function Assert-NotContains([string]$Text, [string]$Needle, [string]$Message) {
    if ($Text.Contains($Needle)) {
        throw $Message
    }
}

$packageJson = Read-RepoFile 'project/package.json'
Assert-Contains $packageJson '"fairygui-cc": "file:../FairyGUI-cocoscreator-ccc3.0/source"' 'The client must consume the reviewed local FairyGUI runtime.'

$textField = Read-RepoFile 'FairyGUI-cocoscreator-ccc3.0/source/src/GTextField.ts'
Assert-Contains $textField 'this._label.string = "";' 'Plain FairyGUI labels must clear the Cocos default text.'
Assert-Contains $textField 'if (!this._label)' 'Text renderers without a Label must not create a Cocos default label through outlines or shadows.'

$eventSource = Read-RepoFile 'FairyGUI-cocoscreator-ccc3.0/source/src/event/Event.ts'
foreach ($eventName in @('CLICK_BEFORE', 'TOUCH_END_LATE', 'DISPOSE_BEFORE', 'RETURNPOOL_BEFORE')) {
    Assert-Contains $eventSource $eventName "Missing project FairyGUI event contract: $eventName"
}

$inputSource = Read-RepoFile 'FairyGUI-cocoscreator-ccc3.0/source/src/event/InputProcessor.ts'
$beforeIndex = $inputSource.IndexOf('FUIEvent.CLICK_BEFORE')
$clickIndex = $inputSource.IndexOf('FUIEvent.CLICK', $beforeIndex + 1)
$lateIndex = $inputSource.IndexOf('FUIEvent.TOUCH_END_LATE', $clickIndex + 1)
if ($beforeIndex -lt 0 -or $clickIndex -lt 0 -or $lateIndex -lt 0 -or -not ($beforeIndex -lt $clickIndex -and $clickIndex -lt $lateIndex)) {
    throw 'Guide input events must dispatch CLICK_BEFORE, CLICK, then TOUCH_END_LATE.'
}

$poolSource = Read-RepoFile 'FairyGUI-cocoscreator-ccc3.0/source/src/GObjectPool.ts'
Assert-Contains $poolSource 'scanAll(' 'Pooled FairyGUI objects must remain discoverable by the texture collector.'
Assert-Contains $poolSource 'RETURNPOOL_BEFORE' 'Returning a pooled object must notify project cleanup listeners.'

$objectSource = Read-RepoFile 'FairyGUI-cocoscreator-ccc3.0/source/src/GObject.ts'
Assert-Contains $objectSource 'DISPOSE_BEFORE' 'Disposal must notify project cleanup listeners before the node is destroyed.'

$listSource = Read-RepoFile 'FairyGUI-cocoscreator-ccc3.0/source/src/GList.ts'
Assert-Contains $listSource 'item.isDisposed' 'Disposed list items must not dispatch click events.'

$viewDispatcher = Read-RepoFile 'project/assets/Script/Kernel/ViewDispatcher.ts'
Assert-Contains $viewDispatcher 'if (skeletonData && skeletonData.uuid)' 'The texture collector must ignore unloaded spine data.'

$logoSource = Read-RepoFile 'project/assets/Script/Views/LyLogo.ts'
Assert-Contains $logoSource '}, name, false);' 'Every real FairyGUI atlas must be loaded instead of creating placeholder packages.'

$compactUiFiles = @(
    'project/assets/Script/Views/LyBuddyChoose.ts',
    'project/assets/Script/Views/LyPet.ts',
    'project/assets/Script/Views/LyPetDevourpet.ts',
    'project/assets/Script/Views/LyPetRefreshBuff.ts',
    'project/assets/Script/Views/LyPetTisp.ts'
)
foreach ($relativePath in $compactUiFiles) {
    $content = Read-RepoFile $relativePath
    Assert-NotContains $content 'petTransferProgress' "Transfer progress text must not be injected into compact controls: $relativePath"
}

Assert-NotContains (Read-RepoFile 'project/assets/Script/Kernel/UtilsUI.ts') 'petBuffLevel' 'Shared skill cards must keep their original compact level label.'
Assert-NotContains (Read-RepoFile 'project/assets/Script/Views/LyPetRefreshBuff.ts') 'petBuffLevel' 'Wash skill cards must keep their original compact level label.'

$runtimeBundle = Read-RepoFile 'FairyGUI-cocoscreator-ccc3.0/source/dist/fairygui.mjs'
foreach ($runtimeMarker in @(
    'fui_click_before',
    'fui_touch_end_late',
    'fui_dispose_before',
    'fui_returnpool_before',
    'scanAll(callback)',
    'item.isDisposed',
    'if (!this._label)',
    'SPRITE_STENCIL',
    'freeSpine'
)) {
    Assert-Contains $runtimeBundle $runtimeMarker "Generated FairyGUI runtime is missing: $runtimeMarker"
}

Write-Output 'FairyGUI stable runtime contract passed.'
