$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot

function Assert-Match {
    param([string]$Text, [string]$Pattern, [string]$Message)
    if ($Text -notmatch $Pattern) {
        throw $Message
    }
}

function Assert-NotMatch {
    param([string]$Text, [string]$Pattern, [string]$Message)
    if ($Text -match $Pattern) {
        throw $Message
    }
}

function Get-ProtocolRequest {
    param([string]$Protocol, [string]$Name)
    $match = [regex]::Match(
        $Protocol,
        "(?ms)^$([regex]::Escape($Name))\s+%d\s*\{\s*request\s*\{(?<request>.*?)\}\s*response\s*\{"
    )
    if (-not $match.Success) {
        throw "protocol request $Name is missing"
    }
    return $match.Groups["request"].Value
}

$activityProtocol = Get-Content -Raw (Join-Path $root "project/tools/common/protos/activityProto.lua")
$bazaarProtocolPath = Join-Path $root "project/tools/common/protos/bazaarProto.lua"
if (-not (Test-Path -LiteralPath $bazaarProtocolPath -PathType Leaf)) { throw "bazaarProto.lua is missing" }
$bazaarProtocol = Get-Content -Raw $bazaarProtocolPath
$protocol = $activityProtocol + "`n" + $bazaarProtocol
$parser = Get-Content -Raw (Join-Path $root "project/tools/common/protos/parser.lua")
$shop = Get-Content -Raw (Join-Path $root "project/assets/Script/Views/LyActivityShop.ts")
$buy = Get-Content -Raw (Join-Path $root "project/assets/Script/Views/LyActivityShopBuy.ts")

foreach ($type in @("bazaarTier", "bazaarQuoteSegment", "bazaarQuote", "bazaarState")) {
    Assert-Match $protocol "(?m)^\.$type\s*\{" "client protocol type .$type is missing"
}
Assert-Match $protocol '(?ms)^\.activityShop\s*\{.*?policyVersion\s+1\s*:\s*string.*?policyItems\s+2\s*:' "activityShop dynamic snapshot fields are missing"
foreach ($field in @("currentPaymentKind", "remainingOrderItems", "nextTierBoundary", "quote")) {
    Assert-Match $protocol "(?m)^\s*$field\s+\d+\s*:" "client protocol shop field $field is missing"
}
Assert-Match $protocol '(?m)^bazaarQuotePurchase\s+%d\s*\{' "bazaarQuotePurchase protocol is missing"
Assert-NotMatch $activityProtocol '(?m)^bazaarQuotePurchase\s+%d\s*\{' "append-only Bazaar request must not renumber activity protocols"
Assert-Match $parser 'table\.insert\(protoFiles, "hdhiveProto"\)\s*table\.insert\(protoFiles, "bazaarProto"\)' "Bazaar protocol must be appended after every existing protocol module"

foreach ($requestName in @("bazaarQuotePurchase", "shopBuy", "bazaarVoucherBuy")) {
    $request = Get-ProtocolRequest $protocol $requestName
    foreach ($field in @("id", "num", "policyVersion")) {
        Assert-Match $request "(?m)^\s*$field\s+\d+\s*:" "$requestName request field $field is missing"
    }
    Assert-NotMatch $request '(?im)^\s*(price|cost|quote|moneyCost|stoneCost|voucherCost)\s+\d+\s*:' "$requestName request trusts a client price"
}

foreach ($field in @("isDynamicBazaar", "policyVersion", "unitItemCount", "currentPaymentKind", "remainingOrderItems", "nextTierBoundary", "quote")) {
    Assert-Match $shop "$field\s*:" "ShopBuyData.$field is missing"
}
foreach ($kind in @("original", "money", "stone", "voucher", "blocked")) {
    Assert-Match $shop "[`"']$kind[`"']" "client payment kind $kind is unsupported"
}
Assert-Match $shop 'typeof activityShop\.policyVersion != "string"' "dynamic snapshot is not guarded by a typed activityShop.policyVersion"
Assert-Match $shop 'activityShop\.policyItems' "dynamic unit item count is not read from activityShop.policyItems"
Assert-Match $shop 'isCompleteBazaarSnapshot' "partial dynamic snapshots are not rejected"
Assert-Match $shop 'policyItem\.enabled' "dynamic mode does not require an explicit item policy"
Assert-Match $shop 'policyItem\.paymentKind' "dynamic mode does not verify the matching payment kind"
Assert-Match $shop 'directPolicyItem\s*&&\s*Number\(directPolicyItem\.entryId\)\s*==\s*id' "keyed policy lookup does not verify the entry id"
Assert-Match $shop 'remainingOrderItems\s*/\s*unitItemCount' "dynamic selectable groups do not use the server policy unit"
Assert-Match $shop 'currentPaymentKind' "current payment kind is not read"
Assert-Match $shop 'remainingOrderItems' "remaining order items are not read"
Assert-Match $shop 'nextTierBoundary' "next tier boundary is not read"
foreach ($source in @($shop, $buy)) {
    Assert-NotMatch $source 'new fgui\.GRichTextField\(\)' "dynamic Bazaar quote must not construct GRichTextField"
    Assert-NotMatch $source 'ubbEnabled\s*=\s*true' "dynamic Bazaar quote must not enable UBB images"
    Assert-NotMatch $source '\[img\]' "dynamic Bazaar quote must not emit rich-text images"
}
Assert-Match $shop 'getBazaarQuoteCurrencies' "dynamic quote currencies are not normalized"
Assert-Match $shop 'new fgui\.GLoader\(\)' "dynamic quote does not use FairyGUI loaders"
Assert-Match $shop 'loader\.url\s*=\s*UtilsUI\.getItemIconUrl\(part\.type\)' "dynamic quote loaders do not reuse currency icons"
Assert-Match $shop 'renderBazaarQuoteView' "shop cards do not render the shared loader quote view"
Assert-Match $buy 'renderBazaarQuoteView' "purchase dialog does not render the shared loader quote view"
Assert-Match $shop 'if\s*\(amount\s*>\s*0\)' "zero-cost currencies are not omitted"
Assert-Match $shop '"免费"' "free Bazaar quotes are not represented"
Assert-Match $shop 'label_limit\.visible\s*=\s*false' "dynamic card limit row is still visible"
foreach ($phrase in @("支付：", "剩余额度：", "下一阶梯：")) {
    Assert-NotMatch $shop ([regex]::Escape($phrase)) "dynamic cards still render $phrase"
}
Assert-Match $shop 'if\s*\(!isDynamicBazaar\)' "legacy bazaar fallback branch is missing"
Assert-Match $shop 'mode\s*==\s*2' "legacy voucher mode is no longer supported"

Assert-Match $buy '"bazaarQuotePurchase"' "quantity selection does not request bazaarQuotePurchase"
Assert-Match $buy 'quoteRequestSequence' "quote responses are not sequenced"
Assert-Match $buy 'requestSequence\s*!==\s*quoteRequestSequence' "stale quote responses are not ignored"
foreach ($field in @("moneyCost", "stoneCost", "voucherCost", "actualItems")) {
    Assert-Match ($shop + "`n" + $buy) $field "authoritative quote field $field is not consumed"
}
Assert-Match $buy 'policyVersion\s*:\s*policyVersion' "dynamic request does not carry policyVersion"
Assert-Match $buy 'isDynamicBazaar\s*\?\s*"shopBuy"' "dynamic purchase is not routed through shopBuy"
Assert-Match $buy 'currentPaymentKind\s*==\s*"blocked"' "blocked dynamic rows are not disabled"
Assert-Match $buy 'btn_buy\.enabled\s*=\s*false' "purchase is not disabled while awaiting a quote"
Assert-Match $buy '坊市配置已更新，请重新登录' "version mismatch message is missing"
Assert-Match $buy 'policyMismatchLatched' "version mismatch is not terminal for the dialog"
Assert-Match $buy 'if \(policyMismatchLatched\) return' "stale policy continues sending quote or purchase requests"
Assert-Match $buy 'formatBazaarError' "protocol errors are not mapped to user-facing messages"
Assert-NotMatch $buy '"灵石"\s*\+\s*moneyCost' "purchase quote still spells out currencies"
Assert-NotMatch $buy 'UtilsUI\.showMsgTip\(args\.bazaarError\)' "raw internal Bazaar error codes leak to players"
Assert-NotMatch $buy '(?i)retryBazaar|bazaarRetry' "version mismatch must not retry"
Assert-NotMatch $buy '\b(price|trustedPrice|clientPrice)\s*:' "purchase payload contains a client-trusted price"
Assert-Match $buy '"bazaarVoucherBuy"' "legacy voucher purchase route was removed"
Assert-Match $buy 'new fgui\.GTextInput\(\)' "dynamic purchase count input is missing"
Assert-Match $buy 'EditBox\.InputMode\.NUMERIC' "dynamic purchase input does not open a numeric keyboard"
Assert-Match $buy 'fgui\.Event\.TEXT_CHANGE' "typed purchase quantities are not observed"
Assert-Match $buy 'bazaar_btn_max' "dynamic purchase maximum shortcut is missing"
Assert-Match $buy 'normalizeBazaarPurchaseCount' "purchase quantities are not normalized"
Assert-Match $buy 'Math\.min\([^\r\n]*maxCount' "purchase quantities are not capped at the server maximum"
Assert-Match $buy 'getBazaarQuoteAffordability' "dynamic quote affordability is not evaluated"
foreach ($type in @('money', 'stone', 'chance')) {
    Assert-Match $buy "getValueTypeCount\(VarVal\.bonusType\.$type\)" "dynamic quote does not read the live $type balance"
}
Assert-Match $buy '货币不足' "insufficient currency feedback is missing"
Assert-Match $buy 'btn_buy\.enabled\s*=\s*affordability\.affordable' "insufficient quotes do not disable purchase"

$quoteCalls = [regex]::Matches($buy, '"bazaarQuotePurchase"').Count
if ($quoteCalls -ne 1) {
    throw "bazaarQuotePurchase must have one send site and no automatic retry path; found $quoteCalls"
}

Write-Output "BAZAAR_CLIENT_CONTRACT_OK"
