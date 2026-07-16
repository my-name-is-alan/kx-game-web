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
import { LyGuideDetail } from "./LyGuideDetail";
import { VarVal } from "../Values/VarVal";
import { LocaleData } from "../Kernel/LocaleData";
import { GuideManager } from "../Kernel/GuideManager";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { AudioManager } from "../Kernel/AudioManager";

export class LyPsychicInsight extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyPsychicInsight";
    }

    private dynamicParam: any;
    private pageController: fgui.Controller
    private activityData: any
    private label_time: fgui.GLabel
    private showTaskData: any
    private allGiftData: any
    private czGiftBoun: any

    //任务 
    private list_task: fgui.GList
    //神脉
    private list_shenmai: fgui.GList
    private btn_go1: fgui.GButton
    private label_ljcs: fgui.GLabel
    //礼包
    private list_gift: fgui.GList
    public onViewCreate(_params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        this.dynamicParam = _params.dynamicParam
        this.getUiPanel().getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPsychicInsight, 0, null)
       });
       let uiPanel:fgui.GComponent = this.getUiPanel().getChild("main")
       this.label_time = uiPanel.getChild("label_time")
       UtilsUI.playCommonGroupAni(uiPanel, null);
       uiPanel.getChild("btn_what", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title: this.dynamicParam.name, detail: this.dynamicParam.desc });
       });
       uiPanel.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPsychicInsight, 0, null)
       });
       this.pageController = uiPanel.getController("page")
       uiPanel.getChild("label_title", fgui.GLabel).text = this.dynamicParam.name
       uiPanel.getChild("btn_rank", fgui.GButton).text = StrVal.LYPSYCHICINSIGHT.STR2
       uiPanel.getChild("btn_task1", fgui.GButton).text = StrVal.LYPSYCHICINSIGHT.STR3
       uiPanel.getChild("btn_gift", fgui.GButton).text = StrVal.LYPSYCHICINSIGHT.STR4
       uiPanel.getChild("desc", fgui.GLabel).text = StrVal.LYPSYCHICINSIGHT.STR5


       PointRedData.getInstance().registerPoint(uiPanel.getChild("btn_rank"), PointRedType.LyPsychicInsightTask, this.dynamicParam.id)
       PointRedData.getInstance().registerPoint(uiPanel.getChild("btn_task1"), PointRedType.LyPsychicInsightShenmai, this.dynamicParam.id)
       PointRedData.getInstance().registerPoint(uiPanel.getChild("btn_gift"), PointRedType.LyPsychicInsightGift, this.dynamicParam.id)
       //任务
       let page0 = uiPanel.getChild("page0", fgui.GComponent)
       this.list_task = page0.getChild("list_all")
       this.list_task.itemRenderer = (index: number, child: fgui.GComponent)=>{
            let taskXml = this.showTaskData[index]
            let taskData = this.getTaskState(taskXml.id)
            child.getChild("label_des",fgui.GLabel).text = taskXml.name
            let list_item:fgui.GList = child.getChild("list_item")
            let bonusItem: Array<BonuseItem> = UtilsUI.getBonuseItemsByString(taskXml.bonuses) 
            list_item.itemRenderer = (i: number, child2: fgui.GComponent)=>{
                UtilsUI.setUIGroupItem(bonusItem[i], child2, null);
            }
            // list_item.setVirtual()
            list_item.numItems = bonusItem.length
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
                if (taskXml.type == VarVal.THEURGYGDTASK.cutTree) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.KANSHU, // 砍树
                    });
                } else if (taskXml.type == VarVal.THEURGYGDTASK.fight) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.DUEL_CHALLENGE,// 斗法挑战
                    });
                } else if (taskXml.type == VarVal.THEURGYGDTASK.vehicleUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.MOUNT_LEVELUP,
                    });
                } else if (taskXml.type == VarVal.THEURGYGDTASK.mountainTrigger) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.VEIN_ACTIVE,// 激发灵脉
                    });
                } else if (taskXml.type == VarVal.THEURGYGDTASK.landGatherSelf) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.HAVEN_GET,//福地
                    });
                } else if (taskXml.type == VarVal.THEURGYGDTASK.landGatherOthers) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.HAVEN_FINDOTHER,//福地
                    });
                } else if (taskXml.type == VarVal.THEURGYGDTASK.strangeAnimalInvade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.INVASION,// 异兽入侵
                    });
                } else if (taskXml.type == VarVal.THEURGYGDTASK.challengeMonster) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.KING_MONSTER,// 挑战妖王
                    });
                } else if (taskXml.type == VarVal.THEURGYGDTASK.animalUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.PET_LEVELUP,// 灵兽升级
                    });
                } else if (taskXml.type == VarVal.THEURGYGDTASK.theurgyUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.THEURG_LEVELUP,
                    });
                } else if (taskXml.type == VarVal.THEURGYGDTASK.theurgyUP) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.THEURG_LEVELUP,
                    });
                } else if (taskXml.type == VarVal.THEURGYGDTASK.theurgySealHC) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.THEURG_LEVELUP,
                    });
                } else if (taskXml.type == VarVal.THEURGYGDTASK.attackQunying) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.QUNYIN, // 群音
                    });
                } 
                else if (taskXml.type == VarVal.THEURGYGDTASK.share) {
                    UtilsUI.playerShareGame(() => {
                        UtilsUI.showMsgTip(StrVal.COMMON.STR101);
                    }, {
                        title: StrVal.COMMON.STR301,
                    })
                }
            });
            let btn_get: fgui.GButton = child.getChild("btn_get")
            PointRedData.getInstance().updateManualPoint(btn_get, taskData.state == 1)
            btn_get.visible = taskData.state == 1
            btn_get.clearClick()
            btn_get.text = StrVal.LYELITEATTACK.STR25
            btn_get.onClick(()=>{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.refreshUI()
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"takeTheurgyAbhisecaTaskBonuses", { activityId: this.dynamicParam.id, taskId:taskData.id  })
            })
        }
        this.list_task.setVirtual()
        //#region 神脉
        let page1 = uiPanel.getChild("page1", fgui.GComponent)
        this.list_shenmai = page1.getChild("list_all")
        this.label_ljcs = page1.getChild("label_leiji")
        this.btn_go1 = page1.getChild("btn_go")
        this.btn_go1.text = StrVal.LYPSYCHICINSIGHT.STR7
        this.btn_go1.onceClick(()=>{
            GuideManager.startGuide({
                guideType: VarVal.GUIDE_TYPE.THEURG_CALL,
            });
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPsychicInsight, 0, null)
        });
        this.list_shenmai.itemRenderer = (index: number, child: fgui.GComponent)=>{
            let xml = this.dynamicParam.data.theurgPumpBonuses[index]
            let c1: fgui.Controller = child.getController("c1")
            let label_target: fgui.GLabel = child.getChild("label_target")
            label_target.text = xml.count
            let item1: fgui.GComponent = child.getChild("item1")
            let item2: fgui.GComponent = child.getChild("item2")
            c1.selectedIndex = 1 - Number(xml.pos - 1)
            let bonusItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByString(xml.bonuses) 
            UtilsUI.setUIGroupItem(bonusItems[0], item1.getChild("GroupItem"), null);
            UtilsUI.setUIGroupItem(bonusItems[1], item2.getChild("GroupItem"), null);
            child.getChild("group_yellow", fgui.GGroup).visible = this.activityData.pumpCount >= Number(xml.count)
            let lock1 = item1.getChild("group_suo", fgui.GGroup)
            let lock2 = item2.getChild("group_suo", fgui.GGroup)
            let group_isGet1 = item1.getChild("group_isget", fgui.GGroup)
            let group_isGet2 = item2.getChild("group_isget", fgui.GGroup)
            let isGet = this.getshenMaiCount(xml.count)
            child.clearClick()
            if (isGet) {
                item1.getTransition("t0").stop()
                item2.getTransition("t0").stop()
                group_isGet1.visible = true
                group_isGet2.visible = true
                lock1.visible = false
                lock2.visible = false
            }else{
                if (this.activityData.pumpCount >= Number(xml.count)) {
                    lock1.visible = false
                    lock2.visible = false
                    item1.getTransition("t0").play(null , -1)
                    item2.getTransition("t0").play(null , -1)
                    child.onClick(()=>{
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                this.refreshUI()
                                UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        } ,"takeTheurgyAbhisecaPumpBonuses", { activityId: this.dynamicParam.id, count: Number(xml.count)})
                    });
                } else {
                    lock1.visible = true
                    lock2.visible = true
                    item1.getTransition("t0").stop()
                    item2.getTransition("t0").stop()
                }
                group_isGet1.visible = false
                group_isGet2.visible = false
            }

            if (index == this.dynamicParam.data.theurgPumpBonuses.length - 1) {
                child.getChild("img_jd1").visible = false
                child.getChild("img_jd2").visible = false
            }else{
                child.getChild("img_jd1").visible = true
                child.getChild("img_jd2").visible = true
            }

        }
        this.list_shenmai.setVirtual()
        this.btn_go1.onClick(()=>{
            GuideManager.startGuide({
                guideType: VarVal.GUIDE_TYPE.THEURG_CALL,
            });
        });
        //#endregion

        //#region 礼包
        let page2 = uiPanel.getChild("page2", fgui.GComponent)
        this.list_gift = page2.getChild("list_all", fgui.GList);
        this.list_gift.itemRenderer =(index: number, child:fgui.GComponent)=>{
            let giftData = this.allGiftData[index]
            let bonusItem: Array<BonuseItem> = UtilsUI.getBonuseItemsByString(giftData.bonuses) 
            let list_all:fgui.GList = child.getChild("list_item")
            list_all.itemRenderer = (i: number, child2: fgui.GComponent)=>{
                UtilsUI.setUIGroupItem(bonusItem[i], child2, null);
            }
            list_all.numItems = bonusItem.length
            child.getChild("label_des", fgui.GLabel).text = giftData.name
            let giftState = this.getGiftState(giftData.id)
            child.getChild("label_day", fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR26, [ giftData.maxBuyCount - giftState.tookCount]) 
            let btn_buy = child.getChild("btn_go", fgui.GButton);
            btn_buy.clearClick()
            let get = child.getChild("get", fgui.GGroup);
            if (Number(giftData.maxBuyCount) == giftState.tookCount) {
                btn_buy.visible = false
                get.visible = true
            }else {
                get.visible = false
                btn_buy.visible = true
            }
            let btn_fun: Function = null
            PointRedData.getInstance().updateManualPoint(btn_buy, false)
            if (giftData.type == 1 || giftData.type == 3) {
                if (giftData.type == 1) {
                    UtilsUI.setButtonIcon(btn_buy, null, StrVal.LYELITEATTACK.STR27)
                    PointRedData.getInstance().updateManualPoint(btn_buy, true)
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
                    } ,"takeTheurgyAbhisecaGiftsBonuses", { activityId: this.dynamicParam.id, id: giftData.id})
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
                    }, patData, VarVal.payType.stone, null);
                }
            }
            btn_buy.onClick(()=>{
                btn_fun()
            });
        }
        this.list_gift.setVirtual()
        //充值奖励事件注册
        this.registerRequest((args) => {
            if (args.source == 5) {
                UtilsUI.showItemReward({
                    bonuseItems: this.czGiftBoun,
                    rebateBonuseItems:UtilsUI.getRebateBonuseItems()
                });
                this.czGiftBoun = null
            }
        }, "itemInserts");

        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == this.dynamicParam.id) {
                this.refreshUI()
            }
        }, "activityStateChanged");

        // let serverTime = GameServerData.getInstance().getServerTime()
        this.label_time.text = UtilsTool.TimeToDateStr(this.dynamicParam.startTime) +" - " + UtilsTool.TimeToDateStr(this.dynamicParam.endTime) ;
        // this.setInterval(()=>{
        //   
        //     this.label_time.text = UtilsTool.parseTimeToString(this.dynamicParam.endTime - serverTime);
            
        //     // if (this.pageController.selectedIndex == 6) {
        //     // this.label_time.text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR30, [UtilsTool.parseTimeToString(this.lastRecoverTime - serverTime)]); 

        //     // }
        // }, 1000);
        
        this.pageController.onChanged(()=>{
            this.refreshUI()
        })
        this.refreshUI()


        // this.label_time.text = 
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

    public getshenMaiCount(count): boolean{
        count = Number(count)
        for (let index = 0; index < this.activityData.tookBonusesRecords.length; index++) {
            let group = this.activityData.tookBonusesRecords[index];
            if (group.count == count) {
                return true
            }
        }
        return false
    }

    private initTaskPage() {
        this.showTaskData = []
        this.showTaskData =  this.dynamicParam.data.taskGroup
        this.showTaskData.sort((a, b):number=>{
            let stataA 
            let stataB 
            stataA = this.getTaskState(a.id).state
            stataB = this.getTaskState(b.id).state
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

    private refreshUI(){
        let baseInfo =  GameServerData.getInstance().getPlayerFullInfo().base
        this.activityData = GameServerData.getInstance().getActivityState(this.dynamicParam.id).data.activityTheurgyAbhiseca;
        if (this.pageController.selectedIndex == 0) {
            this.initTaskPage()
        }else if(this.pageController.selectedIndex == 1){
            let nextIndex = 0
            this.label_ljcs.text = UtilsTool.stringFormat(StrVal.LYPSYCHICINSIGHT.STR6, [this.activityData.pumpCount]);
            if (this.list_shenmai.numItems == 0) {
                UtilsUI.setFguiGlistDelayNumItems(this.list_shenmai, this.dynamicParam.data.theurgPumpBonuses.length);
            }else{
                this.list_shenmai.numItems = this.dynamicParam.data.theurgPumpBonuses.length
            }
            this.list_shenmai.scrollToView(this.activityData.tookBonusesRecords.length)
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
        }
    }
    

    public onViewUpdate(params: any): void {
    }

    public getIsViewMask(): boolean {
        return false;
    };

    public static inViewRedPointTask(activityId:number | string): boolean{
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
            let tasksStates = activityState.data.activityTheurgyAbhiseca.tasksStates;
            for (let index = 0; index < tasksStates.length; index++) {
                let taskData = tasksStates[index];
                if (taskData.state == 1) {
                    return true
                }
            }
        }
        return false
    }
    public static inViewRedPointShenmai(activityId:number | string): boolean{
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
            let tookBonusesRecords = activityState.data.activityTheurgyAbhiseca.tookBonusesRecords;
            let dynamicParam = GameServerData.getInstance().getDynamicActivityParam(activityId)
            for (let index = 0; index < dynamicParam.data.theurgPumpBonuses.length; index++) {
                let theurgPump = dynamicParam.data.theurgPumpBonuses[index];
                let isGet = false
                for (let index2 = 0; index2 < tookBonusesRecords.length; index2++) {
                    let took = tookBonusesRecords[index2];
                    if (theurgPump.count == took.count) {
                        isGet = true
                    }
                }
                if (!isGet) {
                    if (activityState.data.activityTheurgyAbhiseca.pumpCount >= Number(theurgPump.count)) {
                        return true
                    }
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
                    let giftsRecords = activityState.data.activityTheurgyAbhiseca.giftsRecords;
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
    
}


