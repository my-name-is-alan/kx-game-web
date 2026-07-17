//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

export class VarVal {
    static LyMsgBox = {
        STYLE_ONE: 1,
        STYLE_TWO: 2,
        STYLE_THREE: 3,
        STYLE_TWO2: 4,
    }
    static RESOURCE_DIR = {
        AUDIO: "audio",
        AUDIO_P: "audio/",
        DATA: "data",
        DATA_P: "data/",
        SPINE: "spine",
        SPINE_P: "spine/",
        UI: "ui",
        UI_P: "ui/",
    }
    static SPROTO_FILE:string = "proto/sp";
    static SPROTO_EMPTY:string = "proto/empty";
    static PACKAGE_FGUIS = { // 所有的fgui界面导出包都需要在这里注册。
        // LyLogo: "LyLogo", // 开头已加载。
        CMemory: "CMemory",
        CCommon: "CCommon",
        CCommonBG: "CCommonBG",
        LyLogoUpdate: "LyLogoUpdate",
        LyLogin: "LyLogin",
        LyLoginCreateRole: "LyLoginCreateRole",
        LyMainPage: "LyMainPage",
        LyBattleMain: "LyBattleMain",
        LyStage: "LyStage",
        LyActivityInvasion: "LyActivityInvasion",
        LyActivityMonsterTower: "LyActivityMonsterTower",
        LyActivityShop: "LyActivityShop",
        LyActivityKingMonster: "LyActivityKingMonster",
        LyChallengeDuel: "LyChallengeDuel",
        LyPayExquisite: "LyPayExquisite",
        LyPayRecharge: "LyPayRecharge",
        LyPayFirstGift: "LyPayFirstGift",
        LyPayFunds: "LyPayFunds",
        LyPayActivitys: "LyPayActivitys",
        LyPaySevenGiftGroup1: "LyPaySevenGiftGroup1",
        LyPaySevenGiftGroup2: "LyPaySevenGiftGroup2",
        LyPaySevenGiftGroup3: "LyPaySevenGiftGroup3",
        LyPaySevenGiftGroup4: "LyPaySevenGiftGroup4",
        LyGuideFullTips: "LyGuideFullTips",
        LyActivityOpenRank: "LyActivityOpenRank",
        LyFriendInvite: "LyFriendInvite",
        LyPalace: "LyPalace",
        LyPalaceLike: "LyPalaceLike",
        LyConquestSeek: "LyConquestSeek",
        LyGuideDetail: "LyGuideDetail",
        LyGuideStart: "LyGuideStart",
        LyItemReward: "LyItemReward",
        LyMail: "LyMail",
        LyBreakStage: "LyBreakStage",
        LyBackPack: "LyBackPack",
        LyMount: "LyMount",
        LyGoldFinger: "LyGoldFinger",
        LyPet: "LyPet",
        LyVein: "LyVein",
        LyCompanion: "LyCompanion",
        LyEliteMonster: "LyEliteMonster",
        LyCharacter: "LyCharacter",
        LyChatRoom: "LyChatRoom",
        LyTheurgy: "LyTheurgy",
        LyCrossQunYin: "LyCrossQunYin",
        LyActivitySevenDays: "LyActivitySevenDays",
        LySetting: "LySetting",
		LyHaven: "LyHaven",
        LyActivityOpenCelebration: "LyActivityOpenCelebration",
        LyActivityFortune: "LyActivityFortune",
        LyTreeRebate: "LyTreeRebate",
        LyActivityReincarnationHall: "LyActivityReincarnationHall",
        LyActivityRisingStar: "LyActivityRisingStar",
        LyClan: "LyClan",
        LyPlayerInfo: "LyPlayerInfo",
		LyClanSolo: "LyClanSolo", 
        //LySpring: "LySpring", 
        LyGrabCity: "LyGrabCity",
        LyBrumeIsle: "LyBrumeIsle",
    }
    static PRELOAD_FGUIS = { // 这里是游戏开始前的预加载，不明白就不用改它。
        [VarVal.PACKAGE_FGUIS.CMemory]:true,
        [VarVal.PACKAGE_FGUIS.CCommon]:true,
        [VarVal.PACKAGE_FGUIS.LyLogin]:true,
        [VarVal.PACKAGE_FGUIS.LyLogoUpdate]:true,
        [VarVal.PACKAGE_FGUIS.LyMainPage]:true
    }
    static FIELD_SV = {
        // 测试
        DEBUG_TESTBATTLE: "DEBUG_TESTBATTLE", //战斗测试
        DEBUG_TESTBATTLE_USESELF: "DEBUG_TESTBATTLE_USESELF", //战斗测试
        // SDK
        SDK_UUID: "SDK_UUID",
        // 登录
        LOGIN_CH_ACC: "LOGIN_CH_ACC",
        // 账号页
        TAG_USER_ID: "TAG_USER_ID",
        TAG_USER_PATH: "TAG_USER_PATH",
        // 设置
        AUDIO_BGM_ENABLED: "AUDIO_BGM_ENABLED",
        AUDIO_EFT_ENABLED: "AUDIO_EFT_ENABLED",
        AUDIO_ALL_VOLUME: "AUDIO_ALL_VOLUME",
        AUDIO_BGM_VOLUME: "AUDIO_BGM_VOLUME",
        AUDIO_EFT_VOLUME: "AUDIO_EFT_VOLUME",
        //首充
        PAY_FIRSTGIFTSTART: "PAY_FIRSTGIFTSTART",
        PAY_FIRSTGIFTLOST: "PAY_FIRSTGIFTLOST",
        PAY_FIRSTGIFTDAY: "PAY_FIRSTGIFTDAY",
        // 七天礼包
        PAY_SEVENTGIFTGROUP: "PAY_SEVENTGIFTGROUP",
        //八荒
        CONQUESTSEEK: "CONQUESTSEEK",
        //攻城战
        GRABCITY_SKIP: "GRABCITY_SKIP",
        //坐骑
        MOUNT_QUICK: "MOUNT_QUICK",
        //装备
        EQUIP_BREAKDOWN: "EQUIP_BREAKDOWN",
        //自动砍树
        FORGE_QUALITY: "FORGE_QUALITY",//装备品质
        FORGE_COMBATPOWER: "FORGE_COMBATPOWER",//战斗力提升停止
        FORGE_ISAND: "FORGE_ISAND",//同时/或
        FORGE_ATTR1: "FORGE_ATTR1",//属性1 勾选
        FORGE_BATTLEATTR1: "FORGE_BATTLEATTR1",//属性1 战斗属性
        FORGE_DEFENSEATTR1: "FORGE_DEFENSEATTR1",//属性1 抗性
        FORGE_ATTR2: "FORGE_ATTR2",//属性2 勾选
        FORGE_BATTLEATTR2: "FORGE_BATTLEATTR2",//属性2 战斗属性
        FORGE_DEFENSEATTR2: "FORGE_DEFENSEATTR2",//属性2 抗性
        FORGE_TICKET: "FORGE_TICKET",//挑战券
        FORGE_SPEED: "FORGE_SPEED",//加速
        FORGE_ISCOUNT: "FORGE_ISCOUNT",//消耗体力数 勾选
        FORGE_COUNT: "FORGE_COUNT",//消耗体力数
        //装备
        VEIN_BREAKDOWN: "EQUIP_BREAKDOWN",
 		// 战斗
        BATTLE_SPEED: "BATTLE_SPEED", //战斗倍速
        // 运势
        FORTUNE_DRAW: "FORTUNE_DRAW", //跳过动画
        // 金竹返利
        CHANCE_REBATE: "CHANCE_REBATE", //隐藏提示
        //神通
        THEURGY_TEN: "THEURG_TEN",//十连抽
        THEURGY_TENUP: "THEURGY_TENUP",//神通十连升级
        //门客
        ElLITE_SKIPANIM: "ElLITE_SKIPANIM", //跳过动画
        //兽友
        COMPANION_EXPLORE :"COMPANION_EXPLORE",//十连游历
        COMPANION_LIKING :"COMPANION_LIKING",//十连送礼
        //帮派
        CLAN_APPLY_SORT :"CLAN_APPLY_SORT",//审核战斗力排序
        //伙伴集结
        BUDDY_TEN : "BUDDY_TEN", //十连
        BUDDY_SKIPANIM : "BUDDY_SKIPANIM", //十连
        //单刀赴会
        CLAN_SOLO_SKIP : "CLAN_SOLO_SKIP", //跳过战斗
    }
    static AUDIO_SOURCE_FGUICOMMOM_CLICK:string = "eft_common_click"; // FGUI点击按钮统一音效
    static AUDIO_SOURCE = {
        // 【背景音乐】（循环）
        BGM_LOGIN: "audio/bgm_login", // 登陆页
        BGM_MAIN: "audio/bgm_main", // 主界面
        BGM_BATTLE: "audio/bgm_battle", // 战斗页
        // 【音效】
        EFT_COMMOM_CLICK: "audio/eft_common_click", // 暂时使用FGUI的
        EFT_COMMOM_LAYER: "audio/eft_common_layer", // 打开界面
        EFT_COMMOM_TIPS: "audio/eft_common_tips", // 飘字音效
        EFT_GETITEM: "audio/eft_getitem", // 获得物品
        EFT_PAY_RESULT: "audio/eft_pay_result", // 购买成功

        EFT_BATTLE_START: "audio/eft_battle_start", // 战斗开始
        EFT_BATTLE_HIT: "audio/eft_battle_hit", // 角色受击
        EFT_BATTLE_HEALTH: "audio/eft_battle_health", // 角色治疗
        EFT_BATTLERESULT_WIN: "audio/eft_battleresult_win", // 战斗胜利
        EFT_BATTLERESULT_LOST: "audio/eft_battleresult_lost", // 战斗失败

        EFT_DUEL_OPEN: "audio/eft_duel_open", // 战斗失败

        EFF_DIAOYU_THROW: "audio/throw", //抛竿落水音
        EFF_DIAOYU_WATER1: "audio/water1", //小水花
        EFF_DIAOYU_WATER2: "audio/water2", //中水花
        EFF_DIAOYU_WATER3: "audio/water3", //大水花

        EFF_EQUIP_DOWNHERO: "audio/eft_downHero", //穿戴/替换音效
        EFF_EQUIP_DECOMPOSE: "audio/Decompose", //分解音效

        EFF_PLAYER_LEVEL: "audio/eft_drawCard_open2", //升级音效
    }
    static FONT_NAME = {
        COMMON:"HarmonyOS_Sans_Condensed_Regular",
        ART_BIG:"Alimama_DongFangDaKai_Regular",
        ART_SLI:"hyqcqy",
    }
    static SPINE_ANI_NAME = {
        stand: "stand",
        move: "move",
        attack: "attack",
        hurt: "hurt",
        death: "death",
        back_up: "back_up",
        idea_pose: "idea_pose",
        stand_poss: "stand_poss",
        // 多轨道
        attach_stand: "attach_stand",
    }
    static SPINE_ENV_NAME = {
        attack_hit: "hit",
        attack_atk: "atk",
        attack_lan: "lan",
        move_begin: "move_begin",
        move_end: "move_end",
    }
    static BUTTON_ICON = {
        reward_ad				: "100", // 观看广告
    }
    static SPINE_FISHING_NAME = {
        fishing_start_1: "fishing_start_1",
        fishing_over_1_1: "fishing_over_1_1",
        fishing_over_1_2: "fishing_over_1_2",
        fishing_up_1: "fishing_up_1",
        fishing_up_2_1: "fishing_up_2_1",
        fishing_up_2_2: "fishing_up_2_2",
        fishing_up_2_3: "fishing_up_2_3",
        stand: "stand",
        stand_fishing: "stand_fishing",
    }
    static SKILL_SHOWTYPE = {
        ACTION: "1", // 平砍类
        BULLET: "2", // 子弹飞行类
        FALL: "3", // 施法类
    }
    static INST_TYPE = {
        ITEM: 1,
        EQUIP: 2,
        FISH: 3,
        PETPIECE: 4,
        PET: 5,
        ELITEMONSTER : 6,
        ELITMONSTERDEBRIS : 7,
        THEURGYFRAG: 8,
        THEURGYSEAL: 9,
    }
    static CHARLENGTH = {
        // 中英文最大字长，中文算1个英文也算1个。
        ACCOUNT: 24,
        PASSWORD: 16,
        CREATEROLE: 14,
        CHATROOM: 80,
    }
    static BATTLE_TYPE = {
        TESTGM: 0, // GM测试
        STAGE: 1, // 关卡
        INVASION: 2, // 异兽入侵
        MONSTER_TOWER: 3, // 镇妖塔
        COMPANION: 4, // 仙友
        DUEL: 5, // 斗法
        KING_MONSTER: 6, // 妖王
        CROSS_QUNYIN: 7, // 群英
        CLAN: 8, // 禁地挑战
        PLAYVIRTUAL: 9, // 虚拟战斗表现（首充）
        PLAYVIRTUAL_SKIN: 10, // 虚拟战斗表现
		CLANSOLO: 11, // 单刀赴会
        BRUMELISLE_ATTACK: 12, // 雾影岛
    }
    static UI_EFF = {
        loader_spine_bg : "8101",//主界面默认
        loader_spine_river : "8102",//河流
        loader_spine_item : "8103",//道具框特效
        loader_spine_activity : "8104",//活动图标特效
        loader_spine_levelUp : "8105",//升级
        loader_spine_exp : "8106",//经验条
        loader_spine_automatic : "8107",//自动
        loader_spine_forge : "8108",//钓鱼

        equip_5 : "8109",
        equip_6 : "8110",
        equip_7 : "8111",
        equip_8 : "8112",
        equip_9 : "8113",
        equip_10 : "8114",
        equip_11 : "8115",
        equip_12 : "8116",
        equip_13 : "8117",
        equip_14 : "8118",
        equip_15 : "8119",
    }
    static UI_EFF_NAME = {
        spine_login : "jm_denglu", // 登录
        spine_fortune : "jm_yunshi", // 运势
        spine_result : "jm_jieshuan", // 获得奖励
        spine_result2 : "jm_gongyong_xingguang", // 获得奖励（星星）
        spine_battlestart : "jm_kaishizhandou", // 战斗开始
        spine_battleanger : "jm_zhandou_nengliangtiao", // 战斗怒气
        spine_battlebox : "jm_tongyonshengji", // 战斗BOSS宝箱
        spine_guidehand : "jm_xingshouyingdao_shouzi", // 新手引导手指
        spine_langyabang : "cj_langyabang", // 琅琊榜
        spine_langyabangdianzan : "cj_langyabang_dianzan", // 琅琊榜
        spine_yunwu_guochang : "cj_yunwu_guochang", // 琅琊榜
        spine_quanping_saqian : "cj_quanping_saqian", // 琅琊榜
        spine_qingdian_denglong : "ui_qingdian_denglong", // 开服庆典
        spine_qingdian_saoguang : "ui_qingdian_saoguang", // 开服庆典
        spine_qingdian_niao : "ui_qingdian_niao", // 开服庆典
        spine_main_task : "jm_zhujiemian_renwu", // 主线任务
        spine_jubaopen : "cj_jubaopen", // 聚宝盆
        spine_fanli : "ui_fanli", // 返利
        spine_fanli_light : "ui_fanli_light", // 返利
        spine_jinshouzhi_z : "jm_jinshouzhi_z", // 金手指
        spine_fabaochouqu : "cj_fabaochouqu", // 金手指
        spine_fabaochouqu_bj : "cj_fabaochouqu_bj", // 金手指
        spine_fabaochouqu_star : "cj_fabaochouqu_star", // 金手指
        spine_jiuchong_baoxiang : "cj_jiuchong_baoxiang", // 攻城战
    }

    static GUIDE_TYPE = { // 新增类型后，记得在StrVal.GETITEM_NAMES、GETITEM_HOWS，中补充文本！！！
        KANSHU : "1", // 砍树
        ACTIVITY_SHOP : "2", // 坊市
        EVOLUTION : "3", // 仙树升级
        CHALLENGE_STAGE : "4", // 冒险
        MOUNT_LEVELUP : "5", // 坐骑升级
        PET_LEVELUP : "6", // 灵兽升级
        PET_CALL : "7", // 灵兽召唤
        VEIN_ACTIVE : "8", // 激发灵脉
        DUEL_CHALLENGE : "9", // 斗法挑战
        KING_MONSTER : "10", // 挑战妖王
        INVASION : "11", // 异兽入侵
        MONSTER_TOWER : "12", // 镇妖塔
        HAVEN_GET : "13", // 福地采集
        FABAO_CALL : "14", // 法宝召唤（引导未实现！）
        ELITE_CALL : "15", // 精怪召唤
        THEURG_CALL : "16", // 神通召唤
        FABAO_LEVELUP : "17", // 法宝升级（引导未实现！）
        ELITE_LEVELUP : "18", // 精怪升级
        THEURG_LEVELUP : "19", // 神通升级
        MAIN_TASK : "20", // 主线任务
        CLAN : "21", // 帮派
        COMPANION : "22", // 兽友
        ELITE : "23", // 门客点击
        STAGE : "24", // 武境界突破
        PET : "25", // 上阵灵兽
        PALACE : "26", // 琅琊榜
        HAVEN_FINDOTHER: "27", // 福地采集 去他人福地
        HAVEN_GETMOUSE: "28", // 获取老鼠
        QUNYIN: "30", //  群音
        COMPANION_EXPLORE : "31", // 兽友游历
        MONTH_CARD : "32", // 月卡
        TREE_REBEAT : "33", // 聚宝盆
        DAILY_GIFT : "34", // 每日礼包
        LEI_TOTAL : "35", // 永久累充
        
        // 任务的引导
        TASK_WELCOME : "10001", // 主线任务引导1（连续钓鱼->完成任务）
        TASK_PET_LEVELUP : "10002", // 灵兽升级
        TASK_ELITE_LEVELUP : "10003", // 精怪升级
        TASK_PET_CALL : "10004", // 灵兽召唤
        TASK_GOLDFINGER : "10010", // 金手指开启
        TASK_HAVEN_FINDOTHER: "10005", //福地采集 去他人福地
        TASK_HAVEN_GETMOUSE: "10006", //福地采集 去他人福地
    }
    // 礼包
    static GIFT_GROU = {
        GIFT_GROU_CIG_ID:           "40001", //藏经阁限时礼包
        GIFT_GROU_LM_ID:            "40011", //灵脉限时礼包
        GIFT_GROU_BATTLERPOWER_ID:  "40021", //战力提升礼包
        GIFT_GROU_HORSE_ID:         "40031", //坐骑强化礼包
        GIFT_GROU_FAZE_ID:          "40041", //法则限时礼包
        GIFT_GROU_SYFAVOR_ID:       "40051", //兽友好感礼包
        GIFT_GROU_MENKE_ID:         "40061", //门客限时礼包
        GIFT_GROU_JIUMI_ID:         "40071", //酒米限时礼包
        GIFT_GROU_GOUOI_ID:         "40081", //枸杞限时礼包
        GIFT_GROU_LINGSOUGUO_ID:    "40091", //灵兽果限时礼包
    }
    static GIFT_OTH_GROU = {
        FANLI:                      "70001", //聚宝盆礼包
    }
    // 物品原型ID
    static itemProtoId = {
        gouqi                     : 120001, // 枸杞（后期是否启动游戏时读表覆盖？）
        jianghuling               : 120003, // 江湖令
        shanhu                    : 120014, // 珊瑚
        yunxingsha                : 120015, // 陨星砂
        chaolu                    : 120008, // 朝露
        jifalingmai               : 120004, // 激发灵脉
        lingmaiwuxing             : 120005, // 灵脉开悟
        shentongchouka            : 120020, // 神通抽卡
        jinggaichouka             : 120007, // 精怪抽卡
        qunyin                    : 110002, // 精怪抽卡
        goldpump                  : 120039, // 金手指抽卡
        goldupgrade               : 120040, // 金手指升级
    }
    // 物品原型ID
    static kingAddCompanion = "1"; // 兽友在妖王的加成。
    //------------------------以下所有都是服务器数值常量定义，取自服务器，不要随意更改，需与服务器同步。------------------------------
    // 物品子类型
    static itemtype = {
            playerAttr          : "1001", //角色属性类物品 
            fixedChest          : "1002", //固定宝箱
            randomChest         : "1003", //随机宝箱
            chooseChest         : "1004", //选择宝箱

            rename              : "1005", //改名卡
            heroexp             : "1006", //角色经验道具 data:经验值
            herosoul            : "1007", //角色信物
            animalStone         : "1008", // 御灵石
            character           : "1009", //人物形象物品
            effect_proto        : "1013", //效果道具
            qunyin_challenge    : "1020", //群英挑战令

            equip               : "2001",  //装备
            mount               : "2002",  //坐骑
    }
    static Personalization = {
        MODEL_SUIT          : 1,//1：境界形象
        MODEL_ACTIVITY      : 2,//2：活动形象
        HEAD_SUIT           : 3,//3：境界头像
        HEAD_ACTIVITY       : 4,//4：活动头像
        HEAD_ELITEMONSTER   : 5,//5：精怪头像
        HEAD_PET            : 6,//6：宠物头像
        HEADK               : 7,//7：头像框
        BUBBLE              : 8,//8：聊天气泡
        TITLE_ACTIVITY      : 9,//9：活动称号
        TITLE_SPECIAL       : 10,//10：特殊称号
        TITLE_MEDAL         : 11,//11：勋章称号
    }
    static ACTIVITY_ID = {
        SHOP 				: "102",  // 坊市
        KING_MONSTER 		: "105",  // 挑战妖王
        INVASION     		: "108",  // 异兽入侵
        MONSTOR_TOWER     	: "109",  // 镇妖塔
        SEVENDAYS           : "110",  // 七日签到
        PAYACC              : "111", // 累积充值 累天
        DAILYWELFARE        : "112", // 每日福利
        TREE_REBATE         : "113", // 金竹返利
        HAVEN 		        : "201",  // 福地
        RISINGSTAR          : "202", // 开服冲榜
        OPEN_RANK 		    : "203",  // 开服排行榜
        QUNYIN              : "704",  // 群英
        PALACE              : "901", // 仙宫点赞
		CLANSOLO            : "1001", // 单刀赴会
        SPRING              : "705", // 灵泉
        BRUMEISLE           : "120", // 雾影岛
        GRABCITY            : "707", // 攻城掠地
    }
    // 运营活动“同时”支持多个同类型活动（以下是类型）
    static ACTIVITY_CLASZ = {
        OPENCELEBRATION 			: 1000001,  // 开服庆典
		FORTUNE          			: 1000002,  // 运势
        REINCARNATIONHALL 			: 1000003,  // 轮回殿
        ELITEMONSTOR_LL             : 1000004,  // 精怪历练
        PSYCHICINSIGHT              : 1000006,  // 神通灌顶
        BUDDYMASS                   : 1000005,  // 伙伴集结
    }
    // 开服庆典类型
    static openCelebrationTaskType = {
        cutTree                 : 1,  // 砍树--次数
        upgrade                 : 2,  // 升级--等级
        treeUpgrade             : 3,  // 仙树升级--等级
        equip                   : 4,  // 穿戴装备--件数,品质
        vehicleUpgrade          : 5,  // 升级座驾--次数
        animalUpgrade           : 6,  // 升级灵兽--次数
        animalCall              : 7,  // 召唤灵兽--次数
        mountainTrigger         : 8,  // 激发灵脉--次数
        fight                   : 9,  // 斗法--次数
        challengeMonster        : 10, // 挑战妖王--次数
        strangeAnimalInvade     : 11, // 异兽入侵--次数
        passTower               : 12, // 通关镇妖塔--层数
        landGatherSelf          : 13, // 自己福地采集--次数
        landGatherOthers        : 14, // 他人福地采集--次数
        share                   : 15, // 分享--次数
    }
    // 运势任务类型
    static FortuneTaskType = {
        cutTree                 : 1,  // 砍树--次数
        share                   : 2,  // 分享--次数
        forumSign               : 3,  // 论坛签到--次数
        gameHub                 : 4,  // 登入游戏圈--次数
        animalUpgrade           : 5,  // 升级灵兽--次数
        animalCall              : 6,  // 召唤灵兽--次数
        theurgyUpgrade          : 7,  // 升级神通--次数
        theurgyPump             : 8,  // 抽取神通--次数
        dhamaUpgrade            : 9,  // 升级法宝--次数
        dhamaPump               : 10, // 抽取法宝--次数
        gremlinUpgrade          : 11, // 升级精怪--次数
        gremlinCall             : 12, // 召唤精怪--次数
    }

    // 轮回殿任务类型
    static ReincarnationHallTaskType = {
        costAnimalStone         : 1, // 消耗御灵石--数量
        theurgyPump             : 2, // 抽取神通--次数
        dhamaPump               : 3, // 抽取法宝--次数
        gremlinCall             : 4, // 召唤精怪--次数
    }
      // 主界面任务类型
    static MainTaskType = {
        cutTree                 : 1,  // 消耗体力--数量
        breakdown               : 2,  // 分解装备--次数
        adventureMax            : 3,  // 通关冒险--最大通关数
        adventure               : 4,  // 挑战冒险--次数
        level                   : 5,  // 等级--次数
        evolution               : 6,  // 鱼塘等级--次数
        stage                   : 7,  // 阶段--次数
        equip                   : 8,  // 穿戴x品阶装备--数量
        fight                   : 9,  // 斗法--次数
        share                   : 10, // 分享--次数
        animalUpgrade           : 11, // 升级灵兽--次数
        animalCall              : 12, // 召唤灵兽--次数
        vehicleUpgrade          : 13, // 升级座驾--次数
        mountainTrigger         : 14, // 激发灵脉--次数
        strangeAnimalInvade     : 15, // 异兽入侵--次数
        landGatherSelf          : 16, // 自己福地采集--次数
        landGatherOthers        : 17, // 他人福地采集--次数
        challengeMonster        : 18, // 挑战妖王--次数
        gremlinCall             : 19, // 召唤精怪--次数
        clanDamage              : 20, // 禁地挑战照成伤害--伤害
        surfAds                 : 21, // 看广告--数量
        breakdownByMoney        : 22, // 分解装备得云英--数量
        havenNums               : 23, // 镖师数量--数量
        companionGift           : 24, // 兽友送礼--次数
        companionExplore        : 25, // 兽友游历--次数
        joinClan                : 26, // 加入创建帮派--次数
        gremlinActivite         : 27, // 合成精怪--次数
        gremlinUpgrade          : 28, // 升级精怪--次数
        passTower               : 29, // 通关镇妖塔--层数
        summonPet               : 30, // 上阵灵宠--是否上阵
    }

    // 门客讨伐任务类型
    static MenKeTFTaskType = {
        cutTree                 : 1,  // 消耗体力--数量
        fight                   : 2,  // 斗法--次数
        companionExplore        : 3,  // 兽友游历--次数
        strangeAnimalInvade     : 4,  // 异兽入侵--次数
        gremlinUpgrade          : 5,  // 升级精怪--次数
        gremlinCall             : 6,  // 召唤精怪--次数
        landGatherSelf          : 7,  // 自己福地采集--次数
        landGatherOthers        : 8,  // 他人福地采集--次数
        share                   : 9,  // 分享--次数
    }

    // 伙伴集结任务类型
    static BUDDYTaskType = {
        cutTree                 : 1,  // 消耗体力--数量
        fight                   : 4,  // 斗法--次数
        vehicleUpgrade          : 5,  // 升级座驾--次数
        mountainTrigger         : 6,  // 激发灵脉--次数
        landGatherSelf          : 2,  // 自己福地采集--次数
        landGatherOthers        : 3,  // 他人福地采集--次数
        share                   : 7,  // 分享--次数

        adventure               : 8,  // 挑战冒险--次数
        challengeMonster        : 9, // 挑战妖王--次数
        animalUpgrade           : 10, // 升级灵兽--次数
        gremlinUpgrade          : 11,  // 升级精怪--次数
        gremlinCall             : 12,  // 召唤精怪--次数
    }

     // 神通灌顶任务类型
     static THEURGYGDTASK = {
        cutTree                 : 1,  // 消耗体力--数量
        fight                   : 4,  // 斗法--次数
        vehicleUpgrade          : 5,  // 升级座驾--次数
        mountainTrigger         : 6,  // 激发灵脉--次数
        landGatherSelf          : 2,  // 自己福地采集--次数
        landGatherOthers        : 3,  // 他人福地采集--次数
        share                   : 7,  // 分享--次数
        strangeAnimalInvade     : 8,  // 魔教来袭--次数
        challengeMonster        : 9, // 挑战妖王--次数
        animalUpgrade           : 10, // 升级灵兽--次数
        theurgyUpgrade          : 11,  // 神通升级--次数
        theurgyUP               : 12,  // 神通突破--次数
        theurgySealHC           : 13,  // 神通合成印记--次数
        attackQunying           : 14,  // 挑战群英榜--次数
    }

    // 突破任务类型
    static StageTaskType = {
        cutTree                 : 1,  // 消耗体力--数量
        adventureMax            : 3,  // 通关冒险--最大通关数
        level                   : 5,  // 等级--次数
        evolution               : 6,  // 鱼塘等级--次数
    }
    // 轮回殿礼包类型
    static ReincarnationHallGiftType = {
        free                    : 1,  // 免费--0
        recharge                : 2,  // 充值--payId
        stone                   : 3,  // 钻石购买--钻石数
    }
    // 运势礼包类型
    static FortuneGiftType = {
        free                    : 1,  // 免费--0
        recharge                : 2,  // 充值--payId
        stone                   : 3,  // 钻石购买--钻石数
    }
    // 轮回殿礼包刷新类型
    static ReincarnationHallGiftRefreshType = {
        never                   : 1,  // 永不刷新
        days                    : 2,  // 每日刷新
    }
    static bonusType = {
        item				: "1", //道具
        money               : "2", //灵石
        physical            : "3", //体力
        stone               : "4", //玉璧
        exp                 : "5", //经验
        chance				: "6", //金竹

        // 客户端为了显示，构造的
        opencelescore				: "101", //开服庆典积分
        qunyin      				: "102", //群英积分
        elitescore      		    : "103", //精怪
        fortunescore      		    : "104", //运势抽奖券
        duelscore        		    : "105", //斗法积分
        buddyCrystal				: "106", //伙伴集结水晶
        buddyToken				    : "107", //伙伴集结令牌
        xianyuanScore               : "108", //仙缘积分
        buddyScore				    : "109", //伙伴集结积分
        clanPoint              		: "201", //帮派贡献度
        activeScore      			: "202", //帮派活跃分
        clanExp      				: "203", //帮派经验
        clanGlory			    	: "204", //荣耀值
        clanRare     				: "205", //九游秘宝值
        clansolo     				: "207", //单刀赴会声望
        springScore     		    : "206", //灵泉精粹
        brumeIsleScore     		    : "221", //雾隐岛个人积分
        brumeIsleClanScore     		: "218", //雾隐岛帮派积分
        brumeIslePower     		    : "217", //雾隐岛体力
        brumeIsleBox1    		    : "219", //雾隐岛银宝箱
        brumeIsleBox2    		    : "220", //雾隐岛金宝箱
        grabCityTiger   		    : "222", //攻城掠地虎符
        grabCitysw    		        : "223", //攻城掠地神威令
        grabCityDonate    		    : "224", //攻城掠地捐献
        grabCityDraw    		    : "225", //攻城掠地抽奖道具
        
        equip				        : "301", //装备
    }
    static propertyID = {
        money 				: "2",//金币(云英、灵石)
        physical 			: "3",//体力(枸杞) 
        stone 				: "4",//钻石(玉壁、仙玉)
        exp 				: "5",//经验	
        chance				: "6",//机缘(玉竹) 
    }
    static payType = {
        stone				: "1", //仙玉
        chance              : "2", //机缘
        gift                : "3", //礼包
        others              : "4", //其他
    }
    static payGiftType = {
        first			    : "1", //首充
        daily               : "2", //每日
        dailychoose         : "3", //每日自选
        giftgroup           : "4", //限时弹窗礼包组
        xianyuanGift        : "5", //仙缘礼包组
        openGift            : "6", //开服七日礼包组
        rebateGift          : "7", //返利礼包
    }
    static Discount_Type = {
        free        : 1, //免费
        discount    : 2, //折扣
        normal      : 3, //常规
    }
    static taskType = {
        main                : "1", //主线
        break               : "4", //突破
        xianyuan            : "5", //仙缘
        clan                : "6", //帮派
        invite              : "7", //邀请好友
        rebate              : "8", //金竹返利
    }

    static GOLDFINGER_TYPE = {
        GOUQI                       : "1", //每使用{0}个枸杞，可以获得1个枸杞
        JIANGHU                     : "2", //每次挑战江湖擂台，获得{}个枸杞
        HUASHAN                     : "3", //每次挑战华山论剑，获得{}个枸杞
        ADDEXP                      : "4", //使用第十个枸杞，下次分解装备经验{0}倍
        PETREPLACE                  : "5", //可以把一个传说侠侣替换为另一个随机传说侠侣，每天1次        
        PETATTR                     : "6", //侠侣增加的属性，额外增加{0}%
        ELITEREPLACE                : "7", //可以把1个传说门客碎片替换为另1个随机传说门客碎片，每天10次
        ELITEATTR                   : "8", //门客升级属性增加{0}%
        ELITEMAPATTR                : "9", //门客图鉴提升的属性增加{0}%
        AD                          : "10", //每次看广告，额外获得{0}个酒米
        GIFT                        : "11", //每次购买礼包，获得{0}个酒米
        GOUQIJIUMI                  : "12", //每使用200个枸杞，获得{0}个酒米
        EQUIP                       : "13", //选择一个位置，获得一件基础属性超过上限{0}%的装备，每天{1}次
        SKILLATTR                   : "14", //可以把1个蓝色秘籍碎片替换为另1个蓝色随机秘籍碎片，每天{0}次
        SKILLMAP                    : "15", //秘籍图鉴提升的属性增加{0}%
    }

    static adTimesType = {
        
        theurgyDarw : "3" //神通抽卡次数
    }

    static payOtherType = {
        monthcard			: "1", //月卡
        lifecard            : "2", //终身卡
        wartoken            : "3", //战令
        foundation          : "4", //基金
        haven               : "5", //老鼠管家
        xianyuan            : "6", //仙缘 
        fundxiuwei          : "7", //修为基金 
        fundstage           : "8", //冒险基金
        fundxianshu         : "9", //仙树基金
        fundtower           : "10", //镇妖塔基金
        fundfabao           : "11", //法宝基金
        shubao              : "12", //鼠宝 
        jinchan             : "13", //金蟾 
        pixiu               : "14", //貔貅 
        havenAuto7day       : "15", //福地自动老鼠7天 
        havenAuto30day      : "16", //福地自动老鼠30天 
        uniteWeek           : "19", //联合周卡 
        eliteLifeCard       : "20", //精怪终身卡 
        theLifeCard         : "22", //神通终身卡 
        petLifeCard         : "21", //侠侣终身卡 
    }
    static playerAttrChanged = {
        money               : 2, //金币(云英、灵石)
        physical            : 3, //体力(枸杞)        
        stone               : 4, //钻石(玉壁、仙玉)        
        exp                 : 5, //经验
        chance              : 6, //机缘(玉竹) 
    }
    static tickerType = {
        PHASE_BREAKTHROUGH              : "1", // 突破阶段
        SUMMON_SPIRIT_BEAST             : "2", // 合成精怪
        EXTRACT_ARTIFACT                : "3", // 抽取法宝
        COMBINE_ARTIFACT                : "4", // 合成法宝
        EXTRACT_SPIRIT_BEAST            : "5", // 抽取精怪
        UPGRADE_TREE                    : "6", // 升级仙树
        EXTRACT_PET                     : "7", // 抽取宠物
        DEFEAT_PLAYER                   : "8", // 击败玩家
        END_WIN_STREAK                  : "9", // 终结连胜
    }
    static bonusesEventSourceType = {
        openCelebrationRecharge     : 1,  // 开服庆典每日礼包充值奖励
        fortuneRecharge             : 2,  // 运势每日礼包充值奖励
        reincarnationHallRecharge   : 3,  // 轮回殿礼包充值奖励
        animalFairylandRecharge     : 4,  // 灵兽幻境礼包充值奖励
        theurgyAbhisecaRecharge     : 5,  // 神通灌顶礼包充值奖励
        gremlinExperienceRecharge   : 6,  // 精怪历练礼包充值奖励
        domianRecharge              : 7,  // 莽荒妖域
        goldFinger                  : 8,  // 金手指
    }
    static CROSS_SYS_TYPE = {
        PALACE : 1,
        QUNYIN : 2,
        CONQUSET : 3,
        CLANSOLO : 4,
        GRABCITY : 5,
    }
    static SYSYTEM_ID = {
        operate             : 1,//钓鱼.
        adventure           : 2,//主线
        duel                : 3,//斗法/江湖擂台 + 挑战按钮
        mount               : 4,//坐骑
        haven               : 5,//福地/镖局 . 
        king_monster        : 6,//妖王/心魔试炼
        companion           : 7,//兽友
        invasion            : 8,//异兽入侵/魔教来袭
        pet                 : 9,//灵兽/伴侣
        clan                : 10,//帮派/妖盟.
        elite               : 11,//精怪/门客
        monster_tower       : 12,//镇妖塔/激流塔
        gem                 : 13,//修行/灵脉
        theurgy             : 14,//神通/秘籍
        haven_automation    : 15,//福地/镖局 自动采集.
        treasure            : 16,//法宝
        gather_soul         : 18,//聚灵阵（重复！！！就是灵泉）
        equip_refine        : 19,//装备精炼.
        secret_area         : 20,//六道秘境.
        zzzt                : 21,//征战诸天.
        xssl                : 22,//星宿试炼.
        xianyuan            : 23,//仙缘.
        qunyin              : 24,//群英/华山论剑
        automation          : 25,//自动钓鱼
        palace              : 26,//琅琊榜（仙宫）
        demonPath           : 27,//妖途
        RISINGSTAR          : 28,//开服冲榜
        SPRING              : 29,//灵泉
        SHOP                : 30,//商铺
        DAILY_WELFARE       : 31,//每日福利（青蛙）
        ALL_RECHARGE        : 32,//充值入口整合
        INVITE_FRIEND       : 33,//邀请好友
        SEVENDAYS           : 34,//七日签到
        OPENCELEBRATION     : 35,//开服庆典
        REINCARNATIONHALL   : 36,//轮回殿
        FORTUNE             : 37,//运势
        ELITEMONSTOR_LL     : 38,//开服精怪
        PSYCHICINSIGHT      : 39,//开服神通
        BUDDYMASS           : 40,//伙伴集结
        BATTLE_SPEED        : 41,//战斗倍速
        CHAT_OPEN           : 42,//开启聊天
        COMPANION_EXPLORE   : 43,//兽友游历
        TREE_REBATE         : 44,//金竹返利
        STRONGER            : 45,//我要变强
        BrumeIsle           : 46,//雾隐岛
        GrabCity            : 48,//攻城掠地
    }

    static CLAN_ROLE = {
        not_member          :0,//0：非成员
        member              :1,//1：普通成员
        elite               :2,//2：精英
        deputy              :9,//9：副帮主
        leader              :10//10：帮主
    }
    static ENTITIATTR = { // 以数组方式组织。
        MIN                         : 1,

        ATTACK                      : 1,    //基础攻击
        DEFENSE                     : 2,    //基础防御
        SPEED                       : 3,    //基础敏捷
        HEALTH                      : 4,    //基础生命

        ATTACK_GROWUP_PCT           : 5,    //攻击成长百分比
        DEFENSE_GROWUP_PCT          : 6,    //防御成长百分比
        SPEED_GROWUP_PCT            : 7,    //敏捷成长百分比
        HEALTH_GROWUP_PCT           : 8,    //生命成长百分比

        CHANCE_CRITICAL             : 11,      //暴击率
        CHANCE_VERTIGO              : 12,      //击晕率
        CHANCE_COMBO                : 13,      //连击率    
        CHANCE_MISS                 : 14,      //闪避率
        CHANCE_COUNTER              : 15,      //反击率
        CHANGE_VAMPIRE              : 16,      //吸血率
        CHANGE_MAGIC_COMBO          : 17,      //道法连击

        RESISTANCE_MAGIC_COMBO      : 30,      //道法连击抗性
        RESISTANCE_CRITICAL         : 31,      //暴击抗性
        RESISTANCE_VERTIGO          : 32,      //击晕抗性
        RESISTANCE_COMBO            : 33,      //连击抗性    
        RESISTANCE_MISS             : 34,      //闪避抗性
        RESISTANCE_COUNTER          : 35,      //反击抗性
        RESISTANCE_VAMPIRE          : 36,      //吸血抗性

        IGNORE_BATTLE_ATTR          : 38,      //无视战斗属性
        IGNORE_BATTLE_RESISTANCE    : 39,      //无视战斗抗性
        FINAL_ADD_DAMADE            : 40,      //最终增伤
        FINAL_REDUCE_DAMADE         : 41,      //最终减伤
        ENHANCE_CIRTIAL             : 42,      //强化爆伤
        ENHANCE_HEALING             : 43,      //强化治疗
        ENHANCE_SPIRIT_PET          : 44,      //强化灵宠
        ENHANCE_MAGIC               : 45,      //强化道法伤害

        WEAKNESS_CIRTIAL            : 46,      //弱化爆伤
        WEAKNESS_HEALING            : 47,      //弱化治疗
        WEAKNESS_SPIRIT_PET         : 48,      //弱化灵宠
        WEAKNESS_MAGIC              : 49,      //弱化道法伤害

        FINAL_HP                    : 50,       //最终生命力
        FINAL_ATTACK                : 51,       //最终攻击力
        FINAL_DEFENSE               : 52,       //最终防御力
        FINAL_SPEED                 : 53,       //最终敏捷力

        BLOCK                       : 54,       //格挡
        RESISTANCE_BLOCK            : 55,       //格挡抗性

        ARMOR_BREAK                 : 56,       //破甲
        RESISTANCE_ARMOR_BREAK      : 57,       //破甲抗性

        BATTLE_ANGER_CNT            : 60,      //战斗怒气值
        BATTLE_COMBO_CNT            : 61,      //战斗连击次数
        BATTLE_COUNTER_CNT          : 62,      //战斗反击次数
        BATTLE_VERTIGO_CNT          : 63,      //战斗击晕次数
        BATTLE_MAGIC_COMBO_CNT      : 64,      //战斗道法连击次数

        MAX                         : 65,
    }
    static buff_type = {
        type_add_attr               : 1,            // 玩家属性
        type_damage_appent          : 101,          // 伤害追加
        type_damage_burn            : 102,          // 烧伤
        type_freezing               : 103,          // 冰冻   
        type_vertigo                : 104,          // 眩晕
    }
    static EQUIPATTR={
        HEALTH                      : 0,         //生命
        STRENGTH                    : 1,         //攻击
        DEFENSE                     : 2,         //防御
        AGILITY                     : 3,         //敏捷
        
        COMBO                       : 4,         //连击
        COUNTER                     : 5,         //反击
        CRITICAL                    : 6,         //暴击
        MISS                        : 7,         //闪避
        LIFESTEAL                   : 8,         //吸血
        STUN                        : 9,         //击晕

        COMBO_R                     : 10,        //抗连击
        COUNTER_R                   : 11,        //抗反击
        CRITICAL_R                  : 12,        //抗暴击
        MISS_R                      : 13,        //抗闪避
        LIFESTEAL_R                 : 14,        //抗吸血
        STUN_R                      : 15,        //抗击晕
    }
}
