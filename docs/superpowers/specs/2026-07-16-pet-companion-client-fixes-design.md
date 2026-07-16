# Pet And Companion Client Fixes Design

## Goal

Align the client with the corrected companion refresh contract and remove confirmed reskin leftovers in companion and elite-monster views.

## Scope

- Synchronize Pet.xml and Pet.json refresh costs to materials 120012 and 120013, with lock counts 0 through 3.
- Change pet_clear_skill_not_level to error code 775.
- Merge companionAttrs in GameServerData.on_explore.
- Use LyCompanion/companion_bg{quality} for companion quality art.
- Use LyEliteMonster/frame_get{quality} for the elite acquisition and upgrade quality art.

## Data flow

The server remains authoritative. The client reads matching generated data for cost presentation, applies the response companionAttrs immediately after travel, and resolves art from the package owned by each view.

## Verification

A PowerShell contract test checks the generated XML and JSON, TypeScript error code, travel response merge, and resource URLs. Resource existence is checked against the corresponding FairyGUI bin package strings.
