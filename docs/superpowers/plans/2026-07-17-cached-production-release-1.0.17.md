# Cached Production Release 1.0.17 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and package immutable production release `1.0.17` with Docker layer caching enabled by default and the Bazaar GLoader hotfix in the Web image.

**Architecture:** The existing source-proof, image-label, public-Registry digest, production-local lock, and immutable installer chain remains intact. Only Docker cache selection changes: normal builds use content-addressed layer cache, while an explicit `-NoCache` switch retains the clean-build escape hatch. Both images receive the same release identity; production continues to consume `localhost:5000/...@sha256:...` references.

**Tech Stack:** PowerShell 7, Bash/Git Bash, Docker Linux/AMD64, Cocos Creator 3.8.1, Nginx, SHA-256 release attestations.

---

## File map

- `scripts/test-game-production-packaging-contract.ps1`: cache-mode and generic runbook contract.
- `scripts/build-game-images.ps1`: official attested image builder and `-NoCache` switch.
- `docs/runbooks/jianghu-game-production-release.md`: generic cached-build operator guidance.
- `scripts/test-game-release-attestation-contract.ps1`: immutable `1.0.17` proof/image/lock/install contract.
- `scripts/test-gm-operations-deployment-contract.ps1`: `1.0.17` package and deployment contract.
- `scripts/build-game-source-proof.sh`: pinned `1.0.17` proof builder.
- `scripts/capture-game-image-lock.ps1`: pinned `1.0.17` digest capture.
- `scripts/build-gm-operations-fix-package.sh`: pinned `1.0.17` package builder.
- `scripts/install-gm-operations-fix.sh`: pinned `1.0.17` installer whitelist.
- `scripts/apply-gm-operations-fix.sh`: pinned `1.0.17` runtime convergence.
- `docker/.env.game.example`: production-local `1.0.17` image variables.
- `GM-OPERATIONS-FIX-README.md`: current release handoff.
- `1.0.17-发布与生产部署说明.md`: new immutable release instructions; preserve `1.0.16` documentation unchanged.

The suite root is not a Git repository. Root release files are integrity-recorded by the source proof and manifest. Client design/plan documents are committed in `client_release`.

### Task 1: Specify cached Docker builds with a failing contract

**Files:**
- Modify: `scripts/test-game-production-packaging-contract.ps1:510-519`
- Modify: `scripts/test-game-production-packaging-contract.ps1:589-592`

- [ ] **Step 1: Replace the forced-no-cache assertions**

Use these assertions for the image builder:

```powershell
Assert-Contains $buildImages '[switch]$NoCache' 'explicit clean-build switch'
Assert-Contains $buildImages '$dockerCacheArgs = @()' 'cached build argument default'
Assert-Contains $buildImages 'if ($NoCache)' 'explicit no-cache branch'
Assert-Contains $buildImages '$dockerCacheArgs += ''--no-cache''' 'no-cache option is opt-in'
Assert-Contains $buildImages 'docker build @dockerCacheArgs --platform=linux/amd64 @releaseBuildArgs -f Dockerfile.game-web' 'cached Web build invocation with release identity'
Assert-Contains $buildImages 'docker build @dockerCacheArgs --platform=linux/amd64 @releaseBuildArgs -f Dockerfile.game-backend' 'cached Backend build invocation with release identity'
Assert-NotContains $buildImages 'docker build --no-cache --platform=linux/amd64' 'forced no-cache build invocation'
```

Use these assertions for the generic runbook:

```powershell
Assert-Contains $runbook 'docker build --platform=linux/amd64 -f Dockerfile.game-web' 'runbook cached Web build command'
Assert-Contains $runbook 'docker build --platform=linux/amd64 -f Dockerfile.game-backend' 'runbook cached Backend build command'
Assert-Contains $runbook '-NoCache' 'runbook clean-build escape hatch'
```

- [ ] **Step 2: Run the contract and verify RED**

Run:

```powershell
pwsh -NoProfile -File .\scripts\test-game-production-packaging-contract.ps1
```

Expected: FAIL with `explicit clean-build switch` because `build-game-images.ps1` does not yet declare `-NoCache`.

### Task 2: Implement cached builds and restore GREEN

**Files:**
- Modify: `scripts/build-game-images.ps1:2-8,189-203`
- Modify: `docs/runbooks/jianghu-game-production-release.md:275-292`
- Test: `scripts/test-game-production-packaging-contract.ps1`

- [ ] **Step 1: Add an opt-in clean-build switch**

Change the parameter tail to:

```powershell
    [string]$CreatorPath = 'C:\ProgramData\cocos\editors\Creator\3.8.1\CocosCreator.exe',
    [string]$SourceProofPath = '',
    [switch]$NoCache
)
```

Immediately before the two Docker builds, add:

```powershell
    $dockerCacheArgs = @()
    if ($NoCache) {
        $dockerCacheArgs += '--no-cache'
    }
```

Build both images with:

```powershell
docker build @dockerCacheArgs --platform=linux/amd64 @releaseBuildArgs -f Dockerfile.game-web -t $webImage .
docker build @dockerCacheArgs --platform=linux/amd64 @releaseBuildArgs -f Dockerfile.game-backend -t $backendImage .
```

- [ ] **Step 2: Update the generic runbook**

Replace its two direct `docker build --no-cache` commands with normal cached `docker build --platform=linux/amd64` commands. State that `build-game-images.ps1` uses cache by default and `-NoCache` is reserved for an explicit clean rebuild.

- [ ] **Step 3: Run the cache contract and verify GREEN**

Run:

```powershell
pwsh -NoProfile -File .\scripts\test-game-production-packaging-contract.ps1
```

Expected: `GAME_PRODUCTION_PACKAGING_CONTRACT_OK`.

### Task 3: Specify immutable release 1.0.17 with failing contracts

**Files:**
- Modify: `scripts/test-game-production-packaging-contract.ps1`
- Modify: `scripts/test-game-release-attestation-contract.ps1`
- Modify: `scripts/test-gm-operations-deployment-contract.ps1`

- [ ] **Step 1: Move active release expectations from 1.0.16 to 1.0.17**

Update only active pipeline assertions and fixture text. Required expectations include:

```powershell
'GAME_IMAGE_VERSION=1.0.17'
"Version -ne '1\.0\.17'"
'pinned to 1\.0\.17'
'hdhive-game-images-1\.0\.17\.lock'
'release/1\.0\.17/hdhive-game-source-proof-1\.0\.17\.tgz'
'1.0.17-发布与生产部署说明.md'
```

Keep historical invalid/candidate version assertions unchanged.

- [ ] **Step 2: Run all three contracts and verify RED**

Run:

```powershell
pwsh -NoProfile -File .\scripts\test-game-production-packaging-contract.ps1
pwsh -NoProfile -File .\scripts\test-game-release-attestation-contract.ps1
pwsh -NoProfile -File .\scripts\test-gm-operations-deployment-contract.ps1
```

Expected: each release-aware contract fails because production files are still pinned to `1.0.16` or the `1.0.17` release document is missing.

### Task 4: Implement the 1.0.17 release pins and restore GREEN

**Files:**
- Modify: `scripts/build-game-source-proof.sh`
- Modify: `scripts/build-game-images.ps1`
- Modify: `scripts/capture-game-image-lock.ps1`
- Modify: `scripts/build-gm-operations-fix-package.sh`
- Modify: `scripts/install-gm-operations-fix.sh`
- Modify: `scripts/apply-gm-operations-fix.sh`
- Modify: `docker/.env.game.example`
- Modify: `GM-OPERATIONS-FIX-README.md`
- Create: `1.0.17-发布与生产部署说明.md`
- Test: the three release contracts

- [ ] **Step 1: Update executable release pins**

For every active release default, rejection guard, output path, whitelist path, message, and injected `GAME_IMAGE_VERSION`, replace `1.0.16` with `1.0.17`. Do not edit `1.0.15-发布与生产部署说明.md`, `1.0.16-发布与生产部署说明.md`, or historical superpowers documents.

- [ ] **Step 2: Create the new release document**

Copy the current `1.0.16` release document to `1.0.17-发布与生产部署说明.md`, then make these semantic changes:

```markdown
# 1.0.17 发布与生产部署说明

`1.0.17` supersedes `1.0.16` with the production-only Bazaar currency-loader race fix.

- Bazaar prices use programmatic FairyGUI `GLoader` children instead of UBB `[img]` tags.
- Docker image builds use layer cache by default; pass `-NoCache` only for an explicit clean build.
- Production still consumes only `localhost:5000/...@sha256:...` image locks.
```

Update artifact, push, capture, package, incoming-directory, manifest, installer, and acceptance commands to `1.0.17`. Keep `1.0.16` explicitly listed as the rollback release.

- [ ] **Step 3: Update the current release README**

Make `GM-OPERATIONS-FIX-README.md` describe `1.0.17`, its Bazaar GLoader hotfix, cached image command, immutable artifacts, push commands, and `localhost:5000` runtime lock.

- [ ] **Step 4: Run the release contracts and verify GREEN**

Run:

```powershell
pwsh -NoProfile -File .\scripts\test-game-production-packaging-contract.ps1
pwsh -NoProfile -File .\scripts\test-game-release-attestation-contract.ps1
pwsh -NoProfile -File .\scripts\test-gm-operations-deployment-contract.ps1
```

Expected:

```text
GAME_PRODUCTION_PACKAGING_CONTRACT_OK
GAME_RELEASE_ATTESTATION_CONTRACT_OK
GM_OPERATIONS_DEPLOYMENT_CONTRACT_OK
```

### Task 5: Generate the immutable 1.0.17 source proof safely

**Files:**
- Read: `client_release` working tree
- Create: `dist/hdhive-game-source-proof-1.0.17.tgz`
- Create: `dist/hdhive-game-source-proof-1.0.17.tgz.sha256`

- [ ] **Step 1: Verify only the known Cocos files are dirty**

Run:

```powershell
git -C .\client_release status --short
```

Expected dirty paths only:

```text
project/package.json
project/settings/v2/packages/cocos-service.json
project/settings/v2/packages/information.json
```

Any other dirty path blocks proof generation until reviewed.

- [ ] **Step 2: Preserve those paths and build the proof**

Run the following from the suite root. The `finally` block restores the user's files even when proof generation fails:

```powershell
$stashMessage = 'codex-preserve-cocos-before-1.0.17-proof'
git -C .\client_release stash push -m $stashMessage -- `
  project/package.json `
  project/settings/v2/packages/cocos-service.json `
  project/settings/v2/packages/information.json
if ($LASTEXITCODE -ne 0) { throw 'failed to preserve Cocos working-tree changes' }
try {
  & 'C:\Program Files\Git\bin\bash.exe' scripts/build-game-source-proof.sh 1.0.17
  if ($LASTEXITCODE -ne 0) { throw 'source proof build failed' }
} finally {
  $stashRef = git -C .\client_release stash list --format='%gd %s' |
    Where-Object { $_ -like "*$stashMessage*" } |
    Select-Object -First 1
  if ($stashRef) {
    $ref = ($stashRef -split ' ', 2)[0]
    git -C .\client_release stash pop $ref
    if ($LASTEXITCODE -ne 0) { throw "Cocos change restore conflicted; stash retained at $ref" }
  }
}
```

Expected: source-proof archive and checksum exist, and the same three Cocos paths are dirty again.

- [ ] **Step 3: Verify proof checksum**

Run:

```powershell
$proof='.\dist\hdhive-game-source-proof-1.0.17.tgz'
$expected=((Get-Content -Raw "$proof.sha256") -split '\s+')[0]
$actual=(Get-FileHash -Algorithm SHA256 $proof).Hash.ToLowerInvariant()
if ($actual -cne $expected) { throw 'source proof checksum mismatch' }
Write-Output "SOURCE_PROOF_OK sha256=$actual"
```

### Task 6: Build and inspect cached Linux/AMD64 images

**Files:**
- Read: immutable source proof
- Create: local Docker images `152.53.37.46:5000/hdhive-game-{web,backend}:1.0.17`

- [ ] **Step 1: Run the official cached image build**

Run:

```powershell
pwsh -NoProfile -File .\scripts\build-game-images.ps1 `
  -Registry '152.53.37.46:5000' `
  -Version '1.0.17'
```

Expected: all attested tests/builds pass and output ends with both `1.0.17` image names plus non-executed push commands. Docker output should show reused `CACHED` layers where inputs match.

- [ ] **Step 2: Verify platform and identity labels**

Run:

```powershell
$images=@(
  '152.53.37.46:5000/hdhive-game-web:1.0.17',
  '152.53.37.46:5000/hdhive-game-backend:1.0.17'
)
foreach($image in $images) {
  docker image inspect $image --format '{{.Os}}/{{.Architecture}} {{index .Config.Labels "org.opencontainers.image.version"}} {{index .Config.Labels "io.hdhive.client.commit"}}'
  if ($LASTEXITCODE -ne 0) { throw "image inspection failed: $image" }
}
```

Expected: both lines start with `linux/amd64 1.0.17` and contain the current Client commit.

- [ ] **Step 3: Verify the Web image contains the hotfix**

Run:

```powershell
$web='152.53.37.46:5000/hdhive-game-web:1.0.17'
docker run --rm --entrypoint sh $web -ec '
  main=$(find /usr/share/nginx/html/assets/main -name "index.*.js" -type f | head -n 1)
  test -n "$main"
  grep -q "bazaar_dynamic_quote_view" "$main"
  grep -q "currency_icon_" "$main"
  ! grep -q "bazaar_dynamic_cost" "$main"
  ! grep -q "formatBazaarQuoteRichText" "$main"
'
```

Expected: exit code `0`.

### Task 7: Operator push checkpoint

**Files:** none

- [ ] **Step 1: Hand off exact push commands without executing them**

```powershell
docker push 152.53.37.46:5000/hdhive-game-web:1.0.17
docker push 152.53.37.46:5000/hdhive-game-backend:1.0.17
```

Stop and wait for the user to confirm both pushes completed. Do not capture an image lock before the Registry has the new immutable digests.

### Task 8: Capture digests and build the immutable installer after push

**Files:**
- Create: `dist/hdhive-game-images-1.0.17.lock`
- Create: `dist/hdhive-game-gm-operations-fix-1.0.17.tgz`
- Create: `dist/hdhive-game-gm-operations-fix-1.0.17.tgz.sha256`
- Create: `dist/hdhive-game-release-1.0.17.manifest.json`
- Create: `dist/hdhive-game-release-1.0.17.manifest.json.sha256`

- [ ] **Step 1: Pull, verify, and rewrite digests to localhost**

Run:

```powershell
pwsh -NoProfile -File .\scripts\capture-game-image-lock.ps1 `
  -Registry '152.53.37.46:5000' `
  -RuntimeRegistry 'localhost:5000' `
  -Version '1.0.17'
```

Expected lock values:

```text
backend_image=localhost:5000/hdhive-game-backend@sha256:<64 lowercase hex>
web_image=localhost:5000/hdhive-game-web@sha256:<64 lowercase hex>
```

- [ ] **Step 2: Build the immutable package**

Run:

```powershell
& 'C:\Program Files\Git\bin\bash.exe' scripts/build-gm-operations-fix-package.sh 1.0.17
if ($LASTEXITCODE -ne 0) { throw '1.0.17 package build failed' }
```

Expected: package, checksum, release manifest, and manifest checksum are created without overwriting existing artifacts.

- [ ] **Step 3: Verify release evidence**

Run:

```powershell
& 'C:\Program Files\Git\bin\bash.exe' -lc '
  cd /h/江湖大侠全套源码/dist &&
  sha256sum -c hdhive-game-source-proof-1.0.17.tgz.sha256 &&
  sha256sum -c hdhive-game-gm-operations-fix-1.0.17.tgz.sha256 &&
  sha256sum -c hdhive-game-release-1.0.17.manifest.json.sha256
'
```

Expected: all three checks report `OK`.

### Task 9: Deployment handoff and browser verification boundary

**Files:** none

- [ ] **Step 1: Provide the exact upload list**

Upload these four files to `/opt/hdhive-game/incoming/1.0.17/`:

```text
hdhive-game-gm-operations-fix-1.0.17.tgz
hdhive-game-gm-operations-fix-1.0.17.tgz.sha256
hdhive-game-release-1.0.17.manifest.json
hdhive-game-release-1.0.17.manifest.json.sha256
```

- [ ] **Step 2: Provide the production install command**

```bash
cd /opt/hdhive-game/incoming/1.0.17
sha256sum -c hdhive-game-release-1.0.17.manifest.json.sha256
sha256sum -c hdhive-game-gm-operations-fix-1.0.17.tgz.sha256
tar -xzf hdhive-game-gm-operations-fix-1.0.17.tgz
chmod 0700 ./install-gm-operations-fix.sh
RELEASE_PACKAGE="$PWD/hdhive-game-gm-operations-fix-1.0.17.tgz" \
RELEASE_MANIFEST="$PWD/hdhive-game-release-1.0.17.manifest.json" \
bash ./install-gm-operations-fix.sh
```

The command must preserve named volumes and existing cross-server containers. Do not add `--remove-orphans` or `docker compose down -v`.

- [ ] **Step 3: Hand browser testing to the user**

Ask the user to verify hard refresh, Bazaar icons, insufficient-funds red state before clicking, manual/max quantity, two consecutive purchases, limit refresh, and absence of `CCommon_atlas*` / `stencilStage` console errors.
