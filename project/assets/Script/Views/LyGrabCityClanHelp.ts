//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { Color } from "cc";
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyCompanionInfo } from "./LyCompanionInfo";
import { LyGrabCity } from "./LyGrabCity";

export class LyGrabCityClanHelp extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyGrabCity";
        this.viewResI.pkgName = "LyGrabCity";
        this.viewResI.comName = "LyGrabCityClanHelp";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_back");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityClanHelp, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityClanHelp, 0, null);
        })
        this.uiPanel.getChild("label_bxl").text = StrVal.LYCLAN.STR127
        this.onHelp()

    };
    private onHelp(): void {
        let clanInfo = GameServerData.getInstance().getGrabCityPlayer().clanState
        let slefInfo = clanInfo.playerInfo[GameServerData.getInstance().getGrabCityPlayer().selfRank -1]
        let clanRecharge = []
        for (let index = 0; index < clanInfo.playerInfo.length; index++) {
            let one = clanInfo.playerInfo[index];
            if (one.onPay && one.onPay == 1) {
                clanRecharge.push(one)
            }
        }
        let maxNum: number = clanRecharge ? clanRecharge.length : 0
        let recharge = LocaleData.getGrabCityRoot()._task[0]._item
        let list_help: fgui.GList = this.uiPanel.getChild("list_help")
        list_help.setVirtual();
        list_help.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let rechargeItem = recharge[index]
            obj.getChild("label_dec").text = rechargeItem.name
            let bar_number: fgui.GProgressBar = obj.getChild("bar_number")
            bar_number.max = rechargeItem.number
            bar_number.value = maxNum > rechargeItem.number ? rechargeItem.number : maxNum
            let list_bonuses: fgui.GList = obj.getChild("list_bonuses")
            let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(rechargeItem.bonusesId);

            if (rechargeItem.activityItem != "0") {
                let pro = rechargeItem.activityItem.split(";")
                for (let index = 0; index < pro.length; index++) {
                    let element = pro[index];
                    let now = element.split(",")
                    bonuseItems.push(UtilsUI.getBonuseItem(LyGrabCity.GrabCityActItem[Number(now[0]) - 1], "", "", now[1]))  
                }
            }

            

            list_bonuses.itemRenderer = ((index1: number, obj1: fgui.GButton) => {
                UtilsUI.setUIGroupItem(bonuseItems[index1], obj1, null);
            }).bind(this)
            list_bonuses.numItems = bonuseItems.length
            let label_state: fgui.GGroup = obj.getChild("label_state")
            let btn_clanClaimRecharge: fgui.GButton = obj.getChild("btn_clanClaimRecharge")
            btn_clanClaimRecharge.clearClick()
            btn_clanClaimRecharge.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        UtilsUI.showItemReward({ bonuseItems: bonuseItems});
                        this.onHelp()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "siegePayAward", null)
            })
            btn_clanClaimRecharge.visible = false
            if (slefInfo.payAward == undefined) {
                btn_clanClaimRecharge.visible = maxNum >= Number(rechargeItem.number) 
                label_state.visible = false
            }else{
                label_state.visible = slefInfo.payAward >= Number(rechargeItem.number)
                btn_clanClaimRecharge.visible = slefInfo.payAward < Number(rechargeItem.number) && maxNum >= Number(rechargeItem.number) 
            }
        }).bind(this)
        list_help.numItems = recharge.length

        let label_people: fgui.GLabel = this.uiPanel.getChild("label_people")
        let nameStr = ""
        if (clanRecharge) {
            for (let i = 0; i < clanRecharge.length; i++) {
                if (i != 0) {
                    nameStr += ","
                }
                nameStr += clanRecharge[i].name
            }
        }

        label_people.text = nameStr
    }


    public getIsViewMask(): boolean {
        return false;
    };

}