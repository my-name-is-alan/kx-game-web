# Bazaar Display and Mail Click Hotfix Design

## Scope

Only the client implementation is changed. The server-authoritative Bazaar policy, quote, purchase, approval, and publication contracts remain unchanged. Existing unrelated dirty files in `client_release` are preserved.

## Bazaar list display

Dynamic Bazaar cards keep the existing item art, item name, reward quantity, buy action, and sold-out controller. They do not display payment-kind text, remaining quota, or next-tier information.

The current one-group server quote is rendered as existing currency icons followed by numeric costs:

- money uses the existing spirit-stone icon;
- stone uses the existing jade icon;
- voucher uses the existing voucher icon;
- zero-cost currencies are omitted;
- a completely free quote displays `免费`;
- a blocked row continues to use the existing sold-out state.

The icon URLs come from `UtilsUI.getItemIconUrl` and are rendered through a FairyGUI rich-text field created once per virtualized card. The original fixed stone icon and price labels remain untouched for legacy rows and are hidden only while rendering a dynamic row.

## Bazaar purchase dialog

Dynamic authoritative quotes use a dedicated rich-text cost row. Each non-zero total is displayed as an existing currency icon followed by its number, allowing cross-tier quotes to show multiple currencies without spelling out their names. While waiting or on an error, the same row displays the existing concise status text.

Legacy purchases continue using the existing `loader_icon` and `label_cost` controls without behavior changes.

## Mail deletion race

`quickDeleteMails` mutates the same mail array held by the mail view before FairyGUI necessarily finishes the current touch event. During the resulting stale virtual-list click, `mailOnClick` can resolve an index that no longer exists and dereference `mail.id`.

The mail view will:

- lock list-item handling while bulk deletion is in flight;
- synchronize the rendered item count before releasing the lock;
- release the lock on the next UI turn so the initiating touch event cannot fall through to a stale item;
- validate the child index, item index, mail object, and mail ID before sending `readMail`;
- guard the item renderer against a stale index during list recycling.

## Testing

PowerShell client contract tests will be written before production edits. They will verify icon-based dynamic quote rendering, omission of quota and tier text, preservation of the legacy rendering path, and the mail bulk-operation/stale-index guards. Existing Bazaar and client contract tests plus the available TypeScript check will be run after implementation. Browser interaction is left to the user as requested.
