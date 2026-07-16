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
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { VarVal } from "../Values/VarVal";

export class LyHavenPot extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyHaven";
        this.viewResI.pkgName = "LyHaven";
        this.viewResI.comName = "LyHavenPot";
    }

   
    private uiPanel: fgui.GComponent
    public onViewCreate(_params:any):void {
        this.getUiPanel().getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenPot, 0, null)
        });
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null);
        this.uiPanel.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenPot, 0, null)
        });
        let pro = this.uiPanel.getChild("pro", fgui.GProgressBar)
        pro.max = 100
        let label_proDes = this.uiPanel.getChild("label_proDes", fgui.GLabel)
        let group_item = this.uiPanel.getChild("group_item", fgui.GComponent)
        let label_title = this.uiPanel.getChild("label_title", fgui.GLabel)
        label_title.text = StrVal.LYHAVEN.STR23
        let btn_dmPay = this.uiPanel.getChild("btn_dmPay", fgui.GButton)
        let btn_yfPay = this.uiPanel.getChild("btn_yfPay", fgui.GButton)
        let btn_ggPay = this.uiPanel.getChild("btn_ggPay", fgui.GButton)
        let label_number = this.uiPanel.getChild("label_number", fgui.GLabel)
        let label_name = this.uiPanel.getChild("label_name", fgui.GLabel)
        let btns :Array<fgui.GButton> = []
        btns.push(btn_dmPay)
        btns.push(btn_yfPay)
        btns.push(btn_ggPay)
        let xmls = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)._cornucopia[0]._item
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        let controller: fgui.Controller = this.uiPanel.getController("btn")
        // private playAnim(com:fgui.GComponent, isPlay: boolean){
        //     if (isPlay) {
        //         com
        //     }else{
        //         com.getTransition("t0").stop()
        //     }
        // }
        
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN)
        let treasureData = activityState.data.activityHaven.treasureData
        let refreshUI:Function = (index) =>{
            let data = treasureData[index]
            pro.value = data.progress
            label_proDes.text = UtilsTool.stringFormat(StrVal.LYHAVEN.STR24, [xmls[index].progress])
            let callBack: Function = ()=>{}
            group_item.getTransition("t0").stop()
            if (data.state == 2) {
                callBack = null
                group_item.getChild("group_isget").visible = true
                // group_item.getTransition("t0").stop()
                UtilsUI.setButtonIcon(btns[index], null, StrVal.LYHAVEN.STR58)
            }else{
                group_item.getChild("group_isget").visible = false
                if (data.progress != 100) {
                    callBack = null
                    // group_item.getTransition("t0").stop()
                }else{
                    //已开通
                    if (data.state == 1) {
                        group_item.getTransition("t0").play(null , -1)
                        callBack = ()=>{
                            UtilsUI.lockWait()
                            GameServer.getInstance().send((args: any) => {
                                UtilsUI.unlockWait()
                                if (args.errorcode == 0) {
                                    activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN)
                                    treasureData = activityState.data.activityHaven.treasureData
                                    UtilsUI.showItemReward({bonuseItems:[UtilsUI.getBonuseItem(VarVal.bonusType.stone, null, null, xmls[index].reward)]});
                                    refreshUI(controller.selectedIndex)
                                } else {
                                    UtilsUI.showMsgTip(args.errorcode)
                                }
                            } ,"takeHavenTreasureDataBonuse", { level: index + 1});
                        }
                    }
                    
                }
                if (data.state == 1) {
                    UtilsUI.setButtonIcon(btns[index], null, StrVal.LYHAVEN.STR59)
                }

                if (controller.selectedIndex == 1) {
                    UtilsUI.setPayItemRebateComp(this.uiPanel.getChild("group_rebeatfan"), { money: btn_yfPaypayData.money});
                }else if(controller.selectedIndex == 2){
                    UtilsUI.setPayItemRebateComp(this.uiPanel.getChild("group_rebeatfan"), { money: btn_ggPaypayData.money});
                }
            }
            UtilsUI.setUIGroupItem(UtilsUI.getBonuseItem(VarVal.bonusType.stone, null, null, "0"), group_item.getChild("GroupItem"), callBack); 
            label_number.text = "x" + xmls[index].reward
            label_name.text = xmls[index].name
            
        }

        controller.onChanged(()=>{
            refreshUI(controller.selectedIndex)
        })
      
        btn_dmPay.onClick(()=>{
            if (treasureData[0].state == 0) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        // activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN)
                        // treasureData = activityState.data.activityHaven.treasureData
                        // UtilsUI.showItemReward({ bonuseItems: [UtilsUI.getBonuseItemInStr(UtilsTool.stringFormat("{0}, {1}", [VarVal.bonusType.stone, xmls[0].reward]))]});
                        refreshUI(0)
                        UtilsUI.showMsgTip(StrVal.LYHAVEN.STR54)
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"openTreasureHaven", null);
            }
        });
        let btn_yfPaypayData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.jinchan)
        UtilsUI.setButtonIcon(btn_yfPay, VarVal.bonusType.chance, String(Number(btn_yfPaypayData.money) /100))
        btn_yfPay.onClick(()=>{
            if (treasureData[1].state == 0) {
                let payData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.jinchan)
                UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
                }, payData, VarVal.payType.others, VarVal.payOtherType.jinchan);
            }
        });
        let btn_ggPaypayData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.pixiu)
        UtilsUI.setButtonIcon(btn_ggPay, VarVal.bonusType.chance, String(Number(btn_ggPaypayData.money) /100))
        btn_ggPay.onClick(()=>{
            if (treasureData[2].state == 0) {
                let payData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.pixiu)
                UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
                }, payData, VarVal.payType.others, VarVal.payOtherType.pixiu);
            }
        });
        refreshUI(0)

        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == VarVal.ACTIVITY_ID.HAVEN) {
                activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN)
                treasureData = activityState.data.activityHaven.treasureData
                refreshUI(controller.selectedIndex)
            }
        }, "activityStateChanged");

        this.registerRequest((args) => {
            // 返还
            let rebate = UtilsUI.getRebateBonuseItems();
            if (rebate) {
                UtilsUI.showItemReward({rebateBonuseItems:rebate});
            }
        }, "payXyEventChanged");

    }

    public getIsViewMask(): boolean {
        return false;
    };
}


