local types = [[

    .swordConquestMonster {
        sceneId 0: integer # 场景id
        entityId 1:integer # 实体id
        x 2:integer # x坐标
        y 3:integer # y坐标
        cfgId 4: integer # 配置表id
        hp 5: integer # 血量
    }

    .swordConquestPickItem {
        sceneId 0: integer # 场景id
        entityId 1:integer # 实体id
        x 2:integer # x坐标
        y 3:integer # y坐标
        cfgId 4: integer # 配置表id
    }

    .swordConquestPlayer {
        sceneId 0: integer # 场景id
        entityId 1:integer # 实体id
        x 2:integer # x坐标
        y 3:integer # y坐标
        guid 4:string # id
        name 5:string # 名字
        serverId 6: integer # 区服
        avatar 7:integer # 头像
        character 8: integer # 角色
        appearance 9:integer # 形象
        combatPower 10:integer # 战力
        score 11: integer # 分数
    }
]]

local c2s = [[

    swordConquestGetActInfo %d { # 获取活动信息

        request {
        }

        response {
            errorcode 0:integer
            phase 1: integer # 活动阶段 1：关闭阶段 2：报名阶段 3：准备阶段 4：战斗阶段 5：祝贺阶段 6：公示阶段
        }

    }

    swordConquestGetSceneInfo %d { # 获取场景信息

        request {
            sceneId 0:integer # 场景id
        }

        response {
            errorcode 0:integer
            monsters 1: *swordConquestMonster # 怪物
            pickItems 2: *swordConquestPickItem # 拾取物品
        }
    }

    swordConquestGetPlayerInfo %d { # 获取多个玩家信息

        request {
            playerIds 0:*string # 玩家id
        }

        response {
            errorcode 0:integer
            playerInfo 1: *swordConquestPlayer # 玩家
        }
    }

    swordConquestEnroll %d { # 报名
        request {
        }

        response {
            errorcode 0:integer
        }
    }

    swordConquestEnter %d { # 进入
        request {
            sceneId 0:integer # 场景id
        }

        response {
            errorcode 0:integer
            x 1:integer # x坐标
            y 2:integer # y坐标
        }
    }

    swordConquestMove %d { # 移动
        request {
            x 0:integer # x坐标
            y 1:integer # y坐标
        }

        response {
            errorcode 0:integer
        }
    }

    swordConquestAttack %d { # 攻击
        request {
            entityId 0:integer # 实体id
        }

        response {
            errorcode 0:integer
        }
    }

    swordConquestThrowReward %d { # 丢出奖励
        request {
            x 0:integer # x坐标
            y 1:integer # y坐标
        }

        response {
            errorcode 0:integer
        }
    }

]]

local s2c = [[

    swordConquestActPhaseChange %d { # 活动阶段变化

        request {
            phase 0: integer # 活动阶段 1：关闭阶段 2：报名阶段 3：准备阶段 4：战斗阶段 5：祝贺阶段 6：公示阶段
        }
    }

    swordConquestOnMonsterChange %d { # 怪物变动

        request {
            event 0: integer # 事件 0：消失 1：新增
            monster 1: swordConquestMonster # 怪物
        }
    }

    swordConquestOnPickItemChange %d { # 拾取物品变动

        request {
            event 0: integer # 事件 0：消失 1：新增
            pickItem 1: swordConquestPickItem # 拾取物品
        }
    }

    swordConquestOnPlayerChange %d { # 玩家变动

        request {

        }
    }

    swordConquestOnBattleRankChange %d { # 排行榜变动 （战斗中）

        request {

        }
    }

]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}