local types = [[

    .conquestMonsterEntity { # 怪物实体
        id 0:integer # 怪物id
        monsterForkId 1: integer # 怪物生成id
        x 2:double
        y 3:double
        hp 4:integer # 血量
        showTime 5: integer # 显示时间 （隐藏时不可被攻击）
    }

    .conquestPlayerEntity { # 玩家实体
        id 0:string # 玩家id
        x 1:double
        y 2:double
        size 3:integer # 大小 （直径）
        attackRange 4:integer # 攻击范围
        hp 5:integer # 血量
        hpMax 6: integer # 血量上限
        nextAttackTime 7: integer # 下次攻击时间
        freeTime 8: integer # 下次空闲时间 （脱战）
        stunTime 9: integer # 眩晕解除时间
        reviveTime 10: integer # 可复活时间
        streakKill 11: integer # 连杀
        totalKill 12: integer # 累杀
    }

    .conquestActivityInfo { # 活动信息
        phase 0: integer # 阶段  1：关闭 2：报名 3：准备 4：战斗 5：结算
        nextPhaseTime 1: integer # 下一阶段时间戳
        servers 2: *integer # 参与活动区服
        startTime 3: integer # 活动开启时间
        endTime 4: integer # 活动结束时间
        sceneId 5: integer # 场景id 0：场景未生成
    }

   .conquestClanInfo { # 帮派信息
        serverId 0:integer # 服务id
        clanId 1: string # 帮派id
        name 2: string # 帮派名
        number 3: integer # 人数
        phase 4: integer # 阶段
        level 5: integer # 等级
        flag 6: integer # 旗帜
        rankOf 7: integer # 排名
        score 8: integer # 分数
    }

    .conquestPlayerInfo { # 他人信息
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
        serverId 14: integer # 服务器id
    }

   .conquestTopClanInfo { # top帮派信息
        serverId 0:integer # 服务id
        clanId 1: string # 帮派id
        name 2: string # 帮派名
        flag 3: integer # 旗帜
    }

    .conquestTopPlayerInfo { # top个人信息
        serverId 0: integer # 服务器id
        playerId 1: string # 玩家id
        name 2: string # 名字
        character 3: integer # 角色
        appearance 4: integer # 形象
        phase 5: integer # 阶段
        title 6: integer # 称号
    }

    .conquestMyInfo { # 我的玩家信息
        isEnroll 0: boolean # 是否报名
        isLiking 1: boolean # 是否点赞
        claimClanScoreReward 2: boolean # 是否领取帮派积分排行奖励
        claimPlayerKillReward 3: boolean # 是否领取个人击杀排行奖励
        streakKill 4: integer # 连杀
        totalKill 5: integer # 累杀
        combatRankOf 6: integer # 战斗力排名
        clanScoreRankOf 7: integer # 帮派积分排名
        playerKillRankOf 8: integer # 个人击杀排名
    }

    .conquestTask { # 任务信息
        taskId 0: integer # 任务id
        value 1:integer # 当前值
        status 2:integer # 状态 1：未完成 2：已完成 3：已领取
    }

    .conquestPlayerBattle { # 玩家战斗信息
        round 0: integer # 轮次
        side 1: integer # 方向 1：A打B 2：B打A
        hpA 2: integer # A血量
        hpB 3: integer # B血量
        damage 4: integer # 伤害
        steal 5: integer # 吸取
        miss 6: boolean # 是否闪避
        critical 7: boolean # 是否暴击
        stun 8: boolean # 是否眩晕
        counter 9: boolean # 是否反击
        combo 10: boolean # 是否连击
    }

    .conquestMonsterBattle { # 怪物战斗信息
        monsterHP 0: integer # 怪物血量
        playerHP 1: integer # 玩家血量
        playerDamage 2: integer # 玩家造成伤害
        monsterDamage 3: integer # 怪物造成伤害
        healing 4: integer # 玩家回血量
    }

    .conquestPlayerFeature { # 玩家信息
        playerId 0:string # 玩家id
        name 1: string # 名字
        avatar 2: integer # 头像
        clanId 3: string # 帮派id
        character 4: integer # 角色
        phase 5: integer # 阶段
        combatRankOf 6: integer # 战斗力排名
    }
]]

local c2s = [[

    getConquestInfo %d { # 获取八荒信息
        request {
        }

        response {
            errorcode 0:integer
            activityInfo 1: conquestActivityInfo
            myInfo 2: conquestMyInfo
            myClanInfo 3: conquestClanInfo
            tasks 4: *conquestTask
            unclaimedReward 5: *string # 待领取奖励
            lastTopPlayer 6: conquestTopPlayerInfo # 上次top1玩家
            lastTopClan 7: conquestTopClanInfo # 上次top1帮派
        }
    }

    conquestEnroll %d { # 八荒报名
        request {
        }

        response {
            errorcode 0:integer
        }
    }

    conquestFinishTask %d { # 八荒完成任务
        request {
            taskId 0: integer # 任务id
            claim 1: integer # 是否领取 0：否 1：领取
        }

        response {
            errorcode 0:integer
            tasks 1: *conquestTask
            unclaimedReward 2: *string # 待领取奖励
            bonusesResult 3: bonusesResult  # 直接领取奖励
        }
    }

    conquestEnterScene %d { # 八荒进入场景
        request {
        }

        response {
            errorcode 0:integer
        }
    }

    conquestLeave %d { # 八荒离开
        request {
        }

        response {
            errorcode 0:integer
        }
    }

    conquestMove %d { # 八荒移动
        request {
            x 0:double
            y 1:double
        }

        response {
            errorcode 0:integer
        }
    }

    conquestRevive %d { # 八荒复活
        request {
        }

        response {
            errorcode 0:integer
        }
    }

    conquestTP %d { # 八荒传送
        request {
            x 0:double
            y 1:double
        }

        response {
            errorcode 0:integer
        }
    }

    getConquestCombatPowerRank %d { # 八荒战力排行
        request {
            from 0: integer # 开始位置
            to 1: integer # 结束位置
        }

        response {
            errorcode 0:integer
            playerRanks 1: *conquestPlayerInfo
            myRankOf 2: integer # 本人排名
            myRankScore 3: integer # 本人排名积分
        }
    }

    getConquestClanScoreRank %d { # 八荒帮派积分排行
        request {
            from 0: integer # 开始位置
            to 1: integer # 结束位置
        }

        response {
            errorcode 0:integer
            clanRanks 1: *conquestClanInfo
            myClanRankOf 2: integer # 本帮派排名
            myClanRankScore 3: integer # 本帮派排名积分
        }
    }

    getConquestPlayerKillRank %d { # 八荒个人击杀排行
        request {
            from 0: integer # 开始位置
            to 1: integer # 结束位置
        }

        response {
            errorcode 0:integer
            playerRanks 1: *conquestPlayerInfo
            myRankOf 2: integer # 本人排名
            myRankScore 3: integer # 本人排名积分
        }
    }

    conquestClaimFightReward %d { # 八荒领取战斗奖励（任务和击败）
        request {
        }

        response {
            errorcode 0:integer
            bonusesResult 1: bonusesResult  # 奖励
        }
    }

    conquestClaimRankReward %d { # 八荒领取排行奖励
        request {
            type 0: integer # 类型 1：帮派奖励 2：个人奖励
        }

        response {
            errorcode 0:integer
            bonusesResult 1: bonusesResult  # 奖励
        }
    }

    conquestLiking %d { # 八荒点赞
        request {
        }

        response {
            errorcode 0:integer
            stone 1: integer
        }
    }
]]

local s2c = [[

    onConquestOpen %d { # 开启
        request {
            isOpen 0: boolean # 是否开启
        }
    }

    onConquestPhaseChange %d { # 活动阶段变化
        request {
            phase 0: integer # 阶段 1：关闭 2：报名 3：准备 4：战斗 5：结算
            nextPhaseTime 1: integer # 下一个阶段时间
            startTime 2: integer # 开启时间
            endTime 3: integer # 结束时间
        }
    }

    onConquestSceneChange %d { # 场景变化 延迟 （全区域）
        request {
            number 0: integer # 场景人数
            players 1: *conquestPlayerEntity # 玩家
            monsters 2: *conquestMonsterEntity # 怪物
        }
    }

    onConquestMyselfChange %d { # 玩家自己变动
        request {
            myself 0: conquestPlayerEntity
        }
    }

    onConquestRangePlayerChange %d { # 周围玩家变动
        request {
            player 0: conquestPlayerEntity # 玩家
            change 1: integer # 变动 1：进入区域 2：离开区域
        }
    }

    onConquestRangeMonsterChange %d { # 周围怪物变动
        request {
            monster 0: conquestMonsterEntity # 周围怪物
            change 1: integer # 变动 1：进入区域 2：离开区域
        }
    }

    onConquestAttackPlayerChange %d { # 攻击玩家变化
        request {
            attacker 0: string # 攻击者id
            target 1: string # 被攻击
            playerBattleResult 2: *conquestPlayerBattle
        }
    }

    onConquestAttackMonsterChange %d { # 攻击怪物变化
        request {
            attacker 0: string # 攻击者id
            target 1: integer # 被攻击 怪物forkId
            monsterBattleResult 2:conquestMonsterBattle
        }
    }

    onConquestKillChange %d { # 击杀变化
        request {
            attacker 0: string # 攻击者id
            streakKill 1: integer # 连杀
            totalKill 2: integer # 累杀
        }
    }

    onConquestTaskChange %d { # 任务变化
        request {
            taskId 0: integer # 任务id
            value 1: integer # 当前值
            status 2: integer # 状态
        }
    }

    onConquestPlayerFeatureChange %d { # 玩家信息变动
        request {
            features 0: *conquestPlayerFeature
        }
    }

    onConquestPlayerRewardChange %d { # 玩家奖励变动
        request {
            x 0: double # 被击杀实体的奖励掉落x
            y 1: double # 被击杀实体的奖励掉落y
            reward 2: string # 奖励
            unclaimedReward 3: *string # 待领取奖励
            type 4: integer # 类型 1：掉落 2：任务
        }
    }

    onConquestPlayerKillRankChange %d { # 玩家击杀排名变化
        request {
            rankOf 0: integer # 排名
            totalKill 1:integer # 击杀数
        }
    }

    onConquestClanScoreRankChange %d { # 帮派积分排名变化
        request {
            rankOf 0: integer # 排名
            score 1:integer # 积分
        }
    }

    onConquestBossDefeated %d { # Boss被击败
        request {
            attacker 0: string # 击败boss的玩家
            monsterId 1: integer # 怪物id
            monsterForkId 2: integer # 怪物生成id
            showTime 3:integer # 显形时间
            score 4:integer # 获取积分
        }
    }
]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}