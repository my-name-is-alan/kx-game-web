local types = [[

    .equip { #
        eid 0: string # 装备实例编号
        cid 1: integer # 装备配置表编号
        slot 2: integer # 部位
        quality 3: integer # 品质
        level 4: integer # 装备等级
        attrs 5: string # 属性
        diffCombatPower 6: integer # 战斗力差值 仅锤炼区
    }

]]

local c2s = [[

    forge %d { #锤炼
        request {
            count 0:integer # 次数
            attr1 1:integer # 自动锤炼指向战斗属性1
            attr2 2:integer # 自动锤炼指向战斗抗性1
            attr3 3:integer # 自动锤炼指向战斗属性2
            attr4 4:integer # 自动锤炼指向战斗抗性2
        }

        response {
            errorcode 0:integer
            forgeEquips 1: *equip
            itemRemoves 2: *itemRemove
            dropReward 3: bonusesResult # 多件装备掉落奖励
            itemInserts 4:*itemInsert #可能有金手指奖励的枸杞
        }
    }

    attachEquip %d { #穿戴装备
        request {
            breakdown 0: integer # 是否带分解 0：否 1：是
            equipId 1: string # 装备id
        }

        response {
            errorcode 0:integer
            battleEquips 1: *equip
            forgeEquips 2: *equip
        }
    }

    breakdown %d { #装备分解
        request {
            equipIds 0: *string # 装备id，空值则分解所有锤炼区装备
        }

        response {
            errorcode 0:integer
            forgeEquips 1: *equip
        }
    }

]]

local s2c = [[

    onForgeEquipAdd %d { # 增加锻造区装备
        request {
           forgeEquip 0: equip
        }
    }
]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}