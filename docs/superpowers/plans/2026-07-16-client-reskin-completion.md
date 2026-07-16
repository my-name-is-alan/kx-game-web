# Client Reskin Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish visible companion/elite fixes and keep generated client data aligned with the server.

**Architecture:** Lock view behavior and generated-data relationships with PowerShell contracts, make the minimal TypeScript ordering fix, then consume server-generated XML and regenerate JSON.

**Tech Stack:** TypeScript, Cocos Creator, FairyGUI, XML, JSON, PowerShell

---

### Task 1: Extend failing visible-behavior contracts

**Files:**
- Modify: `tests/test-pet-refresh-acquisition-contract.ps1`
- Create: `tests/test-client-reskin-completion-contract.ps1`

- [ ] Assert Items XML/JSON expose both guide codes for 120012 and 120013.
- [ ] Assert Activities XML/JSON contain matching bazaar rows and Bonuses XML/JSON contain matching drops.
- [ ] Assert both LyEliteGroup paths read `resonanceLevel` before computing max-level state.
- [ ] Assert malformed pet-description sequences are absent.

### Task 2: Fix LyEliteGroup state ordering

**Files:**
- Modify: `project/assets/Script/Views/LyEliteGroup.ts`

- [ ] Read the server resonance level before calling/computing top-level state in initialization.
- [ ] Apply the same order in refresh/update handling.
- [ ] Run the client completion contract.

### Task 3: Synchronize shared XML and regenerate JSON

**Files:**
- Modify: `project/tools/common/xmls/Activities.xml`
- Modify: `project/tools/common/xmls/CombatPower.xml`
- Modify: `project/tools/common/xmls/Evolution.xml`
- Modify: `project/tools/common/xmls/Items.xml`
- Modify: `project/tools/common/xmls/Task.xml`
- Regenerate: matching `project/assets/resources/data/*.json`

- [ ] Run the server-provided explicit sync script against this worktree.
- [ ] Run `project/tools/libs/lua.exe gen_script.lua xmltojson` for each changed XML.
- [ ] Parse all changed JSON and run front/back semantic contracts.

### Task 4: Regenerate corrected companion descriptions

**Files:**
- Synchronize: `project/tools/common/xmls/Pet.xml`
- Regenerate: `project/assets/resources/data/Pet.json`

- [ ] Consume the corrected server-generated Pet.xml.
- [ ] Generate Pet.json with the existing Lua generator.
- [ ] Verify description numbering, line breaks, and section boundaries.

### Task 5: Verify reserved protocols and visible acquisition routes

**Files:**
- Verify: generated protocol sources under `project/assets/Script`
- Verify: `project/assets/Script/Views/LyGuideGetItem.ts`

- [ ] Assert assignPet protocol declarations remain but no new UI/runtime handler is introduced.
- [ ] Run all existing pet refresh/acquisition/reskin contracts.
- [ ] Run TypeScript/package checks available in `project/package.json`.
- [ ] Run `git diff --check` and commit TypeScript separately from generated data.
