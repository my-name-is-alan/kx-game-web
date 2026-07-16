local types = [[

    .funds { #
        level 0: fund # 修为基金
        stage 1: fund # 冒险基金
        evolution 2: fund # 仙树基金
        tower 3: fund # 镇妖塔基金
        dhama 4: fund # 法宝基金
    }
    .fund {
        awardId 0:integer # 已领取基础奖励ID
        awardExtraId 1:integer # 已领取超值奖励ID
    }
]]

local c2s = [[
    takeFundsBonuses %d { # 领取奖励
        request {
            id 0: integer #基金ID
        }

        response {
            errorcode 0:integer
            awardId 1:integer # 已领取基础奖励ID
            awardExtraId 2:integer # 已领取超值奖励ID
            bonusesResultArr 3:*bonusesResult
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