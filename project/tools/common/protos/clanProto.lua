local types = [[

    .clan {
        clanInfo 1: clanInfo
        clanMember 2:*clanMember
        myselfInfo 3:clanMember
        clanApply 4:*clanApply # 仅帮主和副帮主
        clanBuy 5:*clanBuy
        clanLog 6:*clanLog
        clanRecharge 7:*clanRecharge
        clanFlag 8:*clanFlag
    }

    .clanInfo {
        guid 0:string # 帮派id
        shortId 1:string # 短id
        name 2: string # 帮派名
        phase 3: integer # 头衔 阶段
        highestPhase 4: integer # 最高头衔 阶段
        number 5: integer # 人数
        level 6: integer # 等级
        exp 7: integer # 帮派经验
        flag 8: integer # 旗帜
        leader 9: string # 帮主id
        contact 10: string # 联系方式
        combatPower 11: integer # 战力
        notice 12: string # 公告
        declaration 13: string # 宣言
        needApply 14: integer # 需要申请 0：否 1：是
        mixPlayerPhase 15: integer # 最小玩家阶段
        dailyActiveScore 16: integer # 当日活跃分
        merchantId 17: integer # 神秘商人id
        merchantTime 18: integer # 神秘商人结束时间戳
        merchantPrice 19: integer # 神秘商人礼包价格
        bargainNumber 20: integer # 议价人数
        duelMonsterId 21: integer # 挑战怪物重数id
        duelMonsterHP 22: integer # 挑战怪物血量
        duelRewardNum 23: integer # 挑战奖励数量
        duelBuffCount 24: integer # 挑战布阵次数
        rechargeEventId 25: integer # 充值活动id (event)
        rechargeTime 26: integer # 活动充值结束时间戳
    }

    .clanMember {
        clan 0: string #帮派id
        playerId 1: string # 玩家id
        role 2: integer # 职位 0：非成员 1：普通成员 2：精英 9：副帮主 10：帮主
        evolveHelpLevel 3: integer # 协助发展等级
        evolveHelpCount 4: integer # 协助发展次数
        evolveHelper 5: string # 协助人,逗号隔开
        clanPoint 6: integer # 当前公会贡献值
        dailyPoint 7: integer # 当日贡献值
        dailyActiveNode 8: string # 当日活跃奖励节点
        dailyDuelBuffTime 9: integer # 当日布阵时间 0：没有布阵
        dailyDuelAvailableCount 10: integer # 当日剩余挑战次数
        dailyDuelDamage 11: integer # 当日挑战伤害
        dailyDuelRewardNum 12: integer # 当日挑战奖励领取数量
        dailyDuelMonsterReward 13: integer # 当日已领取击败怪物奖励 monster配置id
        merchantStatus 14: integer # 神秘商店状态 0：未议价 1：已议价 2：已购买
        bargainPrice 15: integer # 议价
        bargainTime 16: integer # 议价时间戳
        joinTime 17: integer # 加入帮派时间戳
        leaveTime 18: integer # 退出帮派时间戳
        claimRechargeCount 19: integer # 领取充值奖励次数
        point 20:integer # 贡献值
        glory 21:integer # 荣耀值
        rare 22:integer # 九游秘宝值
        playerInfo 23: simplePlayerBase # 玩家基本信息
        isOnline 24: boolean # 是否在线
    }

    .clanApply { # 申请列表
        playerId 0: string # 玩家id
        applyTime 1: integer # 申请时间戳
        playerInfo 2: simplePlayerBase # 玩家基本信息
    }

    .clanBuy { # 购买信息
        goodsId 0: integer # 商品id
        count 1: integer # 已购买数量
    }

    .clanLog { # 帮派动态
        log 0: string # 动态
        type 1: integer # 类型
        createTime 2: integer # 时间戳
    }

    .clanRecharge { # 帮派充值
        playerId 0: string # 玩家id
        name 1: string # 玩家名
        amount 2: integer # 充值数量
    }

    .clanFlag { # 帮派旗帜
        flagId 0: integer # 旗帜id （配置表）
        expire 1: integer # 有效期
    }

    .clanSimpleInfo { # 帮派简略信息
        rankOf 0: integer # 排行
        clanId 1: string # 帮派id
        shortId 2: string # 帮派短id
        name 3: string # 帮派名字
        phase 4: integer # 头衔 阶段
        number 5: integer # 人数
        level 6: integer # 等级
        exp 7: integer # 贡献值
        flag 8: integer # 旗帜
        leader 9: string # 帮主id
        leaderName 10: string # 帮主名字
        combatPower 11: integer # 战力
        notice 12: string # 公告
        needApply 13: integer # 需要申请 0：否 1：是
        mixPlayerPhase 14: integer # 最小玩家阶段
        selfApply 15: integer # 本人是否申请 0：否 1：是
    }

    .clanMemberSimpleInfo { # 帮派成员简略信息
        rankOf 0: integer # 排行
        playerId 1: string # 成员id
        name 2: string # 成员名字
        phase 3: integer # 成员阶段
        level 4: integer # 等级
        combatPower 5: integer # 战力
        clanPoint 6: integer # 当前公会贡献值
        dailyDuelDamage 7: integer # 当日挑战伤害
        mountType 8:integer #坐骑类型
        mountSkin 9:integer #坐骑皮肤
        summonPetProtoId 10:integer #宠物原型id
        character 11: integer #角色
        appearance 12:integer #形象
        avatar 13:integer #头像
        avatarBorder 14:integer #头像框
        title 15:integer #称号
        evolutionLevel 16:integer #发展等级
   	    evolveFinishTime 17:integer #发展升级完成时间戳
    }

]]

local c2s = [[

    getMyClanInfo %d { #获取我的帮派信息
        request {
        }

        response {
            errorcode 0:integer
            clanInfo 1: clanInfo
            clanMember 2:*clanMember
            myselfInfo 3:clanMember
            clanApply 4:*clanApply # 仅帮主和副帮主
            clanBuy 5:*clanBuy
            clanLog 6:*clanLog
            clanRecharge 7:*clanRecharge
            clanFlag 8:*clanFlag
        }
    }

    joinClan %d { #加入帮派
        request {
            clanId 0:string # 帮派id 填空或不填则随机加入
        }

        response {
            errorcode 0:integer
            clanInfo 1: clanInfo
            clanMember 2:*clanMember
            myselfInfo 3:clanMember
            clanApply 4:*clanApply # 仅帮主和副帮主
            clanBuy 5:*clanBuy
            clanLog 6:*clanLog
            clanRecharge 7:*clanRecharge
            clanFlag 8:*clanFlag
        }
    }

    createClan %d { #创建帮派
        request {
            name 0:string # 帮派名
            flag 1:integer # 旗帜
            needApply 2:integer # 是否需要申请 0：否 1：是
            notice 3:string # 公告
            declaration 4:string # 宣言
        }

        response {
            errorcode 0:integer
            clanInfo 1: clanInfo
            clanMember 2:*clanMember
            myselfInfo 3:clanMember
            clanApply 4:*clanApply # 仅帮主和副帮主
            clanBuy 5:*clanBuy
            clanLog 6:*clanLog
            clanRecharge 7:*clanRecharge
            clanFlag 8:*clanFlag
        }
    }

    transferLeader %d { #转让帮主
        request {
            playerId 0:string # 玩家id
        }

        response {
            errorcode 0:integer
            clanInfo 1: clanInfo
            clanMember 2:*clanMember
            myselfInfo 3:clanMember
            clanApply 4:*clanApply
            clanBuy 5:*clanBuy
            clanLog 6:*clanLog
            clanRecharge 7:*clanRecharge
            clanFlag 8:*clanFlag
        }
    }

    leaveClan %d { #退出帮派
        request {
        }

        response {
            errorcode 0:integer
            dissolve 1: integer # 是否解散 0：否 1：是
            myselfInfo 2:clanMember
        }
    }

    dissolveClan %d { #解散帮派
        request {
        }

        response {
            errorcode 0:integer
            myselfInfo 1:clanMember
        }
    }

    clanKickMember %d { #踢出成员
        request {
            playerId 0:string # 玩家id
        }

        response {
            errorcode 0:integer
            clanInfo 1: clanInfo
        }
    }

    clanApproveMember %d { #审批准成员
        request {
            playerId 0:string # 玩家id 不带参数默认拒绝所有
            pass 1:integer # 是否通过 0：否 1：是
        }

        response {
            errorcode 0:integer
            clanInfo 1: clanInfo
            clanMember 2:*clanMember
            clanApply 3:*clanApply
        }
    }

    clanDesignateMember %d { #任命
        request {
            playerId 0:string # 玩家id
            role 1:integer # 权限 1：普通成员 2：精英 9：副帮主 10：帮主
        }

        response {
            errorcode 0:integer
            clanInfo 1: clanInfo
            clanMember 2:clanMember
        }
    }

    clanRename %d { #帮派改名
        request {
            name 0:string # 帮派名
        }

        response {
            errorcode 0:integer
            clanInfo 1:clanInfo
        }
    }

    clanEditInfo %d { #编辑信息 不填不修改
        request {
            flag 0:integer # 旗帜
            contact 1:string # 联系方式 微信号
            needApply 2:integer # 是否需要申请 0：否 1：是
            notice 3:string # 公告
            declaration 4:string # 宣言
            mixPlayerPhase 5:integer # 申请玩家至少的阶段
        }

        response {
            errorcode 0:integer
            clanInfo 1:clanInfo
        }
    }

    searchClanInfo %d { # 搜索帮派
        request {
            keyword 0:string # 关键字 id或名字
        }

        response {
            errorcode 0:integer
            clanList 1: *clanSimpleInfo
        }
    }

    getClanRank %d { #获取帮派排行
        request {
        }

        response {
            errorcode 0:integer
            clanList 1: *clanSimpleInfo
        }
    }

    getMembersByClan %d { #获取帮派下成员列表
        request {
            clanId 0:string # 帮派id
        }

        response {
            errorcode 0:integer
            members 1: *clanMember
        }
    }

    clanBuyGoods %d { #购买商品
        request {
            goodsId 0:integer # 商品id
            count 1:integer # 次数
        }

        response {
            errorcode 0:integer
            itemInserts 1: *itemInsert # 购买增加的道具
            money 2: integer # 购买的灵石
            stone 3: integer # 购买的玉璧
        }
    }

    clanMerchantBargain %d { #神秘商人 砍价
        request {
        }

        response {
            errorcode 0:integer
        }
    }

    clanMerchantBuy %d { #神秘商人 购买
        request {
        }

        response {
            errorcode 0:integer
            itemInserts 1: *itemInsert # 购买增加的道具
            money 2: integer # 购买的灵石
            stone 3: integer # 购买的玉璧
        }
    }

    clanEvolveSpeedUp %d { #助力鱼塘
        request {
            playerId 0:string # 玩家id
        }

        response {
            errorcode 0:integer
        }
    }

    clanEvolveSpeedUpReq %d { #请求助力鱼塘
        request {
        }

        response {
            errorcode 0:integer
        }
    }

    clanClaimActive %d { #领取活跃奖励
        request {
        }

        response {
            errorcode 0:integer
            claimReward 1: bonusesResult  # 奖励
        }
    }

    clanDuelBuff %d { #禁地布阵
        request {
        }

        response {
            errorcode 0:integer
        }
    }

    clanDuel %d { #禁地挑战
        request {
        }

        response {
            errorcode 0:integer
            battleResult 1: battleResult # 战斗结果
            damage 2: integer # 伤害
            damageRewardCount 3: integer # 奖励次数
        }
    }

    getClanDuelDamageRank %d { #禁地挑战伤害排行
        request {
        }

        response {
            errorcode 0:integer
            members 1: *clanMemberSimpleInfo # 帮派成员简略信息
            myRankOf 2: integer # 本玩家排名
        }
    }

    clanDuelClaimReward %d { #禁地领取奖励
        request {
        }

        response {
            errorcode 0:integer
            claimReward 1: bonusesResult  # 奖励
        }
    }

   clanClaimRecharge %d { #领取帮派充值奖励
        request {
        }

        response {
            errorcode 0:integer
            claimReward 2: bonusesResult  # 奖励
        }
    }

]]

local s2c = [[

    onClanInfoChange %d { # 帮派信息变动

        request {
            clanInfo 0:clanInfo
        }
    }

    onClanFlagChange %d { # 帮派旗帜变动

        request {
            clanFlag 0: *clanFlag
        }
    }

    onClanMemberChange %d { # 帮派成员变动

        request {
            clanMember 0:clanMember
        }
    }

    onClanApplyAdd %d { # 帮派申请新增

        request {
            clanApply 0: clanApply
        }
    }

    onClanApplyRemove %d { # 帮派申请移除

        request {
            playerId 0: string # 帮派申请的玩家id
        }
    }

    onClanLogAdd %d { # 帮派动态添加

        request {
            clanLog 0:clanLog
        }
    }

    onClanBuyChange %d { # 帮派购买信息变动

        request {
            clanBuy 0: clanBuy # 变动的购买信息， 如果新id为新增
        }
    }

    onClanRechargeAdd %d { # 帮派充值新增

        request {
            clanRecharge 0: clanRecharge
        }
    }

    onClanDissolve %d { # 帮派解散

        request {
        }
    }

    onClanDuelLogClean %d { # 帮派禁地挑战动态清空

        request {
        }
    }

    onDuelBuffAdd %d { # 布阵

        request {
            playerId 0: string # 玩家id
        }
    }

    onMerchantCreate %d { # 神秘商人创建

        request {
            merchantId 0: integer # 神秘商人id
            merchantTime 1: integer # 神秘商人结束时间戳
        }
    }

    onClanEvolveHelpReceive %d { # 收到协助请求

        request {
            playerId 0: string # 玩家id
        }
    }

    onClanDailyRefresh %d { #  帮派日常刷新

        request {
            duelMonsterId 0: integer # 挑战怪物重数id
            duelMonsterHP 1: integer # 挑战怪物血量
            duelRewardNum 2: integer # 挑战奖励数量
            duelBuffCount 3: integer # 挑战布阵次数
            dailyActiveScore 4: integer # 当日活跃分
            dailyPoint 5: integer # 当日贡献值
            dailyActiveNode 6: string # 当日活跃奖励节点
            dailyDuelBuffTime 7: integer # 当日布阵时间 0：没有布阵
            dailyDuelAvailableCount 8: integer # 当日剩余挑战次数
            dailyDuelDamage 9: integer # 当日挑战伤害
            dailyDuelRewardNum 10: integer # 当日挑战奖励领取数量
            dailyDuelMonsterReward 11: integer # 当日已领取击败怪物奖励 monster配置id
        }
    }

]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}