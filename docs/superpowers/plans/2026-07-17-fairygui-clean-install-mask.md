# FairyGUI Clean-Install Mask Compatibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make local and attested production builds install the same FairyGUI code and prevent the Cocos 3.8.1 mask initialization crash.

**Architecture:** The tracked `FairyGUI-cocoscreator-ccc3.0/source` directory becomes the Cocos project's file dependency. Its `GComponent` stores the requested inversion flag and applies it only after the mask renderer type is initialized; a PowerShell contract verifies dependency provenance, operation ordering, and clean-install identity.

**Tech Stack:** Cocos Creator 3.8.1, TypeScript, npm lockfile v3, PowerShell contract tests.

---

### Task 1: Add the failing dependency and mask-order contract

**Files:**
- Create: `tests/test-fairygui-mask-dependency-contract.ps1`

- [ ] **Step 1: Write assertions for the file dependency, deferred inversion order, and clean-install module identity.**
- [ ] **Step 2: Run `pwsh -File tests/test-fairygui-mask-dependency-contract.ps1`.**
  Expected: FAIL because `project/package.json` still uses `^1.1.1` and the tracked module assigns `inverted` too early.

### Task 2: Fix the tracked FairyGUI package

**Files:**
- Modify: `FairyGUI-cocoscreator-ccc3.0/source/src/GComponent.ts`
- Modify: `FairyGUI-cocoscreator-ccc3.0/source/dist/fairygui.mjs`
- Modify: `project/package.json`
- Modify: `project/package-lock.json`

- [ ] **Step 1: Add an `_inverted` field to `GComponent`.**
- [ ] **Step 2: Store the requested value in `setMask` without touching `Mask.inverted`.**
- [ ] **Step 3: Apply `Mask.inverted` at the end of `onMaskReady`, after the renderer type has been selected.**
- [ ] **Step 4: Point `fairygui-cc` at `file:../FairyGUI-cocoscreator-ccc3.0/source` and regenerate the lockfile.**
- [ ] **Step 5: Re-run the focused contract.**
  Expected: PASS, including a clean temporary `npm ci` and SHA-256 equality between tracked and installed `fairygui.mjs`.

### Task 3: Verify and rebuild

**Files:**
- Verify: `project/build/web-mobile/src/chunks/bundle.*.js`
- Verify: `project/build/web-mobile/assets/main/index.*.js`

- [ ] **Step 1: Run `project/node_modules/.bin/tsc.cmd --noEmit -p project/tsconfig.json`.**
  Expected: no new FairyGUI compatibility errors.
- [ ] **Step 2: Run the existing focused client contracts affected by homepage construction.**
  Expected: PASS.
- [ ] **Step 3: Run the Cocos Web build through the repository build script.**
  Expected: Creator exits with `0` or `36` and reports `[build-web] SUCCESS`.
- [ ] **Step 4: Inspect the generated dependency bundle.**
  Expected: no `this._customMask.inverted` assignment occurs before `onMaskReady`; the deferred assignment exists inside `onMaskReady`.

