# Bazaar Icon Display Hotfix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace overflowing dynamic Bazaar payment text with existing currency icons and numeric totals, while showing no quota or tier text on item cards.

**Architecture:** Add one reusable FairyGUI rich-text control to each dynamic virtual-list card and one to the dynamic purchase dialog. Build their contents only from authoritative quote totals and existing `ui://` currency icons; retain every legacy controller, icon, and label for non-dynamic rows.

**Tech Stack:** Cocos Creator 3.8 TypeScript, FairyGUI `GRichTextField`, PowerShell contract tests.

---

### Task 1: Lock the icon-only display contract

**Files:**
- Modify: `tests/test-bazaar-client-contract.ps1`
- Test: `tests/test-bazaar-client-contract.ps1`

- [ ] **Step 1: Add failing assertions**

Require `GRichTextField`, UBB image markup, existing icon lookup, zero-cost omission, and explicit absence of the three card-limit phrases:

```powershell
Assert-Match $shop 'new fgui\.GRichTextField\(\)' "dynamic list price does not use rich text"
Assert-Match $shop 'ubbEnabled\s*=\s*true' "dynamic quote icons are not enabled"
Assert-Match $shop 'UtilsUI\.getItemIconUrl' "dynamic quote does not reuse currency icons"
Assert-Match $shop '\[img\]' "dynamic quote does not emit icon markup"
foreach ($phrase in @("支付：", "剩余额度：", "下一阶梯：")) {
    Assert-NotMatch $shop ([regex]::Escape($phrase)) "dynamic cards still render $phrase"
}
Assert-Match $buy 'formatBazaarQuoteRichText' "purchase quote does not share icon formatting"
Assert-NotMatch $buy '"灵石"\s*\+\s*moneyCost' "purchase quote still spells out currencies"
```

- [ ] **Step 2: Run the test and verify RED**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-bazaar-client-contract.ps1`

Expected: FAIL because the current list spells out payment/quota/tier text and the purchase dialog spells out all three currencies.

### Task 2: Render authoritative quotes with existing icons

**Files:**
- Modify: `project/assets/Script/Views/LyActivityShop.ts`
- Modify: `project/assets/Script/Views/LyActivityShopBuy.ts`
- Test: `tests/test-bazaar-client-contract.ps1`

- [ ] **Step 1: Add the quote formatter and rich-text factory**

Add public quote formatting that omits zero totals and uses common currency icons:

```typescript
public static formatBazaarQuoteRichText(quote:any):string {
    if (!quote) return "报价中...";
    let parts:Array<string> = [];
    let add = (cost:any, type:any) => {
        let value = Math.max(Math.floor(Number(cost) || 0), 0);
        if (value > 0) parts.push("[img]" + UtilsUI.getItemIconUrl(type) + "[/img]" + value);
    };
    add(quote.moneyCost, VarVal.bonusType.money);
    add(quote.stoneCost, VarVal.bonusType.stone);
    add(quote.voucherCost, VarVal.bonusType.chance);
    return parts.length > 0 ? parts.join("  ") : "免费";
}
```

Create a named `fgui.GRichTextField` once, set `ubbEnabled = true`, position and size it inside the existing component, and reuse it on virtual-list renders.

- [ ] **Step 2: Replace dynamic card text**

For dynamic rows, hide `label_limit`, the original fixed icon nodes, and original price labels; show only the rich-text quote. For legacy rows, hide the rich-text field and restore the original controls. Blocked rows continue through controller `c2` page 2.

- [ ] **Step 3: Replace dynamic dialog quote text**

Create one rich-text row in the purchase dialog. Dynamic loading/error states and successful mixed-currency quotes update that row; legacy mode continues using `loader_icon` and `label_cost` unchanged.

- [ ] **Step 4: Run the contract and verify GREEN**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-bazaar-client-contract.ps1`

Expected: `BAZAAR_CLIENT_CONTRACT_OK`.

- [ ] **Step 5: Commit the Bazaar hotfix**

```powershell
git add -- tests/test-bazaar-client-contract.ps1 project/assets/Script/Views/LyActivityShop.ts project/assets/Script/Views/LyActivityShopBuy.ts docs/superpowers/plans/2026-07-17-bazaar-icon-display-hotfix.md
git diff --cached --check
git commit -m "fix: render bazaar prices with currency icons"
```
