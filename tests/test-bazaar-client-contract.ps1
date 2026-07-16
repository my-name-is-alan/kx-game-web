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

$protocol = Get-Content -Raw (Join-Path $root "project/tools/common/protos/activityProto.lua")
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
Assert-Match $shop 'activityShop\s*&&\s*activityShop\.policyVersion' "dynamic snapshot is not guarded by activityShop.policyVersion"
Assert-Match $shop 'activityShop\.policyItems' "dynamic unit item count is not read from activityShop.policyItems"
Assert-Match $shop 'directPolicyItem\s*&&\s*Number\(directPolicyItem\.entryId\)\s*==\s*id' "keyed policy lookup does not verify the entry id"
Assert-Match $shop 'remainingOrderItems\s*/\s*unitItemCount' "dynamic selectable groups do not use the server policy unit"
Assert-Match $shop 'currentPaymentKind' "current payment kind is not read"
Assert-Match $shop 'remainingOrderItems' "remaining order items are not read"
Assert-Match $shop 'nextTierBoundary' "next tier boundary is not read"
Assert-Match $shop '支付：' "list does not display current payment kind"
Assert-Match $shop '剩余额度：' "list does not display remaining quota"
Assert-Match $shop '下一阶梯：' "list does not display the next tier"
Assert-Match $shop 'if\s*\(!isDynamicBazaar\)' "legacy bazaar fallback branch is missing"
Assert-Match $shop 'mode\s*==\s*2' "legacy voucher mode is no longer supported"

Assert-Match $buy '"bazaarQuotePurchase"' "quantity selection does not request bazaarQuotePurchase"
Assert-Match $buy 'quoteRequestSequence' "quote responses are not sequenced"
Assert-Match $buy 'requestSequence\s*!==\s*quoteRequestSequence' "stale quote responses are not ignored"
foreach ($field in @("moneyCost", "stoneCost", "voucherCost", "actualItems")) {
    Assert-Match $buy $field "authoritative quote field $field is not consumed"
}
Assert-Match $buy 'policyVersion\s*:\s*policyVersion' "dynamic request does not carry policyVersion"
Assert-Match $buy 'isDynamicBazaar\s*\?\s*"shopBuy"' "dynamic purchase is not routed through shopBuy"
Assert-Match $buy 'currentPaymentKind\s*==\s*"blocked"' "blocked dynamic rows are not disabled"
Assert-Match $buy 'btn_buy\.enabled\s*=\s*false' "purchase is not disabled while awaiting a quote"
Assert-Match $buy '坊市配置已更新，请重新登录' "version mismatch message is missing"
Assert-NotMatch $buy '(?i)retryBazaar|bazaarRetry' "version mismatch must not retry"
Assert-NotMatch $buy '\b(price|trustedPrice|clientPrice)\s*:' "purchase payload contains a client-trusted price"
Assert-Match $buy '"bazaarVoucherBuy"' "legacy voucher purchase route was removed"

$quoteCalls = [regex]::Matches($buy, '"bazaarQuotePurchase"').Count
if ($quoteCalls -ne 1) {
    throw "bazaarQuotePurchase must have one send site and no automatic retry path; found $quoteCalls"
}

Write-Output "BAZAAR_CLIENT_CONTRACT_OK"
