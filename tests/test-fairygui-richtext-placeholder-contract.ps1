$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$vendorRoot = Join-Path $repoRoot 'FairyGUI-cocoscreator-ccc3.0/source'
$targets = @(
    'src/GTextField.ts',
    'build/GTextField.js',
    'src/GRichTextField.ts',
    'build/GRichTextField.js',
    'dist/fairygui.mjs'
)

foreach ($target in $targets) {
    $text = Get-Content -Raw -LiteralPath (Join-Path $vendorRoot $target)
    if ($text.Contains('this._label.string = "";', [StringComparison]::Ordinal) -or
        $text.Contains('this._richText.string = "";', [StringComparison]::Ordinal)) {
        throw "$target writes an empty renderer string during construction and can overwrite the package text on Cocos 3.8"
    }
}

Write-Output 'FairyGUI text renderer construction contract passed.'
