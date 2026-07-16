local types = [[

    .rankPlayer { # 排行榜玩家
        guid 0:string #玩家id
        name 1:string #名称
        combatPower 2:integer #战斗力
        phase 3:integer #阶段
        duelScore 4:integer #斗法积分
        rankOf 5:integer #名次
        robot 6:integer #是否为机器人(monster)
        mountType 7:integer #坐骑类型
        mountSkin 8:integer #坐骑皮肤
        summonPet 9:string #宠物
        character 10: integer #角色
        appearance 11:integer #形象
        avatar 12:integer #头像
        avatarBorder 13:integer #头像框
        title 14:integer #称号
        score 15:integer #积分
    }

    .duelRecord { #斗法记录
        opponent 0:rankPlayer #对手信息
        side 1:integer #方向 0：挑战对手 1：被对手挑战
        won 2:integer #是否赢下 0：否 1：是
        canCounter 3:integer #是否可以反击 0：否 1：是
        scoreChange 4:integer #斗法积分变化
        timestamp 5:integer #时间
    }

   .duelInfo { # 斗法信息
        rankOf 0: integer
        duelScore 1: integer
        duelRecord 2: *duelRecord
        duelList 3: *rankPlayer
    }
]]

local c2s = [[

    duel %d { #挑战
        request {
            opponentId 0:string # 对手Id 对手列表和反击
        }

        response {
            errorcode 0:integer
            itemRemoves 1:*itemRemove
            rankOf 2: integer
            duelScore 3: integer
            duelRecord 4: *duelRecord
            duelList 5: *rankPlayer
            battleResult 6: battleResult
            victoryReward 7: bonusesResult  # 奖励
            companionBoostReward 8: bonusesResult  # 兽友加成奖励
            myScoreChange 9: integer # 我方积分变化
            oppScoreChange 10: integer # 对手积分变化
            oppScore 11: integer # 对手积分
            itemInserts 12: *itemInsert #可能有金手指枸杞
        }
    }

    getDuelInfo %d { #获取斗法信息
        response {
            errorcode 0:integer
            rankOf 1: integer
            duelScore 2: integer
            duelRecord 3: *duelRecord
            duelList 4: *rankPlayer
        }
    }

    refreshDuelList %d { #刷新斗法名单
        response {
            errorcode 0:integer
            duelList 1: *rankPlayer
        }
    }

    getDuelRank %d { #获取排行榜
        request {
            from 0:integer # 排名开始
            to 1:integer # 排名结束
        }

        response {
            errorcode 0:integer
            ranks 1: *rankPlayer
            rankOf 2: integer
            duelScore 3: integer
        }
    }

]]

local s2c = [[

    onDuelInfoChange %d { # 斗法积分变动
        request {
   	        duelScore 0:integer # 斗法积分
   	        rankOf 1: integer # 斗法排行
   	        duelRecord 2: *duelRecord # 斗法记录
        }
    }

    onDuelListChange %d { # 斗法名单变动
        request {
   	        duelList 0: *rankPlayer
        }
    }

]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}