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
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { Color } from "cc";
import { GameServer } from "../Kernel/GameServer";
import { GuideManager } from "../Kernel/GuideManager";
import { LocaleUser } from "../Kernel/LocaleUser";
import { LyBuddyMassGL } from "./LyBuddyMassGL";
import { LyGuideDetail } from "./LyGuideDetail";
import { LyBuddyChoose } from "./LyBuddyChoose";
import { LyBuddyWish } from "./LyBuddyWish";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { AudioManager } from "../Kernel/AudioManager";

export class LyBuddyMass extends ViewLayer {
    public static iskuaisuguaji: boolean = false
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyBuddyMass";
    }
    private rankColor: Array<Color> = [
        new Color(183, 114, 24),
        new Color(110, 47, 145),
        new Color(62, 108, 163),
    ]

    private dynamicParam: any;
    private activityData: any;
    //排行榜
    private rankData: any
    private myRankNumber = 0
    private img_nobody: fgui.GImage
    private rankMax = 200
    private allRankMax = 0
    //任务数据
    private showTaskData: any
    //礼包数据
    private allGiftData: any
    private czGiftBoun: any
    //派遣
    private teamAddTime: Array<number> = [] 
    private insters: Array<any> = []
    //-------------------------------
    private label_time: fgui.GLabel
    private pageController: fgui.Controller
    //排行榜ui
    private list_rank
    private label_myRank
    private label_sore
    private label_selfName:fgui.GLabel
    private loader_selfIcon:fgui.GLoader
    private list_rankItem: fgui.GList
    private label_xfdesc: fgui.GLabel

    //任务UI
    private list_task
    private taskController: fgui.Controller
    //礼包ui 
    private list_gift: fgui.GList
    //转盘ui
    private group_zhuanpan: fgui.GComponent
    private label_baodi: fgui.GLabel
    private zhuanPanItems: Array<fgui.GComponent> = []
    private btn_ten: fgui.GButton
    private img_point: fgui.GImage
    private group_ZpItem: Array<fgui.GComponent> = []
    //派遣
    private list_allTeam: fgui.GList
    private group_Crystalnumber: fgui.GComponent
    private label_allTimeAdd: fgui.GLabel
    private img_pro: fgui.GImage
    private label_pro: fgui.GLabel
    private label_nowScore: fgui.GLabel
    private btn_get: fgui.GButton
    private btn_task1: fgui.GButton
    private btn_task2: fgui.GButton
    public onViewCreate(params:any): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
       this.dynamicParam = params.dynamicParam
       this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBuddyMass, 0, null);
       });
       let uiPanel: fgui.GComponent = this.getUiPanel().getChild("mian", fgui.GComponent);
       UtilsUI.playCommonGroupAni(uiPanel, null)
       this.pageController = uiPanel.getController("page")
      
       this.label_time = uiPanel.getChild("label_emailNumber")
       uiPanel.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBuddyMass, 0, null);
       });
        uiPanel.getChild("label_title", fgui.GLabel).text = this.dynamicParam.name
        uiPanel.getChild("btn_rank", fgui.GButton).text = StrVal.LYELITEATTACK.STR1
        uiPanel.getChild("btn_task", fgui.GButton).text = StrVal.LYELITEATTACK.STR2
        uiPanel.getChild("btn_money", fgui.GButton).text = StrVal.LYELITEATTACK.STR3
        uiPanel.getChild("btn_total", fgui.GButton).text = StrVal.LYBUDDYMASS.STR4
        uiPanel.getChild("btn_attack", fgui.GButton).text = StrVal.LYBUDDYMASS.STR3
        uiPanel.getChild("btn_point", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:this.dynamicParam.name, detail: this.dynamicParam.desc });
        });
        
        PointRedData.getInstance().registerPoint(uiPanel.getChild("btn_task"), PointRedType.LyBuddyMassTask, this.dynamicParam.id)
        PointRedData.getInstance().registerPoint(uiPanel.getChild("btn_money"), PointRedType.LyBuddyMassGift, this.dynamicParam.id)
        PointRedData.getInstance().registerPoint(uiPanel.getChild("btn_attack"), PointRedType.LyBuddyMassScore, this.dynamicParam.id)
//#region 排行榜
        let pageRank: fgui.GComponent = uiPanel.getChild("pageRank")
        // let loader_jz = pageRank.getChild("loader_jz", fgui.GLoader)
        let loader_jz = pageRank.getChild("loader_jz", fgui.GLoader)
        loader_jz.url = UtilsUI.getItemIconUrl(VarVal.bonusType.chance)
        this.label_xfdesc = pageRank.getChild("label_xfdesc", fgui.GLabel)
        this.list_rank =  pageRank.getChild("list_rank", fgui.GList)
        this.label_myRank =  pageRank.getChild("label_rank", fgui.GLabel)
        this.label_sore =  pageRank.getChild("label_myScore", fgui.GLabel)
        this.label_sore =  pageRank.getChild("label_myScore", fgui.GLabel)
        this.img_nobody = pageRank.getChild("img_nobody")
        this.label_selfName = pageRank.getChild("label_name", fgui.GLabel)
        
        this.loader_selfIcon = pageRank.getChild("group_head", fgui.GComponent).getChild("group_icon", fgui.GComponent).getChild("loader_icon")
        this.list_rankItem = pageRank.getChild("list_item")
        // pageRank.getChild("n63",fgui.GLabel).text = StrVal.LYELITEATTACK.STR7
        // pageRank.getChild("n85",fgui.GLabel).text = StrVal.LYELITEATTACK.STR6
        // pageRank.getChild("n64",fgui.GLabel).text = StrVal.LYELITEATTACK.STR7
        // pageRank.getChild("n65",fgui.GLabel).text = StrVal.LYELITEATTACK.STR8
        // pageRank.getChild("n66",fgui.GLabel).text = StrVal.LYELITEATTACK.STR9
        // pageRank.getChild("label_myRankDes",fgui.GLabel).text = StrVal.LYELITEATTACK.STR11
        // pageRank.getChild("label_scoreDes",fgui.GLabel).text = StrVal.LYELITEATTACK.STR9
        pageRank.getChild("n81",fgui.GLabel).text = StrVal.LYBUDDYMASS.STR2
        let list_all: fgui.GList = pageRank.getChild("list_all", fgui.GList)
        let chaneXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.OPEN_RANK)._chance[0]._item;
        chaneXml.sort((a, b): number=>{
            return Number(a.rank) - Number(b.rank);
        });
        this.allRankMax = this.rankMax + 1 + chaneXml.length
        this.list_rank.itemProvider = (index: number)=>{
            for (let i = 0; i < chaneXml.length; i++) {
                let chance = chaneXml[i];
                if (index == Number(chance.rank) + i) {
                    return "ui://LyEliteMonster/group_rankDes"
                }
            }
            return "ui://LyEliteMonster/group_rankitem3"
        }
        this.list_rank.setVirtual()
        this.list_rank.itemRenderer = (index: number, child: fgui.GComponent)=>{
            let haveDescNumber = 0
            for (let i = 0; i < chaneXml.length; i++) {
                let chance = chaneXml[i];
                if (index > Number(chance.rank) + i) {
                    haveDescNumber = haveDescNumber + 1
                }
                if (index == Number(chance.rank) + i) {
                    child.getChild("n103").text =UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR34, [chance.rank, chance.chance2]) 
                    return
                }
            }
            let dataIndex = index - haveDescNumber
            let showRank = dataIndex + 1
            let rankBoun = this.getRanksBonuses(showRank)
            let bonusItem: Array<BonuseItem> = UtilsUI.getBonuseItemsByString(rankBoun.bonuses) 
            let list_item = child.getChild("list_item", fgui.GList)
            list_item.itemRenderer = (index1: number, child2: fgui.GComponent)=>{
                UtilsUI.setUIGroupItem(bonusItem[index1], child2, null);
            }
            list_item.numItems = bonusItem.length

            let label_rank:fgui.GTextField = child.getChild("label_rank");
            let loader_rank:fgui.GLoader = child.getChild("loader_rank");
            let loader_pos:fgui.GLoader = child.getChild("loader_pos");
            
            // let num = rankItem.rank;
            let c1: fgui.Controller = child.getController("c1")
            c1.selectedIndex = 1
            label_rank.text = String(showRank);
            if (showRank <= 3) {
                loader_rank.url = UtilsTool.stringFormat("ui://LyEliteMonster/pic_rank{0}", [showRank]);
                loader_pos.url = UtilsTool.stringFormat("ui://LyEliteMonster/pic_vacant{0}", [showRank]);
            }else{
                loader_rank.url = "ui://LyEliteMonster/pic_rank4"
                loader_pos.url = "ui://LyEliteMonster/pic_vacant4"
            }
            label_rank.strokeColor = UtilsUI.getRankColor(showRank);
            label_rank.text = String(showRank)
            let rankItem = this.getRanksPItem(showRank)
            if (rankItem) {
                c1.selectedIndex = 0
                let label_score:fgui.GTextField = child.getChild("label_score");
                label_score.text = UtilsTool.nToFStr(Number(rankItem.score));
                let label_name:fgui.GTextField = child.getChild("label_name");
                label_name.text = rankItem.name;
                let group_head: fgui.GComponent = child.getChild("group_head")
                let loader_iconself:fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
                let charInfo = LocaleData.getCharShowResInfo(rankItem.character, rankItem.phase, rankItem.appearance, rankItem.avatar);
                loader_iconself.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            }
        }
        // list_all.itemRenderer = (index: number, child: fgui.GComponent)=>{
        //     let rankBoun = this.dynamicParam.data.ranksBonuses[index]
        //     let bonusItem: Array<BonuseItem> = UtilsUI.getBonuseItemsByString(rankBoun.bonuses) 
           
        //     let loader_rank: fgui.GLoader = child.getChild("loader_rank", fgui.GLoader)
        //     let rankStr = ""
        //     if (index == 0) {
        //         rankStr = rankBoun.rank
        //     }else{
        //         rankStr = UtilsTool.stringFormat("{0}~{1}",[ Number(this.dynamicParam.data.ranksBonuses[index-1].rank) + 1, rankBoun.rank ])
        //     }
        //     let label_rank: fgui.GTextField = child.getChild("label_rank")
        //     label_rank.text = rankStr
        //     if (index < 3) {
        //         label_rank.text = ""
        //         label_rank.strokeColor = this.rankColor[index]
        //         loader_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_ranking_{0}", [index < 3 ? "0" + (index + 1) : 0])
        //     }else{
        //         loader_rank.url = ""
        //         label_rank.fontSize = 26
        //         label_rank.stroke = 0
        //         label_rank.color = new Color(22,25,26)
        //     }

        //     let list_item =  child.getChild("list_item", fgui.GList)
        //     list_item.itemRenderer = (index1: number, child2: fgui.GComponent)=>{
        //         UtilsUI.setUIGroupItem(bonusItem[index1], child2, null);
        //     }
        //     list_item.numItems = bonusItem.length
        // }
        // list_all.setVirtual()
        // list_all.numItems = this.dynamicParam.data.ranksBonuses.length
//#endregion
        
//#region 任务
        let pageTask = uiPanel.getChild("pageTask", fgui.GComponent)
        this.btn_task1 = pageTask.getChild("btn_1")
        this.btn_task1.text = StrVal.LYBUDDYMASS.STR5
        this.btn_task2 = pageTask.getChild("btn_2")
        this.btn_task2.text = StrVal.LYBUDDYMASS.STR6
        this.taskController = pageTask.getController("c1")
        this.taskController.selectedIndex = 0
        // pageTask.getChild("desc",fgui.GLabel).text = StrVal.LYELITEATTACK.STR23
        this.list_task = pageTask.getChild("list_all", fgui.GList)
        this.list_task.itemRenderer = (index: number, child: fgui.GComponent)=>{
            // label_des
            let taskXml = this.showTaskData[index]
            let taskData = null

            let type = "0"
            let protoNmae = ""
            if (this.taskController.selectedIndex == 0) {
                taskData = this.getTaskState(taskXml.id)
                type = VarVal.bonusType.buddyCrystal
                protoNmae = "takeAnimalFairylandTaskBonuses"
            }else{
                taskData = this.getExploreTaskState(taskXml.id)
                type = VarVal.bonusType.buddyToken
                protoNmae = "takeAnimalFairylandExploreTaskBonuses"
            }
            child.getChild("label_des",fgui.GLabel).text = taskXml.name
            let list_item:fgui.GList = child.getChild("list_item")
            let bonusItems: BonuseItem = UtilsUI.getBonuseItem(type, null, null, String(taskXml.score)) 
            list_item.itemRenderer = (index1:number, child:fgui.GComponent)=>{
                UtilsUI.setUIGroupItem(bonusItems, child, null);
            }
            list_item.numItems = 1
            let bar_count: fgui.GProgressBar = child.getChild("bar_count")
            bar_count.max = Number(taskXml.params) 
            bar_count.value = taskData.value
            let get: fgui.GGroup = child.getChild("get")
            get.visible = taskData.state == 2
            let btn_go: fgui.GButton = child.getChild("btn_go")
            btn_go.clearClick()
            btn_go.text = StrVal.LYELITEATTACK.STR24
            btn_go.visible = taskData.state == 0
            btn_go.onClick(()=>{
                if (this.taskController.selectedIndex == 0) {
                    if (taskXml.type == VarVal.BUDDYTaskType.cutTree) {
                        GuideManager.startGuide({
                            guideType: VarVal.GUIDE_TYPE.KANSHU, // 砍树
                        });
                    } else if (taskXml.type == VarVal.BUDDYTaskType.fight) {
                        GuideManager.startGuide({
                            guideType: VarVal.GUIDE_TYPE.DUEL_CHALLENGE,// 斗法挑战
                        });
                    } else if (taskXml.type == VarVal.BUDDYTaskType.vehicleUpgrade) {
                        GuideManager.startGuide({
                            guideType: VarVal.GUIDE_TYPE.MOUNT_LEVELUP,
                        });
                    } else if (taskXml.type == VarVal.BUDDYTaskType.mountainTrigger) {
                        GuideManager.startGuide({
                            guideType: VarVal.GUIDE_TYPE.VEIN_ACTIVE,// 激发灵脉
                        });
                    } else if (taskXml.type == VarVal.BUDDYTaskType.landGatherSelf) {
                        GuideManager.startGuide({
                            guideType: VarVal.GUIDE_TYPE.HAVEN_GET,//福地
                        });
                    } else if (taskXml.type == VarVal.BUDDYTaskType.landGatherOthers) {
                        GuideManager.startGuide({
                            guideType: VarVal.GUIDE_TYPE.HAVEN_FINDOTHER,//福地
                        });
                    } else if (taskXml.type == VarVal.BUDDYTaskType.adventure) {
                        GuideManager.startGuide({
                            guideType: VarVal.GUIDE_TYPE.CHALLENGE_STAGE,// 冒险
                        });
                    } else if (taskXml.type == VarVal.BUDDYTaskType.challengeMonster) {
                        GuideManager.startGuide({
                            guideType: VarVal.GUIDE_TYPE.KING_MONSTER,// 挑战妖王
                        });
                    } else if (taskXml.type == VarVal.BUDDYTaskType.animalUpgrade) {
                        GuideManager.startGuide({
                            guideType: VarVal.GUIDE_TYPE.PET_LEVELUP,// 灵兽升级
                        });
                    } else if (taskXml.type == VarVal.BUDDYTaskType.gremlinUpgrade) {
                        GuideManager.startGuide({
                            guideType: VarVal.GUIDE_TYPE.ELITE_LEVELUP,// 升级精怪
                        });
                    } else if (taskXml.type == VarVal.BUDDYTaskType.gremlinCall) {
                        GuideManager.startGuide({
                            guideType: VarVal.GUIDE_TYPE.ELITE_CALL,// 召唤精怪
                        });
                    } else if (taskXml.type == VarVal.BUDDYTaskType.share) {
                        UtilsUI.playerShareGame(() => {
                            UtilsUI.showMsgTip(StrVal.COMMON.STR101);
                        }, {
                            title: StrVal.COMMON.STR301,
                        })
                    }
                }else{
                    this.pageController.selectedIndex = 4
                }
            });
            let btn_get = child.getChild("btn_get", fgui.GButton)
            btn_get.visible = taskData.state == 1
            PointRedData.getInstance().updateManualPoint(btn_get, taskData.state == 1)
            btn_get.clearClick()
            btn_get.text = StrVal.LYELITEATTACK.STR25
            btn_get.onClick(()=>{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.refreshUI()
                        let number = 0
                        if (this.taskController.selectedIndex == 0) {
                            number = args.addCrystal
                        }else{
                            number = args.addPumpCount
                        }
                        UtilsUI.showItemReward({bonuseItems:[UtilsUI.getBonuseItem(type, null, null, String(number)) ]})
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,protoNmae, { activityId: this.dynamicParam.id, taskId:taskData.id  })
            })
        }
        this.list_task.setVirtual()
   
        this.taskController.onChanged(()=>{
            this.initTaskPage()
        });

        this.pageController.selectedIndex = 4
//#endregion
//#region 礼包      
        let pageMoney = uiPanel.getChild("pageMoney", fgui.GComponent)
        // this.label_soreNumber = page2.getChild("label_soreNumber")
        this.list_gift = pageMoney.getChild("list_all", fgui.GList)
        this.list_gift.itemRenderer =(index: number, child:fgui.GComponent)=>{
            let giftData = this.allGiftData[index]
            let bonusItem: Array<BonuseItem> = UtilsUI.getBonuseItemsByString(giftData.bonuses) 
            let group_rebeatfan = child.getChild("group_rebeatfan", fgui.GComponent)
            group_rebeatfan.visible = false
            if (giftData.score && giftData.score != 0) {
                bonusItem.push(UtilsUI.getBonuseItem(VarVal.bonusType.buddyCrystal, null, null, String(giftData.score)))
            }
            let list_all:fgui.GList = child.getChild("list_item")
            list_all.itemRenderer = (i: number, child2: fgui.GComponent)=>{
                UtilsUI.setUIGroupItem(bonusItem[i], child2, null);
            }
            list_all.numItems = bonusItem.length
            child.getChild("label_des", fgui.GLabel).text = giftData.name
            let giftState = this.getGiftState(giftData.id)
            child.getChild("label_day", fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR26, [giftData.maxBuyCount - giftState.tookCount]) 
            let btn_buy = child.getChild("btn_go", fgui.GButton);
            btn_buy.clearClick()
            let get = child.getChild("get", fgui.GGroup);
           
            let btn_fun: Function = null
            PointRedData.getInstance().updateManualPoint(btn_buy, false)
            if (giftData.type == 1 || giftData.type == 3) {
                if (giftData.type == 1) {
                    PointRedData.getInstance().updateManualPoint(btn_buy, true)
                    UtilsUI.setButtonIcon(btn_buy, null, StrVal.LYELITEATTACK.STR27)
                }else {
                    UtilsUI.setButtonIcon(btn_buy, null, StrVal.LYELITEATTACK.STR28)
                }
                btn_fun = ()=> {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.refreshUI()
                            UtilsUI.showItemReward({bonuseItems: bonusItem}) 
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"takeAnimalFairylandGiftsBonuses", { activityId: this.dynamicParam.id, id: giftData.id})
                }
            }else if(giftData.type == 2){
                let patData = LocaleData.getPayItem(giftData.param)
                UtilsUI.setButtonIcon(btn_buy, VarVal.bonusType.chance, String(Number(patData.money)/100))
                btn_fun = ()=>{
                    this.czGiftBoun = bonusItem
                    UtilsUI.payRechargeItem((errmsg:string) => {
                        if (errmsg) {
                            UtilsUI.showMsgTip(errmsg);
                        }
                    }, patData, this.dynamicParam.clasz, null);
                }
                UtilsUI.setPayItemRebateComp(group_rebeatfan, {money: patData.money})
            }
            if (Number(giftData.maxBuyCount) == giftState.tookCount) {
                btn_buy.visible = false
                get.visible = true
                group_rebeatfan.visible = false
            }else {
                get.visible = false
                btn_buy.visible = true
            }
            btn_buy.onClick(()=>{
                btn_fun()
            });
        }
//#endregion
//#region 转盘
        let pageDarw = uiPanel.getChild("pageDarw", fgui.GComponent)
        this.group_zhuanpan = pageDarw.getChild("label_number")
        this.label_baodi = pageDarw.getChild("label_baodi")
        this.img_point = pageDarw.getChild("img_point")
        for (let index = 0; index < this.dynamicParam.data.luckyRoulette.length; index++) {
            let gcItem  = pageDarw.getChild("item"+ (index + 1), fgui.GComponent)
            this.zhuanPanItems.push(gcItem)
            let data = this.dynamicParam.data.luckyRoulette[index]
            gcItem.getChild("loader_bg", fgui.GLoader).url = "ui://LyEliteMonster/frame_item" + data.quality
            let url = ""
            if (Number(data.type) == 1) {
                url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(data.protoId).icon]) 
            }else{
                url = UtilsUI.getItemIconUrl(data.type);
            }
            gcItem.getChild("loader_icon", fgui.GLoader).url = url
            gcItem.getChild("label_number", fgui.GLabel).text = data.count
            let group_times = gcItem.getChild("last_time1", fgui.GComponent)
            this.group_ZpItem.push(group_times)
            let itemContral = gcItem.getController("pos")
            if (data.maxCount == 0) {
                itemContral.selectedIndex = 0
            }else{
                if (gcItem.x > fgui.GRoot.inst.width / 2) {
                    itemContral.selectedIndex = 2
                }else{
                    itemContral.selectedIndex = 1
                }
            }
        }
        this.btn_ten = pageDarw.getChild("btn_ten")
        let btn_skipAnim: fgui.GButton = pageDarw.getChild("btn_skipAnim")
        let btn_draw: fgui.GButton = pageDarw.getChild("btn_draw")
        let btn_gl: fgui.GButton = pageDarw.getChild("btn_gl")
        let btn_gift: fgui.GButton = pageDarw.getChild("btn_gift")
        
        btn_skipAnim.text = StrVal.LYBUDDYMASS.STR8
        this.btn_ten.text = StrVal.LYBUDDYMASS.STR7
        this.btn_ten.selected = LocaleUser.getUser(VarVal.FIELD_SV.BUDDY_TEN) == "1"
        this.btn_ten.onClick(()=>{
            btn_draw.text = this.btn_ten.selected? StrVal.LYBUDDYMASS.STR10: StrVal.LYBUDDYMASS.STR9
            UtilsUI.setNeedItemGroup(this.group_zhuanpan , UtilsUI.getItemIconUrl(VarVal.bonusType.buddyToken), this.activityData.pumpCount , this.btn_ten.selected ? 10:1)
            LocaleUser.setUser(VarVal.FIELD_SV.BUDDY_TEN, this.btn_ten.selected? "1":"0");
            LocaleUser.flush()
        })

        btn_skipAnim.selected = LocaleUser.getUser(VarVal.FIELD_SV.BUDDY_SKIPANIM) == "1"
        btn_skipAnim.onClick(()=>{
            LocaleUser.setUser(VarVal.FIELD_SV.BUDDY_SKIPANIM, btn_skipAnim.selected? "1":"0");
            LocaleUser.flush()
        })

        
        let tid = 0
        let doAnim = (ids, callBack)=>{
           this.getUiPanel().getChild("btn_Mask").visible = true
            let targert = 30 * ids + 360 * 3
            this.img_point.rotation = 0
            let addTime = 0
            tid = this.setInterval(() => {
                this.img_point.rotation += addTime;
                if (this.img_point.rotation >= targert) {
                    this.clearInterval(tid);
                    if (callBack) {
                        callBack()
                        this.getUiPanel().getChild("btn_Mask").visible = false
                    }
                }else if(this.img_point.rotation >= targert * 0.6){
                    if (addTime > 0.5) {
                        addTime = addTime - 0.01
                    }
                }else if(this.img_point.rotation <= targert * 0.3){
                    if (addTime < 4) {
                        addTime = addTime + 0.025
                    }
                }
            }, 5)
        }

        btn_draw.text = this.btn_ten.selected? StrVal.LYBUDDYMASS.STR10:StrVal.LYBUDDYMASS.STR9
        btn_draw.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    if (btn_skipAnim.selected) {
                        this.refreshUI()
                        UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                    }else{
                        this.clearInterval(tid);
                        let tartgetPos = 0
                        if (args.ids.length > 1) {
                            for (let index = 0; index < args.ids.length; index++) {
                                if (this.dynamicParam.data.luckyRoulette[args.ids[index] - 1].quality == 3) {
                                    tartgetPos = args.ids[index]
                                    break
                                }
                            }
                        }else{
                            tartgetPos = args.ids[0] 
                        }
                        doAnim(tartgetPos - 1, ()=>{
                            UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                        })
                    }
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } , "animalFairylandDraw", { activityId:this.dynamicParam.id, count: this.btn_ten.selected ? 10:1 } )
        })

        btn_gift.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBuddyMassGL, 0, this.dynamicParam.data.luckyRoulette);
        });
//#endregion
//#region 派遣
        let pageSend: fgui.GComponent = uiPanel.getChild("pageSend")
        //概率界面
        let group_gailv: fgui.GComponent = this.getUiPanel().getChild("group_gailv")
        group_gailv.getChild("btn_back", fgui.GButton).onClick(()=>{
            group_gailv.visible = false
        });
        group_gailv.getChild("n146", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/frame_gailvdi{0}",[ Number(5)])
        group_gailv.getChild("n147", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/frame_gailvdi{0}",[ Number(6)])
        let label_gl4: fgui.GTextField = group_gailv.getChild("n148")
        let label_gl5: fgui.GTextField = group_gailv.getChild("n149")
        label_gl4.text = this.getLeaderAdd(4) * 100 + "%"
        label_gl5.text = this.getLeaderAdd(5) * 100 + "%"
        label_gl4.strokeColor = UtilsUI.getQualityColor(5)
        label_gl5.strokeColor = UtilsUI.getQualityColor(6)
        //自动挂机
        let group_shuax: fgui.GComponent = this.getUiPanel().getChild("group_shuax")
        group_shuax.getChild("btn_backMask", fgui.GButton).onClick(()=>{
            group_shuax.visible = false
        });
        group_shuax.getChild("btn_close", fgui.GButton).onClick(()=>{
            group_shuax.visible = false
        });
        group_shuax.getChild("label_title", fgui.GLabel).text = StrVal.LYBUDDYMASS.STR19
        group_shuax.getChild("btn").text = StrVal.LYBUDDYMASS.STR21
        group_shuax.getChild("btn", fgui.GButton).onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    let bonusItems: BonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.buddyScore, null, null, String(args.addScore)) 
                    UtilsUI.showItemReward({bonuseItems:[bonusItems]})
                    group_shuax.visible = false
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
            }
            } ,"takeAnimalFairylandQuickOnHookScore", { activityId: this.dynamicParam.id})
        });
        let btn_gou: fgui.GButton = group_shuax.getChild("btn_gou")
        btn_gou.onClick(()=>{
            LyBuddyMass.iskuaisuguaji = btn_gou.selected
        })
        btn_gou.text = StrVal.LYBUDDYMASS.STR22
        let refreshGJ = ()=>{
            let allTeamTime = 0
            for (let index = 0; index < this.teamAddTime.length; index++) {
                let time = this.teamAddTime[index];
                allTeamTime = time + allTeamTime
            }
            group_shuax.visible = true
            group_shuax.getChild("label_des").text = UtilsTool.stringFormat(StrVal.LYBUDDYMASS.STR20, [this.dynamicParam.data.refreshBuffCost, Math.floor(allTeamTime *60)])
            let group_needItem: fgui.GComponent = group_shuax.getChild("group_needItem")
            UtilsUI.setNeedItemGroup(group_needItem, UtilsUI.getItemIconUrl(VarVal.bonusType.buddyCrystal), this.activityData.crystal ,this.dynamicParam.data.refreshBuffCost)
        }
        pageSend.getChild("btn_ks", fgui.GButton).onClick(()=>{
            if (this.activityData.crystal < this.dynamicParam.data.refreshBuffCost) {
                UtilsUI.showMsgTip(StrVal.LYBUDDYMASS.STR36)
                return
            }
            if (LyBuddyMass.iskuaisuguaji) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        let bonusItems: BonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.buddyScore, null, null, String(args.addScore)) 
                        UtilsUI.showItemReward({bonuseItems:[bonusItems]})
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                }
                } ,"takeAnimalFairylandQuickOnHookScore", { activityId: this.dynamicParam.id})
            }else {
                refreshGJ()
            }
        });
        this.list_allTeam = pageSend.getChild("list_allTeam")
        let btn_point = pageSend.getChild("btn_point", fgui.GButton)
        btn_point.onClick(()=>{
            group_gailv.visible = true
        });
        this.group_Crystalnumber = pageSend.getChild("group_Crystalnumber")
        this.label_nowScore = pageSend.getChild("label_nowScore")
        this.label_allTimeAdd = pageSend.getChild("label_allTimeAdd")
        this.img_pro = pageSend.getChild("img_pro")
        this.label_pro = pageSend.getChild("label_pro")
        pageSend.getChild("loader_icon", fgui.GLoader).url = UtilsUI.getItemIconUrl(VarVal.bonusType.buddyScore)
        let btn_refresh: fgui.GButton = pageSend.getChild("btn_refresh")
        btn_refresh.text = StrVal.LYBUDDYMASS.STR13
        btn_refresh.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBuddyChoose, 0, null);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
            }
            } ,"animalFairylandRefreshBuff", { activityId: this.dynamicParam.id})
        });
        this.btn_get = pageSend.getChild("btn_get")
        this.btn_get.text = StrVal.LYBUDDYMASS.STR14
        this.btn_get.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    let bonusItems: BonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.buddyScore, null, null, String(args.addScore)) 
                    UtilsUI.showItemReward({bonuseItems:[bonusItems]})
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
            }
            } ,"takeAnimalFairylandPoolScore", { activityId: this.dynamicParam.id})
        })
        let loader_getJf: fgui.GLoader = pageSend.getChild("loader_getJf")
        loader_getJf.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    let bonusItems: BonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.buddyScore, null, null, String(args.addScore)) 
                    UtilsUI.showItemReward({bonuseItems:[bonusItems]})
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
            }
            } ,"takeAnimalFairylandPoolScore", { activityId: this.dynamicParam.id})
        })

        let label_buff: fgui.GLabel = pageSend.getChild("label_buff")
        label_buff.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBuddyWish, 0, {dynamicParam: this.dynamicParam,buffState: this.activityData.buffState});
        })

        
        
        let setPetFun = (gc: fgui.GComponent, data: any)=>{
            let img_add: fgui.GImage = gc.getChild("img_add")
            let group_addTime: fgui.GGroup = gc.getChild("group_addTime")
            let label_time: fgui.GGroup = gc.getChild("label_time")
            let loader_spine3d: fgui.GLoader3D = gc.getChild("loader_spine3d")
            loader_spine3d.freeSpine()
            if (data.petProtoId) {
                let pet = LocaleData.getPetProto(data.petProtoId)
                let showInfo = LocaleData.getModelShowInfo(String(pet.modelId));
                img_add.visible = false
                let spp = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                }, loader_spine3d, showInfo.spine);

                let attTime = UtilsTool.random(3000, 15000)
                let temp = this.setInterval(() => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.attack, false, 0, null,()=>{
                        attTime = UtilsTool.random(3000, 15000)
                        spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                    })
                }, attTime)
                this.insters.push(temp)
                // let starArr: fgui.GLoader[] = []
                // for (let i = 1; i < 6; i++) {
                //     let starItem: fgui.GLoader = gc.getChild("img_star" + i)
                //     starArr.push(starItem)
                // }
                // let iiii = data.petDevourLevel
                // if (iiii >= 1) {
                //     let stagNum: number = Math.floor(iiii / 5)
                //     let starNum: number = iiii % 5
                //     for (let i = 0; i < starArr.length; i++) {
                //         let element = starArr[i];
                //         element.visible = true
                //         if (i < starNum) {
                //             element.url = UtilsTool.stringFormat("ui://LyPet/star_{0}", [stagNum]);
                //         } else {
                //             if (stagNum > 0) {
                //                 element.url = UtilsTool.stringFormat("ui://LyPet/star_{0}", [stagNum - 1]);
                //             } else {
                //                 element.visible = false
                //             }
                //         }
                //     }
                // } else {
                    
                // }
                label_time.text = UtilsTool.stringFormat(StrVal.LYBUDDYMASS.STR17, [this.getOnePetaddTime(pet.quality, data.petDevourLevel)])
                group_addTime.visible = true
            }else{
                img_add.visible = true
                group_addTime.visible = false
                loader_spine3d.freeSpine()
                // for (let i = 1; i < 6; i++) {
                //     gc.getChild("img_star" + i, fgui.GLoader).url = ""
                // }
            }
        }
        this.list_allTeam.itemRenderer = (index:number, child:fgui.GComponent)=>{
            let teamXml = this.dynamicParam.data.teamsInfo[index]
            let temaData = this.activityData.teamsInfo[index].slotsInfo
            let label_addTime: fgui.GLabel = child.getChild("label_addTime")
            // let list_dz: fgui.GList = child.getChild("list_dz")
            let group_dz: fgui.GComponent = child.getChild("group_dz")
            let loader_bg: fgui.GLoader = child.getChild("loader_bg")
            loader_bg.url = UtilsTool.stringFormat("ui://LyEliteMonster/bg_paiqian{0}", [index]) 
            child.getChild("label_name", fgui.GLabel).text = teamXml.name
            group_dz.clearClick()
            group_dz.onClick(()=>{
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBuddyChoose, 0, { type: 0, teamXml:teamXml, temaData:this.activityData.teamsInfo, dynamicParam: this.dynamicParam, posId: 1});
            });
            setPetFun(group_dz, temaData[0])
            // // group_dz.getChild("group_addTime").visible = false
            // list_dz.itemRenderer = (index2:number, child:fgui.GComponent)=>{
            //     index2 = index2 + 1
              
            // };
            // list_dz.numItems = Number(teamXml.slotCount) - 1
            for (let i = 1; i < Number(teamXml.slotCount); i++) {
                let itemgc = child.getChild(("group_dy" + i), fgui.GComponent)
                let onePet = temaData[i]
                setPetFun(itemgc, onePet)
                itemgc.clearClick()
                itemgc.onClick(()=>{
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBuddyChoose, 0, { type: 1, teamXml:teamXml, temaData:this.activityData.teamsInfo, dynamicParam: this.dynamicParam, posId: i + 1});
                });
            }
            
            let teamAddTime = this.getTeamAddTimes(index)
            this.teamAddTime.push(teamAddTime)
            // child.getChild("group_addTime").visible = teamAddTime != 0
            label_addTime.text = UtilsTool.stringFormat(StrVal.LYBUDDYMASS.STR17, [Math.floor(teamAddTime)])
        }
//#endregion
        this.refreshUI()
        this.pageController.onChanged(()=>{
            this.refreshUI()
        });

        //充值奖励事件注册
        this.registerRequest((args) => {
            if (args.source == 4) {
                UtilsUI.showItemReward({
                    bonuseItems: this.czGiftBoun,
                    rebateBonuseItems:UtilsUI.getRebateBonuseItems()
                });
                this.czGiftBoun = null
            }
         }, "itemInserts");

         this.setInterval(()=>{
            let serverTime = GameServerData.getInstance().getServerTime()
            this.label_time.text = UtilsTool.parseTimeToString(this.dynamicParam.endTime - serverTime);
        }, 1000);

        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == this.dynamicParam.id) {
                // let activityData = GameServerData.getInstance().getActivityState(this.dynamicParam.id).data.activityAnimalFairyland;
                this.refreshUI()
            }
        }, "activityStateChanged");

        this.registerRequest((args) => {
            if (args.activityGlobalState.activityId == this.dynamicParam.id) {
                // this.lastRecoverTime = args.activityGlobalState.data.activityGlobalGremlinExperience.lastRecoverTime + this.dynamicParam.data.attackCountRecoverTime
                // let serverTime = GameServerData.getInstance().getServerTime()
                // label_time4.text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR30, [UtilsTool.parseTimeToString(this.lastRecoverTime - serverTime)]); 
                // this.refreshUI()
            }
        }, "activityGlobalStateChanged");
    }

    private initTaskPage() {
        this.showTaskData = []
        if (this.taskController.selectedIndex == 0) {
            this.showTaskData =  this.dynamicParam.data.taskGroup
        }else {
            this.showTaskData = this.dynamicParam.data.exploreTaskGroup
        }
        this.showTaskData.sort((a, b):number=>{
            let stataA 
            let stataB 
            if (this.taskController.selectedIndex == 0) {
                stataA = this.getTaskState(a.id).state
                stataB = this.getTaskState(b.id).state
            }else {
                stataA = this.getExploreTaskState(a.id).state
                stataB = this.getExploreTaskState(b.id).state
            }
            if (stataA == 2) {
                stataA = -1
            }
            if (stataB == 2) {
                stataB = -1
            }
            return stataB - stataA
        });
        if (this.list_task.numItems == 0) {
            UtilsUI.setFguiGlistDelayNumItems(this.list_task, this.showTaskData.length);
        }else{
            this.list_task.numItems = this.showTaskData.length
        }
    } 

    public refreshUI(){
        // if (this.pageController.selectedIndex != 4) {
        //     for (let index = 0; index < this.insters.length; index++) {
        //         this.clearInterval(this.insters[index])
        //     }
        //     this.insters = []
        //     this.list_allTeam.numItems = 0
        // }
        let baseInfo =  GameServerData.getInstance().getPlayerFullInfo().base
        this.activityData = GameServerData.getInstance().getActivityState(this.dynamicParam.id).data.activityAnimalFairyland;
        if (this.pageController.selectedIndex == 0) {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.rankData = args.ranks
                    UtilsUI.setFguiGlistDelayNumItems(this.list_rank, this.allRankMax)
                    this.myRankNumber = args.playerRank
                    this.label_sore.text = this.activityData.score
                    this.label_myRank.text = this.myRankNumber == 0 ? StrVal.LYELITEATTACK.STR13 : this.myRankNumber
                    let rankBoun = this.getRanksBonuses(this.myRankNumber)
                    if (this.myRankNumber != 0) {
                        let bonusItem: Array<BonuseItem> = UtilsUI.getBonuseItemsByString(rankBoun.bonuses) 
                        this.list_rankItem.itemRenderer = (index1: number, child2: fgui.GComponent)=>{
                            UtilsUI.setUIGroupItem(bonusItem[index1], child2, null);
                        }
                        UtilsUI.setFguiGlistDelayNumItems(this.list_rankItem, bonusItem.length)
                    }
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
            }
            } ,"getAnimalFairylandRanks", { activityId: this.dynamicParam.id })
            let charInfo = LocaleData. getCharShowResInfoSelf()
            this.loader_selfIcon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            this.label_selfName.text = GameServerData.getInstance().getPlayerFullInfo().base.name
            this.label_xfdesc.text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR35, [this.activityData.chance])
            // pageRank.getChild("group_head", fgui.GComponent).visible = true
        }else if(this.pageController.selectedIndex == 1){
            PointRedData.getInstance().updateManualPoint(this.btn_task1, LyBuddyMass.inTaskRedPoint2(this.dynamicParam.id))
            PointRedData.getInstance().updateManualPoint(this.btn_task2, LyBuddyMass.inTaskRedPoint1(this.dynamicParam.id))
            this.initTaskPage()
        }else if(this.pageController.selectedIndex == 2){
            this.allGiftData = this.dynamicParam.data.giftsGroup
            this.allGiftData.sort((a, b)=>{
                let stateA = this.getGiftState(a.id)
                let stateB = this.getGiftState(b.id)
                let getA = stateA.tookCount == a.maxBuyCount? 1:0
                let getB = stateB.tookCount == b.maxBuyCount? 1:0
                if (getA == getB) {
                    return Number(a.id) - Number(b.id)                    
                }else{
                    return getA - getB                
                }
            });
            if (this.list_gift.numItems == 0) {
                UtilsUI.setFguiGlistDelayNumItems(this.list_gift, this.allGiftData.length);
            }else{
                this.list_gift.numItems = this.allGiftData.length
            }
        }else if (this.pageController.selectedIndex == 3) {
            for (let index = 0; index < this.group_ZpItem.length; index++) {
                let gc = this.group_ZpItem[index];
                let data = this.dynamicParam.data.luckyRoulette[index]
                gc.getChild("label_number", fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYBUDDYMASS.STR18, [Number(data.maxCount)])
                if (Number(data.maxCount)!= 0) {
                    for (let index2 = 0; index2 < this.activityData.drawRecords.length; index2++) {
                        let drawRecord = this.activityData.drawRecords[index2];
                        if (drawRecord.id == data.id) {
                            gc.getChild("label_number", fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYBUDDYMASS.STR18, [Number(data.maxCount) - drawRecord.count])
                            break
                        }
                    }
                }
            }
            this.label_baodi.text = UtilsTool.stringFormat(StrVal.LYBUDDYMASS.STR12, [this.dynamicParam.data.guaranteeCount - (this.activityData.totalPumpCount % this.dynamicParam.data.guaranteeCount)]); 
            UtilsUI.setNeedItemGroup(this.group_zhuanpan , UtilsUI.getItemIconUrl(VarVal.bonusType.buddyToken), this.activityData.pumpCount , this.btn_ten.selected ? 10:1)
        }else if(this.pageController.selectedIndex == 4){
            this.teamAddTime = []
            for (let index = 0; index < this.insters.length; index++) {
                this.clearInterval(this.insters[index])
            }
            this.insters = []
            if (this.list_allTeam.numItems == 0) {
                UtilsUI.setFguiGlistDelayNumItems(this.list_allTeam, this.dynamicParam.data.teamsInfo.length);
            }else{
                this.list_allTeam.numItems = this.dynamicParam.data.teamsInfo.length
            }
            
            this.img_pro.fillAmount = this.activityData.poolScore / this.dynamicParam.data.poolMaxScore
            this.label_pro.text = UtilsTool.stringFormat("{0}/{1}", [this.activityData.poolScore, this.dynamicParam.data.poolMaxScore])
            UtilsUI.setNeedItemGroup(this.group_Crystalnumber, UtilsUI.getItemIconUrl(VarVal.bonusType.buddyCrystal), this.activityData.crystal ,this.dynamicParam.data.refreshBuffCost)
            // this.label_allTimeAdd._alignOffset
            let allTeamTime = 0
            for (let index = 0; index < this.teamAddTime.length; index++) {
                let time = this.teamAddTime[index];
                allTeamTime = time + allTeamTime
            }
            PointRedData.getInstance().updateManualPoint(this.btn_get, this.activityData.pumpCount >= this.dynamicParam.data.refreshBuffCost)
            this.label_nowScore.text = this.activityData.score
            this.label_allTimeAdd.text = UtilsTool.stringFormat(StrVal.LYBUDDYMASS.STR17, [Math.ceil(allTeamTime)])
        }
    }

    public getRanksPItem(rank): any{
        rank = Number(rank)
        for (let index = 0; index < this.rankData.length; index++) {
            let item = this.rankData[index]
            if (item.rank == rank) {
                return item
            }
        }
        return null
    }

    public getRanksBonuses(rank): any{
        for (let index = 0; index < this.dynamicParam.data.ranksBonuses.length; index++) {
            let group = this.dynamicParam.data.ranksBonuses[index];
            let nextGroup = index + 1 >= this.dynamicParam.data.ranksBonuses.length ? this.dynamicParam.data.ranksBonuses[this.dynamicParam.data.ranksBonuses.length - 1] : this.dynamicParam.data.ranksBonuses [index + 1]
            if (Number(nextGroup.rank) - Number(group.rank) == 1 && Number(group.rank) == rank) {
                return group
            }else if (rank > Number(group.rank) && rank <= Number(nextGroup.rank)) {
                return group
            }
        }
        return null
    }

    public getTaskState(id: number| string){
        id = String(id)
        for (let index = 0; index < this.activityData.tasksStates.length; index++) {
            let group = this.activityData.tasksStates[index];
            if (group.id == id) {
                return group
            }
        }
        return {id: id, state: 0 , value:0 }
    }

    public getExploreTaskState(id: number| string){
        id = String(id)
        for (let index = 0; index < this.activityData.exploreTasksStates.length; index++) {
            let group = this.activityData.exploreTasksStates[index];
            if (group.id == id) {
                return group
            }
        }
        return {id: id, state: 0 , value:0 }
    }

    public getGiftState(id: number| string){
        id = String(id)
        for (let index = 0; index < this.activityData.giftsRecords.length; index++) {
            let group = this.activityData.giftsRecords[index];
            if (group.id == id) {
                return group
            }
        }
        return {id: id, tookCount: 0}
    }


    public getOnePetaddTime(qua, devLevel){
       let xml = this.getQuaAddData(qua)
       return xml.baseValue + xml.devourLevelAdd * devLevel
    }
   
    

    public getQuaAddData(qua){
        qua = Number(qua)
        for (let index = 0; index < this.dynamicParam.data.qualityAddData.length; index++) {
            let data = this.dynamicParam.data.qualityAddData[index];
            if (data.quality ==qua ) {
               return data
            }
        }
    }

    public getTeamAddTimes(pos): number{
        let time = 0
        for (let index = 0; index < this.activityData.teamsInfo[pos].slotsInfo.length; index++) {
            let element = this.activityData.teamsInfo[pos].slotsInfo[index];
            if (element.petProtoId) {
                time = time + this.getOnePetaddTime(LocaleData.getPetProto(element.petProtoId).quality, element.petDevourLevel)
            }
        }
        if (this.activityData.teamsInfo[pos].slotsInfo[0].petProtoId) {
            time = time * (1 + this.getLeaderAdd(LocaleData.getPetProto(this.activityData.teamsInfo[pos].slotsInfo[0].petProtoId).quality))
        }
        return time
    }   

    public getLeaderAdd(qua): number{
        qua = Number(qua)
        for (let index = 0; index < this.dynamicParam.data.qualityAddData.length; index++) {
            let now = this.dynamicParam.data.qualityAddData[index];
            if (Number(now.quality) == qua) {
                return now.captainAddCoef / 10000
            }
        }
        return 0
    }

   
    public onViewUpdate(params: any): void {
        if (params && params.isSkipTask) {
            this.pageController.selectedIndex = 1
        }
        this.refreshUI()
    }

    public getIsViewMask(): boolean {
        return false;
    }

    public onViewShowFront(): void {
        this.refreshUI()
    }

    public static inViewRedPointTask(activityId:number | string): boolean{
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
           if (LyBuddyMass.inTaskRedPoint1(activityId) || LyBuddyMass.inTaskRedPoint2(activityId)) {
                return true
           }
        }
        return false
    }

    public static inTaskRedPoint1(activityId:number | string): boolean{
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
            let tasksStates = activityState.data.activityAnimalFairyland.tasksStates;
            for (let index = 0; index < tasksStates.length; index++) {
                let taskData = tasksStates[index];
                if (taskData.state == 1) {
                    return true
                }
            } 
        }
        return false
    }

    public static inTaskRedPoint2(activityId:number | string): boolean{
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
            let exploreTasksStates = activityState.data.activityAnimalFairyland.exploreTasksStates;
            for (let index = 0; index < exploreTasksStates.length; index++) {
                let taskData = exploreTasksStates[index];
                if (taskData.state == 1) {
                    return true
                }
            }
        }
        return false
    }

    public static inViewRedPointGift(activityId:number | string): boolean{
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
            let dynamicParam = GameServerData.getInstance().getDynamicActivityParam(activityId)
            let giftsGroup = dynamicParam.data.giftsGroup
            for (let index = 0; index < giftsGroup.length; index++) {
                let gift = giftsGroup[index];
                if (gift.type == 1) {
                    let giftsRecords = activityState.data.activityAnimalFairyland.giftsRecords;
                    for (let index = 0; index < giftsRecords.length; index++) {
                        let state = giftsRecords[index];
                        if (state.id == gift.id) {
                            return Number(gift.maxBuyCount) != state.tookCount
                        }
                    }
                }
            }
           
        }
        return false
    }

    public static inViewRedPointFullScore(activityId:number | string): boolean{
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
            let dynamicParam = GameServerData.getInstance().getDynamicActivityParam(activityId)
           return activityState.data.activityAnimalFairyland.poolScore >= dynamicParam.data.poolMaxScore
        }
        return false
    }
}


