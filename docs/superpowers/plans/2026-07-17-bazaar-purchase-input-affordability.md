# Bazaar Purchase Input and Affordability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the dynamic bazaar purchase dialog support exact large-quantity entry and show red insufficient-currency feedback before purchase.

**Architecture:** Keep the existing server-authoritative quote flow and legacy shop branch intact. Add small pure helpers for count normalization and quote affordability, then layer a programmatic FairyGUI numeric input and maximum shortcut over the existing dynamic dialog so no binary UI package edit is required.

**Tech Stack:** Cocos Creator 3.8.1, TypeScript, FairyGUI (`fairygui-cc`), PowerShell contract tests.

---

### Task 1: Lock the new interaction contract with failing tests

**Files:**
- Modify: `tests/test-bazaar-client-contract.ps1`
- Test: `tests/test-bazaar-client-contract.ps1`

- [ ] **Step 1: Add assertions for exact input, maximum selection, count normalization, and affordability**

Append these assertions before the final success output:

```powershell
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
```

- [ ] **Step 2: Run the contract test and verify RED**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-bazaar-client-contract.ps1
```

Expected: FAIL with `dynamic purchase count input is missing` because the dialog has no numeric input yet.

- [ ] **Step 3: Commit the failing contract**

```powershell
git add -- tests/test-bazaar-client-contract.ps1 docs/superpowers/plans/2026-07-17-bazaar-purchase-input-affordability.md
git commit -m "test: cover bazaar purchase quantity feedback"
```

### Task 2: Add exact quantity controls without changing the legacy dialog

**Files:**
- Modify: `project/assets/Script/Views/LyActivityShopBuy.ts`
- Test: `tests/test-bazaar-client-contract.ps1`

- [ ] **Step 1: Add the count normalization helper**

Add a pure exported helper near the bottom of `LyActivityShopBuy.ts`:

```typescript
export function normalizeBazaarPurchaseCount(value:any, maxCount:any):number {
    let normalizedMaxCount = Math.max(Math.floor(Number(maxCount) || 0), 1);
    let count = Math.floor(Number(value));
    if (!Number.isFinite(count) || count < 1) count = 1;
    return Math.min(count, normalizedMaxCount);
}
```

- [ ] **Step 2: Create dynamic-only numeric input and maximum shortcut**

Import `Color` and `EditBox` from `cc`. When `isDynamicBazaar` is true, hide the old `label_num`, center a new `GTextField` title, `GGraph` input background, `GTextInput`, and `GGraph`/`GTextField` maximum shortcut in the old label row. Configure the input as:

```typescript
quantityInput = new fgui.GTextInput();
quantityInput.name = "bazaar_count_input";
quantityInput.singleLine = true;
quantityInput.maxLength = 10;
quantityInput._editBox.inputMode = EditBox.InputMode.NUMERIC;
quantityInput.align = fgui.AlignType.Center;
quantityInput.verticalAlign = fgui.VertAlignType.Middle;
```

Name the maximum graph `bazaar_btn_max`, render its caption as `最大`, and leave every new object absent in the non-dynamic branch.

- [ ] **Step 3: Route all count changes through one update function**

Create `applySelectedCount(raw:any)` after the slider maximum is known. It must call `normalizeBazaarPurchaseCount`, synchronize slider and input text under a recursion guard, then call the existing `onValueChange` once. Bind slider, `-1`, `+1`, text changes, submit, and the maximum graph to this function.

For an empty input, invalidate the current quote, increment `quoteRequestSequence`, set `lastRequestedQuoteCount = -1`, disable purchase, and display `请输入数量`. For non-digit pasted text, strip all non-digits before applying the value. This prevents illegal quote and purchase payloads while allowing direct entry of large numbers.

- [ ] **Step 4: Run the contract test**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-bazaar-client-contract.ps1
```

Expected: the input assertions pass; affordability assertions may still fail until Task 3.

### Task 3: Evaluate live balances on every authoritative quote

**Files:**
- Modify: `project/assets/Script/Views/LyActivityShopBuy.ts`
- Test: `tests/test-bazaar-client-contract.ps1`

- [ ] **Step 1: Add a pure affordability helper**

Add these types and helper:

```typescript
export interface BazaarQuoteBalances {
    money:number,
    stone:number,
    voucher:number,
}

export interface BazaarQuoteAffordability {
    affordable:boolean,
    insufficientKinds:string[],
}

export function getBazaarQuoteAffordability(quote:any, balances:BazaarQuoteBalances):BazaarQuoteAffordability {
    let insufficientKinds:string[] = [];
    let valid = quote != null;
    let compare = (kind:string, rawCost:any, rawBalance:any):void => {
        let cost = Number(rawCost || 0);
        let balance = Number(rawBalance || 0);
        if (!Number.isFinite(cost) || cost < 0 || !Number.isFinite(balance)) {
            valid = false;
        } else if (cost > balance) {
            insufficientKinds.push(kind);
        }
    };
    compare("money", quote && quote.moneyCost, balances.money);
    compare("stone", quote && quote.stoneCost, balances.stone);
    compare("voucher", quote && quote.voucherCost, balances.voucher);
    return { affordable:valid && insufficientKinds.length == 0, insufficientKinds:insufficientKinds };
}
```

- [ ] **Step 2: Read current balances only when a quote returns**

In the successful quote callback, build balances from `GameServerData`:

```typescript
let affordability = getBazaarQuoteAffordability(quote, {
    money:Number(GameServerData.getInstance().getValueTypeCount(VarVal.bonusType.money)) || 0,
    stone:Number(GameServerData.getInstance().getValueTypeCount(VarVal.bonusType.stone)) || 0,
    voucher:Number(GameServerData.getInstance().getValueTypeCount(VarVal.bonusType.chance)) || 0,
});
```

Use the latest player data here instead of the dialog-open snapshot so a balance change while the dialog is open is reflected.

- [ ] **Step 3: Render the pre-purchase state**

When affordable, keep the current icon quote and enable purchase. When not affordable, append `  货币不足`, set the dynamic quote color with `UtilsUI.getEnoughColor(false)`, leave `quoteReady` false, and set:

```typescript
btn_buy.enabled = affordability.affordable;
```

Loading and normal success states restore the normal label color. The existing purchase request remains unchanged and still performs server-side validation.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-bazaar-client-contract.ps1
```

Expected: `BAZAAR_CLIENT_CONTRACT_OK`.

- [ ] **Step 5: Commit the implementation**

```powershell
git add -- project/assets/Script/Views/LyActivityShopBuy.ts tests/test-bazaar-client-contract.ps1
git commit -m "fix: improve bazaar purchase quantity feedback"
```

### Task 4: Verify the narrow change and prepare user testing

**Files:**
- Verify: `project/assets/Script/Views/LyActivityShopBuy.ts`
- Verify: `tests/test-bazaar-client-contract.ps1`

- [ ] **Step 1: Run focused and adjacent regression contracts**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-bazaar-client-contract.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-mail-click-race-contract.ps1
```

Expected: `BAZAAR_CLIENT_CONTRACT_OK` and `MAIL_CLICK_RACE_CONTRACT_OK`.

- [ ] **Step 2: Inspect the exact diff and dirty-worktree boundary**

```powershell
git diff HEAD~2 -- project/assets/Script/Views/LyActivityShopBuy.ts tests/test-bazaar-client-contract.ps1 docs/superpowers/plans/2026-07-17-bazaar-purchase-input-affordability.md
git status --short --branch
```

Expected: only the planned bazaar files are in the two new commits; pre-existing changes to `ViewDispatcher.ts`, `package.json`, Cocos settings, and the font-refresh contract remain untouched.

- [ ] **Step 3: Ask the user to perform browser verification**

Ask the user to check: direct entry of a large valid quantity; empty/zero/over-limit input; maximum shortcut; slider and ±1 synchronization; red `货币不足` and disabled purchase; sufficient balance purchase success; rapid count changes showing only the newest quote.
