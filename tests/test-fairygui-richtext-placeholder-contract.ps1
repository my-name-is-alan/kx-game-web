$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$vendorRoot = Join-Path $repoRoot 'FairyGUI-cocoscreator-ccc3.0/source'
$plainTextTargets = @(
    'src/GTextField.ts',
    'build/GTextField.js',
    'dist/fairygui.mjs'
)

foreach ($target in $plainTextTargets) {
    $text = Get-Content -Raw -LiteralPath (Join-Path $vendorRoot $target)
    if (-not $text.Contains('this._label.string = "";', [StringComparison]::Ordinal)) {
        throw "$target must clear the Cocos Label default placeholder during plain-text renderer construction"
    }
}

$richTextTargets = @(
    'src/GRichTextField.ts',
    'build/GRichTextField.js'
)

foreach ($target in $richTextTargets) {
    $text = Get-Content -Raw -LiteralPath (Join-Path $vendorRoot $target)
    if ($text.Contains('addComponent(Label)', [StringComparison]::Ordinal) -or
        $text.Contains('LabelOutline', [StringComparison]::Ordinal) -or
        $text.Contains('_label.string', [StringComparison]::Ordinal)) {
        throw "$target must not create or mutate a plain Cocos Label for rich-text objects"
    }
}

$sourceText = Get-Content -Raw -LiteralPath (Join-Path $vendorRoot 'src/GTextField.ts')
$buildText = Get-Content -Raw -LiteralPath (Join-Path $vendorRoot 'build/GTextField.js')
$distText = Get-Content -Raw -LiteralPath (Join-Path $vendorRoot 'dist/fairygui.mjs')
foreach ($entry in @(
    @{ Name = 'source'; Text = $sourceText },
    @{ Name = 'build'; Text = $buildText },
    @{ Name = 'distribution'; Text = $distText }
)) {
    if (-not $entry.Text.Contains('if (!this._label)', [StringComparison]::Ordinal)) {
        throw "FairyGUI $($entry.Name) must guard Label-only outline and shadow operations for rich text"
    }
    if ($entry.Text.Contains('LabelOutline', [StringComparison]::Ordinal)) {
        throw "FairyGUI $($entry.Name) must not attach Cocos LabelOutline, which creates the visible default 'label' placeholder"
    }
}

Write-Output 'FairyGUI plain/rich text renderer contract passed.'
