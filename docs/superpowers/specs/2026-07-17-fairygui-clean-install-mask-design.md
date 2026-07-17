# FairyGUI Clean-Install Mask Compatibility Design

## Problem

The local Web build and the attested production build compiled the same game
application chunk but different `fairygui-cc` implementations. The public
`fairygui-cc@1.1.1` tarball lacked the project's Cocos 3.8 runtime APIs,
including `GLoader3D.freeSpine`, and used the deprecated `IMAGE_STENCIL` mask
path. Under Cocos Creator 3.8.1 this caused both the activity-list
`freeSpine is not a function` crash and the main-page avatar `stencilStage`
null crash.

## Chosen Design

Use the tracked FairyGUI compatibility package as the canonical local package.
Change the Cocos project dependency from the registry range to
`file:../FairyGUI-cocoscreator-ccc3.0/source`, update its lockfile entry, and
pin the complete Cocos 3.8-compatible distributed module. Its mask code stores
`inverted` during `setMask`, selects `SPRITE_STENCIL`/graphics renderers in
`onMaskReady`, and applies inversion only after that renderer is ready.

The pinned module hash is
`03CE74C888044545ECD9B37076371EABED830754D7BE0E6AFF9AEB9209BDAC65`.
This keeps clean `npm ci` builds offline-reproducible from the attested client
commit and avoids depending on an untracked `node_modules` state.

## Scope

- Preserve all game login, homepage, resource, and UI XML behavior.
- Preserve the circular avatar mask and inverted-mask semantics.
- Do not modify the user's existing Cocos service/information settings.
- Preserve the user's existing `project/package.json` version field.
- Do not add a runtime monkey patch or delete masks from FairyGUI assets.

## Verification

1. A contract test must fail while the project still points to the registry
   package, uses `IMAGE_STENCIL`, or omits `freeSpine`.
2. A clean temporary `npm ci --ignore-scripts` must install the pinned package
   and its installed module must match the pinned distributed module hash.
3. TypeScript compilation and the focused contract test must pass.
4. A clean Cocos Web build must produce a dependency bundle where the old
   early `inverted` sequence is absent and the deferred sequence is present.
