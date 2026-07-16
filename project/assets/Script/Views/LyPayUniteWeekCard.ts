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
import { LocaleData } from "../Kernel/LocaleData";
import { MonthCardType, UtilsUI } from "../Kernel/UtilsUI";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { PointRedData } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { PlatformAPI } from "../Kernel/PlatformAPI";

export class LyPayUniteWeekCard extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyPayUniteWeekCard";
    }

    private SEL_TYPE:MonthCardType; // 当前选择
    private isPlaying:boolean;
    private czGiftBoun = []
    public onViewCreate(params:any):void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        let type = params.type //0 门客终身卡  1 联合周卡 //2 秘籍终身卡 //3 侠侣终身卡 
        group_main.getController("c1").selectedIndex = type
        // let xmlRoot = LocaleData.getBrumeIsleConfig()
        getUiPanel.getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayUniteWeekCard, 0, null);
        });
        group_main.getChild("btn_close").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayUniteWeekCard, 0, null);
        });

        if (type == 0) {
            this.registerRequest((args) => {
                this.initLifeCard()
            }, "payCardChanged");
            this.initLifeCard();
        }else if(type == 1){
            this.registerRequest((args) => {
                this.initUniteCard()
            }, "weekCardChanged");
            this.initUniteCard();
        }else if(type == 2){
            this.registerRequest((args) => {
                this.initTheCard()
            }, "payCardChanged");
            this.initTheCard();
        }else if(type == 3){
            this.registerRequest((args) => {
                this.initPetCard()
            }, "payCardChanged");
            this.initPetCard();
        }

        this.registerRequest((args) => {
            //充值奖励事件注册
            UtilsUI.showItemReward({
                bonuseItems: this.czGiftBoun,
                rebateBonuseItems:UtilsUI.getRebateBonuseItems()
            });
            this.czGiftBoun = null
        }, "compositeLifeCardFirstBonuse");

        this.registerRequest((args) => {
            //充值奖励事件注册
            UtilsUI.showItemReward({
                rebateBonuseItems:UtilsUI.getRebateBonuseItems()
            });
        }, "weekCardChanged");
    }

    private initUniteCard(): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        group_main.getChild("label_title").text = StrVal.LYELITEMONSTER.STR61
        let weekData = GameServerData.getInstance().getPlayerFullInfo().weekCard
        let group_itemArr = []
        for (let index = 0; index < 4; index++) {
            group_itemArr.push(group_main.getChild("group_c" + index, fgui.GComponent))
        }
        let unitxXml = LocaleData.getPayRoot()._weekCard[0]._item
        let pay = GameServerData.getInstance().isHaveModule(VarVal.payOtherType.uniteWeek) && weekData.day != 0
        let getWeekState = (id: number | string): number => {
            id = Number(id)
            for (let index = 0; index < weekData.ids.length; index++) {
                let data = weekData.ids[index];
                if (data.id == id) {
                    return data.state
                }
            }
            return 0
        }
        for (let index = 0; index < group_itemArr.length; index++) {
            let child: fgui.GComponent = group_itemArr[index];
            let xml = unitxXml[index]
            let anim  = child.getTransition("t0")
            let group_isget = child.getChild("group_isget")
            group_isget.visible = false
            let bounitems = UtilsUI.getBonuseItemsByBonusesId(xml.bonuses)
            UtilsUI.setUIGroupItem(bounitems[0], child.getChild("GroupItem"), null);
            child.clearClick()
            child.onClick(()=>{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString(args.bonusesArr) });
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } , "takeWeekCard", { id: Number(xml.id)});
            });
            let state = getWeekState(xml.id)
            if (xml.isFree == "1") {
                if (state < 2) {
                    anim.play(null , -1)
                }else{
                    anim.stop()
                    group_isget.visible = true
                }
            }else{
                if (state == 1) {
                    anim.play(null , -1)
                }else if(state == 2){
                    anim.stop()
                    group_isget.visible = true
                }else{
                    anim.stop()
                }
            }
        }
        let payData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.uniteWeek)

        UtilsUI.setPayItemRebateComp(group_main.getChild("group_rebeatfan"), payData);
        
        let btn_pay2:fgui.GButton = group_main.getChild("btn_pay2");
        btn_pay2.clearClick()
        UtilsUI.setButtonIcon(btn_pay2, VarVal.bonusType.chance, String(Number(payData.money) / 100));
        btn_pay2.onClick(() => {
            UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            }, payData, VarVal.payType.others, VarVal.payOtherType.uniteWeek);
        })
        if (pay) {
            btn_pay2.visible = false
            group_main.getChild("label_time").text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR59, [weekData.day]) 
        }else{
            btn_pay2.visible = !PlatformAPI.isBinaryExamine()
            group_main.getChild("label_time").text = ""
        }

        let btn_take2:fgui.GButton = group_main.getChild("btn_take2");
        PointRedData.getInstance().updateManualPoint(btn_take2, true);
        btn_take2.clearClick()
        btn_take2.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString(args.bonusesArr) });
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } , "takeWeekCard", { id: 0 });
            
        })
        btn_pay2.visible = (!pay) && !PlatformAPI.isBinaryExamine()
        btn_take2.visible = pay
        let data = LyPayUniteWeekCard.unitxWeekTakeData()
        if (data) {
            btn_take2.text = StrVal.LYELITEMONSTER.STR62
        }else{
            btn_take2.text = StrVal.LYPAY_RECHARGE.STR114
        }
    }

    public onViewUpdate(params: any): void {
        // this.refreshMonthCard();
        // this.refreshLifeCard();
    }

    public initLifeCard():void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        let proto = LocaleData.getEliteMonsterProto(20015)
        let modleInfo = LocaleData.getModelShowInfo(proto.modelId)
        let payGroup = group_main.getChild("group_pay1", fgui.GGroup)

        group_main.getChild("label_title").text = StrVal.LYELITEMONSTER.STR60
        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                
        },  group_main.getChild("n45", fgui.GComponent).getChild("loader_3D", fgui.GLoader3D), modleInfo.spine);
        let rewardXml = LocaleData.getPayRoot()._compositeLifeCard[0]._item[0]
        let bounitems = UtilsUI.getBonuseItemsByBonusesId(rewardXml.bonuses)
        group_main.getChild("label_getDesc").text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR63, [bounitems[0].count, bounitems[0].proto.name]) 
        let group_item = group_main.getChild("group_get", fgui.GComponent)
        let anim = group_item.getTransition("t0")
        UtilsUI.setUIGroupItem(bounitems[0], group_item.getChild("GroupItem"), null);
        let payData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.eliteLifeCard)

        UtilsUI.setPayItemRebateComp(group_main.getChild("group_rebeatfan"), payData);

        let btn_pay1:fgui.GButton = group_main.getChild("btn_pay1");
        btn_pay1.clearClick()
        UtilsUI.setButtonIcon(btn_pay1, VarVal.bonusType.chance, String(Number(payData.money) / 100));
        btn_pay1.onClick(() => {
            this.czGiftBoun = UtilsUI.getBonuseItemsByBonusesId(rewardXml.first)
            UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            }, payData, VarVal.payType.others, VarVal.payOtherType.eliteLifeCard);
        })

        let btn_take:fgui.GButton = group_main.getChild("btn_take");
        PointRedData.getInstance().updateManualPoint(btn_take, true);
        btn_take.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString( [args.bonusesResult]) });
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "takeEliteMonsterCardCard", null);
        })
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let pay = GameServerData.getInstance().isHaveModule(VarVal.payOtherType.eliteLifeCard)
        if (pay) {
            btn_take.visible = true
            // btn_pay1.visible = false
            payGroup.visible = false
            if (fullInfo.eliteMonsterCardTake == 1) {
                btn_take.text = StrVal.LYPAY_RECHARGE.STR114;
                anim.stop()
            }else{
                btn_take.text = StrVal.LYPAY_RECHARGE.STR201;
                anim.play(null, -1)
            }
        }else{
            btn_take.visible = false
            payGroup.visible = !PlatformAPI.isBinaryExamine()
           
            anim.stop()
        }
    }

    public initTheCard():void{
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        group_main.getChild("label_title").text = StrVal.LYELITEMONSTER.STR60

        let rewardXml = LocaleData.getPayRoot()._compositeLifeCard[0]._item[2]
        let bounitems = UtilsUI.getBonuseItemsByBonusesId(rewardXml.bonuses)
        group_main.getChild("label_getDescMiji").text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR63, [bounitems[0].count, bounitems[0].proto.name]) 

        console.log(rewardXml)
        let group_item = group_main.getChild("group_getMiji", fgui.GComponent)
        let anim = group_item.getTransition("t0")
        UtilsUI.setUIGroupItem(bounitems[0], group_item.getChild("GroupItem"), null);
        let payGroup = group_main.getChild("group_pay2", fgui.GGroup)
        let payData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.theLifeCard)

        UtilsUI.setPayItemRebateComp(group_main.getChild("group_rebeatfan"), payData);

        let btn_pay1:fgui.GButton = group_main.getChild("btn_paymik1");
        btn_pay1.clearClick()
        UtilsUI.setButtonIcon(btn_pay1, VarVal.bonusType.chance, String(Number(payData.money) / 100));
        btn_pay1.onClick(() => {
            this.czGiftBoun = UtilsUI.getBonuseItemsByBonusesId(rewardXml.first)
            UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            }, payData, VarVal.payType.others, VarVal.payOtherType.theLifeCard);
        })

        let btn_take:fgui.GButton = group_main.getChild("btn_takemiji");
        PointRedData.getInstance().updateManualPoint(btn_take, true);
        btn_take.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString( [args.bonusesResult]) });
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "takeTheurgyCard", null);
        })

        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let pay = GameServerData.getInstance().isHaveModule(VarVal.payOtherType.theLifeCard)
        if (pay) {
            btn_take.visible = true
            payGroup.visible = false
            if (fullInfo.theurgyCardTake == 1) {
                btn_take.text = StrVal.LYPAY_RECHARGE.STR114;
                anim.stop()
            }else{
                btn_take.text = StrVal.LYPAY_RECHARGE.STR201;
                anim.play(null, -1)
            }
        }else{
            btn_take.visible = false
            payGroup.visible = !PlatformAPI.isBinaryExamine()
            anim.stop()
        }
    }
    public initPetCard():void{
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        group_main.getChild("label_title").text = StrVal.LYELITEMONSTER.STR60
        let rewardXml = LocaleData.getPayRoot()._compositeLifeCard[0]._item[1]
        let bounitems = UtilsUI.getBonuseItemsByBonusesId(rewardXml.bonuses)
        group_main.getChild("label_getDescPet").text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR63, [bounitems[0].count, bounitems[0].proto.name]) 
        
        let group_item = group_main.getChild("group_getPet", fgui.GComponent)
        let anim = group_item.getTransition("t0")
        UtilsUI.setUIGroupItem(bounitems[0], group_item.getChild("GroupItem"), null);
        let payGroup = group_main.getChild("group_pay3", fgui.GGroup)
        let payData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.petLifeCard)

        UtilsUI.setPayItemRebateComp(group_main.getChild("group_rebeatfan"), payData);

        let btn_pay1:fgui.GButton = group_main.getChild("btn_pay3");
        btn_pay1.clearClick()
        UtilsUI.setButtonIcon(btn_pay1, VarVal.bonusType.chance, String(Number(payData.money) / 100));
        btn_pay1.onClick(() => {
            this.czGiftBoun = UtilsUI.getBonuseItemsByBonusesId(rewardXml.first)
            UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            }, payData, VarVal.payType.others, VarVal.payOtherType.petLifeCard);
        })

        let btn_take:fgui.GButton = group_main.getChild("btn_takePet");
        PointRedData.getInstance().updateManualPoint(btn_take, true);
        btn_take.clearClick()
        btn_take.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString( [args.bonusesResult]) });
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "takePetCard", null);
        })

        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let pay = GameServerData.getInstance().isHaveModule(VarVal.payOtherType.petLifeCard)
        if (pay) {
            btn_take.visible = true
            payGroup.visible = false
            if (fullInfo.petCardTake == 1) {
                btn_take.text = StrVal.LYPAY_RECHARGE.STR114;
                anim.stop()
            }else{
                btn_take.text = StrVal.LYPAY_RECHARGE.STR201;
                anim.play(null, -1)
            }
        }else{
            btn_take.visible = false
            payGroup.visible = !PlatformAPI.isBinaryExamine()
            anim.stop()
        }
    }

    public getIsViewMask():boolean {
        return false;
    }

    public static unitxWeekTakeData(typeId?): any {
        if (PlatformAPI.isBinaryExamine()) {
            return null
        }
        if (typeId) {
            typeId = Number(typeId)
        }
        let weekData = GameServerData.getInstance().getPlayerFullInfo().weekCard
        if (weekData) {
            for (let index = 0; index < weekData.ids.length; index++) {
                let data = weekData.ids[index];
                let xml = LyPayUniteWeekCard.getUniteXml(data.id)
                if (data.state == 1) {
                    if (typeId) {
                        if ((typeId == data.id || xml.isFree == "1")) {
                            return data
                        }
                    }else{
                        return data
                    }
                }
            }  
        }
        return null;
    }

    public static getUniteXml(id:string|number): any{
        id = String(id)
        let unitxXml = LocaleData.getPayRoot()._weekCard[0]._item
        for (let index = 0; index < unitxXml.length; index++) {
            const element = unitxXml[index];
            if (element.id == id) {
                return element
            }
        }
        return null
    }


    public static isViewRedPointLife():boolean {
        if (GameServerData.getInstance().isHaveModule(VarVal.payOtherType.eliteLifeCard)) {
            let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
            return (fullInfo.eliteMonsterCardTake != 1);
        }
        return false;
    }

    public static isViewRedPointTheLife():boolean {
        if (GameServerData.getInstance().isHaveModule(VarVal.payOtherType.theLifeCard)) {
            let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
            return (fullInfo.theurgyCardTake != 1);
        }
        return false;
    }
}


