$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repo = Split-Path -Parent $PSScriptRoot
$vendor = Join-Path $repo 'FairyGUI-cocoscreator-ccc3.0/source/src'
$pointRedPath = Join-Path $repo 'project/assets/Script/Kernel/PointRedData.ts'

function Fail([string]$Message) {
    throw "[point red disposal contract] $Message"
}

function Assert-Contains([string]$Text, [string]$Needle, [string]$Label) {
    if (-not $Text.Contains($Needle, [StringComparison]::Ordinal)) {
        Fail "$Label is missing '$Needle'"
    }
}

function Assert-Ordered([string]$Text, [string]$First, [string]$Second, [string]$Label) {
    $firstAt = $Text.IndexOf($First, [StringComparison]::Ordinal)
    $secondAt = $Text.IndexOf($Second, [StringComparison]::Ordinal)
    if ($firstAt -lt 0 -or $secondAt -lt 0 -or $secondAt -le $firstAt) {
        Fail "$Label must keep '$First' before '$Second'"
    }
}

$eventText = Get-Content -Raw -LiteralPath (Join-Path $vendor 'event/Event.ts')
Assert-Contains $eventText 'public static DISPOSE_BEFORE: string = "fui_dispose_before"' 'FairyGUI event contract'
Assert-Contains $eventText 'public static RETURNPOOL_BEFORE: string = "fui_returnpool_before"' 'FairyGUI event contract'

$gObjectText = Get-Content -Raw -LiteralPath (Join-Path $vendor 'GObject.ts')
Assert-Contains $gObjectText 'n.emit(FUIEvent.DISPOSE_BEFORE);' 'GObject disposal lifecycle'
Assert-Ordered $gObjectText 'n.emit(FUIEvent.DISPOSE_BEFORE);' 'this._node = null;' 'GObject disposal lifecycle'

$poolText = Get-Content -Raw -LiteralPath (Join-Path $vendor 'GObjectPool.ts')
Assert-Contains $poolText 'obj.node.emit(Event.RETURNPOOL_BEFORE);' 'GObjectPool return lifecycle'
Assert-Ordered $poolText 'obj.node.emit(Event.RETURNPOOL_BEFORE);' 'arr.push(obj);' 'GObjectPool return lifecycle'

$pointRedText = Get-Content -Raw -LiteralPath $pointRedPath
Assert-Contains $pointRedText 'const attach = child.attach;' 'PointRedData stale attachment cleanup'
Assert-Contains $pointRedText 'child.attach = undefined;' 'PointRedData stale attachment cleanup'
Assert-Contains $pointRedText 'if (attach.gObject.isDisposed)' 'PointRedData stale attachment cleanup'
Assert-Ordered $pointRedText 'child.attach = undefined;' 'if (attach.gObject.isDisposed)' 'PointRedData stale attachment cleanup'
Assert-Ordered $pointRedText 'if (attach.gObject.isDisposed)' 'attach.gObject.off' 'PointRedData stale attachment cleanup'

$distText = Get-Content -Raw -LiteralPath (Join-Path (Split-Path -Parent $vendor) 'dist/fairygui.mjs')
Assert-Contains $distText 'Event.DISPOSE_BEFORE = "fui_dispose_before"' 'distributed FairyGUI lifecycle'
Assert-Contains $distText 'Event.RETURNPOOL_BEFORE = "fui_returnpool_before"' 'distributed FairyGUI lifecycle'
Assert-Contains $distText 'n.emit(Event.DISPOSE_BEFORE);' 'distributed FairyGUI lifecycle'
Assert-Contains $distText 'obj.node.emit(Event.RETURNPOOL_BEFORE);' 'distributed FairyGUI lifecycle'

Write-Output 'POINT_RED_DISPOSAL_CONTRACT_OK'
