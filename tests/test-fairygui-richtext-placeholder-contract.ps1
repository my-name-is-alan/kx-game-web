$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$vendorRoot = Join-Path $repoRoot 'FairyGUI-cocoscreator-ccc3.0/source'
$targets = @(
    'src/GRichTextField.ts',
    'build/GRichTextField.js',
    'dist/fairygui.mjs'
)

foreach ($target in $targets) {
    $text = Get-Content -Raw -LiteralPath (Join-Path $vendorRoot $target)
    $renderer = 'this._richText = this._node.addComponent(RichText);'
    $clear = 'this._richText.string = "";'
    $rendererAt = $text.IndexOf($renderer, [StringComparison]::Ordinal)
    $clearAt = $text.IndexOf($clear, [StringComparison]::Ordinal)
    if ($rendererAt -lt 0 -or $clearAt -le $rendererAt -or $clearAt -gt ($rendererAt + 160)) {
        throw "$target does not clear the Cocos RichText placeholder immediately after renderer creation"
    }
}

Write-Output 'FairyGUI RichText placeholder contract passed.'
