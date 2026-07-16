local types = [[

.playerInformation {
	simpleBase 0:simplePlayerBase
    battleEquips 1: *equip  # 战斗装备
	eliteMonsterId 2: *string #精怪ID;精怪ID;精怪ID
	battleTheurgy 3: *theurgy # 穿戴神通
	mount 4: mount # 坐骑
	petInfo 5: pet			# 宠物信息
	elitemonster 6: *elitemonster #上阵精怪信息
	clanInfo 7: clanSimpleInfo # 帮派信息
	veinInfo 8: veinInfo # 灵脉信息
}

.weekCardItem {
	id 0:integer #周卡奖励ID
	state 1:integer # 0 初始 1可领 2已领
}

.weekCard {
	day 0:integer #周卡剩余天数 0则是没有
	ids 1:*weekCardItem  
}

.simplePlayerBase {
    guid 1: string #id
    name 2: string #名字
    serverid 3:integer #区服
    welcome 4:integer
    level 5:integer #等级
    combatPower 6:integer #战斗力
    phase 7:integer #阶段
    playerEntityAttr 8:*string #属性
    character 9: integer #角色
    appearance 10:integer #形象
    avatar 11:integer #头像
    avatarBorder 12:integer #头像框
    chatBubble 13:integer #聊天气泡
    title 14:integer #称号
    fx 15:integer #特效
	mountType 16:integer #坐骑实例ID
	mountSkin 17:integer #坐骑皮肤ID
	summonPet 18:string #上阵灵宠 实例ID
	summonPetProtoId 19: integer # 上阵宠物 原型id
	lastOfflineTime 20:integer #上次下线时间
    evolutionLevel 21:integer #发展等级
   	evolveFinishTime 22:integer #发展升级完成时间戳
	ip 23: string #IP
	uid 24: string #玩家ID
}

.bigTaked {
	id 0:integer #xml下week下的id
	time 1:integer #领取的时间戳
}

.task {
	id 0:integer
	state 1:integer
	count 2:integer
	time 3:integer
}
.playerbase { #角色基础数据
	guid 1: string #id
	name 2: string #名字
	sex 3: integer #性别 1男 2女
   	welcome 4:integer
   	level 5:integer
   	exp 6:integer
   	money 7:integer
   	unreadMails 8:integer #未读或者有附件没领的数量
   	physical 9:integer #体力
   	combatPower 10:integer #战斗力
   	phase 11:integer #阶段
   	evolutionLevel 12:integer #发展等级
   	evolveFinishTime 13:integer #发展升级完成时间戳
	curStageLevel 14:integer #当前已通关关卡
	summonPet 15:string #上阵灵宠
	curChapterReward 16:integer #当前已领取奖励章节
	recruitingPets 17: *recruitingPets #宠物招募列表
	eliteMonsterBattleTeamId 18: integer #精怪上阵队伍
	eliteMonsterTeam 19: *eliteMonsterTeam #精怪队伍
	stone 20:integer #钻石
	elityMonsterPitySystemCount 21: integer #精怪抽卡总次数
	petBackpackCapacity 22: integer #宠物背包容量
	petPitySystemCount 23: integer #宠物抽卡保底次数
	petPitySystemId 24: integer #宠物抽卡保底宠物
	character 25: integer #角色
    appearance 26:integer #形象
    avatar 27:integer #头像
    avatarBorder 28:integer #头像框
    chatBubble 29:integer #聊天气泡
    title 30:integer #称号
    fx 31:integer #特效
	mountType 32:integer #坐骑实例ID
	mountSkin 33:integer #坐骑皮肤ID
	chance 34:string #机缘
	qunyinRefreshCount 35:integer #群英刷新次数
	renameNum 36: integer #今日剩余改名次数
	ip 37: string #IP
	uid 38: string #玩家ID
	elityMonsterDrawCardRewardCount     39:integer  # 保底抽取总次数(0-200循环)
	elityMonsterDrawCardReward          40:*integer # 保底奖励列表
	petConsumption     					41:integer  # 宠物抽卡买卡总消耗
	petConsumptionReward         		42:*petConsumptionRewardList #宠物抽卡买卡奖励列表
	theurgyDeriveSpecialCount 			43: integer #神通衍化积攒次数
	theurgyDeriveSpecialBonusesList 	44: *integer #神通衍化积攒奖励
}

.finalvalues {

}

.items {
	item 0: *item(id)
}

.gift {
	id 0:integer #礼包ID 
	count 1:integer #礼包购买次数 可能为nil
	isLast 2:integer #是否是链式礼包的最后一个 是的话也就是可以消失了 比如首充的最后一个礼包  比如礼包过期后
	expiredTime 3:integer #可能为ni 限时礼包有值

	opItems 4:*integer #自选礼包已经选择的物品 对于其他类型的礼包为空
}

.ad {
    adId 0:integer # 广告id 配置表
    count 1:integer # 当天次数
    updateTime 2:integer # 最后一次更新时间
}

.firstPayItem {
	id 0:integer # 礼包id
	state 1:integer #礼包状态 0初始 1可领 2已领
	hasPay 2:integer # 是否已经充值该礼包 0/1
	day 3:integer # 当前礼包天数
	count 4:integer # 当前礼包充值次数
	money 5:integer # 金额
	needDay 6:integer # 当前礼包需要的
}

.firstGift {
	isLast 0:integer #是否领取完所有奖励
	items 1:*firstPayItem(id)
}

.xyflTakeItem {
	id  0:integer
	half 1:integer #1是领取了一半 nil表示全部领取
}

.goldItem {
	id 0:integer #金手指ID
	level 1:integer #金手指等级
}

.goldFinger {
	ids 0:*goldItem #所有的金手指
	score 1:integer #保底积分
	forge 3:integer #钓鱼次数
	param 2:*integer #参数 1-9对应的次数  1枸杞个数 2江湖擂台次数 3华山论剑次数 4装备分解经验倍数 5侠侣替换次数 6侠侣属性 7门客碎片替换次数 8门客属性 9门客图鉴
}

.playerfullinfo { #角色完整数据
	base 0 : playerbase
	finalvalues 1 : finalvalues
	items 2 : *item(id) 							#物品 装备 在物品背包
    mails 3 : *mail(id)							    # 邮件数据
    activityStates 4: *activityState(activityId)
    dynamicActivityParams 5:*dynamicActivityParam(id)
    activityOpenStates 6:*activityOpenState(id)
    activityGlobalStates 7:*activityGlobalState(activityId)

	mainTaskId 	16:integer #任务相关  主线任务ID
	mainCount 	17:integer #任务相关  主线任务完成次数
	mainState 	18:integer #任务相关  主线任务状态(1初始 2可领取 3已领取)
	finishCount 99:integer #主线任务完成数量
	dailyTask 	19:*task #每日任务
	weekTask 	20:*task #周任务
	breakTask 	24:*task #突破任务
	xianyuanTask 100:*task #仙缘任务
	factionTask 101:*task #帮派任务
	inviteTask 102:*task #邀请好友任务

	rebateTaskId 	103:integer #任务相关  返利任务ID
	rebateCount 	104:integer #任务相关  返利任务完成次数
	rebateState 	105:integer #任务相关  返利任务状态(1初始 2可领取 3已领取)
	rebateFinishCount 106:integer #返利任务完成数量

	playerEntityAttr 11:*string

    battleEquips 12: *equip  # 战斗装备
    forgeEquips 13: *equip  # 锤炼区装备

    veinInfo 14: veinInfo # 灵脉

	petModuleInfo 				21:petModuleInfo #宠物
	elitemonsterInfo 		22:elitemonsterInfo #精怪
	mount 23:mount #坐骑

	openTime 15:string #开服时间  在config.lua中配置 '2023-12-12 00:00:00' 时分秒为00格式

	chaRecoverTime 25:integer #群英挑战令恢复时间
	chaBuyTime 26:integer #群英挑战令购买时间
	chaBuyCount 27:integer #群英挑战令购买次数

    theurgyInfo 32: theurgyInfo # 神通
    personalization 33: *personalization #个性化
    personalizationAttr 34: *string # 个性化属性

	firstPay 35:firstGift #当前的首冲档次 可能为nil
	dailyGift 36:*gift(id) #每日礼包
	opGift 37:*gift(id) #每日自选礼包
	stonePaycount 38:integer #仙玉充值次数
	chancePaycount 39:integer #机缘充值次数
	module 40:*integer #功能充值 --value为功能类型 1.月卡 2.终身卡 3.战令 4.基金 5.老鼠管家
	xianyouGroup 41:*gift(id) #仙友礼包组 所有的礼包都在里面 客户端自己去分组
	monthCard 42:integer #是否拥有月卡 1有2没有
	monthCardDays 43:integer  #月卡剩余天数
	monthCardTake 44:integer #是否领取今日月卡奖励
	lifeCardTake 45:integer #是否领取今日终生卡奖励
	lifeCard 46:integer #是否有终生卡

	xyTime 48:integer #仙缘福利时间      仙缘剩余时间 =  (xianyuanDays - 1) * 24 * 60 * 60 - (服务器当前时间 - xyTime)
	xyBuyCount 49:integer #仙缘礼包购买次数
	hasTakeFreeXy 50:integer #是否领取每日免费仙缘奖励
	score 51:integer #仙缘任务积分
	
	payIds 52: *integer #充值档次
	xyTakeMax 53:integer #最大领取仙缘礼包ID
	xyGift 55:*gift(id) #仙缘礼包
	xyflTakes 56:*xyflTakeItem #仙缘福利领取ID数组

	activation 57: activation # 开启信息
	achievement 58:achievement #成就系统
	funds 59: funds #基金系统

	chatHistory 60: chatHistory #历史聊天记录
	clan 61: clan # 帮派
    ad 62: *ad # 广告
	blacklist 63: *simplePlayerBase # 黑名单列表
	duelInfo 64: duelInfo # 斗法信息
	companionData 65: companionData # 兽友数据
	palaceBuyGoods 66: *string # 琅琊榜商品购买，配置id
	inviteCount 67: integer #邀请好友的数量

	openGift 68:*gift(id) #开服礼包
	clanSoloOpen 69: clanSoloOpen # 单刀赴会开启
	goldFinger 70:goldFinger #金手指
	weekCard 71:weekCard #周卡

	eliteMonsterCard 	 72:integer #是否拥有精怪终身卡 1有0没有
	eliteMonsterCardTake 73:integer #是否领取精怪终身卡 1有0没有

	petCard 			 74:integer #是否拥有侠侣终身卡 1有0没有
	petCardTake 		 75:integer #是否领取侠侣终身卡 1有0没有
	theurgyCard   		 76:integer #是否拥有秘籍终身卡 1有0没有
	theurgyCardTake 	 77:integer #是否领取秘籍终身卡 1有0没有
	conquestOpen 78: boolean # 八荒开启
	rebateGift 79:*gift(id) #返利礼包
}

.achievement {	
	combatPowerTask 0:*achieve		# 战力成就
	attrsTask 1:*achieve			# 属性成就
	equipTask 2:*achieve			# 装备成就
	battleTask 3:*achieve			# 战斗成就
	petTask 4:*achieve				# 伙伴成就
	eliteTask 5:*achieve			# 精怪成就
	theurgyTask 6:*achieve			# 神通成就
	mountTask 7:*achieve			# 坐骑成就
	veinTask 8:*achieve				# 灵脉成就
	dhamaTask 9:*achieve			# 法宝成就
	itemTask 10:*achieve			# 背包成就
	skinTask 11:*achieve			# 幻境阁成就
}

.achieve {
	id 0:integer		# 任务ID
	taskId 1:integer	# 当前任务数
	count 2:string		# 任务系数
}


.personalization {
	type 0:integer #类型 1：境界形象 2：活动形象 3：境界头像 4：活动头像 5：精怪头像 6：宠物头像 7：头像框 8：聊天气泡 9：活动称号 10：特殊称号 11：勋章称号
	cfgId 1:integer #配置id
	value 2:integer #类型值 活动形象：等级
	expire 3:integer #有效期
}

.sysOpenItem {
	id 1:integer # 开启id
	finish 2:integer #是否完成引导 0没有 1完成
	take 3:integer #是否领取引导奖励 0初始 1可领 2已领
}

.activation {
	sys 1: *sysOpenItem 
}

]]

local c2s = [[

entergame %d { #进入游戏
	request {
		userid 0 : string
		serverid 1 : integer
		token 2 : string
		version 3 : string #版本号
		serverName 4 : string #区服名字
		clientInformation 5 : string #客户端上报信息
		wxuuid 6:string #微信设备ID 如果是微信登录必须带
		fromwxuuid 7:string #邀请者的微信设备ID 如果是通过邀请进来的 必须带邀请者的
		fromguid 8:string #邀请者的guid
		wxtype 9:integer #进入方式 1是邀请
		gid 10:integer #游戏id 如果是微信登录必须带
	}
	response {
		errorcode 0 : integer
		time 1 : integer #时间戳
		info 2 : playerfullinfo
	}
}

createcharcter %d{ #创建角色
	request {
	
		sex 1 : integer
		platform 2 : integer
		userid 3 : string
		serverid 4 : integer
		token 5 : string
		serverName 6 : string
		version 7 : string #版本号
		clientInformation 8 : string #客户端上报信息
        birthday          9 : string #生日
        character 10: integer #角色id
		wxuuid 11:string #微信设备ID 如果是微信登录必须带
		fromwxuuid 12:string #邀请者的微信设备ID 如果是通过邀请进来的 必须带邀请者的
		fromguid 13:string #邀请者的guid
		wxtype 14:integer #进入方式 1是邀请		
		gid 15:integer #游戏id 如果是微信登录必须带
	}

	response {
		errorcode 0 : integer
		time 1 : integer #时间戳
		info 2 : playerfullinfo

		newName 3:string #如果角色名重复了 会返回新的角色名 errorcode == 9
	}
}


outgame %d { #退出游戏
	response {
		errorcode 0 : integer
	}
}

#兑换码
cdkey %d {
	request {
		cdkey 0:string #兑换码
	}
	response {
		errorcode 0 : integer
        bonusesResult 1:bonusesResult
		replayed 2:integer # 1 表示幂等重放，客户端不得再次入账
	}
}

#邀请好友
inviteFriends %d {
	request {

	}
	response {
		errorcode 0 : integer
	}
}

#完成引导
finishGuide %d {
	request {
		id 0:integer
	}
	response {
		errorcode 0 : integer
		guideItem 1:sysOpenItem
	}
}

#领取引导奖励
takeGuideBonuses %d {
	request {
		id 0:integer
	}
	response {
		errorcode 0 : integer
		guideItem 1:sysOpenItem
		bonusesResult 2:bonusesResult
	}	
}

#机缘购买礼包
buyGiftWithChance %d {
	request {
		id 6:integer #充值ID 档位充值
		giftType 0:integer #礼包类型 礼包充值需要 1.首充 2.每日 3.每日自选 4.礼包组 5.仙缘礼包 6.开服礼包 7.返利礼包
		giftId 1:integer #如果giftType==4 需要传subType 1:仙友好感礼包 2.
		ext 7:*integer #自选礼包 xml-pay-item下的id 只选取protoId count
		index 8:integer #扩充参数
	}
	response {
		errorcode 0 : integer
	}
}


#pay.xml下的pay下的id和gift下的id不重复
applyServerOrder %d { #申请充值服务订单
	request {
	goodsId 0 : integer #非nil为ios正版充值
	bid 1 : string
	product_id 2: string
	
	id 6:integer #充值ID 档位充值

	giftType 4:integer #礼包类型 礼包充值需要 1.首充 2.每日 3.每日自选 4.礼包组 5.仙缘礼包 6.开服礼包 7.返利礼包
	giftId 5:integer #礼包ID 礼包ID 礼包充值需要
	ext 7:*integer #自选礼包 xml-pay-item下的id 只选取protoId count

	index 8:integer #扩充参数
}
	response {
	errorcode 0 : integer
	order 1 : string #可能为nil 充值金额是0的选项值为nil 也就是直接领取物品
	money 2:integer
	id 3:integer #礼包ID或者充值档次ID
}
}

watchad %d {
	request {
		type 0:integer #看广告  帮派广告不要传
	}

	response {
		errorcode 0:integer
		itemInserts 1: *itemInsert
	}	
}

rename %d { #改名
	request {
	name 0:string
}
	response {
	errorcode 0:integer
	name 1:string
	itemRemoves 2: *itemRemove
}
}

editsignature %d { #编辑签名
	request {
	msg 0:string
}
	response {
	errorcode 0:integer
}
}


changeCharacter %d { #更换角色
	request {
        character 0:integer # 角色配置id
    }
    response {
        errorcode 0:integer
        character 1: integer # 回放角色配置id
        itemRemoves 2: *itemRemove
    }
}

editPersonalization %d { #编辑角色个性化
	request {
        type 0:integer # 类型 1：境界形象 2：活动形象 3：境界头像 4：活动头像 5：精怪头像 6：宠物头像 7：头像框 8：聊天气泡 9：活动称号 10：特殊称号 11：勋章称号 12：特效
        cfgId 1:integer # 配置id
    }
	response {
        errorcode 0:integer
        type 1:integer
        cfgId 2:integer
    }
}

levelUpAppearance %d { #升级活动形象
	request {
        appearance 0:integer # 类型 活动形象id
    }
	response {
        errorcode 0:integer
        cfgId 1:integer #配置id
        level 2:integer #活动形象等级
        expire 3:integer #有效期，0表示永久
        itemRemoves 4: *itemRemove
    }
}

unlockAvatarBorder %d { #解锁头像框
	request {
        id 0:integer # 类型 配置id
    }
	response {
        errorcode 0:integer
        cfgId 1:integer #配置id
        expire 2:integer #有效期
        itemRemoves 3: *itemRemove
    }
}

unlockChatBubble %d { #解锁聊天气泡
	request {
        id 0:integer # 类型 配置id
    }
	response {
        errorcode 0:integer
        cfgId 1:integer #配置id
        expire 2:integer #有效期
        itemRemoves 3: *itemRemove
    }
}

unlockFx %d { #解锁特效
	request {
        id 0:integer # 类型 配置id
    }
	response {
        errorcode 0:integer
        cfgId 1:integer #配置id
        expire 2:integer #有效期
        itemRemoves 3: *itemRemove
    }
}

#查询玩家信息
queryPlayerInfo %d {
	request {
		guid 0:string
	}
	response {
		errorcode 0:integer
		playerInformation 1:playerInformation
	}
}

#领取周卡
takeWeekCard %d {
	request {
		id 0:integer #0表示领取所有
	}

	response {
		errorcode 0:integer
		bonusesArr 2:*bonusesResult #可能为nil
	}	
}

#抽金手指
pumpGoldFinger %d {
	request {
		count 0:integer
	}
	response {
		errorcode 0:integer
		itemRemoves 1:*itemRemove
		bonusesArr 2:*bonusesResult #可能为nil
		id 3:integer #金手指ID 可能为nil
	}	
}

#升级金手指
levelUpGoldFinger %d {
	request {
		id 0:integer
	}
	response {
		errorcode 0:integer
		itemRemoves 1:*itemRemove
	}	
}

#侠侣替换
replacePetInst %d {
	request {
		petId 0:string
		protoId 1:integer #替换指定侠侣的时候需要传
	}	
	response {
		errorcode 0:integer
		pet 1:pet
	}	
}

#门客碎片兑换
exchangeDebris %d {
	request {
		id 0:string #碎片实例ID
		protoId 1:integer #替换指定门客碎片的时候需要传 可为nil
		count 2:integer #数量
	}	
	response {
		errorcode 0:integer
		itemRemoves 1:*itemRemove
		itemInserts 3:*itemInsert 
	}	
}

#生成指定槽位装备
onReplaceEquip %d {
	request {
		slot 0:integer #槽位

	}	
	response {
		errorcode 0:integer
		equip 1:equip
	}		
}

replaceTheurgyFrag %d {
	request {
		instId 0:string #碎片实例ID
		count 1:integer #替换次数
		bProtoId 2:integer #可能为nil 要替换指定的碎片原型ID
	}	
	response {
		errorcode 0:integer
		deriveTheurgyId 1: *integer # 衍化神通id列表
		itemInserts 2: *itemInsert # 新增神通碎片
		newTheurgies 4: *theurgy # 新增神通
		itemRemoves 5: *itemRemove
	}		
}

#领取任务奖励
takeTaskBonuses %d {
	request {
	id 0:integer #任务ID
}
	response {
	errorcode 0:integer
	bonusesResult 1:bonusesResult #可能为nil
	id 2:integer
	clanContribution 3:integer #帮派贡献 可能是0或者nil
	activeScore 4:integer #帮派活跃分 可能是0或者nil
	clanExp 5:integer #帮派经验 可能是0或者nil
}
}
		

#领取成就奖励
achievementBonuses %d {
	request {
		id 0:integer #任务ID
	}
	response {
		errorcode 0:integer
		bonusesResult 1:bonusesResult
	}
}

#领取月卡终身卡奖励 iteminsert通过事件发送了
takePayCard %d {
	request {
		type 1:integer
	}
	response {
		errorcode 0:integer
	}
}

#领取精怪终身卡奖励
takeEliteMonsterCardCard %d {
	request {
	}
	response {
		errorcode 0:integer
		bonusesResult 1:bonusesResult
	}
}

#领取侠侣终身卡奖励
takePetCard %d {
	request {
	}
	response {
		errorcode 0:integer
		bonusesResult 1:bonusesResult
	}
}

#领取秘籍终身卡奖励
takeTheurgyCard %d {
	request {
	}
	response {
		errorcode 0:integer
		bonusesResult 1:bonusesResult
	}
}


#领取仙缘福利
takeXianYuanScoreBonuses %d {
	request {
	
	}
	response {
		errorcode 0:integer
		ids 1:*xyflTakeItem
		stone 2:integer
		itemInserts 3:*itemInsert #可能为nil
	}
}

#领取仙缘充值次数奖励
takeXyfl %d {
	request {
		count 0:integer #pay->xyfl的id
	}
	response {
		errorcode 0:integer
		bonusesResult 1:bonusesResult
		count 2:integer
	}
}

    # 拉黑
    blockPlayer %d {

        request {
            flag 0:integer # 0：移除黑名单 1：拉黑
            counterId 1:string # 对方玩家id flag为0情况下不传counterId则为移除所有黑名单
        }

        response {
            errorcode 0:integer
            blacklist 1: *simplePlayerBase # 黑名单列表
        }
    }

# 玩家分享
playerShare %d {
    request {
    }

    response {
        errorcode 0 : integer
    }
}

# 领取首冲礼包奖励
takeFirstPayBonuses %d {
	request {
		id 0:integer #礼包ID
	}

	response {
		errorcode 0:integer
		itemInserts 1:*itemInsert #可能为nil
		money 2:integer #可能为0 
		stone 3:integer #可能为0
		equip 4:equip #锻造区装备 可能为nil
	}
}

#设置自选礼包选择
setOptGiftItems %d {
	request {
		giftId 1:integer #礼包ID
		opts 0:*integer #选项
	}
	response {
		errorcode 0:integer
	}		
}
]]

local s2c = [[

heartbeat %d {}

logout %d {}


playerAttrChanged %d { #角色属性变化
	request {
		type 1:integer #属性类型 见说明 1.1 @属性类型@
		value 2:string #属性值
		key 3: string #属性类型 字符串 客户端可忽略
}
}

entityPlayerAttrChanged %d { #角色属性变化
	request {
		key 1:integer #属性值
		value 2: string #属性类型 字符串 客户端可忽略
}
}

playerAllEntityAttrChanged %d { #角色所有属性变化
    request {
        attrs 1: *string #属性值
    }
}

playerModelEntityAttrChanged %d { #角色模块属性变化
    request {
        module 1: string #模块
        attrs 2: *string #属性值
    }
}

playerCombatPowerChanged %d { #角色战斗力变化
    request {
        combatPower 1: integer #战斗力
    }
}

activationNotify %d { # 开启事件
    request {
        sys 1:sysOpenItem #
        type 2:string # 类型 sys:系统
        serverDay 3:integer # 开服天数
    }
}

personalizationChange %d { # 个性化变化
    request {
        type 0:integer # 类型 1：境界形象 2：活动形象 3：境界头像 4：活动头像 5：精怪头像 6：宠物头像 7：头像框 8：聊天气泡 9：活动称号 10：特殊称号 11：勋章称号 12：特效
        cfgId 1:integer # 配置id
        value 2:integer # 类型值
        expire 3:integer # 有效期
        change 4:integer # 变化 1：新增 2：移除
    }
}

adRefresh %d { # 广告刷新
    request {
        ad 0: *ad
    }
}

#顶号事件
replaceuser %d { 
	
}


#任务改变
taskChanged %d {
	request {
	task 0:task
	type 1:integer #任务类型 1主线 2日常 3周任务
	finishCount 2:integer #主线任务完成数量
}
}

#突破任务改变 ---旧的突破任务删除 替换成新的突破任务
newBreakTaskChanged %d {
	request {
		tasks 0: *task
	}
}

#成就改变
achievementChanged %d {
	request {
		achievement 0:achievement
	}
}

#周任务重置 收到事件后自行修改 count state(1初始 2可领奖 3已领奖)
weekTaskResetChanged %d {
	request {

	}
}

#每日任务重置 收到事件后自行修改 count state(1初始 2可领奖 3已领奖)
dailyTaskResetChanged %d {
	request {

	}	
}

#仙缘任务重置
xyTaskResetChanged %d {
	request {

	}	
}

#帮派任务重置
factionTaskResetChanged %d {
	request {

	}	
}

playerLevelChanged %d { #等级改变 
	request {
        oldLevel 0:integer
        newLevel 1:integer
    }
}

taskAchievementDone %d { #成就完成
	request {
	taskID 0:integer
    pct    1:string
}
}

#首冲礼包变化
firstPayChanged %d {
	request { #下面的2个是互斥 只有一个是有值
		item 0:firstPayItem #单个礼包 可能为nil 有值就替换

		firstGift 1:firstGift #整个首冲礼包组 可能为nil isLast == 1的时候就是全部领取完可以消失 否则有值就弹出首冲  
	}
}

#每日礼包变化
dailyGiftChanged %d {
	request {
		id 0:integer #礼包ID
		count 1:integer #礼包购买次数
	}
}

#每日自选礼包变化
opGiftChanged %d {
	request {
		id 0:integer #礼包ID
		count 1:integer #礼包购买次数
		opItems 2:*integer #自选礼包已经选择的物品 对于其他类型的礼包为空
	}
}

#仙缘礼包变化
xyGiftChanged %d {
	request {
		id 0:integer #礼包ID
		count 1:integer #礼包购买次数
	}
}

#开服礼包变化
openGiftChanged %d {
	request {
		id 0:integer #礼包ID
		count 1:integer #礼包购买次数
	}	
}

#返利礼包变化
rebateGiftChanged %d {
	request {
		id 0:integer #礼包ID
		count 1:integer #礼包购买次数
	}	
}

#限时礼包新增
expiredGiftsAdd %d {
	request {
		gifts 0:*gift
	}
}

#限时礼包变化
expiredGiftChanged %d {
	request {
		id 0:integer #礼包ID
		count 1:integer #礼包购买次数
		expiredTime 3:integer #可能为ni 限时礼包有值 
	}
}

#限时礼包过期
expiredGiftExipred %d {

	request {
		id 0:integer #礼包ID
	}	
}

#每日礼包重置
dailyGiftReset %d {
	request {

	}
}

#每日自选礼包重置
opGiftReset %d {
	request {
		
	}
}

#仙缘礼包重置
xyGiftReset %d {
	request {

	}
}

#充值次数变化
payCountChanged %d {
	request {
		stonePaycount 0:integer
		chancePaycount 1:integer
		module 2:*integer
	}
}

#充值卡变化
payCardChanged %d {
	request {
		monthCard 0:integer #是否拥有月卡 1有2没有
		monthCardDays 1:integer #月卡剩余天数
		monthCardTake 2:integer #是否领取今日月卡奖励
		lifeCardTake 3:integer #是否领取今日终生卡奖励
		lifeCard 4:integer #是否有终生卡
		eliteMonsterCard 	 5:integer #是否拥有精怪终身卡 1有0没有
		eliteMonsterCardTake 6:integer #是否领取精怪终身卡 1有0没有
		petCard 			 7:integer #是否拥有侠侣终身卡 1有0没有
		petCardTake 		 8:integer #是否领取侠侣终身卡 1有0没有
		theurgyCard   		 9:integer #是否拥有秘籍终身卡 1有0没有
		theurgyCardTake 	 10:integer #是否领取秘籍终身卡 1有0没有
	}
}

#终身卡首充奖励
compositeLifeCardFirstBonuse %d {
	request {
		bonusesResult 1:bonusesResult
	}
}

#仙缘充值数据变化
payXyEventChanged %d {
	request {
		xyTime 0:integer #仙缘福利时间
		xyBuyCount 1:integer #仙缘礼包购买次数
		hasTakeFreeXy 2:integer #是否领取每日免费仙缘奖励
		score 3:integer #仙缘任务积分
		payIds 4:*integer #充值档次
		xyTakeMax 5:integer #最大领取仙缘奖励ID
		xyflTakes 7:*xyflTakeItem
		module 8:*integer
	}
}

#仙缘福利任务
xyTaskCreated %d {
	request {
		tasks 0:*task 
	}
}

#仙缘福利任务消失
xyTaskDisappeared %d {
	request {

	}
}

#邀请好友数量变化
inviteCountChanged %d {
	request {
		count 0:integer
	}
}

#开服礼包消失
openGiftDisappeared %d {
	request {
		id 0:integer #这个没有值的时候代表整个开服礼包结束 有值的话就将对应id的礼包置为nil
	}	
}

#出现新的开服礼包组
openGiftAdd %d {
	request {
		gifts 0:*gift(id)
	}
}

#金手指数据变化 
goldFingerChanged %d {
	request {
		goldFinger 0:goldFinger
	}	
}

#周卡变化
weekCardChanged %d {
	request {
		weekCard 0:weekCard
	}
}
]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}
