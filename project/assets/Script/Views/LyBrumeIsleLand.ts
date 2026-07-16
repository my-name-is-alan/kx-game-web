//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { BattleResultParams, BodyPointType, BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { LyGuideDetail } from "./LyGuideDetail";
import { LyChatRoom } from "./LyChatRoom";
import { GameServer } from "../Kernel/GameServer";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { LyBattleMain } from "./LyBattleMain";
import { LyBattleResult } from "./LyBattleResult";
import { LyBrumeIsleChoose } from "./LyBrumeIsleChoose";
import { LyBrumeIsleJoinReward } from "./LyBrumeIsleJoinReward";
import { Color, UI, Vec2, sp } from "cc";
import { LyBrumeIsleShop } from "./LyBrumeIsleShop";
import { LyBrumeIsleAddArr } from "./LyBrumeIsleAddArr";
import { LyDetailAttr, LyDetailAttrType } from "./LyDetailAttr";
import { LyBrumeIsleMark } from "./LyBrumeIsleMark";
import { LyBrumeIsleLog } from "./LyBrumeIsleLog";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { LocaleUser } from "../Kernel/LocaleUser";
import { ShopBuy } from "./LyActivityShopBuy";
import { LyCompanionUse } from "./LyCompanionUse";
import { LyBrumeIsleDown } from "./LyBrumeIsleDown";
import { LyItemTips } from "./LyItemTips";
import { FguiGTween } from "../Kernel/FguiGTween";
import { LyBrumeIsleAward } from "./LyBrumeIsleAward";
import { LyBrumeIsleGift } from "./LyBrumeIsleGift";
import { LyBrumeNote } from "./LyBrumeNote";
import { LyBrumeIsleFire } from "./LyBrumeIsleFire";
import { LyBrumeIsleRank } from "./LyBrumeIsleRank";

export class LyBrumeIsleLand extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyBrumeIsle";
        this.viewResI.pkgName = "LyBrumeIsle";
        this.viewResI.comName = "LyBrumeIsleLand";
    }
    private controller_uievent: fgui.Controller
    private controller_zone: fgui.Controller
    private group_chat: fgui.GComponent
    private loader_monster: fgui.GLoader3D
    private loader_other: fgui.GLoader
    private label_monStername: fgui.GLabel
    private btn_mark: fgui.GButton
    private img_alardyMark: fgui.GImage
    private btn_raoguo: fgui.GButton
    private bar_hp: fgui.GProgressBar
    private label_attackTime: fgui.GLabel
    private label_hp: fgui.GLabel
    private btn_attack: fgui.GButton
    private btn_shop: fgui.GButton
    private label_otherName: fgui.GLabel
    private label_otherDes: fgui.GLabel
    private loader_land: fgui.GLoader
    private btn_skipAnim: fgui.GButton
    private btn_choose: fgui.GButton
    private loader_attack: fgui.GLoader3D
    private label_xh: fgui.GLabel
    private group_add: fgui.GComponent
    private label_myScore: fgui.GLabel
    private label_myRank: fgui.GLabel
    private label_name: fgui.GTextField
    private bar_energy: fgui.GProgressBar
    private btn_monsterPoint: fgui.GButton
    private btn_rz: fgui.GButton
    private btn_needSkip: fgui.GButton
    private btn_point: fgui.GButton
    private btn_point2: fgui.GButton

    private layer3: fgui.GGroup
    private label_scTimes: fgui.GLabel
    private label_lsScore: fgui.GLabel
    private label_antime: fgui.GTextField
    private label_down: fgui.GLabel
    private label_hftime: fgui.GLabel
    private label_ownClanScore: fgui.GLabel
    private label_ts: fgui.GLabel
    private anim_labelhx: fgui.Transition
    private pro_layer3: fgui.GProgressBar
    private pro_label_times: fgui.GLabel
    private pro_target1: fgui.GComponent
    private pro_target2: fgui.GComponent


    private searchSpine: SpinePlayer
    private monsterSpine: SpinePlayer

    private xmlRoot: any
    private markMonsterId: number
    private isLeData
    private monsterName = "无名"
    private evenEumn = {
        ZONE_EVENT_TYPE_MONSTER       : 1, //怪物
        ZONE_EVENT_TYPE_SPECIAL       : 2,//特殊事件
        ZONE_EVENT_TYPE_BATTLEPLAYER  : 3, //玩家
        ZONE_EVENT_TYPE_UP            : 4, //升层或者退出
    }
    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        group_main.visible = false
        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation("animation", false, 0, ()=>{
                group_main.visible = true
             }, null);
        }, getUiPanel.getChild("loader3d_join", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_yunwu_guochang);
        this.xmlRoot = LocaleData.getBrumeIsleConfig()
        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleLand, 0, null);
        });
        let Group_Hard = group_main.getChild("Group_Hard", fgui.GComponent)
        let charInfo = LocaleData.getCharShowResInfoSelf()
        let loader_tx:fgui.GLoader = group_main.getChild("Group_Hard", fgui.GComponent).getChild("group_icon", fgui.GComponent).getChild("loader_icon", fgui.GLoader);
        loader_tx.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
        this.controller_uievent = group_main.getController("event")
        this.controller_zone = group_main.getController("layer")
        this.loader_monster = group_main.getChild("loader_monster")
        this.label_monStername = group_main.getChild("label_monStername")
        this.loader_other = group_main.getChild("loader_other")
        this.btn_mark = group_main.getChild("btn_mark",)
        this.img_alardyMark = group_main.getChild("img_alardyMark")
        this.btn_raoguo = group_main.getChild("btn_raoguo")
        this.bar_hp = group_main.getChild("bar_hp")
        this.label_attackTime = group_main.getChild("label_attackTime")
        this.label_hp = group_main.getChild("label_hp")
        this.btn_attack = group_main.getChild("btn_attack")
        this.btn_shop = group_main.getChild("btn_shop")
        this.label_otherName = group_main.getChild("label_otherName")
        this.label_otherDes = group_main.getChild("label_otherDes")
        this.loader_land = group_main.getChild("loader_land")
        this.btn_skipAnim = group_main.getChild("btn_skipAnim")
        this.btn_choose = group_main.getChild("btn_choose")
        this.loader_attack = group_main.getChild("loader_attack")
        this.label_myScore = group_main.getChild("label_myScore")
        this.label_myRank = group_main.getChild("label_myRank")
        this.label_xh = group_main.getChild("label_xh")
        this.group_add = group_main.getChild("group_add")
        this.label_name = group_main.getChild("label_name")
        this.layer3 = group_main.getChild("layer3")
        this.label_scTimes = group_main.getChild("label_scTimes")
        this.label_lsScore = group_main.getChild("label_lsScore")
        this.label_antime = group_main.getChild("label_antime")
        this.label_down = group_main.getChild("label_down")
        this.bar_energy = group_main.getChild("bar_energy")
        this.btn_monsterPoint = group_main.getChild("btn_monsterPoint")
        this.btn_rz = group_main.getChild("btn_rz")
        this.btn_needSkip = group_main.getChild("btn_needSkip");
        this.label_hftime = group_main.getChild("label_hftime")
        this.label_ownClanScore = group_main.getChild("label_ownClanScore")
        this.label_ts = group_main.getChild("label_ts")
        this.anim_labelhx = group_main.getTransition("t2")
        this.btn_point = group_main.getChild("btn_point")
        this.btn_point2 = group_main.getChild("btn_point2")
        this.pro_layer3 = group_main.getChild("pro")
        this.pro_label_times =  this.pro_layer3.getChild("label_times")
        this.pro_target1 =  this.pro_layer3.getChild("1")
        this.pro_target2 =  this.pro_layer3.getChild("2")
        let img_taskLose = group_main.getChild("group_task", fgui.GComponent).getChild("img_lose")

        
        let playerbase = GameServerData.getInstance().getPlayerFullInfo().base
        let label_combatPower: fgui.GLabel = group_main.getChild("label_combatPower")
        label_combatPower.text = UtilsTool.nToFStr(playerbase.combatPower);
        // let activityOpenState = GameServerData.getInstance().getActivityOpenState(VarVal.ACTIVITY_ID.BRUMEISLE);
       
        this.searchSpine = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation("1", true)
        }, group_main.getChild("loader3d_denglong", fgui.GLoader3D), "jm_wuyindao_denglong");

        group_main.getChild("btn_reward", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleAward, 0, null);
        }); 

        let btn_gift = group_main.getChild("btn_gift", fgui.GButton)
        PointRedData.getInstance().registerPoint(btn_gift, PointRedType.LyBrumeIsGift);
        btn_gift.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleGift, 0, null);
        });
        group_main.getChild("btn_note", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeNote, 0, null);
        });
        let btn_chests = group_main.getChild("btn_chests", fgui.GButton)
        PointRedData.getInstance().registerPoint(btn_chests, PointRedType.LyBrumeIsFire);
        btn_chests.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleFire, 0, null);
        });

        group_main.getChild("btn_rank", fgui.GButton).onClick(()=>{
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleRank, 0, args);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "getDomainPRank", {
                from: 1,
                to: 200,
            });
        });

        group_main.getChild("btn_search", fgui.GButton).onClick(()=>{
            group_main.touchable = false
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.searchSpine.playAnimation("2", false, 0, null, ()=>{
                        this.refreshPage()
                        group_main.touchable = true
                    })
                    group_main.getTransition("t0").play()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                    group_main.touchable = true
                }
            } ,"toSearch", null);
        });

        this.btn_shop.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleShop, 0, null);
        });

        this.btn_point.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:StrVal.LyBRUMEISLE.STR0, detail: this.xmlRoot.detail });
        })

        this.btn_point2.onClick(()=>{
            let _params = {
                bonuseItem:UtilsUI.getBonuseItem(VarVal.bonusType.brumeIsleClanScore, null, "", "1"),
                pos:this.btn_point2.localToGlobal(0, 0),
                size:new Vec2(this.btn_point2.width, this.btn_point2.height)
            }
            ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyItemTips, 0, _params);
        })

        let btn_add = this.group_add.getChild("btn_add", fgui.GButton)
        btn_add.onClick(()=>{
            let itemNum = GameServerData.getInstance().getItemCountByProtoId(this.xmlRoot.addEnergy)
            let maxCount: number = itemNum
            let shopBuy: ShopBuy = {
                costBonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.stone, null, null, "1"),
                bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.xmlRoot.addEnergy, "1"),
                set_need: 0
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCompanionUse, 0, {
                shopBuy: shopBuy, maxCount: maxCount, doneCall: (buyCount: number) => {
                    if (buyCount > 0) {
                        UtilsUI.lockWait();
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait();
                            if (args.errorcode == 0) {
                                // this.onGetCompanionInfo()
                                this.refreshPage()
                                UtilsUI.showMsgTip(StrVal.LyBRUMEISLE.STR36);
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCompanionUse, 0, null);
                            } else {
                                UtilsUI.showMsgTip(args.errorcode);
                            }
                        }, "useitem", {
                            count: buyCount, instId: GameServerData.getInstance().getItemInstByProtoId(this.xmlRoot.addEnergy).id
                        });
                    } else {
                        UtilsUI.showMsgTip(StrVal.LYCOMPANION.STR49);
                    }
                }
            });
        });

        group_main.getChild("btn_sx", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleAddArr, 0, null);
        });

        // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDetailAttr, 0, { type: LyDetailAttrType.MAINPAGE, attr: companionData.companionSkinAttrs });

        this.btn_attack.onClick(()=>{
            // if ((this.isLeData.safeTime != 0) && this.isLeData.eventList[0].type == this.evenEumn.ZONE_EVENT_TYPE_BATTLEPLAYER) {
            //     UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_THREE, "", 
            //     StrVal.LyBRUMEISLE.STR51, null, 
            //     StrVal.COMMON.STR32, null, 
            //     StrVal.COMMON.STR33, ()=>{
            //         UtilsUI.lockWait()
            //         GameServer.getInstance().send((args: any) => {
            //             UtilsUI.unlockWait()
            //             if (args.errorcode == 0) {
            //                 this.zoneEventDoneCallBack(args)
            //             } else {
            //                 UtilsUI.showMsgTip(args.errorcode)
            //             }
            //         } ,"zoneEventDone", null);
            //     }, 
            //     "", null);
            // }else{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.zoneEventDoneCallBack(args)
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"zoneEventDone", null);
            // }
        });

        this.btn_needSkip.onClick(()=>{
            if (this.isLeData.pRankNum < Number(this.xmlRoot.skipNeed)) {
                UtilsUI.showMsgTip(  UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR35, [this.xmlRoot.skipNeed]))
            }
        });

        this.btn_skipAnim.selected = LocaleUser.getUser("LyBrumeIsleLandSkipAnim") == "1"
        this.btn_skipAnim.onClick(()=>{
            LocaleUser.setUser("LyBrumeIsleLandSkipAnim", this.btn_skipAnim.selected ? "1":"0");
            LocaleUser.flush()
        });
       
        PointRedData.getInstance().registerPoint(this.btn_rz, PointRedType.LyBrumeIsMarkGet)
        this.btn_mark.onClick(()=>{
            if (this.isLeData.isMarkMonster == 0) {
                UtilsUI.showMsgTip(StrVal.LyBRUMEISLE.STR37)
            }else if(this.isLeData.isMarkMonster == 2){
                if (this.isLeData.moarkMonsterList.length == 0) {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.refreshPage()
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"markMonsterHelp", null);
                }else if(this.isLeData.moarkMonsterList.length >= 1){
                    if (this.isLeData.moarkMonsterList[0].monsterCURHP <= 0) {
                        //可领取
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleLog, 0, null);
                    }else{
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleMark, 0, {markMonsterId: this.markMonsterId});
                    }
                }
            }
        });

        this.btn_raoguo.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.refreshPage()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"zoneEventDone", { toSkip: 1});
        });

        this.btn_choose.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleChoose, 0, null);
        });
       
        this.btn_rz.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleLog, 0, null);
        });

        let severTime: number = GameServerData.getInstance().getServerTime() * 1000
        let getStartDateTime = UtilsTool.getStartDateTime(severTime)
        let taskData = LocaleData.getBrumeIsleTask(1)[0]
        let task1 = getStartDateTime + Number(taskData.timeLimit.split(":")[0]) * 3600 *1000 + Number(taskData.timeLimit.split(":")[1] * 60 * 1000)
        let interCallBack = ()=>{
            severTime = GameServerData.getInstance().getServerTime()
            if (this.isLeData) {
                if (this.isLeData.battleInterval != 0) {
                    this.label_attackTime.text = UtilsTool.splitTimeString(this.isLeData.battleInterval + (Number(this.xmlRoot.intervalTime) * 3600) - severTime) 
                }else {
                    this.label_attackTime.text = ""
                }
                if (this.isLeData.safeTime != 0) {
                    this.label_antime.text = UtilsTool.splitTimeString(this.isLeData.safeTime - severTime)
                    if (this.isLeData.safeTime - severTime <= 0) {
                        this.label_antime.text = StrVal.LyBRUMEISLE.STR49
                        this.label_antime.color = new Color(255, 0, 0) 
                        this.anim_labelhx.play(null, -1)
                        this.isLeData.safeTime = 0
                    }
                }
                if (this.isLeData.specialBusines.length > 0 && this.shortShopTime > 0) {
                    let lastTime = this.shortShopTime - severTime
                    if (lastTime <= 0) {
                        this.shortShopTime = 0
                    }
                    this.btn_shop.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR29, [UtilsTool.splitTimeString(lastTime)])
                }
                if (this.isLeData.energyTimeSec > 0) {
                    this.isLeData.energyTimeSec = this.isLeData.energyTimeSec - 1
                    this.label_hftime.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR39, [UtilsTool.splitTimeString(this.isLeData.energyTimeSec)])
                }else{
                    this.label_hftime.text = ""
                }

                let severTimeHM = severTime * 1000
                if (severTimeHM < task1) {
                    img_taskLose.visible = false
                }else{
                    let taskState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster.domainTask
                    if (taskState.takeState == 0) {
                        img_taskLose.visible = true
                    }
                }
            }
            else{
                this.label_attackTime.text = ""
                this.label_hftime.text = ""
            }
        }
       
        this.setInterval(()=>{
            interCallBack()
        }, 1000);

        // 聊天
        this.group_chat = group_main.getChild("Group_Chat")
        this.group_chat.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyChatRoom, 0, { isNewMsgChannel: true });
        })
        this.showChatRoomLast();
        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == VarVal.ACTIVITY_ID.BRUMEISLE) {
                this.isLeData = args.activityState.data.activityDomainMonster
            }
        }, "activityStateChanged");
        this.refreshPage()
        this.getShopTime()
        interCallBack()
        this.registerRequest((args) => {
            // if (String(args.activityState.activityId) == VarVal.ACTIVITY_ID.BRUMEISLE) {
                if (args.domianBattleInfo) {
                    this.refreshPage()
                    group_main.getTransition("red").play()
                }
            // }
        }, "onDomainBattleEvent");
        this.oldZone = this.isLeData.zoneLevel

        this.registerRequest((args) => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleLand, 0, null);
        }, "onDomianExit");
    }

    private shortShopTime: number = 0
    private getShopTime(){
        if (this.isLeData.specialBusines && this.isLeData.specialBusines.length > 0) {
            this.isLeData.specialBusines.sort((a, b):number=>{
                return a.time - b.time
            });
            this.shortShopTime = this.isLeData.specialBusines[0].time
        }else{
            this.shortShopTime = 0
        }
    }
    private oldZone = 0
    private oldZone3HP = 0
    private barMaxHp = 0
    private refreshPage(){
        this.isLeData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster
        this.loader_land.url = UtilsTool.stringFormat("ui://LyBrumeIsle/bg_{0}", [this.isLeData.zoneLevel]) 
        //探索阶段
        if (this.isLeData.eventList == undefined) {
            return
        }
        this.btn_monsterPoint.clearClick()
        if (this.isLeData.eventList.length == 0) {
            this.barMaxHp = 0
            this.loader_monster.freeSpine()
            this.controller_uievent.selectedIndex = 0
            this.searchSpine.playAnimation("1", true)
            this.label_xh.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR18, [this.isLeData.zoneLevel]);
            (this.group_add.getChild("loader_icon") as fgui.GLoader).url =  UtilsUI.getItemIconUrl(VarVal.bonusType.brumeIslePower);
            (this.group_add.getChild("label_number") as fgui.GLabel).text = UtilsUI.getEnoughColorString(this.isLeData.energy >= 0, UtilsTool.stringFormat("{0}/{1}",[this.isLeData.energy, this.xmlRoot.energyMax]));
        }else{
            let eventItem = this.isLeData.eventList[0]
            if (eventItem.type ==  this.evenEumn.ZONE_EVENT_TYPE_MONSTER) { //怪物
                this.markMonsterId = eventItem.id
                this.controller_uievent.selectedIndex = 1
                let monsterEvent = LocaleData.getBrumeIsleMonster(eventItem.id)
                let monsterProto = LocaleData.getMonsterProto(monsterEvent.monsterId)
                let modelShowInfo = LocaleData.getModelShowInfo(monsterProto.modelId);
                this.monsterSpine = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true)
                }, this.loader_monster, modelShowInfo.spine);
                this.label_monStername.text = modelShowInfo.name
                this. monsterName = modelShowInfo.name
                this.barMaxHp = this.isLeData.curMonsterHP
                this.bar_hp.value  = (this.isLeData.curMonsterHP /this.isLeData.curMonsterMaxHP)*100
                this.label_hp.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR1, [this.isLeData.curMonsterHP, this.isLeData.curMonsterMaxHP])
                this.btn_attack.icon = "ui://LyBrumeIsle/btn_gongji"
                this.img_alardyMark.visible = this.isLeData.isMarkMonster == 1
                this.btn_mark.visible = this.isLeData.isMarkMonster == 2 
                this.btn_monsterPoint.onClick(()=>{
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDetailAttr, 0, {type:LyDetailAttrType.STAGEMONSTER, monsterProto: monsterProto});
                });
            }else if(eventItem.type == this.evenEumn.ZONE_EVENT_TYPE_SPECIAL){
                let specialEvent = LocaleData.getBrumeIsleSpecialEvent(eventItem.id)
                if (specialEvent.type == "1") { //宝箱
                    this.btn_attack.icon = "ui://LyBrumeIsle/word_shouna"
                    this.loader_other.url = UtilsUI.getItemIconUrl(specialEvent.value)
                    // this.loader_other.url = "ui://LyBrumeIsle/frame_gouhuo"
                }else if(specialEvent.type == "2"){ //商人
                    this.btn_shop.visible = this.isLeData.specialBusines.length > 0
                    this.loader_other.icon = "ui://LyBrumeIsle/frame_zhaomin"
                    this.btn_attack.icon = "ui://LyBrumeIsle/word_jiaoliu"
                }else if(specialEvent.type == "3"){ // 白给破车
                    this.loader_other.url = "ui://LyBrumeIsle/frame_qianrenyiwu"
                    this.btn_attack.icon = "ui://LyBrumeIsle/word_sougua"
                }
                // if (specialEvent.type == "1" || specialEvent.type == "3"|| specialEvent.type == "2") {
                   this.controller_uievent.selectedIndex = 2
                   let textData = LocaleData.getBrumeIsleText(specialEvent.descText)
                   this.label_otherName.text = specialEvent.name
                   this.label_otherDes.text = textData.descText
                // }else {
                //     this.controller_uievent.selectedIndex = -1 
                // }
            }else if (eventItem.type == this.evenEumn.ZONE_EVENT_TYPE_BATTLEPLAYER) {
                this.controller_uievent.selectedIndex = 3
                this.btn_attack.icon = "ui://LyBrumeIsle/btn_gongji"
                let playerInfo = this.isLeData.matchingPlayerInfo
                this.label_monStername.text = playerInfo.name
                let charInfo = LocaleData.getCharShowResInfo(playerInfo.character, playerInfo.phase, playerInfo.appearance, playerInfo.avatar);
                let modelNameArr: string[] = charInfo.spine.split("_")
                let spineNameCope = UtilsTool.stringFormat("js_{0}_{1}", [modelNameArr[1], modelNameArr[2]]);
                this.monsterSpine = new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                }, this.loader_monster, spineNameCope)
                this.img_alardyMark.visible = false
                this.barMaxHp = playerInfo.maxHP
                this.bar_hp.value = (playerInfo.hp/playerInfo.maxHP)*100 
                this.label_hp.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR1, [playerInfo.hp, playerInfo.maxHP])
                this. monsterName = playerInfo.name
                this.btn_monsterPoint.onClick(()=>{
                   UtilsUI.onShowPlayerInfo(playerInfo.id)
                });
            }else if (eventItem.type == this.evenEumn.ZONE_EVENT_TYPE_UP) {
                this.loader_other.url = "ui://LyBrumeIsle/frame_gouhuo"
                this.controller_uievent.selectedIndex = 4
                this.label_otherName.text = StrVal.LyBRUMEISLE.STR32
                this.label_otherDes.text = StrVal.LyBRUMEISLE.STR33
            }
        }
        
        this.label_myScore.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR19, [ UtilsTool.nToFStr(this.isLeData.pRankNum)])
        this.label_myRank.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR20, [ this.isLeData.rankOf <= 0 ? StrVal.LyBRUMEISLE.STR38: this.isLeData.rankOf])
        this.label_name.text = LocaleData.getBrumeIsleZone(this.isLeData.zoneLevel).name
        this.btn_needSkip.visible = this.isLeData.pRankNum < Number(this.xmlRoot.skipNeed)
        if (this.isLeData.zoneLevel < 3) {
            this.label_antime.text = StrVal.LyBRUMEISLE.STR48
            this.label_antime.color = new Color(121, 210, 125) 
            this.anim_labelhx.stop()
        }else{
            if (Number(this.isLeData.safeTime) != 0) {
                this.anim_labelhx.stop()
                this.label_antime.color = new Color(121, 210, 125) 
            }else{
                this.label_antime.text = StrVal.LyBRUMEISLE.STR49
                this.label_antime.color = new Color(255, 0, 0) 
                this.anim_labelhx.play(null, -1)
            }
          
        }
        //第三层临时数据
        this.controller_zone.selectedIndex = this.isLeData.zoneLevel < 3 ? 0: 1
        if (this.isLeData.tempZoneInfo && this.isLeData.zoneLevel == 3) {
            this.label_scTimes.text =  UtilsTool.stringFormat("{0}/10", [this.isLeData.tempZoneInfo.searchCnt % 10]) 
            this.label_ts.text = this.isLeData.tempZoneInfo.gRankNum
            this.label_lsScore.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR50 ,[UtilsTool.nToFStr(this.isLeData.tempZoneInfo.pRandNum)]) 
            this.label_down.text = String(Math.ceil(this.isLeData.tempZoneInfo.gRankNum * Number(this.xmlRoot.failRatio))) 
            this.label_ownClanScore = this.isLeData.pRankNum
            let taskData = LocaleData.getBrumeIsleTask(2)
            this.pro_layer3.max = Number(taskData[1].objective) 
            this.pro_layer3.value = this.isLeData.tempZoneInfo.searchCnt
            this.pro_label_times.text = this.isLeData.tempZoneInfo.searchCnt
            
            this.pro_target1.getChild("label_number").text = taskData[0].objective
            this.pro_target2.getChild("label_number").text = taskData[1].objective
            this.pro_target1.getChild("n9").text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR55, [LocaleData.getBrumeIsleZone(2).name]) 
            this.pro_target2.getChild("n9").text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR55, [LocaleData.getBrumeIsleZone(3).name]) 
            this.pro_target1.getController("c1").selectedIndex = this.isLeData.tempZoneInfo.searchCnt >= Number(taskData[0].objective)? 1:0
            this.pro_target2.getController("c1").selectedIndex = this.isLeData.tempZoneInfo.searchCnt >= Number(taskData[1].objective)? 1:0
        }else{
            this.label_scTimes.text = UtilsTool.stringFormat("{0}/10", [this.isLeData.searchCnt % 10]) 
        }
        this.getShopTime()
        this.btn_shop.visible = this.isLeData.specialBusines.length > 0
        this.bar_energy.max = this.isLeData.finalhpMAX
        this.bar_energy.value = this.isLeData.finalhp
        this.refreshTask()
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

    public refreshTask(){
        let activityOpenState = GameServerData.getInstance().getActivityOpenState(VarVal.ACTIVITY_ID.BRUMEISLE);
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        let group_task: fgui.GComponent = group_main.getChild("group_task")
        group_task.clearClick()
        if (activityOpenState.state == 1) {
            let taskState
            let domainTasks = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster.domainTask
            let taskData = LocaleData.getBrumeIsleTask(1)[0]
            for (let index = 0; index < domainTasks.length; index++) {
                const element = domainTasks[index];
                if (element.id == 1) {
                    taskState = element
                    break
                }
            }
            group_task.getChild("label_taskDes").text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR53, [taskData.objective]) 
            group_task.getChild("label_time").text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR54, [taskData.timeLimit]);
            let bonunItem = UtilsUI.getBonuseItemsByBonusesId(taskData.bonusesID)
            group_task.getChild("label_number").text = bonunItem[0].count
            group_task.getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}", [bonunItem[0].proto.icon]);
            group_task.getChild("img_red_point").visible = taskState.takeState == 1
            group_task.getChild("img_get").visible = taskState.takeState == 2
            group_task.onClick(()=>{
                // if (taskState.takeState == 1) {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.refreshTask()
                            UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])})
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"domainTakeTaskBonuses", {id: Number(taskData.id)} );
                // }
            })
        }else{
            group_task.visible = false
        }
    }

    public onViewUpdate(params: any): void {
        if (params.isChatRoomMsg) {
            this.showChatRoomLast();
        }
        if (params.isUpdate) {
            this.refreshPage()
        }
        if (params.zoneEventDoneArgs) {
            this.zoneEventDoneCallBack(params.zoneEventDoneArgs)
        }
    }

    public onViewReconnect(): boolean {
        UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.refreshPage()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
        } ,"enterDomainActivity", null);
        return true
    }

    public getIsViewMask(): boolean {
        return false;
    }

    public zoneEventDoneCallBack(args){
        let bounArr = []
        if (args.pRankNum) {
            let boun = UtilsUI.getBonuseItem(VarVal.bonusType.brumeIsleScore, null, null, args.pRankNum)
            bounArr.push(boun)
        }
        if (args.gRankNum) {
            let bounm = UtilsUI.getBonuseItem(VarVal.bonusType.brumeIsleClanScore, null, null, args.gRankNum)
            bounArr.push(bounm)
        }
        if (args.propertyItem) {
            let bounm = UtilsUI.getBonuseItem(args.propertyItem.id, null, null, args.propertyItem.count)
            bounArr.push(bounm)
        }
        if (args.bonusesResult) {
            let bonuseString:string;
            bonuseString = GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]);
            let arr =  UtilsUI.getBonuseItemsByString(bonuseString)
            for (let index = 0; index < arr.length; index++) {
                let element = arr[index];
                bounArr.push(element)
            }
        }
        //有战斗
        if (args.battleResult) {
            let desc = args.battleResult.isWin ? StrVal.LyBRUMEISLE.STR2: StrVal.LyBRUMEISLE.STR3
            let resultParams: BattleResultParams = {
                battleResult: args.battleResult,
                bonuseString: "",
                typeInfo: {
                    type: VarVal.BATTLE_TYPE.BRUMELISLE_ATTACK,
                    desc1: UtilsTool.stringFormat(desc, [this.monsterName, UtilsTool.nToFStr(args.attackDamageCount)]),
                    bonunItems: bounArr,
                    callBack: ()=>{
                        this.refreshPage()
                    },
                },
            }
            if (this.btn_skipAnim.selected) {
                //跳过战斗 攻击动画
                new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                    let localPos = new Vec2(0, 0);
                    if (<sp.Skeleton>this.loader_monster.content) {
                        localPos = UtilsUI.getSkeAniBonePos(this.loader_monster, BodyPointType.center);
                    }
                    this.loader_attack.setPosition(localPos.x + this.loader_monster.x , this.loader_monster.y - localPos.y) 
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, false, 0, ()=>{
                        if (args.battleResult.isWin) { //怪物死亡
                            this.monsterSpine.playAnimation(VarVal.SPINE_ANI_NAME.death, false, 0, null,()=>{
                                this.monsterSpine.clearPlayer()
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleResult, 0, resultParams);
                            });
                        }else{
                            this.monsterSpine.playAnimation(VarVal.SPINE_ANI_NAME.hurt, false, 0, null,()=>{
                                this.monsterSpine.playAnimation(VarVal.SPINE_ANI_NAME.stand, false)
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleResult, 0, resultParams);
                            });
                        }
                    },)
                }, this.loader_attack, "jm_miwudao_shouji");
            }else{
                let zoneProto = LocaleData.getBrumeIsleZone(this.isLeData.zoneLevel)
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleMain, 0, {
                    resultParams: resultParams,
                    img_battle: zoneProto.img_battle,
                });
            }
            //血条表现
            this.bar_hp.tweenValue((Number(args.defenceRemainHP) / this.barMaxHp) * 100, 0.4)
            this.label_hp.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR1, [args.defenceRemainHP, this.barMaxHp])
        }else{ 
            if (args.eventItem.type == this.evenEumn.ZONE_EVENT_TYPE_UP) {
                if (this.oldZone == 2) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleJoinReward, 0, {bounArr: bounArr, gRankNum: args.gRankNum});
                }else{
                    if (bounArr.length > 0) {
                        UtilsUI.showItemReward({bonuseItems: bounArr});
                    }
                }
            }else{
                if (bounArr.length > 0) {
                    UtilsUI.showItemReward({bonuseItems: bounArr});
                }
            }
            this.refreshPage()
        }
        if (args.eventItem.type == this.evenEumn.ZONE_EVENT_TYPE_SPECIAL) {
            let specialEvent = LocaleData.getBrumeIsleSpecialEvent(args.eventItem.id)
            if (specialEvent.type == "2") {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleShop, 0, null);
            }
            this.refreshPage()
        }
        this.oldZone = this.isLeData.zoneLevel
    }

}


