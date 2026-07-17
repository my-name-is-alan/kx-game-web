# 1.0.18 production static cache namespace implementation plan

1. Add failing packaging contracts for clean Creator output, `CCommon` preload, no-store entry points, and static 404 behavior.
2. Implement the constrained build cleanup, startup preload, and Nginx cache rules.
3. Build the local Web output and verify new entry/chunk hashes, immutable existing assets, no-store entry HTML, and a non-cacheable 404 for an old chunk.
4. Pin the release toolchain and deployment evidence to `1.0.18`, then run release contracts.
5. Commit the client source change without including unrelated local Creator settings.
6. Generate the attested source proof and cached Linux/AMD64 images, inspect the image contents and labels, then produce push commands and the deploy package after Registry digest capture.
