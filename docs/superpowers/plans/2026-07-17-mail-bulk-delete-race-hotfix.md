# Mail Bulk Delete Race Hotfix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent a stale FairyGUI mail-list click from dereferencing a removed mail after `quickDeleteMails` mutates the shared array.

**Architecture:** Treat bulk deletion as a short list mutation transaction: lock list input before the request, synchronize `numItems` on response, and unlock on the next UI turn. Independently validate renderer and click indices so any future stale virtual-list event fails closed.

**Tech Stack:** Cocos Creator 3.8 TypeScript, FairyGUI virtual lists, PowerShell contract tests.

---

### Task 1: Reproduce the stale-click contract failure

**Files:**
- Create: `tests/test-mail-click-race-contract.ps1`
- Test: `tests/test-mail-click-race-contract.ps1`

- [ ] **Step 1: Write the failing source contract**

```powershell
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$mail = Get-Content -Raw (Join-Path $root "project/assets/Script/Views/LyMail.ts")
function Assert-Match([string]$Text, [string]$Pattern, [string]$Message) {
    if ($Text -notmatch $Pattern) { throw $Message }
}
Assert-Match $mail 'mailListLocked\s*:\s*boolean' "bulk mail lock is missing"
Assert-Match $mail 'if\s*\(this\.mailListLocked\)\s*return' "stale clicks are not blocked"
Assert-Match $mail 'this\.list_mails\.touchable\s*=\s*false' "mail list stays touchable while deleting"
Assert-Match $mail 'this\._partner\.callLater' "mail list unlock is not deferred"
Assert-Match $mail 'index\s*<\s*0\s*\|\|\s*index\s*>=\s*this\.mails\.length' "mail index bounds are not checked"
Assert-Match $mail '!mail\s*\|\|\s*mail\.id\s*==\s*null' "missing mail ID is not guarded"
Assert-Match $mail 'if\s*\(!mail\)\s*\{' "stale item rendering is not guarded"
Write-Output "MAIL_CLICK_RACE_CONTRACT_OK"
```

- [ ] **Step 2: Run the test and verify RED**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-mail-click-race-contract.ps1`

Expected: FAIL with `bulk mail lock is missing`.

### Task 2: Lock bulk deletion and validate list indices

**Files:**
- Modify: `project/assets/Script/Views/LyMail.ts`
- Test: `tests/test-mail-click-race-contract.ps1`

- [ ] **Step 1: Guard the renderer and click handler**

Add a `mailListLocked:boolean` field. In `initMail`, hide and return for a missing row, and restore visibility for valid rows. In `mailOnClick`, return while locked, reject negative/stale indices, and reject a missing mail or ID before constructing `readMail`.

- [ ] **Step 2: Make quick delete a list mutation transaction**

Before sending, set the lock and `list_mails.touchable = false`. In the callback, update the list before unlocking the wait overlay, then use `this._partner.callLater` to restore touchability and clear the lock after the initiating touch event has completed.

- [ ] **Step 3: Run the mail contract and verify GREEN**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-mail-click-race-contract.ps1`

Expected: `MAIL_CLICK_RACE_CONTRACT_OK`.

- [ ] **Step 4: Run both focused contracts**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-bazaar-client-contract.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-mail-click-race-contract.ps1
```

Expected: both scripts exit 0.

- [ ] **Step 5: Commit the mail hotfix**

```powershell
git add -- tests/test-mail-click-race-contract.ps1 project/assets/Script/Views/LyMail.ts docs/superpowers/plans/2026-07-17-mail-bulk-delete-race-hotfix.md
git diff --cached --check
git commit -m "fix: guard mail bulk-delete list race"
```

### Task 3: Full client verification

**Files:**
- Verify all files changed by the two hotfix plans.

- [ ] **Step 1: Run all contract tests**

Run every `tests/test-*-contract.ps1` script and stop on the first non-zero exit.

- [ ] **Step 2: Run the available TypeScript check**

Run the checked-in non-generating TypeScript validation command from `project/package.json`. If the project exposes no such command, run `npx tsc --noEmit` only when a checked-in `tsconfig.json` is present and record the constraint otherwise.

- [ ] **Step 3: Verify scope**

Run `git diff --check`, inspect the target-file diff, and confirm the pre-existing dirty files remain untouched.

- [ ] **Step 4: Hand off manual browser checks**

Ask the user to verify: dynamic cards contain no quota/tier text; each non-free price uses icons and numbers; mixed quotes show multiple icon-number pairs; quick delete no longer produces `mailOnClick` errors.
