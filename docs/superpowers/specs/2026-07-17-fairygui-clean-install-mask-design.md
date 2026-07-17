# FairyGUI Clean-Install Mask Compatibility Design

## Problem

The local Web build and the attested production build compile the same game
application chunk but different `fairygui-cc` implementations. The local
`project/node_modules/fairygui-cc` contains a newer compatible implementation,
while the lockfile resolves the public `fairygui-cc@1.1.1` tarball. The public
tarball assigns `Mask.inverted` before selecting a mask renderer. Under Cocos
Creator 3.8.1 this writes `stencilStage` through a null `subComp` and crashes
while constructing the main-page avatar mask.

## Chosen Design

Use the already tracked FairyGUI source tree as the canonical local package.
Change the Cocos project dependency from the registry range to
`file:../FairyGUI-cocoscreator-ccc3.0/source`, update its lockfile entry, and
patch both the TypeScript source and distributed module so `inverted` is stored
during `setMask` and applied only after `onMaskReady` has selected the renderer.

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
   package or applies `inverted` before renderer selection.
2. A clean temporary `npm ci --ignore-scripts` must install the tracked package
   and its installed module must match the tracked distributed module hash.
3. TypeScript compilation and the focused contract test must pass.
4. A clean Cocos Web build must produce a dependency bundle where the old
   early `inverted` sequence is absent and the deferred sequence is present.

