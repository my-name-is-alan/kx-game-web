$ErrorActionPreference = 'Stop'

function Fail([string]$Message) {
    Write-Error $Message
    exit 1
}

$root = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $root 'project/assets/Script/Kernel/ViewDispatcher.ts'
$source = Get-Content -Raw -LiteralPath $sourcePath
$loaderStart = $source.IndexOf('} else if (obj instanceof fgui.GLoader3D) {', [StringComparison]::Ordinal)
$listStart = $source.IndexOf('} else if (obj instanceof fgui.GList)', $loaderStart, [StringComparison]::Ordinal)
if ($loaderStart -lt 0 -or $listStart -le $loaderStart) {
    Fail 'GLoader3D collector branch was not found'
}

$branch = $source.Substring($loaderStart, $listStart - $loaderStart)
$guard = $branch.IndexOf('if (skeletonData && skeletonData.uuid)', [StringComparison]::Ordinal)
$write = $branch.IndexOf('refSpine[skeletonData.uuid] = skeletonData', [StringComparison]::Ordinal)
if ($guard -lt 0 -or $write -lt 0 -or $guard -gt $write) {
    Fail 'GLoader3D collector must guard nullable skeletonData and uuid before recording the Spine asset'
}

Write-Output 'FairyGUI Spine collector contract passed.'
