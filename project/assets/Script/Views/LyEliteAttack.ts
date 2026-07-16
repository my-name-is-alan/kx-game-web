//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServer } from "../Kernel/GameServer";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { VarVal } from "../Values/VarVal";
import { Color } from "cc";
import { LyEliteDisperse } from "./LyEliteDisperse";
import { LyGuideDetail } from "./LyGuideDetail";
import { GuideManager } from "../Kernel/GuideManager";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { AudioManager } from "../Kernel/AudioManager";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { LyPayExquisite, PayExquisitePage } from "./LyPayExquisite";

export class LyEliteAttack extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyEliteAttack";
    }
    private rankColor: Array<Color> = [
        new Color(183, 114, 24),
        new Color(110, 47, 145),
        new Color(62, 108, 163),
    ]
    private dynamicParam: any;
    private pageController: fgui.Controller
    private activityData: any
    private label_time: fgui.GLabel
    private allGiftData: any
    private allTopUpData: any
    private payBouns: any
    //排行榜
    private rankData: any
    private myRankNumber = 0
    private rankMax = 200
    private allRankMax = 0
    //排行榜ui
    private list_rank
    private label_myRank
    private label_sore
    private img_nobody: fgui.GImage
    private label_selfName:fgui.GLabel
    private loader_selfIcon:fgui.GLoader
    private list_rankItem: fgui.GList
    private label_xfdesc: fgui.GLabel
    //任务
    private list_task
    //礼包
    private label_soreNumber
    private list_gift
    //累充
    private list_topUp
    //驱散恶灵
    private lastRecoverTime: any
    private group_monsters: Array<fgui.GComponent> = []
    private label_score4: fgui.GLabel
    private group_need4: fgui.GComponent
    private label_number4: fgui.GLabel
    public onViewCreate(_params:any): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        this.dynamicParam = _params.dynamicParam
        this.getUiPanel().getChild("btn_back").onClick(()=>{
             ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteAttack, 0, null)
        });
        let uiPanel:fgui.GComponent = this.getUiPanel().getChild("main")
        this.label_time = uiPanel.getChild("label_emailNumber")
        UtilsUI.playCommonGroupAni(uiPanel, null);
        this.pageController = uiPanel.getController("page")
        uiPanel.getChild("label_title", fgui.GLabel).text = this.dynamicParam.name
        uiPanel.getChild("btn_rank", fgui.GButton).text = StrVal.LYELITEATTACK.STR1
        uiPanel.getChild("btn_task", fgui.GButton).text = StrVal.LYELITEATTACK.STR2
        uiPanel.getChild("btn_gift", fgui.GButton).text = StrVal.LYELITEATTACK.STR3
        uiPanel.getChild("btn_total", fgui.GButton).text = StrVal.LYELITEATTACK.STR4
        uiPanel.getChild("btn_attack", fgui.GButton).text = StrVal.LYELITEATTACK.STR5
        uiPanel.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteAttack, 0, null)
        });
        uiPanel.getChild("btn_what", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title: this.dynamicParam.name, detail: this.dynamicParam.desc });
        });
        PointRedData.getInstance().registerPoint(uiPanel.getChild("btn_task"), PointRedType.LyEliteAttackTask, this.dynamicParam.id)
        PointRedData.getInstance().registerPoint(uiPanel.getChild("btn_gift"), PointRedType.LyEliteAttackGift, this.dynamicParam.id)
        PointRedData.getInstance().registerPoint(uiPanel.getChild("btn_total"), PointRedType.LyEliteAttackToUp, this.dynamicParam.id)
       
        //#region 排行榜
        let page0: fgui.GComponent = uiPanel.getChild("page0")
        // let btn_change: fgui.Controller = page0.getController("btn_change")
        // btn_change.selectedIndex = 0
        let loader_jz = page0.getChild("loader_jz", fgui.GLoader)
        loader_jz.url = UtilsUI.getItemIconUrl(VarVal.bonusType.chance)
        this.label_xfdesc = page0.getChild("label_xfdesc", fgui.GLabel)
        this.list_rank =  page0.getChild("list_rank", fgui.GList)
        this.label_myRank =  page0.getChild("label_rank", fgui.GLabel)
        this.label_sore =  page0.getChild("label_myScore", fgui.GLabel)
        this.label_sore =  page0.getChild("label_myScore", fgui.GLabel)
        this.img_nobody = page0.getChild("img_nobody")
        this.label_selfName = page0.getChild("label_name", fgui.GLabel)
        this.loader_selfIcon = page0.getChild("group_head", fgui.GComponent).getChild("group_icon", fgui.GComponent).getChild("loader_icon", fgui.GLoader)
        this.list_rankItem = page0.getChild("list_item")
        // page0.getChild("n64",fgui.GLabel).text = StrVal.LYELITEATTACK.STR7
        // page0.getChild("n85",fgui.GButton).text = StrVal.LYELITEATTACK.STR6
        // page0.getChild("n65",fgui.GLabel).text = StrVal.LYELITEATTACK.STR8
        // page0.getChild("n66",fgui.GLabel).text = StrVal.LYELITEATTACK.STR9
        // page0.getChild("label_myRankDes",fgui.GLabel).text = StrVal.LYELITEATTACK.STR11
        // page0.getChild("label_scoreDes",fgui.GLabel).text = StrVal.LYELITEATTACK.STR9
        page0.getChild("n81",fgui.GLabel).text = StrVal.LYELITEATTACK.STR12
        
        // let list_all: fgui.GList = page0.getChild("list_all", fgui.GList)

        this.list_rank.setVirtual()
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
        this.list_rank.itemRenderer = (index: number, child: fgui.GComponent)=>{
            let haveDescNumber = 0
            for (let i = 0; i < chaneXml.length; i++) {
                let chance = chaneXml[i];
                if (index > Number(chance.rank) + i) {
                    haveDescNumber = haveDescNumber + 1
                }
                if (index == Number(chance.rank) + i) {
                    child.getChild("n103").text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR34, [chance.rank, chance.chance2]) 
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
                label_score.text = UtilsTool.nToFStr(rankItem.score);
                let label_name:fgui.GTextField = child.getChild("label_name");
                label_name.text = rankItem.name;
                let group_head: fgui.GComponent = child.getChild("group_head")
                let loader_iconself:fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
                let charInfo = LocaleData.getCharShowResInfo(rankItem.character, rankItem.phase, rankItem.appearance, rankItem.avatar);
                loader_iconself.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            }
            // let c1 =

            // if (index < 3) {
            //     label_rank.text = ""
            //     label_rank.strokeColor = this.rankColor[index]
            //     loader_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_ranking_{0}", [index < 3 ? "0" + (index + 1) : 0])
            // }else{
            //     loader_rank.url = ""
            //     label_rank.fontSize = 26
            //     label_rank.stroke = 0
            //     label_rank.color = new Color(22,25,26)
            // }
            // let loader_icon:fgui.GLoader = child.getChild("loader_icon");
            // loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);

            // let label_name:fgui.GTextField = child.getChild("label_name");
           

            // let loader_phase:fgui.GLoader = child.getChild("loader_phase");
            // UtilsUI.setTitleIconByTitleId(loader_phase, rankItem.phase);
            
            
        }
        // list_all.itemRenderer = (index: number, child: fgui.GComponent)=>{
        //     let rankBoun = this.dynamicParam.data.ranksBonuses[index]
        //     
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
        
        this.refreshUI()
        // #endregion
        //#region 任务
        let page1 = uiPanel.getChild("page1", fgui.GComponent)
        page1.getChild("desc",fgui.GLabel).text = StrVal.LYELITEATTACK.STR23
        this.list_task = page1.getChild("list_all", fgui.GList)
        this.list_task.itemRenderer = (index: number, child: fgui.GComponent)=>{
            // label_des
            let taskXml = this.dynamicParam.data.taskGroup[index]
            let taskData = this.getTaskState(taskXml.id)
            
            child.getChild("label_des",fgui.GLabel).text = taskXml.name
            let list_item:fgui.GList = child.getChild("list_item")
            let bonusItems: BonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.elitescore, null, null, String(taskXml.score)) 
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
                if (taskXml.type == VarVal.MenKeTFTaskType.cutTree) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.KANSHU, // 砍树
                    });
                } else if (taskXml.type == VarVal.MenKeTFTaskType.fight) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.DUEL_CHALLENGE,// 斗法挑战
                    });
                } else if (taskXml.type == VarVal.MenKeTFTaskType.strangeAnimalInvade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.INVASION,// 异兽入侵
                    });
                } else if (taskXml.type == VarVal.MenKeTFTaskType.gremlinCall) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.ELITE_CALL,// 召唤精怪
                    });
                } else if (taskXml.type == VarVal.MenKeTFTaskType.gremlinUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.ELITE_LEVELUP,// 升级精怪
                    });
                }  else if (taskXml.type == VarVal.MenKeTFTaskType.landGatherSelf) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.HAVEN_GET,//福地
                    });
                } else if (taskXml.type == VarVal.MenKeTFTaskType.landGatherOthers) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.HAVEN_FINDOTHER,//福地
                    });
                }  else if (taskXml.type == VarVal.MenKeTFTaskType.companionExplore) { 
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.COMPANION,// 兽友
                    });  
                } else if (taskXml.type == VarVal.MenKeTFTaskType.share) {
                    UtilsUI.playerShareGame(() => {
                        UtilsUI.showMsgTip(StrVal.COMMON.STR101);
                    }, {
                        title: StrVal.COMMON.STR301,
                    })
                }
            });
            let btn_get: fgui.GButton = child.getChild("btn_get")
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
                        UtilsUI.showItemReward({bonuseItems:[bonusItems]})
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"takeGremlinExperienceTaskBonuses", { activityId: this.dynamicParam.id, taskId:taskData.id  })
            })
        }
        //#endregion
        //#region 礼包
        let page2 = uiPanel.getChild("page2", fgui.GComponent)
        this.label_soreNumber = page2.getChild("label_soreNumber")
        this.list_gift = page2.getChild("list_all", fgui.GList)
        
        this.list_gift.itemRenderer =(index: number, child:fgui.GComponent)=>{
            let giftData = this.allGiftData[index]
            let bonusItem: Array<BonuseItem> = UtilsUI.getBonuseItemsByString(giftData.bonuses) 
            let list_all:fgui.GList = child.getChild("list_item")
            list_all.itemRenderer = (i: number, child2: fgui.GComponent)=>{
                UtilsUI.setUIGroupItem(bonusItem[i], child2, null);
            }
            list_all.numItems = bonusItem.length
            let group_rebeatfan = child.getChild("group_rebeatfan", fgui.GComponent)
            group_rebeatfan.visible = false
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
                    UtilsUI.setButtonIcon(btn_buy, null, StrVal.LYELITEATTACK.STR27)
                    PointRedData.getInstance().updateManualPoint(btn_buy, Number(giftData.maxBuyCount) != giftState.tookCount)
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
                    } ,"takeGremlinExperienceGiftsBonuses", { activityId: this.dynamicParam.id, id: giftData.id})
                }
            }else if(giftData.type == 2){
                let patData = LocaleData.getPayItem(giftData.param)
                UtilsUI.setButtonIcon(btn_buy, VarVal.bonusType.chance, String(Number(patData.money)/100))
                btn_fun = ()=>{
                    this.payBouns = bonusItem
                    UtilsUI.payRechargeItem((errmsg:string) => {
                        if (errmsg) {
                            UtilsUI.showMsgTip(errmsg);
                        }
                    }, patData, VarVal.payType.stone, null);
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

        //#region 累充
        let page3 = uiPanel.getChild("page3", fgui.GComponent)
        this.list_topUp = page3.getChild("list_all", fgui.GList);
        this.list_topUp.itemRenderer = (index: number, child: fgui.GComponent)=>{
            let rechargeData = this.allTopUpData[index]
            child.getChild("label_des", fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR32, [rechargeData.name, this.activityData.totalMoney, Number(rechargeData.money/100)]) 
            let list_item: fgui.GList = child.getChild("list_item")
            let bonusItem: Array<BonuseItem> = UtilsUI.getBonuseItemsByString(rechargeData.bonuses) 
            list_item.itemRenderer = (i: number, child2: fgui.GComponent)=>{
                UtilsUI.setUIGroupItem(bonusItem[i], child2, null);
            }
            list_item.numItems = bonusItem.length
            let get:fgui.GGroup = child.getChild("get")
            let btn_go: fgui.GButton = child.getChild("btn_go")
            btn_go.text = StrVal.LYELITEATTACK.STR24
            let btn_get: fgui.GButton = child.getChild("btn_get")
            btn_get.text = StrVal.LYELITEATTACK.STR25
            let isGet = this.getRechargeRecord(rechargeData.money)
            get.visible = false
            btn_go.visible = false
            btn_get.visible = false
            btn_go.clearClick()
            btn_get.clearClick()
            if (isGet) {
                get.visible = true
                btn_go.visible = false
                btn_get.visible = false
            }else{
                //可领取
                if (this.activityData.totalMoney >= Number(rechargeData.money/100)) {
                    btn_get.visible = true
                    PointRedData.getInstance().updateManualPoint(btn_get, true)
                }else{
                    btn_go.visible = true
                    PointRedData.getInstance().updateManualPoint(btn_get, false)
                }
            }
            if (PlatformAPI.isBinaryExamine() && PlatformAPI.isMiniGameOniOS()) {
                btn_go.visible = false;
            }
            btn_go.onClick(()=>{
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.RECHARGE});
            });
            btn_get.onClick(()=>{
                UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.refreshUI()
                            UtilsUI.showItemReward({bonuseItems: bonusItem}) 
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                } ,"takeGremlinExperienceTotalRechargeBonuses", { activityId: this.dynamicParam.id, money: rechargeData.money})
            })
        }
        //#endregion

        //#region 驱散
        let page4 = uiPanel.getChild("page4", fgui.GComponent)
        let btn_refresh = page4.getChild("btn_refresh", fgui.GButton);
        // let group_add4: fgui.GComponent = page4.getChild("group_add")
        let loader_use4:fgui.GLoader = page4.getChild("loader_icon")
        this.label_number4 = page4.getChild("label_number")
        let label_time4 = page4.getChild("label_time")
        let btn_add: fgui.GLoader = page4.getChild("btn_add")
        loader_use4.url = UtilsUI.getItemIconUrl(VarVal.bonusType.elitescore);
        
        btn_add.onClick(()=>{
            this.pageController.selectedIndex = 1
        })
        btn_refresh.text = StrVal.LYELITEATTACK.STR15
        btn_refresh.onClick(()=>{
            let baseInfo =  GameServerData.getInstance().getPlayerFullInfo().base
            if (baseInfo.stone >= this.dynamicParam.data.attackMonstersRefreshCost) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.refreshUI()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"gremlinExperienceMonstersRefresh", { activityId: this.dynamicParam.id })
            }else{

            }
        });
       
        for (let index = 0; index < 3; index++) {
            this.group_monsters.push(page4.getChild("group" + index, fgui.GComponent))
        }
        this.label_score4 = page4.getChild("label_score")
        this.group_need4 = page4.getChild("group_need")
        //#endregion
        this.pageController.onChanged(()=>{
            this.refreshUI()
        });

        //充值奖励事件注册
        this.registerRequest((args) => {
            if (args.source == 6) {
                UtilsUI.showItemReward({
                    bonuseItems :this.payBouns,
                    rebateBonuseItems:UtilsUI.getRebateBonuseItems()
                });
                this.payBouns = null
            }
         }, "itemInserts");

         this.setInterval(()=>{
            let serverTime = GameServerData.getInstance().getServerTime()
            this.label_time.text = UtilsTool.parseTimeToString(this.dynamicParam.endTime - serverTime);
            // if (this.pageController.selectedIndex == 6) {
            label_time4.text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR30, [UtilsTool.parseTimeToString(this.lastRecoverTime - serverTime)]); 
            // }
        }, 1000);

        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == this.dynamicParam.id) {
                let activityData = GameServerData.getInstance().getActivityState(this.dynamicParam.id).data.activityGremlinExperience;
                this.label_number4.text = activityData.attackCount
                this.refreshUI()
            }
        }, "activityStateChanged");

        this.registerRequest((args) => {
            if (args.activityGlobalState.activityId == this.dynamicParam.id) {
                this.lastRecoverTime = args.activityGlobalState.data.activityGlobalGremlinExperience.lastRecoverTime + this.dynamicParam.data.attackCountRecoverTime
                let serverTime = GameServerData.getInstance().getServerTime()
                label_time4.text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR30, [UtilsTool.parseTimeToString(this.lastRecoverTime - serverTime)]); 

            }
        }, "activityGlobalStateChanged");
    }

    private refreshUI(): void {
        let baseInfo =  GameServerData.getInstance().getPlayerFullInfo().base
        this.activityData = GameServerData.getInstance().getActivityState(this.dynamicParam.id).data.activityGremlinExperience;
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
            } ,"getGremlinExperienceRanks", { activityId: this.dynamicParam.id })
            let charInfo = LocaleData.getCharShowResInfoSelf()
            this.loader_selfIcon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            this.label_selfName.text = GameServerData.getInstance().getPlayerFullInfo().base.name
            this.label_xfdesc.text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR35, [this.activityData.chance])
        }else if(this.pageController.selectedIndex == 1){
            this.dynamicParam.data.taskGroup.sort((a, b):number=>{
                let stataA = this.getTaskState(a.id).state
                let stataB = this.getTaskState(b.id).state
                if (stataA == 2) {
                    stataA = -1
                }
                if (stataB == 2) {
                    stataB = -1
                }
                return stataB - stataA
            });
            this.list_task.numItems = this.dynamicParam.data.taskGroup.length
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
            this.list_gift.numItems = this.allGiftData.length
        }else if(this.pageController.selectedIndex == 3){
            this.allTopUpData = this.dynamicParam.data.rechargeTaskGroups
            this.allTopUpData.sort((a, b)=>{
                let getA = this.getRechargeRecord(a.money)? 1:0
                let getB = this.getRechargeRecord(b.money)? 1:0
                return getA - getB
            })
            this.list_topUp.numItems = this.allTopUpData.length
        }
        else if(this.pageController.selectedIndex == 4){
            this.label_number4.text = this.activityData.attackCount
            this.lastRecoverTime = GameServerData.getInstance().getActivityGlobalState(this.dynamicParam.id).data.activityGlobalGremlinExperience.lastRecoverTime + Number(this.dynamicParam.data.attackCountRecoverTime) 
            let monsterState = this.activityData.monstersState
            monsterState.sort((a, b)=>{
                let quaA  = this.getEliteGroupById(a.id).quality
                let quaB  = this.getEliteGroupById(b.id).quality
                return Number(quaB) - Number(quaA)
            });
            UtilsUI.setNeedItemGroup(this.group_need4, UtilsUI.getItemIconUrl(VarVal.bonusType.stone), baseInfo.stone, this.dynamicParam.data.attackMonstersRefreshCost)
            this.label_score4.text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR31, [this.activityData.score]) 
            for (let index = 0; index < monsterState.length; index++) {
                let state = monsterState[index];
                let xml  =  this.getEliteGroupById(state.id)
                let child =  this.group_monsters[index]
                let group_die: fgui.GGroup = child.getChild("group_die")
                let btn_attack: fgui.GButton = child.getChild("btn_attack")
                btn_attack.text = StrVal.LYELITEATTACK.STR14
                if (state.state == 1) {
                    group_die.visible = true
                    btn_attack.visible = false
                }else{
                    group_die.visible = false
                    btn_attack.visible = true
                }
                btn_attack.clearClick()
                btn_attack.onClick(()=>{
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteDisperse, 0, { monsterState:state,  monsterXml: xml, dynamicParam: this.dynamicParam  })
                });
                let spineName = xml.icon
                child.getChild("loader_EliteQua", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyEliteMonster/frame_{0}", [xml.quality]);
                let loader_spine = child.getChild("loader3D_monster", fgui.GLoader3D)
                loader_spine.freeSpine()
                new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                }, loader_spine, spineName);
                child.getChild("label_name", fgui.GLabel).text = xml.name
                child.getChild("loader_break", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyEliteMonster/pic_pedestal{0}", [xml.quality]);
            }
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

    public getEliteGroupById(id: number| string): any{
        id = String(id)
        for (let index = 0; index < this.dynamicParam.data.monsterGroups.length; index++) {
            let group = this.dynamicParam.data.monsterGroups[index];
            if (group.id == id) {
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

    public getRechargeRecord(money: number| string): boolean{
        money = Number(money)
        for (let index = 0; index < this.activityData.tookTotalRechargeRecords.length; index++) {
            let group = this.activityData.tookTotalRechargeRecords[index];
            if (group.money == money) {
                return true
            }
        }
        return false
    }

    public getIsViewMask(): boolean { 
        return false;
    };

    public onViewUpdate(params: any): void {
        if (params && params.isSkipTask) {
            this.pageController.selectedIndex = 1
        }
        this.refreshUI()
    }

    public onViewDestroy(): void {
        // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyEliteMonster, 0, null)
    }

    public static inViewRedPointTask(activityId:number | string): boolean{
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
            let tasksStates = activityState.data.activityGremlinExperience.tasksStates;
            for (let index = 0; index < tasksStates.length; index++) {
                let taskData = tasksStates[index];
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
                    let giftsRecords = activityState.data.activityGremlinExperience.giftsRecords;
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

    public static inViewRedPointToUp(activityId:number | string): boolean{
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
            let dynamicParam = GameServerData.getInstance().getDynamicActivityParam(activityId)
            let rechargeTaskGroups = dynamicParam.data.rechargeTaskGroups
            for (let index = 0; index < rechargeTaskGroups.length; index++) {
                let rechargeData = rechargeTaskGroups[index];
                let have = false
                for (let index = 0; index < activityState.data.activityGremlinExperience.tookTotalRechargeRecords.length; index++) {
                    let group = activityState.data.activityGremlinExperience.tookTotalRechargeRecords[index];
                    if (group.money == Number(rechargeData.money)) {
                        have = true
                        break
                    }
                }
                if (!have && activityState.data.totalMoney >= Number(rechargeData.money)) {
                    return true
                }
            }
           
        }
        return false
    }
}


