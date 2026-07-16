//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { PErrCode } from "./PErrCode"
import { VarVal } from "./VarVal"

export class StrVal {
    // 此分割线以下写动态文本定义。######################################################################################
    static ERRCODE = {}
    static ENTITI_NAMES = { // 以数组方式组织。
        [VarVal.ENTITIATTR.ATTACK]: "基础攻击",
        [VarVal.ENTITIATTR.DEFENSE]: "基础防御",
        [VarVal.ENTITIATTR.SPEED]: "基础敏捷",
        [VarVal.ENTITIATTR.HEALTH]: "基础生命",

        [VarVal.ENTITIATTR.ATTACK_GROWUP_PCT]: "攻击",
        [VarVal.ENTITIATTR.DEFENSE_GROWUP_PCT]: "防御",
        [VarVal.ENTITIATTR.SPEED_GROWUP_PCT]: "敏捷",
        [VarVal.ENTITIATTR.HEALTH_GROWUP_PCT]: "生命",

        [VarVal.ENTITIATTR.CHANCE_CRITICAL]: "暴击",
        [VarVal.ENTITIATTR.CHANCE_VERTIGO]: "击晕",
        [VarVal.ENTITIATTR.CHANCE_COMBO]: "连击",
        [VarVal.ENTITIATTR.CHANCE_MISS]: "闪避",
        [VarVal.ENTITIATTR.CHANCE_COUNTER]: "反击",
        [VarVal.ENTITIATTR.CHANGE_VAMPIRE]: "吸血",
        [VarVal.ENTITIATTR.CHANGE_MAGIC_COMBO]: "绝学连击",

        [VarVal.ENTITIATTR.RESISTANCE_CRITICAL]: "抗暴击",
        [VarVal.ENTITIATTR.RESISTANCE_VERTIGO]: "抗击晕",
        [VarVal.ENTITIATTR.RESISTANCE_COMBO]: "抗连击",
        [VarVal.ENTITIATTR.RESISTANCE_MISS]: "抗闪避",
        [VarVal.ENTITIATTR.RESISTANCE_COUNTER]: "抗反击",
        [VarVal.ENTITIATTR.RESISTANCE_VAMPIRE]: "抗吸血",

        [VarVal.ENTITIATTR.IGNORE_BATTLE_ATTR]: "无视战斗属性",
        [VarVal.ENTITIATTR.IGNORE_BATTLE_RESISTANCE]: "无视战斗抗性",
        [VarVal.ENTITIATTR.FINAL_ADD_DAMADE]: "最终增伤",
        [VarVal.ENTITIATTR.FINAL_REDUCE_DAMADE]: "最终减伤",
        [VarVal.ENTITIATTR.ENHANCE_CIRTIAL]: "强化爆伤",
        [VarVal.ENTITIATTR.ENHANCE_HEALING]: "强化治疗",
        [VarVal.ENTITIATTR.ENHANCE_SPIRIT_PET]: "强化侠侣",
        [VarVal.ENTITIATTR.ENHANCE_MAGIC]: "强化绝学伤害",

        [VarVal.ENTITIATTR.WEAKNESS_CIRTIAL]: "弱化爆伤",
        [VarVal.ENTITIATTR.WEAKNESS_HEALING]: "弱化治疗",
        [VarVal.ENTITIATTR.WEAKNESS_SPIRIT_PET]: "弱化侠侣",
        [VarVal.ENTITIATTR.WEAKNESS_MAGIC]: "弱化绝学伤害",

        [VarVal.ENTITIATTR.FINAL_HP]: "生命",
        [VarVal.ENTITIATTR.FINAL_ATTACK]: "攻击",
        [VarVal.ENTITIATTR.FINAL_DEFENSE]: "防御",
        [VarVal.ENTITIATTR.FINAL_SPEED]: "敏捷",

        [VarVal.ENTITIATTR.BATTLE_ANGER_CNT]: "战斗怒气值",
        [VarVal.ENTITIATTR.BATTLE_COMBO_CNT]: "战斗连击次数",
        [VarVal.ENTITIATTR.BATTLE_COUNTER_CNT]: "战斗反击次数",
        [VarVal.ENTITIATTR.BATTLE_VERTIGO_CNT]: "战斗击晕次数",
    }
    static EQUIPATTR_NAMES = { // 以数组方式组织。装备的属性添加
        [VarVal.EQUIPATTR.HEALTH]: "生命",
        [VarVal.EQUIPATTR.STRENGTH]: "攻击",
        [VarVal.EQUIPATTR.DEFENSE]: "防御",
        [VarVal.EQUIPATTR.AGILITY]: "敏捷",

        [VarVal.EQUIPATTR.COMBO]: "连击",
        [VarVal.EQUIPATTR.COUNTER]: "反击",
        [VarVal.EQUIPATTR.CRITICAL]: "暴击",
        [VarVal.EQUIPATTR.MISS]: "闪避",
        [VarVal.EQUIPATTR.LIFESTEAL]: "吸血",
        [VarVal.EQUIPATTR.STUN]: "击晕",

        [VarVal.EQUIPATTR.COMBO_R]: "抗连击",
        [VarVal.EQUIPATTR.COUNTER_R]: "抗反击",
        [VarVal.EQUIPATTR.CRITICAL_R]: "抗暴击",
        [VarVal.EQUIPATTR.MISS_R]: "抗闪避",
        [VarVal.EQUIPATTR.LIFESTEAL_R]: "抗吸血",
        [VarVal.EQUIPATTR.STUN_R]: "抗击晕",
    }

    static GETITEM_NAMES = { // 获取途径名称
        [VarVal.GUIDE_TYPE.KANSHU]: "垂钓",
        [VarVal.GUIDE_TYPE.ACTIVITY_SHOP]: "商铺",
        [VarVal.GUIDE_TYPE.EVOLUTION]: "池塘升级",
        [VarVal.GUIDE_TYPE.CHALLENGE_STAGE]: "冒险",
        [VarVal.GUIDE_TYPE.MOUNT_LEVELUP]: "坐骑升级",
        [VarVal.GUIDE_TYPE.PET_LEVELUP]: "伙伴",
        [VarVal.GUIDE_TYPE.PET_CALL]: "伙伴",
        [VarVal.GUIDE_TYPE.VEIN_ACTIVE]: "修行",
        [VarVal.GUIDE_TYPE.DUEL_CHALLENGE]: "江湖擂台",
        [VarVal.GUIDE_TYPE.KING_MONSTER]: "心魔试炼",
        [VarVal.GUIDE_TYPE.INVASION]: "魔教来袭",
        [VarVal.GUIDE_TYPE.MONSTER_TOWER]: "激流塔",
        [VarVal.GUIDE_TYPE.HAVEN_GET]: "镖局",
        [VarVal.GUIDE_TYPE.FABAO_CALL]: "xx召唤",
        [VarVal.GUIDE_TYPE.ELITE_CALL]: "门客",
        [VarVal.GUIDE_TYPE.THEURG_CALL]: "秘籍",
        [VarVal.GUIDE_TYPE.FABAO_LEVELUP]: "xx升级",
        [VarVal.GUIDE_TYPE.ELITE_LEVELUP]: "门客",
        [VarVal.GUIDE_TYPE.THEURG_LEVELUP]: "秘籍",
        [VarVal.GUIDE_TYPE.MAIN_TASK]: "主线任务",
        [VarVal.GUIDE_TYPE.CLAN]: "帮派",
        [VarVal.GUIDE_TYPE.COMPANION]: "兽友",
        [VarVal.GUIDE_TYPE.ELITE]: "门客点击",
        [VarVal.GUIDE_TYPE.STAGE]: "武境界突破",
        [VarVal.GUIDE_TYPE.PET]: "上阵侠侣",
        [VarVal.GUIDE_TYPE.PALACE]: "琅琊榜",
        [VarVal.GUIDE_TYPE.HAVEN_FINDOTHER]: "镖局运镖",
        [VarVal.GUIDE_TYPE.HAVEN_GETMOUSE]: "镖局招募",
        [VarVal.GUIDE_TYPE.QUNYIN]: "论剑挑战",
        [VarVal.GUIDE_TYPE.COMPANION_EXPLORE]: "兽友游历",
        [VarVal.GUIDE_TYPE.MONTH_CARD]: "特权卡",
        [VarVal.GUIDE_TYPE.TREE_REBEAT]: "聚宝盆",
        [VarVal.GUIDE_TYPE.DAILY_GIFT]: "每日特惠",
        [VarVal.GUIDE_TYPE.LEI_TOTAL]: "前往",
    }
    static GETITEM_HOWS = { // 获取途径简述
        [VarVal.GUIDE_TYPE.KANSHU]: "获取装备",
        [VarVal.GUIDE_TYPE.ACTIVITY_SHOP]: "购买",
        [VarVal.GUIDE_TYPE.EVOLUTION]: "池塘升级",
        [VarVal.GUIDE_TYPE.CHALLENGE_STAGE]: "战斗",
        [VarVal.GUIDE_TYPE.MOUNT_LEVELUP]: "坐骑升级",
        [VarVal.GUIDE_TYPE.PET_LEVELUP]: "伙伴升级",
        [VarVal.GUIDE_TYPE.PET_CALL]: "伙伴召唤",
        [VarVal.GUIDE_TYPE.VEIN_ACTIVE]: "净化",
        [VarVal.GUIDE_TYPE.DUEL_CHALLENGE]: "打擂",
        [VarVal.GUIDE_TYPE.KING_MONSTER]: "挑战",
        [VarVal.GUIDE_TYPE.INVASION]: "战斗",
        [VarVal.GUIDE_TYPE.MONSTER_TOWER]: "战斗",
        [VarVal.GUIDE_TYPE.HAVEN_GET]: "前往",
        [VarVal.GUIDE_TYPE.FABAO_CALL]: "没做",
        [VarVal.GUIDE_TYPE.ELITE_CALL]: "品茶",
        [VarVal.GUIDE_TYPE.THEURG_CALL]: "参悟",
        [VarVal.GUIDE_TYPE.FABAO_LEVELUP]: "没做",
        [VarVal.GUIDE_TYPE.ELITE_LEVELUP]: "门客升级",
        [VarVal.GUIDE_TYPE.THEURG_LEVELUP]: "秘籍升级",
        [VarVal.GUIDE_TYPE.MAIN_TASK]: "主线任务",
        [VarVal.GUIDE_TYPE.CLAN]: "帮派",
        [VarVal.GUIDE_TYPE.COMPANION]: "兽友",
        [VarVal.GUIDE_TYPE.ELITE]: "门客点击",
        [VarVal.GUIDE_TYPE.STAGE]: "武境界突破",
        [VarVal.GUIDE_TYPE.PET]: "上阵侠侣",
        [VarVal.GUIDE_TYPE.PALACE]: "琅琊榜",
        [VarVal.GUIDE_TYPE.HAVEN_FINDOTHER]: "镖局运镖",
        [VarVal.GUIDE_TYPE.HAVEN_GETMOUSE]: "镖局招募",
        [VarVal.GUIDE_TYPE.QUNYIN]: "论剑挑战",
        [VarVal.GUIDE_TYPE.COMPANION_EXPLORE]: "兽友游历",
        [VarVal.GUIDE_TYPE.MONTH_CARD]: "每日领取",
        [VarVal.GUIDE_TYPE.TREE_REBEAT]: "礼包购买",
        [VarVal.GUIDE_TYPE.DAILY_GIFT]: "礼包购买",
        [VarVal.GUIDE_TYPE.LEI_TOTAL]: "累计充值",
    }

    // 门客属性
    static ELITEATTR_NAME = {
        "hp": this.EQUIPATTR_NAMES[0],
        "attack": this.EQUIPATTR_NAMES[1],
        "defense": this.EQUIPATTR_NAMES[2],
        "spd": this.EQUIPATTR_NAMES[4],
        "stun": this.EQUIPATTR_NAMES[9],
        "critical_hit": this.EQUIPATTR_NAMES[6],
        "combo": this.EQUIPATTR_NAMES[4],
        "eva": this.EQUIPATTR_NAMES[7],
        "counter": this.EQUIPATTR_NAMES[5],
        "lifesteal": this.EQUIPATTR_NAMES[8],
        "stun_resis": this.ENTITI_NAMES[32],
        "crit_resis": this.ENTITI_NAMES[31],
        "combo_resis": this.ENTITI_NAMES[33],
        "eva_resis": this.ENTITI_NAMES[34],
        "counter_resis": this.ENTITI_NAMES[35],
        "lifesteal_resis": this.ENTITI_NAMES[36],
        "final_damage": this.ENTITI_NAMES[40],
        "final_reduction": this.ENTITI_NAMES[41],
        "enhanced_blast": this.ENTITI_NAMES[42],
        "weakening_blast": this.ENTITI_NAMES[46],
        "enhanced_treatment": this.ENTITI_NAMES[43],
        "weakening_treatment": this.ENTITI_NAMES[47],
        "enhanced_pets": this.ENTITI_NAMES[44],
        "weakening_pets": this.ENTITI_NAMES[48],
    }

    // 门客羁绊属性
    static ELITEATTRGROUP_NAME = {
        "attack": this.EQUIPATTR_NAMES[1],
        "eva": this.EQUIPATTR_NAMES[7],
        "hp": this.EQUIPATTR_NAMES[0],
        "qhzdkx": this.ENTITI_NAMES[38],
        "lifesteal": this.EQUIPATTR_NAMES[8],
        "final_reduction": this.ENTITI_NAMES[41],
        "stun": this.EQUIPATTR_NAMES[9],
        "enhanced_treatment": this.ENTITI_NAMES[43],
        "critical_hit": this.EQUIPATTR_NAMES[6],
        "combo": this.EQUIPATTR_NAMES[4],
        "counter": this.EQUIPATTR_NAMES[5],
        "enhanced_pets": this.ENTITI_NAMES[44],
    }

    static UNIT_STR: string[]=["", "万", "亿", "万亿"]
    // 此分割线以下写共用文本定义。######################################################################################
    static COMMON = {
        STR1: "未知错误:({0})",
        STR2: "正在加载资源:({0}/{1})",
        STR3: "使用",
        STR4: "您没有{0}",
        STR5: "恭喜，已使用！",
        STR6: "VIP{0}",
        STR7: "请输入{0}个字以内",
        STR8: "暂未开放",
        STR9: "【点击空白区域继续】",
        STR10: "{0}万亿",
        STR11: "本区正在维护中，敬请稍后",
        STR12: "{0}万",
        STR13: "{0}亿",
        STR14: "{0}天以前",
        STR15: "{0}小时以前",
        STR16: "{0}分钟以前",
        STR17: "在线",
        STR18: "{0}级",
        STR19: "无",
        STR20: "昨天",
        STR21: "前天",
        STR22: "三天以前",
        STR23: "引导跳过后将不再出现，是否继续？",
        STR24: "网络连接中，请稍后......",
        STR25: "是否清理缓存并重启游戏？",
        STR26: "本区将于{0}开放",

        STR31: "提示",
        STR32: "取消",
        STR33: "确定",
        STR34: "重试",
        STR35: "本次登录不再提示。",
        STR36: "是否花费{0}[img]{1}[/img]{2}购买<color=#{3}>{4}</color>？\n（使用<color=#{3}>{0}</color>[img]{1}[/img]购买与<color=#{3}>现金</color>购买享有<color=#{3}>相同权益</color>）",
        STR37: "[img]{0}[/img][color=#{1}]{2}/{3}[/color]",
        STR38: "前往",
        STR39: "今日登录不再提示。",

        STR51: "{0}年",
        STR52: "兑换",
        STR53: "已兑换 {0}/{1}",
        STR55: "现有：{0}",

        STR101: "分享成功！",
        STR102: "黄女侠",
        STR103: "是自己",

        STR201: "{0}天",
        STR202: "{0}小时",
        STR203: "{0}分钟",
        STR204: "{0}秒",
        // 这种后面的分钟秒省略掉算了
        STR205: "{0}天{1}小时",
        // 秒省略
        STR206: "{0}小时{1}分钟",
        STR207: "{0}分{1}秒",
        STR208: "{0}({1}秒)",

        STR301: "我在玩",
        STR302: "快来一起玩吧",
    }
    static NUMTOCN = {
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六",
        "7": "七",
        "8": "八",
        "9": "九",
        "10": "十",
        "11": "十一",
    }
    static PLATFORM = {
        STR1: "暂时没有充值方式。",
        STR2: "微信查询游戏币余额失败。",
        STR3: "微信扣除游戏币余额失败。",
        STR4: "充值失败，请重试。",
        STR5: "充值成功！充值商品请留意查收。",
        STR6: "亲爱的！您充值的商品已经到账了！",
        STR7: "上一次的充值未完成，请选择上一次的对应充值档次进行补单。",
        STR8: "没有找到对应的金额档次。",

        STR101: "获取服务器列表失败，请检查网络后重试。",
        STR102: "平台登录验证失败，请检查网络后重试。",
        STR103: "进入服务器验证失败，请检查网络后重试。",
        STR104: "获取服务器列表失败，未登录。",
    }
    static GAMESERVER = {
        STR101: "您的账号在别处登录。",
        STR102: "返回登录",
        STR103: "连接被中断，与服务器已断开。",
        STR104: "重新连接",
        STR105: "重连失败，请检查您的网络，稍后再试。",
        STR106: "资源版本过旧，即将尝试启动更新程序。",
        STR107: "更新",
        STR108: "发送超时，与服务器已断开。",
    }
    // 此分割线以下写界面文本定义。######################################################################################
    static LYLOGOUPDATE = {
        STR1: "获取资源列表失败，请保持网络通畅，提示:{0}。",
        STR2: "当前程序已过期，请前往app商城下载。",
        STR3: "建议使用WIFI，正在下载资源({0} MB / {1} MB)",
        STR4: "下载资源失败，请保持网络通畅，提示:{0}。",
        STR5: "下载文件损坏，请保持网络通畅后重试。",
        STR6: "正在校验文件完整性~",
        STR7: "正在展开文件（{0}/{1}）:{2}",
        STR8: "请稍后，正在获取配置信息。",

        STR101: "请稍后，正在加载资源。",
        STR102: "《健康游戏忠告》\n抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。\n适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。本网络游戏适合年满16岁以上的用户健康使用;请您确定已如实进行实名注册"
    }
    static LYLOGIN = {
        STR1: "已登录",
        STR2: "未登录",
        STR3: "切换账号",
        STR5: "请选择服务器",
        STR8: "是否登出当前账号？",
        STR9: "暂时没有公告",
        STR10: "公告",
        STR11: "清理缓存",
    }
    static LYLOGINACCOUNT = {
        STR1: "HDHive 授权登录",
        STR2: "HDHive",
        STR3: "",
        STR4: "取消",
        STR5: "请输入账号",
        STR6: "账号只能由数字、字母、下划线和中文组成",
        STR7: "请输入密码",
        STR8: "密码只能由数字、字母和下划线组成",
        STR9: "请输入账号",
        STR10: "已取消授权登录",
        STR11: "HDHive 授权",
        STR12: "授权信息无效，请重新授权",
        STR13: "",
        STR14: "正在前往 HDHive 授权",
        STR15: "",
        STR16: "授权登录",
        STR17: "点击下方按钮跳转授权，完成后将自动回到游戏",
    }
    static LYLELECTSERVER = {
        STR1: "服务器",
        STR2: "维护",
        STR3: "流畅",
        STR4: "爆满",
        STR6: "我的服务器",
        STR7: "全部服务器",
    }
    static LYCREATEROLE = {
        STR1: "请输入昵称",
        STR2: "不能包含广告、营销、敏感等字符",
        STR3: "开始",
    }
    static LYMAINPAGE = {
        STR1: "邮件",
        STR2: "({0}/{1})",
        STR3: "{0}级·{1}",
        STR4: "任务已全部完成",
        STR5: "查看更多",
        STR6: "{0} {1}",
        STR7: "{0} {1}%",
        STR8: "枸杞不足，无法钓鱼",
        STR9: "{0}级",
        STR10: "{0}阶{1}级",
        STR11: "鱼塘",
        STR12: "lv.{0}",
        STR13: "{0}秒后自动关闭",
        STR14: "钓鱼额外产出以下道具",
        STR15: "达到{0}级后解锁自动钓鱼功能",
        STR16: "还需完成{0}个主线任务解锁",
        STR17: "等级达到{0}且开服{1}/{2}天后解锁",
        STR18: "功能未开放",
        STR19: "功能未开放",
        STR20: "领取",
        STR21: "法宝",
        
        STR101: "还需完成{0}个主线任务，或购买首充后解锁3倍速",
        STR102: "等级达到{0}且开服{1}/{2}天，或购买首充后解锁3倍速",
    }
    static LYSTAGE = {
        STR2: "关卡奖励",
        STR4: "挑战",
        STR5: "章节奖励",
        STR6: "第{0}章{1}关",
        STR7: "{0}级",
    }
    static LYACTIVITY_INVASION = {
        STR1: "后进行今日奖励结算",
        STR2: "概率掉落",
        STR3: "今日次数{0}/{1}",
        STR4: "挑战",
        STR5: "排行奖励",
        STR6: "奖励将在结束后以邮件发放。",
        STR7: "每日排行",
        STR8: "排名",
        STR9: "玩家",
        STR10: "伤害",
        STR11: "今日次数：[color=#{0}]{1}/{2}[/color]",
        STR12: "今日挑战次数已用完。",
        STR14: "挑战次数：{0}",
        STR15: "伤害：{0}",
      
    }
    static LYACTIVITY_MONSTERTOWER = {
        STR1: "当前:{0}-{1}层",
        STR2: "首次挑战",
        STR3: "挑战奖励",
        STR4: "第{0}层第{1}关",
        STR5: "加成",
        // STR6: "<outline color=#000000 width=1><color=#00ff00>{0}</color></outline> 后重置。",
        STR6: "{0} 后重置。",
        STR7: "加成预设",
        STR8: "快速挑战",
        STR9: "一键选择",
        STR10: "选择加成",
        STR11: "继续挑战",
        STR13: "<u>敌人信息</u>",
        STR14: "个人排行",

        STR12: "{0}-{1}\n解锁",

        STR101: "速战奖励",
        STR102: "速战可获得：",
        STR103: "未达成",
        STR104: "已完成",
        STR105: "通关第{0}层",
        
        STR201: "{0}-{1}层",
        STR202: "{0}",
        STR203: "进度",

        STR301: "醍醐灌顶",
        STR302: "选择加成",
        STR303: "剩余可选次数：{0}",
        STR304: "选择替换一个已拥有的被动加成效果。",
        STR305: "确认放弃本次加成选择？",
        STR306: "替换加成",

        STR401: "加成偏好",
        STR402: "启用偏好",
        STR403: "手动选择",
        STR404: "每种加成只能选择<color=#CF4141>一次</color>。",
        STR405: "加成预设",
        STR411: "优先级1",
        STR412: "优先级2",
        STR413: "优先级3",
        STR414: "优先级4",
        STR415: "优先级5",
    }
    static ACTIVITY_SHOP = {
        STR1: "限购：{0}",
        STR2: "限购：{0}/{1}",
        STR3: "折",
        STR4: "适度游戏，理性消费",
        STR5: "{0} 后刷新",
    }
    static ACTIVITY_SHOPBUY = {
        STR1: "获取途径",
        STR2: "拥有：{0}",
        STR3: "物品已售罄。",
        STR4: "数量：{0}",
        STR5: "购买",
        STR6: "商铺中暂无售卖。",
        STR7: "此物品在活动中获得",
        STR8: "使用",
        STR9: "商铺暂未开放",
    }
    static ACTIVITY_OPENRANK = {
        STR1: "上榜前{0}需要消费代金券≥{1}",
        STR2: "排名",
        STR3: "玩家积分",
        STR4: "奖励",
        STR7: "已结束",

        STR31: "福榜日志",
        STR32: "实时冲榜",

        STR41: "已结束",
        STR42: "剩余时间：{0}",
        STR43: "开启倒计时：{0}",
        STR44: "今日消费:{0}",
        STR45: "前往",
    }
    static ACTIVITY_KINGMONSTER = {
        STR1: "已挑战",
        STR2: "{0}解锁",
        STR3: "免费速战",
        STR4: "今日次数：{0}/{1}",
        STR5: "速战",
        STR6: "挑战",
        STR7: "是否使用{0}[img=32]{1}[/img]速战？",
        STR8: "速战次数：{0}",
        STR9: "{0}：{1}",
        STR10: "挑战前一关后解锁",
        STR11: "兽友{0}加成:枸杞掉落额外增加{1}个",
        STR12: "闲置镖师：{0}",
    }
    static LYCHALLENGE_DUEL = {
        STR1: "{0}",
        STR2: "当前积分：{0}",
        STR3: "每周奖励",
        STR4: "每日奖励",
        STR5: "倒计时 {0}",
        STR6: "倒计时 {0}天 {1}",
        STR7: "擂台积分：{0}",
        STR8: "积分",
        STR9: "未上榜",

        STR11: "日志",
        STR14: "积分{0}",
        STR16: "（{0}）",
        STR17: "昨天",
        STR18: "当前不可反击",
        STR19: "积分+{0}",

        STR21: "挑战",
        STR22: "刷新",
        STR23: "积分：{0}",
    }
    static LYCHATROOM = {
        STR1: "世界",
        STR2: "帮派",
        STR3: "活动",
        STR4: "发送",
        STR5: "点击输入内容",
        STR6: "[color=#D76828][{0}][/color][u][color=#1C667E]{1}：[/color][/u]{2}",
        STR7: "请输入消息内容。",
        STR8: "请输入{0}个字以内。",
    }
    static LYGOLDFINGER = {
        STR1: "寻龙分金",
        STR2: "至宝刷新倒计时：[color=#48D667]00:00:00[/color]",
        STR3: "每抽增加10点，每消耗1代金券增加1点",
        STR4: "保底值：{0}/{1}",
        STR5: "保底值满后必得至尊宝物",
        STR6: "抽取{0}次",

        STR21: "奖励预览",
        STR22: "获得概率 [color=#28B711]{0}%[/color]",

        STR101: "至尊宝匣",
        STR102: "至尊宝物",
        STR103: "宝物等级：",
        STR104: "升星成功！",

        STR201: "拥有者：[color=#F4E9D6]{0}[/color]",
        STR202: "升星",
        STR203: "使用",
        STR204: "无",
        STR205: "暂无主动效果",
        STR206: "暂未解锁",
        STR207: "已达到最大等级",

        STR301: "今日剩余次数：{0}次",
        STR302: "随机",
        STR303: "点击选框",
        STR304: "请选择需要替换的门客",
        STR305: "暂无可用碎片",

        STR401: "选择侠侣",
        STR402: "只能选择未上阵、升级、传功的侠侣",
        STR403: "侠侣互换",
        STR404: "请选择需要替换的侠侣",
        STR405: "今日次数已用完",
        STR406: "暂无可用侠侣",
        STR407: "可选侠侣",
        STR408: "{0}次钓鱼后获得",

        STR501: "未选择",
        STR502: "请选择对应类型的装备",
        STR503: "恭喜获得！已掉落至装备区",

        STR601: "请选择需要替换的秘籍碎片",
    }
    static LYCONQUESTSEEK = {
        STR1: "个人排名:",
        STR2: "累计击败数:",
        STR3: "连续击败数:",
        STR4: "帮派排名:",
        STR5: "帮派积分:",
        STR6: "未上榜",
        STR7: "【传闻】{0}，还有{1}进入战场，击败可获得{2}积分",
        STR8: "【传闻】{0}正在战场肆虐，击败可获得{1}积分",
        STR9: "【传闻】{0}，击败了{1}，获得了{2}积分",
        STR10: "恢复中{0}",
        STR11: "赏金{0}",
        STR12: "【公告】{0}",
        STR13: "[size=42]玩[/size]法属性",
        STR14: "我的属性",
        STR15: "小怪增益:",
        STR16: "精英增益:",
        STR17: "boss增益:",
        STR18: "当前排名:{0}",
        STR19: "(非实时排名)",
        STR20: "排名属性",
        STR21: "排名",
        STR22: "小怪增益",
        STR23: "精英增益",
        STR24: "boss增益",
        STR25: "{0}-{1}名",
        STR26: "*报名排名决定少侠在八荒探秘中的初始属性",
        STR27: "{0}%",
        STR28: "第{0}名",
        STR29: "剩余活动时间:",

        STR101: "当前正在领奖期",
        STR102: "活动时间：{0}-{1}",
        STR103: "[{0}月{1}日]{2}",
        STR104: "报名中：{0}",
        STR105: "准备中：{0}",
        STR106: "开战中：{0}",


        STR201: "帮主",
        STR202: "精英及以上",
        STR203: "成员",
        STR204: "领取",
        STR205: "已领取",
        STR206: "积分值：{0}",
        STR207: "退敌数：{0}",
        STR208: "退敌数",

        STR301: "任务",
        STR302: "*活动结束后，奖励会以邮件形式发放",
        STR303: "未完成",

        STR401: "[{0}月{1}日][color=#FEEBA0]{2}[/color]",
        STR404: "报名中：[color=#48D667]{0}[/color]",
        STR405: "准备中：[color=#FF0000]{0}[/color]",
        STR406: "开战中：[color=#48D667]{0}[/color]",

        STR501: "点赞",
        STR502: "暂无获胜记录",
        STR503: "已点赞",
        STR504: "当前活动已结束，将退出本活动。",
    }
    static LYPAY_RECHARGE = {
        STR1: "适度游戏，理性消费",
        STR2: "购代金券不计入充值累积",
        STR3: "{0}积分", // HDHive 积分价
        STR4: "[img=24]{0}[/img]{1}",
        STR5: "还差 {0} 代金券，是否前往购买？",
        STR6: "积分价格加载中……",
        STR7: "积分价格加载失败，点击重试",
        STR8: "{0}代金券",
        STR9: "HDHive 积分：{0}",
        STR10: "续费\n{0}代金券",

        STR101: "第{0}天",
        STR102: "（需要在当前页面充值后激活）",
        STR103: "等级达{0}可立即领取",
        STR104: "¥{0}",
        STR105: "技能预览",
        STR111: "未激活",
        STR112: "待签到",
        STR113: "领取",
        STR114: "已领取",

        STR201: "领取",
        STR202: "领取成功！",
        STR203: "续费\n{0}元",
        STR204: "剩余：{0}天",
        STR200: "今日已领取",

        STR205:[ // 下标对应类型。
            "{0}、立即获得[img=20]{1}[/img]<color=#{2}>{3}</color>[img=20]{4}[/img]<color=#{2}>{5}</color>", 
            "{0}、每日可领取[img=20]{1}[/img]<color=#{2}>{3}</color>[img=20]{4}[/img]<color=#{2}>{5}</color>",
            "{0}、心魔试炼每日<color=#{1}>扫荡次数+{2}</color>",
            "{0}、钓鱼开启<color=#{1}>加速模式</color>",
            "{0}、跳过广告",
            "{0}、江湖令上限<color=#{1}>+{2}</color>",
            "{0}、刷新<color=#{1}>{2}次</color>后，必出<color=#{2}>神话侠侣</color>",
            "{0}、修行开启<color=#{1}>自动模式</color>",
            "{0}、修行开启<color=#{1}>加速模式</color>",
            "{0}、开启自动钓鱼功能",
        ],
        STR206: "30天特权专享！\n每日领取大量[img=22]{0}[/img]\n开启钓鱼加速模式",
        STR207: "永久生效！\n每日领取\n        大量[img=22]{0}[/img]和[img=22]{1}[/img]\n开启各种便利模式",
        STR208: "6000%",
        STR209: "12000%",
        STR210: "购买后立即解锁以下权益",
        STR211: "尊享权益",

        STR230: "60倍返利",
        STR231: "终身受益",
        STR232: "购买立得[img=36]{0}[/img]{1}",
        STR233: "每日领取[img=36]{0}[/img]{1}",
        STR234: "专属特权",

        STR301: "每日限购：{0}",
        STR302: "可购买次数：{0}/{1}",
        STR303: "免费",
        STR304: "永久限购：{0}",
        STR305: "{0} * {1}",
        STR306: "请选择完购买的商品。",
        STR307: "自选礼包",
        STR308: "此礼包已售罄，明日再来。",
    }

    static LYPAY_FUNDS = {
        STR1: "基础福利",
        STR2: "超值福利",
        STR3: "额外奖励预览",
        STR4: "{0}X{1}",

        STR51: "提升主线等级，领取奖励",
        STR52: "4000%超值主线基金奖励回报",
        STR53: "解锁可获得价值40000玉璧的奖励",
        STR54: "{0}级",

        STR61: "通关冒险关卡，领取奖励",
        STR62: "4000%超值冒险基金奖励回报",
        STR63: "解锁可获得价值130000玉璧的奖励",
        STR64: "{0}-{1}",

        STR71: "提升筑塘等级，领取奖励",
        STR72: "4000%超值筑塘等级基金奖励回报",
        STR73: "解锁可获得价值30000玉璧的奖励",

        STR81: "通关激流塔，领取奖励",
        STR82: "2000%超值激流塔基金奖励回报",
        STR83: "解锁可获得价值70000玉璧的奖励",

        STR100: "领取奖励",
        STR101: "提升主线等级",
        STR102: "通关冒险关卡",
        STR103: "提升筑塘等级",
        STR104: "通关激流塔",
    }

    static LYPAY_ACTIVITYS = {
        STR1: "领取",
        STR2: "已领取",
        STR3: "购买月卡/终身卡可跳过广告",
        STR4: "距离领取奖励只差一步了",

        STR101: "{0}后消失",
        STR102: "已购买",
    }

    static LYPAY_SEVEBGIFTGROUP = {
        STR1: "活动剩余：[color=#53FF46]{0}[/color]",
        STR2: "已售罄",
        STR3: "每日限购：{0}/{1}",
        STR4: "活动剩余：{0}",

        STR101: "满级预览",
    }

    static LYACTIVITY_OPENCELEBARATION = {
        STR1: "兑换",
        STR2: "任务",
        STR3: "礼包",
        STR4: "前往",
        STR5: "领取",
        STR6: "已完成",
        STR7: "永久限购：{0}",
        STR8: "售罄",
        STR9: "庆典积分：{0}",
        STR10: "活动结束：{0}",
    }

    static LYACTIVITY_FORTUNE = {
        STR1: "抽签",
        STR2: "任务",
        STR3: "礼包",
        STR4: "前往",
        STR5: "领取",
        STR6: "已完成",
        STR7: "{0}/{1}",
        STR8: "活动结束时，清空如意签",
        STR9: "剩余：{0}/{1}",
        STR10: "活动时间：<color=#2B841C>{0}-{1}</color>",
        STR11: "<color=#2B841C>{0}</color> 后重置任务",
        STR12: "抽一次",
        STR13: "抽十次",
        STR14: "概率展示",
        STR15: "抽取{0}次后才可以跳过。",
        STR16: "跳过动画",
        STR17: "是否消耗{0}[img=32]{1}[/img]购买（{2}）？",
    }

    static LYACTIVITY_REINCARNATIONHALL = {
        STR1: "任务",
        STR2: "礼包",
        STR3: "{0}后结束",
        STR4: "当前进度",
        STR6: "奖励轮次：{0}/{1}",
    }

    static LYFRIENDINVITE = {
        STR1: "前往",
        STR2: "领取",
        STR3: "已领取",
        STR4: "<color=#E0E4C9>已邀请：</color><color=#E3DBA0>{0}名</color>",
    }

    static LYPALACE = {
        STR1: "天道说明",
        STR2: "今日已点赞",
        STR3: "今日剩余：[color=#52EE3E]{0}/{1}[/color]",
        STR4: "{0}级",
        STR5: "英豪录",
        STR6: "新晋侠客",
        STR7: "第{0}位侠客",
        STR8: "{0}可从琅琊赐福中获得",
        STR9: "皮肤预览",
        STR10: "形象",
        STR11: "限购：{0}",
        STR12: "琅琊榜说明",
        STR13: "[color=#{0}]（剩余次数：{1}/{2}）[/color]",
        STR14: "跳过所有点赞",
        STR15: "是否跳过所有点赞，若跳过则无法获得玉璧奖励，该操作本次登录有效。",

        STR101: "请为大家赐福吧！",
        STR102: "随机",
        STR103: "发送",
    }

    static LYSTAGEREWARD = {
        STR1: "已领取",
        STR2: "领取",
        STR3: "未完成",
        STR4: "一键领取",
        STR5: "通关{0} {1}-{2}",
    }
    static LYMAIL = {
        STR1: "删除",
        STR2: "领取",
        STR3: "[size=42]邮[/size]箱",
        STR4: "删除已读",
        STR5: "一键领取",
        STR6: "当前邮件 {0}/50",
        STR7: "发件人：{0}",
        STR8: "发件时间：{0}",
        STR9: "剩余删除时间: {0}",
    }
    static LYDETAILATTR = {
        STR2: "基础属性",
        STR3: "战斗属性",
        STR4: "战斗抗性",
        STR5: "特殊属性",

        STR101: "[size=42]详[/size]细属性",
        STR102: "累计加成",
        STR103: "敌人信息",

        STR201: "{0} {1}",
        STR202: "{0} {1}%",
        STR203: "{0} +{1}",
        STR204: "{0} +{1}%",
    }
    static LYBATTLEMAIN = {
        STR1: "第{0}/{1}回合",
        STR2: "{0}回合后可跳过战斗。",
        STR3: "点击空白区域跳过战斗。",
        STR101: "技能预览",
        STR102: "皮肤预览",
    }
    static LYBATTLE_RESULT = {
        STR1: "下一关({0}秒)",
        STR2: "本次战斗伤害：{0}",
        STR3: "下一关：{0}-{1}",
        STR4: "挑战失败，请再接再厉！",
        STR5: "你可以通过以下方式增加实力！",

        STR101: "奖励获得",
        STR102: "【积分】{0}[color=#{1}]（+{2}）[/color]",
        STR103: "【积分】{0}[color=#{1}]（{2}）[/color]",


        STR201: "华山之巅排名上升至：[color=#FDEE74]{0}(+{1})[/color]",
        STR202: "成功战胜对方[color=#FDEE74]{0}[/color]次"
    }
    static LYEVOLUTION = {
        STR1: "升级所需要时间",
        STR2: "剩余时间",
        STR3: "当前等级{0}",
        STR4: "下个等级{0}",
        STR5: "升级后, 钓鱼将有概率额外产出新道具",
        STR6: "[size=42]鱼[/size]塘",
        STR7: "已解锁",
        STR8: "{0}级解锁",
        STR9: "升级",
        STR10: "加速",
        STR11: "升级时间：{0} [color=#5B9F57]({1})[/color]",
        STR12: "升级缩短{0}",
        STR13: "协助",
        STR14: "已协助",
        STR15: "减少时间",
        STR16: "观看视频后 \n 缩短{0}分钟升级时间",
        STR17: "免费获取",
        STR18: "直接获取",
        STR19: "升级缩短{0}分钟",
        STR20: "鱼塘已升至{0}级",
        STR21: "数量:{0}",
    }
    static LYBACKPACK = {
        STR1: "行[size=36]囊[/size]",
        STR2: "已拥有: {0}",
        STR3: "合成",
        STR4: "合成材料",
        STR5: "可合成: {0}/{1}",
        STR6: "使用: {0}",
        STR7: "已选择：[color={0}]({1}/{2})[/color]",
        STR8: "{0}后过期",
        STR9: "数量： {0}",
        STR10: "侠侣背包已满， 是否前往开拓",
    }
    static LYMOUNT = {
        STR1: "坐骑",
        STR2: "使用中",
        STR3: "{0}+{1}%",
        STR4: "无特殊属性",
        STR5: "使用",
        STR6: "基础属性",
        STR7: "当前",
        STR8: "下级",
        STR9: "化形",
        STR10: "{0}阶{1}级",
        STR11: "进阶",
        STR12: "升级",
        STR13: "快速升级",
        STR14: "所有座驾等级共享，再提升{0}级之后可进阶。",
        STR15: "是否消耗{0}[img=32]{1}[/img]激活？",

        STR101: "累计加成",
        STR102: "获取途径：{0}",
        STR103: "激活",
        STR105: "幻化",
        STR106: "解除幻化",
        STR107: "激活效果：强化{0}+{1}%",
        STR108: "升级效果：强化{0}+{1}%",
        STR109: "激活效果：强化战斗抗性[color=#4F9D1A]+{0}%[/color]",
        STR110: "升级效果：强化战斗抗性[color=#4F9D1A]+{0}%[/color]",

        STR201: "详情",
        STR202: "再升{0}级可进阶",
        STR203: "使用中的座驾加成",
        STR204: "当前",
        STR205: "下阶",
        STR206: "基础属性加成",
    }
    static LYATTACHEQUIP = {
        STR1: "【{0}】【{1}】{2}",
        STR2: "当前装备",
        STR3: "新装备",
        STR4: "替换后自动分解原装备",
        STR5: "分解",
        STR6: "替换",
        STR7: "穿戴",
        STR8: "此装备的效果比现有的装备效果更好，是否分解？",
        STR9: "此装备的效果比现有的装备效果更差，是否替换？",
        STR10: "战力"
    }
    static LYBREAKSTAGE = {
        STR1: "{0}\n级",
        STR2: "+{0}",
        STR3: "达成下列所有条件且经验足够时方可晋升！",
        STR4: "[size=42]武[/size]境突破",
        STR5: "等级上限",
        STR6: "突破",
        STR7: "请先领取任务奖励",
        STR8: "条件不足",
        STR9: "进行中",
        STR10: "待领取",
        STR11: "已完成",
        STR12: "任务未完成",
    }
    static LYAUTOMATION = {
        STR1: "[size=42]自[/size]动模式",
        STR2: "和",
        STR3: "或",
        STR4: "体力",
        STR5: "条件不足的装备将自动[color=#ff0000]分解[/color]",
        STR6: "装备品质",
        STR7: "装备战力提升时停止",
        STR8: "属性",
        STR9: "江湖令满时停止",
        STR10: "钓鱼加速",
        STR11: "基础钓鱼消耗",
        STR12: "开始",
        STR13: "【{0}】或以上",
        STR14: "同时",
        STR15: "鱼塘{0}级解锁",
        STR16: "江湖令已满",
        STR17: "任意",
        STR18: "（购买月卡后解锁）",
        STR19: "{0}级解锁",
    }
    static LYTHUNDER = {
        STR1:"战力：{0}/{1}",
        STR2:"战斗力未达到要求"
    }
    static LYVEIN = {
        STR1: "修行",
        STR2: "修行境界 第{0}层",
        STR3: "{0}级",
        STR4: "当前悟性{0}",
        STR5: "修行说明",
        STR6: "穿戴",
        STR7: "替换",
        STR8: "分解",
        STR9: "替换后自动分解原装备",
        STR10: "净化",
        STR11: "lv.{0}",
        STR12: "悟道",
        STR13: "激发概率",
        STR14: "使用数量:{0}",
        STR15: "当前悟性：",
        STR16: "使用",
        STR17: "开启自动模式后, 满足以下条件将提示",
        STR18: "自动模式",
        STR19: "激发加速",
        STR20: "(购买终身卡后获得)",
        STR21: "【新意念】",
        STR22: "【当前意念】",
        STR23: "达到{0}或购买终身卡后解锁",
        STR24: "当前悟道条件满足，可先悟道提升高净化高品质意念的概率，是否前往悟道？",
        STR25: "继续净化",
        STR26: "前往悟道",
        STR27: "此意念的效果比现在意念更好，是否遗忘？ \n（遗忘会使意念永久消失)",
        STR28: "取消",
        STR29: "继续遗忘",
        STR30: "品质",
        STR31: "开启自动模式后，满足一下条件将提示",
        STR32: "{0} +{1}%",
        STR33: "等级{0}以上意念解锁",
        STR34: "达到{0}后解锁",
    }
    static LYELITEMONSTER = {
        STR1: "门[size=36]客[/size]",
        STR2: "结交门客",
        STR3: "羁绊",
        STR4: "切换队伍",
        STR5: "编辑阵容",
        STR6: "再次吸引{0}次,必定出现{1}门客",
        STR7: "[color= #FF9900](传说)[/color]",
        STR8: "[color= #FF0000](神话)[/color]",
        STR9: "吸引",
        STR10: "强烈吸引",
        STR11: "吸引概率",
        STR13: "门客未解锁",
        STR14: "合成",
        STR15: "升级",
        STR16: "上阵",
        STR17: "下阵",
        STR18: "队伍已满",
        STR19: "激活成功",
        STR20: "升级成功",
        STR21: "上阵成功",
        STR53: "下阵成功",
        STR22: "{0}级",
        STR23: "集齐该组合门客后激活 [color={0}}]({1}/{2})[/color]",
        STR24: "组合内门客均达到等级{0}可升级[color={1}]({2}/{3})[/color]",
        STR25: "升级",
        STR26: "激活",
        STR27: "门客羁绊",
        STR28: "集齐该共鸣门客  [color={0}]({1}/{2})[/color]",
        STR29: "共鸣门客达到{0}级  [color={1}]({2}/{3})[/color]",
        STR30: "加成属性:",
        STR31: "门客 ({0}/{1})",
        STR32: "收集总加成",
        STR33: "{0} {1}级",
        STR34: "未获得",
        STR35: "所有门客加成同时生效",
        STR36: "门客每提升5级，技能等级+1",
        STR37: "{0}级",
        STR38: "门客{0}级: ",
        STR39: "当前",
        STR40: "门客说明",
        STR41: "获得门客时解锁",
        STR42: "门客{0}级解锁",
        STR43: "已达最大上阵数量",
        STR44: "{0}级解锁",
        STR45: "群英阁",
        STR46: "每天最多可招募999次",
        STR47: "再喝{0}杯, 必定出现{1}{2}门客",
        STR48: " (传说) ",
        STR49: " (神话) ",
        STR50: "继续",
        STR51: "吸引概率",
        STR52: "技能效果",
        STR54: "免费结交 {0}/{1}",
        STR55: "今日剩余可招募{0}次数",
        STR56: "群贤毕至",
        STR57: "剩余: {0}",
        STR58: "确认",
        STR59: "剩余时间：{0}天",
        STR61: "联合周卡",
        STR60: "终身特权",
        STR62: "一键领取",
        STR63: "每天{0}个{1}",
    }

    static LYELITEMONSTERPRONAME = [
        "常见","普通","卓越","传说","神话"
    ]

    static LYPET = {
        STR1 : "生命+{0}%",
        STR2 : "攻击+{0}%",
        STR3 : "防御+{0}%",
        STR4 : "侠侣({0}/{1})",
        STR5 : "{0}级·{1}阶·虚灵",
        STR6 : "{0}/{1}",
        STR7 : "再刷新出5次[color=#ff0000]神话侠侣[/color]必出[color=#ff0000]{0}[/color]",
        STR8 : "{0}+{1}%",
        STR9 : "{0}级",
        STR10 : "生命        +{0}%",
        STR11 : "攻击        +{0}%",
        STR12 : "防御        +{0}%",
        STR13 : "+{0}%",
        STR14 : "免费次数({0}/{1})",
        STR15 : "洗练",
        STR16 : "再传功{0}位后解锁",
        STR17 : "至少要保留一个可洗练的技能",
        STR18 : "{0}  [color={1}]{2}级[/color]",
        STR19 : "生命",
        STR20 : "攻击",
        STR21 : "防御",
        STR22 : "结伴",
        STR23 : "羁绊",
        STR24 : "侠侣",
        STR25 : "暂未开放",
        STR26 : "奖励还需消耗{0}同心玉",
        STR27 : "群贤毕至",
        STR28 : "获得高额奖励",
        STR29 : "当前进度",
        
        STR49 : "刷新{0}次后必出神话侠侣",
        STR50 : "刷新20次后必出神话侠侣（开通终身卡激活）",
        STR51 : "参战技能（1级）",
        STR52 : "刷新",
        STR53 : "免费刷新",
        STR54 : "侠侣",
        STR55 : "拥有过以上侠侣可激活缘分效果",
        STR56 : "升级",
        STR57 : "传功",
        STR58 : "洗练",
        STR59 : "重置",
        STR60 : "归隐",
        STR61 : "点击选择查看或与侠侣结伴",
        STR62 : "选择侠侣",
        STR63 : "可选侠侣",
        STR64 : "确定",
        STR65 : "主角加成",
        STR67 : "已满级",

        STR101 : "随机提升{0}次技能",
        STR102 : "只可传功未上阵的同名侠侣",
        STR103 : "传功收益",
        STR104 : "暂无收益，请选择被传功的侠侣",
        STR105 : "传功",
        STR106 : "传功成功会随机提升被动技能等级或获得新技能(最大4个)传功侠侣会返回部分升级材料",
        STR107 : "随机提升{0}次技能",
        STR108 : "暂无更多同名侠侣",
        STR109 : "{0}+{1}%",
        STR110 : "{0}+{1}",

        STR111 : "召唤后解锁",
        STR112 : "侠侣{0}级解锁",
        STR113 : "{0} {1}级",
        STR114 : "参战技能",
        STR115 : "是否消耗[img=30]{0}[/img]*{1}解锁一个侠侣栏位？",
        STR116 : "重置侠侣将返还:\n[img=30]{0}[/img]×{1}(100%)\n并保留传功等级，确认是否重置？",
        STR117 : "[img=30]{0}[/img] [color={1}]{2}/{3}[/color]",
        STR118 : "归隐侠侣将返还:\n[img=30]{0}[/img]×{1}({2}%)",
        STR119 : "此侠侣已传功过同种侠侣，是否确认归隐",
        STR120 : "此侠侣已传功过同种侠侣，是否确认传功",
        STR121 : "保存后新的被动技能会替换原有的被动技能,是否确定？",
        STR122 : "归隐侠侣将返还:\n[img=30]{0}[/img]×{1}({2}%)\n[img=30]{3}[/img]×{4}({5}%)",
        STR123 : "已是最低等级",

        STR124 : "洗炼",
        STR125 : "被动技能",
        STR126 : "洗练将重新随机未锁定的所有技能，并保留等级",
        STR127 : "洗练的结果可以选择取消或保留",
        STR128 : "确定",
        STR129 : "洗炼结果",
        STR130 : "取消",
        STR131 : "保存",
        STR132 : "侠侣被动",
        STR133 : "技能详情",
        STR134 : "参战技能:（{0}级）{1}",
        STR135 : "该侠侣已上锁，需解锁后才能进行操作",
        STR136 : "已到最大传功等级",
        STR137 : "已到最大等级",
        STR138 : "当前出现的侠侣存在高稀有度的侠侣，是否继续刷新？",
        STR139 : "技能效果",
     
    }   
    static LYPETDEVOURPET = {
    
    }
static LYTHEURGY = {
        STR1: "秘籍",
        STR2: "参悟",
        STR3: "图鉴",
        STR4: "出战中",
        STR5: "上阵效果",
        STR6: "满级效果",
        STR7: "{0}阶 (怒气达到10000释放)",
        STR8: "{0}阶 (攻击时触发)",
        STR9: "{0}阶 (通过侠侣触发)",
        STR10: "{0}阶 (战斗中被动生效)",
        STR11: "出战",
        STR12: "突破",
        STR13: "重置",
        STR14: "升级",
        STR15: "当前穿戴",
        STR16: "选中印记",
        STR17: "卸下",
        STR18: "穿戴",
        STR19: "印记",
        STR20: "一键融合",
        STR21: "{0}级解锁",
        STR22: "未激活",
        STR23: "组合内秘籍均达到{0}阶可升级{1}/{2}",
        STR24: "集齐该秘籍组合  [color={0}]({1}/{2})[/color]",
        STR25: "组合内秘籍均达到{0}阶 [color={1}] ({2}/{3})[/color]",
        STR26: "满级属性",
        STR27: "再抽[color=#04A100]{0}[/color]次, 必定出现[color=#FBEB95]化境[/color]秘籍",
        STR28: "{0}级",
        STR29: "详情",
        STR30: "连续{0}次",
        STR31: "参悟一次",
        STR32: "参悟十次",
        STR33: "藏经阁",
        STR34: "秘籍说明",
        STR35: "组合",
        STR36: "参悟概率",
        STR37: "等级上限",
        STR38: "技能",
        STR39: "融合成功",
        STR40: "获得以下道具",
        STR41: "点击任意空白处关闭",
        STR42: "继续",
        STR43: "暂未选中",
        STR45: "满级预览",
        STR44: "当前上阵效果",
        STR46: "{0}阶",
        STR47: "没有可融合印记",
        STR48: "装备成功",
        STR49: "出战成功",
        STR50: "无需重置",
        STR51: "卸下成功",
        STR52: "暂无印记可融合",
        STR53: "免费参悟:{0}/{1}",
        STR54: "奖励还需要消耗{0}{1}",
        STR55: "距离下次奖励还需要衍化{0}次",
    }
    static LYTHEURGYNMAE = [
        "绝学",
        "内功",
        "灵犀",
        "外功",
    ]
    static LYTHEURGYNMAE2 = [
        "绝",
        "内",
        "灵",
        "外",
    ]
    static LYTHEURGYNMAE3 = [
        "绝[size=24]学[/size]",
        "内[size=24]功[/size]",
        "灵[size=24]犀[/size]",
        "外[size=24]功[/size]",
    ]
    static LYCOMPANION = {
        STR1 : "好感等级达到{0}级解锁",
        STR2 : "战斗天赋:{0}+{1}%",
        STR3 : "{0}+{1}%",
        STR4 : "解锁条件:{0} ({1}/{2})",
        STR6 : "十连游历",
        STR7 : "{0}恢复1点体力",
        STR8 : "体力已满",
        STR9 : "{0}:{1}",
        STR10 : "好感度{0}级解锁",
        STR11 : "已拥有：{0}/{1}",
        STR12 : "{0}/{1}",
        STR13 : "[size=42]兽[/size]友",
        STR14 : "游历",
        STR15 : "解锁",
        STR16 : "收集总加成",
        STR17 : "可解锁",
        STR18 : "体力: {0}/{1}",
        STR19 : "下一级好感度：",
        STR20 : "十连赠礼",
        STR21 : "好感度加成",
        STR22 : "已解锁",
        STR23 : "赠礼",
        STR25 : "穿戴",
        STR26 : "已幻化",
        STR27 : "切磋",
        STR28 : "好感度提升{0}点",
        STR29 : "与兽友日渐亲密获得:",
        STR30 : "{0}加成",
        STR31 : "({0}/{1})",
        STR32 : "{0}级",
        STR33 : "+{0}",
        STR34 : "+{0}%",
        STR35 : "{0} {1}级",
        STR36 : "未解锁",
        STR37 : "升级",
        STR38 : "兽友战斗天赋+{0}%",
        STR39 : "（{0}+{1}%）",
        STR40 : "角色{0}级解锁",
        STR41 : "[size=42]游[/size]历",
        STR42 : "兽友加成",
        STR43 : "兽友天赋",
        STR44 : "点击空白处关闭界面",
        STR45 : "累计加成",
        STR46 : "可能获得的奖励",
        STR47 : "可能偶遇的兽友",
        STR48 : "无",
        STR49 : "道具不足",
        STR50 : "{0}级解锁十连游历",
        STR51 : "结识",
        STR52 : "{0}+{1}",
        STR53 : "功能尚未开放",
        STR54 : "兽友",
        STR55 : "兽友游历",
        STR56 : "剩余体力：{0}"
    }
    static LYCHARACTER = {
        STR1 : "{0},{1}",
        STR2 : "永久有效",
        STR3 : "有效期{0}天",
        STR4 : "解锁有永久加成：强化{0} +{1}%", // 注意，琅琊榜有些用到这里的。
        STR5 : "提升境界到{0}",
        STR6 : "无属性加成",
        STR7 : "{0}+{1}",
        STR8 : "已经拥有{0}/{1}",
        STR9 : "活动",
        STR10 : "[size=42]百[/size]相阁",
        STR11 : "境界",
        STR12 : "幻化",
        STR13 : "升级",
        STR14 : "头像",
        STR15 : "头像框",
        STR16 : "气泡",
        STR17 : "解锁",
        STR18 : "特殊",
        STR19 : "勋章",
        STR20 : "使用",
        STR21 : "使用中",
        STR22 : "门客头像",
        STR23 : "侠侣头像",
        STR24 : "脱胎换骨",
        STR25 : "激活解锁",
        STR26 : "易容",
        STR27 : "脱胎换骨",
        STR28 : "幻化成功",
        STR29 : "解锁有永久加成：强化{0} +{1}%(下级：[color=#2b841c]{2}[/color])", // 由于琅琊榜用了，我得新加一个
        STR30 : "已满级",
        STR31 : "+{0}%",
        STR32 : "形象",
        STR33 : "头像",
        STR34 : "称号",
        STR35 : "其他",
        STR36 : "佩戴",
        
    }
    static LYQUNYIN = {
        STR1 : "刷新{0}/{1}",
        STR2 : "{0}/{1}",
        STR3 : "达到[color=#4d983c]{0}[/color]名可领取",
        STR4 : "（当前排名：{0}）",
        STR5 : "战力：{0}",
        STR6 : "商店",
        STR7 : "排行",
        STR8 : "奖励",
        STR9 : "[size=42]日[/size]志",
        STR10 : "{0}级",
        STR11 : "排名：{0}",
        STR12 : "每日限购：{0}",
        STR13 : "速战",
        STR14 : "速战{0}次",
        STR15 : "挑战",
        STR16 : "商店",
        STR17 : "排行",
        STR18 : "奖励",
        STR19 : "日志",
        STR20 : "宝箱",
        STR21 : "刷新",
        STR22 : "保留最近七天，最多保留20条日志",
        STR23 : "首次达到指定名次可领取对应奖励",
        STR24 : "[size=42]排[/size]行奖励",
        STR25 : "[size=42]每[/size]周奖励预览",
        STR26 : "[size=42]每[/size]日奖励预览",
        STR27 : "[size=42]兑[/size]换商店",
        STR28 : "挑战方",
        STR29 : "碾压",
        STR30 : "无服务器",
        STR31 : "今日已达购买上限",
        STR32 : "排名不足",
        STR33 : "已满",
        STR34 : "（当前排名：无）",
        STR35 : "已完成",
        STR36 : "未完成",
        STR37 : "此少侠的武功乃不传之秘",
        STR38 : "今日刷新次数已达上限",
        STR39 : "免费",
        STR40 : "每周奖励",
        STR41 : "每日奖励",
    }
	static LYHAVEN = {
        STR1 : "资源详情",
        STR2 : "采集时间",
        STR3 : "采集",
        STR4 : "镖师数量：{0}/{1}",
        STR5 : "当前无人采集",
        STR6 : "镖[size=36]局[/size]",
        STR7 : "管理",
        STR8 : "闲 【{0}】",
        STR9 : "【{0}】 总 ",
        STR10 : "雇佣",
        STR11 : "训练",
        STR12 : "召回",
        STR13 : "刷新",
        STR14 : "附近镖局",
        STR15 : "同行镖局",
        STR16 : "记录",
        STR17 : "前往",
        STR18 : "暂无对手",
        STR19 : "正在采集 {0}",
        STR20 : "成功采集了{0}{1}级",
        STR21 : "记录",
        STR22 : "目前无竞争对手",
        STR23 : "拜神像",
        STR24 : "每次成功采集他人镖局都能增加{0}%拜神进度",
        STR25 : "{0}级",
        STR26 : "试用",
        STR27 : "{0}元",
        STR28 : "自动",
        STR29 : "中止",
        STR30 : "免费刷新：{0}/{1}",
        STR31 : "{0}的镖局",
        STR32 : "成功雇佣镖师",
        STR33 : "训练镖师成功",
        STR34 : "(镖师体力越多,    收集资源效率越高)",
        STR35 : "镖局专属资源无法被采集",
        STR36 : "当前无人采集",
        STR37 : "龙门镖局",
        STR38 : "刷新后会补满镖局资源",
        STR39 : "刷新",
        STR40 : "本次登录不再显示",
        STR41 : "超级刷新",
        STR42 : "观看视频后，必定刷新一个只能被自己采集的5级道具，要观看视频刷新吗？",
        STR43 : "观看视频",
        STR44 : "取消",
        STR45 : "本次登录不再提示",
        STR46 : "续费",
        STR47 : "镖局掌柜",
        STR48 : "剩余雇佣时长：",
        STR49 : "雇佣7天",
        STR50 : "雇佣1个月",
        STR51 : "未勾选将要自动采集资源",
        STR52 : "当前无可刷新资源",
        STR53 : "是否要召回镖师",
        STR54 : "激活成功",
        STR55 : "该资源正被其他玩家收集",
        STR56 : "召回会导致专属资源消失，是否确定召回",
        STR57 : "雇佣中: {0}",
        STR58 : "已领取",
        STR59 : "已激活",
        STR60 : "我",
        STR61 : "道具数量：{0}"
    }

    static LYACTIVITYSEVENDAYS ={
        STR1 : "签到",
        STR2 : "已签到",
        STR3 : "第{0}天",
        STR4 : "签到七天可获随机传说门客",
    }

    static LYSETTING ={
        STR1 : "[size=42]设[/size]置",
        STR2 : "编号：{0}",
        STR5 : "音乐",
        STR6 : "音效",
        STR7 : "高清",
        STR8 : "公告",
        STR9 : "兑换码",    
        STR10 : "提醒设置",
        STR11 : "客服",
        STR12 : "江湖",
        STR13 : "用户协议",
        STR14 : "隐私政策",
        STR15 : "黑名单",
        STR16 : "更换服务器",
        STR17 : "同步平台头像",
        STR18 : "IP属地：{0}",
        STR19 : "版本号：{0}",
        STR20 : "改名",
        STR21 : "兑换",
        STR22 : "点击输入兑换码",
        STR23 : "点击输入新昵称",
        STR24 : "切换账号",
        STR25 : "区服：{0}",
        STR26 : "帮派：{0}",
        STR28 : "详细属性",
        STR29 : "请为大家赐福",
        STR30 : "输入一句话",
        STR31 : "发送",
        STR32 : "复制成功",
        STR33 : "今日已改名{0}/{1}次",
        STR34 : "{0}/{1}",
        STR35 : "黑名单",
        STR36 : "全部频道将屏蔽黑名单中玩家的聊天信息",
        STR37 : "黑名单上限：{0}/{1}",
        STR38 : "一键移除",
        STR39 : "移除",
        STR40 : "备案号：{0}",
        STR41 : "IP属地：{0}",
        STR42 : "未在琅琊榜中取得封号",
        STR43 : "是否移除所有黑名单内玩家",
        STR44 : "无",
        STR45 : "今日已发送过赐福",
        STR46 : "琅琊赐福",
        STR47 : "用户协议网址已复制，粘贴到网页中可查看具体内容。",
        STR48 : "隐私政策网址已复制，粘贴到网页中可查看具体内容。",
        STR49 : "绑定 HDHive",
        STR50 : "已绑定 HDHive",
        STR51 : "未绑定 HDHive（点击绑定）",
        STR52 : "请粘贴授权回调中的 code",
        STR53 : "确认绑定",
        STR54 : "已打开授权页，完成后将地址栏中的 code 粘贴到输入框。",
        STR55 : "绑定成功",
        STR56 : "绑定失败：{0}",
        STR57 : "请先绑定 HDHive 账号后再购买",
        STR58 : "去绑定",
    }

    static LYPAYALLENTRY ={
        STR1 : "已累计充值: {0}",
        STR2 : "进行中: {0}",
        STR3 : "累积充值达到{0}元",
        STR4 : "前往",
        STR5 : "领取",
        STR6 : "累计充值{0}天",
        STR7 : "已领取",
        STR8 : "{0} 后重置",
        STR9 : "豪礼",
        STR10 : "累充",
        STR11 : "累天",

        STR101 : "返回",
        STR102 : [
            "礼包",
            "累充",
            "特权",
            "基金",
            "充值"
        ],
        STR104 : "已售罄",
        STR105: "距离刷新时间：[color=#55F351]{0}[/color]",
        STR106: "首充双倍",
        STR107: "首充加赠",
        STR108: "赠[img=22]{0}[/img]{1}",
        STR109: "再消耗{0}代金券可得",
        STR110: "已达成获得{0}代金券",
        STR111: "已累计获得[color=#55F351]{0}[/color]代金券",
        STR112: "前往",
        STR113: "领取",
        STR114: "再消耗[color=#307C16]{0}[/color]代金券可得",
        STR115 : "限",
        STR116 : "{0}次",
    }

    static LYACTIVITYRISINGSTAR ={
        STR1 : "{0}~{1}",
        STR2 : "{0}以外",
        STR3 : "{0}",
        STR4 : "未上榜",
        STR5 : "第{0}章{1}关",
        STR6 : "{0}月{1}日-{2}月{3}日",
        STR7 : "{0}后结束",
        STR8 : "[size=42]开[/size]服冲榜",
        STR9 : "[size=42]冲[/size]榜奖励",
        STR10 : "奖励将在结束后已邮件发放"
    }

    static LYFAIRYGIFT = {
        STR1 : "3000%超值奖励回报",
        STR2 : "解锁可获取价值           玉璧奖励",
        STR3 : "后任务重置",
        STR4 : "基础福利",
        STR5 : "超值福利",
        STR6 : "风云录",
        STR7 : "任务",
        STR8 : "礼包",
        STR9 : "已完成{0}/{1}",
        STR10 : "{0}/{1}",
        STR11 : "前往",
        STR12 : "领取",
        STR13 : "已领取",
        STR14 : "后风云录结束",
        STR15 : "后礼包重置",
        STR16 : "还需要购买{0}次礼包可以领取福利奖励",
        STR17 : "已购买",
        STR18 : "售无",
        STR19 : "当前积分: {0}",
    }

    static LYTREEREBATE = {
        STR1 : "已存储：{0}元",
        STR2 : "消耗代金券可累积消耗等值{0}%代金券\n并可与次日领取",
        STR3 : "【使用代金券可购买任意道具，并计入累充等各种活动】",
        STR4 : "礼包",
        STR5: "终身限购：{0}",
    }

    static LYCLAN = {
        STR1 : "人数：{0}/{1}",
        STR2 : " {0}级",
        STR3 : "帮派编号：{0}",
        STR4 : "帮主微信：{0}",
        STR5 : "{0}/{1}",
        STR6 : "副盟主{0}/{1}",
        STR7 : "精英{0}/{1}",
        STR8 : "基础属性+{0}%",
        STR9 : "{0}/{1}",
        STR10 : "挑战次数：{0}",
        STR11 : "今日活跃度：{0}",
        STR12 : "当前{0}/{1}人累计砍价 {2}",
        STR13 : "{0}级鱼塘升级中，快来帮忙！",
        STR14 : "{0}/{1}",
        STR15 : "每造成血量最大值{0}%的伤害\n为帮派赢得挑战宝箱x1",
        STR16 : "帮派头衔达到{0}解锁",
        STR17 : "帮派等级达到{0}级解锁",
        STR18 : "排名：{0}",
        STR19 : "[size=42]加[/size]入帮派",
        STR20 : "每造成血量最大值{0}%的伤害，为帮派赢得挑战宝箱x1",
        STR21 : "{0} ({1}级)",
        STR22 : "{0}层挑战",
        STR23 : "成功加入帮派{0}",
        STR24 : "{0}/{1}次",
        STR25 : "伤害：{0}",
        STR26 : "是否确认将帮主转让给【{0}】",
        STR27 : "是否将{0}逐出帮派？",
        STR28 : " 是否消耗{0}[img]{1}[/img]购买礼包？",
        STR29 : "累计对{0}造成[color=#f23d25]{1}[/color]点伤害[color=#f23d25]({2}%)[/color]",
        STR30 : "累计对{0}造成[color=#f23d25]{1}[/color]点伤害[color=#f23d25]({2}%)[/color]\n为所有帮派成员赢得禁地挑战宝箱[color=#5ed218]X{3}[/color]",
        STR31 : "造成伤害:{0}",

        STR50 : "逐出帮派",
        STR51 : "盟主转让",
        STR52 : "成员",
        STR53 : "帮派信息",
        STR54 : "帮派动态",
        STR55 : "退出帮派",
        STR56 : "解散帮派",
        STR57 : "最多保留200条",
        STR58 : "帮派动态",
        STR59 : "暂无修改权限",
        STR60 : "仅帮主可以更换帮派旗帜",
        STR61 : "布阵",
        STR62 : "已布阵",
        STR63 : "未布阵",
        STR64 : "我要砍价",
        STR65 : "我要购买",
        STR66 : "已购买",
        STR67 : "加入帮派第二天可参与活动",
        STR68 : "创建帮派",
        STR69 : "更换旗帜",
        STR70 : "更改微信",
        STR71 : "更改名称",
        STR72 : "确认",
        STR73 : "禁地挑战",
        STR74 : "每日零点刷新",
        STR75 : "累计奖励",
        STR76 : "挑战奖励",
        STR77 : "个人排行",
        STR78 : "击败奖励",
        STR79 : "八卦阵",
        STR80 : "查找帮派",
        STR81 : "随机加入",
        STR82 : "创建帮派",
        STR83 : "搜索",
        STR84 : "已申请",
        STR85 : "申请",
        STR87 : "帮派名字",
        STR88 : "帮派宣言",
        STR89 : "帮派公告",
        STR90 : "允许随机加入",
        STR91 : "更换",
        STR92 : "帮派名字不能为空",
        STR93 : "帮派成员",
        STR94 : "今日/历史贡献",
        STR95 : "上次登录",
        STR96 : "[size=42]帮[/size]派大殿",
        STR97 : "变更",
        STR98 : "帮派名称",
        STR99 : "帮派编号",
        STR100 : "帮派微信",
        STR101 : "帮派人数",
        STR102 : "帮派宣言",
        STR103 : "帮派公告",
        STR104 : "砍价",
        STR105 : "当前价格：",
        STR106 : "砍价",
        STR107 : "上次登录时间",
        STR108 : "未砍价成员",
        STR109 : "[size=42]任[/size]务",
        STR110 : "今日活跃",
        STR111 : "申请列表",
        STR112 : "[size=42]帮[/size]派排名",
        STR113 : "[size=42]帮[/size]派信息",
        STR114 : "[size=42]商[/size]店",
        STR115 : "帮派争霸",
        STR116 : "禁地挑战",
        STR117 : "帮派大殿",
        STR118 : "帮派事务",
        STR119 : "武道争锋",
        STR120 : "帮派商店",
        STR121 : "战斗日志",
        STR122 : "累计奖励",
        STR123 : "奖励预览",
        STR124 : "全部领取",
        STR125 : "每造成一定百分比伤害，为所有帮派成员带回禁地挑战宝箱x1",
        STR126 : "挑战奖励",
        STR127 : "[size=42]帮[/size]派助力",
        STR128 : "退出",
        STR129 : "变更",
        STR130 : "成功创建帮派",
        STR131 : "在线",
        STR132 : "搜索结果为空",
        STR133 : "帮派头衔",
        STR134 : "携手并进，共创辉煌！",
        STR135 : "欢迎诸位加入，一同打造最强帮派！",
        STR136 : "[size=42]协[/size]助",
        STR137 : "输入帮派名或帮派编号",
        STR138 : "暂未填写",
        STR139 : "挑战层级",
        STR140 : "悬赏奖励",
        STR141 : "前往",
        STR142 : "暂无禁地挑战日志",
        STR143 : "成功击破禁地首领，获得挑战奖励",
        STR145 : "领取",
        STR146 : "布阵成功",
        STR147 : "\n是否退出帮派？\n[size=22]退出帮派扣除20%的个人贡献与战功。[/size]",
        STR148 : "是否退出帮派？退出帮派后,帮主之位将按规则传给职位最高者或贡献最高者\n[size=22]退出帮派扣除20%的个人贡献与战功。[/size]",
        STR149 : "[color=#A7B6B3]请输入帮派名称（最多六字）[/color]",  
        STR150 : "任务",  
        STR151 : "协助",  
 
    }
    static LYCLANSOLO = {
        STR1: "帮派奖励",
        STR2: "礼包",
        STR3: "战报",
        STR4: "帮派排名",
        STR5: "声望商店",
        STR6: "任务",
        STR7: "我的排名:",
        STR8: "我的积分:",
        STR9: "帮派",
        STR10: "个人",
        STR11: "个人奖励",
        STR12: "第{0}名",
        STR13: "{0}~{1}名",
        STR14: "每日限购：{0}",
        STR15: "{0}级",
        STR16: "势如破竹",
        STR17: "所向披靡",
        STR18: "基础福利",
        STR19: "击败人数",
        STR20: "下级所需",
        STR21: "帮派排名",
        STR22: "累计出战{0}次",
        STR23: "帮派总出战{0}次",
        STR24: "帮派排名:",
        STR25: "帮派积分:",
        STR26: "活动报名中:",
        STR27: "帮派人数≥{0}可参加活动{1}",
        STR28: "准备结束后将自动锁定帮派名单",
        STR29: "参与区服:{0}...",
        STR30: "参与帮派名单将在报名结束时锁定",
        STR31: "参与区服:",
        STR32: "未上榜",
        STR33: "体力:",
        STR34: "购买立即获得{0}",
        STR35: "{0}元",
        STR36: "购买立即获得",
        STR37: "这些道具能帮你战斗更有利",
        STR38: "购买状态",
        STR39: "属性加成仅在本场战斗生效，最多购买一种道具",
        STR40: "免费",
        STR41: "基础属性 +{0}%",
        STR42: "购买",
        STR43: "活动结算通过邮件自动发放奖励",
        STR44: "本轮单刀赴会获得声望:{0}",
        STR45: "领取",
        STR46: "前往",
        STR47: "积分",
        STR48: "{0}/{1}",
        STR49: "(积分加成:{0}%)",
        STR50: "剩余",
        STR51: "{0}连胜",
        STR52: "声望:",
        STR53: "我方积分:",
        STR54: "敌方积分:",
        STR55: "确认",
        STR56: "战胜{0}名对手后解锁",
        STR57: "获得积分:{0}",
        STR58: "本轮声望达到{0}解锁",
        STR59: "看广告",
        STR60: "下级需要:({0}/{1})",
        STR61: "积分:{0}",
        STR62: "等级",
        STR63: "豪杰榜",
        STR64: "反击",
        STR65: "挑战",
        STR66: "击败了[color=#D82A21]{0}[/color]个成员,全帮派成员积分[color=#D82A21]{1}[/color]",
        STR67: "当前属性",
        STR68: "属性规则",
        STR69: "基础属性",
        STR70: "特殊抗性",
        STR71: "属性仅在单刀赴会活动内生效",
        STR72: "*当前属性=基础属性*(1+开局道具加成)*精力值/500",
        STR73: "*每5点精力值=1%基础属性",
        STR74: "基础属性加成+{0}%",
        STR75: "点击任意空白处关闭",
        STR76: "匹配帮派【[color=#D82A21]{0}[/color]】,击败[color=#D82A21]{1}[/color]名成员",
        STR77: "活动时间：{0}",
        STR78: "[积分]{0}[color=#27FF88](+{1})[/color]",
        STR79: "[积分]{0}",
        STR80: "每减少5点精力所有属性衰减1%",
        STR81: "帮派排名",
        STR82: "已满级",
        STR83: "一键挑战，将会进行下列操作",
        STR84: "1.挑战剩余对手，优先选择战力仅次于自己者。",
        STR85: "2.挑战过程依旧会减少精力。",
        STR86: "3.我方战败或击败所有对手才会结束。",
        STR87: "开始挑战",
        STR88: "(符合条件)",
        STR89: "(不符合条件)",
        STR90: "9点时自动锁定帮派名单",
        STR91: "帮派名单已锁定,无法更改所属帮派",
        STR92: "暂未加入帮派",
        STR93: "加入帮派",
        STR94: "暂无帮派",
        STR95: "{0}后获得1体力",
        STR96: "{0}后购买入口关闭",
        STR97: "当前所属帮派：{0}",
        STR98: "当前所属帮派：无",
        STR99: "免 费",
        STR100: "个人排名",
        STR101: "本次活动未取得资格",
        STR102: "开启中{0}",
        STR103: "是否消耗{0}[img]{1}[/img]购买？",
        STR104: "是否消耗1[img]{0}[/img]挑战帮派“{1}”？",
        STR105: "锁定时未获得活动参加资格",
        STR106: "开启倒计时",
        STR107: "已获得活动资格",
        STR108: "未获得活动资格",
        STR109: "开启中:{0}",
        STR110: "暂无数据",
      
    }
    static LYELITEATTACK = {
        STR1: "排行",
        STR2: "任务",
        STR3: "礼包",
        STR4: "累充",
        STR5: "历练",
        STR6: "奖励",
        STR7: "排名",
        STR8: "玩家",
        STR9: "积分",
        STR10: "[size=42]门[/size]客讨伐",
        STR11: "我的排名：",
        STR12: "积分通过招募门客和派遣历练获得",
        STR13: "未上榜",
        STR14: "讨伐",
        STR15: "刷新",
        STR16: "拥有门客",
        STR17: "当前讨伐镇压阵容可随机获得[color=#4F9A1C]{0}[/color]积分",
        STR18: "预计获得",
        STR19: "结交门客",
        STR20: "每日0点自动恢复门客状态",
        STR21: "获得[color=#4F9A1C]{0}[/color]历练积分",
        STR22: "当前排名",
        STR23: "任务每日0点重置",
        STR24: "前往",
        STR25: "领取",
        STR26: "每日限购：{0}",
        STR27: "免费领取",
        STR28: "钻石购买",
        STR29: "{0} 元",
        STR30: "{0}后获得一个",
        STR31: "当前积分: {0}",
        STR32: "{0} {1}/{2}",
        STR33: "上阵冷却中",
        STR34: "上榜前{0}需代金券消费>={1}",
        STR35: "累积消费：{0}",
    }

    static LYBUDDYMASS = {
        STR1: "[size=42]伙[/size]伴集结",
        STR2: "积分通过侠侣派遣获得",
        STR3: "派遣",
        STR4: "富运",
        STR5: "探索任务",
        STR6: "活跃任务",
        STR7: "连续10次",
        STR8: "跳过动画",
        STR9: "抽一次",
        STR10: "抽十次",
        STR11: "奖励列表",
        STR12: "再抽[color=#04A100]{0}[/color]次, 必定出现[color=#FBEB95]稀有物品[/color]",
        STR13: "刷新祝福",
        STR14: "领取",
        STR15: "选择队长",
        STR16: "伙伴选择",
        STR17: "+{0}/分钟",
        STR18: "剩余{0}",
        STR19: "快速挂机",
        STR20: "是否消耗{0}聚澜晶，立即获取1小时派遣积分（+{1}）",
        STR21: "确定",
        STR22: "本次登入不再提示",
        STR34: "队长增益：同队伍全体侠侣获得挂机速率加成",
        STR35: "同队伍全体侠侣获得[color=#16191A]{0}%[/color]挂机速率加成",
        STR36: "聚澜晶不足",
    }

    static LYPSYCHICINSIGHT = {
        STR1: "[size=42]秘[/size]籍顿悟",
        STR2: "任务",
        STR3: "神脉",
        STR4: "礼包",
        STR5: "活动时间",
        STR6: "累计参悟:{0}次",
        STR7: "前往藏经阁",
    }

    static LYPLAYERINFO = {
        STR1: "{0}%",
        STR2: "{0} {1}阶{2}级",
        STR3: "成员{0}/{1}",
        STR4: "{0}级",
        STR5: "Lv.{0} {1}阶 {2}",
        STR6: "+{0}%",
        STR7: "修行境界：第{0}层",
        STR8: "是否确定举报{0}并将其加入黑名单？\n（可以在设置中移除黑名单）",
        STR9: "属地：{0}",
        STR10: "[size=42]我[/size]要变强",
        STR11: "装备:{0}",
        STR12: "优势:{0}",
        STR13: "切换门客",
        STR14: "作者:{0}",
        STR15: "服务器:{0}",
        STR16: "最热门",
        STR17: "最新",
        STR18: "投稿",
        STR19: "上一页",
        STR20: "下一页",
        STR21: "已经赞过了",
        STR22: "功能维护中",
        STR23: "无更多推荐",
        STR24: "详情",

        STR100: "座驾详情",
        STR101: "属性加成",
        STR102: "门客详情",
        STR103: "属性加成",
        STR104: "所有门客加成同时生效",
        STR105: "修行详情",
        STR106: "侠侣详情",
        STR107: "总属性",
        STR108: "更多属性",
        STR109: "无服务器",
        STR110: "已拉黑",
        STR111: "[size=42]玩[/size]家详情",
        
    }

    static LYSPRING = {
        STR1: "洗髓榜",
        STR2: "开辟灵泉",
        STR3: "灵泉洗髓",
        STR4: "免费获得{0}/{1}",
        STR5: "开辟",
        STR6: "确定",
        STR7: "保存",
        STR8: "位置{0}",
        STR9: "每日每次开启灵泉可以发送红包和其他人分享一下吧",
        STR10: "分享到帮派聊天",
        STR11: "分享到世界聊天",
        STR12: "前往灵泉",
        STR13: "精粹炼化",
        STR14: "开辟灵泉",
        STR15: "{0}/分钟",
        STR16: "持续产出受灵泉主任的境界，称号加成",
        STR17: "申请列表",
        ALLPEOPLE: "所有人",
        INCLAN: "仅帮派",
        STR18: "{0}取代了你的位置",
        STR19: "对方未在灵泉中",
        STR20: "对方正在清泉淬炼中",
        STR21: "战报",
        STR22: "前往",
    }

    static LyBRUMEISLE = {
        STR0: "雾影岛",
        STR1: "血量：{0}/{1}",
        STR2: "您对{0}造成了{1}的伤害，成功击败对方，获得以下奖励",
        STR3: "您对{0}造成了{1}的伤害，获得以下奖励",
        STR4: "你冒着危险收纳了游魂",
        STR5: "你从中找到了很多可以利用的物品",
        STR6: "抉择",
        STR7: "慎行",
        STR8: "深入",
        STR9: "稳健行事,徐徐图之",
        STR10: "破釜沉舟,一往无前",
        STR11: "放弃本次离开机会，立即获得一次奖励。[color=#DF4039]10[/color]次探索后会再次出现抉择机会",
        STR12: "争锋",
        STR13: "离开",
        STR14: "火中取栗,胜者为王",
        STR15: "落袋为安,以图后效",
        STR16: "立刻前往下一层，面临更高的挑战与远高于当前层次的奖励",
        STR17: "会获得[color=#DF4039]{0}[/color]倍的临时积分,每多探索[color=#DF4039]10[/color]次临时积分增加[color=#DF4039]0.1[/color]倍",
        STR18: "本次消耗体力：{0}",
        STR19: "获得积分：{0}",
        STR20: "个人排行：{0}",
        STR21: "战报",
        STR22: "前往",
        STR23: "恭喜你进入雾隐核心",
        STR24: "持有数量：{0}",
        STR25: "[color=#DFD689]{0}[/color]通过【{1}】对你造成[color=#E63C16]{2}[/color]的伤害，你被掠夺了[color=#E63C16]{3}个{4}[/color]",
        STR26: "即将返回 [color=#DFD689]{0}[/color]",
        STR27: "协助次数: {0}",
        STR28: "替换",
        STR29: "{0}后过期",
        STR30: "已拥有：{0}",
        STR31: "镇压",
        STR32: "等待你的抉择!",
        STR33: "一番探索后，你选择安营扎寨，是深入探索还是见好就收?",
        STR34: "领取",
        STR35: "玩家个人积分达到{0}后可跳过动画",
        STR36: "使用成功",
        STR37: "先攻击一次才可以标记",
        STR38: "未上榜",
        STR39: "恢复: {0}",
        STR40: "进行中: {0}",
        STR41: "当前时间段不可进入",
        STR42: "领取",
        STR43: "已领取",
        STR44: "安全时间: {0}",
        STR45: "玉璧: {0}",
        STR46: "活动时间： {0}",
        STR47: "无帮派",
        STR48: "无限",
        STR50: "临时积分：{0}",
        STR49: "已暴露",
        STR51: "攻击玩家将导致您本次探索无法获得安全期，是否继续？",
        STR52: "剩余体力: {0}",
        STR53: "在雾隐核心探索[color=#74D644]{0}[/color]次",
        STR54: "截止时间:{0}",
        STR55: "明天从{0}出发",
    }

    static LYGRABCITY = {
        STR1: "攻城掠地",
        STR2: "帮派排名前{0}名可获得参与资格",
        STR3: "我的帮派排名：{0}",
        STR4: "暂未加入帮派",
        STR5: "前往查看",
        STR6: "查看详情",
        STR7: "本次活动未获得资格",
        STR8: "分组排名: {0}",
        STR9: "无法攻击处于保护的帮派",
        STR10: "无法攻击自己的帮派",
        STR11: "分无法攻击其他小组内的帮派",
        STR12: "无法攻击已被摧毁的城池",
        STR13: "本轮将晋级排名{0}以上帮派",
		STR14: "体力：{0}/1",
        STR15: "{0}后恢复1体力",
        STR16: "该城池已被摧毁",
        STR17: "成功击败城池防守玩家有几率获得:",
        STR18: "您本次造成了[color=#27FF88]{0}[/color]伤害",
        STR19: "攻城利器",
        STR20: "备战中：{0}",
        STR21: "开启中：{0}",
        STR22: "帮主： {0}",
        STR23: "服务器： {0}",
        STR24: "城池经验+{0}",
        STR25: "等级经验+{0}",
        STR26: "{0}级",
        STR27: "城池等级：{0}",
        STR28: "城池生命+{0}%",
        STR29: "帮派成功晋级至【{0}】",
        STR30: "帮派在本轮晋级赛中，小组排名第[color=#27FF88]{0}[/color]名，积分[color=#27FF88]+{1}[/color]，总排名第[color=#27FF88]{2}[/color]名",
        STR31: "帮派晋级失败，保持【{0}】",
        STR32: "伤害",
        STR33: "积分",
        STR34: "战力",
        STR35: "帮主",
        STR36: "精英",
        STR37: "成员",
        STR38: "帮派积分:",
        STR39: "帮主: ",
        STR40: "候选名单",
        STR41: "排行",
        STR42: "贡献",
        STR43: "免费贡献",
        STR44: "共造成{0}伤害并获得奖励。",

        STR401: "获得特殊宝藏可解锁下一重宝塔",
        STR402: "跳过动画",
        STR403: "一键寻宝",
        STR404: "第{0}重",
        STR405: "通关大奖：[color=#DC462D]随机获得以下1项宝塔奖励[/color]",
        STR406: "通关[color=#DC462D]第{0}重[/color]宝塔奖励",
        STR407: "奖励预览",
        STR408: "通关1重后开启",
        STR409: "是否开启自动寻宝功能？开启后将自动寻宝直到{0}不足",

        STR501: "竞猜",
        STR502: "已选区",
        STR503: "候选区",
        STR504: "排名结果",
        STR505: "最后一轮对战期开放竞猜",
        STR506: "保存成功",
        STR507: "保存",
        STR508: "竞猜开放中：\n{0}",
        STR509: "距离竞猜结算：\n{0}",
        STR510: "奖励领取中：\n{0}",
        STR511: "竞猜奖励",
        STR512: "*只可手动领取达成的最高奖励",
        STR513: "已领取",
        STR514: "领取",
        STR515: "已完成",

        STR601: "赛程详情",
        STR602: "活动日程",
        STR603: "积分规则",
        STR604: "第{0}名",
        STR605: "第{0}~{1}名",
        STR606: "日期",
        STR607: "时间",
        STR608: "战场",
        STR609: "小组排名",
    }
}
// 此分割线以下写错误码定义。######################################################################################
// SocketClient
StrVal.ERRCODE[PErrCode.ERROR_CONNECTED] = "当前已建立连接，请勿重复。";
StrVal.ERRCODE[PErrCode.ERROR_CONNECTING] = "当前正在建立连接，请勿重复。";
StrVal.ERRCODE[PErrCode.ERROR_CONNECT] = "建立连接失败，请检查您的网络，稍后再试。";
StrVal.ERRCODE[PErrCode.ERROR_NOCONNECT] = "发送消息失败，当前未建立与服务器的连接。";

StrVal.ERRCODE[PErrCode.ERROR_CONNECT_ERR] = "建立连接产生错误。";
StrVal.ERRCODE[PErrCode.ERROR_CONNECT_CLOSE] = "连接已经取消。";
StrVal.ERRCODE[PErrCode.ERROR_CREATE_FAULT] = "创建TCP失败。";
StrVal.ERRCODE[PErrCode.ERROR_SEND_ERROR] = "发送消息产生错误。";
StrVal.ERRCODE[PErrCode.ERROR_SEND_LEN] = "发送消息不完整。";
// GameServer
StrVal.ERRCODE[PErrCode.ERROR_SEND_TIMEOUT] = "消息响应超时。";
StrVal.ERRCODE[PErrCode.ERROR_REMOTE_CLOSED] = "丢失网络连接，请检查您的网络，稍后再试。";
StrVal.ERRCODE[PErrCode.ERROR_NO_REMOTE] = "查询服务器失败，稍后再试。";
StrVal.ERRCODE[PErrCode.ERROR_SPROTO_NOTFOUND] = "协议错位，请检查。";
// 以下是服务器定义（由自动工具转换，无需手动拷贝）
//SERVER_START
StrVal.ERRCODE[PErrCode.param_error] = "参数错误";
StrVal.ERRCODE[PErrCode.cannot_create_ingame] = "当前不可创建角色";
StrVal.ERRCODE[PErrCode.char_is_exist] = "角色已经存在";
StrVal.ERRCODE[PErrCode.server_is_maintenance] = "服务器禁止登录";
StrVal.ERRCODE[PErrCode.user_platform_err] = "平台错误";
StrVal.ERRCODE[PErrCode.user_sex_error] = "性别错误";
StrVal.ERRCODE[PErrCode.user_serverid_err] = "区服错误";
StrVal.ERRCODE[PErrCode.user_string_errorlen] = "账号长度非法";
StrVal.ERRCODE[PErrCode.name_has_exist] = "名字已经存在";
StrVal.ERRCODE[PErrCode.userid_has_black] = "账号有空格";
StrVal.ERRCODE[PErrCode.name_has_black] = "名字有空格";
StrVal.ERRCODE[PErrCode.userid_len_err] = "账号长度错误";
StrVal.ERRCODE[PErrCode.server_version_error] = "版本号错误";
StrVal.ERRCODE[PErrCode.user_state_error_noentry] = "用户状态错误";
StrVal.ERRCODE[PErrCode.user_login_ing] = "正在登录中";
StrVal.ERRCODE[PErrCode.user_login_nochar] = "还未有角色";
StrVal.ERRCODE[PErrCode.user_data_error] = "用户数据错误";
StrVal.ERRCODE[PErrCode.user_player_forbit] = "用户禁止登录";
StrVal.ERRCODE[PErrCode.user_not_ingame] = "账号不存在";
StrVal.ERRCODE[PErrCode.chat_content_len_err] = "聊天内容长度非法";
StrVal.ERRCODE[PErrCode.chat_too_frequent] = "发送消息过于频繁";
StrVal.ERRCODE[PErrCode.unknown_error] = "未知错误";
StrVal.ERRCODE[PErrCode.item_not_exist] = "道具不足";
StrVal.ERRCODE[PErrCode.item_num_no_enough] = "需要的物品数量不够";
StrVal.ERRCODE[PErrCode.user_exit_ing] = "您正在退出游戏";
StrVal.ERRCODE[PErrCode.player_not_exist] = "玩家不存在";
StrVal.ERRCODE[PErrCode.master_server_close] = "跨服已关闭";
StrVal.ERRCODE[PErrCode.master_server_cmd_error] = "跨服命令错误";
StrVal.ERRCODE[PErrCode.item_split_num_err] = "物品分割数量错误";
StrVal.ERRCODE[PErrCode.item_split_num_no_enough] = "物品分割数量不足";
StrVal.ERRCODE[PErrCode.space_no_enough] = "空间不足";
StrVal.ERRCODE[PErrCode.mail_title_length_error] = "邮件标题长度错误";
StrVal.ERRCODE[PErrCode.mail_content_length_error] = "邮件内容长度错误";
StrVal.ERRCODE[PErrCode.mail_send_max_count_error] = "邮件已到最大发送数量";
StrVal.ERRCODE[PErrCode.mail_not_exist] = "邮件不存在";
StrVal.ERRCODE[PErrCode.data_error] = "数据错误";
StrVal.ERRCODE[PErrCode.user_outgame_ing] = "正在排队退出";
StrVal.ERRCODE[PErrCode.loginserver_stoped] = "登录服务器关闭";
StrVal.ERRCODE[PErrCode.name_cannot_blank] = "名字不能为空";
StrVal.ERRCODE[PErrCode.name_too_long] = "名字太长啦";
StrVal.ERRCODE[PErrCode.name_has_sensitive_word] = "名字含有敏感词";
StrVal.ERRCODE[PErrCode.birthday_time_error] = "生日错误";
StrVal.ERRCODE[PErrCode.ad_count_not_enough] = "广告次数不足";
StrVal.ERRCODE[PErrCode.ad_at_cd] = "广告处于CD";
StrVal.ERRCODE[PErrCode.please_upgrade_version] = "请升级版本";
StrVal.ERRCODE[PErrCode.player_not_rename_num] = "超出每日更名次数限制";
StrVal.ERRCODE[PErrCode.room_create_param_error] = "创建房间参数错误";
StrVal.ERRCODE[PErrCode.room_player_is_in_room] = "角色已经在房间中";
StrVal.ERRCODE[PErrCode.room_has_no_owner] = "没有房主";
StrVal.ERRCODE[PErrCode.room_playerId_error] = "角色ID错误";
StrVal.ERRCODE[PErrCode.room_level_error] = "退出房间错误";
StrVal.ERRCODE[PErrCode.room_state_error] = "房间状态错误";
StrVal.ERRCODE[PErrCode.level_not_enough] = "等级不足";
StrVal.ERRCODE[PErrCode.chat_content_illegality] = "聊天内容非法";
StrVal.ERRCODE[PErrCode.chat_player_not_online] = "聊天对象不在线";
StrVal.ERRCODE[PErrCode.chat_send_to_self] = "聊天对象不能是自己";
StrVal.ERRCODE[PErrCode.chat_coolingTime] = "聊天冷却中";
StrVal.ERRCODE[PErrCode.chat_channel_close] = "聊天频道未开放";
StrVal.ERRCODE[PErrCode.chat_player_not_clan] = "还未加入帮派";
StrVal.ERRCODE[PErrCode.chat_blacklist_not] = "此人已不在黑名单";
StrVal.ERRCODE[PErrCode.chat_blacklist_has] = "已拉黑";
StrVal.ERRCODE[PErrCode.chat_blacklist_limit] = "已达到拉黑上限";
StrVal.ERRCODE[PErrCode.activationCode_not_exist] = "无此激活码";
StrVal.ERRCODE[PErrCode.activationCode_used] = "激活码已使用";
StrVal.ERRCODE[PErrCode.activationCode_not_used] = "玩家已使用过此批次激活码";
StrVal.ERRCODE[PErrCode.activationCode_expired] = "激活码已过期";
StrVal.ERRCODE[PErrCode.activationCode_channel_error] = "非此渠道专属激活码";
StrVal.ERRCODE[PErrCode.activationCode_vip_error] = "vip专属激活码";
StrVal.ERRCODE[PErrCode.cost_string_empty] = "消耗数据为空";
StrVal.ERRCODE[PErrCode.cost_type_error] = "消耗类型错误";
StrVal.ERRCODE[PErrCode.cost_size_error] = "消耗数据数组个数错误";
StrVal.ERRCODE[PErrCode.cost_proto_not_exist] = "消耗数据原型ID不存在";
StrVal.ERRCODE[PErrCode.bonus_drop_must_totalRate_or_aloneRate] = "奖励掉落模式需为累计/独立随机";
StrVal.ERRCODE[PErrCode.bonus_string_error] = "奖励数据错误";
StrVal.ERRCODE[PErrCode.bonus_string_empty] = "奖励数据为空";
StrVal.ERRCODE[PErrCode.bonus_type_error] = "奖励类型错误";
StrVal.ERRCODE[PErrCode.bonus_size_error] = "奖励数据数组个数错误";
StrVal.ERRCODE[PErrCode.bonus_proto_not_exist] = "奖励数据原型ID不存在";
StrVal.ERRCODE[PErrCode.bonus_drop_must_aloneRate] = "奖励掉落模式需为独立随机";
StrVal.ERRCODE[PErrCode.bonus_round_must_once] = "奖励回合数需为1次";
StrVal.ERRCODE[PErrCode.bonus_rate_must_drop] = "奖励概率需必掉";
StrVal.ERRCODE[PErrCode.globalReward_id_error] = "全服补偿奖励ID错误";
StrVal.ERRCODE[PErrCode.globalReward_time_error] = "全服补偿奖励时间错误";
StrVal.ERRCODE[PErrCode.globalReward_title_error] = "全服补偿奖励邮件标题错误";
StrVal.ERRCODE[PErrCode.globalReward_content_error] = "全服补偿奖励邮件内容错误";
StrVal.ERRCODE[PErrCode.globalReward_attaches_error] = "全服补偿奖励邮件附件错误";
StrVal.ERRCODE[PErrCode.globalReward_id_not_exist] = "全服补偿奖励ID不存在";
StrVal.ERRCODE[PErrCode.recycleNotice_time_error] = "循环公告时间错误";
StrVal.ERRCODE[PErrCode.recycleNotice_interval_error] = "循环公告间隔时间错误";
StrVal.ERRCODE[PErrCode.recycleNotice_content_error] = "循环公告内容错误";
StrVal.ERRCODE[PErrCode.recycleNotice_id_error] = "循环公告id错误或已有";
StrVal.ERRCODE[PErrCode.recycleNotice_id_not_exist] = "循环公告id不存在";
StrVal.ERRCODE[PErrCode.mail_receiver_not_self] = "邮件接收者不能是发送者";
StrVal.ERRCODE[PErrCode.take_bonuses_is_nill] = "奖励为空";
StrVal.ERRCODE[PErrCode.take_bonuses_id_type_error] = "奖励ID类型错误";
StrVal.ERRCODE[PErrCode.take_bonuses_droptype_diff] = "奖励ID类型错误,不同的掉落类型";
StrVal.ERRCODE[PErrCode.take_bonuses_str_error] = "奖励ID错误,不是字符串";
StrVal.ERRCODE[PErrCode.item_used_already_max] = "道具使用数量已达上限";
StrVal.ERRCODE[PErrCode.item_chest_choose_error] = "选择宝箱无此选择";
StrVal.ERRCODE[PErrCode.item_not_chest] = "不是宝箱";
StrVal.ERRCODE[PErrCode.rank_bonuses_has_taked] = "排行榜奖励已经领取过";
StrVal.ERRCODE[PErrCode.rank_has_no_reached] = "排行榜奖励还未达成";
StrVal.ERRCODE[PErrCode.rank_has_taked] = "暂无排行榜奖励可领";
StrVal.ERRCODE[PErrCode.bag_space_no_enough] = "背包空间不足";
StrVal.ERRCODE[PErrCode.mail_not_take] = "邮件还未领取附件";
StrVal.ERRCODE[PErrCode.register_reach_max] = "角色注册达到最大";
StrVal.ERRCODE[PErrCode.item_cannot_use] = "物品不可使用";
StrVal.ERRCODE[PErrCode.money_not_enough] = "云英不足";
StrVal.ERRCODE[PErrCode.physical_not_enough] = "体力不足";
StrVal.ERRCODE[PErrCode.stone_not_enough] = "玉璧不足";
StrVal.ERRCODE[PErrCode.buy_physical_count_max] = "已达到最大体力购买次数";
StrVal.ERRCODE[PErrCode.character_not_contain] = "人物未获得";
StrVal.ERRCODE[PErrCode.avatar_not_contain] = "头像未获得";
StrVal.ERRCODE[PErrCode.avatar_border_not_contain] = "头像框未获得";
StrVal.ERRCODE[PErrCode.chatBubble_not_contain] = "聊天气泡未获得";
StrVal.ERRCODE[PErrCode.title_not_contain] = "称号未获得";
StrVal.ERRCODE[PErrCode.bag_item_not_enough] = "物品背包空间不足";
StrVal.ERRCODE[PErrCode.bag_personalization_not_enough] = "人物个性化背包空间不足";
StrVal.ERRCODE[PErrCode.bag_hero_not_enough] = "英雄背包空间不足";
StrVal.ERRCODE[PErrCode.bag_equip_not_enough] = "装备背包不足";
StrVal.ERRCODE[PErrCode.bag_pet_not_enough] = "侠侣背包空间不足";
StrVal.ERRCODE[PErrCode.newguide_not_exist] = "引导不存在";
StrVal.ERRCODE[PErrCode.newguide_is_done] = "引导已经完成";
StrVal.ERRCODE[PErrCode.newguide_order_not_done] = "顺序引导不能完成";
StrVal.ERRCODE[PErrCode.newguide_cannot_take] = "当前引导不能领取奖励";
StrVal.ERRCODE[PErrCode.newguide_is_finished] = "引导已经完成";
StrVal.ERRCODE[PErrCode.newguide_has_no_bonuses] = "当前引导没有奖励";
StrVal.ERRCODE[PErrCode.rebate_has_not_enough_chance] = "暂无更多可领取的代金券";
StrVal.ERRCODE[PErrCode.exchange_not_id] = "兑换ID不存在";
StrVal.ERRCODE[PErrCode.goldfinger_is_max] = "暂无新的金手指";
StrVal.ERRCODE[PErrCode.goldfinger_replace_quality_error] = "不能替换当前品质的";
StrVal.ERRCODE[PErrCode.goldfinger_has_no_ablity] = "暂无对应金手指功能";
StrVal.ERRCODE[PErrCode.goldfinger_max_level] = "金手指已到最大等级";
StrVal.ERRCODE[PErrCode.goldfinger_do_not_gain] = "还没有获得金手指";
StrVal.ERRCODE[PErrCode.goldfinger_pet_replace_max] = "侠侣替换次数已经使用完";
StrVal.ERRCODE[PErrCode.goldfinger_elite_replace_max] = "门客碎片替换次数已经使用完";
StrVal.ERRCODE[PErrCode.goldfinger_equip_max] = "超过金手指兑换装备上限";
StrVal.ERRCODE[PErrCode.goldfinger_replace_theurgy_quality_error] = "不能兑换当前品质的碎片";
StrVal.ERRCODE[PErrCode.goldfinger_replace_theurgy_max] = "超过碎片最大兑换次数";
StrVal.ERRCODE[PErrCode.mail_list_empty] = "邮件列表为空";
StrVal.ERRCODE[PErrCode.mail_candelete_isnull] = "暂无可删除的邮件";
StrVal.ERRCODE[PErrCode.mail_has_not_bonuses] = "暂无可领取奖励的邮件";
StrVal.ERRCODE[PErrCode.mail_already_took] = "邮件奖励已经领取";
StrVal.ERRCODE[PErrCode.mail_system_send_forbidden] = "普通客户端永久禁止发送系统邮件";
StrVal.ERRCODE[PErrCode.mail_expired] = "邮件奖励已过期并清理";
StrVal.ERRCODE[PErrCode.stage_not_exist] = "关卡不存在";
StrVal.ERRCODE[PErrCode.stage_challenge_fail] = "关卡挑战失败";
StrVal.ERRCODE[PErrCode.stage_not_reach_level] = "未达到该关卡";
StrVal.ERRCODE[PErrCode.stage_level_cleared] = "关卡已通关";
StrVal.ERRCODE[PErrCode.pet_max_star] = "超过最大星不能传功";
StrVal.ERRCODE[PErrCode.pet_not_exist] = "侠侣不存在";
StrVal.ERRCODE[PErrCode.pet_not_summon] = "侠侣未上阵";
StrVal.ERRCODE[PErrCode.pet_not_same_protoid] = "不同种类另种不可传功";
StrVal.ERRCODE[PErrCode.pet_is_locked] = "侠侣已锁定";
StrVal.ERRCODE[PErrCode.pet_level_is_max] = "侠侣已到达最高等级";
StrVal.ERRCODE[PErrCode.pet_not_set_pity_pet] = "未设置保底侠侣";
StrVal.ERRCODE[PErrCode.pet_protoid_error] = "非侠侣原型";
StrVal.ERRCODE[PErrCode.pet_not_recruitingPets] = "招募侠侣不在招募列表";
StrVal.ERRCODE[PErrCode.pet_backpackCapacity_is_max] = "侠侣背包已到达最高等级";
StrVal.ERRCODE[PErrCode.pet_not_devour_summon_pet] = "不可以传功上阵侠侣";
StrVal.ERRCODE[PErrCode.pet_already_recruit] = "招募列表次槽位已招募";
StrVal.ERRCODE[PErrCode.pet_ads_not_enough] = "广告次数不足";
StrVal.ERRCODE[PErrCode.pet_clear_skill_not_error] = "洗炼侠侣错误";
StrVal.ERRCODE[PErrCode.pet_clear_skill_not_pet] = "洗炼侠侣不存在";
StrVal.ERRCODE[PErrCode.pet_clear_skill_not_buff] = "洗炼侠侣没有技能可以保存";
StrVal.ERRCODE[PErrCode.pet_clear_skill_not_lock_buff] = "洗炼侠侣锁定技能失败";
StrVal.ERRCODE[PErrCode.pet_clear_skill_not_level] = "洗炼侠侣有达到指定等级不能洗炼";
StrVal.ERRCODE[PErrCode.pet_con_bonuse_not_exist] = "奖励不存在";
StrVal.ERRCODE[PErrCode.explore_take_not_repository] = "没有对应的任务库";
StrVal.ERRCODE[PErrCode.explore_take_not_repository_taskid] = "任务库没有对应的任务";
StrVal.ERRCODE[PErrCode.explore_take_repeat] = "不能重复接派遣任务";
StrVal.ERRCODE[PErrCode.explore_take_done] = "派遣任务已经完成";
StrVal.ERRCODE[PErrCode.explore_take_not_enough_hero] = "派遣英雄数量不足";
StrVal.ERRCODE[PErrCode.explore_take_not_cond] = "派遣条件没有满足";
StrVal.ERRCODE[PErrCode.explore_take_not_hero] = "没有对应的英雄";
StrVal.ERRCODE[PErrCode.explore_take_hero_isExplore] = "英雄已经派遣出去了";
StrVal.ERRCODE[PErrCode.explore_take_not_costTime] = "时间未到不能领取奖励";
StrVal.ERRCODE[PErrCode.explore_take_not_taskdone] = "没有完成不能领奖";
StrVal.ERRCODE[PErrCode.explore_not_level] = "等级不存在";
StrVal.ERRCODE[PErrCode.explore_level_max] = "已经达到最大等级了";
StrVal.ERRCODE[PErrCode.explorecoin_not_enough] = "派遣币不足";
StrVal.ERRCODE[PErrCode.explorebar_not_enough] = "派遣栏不足";
StrVal.ERRCODE[PErrCode.explorebar_repeat_hero] = "重复的英雄";
StrVal.ERRCODE[PErrCode.explore_take_not_bonuse] = "没有奖励可以领取";
StrVal.ERRCODE[PErrCode.shop_not_item] = "商品不存在";
StrVal.ERRCODE[PErrCode.shop_not_unlock] = "商品没有解锁";
StrVal.ERRCODE[PErrCode.shop_buy_max] = "已达到购买次数上限";
StrVal.ERRCODE[PErrCode.shop_buy_daymax] = "已达到每日购买次数上限";
StrVal.ERRCODE[PErrCode.shop_insufficient_remaining_quantity] = "商品剩余数量不足";
StrVal.ERRCODE[PErrCode.chestblock_not_enough] = "宝箱碎片不足";
StrVal.ERRCODE[PErrCode.takecardblock_not_enough] = "抽卡碎片不足";
StrVal.ERRCODE[PErrCode.bag_elite_monster_not_enough] = "背包空间不足";
StrVal.ERRCODE[PErrCode.elite_monster_teamid_num_error] = "队伍编号错误";
StrVal.ERRCODE[PErrCode.elite_monster_absent] = "未拥有门客";
StrVal.ERRCODE[PErrCode.elite_monster_not_repeat_activity] = "不可重复激活";
StrVal.ERRCODE[PErrCode.elite_monster_not_exist] = "门客不存在";
StrVal.ERRCODE[PErrCode.elite_monster_not_activity] = "门客未激活";
StrVal.ERRCODE[PErrCode.elite_monster_has_full_level] = "已满级";
StrVal.ERRCODE[PErrCode.elite_monster_encyclopedia_not_exist] = "图鉴不存在";
StrVal.ERRCODE[PErrCode.elite_monster_condition_not_met] = "激活条件未达到";
StrVal.ERRCODE[PErrCode.elite_monster_encyclopedia_has_full_level] = "图鉴已满级";
StrVal.ERRCODE[PErrCode.elite_position_not_unlock] = "槽位未解锁";
StrVal.ERRCODE[PErrCode.elite_monster_not_repeat_deploy] = "不可重复上阵";
StrVal.ERRCODE[PErrCode.elite_monster_daily_recruit_max] = "已达到每日招募次数上限";
StrVal.ERRCODE[PErrCode.elite_monster_reward_not_exist] = "奖励不存在";
StrVal.ERRCODE[PErrCode.elite_monster_reward_not_select_item] = "奖励缺少自选精怪";
StrVal.ERRCODE[PErrCode.elite_monster_reward_quality_err] = "门客品质错误";
StrVal.ERRCODE[PErrCode.haven_mouse_count_error] = "超出上阵数量";
StrVal.ERRCODE[PErrCode.haven_mouse_not_enough] = "空闲镖师数量不足";
StrVal.ERRCODE[PErrCode.haven_resource_being_collected] = "不能同时收集同一玩家的多个资源";
StrVal.ERRCODE[PErrCode.haven_resource_id_not_enough] = "资源不存在";
StrVal.ERRCODE[PErrCode.haven_resource_being_collected_others] = "不能同时收集同一玩家的多个资源";
StrVal.ERRCODE[PErrCode.haven_mouse_count_same] = "已经有相同数量镖师在采集";
StrVal.ERRCODE[PErrCode.haven_not_refresh_resource] = "没有可刷新资源";
StrVal.ERRCODE[PErrCode.haven_special_resource_cannot_collected] = "特殊资源暂时不可抢夺";
StrVal.ERRCODE[PErrCode.haven_player_not_exist] = "玩家镖局不存在";
StrVal.ERRCODE[PErrCode.haven_not_refresh_time] = "未到刷新时间";
StrVal.ERRCODE[PErrCode.haven_ad_refresh_count_max] = "广告刷新次数到达上限";
StrVal.ERRCODE[PErrCode.haven_treasureData_progress_not_reach] = "神像进度未完成";
StrVal.ERRCODE[PErrCode.haven_treasureData_non_reactivation] = "神像不能重复激活";
StrVal.ERRCODE[PErrCode.haven_treasureData_not_duble_collection] = "神像不能重复领取";
StrVal.ERRCODE[PErrCode.haven_treasureData_not_activation] = "神像未激活";
StrVal.ERRCODE[PErrCode.haven_player_not_enter] = "未进入镖局";
StrVal.ERRCODE[PErrCode.haven_train_level_max] = "训练已经到达最高等级";
StrVal.ERRCODE[PErrCode.haven_server_start_date_unvalid] = "未达到自动采集开启日期";
StrVal.ERRCODE[PErrCode.haven_start_trial_is_used] = "试用采集已使用";
StrVal.ERRCODE[PErrCode.haven_auto_collection_expired] = "自动采集已过期";
StrVal.ERRCODE[PErrCode.haven_over_grade] = "设置自动采集等级超过物品最大等级";
StrVal.ERRCODE[PErrCode.haven_item_not_auto_collection] = "此物品不可以自动采集";
StrVal.ERRCODE[PErrCode.haven_item_is_auto_collection] = "自动采集已经开启了";
StrVal.ERRCODE[PErrCode.haven_resource_being_collected_others_exsit] = "其他玩家正在采集";
StrVal.ERRCODE[PErrCode.funds_not_done] = "基金不存在";
StrVal.ERRCODE[PErrCode.talk_group_not_exist] = "没有对话组";
StrVal.ERRCODE[PErrCode.talk_select_not_exist] = "选项不存在";
StrVal.ERRCODE[PErrCode.talk_select_not_execinfo] = "没有对话信息";
StrVal.ERRCODE[PErrCode.talk_select_max] = "超过选项最大值";
StrVal.ERRCODE[PErrCode.talk_select_pos] = "选项位置错误";
StrVal.ERRCODE[PErrCode.talk_select_is_have] = "还有选项没有选择";
StrVal.ERRCODE[PErrCode.talk_select_group_not_exist] = "选项对话组不存在";
StrVal.ERRCODE[PErrCode.talk_jump_not_group] = "跳转失败，没有对应的组";
StrVal.ERRCODE[PErrCode.talk_jump_not_pos] = "跳转失败，没有对应的位置";
StrVal.ERRCODE[PErrCode.talk_group_finish] = "对话组已经完成了";
StrVal.ERRCODE[PErrCode.gm_hero_stage_level_err] = "设置英雄精英等级错误";
StrVal.ERRCODE[PErrCode.gm_hero_break_level_err] = "设置英雄突破等级错误";
StrVal.ERRCODE[PErrCode.gm_hero_level_err] = "设置英雄等级错误";
StrVal.ERRCODE[PErrCode.gm_hero_skill_level] = "设置英雄技能等级错误";
StrVal.ERRCODE[PErrCode.use_item_not_hero] = "没有选择的英雄";
StrVal.ERRCODE[PErrCode.use_item_not_select_hero] = "找不指定的英雄";
StrVal.ERRCODE[PErrCode.friends_get_serach_page_err] = "获得搜索分页信息失败";
StrVal.ERRCODE[PErrCode.friends_get_serach_page_max] = "已经达到搜索分页最大值";
StrVal.ERRCODE[PErrCode.friends_get_serach_not_pageinfo] = "找不不到对应分页信息";
StrVal.ERRCODE[PErrCode.friends_get_serach_name_isnull] = "搜索名字为空";
StrVal.ERRCODE[PErrCode.friends_apply_fail_exist] = "申请好友失败!已经在对方列表";
StrVal.ERRCODE[PErrCode.friends_apply_friend_max] = "申请好友失败!对方好友上限";
StrVal.ERRCODE[PErrCode.friends_addfriend_not_search] = "增加好友失败!搜索不到玩家";
StrVal.ERRCODE[PErrCode.friends_addfriend_not_searchpage] = "增加好友失败!搜索页没玩家";
StrVal.ERRCODE[PErrCode.friends_addfriend_not_searchplayer] = "增加好友失败!找不到指定玩家";
StrVal.ERRCODE[PErrCode.friends_addfriend_not_self] = "增加好友失败!不能增加自己为好友";
StrVal.ERRCODE[PErrCode.friends_addfriend_exist_apply_err] = "增加好友失败!已经在申请列表里";
StrVal.ERRCODE[PErrCode.friends_addfriend_exist_friend] = "增加好友失败!对方已经是你好友了";
StrVal.ERRCODE[PErrCode.friends_delfriend_not_friend] = "删除好友失败!不是对方好友";
StrVal.ERRCODE[PErrCode.friends_addfriend_is_friend] = "增加好友失败!已是你好友";
StrVal.ERRCODE[PErrCode.friends_msg_not_friend] = "发送消息失败!没好友数据";
StrVal.ERRCODE[PErrCode.friends_msg_not_friend_online] = "发送消息失败!好友不在线";
StrVal.ERRCODE[PErrCode.friends_msg_sensitive_word] = "发送消息失败!含有敏感词";
StrVal.ERRCODE[PErrCode.friends_acceptfriend_not_apply] = "同意申请失败!找不到申请人";
StrVal.ERRCODE[PErrCode.email_id_not_exist] = "邮件ID不存在";
StrVal.ERRCODE[PErrCode.remote_server_closed] = "远程节点关闭";
StrVal.ERRCODE[PErrCode.remote_node_error] = "远程节点错误";
StrVal.ERRCODE[PErrCode.activity_error_min] = "活动错误码最小值";
StrVal.ERRCODE[PErrCode.activity_error_id] = "ID必须在有效范围之内";
StrVal.ERRCODE[PErrCode.activity_id_used] = "ID已经被使用";
StrVal.ERRCODE[PErrCode.activity_size32_error] = "字符长度必须在1到32之间";
StrVal.ERRCODE[PErrCode.activity_size4000_error] = "字符长度必须在1到4000之间";
StrVal.ERRCODE[PErrCode.activity_year_month_day_error] = "年月日不正确";
StrVal.ERRCODE[PErrCode.activity_hour_min_sec_error] = "时分秒不正确";
StrVal.ERRCODE[PErrCode.activity_start_dayu_end] = "开始时间不能晚于结束时间";
StrVal.ERRCODE[PErrCode.activity_week_format_error] = "每周时间段格式不正确";
StrVal.ERRCODE[PErrCode.activity_week_start_dayu_end] = "每周时间段中起始时间不能高于结束时间";
StrVal.ERRCODE[PErrCode.activity_day_format_error] = "每天时间段格式不正确";
StrVal.ERRCODE[PErrCode.activity_day_value_error] = "每天时间段数值不正确";
StrVal.ERRCODE[PErrCode.activity_day_start_dayu_end] = "每天时间段中起始时间不能高于结束时间";
StrVal.ERRCODE[PErrCode.activity_json_error] = "data";
StrVal.ERRCODE[PErrCode.activity_clasz_error] = "clasz";
StrVal.ERRCODE[PErrCode.activity_not_exist] = "活动不存在";
StrVal.ERRCODE[PErrCode.activity_not_dynamic_operation] = "无法对非动态活动进行设置";
StrVal.ERRCODE[PErrCode.activity_state_value_error] = "只能设置隐藏、启用、自动可见、可见状态";
StrVal.ERRCODE[PErrCode.activity_state_used] = "状态未变";
StrVal.ERRCODE[PErrCode.activity_not_state_rollback] = "状态不能回滚";
StrVal.ERRCODE[PErrCode.activity_data_not_exist] = "玩家活动未参与";
StrVal.ERRCODE[PErrCode.activity_player_error] = "玩家错误(不在线)";
StrVal.ERRCODE[PErrCode.activity_opened_level_not_enough] = "玩家参与活动等级不足";
StrVal.ERRCODE[PErrCode.activity_not_open] = "活动未开启";
StrVal.ERRCODE[PErrCode.activity_oppPlayer_level_not_enough] = "目标玩家等级不足";
StrVal.ERRCODE[PErrCode.activity_finished] = "活动已完成";
StrVal.ERRCODE[PErrCode.activity_endtime_error] = "活动结束时间错误";
StrVal.ERRCODE[PErrCode.activity_time_end] = "活动已经结束";
StrVal.ERRCODE[PErrCode.activity_close] = "活动已经关闭";
StrVal.ERRCODE[PErrCode.activity_not_table] = "不是table数据";
StrVal.ERRCODE[PErrCode.activity_not_hash] = "不是";
StrVal.ERRCODE[PErrCode.activity_not_array] = "不是";
StrVal.ERRCODE[PErrCode.activity_array_len_error] = "数组长度不在取值范围内";
StrVal.ERRCODE[PErrCode.activity_not_string] = "不是字符串";
StrVal.ERRCODE[PErrCode.activity_not_number] = "不是数字";
StrVal.ERRCODE[PErrCode.activity_number_error] = "不在取值范围内";
StrVal.ERRCODE[PErrCode.admin_protocol_not_exist] = "管理协议不存在";
StrVal.ERRCODE[PErrCode.admin_param_error] = "参数错误";
StrVal.ERRCODE[PErrCode.startTime_error] = "开始时间错误";
StrVal.ERRCODE[PErrCode.test_battle_not_elite] = "找不到对应的门客";
StrVal.ERRCODE[PErrCode.test_battle_not_eliteskill] = "找不到门客对应的技能";
StrVal.ERRCODE[PErrCode.test_battle_new_eliteskill_fail] = "门客技能创建失败";
StrVal.ERRCODE[PErrCode.test_battle_not_pet] = "找不到侠侣对应的技能";
StrVal.ERRCODE[PErrCode.test_battle_new_petskill_fail] = "侠侣技能创建失败";
StrVal.ERRCODE[PErrCode.test_battle_battle_type_error] = "战斗类型错误";
StrVal.ERRCODE[PErrCode.test_battle_not_monster] = "找不到怪物";
StrVal.ERRCODE[PErrCode.test_battle_not_entityAttr] = "玩家属性错误";
StrVal.ERRCODE[PErrCode.test_battle_not_defenceEntity] = "没有防守者数据";
StrVal.ERRCODE[PErrCode.test_battle_elite_skillid] = "门客技能ID错误";
StrVal.ERRCODE[PErrCode.test_battle_pet_skillid] = "侠侣技能ID错误";
StrVal.ERRCODE[PErrCode.test_battle_not_defenceattr] = "没有防守者属性";
StrVal.ERRCODE[PErrCode.test_battle_not_module] = "实体模块错误";
StrVal.ERRCODE[PErrCode.test_battle_divine_error] = "绝技技能ID错误";
StrVal.ERRCODE[PErrCode.test_battle_create_monsterfail] = "创建怪物失败";
StrVal.ERRCODE[PErrCode.test_battle_hp_not_nil] = "血量不能为0";
StrVal.ERRCODE[PErrCode.test_battle_not_defenceName] = "没有防守者名字";
StrVal.ERRCODE[PErrCode.test_battle_not_defenceCharacter] = "没有防守者角色";
StrVal.ERRCODE[PErrCode.test_battle_not_defenceAppearance] = "没有防守者形象";
StrVal.ERRCODE[PErrCode.test_battle_not_defencePhase] = "没有防守者阶段";
StrVal.ERRCODE[PErrCode.test_battle_not_attackEntity] = "没有进攻者";
StrVal.ERRCODE[PErrCode.test_battle_not_attackEntityAttr] = "没有进攻者属性数据";
StrVal.ERRCODE[PErrCode.test_battle_not_attackName] = "没有攻击者名字";
StrVal.ERRCODE[PErrCode.test_battle_not_attackCharacter] = "没有攻击者角色";
StrVal.ERRCODE[PErrCode.test_battle_not_attackAppearance] = "没有攻击者形象";
StrVal.ERRCODE[PErrCode.test_battle_not_attackPhase] = "没有攻击者阶段";
StrVal.ERRCODE[PErrCode.test_addEntityAttr_typeerror] = "加属性类型错误";
StrVal.ERRCODE[PErrCode.superGift_not_index] = "无此档次";
StrVal.ERRCODE[PErrCode.superGift_bought_index] = "已购买";
StrVal.ERRCODE[PErrCode.totalRecharge_not_index] = "无此档次";
StrVal.ERRCODE[PErrCode.totalRecharge_bought_index] = "已购买";
StrVal.ERRCODE[PErrCode.totalRecharge_not_recharge_index] = "无此累计档次";
StrVal.ERRCODE[PErrCode.totalRecharge_took_index] = "已领取";
StrVal.ERRCODE[PErrCode.totalRecharge_recharge_not_enough] = "累计充值不足";
StrVal.ERRCODE[PErrCode.questionnaire_already_finished] = "已完成问卷";
StrVal.ERRCODE[PErrCode.singleRecharge_not_pay] = "未充值";
StrVal.ERRCODE[PErrCode.singleRecharge_not_take_count] = "无领取次数";
StrVal.ERRCODE[PErrCode.singleRecharge_not_pay_money] = "无此充值金额";
StrVal.ERRCODE[PErrCode.activity_login_get_sign_reward] = "签到奖励已经领取";
StrVal.ERRCODE[PErrCode.activity_login_not_sign_reward] = "没有签到奖励";
StrVal.ERRCODE[PErrCode.activity_take_card_not_pool] = "没有对应卡池";
StrVal.ERRCODE[PErrCode.activity_take_card_not_cardgroup] = "没有对应的卡组";
StrVal.ERRCODE[PErrCode.activity_take_card_not_card] = "没有对应的卡牌";
StrVal.ERRCODE[PErrCode.activity_take_card_not_repeatdata] = "不能重抽";
StrVal.ERRCODE[PErrCode.activity_take_card_not_repeatmax] = "重抽次数最大";
StrVal.ERRCODE[PErrCode.activity_take_card_repeat] = "请重抽";
StrVal.ERRCODE[PErrCode.activity_take_card_not_cost] = "消耗不足";
StrVal.ERRCODE[PErrCode.activity_take_card_day_take_max] = "当日抽卡上限";
StrVal.ERRCODE[PErrCode.activity_take_card_not_repeatcard] = "没有重抽卡牌";
StrVal.ERRCODE[PErrCode.activity_take_card_not_take] = "请先抽卡";
StrVal.ERRCODE[PErrCode.cardcoin_not_enough] = "抽卡币不足";
StrVal.ERRCODE[PErrCode.activity_take_card_not_costitem] = "抽卡道具不足";
StrVal.ERRCODE[PErrCode.activity_take_card_get_repeat] = "请获得重抽卡牌";
StrVal.ERRCODE[PErrCode.activity_take_card_seriestake] = "必须10连抽";
StrVal.ERRCODE[PErrCode.activity_open_chest_not_type] = "这类的宝箱不存在";
StrVal.ERRCODE[PErrCode.activity_open_chest_not_num] = "这类的宝箱数量不足";
StrVal.ERRCODE[PErrCode.activity_open_chest_not_chest] = "找不到宝箱";
StrVal.ERRCODE[PErrCode.activity_online_not_id] = "奖励不存在";
StrVal.ERRCODE[PErrCode.activity_online_not_endTime] = "时间没到不能领取";
StrVal.ERRCODE[PErrCode.activity_online_end] = "已经领取过奖励";
StrVal.ERRCODE[PErrCode.activity_online_all_not_bonuse] = "一键领取失败，没有奖励可以领取";
StrVal.ERRCODE[PErrCode.activity_invasion_not_num] = "已无战斗次数";
StrVal.ERRCODE[PErrCode.player_grow_evolve_upgrading] = "正在升级中";
StrVal.ERRCODE[PErrCode.player_grow_below_level] = "角色未达到突破等级";
StrVal.ERRCODE[PErrCode.player_evolution_stamina_not_found] = "体力消耗不正确";
StrVal.ERRCODE[PErrCode.player_evolution_stamina_below_level] = "需要解锁鱼塘更高等级";
StrVal.ERRCODE[PErrCode.player_grow_breakthrough_below_combat] = "战力未达到突破要求";
StrVal.ERRCODE[PErrCode.player_evolution_max_level] = "目前已经是鱼塘最高等级";
StrVal.ERRCODE[PErrCode.player_grow_evolve_no_upgrading] = "鱼塘未在升级";
StrVal.ERRCODE[PErrCode.player_grow_below_exp] = "角色未达到突破等级经验";
StrVal.ERRCODE[PErrCode.player_grow_phase_upper] = "角色突破等级已达到上限";
StrVal.ERRCODE[PErrCode.player_grow_breakthrough_task_not_finish] = "角色突破任务未完成";
StrVal.ERRCODE[PErrCode.equip_forge_not_empty] = "装备锤炼区已满";
StrVal.ERRCODE[PErrCode.equip_forge_not_found] = "装备找不到了";
StrVal.ERRCODE[PErrCode.equip_breakdown_empty] = "无装备可分解";
StrVal.ERRCODE[PErrCode.equip_forge_frequent_ops] = "操作过于频繁";
StrVal.ERRCODE[PErrCode.equip_forge_item_not_enough] = "【枸杞】数量不足";
StrVal.ERRCODE[PErrCode.vein_gems_pending_not_empty] = "有意念需要处理";
StrVal.ERRCODE[PErrCode.vein_gems_not_match] = "没有匹配的意念";
StrVal.ERRCODE[PErrCode.vein_gems_not_found] = "意念找不到了";
StrVal.ERRCODE[PErrCode.vein_gems_discard_empty] = "无意念可遗忘";
StrVal.ERRCODE[PErrCode.vein_excite_frequent_ops] = "操作过于频繁";
StrVal.ERRCODE[PErrCode.vein_learn_level_max] = "悟道等级已达到最高";
StrVal.ERRCODE[PErrCode.vein_level_max] = "修行等级已达到最高";
StrVal.ERRCODE[PErrCode.shop_buy_count_max] = "商铺购买已达最大次数";
StrVal.ERRCODE[PErrCode.open_server_day_not_reach] = "开服天数不够";
StrVal.ERRCODE[PErrCode.shop_buy_condition] = "商铺物品购买条件未开启";
StrVal.ERRCODE[PErrCode.bazaar_voucher_only] = "普通购买额度已满，请使用代金券";
StrVal.ERRCODE[PErrCode.bazaar_normal_only] = "尚未进入代金券购买阶段";
StrVal.ERRCODE[PErrCode.bazaar_daily_limit] = "今日坊市购买数量已达上限";
StrVal.ERRCODE[PErrCode.task_bonuses_cannot_take] = "当前任务奖励不可领取";
StrVal.ERRCODE[PErrCode.task_has_no_task] = "当前没有此任务";
StrVal.ERRCODE[PErrCode.task_must_gt_maintask_id] = "必须大于当前主线任务id";
StrVal.ERRCODE[PErrCode.challenge_not_open] = "心魔试炼关卡未开启";
StrVal.ERRCODE[PErrCode.challenge_not_pass] = "心魔试炼关卡没通过";
StrVal.ERRCODE[PErrCode.challenge_not_item] = "心魔试炼关卡不存在";
StrVal.ERRCODE[PErrCode.challenge_not_quickcnt] = "心魔试炼快速通关已用完";
StrVal.ERRCODE[PErrCode.challenge_not_passdone] = "心魔试炼已经通过了";
StrVal.ERRCODE[PErrCode.challenge_not_unlock] = "心魔试炼关卡未解锁";
StrVal.ERRCODE[PErrCode.challenge_not_quickcntmax] = "心魔试炼快速通关已达到上限";
StrVal.ERRCODE[PErrCode.companion_no_unlock] = "兽友未解锁";
StrVal.ERRCODE[PErrCode.companion_unlocked] = "兽友已解锁";
StrVal.ERRCODE[PErrCode.companion_using_liking_item_empty] = "没有好感度物品";
StrVal.ERRCODE[PErrCode.companion_duel_player_not_enough] = "玩家等级不够";
StrVal.ERRCODE[PErrCode.companion_duel_liking_not_enough] = "好感度等级不够";
StrVal.ERRCODE[PErrCode.companion_explore_ten_level_no] = "十连游历等级不够";
StrVal.ERRCODE[PErrCode.companion_explore_stamina_not_enough] = "游历体力不足";
StrVal.ERRCODE[PErrCode.companion_not_exist] = "该兽友不存在";
StrVal.ERRCODE[PErrCode.companion_insufficient_unlock] = "解锁兽友条件不足";
StrVal.ERRCODE[PErrCode.companion_skin_not_exist] = "该皮肤不存在";
StrVal.ERRCODE[PErrCode.companion_skin_no_unlock] = "该皮肤未解锁";
StrVal.ERRCODE[PErrCode.companion_skin_not_found] = "未拥有该皮肤";
StrVal.ERRCODE[PErrCode.companion_skin_max_level] = "皮肤已达到最高等级";
StrVal.ERRCODE[PErrCode.companion_explore_no_companion] = "需要解锁兽友方可游历";
StrVal.ERRCODE[PErrCode.activation_sys_insufficient] = "该系统未开启";
StrVal.ERRCODE[PErrCode.theurgy_not_match] = "未匹配秘籍";
StrVal.ERRCODE[PErrCode.theurgy_not_own] = "未拥有此秘籍";
StrVal.ERRCODE[PErrCode.theurgy_catalog_not_found] = "未找到该秘籍图鉴";
StrVal.ERRCODE[PErrCode.theurgy_phase_max] = "目前阶段已是最高";
StrVal.ERRCODE[PErrCode.theurgy_frag_not_enough] = "碎片不足";
StrVal.ERRCODE[PErrCode.theurgy_slot_not_found] = "未有该槽位";
StrVal.ERRCODE[PErrCode.theurgy_catalog_max_level] = "图鉴等级已是最高";
StrVal.ERRCODE[PErrCode.theurgy_catalog_insufficient_phase] = "图鉴阶段不够";
StrVal.ERRCODE[PErrCode.theurgy_level_not_enough] = "秘籍等级不够";
StrVal.ERRCODE[PErrCode.theurgy_slot_not_enough] = "秘籍印记槽位不够";
StrVal.ERRCODE[PErrCode.theurgy_seal_not_found] = "未有该印记";
StrVal.ERRCODE[PErrCode.theurgy_max_level] = "秘籍等级已达到最高";
StrVal.ERRCODE[PErrCode.theurgy_seal_amount_not_enough] = "印记数量不足";
StrVal.ERRCODE[PErrCode.theurgy_slot_no_seal] = "该槽位没有装备印记";
StrVal.ERRCODE[PErrCode.theurgy_seal_no_set] = "该印记未设置";
StrVal.ERRCODE[PErrCode.theurgy_type_not_found] = "未找到该类型";
StrVal.ERRCODE[PErrCode.theurgy_not_reset] = "秘籍无需重置";
StrVal.ERRCODE[PErrCode.theurgy_catalog_insufficient] = "图鉴未集齐";
StrVal.ERRCODE[PErrCode.theurgy_max_level_by_phase] = "已达到该阶段最高等级";
StrVal.ERRCODE[PErrCode.theurgy_not_special_bonuses] = "没有奖励可以领取";
StrVal.ERRCODE[PErrCode.qunyin_challenge_item_not_enough] = "挑战令数量不足";
StrVal.ERRCODE[PErrCode.qunyin_cannot_challenge_self] = "不能挑战自己";
StrVal.ERRCODE[PErrCode.qunyin_opp_is_not_in_list] = "对手不在自己的挑战列表中";
StrVal.ERRCODE[PErrCode.qunyin_refresh_opp_first] = "请先刷新对手";
StrVal.ERRCODE[PErrCode.qunyin_has_no_score] = "当前没有任何积分";
StrVal.ERRCODE[PErrCode.qunyin_shop_buy_max] = "商店兑换已达最大次数";
StrVal.ERRCODE[PErrCode.qunyin_score_not_enough] = "积分不够";
StrVal.ERRCODE[PErrCode.qunyin_has_no_achievement] = "当前没有完成任何成就";
StrVal.ERRCODE[PErrCode.qunyin_has_not_reach_achievement] = "还没有完成当前成就";
StrVal.ERRCODE[PErrCode.qunyin_has_taked_achievement] = "已经领取过该成就";
StrVal.ERRCODE[PErrCode.qunyin_buybook_max] = "购买论剑挑战书次数已达最大";
StrVal.ERRCODE[PErrCode.qunyin_refresh_count_max] = "论剑刷新次数已达最大";
StrVal.ERRCODE[PErrCode.qunyin_cannot_quick_low_player] = "不能速战比自己排名高的对手";
StrVal.ERRCODE[PErrCode.qunyin_not_in_server_group] = "当前不在华山论剑跨服分组中";
StrVal.ERRCODE[PErrCode.qunyin_has_no_challenge_log] = "无挑战记录";
StrVal.ERRCODE[PErrCode.pay_gift_not_option] = "当前礼包不是自选礼包";
StrVal.ERRCODE[PErrCode.pay_is_not_in_this_op] = "不是当前自选礼包的物品";
StrVal.ERRCODE[PErrCode.pay_money_error] = "下单金额不对";
StrVal.ERRCODE[PErrCode.pay_item_count_error] = "请选择正确的自选物品";
StrVal.ERRCODE[PErrCode.pay_can_not_pay_gift] = "你当前不能充值该礼包";
StrVal.ERRCODE[PErrCode.pay_buy_gift_max] = "今日礼包购买次数已达最大";
StrVal.ERRCODE[PErrCode.pay_gift_type_error] = "礼包类型错误";
StrVal.ERRCODE[PErrCode.pay_gift_id_error] = "礼包ID错误";
StrVal.ERRCODE[PErrCode.pay_id_error] = "充值档次错误";
StrVal.ERRCODE[PErrCode.pay_gift_subtype_error] = "礼包组子类型错误";
StrVal.ERRCODE[PErrCode.pay_month_card_taked] = "已经领取今日的月卡";
StrVal.ERRCODE[PErrCode.pay_life_card_taked] = "已经领取今日的终生卡";
StrVal.ERRCODE[PErrCode.pay_has_no_monthcard] = "你当前还没有月卡";
StrVal.ERRCODE[PErrCode.pay_has_no_lifecard] = "你当前还没有终生卡";
StrVal.ERRCODE[PErrCode.pay_id_not_exist] = "充值id不存在";
StrVal.ERRCODE[PErrCode.pay_life_card_has_exist] = "已充值过终生卡";
StrVal.ERRCODE[PErrCode.pay_item_system_error] = "自选物品系统未开启";
StrVal.ERRCODE[PErrCode.pay_firstgift_cannot_take] = "当前礼包还不能领取";
StrVal.ERRCODE[PErrCode.weekcard_free_taked] = "已领取今日周卡";
StrVal.ERRCODE[PErrCode.weekcard_has_not_pay] = "暂无周卡";
StrVal.ERRCODE[PErrCode.weekcard_has_take_all] = "周卡奖励已经全部领取";
StrVal.ERRCODE[PErrCode.week_card_has_not_expired] = "周卡还未到期";
StrVal.ERRCODE[PErrCode.pay_has_no_elitemonstercard] = "你当前还没有门客终身卡";
StrVal.ERRCODE[PErrCode.pay_elitemonster_card_taked] = "已经领取今日的门客奖励";
StrVal.ERRCODE[PErrCode.elitemonster_card_has_exist] = "精怪终身卡只能购买一次";
StrVal.ERRCODE[PErrCode.pet_card_has_exist] = "侠侣终身卡只能购买一次";
StrVal.ERRCODE[PErrCode.theurgy_card_has_exist] = "秘籍终身卡只能购买一次";
StrVal.ERRCODE[PErrCode.pay_has_no_petcard] = "你当前还没有侠侣终身卡";
StrVal.ERRCODE[PErrCode.pay_has_no_theurgycard] = "你当前还没有秘籍终身卡";
StrVal.ERRCODE[PErrCode.pay_pet_card_taked] = "已经领取今日的侠侣奖励";
StrVal.ERRCODE[PErrCode.pay_theurgy_card_taked] = "已经领取今日的秘籍奖励";
StrVal.ERRCODE[PErrCode.hdhive_not_bound] = "未绑定 HDHive 账号";
StrVal.ERRCODE[PErrCode.hdhive_rebind_required] = "HDHive 授权已失效，请重新绑定";
StrVal.ERRCODE[PErrCode.hdhive_points_price_missing] = "该商品未配置积分价格";
StrVal.ERRCODE[PErrCode.hdhive_points_insufficient] = "HDHive 积分不足";
StrVal.ERRCODE[PErrCode.hdhive_debit_failed] = "HDHive 扣积分失败";
StrVal.ERRCODE[PErrCode.hdhive_deliver_failed] = "发货失败（已尝试退款）";
StrVal.ERRCODE[PErrCode.hdhive_voucher_only] = "HDHive积分只能购买代金券，请先购买代金券";
StrVal.ERRCODE[PErrCode.open_rank_cannot_take] = "当前没有奖励可领取";
StrVal.ERRCODE[PErrCode.open_rank_donot_reach] = "你当前还没有上榜";
StrVal.ERRCODE[PErrCode.xy_fuli_not_open] = "还未开启风云录福利";
StrVal.ERRCODE[PErrCode.xy_score_not_enougth] = "风云录积分不够";
StrVal.ERRCODE[PErrCode.xy_fuli_taked] = "风云录福利已经领取过了";
StrVal.ERRCODE[PErrCode.xy_take_today_free_bonuses] = "已领取今日免费风云录福利";
StrVal.ERRCODE[PErrCode.xy_pay_count_not_enougth] = "风云录充值次数不足";
StrVal.ERRCODE[PErrCode.xy_has_take_fl] = "已经领取过该风云录奖励";
StrVal.ERRCODE[PErrCode.chance_not_enough] = "代金券不足";
StrVal.ERRCODE[PErrCode.pay_cannot_pay_chance] = "代金券不能购买代金券";
StrVal.ERRCODE[PErrCode.welfare_can_not_take] = "当前状态不可领取每日福利";
StrVal.ERRCODE[PErrCode.welfare_take_max] = "已达到今日最大领取次数";
StrVal.ERRCODE[PErrCode.gift_group_error] = "礼包组ID错误";
StrVal.ERRCODE[PErrCode.signed_in] = "当日签到已完成";
StrVal.ERRCODE[PErrCode.mount_is_open] = "坐骑系统已开启";
StrVal.ERRCODE[PErrCode.task_not_finish] = "任务未完成";
StrVal.ERRCODE[PErrCode.mount_not_open] = "坐骑系统未开启";
StrVal.ERRCODE[PErrCode.mount_unlocked] = "坐骑已解锁";
StrVal.ERRCODE[PErrCode.mount_clothes] = "皮肤已解锁";
StrVal.ERRCODE[PErrCode.mount_not_level] = "等级不足";
StrVal.ERRCODE[PErrCode.item_wrong_sum] = "物品数量错误";
StrVal.ERRCODE[PErrCode.mount_level_max] = "坐骑已达最大等级";
StrVal.ERRCODE[PErrCode.mount_not_unlocked] = "坐骑未解锁";
StrVal.ERRCODE[PErrCode.mount_not_clothes] = "皮肤未解锁";
StrVal.ERRCODE[PErrCode.character_not_found] = "不存在该角色";
StrVal.ERRCODE[PErrCode.character_not_unlock] = "未解锁";
StrVal.ERRCODE[PErrCode.character_not_unlock_claim] = "不能通过解锁获得";
StrVal.ERRCODE[PErrCode.character_unlocked] = "已解锁";
StrVal.ERRCODE[PErrCode.character_max_level] = "最达到最高等级";
StrVal.ERRCODE[PErrCode.tower_is_open] = "激流塔已开启";
StrVal.ERRCODE[PErrCode.tower_not_open] = "激流塔未开启";
StrVal.ERRCODE[PErrCode.tower_buff_num] = "BUFF选择次数未用完";
StrVal.ERRCODE[PErrCode.tower_max_tier] = "目前已是最大关卡";
StrVal.ERRCODE[PErrCode.tower_not_buff] = "BUFF选择次数已用完";
StrVal.ERRCODE[PErrCode.clan_have] = "已有帮派";
StrVal.ERRCODE[PErrCode.clan_not_have] = "未加入帮派";
StrVal.ERRCODE[PErrCode.clan_forbidden] = "无权限操作";
StrVal.ERRCODE[PErrCode.clan_not_exist] = "帮派不存在";
StrVal.ERRCODE[PErrCode.clan_member_not_exist] = "帮派查无此人";
StrVal.ERRCODE[PErrCode.clan_kick_myself] = "无法踢出自己";
StrVal.ERRCODE[PErrCode.clan_member_no_apply] = "该成员并未申请";
StrVal.ERRCODE[PErrCode.clan_member_not_opt_myself] = "不能对自己应用此操作";
StrVal.ERRCODE[PErrCode.clan_rejoin_need_time] = "需要一些时间才能加入帮派";
StrVal.ERRCODE[PErrCode.clan_full] = "帮派已满员";
StrVal.ERRCODE[PErrCode.clan_goods_not_exist] = "不存在该商品";
StrVal.ERRCODE[PErrCode.clan_goods_buy_limit] = "超出购买次数限制";
StrVal.ERRCODE[PErrCode.clan_text_has_sensitive_word] = "内容存在敏感词";
StrVal.ERRCODE[PErrCode.clan_same_name] = "已有同名帮派";
StrVal.ERRCODE[PErrCode.clan_apply_exist] = "已发送过申请，请耐心等待帮派处理";
StrVal.ERRCODE[PErrCode.clan_phase_not_enough] = "帮派阶段不够";
StrVal.ERRCODE[PErrCode.clan_level_not_enough] = "帮派等级不够";
StrVal.ERRCODE[PErrCode.clan_member_has_clan] = "该玩家已有帮派";
StrVal.ERRCODE[PErrCode.clan_player_phase_not_enough] = "未达到帮派要求的最低阶段";
StrVal.ERRCODE[PErrCode.clan_apply_full] = "帮派申请列表已满";
StrVal.ERRCODE[PErrCode.clan_flag_not_have] = "未拥有该帮派旗帜";
StrVal.ERRCODE[PErrCode.clan_merchant_not_exist] = "西域商人未出现";
StrVal.ERRCODE[PErrCode.clan_merchant_not_bargain] = "未砍价";
StrVal.ERRCODE[PErrCode.clan_merchant_already_bargain] = "已砍价";
StrVal.ERRCODE[PErrCode.clan_merchant_already_buy] = "已购买";
StrVal.ERRCODE[PErrCode.clan_merchant_expire] = "西域商人已消失";
StrVal.ERRCODE[PErrCode.clan_evolve_finish] = "该玩家鱼塘已完成升级，无须协助";
StrVal.ERRCODE[PErrCode.clan_evolve_help_count_limit] = "已达最大协助次数";
StrVal.ERRCODE[PErrCode.clan_not_suitable_join] = "暂无合适帮派";
StrVal.ERRCODE[PErrCode.clan_duel_max_buff_count] = "布阵已达到最大次数";
StrVal.ERRCODE[PErrCode.clan_duel_buff_done] = "今日已布阵";
StrVal.ERRCODE[PErrCode.clan_new_member_can_not] = "加入帮派第二天可参与活动";
StrVal.ERRCODE[PErrCode.clan_duel_no_duel_count] = "今日挑战次数已用尽";
StrVal.ERRCODE[PErrCode.clan_duel_defeat_all] = "挑战怪物已全部击败";
StrVal.ERRCODE[PErrCode.clan_no_reward_claim] = "无可领取奖励";
StrVal.ERRCODE[PErrCode.clan_role_limit] = "职位已达到上限";
StrVal.ERRCODE[PErrCode.clan_duel_not_open] = "禁地挑战未开放";
StrVal.ERRCODE[PErrCode.clan_evolve_not_help] = "无需协助";
StrVal.ERRCODE[PErrCode.clan_evolve_repeat_req] = "已发起协助";
StrVal.ERRCODE[PErrCode.clan_evolve_repeat] = "已协助";
StrVal.ERRCODE[PErrCode.clan_evolve_not_myself] = "不能协助自己";
StrVal.ERRCODE[PErrCode.clan_point_not_enough] = "帮派贡献不足";
StrVal.ERRCODE[PErrCode.clan_glory_not_enough] = "战功不足";
StrVal.ERRCODE[PErrCode.clan_rate_not_enough] = "九幽秘宝不足";
StrVal.ERRCODE[PErrCode.clan_recharge_not_open] = "帮派充值活动尚未开启";
StrVal.ERRCODE[PErrCode.clan_name_len_limit] = "帮派名字过长";
StrVal.ERRCODE[PErrCode.clan_notice_len_limit] = "帮派公告过长";
StrVal.ERRCODE[PErrCode.clan_declaration_len_limit] = "帮派宣言过长";
StrVal.ERRCODE[PErrCode.clan_name_empty] = "帮派名字不能为空";
StrVal.ERRCODE[PErrCode.clan_notice_empty] = "帮派公告不能为空";
StrVal.ERRCODE[PErrCode.clan_declaration_empty] = "帮派宣言不能为空";
StrVal.ERRCODE[PErrCode.achievement_all_finish] = "成就任务已全部完成";
StrVal.ERRCODE[PErrCode.achievement_has_no_task] = "当前没有此成就任务";
StrVal.ERRCODE[PErrCode.achievement_not_finish] = "当前成就任务未完成";
StrVal.ERRCODE[PErrCode.duel_opponent_no_in_list] = "对手不在名单内";
StrVal.ERRCODE[PErrCode.duel_not_duel_myself] = "不能与自己对决";
StrVal.ERRCODE[PErrCode.conquest_closed] = "活动已关闭";
StrVal.ERRCODE[PErrCode.conquest_finish] = "活动已结束";
StrVal.ERRCODE[PErrCode.conquest_no_enroll_time] = "非报名时间";
StrVal.ERRCODE[PErrCode.conquest_can_not_repeat_enroll] = "不能重复报名";
StrVal.ERRCODE[PErrCode.conquest_can_not_attack] = "不能发起攻击";
StrVal.ERRCODE[PErrCode.conquest_no_fight_time] = "非战斗时间";
StrVal.ERRCODE[PErrCode.conquest_not_start] = "活动尚未开启";
StrVal.ERRCODE[PErrCode.conquest_scene_no_create] = "场景未创建";
StrVal.ERRCODE[PErrCode.conquest_no_in_scene] = "不在场景内";
StrVal.ERRCODE[PErrCode.conquest_player_not_enter_scene] = "玩家没进入场景";
StrVal.ERRCODE[PErrCode.conquest_task_not_finish] = "任务无法完成";
StrVal.ERRCODE[PErrCode.conquest_no_reward_claim] = "无法领取奖励";
StrVal.ERRCODE[PErrCode.conquest_no_finish_time] = "非领奖时间";
StrVal.ERRCODE[PErrCode.conquest_no_player_in_clan] = "在该帮派查无此人";
StrVal.ERRCODE[PErrCode.conquest_not_revive] = "目前无法重振";
StrVal.ERRCODE[PErrCode.conquest_liked] = "已点赞";
StrVal.ERRCODE[PErrCode.palace_goods_already_buy] = "已达到购买次数";
StrVal.ERRCODE[PErrCode.palace_no_player] = "虚位以待";
StrVal.ERRCODE[PErrCode.palace_not_in_palace] = "没有上榜";
StrVal.ERRCODE[PErrCode.palace_like_today_already] = "今日已点赞";
StrVal.ERRCODE[PErrCode.palace_like_already] = "已点赞";
StrVal.ERRCODE[PErrCode.palace_grant_today_already] = "今日已赐福";
StrVal.ERRCODE[PErrCode.palace_no_grant] = "此人未赐福";
StrVal.ERRCODE[PErrCode.palace_grant_expire] = "赐福已过期";
StrVal.ERRCODE[PErrCode.palace_grant_not_myself] = "不能对自己赐福点赞";
StrVal.ERRCODE[PErrCode.clan_solo_already_buy] = "已购买";
StrVal.ERRCODE[PErrCode.clan_solo_no_join] = "未获取活动参与资格";
StrVal.ERRCODE[PErrCode.clan_solo_passport_already_has] = "已购买礼包";
StrVal.ERRCODE[PErrCode.clan_solo_buy_limit] = "已达到购买次数上限";
StrVal.ERRCODE[PErrCode.clan_solo_prestige_not_enough] = "声望不足";
StrVal.ERRCODE[PErrCode.clan_solo_once_prestige_not_enough] = "本轮声望不足";
StrVal.ERRCODE[PErrCode.clan_solo_no_reward_claim] = "无法领取奖励";
StrVal.ERRCODE[PErrCode.clan_solo_physical_not_enough] = "体力不足";
StrVal.ERRCODE[PErrCode.clan_solo_not_buy_buff] = "无法购买属性加成";
StrVal.ERRCODE[PErrCode.clan_solo_not_fight_opponent] = "无法与该玩家战斗";
StrVal.ERRCODE[PErrCode.clan_solo_not_start] = "活动尚未开启";
StrVal.ERRCODE[PErrCode.clan_solo_no_finish_state] = "活动未到结算期";
StrVal.ERRCODE[PErrCode.clan_solo_no_fight_state] = "活动未到战斗期";
StrVal.ERRCODE[PErrCode.clan_solo_repeat_like] = "请勿重复点赞";
StrVal.ERRCODE[PErrCode.clan_solo_not_in_fight] = "未成功进入战斗";
StrVal.ERRCODE[PErrCode.clan_solo_already_buff] = "无法重复购买属性加成";
StrVal.ERRCODE[PErrCode.clan_solo_fighting] = "上一轮战斗未结束";
StrVal.ERRCODE[PErrCode.clan_solo_physical_full] = "体力已满";
StrVal.ERRCODE[PErrCode.clan_solo_energy_not_enough] = "精力不足";
StrVal.ERRCODE[PErrCode.clan_solo_not_found_clan] = "匹配帮派失败";
StrVal.ERRCODE[PErrCode.clan_solo_no_buff] = "请先选择属性加成";
StrVal.ERRCODE[PErrCode.clan_solo_not_found_record_by_list] = "未找到对应战报";
StrVal.ERRCODE[PErrCode.clan_solo_not_found_record] = "战报不存在";
StrVal.ERRCODE[PErrCode.clan_solo_can_not_challenge] = "无法发起挑战";
StrVal.ERRCODE[PErrCode.clan_solo_can_not_quick_fight] = "未满足一键挑战条件";
StrVal.ERRCODE[PErrCode.clan_solo_not_fight_my_clan] = "不能挑战自己帮派";
StrVal.ERRCODE[PErrCode.spring_not_in_server_group] = "当前不在灵泉跨服分组中";
StrVal.ERRCODE[PErrCode.spring_not_in] = "不在灵泉场景中";
StrVal.ERRCODE[PErrCode.spring_is_open] = "灵泉已开启";
StrVal.ERRCODE[PErrCode.spring_not_redbag] = "无红包可领取";
StrVal.ERRCODE[PErrCode.spring_not_pos_power] = "位置权限设置错误";
StrVal.ERRCODE[PErrCode.spring_not_room] = "房间不存在";
StrVal.ERRCODE[PErrCode.spring_is_power_pos] = "权限位置需申请落座";
StrVal.ERRCODE[PErrCode.spring_not_score] = "精粹不足";
StrVal.ERRCODE[PErrCode.spring_is_protect_time] = "玩家在保护时间内无法挑战";
StrVal.ERRCODE[PErrCode.spring_not_leave_time] = "玩家已有灵泉暂时无法离席";
StrVal.ERRCODE[PErrCode.spring_not_apply] = "该位置无需申请";
StrVal.ERRCODE[PErrCode.spring_not_battle] = "该位置无法抢夺";
StrVal.ERRCODE[PErrCode.spring_has_apply] = "您尚有入座申请未被处理";
StrVal.ERRCODE[PErrCode.spring_not_player_list] = "该位置没有玩家申请";
StrVal.ERRCODE[PErrCode.spring_not_consent_player] = "该玩家未提交申请";
StrVal.ERRCODE[PErrCode.spring_not_player] = "该位置没有玩家";
StrVal.ERRCODE[PErrCode.spring_not_power_pos] = "非权限位置无法驱逐玩家";
StrVal.ERRCODE[PErrCode.spring_not_share] = "无分享次数";
StrVal.ERRCODE[PErrCode.domain_monster_not_monster] = "找不到怪物";
StrVal.ERRCODE[PErrCode.domain_monster_not_done_zoneLevel] = "当前区域不能升级";
StrVal.ERRCODE[PErrCode.domain_monster_not_energy] = "体力不足";
StrVal.ERRCODE[PErrCode.domain_monster_not_open] = "活动未开启";
StrVal.ERRCODE[PErrCode.domain_monster_not_openTime] = "活动未开启";
StrVal.ERRCODE[PErrCode.domain_monster_is_exit_monster] = "当前区域怪物没打完";
StrVal.ERRCODE[PErrCode.domain_monster_is_not_monster] = "当前区域找不到怪物";
StrVal.ERRCODE[PErrCode.domain_monster_is_not_cd] = "战斗冷却中";
StrVal.ERRCODE[PErrCode.domain_monster_is_exit_event] = "还有事件没有完成";
StrVal.ERRCODE[PErrCode.domain_monster_is_not_event] = "没有区域事件可以完成";
StrVal.ERRCODE[PErrCode.domain_monster_is_not_special] = "当前区域找不到特殊事件";
StrVal.ERRCODE[PErrCode.domain_monster_is_max_level] = "已经到达最高层";
StrVal.ERRCODE[PErrCode.domain_monster_is_not_monstermark] = "没有怪物可以标记";
StrVal.ERRCODE[PErrCode.domain_monster_is_die] = "标记怪物已死亡先领奖励";
StrVal.ERRCODE[PErrCode.domain_monster_is_matchingplayer_notinfo] = "没有玩家信息";
StrVal.ERRCODE[PErrCode.domain_monster_is_not_skip] = "当前状态不能绕过";
StrVal.ERRCODE[PErrCode.domain_monster_is_not_clan] = "没有帮派";
StrVal.ERRCODE[PErrCode.domain_monster_is_help_battle_time] = "助战冷却中";
StrVal.ERRCODE[PErrCode.domain_monster_is_help_not_monster] = "没有协助的怪物";
StrVal.ERRCODE[PErrCode.domain_monster_is_help_not_monster_bonuses] = "没有协助的怪物不能领奖";
StrVal.ERRCODE[PErrCode.domain_monster_is_help_not_monster_die] = "怪物没有死亡不能领取奖励";
StrVal.ERRCODE[PErrCode.domain_monster_is_help_cd] = "助战冷却中";
StrVal.ERRCODE[PErrCode.domain_monster_is_help_maxcnt] = "助战次数上限";
StrVal.ERRCODE[PErrCode.domain_monster_is_help_isDie] = "标记怪物已死亡请去领取奖励";
StrVal.ERRCODE[PErrCode.domain_monster_is_player_leave] = "玩家已离开";
StrVal.ERRCODE[PErrCode.domain_monster_is_not_rand] = "没有排行奖励";
StrVal.ERRCODE[PErrCode.domain_monster_is_take_rank] = "排行奖励已经领取";
StrVal.ERRCODE[PErrCode.domain_monster_is_gift_buy_max] = "礼包购买上限";
StrVal.ERRCODE[PErrCode.domain_monster_is_silver_not] = "银宝箱不足";
StrVal.ERRCODE[PErrCode.domain_monster_is_gold_not] = "金宝箱不足";
StrVal.ERRCODE[PErrCode.domain_monster_is_not_gift] = "礼包不存在";
StrVal.ERRCODE[PErrCode.domain_monster_is_is_monstermark] = "已经标记过了";
StrVal.ERRCODE[PErrCode.domain_monster_is_not_battle_not_mark] = "先打过一次才能标记";
StrVal.ERRCODE[PErrCode.domain_monster_is_mark_monster_die] = "标记怪物已死亡请去领取奖励";
StrVal.ERRCODE[PErrCode.domain_monster_is_not_add] = "活动不在指定时间进入";
StrVal.ERRCODE[PErrCode.domain_monster_is_task_bonuses_nil] = "没有任务奖励";
StrVal.ERRCODE[PErrCode.domain_monster_is_not_task_done] = "任务未完成";
StrVal.ERRCODE[PErrCode.domain_monster_is_not_task] = "任务奖励不可以领取";
StrVal.ERRCODE[PErrCode.domain_monster_is_task_done] = "任务奖励已经领取";
StrVal.ERRCODE[PErrCode.siege_not_in_server_group] = "当前不在攻城略地跨服分组中";
StrVal.ERRCODE[PErrCode.siege_prepare] = "备战阶段无法进入";
StrVal.ERRCODE[PErrCode.siege_fight] = "战斗阶段无法进入";
StrVal.ERRCODE[PErrCode.siege_settle] = "结算阶段无法进入";
StrVal.ERRCODE[PErrCode.siege_apply] = "报名阶段无法进入";
StrVal.ERRCODE[PErrCode.siege_tower_is_open] = "宝箱已开启";
StrVal.ERRCODE[PErrCode.siege_tower_not_next] = "无法进入下一层";
StrVal.ERRCODE[PErrCode.siege_not_clan] = "帮派未参加活动";
StrVal.ERRCODE[PErrCode.siege_player_not_clan] = "玩家未在活动帮派中";
StrVal.ERRCODE[PErrCode.siege_not_group] = "不在同一个分组";
StrVal.ERRCODE[PErrCode.siege_not_stamina] = "玩家体力已耗尽";
StrVal.ERRCODE[PErrCode.siege_clan_is_destroy] = "帮派已被击破";
StrVal.ERRCODE[PErrCode.siege_not_donateCount] = "捐献次数不足";
StrVal.ERRCODE[PErrCode.siege_not_state] = "当前状态无法进入";
StrVal.ERRCODE[PErrCode.openCelebration_score_bonuses_repetition] = "累计积分奖励重复";
StrVal.ERRCODE[PErrCode.openCelebration_exchange_id_repetition] = "兑换id重复";
StrVal.ERRCODE[PErrCode.openCelebration_payId_repetition] = "充值id重复";
StrVal.ERRCODE[PErrCode.openCelebration_task_type_not_exist] = "任务类型不存在";
StrVal.ERRCODE[PErrCode.openCelebration_task_type_params_error] = "任务类型参数错误";
StrVal.ERRCODE[PErrCode.openCelebration_task_id_repetition] = "任务id重复";
StrVal.ERRCODE[PErrCode.openCelebration_task_not_exist] = "无此任务";
StrVal.ERRCODE[PErrCode.openCelebration_task_not_done] = "任务未完成";
StrVal.ERRCODE[PErrCode.openCelebration_task_bonuses_took] = "任务奖励已领取";
StrVal.ERRCODE[PErrCode.openCelebration_score_bonuses_took] = "此累计积分奖励已领取";
StrVal.ERRCODE[PErrCode.openCelebration_score_bonuses_not_exist] = "此累计积分奖励不存在";
StrVal.ERRCODE[PErrCode.openCelebration_goods_exchange_not_exist] = "兑换商品不存在";
StrVal.ERRCODE[PErrCode.openCelebration_goods_exchange_count_not_enough] = "商品兑换次数不足";
StrVal.ERRCODE[PErrCode.openCelebration_goods_exchange_score_not_enough] = "兑换商品的积分不足";
StrVal.ERRCODE[PErrCode.openCelebration_pay_bonuses_not_exist] = "无此档次礼包奖励";
StrVal.ERRCODE[PErrCode.openCelebration_pay_bonuses_take_not_enough] = "此档次礼包奖励领取次数不足";
StrVal.ERRCODE[PErrCode.openCelebration_score_not_enough] = "积分不足";
StrVal.ERRCODE[PErrCode.fortune_draw_count_bonuses_repetition] = "累计抽取奖励重复";
StrVal.ERRCODE[PErrCode.fortune_goods_id_repetition] = "抽取商品id重复";
StrVal.ERRCODE[PErrCode.fortune_gift_id_repetition] = "礼包id重复";
StrVal.ERRCODE[PErrCode.fortune_gift_pay_id_repetition] = "充值礼包的充值id重复";
StrVal.ERRCODE[PErrCode.fortune_task_type_not_exist] = "任务类型不存在";
StrVal.ERRCODE[PErrCode.fortune_task_type_params_error] = "任务类型参数错误";
StrVal.ERRCODE[PErrCode.fortune_task_id_repetition] = "任务id重复";
StrVal.ERRCODE[PErrCode.fortune_task_not_exist] = "无此任务";
StrVal.ERRCODE[PErrCode.fortune_task_not_done] = "任务未完成";
StrVal.ERRCODE[PErrCode.fortune_task_bonuses_took] = "任务奖励已领取";
StrVal.ERRCODE[PErrCode.fortune_count_bonuses_took] = "此累计抽取奖励已领取";
StrVal.ERRCODE[PErrCode.fortune_count_bonuses_not_exist] = "此累计抽取奖励不存在";
StrVal.ERRCODE[PErrCode.fortune_total_score_not_enough] = "累计抽取次数不足";
StrVal.ERRCODE[PErrCode.fortune_score_not_enough] = "如意签不足";
StrVal.ERRCODE[PErrCode.fortune_gift_not_exist] = "礼包不存在";
StrVal.ERRCODE[PErrCode.fortune_gift_need_pay] = "礼包需要走充值";
StrVal.ERRCODE[PErrCode.fortune_gift_not_enough] = "礼包数量不足";
StrVal.ERRCODE[PErrCode.reincarnationHall_gift_id_repetition] = "礼包id重复";
StrVal.ERRCODE[PErrCode.reincarnationHall_gift_pay_id_repetition] = "充值礼包的充值id重复";
StrVal.ERRCODE[PErrCode.reincarnationHall_gift_not_exist] = "礼包不存在";
StrVal.ERRCODE[PErrCode.reincarnationHall_gift_need_pay] = "礼包需要走充值";
StrVal.ERRCODE[PErrCode.reincarnationHall_gift_not_enough] = "礼包数量不足";
StrVal.ERRCODE[PErrCode.reincarnationHall_task_type_not_exist] = "任务类型不存在";
StrVal.ERRCODE[PErrCode.reincarnationHall_task_type_params_error] = "任务类型参数错误";
StrVal.ERRCODE[PErrCode.reincarnationHall_task_id_repetition] = "任务id重复";
StrVal.ERRCODE[PErrCode.reincarnationHall_task_not_exist] = "无此任务";
StrVal.ERRCODE[PErrCode.reincarnationHall_task_not_done] = "任务未完成";
StrVal.ERRCODE[PErrCode.reincarnationHall_task_bonuses_took] = "任务奖励已领取";
StrVal.ERRCODE[PErrCode.gremlinExperience_gift_id_repetition] = "礼包id重复";
StrVal.ERRCODE[PErrCode.gremlinExperience_gift_pay_id_repetition] = "充值礼包的充值id重复";
StrVal.ERRCODE[PErrCode.gremlinExperience_gift_not_exist] = "礼包不存在";
StrVal.ERRCODE[PErrCode.gremlinExperience_gift_need_pay] = "礼包需要走充值";
StrVal.ERRCODE[PErrCode.gremlinExperience_gift_not_enough] = "礼包数量不足";
StrVal.ERRCODE[PErrCode.gremlinExperience_task_type_not_exist] = "任务类型不存在";
StrVal.ERRCODE[PErrCode.gremlinExperience_task_type_params_error] = "任务类型参数错误";
StrVal.ERRCODE[PErrCode.gremlinExperience_task_id_repetition] = "任务id重复";
StrVal.ERRCODE[PErrCode.gremlinExperience_task_not_exist] = "无此任务";
StrVal.ERRCODE[PErrCode.gremlinExperience_task_not_done] = "任务未完成";
StrVal.ERRCODE[PErrCode.gremlinExperience_task_bonuses_took] = "任务奖励已领取";
StrVal.ERRCODE[PErrCode.gremlinExperience_rank_order_error] = "排名配置序号错误";
StrVal.ERRCODE[PErrCode.gremlinExperience_monster_init_error] = "初始怪物id错误";
StrVal.ERRCODE[PErrCode.gremlinExperience_monster_not_exist] = "怪物id不存在";
StrVal.ERRCODE[PErrCode.gremlinExperience_monster_not_find] = "怪物id未找到";
StrVal.ERRCODE[PErrCode.gremlinExperience_monster_already_attack] = "怪物已驱散";
StrVal.ERRCODE[PErrCode.gremlinExperience_monster_slot_not_enough] = "上阵的门客数量不符合";
StrVal.ERRCODE[PErrCode.gremlinExperience_totalRecharge_money_not_exist] = "此累充档次不存在";
StrVal.ERRCODE[PErrCode.gremlinExperience_totalRecharge_money_not_done] = "此累充档次未完成";
StrVal.ERRCODE[PErrCode.gremlinExperience_totalRecharge_money_took] = "此累充档次已领取";
StrVal.ERRCODE[PErrCode.gremlinExperience_qualityGroups_error] = "品质组配置数据错误";
StrVal.ERRCODE[PErrCode.gremlinExperience_eliteMonster_id_repetition] = "上阵的门客id重复";
StrVal.ERRCODE[PErrCode.gremlinExperience_attack_not_enough] = "讨伐次数不足";
StrVal.ERRCODE[PErrCode.gremlinExperience_eliteMonster_not_count] = "门客无上阵次数";
StrVal.ERRCODE[PErrCode.animalFairyland_gift_id_repetition] = "礼包id重复";
StrVal.ERRCODE[PErrCode.animalFairyland_gift_pay_id_repetition] = "充值礼包的充值id重复";
StrVal.ERRCODE[PErrCode.animalFairyland_gift_not_exist] = "礼包不存在";
StrVal.ERRCODE[PErrCode.animalFairyland_gift_need_pay] = "礼包需要走充值";
StrVal.ERRCODE[PErrCode.animalFairyland_gift_not_enough] = "礼包数量不足";
StrVal.ERRCODE[PErrCode.animalFairyland_task_type_not_exist] = "任务类型不存在";
StrVal.ERRCODE[PErrCode.animalFairyland_task_type_params_error] = "任务类型参数错误";
StrVal.ERRCODE[PErrCode.animalFairyland_task_id_repetition] = "任务id重复";
StrVal.ERRCODE[PErrCode.animalFairyland_task_not_exist] = "无此任务";
StrVal.ERRCODE[PErrCode.animalFairyland_task_not_done] = "任务未完成";
StrVal.ERRCODE[PErrCode.animalFairyland_task_bonuses_took] = "任务奖励已领取";
StrVal.ERRCODE[PErrCode.animalFairyland_explore_task_type_not_exist] = "探索任务类型不存在";
StrVal.ERRCODE[PErrCode.animalFairyland_explore_task_type_params_error] = "探索任务类型参数错误";
StrVal.ERRCODE[PErrCode.animalFairyland_explore_task_id_repetition] = "探索任务id重复";
StrVal.ERRCODE[PErrCode.animalFairyland_explore_task_not_exist] = "无此探索任务";
StrVal.ERRCODE[PErrCode.animalFairyland_explore_task_not_done] = "探索任务未完成";
StrVal.ERRCODE[PErrCode.animalFairyland_explore_task_bonuses_took] = "探索任务奖励已领取";
StrVal.ERRCODE[PErrCode.animalFairyland_goods_id_repetition] = "代金券商品id重复";
StrVal.ERRCODE[PErrCode.animalFairyland_rank_order_error] = "排名配置序号错误";
StrVal.ERRCODE[PErrCode.animalFairyland_pet_quality_error] = "侠侣品质类型错误";
StrVal.ERRCODE[PErrCode.animalFairyland_pump_count_not_enough] = "代金券抽取次数不足";
StrVal.ERRCODE[PErrCode.animalFairyland_crystal_not_enough] = "水晶不足";
StrVal.ERRCODE[PErrCode.animalFairyland_pool_not_score] = "积分池无积分";
StrVal.ERRCODE[PErrCode.animalFairyland_team_not_exist] = "无此队伍";
StrVal.ERRCODE[PErrCode.animalFairyland_slot_not_exist] = "此队伍无此槽位";
StrVal.ERRCODE[PErrCode.animalFairyland_pet_battled] = "此侠侣已上阵";
StrVal.ERRCODE[PErrCode.animalFairyland_not_battle_pet] = "各队伍未有上阵侠侣";
StrVal.ERRCODE[PErrCode.animalFairyland_captain_pet_not_battle] = "此侠侣不能上队长槽位";
StrVal.ERRCODE[PErrCode.theurgyAbhiseca_gift_id_repetition] = "礼包id重复";
StrVal.ERRCODE[PErrCode.theurgyAbhiseca_gift_pay_id_repetition] = "充值礼包的充值id重复";
StrVal.ERRCODE[PErrCode.theurgyAbhiseca_gift_not_exist] = "礼包不存在";
StrVal.ERRCODE[PErrCode.theurgyAbhiseca_gift_need_pay] = "礼包需要走充值";
StrVal.ERRCODE[PErrCode.theurgyAbhiseca_gift_not_enough] = "礼包数量不足";
StrVal.ERRCODE[PErrCode.theurgyAbhiseca_task_type_not_exist] = "任务类型不存在";
StrVal.ERRCODE[PErrCode.theurgyAbhiseca_task_type_params_error] = "任务类型参数错误";
StrVal.ERRCODE[PErrCode.theurgyAbhiseca_task_id_repetition] = "任务id重复";
StrVal.ERRCODE[PErrCode.theurgyAbhiseca_task_not_exist] = "无此任务";
StrVal.ERRCODE[PErrCode.theurgyAbhiseca_task_not_done] = "任务未完成";
StrVal.ERRCODE[PErrCode.theurgyAbhiseca_task_bonuses_took] = "任务奖励已领取";
StrVal.ERRCODE[PErrCode.theurgyAbhiseca_count_order_error] = "配置序号错误";
StrVal.ERRCODE[PErrCode.theurgyAbhiseca_pump_count_bonuses_not_exist] = "无此抽取次数达标奖励";
StrVal.ERRCODE[PErrCode.theurgyAbhiseca_pump_bonuses_already_took] = "此次数达标奖励已领取";
StrVal.ERRCODE[PErrCode.theurgyAbhiseca_pump_bonuses_not_done] = "此次数达标奖励未完成";
//SERVER_END}
