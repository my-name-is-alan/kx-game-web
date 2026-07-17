# Bazaar Currency Loader Hotfix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace timing-sensitive Bazaar rich-text currency images with FairyGUI loaders that survive cold online atlas loading without changing pricing or purchase behavior.

**Architecture:** Keep the server-authoritative quote and affordability flow unchanged. Add one reusable programmatic quote view made from `GComponent`, `GLoader`, and `GTextField`; both the shop cards and purchase dialog render normalized quote parts through that view, while loading, free, and insufficient states remain ordinary text.

**Tech Stack:** Cocos Creator 3.8.1, TypeScript, FairyGUI (`fairygui-cc`), PowerShell contract tests.

---

### Task 1: Lock the safe currency-rendering contract

**Files:**
- Modify: `tests/test-bazaar-client-contract.ps1`
- Test: `tests/test-bazaar-client-contract.ps1`

- [ ] **Step 1: Replace the rich-text assertions with loader assertions**

Replace the existing rich-text assertions with:

```powershell
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
```

Remove these now-invalid assertions:

```powershell
Assert-Match $shop 'new fgui\.GRichTextField\(\)' "dynamic list price does not use rich text"
Assert-Match $shop 'ubbEnabled\s*=\s*true' "dynamic quote icons are not enabled"
Assert-Match $shop '\[img\]' "dynamic quote does not emit icon markup"
Assert-Match $buy 'formatBazaarQuoteRichText' "purchase quote does not share icon formatting"
```

- [ ] **Step 2: Run the focused contract and verify RED**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-bazaar-client-contract.ps1
```

Expected: FAIL with `dynamic Bazaar quote must not construct GRichTextField` because both current Bazaar views still construct rich-text fields.

- [ ] **Step 3: Commit the failing contract**

```powershell
git add -- tests/test-bazaar-client-contract.ps1 docs/superpowers/plans/2026-07-17-bazaar-currency-loader-hotfix.md
git commit -m "test: reject bazaar rich-text currency images"
```

### Task 2: Add the reusable loader-backed quote view

**Files:**
- Modify: `project/assets/Script/Views/LyActivityShop.ts`
- Test: `tests/test-bazaar-client-contract.ps1`

- [ ] **Step 1: Add the normalized quote types**

Add near the existing Bazaar interfaces:

```typescript
export interface BazaarQuoteCurrency {
    type:any,
    amount:number,
}

export interface BazaarQuoteViewOptions {
    name:string,
    x:number,
    y:number,
    width:number,
    height:number,
    fontSize:number,
    feedbackHeight?:number,
}
```

- [ ] **Step 2: Replace the rich-text formatter with pure normalization**

Delete `formatBazaarQuoteRichText` and add:

```typescript
public static getBazaarQuoteCurrencies(quote:any):Array<BazaarQuoteCurrency> {
    if (!quote) return [];
    let parts:Array<BazaarQuoteCurrency> = [];
    let addCurrency = (rawAmount:any, type:any):void => {
        let amount = Math.max(Math.floor(Number(rawAmount) || 0), 0);
        if (amount > 0) parts.push({ type:type, amount:amount });
    };
    addCurrency(quote.moneyCost, VarVal.bonusType.money);
    addCurrency(quote.stoneCost, VarVal.bonusType.stone);
    addCurrency(quote.voucherCost, VarVal.bonusType.chance);
    return parts;
}
```

- [ ] **Step 3: Add a reusable three-slot quote view**

Delete `getOrCreateBazaarQuoteField` and add these methods:

```typescript
public static getOrCreateBazaarQuoteView(parent:fgui.GComponent, options:BazaarQuoteViewOptions):fgui.GComponent {
    let view = parent.getChild(options.name) as fgui.GComponent;
    if (view) return view;

    view = new fgui.GComponent();
    view.name = options.name;
    view.setPosition(options.x, options.y);
    view.setSize(options.width, options.height);
    view.touchable = false;
    parent.addChild(view);

    let feedbackHeight = Math.max(Math.floor(Number(options.feedbackHeight) || 0), 0);
    let rowHeight = options.height - feedbackHeight;
    let slotWidth = options.width / 3;
    for (let i = 0; i < 3; i++) {
        let loader = new fgui.GLoader();
        loader.name = "currency_icon_" + i;
        loader.setPosition(i * slotWidth, Math.max((rowHeight - 20) / 2, 0));
        loader.setSize(20, 20);
        loader.touchable = false;
        view.addChild(loader);

        let amount = new fgui.GTextField();
        amount.name = "currency_amount_" + i;
        amount.setPosition(i * slotWidth + 20, 0);
        amount.setSize(slotWidth - 20, rowHeight);
        amount.fontSize = options.fontSize;
        amount.autoSize = fgui.AutoSizeType.Shrink;
        amount.verticalAlign = fgui.VertAlignType.Middle;
        amount.touchable = false;
        view.addChild(amount);
    }

    let status = new fgui.GTextField();
    status.name = "quote_status";
    status.setPosition(0, 0);
    status.setSize(options.width, rowHeight);
    status.fontSize = options.fontSize;
    status.align = fgui.AlignType.Center;
    status.verticalAlign = fgui.VertAlignType.Middle;
    status.touchable = false;
    view.addChild(status);

    let feedback = new fgui.GTextField();
    feedback.name = "quote_feedback";
    feedback.setPosition(0, rowHeight);
    feedback.setSize(options.width, feedbackHeight);
    feedback.fontSize = Math.max(options.fontSize - 2, 16);
    feedback.align = fgui.AlignType.Center;
    feedback.verticalAlign = fgui.VertAlignType.Middle;
    feedback.touchable = false;
    view.addChild(feedback);
    return view;
}

public static renderBazaarQuoteView(view:fgui.GComponent, quote:any, color:any,
    statusText:string = "", feedbackText:string = ""):void {
    let parts = LyActivityShop.getBazaarQuoteCurrencies(quote);
    let status = view.getChild("quote_status") as fgui.GTextField;
    let feedback = view.getChild("quote_feedback") as fgui.GTextField;
    for (let i = 0; i < 3; i++) {
        let loader = view.getChild("currency_icon_" + i) as fgui.GLoader;
        let amount = view.getChild("currency_amount_" + i) as fgui.GTextField;
        let part = parts[i];
        loader.visible = !!part;
        amount.visible = !!part;
        if (part) {
            loader.url = UtilsUI.getItemIconUrl(part.type);
            amount.text = String(part.amount);
            amount.color = color;
        }
    }
    status.text = statusText || (quote && parts.length == 0 ? "免费" : "");
    status.color = color;
    status.visible = status.text.length > 0;
    feedback.text = feedbackText;
    feedback.color = color;
    feedback.visible = feedback.text.length > 0;
}
```

- [ ] **Step 4: Render shop-card quotes through the shared view**

Create the view once per recycled card:

```typescript
let quoteView = LyActivityShop.getOrCreateBazaarQuoteView(child, {
    name:"bazaar_quote_view", x:4, y:181, width:170, height:42, fontSize:18
});
```

In the dynamic branch, hide the legacy price controls and render:

```typescript
quoteView.visible = selIdx != 2;
LyActivityShop.renderBazaarQuoteView(
    quoteView,
    shopData.quote,
    label_need.color,
    shopData.quote ? "" : "报价中..."
);
```

In every legacy branch, set `quoteView.visible = false` and preserve the existing labels and icons.

- [ ] **Step 5: Run the focused contract**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-bazaar-client-contract.ps1
```

Expected: the shop-side loader assertions pass; the purchase-dialog assertion still fails until Task 3.

### Task 3: Move the purchase dialog to the shared quote view

**Files:**
- Modify: `project/assets/Script/Views/LyActivityShopBuy.ts`
- Test: `tests/test-bazaar-client-contract.ps1`

- [ ] **Step 1: Replace the dynamic rich-text field**

Delete the `dynamic_cost: fgui.GRichTextField` construction. Keep the legacy `loader_icon` and `label_cost`, and add:

```typescript
let dynamicQuoteView:fgui.GComponent = null;
if (isDynamicBazaar) {
    dynamicQuoteView = LyActivityShop.getOrCreateBazaarQuoteView(group_main, {
        name:"bazaar_dynamic_quote_view",
        x:30,
        y:345,
        width:380,
        height:50,
        fontSize:22,
        feedbackHeight:20,
    });
    loader_icon.visible = false;
    label_cost.visible = false;
}
```

- [ ] **Step 2: Separate status text from authoritative quote rendering**

Replace `setCostText` with:

```typescript
let setCostStatus = (text:string, isEnough:boolean = true):void => {
    let color = isEnough ? label_cost.color : UtilsUI.getEnoughColor(false);
    if (dynamicQuoteView) {
        LyActivityShop.renderBazaarQuoteView(dynamicQuoteView, null, color, text);
    } else {
        label_cost.text = text;
        label_cost.color = color;
    }
};
```

Use `setCostStatus` for `配置已更新`, `不可购买`, `报价中...`, and `请输入数量`.

- [ ] **Step 3: Render successful quotes without rich-text images**

In the successful quote callback, replace the string formatter with:

```typescript
let quoteColor = affordability.affordable
    ? label_cost.color
    : UtilsUI.getEnoughColor(false);
LyActivityShop.renderBazaarQuoteView(
    dynamicQuoteView,
    quote,
    quoteColor,
    "",
    affordability.affordable ? "" : "货币不足"
);
updateRewardCount(Number(quote.actualItems));
quoteReady = affordability.affordable;
btn_buy.enabled = affordability.affordable;
```

Do not change the quote request payload, sequence guard, count normalization, or purchase payload.

- [ ] **Step 4: Run the focused contract and verify GREEN**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-bazaar-client-contract.ps1
```

Expected: `BAZAAR_CLIENT_CONTRACT_OK`.

- [ ] **Step 5: Commit the implementation**

```powershell
git add -- project/assets/Script/Views/LyActivityShop.ts project/assets/Script/Views/LyActivityShopBuy.ts tests/test-bazaar-client-contract.ps1
git commit -m "fix: load bazaar currency icons through FairyGUI loaders"
```

### Task 4: Build and verify the browser artifact

**Files:**
- Verify: `project/assets/Script/Views/LyActivityShop.ts`
- Verify: `project/assets/Script/Views/LyActivityShopBuy.ts`
- Verify: `tests/test-bazaar-client-contract.ps1`
- Generated locally: `../dist/web-mobile/`

- [ ] **Step 1: Run focused and adjacent contracts**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-bazaar-client-contract.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-mail-click-race-contract.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-font-refresh-export-contract.ps1
```

Expected: `BAZAAR_CLIENT_CONTRACT_OK`, `MAIL_CLICK_RACE_CONTRACT_OK`, and `FONT_REFRESH_EXPORT_CONTRACT_OK`.

- [ ] **Step 2: Build Web Mobile with the production runtime values**

From the workspace root, run:

```powershell
.\scripts\build-web.ps1 `
  -HdhivePublicUrl 'https://hdhive.com' `
  -HdhiveClientId 'runtime-injected-by-game-entrypoint' `
  -HdhiveRedirectUri 'https://kx.hdhive.com/oauth/callback'
```

Expected: Cocos Creator exits successfully and `dist/web-mobile/index.html` plus `dist/web-mobile/config/update.json` are generated.

- [ ] **Step 3: Verify the generated artifact no longer contains the unsafe implementation**

```powershell
rg -n "formatBazaarQuoteRichText|bazaar_dynamic_cost|\[img\].*CCommon" .\dist\web-mobile\src
```

Expected: no output.

- [ ] **Step 4: Inspect the exact source boundary**

From the `client_release` repository root, run:

```powershell
git diff HEAD~2 -- project/assets/Script/Views/LyActivityShop.ts project/assets/Script/Views/LyActivityShopBuy.ts tests/test-bazaar-client-contract.ps1 docs/superpowers/plans/2026-07-17-bazaar-currency-loader-hotfix.md
git status --short --branch
```

Expected: only the planned Bazaar files appear in the hotfix commits; the pre-existing generated Cocos settings changes remain untouched.

- [ ] **Step 5: Hand the browser verification to the user**

Ask the user to verify a cold-load login, opening the Bazaar immediately, the shop-card currency icons, purchase-dialog currency icons, large quantity input, maximum shortcut, red `货币不足`, and absence of `CCommon_atlas0/10` or `stencilStage` errors.
