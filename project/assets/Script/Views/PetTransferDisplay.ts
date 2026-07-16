export const PET_TRANSFER_MAX = 3996
export const PET_BUFF_MAX = 999
export const PET_LEGACY_VISUAL_MAX = 40

function boundedInteger(value: number, maximum: number): number {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) {
        return 0
    }
    return Math.min(maximum, Math.max(0, Math.floor(parsed)))
}

export function petTransferVisual(total: number): { visible: boolean, tier: number, filled: number } {
    const visual = boundedInteger(total, PET_LEGACY_VISUAL_MAX)
    return {
        visible: visual > 0,
        tier: Math.floor(visual / 5),
        filled: visual % 5,
    }
}

export function applyPetTransferStars(loaders: any[], total: number, resourcePrefix = "star_"): void {
    const visual = petTransferVisual(total)
    for (let index = 0; index < loaders.length; index++) {
        const loader = loaders[index]
        const resourceTier = index < visual.filled ? visual.tier : visual.tier - 1
        loader.visible = visual.visible && resourceTier >= 0
        if (loader.visible) {
            loader.url = `ui://LyPet/${resourcePrefix}${Math.min(7, resourceTier)}`
        }
    }
}

export function petTransferProgress(total: number, maximum = PET_TRANSFER_MAX): string {
    return `传功 ${boundedInteger(total, maximum)}/${maximum}`
}

export function petBuffLevel(level: number, maximum = PET_BUFF_MAX): string {
    return `${boundedInteger(level, maximum)}/${maximum}`
}
