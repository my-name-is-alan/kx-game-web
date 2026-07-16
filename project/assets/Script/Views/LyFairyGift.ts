import * as fgui from "fairygui-cc";
import { ViewLayer } from '../Kernel/ViewLayer';
import { VarVal } from "../Values/VarVal";
import { GameServerData } from "../Kernel/GameServerData";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { LocaleData } from "../Kernel/LocaleData";
import { StrVal } from "../Values/StrVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { GuideManager } from "../Kernel/GuideManager";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { AudioManager } from "../Kernel/AudioManager";

export class LyFairyGift extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyPayRecharge";
        this.viewResI.pkgName = "LyPayRecharge";
        this.viewResI.comName = "LyFairyGift";
    }
    private XYPAYID = 32

    private fullInfo: any;
    private fairyItem: Array<any>;
    private xyPay: boolean = false;
    private stayTime = 0;
 
    private gcMain: fgui.GComponent
    private btn_fengyunlu: fgui.GButton
    private btn_task: fgui.GButton
    private btn_gift: fgui.GButton
    private btn_cz1: fgui.GButton
    private label_time: fgui.GButton
    private label_wc: fgui.GLabel
    private list_task: fgui.GList
    private list_fitem: fgui.GList
    private group_free: fgui.GComponent
    private group_pro: fgui.GComponent
    private list_zf: fgui.GList
    private list_db: fgui.GList
    private btn_18: fgui.GButton
    private btn_68: fgui.GButton
    private label_need: fgui.GLabel
    private label_cTime: fgui.GLabel
    private pro_czz: fgui.GProgressBar
    private label_timeTask: fgui.GLabel 
    private label_nowScore: fgui.GLabel
    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel = this.getUiPanel();
        uiPanel.getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyFairyGift, 0, null);
        });

        this.gcMain = this.getUiPanel().getChild("main");
        this.gcMain.getChild("n7", fgui.GLabel).text = StrVal.LYFAIRYGIFT.STR1;
        this.gcMain.getChild("n8", fgui.GLabel).text = StrVal.LYFAIRYGIFT.STR2;
        this.gcMain.getChild("n20", fgui.GLabel).text = StrVal.LYFAIRYGIFT.STR4;
        this.gcMain.getChild("n21", fgui.GLabel).text = StrVal.LYFAIRYGIFT.STR5;
        this.gcMain.getChild("n112", fgui.GLabel).text = StrVal.LYFAIRYGIFT.STR15;
        UtilsUI.playCommonGroupAni(this.gcMain, null);
        this.gcMain.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyFairyGift, 0, null);
        })
        this.btn_fengyunlu = this.gcMain.getChild("btn_fyl")
        this.btn_fengyunlu.text = StrVal.LYFAIRYGIFT.STR6;
        PointRedData.getInstance().registerPoint(this.btn_fengyunlu, PointRedType.LyFairyGiftScore)
        this.btn_task = this.gcMain.getChild("btn_task")
        this.btn_task.text = StrVal.LYFAIRYGIFT.STR7;
        PointRedData.getInstance().registerPoint(this.btn_task, PointRedType.LyFairyGiftTask)
        this.btn_gift = this.gcMain.getChild("btn_gift")
        this.btn_gift.text = StrVal.LYFAIRYGIFT.STR8;
        PointRedData.getInstance().registerPoint(this.btn_gift, PointRedType.LyFairyGift3)
        this.btn_cz1 = this.gcMain.getChild("btn_cz1")
        let payData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.xianyuan)
        this.label_wc = this.gcMain.getChild("label_wc")
        UtilsUI.setPayItemRebateComp(this.gcMain.getChild("group_rebeatfan"), payData);
        UtilsUI.setButtonIcon(this.btn_cz1, VarVal.bonusType.chance, String(Number(payData.money) / 100));
        this.btn_cz1.onClick(()=>{
            UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }else{
                    this.refreshInfoData();
                    this.refreshPage0()
                }
            }, payData, VarVal.payType.others, VarVal.payOtherType.xianyuan);
        });
        this.label_time = this.gcMain.getChild("label_time")
        this.list_task = this.gcMain.getChild("list_task")
        this.group_free = this.gcMain.getChild("group_free")
        this.group_pro = this.gcMain.getChild("group_pro")
        this.list_zf = this.gcMain.getChild("list_zf")
        this.list_db = this.gcMain.getChild("list_db")
        this.label_need = this.gcMain.getChild("label_need")
        this.label_cTime = this.gcMain.getChild("label_cTime")
        this.btn_68 = this.gcMain.getChild("btn_db")
        this.btn_18 = this.gcMain.getChild("btn_zf")
        this.pro_czz = this.gcMain.getChild("pro_czz");
        this.label_timeTask = this.gcMain.getChild("label_timeTask")
        this.list_fitem = this.gcMain.getChild("list_fitem")
        this.label_nowScore = this.gcMain.getChild("label_nowScore")
        this.fairyItem = LocaleData.getFairyItem();
        let payRoot = LocaleData.getPayRoot()
        this.list_fitem.setVirtual()
      
        this.list_fitem.itemRenderer = (index:number, child:fgui.GComponent)=>{
            let data = this.fairyItem[index]
            let group_lock1: fgui.GGroup = child.getChild("group_lock1", fgui.GComponent).getChild("group_suo")
            let group_isget1: fgui.GGroup = child.getChild("group_lock1", fgui.GComponent).getChild("group_isget")
            let group_lock1_item: fgui.GComponent = child.getChild("group_lock1", fgui.GComponent).getChild("GroupItem")
            let group_lock2: fgui.GGroup = child.getChild("group_lock2", fgui.GComponent).getChild("group_suo")
            let group_isget2: fgui.GGroup = child.getChild("group_lock2", fgui.GComponent).getChild("group_isget")

            let group_lock2_item: fgui.GComponent = child.getChild("group_lock2", fgui.GComponent).getChild("GroupItem")
            let group_free_gou: fgui.GGroup = child.getChild("group_free", fgui.GComponent).getChild("group_isget")
            let group_free_item: fgui.GComponent = child.getChild("group_free", fgui.GComponent).getChild("GroupItem")

            let freeBonuseItem: any
            if (data.baseStone != "0") {
                freeBonuseItem = this.getBonuseItem(data.baseStone)
            }else{
                freeBonuseItem = this.getBonuseItem(data.baseItem)
            }
            let bonuseItems: Array<any> = []
            if (data.extraStone != "0") {
                let jl = data.extraStone.split(",")
                for (let index = 0; index < jl.length; index++) {
                    bonuseItems.push(this.getBonuseItem(jl[index]))
                }
            } 
            if (data.extra != "0"){
                let jl = data.extra.split(";")
                for (let index = 0; index < jl.length; index++) {
                    bonuseItems.push(this.getBonuseItem(jl[index]))
                }
            }
            let isGetRewardFree = this.isTakeXianyanReward(data.id, true)
            let funCallBack: Function = null
            if (!isGetRewardFree && this.fullInfo.score >= data.score) {
                funCallBack = ()=>{
                    this.takeXianYuanScoreBonuses(data.id, freeBonuseItem)
                }
            }
            UtilsUI.setUIGroupItem(freeBonuseItem , group_free_item, funCallBack);
            if (!isGetRewardFree && this.fullInfo.score >= data.score) {
                this.playAnim(child.getChild("group_free", fgui.GComponent), true)
            }else{
                this.playAnim(child.getChild("group_free", fgui.GComponent), false)
            }

            let isGetRewardLock = this.isTakeXianyanReward(data.id)
            if (!isGetRewardLock && this.fullInfo.score >= data.score) {
                if (this.xyPay) {
                    this.playAnim(child.getChild("group_lock1", fgui.GComponent), true)
                    this.playAnim(child.getChild("group_lock2", fgui.GComponent), true)
                }
            }else{
                if (this.xyPay) {
                    this.playAnim(child.getChild("group_lock1", fgui.GComponent), false)
                    this.playAnim(child.getChild("group_lock2", fgui.GComponent), false)
                }
            }
            let callBack1 = null
            if (!isGetRewardLock && this.fullInfo.score >= data.score && this.xyPay) {
                callBack1 =()=>{
                    this.takeXianYuanScoreBonuses(data.id, bonuseItems[0]) 
                }  
            }

            let callBack2 = null
            if (!isGetRewardLock && this.fullInfo.score >= data.score && this.xyPay) {
                callBack2 =()=>{
                    this.takeXianYuanScoreBonuses(data.id, bonuseItems[1]) 
                }  
            }
            
            UtilsUI.setUIGroupItem(bonuseItems[0] , group_lock1_item, callBack1);
            UtilsUI.setUIGroupItem(bonuseItems[1], group_lock2_item, callBack2)
           
            if (this.xyPay) {
                group_lock1.visible = false
                group_lock2.visible = false
                if (isGetRewardLock) {
                    group_isget1.visible = true
                    group_isget2.visible = true
                }else{
                    group_isget1.visible = false
                    group_isget2.visible = false
                }
            }else{
                group_lock2.visible = true
                group_lock1.visible = true
                this.playAnim(child.getChild("group_lock1", fgui.GComponent), false)
                this.playAnim(child.getChild("group_lock2", fgui.GComponent), false)
            }

            if (isGetRewardFree) {
                group_free_gou.visible = true
            }else{
                group_free_gou.visible = false
            }
            child.getChild("label_number", fgui.GLabel).text = this.fairyItem[index].score;
            let img_bar_light: fgui.GImage = child.getChild("img_bar_light")
            let img_bar_gray: fgui.GImage = child.getChild("img_bar_gray")
            let img_bar_gray1: fgui.GImage = child.getChild("img_bar_gray1")
            let img_bar_light1: fgui.GImage = child.getChild("img_bar_light1")

            let needScore = Number(this.fairyItem[index].score)
            if (this.fullInfo.score > needScore) {
                img_bar_gray.visible = false;
                img_bar_gray1.visible = false;
                img_bar_light.visible = true;
                img_bar_light1.visible = true;
            } else if (this.fullInfo.score == needScore) {
                img_bar_gray.visible = false;
                img_bar_gray1.visible = true;
                img_bar_light.visible = true;
                img_bar_light1.visible = false;
            } else {
                img_bar_gray.visible = true;
                img_bar_gray1.visible = true;
                img_bar_light.visible = false;
                img_bar_light1.visible = false;
            }
            if (index == 0) {
                img_bar_gray.visible = false;
                img_bar_light.visible = false;
            } else if (index == this.fairyItem.length - 1) {
                img_bar_gray1.visible = false;
                img_bar_light1.visible = false;
            }
            child.getChild("n52").visible = needScore <= this.fullInfo.score
        }
        this.list_fitem.numItems = 0

        this.gcMain.getChild("btn_fyl", fgui.GButton).onClick(()=>{
            this.refreshInfoData()
            this.refreshPage0()
        });
        this.gcMain.getChild("btn_task", fgui.GButton).onClick(()=>{
            this.refreshInfoData()
            this.refreshTask1()
        });
        this.gcMain.getChild("btn_gift", fgui.GButton).onClick(()=>{
            this.refreshInfoData()
            this.refreshGift3()
        });
        this.refreshInfoData()
        this.refreshPage0()
        this.stayTime = (Number(payRoot.xianyuanDays)) *24*60*60
        this.setInterval(()=>{
            let serverTime = GameServerData.getInstance().getServerTime()
            this.label_time.text = UtilsTool.parseTimeToString(this.stayTime - (serverTime - this.fullInfo.xyTime));
            let serverTime2 = serverTime * 1000;
            let lastTime = UtilsTool.getNextDateTime(serverTime2);
            let remain = lastTime - serverTime2;
            this.label_cTime.text = UtilsTool.splitTimeString(remain / 1000);
            this.label_timeTask.text = this.label_cTime.text
        }, 1000);

        this.registerRequest((args) => {
           this.refreshInfoData()
           this.refreshTask1()
        }, "xyTaskResetChanged");

        this.registerRequest((args) => {
            this.onViewUpdate(null);
            // 返还
            let rebate = UtilsUI.getRebateBonuseItems();
            if (rebate) {
                UtilsUI.showItemReward({rebateBonuseItems:rebate});
            }
        }, "payXyEventChanged");
    }

    private playAnim(com:fgui.GComponent ,open: boolean){
        if (open) {
            com.getTransition("t0").play(null , -1)
        }else{
            com.getTransition("t0").stop()
        }
    }

    private refreshGift3(){
        let freeGou = this.group_free.getChild("group_isget")
        let get18: fgui.GGroup = this.gcMain.getChild("get18")
        let get68: fgui.GGroup = this.gcMain.getChild("get68")

        let payRoot = LocaleData.getPayRoot()
        let bonuseItemsFree = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, payRoot.freeXyItem, payRoot.freeXyCount)
        UtilsUI.setUIGroupItem(bonuseItemsFree, this.group_free.getChild("GroupItem"), ()=>{
            if (this.fullInfo.hasTakeFreeXy == 0) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.refreshInfoData();
                        this.refreshGift3();
                        UtilsUI.showItemReward({ bonuseItems: [bonuseItemsFree]});
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"takeXyfl", { count: 0 })
            }
        });
        freeGou.visible = this.fullInfo.hasTakeFreeXy != 0
        this.playAnim(this.group_free, this.fullInfo.hasTakeFreeXy == 0)


        let giftItem18 = LocaleData.getPayGiftItem(this.fullInfo.xyGift[0].id)
        this.gcMain.getChild("n95", fgui.GLabel).text = giftItem18.name;
        let bonus18: Array<BonuseItem> = LocaleData.getPayChooseBonuseItemsByGroup(giftItem18.fixItems) 
        this.list_zf.itemRenderer = (index: number, child: fgui.GComponent)=>{
            UtilsUI.setUIGroupItem(bonus18[index], child, null);
        }
        UtilsUI.setPayItemRebateComp(this.gcMain.getChild("group_rebeatfan18"), giftItem18);
        this.btn_18.clearClick()
        this.btn_18.onClick(()=>{
            if (this.fullInfo.xyGift[0].count < Number(giftItem18.buyCount)) {
                UtilsUI.payRechargeItem((errmsg:string) => {
                    if (errmsg) {
                        UtilsUI.showMsgTip(errmsg);
                    }
                }, giftItem18, VarVal.payType.gift, VarVal.payGiftType.xianyuanGift);
            }
        });
        
        if (this.fullInfo.xyGift[0].count < Number(giftItem18.buyCount)) {
            this.btn_18.visible = true
            get18.visible = false
            UtilsUI.setButtonIcon(this.btn_18, VarVal.bonusType.chance, String(Number(giftItem18.money) / 100));
        }else{
            this.btn_18.visible = false
            get18.visible = true
        }
        this.list_zf.numItems = bonus18.length
      
        let giftItem68 = LocaleData.getPayGiftItem(this.fullInfo.xyGift[1].id)
        this.gcMain.getChild("n96", fgui.GLabel).text = giftItem68.name;
        let bonus68: Array<BonuseItem> = LocaleData.getPayChooseBonuseItemsByGroup(giftItem68.fixItems) 
        this.list_db.itemRenderer = (index: number, child: fgui.GComponent)=>{
            UtilsUI.setUIGroupItem(bonus68[index], child, null);
        }
        this.btn_68.clearClick()
        if (this.fullInfo.xyGift[1].count < Number(giftItem68.buyCount)) {
            this.btn_68.visible = true
            get68.visible = false
            UtilsUI.setButtonIcon(this.btn_68, VarVal.bonusType.chance, String(Number(giftItem68.money) / 100));
        }else{
            this.btn_68.visible = false
            get68.visible = true
        }
        UtilsUI.setPayItemRebateComp(this.gcMain.getChild("group_rebeatfan68"), giftItem68);
        this.btn_68.onClick(()=>{
            if (this.fullInfo.xyGift[1].count < Number(giftItem68.buyCount)) {
                UtilsUI.payRechargeItem((errmsg:string) => {
                    if (errmsg) {
                        UtilsUI.showMsgTip(errmsg);
                    }
                }, giftItem68, VarVal.payType.gift, VarVal.payGiftType.xianyuanGift);
            }
        });
        this.list_db.numItems = bonus68.length
        let cishuGiftData = LocaleData.getFairyCishuGift(this.fullInfo.xyTakeMax);
        this.pro_czz.max =  Number(cishuGiftData.id)
        this.pro_czz.value = this.fullInfo.xyBuyCount
        this.playAnim(this.group_pro, this.fullInfo.xyBuyCount >= Number(cishuGiftData.id))
        let bonuseItems1:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(cishuGiftData.bonusesId);
        UtilsUI.setUIGroupItem(bonuseItems1[0], this.group_pro.getChild("GroupItem"), ()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.refreshInfoData();
                    this.refreshGift3()
                    UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"takeXyfl", { count: cishuGiftData.id })
        })
        this.label_need.text = UtilsTool.stringFormat(StrVal.LYFAIRYGIFT.STR16, [ (this.pro_czz.max - this.pro_czz.value)< 0 ? 0 : (this.pro_czz.max - this.pro_czz.value) ]); 
    }

    private refreshPage0(){
        this.gcMain.getChild("n12", fgui.GLabel).text = StrVal.LYFAIRYGIFT.STR14;
        this.btn_cz1.enabled = !this.xyPay
        if (this.xyPay) {
            UtilsUI.setButtonIcon(this.btn_cz1, null, StrVal.LYFAIRYGIFT.STR17);
        }else{
            let payData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.xianyuan)
            UtilsUI.setButtonIcon(this.btn_cz1, VarVal.bonusType.chance, String(Number(payData.money) / 100));
        }
        if (this.list_fitem.numItems == 0) {
            UtilsUI.setFguiGlistDelayNumItems(this.list_fitem, this.fairyItem.length);
        }else{
            this.list_fitem.numItems = this.fairyItem.length
        }
        
        this.label_nowScore.text = UtilsTool.stringFormat(StrVal.LYFAIRYGIFT.STR19, [this.fullInfo.score]); 
    }

    private refreshTask1(){
        this.label_nowScore.text = UtilsTool.stringFormat(StrVal.LYFAIRYGIFT.STR19, [this.fullInfo.score]); 
        this.gcMain.getChild("n12", fgui.GLabel).text = StrVal.LYFAIRYGIFT.STR3;
        let talks = GameServerData.getInstance().getTaskState(VarVal.taskType.xianyuan);
        this.label_wc.text = UtilsTool.stringFormat(StrVal.LYFAIRYGIFT.STR9, [this.getCompleteTask(), talks.length])
        talks.sort((a, b): number=>{
            let aN = 0
            if(a.state != 3) {
                aN = a.state
            }
            let bN = 0
            if(b.state != 3) {
                bN = b.state
            }
            return bN - aN
        });
        this.list_task.itemRenderer = (index: number, child: fgui.GComponent)=>{
           let taskXml = LocaleData.getTaskRoot(talks[index].id)
           let list_item: fgui.GList = child.getChild("list_item")
           let label_count: fgui.GLabel = child.getChild("label_count")
           let label_des: fgui.GLabel = child.getChild("label_des")
           let btn_com: fgui.GButton = child.getChild("btn_com")
           btn_com.clearClick();
           let btn_get: fgui.GButton = child.getChild("btn_get")
           btn_get.clearClick();
           let get: fgui.GGroup = child.getChild("get")

           label_des.text = taskXml.desc
           let taskNum: number = taskXml.conditionParam.split(",")[0]
           if (taskXml.conditionType == "3" || taskXml.conditionType == "7") {
                taskNum = 1
            }
           label_count.text = UtilsTool.stringFormat(StrVal.LYFAIRYGIFT.STR10,[talks[index].count, taskNum])
           let bonuseItems1:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(taskXml.bonusesId);
           bonuseItems1.push(UtilsUI.getBonuseItem(VarVal.bonusType.xianyuanScore, null, null, taskXml.score))
           list_item.itemRenderer = (index: number, child2:fgui.GComponent) => {
               UtilsUI.setUIGroupItem(bonuseItems1[index], child2, null);
           }
           list_item.numItems = bonuseItems1.length
           btn_get.visible = false
           btn_com.visible = false
           get.visible = false
           if (talks[index].state == 1) {
                btn_com.text = StrVal.LYFAIRYGIFT.STR11
                btn_com.visible = true
           }else if(talks[index].state == 2) {
                btn_get.text = StrVal.LYFAIRYGIFT.STR12
                btn_get.visible = true
           }else if(talks[index].state == 3){
                get.visible = true
           }
           PointRedData.getInstance().updateManualPoint(btn_get, talks[index].state == 2)
           btn_get.onClick(()=>{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.refreshInfoData();
                        this.refreshTask1();
                        UtilsUI.showItemReward({ bonuseItems: bonuseItems1});
                        // UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"takeTaskBonuses", { id: talks[index].id })
            });
           btn_com.onClick(()=>{
                if (talks[index].state == 1) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyFairyGift, 0, null);
                if (taskXml.conditionType == VarVal.MainTaskType.cutTree ||
                    taskXml.conditionType == VarVal.MainTaskType.breakdown ||
                    taskXml.conditionType == VarVal.MainTaskType.equip ||
                    taskXml.conditionType == VarVal.MainTaskType.breakdownByMoney ||
                    taskXml.conditionType == VarVal.MainTaskType.level) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.KANSHU, // 砍树
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.evolution) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.EVOLUTION, // 仙树升级
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.adventure ||
                    taskXml.conditionType == VarVal.MainTaskType.adventureMax) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.CHALLENGE_STAGE,// 冒险
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.vehicleUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.MOUNT_LEVELUP,// 坐骑升级
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.animalUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.PET_LEVELUP,// 灵兽升级
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.animalCall) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.PET_CALL,// 灵兽召唤
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.mountainTrigger) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.VEIN_ACTIVE,// 激发灵脉
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.fight) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.DUEL_CHALLENGE,// 斗法挑战
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.challengeMonster) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.KING_MONSTER,// 挑战妖王
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.strangeAnimalInvade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.INVASION,// 异兽入侵
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.passTower) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.MONSTER_TOWER, // 镇妖塔
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.landGatherSelf) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.HAVEN_GET,// 福地采集
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.landGatherOthers) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.HAVEN_FINDOTHER,// 福地采集
                    });
                }else if (taskXml.conditionType == VarVal.MainTaskType.havenNums) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.HAVEN_GETMOUSE,// 福地采集
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.gremlinCall) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.ELITE_CALL,// 召唤精怪
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.joinClan) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.CLAN,// 帮派
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.companionGift ||
                    taskXml.conditionType == VarVal.MainTaskType.companionExplore) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.COMPANION,// 兽友
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.gremlinActivite ||
                    taskXml.conditionType == VarVal.MainTaskType.gremlinUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.ELITE,// 门客点击
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.stage) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.STAGE,// 武境界突破
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.summonPet) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.PET,// 上阵灵兽
                    });
                } else if (taskXml.conditionType == VarVal.MainTaskType.share) {
                    UtilsUI.playerShareGame(() => {
                        UtilsUI.showMsgTip(StrVal.COMMON.STR101);
                    }, {
                        title: StrVal.COMMON.STR301,
                    })
                }
                }else{
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.refreshInfoData();
                            this.refreshTask1();
                            UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([{ inserts: args.bonusesResult }]) });
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"takeTaskBonuses", { id: talks[index].id })
                }
           });

        }
        this.list_task.numItems = talks.length
    }

    private isTakeXianyanReward(id, left?): boolean{
        id = Number(id)
        for (let index = 0; index < this.fullInfo.xyflTakes.length; index++) {
            const element = this.fullInfo.xyflTakes[index];
            if (element.id == id) {
                if (left) {
                    if (!element.half || element.half == 1) {
                        return true
                    }else {
                        return false
                    }
                }else{
                    if (element.half) {
                        return false
                    }else {
                        return true
                    }
                }
            }
        }
        return false
    }
    private getCompleteTask(): number {
        let talks = GameServerData.getInstance().getTaskState(VarVal.taskType.xianyuan);
        let number = 0
        for (let index = 0; index < talks.length; index++) {
            const element = talks[index];
            if (element.state == 3) {
                number = number + 1
            }
        }
        return number
    }

    private takeXianYuanScoreBonuses(xmlId, bon?: BonuseItem) {
        xmlId = Number(xmlId)
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                this.refreshInfoData()
                this.refreshPage0()
                let allBon = []
                if (args.stone && args.stone != 0) {
                    allBon.push(this.getBonuseItem(String(args.stone))) 
                }
                if (args.itemInserts) {
                   let bounsItems = UtilsUI.getBonuseItemsByString(GameServerData.getInstance().bonusesResultsToString([{inserts:args.itemInserts}]))
                    for (let index = 0; index < bounsItems.length; index++) {
                        const element = bounsItems[index];
                        allBon.push(element)
                    }
                }
                UtilsUI.showItemReward({ bonuseItems: allBon });
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        } ,"takeXianYuanScoreBonuses", { id:xmlId })
    }

    private getBonuseItem(str: string): BonuseItem {
        let strArr = str.split(",")
        if (strArr.length > 1) {
            return UtilsUI.getBonuseItem(VarVal.bonusType.item, null, strArr[0], strArr[1]);
        }
        if (strArr.length = 1) {
            return UtilsUI.getBonuseItem(VarVal.bonusType.stone, null, null, strArr[0]);
        }
    }

    private refreshInfoData(){
        this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        this.xyPay = GameServerData.getInstance().isHaveModule(VarVal.payOtherType.xianyuan)
    }


    public onViewUpdate(params: any): void {
       this.refreshInfoData();
       this.refreshPage0();
       this.refreshGift3();
    }

    public static isViewRedPoint(): boolean{
        if (LyFairyGift.LyFairyGiftScore() || LyFairyGift.LyFairyGiftTask() ||LyFairyGift.LyFairyGift3()) {
            return true
        }
        return false
    }

    public static LyFairyGiftScore(): boolean{
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let fairyItem = LocaleData.getFairyItem()
        let xyPay = GameServerData.getInstance().isHaveModule(VarVal.payOtherType.xianyuan)
        for (let index = 0; index < fairyItem.length; index++) {
            let needScore = Number(fairyItem[index].score)
            if (fullInfo.score >= needScore) {
                let canTake = true
                for (let index2 = 0; index2 < fullInfo.xyflTakes.length; index2++) {
                    const element = fullInfo.xyflTakes[index2];
                    if (element.id == Number(fairyItem[index].id)) {
                        if (xyPay) {
                            if (element.half && element.half == 1) {
                                canTake = true
                                break
                            }else{
                                canTake = false
                            }
                        }else{
                            canTake = false
                        }
                    }
                }
                if (canTake) {
                    return true
                }
            }
        }
        return false
    }

    public static LyFairyGiftTask(): boolean{
        let talks = GameServerData.getInstance().getTaskState(VarVal.taskType.xianyuan);
        for (let index = 0; index < talks.length; index++) {
            let talk = talks[index];
            if (talk.state == 2) {
                return true
            }
        }
        return false
    }

    public static LyFairyGift3(): boolean{
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let cishuGiftData = LocaleData.getFairyCishuGift(fullInfo.xyTakeMax);
        if (fullInfo.hasTakeFreeXy == 0 || fullInfo.xyBuyCount >= Number(cishuGiftData.id)) {
            return true
        } 
        return false
    }

    public getIsViewMask(): boolean {
        return false;
    };
}


