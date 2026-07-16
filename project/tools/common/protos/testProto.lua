local types = [[
.effectResult{
    id                  0:integer        #效果ID
    type                1:integer        #效果类型
    bonusesResultArr    2:*bonusesResult #奖励结构 可能为nil
}


.frameAttack {
    dir 0:integer
    index 1:integer
}

.frameAction {
    cmd 0:string
    playerId 1:integer
    frameAttack 2: frameAttack
}

.playerEntityInfo{
    attr             1:*string   #属性数值
    elites           2:string    #原型ID,技能id;... (1001,100101;0,0;1002,100201) 最多三个，没有为0
    pets             3:string    #原型ID,技能id;... (1001,100101;1002,100201) 第一个是宠物，第二个是协同宠物，没有为0
    divines          4:string    #原型ID,技能id;... (100101;100201;100203;100201) 神通最多4个，没有传0,0,0,0
}
]]

local c2s =[[
testTakeBonuses %d {            # 测试领取奖励
    request {
        dropType 0 : integer    # 掉落模式
    }
    response {
        errorcode 0 : integer
        bonusesResult 1 : bonusesResult
    }
}

onOpenTotalCharge %d {
    request {
        id 0: integer       # 0累充 1累天
        type 1: integer     # 0结束活动     活动ID
    }
    response {
        errorcode 0 : integer
    }
}

testChatBubbleExpire %d { # 测试移除角色形象
	request {
        itype 0:integer # 类型
        id 1:integer # id
        num 2:integer # 移除时间
    }
	response {
        errorcode 0:integer
    }
}

addItem %d {
    request {
        protoId 0 : integer
        count 1 : integer
    }
    response {
        errorcode 0 : integer
        itemInserts 1 : *itemInsert
    }
}

addItems %d {
    request {
        param 0 : string #protoId,count;...
    }
    response {
        errorcode 0 : integer
        itemInserts 1 : *itemInsert
    }    
}

removeitem %d {
    request {
        protoId 0 : integer
        count 1 : integer
    }
    response {
        errorcode 0 : integer
        itemRemoves 1 : *itemRemove
    }   
}

removeinst %d {
    request {
        instId 0 : string
    }
    response {
        errorcode 0 : integer
        instId 1 : string
    }   
}

addattr %d {                       # 增加属性
    request {
        type 0:integer
        value 1 : integer
    }
    response {
        errorcode 0 : integer
    }
}

addAttrEntity %d {                       # 增加实体属性
    request {
        type 0:integer
        value 1 : integer
    }
    response {
        errorcode 0 : integer
    }
}

shopUp %d {                       # 增加实体属性
    request {
        day 0: integer
    }
    response {
        errorcode 0 : integer
    }
}

#增加仙缘积分
addxyscore %d {
    request {
        score 0: integer
    }
    response {
        errorcode 0 : integer
    }   
}

debugtime %d {
    request {
    hour 0:integer
    min 1:integer
    sec 2:integer
    day 3:integer #可选
}
    response {
    errorcode 0:integer
}
}

playeractivity %d {
    request {
    a 0:integer
    b 1:integer
    c 2:integer
}
    response {
    errorcode 0:integer
}
}

uniqueactivity %d {
    request {
    a 0:string
    b 1:integer
    c 2:integer
}
    response {
    errorcode 0:integer
}
}

dkick %d {
      request {
    a 0:integer
    b 1:integer
    c 2:integer
    activityId 3:integer
}
    response {
    errorcode 0:integer
}  
}

mkick %d {
    request {
        a 0:integer
        b 1:integer
        c 2:integer
    }
    response {
        errorcode 0:integer
    }   
}

testactivity %d {
    request {
    cmd 1:string #命令
    paramStr 2:string #参数activityId,1,1 逗号隔开
	#例子
        #testCleanSign
		#cmd="testCleanSign" 清除当日签到
		#paramStr="103"  活动ID

        #testCleanSignAll
		#cmd="testCleanSignAll" 清除签到所有数据
		#paramStr="103"  活动ID

        #testSetSignMonth
		#cmd="testSetSignMonth" 设置签到月份
		#paramStr="103,5"  活动ID 月份
}
    response {
    errorcode 0:integer
}
}

testcmd %d {
    request 
    {
        cmd 1:string        #命令
        paramStr 2:string   #参数

	    #例子
		#cmd="setlevel"         设置等级
		#paramStr="5"           等级

        #例子
		#cmd="taskcleanday"     重置每日任务
	

    }
    response 
    {
        errorcode 0:integer
    }
}

testcondition %d {
    request 
    {
        id 1 : string 
    }
    response 
    {
        errorcode 0:integer
        bonusesResult 1:bonusesResult
    }
}

#设置主线任务
finishMainTask %d {
    request 
    {
        taskId 1 : integer  #主线任务ID 必须大于当前主线任务ID 只能向后调不能往回调
    }
    response 
    {
        errorcode 0:integer
    }    
}

#gm设置开服天数
setopenday %d {
	request {
		day 0:integer #天数
	}
	response {
		errorcode 0 : integer
        openDay 1:integer #调整后开服天数
	}
}

#gm设置时间 加时间
settime %d {
	request {
		day 4:integer #天
		hour 0:integer #小时
		min 1:integer #分钟
		sec 2:integer #秒
	}
	response {
		errorcode 0 : integer
        time 1:integer #调整后服务器时间
	}	
}

testeffect %d {
    request 
    {
        id 1 : integer 
    }
    response 
    {
        errorcode 0:integer
    }
}

testeb %d {
    request 
    {
    }
    response 
    {
        errorcode 0:integer
        battleResult 1:battleResult
    }   
}

testbattle %d {
    request 
    {
        attackEntity     1:playerEntityInfo #可以为Nil,不传就取自己的
        defenceEntity    2:playerEntityInfo #防守方
        battleType       3:integer   #战斗类型 1普通PVE  2普通PVP 3特殊PVP斗法 4群英榜PVP
        monsterID        4:integer   #怪物ID 可以为nil （有怪物ID，defenceEntity失效,会读怪物ID取XML，XML里有宠物，和精怪）
    }
    response 
    {
        errorcode 0:integer
        battleResult 1:battleResult
    }
}

test_callactivity300000 %d {
    request {

    }
    response {
    errorcode 0:integer
}
}

#修改创建账号时间
changeCreateTime %d {
    request 
    {
        date 1 : string     #时间戳
    }
    response 
    {
        errorcode 0:integer
    }
}


#GM指令模拟充值
simulatedrecharge %d {
    request 
    {
        id 0 : integer     #充值档位
    }
    response 
    {
        errorcode 0:integer
    }
}

#GM挑战指定关卡
testchallengestage %d {
    request {
        stageId 1:integer #关卡ID
    }
    response {
        errorcode 0:integer
        bonusesResult 1:bonusesResult #关卡奖励
        chapterBonusesResult 2:bonusesResult #章节奖励
        battleResult 3:battleResult #战斗结果
        stageId 4:integer #下个关卡ID，如果失败就还是当前关卡ID
        isWin 5: integer #是否胜利,1为胜利,2为失败	
    }
}

    evolveUp %d { # 发展升级
        request {
            count 0:integer # 次数
        }
        response {
            errorcode 0:integer
        }
    }

    directLevel %d { # 升到指定等级
        request {
            targetLevel 0:integer # 指定等级
        }
        response {
            errorcode 0:integer
            level 1:integer
            phase 2:integer
        }
    }

    setActivationSkip %d { # 设置跳过开启
        request {
            skip 0:integer # 是否跳过 非零0都为跳过，空也是
            id 1:integer # 系统开启id 指定系统，不填默认所有
        }
        response {
            errorcode 0:integer
        }
    }

    clanAddExp %d { # 增加帮派经验
        request {
            exp 0: integer # 贡献值
        }
        response {
            errorcode 0:integer
            clanInfo 1: clanInfo
        }
    }

    addClanPoint %d { # 增加个人贡献和战功
        request {
            count 0: integer # 数量
        }
        response {
            errorcode 0:integer
            myselfInfo 2:clanMember
        }
    }

    clanRefreshDaily %d { # 刷新所有帮派日常
        request {
        }
        response {
            errorcode 0:integer
            clanInfo 1: clanInfo
            myselfInfo 2:clanMember
        }
    }

    clanStartRechargeAct %d { # 开启充值活动
        request {
            id 0: integer # 充值活动id
        }
        response {
            errorcode 0:integer
        }
    }

    addClanFlag %d { # 增加帮派旗帜
        request {
            clanId 0: string # 帮派id
            flagId 1: integer # 帮派旗帜id
        }
        response {
            errorcode 0:integer
        }
    }

    clanRefreshMerchant %d { # 刷新帮派神秘商人
        request {
        }
        response {
            errorcode 0:integer
            clanInfo 1: clanInfo
            myselfInfo 2:clanMember
        }
    }

    refreshAd %d { # 刷新广告
        request {
        }
        response {
            errorcode 0:integer
        }
    }

    addExp %d { # 增加角色经验
        request {
            exp 0: integer #经验值
        }
        response {
            errorcode 0:integer
            exp 1: integer # 最新经验值
        }
    }

    palaceListed %d { # 设置琅琊榜
        request {
            palaceId 0:integer # 宫殿id
            playerId 1:string # 玩家id 不填默认自己发起
        }
        response {
            errorcode 0:integer
        }
    }

    deliveryEquip %d { # 发放装备
        request {
            cfgId 0:integer # 配置id
        }
        response {
            errorcode 0:integer
        }
    }

    addVeinLevel %d { # 增加修行等级
        request {
            level 0:integer # 等级
        }
        response {
            errorcode 0:integer
            veinLevel 1:integer # 最新修行等级
        }
    }

    testSetTreasureDataDone %d { 
        request {

        }
        response {
            errorcode 0:integer
        }
    }


    testsetzoneLevel %d { 
        request {
            level 0:integer     #区域等级
            searchCnt 1:integer #探索次数
        }
        response {
            errorcode 0:integer
        }
    }

    clanSoloNextState %d { #单刀赴会下一个阶段
        request {

        }
        response {
            errorcode 0:integer
        }
    }

    clanSoloAddPrestige %d { #单刀赴会增加声望
        request {
            prestige 0:integer # 声望
        }
        response {
            errorcode 0:integer
            prestige 1:integer # 现有声望
        }
    }

    conquestNextPhase %d { # 八荒下一个阶段
        request {
        }
        response {
            errorcode 0:integer
        }
    }

    conquestAddPlayer %d { # 八荒增加玩家进入场景
        request {
            count 0:integer # 数量
        }
        response {
            errorcode 0:integer
        }
    }

]]

local s2c =[[

roomCanStarted %d {
    request {

}
}
]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}