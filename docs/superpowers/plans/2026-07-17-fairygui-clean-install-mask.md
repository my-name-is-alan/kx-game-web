# FairyGUI Clean-Install Mask Compatibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make local and attested production builds install the same FairyGUI code and prevent the Cocos 3.8.1 mask initialization crash.

**Architecture:** The tracked `FairyGUI-cocoscreator-ccc3.0/source` directory becomes the Cocos project's file dependency. Its complete Cocos 3.8-compatible distributed module provides `freeSpine`, `SPRITE_STENCIL`, and deferred mask inversion; a PowerShell contract verifies dependency provenance, runtime API markers, the pinned module hash, and clean-install identity.

**Tech Stack:** Cocos Creator 3.8.1, TypeScript, npm lockfile v3, PowerShell contract tests.

---

### Task 1: Add the failing dependency and mask-order contract

**Files:**
- Create: `tests/test-fairygui-mask-dependency-contract.ps1`

- [x] **Step 1: Write assertions for the file dependency, complete runtime API markers, pinned hash, and clean-install module identity.**
- [x] **Step 2: Run `pwsh -File tests/test-fairygui-mask-dependency-contract.ps1`.**
  Result: PASS.

### Task 2: Fix the tracked FairyGUI package

**Files:**
- Modify: `FairyGUI-cocoscreator-ccc3.0/source/src/GComponent.ts`
- Modify: `FairyGUI-cocoscreator-ccc3.0/source/dist/fairygui.mjs`
- Modify: `project/package.json`
- Modify: `project/package-lock.json`

- [x] **Step 1: Pin the complete Cocos 3.8-compatible FairyGUI distributed module.**
- [x] **Step 2: Keep the TypeScript source aligned with deferred inversion and modern mask renderer types.**
- [x] **Step 3: Point `fairygui-cc` at `file:../FairyGUI-cocoscreator-ccc3.0/source` and retain the lockfile entry.**
- [x] **Step 4: Re-run the focused contract.**
  Result: PASS, including a clean temporary `npm ci` and SHA-256 equality with the pinned `fairygui.mjs`.

### Task 3: Verify and rebuild

**Files:**
- Verify: `project/build/web-mobile/src/chunks/bundle.*.js`
- Verify: `project/build/web-mobile/assets/main/index.*.js`

- [x] **Step 1: Run the Cocos Web build through the repository build script.**
  Result: Creator exit code `36` and `[build-web] SUCCESS`.
- [x] **Step 2: Inspect the generated dependency bundle.**
  Result: `freeSpine` and `SPRITE_STENCIL` are present; deprecated `IMAGE_STENCIL` is absent.
- [ ] **Step 3: Run `project/node_modules/.bin/tsc.cmd --noEmit -p project/tsconfig.json`.**
  Expected: no new FairyGUI compatibility errors.
- [ ] **Step 4: Run the existing focused client contracts affected by homepage construction.**
  Expected: PASS.
