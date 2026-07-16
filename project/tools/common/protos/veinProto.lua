local types = [[

    .gems { #
        gid 0: string # 灵髓实例编号
        cid 1: integer # 灵髓配置表编号
        slot 2: string # 部位
        quality 3: integer # 品质
        level 4: integer # 灵髓等级
        attrs 5: string # 属性
        setId 6: integer # 套装id
        diffCombatPower 7: integer # 战斗力差值 仅待定区
    }

    .veinInfo {
        veinLevel 0: integer  # 灵脉等级
        veinExp 1: integer  # 灵脉经验
        learnLevel 2: integer  # 开悟等级
        attrs 3: *string  # 属性
        battleGems 4: *gems  # 战斗灵髓
        pendingGems 5: *gems  # 待处理灵髓
    }
]]

local c2s = [[

    veinLearn %d { #开悟
        request {
            count 0:integer # 消耗物品数量，不传为背包里所有开悟道具数量
        }

        response {
            errorcode 0:integer
            learnLevel 1:integer #开悟等级
            itemRemoves 2:*itemRemove
        }
    }

    veinExcite %d { #激发
        request {
            count 0:integer # 消耗物品数量
        }

        response {
            errorcode 0:integer
            pendingGems 1:*gems
            itemRemoves 2:*itemRemove
        }
    }

    attachGems %d { #佩戴灵髓
        request {
            discard 0: integer # 是否带遗忘 0：否 1：是
            gemsId 1: string # 灵髓id
        }

        response {
            errorcode 0:integer
            battleGems 1: *gems
            pendingGems 2: *gems
            itemInserts 3: *itemInsert # 遗忘单件灵髓掉落奖励
            veinLevel 4: integer  # 灵脉等级
            veinExp 5: integer  # 灵脉经验
            attrs 6: *string # 属性
        }
    }

    discardGems %d { #灵髓遗忘
        request {
            gemsIds 0: *string # 灵髓id，空值则遗忘所有待处理灵髓
        }

        response {
            errorcode 0:integer
            pendingGems 1: *gems
            itemInserts 2: *itemInsert # 遗忘多件灵髓掉落奖励
            veinLevel 3: integer  # 灵脉等级
            veinExp 4: integer  # 灵脉经验
        }
    }
]]

local s2c = [[

]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}