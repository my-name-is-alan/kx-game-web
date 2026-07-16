-- 错误码id需要顺序排号  每个功能占用100个错误码
-- 系统功能错误码 < 10000
-- 活动错误码 101*100+自增
-- 运营活动错误码 1*100000+clasz*100+自增
local errorcode = {
    param_error                             = 1, --参数错误
    cannot_create_ingame                    = 2, --当前不可创建角色
    char_is_exist                           = 3, --角色已经存在
    server_is_maintenance                   = 4,--服务器禁止登录
    user_platform_err                       = 5,--平台错误
    user_sex_error                          = 6,--性别错误
    user_serverid_err                       = 7,--区服错误
    user_string_errorlen                    = 8,--账号长度非法
    name_has_exist                          = 9,--名字已经存在
    userid_has_black                        = 10,--账号有空格
    name_has_black                          = 11,--名字有空格
    userid_len_err                          = 12,--账号长度错误
    server_version_error                    = 13,--版本号错误
    user_state_error_noentry                = 14,--用户状态错误
    user_login_ing                          = 15,--正在登录中
    user_login_nochar                       = 16,--还未有角色
    user_data_error                         = 17,--用户数据错误
    user_player_forbit                      = 18,--用户禁止登录
    user_not_ingame                         = 19,--账号不存在
    chat_content_len_err                    = 20,--聊天内容长度非法
    chat_too_frequent                       = 21,--发送消息过于频繁
    unknown_error                           = 24,--未知错误
    item_not_exist                          = 25,--道具不足
    item_num_no_enough                      = 26,--需要的物品数量不够
    user_exit_ing                           = 27,--您正在退出游戏
    player_not_exist                        = 28, -- 玩家不存在

    master_server_close                     = 29,--跨服已关闭
    master_server_cmd_error                 = 30,--跨服命令错误
    item_split_num_err                      = 31,--物品分割数量错误
    item_split_num_no_enough                = 32,--物品分割数量不足

    space_no_enough                         = 33,--空间不足
    mail_title_length_error                 = 34,--邮件标题长度错误
    mail_content_length_error               = 35,--邮件内容长度错误
    mail_send_max_count_error               = 36,--邮件已到最大发送数量
    mail_not_exist                          = 37,--邮件不存在

    data_error                              = 38,--数据错误
    user_outgame_ing                        = 39,--正在排队退出
    loginserver_stoped                      = 40,--登录服务器关闭
    name_cannot_blank                       = 41,--名字不能为空
    name_too_long                           = 42,--名字太长啦
    name_has_sensitive_word                 = 43,--名字含有敏感词
    birthday_time_error                     = 44,--生日错误
    ad_count_not_enough                     = 45,--广告次数不足
    ad_at_cd                                = 46,--广告处于CD
    please_upgrade_version                  = 51,--请升级版本
    player_not_rename_num                   = 52,--超出每日更名次数限制

    room_create_param_error                 = 61,--创建房间参数错误
    room_player_is_in_room                  = 62,--角色已经在房间中
    room_has_no_owner                       = 63,--没有房主
    room_playerId_error                     = 64,--角色ID错误
    room_level_error                        = 65,--退出房间错误
    room_state_error                        = 66,--房间状态错误

    level_not_enough                        = 67, --等级不足

    --聊天
    chat_content_illegality                 = 68,--聊天内容非法
    chat_player_not_online                  = 69,--聊天对象不在线
    chat_send_to_self                       = 70,--聊天对象不能是自己
    chat_coolingTime                        = 71,--聊天冷却中
    chat_channel_close                      = 72,--聊天频道未开放
    chat_player_not_clan                    = 73,--还未加入帮派

    chat_blacklist_not                      = 74,--此人已不在黑名单
    chat_blacklist_has                      = 75,--已拉黑
    chat_blacklist_limit                    = 76,--已达到拉黑上限

    -- 激活码
    activationCode_not_exist                = 81, -- 无此激活码
    activationCode_used                     = 82, -- 激活码已使用
    activationCode_not_used                 = 83, -- 玩家已使用过此批次激活码
    activationCode_expired                  = 84, -- 激活码已过期
    activationCode_channel_error            = 85, -- 非此渠道专属激活码
    activationCode_vip_error                = 86, -- vip专属激活码

    -- 消耗结构
    cost_string_empty                       = 100, -- 消耗数据为空
    cost_type_error                         = 101, -- 消耗类型错误
    cost_size_error                         = 102, -- 消耗数据数组个数错误
    cost_proto_not_exist                    = 103, -- 消耗数据原型ID不存在

    -- 奖励 消耗
    bonus_drop_must_totalRate_or_aloneRate  = 142, -- 奖励掉落模式需为累计/独立随机
    bonus_string_error                      = 143, -- 奖励数据错误
    bonus_string_empty                      = 144, -- 奖励数据为空
    bonus_type_error                        = 145, -- 奖励类型错误
    bonus_size_error                        = 146, -- 奖励数据数组个数错误
    bonus_proto_not_exist                   = 147, -- 奖励数据原型ID不存在
    bonus_drop_must_aloneRate               = 148, -- 奖励掉落模式需为独立随机
    bonus_round_must_once                   = 149, -- 奖励回合数需为1次
    bonus_rate_must_drop                    = 150, -- 奖励概率需必掉

    globalReward_id_error                   = 151, -- 全服补偿奖励ID错误
    globalReward_time_error                 = 152, -- 全服补偿奖励时间错误
    globalReward_title_error                = 153, -- 全服补偿奖励邮件标题错误
    globalReward_content_error              = 154, -- 全服补偿奖励邮件内容错误
    globalReward_attaches_error             = 155, -- 全服补偿奖励邮件附件错误
    globalReward_id_not_exist               = 156, -- 全服补偿奖励ID不存在

    -- 循环公告
    recycleNotice_time_error                = 157, -- 循环公告时间错误
    recycleNotice_interval_error            = 158, -- 循环公告间隔时间错误
    recycleNotice_content_error             = 159, -- 循环公告内容错误
    recycleNotice_id_error                  = 160, -- 循环公告id错误或已有
    recycleNotice_id_not_exist              = 161, -- 循环公告id不存在

    mail_receiver_not_self                  = 162,--邮件接收者不能是发送者

    take_bonuses_is_nill                    =163,--奖励为空
    take_bonuses_id_type_error              =164,--奖励ID类型错误
    take_bonuses_droptype_diff              =165,--奖励ID类型错误,不同的掉落类型
    take_bonuses_str_error                  =167,--奖励ID错误,不是字符串

    -- 道具
    item_used_already_max                   = 201, -- 道具使用数量已达上限
    item_chest_choose_error                 = 202, -- 选择宝箱无此选择
    item_not_chest                          = 203, -- 不是宝箱
    rank_bonuses_has_taked                  = 204,--排行榜奖励已经领取过
    rank_has_no_reached                     = 205,--排行榜奖励还未达成
    rank_has_taked                          = 206,--暂无排行榜奖励可领

    -- 背包
    bag_space_no_enough                     = 221, -- 背包空间不足
    mail_not_take                           = 222,--邮件还未领取附件
    register_reach_max                      = 223,--角色注册达到最大
    item_cannot_use                         = 224,--物品不可使用

    money_not_enough                        = 243,--云英不足
    physical_not_enough                     = 244,--体力不足
    stone_not_enough                        = 287,--玉璧不足
    buy_physical_count_max                  = 288,--已达到最大体力购买次数
    character_not_contain                   = 289,--人物未获得
    avatar_not_contain                      = 290,--头像未获得
    avatar_border_not_contain               = 291,--头像框未获得
    chatBubble_not_contain                  = 292,--聊天气泡未获得
    title_not_contain                       = 293,--称号未获得

    bag_item_not_enough                     = 301,--物品背包空间不足
    bag_personalization_not_enough          = 302,--人物个性化背包空间不足
    bag_hero_not_enough                     = 303,--英雄背包空间不足
    bag_equip_not_enough                    = 304,--装备背包不足
    bag_pet_not_enough                      = 305,--侠侣背包空间不足

    --新手引导
    newguide_not_exist                      = 450,--引导不存在
    newguide_is_done                        = 451,--引导已经完成
    newguide_order_not_done                 = 452,--顺序引导不能完成
    newguide_cannot_take                    = 453,--当前引导不能领取奖励
    newguide_is_finished                    = 456,--引导已经完成
    newguide_has_no_bonuses                 = 457,--当前引导没有奖励
    rebate_has_not_enough_chance            = 460,--暂无更多可领取的代金券

    --兑换
    exchange_not_id                         = 500,--兑换ID不存在

    goldfinger_is_max                       = 510, --暂无新的金手指
    goldfinger_replace_quality_error        = 511, --不能替换当前品质的
    goldfinger_has_no_ablity                = 512, --暂无对应金手指功能
    goldfinger_max_level                    = 513, --金手指已到最大等级
    goldfinger_do_not_gain                  = 514, --还没有获得金手指
    goldfinger_pet_replace_max              = 515, --侠侣替换次数已经使用完
    goldfinger_elite_replace_max            = 516, --门客碎片替换次数已经使用完
    goldfinger_equip_max                    = 517, --超过金手指兑换装备上限
    goldfinger_replace_theurgy_quality_error   = 518,--不能兑换当前品质的碎片
    goldfinger_replace_theurgy_max          = 519, --超过碎片最大兑换次数

    --邮件
    mail_list_empty                         = 600,--邮件列表为空
    mail_candelete_isnull                   = 601,--暂无可删除的邮件
    mail_has_not_bonuses                    = 602,--暂无可领取奖励的邮件
    mail_already_took                       = 603,--邮件奖励已经领取
    mail_system_send_forbidden              = 604,--普通客户端永久禁止发送系统邮件
    mail_expired                            = 605,--邮件奖励已过期并清理

    --关卡
    stage_not_exist                         = 701,--关卡不存在
    stage_challenge_fail                    = 702,--关卡挑战失败
    stage_not_reach_level                   = 703,--未达到该关卡
    stage_level_cleared                     = 704,--关卡已通关

    --侠侣
    pet_max_star                            = 750,--超过最大星不能传功
    pet_not_exist                           = 751,--侠侣不存在
    pet_not_summon                          = 752,--侠侣未上阵
    pet_not_same_protoid                    = 753,--不同种类另种不可传功
    pet_is_locked                           = 754,--侠侣已锁定
    pet_level_is_max                        = 755,--侠侣已到达最高等级
    pet_not_set_pity_pet                    = 756,--未设置保底侠侣
    pet_protoid_error                       = 757,--非侠侣原型
    pet_not_recruitingPets                  = 757,--招募侠侣不在招募列表
    pet_backpackCapacity_is_max             = 758,--侠侣背包已到达最高等级
    pet_not_devour_summon_pet               = 759,--不可以传功上阵侠侣
    pet_already_recruit                     = 760,--招募列表次槽位已招募
    pet_ads_not_enough                      = 761,--广告次数不足

    pet_clear_skill_not_error               = 770,--洗炼侠侣错误
    pet_clear_skill_not_pet                 = 771,--洗炼侠侣不存在
    pet_clear_skill_not_buff                = 772,--洗炼侠侣没有技能可以保存
    pet_clear_skill_not_lock_buff           = 773,--洗炼侠侣锁定技能失败
    pet_clear_skill_not_level               = 773,--洗炼侠侣有达到指定等级不能洗炼

    pet_con_bonuse_not_exist                = 774,-- 奖励不存在




    --派遣
    explore_take_not_repository                 = 800,--没有对应的任务库
    explore_take_not_repository_taskid          = 801,--任务库没有对应的任务
    explore_take_repeat                         = 802,--不能重复接派遣任务
    explore_take_done                           = 803,--派遣任务已经完成
    explore_take_not_enough_hero                = 804,--派遣英雄数量不足
    explore_take_not_cond                       = 805,--派遣条件没有满足
    explore_take_not_hero                       = 806,--没有对应的英雄
    explore_take_hero_isExplore                 = 807,--英雄已经派遣出去了
    explore_take_not_costTime                   = 808,--时间未到不能领取奖励
    explore_take_not_taskdone                   = 809,--没有完成不能领奖
    explore_not_level                           = 810,--等级不存在
    explore_level_max                           = 811,--已经达到最大等级了
    explorecoin_not_enough                      = 812,--派遣币不足
    explorebar_not_enough                       = 813,--派遣栏不足
    explorebar_repeat_hero                      = 814,--重复的英雄
    explore_take_not_bonuse                     = 815,--没有奖励可以领取

    --商城
    shop_not_item                               = 901,--商品不存在
    shop_not_unlock                             = 902,--商品没有解锁
    shop_buy_max                                = 903,--已达到购买次数上限
    shop_buy_daymax                             = 904,--已达到每日购买次数上限
    shop_insufficient_remaining_quantity        = 905,--商品剩余数量不足



    --消耗不足
    chestblock_not_enough                        = 1101,--宝箱碎片不足
    takecardblock_not_enough                     = 1102,--抽卡碎片不足

    --门客
    bag_elite_monster_not_enough                = 1201,--背包空间不足
    elite_monster_teamid_num_error              = 1202,--队伍编号错误
    elite_monster_absent                        = 1203,--未拥有门客
    elite_monster_not_repeat_activity           = 1204,--不可重复激活
    elite_monster_not_exist                     = 1205,--门客不存在
    elite_monster_not_activity                  = 1206,--门客未激活
    elite_monster_has_full_level                = 1207,--已满级
    elite_monster_encyclopedia_not_exist        = 1208,--图鉴不存在
    elite_monster_condition_not_met             = 1209,--激活条件未达到
    elite_monster_encyclopedia_has_full_level   = 1210,--图鉴已满级
    elite_position_not_unlock                   = 1211,--槽位未解锁
    elite_monster_not_repeat_deploy             = 1212,--不可重复上阵
    elite_monster_daily_recruit_max             = 1213,--已达到每日招募次数上限
    elite_monster_reward_not_exist              = 1214,--奖励不存在
    elite_monster_reward_not_select_item        = 1215,--奖励缺少自选精怪
    elite_monster_reward_quality_err            = 1216,--门客品质错误

   
    --镖局
    haven_mouse_count_error                     = 1251,--超出上阵数量
    haven_mouse_not_enough                      = 1252,--空闲镖师数量不足
    haven_resource_being_collected              = 1253,--不能同时收集同一玩家的多个资源
    haven_resource_id_not_enough                = 1254,--资源不存在
    haven_resource_being_collected_others       = 1255,--不能同时收集同一玩家的多个资源
    haven_mouse_count_same                      = 1256,--已经有相同数量镖师在采集
    haven_not_refresh_resource                  = 1257,--没有可刷新资源
    haven_special_resource_cannot_collected     = 1258,--特殊资源暂时不可抢夺
    haven_player_not_exist                      = 1259,--玩家镖局不存在
    haven_not_refresh_time                      = 1260,--未到刷新时间
    haven_ad_refresh_count_max                  = 1261,--广告刷新次数到达上限
    haven_treasureData_progress_not_reach       = 1262,--神像进度未完成
    haven_treasureData_non_reactivation         = 1263,--神像不能重复激活
    haven_treasureData_not_duble_collection     = 1264,--神像不能重复领取
    haven_treasureData_not_activation           = 1265,--神像未激活
    haven_player_not_enter                      = 1266,--未进入镖局
    haven_train_level_max                       = 1267,--训练已经到达最高等级
    haven_server_start_date_unvalid             = 1268,--未达到自动采集开启日期
    haven_start_trial_is_used                   = 1269,--试用采集已使用
    haven_auto_collection_expired               = 1270,--自动采集已过期
    haven_over_grade                            = 1271,--设置自动采集等级超过物品最大等级
    haven_item_not_auto_collection              = 1272,--此物品不可以自动采集
    haven_item_is_auto_collection               = 1273,--自动采集已经开启了
    haven_resource_being_collected_others_exsit = 1274,--其他玩家正在采集

    -- 基金
    funds_not_done                              = 1301,    -- 基金不存在

    --对话
    talk_group_not_exist                        = 1401, --没有对话组
    talk_select_not_exist                       = 1402, --选项不存在
    talk_select_not_execinfo                    = 1403, --没有对话信息
    talk_select_max                             = 1404, --超过选项最大值
    talk_select_pos                             = 1405, --选项位置错误
    talk_select_is_have                         = 1406, --还有选项没有选择
    talk_select_group_not_exist                 = 1407, --选项对话组不存在
    talk_jump_not_group                         = 1410, --跳转失败，没有对应的组
    talk_jump_not_pos                           = 1411, --跳转失败，没有对应的位置
    talk_group_finish                           = 1420, --对话组已经完成了

    --GM命令
    gm_hero_stage_level_err                     = 2001,--设置英雄精英等级错误
    gm_hero_break_level_err                     = 2002,--设置英雄突破等级错误
    gm_hero_level_err                           = 2003,--设置英雄等级错误
    gm_hero_skill_level                         = 2004,--设置英雄技能等级错误

    --使用物品
    use_item_not_hero                           = 3001,--没有选择的英雄
    use_item_not_select_hero                    = 3002,--找不指定的英雄

    --好友
    friends_get_serach_page_err                 = 40001,--获得搜索分页信息失败
    friends_get_serach_page_max                 = 40002,--已经达到搜索分页最大值
    friends_get_serach_not_pageinfo             = 40003,--找不不到对应分页信息
    friends_get_serach_name_isnull              = 40004,--搜索名字为空
    friends_apply_fail_exist                    = 40005,--申请好友失败!已经在对方列表
    friends_apply_friend_max                    = 40006,--申请好友失败!对方好友上限

    friends_addfriend_not_search                = 40012,--增加好友失败!搜索不到玩家
    friends_addfriend_not_searchpage            = 40013,--增加好友失败!搜索页没玩家
    friends_addfriend_not_searchplayer          = 40014,--增加好友失败!找不到指定玩家
    friends_addfriend_not_self                  = 40015,--增加好友失败!不能增加自己为好友
    friends_addfriend_exist_apply_err           = 40016,--增加好友失败!已经在申请列表里
    friends_addfriend_exist_friend              = 40017,--增加好友失败!对方已经是你好友了
    friends_delfriend_not_friend                = 40018,--删除好友失败!不是对方好友
    friends_addfriend_is_friend                 = 40019,--增加好友失败!已是你好友

    friends_msg_not_friend                      = 40020,--发送消息失败!没好友数据
    friends_msg_not_friend_online               = 40021,--发送消息失败!好友不在线
    friends_msg_sensitive_word                  = 40023,--发送消息失败!含有敏感词

    friends_acceptfriend_not_apply              = 40030,--同意申请失败!找不到申请人

    --邮件
    email_id_not_exist                          = 41000,--邮件ID不存在
    --cluster
    remote_server_closed                    = 100000,--远程节点关闭
    remote_node_error                       = 100001,--远程节点错误





    -- 活动错误范围值(活动多  错误码范围要大  5200开始为每个活动错误码 每个活动占用100个错误码)
    activity_error_min                      = 5000, -- 活动错误码最小值

    activity_error_id                       = 5001,    -- ID必须在有效范围之内
    activity_id_used                        = 5002,    -- ID已经被使用
    activity_size32_error                   = 5003,    -- 字符长度必须在1到32之间
    activity_size4000_error                 = 5004,    -- 字符长度必须在1到4000之间
    activity_year_month_day_error           = 5005,    -- 年月日不正确
    activity_hour_min_sec_error             = 5006,    -- 时分秒不正确
    activity_start_dayu_end                 = 5007,    -- 开始时间不能晚于结束时间
    activity_week_format_error              = 5008,    -- 每周时间段格式不正确
    activity_week_start_dayu_end            = 5009,    -- 每周时间段中起始时间不能高于结束时间
    activity_day_format_error               = 5010,    -- 每天时间段格式不正确
    activity_day_value_error                = 5011,    -- 每天时间段数值不正确
    activity_day_start_dayu_end             = 5012,    -- 每天时间段中起始时间不能高于结束时间
    activity_json_error                     = 5013,    -- data json 数据错误
    activity_clasz_error                    = 5014,    -- clasz 无此类型活动
    activity_not_exist                      = 5015,    -- 活动不存在
    activity_not_dynamic_operation          = 5016,    -- 无法对非动态活动进行设置
    activity_state_value_error              = 5017,    -- 只能设置隐藏、启用、自动可见、可见状态
    activity_state_used                     = 5018,    -- 状态未变
    activity_not_state_rollback             = 5019,    -- 状态不能回滚
    activity_data_not_exist                 = 5020,    -- 玩家活动未参与
    activity_player_error                   = 5021,    -- 玩家错误(不在线)
    activity_opened_level_not_enough        = 5022,    -- 玩家参与活动等级不足
    activity_not_open                       = 5023,    -- 活动未开启
    activity_oppPlayer_level_not_enough     = 5024,    -- 目标玩家等级不足
    activity_finished                       = 5025,    -- 活动已完成
    activity_endtime_error                  = 5026,    -- 活动结束时间错误
    activity_time_end                       = 5027,     --活动已经结束
    activity_close                          = 5028,     --活动已经关闭
    -- dynamic data json check
    activity_not_table                      = 5100,    -- 不是table数据
    activity_not_hash                       = 5101,    -- 不是 Hash 数据
    activity_not_array                      = 5102,    -- 不是 Array 数据
    activity_array_len_error                = 5103,    -- 数组长度不在取值范围内
    activity_not_string                     = 5104,    -- 不是字符串
    activity_not_number                     = 5105,    -- 不是数字
    activity_number_error                   = 5106,    -- 不在取值范围内

    admin_protocol_not_exist                = 5107,    -- 管理协议不存在
    admin_param_error                       = 5108,    -- 参数错误
    startTime_error                         = 5109,    -- 开始时间错误

    --测试
    test_battle_not_elite                   = 6000,     --找不到对应的门客
    test_battle_not_eliteskill              = 6001,     --找不到门客对应的技能
    test_battle_new_eliteskill_fail         = 6002,     --门客技能创建失败
    test_battle_not_pet                     = 6003,     --找不到侠侣对应的技能
    test_battle_new_petskill_fail           = 6004,     --侠侣技能创建失败
    test_battle_battle_type_error           = 6005,     --战斗类型错误
    test_battle_not_monster                 = 6006,     --找不到怪物
    test_battle_not_entityAttr              = 6007,     --玩家属性错误
    test_battle_not_defenceEntity           = 6008,     --没有防守者数据
    test_battle_elite_skillid               = 6009,     --门客技能ID错误
    test_battle_pet_skillid                 = 6010,     --侠侣技能ID错误
    test_battle_not_defenceattr             = 6011,     --没有防守者属性
    test_battle_not_module                  = 6012,     --实体模块错误
    test_battle_divine_error                = 6013,     --绝技技能ID错误
    test_battle_create_monsterfail          = 6014,     --创建怪物失败
    test_battle_hp_not_nil                  = 6015,     --血量不能为0

    test_battle_not_defenceName             = 6021,     --没有防守者名字
    test_battle_not_defenceCharacter        = 6022,     --没有防守者角色
    test_battle_not_defenceAppearance       = 6023,     --没有防守者形象
    test_battle_not_defencePhase            = 6024,     --没有防守者阶段

    test_battle_not_attackEntity           = 6025,     --没有进攻者
    test_battle_not_attackEntityAttr       = 6026,     --没有进攻者属性数据

    test_battle_not_attackName             = 6031,     --没有攻击者名字
    test_battle_not_attackCharacter        = 6032,     --没有攻击者角色
    test_battle_not_attackAppearance       = 6033,     --没有攻击者形象
    test_battle_not_attackPhase            = 6034,     --没有攻击者阶段

    test_addEntityAttr_typeerror           = 6050,     --加属性类型错误


    -- 运营活动
    -- 1000002 超值礼包
    superGift_not_index                     = 10021,    -- 无此档次
    superGift_bought_index                  = 10022,    -- 已购买

    -- 1000003 累计充值
    totalRecharge_not_index                 = 10031,    -- 无此档次
    totalRecharge_bought_index              = 10032,    -- 已购买
    totalRecharge_not_recharge_index        = 10033,    -- 无此累计档次
    totalRecharge_took_index                = 10034,    -- 已领取
    totalRecharge_recharge_not_enough       = 10035,    -- 累计充值不足

    -- 1000005 问卷调查
    questionnaire_already_finished          = 10050,    -- 已完成问卷

    -- 1000006 单笔充值
    singleRecharge_not_pay                  = 10060,    -- 未充值
    singleRecharge_not_take_count           = 10061,    -- 无领取次数
    singleRecharge_not_pay_money            = 10062,    -- 无此充值金额

    --签到活动
    activity_login_get_sign_reward          = 10071,    -- 签到奖励已经领取
    activity_login_not_sign_reward          = 10072,    -- 没有签到奖励

    --抽卡活动
    activity_take_card_not_pool             = 10100,    --没有对应卡池
    activity_take_card_not_cardgroup        = 10101,    --没有对应的卡组
    activity_take_card_not_card             = 10102,    --没有对应的卡牌
    activity_take_card_not_repeatdata       = 10103,    --不能重抽
    activity_take_card_not_repeatmax        = 10104,    --重抽次数最大
    activity_take_card_repeat               = 10105,    --请重抽
    activity_take_card_not_cost             = 10106,    --消耗不足
    activity_take_card_day_take_max         = 10107,    --当日抽卡上限
    activity_take_card_not_repeatcard       = 10108,    --没有重抽卡牌
    activity_take_card_not_take             = 10109,    --请先抽卡
    cardcoin_not_enough                     = 10110,    --抽卡币不足
    activity_take_card_not_costitem         = 10111,    --抽卡道具不足
    activity_take_card_get_repeat           = 10112,    --请获得重抽卡牌
    activity_take_card_seriestake           = 10113,    --必须10连抽

    --开宝箱
    activity_open_chest_not_type            = 10201,    --这类的宝箱不存在
    activity_open_chest_not_num             = 10202,    --这类的宝箱数量不足
    activity_open_chest_not_chest           = 10203,    --找不到宝箱

    --在线奖励

    activity_online_not_id                  = 10301,    --奖励不存在
    activity_online_not_endTime             = 10302,    --时间没到不能领取
    activity_online_end                     = 10303,    --已经领取过奖励
    activity_online_all_not_bonuse          = 10304,    --一键领取失败，没有奖励可以领取


    --异兽入侵
    activity_invasion_not_num               = 10400,    --已无战斗次数

    --角色长成
    player_grow_evolve_upgrading            = 10500,    --正在升级中
    player_grow_below_level                 = 10501,    --角色未达到突破等级
    player_evolution_stamina_not_found      = 10502,    --体力消耗不正确
    player_evolution_stamina_below_level    = 10503,    --需要解锁鱼塘更高等级
    player_grow_breakthrough_below_combat   = 10504,    --战力未达到突破要求
    player_evolution_max_level              = 10505,    --目前已经是鱼塘最高等级
    player_grow_evolve_no_upgrading         = 10506,    --鱼塘未在升级
    player_grow_below_exp                   = 10507,    --角色未达到突破等级经验
    player_grow_phase_upper                 = 10508,    --角色突破等级已达到上限
    player_grow_breakthrough_task_not_finish= 10509,    --角色突破任务未完成

    --装备
    equip_forge_not_empty                   = 10600,    --装备锤炼区已满
    equip_forge_not_found                   = 10601,    --装备找不到了
    equip_breakdown_empty                   = 10602,    --无装备可分解
    equip_forge_frequent_ops                = 10603,    --操作过于频繁
    equip_forge_item_not_enough             = 10604,    --【枸杞】数量不足

    --灵脉
    vein_gems_pending_not_empty             = 10700,    --有意念需要处理
    vein_gems_not_match                     = 10701,    --没有匹配的意念
    vein_gems_not_found                     = 10702,    --意念找不到了
    vein_gems_discard_empty                 = 10703,    --无意念可遗忘
    vein_excite_frequent_ops                = 10704,    --操作过于频繁
    vein_learn_level_max                    = 10705,    --悟道等级已达到最高
    vein_level_max                          = 10706,    --修行等级已达到最高

    --坊市
    shop_buy_count_max                      = 10801,   --商铺购买已达最大次数
    open_server_day_not_reach               = 10802,    --开服天数不够
    shop_buy_condition                      = 10803,   --商铺物品购买条件未开启
    bazaar_voucher_only                     = 10804,   --坊市普通购买额度已满，请使用代金券
    bazaar_normal_only                      = 10805,   --坊市尚未进入代金券购买阶段
    bazaar_daily_limit                      = 10806,   --坊市每日购买数量已达上限
    --任务
    task_bonuses_cannot_take                = 551,--当前任务奖励不可领取
    task_has_no_task                        = 552,--当前没有此任务
    task_must_gt_maintask_id                = 553,--必须大于当前主线任务id

    --妖王挑战
    challenge_not_open                      =10901,     --心魔试炼关卡未开启
    challenge_not_pass                      =10902,     --心魔试炼关卡没通过
    challenge_not_item                      =10903,     --心魔试炼关卡不存在
    challenge_not_quickcnt                  =10904,     --心魔试炼快速通关已用完
    challenge_not_passdone                  =10905,     --心魔试炼已经通过了
    challenge_not_unlock                    =10906,     --心魔试炼关卡未解锁
    challenge_not_quickcntmax               =10907,     --心魔试炼快速通关已达到上限

    --兽友
    companion_no_unlock                     =11001,     --兽友未解锁
    companion_unlocked                      =11002,     --兽友已解锁
    companion_using_liking_item_empty       =11004,     --没有好感度物品
    companion_duel_player_not_enough        =11005,     --玩家等级不够
    companion_duel_liking_not_enough        =11006,     --好感度等级不够
    companion_explore_ten_level_no          =11007,     --十连游历等级不够
    companion_explore_stamina_not_enough    =11008,     --游历体力不足
    companion_not_exist                     =11009,     --该兽友不存在
    companion_insufficient_unlock           =11010,     --解锁兽友条件不足
    companion_skin_not_exist                =11011,     --该皮肤不存在
    companion_skin_no_unlock                =11012,     --该皮肤未解锁
    companion_skin_not_found                =11013,     --未拥有该皮肤
    companion_skin_max_level                =11014,     --皮肤已达到最高等级
    companion_explore_no_companion          =11015,     --需要解锁兽友方可游历

    -- 系统开启
    activation_sys_insufficient             =11200, --该系统未开启

    -- 绝技
    theurgy_not_match                       =11300, --未匹配秘籍
    theurgy_not_own                         =11301, --未拥有此秘籍
    theurgy_catalog_not_found               =11302, --未找到该秘籍图鉴
    theurgy_phase_max                       =11303, --目前阶段已是最高
    theurgy_frag_not_enough                 =11304, --碎片不足
    theurgy_slot_not_found                  =11305, --未有该槽位
    theurgy_catalog_max_level               =11306, --图鉴等级已是最高
    theurgy_catalog_insufficient_phase      =11307, --图鉴阶段不够
    theurgy_level_not_enough                =11308, --秘籍等级不够
    theurgy_slot_not_enough                 =11309, --秘籍印记槽位不够
    theurgy_seal_not_found                  =11310, --未有该印记
    theurgy_max_level                       =11311, --秘籍等级已达到最高
    theurgy_seal_amount_not_enough          =11312, --印记数量不足
    theurgy_slot_no_seal                    =11313, --该槽位没有装备印记
    theurgy_seal_no_set                     =11314, --该印记未设置
    theurgy_type_not_found                  =11315, --未找到该类型
    theurgy_not_reset                       =11316, --秘籍无需重置
    theurgy_catalog_insufficient            =11317, --图鉴未集齐
    theurgy_max_level_by_phase              =11318, --已达到该阶段最高等级
    theurgy_not_special_bonuses             =11319, --没有奖励可以领取



    --华山论剑
    qunyin_challenge_item_not_enough       = 12100, --挑战令数量不足
    qunyin_cannot_challenge_self           = 12101, --不能挑战自己
    qunyin_opp_is_not_in_list              = 12102, --对手不在自己的挑战列表中
    qunyin_refresh_opp_first               = 12103, --请先刷新对手
    qunyin_has_no_score                    = 12104, --当前没有任何积分
    qunyin_shop_buy_max                    = 12105, --商店兑换已达最大次数
    qunyin_score_not_enough                = 12106, --积分不够
    qunyin_has_no_achievement              = 12107, --当前没有完成任何成就
    qunyin_has_not_reach_achievement       = 12108, --还没有完成当前成就
    qunyin_has_taked_achievement           = 12109, --已经领取过该成就
    qunyin_buybook_max                     = 12110, --购买论剑挑战书次数已达最大
    qunyin_refresh_count_max               = 12111, --论剑刷新次数已达最大
    qunyin_cannot_quick_low_player         = 12112, --不能速战比自己排名高的对手
    qunyin_not_in_server_group             = 12113, --当前不在华山论剑跨服分组中
    qunyin_has_no_challenge_log            = 12114, --无挑战记录

    --充值
    pay_gift_not_option                    = 12200, --当前礼包不是自选礼包
    pay_is_not_in_this_op                  = 12201, --不是当前自选礼包的物品
    pay_money_error                        = 12202, --下单金额不对
    pay_item_count_error                   = 12203,--请选择正确的自选物品
    pay_can_not_pay_gift                   = 12204,--你当前不能充值该礼包
    pay_buy_gift_max                       = 12205, --今日礼包购买次数已达最大
    pay_gift_type_error                    = 12206, --礼包类型错误
    pay_gift_id_error                      = 12207, --礼包ID错误
    pay_id_error                           = 12208, --充值档次错误
    pay_gift_subtype_error                 = 12209, --礼包组子类型错误
    pay_month_card_taked                   = 12210, --已经领取今日的月卡
    pay_life_card_taked                    = 12211, --已经领取今日的终生卡
    pay_has_no_monthcard                   = 12212, --你当前还没有月卡
    pay_has_no_lifecard                    = 12213, --你当前还没有终生卡
    pay_id_not_exist                       = 12214, -- 充值id不存在
    pay_life_card_has_exist                = 12215, -- 已充值过终生卡
    pay_item_system_error                  = 12216, -- 自选物品系统未开启
    pay_firstgift_cannot_take              = 12217, --当前礼包还不能领取
    weekcard_free_taked                    = 12218,--已领取今日周卡
    weekcard_has_not_pay                   = 12219,--暂无周卡
    weekcard_has_take_all                  = 12220,--周卡奖励已经全部领取
    week_card_has_not_expired              = 12221,--周卡还未到期
    pay_has_no_elitemonstercard            = 12223,--你当前还没有门客终身卡
    pay_elitemonster_card_taked            = 12224,--已经领取今日的门客奖励
    elitemonster_card_has_exist            = 12225,--精怪终身卡只能购买一次
    pet_card_has_exist                     = 12226,--侠侣终身卡只能购买一次
    theurgy_card_has_exist                 = 12227,--秘籍终身卡只能购买一次
    pay_has_no_petcard                     = 12228,--你当前还没有侠侣终身卡
    pay_has_no_theurgycard                 = 12229,--你当前还没有秘籍终身卡
    pay_pet_card_taked                     = 12230, --已经领取今日的侠侣奖励
    pay_theurgy_card_taked                 = 12231, --已经领取今日的秘籍奖励
    hdhive_not_bound                       = 12240, -- 未绑定 HDHive 账号
    hdhive_rebind_required                 = 12241, -- HDHive 授权已失效，请重新绑定
    hdhive_points_price_missing            = 12242, -- 该商品未配置积分价格
    hdhive_points_insufficient             = 12243, -- HDHive 积分不足
    hdhive_debit_failed                    = 12244, -- HDHive 扣积分失败
    hdhive_deliver_failed                  = 12245, -- 发货失败（已尝试退款）
    hdhive_voucher_only                    = 12246, -- HDHive积分只能购买代金券，请先购买代金券




    open_rank_cannot_take                  = 12260, --当前没有奖励可领取
    open_rank_donot_reach                  = 12261, --你当前还没有上榜

    xy_fuli_not_open                       = 12300, --还未开启风云录福利
    xy_score_not_enougth                   = 12301, --风云录积分不够
    xy_fuli_taked                          = 12302, --风云录福利已经领取过了
    xy_take_today_free_bonuses             = 12303,--已领取今日免费风云录福利
    xy_pay_count_not_enougth               = 12304,--风云录充值次数不足
    xy_has_take_fl                         = 12305,--已经领取过该风云录奖励
    chance_not_enough                      = 12306, --代金券不足
    pay_cannot_pay_chance                  = 12307, --代金券不能购买代金券
    welfare_can_not_take                   = 12308, --当前状态不可领取每日福利
    welfare_take_max                       = 12309, --已达到今日最大领取次数
    gift_group_error                       = 12310, --礼包组ID错误

    -- 七日签到
    signed_in                               =11800, --当日签到已完成

    -- 坐骑
    mount_is_open                           =11400, --坐骑系统已开启
    task_not_finish                         =11401, --任务未完成
    mount_not_open                          =11402, --坐骑系统未开启
    mount_unlocked                          =11403, --坐骑已解锁
    mount_clothes                           =11404, --皮肤已解锁
    mount_not_level                         =11405, --等级不足
    item_wrong_sum                          =11406, --物品数量错误
    mount_level_max                         =11407, --坐骑已达最大等级
    mount_not_unlocked                      =11408, --坐骑未解锁
    mount_not_clothes                       =11409, --皮肤未解锁

    -- 人物个性化
    character_not_found                     =11500, --不存在该角色
    character_not_unlock                    =11501, --未解锁
    character_not_unlock_claim              =11502, --不能通过解锁获得
    character_unlocked                      =11503, --已解锁
    character_max_level                     =11504, --最达到最高等级

    -- 镇妖塔
    tower_is_open                           =11600, --激流塔已开启
    tower_not_open                          =11601, --激流塔未开启
    tower_buff_num                          =11602, --BUFF选择次数未用完
    tower_max_tier                          =11603, --目前已是最大关卡
    tower_not_buff                          =11604, --BUFF选择次数已用完

    -- 帮派
    clan_have                               =11700, --已有帮派
    clan_not_have                           =11701, --未加入帮派
    clan_forbidden                          =11702, --无权限操作
    clan_not_exist                          =11703, --帮派不存在
    clan_member_not_exist                   =11704, --帮派查无此人
    clan_kick_myself                        =11705, --无法踢出自己
    clan_member_no_apply                    =11706, --该成员并未申请
    clan_member_not_opt_myself              =11707, --不能对自己应用此操作
    clan_rejoin_need_time                   =11708, --需要一些时间才能加入帮派
    clan_full                               =11709, --帮派已满员
    clan_goods_not_exist                    =11710, --不存在该商品
    clan_goods_buy_limit                    =11711, --超出购买次数限制
    clan_text_has_sensitive_word            =11712, --内容存在敏感词
    clan_same_name                          =11713, --已有同名帮派
    clan_apply_exist                        =11714, --已发送过申请，请耐心等待帮派处理
    clan_phase_not_enough                   =11715, --帮派阶段不够
    clan_level_not_enough                   =11716, --帮派等级不够
    clan_member_has_clan                    =11717, --该玩家已有帮派
    clan_player_phase_not_enough            =11718, --未达到帮派要求的最低阶段
    clan_apply_full                         =11719, --帮派申请列表已满
    clan_flag_not_have                      =11710, --未拥有该帮派旗帜
    clan_merchant_not_exist                 =11721, --西域商人未出现
    clan_merchant_not_bargain               =11722, --未砍价
    clan_merchant_already_bargain           =11723, --已砍价
    clan_merchant_already_buy               =11724, --已购买
    clan_merchant_expire                    =11725, --西域商人已消失
    clan_evolve_finish                      =11726, --该玩家鱼塘已完成升级，无须协助
    clan_evolve_help_count_limit            =11727, --已达最大协助次数
    clan_not_suitable_join                  =11728, --暂无合适帮派
    clan_duel_max_buff_count                =11729, --布阵已达到最大次数
    clan_duel_buff_done                     =11730, --今日已布阵
    clan_new_member_can_not                 =11731, --加入帮派第二天可参与活动
    clan_duel_no_duel_count                 =11732, --今日挑战次数已用尽
    clan_duel_defeat_all                    =11733, --挑战怪物已全部击败
    clan_no_reward_claim                    =11734, --无可领取奖励
    clan_role_limit                         =11735, --职位已达到上限
    clan_duel_not_open                      =11736, --禁地挑战未开放
    clan_evolve_not_help                    =11737, --无需协助
    clan_evolve_repeat_req                  =11738, --已发起协助
    clan_evolve_repeat                      =11739, --已协助
    clan_evolve_not_myself                  =11740, --不能协助自己
    clan_point_not_enough                   =11741, --帮派贡献不足
    clan_glory_not_enough                   =11742, --战功不足
    clan_rate_not_enough                    =11743, --九幽秘宝不足
    clan_recharge_not_open                  =11744, --帮派充值活动尚未开启
    clan_name_len_limit                     =11745, --帮派名字过长
    clan_notice_len_limit                   =11746, --帮派公告过长
    clan_declaration_len_limit              =11747, --帮派宣言过长
    clan_name_empty                         =11748, --帮派名字不能为空
    clan_notice_empty                       =11749, --帮派公告不能为空
    clan_declaration_empty                  =11750, --帮派宣言不能为空

    -- 成就
    achievement_all_finish                  =11800, --成就任务已全部完成
    achievement_has_no_task                 =11801, --当前没有此成就任务
    achievement_not_finish                  =11802, --当前成就任务未完成

    --江湖擂台
    duel_opponent_no_in_list                = 11900,    --对手不在名单内
    duel_not_duel_myself                    = 11901,    --不能与自己对决

    -- 八荒
    conquest_closed                         = 13000, --活动已关闭
    conquest_finish                         = 13001, --活动已结束
    conquest_no_enroll_time                 = 13002, --非报名时间
    conquest_can_not_repeat_enroll          = 13003, --不能重复报名
    conquest_can_not_attack                 = 13004, --不能发起攻击
    conquest_no_fight_time                  = 13005, --非战斗时间
    conquest_not_start                      = 13006, --活动尚未开启
    conquest_scene_no_create                = 13007, --场景未创建
    conquest_no_in_scene                    = 13008, --不在场景内
    conquest_player_not_enter_scene         = 13009, --玩家没进入场景
    conquest_task_not_finish                = 13010, --任务无法完成
    conquest_no_reward_claim                = 13011, --无法领取奖励
    conquest_no_finish_time                 = 13012, --非领奖时间
    conquest_no_player_in_clan              = 13013, --在该帮派查无此人
    conquest_not_revive                     = 13014, --目前无法重振
    conquest_liked                          = 13015, --已点赞

    -- =14000

    -- 琅琊榜
    palace_goods_already_buy                = 15000, --已达到购买次数
    palace_no_player                        = 15001, --虚位以待
    palace_not_in_palace                    = 15002, --没有上榜
    palace_like_today_already               = 15003, --今日已点赞
    palace_like_already                     = 15004, --已点赞
    palace_grant_today_already              = 15005, --今日已赐福
    palace_no_grant                         = 15006, --此人未赐福
    palace_grant_expire                     = 15007, --赐福已过期
    palace_grant_not_myself                 = 15008, --不能对自己赐福点赞
    
    -- 单刀赴会
    clan_solo_already_buy                   = 16000, --已购买
    clan_solo_no_join                       = 16001, --未获取活动参与资格
    clan_solo_passport_already_has          = 16002, --已购买礼包
    clan_solo_buy_limit                     = 16003, --已达到购买次数上限
    clan_solo_prestige_not_enough           = 16004, --声望不足
    clan_solo_once_prestige_not_enough      = 16005, --本轮声望不足
    clan_solo_no_reward_claim               = 16006, --无法领取奖励
    clan_solo_physical_not_enough           = 16007, --体力不足
    clan_solo_not_buy_buff                  = 16008, --无法购买属性加成
    clan_solo_not_fight_opponent            = 16009, --无法与该玩家战斗
    clan_solo_not_start                     = 16010, --活动尚未开启
    clan_solo_no_finish_state               = 16011, --活动未到结算期
    clan_solo_no_fight_state                = 16012, --活动未到战斗期
    clan_solo_repeat_like                   = 16013, --请勿重复点赞
    clan_solo_not_in_fight                  = 16014, --未成功进入战斗
    clan_solo_already_buff                  = 16015, --无法重复购买属性加成
    clan_solo_fighting                      = 16016, --上一轮战斗未结束
    clan_solo_physical_full                 = 16017, --体力已满
    clan_solo_energy_not_enough             = 16018, --精力不足
    clan_solo_not_found_clan                = 16019, --匹配帮派失败
    clan_solo_no_buff                       = 16020, --请先选择属性加成
    clan_solo_not_found_record_by_list      = 16021, --未找到对应战报
    clan_solo_not_found_record              = 16022, --战报不存在
    clan_solo_can_not_challenge             = 16023, --无法发起挑战
    clan_solo_can_not_quick_fight           = 16024, --未满足一键挑战条件
    clan_solo_not_fight_my_clan             = 16025, --不能挑战自己帮派

    -- 灵泉
    spring_not_in_server_group              = 17000, -- 当前不在灵泉跨服分组中
    spring_not_in                           = 17001, -- 不在灵泉场景中
    spring_is_open                          = 17002, -- 灵泉已开启
    spring_not_redbag                       = 17003, -- 无红包可领取
    spring_not_pos_power                    = 17004, -- 位置权限设置错误
    spring_not_room                         = 17005, -- 房间不存在
    spring_is_power_pos                     = 17006, -- 权限位置需申请落座
    spring_not_score                        = 17007, -- 精粹不足
    spring_is_protect_time                  = 17008, -- 玩家在保护时间内无法挑战
    spring_not_leave_time                   = 17009, -- 玩家已有灵泉暂时无法离席
    spring_not_apply                        = 17010, -- 该位置无需申请
    spring_not_battle                       = 17011, -- 该位置无法抢夺
    spring_has_apply                        = 17012, -- 您尚有入座申请未被处理
    spring_not_player_list                  = 17013, -- 该位置没有玩家申请
    spring_not_consent_player               = 17014, -- 该玩家未提交申请
    spring_not_player                       = 17015, -- 该位置没有玩家
    spring_not_power_pos                    = 17016, -- 非权限位置无法驱逐玩家
    spring_not_share                        = 17017, -- 无分享次数

    --莽荒妖域
    domain_monster_not_monster              = 18001,--找不到怪物
    domain_monster_not_done_zoneLevel       = 18003,--当前区域不能升级
    domain_monster_not_energy               = 18004,--体力不足
    domain_monster_not_open                 = 18005,--活动未开启
    domain_monster_not_openTime             = 18006,--活动未开启
    domain_monster_is_exit_monster          = 18007,--当前区域怪物没打完
    domain_monster_is_not_monster           = 18008,--当前区域找不到怪物
    domain_monster_is_not_cd                = 18009,--战斗冷却中
    domain_monster_is_exit_event            = 18010,--还有事件没有完成
    domain_monster_is_not_event             = 18011,--没有区域事件可以完成
    domain_monster_is_not_special           = 18012,--当前区域找不到特殊事件
    domain_monster_is_max_level             = 18013,--已经到达最高层
    domain_monster_is_not_monstermark       = 18015,--没有怪物可以标记
    domain_monster_is_die                   = 18016,--标记怪物已死亡先领奖励
    domain_monster_is_matchingplayer_notinfo         = 18017,--没有玩家信息
    domain_monster_is_not_skip                          =18018,--当前状态不能绕过
    domain_monster_is_not_clan                          =18019,--没有帮派
    domain_monster_is_help_battle_time                  =18020,--助战冷却中
    domain_monster_is_help_not_monster                  =18021,--没有协助的怪物
    domain_monster_is_help_not_monster_bonuses          =18022,--没有协助的怪物不能领奖
    domain_monster_is_help_not_monster_die              =18023,--怪物没有死亡不能领取奖励
    domain_monster_is_help_cd                           =18024,--助战冷却中
    domain_monster_is_help_maxcnt                       =18025,--助战次数上限
    domain_monster_is_help_isDie                        =18026,--标记怪物已死亡请去领取奖励
    domain_monster_is_player_leave                      =18027,--玩家已离开
    domain_monster_is_not_rand                          =18028,--没有排行奖励
    domain_monster_is_take_rank                         =18029,--排行奖励已经领取
    domain_monster_is_gift_buy_max                      =18030,--礼包购买上限
    domain_monster_is_silver_not                        =18031,--银宝箱不足
    domain_monster_is_gold_not                          =18032,--金宝箱不足
    domain_monster_is_not_gift                          =18033,--礼包不存在
    domain_monster_is_is_monstermark                    = 18034,--已经标记过了
    domain_monster_is_not_battle_not_mark               = 18035,--先打过一次才能标记
    domain_monster_is_mark_monster_die                  = 18036,--标记怪物已死亡请去领取奖励
    domain_monster_is_not_add                           = 18037,--活动不在指定时间进入
    domain_monster_is_task_bonuses_nil                  = 18038,--没有任务奖励
    domain_monster_is_not_task_done                     = 18039,--任务未完成
    domain_monster_is_not_task                          = 18039,--任务奖励不可以领取
    domain_monster_is_task_done                         = 18040,--任务奖励已经领取
    -- 攻城略地
    siege_not_in_server_group               = 19000, -- 当前不在攻城略地跨服分组中
    siege_prepare                           = 19001, -- 备战阶段无法进入
    siege_fight                             = 19002, -- 战斗阶段无法进入
    siege_settle                            = 19003, -- 结算阶段无法进入
    siege_apply                             = 19004, -- 报名阶段无法进入
    siege_tower_is_open                     = 19005, -- 宝箱已开启
    siege_tower_not_next                    = 19006, -- 无法进入下一层
    siege_not_clan                          = 19007, -- 帮派未参加活动
    siege_player_not_clan                   = 19008, -- 玩家未在活动帮派中
    siege_not_group                         = 19009, -- 不在同一个分组
    siege_not_stamina                       = 19010, -- 玩家体力已耗尽
    siege_clan_is_destroy                   = 19011, -- 帮派已被击破
    siege_not_donateCount                   = 19012, -- 捐献次数不足
    siege_not_state                         = 19013, -- 当前状态无法进入

    -- 运营活动(100000开始)
    -- 1000001 开服庆典
    openCelebration_score_bonuses_repetition            = 100101,    -- 累计积分奖励重复
    openCelebration_exchange_id_repetition              = 100102,    -- 兑换id重复
    openCelebration_payId_repetition                    = 100103,    -- 充值id重复
    openCelebration_task_type_not_exist                 = 100104,    -- 任务类型不存在
    openCelebration_task_type_params_error              = 100105,    -- 任务类型参数错误
    openCelebration_task_id_repetition                  = 100106,    -- 任务id重复
    openCelebration_task_not_exist                      = 100107,    -- 无此任务
    openCelebration_task_not_done                       = 100108,    -- 任务未完成
    openCelebration_task_bonuses_took                   = 100109,    -- 任务奖励已领取
    openCelebration_score_bonuses_took                  = 100110,    -- 此累计积分奖励已领取
    openCelebration_score_bonuses_not_exist             = 100111,    -- 此累计积分奖励不存在
    openCelebration_goods_exchange_not_exist            = 100112,    -- 兑换商品不存在
    openCelebration_goods_exchange_count_not_enough     = 100113,    -- 商品兑换次数不足
    openCelebration_goods_exchange_score_not_enough     = 100114,    -- 兑换商品的积分不足
    openCelebration_pay_bonuses_not_exist               = 100115,    -- 无此档次礼包奖励
    openCelebration_pay_bonuses_take_not_enough         = 100116,    -- 此档次礼包奖励领取次数不足
    openCelebration_score_not_enough                    = 100117,    -- 积分不足

    -- 1000002 运势
    fortune_draw_count_bonuses_repetition               = 100201,    -- 累计抽取奖励重复
    fortune_goods_id_repetition                         = 100202,    -- 抽取商品id重复
    fortune_gift_id_repetition                          = 100203,    -- 礼包id重复
    fortune_gift_pay_id_repetition                      = 100204,    -- 充值礼包的充值id重复
    fortune_task_type_not_exist                         = 100205,    -- 任务类型不存在
    fortune_task_type_params_error                      = 100206,    -- 任务类型参数错误
    fortune_task_id_repetition                          = 100207,    -- 任务id重复
    fortune_task_not_exist                              = 100208,    -- 无此任务
    fortune_task_not_done                               = 100209,    -- 任务未完成
    fortune_task_bonuses_took                           = 100210,    -- 任务奖励已领取
    fortune_count_bonuses_took                          = 100211,    -- 此累计抽取奖励已领取
    fortune_count_bonuses_not_exist                     = 100212,    -- 此累计抽取奖励不存在
    fortune_total_score_not_enough                      = 100213,    -- 累计抽取次数不足
    fortune_score_not_enough                            = 100214,    -- 如意签不足
    fortune_gift_not_exist                              = 100215,    -- 礼包不存在
    fortune_gift_need_pay                               = 100216,    -- 礼包需要走充值
    fortune_gift_not_enough                             = 100217,    -- 礼包数量不足

    -- 1000003 轮回殿
    reincarnationHall_gift_id_repetition                = 100301,    -- 礼包id重复
    reincarnationHall_gift_pay_id_repetition            = 100302,    -- 充值礼包的充值id重复
    reincarnationHall_gift_not_exist                    = 100303,    -- 礼包不存在
    reincarnationHall_gift_need_pay                     = 100304,    -- 礼包需要走充值
    reincarnationHall_gift_not_enough                   = 100305,    -- 礼包数量不足
    reincarnationHall_task_type_not_exist               = 100306,    -- 任务类型不存在
    reincarnationHall_task_type_params_error            = 100307,    -- 任务类型参数错误
    reincarnationHall_task_id_repetition                = 100308,    -- 任务id重复
    reincarnationHall_task_not_exist                    = 100309,    -- 无此任务
    reincarnationHall_task_not_done                     = 100310,    -- 任务未完成
    reincarnationHall_task_bonuses_took                 = 100311,    -- 任务奖励已领取

    -- 1000004 门客历练
    gremlinExperience_gift_id_repetition                = 100401,    -- 礼包id重复
    gremlinExperience_gift_pay_id_repetition            = 100402,    -- 充值礼包的充值id重复
    gremlinExperience_gift_not_exist                    = 100403,    -- 礼包不存在
    gremlinExperience_gift_need_pay                     = 100404,    -- 礼包需要走充值
    gremlinExperience_gift_not_enough                   = 100405,    -- 礼包数量不足
    gremlinExperience_task_type_not_exist               = 100406,    -- 任务类型不存在
    gremlinExperience_task_type_params_error            = 100407,    -- 任务类型参数错误
    gremlinExperience_task_id_repetition                = 100408,    -- 任务id重复
    gremlinExperience_task_not_exist                    = 100409,    -- 无此任务
    gremlinExperience_task_not_done                     = 100410,    -- 任务未完成
    gremlinExperience_task_bonuses_took                 = 100411,    -- 任务奖励已领取
    gremlinExperience_rank_order_error                  = 100412,    -- 排名配置序号错误
    gremlinExperience_monster_init_error                = 100413,    -- 初始怪物id错误
    gremlinExperience_monster_not_exist                 = 100414,    -- 怪物id不存在
    gremlinExperience_monster_not_find                  = 100415,    -- 怪物id未找到
    gremlinExperience_monster_already_attack            = 100416,    -- 怪物已驱散
    gremlinExperience_monster_slot_not_enough           = 100417,    -- 上阵的门客数量不符合
    gremlinExperience_totalRecharge_money_not_exist     = 100418,    -- 此累充档次不存在
    gremlinExperience_totalRecharge_money_not_done      = 100419,    -- 此累充档次未完成
    gremlinExperience_totalRecharge_money_took          = 100420,    -- 此累充档次已领取
    gremlinExperience_qualityGroups_error               = 100421,    -- 品质组配置数据错误
    gremlinExperience_eliteMonster_id_repetition        = 100422,    -- 上阵的门客id重复
    gremlinExperience_attack_not_enough                 = 100423,    -- 讨伐次数不足
    gremlinExperience_eliteMonster_not_count            = 100424,    -- 门客无上阵次数

    -- 1000005 侠侣幻境
    animalFairyland_gift_id_repetition                  = 100501,    -- 礼包id重复
    animalFairyland_gift_pay_id_repetition              = 100502,    -- 充值礼包的充值id重复
    animalFairyland_gift_not_exist                      = 100503,    -- 礼包不存在
    animalFairyland_gift_need_pay                       = 100504,    -- 礼包需要走充值
    animalFairyland_gift_not_enough                     = 100505,    -- 礼包数量不足
    animalFairyland_task_type_not_exist                 = 100506,    -- 任务类型不存在
    animalFairyland_task_type_params_error              = 100507,    -- 任务类型参数错误
    animalFairyland_task_id_repetition                  = 100508,    -- 任务id重复
    animalFairyland_task_not_exist                      = 100509,    -- 无此任务
    animalFairyland_task_not_done                       = 100510,    -- 任务未完成
    animalFairyland_task_bonuses_took                   = 100511,    -- 任务奖励已领取
    animalFairyland_explore_task_type_not_exist         = 100512,    -- 探索任务类型不存在
    animalFairyland_explore_task_type_params_error      = 100513,    -- 探索任务类型参数错误
    animalFairyland_explore_task_id_repetition          = 100514,    -- 探索任务id重复
    animalFairyland_explore_task_not_exist              = 100515,    -- 无此探索任务
    animalFairyland_explore_task_not_done               = 100516,    -- 探索任务未完成
    animalFairyland_explore_task_bonuses_took           = 100517,    -- 探索任务奖励已领取
    animalFairyland_goods_id_repetition                 = 100518,    -- 代金券商品id重复
    animalFairyland_rank_order_error                    = 100519,    -- 排名配置序号错误
    animalFairyland_pet_quality_error                   = 100520,    -- 侠侣品质类型错误
    animalFairyland_pump_count_not_enough               = 100521,    -- 代金券抽取次数不足
    animalFairyland_crystal_not_enough                  = 100522,    -- 水晶不足
    animalFairyland_pool_not_score                      = 100523,    -- 积分池无积分
    animalFairyland_team_not_exist                      = 100525,    -- 无此队伍
    animalFairyland_slot_not_exist                      = 100526,    -- 此队伍无此槽位
    animalFairyland_pet_battled                         = 100527,    -- 此侠侣已上阵
    animalFairyland_not_battle_pet                      = 100528,    -- 各队伍未有上阵侠侣
    animalFairyland_captain_pet_not_battle              = 100529,    -- 此侠侣不能上队长槽位

    -- 1000006 绝技灌顶
    theurgyAbhiseca_gift_id_repetition                  = 100601,    -- 礼包id重复
    theurgyAbhiseca_gift_pay_id_repetition              = 100602,    -- 充值礼包的充值id重复
    theurgyAbhiseca_gift_not_exist                      = 100603,    -- 礼包不存在
    theurgyAbhiseca_gift_need_pay                       = 100604,    -- 礼包需要走充值
    theurgyAbhiseca_gift_not_enough                     = 100605,    -- 礼包数量不足
    theurgyAbhiseca_task_type_not_exist                 = 100606,    -- 任务类型不存在
    theurgyAbhiseca_task_type_params_error              = 100607,    -- 任务类型参数错误
    theurgyAbhiseca_task_id_repetition                  = 100608,    -- 任务id重复
    theurgyAbhiseca_task_not_exist                      = 100609,    -- 无此任务
    theurgyAbhiseca_task_not_done                       = 100610,    -- 任务未完成
    theurgyAbhiseca_task_bonuses_took                   = 100611,    -- 任务奖励已领取
    theurgyAbhiseca_count_order_error                   = 100612,    -- 配置序号错误
    theurgyAbhiseca_pump_count_bonuses_not_exist        = 100613,    -- 无此抽取次数达标奖励
    theurgyAbhiseca_pump_bonuses_already_took           = 100614,    -- 此次数达标奖励已领取
    theurgyAbhiseca_pump_bonuses_not_done               = 100615,    -- 此次数达标奖励未完成
}

return errorcode
