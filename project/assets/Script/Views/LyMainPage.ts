//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { LyMail } from "./LyMail";
import { StrVal } from "../Values/StrVal";
import { AudioManager } from "../Kernel/AudioManager";
import { VarVal } from "../Values/VarVal";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { LyDetailAttr, LyDetailAttrType } from "./LyDetailAttr";
import { BUILD_TYPE, PlatformAPI } from "../Kernel/PlatformAPI";
import { LyEvolution } from "./LyEvolution";
import { LyAttachEquip } from "./LyAttachEquip";
import { LyBreakStage } from "./LyBreakStage";
import { GameServer } from "../Kernel/GameServer";
import { LyGM } from "./LyGM";
import { LyDetailAttrEdit } from "./LyDetailAttrEdit";
import { LyAutomation } from "./LyAutomation";
import { LocaleData } from "../Kernel/LocaleData";
import { LyStage } from "./LyStage";
import { LyMount } from "./LyMount";
import { FguiGTween } from "../Kernel/FguiGTween";
import { LyActivityShop } from "./LyActivityShop";
import { LyVein } from "./LyVein";
import { LyEliteMonster } from "./LyEliteMonster";
import { LyChallengeList } from "./LyChallengeList";
import { sp, Vec2 } from "cc";
import { LyPet } from "./LyPet";
import { LyHomeList } from "./LyHomeList";
import { LyTheurgy } from "./LyTheurgy";
import { LyPayFirstGift } from "./LyPayFirstGift";
import { LyActivitySevenDays } from "./LyActivitySevenDays";
import { LyPayDailyWelfare } from "./LyPayDailyWelfare";
import { LySetting } from "./LySetting";
import { LyFairyGift } from "./LyFairyGift";
import { LyActivityRisingStar } from "./LyActivityRisingStar";
import { LyPayGiftGroup } from "./LyPayGiftGroup";
import { LyActivityOpenCelebration } from "./LyActivityOpenCelebration";
import { LyChatRoom } from "./LyChatRoom";
import { LyActivityReincarnationHall } from "./LyActivityReincarnationHall";
import { LyEliteAttack } from "./LyEliteAttack";
import { LyVeinChange } from "./LyVeinChange";
import { LyActivityFortune } from "./LyActivityFortune";
import { LyPsychicInsight } from "./LyPsychicInsight";
import { LyClanJoin } from "./LyClanJoin";
import { LyClan } from "./LyClan";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { GuideManager } from "../Kernel/GuideManager";
import { LyActivationOpen } from "./LyActivationOpen";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { LyFriendInvite } from "./LyFriendInvite";
import { AttachGameBehaviour } from "../Component/AttachGameBehaviour";
import { PalaceLikeData, LyPalaceLike } from "./LyPalaceLike";
import { LyBuddyMass } from "./LyBuddyMass";
import { LyDemonPath } from "./LyDemonPath";
import { LyGuideStart } from "./LyGuideStart";
import { PErrCode } from "../Values/PErrCode";
import { LyTreeRebate } from "./LyTreeRebate";
import { LyPaySevenGiftGroup } from "./LyPaySevenGiftGroup";
import { LyActivityOpenRank } from "./LyActivityOpenRank";
import { LyClanSolo } from "./LyClanSolo";
import { LyPlayerStronger } from "./LyPlayerStronger";
import { LyGoldFinger } from "./LyGoldFinger";
import { LyBrumeIsle } from "./LyBrumeIsle";
import { LyGrabCity } from "./LyGrabCity";
import { ConquestState, LyConquestSeek } from "./LyConquestSeek";
import { LyConquestSeekStart } from "./LyConquestSeekStart";
import { LocaleUser } from "../Kernel/LocaleUser";
import { LyPayExquisite, PayExquisitePage } from "./LyPayExquisite";
import { LyGoldFingerSucc } from "./LyGoldFingerSucc";

export enum MAINPAGE_ACTIVITY {
    SWITCH_SIMPLE, // 简缩按钮（把不重要的活动折叠）
    PAY_FIRSTGIFT, // 首充礼包
    PAY_ALL_RECHARGE, // 超值礼包（充值整合入口）
    ACTIVITY_SHOP, // 坊市
    SEVEN_DAYS, // 七日签到
    RISING_STAR, // 开服冲榜
    OPENCELEBRATION, // 开服庆典
    REINCARNATIONHALL, // 轮回殿
    FORTUNE, // 运势
    FAIRY_GIFT, // 仙缘
    PAY_GIFTGROUP, // 限时礼包组
    PAY_GIFTSEVEN, // 七天礼包组
    OPENRANK, // 开服排行
    FRIEND_INVITE, // 邀请好友
    ELITE_LL, // 精怪历练
    PSYCHIC, // 神通灌顶
    BUDDYMASS, // 伙伴集结
    DEMONPATH, // 妖途
    CLAN_SOLO, // 单刀赴会
    TREE_REBATE, // 聚宝盆
	BRUMEISLE, //雾隐岛
    CONQUEST, //八荒
    STRINGER, // 我要变强
    GRABCITY, // 攻城掠地
}

interface ActivityOpenInfo {
    type: MAINPAGE_ACTIVITY, // 类型
    icon: string, // 图标
    name: string, // 名字，可能有程序字
    activityId?: number, // 如果是运营活动或常规活动，则必须有
    params?: any, // 列表中每个项目的传参可以保存在这里
}

export class LyMainPage extends ViewLayer {

    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = "LyMainPage";
        this.viewResI.pkgName = "LyMainPage";
        this.viewResI.comName = "LyMainPage";
    }

    /**
     * 此时已经加入舞台。
     */
    private uiPanel: fgui.GComponent
    private list_activity: fgui.GList
    private btn_operate: fgui.GButton
    private img_equipArr: any[]
    private forgeSpeed: number = 1


    private list_equip: fgui.GList
    private playerbase: any
    private equipArr: any[]
    private automationData: any
    private isPlayNotice: boolean = false;
    private physical: string = LocaleData.getEvolutionRoot().staminaItemId
    private group_gemTip: fgui.GGroup
    private group_task: fgui.GComponent
    private loader_spine_automatic: fgui.GLoader3D
    private btn_pet: fgui.GButton
    private btn_gem: fgui.GButton
    private btn_mount: fgui.GButton
    private loader_elite: fgui.GButton
    private btn_theurgy: fgui.GButton
    private btn_treasure: fgui.GButton
    private group_chat: fgui.GComponent
    private btn_evolution: fgui.GButton
    private spine_mail: SpinePlayer
    private spine_veinAuto: SpinePlayer

    private btn_finger: fgui.GButton
    private finaniPlayer: SpinePlayer

    private rmPlayer: SpineRoldMountPlayer;
    private bar_exp: fgui.GProgressBar
    private label_money: fgui.GLabel

    // 测试代码
    private btn_testbattle: fgui.GButton
    private btn_gm: fgui.GButton
    private btn_restart: fgui.GButton
    public onViewCreate(params: any): void {
        AudioManager.playBGM(VarVal.AUDIO_SOURCE.BGM_MAIN);
        this.uiPanel = this.getUiPanel()
        // ######################################################## 测试功能代码 ########################################################
        this.btn_testbattle = this.uiPanel.getChild("btn_testbattle");
        this.btn_gm = this.uiPanel.getChild("btn_gm");
        this.btn_restart = this.uiPanel.getChild("btn_restart");
        this.btn_testbattle.onClick(() => {
            if (!PlatformAPI.isBinaryDebug()) return;
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDetailAttrEdit, 0, null);
        })
        this.btn_gm.onClick(() => {
            if (!PlatformAPI.isBinaryDebug()) return;
            // 弹出GM命令页面
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGM, 0, null);
        })
        this.btn_restart.onClick(() => {
            if (!PlatformAPI.isBinaryDebug()) return;
            UtilsUI.restartGame();
        })
        this.visibleTestMode();
        // ######################################################## 测试功能代码 ########################################################
        this.loader_spine_automatic = this.uiPanel.getChild("loader_spine_automatic")

        // 金手指
        this.btn_finger = this.uiPanel.getChild("btn_finger");
        this.btn_finger.visible = !PlatformAPI.isBinaryExamine();
        PointRedData.getInstance().registerPoint(this.btn_finger, PointRedType.LyGoldFinger);
        this.btn_finger.onClick(() => {
            let goldRoot = LocaleData.getGoldFingerRoot();
            let goldInfo = GameServerData.getInstance().getGoldFingerInfo();
            let remain = Number(goldRoot.forgeCountAddFinger) - goldInfo.forge;
            if (remain <= 0) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGoldFinger, 0, null);
            } else {
                // UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYGOLDFINGER.STR408, [remain]));
                GuideManager.startGuide({
                    guideType: VarVal.GUIDE_TYPE.KANSHU, // 砍树
                });
            }
        })
        this.finaniPlayer = new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            this.finaniPlayer = spp; // 如果是已存在缓存资源，那么会先执行回调，再赋值，这里要加一下。
            this.updataGoldFinger();
        }, this.btn_finger.getChild("loader_spine", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_jinshouzhi_z);

        //掉落概率升级
        this.btn_evolution = this.uiPanel.getChild("btn_evolution")
        this.btn_evolution.getChild("label_str11").text = StrVal.LYMAINPAGE.STR11
        this.btn_evolution.onClick(() => {
            // this.isForge = false
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEvolution, 0, null);
        })
        PointRedData.getInstance().registerPoint(this.btn_evolution, PointRedType.LyEvolution)

        //玩家角色红点
        let group_headtop: fgui.GComponent = this.uiPanel.getChild("group_headtop");
        PointRedData.getInstance().registerPoint(group_headtop, PointRedType.LySetting);
        //琅琊榜赐福红点
        PointRedData.getInstance().registerPoint(group_headtop.getChild("group_palace_point"), PointRedType.LyPalaceGrantTips);

        this.group_task = this.uiPanel.getChild("group_task");
        //---角色变化信息---
        this.img_equipArr = []
        for (let i = 0; i < 14; i++) {
            let img_equip: fgui.GComponent = this.uiPanel.getChild("img_equip" + i)
            let data = {
                cid: 0,
                item: img_equip
            }
            img_equip.visible = false
            img_equip.onClick(() => {
                let forgeEquips = GameServerData.getInstance().getPlayerFullInfo().forgeEquips
                for (let j = 0; j < forgeEquips.length; j++) {
                    if (this.img_equipArr[i].cid == forgeEquips[j].cid) {
                        this.pushLyAttachEquip({ equipIndex: j });
                    }
                }
            })
            this.img_equipArr.push(data)
        }


        this.bar_exp = this.uiPanel.getChild("bar_exp")
        this.label_money = this.uiPanel.getChild("label_money")
        this.loadInfo()
        //==========锤炼区装备===========

        this.onForgeEquips(1)
        // 增加钻石
        let btn_addchance: fgui.GButton = this.uiPanel.getChild("btn_addchance");
        if (PlatformAPI.isBinaryExamine() && PlatformAPI.isMiniGameOniOS()) {
            btn_addchance.visible = false;
        }
        btn_addchance.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.RECHARGE, type:VarVal.bonusType.chance});
        })
        // 增加钻石
        let btn_addstone: fgui.GButton = this.uiPanel.getChild("btn_addstone");
        if (PlatformAPI.isBinaryExamine() && PlatformAPI.isMiniGameOniOS()) {
            btn_addstone.visible = false;
        }
        btn_addstone.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.RECHARGE});
        })

        //---活动列表---
        this.list_activity = this.uiPanel.getChild("list_activity")
        this.initActivityList();
        this.initActivityRegEvent();

        //--任务--
        this.updataTask()
        //######################################################## 角色信息 ########################################################

        this.updataPlayerSkin()
        this.updataMountSkin()
        this.updataGoldFinger()


        new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, this.uiPanel.getChild("loader_spine_bg"), VarVal.UI_EFF.loader_spine_bg);

        // UtilsUI.loadSpineEffAndShow(this.uiPanel.getChild("loader_spine_river"), VarVal.UI_EFF.loader_spine_river, true);

        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            spp.playAnimation("stand", true);
        }, this.uiPanel.getChild("group_spine_heye", fgui.GComponent).getChild("loader_spine_heye"), "zq_heye")
        // PlatformAPI.loadSpine((asset: any) => {
        //     let loader_spine: fgui.GLoader3D = this.uiPanel.getChild("loader_spine_river");
        //     loader_spine.setScale(1, 1);
        //     // 底居中
        //     loader_spine.setSpine(asset, new Vec2(0.5, 1))
        //     let content: any = loader_spine.content; this.spineSke = content;
        //     this.spineSke.setEventListener((trackEntry: sp.spine.TrackEntry, event: sp.spine.Event) => {
        //         if (this.eventCall) {
        //             this.eventCall(trackEntry.animation.name, event.stringValue);
        //         }
        //     })
        //     this.spineSke.setCompleteListener((trackEntry: sp.spine.TrackEntry) => { // setEndListener触发不了？
        //         if (this.completeCall) {
        //             let completeCall = this.completeCall;
        //             this.completeCall = null;
        //             completeCall(trackEntry.animation.name);
        //         }
        //     })

        //     let ske: sp.Skeleton = <sp.Skeleton>loader_spine.content;
        //     ske.setAnimation(0, ske._skeleton.data.animations[0].name, true);
        // }, "cj_zhujiemian_hushui_3jie")
        //######################################################## 事件 ########################################################
        //砍树/钓鱼
        this.btn_operate.onClick(() => {
            if (GameServerData.getInstance().getItemCountByProtoId(this.physical) > 0) {
                if (this.restTime) {
                    this.clearTimeout(this.restTime)
                    this.restTime = null
                }
                if (!this.isForge) {
                    this.isForge = true
                    if (GameServerData.getInstance().getPlayerFullInfo().forgeEquips.length > 0) {
                        this.isForge = false
                        // if (this.automationData) {
                        //     this.loader_spine_automatic.visible = true
                        //     this.pushLyAttachEquip({ automation: true });
                        // } else {
                        this.pushLyAttachEquip(null);
                        // }
                    } else {
                        UtilsUI.loadSpineEffAndShow(this.btn_operate.getChild("loader_spine_forge"), VarVal.UI_EFF.loader_spine_forge, false);
                        this.automationData = null
                        this.loader_spine_automatic.visible = false
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                let call: Function = () => {
                                    if (args.itemInserts) {
                                        UtilsUI.showJumpItems({
                                            bonuseString:GameServerData.getInstance().bonusesResultsToString([{inserts:args.itemInserts}])
                                        });
                                    }
                                    if (args.dropReward && args.dropReward.inserts && args.dropReward.inserts.length > 0) {
                                        UtilsUI.showJumpItems({
                                            bonuseString: GameServerData.getInstance().bonusesResultsToString([args.dropReward])
                                        });
                                    }
                                    if (this.automationData) {
                                        // this.pushLyAttachEquip({ automation: true });
                                    } else {
                                        this.pushLyAttachEquip(null);
                                    }
                                }
                                let call1: Function = () => {
                                    this.isForge = false
                                    if (this.automationData) {
                                        this.onAutomation()
                                    }
                                }
                                this.onForgeAnimation(call, call1)
                            } else {
                                let call: Function = () => {
                                }
                                let call1: Function = () => {
                                    this.isForge = false
                                }
                                this.onForgeAnimation(call, call1)
                                if (args.errorcode == PErrCode.equip_forge_not_empty) {
                                    this.onForgeEquips(11)
                                }
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        }, "forge", {
                            count: 1
                        })
                    }
                } else {
                    if (!this.automationData) {
                        this.rmPlayer.getRolePlayer().setTimeScale(this.forgeSpeed * 2);
                    }
                    this.automationData = null
                    this.loader_spine_automatic.visible = false
                }
                // }
            } else {
                // this.isForge = false
                UtilsUI.showMsgTip(StrVal.LYMAINPAGE.STR8)
            }
        })
        //邮件
        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            this.spine_mail = spp
            // this.spine_mail.playAnimation("stand", true);
            this.refreshMail()
        }, this.uiPanel.getChild("loader_spine_mail"), "jm_zhujiemian_youjian")
        let btn_mail: fgui.GButton = this.uiPanel.getChild("btn_mail")
        btn_mail.text = StrVal.LYMAINPAGE.STR1
        btn_mail.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyMail, 0, null);
        })
        //进阶
        let btn_stage: fgui.GButton = this.uiPanel.getChild("btn_stage")
        PointRedData.getInstance().registerPoint(btn_stage, PointRedType.LyBreakStage);
        PointRedData.getInstance().registerPoint(btn_stage.getChild("group_break_point"), PointRedType.LyBreakStageBreak);
        btn_stage.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBreakStage, 0, null);
        })
        // 查看更多
        // let btn_detailAttr: fgui.GButton = this.uiPanel.getChild("btn_detailAttr")
        // btn_detailAttr.text = StrVal.LYMAINPAGE.STR5
        // btn_detailAttr.onClick(() => {
        //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDetailAttr, 0, { type: LyDetailAttrType.MAINPAGE });
        // })

        //装备
        this.list_equip = this.uiPanel.getChild("list_equip")
        let list_equip1: fgui.GList = this.uiPanel.getChild("list_equip1")
        let equipSlotArr = LocaleData.getSoltQualityProto("")
        list_equip1.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            obj.getChild("label_name").text = equipSlotArr[index].name
        }).bind(this)
        list_equip1.numItems = equipSlotArr.length
        this.list_equip.itemRenderer = this.renderListItem.bind(this);
        this.list_equip.numItems = 12
        this.group_task.getChild("img_di").onClick(() => {
            if (GameServerData.getInstance().getPlayerFullInfo().mainState == 2) {//可领取
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        this.loadInfo()
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                    }
                    else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "takeTaskBonuses", {
                    id: this.mainTaskId,
                });
            } else {
                let taskData: any = LocaleData.getTaskRoot(this.mainTaskId)
                if (taskData.conditionType == VarVal.MainTaskType.cutTree ||
                    taskData.conditionType == VarVal.MainTaskType.breakdown ||
                    taskData.conditionType == VarVal.MainTaskType.equip ||
                    taskData.conditionType == VarVal.MainTaskType.breakdownByMoney ||
                    taskData.conditionType == VarVal.MainTaskType.level) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.KANSHU, // 砍树
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.evolution) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.EVOLUTION, // 仙树升级
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.adventure ||
                    taskData.conditionType == VarVal.MainTaskType.adventureMax) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.CHALLENGE_STAGE,// 冒险
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.vehicleUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.MOUNT_LEVELUP,// 坐骑升级
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.animalUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.PET_LEVELUP,// 灵兽升级
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.animalCall) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.PET_CALL,// 灵兽召唤
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.mountainTrigger) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.VEIN_ACTIVE,// 激发灵脉
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.fight) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.DUEL_CHALLENGE,// 斗法挑战
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.challengeMonster) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.KING_MONSTER,// 挑战妖王
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.strangeAnimalInvade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.INVASION,// 异兽入侵
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.passTower) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.MONSTER_TOWER, // 镇妖塔
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.landGatherSelf) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.HAVEN_GET,// 福地采集
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.landGatherOthers) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.HAVEN_FINDOTHER,// 福地采集
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.havenNums) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.HAVEN_GETMOUSE,// 福地采集
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.gremlinCall) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.ELITE_CALL,// 召唤精怪
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.joinClan) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.CLAN,// 帮派
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.companionGift) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.COMPANION,// 兽友送礼
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.companionExplore) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.COMPANION_EXPLORE,// 兽友游历
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.gremlinActivite ||
                    taskData.conditionType == VarVal.MainTaskType.gremlinUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.ELITE,// 门客点击
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.stage) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.STAGE,// 武境界突破
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.summonPet) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.PET,// 上阵灵兽
                    });
                } else if (taskData.conditionType == VarVal.MainTaskType.share) {
                    UtilsUI.playerShareGame(() => {
                        UtilsUI.showMsgTip(StrVal.COMMON.STR101);
                    }, {
                        title: StrVal.COMMON.STR301,
                    })
                }
            }
        })

        //宠物
        this.btn_pet = this.uiPanel.getChild("btn_pet")
        this.btn_pet.getChild("label_name").text = LocaleData.getActivation(VarVal.SYSYTEM_ID.pet).name
        PointRedData.getInstance().registerPoint(this.btn_pet, PointRedType.LyPet);
        this.btn_pet.clearClick()
        this.btn_pet.onClick(() => {
            if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.pet)) {
                UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.pet)
                return
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPet, 0, null);
        })
        //灵脉
        this.btn_gem = this.uiPanel.getChild("btn_gem")
        this.btn_gem.getChild("label_name").text = LocaleData.getActivation(VarVal.SYSYTEM_ID.gem).name
        this.group_gemTip = this.uiPanel.getChild("group_gemTip")
        this.btn_gem.clearClick()
        this.btn_gem.onClick(() => {
            if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.gem)) {
                UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.gem)
                return
            }
            this.setGemTip(false)
            if (this.veinAutoTimeOut) {
                this.clearTimeout(this.veinAutoTimeOut)
                this.veinAutoTimeOut = null
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyVein, 0, null);
        })
        //坐骑
        this.btn_mount = this.uiPanel.getChild("btn_mount")
        PointRedData.getInstance().registerPoint(this.btn_mount, PointRedType.LyMount);
        this.btn_mount.getChild("label_name").text = LocaleData.getActivation(VarVal.SYSYTEM_ID.mount).name
        this.btn_mount.clearClick()
        this.btn_mount.onClick(() => {
            if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.mount)) {
                UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.mount)
                return
            }
            if (GameServerData.getInstance().isMountOpend()) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyMount, 0, null);
            } else {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyMount, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { upShowUi: true });
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "mountOpen", null);
            }
        })
        //精怪
        this.loader_elite = this.uiPanel.getChild("loader_elite")
        this.loader_elite.getChild("label_name").text = LocaleData.getActivation(VarVal.SYSYTEM_ID.elite).name
        this.loader_elite.clearClick()
        this.loader_elite.onClick(() => {
            if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.elite)) {
                UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.elite)
                return
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteMonster, 0, null);
        })
        PointRedData.getInstance().registerPoint(this.loader_elite, PointRedType.LyEliteMonster)
        //神通
        this.btn_theurgy = this.uiPanel.getChild("btn_theurgy")
        this.btn_theurgy.getChild("label_name").text = LocaleData.getActivation(VarVal.SYSYTEM_ID.theurgy).name
        this.btn_theurgy.clearClick()
        this.btn_theurgy.onClick(() => {
            if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.theurgy)) {
                UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.theurgy)
                return
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgy, 0, null);
        })
        PointRedData.getInstance().registerPoint(this.btn_theurgy, PointRedType.LyTheurgy)
        //法宝
        this.btn_treasure = this.uiPanel.getChild("btn_treasure")
        this.btn_treasure.getChild("label_name").text = StrVal.LYMAINPAGE.STR21
        this.btn_treasure.clearClick()
        this.btn_treasure.onClick(() => {
            UtilsUI.showMsgTip(StrVal.LYMAINPAGE.STR18);
        })
        this.loadShowUi()
        this.loadActivation()
        // 聊天
        this.group_chat = this.uiPanel.getChild("group_chat")
        this.group_chat.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyChatRoom, 0, { isNewMsgChannel: true });
        })
        this.showChatRoomLast();
    }

    private pushLyAttachEquip(params: any) {
        let isCanPush = true;
        if (ViewDispatcher.isViewExist(LyActivationOpen) || (ViewDispatcher.isViewExist(LyGuideStart) && LyGuideStart.isForce)) {
            isCanPush = false;
            if (LyAttachEquip.isGuideCanPush) {
                isCanPush = true;
            }
        }
        if (isCanPush) {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyAttachEquip, 0, params);
        }
    }

    /*
   *主界面功能ui
   */
    private loadShowUi(): void {
        this.loadAttr()
        if (GameServerData.getInstance().getProtoIdByItemInstId()) {
            let petData = LocaleData.getPetProto(GameServerData.getInstance().getProtoIdByItemInstId().protoId)
            if (petData) {
                let petModel = LocaleData.getModelItem(petData.modelId)
                if (petModel) {
                    this.btn_pet.icon = UtilsTool.stringFormat("ui://CCommon/{0}", [petModel.thumbnail]);
                }
                this.btn_pet.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR9, [GameServerData.getInstance().getProtoIdByItemInstId().level])
            }
        }

        let eliteMosterTeam = this.playerbase.eliteMonsterTeam[this.playerbase.eliteMonsterBattleTeamId - 1].eliteMonsterId.split(";")
        this.loader_elite.icon = ""
        this.loader_elite.getChild("loader_bg", fgui.GLoader).url = "";
        this.loader_elite.text = "";
        for (let index = 0; index < 3; index++) {
            let element = eliteMosterTeam[index];
            if (String(element) != "0") {
                let inst = GameServerData.getInstance().getEliteMonsterById(element)
                if (inst) {
                    let proto = LocaleData.getEliteMonsterProto(inst.protoId)
                    let level = inst.level
                    let eliteModel = LocaleData.getModelItem(proto.modelId)
                    if (eliteModel) {
                        this.loader_elite.icon = UtilsTool.stringFormat("ui://CCommon/{0}", [eliteModel.avatar]);
                        this.loader_elite.getChild("loader_bg", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [Number(proto.quality)]);
                    }
                    this.loader_elite.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR9, [level])
                    break;
                }
            }
        }
        let theurgies = GameServerData.getInstance().getPlayerFullInfo().theurgyInfo.theurgies
        let state1The = []
        for (let index = 0; index < theurgies.length; index++) {
            let element = theurgies[index];
            if (element.status == 1) {

                // break
                state1The.push(element)
            }
        }
        state1The.sort((a, b): number => {
            return a.type - b.type
        });
        if (state1The.length > 0) {
            let theProto = LocaleData.getTheurgyById(state1The[0].cfgId)
            this.btn_theurgy.icon = UtilsTool.stringFormat("ui://CCommon/zjm_{0}", [theProto.icon2]); //方icon
            this.btn_theurgy.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR9, [state1The[0].level])
        } else {
            this.btn_theurgy.icon = ""
            this.btn_theurgy.text = ""
        }
        if (GameServerData.getInstance().isMountOpend()) {
            let fullInfoMount = GameServerData.getInstance().getPlayerFullInfo().mount;
            let mountInfo = LocaleData.getMountShowResInfo(fullInfoMount.tid, fullInfoMount.cid);
            this.btn_mount.icon = UtilsTool.stringFormat("ui://CCommon/{0}", [mountInfo.thumbnail]);
            this.btn_mount.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR10, [fullInfoMount.stage, fullInfoMount.level])
        }
        let gem = GameServerData.getInstance().getPlayerFullInfo().veinInfo
        if (GameServerData.getInstance().getPlayerFullInfo().veinInfo.battleGems.length > 0) {
            this.btn_gem.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR9, [gem.veinLevel])
        } else {
            this.btn_gem.text = ""
        }
        if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.gem)) {
            if (GameServerData.getInstance().getPlayerFullInfo().veinInfo.battleGems.length > 0) {
                this.btn_gem.icon = "ui://CCommon/z_miji_Soul";
                let gem = GameServerData.getInstance().getPlayerFullInfo().veinInfo
                this.btn_gem.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR9, [gem.veinLevel])
            }
        }
    }
    /*
    *主界面系统显示
    */
    private loadActivation(): void {
        //自动
        let btn_automation: fgui.GButton = this.uiPanel.getChild("btn_automation")
        btn_automation.clearClick()
        btn_automation.onClick(() => {
            if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.automation)) {
                if (!GameServerData.getInstance().isHaveMonthCard()) {
                    UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.automation)
                    return
                }
            }
            this.automationData = null
            this.loader_spine_automatic.visible = false
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyAutomation, 0, null);
        })
        // 挑战
        let btn_challenge: fgui.GButton = this.uiPanel.getChild("btn_challenge")
        PointRedData.getInstance().registerPoint(btn_challenge, PointRedType.LyChallengeList);
        btn_challenge.clearClick()
        btn_challenge.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyChallengeList, 0, null);
        })
        //冒险
        let btn_adventure: fgui.GButton = this.uiPanel.getChild("btn_adventure")
        PointRedData.getInstance().registerPoint(btn_adventure, PointRedType.LyStage);
        let isAdventure: boolean = !GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.adventure)
        btn_adventure.grayed = isAdventure
        btn_adventure.clearClick()
        btn_adventure.onClick(() => {
            if (isAdventure) {
                UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.adventure)
                return
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyStage, 0, null);
        })
        //宠物
        let isPet: boolean = GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.pet)
        this.btn_pet.getChild("icon").visible = isPet
        this.btn_pet.getChild("title").visible = isPet
        //灵脉
        let isGem: boolean = GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.gem)
        this.btn_gem.getChild("icon").visible = isGem
        this.btn_gem.getChild("title").visible = isGem
        this.spine_veinAuto = new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            spp.clearTracks()
            this.btn_gem.getChild("loader_spineEff", fgui.GLoader3D).visible = false
        }, this.btn_gem.getChild("loader_spineEff", fgui.GLoader3D), "jm_xiuxing_zd");

        PointRedData.getInstance().registerPoint(this.btn_gem, PointRedType.LyVein)
        //坐骑
        let isMount: boolean = GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.mount)
        this.btn_mount.getChild("icon").visible = isMount
        this.btn_mount.getChild("title").visible = isMount
        //精怪
        let isElite: boolean = GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.elite)
        this.loader_elite.getChild("icon").visible = isElite
        this.loader_elite.getChild("title").visible = isElite

        //神通
        let istheurgy: boolean = GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.theurgy)
        this.btn_theurgy.getChild("icon").visible = istheurgy
        this.btn_theurgy.getChild("title").visible = istheurgy
        //法宝
        // this.btn_treasure.touchable = GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.treasure)
        let istreasure: boolean = GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.theurgy)
        this.btn_treasure.getChild("icon").visible = istreasure
        this.btn_treasure.getChild("title").visible = istreasure
        // 帮派
        let btn_clan: fgui.GButton = this.uiPanel.getChild("btn_clan")
        PointRedData.getInstance().registerPoint(btn_clan, PointRedType.LyClan);
        let isClan: boolean = !GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.clan)
        btn_clan.grayed = isClan
        btn_clan.clearClick()
        btn_clan.onClick(() => {
            if (isClan) {
                UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.clan)
                return
            }
            if (GameServerData.getInstance().isClanHas()) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClan, 0, null);
            } else {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanJoin, 0, null);
            }
        })
        // 家园
        let btn_home: fgui.GButton = this.uiPanel.getChild("btn_home")
        PointRedData.getInstance().registerPoint(btn_home, PointRedType.LyHomeList);
        btn_home.clearClick()
        btn_home.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyHomeList, 0, null);
        })
    }
    private refreshMail() {
        this.playerbase = GameServerData.getInstance().getPlayerFullInfo().base
        let mails = GameServerData.getInstance().getMails()
        let isShowRed = false
        for (let index = 0; index < mails.length; index++) {
            if (mails[index].state == 0) {
                isShowRed = true
                break
            }
        }
        if (this.spine_mail) {
            if (isShowRed) {
                this.spine_mail.playAnimation("stand_youjian", true);
            } else {
                this.spine_mail.playAnimation("stand", true);
            }
        }
    }
    private loadInfo(): void {
        this.onPlayerShow()
        this.onEquip()
        //--- 角色属性(货币) ---
        this.onPlayerAttrChanged()
        //--- 角色属性 ---
        this.loadAttr()
    }
    private onEquip(): void {
        this.equipArr = []
        let equipXmlArr: any[] = LocaleData.getSoltQualityProto("-1")
        equipXmlArr.forEach(item1 => {
            this.equipArr.push(GameServerData.getInstance().newEquipShowInst(item1.id));
        });
    }

    private onPlayerShow(): void {
        this.playerbase = GameServerData.getInstance().getPlayerFullInfo().base
        //角色名字
        let label_name: fgui.GLabel = this.uiPanel.getChild("label_name")
        label_name.text = this.playerbase.name
        //仙术等级
        this.btn_evolution.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR12, [this.playerbase.evolutionLevel])
        //角色头像
        let charInfo = LocaleData.getCharShowResInfoSelf();
        let group_headtop: fgui.GComponent = this.uiPanel.getChild("group_headtop");
        let group_head: fgui.GComponent = group_headtop.getChild("group_head");
        let loader_icon: fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
        let btn_frame: fgui.GButton = group_head.getChild("btn_frame");
        btn_frame.clearClick()
        btn_frame.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LySetting, 0, null);
        })
        //战斗力
        let label_combatPower: fgui.GLabel = this.uiPanel.getChild("label_combatPower")
        label_combatPower.text = UtilsTool.nToFStr(this.playerbase.combatPower);
    }
    private oldLevel: number = -1

    private onPlayerAttrChanged(): void {
        this.playerbase = GameServerData.getInstance().getPlayerFullInfo().base
        if (!this.playerbase) {
            return;
        }
        //升级信息
        let playerLevel: any = LocaleData.getPlayerGrowByLevel(this.playerbase.level)
        if (!playerLevel) {
            return;
        }
        //经验条
        if (this.bar_exp.value != this.playerbase.exp && this.oldLevel != -1) {
            UtilsUI.loadSpineEffAndShow(this.uiPanel.getChild("loader_spine_exp"), VarVal.UI_EFF.loader_spine_exp, false);
        }
        if (playerLevel.exp == "0") {
            this.bar_exp.value = 1;
        } else {
            this.bar_exp.max = playerLevel.exp
            this.bar_exp.value = this.playerbase.exp
        }
        //角色等级
        let label_level: fgui.GLabel = this.uiPanel.getChild("label_level")
        if (this.playerbase.level != this.oldLevel && this.oldLevel != -1) {
            this.btn_operate.touchable = false
            AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFF_PLAYER_LEVEL);
            new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                spp.playAnimation("stand", false, null, null, () => {
                    new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                        spp.playAnimation("stand", false, null, null, () => {
                            this.btn_operate.touchable = true
                        });
                    }, this.uiPanel.getChild("loader_spine_levelUp"), "ui_zhujiemian_jueseshengji")
                });
            }, this.uiPanel.getChild("loader_spine_upLevel"), "jm_zjm_shengji_1")
        }
        this.oldLevel = this.playerbase.level
        label_level.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR3, [this.playerbase.level, playerLevel.name])
        // 金竹
        let label_chance: fgui.GLabel = this.uiPanel.getChild("label_chance")
        label_chance.text = this.playerbase.chance;
        // 石头
        let label_stone: fgui.GLabel = this.uiPanel.getChild("label_stone")
        label_stone.text = this.playerbase.stone
        // 金币
        this.label_money.text = this.playerbase.money
        //体力 
        this.btn_operate = this.uiPanel.getChild("btn_operate")
        let label_physical: fgui.GLabel = this.btn_operate.getChild("label_physical")
        label_physical.text = GameServerData.getInstance().getItemCountByProtoId(this.physical).toString()
    }
    private onReachEquip(forgeEquip): boolean {
        if (forgeEquip && forgeEquip.attrs) {
            let battleAttrs: string[] = forgeEquip.attrs.split(",")
            let isReach: boolean = false
            if (this.automationData) {
                if (forgeEquip.quality >= this.automationData.quality) {//品阶大
                    if (this.automationData.isAnd) {
                        if (this.automationData.combatPower && forgeEquip.diffCombatPower > 0) {
                            //属性1点勾
                            if (this.automationData.isAttr1) {
                                if ((this.automationData.attr1.battleAttr == "-1" || battleAttrs[this.automationData.attr1.battleAttr] != "0")
                                    && (this.automationData.attr1.defenseAttr == "-1" || battleAttrs[this.automationData.attr1.defenseAttr] != "0")) {
                                    //弹出
                                    isReach = true
                                }
                            } else if (!this.automationData.isAttr2) {   //属性1未点勾 属性2也没点 默认进
                                isReach = true
                            }
                        }
                        if (this.automationData.combatPower && forgeEquip.diffCombatPower > 0) {
                            if (this.automationData.isAttr2) {  //属性2点勾
                                if ((this.automationData.attr2.battleAttr == "-1" || battleAttrs[this.automationData.attr2.battleAttr] != "0")
                                    && (this.automationData.attr2.defenseAttr == "-1" || battleAttrs[this.automationData.attr2.defenseAttr] != "0")) {
                                    isReach = true
                                }
                            } else if (!this.automationData.isAttr1) { //属性2未点勾 属性1也没点 默认进 
                                isReach = true
                            }
                        }
                    } else {
                        if (this.automationData.combatPower && forgeEquip.diffCombatPower > 0) {
                            //弹出
                            isReach = true
                        }
                        if (this.automationData.isAttr1) {
                            if ((this.automationData.attr1.battleAttr == "-1" || battleAttrs[this.automationData.attr1.battleAttr] != "0")
                                && (this.automationData.attr1.defenseAttr == "-1" || battleAttrs[this.automationData.attr1.defenseAttr] != "0")) {
                                //弹出
                                isReach = true
                            }
                        }
                        if (this.automationData.isAttr2) {  //属性2点勾
                            if ((this.automationData.attr2.battleAttr == "-1" || battleAttrs[this.automationData.attr2.battleAttr] != "0")
                                && (this.automationData.attr2.defenseAttr == "-1" || battleAttrs[this.automationData.attr2.defenseAttr] != "0")) {
                                isReach = true
                            }
                        }
                        if (!this.automationData.isAttr1 && !this.automationData.isAttr2 && !this.automationData.combatPower) {
                            isReach = true
                        }
                    }
                }
            }
            return isReach
        }
        return false
    }
    private isForge: boolean = false //正在砍树(用于判断 是否可点击按钮)
    private restTime //用于切换休息状态

    /**
     * 装备分解动画
     */
    private playBreakdownAni(item, groupStr: string): void {
        let gourp_boxExp = fgui.UIPackage.createObject(VarVal.PACKAGE_FGUIS.LyMainPage, groupStr).asCom;
        this.uiPanel.addChild(gourp_boxExp);
        let start = new Vec2(item.x, item.y);
        let end = new Vec2(this.bar_exp.x + this.bar_exp.width / 2, this.bar_exp.y);
        if (groupStr == "gourp_boxExp") {
            end = new Vec2(this.bar_exp.x + this.bar_exp.width / 2, this.bar_exp.y);
        } else {
            end = new Vec2(this.label_money.x, this.label_money.y);
        }
        UtilsUI.playCommonDropAni(() => {
            gourp_boxExp.removeFromParent();
        }, gourp_boxExp, start, UtilsTool.random(-100, 100), 150, end);
    }
    private onEquipsItem(): void {
        for (let i = 0; i < this.img_equipArr.length; i++) {
            const element = this.img_equipArr[i];
            element.item.visible = false
        }
    }
    /**
     *  锤炼区装备显示
     */
    private onForgeEquips(type: number, cid?: number): void {
        let forgeEquips = GameServerData.getInstance().getPlayerFullInfo().forgeEquips
        if (forgeEquips) {
            if (cid) {
                for (let i = 0; i < this.img_equipArr.length; i++) {
                    let item = this.img_equipArr[i];
                    if (item.cid == cid) {
                        item.cid = 0
                        let loader_spine_breakdown: fgui.GLoader3D = item.item.getChild("loader_spine_breakdown")
                        item.item.getChild("group_equip").visible = false
                        if (type != 7) {
                            for (let i = 0; i < 10; i++) {
                                this.playBreakdownAni(item.item, "gourp_boxExp")
                                this.playBreakdownAni(item.item, "gourp_boxMoney")
                            }
                            new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                                spp.playAnimation("stand", false, null, () => {
                                }, () => {
                                    item.item.getChild("group_equip").visible = true
                                    item.item.visible = false
                                    item.item.touchable = false
                                });
                            }, loader_spine_breakdown, "jm_zhuangbei_fenjie")
                        } else {
                            item.item.getChild("group_equip").visible = true
                            item.item.visible = false
                            item.item.touchable = false
                        }
                    }
                }
            } else {
                let start = new Vec2(this.uiPanel.getChild("loader_spine_rushui").x, this.uiPanel.getChild("loader_spine_rushui").y);
                for (let i = 0; i < forgeEquips.length; i++) {
                    let item1 = this.img_equipArr[i];
                    let item2 = forgeEquips[i];
                    if (type != 6) {
                        UtilsUI.playCommonDropAni(null, item1.item, start, UtilsTool.random(-100, 100), 100);
                    }
                    if (item2) {
                        let img_equip: fgui.GLoader = item1.item.getChild("img_equip")
                        let loader_spine_quality: fgui.GLoader3D = item1.item.getChild("loader_spine_quality")
                        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                            spp.playAnimation("zhuangbei", true);
                        }, loader_spine_quality, UtilsUI.getDiaoyuSpineName(item2.quality))
                        item1.item.visible = true
                        item1.item.touchable = true
                        img_equip.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getEquipProto(item2.cid).icon]);
                        item1.cid = item2.cid
                    }
                }
            }
        }
    }
    /**
    * 钓鱼播放动画 
    * call :钓上鱼回调
    * call1 ：钓完鱼放下杆回调。
    */
    private onForgeAnimation(call, call1): void {
        let quality: number = 0
        for (let i = 0; i < GameServerData.getInstance().getPlayerFullInfo().forgeEquips.length; i++) {
            let item = GameServerData.getInstance().getPlayerFullInfo().forgeEquips[i];
            if (item.quality > quality) {
                quality = item.quality
            }
        }
        let aniName1: string = VarVal.SPINE_FISHING_NAME.fishing_up_1
        let aniName2: string = VarVal.SPINE_FISHING_NAME.fishing_over_1_2
        let aniName3: string = VarVal.SPINE_FISHING_NAME.fishing_start_1 //甩勾
        let star: string = LocaleData.getEquipQualityProto(quality).star
        let aniCount: number = star == "0" ? quality : Number(star)
        // if (quality < 4) {
        //     aniName1 = VarVal.SPINE_FISHING_NAME.fishing_up_2_1
        //     aniName2 = VarVal.SPINE_FISHING_NAME.fishing_over_1_1
        //     aniCount = 1
        // } else if (quality < 7) {
        //     aniName1 = VarVal.SPINE_FISHING_NAME.fishing_up_2_2
        //     aniName2 = VarVal.SPINE_FISHING_NAME.fishing_over_1_1
        //     aniCount = quality - 3
        // } else if (quality < 10) {
        //     aniName1 = VarVal.SPINE_FISHING_NAME.fishing_up_2_3
        //     aniName2 = VarVal.SPINE_FISHING_NAME.fishing_over_1_2
        //     aniCount = quality - 6
        // } else {
        // }
        // let qualityIndex = 1
        let onAniName1: Function = () => {
            this.rmPlayer.getRolePlayer().playAnimation(aniName1, false, null, null, () => {//钓
                aniCount--
                if (aniCount > 0) {
                    onAniName1()
                } else {
                    new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                        spp.playAnimation(aniName1, false, null, null, () => {
                            spp.playAnimation("stand", true);
                        });
                    }, this.uiPanel.getChild("group_spine_heye", fgui.GComponent).getChild("loader_spine_heye"), "zq_heye")
                    this.rmPlayer.getRolePlayer().playAnimation(aniName2, false, null, null, () => {//起勾
                        call()
                        // this.rmPlayer.getRolePlayer().playAnimation(aniName3, false, null, null, () => {//甩勾
                        this.rmPlayer.getRolePlayer().setTimeScale(1);
                        this.rmPlayer.getRolePlayer().playAnimation(VarVal.SPINE_FISHING_NAME.stand, true); //待机
                        call1()
                        for (let i = 0; i < this.img_equipArr.length; i++) {
                            const item = this.img_equipArr[i];
                            item.item.touchable = true
                        }
                        if (!this.automationData) {
                            let timeCall = () => {
                                if (!this.automationData) {
                                    this.isForge = false
                                    this.rmPlayer.getRolePlayer().setTimeScale(1);
                                    this.rmPlayer.getRolePlayer().playAnimation(VarVal.SPINE_FISHING_NAME.stand_fishing, true) //坐下休息
                                }
                            }
                            this.restTime = this.setTimeout(timeCall, 10000);
                        }
                        // });
                    });
                }
            });
        }
        let forgeSpeed: number = 1.5
        if (this.automationData) {
            forgeSpeed = this.automationData.speed
        }
        this.forgeSpeed = (quality / 15 + 1)

        this.rmPlayer.getRolePlayer().setTimeScale(this.forgeSpeed * forgeSpeed);
        let wtrType: number = 0
        this.rmPlayer.getRolePlayer().setEventListener((trackEntry: sp.spine.TrackEntry, event: sp.spine.Event) => {
            if (event.stringValue == "wtr") {
                if (wtrType == 0) {
                    new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                        spp.playAnimation("stand", false);
                    }, this.uiPanel.getChild("loader_spine_rushui"), "diaoyu_rushui")
                } else {
                    if (wtrType < 6) {
                        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFF_DIAOYU_WATER1);
                    } else if (wtrType > 5 && wtrType < 11) {
                        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFF_DIAOYU_WATER2);
                    } else {
                        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFF_DIAOYU_WATER3);
                    }

                    if (wtrType <= quality) {
                        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                            spp.playAnimation("lagou", false);
                        }, this.uiPanel.getChild("loader_spine_rushui"), UtilsUI.getDiaoyuSpineName(wtrType))
                    } else if (wtrType == quality + 1) {
                        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                            spp.playAnimation("qigou", false);
                        }, this.uiPanel.getChild("loader_spine_rushui"), UtilsUI.getDiaoyuSpineName(quality))
                    } else if (wtrType == quality + 2) {
                    }
                }
                wtrType++
            }
            if (event.stringValue == "get") {
                this.onForgeEquips(2)
            }
        });

        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFF_DIAOYU_THROW);
        this.rmPlayer.getRolePlayer().playAnimation(aniName3, false, null, null, () => { //甩勾
            onAniName1()
        });
    }
    private onAutomation(): void {
        if (!this.isForge) {
            this.isForge = true
            let forgeEquip = GameServerData.getInstance().getPlayerFullInfo().forgeEquips[0]
            if (forgeEquip) {
                // let battleAttrs: string[] = forgeEquip.attrs.split(",")
                if (this.automationData) {
                    if (this.onReachEquip(forgeEquip)) {
                        this.isForge = false
                        this.pushLyAttachEquip({ automation: true });
                    } else {
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                this.onForgeEquips(3, forgeEquip.cid)
                                this.isForge = false
                                this.onAutomation()
                            } else {
                                // this.isForge = false
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        }, "breakdown", {
                            equipIds: [forgeEquip.eid]
                        })
                    }
                } else {
                    this.isForge = false
                    this.pushLyAttachEquip(null);
                }
            } else {
                if (this.automationData) {
                    if (this.automationData.ticket) {
                        let evolutionRoot = LocaleData.getEvolutionRoot();
                        let countMax: number = UtilsUI.getDuelItemLimitCount();
                        let count: number = GameServerData.getInstance().getItemCountByProtoId(evolutionRoot.duelItemId);
                        if (count >= countMax) {
                            this.automationData = null
                            this.loader_spine_automatic.visible = false
                            this.isForge = false
                            UtilsUI.showMsgTip(StrVal.LYAUTOMATION.STR16)
                            return
                        }
                    }
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            let call: Function = () => {
                                if (args.itemInserts) {
                                    UtilsUI.showJumpItems({
                                        bonuseString:GameServerData.getInstance().bonusesResultsToString([{inserts:args.itemInserts}])
                                    });
                                }
                                if (args.dropReward && args.dropReward.inserts && args.dropReward.inserts.length > 0) {
                                    UtilsUI.showJumpItems({
                                        bonuseString: GameServerData.getInstance().bonusesResultsToString([args.dropReward])
                                    });
                                }
                                let forgeEquips: any = GameServerData.getInstance().getPlayerFullInfo().forgeEquips
                                let forgeEquip = forgeEquips[0]
                                // this.onForgeEquips(4)
                                this.isForge = false
                                if (this.onReachEquip(forgeEquip)) {
                                    this.pushLyAttachEquip({ automation: true });
                                } else {
                                    if (!this.automationData) {
                                        this.onAutomation()
                                    }
                                }
                            }
                            let call1: Function = () => {
                                let forgeEquips: any = GameServerData.getInstance().getPlayerFullInfo().forgeEquips
                                let forgeEquip = forgeEquips[0]
                                if (this.automationData && forgeEquip && !this.onReachEquip(forgeEquip)) {
                                    UtilsUI.lockWait()
                                    GameServer.getInstance().send((args: any) => {
                                        UtilsUI.unlockWait()
                                        if (args.errorcode == 0) {
                                            this.isForge = false
                                            this.onAutomation()
                                            this.onForgeEquips(4, forgeEquip.cid)
                                            // if (args.dropReward) {
                                            //     UtilsUI.showItemRewardForge(GameServerData.getInstance().bonusesResultsToString([args.dropReward]));
                                            // UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString(args.dropReward) });
                                            // UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.dropReward]) });
                                            // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyItemReward, 0, args.dropReward);
                                            // }
                                        } else {
                                            UtilsUI.showMsgTip(args.errorcode)
                                        }
                                    }, "breakdown", {
                                        equipIds: [forgeEquip.eid]
                                    })
                                } else {
                                }
                            }
                            this.onForgeAnimation(call, call1)
                        } else {
                            if (args.errorcode == PErrCode.equip_forge_not_empty) {
                                this.onForgeEquips(11)
                            }
                            if (this.loader_spine_automatic.visible) {
                                this.loader_spine_automatic.visible = false
                            }
                            this.isForge = false
                            let timeCall = () => {
                                this.rmPlayer.getRolePlayer().setTimeScale(1);
                                this.rmPlayer.getRolePlayer().playAnimation(VarVal.SPINE_FISHING_NAME.stand_fishing, true)
                            }
                            this.setTimeout(timeCall, 10000);
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    }, "forge", {
                        count: this.automationData.count,
                        attr1: this.automationData.attr1.battleAttr == -1 ? null : this.automationData.attr1.battleAttr,
                        attr2: this.automationData.attr1.defenseAttr == -1 ? null : this.automationData.attr1.defenseAttr,
                        attr3: this.automationData.attr2.battleAttr == -1 ? null : this.automationData.attr2.battleAttr,
                        attr4: this.automationData.attr2.defenseAttr == "-1" ? null : this.automationData.attr2.defenseAttr,
                    })
                } else {
                    this.isForge = false
                    // let forgeEquip = GameServerData.getInstance().getPlayerFullInfo().forgeEquips[0]
                }
            }
        } else {
            // this.isForge = false
            // this.onAutomation()
        }
    }
    private renderListItem(index: number, obj: fgui.GButton): void {
        if (this.equipArr[index].eid) {
            if (this.isOneEquipEff) {
                AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFF_EQUIP_DOWNHERO);
                let loader_spine_new: fgui.GLoader3D = obj.getChild("loader_spine_new")
                loader_spine_new.visible = true
                new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                    spp.playAnimation("stand", false, null, null, () => {
                        loader_spine_new.visible = false
                    });
                }, loader_spine_new, "jm_zhuangbei_tihuan")
            }
            obj.visible = true
            UtilsUI.setUIGroupEquip(this.equipArr[index], obj, () => {
                if (UtilsTool.isNotEmptyObject(this.equipArr[index])) {
                    UtilsUI.showEquipInfo(obj, this.equipArr[index])
                }
            });

        } else {
            obj.visible = false
        }
    };
    //角色属性
    private loadAttr(): void {
        let basicAttrArr: number[] = [
            VarVal.ENTITIATTR.FINAL_HP,
            VarVal.ENTITIATTR.FINAL_ATTACK,
            VarVal.ENTITIATTR.FINAL_DEFENSE,
            VarVal.ENTITIATTR.FINAL_SPEED,
        ]
        let moreAttrArr: number[] = [
            VarVal.ENTITIATTR.CHANCE_CRITICAL,
            VarVal.ENTITIATTR.CHANCE_VERTIGO,
            VarVal.ENTITIATTR.CHANCE_COMBO,
            VarVal.ENTITIATTR.CHANCE_MISS,
            VarVal.ENTITIATTR.CHANCE_COUNTER,
            VarVal.ENTITIATTR.CHANGE_VAMPIRE,
            VarVal.ENTITIATTR.RESISTANCE_CRITICAL,
            VarVal.ENTITIATTR.RESISTANCE_VERTIGO,
            VarVal.ENTITIATTR.RESISTANCE_COMBO,
            VarVal.ENTITIATTR.RESISTANCE_MISS,
            VarVal.ENTITIATTR.RESISTANCE_COUNTER,
            VarVal.ENTITIATTR.RESISTANCE_VAMPIRE,
        ]
        //属性展开按钮
        let btn_arrows: fgui.GButton = this.uiPanel.getChild("btn_arrows")
        //属性隐藏按钮
        // let btn_arrows2: fgui.GButton = this.uiPanel.getChild("btn_arrows2")
        //属性展开组
        // let group_moreAttr: fgui.GGroup = this.uiPanel.getChild("group_moreAttr")
        btn_arrows.clearClick()
        btn_arrows.onClick(() => {
            // group_moreAttr.visible = true
            // btn_arrows.visible = false
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDetailAttr, 0, { type: LyDetailAttrType.MAINPAGE });
        })
        // btn_arrows2.onClick(() => {
        //     // group_moreAttr.visible = false
        //     btn_arrows.visible = true
        // })
        //基础属性
        let list_basicAttr: fgui.GList = this.uiPanel.getChild("list_basicAttr")
        list_basicAttr.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let val = GameServerData.getInstance().getEntityPlayerAttr(basicAttrArr[index])
            let str: string = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR6, [StrVal.ENTITI_NAMES[basicAttrArr[index]], UtilsTool.nToFStr(val)])
            obj.getChild("label_txt").text = str
        }).bind(this)
        list_basicAttr.numItems = basicAttrArr.length
        // //展开属性
        // let list_moreAttr: fgui.GList = this.uiPanel.getChild("list_moreAttr")
        // list_moreAttr.itemRenderer = ((index: number, obj: fgui.GButton) => {
        //     let val = GameServerData.getInstance().getEntityPlayerAttr(moreAttrArr[index])
        //     let str: string = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR7, [StrVal.ENTITI_NAMES[moreAttrArr[index]], UtilsTool.nToFStr(val)])
        //     obj.getChild("label_txt").text = str
        // }).bind(this)
        // list_moreAttr.numItems = moreAttrArr.length

    }
    private isOneEquipEff: boolean = false
    private updataEquip(equip, isBreakdown, isAttach1, isForgeEquipAdd, isAttach): void {
        if (!isBreakdown) {
            let index: number = 0
            for (let i = 0; i < this.equipArr.length; i++) {
                if (this.equipArr[i].slot == equip.slot) {
                    index = i
                }
            }
            this.isOneEquipEff = true
            this.renderListItem(index, this.list_equip.getChildAt(index))
        }
        let forgeEquips = GameServerData.getInstance().getPlayerFullInfo().forgeEquips
        if (forgeEquips.length > 0) {
            if (isBreakdown || isAttach1 || isAttach) {
                this.onForgeEquips(9, equip.cid)
            } else {
                if (isForgeEquipAdd) {
                    this.onForgeEquips(8)
                } else {
                    this.onForgeEquips(6)
                }
            }
        } else {
            if (!isAttach1) {
                this.onForgeEquips(5, equip.cid)
            } else {
                this.onForgeEquips(7, equip.cid)
            }
        }


    }

    private updataMountSkin(): void {
        // let fullInfoMount = GameServerData.getInstance().getPlayerFullInfo().mount;
        // this.rmPlayer.loadSpineMount(LocaleData.getMountShowResInfo(fullInfoMount.tid, fullInfoMount.cid));
    }

    private updataGoldFinger(): void {
        let goldRoot = LocaleData.getGoldFingerRoot();
        let goldInfo = GameServerData.getInstance().getGoldFingerInfo();
        let remain = Number(goldRoot.forgeCountAddFinger) - goldInfo.forge;
        if (remain > 0) {
            this.btn_finger.text = UtilsTool.stringFormat(StrVal.LYGOLDFINGER.STR408, [remain]);
        } else {
            this.btn_finger.text = "";
        }
        let last = this.btn_finger.data;
        let now = (remain > 0);
        if (last !== now) {
            if (this.finaniPlayer.getSpineSke()) {
                this.btn_finger.data = now;
                console.log(now ? "stand_1" : "stand_2")
                this.finaniPlayer.playAnimation(now ? "stand_1" : "stand_2", true);
            }   
        }
    }

    private updataPlayerSkin(): void {
        this.isForge = false
        if (this.automationData) {
            this.onAutomation()
        }
        let charInfo = LocaleData.getCharShowResInfoSelf();
        let modelNameArr: string[] = charInfo.spine.split("_")
        let spineNameCope = UtilsTool.stringFormat("dy_{0}_{1}", [modelNameArr[1], modelNameArr[2]]);
        this.rmPlayer = new SpineRoldMountPlayer(this.uiPanel.getChild("group_spine_ram")).loadSpineRoleByName(spineNameCope, (rmp: SpineRoldMountPlayer) => {
            if (this.automationData) {
                this.rmPlayer.getRolePlayer().setTimeScale(1);
                this.rmPlayer.getRolePlayer().playAnimation(VarVal.SPINE_FISHING_NAME.stand, true);
            } else {
                this.rmPlayer.getRolePlayer().setTimeScale(1);
                this.rmPlayer.getRolePlayer().playAnimation(VarVal.SPINE_FISHING_NAME.stand_fishing, true);
            }
        });
    }
    private mainTaskId: number
    private updataTask(): void {
        //任务
        let group_item: fgui.GComponent = this.group_task.getChild("group_item");
        let label_dec: fgui.GButton = this.group_task.getChild("label_dec");
        let label_task: fgui.GTextField = this.group_task.getChild("label_task");
        let loader_spine_get: fgui.GLoader3D = this.group_task.getChild("loader_spine_get");
        this.mainTaskId = GameServerData.getInstance().getPlayerFullInfo().mainTaskId
        let taskInfo: any = LocaleData.getTaskRoot(this.mainTaskId)
        let taskItem = UtilsUI.getBonuseItemsByBonusesId(taskInfo.bonusesId)
        UtilsUI.setUIGroupItem(taskItem[0], group_item, null);
        group_item.getChild("img_count").visible = false
        group_item.getChild("loader_spine_item").visible = false
        group_item.getChild("loader_back").visible = false
        let taskNum: number = taskInfo.conditionParam.split(",")[0]
        let mainCount: number = GameServerData.getInstance().getPlayerFullInfo().mainCount
        if (LocaleData.getTaskSpecialTaskType(taskInfo.conditionType)) {
            taskNum = 1
        }
        let mainState = GameServerData.getInstance().getPlayerFullInfo().mainState;
        if (LocaleData.getTaskSpecialTaskType(taskInfo.conditionType)) {
            if (mainState == 2) {//可领取
                mainCount = 1
            } else {
                mainCount = 0
            }
        }
        label_dec.text = taskInfo.desc
        label_task.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR2, [mainCount, taskNum]);
        label_task.color = UtilsUI.getEnoughColor(mainCount >= taskNum);
        let c1 = this.group_task.getController("c1");
        c1.selectedIndex = (mainState == 3 ? 1 : 0);
        if (c1.selectedIndex == 1) {
            this.group_task.getChild("label_done", fgui.GTextField).text = StrVal.LYMAINPAGE.STR4;
        }
        loader_spine_get.visible = (mainState == 2);
        if (loader_spine_get.visible) {
            new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                spp.playAnimation("stand", true, null, null, () => { });
            }, loader_spine_get, VarVal.UI_EFF_NAME.spine_main_task)
        }
    }

    /**
      * 注册活动事件，提供列表变动操作（增、删、改）。
      */
    private initActivityRegEvent(): void {
        /**
         * 活动状态改变（常规活动没有插入移除这一说法，只有更新活动状态）
         */
        this.registerRequest((args) => {
            if (!args || !args.activityState || args.activityState.activityId == null) {
                return;
            }
            let activityId = String(args.activityState.activityId);
            if (activityId == VarVal.ACTIVITY_ID.DAILYWELFARE) {
                this.updatedailyWelfare();
            } else if (args.activityState.clasz == VarVal.ACTIVITY_CLASZ.OPENCELEBRATION
                || args.activityState.clasz == VarVal.ACTIVITY_CLASZ.REINCARNATIONHALL
                || args.activityState.clasz == VarVal.ACTIVITY_CLASZ.FORTUNE
                || args.activityState.clasz == VarVal.ACTIVITY_CLASZ.ELITEMONSTOR_LL
                || args.activityState.clasz == VarVal.ACTIVITY_CLASZ.PSYCHICINSIGHT
                || args.activityState.clasz == VarVal.ACTIVITY_CLASZ.BUDDYMASS) {
                // this.refreshActivityListItem(args.activityState.clasz, Number(activityId), null);
            } else if (activityId == VarVal.ACTIVITY_ID.SEVENDAYS) {
                if (args.activityState.data.activitySevenDays[0].start == 1) { // 1是已结束
                    if (!this.isActivityListSimple()) { // 折叠时不移除
                        this.sortActivityListItem();
                    }
                } else {
                    // this.refreshActivityListItem(null, Number(activityId), null);
                }
            } else if (activityId == VarVal.ACTIVITY_ID.RISINGSTAR
                || activityId == VarVal.ACTIVITY_ID.OPEN_RANK) {
                // this.refreshActivityListItem(null, Number(activityId), null);
            }
        }, "activityStateChanged");

        /**
        * 全局活动状态改变
        */
        this.registerRequest((args) => {
            let activityId = String(args.activityGlobalState.activityId);
            if (activityId == VarVal.ACTIVITY_ID.RISINGSTAR) {
                if (args.activityGlobalState.state == 2) {
                    if (!this.isActivityListSimple()) { // 折叠时不移除
                        this.sortActivityListItem();
                    }
                }
            }
        }, "activityGlobalStateChanged");

        //this.registerRequest((args) => {
        //    this.onActivityStateRemoveChanged(args);
        //}, "activityStateRemoveChanged");

        /**
         * 运营活动插入。
         */
        this.registerRequest((args) => {
            if (args.dynamicActivityParam.clasz == VarVal.ACTIVITY_CLASZ.OPENCELEBRATION
                || args.dynamicActivityParam.clasz == VarVal.ACTIVITY_CLASZ.REINCARNATIONHALL
                || args.dynamicActivityParam.clasz == VarVal.ACTIVITY_CLASZ.FORTUNE
                || args.dynamicActivityParam.clasz == VarVal.ACTIVITY_CLASZ.ELITEMONSTOR_LL
                || args.dynamicActivityParam.clasz == VarVal.ACTIVITY_CLASZ.PSYCHICINSIGHT
                || args.dynamicActivityParam.clasz == VarVal.ACTIVITY_CLASZ.BUDDYMASS) {
                if (!this.isActivityListSimple()) { // 此活动肯定不在列表中（但折叠时不插入）
                    this.sortActivityListItem();
                }
            }
        }, "dynamicActivityInsert");

        /**
         * 运营活动移除。
         */
        this.registerRequest((args) => {
            let openInfos: Array<ActivityOpenInfo> = this.list_activity.data;
            for (let itemIdx = 0; itemIdx < openInfos.length; itemIdx++) {
                if (openInfos[itemIdx].activityId == args.id) { // 当此活动在列表时（折叠时不在）
                    this.sortActivityListItem();
                    break;
                }
            }
        }, "dynamicActivityRemove");

        /**
         * 首充礼包变化。
         */
        this.registerRequest((args) => {
            if (args.isCreate || args.isRemove) {
                this.sortActivityListItem();
            } else {
                // this.refreshActivityListItem(null, null, MAINPAGE_ACTIVITY.PAY_FIRSTGIFT);
            }
        }, "firstPayChanged");
        /**
         * 限时礼包组变化。
         */
        this.registerRequest((args) => {
            let activeGroups = LocaleData.getActiveGiftGroups(true);
            if (activeGroups.length > 0) {
                if (!this.isActivityListData(null, null, MAINPAGE_ACTIVITY.PAY_GIFTGROUP) && !this.isActivityListSimple()) {
                    this.sortActivityListItem();
                }
            }
        }, "expiredGiftsAdd");
        this.registerRequest((args) => {
            let activeGroups = LocaleData.getActiveGiftGroups(true);
            if (activeGroups.length <= 0) {
                if (this.isActivityListData(null, null, MAINPAGE_ACTIVITY.PAY_GIFTGROUP) && !this.isActivityListSimple()) {
                    this.sortActivityListItem();
                }
            }
        }, "expiredGiftChanged");
        this.registerRequest((args) => {
            let activeGroups = LocaleData.getActiveGiftGroups(true);
            if (activeGroups.length <= 0) {
                if (this.isActivityListData(null, null, MAINPAGE_ACTIVITY.PAY_GIFTGROUP) && !this.isActivityListSimple()) {
                    this.sortActivityListItem();
                }
            }
        }, "expiredGiftExipred");
        /**
         * 开服礼包组变化。
         */
        this.registerRequest((args) => {
            let activeGroups = LocaleData.getActiveSevenGiftGroups(true);
            if (activeGroups.length > 0) {
                if (!this.isActivityListData(null, null, MAINPAGE_ACTIVITY.PAY_GIFTSEVEN) && !this.isActivityListSimple()) {
                    this.sortActivityListItem();
                }
            }
        }, "openGiftAdd"); // 买完时时关闭入口。
        this.registerRequest((args) => {
            let activeGroups = LocaleData.getActiveSevenGiftGroups(true);
            if (activeGroups.length <= 0) {
                if (this.isActivityListData(null, null, MAINPAGE_ACTIVITY.PAY_GIFTSEVEN) && !this.isActivityListSimple()) {
                    this.sortActivityListItem();
                }
            }
        }, "openGiftChanged"); // 买完时时关闭入口。
        this.registerRequest((args) => {
            if (!args.id) {
                let activeGroups = LocaleData.getActiveSevenGiftGroups(true);
                if (activeGroups.length <= 0) {
                    if (this.isActivityListData(null, null, MAINPAGE_ACTIVITY.PAY_GIFTSEVEN) && !this.isActivityListSimple()) {
                        this.sortActivityListItem();
                    }
                }
            }
        }, "openGiftDisappeared"); // 活动结束时关闭入口。
        this.registerRequest((args) => {
            this.sortActivityListItem();
        }, "onClanSoloOpen"); // 单刀赴会活动

        /**
         * 等级变化。
         */
        /*
        this.registerRequest((args) => {
            if (args.key == "level" && args.isNewValue) {
                Number(args.value)
            }
        }, "playerAttrChanged");
        */

        // 初始化每日福利（青蛙）
        this.updatedailyWelfare();
    }

    /**
      * 功能开启刷新。
      */
    private onActivationNotify(sysId: number): void {
        if (sysId == VarVal.SYSYTEM_ID.DAILY_WELFARE) {
            this.updatedailyWelfare();
        } else if (sysId == VarVal.SYSYTEM_ID.ALL_RECHARGE
            || sysId == VarVal.SYSYTEM_ID.SHOP
            || sysId == VarVal.SYSYTEM_ID.INVITE_FRIEND
            || sysId == VarVal.SYSYTEM_ID.demonPath
            || sysId == VarVal.SYSYTEM_ID.TREE_REBATE
            || sysId == VarVal.SYSYTEM_ID.BrumeIsle) { // 不可折叠的活动放这里
            this.sortActivityListItem();
        } else if (sysId == VarVal.SYSYTEM_ID.xianyuan // 可以折叠的活动放这里
            || sysId == VarVal.SYSYTEM_ID.elite
            || sysId == VarVal.SYSYTEM_ID.pet
            || sysId == VarVal.SYSYTEM_ID.RISINGSTAR
            || sysId == VarVal.SYSYTEM_ID.SEVENDAYS
            || sysId == VarVal.SYSYTEM_ID.OPENCELEBRATION
            || sysId == VarVal.SYSYTEM_ID.REINCARNATIONHALL
            || sysId == VarVal.SYSYTEM_ID.FORTUNE
            || sysId == VarVal.SYSYTEM_ID.ELITEMONSTOR_LL
            || sysId == VarVal.SYSYTEM_ID.PSYCHICINSIGHT
            || sysId == VarVal.SYSYTEM_ID.BUDDYMASS) {
            if (!this.isActivityListSimple()) { // 此活动肯定不在列表中（但折叠时不插入）
                this.sortActivityListItem();
            }
        }
    }

    /**
      * 跨服活动获取数据后刷新。
      */
    private onSendCrossServer(crossId: number): void {
        if (crossId == VarVal.CROSS_SYS_TYPE.CLANSOLO
            || crossId == VarVal.CROSS_SYS_TYPE.CONQUSET
            || crossId == VarVal.CROSS_SYS_TYPE.GRABCITY) {
                this.sortActivityListItem();
        }
    }

    /**
      * 刷新每日福利（青蛙）。
      */
    private updatedailyWelfare(): void {
        let isShow = false;
        if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.DAILY_WELFARE)) {
            let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.DAILYWELFARE);
            if (activityState && activityState.data && activityState.data.dailyWelfare.state == 1) { // 显示
                isShow = true;
            }
        }
        let loader_spine_dailywelfare: fgui.GLoader3D = this.uiPanel.getChild("loader_spine_dailywelfare")
        let graph_dailywelfare = this.uiPanel.getChild("graph_dailywelfare", fgui.GGraph);
        if (isShow && !PlatformAPI.isBinaryExamine()) { // 显示
            new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                spp.playAnimation("stand", true);
            }, loader_spine_dailywelfare, "jm_zhujiemian_yu")

            graph_dailywelfare.visible = true;
            loader_spine_dailywelfare.visible = true;
            graph_dailywelfare.clearClick();
            graph_dailywelfare.onClick(() => {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayDailyWelfare, 0, null);
            })
        } else { // 隐藏
            graph_dailywelfare.visible = false;
            loader_spine_dailywelfare.visible = false;
            graph_dailywelfare.clearClick();
        }
    }

    /**
      * 刷新活动某项，辅助接口（现在不需要用到，红点有独立红点树）。
      */
    /*
    private refreshActivityListItem(_clasz: number, _activityId: number, _acttype: MAINPAGE_ACTIVITY): void {
        let openInfos: Array<ActivityOpenInfo> = this.list_activity.data;
        if (_activityId) { // 存在_clasz为运营活动，非则常规活动
            for (let itemIdx = 0; itemIdx < openInfos.length; itemIdx++) {
                if (openInfos[itemIdx].activityId == _activityId) { // 找到该活动
                    // if (_clasz) { // 运营活动
                    // let dynamicParam = openInfos[itemIdx].params;
                    // }
                    this.list_activity.itemRenderer(itemIdx, this.list_activity.getChildAt(this.list_activity.itemIndexToChildIndex(itemIdx)));
                }
            }
        } else if (_acttype) { // 固定刷新
            for (let itemIdx = 0; itemIdx < openInfos.length; itemIdx++) {
                if (openInfos[itemIdx].type == _acttype) { // 该类型活动
                    this.list_activity.itemRenderer(itemIdx, this.list_activity.getChildAt(this.list_activity.itemIndexToChildIndex(itemIdx)));
                }
            }
        }
    }
    */

    /**
      * 是否存在当前项目。
      */
    private isActivityListData(_clasz: number, _activityId: number, _acttype: MAINPAGE_ACTIVITY): boolean {
        let openInfos: Array<ActivityOpenInfo> = this.list_activity.data;
        if (_activityId) { // 存在_clasz为运营活动，非则常规活动
            for (let itemIdx = 0; itemIdx < openInfos.length; itemIdx++) {
                if (openInfos[itemIdx].activityId == _activityId) { // 找到该活动
                    return true;
                }
            }
        } else if (_acttype) { // 固定刷新
            for (let itemIdx = 0; itemIdx < openInfos.length; itemIdx++) {
                if (openInfos[itemIdx].type == _acttype) { // 该类型活动
                    return true;
                }
            }
        }
    }

    /**
      * 初始化活动列表显示控制，只调用一次。
      */
    private initActivityList(): void {
        this.list_activity.itemRenderer = ((index: number, group_item: fgui.GButton) => {
            let openInfo: ActivityOpenInfo = this.list_activity.data[index];
            group_item.data = openInfo;
            // icon
            group_item.icon = UtilsTool.stringFormat("ui://LyMainPage/{0}", [openInfo.icon]);
            // 名字
            let label_name = group_item.getChild("label_name", fgui.GTextField);
            label_name.text = openInfo.name;
            if (!(openInfo.type == MAINPAGE_ACTIVITY.PAY_GIFTGROUP
                || openInfo.type == MAINPAGE_ACTIVITY.PAY_GIFTSEVEN
                || openInfo.type == MAINPAGE_ACTIVITY.OPENRANK)) {
                let label_com = label_name.node.getComponent(AttachGameBehaviour);
                if (label_com) {
                    label_com.destroy(); // 这个会延迟销毁，所以在同一帧删除后增加会触发引擎bug导致无法销毁出现2个。
                }
            }
            // 旋转
            let loader_icon = group_item.getChild("icon", fgui.GLoader);
            // 特效
            let loader_spine_activity: fgui.GLoader3D = group_item.getChild("loader_spine_activity");
            if (openInfo.type == MAINPAGE_ACTIVITY.SWITCH_SIMPLE
                || openInfo.type == MAINPAGE_ACTIVITY.PAY_ALL_RECHARGE
                || openInfo.type == MAINPAGE_ACTIVITY.ACTIVITY_SHOP
                || openInfo.type == MAINPAGE_ACTIVITY.DEMONPATH
                || openInfo.type == MAINPAGE_ACTIVITY.FRIEND_INVITE) {
                loader_spine_activity.freeSpine();
            } else {
                UtilsUI.loadSpineEffAndShow(loader_spine_activity, VarVal.UI_EFF.loader_spine_activity, true);
            }
            // 箭头
            if (openInfo.type == MAINPAGE_ACTIVITY.SWITCH_SIMPLE && openInfo.params) {
                loader_icon.rotation = 180;
            } else {
                loader_icon.rotation = 0;
            }
            // 点击
            group_item.clearClick();
            if (openInfo.type == MAINPAGE_ACTIVITY.PAY_FIRSTGIFT) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyPayFirstGift);
                group_item.onClick(() => {
                    LyPayFirstGift.trySaveViewRedPointDay();
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayFirstGift, 0, null);
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.PAY_ALL_RECHARGE) {
                /*
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyPayAllEntry);
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayAllEntry, 0, null);
                })
                */
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyPayExquisite);
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, null);
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.ACTIVITY_SHOP) {
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityShop, 0, null);
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.SWITCH_SIMPLE) { // 收缩按钮
                group_item.onClick(() => {
                    openInfo.params = !openInfo.params;
                    this.sortActivityListItem();
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.SEVEN_DAYS) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyActivitySevenDays);
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivitySevenDays, 0, null);
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.RISING_STAR) {
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityRisingStar, 0, null);
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.OPENCELEBRATION) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyActivityOpenCelebration, openInfo.params.id);
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityOpenCelebration, 0, { dynamicParam: openInfo.params, type: 2 });
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.REINCARNATIONHALL) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyActivityReincarnationHall, openInfo.params.id);
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityReincarnationHall, 0, { dynamicParam: openInfo.params, type: 1 });
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.FORTUNE) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyActivityFortune, openInfo.params.id);
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityFortune, 0, { dynamicParam: openInfo.params, type: 1 });
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.FAIRY_GIFT) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyFairyGift);
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyFairyGift, 0, null);
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.FRIEND_INVITE) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyFriendInvite);
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyFriendInvite, 0, null);
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.PAY_GIFTGROUP
                || openInfo.type == MAINPAGE_ACTIVITY.PAY_GIFTSEVEN
                || openInfo.type == MAINPAGE_ACTIVITY.OPENRANK) {
                let lastTime: number = 0;
                let updateMinTime = () => {
                    if (openInfo.type == MAINPAGE_ACTIVITY.PAY_GIFTGROUP) {
                        let activeGroups = LocaleData.getActiveGiftGroups(true);
                        for (let i = 0; i < activeGroups.length; i++) {
                            let giftItems = activeGroups[i].giftItems;
                            let gift = GameServerData.getInstance().getPayGiftGroupRecord(giftItems[0].id);
                            if (gift) {
                                if (lastTime == 0 || gift.expiredTime < lastTime) {
                                    lastTime = gift.expiredTime
                                }
                            }
                        }
                    } else {
                        lastTime = UtilsTool.getNextDateTime(GameServerData.getInstance().getServerTime() * 1000) / 1000;
                    }
                }

                updateMinTime();
                let __deltaTime = 0;
                let updateFunc = (deltaTime: number) => {
                    __deltaTime += deltaTime;
                    if (__deltaTime >= 1) {
                        __deltaTime = 0;
                        let remain = lastTime - GameServerData.getInstance().getServerTime();
                        if (remain > 0) {
                            label_name.text = UtilsTool.splitTimeString(remain);
                        } else {
                            updateMinTime();
                        }
                    }
                }
                let label_com = label_name.node.getComponent(AttachGameBehaviour);
                if (!label_com) {
                    label_com = label_name.node.addComponent(AttachGameBehaviour);
                }
                label_com.setUpdateFunc(updateFunc);
                updateFunc(1);
                if (openInfo.type == MAINPAGE_ACTIVITY.OPENRANK) {
                    PointRedData.getInstance().registerPoint(group_item, PointRedType.LyActivityOpenRank);
                } else if (openInfo.type == MAINPAGE_ACTIVITY.PAY_GIFTSEVEN) {
                    PointRedData.getInstance().registerPoint(group_item, PointRedType.LyPaySevenGiftGroup);
                }
                group_item.onClick(() => {
                    if (openInfo.type == MAINPAGE_ACTIVITY.PAY_GIFTGROUP) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayGiftGroup, 0, null);
                    } else if (openInfo.type == MAINPAGE_ACTIVITY.PAY_GIFTSEVEN) {
                        let dateStr = UtilsTool.TimeToDateStr(GameServerData.getInstance().getServerTime());
                        if (dateStr != LocaleUser.getUser(VarVal.FIELD_SV.PAY_SEVENTGIFTGROUP)) {
                            LocaleUser.setUser(VarVal.FIELD_SV.PAY_SEVENTGIFTGROUP, dateStr);
                            LocaleUser.flush();
                            PointRedData.getInstance().updatePointChild(PointRedType.LyPaySevenGiftGroup);
                        }
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPaySevenGiftGroup, 0, {activeGroups:LocaleData.getActiveSevenGiftGroups()});
                    } else {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityOpenRank, 0, null);
                    }
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.ELITE_LL) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyEliteAttack, openInfo.params.id);
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteAttack, 0, { dynamicParam: openInfo.params });
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.PSYCHIC) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyPsychicInsight, openInfo.params.id);
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPsychicInsight, 0, { dynamicParam: openInfo.params });
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.BUDDYMASS) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyBuddyMass, openInfo.params.id);
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBuddyMass, 0, { dynamicParam: openInfo.params });
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.TREE_REBATE) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyTreeRebate);
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTreeRebate, 0, null);
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.BRUMEISLE) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyBrumeIsle);
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsle, 0, null);
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.GRABCITY) {
                // PointRedData.getInstance().registerPoint(group_item, PointRedType.LyBrumeIsle);
                group_item.onClick(() => {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCity, 0, null);
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"siegeGetDatail", null)
                })
            } 
            else if (openInfo.type == MAINPAGE_ACTIVITY.DEMONPATH) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyDemonPath);
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDemonPath, 0, null);
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.CLAN_SOLO) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyClanSolo);
                group_item.onClick(() => {
                    UtilsUI.lockWait();
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait();
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSolo, 0, null);
                        } else {
                            UtilsUI.showMsgTip(args.errorcode);
                        }
                    }, "clanSoloGetInfo", null)
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.CONQUEST) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyConquestSeek);
                group_item.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyConquestSeek, 0, null);
                })
            } else if (openInfo.type == MAINPAGE_ACTIVITY.STRINGER) {
                group_item.onClick(() => {
                    UtilsUI.lockWait();
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait();
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPlayerStronger, 0, { data: args });
                        } else {
                            UtilsUI.showMsgTip(args.errorcode);
                        }
                    }, "strongerPraise", { praise: 0 })


                })
            }
        })
        this.list_activity.data = new Array<ActivityOpenInfo>();
        this.sortActivityListItem();
    }

    /**
      * 活动开放列表显示控制，列表增加或删除时（现在每次刷新是重置所有状态，后面想办法优化性能）。
      */
    private sortActivityListItem(): void {
        // 是否简化列表？
        let isSimple = this.isActivityListSimple();

        let openInfos: Array<ActivityOpenInfo> = this.list_activity.data;
        openInfos.length = 0;

        // 聚宝盆
        if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.TREE_REBATE) && !PlatformAPI.isBinaryExamine()) {
            openInfos.push({
                type: MAINPAGE_ACTIVITY.TREE_REBATE,
                icon: "icon_jubaopen",
                name: "",
            })
        }

        // 可折叠部分
        if (!isSimple) { // 已经存在其他判断条件，在excel表等级字段限制，不需要总开关。
            // 是否存在首充礼包。
            let firstGiftItem = GameServerData.getInstance().getFirstPayItems(1);
            if (firstGiftItem && !PlatformAPI.isBinaryExamine()) {
                openInfos.push({
                    type: MAINPAGE_ACTIVITY.PAY_FIRSTGIFT,
                    icon: "Icon_First Punch", // 如果可以，给策划数据中编辑。
                    name: "", // 有些系统可能存在程序字显示名称。
                })
            }
        }

        // 所有充值整合入口。
        if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.ALL_RECHARGE) && !PlatformAPI.isBinaryExamine()) {
            openInfos.push({
                type: MAINPAGE_ACTIVITY.PAY_ALL_RECHARGE,
                icon: "Icon_bags",
                name: "",
            })
        }

        // 坊市。
        if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.SHOP)) {
            let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.SHOP);
            openInfos.push({
                type: MAINPAGE_ACTIVITY.ACTIVITY_SHOP,
                icon: activityXml.icon,
                name: "",
                activityId: Number(VarVal.ACTIVITY_ID.SHOP),
            })
        }

        // 可折叠部分
        if (!isSimple) {
            // 仙缘
            if (GameServerData.getInstance().getPlayerFullInfo().xyTime > 0 && GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.xianyuan) && !PlatformAPI.isBinaryExamine()) {
                openInfos.push({
                    type: MAINPAGE_ACTIVITY.FAIRY_GIFT,
                    icon: "Icon_Record",
                    name: "",
                })
            }

            // 七日签到。
            if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.SEVENDAYS)) {
                let activityDays = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.SEVENDAYS);
                if (activityDays && activityDays.data && activityDays.data.activitySevenDays[0].start == 0) { // 0是未结束
                    let sevenDaysXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.SEVENDAYS);
                    openInfos.push({
                        type: MAINPAGE_ACTIVITY.SEVEN_DAYS,
                        icon: sevenDaysXml.icon,
                        name: "",
                        activityId: Number(VarVal.ACTIVITY_ID.SEVENDAYS),
                    })
                }
            }

            // 开服冲榜。
            if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.RISINGSTAR) && !PlatformAPI.isBinaryExamine()) {
                let activityStar = GameServerData.getInstance().getActivityGlobalState(VarVal.ACTIVITY_ID.RISINGSTAR);
                if (activityStar && activityStar.state != 2) {
                    let sevenDaysXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.RISINGSTAR);
                    openInfos.push({
                        type: MAINPAGE_ACTIVITY.RISING_STAR,
                        icon: sevenDaysXml.icon,
                        name: "",
                        activityId: Number(VarVal.ACTIVITY_ID.RISINGSTAR),
                    })
                }
            }

            // 开服庆典（运营活动支持多个同类型活动）。
            if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.OPENCELEBRATION) && !PlatformAPI.isBinaryExamine()) {
                let serverCelebs = GameServerData.getInstance().getDynamicActivityParamsByClasZ(VarVal.ACTIVITY_CLASZ.OPENCELEBRATION);
                for (let i = 0; i < serverCelebs.length; i++) {
                    let dynamicParam = serverCelebs[i];
                    openInfos.push({
                        type: MAINPAGE_ACTIVITY.OPENCELEBRATION,
                        activityId: Number(dynamicParam.id),
                        icon: dynamicParam.icon,
                        name: "",
                        params: dynamicParam, // 就是类似常规活动的XML数据。
                    })
                }
            }
            // 轮回殿（运营活动支持多个同类型活动）。
            if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.REINCARNATIONHALL) && !PlatformAPI.isBinaryExamine()) {
                let reincarnationHalls = GameServerData.getInstance().getDynamicActivityParamsByClasZ(VarVal.ACTIVITY_CLASZ.REINCARNATIONHALL);
                for (let i = 0; i < reincarnationHalls.length; i++) {
                    let dynamicParam = reincarnationHalls[i];
                    openInfos.push({
                        type: MAINPAGE_ACTIVITY.REINCARNATIONHALL,
                        activityId: Number(dynamicParam.id),
                        icon: dynamicParam.icon,
                        name: "",
                        params: dynamicParam, // 就是类似常规活动的XML数据。
                    })
                }
            }
            // 运势（运营活动支持多个同类型活动）。
            if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.FORTUNE) && !PlatformAPI.isBinaryExamine()) {
                let fortunes = GameServerData.getInstance().getDynamicActivityParamsByClasZ(VarVal.ACTIVITY_CLASZ.FORTUNE);
                for (let i = 0; i < fortunes.length; i++) {
                    let dynamicParam = fortunes[i];
                    openInfos.push({
                        type: MAINPAGE_ACTIVITY.FORTUNE,
                        activityId: Number(dynamicParam.id),
                        icon: dynamicParam.icon,
                        name: "",
                        params: dynamicParam, // 就是类似常规活动的XML数据。
                    })
                }
            }

            //开服精怪活动(运营活动)
            if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.ELITEMONSTOR_LL) && !PlatformAPI.isBinaryExamine()) {
                let eliteLL = GameServerData.getInstance().getDynamicActivityParamsByClasZ(VarVal.ACTIVITY_CLASZ.ELITEMONSTOR_LL);
                for (let i = 0; i < eliteLL.length; i++) {
                    let dynamicParam = eliteLL[i];
                    openInfos.push({
                        type: MAINPAGE_ACTIVITY.ELITE_LL,
                        activityId: Number(dynamicParam.id),
                        icon: dynamicParam.icon,
                        name: "",
                        params: dynamicParam, // 就是类似常规活动的XML数据。
                    })
                }
            }
            //开服神通活动(运营活动)
            if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.PSYCHICINSIGHT) && !PlatformAPI.isBinaryExamine()) {
                let shentong = GameServerData.getInstance().getDynamicActivityParamsByClasZ(VarVal.ACTIVITY_CLASZ.PSYCHICINSIGHT);
                for (let i = 0; i < shentong.length; i++) {
                    let dynamicParam = shentong[i];
                    openInfos.push({
                        type: MAINPAGE_ACTIVITY.PSYCHIC,
                        activityId: Number(dynamicParam.id),
                        icon: dynamicParam.icon,
                        name: "",
                        params: dynamicParam, // 就是类似常规活动的XML数据。
                    })
                }
            }
            //伙伴集结(运营活动)
            if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.BUDDYMASS) && !PlatformAPI.isBinaryExamine()) {
                let petLL = GameServerData.getInstance().getDynamicActivityParamsByClasZ(VarVal.ACTIVITY_CLASZ.BUDDYMASS);
                for (let i = 0; i < petLL.length; i++) {
                    let dynamicParam = petLL[i];
                    openInfos.push({
                        type: MAINPAGE_ACTIVITY.BUDDYMASS,
                        activityId: Number(dynamicParam.id),
                        icon: dynamicParam.icon,
                        name: "",
                        params: dynamicParam, // 就是类似常规活动的XML数据。
                    })
                }
            }
        }

        // 雾隐岛
        let activityBRUMOpenState = GameServerData.getInstance().getActivityOpenState(VarVal.ACTIVITY_ID.BRUMEISLE);
        if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.BrumeIsle) && activityBRUMOpenState && (activityBRUMOpenState.state == 0 || activityBRUMOpenState.state == 1 || activityBRUMOpenState.state == 2) // 0是未结束
            && !PlatformAPI.isBinaryExamine()) {
            openInfos.push({
                type: MAINPAGE_ACTIVITY.BRUMEISLE,
                icon: "icon_wuyindao",
                name: "",
            })
        }

        //妖途
        if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.demonPath)) {
            openInfos.push({
                type: MAINPAGE_ACTIVITY.DEMONPATH,
                icon: "icon_wudao",
                name: "",
            })
        }

        //单刀赴会
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        if (fullInfo.clanSoloOpen && fullInfo.clanSoloOpen.isOpen && !PlatformAPI.isBinaryExamine()) {
            openInfos.push({
                type: MAINPAGE_ACTIVITY.CLAN_SOLO,
                icon: "icon_union-beat",
                name: "",
            })
        }

        //攻城掠地
        if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.GrabCity)
            && fullInfo.grabCityPlayer && fullInfo.grabCityPlayer.state > 0 && !PlatformAPI.isBinaryExamine()) {
            openInfos.push({
                type: MAINPAGE_ACTIVITY.GRABCITY,
                icon: "icon_gongchengluedi",
                name: "",
            })
        }

        // 八荒
        if (LyConquestSeek.isConquestOpen()) {
            openInfos.push({
                type: MAINPAGE_ACTIVITY.CONQUEST,
                icon: "icon_eight-wildernesses",
                name: "",
            })
        }
 
        // 变强
        openInfos.push({
            type: MAINPAGE_ACTIVITY.STRINGER,
            icon: "icon_strong",
            name: "",
        })

        // 邀请好友。
        if (GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.INVITE_FRIEND)) {
            if (LyFriendInvite.isViewRedPoint(true)) {
                openInfos.push({
                    type: MAINPAGE_ACTIVITY.FRIEND_INVITE,
                    icon: "icon_friend",
                    name: "",
                })
            }
        }

        // 可折叠部分
        if (!isSimple) {
            // 开服排行榜。
            let openRankState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.OPEN_RANK);
            if (openRankState && openRankState.data && GameServerData.getInstance().getServerCreateDay() < 8
            && GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.pet) && !PlatformAPI.isBinaryExamine()) {
                openInfos.push({
                    type: MAINPAGE_ACTIVITY.OPENRANK,
                    icon: "icon_fubangtongxing",
                    name: "",
                })
            }

            // 限时礼包组。
            let activeGroups = LocaleData.getActiveGiftGroups(true);
            if (activeGroups.length > 0 && !PlatformAPI.isBinaryExamine()) {
                openInfos.push({
                    type: MAINPAGE_ACTIVITY.PAY_GIFTGROUP,
                    icon: "icon_countdown",
                    name: "",
                })
            }

            // 开服七天礼包组（每个单个礼包都有系统开启控制，在pay表里控制，不需要总开关。）
            if (LyPaySevenGiftGroup.isSevenGiftGroupsOpen() && !PlatformAPI.isBinaryExamine()) {
                openInfos.push({
                    type: MAINPAGE_ACTIVITY.PAY_GIFTSEVEN,
                    icon: "icon_Sevenday-Ativity",
                    name: "",
                })
            }
        }

        // 简缩按钮。
        if (isSimple || openInfos.length > 0) {
            openInfos.push({
                type: MAINPAGE_ACTIVITY.SWITCH_SIMPLE,
                icon: "activity001",
                name: "",
                params: isSimple,
            })
        }

        // 卧槽，要这样才能废弃旧item，要不然item显示会乱（至少红点乱了，新号调6级首充出来可以看到，什么情况？！）
        this.list_activity.numItems = 0;
        this.list_activity.numItems = openInfos.length;
    }

    /**
      * 当前列表是否折叠。
      */
    private isActivityListSimple(): boolean {
        let isSimple: boolean = false;
        let openInfos: Array<ActivityOpenInfo> = this.list_activity.data;
        if (openInfos.length > 0) {
            isSimple = openInfos[openInfos.length - 1].params;
        }
        return isSimple;
    }

    /**
     * 跑马灯接口。
     */
    private doPlayNoticeIfHave(): void {
        if (!this.isPlayNotice) {
            let group_notice_b: fgui.GComponent = this.getUiPanel().getChild("group_notice_b");
            let notice_data: any = GameServerData.getInstance().getInsertNotice();
            if (notice_data) {
                this.isPlayNotice = true;
                group_notice_b.visible = true;
                let group_notice_s: fgui.GComponent = group_notice_b.getChild("group_notice_s");
                let label_notice: fgui.GTextField = group_notice_s.getChild("label_notice");
                // 文字
                label_notice.text = notice_data.content;
                // 滚动
                label_notice.x = group_notice_s.width;
                let dur: number = (label_notice.width + group_notice_s.width) / 100; // 屏幕宽度750，美秒走100像素。
                FguiGTween.new(label_notice).to(dur, { x: 0 - label_notice.width }).call(() => {
                    this.isPlayNotice = false;
                    group_notice_b.visible = false;
                    this.setTimeout(() => {
                        this.doPlayNoticeIfHave();
                    }, 500);
                }).start();
            }
            else {
                group_notice_b.visible = false;
            }
        }
    }

    // 聊天
    private showChatRoomLast(): void {
        let label_content = this.group_chat.getChild("label_content", fgui.GTextField);
        let chatmsg = LyChatRoom.getChatShowMainPage();
        if (chatmsg) {
            label_content.text = chatmsg;
        } else {
            label_content.text = "";
        }
    }

    // 点赞赐福
    private tryShowReceiveGrant(): boolean {
        if (ViewDispatcher.isViewTop(LyMainPage)) {
            let grantInfo = GameServerData.getInstance().getGrantInfo();
            if (grantInfo) {
                if (LyPalaceLike.isIgnoreGrant) {
                    LyPalaceLike.sendPalaceLikeSkipAll();
                } else {
                    let params: PalaceLikeData = {
                        palaceIds: grantInfo.palaces,
                        playerId: grantInfo.playerId,
                        grantId: grantInfo.grantCfgId
                    }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPalaceLike, 0, params);
                    return true;
                }
            }
        }
    }

    // 功能开启
    private tryShowOpenSysItem(): boolean {
        // 当领取任务奖励时，新功能开启触发弹窗，协议返回后触发奖励界面，奖励在上层，目前不影响。
        if (ViewDispatcher.isViewTop(LyMainPage)) {
            let openSysItem = GameServerData.getInstance().getActivationSysGuide();
            if (openSysItem) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivationOpen, 0, { openSysItem: openSysItem });
                return true;
            }
        }
    }

    // 主线任务引导
    private tryShowMainTaskGuide(): boolean {
        if (ViewDispatcher.isViewTop(LyMainPage)) {
            let taskItem: any = LocaleData.getTaskRoot(GameServerData.getInstance().getPlayerFullInfo().mainTaskId);
            if (taskItem.type == VarVal.taskType.main
                && taskItem.guideId != "" && taskItem.guideId != "0"
                && GameServerData.getInstance().isActivationSysGuide(taskItem.guideId)) {
                GuideManager.startGuide({
                    isForce: true,
                    openSysId: taskItem.guideId,
                    guideDetail: taskItem.guideDesc,
                    guideType: taskItem.guideId,
                });
                return true;
            }
        }
    }

    // 八荒弹窗
    private tryShowConquestSeek(): boolean {
        if (ViewDispatcher.isViewTop(LyMainPage)) {
            if (GameServerData.getInstance().getPlayerFullInfo().conquestOpen) {
                let conquestInfo = GameServerData.getInstance().getConquestInfo();
                let isShow:boolean = false;
                let isForce:boolean = false
                if (conquestInfo && LyConquestSeekStart.isWaitForOpen) {
                    if (conquestInfo.activityInfo.phase == ConquestState.READY || conquestInfo.activityInfo.phase == ConquestState.LOCK) {
                        let dateStr = UtilsTool.TimeToDateStr(GameServerData.getInstance().getServerTime());
                        if (dateStr != LocaleUser.getUser(VarVal.FIELD_SV.CONQUESTSEEK)) {
                            isShow = true;
                        }
                    } else if (conquestInfo.activityInfo.phase == ConquestState.BATTLE) {
                        // 在线触发开启时弹（一天有且仅有一次）
                        // 登陆时开启时弹
                        isShow = true;
                        isForce = true;
                    }
                }
                LyConquestSeekStart.isWaitForOpen = false;
                if (isShow) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyConquestSeekStart, 0, {isForce:isForce});
                    return true;
                }
            } else {
                LyConquestSeekStart.isWaitForOpen = false;
            }
        }
    }

    // 金手指引导
    private tryShowGoldFingerGuide(): boolean {
        if (ViewDispatcher.isViewTop(LyMainPage)) {
            let record1 = GameServerData.getInstance().getGoldFingerRecord(1);
            let record2 = GameServerData.getInstance().getGoldFingerRecord(2);
            if (record1 && !record2 && GameServerData.getInstance().isActivationSysGuide(VarVal.GUIDE_TYPE.TASK_GOLDFINGER)) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGoldFingerSucc, 0, {
                    goldItem: LocaleData.getGoldFingerItem(1),
                    doneCall: () => {
                        GuideManager.startGuide({
                            isForce: true,
                            openSysId: VarVal.GUIDE_TYPE.TASK_GOLDFINGER,
                            guideType: VarVal.GUIDE_TYPE.TASK_GOLDFINGER,
                        });
                    }
                });
                return true;
            }
        }
    }

    private veinAutoTimeOut = null
    private veinAnimCbTo = null
    private vein_onAutomation(): void {
        let pendingGem = GameServerData.getInstance().getPlayerFullInfo().veinInfo.pendingGems[0]
        if (pendingGem) {
            if (LyVein.onReachVein(pendingGem)) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyVeinChange, 0, null);
            } else {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.vein_onAutomation()
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyVein, 0, { isRefresVein: true })
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "discardGems", {
                    gemsIds: [pendingGem.eid]
                })
            }
        } else {
            let outTime = LyVein.stimulateAnimTime == 0 ? 1.67 : LyVein.stimulateAnimTime
            this.veinAutoTimeOut = this.setTimeout(() => {
                if (LyVein.veinAutoInfo) {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyVein, 0, { isAutoExciteAnim: true });
                            this.veinAnimCbTo = this.setTimeout(() => {
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyVein, 0, { isRefresVein: true })
                                let pendingGem = GameServerData.getInstance().getPlayerFullInfo().veinInfo.pendingGems[0]
                                if (LyVein.onReachVein(pendingGem)) {
                                    if (ViewDispatcher.isViewExist(LyVein)) {
                                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyVeinChange, 0, null);
                                    } else {
                                        this.setGemTip(true)
                                    }
                                } else {
                                    this.clearTimeout(this.veinAutoTimeOut)
                                    this.veinAutoTimeOut = null
                                    UtilsUI.lockWait()
                                    GameServer.getInstance().send((args: any) => {
                                        UtilsUI.unlockWait()
                                        if (args.errorcode == 0) {
                                            this.vein_onAutomation()
                                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyVein, 0, { isRefresVein: true })
                                        } else {
                                            UtilsUI.showMsgTip(args.errorcode)
                                        }
                                    }, "discardGems", {
                                        gemsIds: [pendingGem.eid]
                                    })
                                }
                                this.clearTimeout(this.veinAnimCbTo)
                            }, (outTime / LyVein.veinAutoInfo.speed) * 1000)
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)

                            //弹窗道具不足 必须打断自动
                            LyVein.veinAutoInfo = null
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyVein, 0, { isAutoStateChange: 0 });
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { berakVeinAuto: 0 });
                        }
                    }, "veinExcite", {
                        count: LyVein.veinAutoInfo.count
                    })
                }
            }, 200);
        }
    }

    private setGemTip(bool: boolean) {
        this.group_gemTip.visible = bool
    }

    public onViewShowFront() {
        if (!GuideManager.isGuiding()) {
            // 主线任务引导（不用在领取任务奖励得时候触发，奖励界面会覆盖引导框，在这触发就行）
            if (this.tryShowMainTaskGuide()) {
                return;
            }
            // 琅琊榜赐福
            if (this.tryShowReceiveGrant()) {
                return;
            }
            // 新功能开启弹窗
            if (this.tryShowOpenSysItem()) {
                return;
            }
            // 金手指开启
            if (this.tryShowGoldFingerGuide()) {
                return;
            }
            // 首充弹窗：
            if (UtilsUI.tryShowPayFirstGift(1)) {
                return;
            }
            // 八荒
            if (this.tryShowConquestSeek()) {
                return;
            }
            // 其他弹窗，弹窗后记得return！打破后续弹窗。
        }
        this.visibleTestMode();
    }

    private visibleTestMode() {
        // [P0安全] 改为仅 debug 二进制环境可见
        let isTest = PlatformAPI.isBinaryDebug();
        this.btn_testbattle.visible = isTest;
        this.btn_gm.visible = isTest;
        this.btn_restart.visible = isTest;
    }

    /**
     * 当主界面要被某处刷新时。
     */
    public onViewUpdate(params: any): void {

        //更新属性
        // this.loadInfo()
        //更新装备
        if (params) {
            if (params.isNotice) { // 被推送跑马灯。
                this.doPlayNoticeIfHave();
            }
            if (params.isChatRoomMsg) {
                this.showChatRoomLast();
            }
            if (params.receiveGrant) {
                this.tryShowReceiveGrant()
            }
            if (params.tryConquestSeek) {
                this.tryShowConquestSeek()
            }
            if (params.UpDateEquips) {
                this.updataEquip(params.data, params.isBreakdown, params.isAttach1, params.isForgeEquipAdd, params.isAttach)
            }
            if (params.UpDateEquips1) {
                this.onEquipsItem()
                this.onForgeEquips(10)
            }
            if (params.UpDateAutomation) {
                if (params.hideEff) {//其他地方不需要
                    this.loader_spine_automatic.visible = false
                } else {
                    if (params.automationData) {
                        if (params.automationData == 1) {
                            this.automationData = null
                            this.loader_spine_automatic.visible = false
                        } else {
                            if (GameServerData.getInstance().getItemCountByProtoId(this.physical) > 0) {
                                this.loader_spine_automatic.visible = true
                                this.automationData = params.automationData
                            }
                        }
                        UtilsUI.loadSpineEffAndShow(this.loader_spine_automatic, VarVal.UI_EFF.loader_spine_automatic, true);
                    }
                    this.onAutomation()
                }
            }

            // 灵脉相关  暂停自动
            if (params.berakVeinAuto) {
                this.clearTimeout(this.veinAutoTimeOut)
                this.clearTimeout(this.veinAnimCbTo)
                this.veinAutoTimeOut = null
                this.veinAnimCbTo = null
                params.berakVeinAuto = null
            }

            if (this.spine_veinAuto) {
                if (LyVein.veinAutoInfo) {
                    this.btn_gem.getChild("loader_spineEff", fgui.GLoader3D).visible = true
                    this.spine_veinAuto.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                } else {
                    this.spine_veinAuto.clearTracks()
                    this.btn_gem.getChild("loader_spineEff", fgui.GLoader3D).visible = false
                }
            }
            //灵脉开启自动前准备（判断）
            if (params.veinStartAuto) {
                this.setGemTip(false)
                if (GameServerData.getInstance().getItemCountByProtoId(LocaleData.getVeinRoot().exciteItemId) >= 1) {
                    let pendingGem = GameServerData.getInstance().getPlayerFullInfo().veinInfo.pendingGems[0]
                    if (pendingGem) {
                        if (ViewDispatcher.isViewExist(LyVein)) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyVeinChange, 0, null);
                        } else {
                            this.setGemTip(true)
                        }
                    } else {
                        this.vein_onAutomation()
                    }
                } else {
                    //弹窗道具不足 必须打断自动
                    LyVein.veinAutoInfo = null
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyVein, 0, { isAutoStateChange: 0 });
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { berakVeinAuto: 0 });
                }
            }
            if (params.UpDataTask) {
                this.updataTask()
            }
            if (params.UpDataSkin) {//主角皮肤
                this.updataPlayerSkin()
            }
            if (params.isPlayerAttrChanged) {
                this.onPlayerAttrChanged()
            }
            if (params.UpMountSkin) {//更换坐骑皮肤
                this.updataMountSkin()
            }
            if (params.UpGoldFinger) {
                this.updataGoldFinger()
                this.tryShowGoldFingerGuide()
            }
            if (params.upActivationNotify) {//系统开启
                this.loadShowUi()
                this.loadActivation()
                this.onActivationNotify(params.upActivationNotify)
                this.tryShowOpenSysItem()
            }
            if (params.sendCrossServer) {//跨服请求
                this.onSendCrossServer(params.sendCrossServer)
            }
            if (params.upShowUi) {
                this.loadShowUi()
            }
            if (params.updateMail) {
                this.refreshMail()
            }
            if (params.updatePlayerShow) {
                this.onPlayerShow()
            }
            if (params.updateInfo) {
                this.loadInfo()
            }
        }
    }
}
