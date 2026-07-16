# Pet And Companion Client Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Synchronize companion refresh presentation and repair confirmed companion and elite client reskin defects.

**Architecture:** Generated client data mirrors the server cost contract. Existing response handlers and views receive minimal field and resource corrections without changing component boundaries.

**Tech Stack:** TypeScript, XML, JSON, PowerShell contract tests

---

### Task 1: Write the failing client contract test

**Files:**
- Create: tests/test-pet-companion-reskin-contract.ps1

- [ ] Assert that client XML and JSON contain only lock counts 0 through 3 with material IDs 120012 and 120013.
- [ ] Assert that PErrCode.pet_clear_skill_not_level is 775.
- [ ] Assert that on_explore assigns args.companionAttrs.
- [ ] Assert that LyCompanionLevel uses ui://LyCompanion/companion_bg{0} and LyEliteGet uses ui://LyEliteMonster/frame_get{0}.
- [ ] Run: pwsh -NoProfile -File tests/test-pet-companion-reskin-contract.ps1
- [ ] Expected result: FAIL on the current client.

### Task 2: Synchronize refresh data and error code

**Files:**
- Modify: project/tools/common/xmls/Pet.xml
- Modify: project/assets/resources/data/Pet.json
- Modify: project/assets/Script/Values/PErrCode.ts

- [ ] Replace refresh costs with the server mapping for lock counts 0 through 3 and remove lock count 4.
- [ ] Change pet_clear_skill_not_level to 775.

### Task 3: Repair response merge and resource ownership

**Files:**
- Modify: project/assets/Script/Kernel/GameServerData.ts
- Modify: project/assets/Script/Views/LyCompanionLevel.ts
- Modify: project/assets/Script/Views/LyEliteGet.ts

- [ ] Assign companionData.companionAttrs = args.companionAttrs when the response contains the field.
- [ ] Change companion quality art to ui://LyCompanion/companion_bg{0}.
- [ ] Change elite quality art to ui://LyEliteMonster/frame_get{0} using the unshifted elite quality.
- [ ] Run: pwsh -NoProfile -File tests/test-pet-companion-reskin-contract.ps1
- [ ] Expected result: PET_COMPANION_CLIENT_CONTRACT_OK.
- [ ] Commit the client changes on fix/pet-companion-reskin-fixes.
