# Cached Production Release 1.0.17 Design

## Goal

Publish the Bazaar currency-loader hotfix as immutable release `1.0.17` without
paying the cost of a forced no-cache Docker rebuild on every release.

This design changes build-time Docker layer caching only. It does not relax the
existing browser, CDN, or Nginx cache-control rules.

## Release boundary

- Build both Linux/AMD64 images with the same `1.0.17` release identity:
  - `152.53.37.46:5000/hdhive-game-web:1.0.17`
  - `152.53.37.46:5000/hdhive-game-backend:1.0.17`
- Keep production Compose digest-pinned through:
  - `localhost:5000/hdhive-game-web@sha256:...`
  - `localhost:5000/hdhive-game-backend@sha256:...`
- Retain release `1.0.16` and its package on the server for rollback.
- Do not push images automatically. Print exact push commands for the operator.

## Docker cache behavior

`scripts/build-game-images.ps1` will use normal Docker layer caching by default.
An explicit `-NoCache` switch will add `--no-cache` to both image builds when a
clean rebuild is required.

The default path remains attested: source proof validation, Git identity labels,
platform checks, tests, digest capture, and package manifests are unchanged.
Cached layers are accepted only when Docker's content-addressed cache keys match
the current build inputs.

The script will continue building both images. Reusing the old Backend image or
retagging it as `1.0.17` is rejected because its embedded release labels would no
longer match the release lock.

## Immutable release update

Every active `1.0.16` pin in the release pipeline will move together to
`1.0.17`, including:

- source-proof builder;
- image builder and image-lock capture;
- package builder;
- installer and apply script;
- environment example and release documentation;
- attestation, production-packaging, and deployment contract tests.

Historical design and plan documents will not be rewritten. The new release
document will be copied from the current `1.0.16` instructions and updated to
describe `1.0.17`, cached builds, the optional `-NoCache` escape hatch, and the
new image push/install commands.

## Build and packaging flow

1. Preserve the three pre-existing Cocos-generated client working-tree changes
   with a path-scoped Git stash. They are restored immediately after source-proof
   creation, even if proof generation fails.
2. Generate `hdhive-game-source-proof-1.0.17.tgz` and its checksum from the
   committed Server and Client revisions.
3. Run the official image builder with Docker cache enabled.
4. Verify image platform and release/source-proof labels.
5. Capture the public image digests into a lock rewritten to the production-local
   `localhost:5000/...@sha256:...` form.
6. Generate the immutable `1.0.17` installer archive, checksum, and release
   manifest.
7. Inspect the Web image to prove that `index.cfa83.js` (or its content-equivalent
   generated main bundle) contains the GLoader Bazaar quote markers and excludes
   the old rich-text markers.
8. Print push commands; deployment begins only after the operator confirms both
   pushes completed.

## Failure handling

- Existing `1.0.17` immutable artifacts cause an immediate stop rather than an
  overwrite.
- A dirty Client tree outside the three known preserved files blocks the release.
- A source-proof checksum, Git identity, image label, platform, or digest mismatch
  blocks packaging.
- The path-scoped stash is restored in a `finally` path. If automatic restoration
  conflicts, stop without deleting the stash and report its exact name.
- No server command removes volumes or uses `--remove-orphans`; the existing data
  and cross-server containers remain untouched.

## Verification

- TDD contract: default image builds omit `--no-cache`; `-NoCache` adds it to both
  builds.
- Existing production packaging, release attestation, and GM operations deployment
  contracts pass with `1.0.17` pins.
- Bazaar, mail-click-race, and font-refresh Client contracts pass.
- Web Mobile and GM production builds pass.
- Both images inspect as `linux/amd64` with matching `1.0.17`, Server commit,
  Client commit, and source-proof SHA labels.
- Package checksums and the production-local digest lock validate before handoff.

## Browser handoff

Browser testing remains with the user. After deployment the user will hard-refresh
the game, open the Bazaar, verify currency icons and pre-click insufficient-funds
feedback, change quantities, purchase twice, and confirm that the console no longer
reports missing `CCommon_atlas*` resources or `stencilStage` errors.
