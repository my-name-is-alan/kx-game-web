# Dynamic Bazaar Client Design

## Scope

Only `client_release` changes. The client consumes the authoritative activity-shop contract copied from `server_release/common/protos/activityProto.lua`. Existing companion-transfer commits and unrelated client files are preserved.

## Chosen approach

Reuse the existing FairyGUI controls. `label_limit` carries the current payment kind, remaining order items, and next tier boundary. Existing price labels carry the current server snapshot price. The purchase dialog reuses `label_cost` for the authoritative mixed-currency quote. No FairyGUI resource is changed.

Dynamic behavior remains in `LyActivityShop.ts` and `LyActivityShopBuy.ts`. Small pure formatting and snapshot helpers may be added inside those files if needed, but no new UI or networking abstraction is introduced.

## Snapshot detection and compatibility

A shop is dynamic only when `activityState.data.activityShop.policyVersion` is a non-empty value and the matching shop entry exposes the dynamic payment fields. The client reads:

- `policyVersion`
- `currentPaymentKind`
- `remainingOrderItems`
- `nextTierBoundary`
- `quote`

The supported payment kinds are `original`, `money`, `stone`, `voucher`, and `blocked`. They are displayed as original price, spirit stones, jade, vouchers, and unavailable respectively. `original` is priced by the server-provided `stoneCost`, not recomputed by the client.

If the dynamic snapshot is absent, the existing `mode`, discount, voucher, price, and quantity calculations are retained unchanged. Legacy purchases keep using the existing `shopBuy` or `bazaarVoucherBuy` route and do not send a policy version.

## List behavior

For dynamic rows:

- Use `remainingOrderItems` to calculate the maximum selectable group count from the XML item count.
- Hide the purchase action when payment kind is `blocked` or no complete group remains.
- Show current payment kind, remaining actual-item quota, and the next cumulative tier boundary in `label_limit`.
- Show the one-group authoritative snapshot quote in existing price text. Do not derive a trusted price from XML or discounts.

For legacy rows, preserve the current rendering exactly.

## Purchase dialog and quote flow

Opening a dynamic row passes the item snapshot and `policyVersion` into the dialog. Every selected group count sends a read-only `bazaarQuotePurchase` request containing only:

```text
id, num, policyVersion
```

Each request receives a monotonically increasing local sequence number. Only the latest response may update the dialog, preventing a slower old response from replacing a newer quote. Purchase remains disabled until the latest quote succeeds.

The dialog renders all three authoritative totals in `label_cost`: money, stone, and voucher. Zero totals remain explicit so a cross-tier quote is unambiguous. Dynamic reward quantity is taken from `quote.actualItems`; the client does not assume a fixed voucher conversion.

Dynamic purchase uses `shopBuy` with only `id`, `num`, and `policyVersion`. The server quote and policy decide whether the selected range spans `original`, `money`, `stone`, or `voucher` tiers. `blocked` never sends a purchase request.

## Error behavior

When `bazaarError` is `BAZAAR_POLICY_VERSION_MISMATCH`, or the response policy version differs from the requested version, show exactly:

```text
坊市配置已更新，请重新登录
```

Do not retry either quote or purchase. Other failures continue through the existing numeric error-tip path when possible; protocol-level bazaar errors use a concise text fallback.

## Testing

Create `tests/test-bazaar-client-contract.ps1` before production edits. The contract test verifies:

- The client protocol copy contains the complete dynamic snapshot and `bazaarQuotePurchase` contract.
- The list reads the required dynamic fields and preserves a legacy fallback.
- The dialog requests a quote whenever quantity changes, ignores stale responses, and displays all three totals.
- Purchase sends `policyVersion` and no client price fields.
- All payment kinds and the exact version-mismatch message are present.
- No automatic retry path exists.

Run the new test once before implementation and confirm it fails for missing protocol/client behavior. After implementation, run it again together with the existing PowerShell client contract tests and the available TypeScript/project checks.
