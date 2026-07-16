local types = [[

    .palaceInfo { # 宫殿信息
        playerId 0: string # 玩家id
        palaceId 1: integer # 宫殿id
        playerInfo 2: palacePlayerInfo # 玩家信息（上榜时）
        startTime 3: integer # 开始时间
    }

    .grantInfo { # 赐福信息
        playerId 0: string # 玩家id
        grantCfgId 1: integer # 赐福配置id
        palaces 2: *integer # 宫殿
    }

    .palaceLikeInfo { # 点赞信息
        daily 0: boolean # 首页点赞 类型1
        palace 1: *string # 点赞的宫殿id
        grant 2: *string # 赐福人id
        activity 3: *string # 活动id
    }

    .palacePlayerInfo {
        playerId 0: string # 玩家id
        name 1: string # 名字
        serverId 2: integer # 服务器id
        avatar 3: integer # 头像
        character 4: integer # 角色
        appearance 5: integer # 形象
        combatPower 6: integer # 战斗力
        phase 7: integer # 阶段
        level 8: integer # 等级
        mountType 9: integer # 坐骑类型
        mountSkin 10: integer # 坐骑皮肤ID
        summonPetProtoId 11: integer # 上阵宠物 原型id
        elitemonster 12: *elitemonster #上阵精怪信息
    }
]]

local c2s = [[

    palaceGetInfo %d { #获取琅琊榜当前信息

        request {
        }

        response {
            errorcode 0:integer
            grantInfo 1:*grantInfo
            palaceInfo 2:*palaceInfo
            isGrant 4: boolean # 今日是否赐福
            likeInfo 5: palaceLikeInfo # 点赞
            buffId 6:integer # buffId
            buffCount 7:integer # buff次数
        }
    }

    palaceGetHistoryInfo %d { #获取琅琊榜历史

        request {
            palaceId 0:integer # 宫殿id
        }

        response {
            errorcode 0:integer
            palaceHistoryInfo 1:*palaceInfo
        }
    }

    palaceLike %d { #琅琊榜点赞
        request {
            likeType 0: integer # 点赞类型 1：日常点赞 2：宫殿点赞 3：赐福点赞
            param 1: string # 参数，根据类型 类型1：无  类型2：宫殿id 类型3：赐福玩家id
            skipGrant 2: boolean # 跳过 赐福点赞
        }

        response {
            errorcode 0:integer
            buffId 1:integer # 日常点赞获得的buffId
            stone 2:integer # 点赞获取的玉璧
        }
    }

    palaceGrant %d { #琅琊榜赐福
        request {
            grantCfgId 0: integer # 赐福配置id
        }

        response {
            errorcode 0:integer
            itemInserts 1: *itemInsert # 新增物品
        }
    }

    palaceBuyGoods %d { #琅琊榜购买商品
        request {
            goodsId 0: integer # 商品id
        }

        response {
            errorcode 0:integer
            itemInserts 1: *itemInsert # 新增物品
            itemRemoves 2: *itemRemove # 移除物品
        }
    }
]]

local s2c = [[

    onPalaceReceiveGrant %d { # 收到赐福
        request {
            grantCfgId 0: integer # 赐福配置id
            playerId 1: string # 玩家id
            palaces 2: *integer # 宫殿
        }
    }

    onPalaceBuffEffect %d { # Buff生效
        request {
            buffId 0: integer # buff id
            buffCount 1: integer # 次数
            value 2: integer # 值
        }
    }

    onPalaceListed %d { # 新上榜
        request {
           palaceInfo 0:palaceInfo
        }
    }


]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}