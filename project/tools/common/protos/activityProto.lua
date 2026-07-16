local types = [[
.activityRankPlayer { # 排行榜玩家
    guid 0:string #玩家id
    name 1:string #名称
    combatPower 2:integer #战斗力
    phase 3:integer #阶段
    score 4:integer #积分
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
}

.openRankItem {
    rank 0:integer 
    realPeople 10:boolean #是否有人  有人则有下面数据 没有则虚位以待
    guid 1:string
    value 2:integer
    uid 3:string
    name 4:string
    combatPower 5:string
    avatar 6:integer
    avatarBorder 7:integer
    chance 8:string
    phase 9:integer 
    character 13:integer
    appearance 11:integer
    title 12:integer
}

#蛮荒妖域排行榜
.clanRankInfo { # 帮派信息
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

#蛮荒妖域
.domainTask { # 任务
    id 0:integer
    isDone 1:integer #1为完成,0未完成
    target 2:integer #1指定时间完成
    data   3:integer #扩展数据
    bonuseID 4:string #奖励ID
    takeState 5:integer #领奖状态 0不可领取，1可以领取，2已经领取
}

.activityDemo {
    doneCount 0 : integer
    testCount 1 : integer
}

.activityDynamicDemo {
    doneCount 0 : integer
}

.dc {
    m 1:integer
    n 2:string
}

.dtest3 {
    a 1:integer
    b 2:integer
    c 3:dc
}

.demo1 {
   test1 1:integer
   test2 2:string
   test3 3: dtest3 
}

.shopItem {
    id 0:integer  #购买的ID
    count 1:integer #购买的中数量
}


.battleModelInfo{
    character           1:integer  #角色  
    appearance          2:integer  #形象  可能为nil  
    phase               3:integer  #阶段 
}

.kingMonsterItem {
    id 0:integer  #xml的ID
    state 1:integer #1(0为解锁,1可以挑战，2可以快速通关)
}

.activityKingMonster {
    data        0:*kingMonsterItem(id)
    quickCnt    1:integer #当前速通次数
}

#莽荒资产
.propertyItem {
    id        0:integer #id
    count     1:integer #数量
}
#莽荒事件
.eventItem {
    id              1:integer  #配置ID
    type            2:integer  #(1怪物，2特殊事件，3)
}

#莽荒标记怪物
.markMonsterItem {
    monsterConfigID  1:integer #活动配置表怪物子表ID
    monsterMAXHP 2: string #最大血量
    monsterCURHP 3: string #当前血量
    playerId     4: string #玩家ID
    monsterID    5: string #怪物表，怪物ID
    name         6: string #名字
}


#莽荒标记怪物
.openTimeData {
    showTime        0:integer   #显示时间
    openTime        1:integer  #开启时间
    endTime         2:integer #结束时间
    closeTime       3:integer #关闭时间

}

.markMonsterHelp {
    markMonsterItem  1: markMonsterItem
    time             2: integer
}



#莽荒匹配到的玩家
.matchingPlayerInfo {
    id  1: string #GUID
    serverId 2:string #服务器ID
    character 3:integer #角色
    appearance 4:integer #形象
    avatar 5:integer #头像
    phase 6:integer #阶段
    name 7:string #名字
    hp  8:string #当前血量
    maxHP 9:string #最大血量
}

#第三层临时信息
.tempZoneInfo {
    pRandNum    1:integer #个人积分
    searchCnt   2:integer #探索次数
    gRankNum    3:integer #帮派积分
 
}

.domainPayItem {
    id       1:string    #payGift id
    buycnt   2:integer    #购买次数
    maxBuyCount 3:integer #最大购买次数
}



.domainBusines {
    id      1:integer           #特殊事件ID
    giftArr 2:*domainPayItem    #礼包列表
    time    3:integer           #结束事件
}


#莽荒妖域
.activityDomainMonster {
    energy      1:integer #能量
    zoneLevel   2:integer #区域等级 1，2，3
    searchCnt   3:integer #探索次数
    ack         4:string  #临时增加攻击力
    def         5:string  #临时增加防御力
    spd         6:string  #临时增加速度
    hp          0:string  #临时增加血量
    pRankNum            9:string  #个人累计积分
    gRankNum            10:string #个人帮派积分   
    allProperty        11:*propertyItem   #资产数组
    eventList           13:*eventItem #事件表
    curMonsterID        14:string   #当前怪物配置ID
    curMonsterHP        15:string   #血量
    curMonsterMaxHP     16:string   #最大血量
    moarkMonsterList    17:*markMonsterItem #标记的怪物 目前只有一个
    matchingPlayerInfo  18:matchingPlayerInfo #匹配玩家信息
    isMarkMonster       19:integer  #是否标记了怪物 1标记了，0不能没标记,2可以标记
    battleInterval      20:integer  #挑战CD，结束时间，没有为0
    tempZoneInfo        21:tempZoneInfo #第三层临时信息
    rankOf              22:integer #排行位置
    specialBusines      23:*domainBusines #商人信息
    finalhp             24:string #当前血量
    finalhpMAX          25:string #最大最终血量
    safeTime            27:integer #安全时间
    openDay             28:integer #开服天数
    clanId              29:string  #帮派ID
    flag                30:integer #帮派旗帜
    name                31:string #帮派名字
    helpBattleCnt       32:integer #总协助次数
    cRankOf             33:integer #帮派排行位置
    giftsRecords        34:*domainPayItem(id)
    energyTimeSec       35:integer #体力结束事件，秒 体力小于最大值显示，默认是-1
    domainTask          36:*domainTask(id) #任务
}
       
.domianBattleInfo {
    attackServerId  0:integer #攻击者服务器ID
    attackName      1:string  #攻击者名字
    attackPlayerId  2:string  #攻击者uid
    defenceTempgRankNum 3:string #防守者当前帮派积分(就是自己当前积分)
    defenceOldTempgRankNum 4:string #防守者旧的帮派临时积分(就是自己旧积分)
    isLeaveMaxZone    5:integer #是否掉层 1掉曾，0 不掉曾
    damage          6:string  #总伤害
    costDamage      7:string  #扣除血量
    defenceNewHP    8:string #防守者血量
    defenceAddgRankNum 9:string #防守者被抢的积分
}

.qunyinItem {
    rank  	0:integer #排名
    model 	1:integer #模型
    power 	2:integer #战力
    isPlayer 		3:integer #0非真人 1真人
    jingjie 		4:integer #境界
    name 			6:string #名字
    serverId 		7:integer #区服ID
    id 				8:string #空或者0 表示NPC
    mountType 		9:integer
    mountSkin 		10:integer
    character 		11:integer
    title           12:integer
    avatar 		13:integer
    avatarBorder           14:integer
    summonPet   15:string
}

.activityRebateItem {
    total 0:string #历史金竹树 一直保留
    pool 1:string #返利池 领取完就清理 
    today 2:string #今天的金竹树
}

.qunyinLog {
    attId 		0:string  #攻方ID
    attName 	1:string #攻方名字
    attLevel 	2:integer #攻方等级
    attRank 	3:integer #攻方排名
    attModel 	4:integer #攻方模型
    isWin       5:integer #是否胜利 1胜利0失败
    time  		6:integer #挑战时间
    defId 		7:string #守方ID
    defName 	8:string #守方名字
    defLevel 	9:integer #守方等级
    defRank 	10:integer #守方排名
    defModel 	11:integer
    attAvatar   12:integer
    attBorder   13:integer
    defAvatar   14:integer
    defBorder   15:integer
}

.qunyinShopItem {
    id 0:integer
    count 1:integer
}

.activityOpenRank {

	petScore 0:integer			#侠侣积分
	eliteCount 1:integer		#精怪次数
	theCount 2:integer			#神通次数	    
    chance  3:string #消费的金竹
    take 4:*integer #是否领取或者发放当天的奖励
}

.activityQunYin {
    rank 0:integer #当前排名 <= 0 表示不在榜上
	list 1:*integer #自己的挑战列表
	score 2:integer #拥有积分
	highRank 3:integer #最高排名
	aid  4:integer #成就ID
    shop 5:*qunyinShopItem #积分兑换记录
    taid 6: *integer #领取过的成就ID
}

.dailyWelfare {
    loginCount 0:integer #当天登录次数 每日重置
	state 1:integer #领取状态 0不可领取 1可领取
	takeCount 2:integer #领取次数
	time 3:integer #领取时间
}

# 开服庆典任务数据
.openCelebrationTask {
    id 1 : string                                                           # 任务id
    state 2 : integer                                                       # 状态(0:未完成 1:已完成 2:已领取)
    value 3 : integer                                                       # 进度
}

# 开服庆典每日礼包数据
.openCelebrationDaysGiftsRecord {
    payId 1 : integer                                                       # 充值id(0为免费)
    tookCount 2 : integer                                                   # 已领取/购买次数
}

# 开服庆典兑换数据
.openCelebrationExchangeGoodsRecord {
    id 1 : integer                                                          # 兑换商品id
    count 2 : integer                                                       # 已兑换次数
}

# 开服庆典领取累计积分奖励数据
.openCelebrationTookScoreBonuses {
    score 1 : integer                                                       # 积分档次
    isTook 2 : boolean                                                      # 是否已领取
}

# 开服庆典(运营)
.activityOpenCelebration {
    score 1 : integer                                                       # 当前积分
    totalScore 2 : integer                                                  # 累计积分
    tasksStates 3 : *openCelebrationTask(id)                                # 任务数据
    daysGiftsRecords 4 : *openCelebrationDaysGiftsRecord(payId)             # 每日礼包数据
    exchangeGoodsRecords 5 : *openCelebrationExchangeGoodsRecord(id)        # 兑换数据
    tookScoreBonusesRecords 6 : *openCelebrationTookScoreBonuses(score)     # 领取累计积分奖励数据
}

########################## 灵泉 ##########################
# 灵泉数据
.activitySpring {
    score 0:integer                         # 积分
	weekScore 1:integer                     # 本周积分
	unusedScore 2:integer                   # 未领取积分
	redBag 3:integer                        # 红包 0无 1可领取
    adCount 4: integer                      # 广告次数

    selfRoom 5: springRoom                  # 自己房间信息
    posPower 6: *integer                    # 房间座位权限 0所有人 1仅帮派
    posPowerUp 7: integer                   # 房间座位权限更新 0未更新 1更新
    inRoom 8: string                        # 所在其他房间主人信息 ''未落座 房主ID
}

# 房间信息
.springRoom {
    owner 0:springPlayerInfo                # 房主信息
	endTime 1:integer                       # 结束时间（时间时间戳）
	durationTime 2:integer                  # 持续时间（小时）
	posPeople 3:integer                     # 落座人数
	share 4:integer                         # 分享 0未分享  1已分享
	posList 5:*springPos                    # 座位信息
    minScore 6:integer                      # 每分钟积分
    titleQuality 7:integer                  # 称号品质
}

# 座位信息
.springPos {
    playerInfo 0: springPlayerInfo          # 座位玩家信息
    playerId 1: string                      # 玩家id
	power 2:integer                         # 权限 0所有人 1盟友
	seatTime 3:integer                      # 落座时间（时间戳）
}

# 玩家数据
.springPlayerInfo {
    guid 0:string # 玩家id
    name 1:string # 名称
    combatPower 2:integer #战斗力
    phase 3:integer #阶段
    score 4:integer #积分
    rankOf 5:integer #名次
    serverId 6:integer #区服Id
    mountType 7:integer #坐骑类型
    mountSkin 8:integer #坐骑皮肤
    summonPet 9:string #宠物
    character 10: integer #角色
    appearance 11:integer #形象
    avatar 12:integer #头像
    avatarBorder 13:integer #头像框
    title 14:integer #称号
    titleList 15:*integer #称号列表
    roomId 16:string #所在房间房主ID
    battleTime 17:integer #战斗时间戳
}

# 玩家数据列表
.springPlayerInfoList {
    playerInfo 0: *springPlayerInfo          # 玩家数据
}

# 红包数据
.redBagInfo {
    playerInfo 0: springPlayerInfo          # 玩家数据
    bonusesResultArr 1: bonusesResult       # 领取奖励
}
########################## 灵泉 ##########################
########################## 攻城略地 ##########################
# 帮派数据
.siegeClanState {
    guid 0:string                       # 帮派id
    name 1:string                       # 名称
    combatPower 2:integer               # 战斗力
    leader 3:string                     # 帮主ID
    leaderName 4:string                 # 帮主名称
    deputy 5:*string                    # 副帮主Id列表
    elite 6:*string                     # 精英Id列表
    flag 7:integer                      # 旗帜
    serverId 8:integer                  # 区服ID
    playerInfo 9:*siegeClanPlayerInfo   # 帮派玩家数据

    HP 10: integer                      # 当前血量
    maxHP 11:integer                    # 最大血量
    present 12:integer                  # 当前玩家
    harm 13:integer                     # 伤害
    score 14:integer                    # 积分
    rankOf 15:integer                   # 排名

    level 16:integer                    # 等级
    EXP 17:integer                      # 经验

    attack 18:*siegeBattleInfo(guid)    # 进攻记录
    defend 19:*siegeBattleInfo(guid)    # 防守记录
    rankAward 20:integer                # 排名奖励 0未领取 1已领取
    clanRankAward 21:integer            # 帮派排名奖励 0未领取 1已领取
    guessingAward 22:integer            # 竞猜奖励 0未领取 1已领取
    guessing 23:*string                 # 竞猜

    stage 24:integer                    # 战场 1初级 2高级
    packet 25:integer                   # 分组 1-8
    guessingCount 26:integer            # 被竞猜次数
    
    onCount 27:integer                  # 充值人数（添砖加瓦）
    onPay 28:integer                    # 添砖加瓦可领取的最大奖励ID

    frastRank 29:integer                # 首轮战场排名
    scoreRank 30:integer                # 积分排名
}

# 帮派玩家数据
.siegeClanPlayerInfo {
    guid 0:string                   # 玩家id
    name 1:string                   # 名称
    combatPower 2:integer           # 战斗力
    phase 3:integer                 # 阶段
    harm 4:integer                  # 伤害
    rankOf 5:integer                # 名次
    serverId 6:integer              # 区服ID
    mountType 7:integer             # 坐骑类型
    mountSkin 8:integer             # 坐骑皮肤
    summonPet 9:string              # 宠物
    character 10: integer           # 角色
    level 11: integer               # 等级

    HP 12: integer                  # 当前血量
    maxHP 13:integer                # 最大血量
    donate 14:integer               # 捐献积分
    donateCount 15:integer          # 免费捐献次数
    stamina 16:integer              # 体力
    staminaRecover 17:integer       # 体力恢复时间

    rankAward 18:integer            # 排名奖励 0未领取 1已领取
    clanRankAward 19:integer        # 帮派排名奖励 0未领取 1已领取
    guessingAward 20:integer        # 竞猜奖励 0未领取 1已领取
    guessing 21:*string             # 竞猜
    guessingId 22:integer           # 竞猜奖励id
    onPay 23:integer                # 充值（添砖加瓦） 0未充值 1充值
    payAward 24:integer             #（添砖加瓦）奖励 已领取最大奖励ID
    prepareRun 25:integer           # 第二次备战进入次数 0显示结算 1不显示
}

# 玩家数据
.siegePlayerInfo {
    tower 0:*integer                # 当前层的箱子 0未开启 1开启
    towerTier 1:integer             # 当前层数
    towerOpen 2:integer             # 开启下一层 0未开启 1开启
    
    activityItem 4:*integer         # 活动物品 1虎符 2神威令 3捐献道具 4抽奖道具
    giftLog 5:*siegeGiftLog(id)     # 礼包购买记录
    towerLog 6:*string              # 当前层的日志
}

# 攻防记录
.siegeBattleInfo {
    guid 0:string                   # 帮派id
    harm 1:integer                  # 伤害
}

# 礼包购买记录
.siegeGiftLog {
    id 0:string                     # 礼包id
    num 1:integer                   # 购买次数
}

# 活动时间表
.siegeTimeList {
    activityTime 0:*integer         # 活动时间
    applyTime 1:*integer            # 报名时间
    firstPrepareTime 2:*integer     # 首次备战
    firstFightTime 3:*integer       # 首次战斗
    secondPrepareTime 4:*integer    # 第二次备战
    secondFightTime 5:*integer      # 第二次战斗
}

########################## 攻城略地 ##########################

# 运势任务数据
.fortuneTask {
    id 1 : string                                                           # 任务id
    state 2 : integer                                                       # 状态(0:未完成 1:已完成 2:已领取)
    value 3 : integer                                                       # 进度
}

# 运势每日礼包数据
.fortuneDaysGiftsRecord {
    id 1 : integer                                                          # 配置的礼包id
    tookCount 2 : integer                                                   # 已领取/购买次数
}

# 运势领取累计抽取次数奖励数据
.fortuneTotalDrawBonusesRecords {
    count 1 : integer                                                       # 次数
    isTook 2 : boolean                                                      # 是否已领取
}

# 运势(运营)
.activityFortune {
    score 1 : integer                                                       # 抽奖券
    drawCount 2 : integer                                                   # 累计已抽取次数
    tasksStates 3 : *fortuneTask(id)                                        # 任务数据
    daysGiftsRecords 4 : *fortuneDaysGiftsRecord(id)                        # 每日礼包数据
    totalDrawBonusesRecords 5 : *fortuneTotalDrawBonusesRecords(count)      # 已领取累计抽取次数奖励数据
    guarantee 6 : integer                                                   # 保底
    drawRecords 7 : *drawRecords(id)                                        # 运势道具抽取次数
}

.drawRecords {
    id 1 : integer                                                          # 道具id
    count 2 : integer                                                       # 抽取次数
}

# 轮回殿任务数据
.reincarnationHallTask {
    id 1 : string                                                           # 任务id
    state 2 : integer                                                       # 状态(0:未完成 1:已完成 2:已领取)
    value 3 : integer                                                       # 进度
}

# 轮回殿礼包数据
.reincarnationHallGiftsRecord {
    id 1 : integer                                                          # 配置的礼包id
    tookCount 2 : integer                                                   # 已领取/购买次数
}

# 轮回殿(运营)
.activityReincarnationHall {
    currentReincarnation 1 : integer                                        # 当前轮回次数
    tasksStates 2 : *reincarnationHallTask(id)                              # 任务数据
    giftsRecords 3 : *reincarnationHallGiftsRecord(id)                      # 礼包数据
}

# 精怪历练任务数据
.gremlinExperienceTask {
    id 1 : string                                                           # 任务id
    state 2 : integer                                                       # 状态(0:未完成 1:已完成 2:已领取)
    value 3 : integer                                                       # 进度
}

# 精怪历练礼包数据
.gremlinExperienceGiftsRecord {
    id 1 : integer                                                          # 配置的礼包id
    tookCount 2 : integer                                                   # 已领取/购买次数
}

# 精怪历练怪物状态
.gremlinExperienceMonsterState {
    id 1 : integer                                                          # 怪物id(活动配置)
    state 2 : integer                                                       # 状态(0:能攻击 1:已攻击)
}

# 精怪历练累充奖励领取记录
.gremlinExperienceTookTotalRechargeRecord {
    money 1 : integer                                                       # 累充档次金额
}

# 精怪历练排行榜
.gremlinExperienceRank {
    rank 1 : integer                                                        # 排名
    playerId 2 : string                                                     # 玩家id
    name 3 : string                                                         # 玩家名
    avatar 4 : integer                                                      # 玩家头像
    level 5 : integer                                                       # 玩家境界
    score 6 : integer                                                       # 总积分
    phase 7 : integer                                                       # 阶段
    character 8 : integer                                                   # 角色
    appearance 9 : integer                                                  # 形象
    chance     10:string                                                    # 消耗金竹
}

# 精怪历练(运营)
.activityGremlinExperience {
    score 1 : integer                                                       # 积分
    totalMoney 2 : integer                                                  # 累计充值
    attackCount 3 : integer                                                 # 可驱散次数
    tasksStates 4 : *gremlinExperienceTask(id)                              # 任务数据
    giftsRecords 5 : *gremlinExperienceGiftsRecord(id)                      # 礼包数据
    monstersState 6 : *gremlinExperienceMonsterState(id)                    # 怪物状态
    tookTotalRechargeRecords 7 : *gremlinExperienceTookTotalRechargeRecord(money) # 累充奖励领取记录
    gremlinsLog 8 : *string                                                 # 门客上阵记录
    chance 9:string                                                         # 消费金竹
}

# 灵兽幻境任务数据
.animalFairylandTask {
    id 1 : string                                                           # 任务id
    state 2 : integer                                                       # 状态(0:未完成 1:已完成 2:已领取)
    value 3 : integer                                                       # 进度
}

# 灵兽幻境礼包数据
.animalFairylandGiftsRecord {
    id 1 : integer                                                          # 配置的礼包id
    tookCount 2 : integer                                                   # 已领取/购买次数
}

# 灵兽幻境探险队伍中的槽数据
.animalFairylandSlotInfo {
    petId 1 : string                                                        # 灵兽实例id
    petProtoId 2 : integer                                                  # 灵兽原型id
    petDevourLevel 3 : integer                                              # 灵兽吞噬等级
}

# 灵兽幻境探险队伍
.animalFairylandTeamInfo {
    slotsInfo 1 : *animalFairylandSlotInfo                                  # 队伍中的槽数据
}

# 灵兽幻境轮盘抽取记录
.animalFairylandDrawRecord {
    id 1 : integer                                                          # 商品序号
    count 2 : integer                                                       # 已抽取到次数
}

# 灵兽幻境祝福数据
.animalFairylandbuffState {
    id 1 : integer                                                          # 祝福id
    teamId 2 : integer                                                      # 绑定队伍id
    startTime 3 : integer                                                   # 祝福开始时间
}

# 灵兽幻境(运营)
.activityAnimalFairyland {
    score 1 : integer                                                       # 积分
    poolScore 2 : integer                                                   # 积分池积分
    crystal 3 : integer                                                     # 水晶数量
    pumpCount 4 : integer                                                   # 可抽取数量
    totalPumpCount 5 : integer                                              # 累计抽取次数
    tasksStates 7 : *animalFairylandTask(id)                                # 任务数据
    exploreTasksStates 8 : *animalFairylandTask(id)                         # 探索任务数据
    giftsRecords 9 : *animalFairylandGiftsRecord(id)                        # 礼包数据
    teamsInfo 10 : *animalFairylandTeamInfo                                 # 队伍数据
    drawRecords 11 : *animalFairylandDrawRecord(id)                         # 轮盘抽取记录
    buffState 12 : animalFairylandbuffState                                 # 祝福数据
    chance     13:string                                                    # 消费金竹
}

# 灵兽幻境排行榜
.animalFairylandRank {
    rank 1 : integer                                                        # 排名
    playerId 2 : string                                                     # 玩家id
    name 3 : string                                                         # 玩家名
    avatar 4 : integer                                                      # 玩家头像
    level 5 : integer                                                       # 玩家境界
    score 6 : integer                                                       # 总积分
    phase 7 : integer                                                       # 阶段
    character 8 : integer                                                   # 角色
    appearance 9 : integer                                                  # 形象
    chance  10:string                                                       # 消耗金竹
}

# 神通灌顶任务数据
.theurgyAbhisecaTask {
    id 1 : string                                                           # 任务id
    state 2 : integer                                                       # 状态(0:未完成 1:已完成 2:已领取)
    value 3 : integer                                                       # 进度
}

# 神通灌顶礼包数据
.theurgyAbhisecaGiftsRecord {
    id 1 : integer                                                          # 配置的礼包id
    tookCount 2 : integer                                                   # 已领取/购买次数
}

# 神通灌顶已领取达标奖励记录
.theurgyAbhisecaTookBonusesRecord {
    count 1 : integer                                                       # 配置的礼包id
}

# 神通灌顶(运营)
.activityTheurgyAbhiseca {
    pumpCount 4 : integer                                                   # 神通已抽取数量
    tasksStates 7 : *theurgyAbhisecaTask(id)                                # 任务数据
    giftsRecords 9 : *theurgyAbhisecaGiftsRecord(id)                        # 礼包数据
    tookBonusesRecords 11 : *theurgyAbhisecaTookBonusesRecord(count)        # 已领取达标奖励记录
}

.activityPalace {
    isGrant 0: boolean # 今日是否赐福
    likeInfo 1: palaceLikeInfo # 点赞
    buffId 2:integer # buffId
    buffCount 3:integer # buff次数
}

.activityData {
    demo 0 : activityDemo
    dynamicDemo 1 : activityDynamicDemo
    demo1 2: demo1
    demo2 3: demo1
    demo3 4: demo1
    demo4 5: demo1
    activityShop 6:activityShop
    activityHaven 8:activityHaven                                           #福地
    activityKingMonster 7:activityKingMonster                               #挑战妖王
    activityQunYin 9:activityQunYin
    activityTower 10:activityTower
    activitySevenDays 11:*sevenDays
    dailyWelfare 12:dailyWelfare
    totalCharge 13:totalCharge
    risingStar 14:risingStar
    activityInvasion 15:activityInvasion
    activityOpenCelebration 16 : activityOpenCelebration                    # 开服庆典(运营)
    activityFortune 17 : activityFortune                                    # 运势(运营)
    activityReincarnationHall 18 : activityReincarnationHall                # 轮回殿(运营)
    activityGremlinExperience 19 : activityGremlinExperience                # 精怪历练(运营)
    activityAnimalFairyland 20 : activityAnimalFairyland                    # 灵兽幻境(运营)
    activityTheurgyAbhiseca 21 : activityTheurgyAbhiseca                    # 神通灌顶(运营)
    activityPalace 22: activityPalace
    activitySpring 23:activitySpring                                        # 灵泉
    activityRebateItem 24:activityRebateItem                                # 返利
    activityOpenRank 25:activityOpenRank                                    # 开服排行榜
	activityDomainMonster 26:activityDomainMonster                          # 莽荒妖域
}

.activityState {
    id 0 : string
    activityId 1 : integer
    clasz 2 : integer
    playerId 3 : string
    state 4 : integer
    resetTime 5 : integer
    isPlayerUnique 6 : integer
    data 7 : activityData
}

.activityOpenState {                                                          # activityId
    id 0 : integer
    isOpened    1 : boolean
    state       2 : integer #状态（ 0 展示，1开始，2结束，3，关闭）
    startTime   3 : integer #开始时间（可能为nil）
}

.activityGlobalDemo {
    test 0 : integer
    test2 1 : integer
}

.activityGlobalGremlinExperience {
    lastRecoverTime 0 : integer                                             # 上次回复时间
}

.activityGlobalClanSolo {
    state 0: integer # 活动阶段
    nextStateTime 1: integer # 下一个阶段时间
}

.activityGlobalData {
    demo 0 : activityGlobalDemo
    activityGlobalGremlinExperience 1 : activityGlobalGremlinExperience     # 精怪历练全局数据(运营)
    activityGlobalClanSolo 2: activityGlobalClanSolo # 单刀赴会
}

.activityGlobalState {
    id 0 : string
    activityId 1 : integer
    clasz 2 : integer
    state 3 : integer
    resetTime 4 : integer
    data 5 : activityGlobalData
}

.dynamicActivityParam {
    id 0 : integer                                                          # activityId
    name 1 : string                                                         # 活动名称
    icon 2 : string                                                         # 活动icon
    desc 3 : string                                                         # 活动描述
    detail 4 : string                                                       # 活动详情描述
    needLevel 5 : integer                                                   
    sortIndex 6 : integer                                                   # 活动排序index1
    startTime 7 : integer                                                   # 活动开始时间
    endTime 8 : integer                                                     # 活动结束时间
    segmentsPerWeek 9 : string                                              # 一周几时开
    segmentsPerDay 10 : string                                              # 一天几时开
    clasz 11 : integer                                                      # 运营活动固定id
    data 12 : string                                                        # 运营活动配置数据
    state 13 : integer                                                      # 运营活动状态
    updateTime 14 : integer
}

.havenMoneyBounse {
    bonusType       2 : integer #发放资产奖励类型
    bonusCount      3 : integer #发放资产奖励数量
}

#获取其他玩家资源列表
.getHavenResource {
    playerInfo          0 : activityRankPlayer #玩家信息
    havenResource       1 : *havenResource
}

#当前进行中的采集/抢夺
.havenCollectingInProgress {
    resourceId      0 : integer      #资源位置ID
    mouseCount      1 : integer      #老鼠数量
    targetPlayerId  2 : string       #目标playerid
    route           3:double        #资源路程
    velocity        4:double         #速度
    winner          5:integer        #当前赢家 1为防守者 2为进攻者 
    itemId          6 : integer      #福地资源表ID
    playerName      7:string         #敌方名字(如果没有名字就没有敌人)
    targetMouseCount 8:integer       #目标老鼠数量
}

#福地自动采集物品数据
.havenAutoResource {
    itemLevel 0 : integer       #自动采集物品等级
    itemId 1 : integer          #自动采集物品Id
}

#福地聚宝盆数据
.havenTreasureData {
    level 0 : integer       #阶段
    progress 1 : integer    #进度0-100
    state 2: integer       #2已领取 1开通 0未开通 
}

#福地历史数据
.havenHistoryRecords {
    time                0 : integer         #偷取时间
    playerId            1 : string          #偷取者/本人PlayerId
    itemId              2 : integer         #物品表Id
    playerInfo          3 : activityRankPlayer #玩家信息
}

.havenResourcePlayerState {
    mouseAmount 0:integer       #鼠鼠数量
    playerId 1:string           #玩家id
    trainLevel 2:integer        #训练等级   
    staminaConsumed 3:integer   #已消耗体力 
    totalMouse      4:integer   #老鼠总数  
    extStaminaAdd   5:integer   #兽友充沛体力上限加成
    name            6:string    #姓名
}





#福地资源数据
.havenResource {
    id              0:integer  #资源位置  1-6
    itemId          1:integer  #物品表Id
    attacker        2:havenResourcePlayerState #进攻者状态
    defender        3:havenResourcePlayerState #防守者状态
    route           4:double  #资源路程
    velocity        5:double #速度
    winner          6:integer #当前赢家 1为防守者 2为进攻者 
    isSpecialResource          7:integer #是否特殊资源 0为正常资源 1为特殊资源
    specialResourceExpirationDate          8:integer #特殊资源过期时间
}

#玩家福地数据
.activityHaven {
    staminaConsumed 0:integer                                   #已消耗体力
    staminaBonus 1:integer                                      #(充沛的)体力加成（废弃）
    trainLevel 2:integer                                        #训练等级
    totalMouse 3:integer                                        #老鼠总数
    restMouse 4:integer                                         #空闲老鼠
    resource 5:*havenResource                                   #资源列表
    isVip 6: integer                                            #0未非月卡 1为月卡
    vipExpirationDate 7: integer                                #月卡到期时间戳
    specialPlayers 8: string                                    #特殊玩家列表  playerId;playerId;playerId;
    randomPlayers 9: string                                     #随机玩家列表  playerId;playerId;playerId;
    watchedAdCount 10:integer                                   #观看广告次数
    randomPlayersRefreshTime 11:integer                         #随机玩家列表可刷新时间戳
    historyRecords 12:*havenHistoryRecords                      #历史记录
    treasureData 13:*havenTreasureData                          #聚宝盆数据
    startTrial 14: integer                                      #玩家试用自动采集 0为未试用,1为试用中
    autoCollectionTime 15: integer                              #自动采集到期时间戳
    isAutoCollectionActivated 16: integer                       #是否激活自动采集 0否 1是
    isSmartRefreshActivated 17: integer                         #是否激活智能刷新 0否 1是
    smartRefreshIntervalTime 18: integer                        #智能采集刷新时间
    extStaminaAdd            19:integer                         #兽友充沛体力上限加成
    autoResourceCollection  20:*havenAutoResource               #福地自动采集物品数据
}

# 镇妖塔数据
.activityTower {
    curTier 0:integer                       # 当前关卡ID
    highTier 1:integer                      # 最高关卡ID
    buff 2:*buff                            # BUFF
    buffNum 3:integer                       # BUFF选择次数
    buffList 4:*integer                     # BUFF选择列表
    preinstall 5:*integer                   # 预设
    quick 6:integer                         # 快速挑战      1快速挑战
    preinstallStart 7:integer               # 预设状态      0未开启 1开启
}

#镇妖塔BUFF
.buff {
    buffId 0:integer                        # BUFFID
    buffLevel 1:integer                     # BUFF等级
}


#开服冲榜活动
.risingStar {
    startTime 0: integer      # 开始时间
    endTime 1: integer        # 结束时间
}

#七日签到数据
.sevenDays {
    id 0: integer           # 活动主题ID
    signNum 1: integer      # 签到次数
    signStart 2: integer    # 今日签到 1已签到 0未签到
    start 3: integer        # 活动状态 1已完成 0未完成
}


#累充&累天
.totalCharge {
    charge 0: totalChargeCharge         # 累充
    days 1: totalChargeDays             # 累天
    perpetual 2:totalChargePerpetual    # 常驻累充
}

#常驻累充
.totalChargePerpetual {
    money 0: integer                # 总充值
    perpetual 1: *ActivityMoney    # 累充活动
}

#累充
.totalChargeCharge {
    totalCharge 0: integer      # 总充值
    endTime 1: integer          # 结束时间
    charge 2: *ActivityMoney    # 累充活动
}

#累充活动
.ActivityMoney {
    money 0: integer        # 金额
    bonuseID 1: string      # 奖励
    start 2: integer        # 状态  0未达标 1可领取 2已领取
}

#累天
.totalChargeDays {
    chargeDays 0: integer   # 天数
    endTime 1: integer      # 结束时间
    days 2: *ActivityDays   # 累天活动
}

#累天活动
.ActivityDays {
    days 0: integer         # 天数
    bonuseID 1: string      # 奖励
    start 2: integer        # 状态  0未达标 1可领取 2已领取
}

#魔教来袭(异兽入侵)数据
.activityInvasion {
    challengeCount      0: integer         # 剩余挑战次数
    curPhase            1: integer         # 当前阶段
}

.bazaarTier {
    from 0: integer
    to 1: integer
    paymentKind 2: string
    costPerGroup 3: integer
}

.bazaarQuoteSegment {
    from 0: integer
    to 1: integer
    paymentKind 2: string
    itemCount 3: integer
    groupCount 4: integer
    costPerGroup 5: integer
    cost 6: integer
}

.bazaarQuote {
    actualItems 0: integer
    nextDailyItemCount 1: integer
    segments 2: *bazaarQuoteSegment
    moneyCost 3: integer
    stoneCost 4: integer
    voucherCost 5: integer
}

.bazaarItemPolicy {
    entryId 0: integer
    enabled 1: boolean
    unitItemCount 2: integer
    perOrderLimit 3: integer
    dailyItemLimit 4: integer
    resetDaily 5: boolean
    dailyRemainingItems 6: integer
    currentTier 7: bazaarTier
    nextBoundary 8: integer
    remainingOrderItems 9: integer
    paymentKind 10: string
    quote 11: bazaarQuote
}

.bazaarState {
    mode 0: integer
    normalRemainingItems 1: integer
    dailyRemainingItems 2: integer
    maxVoucherCount 3: integer
    currentPaymentKind 4: string
    nextTierBoundary 5: integer
    remainingOrderItems 6: integer
    quote 7: bazaarQuote
}

#坊市数据
.shopList {
    id 0: integer                          # id
    buyCount 1: integer                    # 总购买数
    type 2: integer                        # 折扣类型
    freeCount 3: integer                   # 免费购买次数
    discount1Count 4: integer              # 折扣1次数
    discount2Count 5: integer              # 折扣2次数
    discount3Count 6: integer              # 折扣2次数
    paidDiscounts1Count 7: integer         # 付费折扣1次数
    paidDiscounts2Count 8: integer         # 付费折扣1次数
    paidDiscounts3Count 9: integer         # 付费折扣1次数
    policyVersion 10: integer              # 坊市规则版本
    dailyDateKey 11: string                # 服务器日键 YYYYMMDD
    dailyPaidItemCount 12: integer         # 当日付费实际物品数
    mode 13: integer                       # 1普通 2代金券 3售罄
    normalRemainingItems 14: integer       # 普通阶段剩余实际物品数
    dailyRemainingItems 15: integer        # 当日剩余实际物品数
    maxVoucherCount 16: integer            # 当前最多可使用代金券数
    currentPaymentKind 17: string          # 当前权威支付方式
    nextTierBoundary 18: integer           # 下一阶梯累计物品边界
    remainingOrderItems 19: integer        # 当前单可购买实际物品数
    quote 20: bazaarQuote                  # 一个策略单位的服务端预览报价
}

#坊市数据
.activityShop {
    shopList  0: *shopList
    policyVersion 1: string
    policyItems 2: *bazaarItemPolicy(entryId)
}

]]

local s2c = [[
# 攻城略地 获取礼包下发
siegeOnPayMoney %d {
    request {
        bonusesResult 1:bonusesResult   # 奖励
        activityItem 2:*integer         # 活动道具
        giftLog 3:*siegeGiftLog(id)     # 礼包记录
    }
}

# 攻城略地 活动状态改变
siegeStateChage %d {
    request {
        state 0: integer            # 状态 0未开启 1报名 2首次备战 3首次对战 4第二次备战 5第二次对战 6结算
    }
}

activityStateChanged %d {
    request {
        activityState 0 : activityState
    }
}

activityStateRemoveChanged %d {
    request {
        id 0 : string
        activityId 1 : integer
    }
}

activityOpenState %d {
    request {
        id 0 : integer
        isOpened    1 : boolean
        state       2 : integer #状态（ 0 展示，1开始，2结束，3，关闭）
        startTime   3 : integer #开始时间（可能为nil）

    }
}

activityGlobalStateChanged %d {
    request {
        activityGlobalState 0 : activityGlobalState
    }
}

dynamicActivityInsert %d {
    request {
        dynamicActivityParam 0 : dynamicActivityParam
    }
}

dynamicActivityRemove %d {
    request {
        id 0 : integer
    }
}

dynamicActivityStateChanged %d {
    request {
        id 0 : integer
        state 1 : integer
    }
}

dynamicActivitySortIndex %d {
    request {
        id 0 : integer
        sortIndex 1 : integer
    }
}
#活动获得物品(福地活动/)
activityGetItems  %d {
    request {
        itemInserts     1 : *itemInsert #发放物品(奖励)
        bonusType       2 : integer #发放资产奖励类型
        bonusCount      3 : integer #发放资产奖励数量
        sourcePlayerId  4: string #从某玩家身上获得的资源
    }
    
}




#群英挑战令购买次数变化
qunyinChaBuyCountChanged %d {
    request {
        chaBuyTime 0:integer #购买挑战令时间
        count 1:integer #已购买挑战令次数
        qunyinRefreshCount 2:integer #群英挑战次数 可能为nil
        chaRecoverTime 3:integer
    }
}


#更新福地房间信息
updateRoomHavenInfo %d {
    request {
        roomPlayerId 0 : string
        state        1 : integer                                    #更新状态（预留） 1掠夺
        resource     2 :*havenResource                              #资源列表
    }
}


#蛮荒 被玩家攻击
onDomainBattleEvent %d {
    request {
        domianBattleInfo 1 : domianBattleInfo
    }
}

#蛮荒礼包奖励奖励
onDomainGiftBonuses %d {
    request {
        bonusesResult 1 : bonusesResult
    }
}
#蛮荒退出
onDomianExit %d {
    request {

    }
}



]]

local c2s = [[

activityDemoTest %d {
    request {
    }

    response {
        errorcode 0 : integer
    }
}

dynamicActivityDemoTakeExp %d {
    request {
        activityId 0 : integer
    }

    response {
        errorcode 0 : integer
    }
}

#坊市购买
shopBuy %d {

    request {
        id 0 : integer #购买ID 102活动中shop节点的id
        num 1:integer #购买数量
        policyVersion 2: string #客户端当前看到的会话策略版本
    }

    response {
        errorcode 0 : integer
        bonusesResult 2:bonusesResult 
        bazaarState 3: bazaarState
        quote 4: bazaarQuote
        policyVersion 5: string
        bazaarError 6: string
    }
    
}

#坊市代金券购买
bazaarVoucherBuy %d {
    request {
        id 0 : integer #活动102的shop条目ID
        num 1: integer #购买策略组数，实际物品数由服务端策略决定
        policyVersion 2: string #客户端当前看到的会话策略版本
    }
    response {
        errorcode 0 : integer
        bonusesResult 2:bonusesResult
        bazaarState 3: bazaarState
        quote 4: bazaarQuote
        policyVersion 5: string
        bazaarError 6: string
    }
}

#妖王挑战
monsterKingChallenge %d {

    request {
        id      0 :string       #解锁的ID
        isQuick 1 :integer      #1为快速通关，0为常规
    }

    response {
        errorcode 0 : integer
        battleResult 1:battleResult
        bonusesResult 2:bonusesResult #可能为Nil
        costResult    3:costResult    #可能为Nil
        companionBoostBonuses 4:bonusesResult # 兽友加成奖励
        palaceBoostBonuses 5:bonusesResult # 琅琊榜加成奖励
    }
    
}
####################入侵####################
#入侵挑战
challengeInvasion  %d {

    request {
    }

    response {
        errorcode               0: integer
        battleResult            1: battleResult
        bonusesResultArr        2: *bonusesResult  # 奖励 可能为Nil
        damage                  3: integer #本轮伤害
    }
    
}

#入侵排行
getInvasionRank %d { #获取排行榜
        request {
            from 0:integer # 排名开始
            to 1:integer # 排名结束
        }

        response {
            errorcode 0:integer
            ranks 1: *activityRankPlayer
            rankOf 2: integer
            score 3: integer
        }
    }

#################################### 个人常规活动 ####################################

#################################### 镇妖塔 ####################################
# 挑战（快速挑战）
towerFight %d {
    request {
    }
    response {
        errorcode 0 : integer
        bonusesResultArr 1: *bonusesResult  # 领取奖励
        battleResult 2:battleResult
    }
}

# 选择加成
towerBuff %d {
    request {
        buff 0: integer     # 选择加成  1-3
        trench 1: integer   # 替换位置  1-8
    }
    response {
        errorcode 0 : integer
    }
}

# 加成预设
towerPreset %d {
    request {
        place 0: integer    # 替换位置  1-5     0切换预设状态
        attr 1: integer     # 替换属性
    }
    response {
        errorcode 0 : integer
    }
}

# 排行榜
towerRanks %d {
    request {
    }
    response {
        errorcode 0: integer
        towerRank 1: *activityRankPlayer     # 镇妖塔排行榜
        selfRank 2: activityRankPlayer        # 玩家所处排行
    }
}
#################################### 镇妖塔 ####################################

#################################### 七日签到 ####################################
# 七日签到(领取奖励)
sevenDays %d {
    request {
        tid 0: integer       # 活动主题ID 
    }
    response {
        errorcode 0 : integer
        bonusesResultArr 1: bonusesResult  # 领取奖励
    }
}
#################################### 七日签到 ####################################

#################################### 开服冲榜 ####################################
# 开服冲榜
risingStar %d {
    request {
    }
    response {
        errorcode 0: integer
        ranks 1: *activityRankPlayer     # 排行榜
        selfRank 2: activityRankPlayer        # 玩家所处排行
    }
}
#################################### 开服冲榜 ####################################

#################################### 累充&累天 ####################################
# 累充&累天(领取奖励)
totalCharge %d {
    request {
        id 0: integer       # 0累充 1累天
        type 1: integer     # 0免费奖励 1领取奖励
    }
    response {
        errorcode 0 : integer
        bonusesResultArr 1: *bonusesResult  # 领取奖励
    }
}
#################################### 累充&累天 ####################################

#################################### 福地活动 ####################################
#进入福地
enterHaven %d {
    request {
    }

    response {
        errorcode 0 : integer
        itemInserts 1 : *itemInsert #领取奖励
        moneyBounse 2 : *havenMoneyBounse
        randPlayers 3 : string  #随机玩家
    }
    
}


#退出福地
exitHaven %d {
    request {
    }
    response {
        errorcode 0 : integer
    }
}

#进入他人福地房间
enterRoomHaven %d {
    request {
        roomPlayerId 0: string
    }
    response {
        errorcode 0 : integer
        resource  1 :*havenResource                                   #资源列表

    }
}


#退出他人福地
exitRoomHaven %d {
    request {
    }
    response {
        errorcode 0 : integer
    }
}



#开启免费聚宝盆
openTreasureHaven %d {
    request {
		level 0 : integer #预留
    }
    response {
        errorcode 0 : integer
    }
}


#采集资源
gatheringHavenResources %d {
    request {
        mouseCount 1: integer #派出老鼠数量 
        id 2: integer #资源列表id
    }

    response {
        errorcode 0 : integer
        activityHaven 1: activityHaven #玩家福地数据
    }
    
}
#抢夺资源
plunderingHavenResources %d {
    request {
        targetPlayerId 0: string #攻击目标playerid
        mouseCount 1: integer #派出老鼠数量
        id 2: integer #资源列表id
    }

    response {
        errorcode 0 : integer
        activityHaven 1: activityHaven #玩家福地数据
        targetHavenResource 2:havenResource #被攻击者的资源状态
    }
    
}
#采集召回
gatheringRecall %d {
    request {
        mouseCount 1: integer #召回老鼠数量 
        id 2: integer #资源列表id
    }

    response {
        errorcode 0 : integer
        activityHaven 1: activityHaven #玩家福地数据
    }
}
# 抢夺召回
plunderingRecall %d {
    request {
        targetPlayerId 0: string #攻击目标playerid
        mouseCount 1: integer #召回老鼠数量
        id 2: integer #资源列表id
    }

    response {
        errorcode 0 : integer
        activityHaven 1: activityHaven #玩家福地数据
        targetHavenResource 2:*havenResource #被攻击者的资源状态
    }
    
}
#刷新福地资源
refreshHavenResource %d {
    request {
    }
    response {
        errorcode 0 : integer
        havenResource 2:*havenResource #玩家资源状态
    }
    
}


#刷新福地资源(广告)
refreshHavenResourceByAds %d {
    request {
    }
    response {
        errorcode 0 : integer
        havenResource 2:*havenResource #玩家资源状态
    }
    
}

#获取其他玩家资源状态
getHavenResourceByPlayerId %d {
    request {
        targetPlayerIdArr 0: *string #目标playerid
    }

    response {
        errorcode 0 : integer
        getHavenResourceArr 1: *getHavenResource #目标玩家福地数据数组
    }
    
}

#刷新随机玩家列表
refreshHavenRandomPlayers %d {
    request {
    }

    response {
        errorcode 0 : integer
        activityHaven 1: activityHaven #玩家福地数据
        getHavenResourceArr 2: *getHavenResource #目标玩家福地数据数组

    }
    
}

#领取聚宝盆奖励
takeHavenTreasureDataBonuse %d {
    request {
        level 0 : integer #聚宝盆阶段1-3
    }

    response {
        errorcode 0 : integer
        reward 1: integer #奖励钻石数
        treasureData 2:*havenTreasureData      #聚宝盆数据

    }
    
}

#激活聚宝盆阶级
openHavenTreasureData %d {
    request {
        level 0 : integer #聚宝盆阶段1-3
    }

    response {
        errorcode 0 : integer
        treasureData 1:*havenTreasureData      #聚宝盆数据

    }
    
}

#雇佣老鼠/训练提速
hireAndTrainMouse %d {
    request {
    }

    response {
        errorcode 0 : integer
        activityHaven 1: activityHaven #玩家福地数据
        costResult    2: costResult #消耗结构 可能为nil
    }
    
}

#激活试用自动采集
activityAutoCollectionTrial %d {
    request {
    }

    response {
        errorcode 0 : integer
        activityHaven 1: activityHaven #玩家福地数据
    }
    
}

#自动采集续费
renewAutoCollection %d {
    request {
        agentTime 0 : integer #自动采集购买时长（天）7或30
    }

    response {
        errorcode 0 : integer
        activityHaven 1: activityHaven #玩家福地数据
    }
    
}

#激活自动采集
autoCollectionActivated %d {
    request {
        isOpen 0 : integer #是否激活自动采集 0否 1是
        setResource 1 : *havenAutoResource #福地自动采集物品数据
    }

    response {
        errorcode 0 : integer
        autoResourceCollection 1: *havenAutoResource #福地自动采集物品数据
        isAutoCollectionActivated 2: integer   #是否激活自动采集 0否 1是
    }
    
}

#激活智能采集
smartRefreshActivated %d {
    request {
        isOpen 0 : integer #是否激活智能采集 0否 1是
    }

    response {
        errorcode 0 : integer
        isSmartRefreshActivated 1: integer   #是否激活智能采集 0否 1是

    }
    
}

#获取福地当前进行的采集
getHavencollectingInProgress %d {
    request {
    }
    response {
        errorcode 0 : integer
        collectingInProgress 1: *havenCollectingInProgress         #当前进行中的采集/抢夺
    }
}

#领取每日福利 
takeWelfare %d {
    request {

    }
    response {
        errorcode 0 : integer
        bonusesResult 1:bonusesResult
    }
}

#################################### 福地活动 ####################################

#################################### 跨服群英 ####################################

#刷新群英挑战列表 可能就第一次需要 也就是没有activityState的时候， 之后的刷新列表会保存在activityState.data.list中
#没有activityState或者首次进入跨服群英界面可以调用
queryChallengeList %d {
    request {

    }
    response {
        errorcode 0:integer
        opps 1:*qunyinItem
        selfRank 2:integer #<=0标识未上榜
        activityState 3:activityQunYin
    }
}

#刷新群英挑战列表
refreshQunYinList %d {
    request {

    }
    response {
        errorcode 0:integer
        opps 1:*qunyinItem
        qunyinRefreshCount 2:integer #群英刷新次数
        selfRank 3:integer #<=0标识未上榜
    }    
}

#购买挑战令
qunyin_buy %d {
    request {
        count 0:integer #购买个数
    }
    response {
        errorcode 0:integer
        itemInserts 1:*itemInsert
    }
}

#挑战对手
challengeOpp %d {
    request {
        oppRank 0:integer #对手的排名 在自己的activityState.data.list中
        count 1:integer #当对手排名低于自己的时候可以传次数
        battleModelInfo 2:battleModelInfo #需要显示的形象信息
    }

    response {
        errorcode 0:integer
        itemRemoves 1:*itemRemove
        battleResult 2:battleResult #battleResult
        opps 3:*qunyinItem
        itemInserts 4:*itemInsert #可能奖励金手指枸杞
    }
}

#积分商店兑换
scoreShopBuy %d {
    request {
        id 0:integer #购买id shop xml中的id
        count 1:integer #购买次数
    }
    response {
        errorcode 0:integer
        bonusesResult 1:bonusesResult
    }
}

#领取成就
takeQunYinAchievement %d {
    request {
        id 0:integer #成就ID 成就表中的rank
    }
    response {
        errorcode 0:integer
        bonusesResult 1: bonusesResult
    }
} 

#查看排行榜
viewRankInfo %d {
    request {
        page 0:integer #查看页数 每页20个信息
    }
    response {
        errorcode 0:integer
        result 1: *qunyinItem
    }
}

#查看挑战记录
queryChallengeLog %d {
    request {
        page 0:integer #查看页数 每页20个信息
    }
    response {
        errorcode 0:integer
        result 1: *qunyinLog
    }    
}

#查看开服排行榜
viewOpenRanks %d {
    request {
        page 0:integer #查看页数 每页20个信息
        day 1:integer #查看那天的排行榜 1-6
    }    

    response {
        errorcode 0:integer
        day 1: integer
        selfrank 2:integer #自己的排名 -1未上榜
        data 3:*openRankItem
        page 4:integer
        value 5:integer #自己的积分
        chance 6:string #消费的金主
    }      
}


#领取自己的开服奖励
takeOpenRankBonuses %d {
    request {}
    response {
        errorcode 0:integer
        bonusesResult 3 : bonusesResult                            
    }    
}
#################################### 跨服群英 ####################################

#################################### 灵泉 ####################################
# 获取灵泉信息
openSpring %d {
    request {
    }
    response {
        errorcode 0:integer
    }
}

# 进入灵泉（领取积分）
enterSpring %d {
    request {
    }
    response {
        errorcode 0:integer
        score 1:integer
    }
}

# 开辟灵泉
createSpringRoom %d {
    request {
        count 0: integer            # 创建数量 1-10
    }
    response {
        errorcode 0:integer
        redBagNum 1: integer       # 发放的红包数量
        itemRemoves 2:*itemRemove
    }
}

# 设置座位权限
setSpringPosPower %d {
    request {
        posPower 0:*integer           # 位置权限
    }
    response {
        errorcode 0:integer
    }
}

# 分享(临时用作开启称号 channel传入称号ID)
springShare %d {
    request {
        channel 0:integer           # 频道 0所有人 1帮派
    }
    response {
        errorcode 0:integer
    }
}

# 广告
springAd %d {
    request {
    }
    response {
        errorcode 0:integer
        bonusesResultArr 1: bonusesResult  # 奖励
    }    
}

# 落座
springSitDown %d {
    request {
        roomId 0:string             # 房主ID
        seat 1:integer              # 座位号
    }
    response {
        errorcode 0:integer
        isWin 1:integer             # 0成功 1失败
        battleResult 2:battleResult # 战斗数据(称号碾压则无需战斗)
        score 3:integer             # 下发积分（每日首次落座奖励&&换房积分领取）
        posList 4:springPos         # 座位信息
    }    
}

# 申请落座
springApplySitDown %d {
    request {
        roomId 0:string             # 房主ID
        seat 1:integer              # 座位号
    }
    response {
        errorcode 0:integer
    }    
}

# 获取座位申请列表
springApplySitDownList %d {
    request {
        roomId 0:string             # 房主ID
    }
    response {
        errorcode 0:integer
        playerList 1:*springPlayerInfoList
    }    
}

# 同意申请
springApplyConsent %d {
    request {
        playerId 0:string           # 玩家ID
        seat 1:string               # 座位号
    }
    response {
        errorcode 0:integer
        posList 1:springPos         # 座位信息
    }    
}

# 驱逐玩家
springKickOut %d {
    request {
        seat 0:string               # 座位号
    }
    response {
        errorcode 0:integer
    }
}

# 领取红包
openSpringRedBag %d {
    request {
    }
    response {
        errorcode 0:integer
        redBagInfo 1: *redBagInfo    # 红包详情
    }
}

# 灵泉列表
openSpringList %d {
    request {
        isClan 0: integer           # 0所有 1帮派
        vacancy 1: integer          # 0所有 1空位
    }
    response {
        errorcode 0:integer
        selfRoom 1: springRoom           # 自己房间信息
        inRoom 2: springRoom             # 所在房间信息
        roomList 3: *springRoom          # 房间列表信息
    }
}

# 灵泉详细信息（进入灵泉）
openSpringInfo %d {
    request {
        roomId 0: string           # 房主ID
    }
    response {
        errorcode 0:integer
        roomInfo 1: springRoom           # 房间信息
    }
}

# 灵泉排行榜
openSpringRank %d {
    request {
    }
    response {
        errorcode 0:integer
        playerInfo 1: *springPlayerInfo     # 玩家数据
        selfRankOf 2: integer               # 名次
    }
}

# 灵泉战报
openSpringBattleLog %d {
    request {
    }
    response {
        errorcode 0:integer
        playerInfo 1: *springPlayerInfo     # 玩家数据
    }
}

# 我要变强点赞
strongerPraise %d {
    request {
        praise 0: integer           # 0-7 0获取点赞数据 1-7点赞ID
    }
    response {
        errorcode 0:integer
        praise 1: *integer          # 个人点赞记录
        data 2: *integer            # 点赞记录
    }
}

#################################### 灵泉 ####################################
#################################### 攻城略地 ####################################
# 获取活动状态
siegeState %d {
    request {
    }
    response {
        errorcode 0:integer
        state 1: integer            # 状态 0未开启 1报名 2首次备战 3首次对战 4第二次备战 5第二次对战 6结算
    }
}

# 进入活动(获取活动详情)
siegeGetDatail %d {
    request {
    }
    response {
        errorcode 0:integer
        clanState 1: siegeClanState     # 帮派数据
        playerInfo 2: siegePlayerInfo   # 玩家数据
        serverList 3: *integer          # 服务器列表
        timeList 4:siegeTimeList        # 活动时间表
        initial 5:integer               # 初级战场 分组数
        advanced 6:integer              # 高级战场 分组数
        bonusesLevel 7:integer          # 奖励等级 用于分别奖励等级（击杀奖励，排名奖励）
        guessingResult 8:*string        # 竞猜结果
        guessingCount 9:*integer        # 竞猜结果人数
        state 10: integer               # 状态 0未开启 1报名 2首次备战 3首次对战 4第二次备战 5第二次对战 6结算
        selfRank 11: integer            # 自己在帮派中的序号
    }
}

# 获取帮派战力排行榜（报名阶段）
siegeClanCombatPowerRank %d {
    request {
    }
    response {
        errorcode 0:integer
        rankList 1:*siegeClanState      # 帮派战力排行榜
        selfClan 2:siegeClanState       # 自己帮派数据
    }
}

# 获取帮派分组伤害排行（2-6阶段）
siegeGroupPacketClanRank %d {
    request {
        stage 0:integer                 # 战场 1初级 2高级
        packet 1:integer                # 分组 1-8
    }
    response {
        errorcode 0:integer
        rankList 1:*siegeClanState      # 帮派伤害排行榜
        selfClan 2:siegeClanState       # 自己帮派数据
    }
}

# 获取分组中全部玩家伤害排行（2-6阶段）
siegegroupPlayerRank %d {
    request {
    }
    response {
        errorcode 0:integer
        rankList 1:*siegeClanPlayerInfo     # 帮派战力排行榜
        selfPlayerInfo 2:siegeClanState     # 自己数据
    }
}

# 获取分组中全部帮派积分排行（2-6阶段）
siegeGroupScoreClanRank %d {
    request {
    }
    response {
        errorcode 0:integer
        rankList 1:*siegeClanState      # 帮派战力排行榜
        selfClan 2:siegeClanState       # 自己帮派数据
    }
}

# 捐献
siegeDonate %d {
    request {
        amount 0:integer                 # 捐献 0免费捐献 1-无限 道具数量
    }
    response {
        errorcode 0:integer
        clanState 1:siegeClanState      # 帮派数据
        activityItem 2:*integer         # 活动道具
        bonusesResult 3:bonusesResult   # 奖励
        expendMoney 4:integer           # 云英消耗
    }
}

# 战斗
siegeBattle %d {
    request {
        battleClanId 0:string           # 攻击的帮派ID
    }
    response {
        errorcode 0:integer
        kill 1:integer                      # 击杀的人数
        harm 2:integer                      # 造成的伤害
        clanState 3: siegeClanState         # 帮派数据
        bonusesResult 4:bonusesResult       # 奖励
        activityItem 5:*integer             # 活动道具
        battleClanState 6:siegeClanState    # 被攻击的帮派数据
    }
}

# 技能
siegeSkill %d {
    request {
        skill 0:integer                 # 技能ID
        battleClanId 1:string           # 攻击的帮派ID  技能2:为空
    }
    response {
        errorcode 0:integer
        kill 1:integer                  # 击杀的人数
        harm 2:integer                  # 造成的伤害    技能2:对每个帮派造成的伤害
        clanState 3: siegeClanState     # 帮派数据
        bonusesResult 4:bonusesResult   # 奖励
        activityItem 5:*integer         # 活动道具
        battleList 6:*siegeClanState    # 帮派列表
    }
}

# 九重宝塔开启宝箱
siegeTowerOpen %d {
    request {
        site 0:integer                  # 开启宝箱位置
    }
    response {
        errorcode 0:integer
        tower 1:*integer                # 每层塔的箱子 0未开启 1开启
        towerOpen 2:integer             # 开启下一层 0未开启 1开启
        activityItem 3:*integer         # 活动道具
        bonusesResult 4:*bonusesResult  # 奖励
        towerLog 5:*string              # 当前层的日志
    }
}

# 九重宝塔一键开启宝箱
siegeTowerAllOpen %d {
    request {
    }
    response {
        errorcode 0:integer
        tower 1:*integer                # 每层塔的箱子 0未开启 1开启
        towerOpen 2:integer             # 开启下一层 0未开启 1开启
        activityItem 3:*integer         # 活动道具
        bonusesResult 4:*bonusesResult  # 奖励
        towerLog 5:*string              # 当前层的日志
        towerTier 6:integer             # 当前层数
    }
}

# 九重宝塔进入下一层
siegeTowerNext %d {
    request {
    }
    response {
        errorcode 0:integer
        tower 1:*integer                # 每层塔的箱子 0未开启 1开启
        towerTier 2:integer             # 层数
        towerOpen 3:integer             # 开启下一层 0未开启 1开启
        towerLog 4:*string              # 当前层的日志
    }
}

# 免费礼包领取
siegeGift %d {
    request {
        id 0:integer                    # 礼包ID
    }
    response {
        errorcode 0:integer
        bonusesResult 1:bonusesResult   # 奖励
        activityItem 2:*integer         # 活动道具
        giftLog 3:*siegeGiftLog(id)     # 礼包记录
    }
}

# 竞猜 (4阶段)
siegeGuessing %d {
    request {
        guessing 0:*string              # 竞猜
    }
    response {
        errorcode 0:integer
    }
}

# 竞猜领奖 (6阶段)
siegeGuessingAward %d {
    request {
    }
    response {
        errorcode 0:integer
        bonusesResult 1:bonusesResult   # 奖励
        activityItem 2:*integer         # 活动道具
    }
}

# 个人排名领奖 (6阶段)
siegeRankAward %d {
    request {
    }
    response {
        errorcode 0:integer
        bonusesResult 1:bonusesResult   # 奖励
        palaceId 2:integer              # 宫殿id
    }
}

# 帮派排名领奖 (6阶段)
siegeClanRankAward %d {
    request {
    }
    response {
        errorcode 0:integer
        bonusesResult 1:bonusesResult   # 奖励
        palaceId 2:integer              # 宫殿id
    }
}

# 领取添砖加瓦奖励
siegePayAward %d {
    request {
    }
    response {
        errorcode 0:integer
        bonusesResult 1:bonusesResult   # 奖励
        activityItem 2:*integer         # 活动道具
        payAward 3:integer              # 目前已领取最大奖励ID
    }
}

# 提前转换到下一个状态
siegeNextState %d {
    request {
    }
    response {
        errorcode 0:integer
    }
}
#################################### 攻城略地 ####################################

#################################### 运营活动 ####################################
#################################### 开服庆典(1000001) ###########################
# 领取开服庆典任务奖励
takeOpenCelebrationTaskBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        taskId 2 : integer                                              # 任务ID
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        taskId 2 : integer                                              # 任务ID
        score 3 : integer                                               # 获得庆典积分
    }
}

# 领取开服庆典累计积分奖励
takeOpenCelebrationScoreBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        score 2 : integer                                               # 积分档次
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        score 2 : integer                                               # 积分档次
        bonusesResult 3 : bonusesResult                                 # 积分奖励
    }
}

# 开服庆典兑换商品
openCelebrationExchangeGoods %d {
    request {
        activityId 1 : integer                                          # 活动ID
        goodsId 2 : integer                                             # 兑换商品id
        count 3 : integer                                               # 兑换个数
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        goodsId 2 : integer                                             # 兑换商品id
        count 3 : integer                                               # 兑换个数
        bonusesResult 4 : bonusesResult                                 # 兑换的奖励
    }
}

# 领取开服庆典每日充值免费奖励
takeOpenCelebrationDaysGiftsBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        payId 2 : integer                                               # 充值id(0为免费)
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        payId 2 : integer                                               # 充值id(0为免费)
        bonusesResult 3 : bonusesResult                                 # 积分奖励
    }
}

#################################### 运势(1000002) ###########################
# 领取运势任务奖励
takeFortuneTaskBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        taskId 2 : integer                                              # 任务ID
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        taskId 2 : integer                                              # 任务ID
        score 3 : integer                                               # 获得抽奖券
        bonusesResult 4 : bonusesResult                                 # 奖励
    }
}

# 领取运势活动累计抽取奖励
takeFortuneTotalDrawBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        count 2 : integer                                               # 累计抽取档次
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        count 2 : integer                                               # 累计抽取档次
        bonusesResult 3 : bonusesResult                                 # 奖励
    }
}

# 运势活动抽取
fortuneDraw %d {
    request {
        activityId 1 : integer                                          # 活动ID
        count 2 : integer                                               # 抽取次数
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        count 2 : integer                                               # 抽取次数
        bonusesResult 3 : bonusesResult                                 # 奖励
        ids 4 : *integer                                                # 依次抽到的id
    }
}

# 领取运势活动每日礼包奖励
takeFortuneDaysGiftsBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        id 2 : integer                                                  # 活动礼包编号id
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        id 2 : integer                                                  # 活动礼包编号id
        bonusesResult 3 : bonusesResult                                 # 奖励
    }
}

#################################### 轮回殿(1000003) ###########################
# 领取轮回殿任务奖励
takeReincarnationHallTaskBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        taskId 2 : integer                                              # 任务ID
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        taskId 2 : integer                                              # 任务ID
        bonusesResult 3 : bonusesResult                                 # 奖励
    }
}

# 领取轮回殿活动礼包奖励
takeReincarnationHallGiftsBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        id 2 : integer                                                  # 活动礼包编号id
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        id 2 : integer                                                  # 活动礼包编号id
        bonusesResult 3 : bonusesResult                                 # 奖励
    }
}

#################################### 精怪历练(1000004) ###########################
# 领取精怪历练任务奖励
takeGremlinExperienceTaskBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        taskId 2 : integer                                              # 任务ID
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        taskId 2 : integer                                              # 任务ID
        addAttackCount 3 : integer                                      # 新增讨伐次数
    }
}

# 领取精怪历练活动礼包奖励
takeGremlinExperienceGiftsBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        id 2 : integer                                                  # 活动礼包编号id
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        id 2 : integer                                                  # 活动礼包编号id
        bonusesResult 3 : bonusesResult                                 # 奖励
    }
}

# 领取精怪历练活动累充奖励
takeGremlinExperienceTotalRechargeBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        money 2 : integer                                               # 累充档次金额
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        money 2 : integer                                               # 累充档次金额
        bonusesResult 3 : bonusesResult                                 # 奖励
    }
}

# 精怪历练活动怪物组刷新
gremlinExperienceMonstersRefresh %d {
    request {
        activityId 1 : integer                                          # 活动ID
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        costStone 2 : integer                                           # 消耗钻石
    }
}

# 精怪历练活动驱邪
gremlinExperienceExorcise %d {
    request {
        activityId 1 : integer                                          # 活动ID
        id 2 : integer                                                  # 怪物id(活动配置)
        gremlinIds 3 : string                                           # 精怪ids(id,id,id)
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        id 2 : integer                                                  # 怪物id(活动配置)
        gremlinIds 3 : string                                           # 精怪ids
        addScore 4 : integer                                            # 新增积分
        rank 5 : integer                                                # 当前排名
        bonusesResult 6 : bonusesResult                                 # 奖励
    }
}

# 获取精怪历练排行榜
getGremlinExperienceRanks %d {
    request {
        activityId 1 : integer                                          # 活动ID
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        playerRank 2 : integer                                          # 玩家排名(0未上榜)
        ranks 3 : *gremlinExperienceRank                                # 当前排名
    }
}

#################################### 灵兽幻境(1000005) ###########################
# 领取灵兽幻境活动任务奖励
takeAnimalFairylandTaskBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        taskId 2 : integer                                              # 任务ID
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        taskId 2 : integer                                              # 任务ID
        addCrystal 3 : integer                                          # 新增活动水晶
    }
}

# 领取灵兽幻境探索活动任务奖励
takeAnimalFairylandExploreTaskBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        taskId 2 : integer                                              # 任务ID
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        taskId 2 : integer                                              # 任务ID
        addPumpCount 3 : integer                                        # 新增活动轮盘抽取次数
    }
}

# 领取灵兽幻境活动礼包奖励
takeAnimalFairylandGiftsBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        id 2 : integer                                                  # 活动礼包编号id
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        id 2 : integer                                                  # 活动礼包编号id
        bonusesResult 3 : bonusesResult                                 # 奖励
    }
}

# 灵兽幻境活动抽取
animalFairylandDraw %d {
    request {
        activityId 1 : integer                                          # 活动ID
        count 2 : integer                                               # 次数
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        count 2 : integer                                               # 次数
        bonusesResult 3 : bonusesResult                                 # 奖励
        ids 4 : *integer                                                # 依次抽到的id
    }
}

# 灵兽幻境活动刷新buff
animalFairylandRefreshBuff %d {
    request {
        activityId 1 : integer                                          # 活动ID
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        refreshBuffCost 2 : integer                                     # 刷新消耗活动水晶
    }
}

# 获取灵兽幻境活动快速挂机收益积分
takeAnimalFairylandQuickOnHookScore %d {
    request {
        activityId 1 : integer                                          # 活动ID
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        addScore 2 : integer                                            # 新增活动积分
        rank 3 : integer                                                # 当前最新排名
        quickOnHookEarningsCost 4 : integer                             # 快速挂机消耗活动水晶
    }
}

# 获取灵兽幻境活动积分池收益
takeAnimalFairylandPoolScore %d {
    request {
        activityId 1 : integer                                          # 活动ID
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        addScore 2 : integer                                            # 新增活动积分
        rank 3 : integer                                                # 当前最新排名
    }
}

# 灵兽幻境活动灵兽上阵
animalFairylandTeamBattle %d {
    request {
        activityId 1 : integer                                          # 活动ID
        teamId 2 : integer                                              # 队伍id
        slotId 3 : integer                                              # 槽位id
        petId 4 : string                                                # 灵兽实例id
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        teamId 2 : integer                                              # 队伍id
        slotId 3 : integer                                              # 槽位id
        petId 4 : string                                                # 灵兽实例id
    }
}

# 获取灵兽幻境排行榜
getAnimalFairylandRanks %d {
    request {
        activityId 1 : integer                                          # 活动ID
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        playerRank 2 : integer                                          # 玩家排名(0未上榜)
        ranks 3 : *animalFairylandRank                                  # 当前排名
    }
}

#################################### 神通灌顶(1000006) ###########################
# 领取神通灌顶活动任务奖励
takeTheurgyAbhisecaTaskBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        taskId 2 : integer                                              # 任务Id
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        taskId 2 : integer                                              # 任务Id
        bonusesResult 3 : bonusesResult                                 # 奖励
    }
}

# 领取神通灌顶活动礼包奖励
takeTheurgyAbhisecaGiftsBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        id 2 : integer                                                  # 活动礼包编号id
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        id 2 : integer                                                  # 活动礼包编号id
        bonusesResult 3 : bonusesResult                                 # 奖励
    }
}

# 领取神通灌顶活动抽取达标奖励
takeTheurgyAbhisecaPumpBonuses %d {
    request {
        activityId 1 : integer                                          # 活动ID
        count 2 : integer                                               # 达标次数
    }

    response {
        errorcode 0 : integer
        activityId 1 : integer                                          # 活动ID
        count 2 : integer                                               # 达标次数
        bonusesResult 3 : bonusesResult                                 # 奖励
    }
}



#################################### 莽荒妖区域(120) ###########################

enterDomainActivity %d {
    request {
  
    }

    response {
        errorcode 0 : integer
    }
}


#莽荒妖域探索
toSearch %d {
    request {
  
    }

    response {
        errorcode 0 : integer
        monsterID 1 : integer
        eventItem 2 : eventItem
    }
}

#蛮荒,区域事件完成
zoneEventDone %d {
    request {
        toNext 0:integer #1是去下层，空就是呆在原地，是升级事件才传这个参数 --可以为nil
        toMark 1:integer #怪物标记 -- 可以为nil
        toSkip 2:integer #怪物绕路 -- 可以为nil
        toPlayerBattle 3:integer #  --挑战玩家传1，不挑战绕路传2 ，其他未nil
    }

    response {
        errorcode 0 :integer
        battleResult 1:battleResult
        bonusesResult 2:bonusesResult #奖励结构，没有为nil
        attackDamageCount  3:string #总伤害 有伤害的时候有，没有为nil
        pRankNum           4:integer #获得的个人积分,没有为nil
        gRankNum           5:integer #获得的帮派积分,没有为nil
        propertyItem       6:propertyItem(id) #获得的资产,可以为nil
        isCanMark          7:integer    #是否能标记怪物，1可以标记 ，有值就是1
        eventItem          8:eventItem  #完成的事件
        defenceRemainHP    9:string     #防守方剩余血量
    }
}

#蛮荒,获得服务器列表,分组
getServerGroupList %d {
    request {

    }

    response {
        errorcode 0 :integer
        serverArr 1:*string
        openTimeData 2:openTimeData
    }
}

#蛮荒,获得个人排行帮信息
getDomainPRank %d { #获取排行榜
    request {
        from 0:integer # 排名开始
        to 1:integer # 排名结束
        isTake 2:integer #领奖励
    }

    response {
        errorcode 0:integer
        ranks 1: *rankPlayer
        rankOf 2: integer
        bonusesState 3:integer #奖励状态 0没有奖励 1可以领奖励 2已经领取
        bonusesID    4:integer #奖励ID
        bonusesResult 5:bonusesResult #奖励结构，没有为nil
    }
}


#蛮荒,获帮派排行帮
getDomainGRank %d { #获取排行榜
    request {
        from 0:integer # 排名开始
        to 1:integer # 排名结束
        isTake 2:integer #领奖励
    }

    response {
        errorcode 0:integer
        ranks 1: *clanRankInfo
        rankOf 2: integer
        bonusesState 3:integer #奖励状态 0没有奖励 1可以领奖励 2已经领取
        bonusesID    4:integer #奖励ID
        bonusesResult 5:bonusesResult #奖励结构，没有为nil
    }
}

#蛮荒,获帮派标记怪物列表
getClanMarkMonsterList %d { #获得帮派所有标记
    request {

    }

    response {
        errorcode       1:integer 
        markMonsterHelp 2:*markMonsterHelp
    }
}

#蛮荒,标记怪物
markMonsterHelp %d {
    request {

    } 
    response {
        errorcode 0 :integer 
    }
}

#蛮荒,帮派助战
domainHelpBatle %d {
    request {
        id 1:string #玩家ID 
    } 
    response {
        errorcode 1:integer
        battleResult 2:battleResult  
        bonusesResult 3:bonusesResult #奖励结构，没有为nil
        attackDamageCount  4:string #总伤害 有伤害的时候有，没有为nil
        pRankNum           5:integer #获得的个人积分,没有为nil
        gRankNum           6:integer #获得的帮派积分,没有为nil
        markMonsterHelp    7:markMonsterHelp
    }
}

#蛮荒,领取怪物死亡奖励
getMarkMonsterDieBonuses %d {
    request {

    } 
    response {
        errorcode     1:integer
        bonusesResult 2:bonusesResult #奖励结构，没有为nil
        gRankNum      3:integer       #帮派积分
        pRankNum      4:integer       #个人积分
    }
}

#蛮荒宝箱,购买免费的和钻石礼包
buyFreeGift %d {
    request {
        id 1:integer #--活动ID
        giftId 2:integer #--礼包ID
    } 
    response {
        errorcode     1:integer
        bonusesResult 2:bonusesResult #奖励结构，没有为nil
        costResult    3:costResult #消耗结构
    }
}

#蛮荒宝箱
takePropertyBonses %d {
    request {
        type 1:integer  #1银,2金
    } 
    response {
        errorcode     1:integer
        bonusesResult 2:bonusesResult #奖励结构，没有为nil
        costResult    3:costResult    #可能为Nil
    }
}

#领取任务奖励
domainTakeTaskBonuses %d {
    request {
        id 1:integer 
    } 
    response {
        errorcode     0:integer
        bonusesResult 1:bonusesResult #奖励结构，没有为nil
    }
}



#领取返利金竹树
takeTreeRebate %d {
    request {

    }

    response {
        errorcode 0 : integer
        chance  1:string
    }    
}

#客户端忽略这个协议
cluster_register %d {
    request {
        guid 0:string
    }

    response {
        errorcode 0 : integer
    }  
}
]]



return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}






