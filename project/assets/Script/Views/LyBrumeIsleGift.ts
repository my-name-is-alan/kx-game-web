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
import { BonuseItem, MonthCardItemType, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { GameServer } from "../Kernel/GameServer";
import { LyBrumeIsleLand } from "./LyBrumeIsleLand";
import { PointRedData } from "../Kernel/PointRedData";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { LyBrumeIsle } from "./LyBrumeIsle";

export class LyBrumeIsleGift extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyBrumeIsle";
        this.viewResI.pkgName = "LyBrumeIsle";
        this.viewResI.comName = "LyBrumeIsleGift";
    }
    
    public onViewCreate(params:any): void {
        let czGiftBoun = null
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        let xmlRoot = LocaleData.getBrumeIsleConfig()
        getUiPanel.getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleGift, 0, null);
        }); 
        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleGift, 0, null);
        })
        UtilsUI.playCommonGroupAni(group_main, null);
        let list_gift = group_main.getChild("list_all", fgui.GList)
        let allGiftProto = []
        let payGift = LocaleData.getBrumeIsleRoot()._payGift[0]._item
        for (let index = 0; index < payGift.length; index++) {
            let  element = payGift[index];
            if (element.refreshType == "2") {
                allGiftProto.push(element)
            }
        }
        list_gift.setVirtual()
        list_gift.itemRenderer =(index: number, child:fgui.GComponent)=>{
            let giftProto = allGiftProto[index]
            let bonusItem: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(giftProto.bonusesId) 
            let list_all:fgui.GList = child.getChild("list_item")
            list_all.itemRenderer = (i: number, child2: fgui.GComponent)=>{
                UtilsUI.setUIGroupItem(bonusItem[i], child2, null);
            }
            if (giftProto.energy > "0") {
                bonusItem.push(UtilsUI.getBonuseItem(VarVal.bonusType.brumeIslePower, "", "", giftProto.energy))  
            }
            list_all.numItems = bonusItem.length
            child.getChild("label_des", fgui.GLabel).text = giftProto.name
            let giftState = this.getGiftState(giftProto.id)
            child.getChild("label_day", fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR26, [giftProto.maxBuyCount - giftState.buycnt]) 
            let btn_buy = child.getChild("btn_go", fgui.GButton);
            let btn_aDbuy = child.getChild("btn_ad", fgui.GButton);
            let btn_stone = child.getChild("btn_stone", fgui.GButton);
            btn_buy.clearClick()
            btn_aDbuy.clearClick()
            btn_stone.clearClick()
            let get = child.getChild("get", fgui.GGroup);
            btn_buy.visible = false
            btn_aDbuy.visible = false
            btn_stone.visible = false
            btn_stone.icon = UtilsUI.getItemIconUrl(VarVal.bonusType.stone);
            let group_rebeatfan = child.getChild("group_rebeatfan", fgui.GComponent)
            group_rebeatfan.visible = false
            
            let btn_fun: Function = null
            PointRedData.getInstance().updateManualPoint(btn_buy, false)
            if (giftProto.type == 0 || giftProto.type == 3) {
                btn_fun = ()=> {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showItemReward({bonuseItems: bonusItem}) 
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"buyFreeGift", { id: VarVal.ACTIVITY_ID.BRUMEISLE, giftId: Number(giftProto.id)})
                }
                if (giftProto.type == 0) {
                    UtilsUI.setButtonIcon(btn_buy, null, StrVal.LYELITEATTACK.STR27)
                    PointRedData.getInstance().updateManualPoint(btn_buy, Number(giftProto.maxBuyCount) != giftState.buycnt)
                }else {
                    btn_stone.text = giftProto.num;
                    btn_stone.onClick(btn_fun)
                }
               
            }else if (giftProto.type == 4) {
                btn_aDbuy.text = StrVal.LYELITEATTACK.STR27
                btn_buy.visible = false
                btn_fun = ()=> {
                    PlatformAPI.doSdkRewardVideoAD((errmsg:string) => {
                        if (errmsg) {
                            UtilsUI.showMsgTip(errmsg);
                        } else {
                            UtilsUI.lockWait()
                            GameServer.getInstance().send((args: any) => {
                                UtilsUI.unlockWait()
                                if (args.errorcode == 0) {
                                    UtilsUI.showItemReward({bonuseItems: bonusItem}) 
                                } else {
                                    UtilsUI.showMsgTip(args.errorcode)
                                }
                            } ,"buyFreeGift", { id: VarVal.ACTIVITY_ID.BRUMEISLE, giftId: Number(giftProto.id)})
                        }
                    }, UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.skip_ad))
                }
                btn_aDbuy.onClick(btn_fun);
            }else if(giftProto.type == 2){
                let patData = LocaleData.getPayItem(giftProto.param)
                UtilsUI.setButtonIcon(btn_buy, VarVal.bonusType.chance, String(Number(patData.money)/100))
                btn_fun = ()=>{
                    czGiftBoun = bonusItem
                    UtilsUI.payRechargeItem((errmsg:string) => {
                        if (errmsg) {
                            UtilsUI.showMsgTip(errmsg);
                        }
                    }, patData, VarVal.ACTIVITY_ID.BRUMEISLE, null);
                }
                UtilsUI.setPayItemRebateComp(group_rebeatfan, {money: patData.money});
            }
            if (Number(giftProto.maxBuyCount) == giftState.buycnt) {
                if (giftProto.type == 4) {
                    btn_aDbuy.visible = false
                }else if(giftProto.type == 3){
                    btn_stone.visible = false
                }else{
                    btn_buy.visible = false
                }
                get.visible = true
                group_rebeatfan.visible = false
            }else {
                if (giftProto.type == 4) {
                    btn_aDbuy.visible = true
                }else if(giftProto.type == 3){
                    btn_stone.visible = true
                }else{
                    btn_buy.visible = true
                }
                get.visible = false
            }
            
            btn_buy.onClick(()=>{
                btn_fun()
            });
        }

        let refrshFun= ()=>{
            allGiftProto.sort((a, b): number =>{
                let stateA = this.getGiftState(a.id)
                let stateB = this.getGiftState(b.id)
                let getA = stateA.buycnt == a.maxBuyCount? 1:0
                let getB = stateB.buycnt == b.maxBuyCount? 1:0
                if (getA == getB) {
                    return Number(a.id) - Number(b.id)                    
                }else{
                    return getA - getB                
                }
            })
            UtilsUI.setFguiGlistDelayNumItems(list_gift, allGiftProto.length)
        }
        refrshFun()
         //充值奖励事件注册
        this.registerRequest((args) => {
            UtilsUI.showItemReward({
                bonuseItems: czGiftBoun,
                rebateBonuseItems:UtilsUI.getRebateBonuseItems()
            });
            czGiftBoun = null
        }, "onDomainGiftBonuses");


         this.registerRequest((args) => {
            if (String(args.activityState.activityId) == VarVal.ACTIVITY_ID.BRUMEISLE) {
                refrshFun()
            }
        }, "activityStateChanged");
    }

    public getGiftState(id: number| string){
        id = String(id)
        let activityData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster;
        for (let index = 0; index < activityData.giftsRecords.length; index++) {
            let group = activityData.giftsRecords[index];
            if (group.id == id) {
                return group
            }
        }
        return {id: id, buycnt: 0}
    }

    public static inViewRedPointGift(): boolean{
        if (LyBrumeIsle.isActOpen()) {
            let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE);
            if (activityState && activityState.data && activityState.data.activityDomainMonster) {
                let giftsGroup = LocaleData.getBrumeIsleRoot()._payGift[0]._item
                for (let index = 0; index < giftsGroup.length; index++) {
                    let gift = giftsGroup[index];
                    if (gift.type == 0) {
                        let giftsRecords = activityState.data.activityDomainMonster.giftsRecords;
                        if (giftsRecords) {
                            for (let index = 0; index < giftsRecords.length; index++) {
                                let state = giftsRecords[index];
                                if (state.id == gift.id) {
                                    return Number(gift.maxBuyCount) != state.buycnt
                                }
                            }
                        }
                    }
                }
            
            }
        }
        
        return false
    }

    public onViewDestroy(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyBrumeIsleLand, 0, {isUpdate: true});
    }

    public onViewUpdate(params: any): void {
        
    }
    public getIsViewMask(): boolean {
        return false;
    }
}


