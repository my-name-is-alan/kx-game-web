$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$vendorRoot = Join-Path $repoRoot 'FairyGUI-cocoscreator-ccc3.0/source'
$targets = @(
    'src/GList.ts',
    'build/GList.js',
    'dist/fairygui.mjs'
)

foreach ($target in $targets) {
    $text = Get-Content -Raw -LiteralPath (Join-Path $vendorRoot $target)
    $clickAt = $text.IndexOf('onClickItem(evt', [StringComparison]::Ordinal)
    if ($clickAt -lt 0) {
        throw "$target is missing GList.onClickItem"
    }
    $clickBody = $text.Substring($clickAt, [Math]::Min(420, $text.Length - $clickAt))
    if (-not $clickBody.Contains('if (!this._node)', [StringComparison]::Ordinal) -or
        -not $clickBody.Contains('if (!item || item.isDisposed)', [StringComparison]::Ordinal)) {
        throw "$target does not reject clicks for disposed lists or items"
    }

    $methodAt = $text.IndexOf('dispatchItemEvent(item', [StringComparison]::Ordinal)
    if ($methodAt -lt 0) {
        throw "$target is missing GList.dispatchItemEvent"
    }
    $body = $text.Substring($methodAt, [Math]::Min(260, $text.Length - $methodAt))
    if (-not $body.Contains('if (!this._node)', [StringComparison]::Ordinal)) {
        throw "$target dispatches CLICK_ITEM after the list has been disposed"
    }
}

Write-Output 'FairyGUI disposed-list click contract passed.'
