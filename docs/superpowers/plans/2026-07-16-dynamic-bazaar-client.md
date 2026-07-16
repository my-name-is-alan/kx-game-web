# Dynamic Bazaar Client Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the activity-shop client consume authoritative dynamic bazaar snapshots, request cross-tier quotes, and submit versioned price-free purchases while retaining legacy behavior.

**Architecture:** Extend the existing shop view model with optional dynamic fields and keep legacy calculations as the fallback. Reuse the existing FairyGUI labels, and keep asynchronous quote sequencing inside the purchase dialog so stale responses cannot authorize a purchase.

**Tech Stack:** Cocos Creator 3.8 TypeScript, FairyGUI, sproto Lua schema, PowerShell contract tests.

---

### Task 1: Add the failing client contract test

**Files:**
- Create: `tests/test-bazaar-client-contract.ps1`
- Read: `project/tools/common/protos/activityProto.lua`
- Read: `project/assets/Script/Views/LyActivityShop.ts`
- Read: `project/assets/Script/Views/LyActivityShopBuy.ts`

- [ ] **Step 1: Write protocol assertions**

Load the protocol as raw text and assert that `.bazaarQuote`, `.bazaarState`, the dynamic `activityShop` fields, and `bazaarQuotePurchase` exist. Extract the request blocks for quote and purchase and assert that they contain only `id`, `num`, and `policyVersion`, with no `price`, `cost`, or `quote` input fields.

```powershell
$protocol = Get-Content -Raw (Join-Path $root "project/tools/common/protos/activityProto.lua")
Assert-Match $protocol '\.activityShop\s*\{[\s\S]*policyVersion\s+1:\s*string' "activityShop policyVersion is missing"
Assert-Match $protocol 'bazaarQuotePurchase\s+%d\s*\{' "bazaarQuotePurchase is missing"
Assert-NotMatch $quoteRequest '(price|cost|quote)\s+\d+\s*:' "quote request trusts a client price"
```

- [ ] **Step 2: Write shop-list assertions**

Assert that `ShopBuyData` includes `isDynamicBazaar`, `policyVersion`, `currentPaymentKind`, `remainingOrderItems`, `nextTierBoundary`, and `quote`; that all five payment kinds are mapped; that the list renders payment, remaining quota, and next-tier text; and that the original `mode`/discount fallback remains.

```powershell
foreach ($field in @("isDynamicBazaar", "policyVersion", "currentPaymentKind", "remainingOrderItems", "nextTierBoundary", "quote")) {
    Assert-Match $shop "${field}\s*:" "ShopBuyData.$field is missing"
}
foreach ($kind in @("original", "money", "stone", "voucher", "blocked")) {
    Assert-Match $shop "[\"']$kind[\"']" "payment kind $kind is unsupported"
}
Assert-Match $shop 'if\s*\(activityShop\s*&&\s*activityShop\.policyVersion' "legacy snapshot guard is missing"
```

- [ ] **Step 3: Write purchase-dialog assertions**

Assert that selection changes invoke `bazaarQuotePurchase`, stale responses compare request sequence numbers, all three total fields are rendered, dynamic purchase sends `policyVersion`, the exact version message exists, blocked mode disables purchase, and there is no retry helper or client price field in a purchase payload.

```powershell
Assert-Match $buy '"bazaarQuotePurchase"' "selection does not request a quote"
Assert-Match $buy 'requestSequence\s*!==\s*quoteRequestSequence' "stale quote responses are not ignored"
foreach ($field in @("moneyCost", "stoneCost", "voucherCost")) {
    Assert-Match $buy $field "quote total $field is not rendered"
}
Assert-Match $buy '坊市配置已更新，请重新登录' "version mismatch message is missing"
Assert-NotMatch $buy '(?i)retryBazaar|bazaarRetry' "version mismatch must not retry"
```

- [ ] **Step 4: Run the test and verify RED**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-bazaar-client-contract.ps1`

Expected: FAIL because the client protocol copy does not yet contain `bazaarQuotePurchase` and the TypeScript files do not expose dynamic behavior.

### Task 2: Synchronize the authoritative protocol

**Files:**
- Modify: `project/tools/common/protos/activityProto.lua`
- Source only: `../server_release/common/protos/activityProto.lua`

- [ ] **Step 1: Verify the server schema is ready**

Run:

```powershell
rg -n "\.bazaarQuote|currentPaymentKind|policyVersion|bazaarQuotePurchase" ..\server_release\common\protos\activityProto.lua
```

Expected: definitions for the dynamic snapshot, versioned purchase, and read-only quote RPC.

- [ ] **Step 2: Copy the schema byte-for-byte**

Run:

```powershell
Copy-Item -LiteralPath ..\server_release\common\protos\activityProto.lua -Destination project\tools\common\protos\activityProto.lua -Force
```

- [ ] **Step 3: Verify exact synchronization**

Run:

```powershell
$server = (Get-FileHash ..\server_release\common\protos\activityProto.lua -Algorithm SHA256).Hash
$client = (Get-FileHash project\tools\common\protos\activityProto.lua -Algorithm SHA256).Hash
if ($server -ne $client) { throw "protocol copy differs" }
```

- [ ] **Step 4: Re-run the contract test**

Expected: FAIL on the first missing TypeScript dynamic-contract assertion, proving the schema portion is now green while implementation remains red.

### Task 3: Implement dynamic list snapshot rendering

**Files:**
- Modify: `project/assets/Script/Views/LyActivityShop.ts`
- Test: `tests/test-bazaar-client-contract.ps1`

- [ ] **Step 1: Extend the view model**

Add the dynamic snapshot fields while retaining all existing legacy fields:

```typescript
isDynamicBazaar:boolean,
policyVersion:string,
currentPaymentKind:string,
remainingOrderItems:number,
nextTierBoundary:number,
quote:any,
```

- [ ] **Step 2: Add pure display helpers**

Add helpers that normalize the supported kinds and format payment, quota, boundary, and quote text. Unknown kinds normalize to `blocked`; quote totals come only from `moneyCost`, `stoneCost`, and `voucherCost`.

```typescript
public static normalizeBazaarPaymentKind(kind:any):string
public static formatBazaarPaymentKind(kind:string):string
public static formatBazaarQuote(quote:any):string
```

- [ ] **Step 3: Read dynamic snapshot with a legacy guard**

In `getShopBuyData`, capture `activityShop.policyVersion`, then treat the matching shop row as dynamic only when the version is non-empty and `currentPaymentKind` is present. For dynamic rows, compute selectable groups as `floor(remainingOrderItems / shopItem.count)` and carry `quote` and `nextTierBoundary`; otherwise leave the existing mode/discount/voucher path intact.

- [ ] **Step 4: Render the existing controls**

For dynamic rows, use `label_limit` for payment/quota/boundary, existing price labels for the snapshot quote, and hide the buy action for `blocked` or zero complete groups. Legacy rows continue through the original controllers and strings.

- [ ] **Step 5: Pass the captured snapshot into the dialog**

Keep `showLyActivityShopBuy(shopItem, maxCount, doneCall)` source-compatible and add the current `shopData` to its view params so the dialog uses the same policy version the list displayed.

- [ ] **Step 6: Run the contract test**

Expected: FAIL on purchase-dialog quote behavior only.

### Task 4: Implement authoritative quote and purchase flow

**Files:**
- Modify: `project/assets/Script/Views/LyActivityShopBuy.ts`
- Test: `tests/test-bazaar-client-contract.ps1`

- [ ] **Step 1: Select the display currency without trusting it for settlement**

Map `money` to `VarVal.bonusType.money`, `voucher` to `chance`, and `original`/`stone` to `stone`. Dynamic slider maximum comes from `params.maxCount`, not local balances, because a quote can cross currencies.

- [ ] **Step 2: Add sequenced quote requests**

On every effective quantity change, increment `quoteRequestSequence`, disable buy, display `报价中...`, and send:

```typescript
GameServer.getInstance().send(callback, "bazaarQuotePurchase", {
    id: Number(params.shopItem.id),
    num: selectedCount,
    policyVersion: policyVersion
});
```

Ignore callbacks whose local sequence is not the latest sequence. On success, render `moneyCost`, `stoneCost`, and `voucherCost`, update reward quantity from `actualItems`, mark the quote ready, and re-enable buy.

- [ ] **Step 3: Handle blocked and version mismatch**

Blocked snapshots never quote or purchase. A `BAZAAR_POLICY_VERSION_MISMATCH` or differing response version displays exactly `坊市配置已更新，请重新登录`, leaves buy disabled, and returns without another send.

- [ ] **Step 4: Send versioned price-free purchases**

Dynamic purchases always use `shopBuy` so a single selection can span payment kinds. Send only:

```typescript
{ id: Number(params.shopItem.id), num: slider_count.value, policyVersion: policyVersion }
```

Keep the existing legacy `shopBuy`/`bazaarVoucherBuy` selection and two-field payload unchanged when no dynamic snapshot exists.

- [ ] **Step 5: Run the contract test and verify GREEN**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-bazaar-client-contract.ps1`

Expected: `BAZAAR_CLIENT_CONTRACT_OK` and exit code 0.

### Task 5: Full verification and commit

**Files:**
- Verify all files changed by Tasks 1-4 and this plan.

- [ ] **Step 1: Run all PowerShell client contract tests**

Run:

```powershell
Get-ChildItem tests\test-*-contract.ps1 | ForEach-Object {
    & powershell -NoProfile -ExecutionPolicy Bypass -File $_.FullName
    if ($LASTEXITCODE -ne 0) { throw "contract failed: $($_.Name)" }
}
```

Expected: every script exits 0.

- [ ] **Step 2: Run repository-available TypeScript/project validation**

Discover the checked-in TypeScript configuration or Cocos validation command. Run the narrowest available compile check that does not regenerate assets; if none is present, record that constraint and rely on contract tests plus source inspection.

- [ ] **Step 3: Verify scope and whitespace**

Run:

```powershell
git diff --check
git status --short
git diff -- project/tools/common/protos/activityProto.lua project/assets/Script/Views/LyActivityShop.ts project/assets/Script/Views/LyActivityShopBuy.ts tests/test-bazaar-client-contract.ps1
```

Expected: the diff for this task contains only the approved client files, test, and plan. Unrelated concurrent workspace edits may remain visible in `git status` but are not staged, modified, or reverted by this task. No FairyGUI resource or companion-transfer file is changed.

- [ ] **Step 4: Commit only the approved files**

Run:

```powershell
git add -- docs/superpowers/plans/2026-07-16-dynamic-bazaar-client.md tests/test-bazaar-client-contract.ps1 project/tools/common/protos/activityProto.lua project/assets/Script/Views/LyActivityShop.ts project/assets/Script/Views/LyActivityShopBuy.ts
git diff --cached --check
git commit -m "feat: support dynamic bazaar pricing"
```

- [ ] **Step 5: Verify the resulting commit**

Run: `git status --short --branch; git show --stat --oneline --decorate HEAD`

Expected: one implementation commit containing only the approved dynamic-bazaar files and plan. The worktree may remain dirty only because of unrelated concurrent edits that were deliberately left untouched.
