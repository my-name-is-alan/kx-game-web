//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { VarVal } from "../Values/VarVal";
import { LyPayRecharge } from "./LyPayRecharge";
import { LyPayMonthCard } from "./LyPayMonthCard";
import { LyPayGiftDaily } from "./LyPayGiftDaily";
import { LyPayGiftDailyChoose } from "./LyPayGiftDailyChoose";
import { GameServerData } from "../Kernel/GameServerData";
import { StrVal } from "../Values/StrVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, MonthCardType, UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { LyPayFunds } from "./LyPayFunds";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { AudioManager } from "../Kernel/AudioManager";
import { LyPayExquisite, PayExquisitePage } from "./LyPayExquisite";

enum PAYENTRY_TYPES {
    PAY_RECHARGE,
    GIFT_DAILYCHOOSE,
    GIFT_DAILY,
    MONTH_CARD,
    FUND_XIUWEI,
    FUND_MAOXIAN,
    FUND_XIANSHU,
    FUND_TOWER,
}

export class LyPayAllEntry extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPayRecharge;
        this.viewResI.pkgName = "LyPayRecharge";
        this.viewResI.comName = "LyPayAllEntry";
    }

    private PAYENTRY_ITEMS = [
        {id: PAYENTRY_TYPES.PAY_RECHARGE, name: "", bg:"frame_recharge", icon: "", params:undefined},
        {id: PAYENTRY_TYPES.GIFT_DAILYCHOOSE, name: "", bg:"frame_self selected activities", icon: ""},
        {id: PAYENTRY_TYPES.GIFT_DAILY, name: "", bg:"frame_value Pack", icon: ""},
        {id: PAYENTRY_TYPES.MONTH_CARD, name: "", bg:"frame_monthly card", icon: ""},
    ];
    private itemDatas:Array<any>;
    private list_item:fgui.GList;

    private totalCharge: any
    private chargeAct: any //累充数据
    private payAccDay: any //累天数据

    private chargeArr: Array<any> = []
    private payAccArr: Array<any> = []

    private pageConterl: fgui.Controller
    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let loader_effect1 = group_main.getChild("loader_effect1", fgui.GLoader3D);
        loader_effect1.visible = false;
        
        this.pageConterl = group_main.getController("page")
        let btn_page1 =  group_main.getChild("btn_page1",fgui.GButton)
        let btn_page2 =  group_main.getChild("btn_page2",fgui.GButton)
        group_main.getChild("btn_page0",fgui.GButton).text = StrVal.LYPAYALLENTRY.STR9
        btn_page1.text = StrVal.LYPAYALLENTRY.STR10
        btn_page2.text = StrVal.LYPAYALLENTRY.STR11
        PointRedData.getInstance().registerPoint(btn_page1, PointRedType.totalCharge);
        PointRedData.getInstance().registerPoint(btn_page2, PointRedType.totalDay);
        btn_page1.visible = LyPayAllEntry.isTotalChargeOpen();
        btn_page2.visible = LyPayAllEntry.isTotalDayChargeOpen();
        this.pageConterl.onChanged(()=>{
            loader_effect1.visible = this.pageConterl.selectedIndex != 0;
            if (this.pageConterl.selectedIndex > 0) {
                this.refreshPage(group_main)
            }
        });

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayAllEntry, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
        }, group_main.getChild("loader_effect"), VarVal.UI_EFF_NAME.spine_qingdian_denglong);

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
        }, group_main.getChild("loader_effect3"), VarVal.UI_EFF_NAME.spine_qingdian_niao);

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
        }, loader_effect1, VarVal.UI_EFF_NAME.spine_qingdian_saoguang);

        // 列表
        this.list_item = group_main.getChild("list_item");
        this.list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let item = this.itemDatas[index];

            let img_diban = group_item.getChild("img_diban");
            if (item.id == PAYENTRY_TYPES.GIFT_DAILYCHOOSE || item.id == PAYENTRY_TYPES.GIFT_DAILY) {
                img_diban.visible = true;
                let label_des:fgui.GButton = group_item.getChild("label_des");
                let timeCall = () => {
                    let serverTime = GameServerData.getInstance().getServerTime() * 1000;
                    let lastTime = UtilsTool.getNextDateTime(serverTime);
                    let remain = lastTime - serverTime;
                    label_des.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR8, [UtilsTool.splitTimeString(remain / 1000)]);
                }
                this.setInterval(timeCall, 1000);
                timeCall();
            } else {
                img_diban.visible = false;
            }

            let loader_bg = group_item.getChild("loader_bg", fgui.GLoader);
            // let btn_go:fgui.GButton = group_item.getChild("btn_go");
            // btn_go.text = StrVal.LYPAYALLENTRY.STR4;

            if (item.id == PAYENTRY_TYPES.PAY_RECHARGE) {
                loader_bg.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayRecharge, 0, null);
                })
            } else if (item.id == PAYENTRY_TYPES.GIFT_DAILYCHOOSE) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyPayGiftDailyChoose);
                loader_bg.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayGiftDailyChoose, 0, null);
                })
            } else if (item.id == PAYENTRY_TYPES.GIFT_DAILY) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyPayGiftDaily);
                loader_bg.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayGiftDaily, 0, null);
                })
            } else if (item.id == PAYENTRY_TYPES.MONTH_CARD) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyPayMonthCard);
                loader_bg.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayMonthCard, 0, {type:MonthCardType.Life});
                })
            } else if (item.id == PAYENTRY_TYPES.FUND_XIUWEI
                || item.id == PAYENTRY_TYPES.FUND_MAOXIAN
                || item.id == PAYENTRY_TYPES.FUND_XIANSHU
                || item.id == PAYENTRY_TYPES.FUND_TOWER) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyPayFunds, Number(item.params));
                loader_bg.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayFunds, 0, {payOtherType:item.params});
                })
            }
            loader_bg.url = UtilsTool.stringFormat("ui://LyPayRecharge/{0}",[item.bg]);
        }

        // this.refreshPage(group_main);
        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == VarVal.ACTIVITY_ID.PAYACC) {
                this.refreshPage(group_main)
            }
        }, "activityStateChanged");

        if (params && params.isNewEnter) { // 新界面跳转进来
            group_main.getChild("btn_page0",fgui.GButton).visible = false;
            btn_page1.visible = false;
            if (LyPayAllEntry.isTotalDayChargeOpen()) {
                this.pageConterl.selectedIndex = 2;
            //} else if (LyPayAllEntry.isTotalChargeOpen()) {
            //    this.pageConterl.selectedIndex = 1;
            }
        } else {
            this.onViewUpdate(null);
        }
    }

    public onViewUpdate(params: any): void {
        if (params && params.scrollToIndex) {
            this.scrollToRedPointItem();
            return
        }

        this.itemDatas = new Array<any>();
        for (let i = 0; i < this.PAYENTRY_ITEMS.length; i++) {
            this.itemDatas.push(this.PAYENTRY_ITEMS[i]);
        }
        // 动态列表项目
        if (LyPayFunds.getFundState(VarVal.payOtherType.fundxiuwei) < 2) {
            this.itemDatas.push(
                {id: PAYENTRY_TYPES.FUND_XIUWEI, name: "", bg:"frame_xiuwei", icon: "", params: VarVal.payOtherType.fundxiuwei}
            )
        }
        if (LyPayFunds.getFundState(VarVal.payOtherType.fundstage) < 2) {
            this.itemDatas.push(
                {id: PAYENTRY_TYPES.FUND_MAOXIAN, name: "", bg:"frame_fund1", icon: "", params: VarVal.payOtherType.fundstage}
            )
        }
        if (LyPayFunds.getFundState(VarVal.payOtherType.fundxianshu) < 2) {
            this.itemDatas.push(
                {id: PAYENTRY_TYPES.FUND_XIANSHU, name: "", bg:"frame_zhutang", icon: "", params: VarVal.payOtherType.fundxianshu}
            )
        }
        if (LyPayFunds.getFundState(VarVal.payOtherType.fundtower) < 2) {
            this.itemDatas.push(
                {id: PAYENTRY_TYPES.FUND_TOWER, name: "", bg:"frame_jiliuta", icon: "", params: VarVal.payOtherType.fundtower}
            )
        }
        this.list_item.numItems = this.itemDatas.length;
        this.scrollToRedPointItem();
    }

    private scrollToRedPointItem() {
        let rollIdx:number = -1;
        for (let i = 0; i < this.itemDatas.length; i++) {
            if ((this.itemDatas[i].id == PAYENTRY_TYPES.GIFT_DAILYCHOOSE && LyPayGiftDailyChoose.isViewRedPoint())
                || (this.itemDatas[i].id == PAYENTRY_TYPES.GIFT_DAILY && LyPayGiftDaily.isViewRedPoint())
                || (this.itemDatas[i].id == PAYENTRY_TYPES.MONTH_CARD && (LyPayMonthCard.isViewRedPointMonth() || LyPayMonthCard.isViewRedPointLife()))) {
                rollIdx = i;
                break;
            }
        }
        if (rollIdx >= 0) {
            this.list_item.scrollToView(rollIdx, true, true);
        } else if (LyPayFunds.getFundState(VarVal.payOtherType.fundxiuwei) == 1
            || LyPayFunds.getFundState(VarVal.payOtherType.fundstage) == 1
            || LyPayFunds.getFundState(VarVal.payOtherType.fundxianshu) == 1
            || LyPayFunds.getFundState(VarVal.payOtherType.fundtower) == 1) {
                // this.list_item.scrollPane.scrollBottom(true); // 没有滚动动画？
                this.list_item.scrollToView(this.itemDatas.length - 1, true, true);
        }
    }

    private refreshPage(group_main){
        this.refeshActData()
        this.refreshActivitPage(group_main)
    }

    private refreshActivitPage(group_main: fgui.GComponent){
        let label_totalTime = group_main.getChild("label_time")
        //累充
        let btn_page1: fgui.GButton = group_main.getChild("btn_page1")
        if (this.chargeArr.length > 0) {
            let label_leijicz: fgui.GLabel = group_main.getChild("label_leijicz")
            label_leijicz.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR1, [this.chargeAct.totalCharge / 100]);
            btn_page1.visible = true
            btn_page1.onClick(()=>{
                this.refeshActData()
            });
            let group_oneGet1: fgui.GComponent = group_main.getChild("group_oneGet1")
            UtilsUI.setUIGroupItem(UtilsUI.getBonuseItemsByBonusesId(this.chargeAct.charge[0].bonuseID)[0],  group_oneGet1.getChild("GroupItem"), ()=>{
                if (this.chargeAct.charge[0].start == 1) {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.refeshActData()
                            if (this.chargeAct.charge[0].start == 2) {
                                group_oneGet1.getChild("group_isget").visible = true
                            } else{
                                group_oneGet1.getChild("group_isget").visible = false 
                            }
                            if (args.bonusesResultArr && args.bonusesResultArr.length > 0) {
                                UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString(args.bonusesResultArr) });
                            }
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"totalCharge", { id: 0, type: 0})
                }
            });
            if (this.chargeAct.charge[0].start == 2) {
                group_oneGet1.getChild("group_isget").visible = true
            } else{
                group_oneGet1.getChild("group_isget").visible = false
            }
            let list_totalPay: fgui.GList = group_main.getChild("list_all")
            list_totalPay.setVirtual()
            list_totalPay.itemRenderer = (index:number, group_item:fgui.GComponent) => {
                let stateData = this.chargeArr[index];
                (group_item.getChild("label_des")as fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR3, [stateData.money / 100]);
                let isGet: fgui.GGroup = group_item.getChild("group_yilingqu")
                let pro: fgui.GProgressBar = group_item.getChild("pro")
                let btn_go: fgui.GButton = group_item.getChild("btn_go")
                let list_item: fgui.GList = group_item.getChild("list_item")

                let bonuseItems1:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(stateData.bonuseID);
                list_item.itemRenderer = (index: number, child:fgui.GComponent) => {
                    UtilsUI.setUIGroupItem(bonuseItems1[index], child, null);
                }
                list_item.numItems = bonuseItems1.length
                pro.max = Number(stateData.money)/100
                pro.value = this.chargeAct.totalCharge/100

                btn_go.visible = true
                isGet.visible = false
                if (stateData.start == 0) {
                    btn_go.text = StrVal.LYPAYALLENTRY.STR4
                }else if(stateData.start == 1){
                    btn_go.text = StrVal.LYPAYALLENTRY.STR5
                }else{
                    btn_go.visible = false
                    isGet.visible = true
                }
                PointRedData.getInstance().updateManualPoint(btn_go, stateData.start == 1)
                btn_go.clearClick();
                btn_go.onClick(()=>{
                    if (stateData.start == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayExquisite, 0, {switchToPage:PayExquisitePage.RECHARGE});
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayAllEntry, 0, null);
                    }else if(stateData.start == 1){
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                this.refeshActData()
                                list_totalPay.numItems = this.chargeAct.charge.length - 1;
                             
                                if (args.bonusesResultArr && args.bonusesResultArr.length > 0) {
                                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString(args.bonusesResultArr)});
                                }
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        } ,"totalCharge", { id: 0, type: 1 })
                    }
                });
            }
            list_totalPay.numItems = this.chargeAct.charge.length - 1;
        }else{
            btn_page1.visible = false
        }
        
        
        let label_dayTime = group_main.getChild("label_time2")
        let btn_page2: fgui.GButton = group_main.getChild("btn_page2")

        //累天
        if (this.payAccArr.length > 0) {
            btn_page2.visible = true
            let group_oneGet2: fgui.GComponent = group_main.getChild("group_oneGet2");
            UtilsUI.setUIGroupItem(UtilsUI.getBonuseItemsByBonusesId(this.payAccDay.days[0].bonuseID)[0],  group_oneGet2.getChild("GroupItem"), ()=>{
                if (this.payAccDay.days[0].start == 1) {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.refeshActData()
                            if (this.payAccDay.days[0].start == 2) {
                                group_oneGet2.getChild("group_isget").visible = true
                            } else{
                                group_oneGet2.getChild("group_isget").visible = false 
                            }
                            if (args.bonusesResultArr && args.bonusesResultArr.length > 0) {
                                UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString(args.bonusesResultArr)});
                            }
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"totalCharge", { id: 1, type: 0})
                }
            });
            if (this.payAccDay.days[0].start == 2) {
                group_oneGet2.getChild("group_isget").visible = true
            } else{
                group_oneGet2.getChild("group_isget").visible = false
            }
            let list_all2: fgui.GList = group_main.getChild("list_all2")
            list_all2.setVirtual()
            list_all2.itemRenderer = (index:number, group_item:fgui.GComponent) => {
                let stateData = this.payAccArr[index];
                (group_item.getChild("label_des")as fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR6, [stateData.days]);
                let pro: fgui.GProgressBar = group_item.getChild("pro")
                let btn_go: fgui.GButton = group_item.getChild("btn_go")
                let isGet: fgui.GGroup = group_item.getChild("group_yilingqu")
                let list_item: fgui.GList = group_item.getChild("list_item")

                let bonuseItems1:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(stateData.bonuseID);
                list_item.itemRenderer = (index: number, child:fgui.GComponent) => {
                    UtilsUI.setUIGroupItem(bonuseItems1[index], child, null);
                }
                list_item.numItems = bonuseItems1.length

                pro.max = Number(stateData.days)
                pro.value = this.payAccDay.chargeDays

                btn_go.visible = true
                isGet.visible = false
                if (stateData.start == 0) {
                    btn_go.text = StrVal.LYPAYALLENTRY.STR4
                }else if(stateData.start == 1){
                    btn_go.text = StrVal.LYPAYALLENTRY.STR5
                }else{
                    btn_go.visible = false
                    isGet.visible = true
                }
                PointRedData.getInstance().updateManualPoint(btn_go, stateData.start == 1)
                btn_go.clearClick();
                btn_go.onClick(()=>{
                    if (stateData.start == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayExquisite, 0, {switchToPage:PayExquisitePage.RECHARGE});
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayAllEntry, 0, null);
                    }else if(stateData.start == 1){
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                this.refeshActData()
                                list_all2.numItems = this.payAccDay.days.length - 1;
                                if (args.bonusesResultArr && args.bonusesResultArr.length > 0) {
                                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString(args.bonusesResultArr) });
                                }
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        } ,"totalCharge", { id: 1, type: 1 })
                    }
                });
            }
            list_all2.numItems = this.payAccDay.days.length - 1;
        }else{
            btn_page2.visible = false
        }
        this.setInterval(()=>{
            let serverTime = GameServerData.getInstance().getServerTime()
            if (this.chargeAct.endTime) {
                label_totalTime.text = UtilsTool.parseTimeToString(this.chargeAct.endTime - serverTime);
            }
            if (this.payAccDay.endTime) {
                label_dayTime.text = UtilsTool.parseTimeToString(this.payAccDay.endTime - serverTime);
            }
        }, 1000);
    }

    private refeshActData(){
        let state = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.PAYACC)
        this.totalCharge = state.data.totalCharge
        this.chargeAct = this.totalCharge.charge
        this.chargeArr = []
        if (this.chargeAct.charge) {
            this.chargeAct.charge.sort((a, b): number=>{
                return Number(a.money) - Number(b.money)
            });
            for (let index = 1; index < this.chargeAct.charge.length; index++) {
                this.chargeArr.push(this.chargeAct.charge[index])
            } 
            this.chargeArr.sort((a, b): number=>{
                let canA 
                if (a.start == 1) {
                    canA = -1
                }else {
                    canA = a.start
                }
                let canB
                if (b.start == 1) {
                    canB = -1
                }else {
                    canB = b.start
                }
                return canA - canB
            })
        }
        
        this.payAccDay = this.totalCharge.days
        this.payAccArr = []
        if (this.payAccDay.days) {
            for (let index = 1; index < this.payAccDay.days.length; index++) {
                this.payAccArr.push(this.payAccDay.days[index])
            }
            this.payAccArr.sort((a, b): number=>{
                let canA 
                if (a.start == 1) {
                    canA = -1
                }else {
                    canA = a.start
                }
                let canB
                if (b.start == 1) {
                    canB = -1
                }else {
                    canB = b.start
                }
                if (canA == canB) {
                    return a.days - b.days
                }else{
                    return canA - canB
                }
            })
        }
    }

    public static isTotalChargeViewRedPoint(): boolean {
        let state = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.PAYACC)
        if (state && state.data && state.data.totalCharge.charge) {
            let charge = state.data.totalCharge.charge.charge
            if (charge) {
                for (let index = 0; index < charge.length; index++) {
                    let item = charge[index];
                    if (item.start == 1) {
                        return true   
                    }
                }
            }
        }
        return false
    }

    public static isTotalDayViewRedPoint(): boolean {
        let state = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.PAYACC)
        if (state && state.data && state.data.totalCharge.days) {
            let days = state.data.totalCharge.days.days
            if (days) {
                for (let index = 0; index < days.length; index++) {
                    let item = days[index];
                    if (item.start == 1) {
                        return true   
                    }
                }
            }
        }
        return false
    }

    public static isTotalChargeOpen(): boolean {
        let state = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.PAYACC)
        if (state && state.data && state.data.totalCharge) {
            if (state.data.totalCharge.charge.endTime && state.data.totalCharge.charge.charge.length > 0) {
                return true;
            }
        }
        return false;
    }

    public static isTotalDayChargeOpen(): boolean {
        let state = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.PAYACC)
        if (state && state.data && state.data.totalCharge) {
            if (state.data.totalCharge.days.endTime && state.data.totalCharge.days.days.length > 0) {
                return true;
            }
        }
        return false;
    }

    public getIsViewMask():boolean {
        return false;
    }
}