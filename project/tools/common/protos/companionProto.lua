local types = [[

    .companionData { #兽友数据
        companionCounter 0:*counter # 未解锁兽友信息
        companions 1:*companionInfo # 已拥有兽友信息
        companionSkins 2:*companionSkin # 已拥有兽友皮肤
        companionAttrs 3:*string # 兽友总属性
        companionSkinAttrs 4:*string # 兽友皮肤总属性
        stamina 5:integer # 体力
        staminaRecoverTime 6:integer #最终恢复时间
        nextStaminaRecoverTime 7:integer #下一点体力恢复时间
    }

    .companionInfo { #兽友信息
        companionId 0:integer # 配置表兽友id
        level 1:integer #等级
        liking 2:integer # 好感度
        phase 3:integer #阶段
        skinId 4:integer #皮肤id
        attrs 5:*string #属性
        duelPhase 6:integer #挑战阶段
    }

    .companionSkin { #兽友信息
        skinId 0:integer # 配置表皮肤id
        level 1:integer #等级
    }

    .encounterCompanion {
        companionId 0:integer # 配置表兽友id
        liking 1:integer #好感度
    }

    .counter {
        id 0:integer # 兽友id 或 皮肤id
        nowValue 1:integer #目前值
        targetValue 2:integer #目标值
        counterKey 3:string #计数key
    }


]]

local c2s = [[

    getCompanionInfo %d { #获取兽友信息
        response {
            errorcode 0:integer
            companionCounter 1:*counter # 未解锁兽友信息
            companions 2:*companionInfo # 已拥有兽友信息
            companionSkins 3:*companionSkin # 已拥有兽友皮肤
            companionAttrs 4:*string # 兽友总属性
            companionSkinAttrs 5:*string # 兽友皮肤总属性
            stamina 6:integer # 体力
            staminaRecoverTime 7:integer #最终恢复时间
            nextStaminaRecoverTime 8:integer #下一点体力恢复时间
        }
    }

    explore %d { #游历
        request {
            ten 0:integer #十连 0：否 1：是
        }

        response {
            errorcode 0:integer
            stamina 1:integer # 体力
            staminaRecoverTime 2:integer #最终恢复时间
            dropReward 3: bonusesResult  # 掉落奖励
            encounterCompanion 4:*encounterCompanion #偶遇兽友以及对应好感度
            nextStaminaRecoverTime 5:integer #下一点体力恢复时间
            companions 6:*companionInfo # 已拥有兽友信息
            companionAttrs 7:*string # 兽友总属性
        }
    }

    addExploreStamina %d { #增加游历体力
        request {
            count 0:integer #次数
        }

        response {
            errorcode 0:integer
            stamina 1:integer # 体力
            staminaRecoverTime 2:integer #最终恢复时间
            nextStaminaRecoverTime 3:integer #下一点体力恢复时间
            itemRemoves 4: *itemRemove
        }
    }

    increaseCompanionLiking %d { #增加兽友好感度
        request {
            companionId 0:integer # 兽友id
            itemId 1:integer # 好感度物品id
            count 2:integer # 次数
        }

        response {
            errorcode 0:integer
            itemRemoves 1: *itemRemove
            companion 2: companionInfo # 加好感度的兽友
            companionAttrs 3:*string # 兽友总属性
        }
    }

    duelCompanion %d { #切磋兽友
        request {
            companionId 0:integer # 兽友id
            duelPhase 1:integer # 阶段
        }

        response {
            errorcode 0:integer
            battleResult 1:battleResult # 战斗结果
            dropReward 2: bonusesResult  # 掉落奖励
            companion 3: companionInfo # 对应兽友
        }
    }

    unlockCompanion %d { #解锁兽友
        request {
            companionId 0:integer # 兽友id
        }

        response {
            errorcode 0:integer
            itemRemoves 1: *itemRemove #物品解锁
            companion 2: companionInfo # 对应兽友
            companionAttrs 3:*string # 兽友总属性
        }
    }

    unlockCompanionSkin %d { #解锁兽友皮肤
        request {
            skinId 0:integer # 兽友皮肤id
        }

        response {
            errorcode 0:integer
            itemRemoves 1: *itemRemove #物品解锁
            companionSkin 2: companionSkin #皮肤信息
            companionSkinAttrs 3:*string # 兽友皮肤总属性
        }
    }

    changeCompanionSkin %d { #更换皮肤
        request {
            companionId 0:integer # 兽友id
            skinId 1:integer # 皮肤id, 传0为默认皮肤
        }

        response {
            errorcode 0:integer
        }
    }

]]

local s2c = [[

    companionUnlockValueChanged %d { #兽友解锁条件值变化
        request {
            companionCounter 0:counter # 未解锁兽友信息
        }
    }

    onExploreStaminaChange %d { # 游历体力变化

        request {
            stamina 0:integer # 体力
            staminaRecoverTime 1:integer #最终恢复时间
            nextStaminaRecoverTime 2:integer #下一点体力恢复时间
        }
    }
]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}