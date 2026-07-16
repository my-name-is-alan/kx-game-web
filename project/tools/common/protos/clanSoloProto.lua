local types = [[

    .clanSoloOpen {  # 活动信息
        isOpen 0: boolean # 是否开启
    }

    .clanSoloInfo { # 活动信息
        state 0: integer # 阶段  1：关闭 2：报名 3：准备 4：战斗 5：结算
        nextStateTime 1: integer # 下一阶段时间戳
        servers 2: *integer # 参与活动区服
        startTime 3: integer # 活动开启时间
        endTime 4: integer # 活动结束时间
    }

    .clanSoloClanInfo { # 帮派信息
        serverId 0:integer # 服务id
        clanId 1: string # 帮派id
        name 2: string # 帮派名
        number 3: integer # 人数
        phase 4: integer # 阶段
        level 5: integer # 等级
        flag 6: integer # 旗帜
        rankOf 7: integer # 排名
        score 8: integer # 分数
        fightCount 9: integer # 出战次数
    }

    .clanSoloOpponentPlayer { # 对手信息
        playerId 0: string # 对手id
        name 1: string # 名字
        character 2: integer # 角色
        avatar 3: integer # 头像
        appearance 4: integer # 形象
        combatPower 5: integer # 战斗力
        phase 6: integer # 阶段
        level 7: integer # 等级
        mountType 8: integer # 坐骑类型
        mountSkin 9: integer # 坐骑皮肤ID
        summonPetProtoId 10: integer # 上阵宠物id
        title 11: integer # 称号
        winScore 12: integer # 胜利积分
        scoreScale 13: integer # 积分倍数
    }

    .clanSoloPlayerInfo { # 他人信息
        playerId 0: string # 玩家id
        name 1: string # 名字
        character 2: integer # 角色
        avatar 3: integer # 头像
        appearance 4: integer # 形象
        combatPower 5: integer # 战斗力
        phase 6: integer # 阶段
        level 7: integer # 等级
        mountType 8: integer # 坐骑类型
        mountSkin 9: integer # 坐骑皮肤ID
        summonPetProtoId 10: integer # 上阵宠物id
        title 11: integer # 称号
        rankOf 12: integer # 排名
        score 13: integer # 积分
    }

    .clanSoloMyselfInfo { # 单刀赴会个人
        passport 0: integer # 通行证 0：低级 1：中级 2：高级 3：中高级都有
        passportLevel 1: integer # 通行证等级
        prestige 2: integer # 声望
        oncePrestige 3: integer # 本轮声望
        lowPassportClaimedLevel 4: integer # 低级通行证已领取奖励的等级
        midPassportClaimedLevel 5: integer # 中级通行证已领取奖励的等级
        highPassportClaimedLevel 6: integer # 高级通行证已领取奖励的等级
        playerTaskCount 7: integer # 个人任务领取数
        clanTaskCount 8: integer # 帮派任务领取数
        winCount 9: integer # 胜利次数
        onceWinCount 10: integer # 本次战斗胜利次数（连胜）
        physical 11: integer # 体力
        nextPhysicalRecoverTime 12: integer # 下一次体力恢复时间戳
        energy 13: integer # 精力
        fightHP 14: integer # 战斗血量
        fightHPMax 15: integer # 战斗血量上限
        fightAttrs 16: *string # 本次战斗的属性
        combatPower 17: integer # 战力
        buffId 18: integer # 选择BuffId
        score 19: integer # 积分
        rankOf 20: integer # 排名
        isFighting 21: boolean # 是否在挑战
        isLiking 22: boolean # 是否点赞
        hasJoin 23: boolean # 是否参与活动
        winScoreChange 24: integer # 本次战斗帮派获得的总积分
        fightCount 25: integer # 出战次数
    }

    .clanSoloFightRecord { # 战报信息
        id 0: integer # 记录id
        playerId 1: string # 挑战者id
        playerClanId 2: string # 挑战者帮派id
        targetClanId 3: string # 被挑战帮派id
        playerClanInfo 4: clanSoloClanInfo # 挑战者帮派信息
        targetClanInfo 5: clanSoloClanInfo # 被挑战者帮派信息
        fightFrom 6: integer # 战斗来源 0：匹配 1：挑战 2：反击
        winCount 7: integer # 击败数
        winScore 8: integer # 击败积分
        preLossScore 9: integer # 被挑战者帮派每人扣除的积分
        createTime 10: integer # 创建时间
        playerInfo 11: clanSoloPlayerInfo # 挑战者个人信息
    }

    .clanSoloBuyGoods { # 商店购买
        cfgId 0: integer # 配置表id
        count 1: integer # 数量
    }

    .clanSoloBuyGift { # 礼包购买
        cfgId 0: integer # 配置表id
        count 1: integer # 数量
    }
]]

local c2s = [[

    clanSoloGetInfo %d { #获取当前信息

        request {
        }

        response {
            errorcode 0:integer
            clanSoloInfo 1: clanSoloInfo
            myselfClanInfo 2: clanSoloClanInfo
            clanSoloMyselfInfo 3: clanSoloMyselfInfo
            clanSoloBuyGoods 4: *clanSoloBuyGoods
            clanSoloBuyGift 5: *clanSoloBuyGift
            opponentClanInfo 6: clanSoloClanInfo # 挑战帮派
            opponentPlayers 7: *clanSoloOpponentPlayer # 挑战对手
        }
    }

    clanSoloGoodsBuy %d { # 商店购买
        request {
            goodsId 0: integer # 商品id
            count 1: integer # 次数
        }

        response {
            errorcode 0:integer
            itemInserts 1: *itemInsert # 新增物品
            money 2: integer # 新增云英
            prestige 3: integer # 声望
            clanSoloBuyGoods 4: *clanSoloBuyGoods
        }
    }

    clanSoloGiftBuy %d { # 礼包购买
        request {
            giftId 0: integer # 礼包id
        }

        response {
            errorcode 0:integer
            bonusesResult 1: bonusesResult  # 奖励
            clanSoloBuyGift 2: *clanSoloBuyGift
        }
    }

    clanSoloFinishTask %d { # 完成任务（一次领取）
        request {
            type 0: integer # 1：个人任务 2：帮派任务
        }

        response {
            errorcode 0:integer
            bonusesResult 1: bonusesResult  # 奖励
            playerTaskCount 2: integer # 个人任务领取数
            clanTaskCount 3: integer # 帮派任务领取数
        }
    }

    clanSoloClaimPassportReward %d { # 领取通行证奖励
        request {
        }

        response {
            errorcode 0:integer
            itemInserts 1: *itemInsert # 新增物品
            lowPassportClaimedLevel 2: integer # 低级通行证已领取奖励的等级
            midPassportClaimedLevel 3: integer # 中级通行证已领取奖励的等级
            highPassportClaimedLevel 4: integer # 高级通行证已领取奖励的等级
        }
    }

    getClanSoloClanRanks %d { # 获取帮派排行榜
        request {
            from 0: integer # 开始位置
            to 1: integer # 结束位置
        }

        response {
            errorcode 0:integer
            clanRanks 1: *clanSoloClanInfo
            myClanRankOf 2: integer # 本帮派排名
            myClanRankScore 3: integer # 本帮派排名积分
        }
    }

    getClanSoloPlayerRanks %d { # 获取个人排行榜
        request {
            from 0: integer # 开始位置
            to 1: integer # 结束位置
        }

        response {
            errorcode 0:integer
            playerRanks 1: *clanSoloPlayerInfo
            myRankOf 2: integer # 本人排名
            myRankScore 3: integer # 本人排名积分
        }
    }

    clanSoloAddPhysical %d { # 补充体力
        request {
            count 0:integer # 次数
        }

        response {
            errorcode 0:integer
            itemRemoves 1: *itemRemove
            physical 2: integer # 体力
            nextPhysicalRecoverTime 3: integer # 下一次体力恢复时间戳
        }
    }

    clanSoloFightMatch %d { # 战斗匹配
        request {
        }

        response {
            errorcode 0:integer
            physical 1: integer # 体力
            nextPhysicalRecoverTime 2: integer # 下一次体力恢复时间戳
            energy 3: integer # 精力
            buffId 4: integer # buffId
            fightHP 5: integer # 战斗现有血量
            fightHPMax 6: integer # 战斗血量上限
            fightAttrs 7: *string # 本次战斗的属性
            combatPower 8: integer # 战力
            isFighting 9: boolean # 是否在挑战
            onceWinCount 10:integer # 胜利次数
            opponentClanInfo 11: clanSoloClanInfo # 挑战帮派
            opponentPlayers 12: *clanSoloOpponentPlayer # 挑战对手
            fightCount 13: integer # 个人出战次数
            clanFightCount 14: integer # 帮派出战次数
            itemRemoves 15: *itemRemove
        }
    }

    clanSoloChallenge %d { # 挑战或反击
        request {
            recordId 0: integer # 战报id
            from 1: integer # 1：挑战 2：反击
        }

        response {
            errorcode 0:integer
            energy 1: integer # 精力
            buffId 2: integer # buffId
            fightHP 3: integer # 战斗现有血量
            fightHPMax 4: integer # 战斗血量上限
            fightAttrs 5: *string # 本次战斗的属性
            combatPower 6: integer # 战力
            isFighting 7: boolean # 是否在挑战
            onceWinCount 8:integer # 胜利次数
            opponentClanInfo 9: clanSoloClanInfo # 挑战帮派
            opponentPlayers 10: *clanSoloOpponentPlayer # 挑战对手
            itemRemoves 11: *itemRemove
            fightCount 12: integer # 个人出战次数
            clanFightCount 13: integer # 帮派出战次数
        }
    }

    clanSoloBuyBuff %d { # 购买buff
        request {
            buffId 0: integer # buffId
        }

        response {
            errorcode 0:integer
            fightHP 1: integer # 战斗血量
            fightHPMax 2: integer # 战斗血量上限
            fightAttrs 3: *string # 本次战斗的属性
            combatPower 4: integer # 战力
            combatPowerChange 5: integer # 战力变化
        }
    }

    clanSoloFight %d { # 战斗
        request {
            opponentId 0: string # 战斗玩家ID，不传或空则一键挑战
        }

        response {
            errorcode 0:integer
            prestige 1:integer # 声望
            oncePrestige 2: integer # 本轮声望
            passportLevel 3:integer # 通行证等级
            winCount 4:integer # 胜利次数
            onceWinCount 5:integer # 本次战斗胜利次数
            energy 6: integer # 精力
            fightHP 7: integer # 战斗现有血量
            fightHPMax 8: integer # 战斗血量上限
            fightAttrs 9: *string # 本次战斗的属性
            combatPower 10: integer # 战力
            combatPowerChange 11: integer # 战力变化
            isFighting 12: boolean # 是否在挑战
            isEnd 13: boolean # 是否结束
            playerScore 14: integer # 个人积分
            clanScore 15: integer # 帮派积分
            scoreChange 16: integer # 打一个人获得的积分
            winScoreChange 17: integer # 本次战斗帮派获得的总积分
            lossScoreChange 18: integer # 本次战斗对方帮派积分
            fightFrom 19: integer # 战斗来源 0：匹配 1：挑战 2：反击
            opponentPlayers 20: *clanSoloOpponentPlayer # 挑战对手
            battleResult 21: battleResult # 战斗结果 一键挑战不返回
            clanRankOf 22: integer # 帮派排名
            playerRankOf 23: integer # 个人排名
            opponentHP 24: integer # 对手剩余血量
        }
    }

    getClanSoloChallengeList %d { # 获取挑战战报
        request {
        }

        response {
            errorcode 0:integer
            recordList 1: *clanSoloFightRecord # 战报
        }
    }

    getClanSoloCounterList %d { # 获取反击战报
        request {
        }

        response {
            errorcode 0:integer
            recordList 1: *clanSoloFightRecord # 战报
        }
    }

    clanSoloLike %d { # 结算点赞
        request {
        }

        response {
            errorcode 0:integer
            stone 1: integer # 奖励玉璧
        }
    }

    getClanSoloFinishInfo %d { # 获取结算信息
        request {
        }

        response {
            errorcode 0:integer
            top1PlayerId 1: string # 榜一玩家id
            top3ClanInfo 2: *clanSoloClanInfo # 前三帮派
        }
    }

]]

local s2c = [[

    onClanSoloPhysicalChange %d { # 体力变动
        request {
            physical 0: integer # 体力
            physicalRecoverTime 1: integer # 体力最终恢复时间
            nextPhysicalRecoverTime 2: integer # 下一次体力恢复时间
        }
    }

    onClanSoloClanFightCountChange %d { # 帮派出战次数变动
        request {
            clanFightCount 0: integer # 帮派出战次数
        }
    }

    onClanSoloPayGift %d { # 礼包支付
        request {
            bonusesResult 0: bonusesResult  # 奖励
            clanSoloBuyGift 1: *clanSoloBuyGift
        }
    }

    onClanSoloPayPassport %d { # 通行证支付
        request {
            type 0: integer # 支付到账通行证类型 1：中级 2：高级
            passport 1: integer # 现有通行证 0：低级 1：中级 2：高级 3：中高级都有
            stone 2: integer # 赠送玉璧
        }
    }

    onClanSoloOpen %d { # 开启
        request {
            clanSoloOpen 0: clanSoloOpen
        }
    }

    onClanSoloShopRefresh %d { # 每日商店刷新
        request {
            clanSoloBuyGoods 0: *clanSoloBuyGoods
            clanSoloBuyGift 1: *clanSoloBuyGift
        }
    }

]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}