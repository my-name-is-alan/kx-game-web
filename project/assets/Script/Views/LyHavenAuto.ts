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

export class LyHavenAuto extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyHaven";
        this.viewResI.pkgName = "LyHaven";
        this.viewResI.comName = "LyHavenAuto";
    }

   
    
    public onViewCreate(_params:any):void {
        let uiPanel: fgui.GComponent
        this.getUiPanel().getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenAuto, 0, null)
        });
        uiPanel = this.getUiPanel()
        let con_open: fgui.Controller = uiPanel.getController("con_open")
        let list_choose: fgui.GList = uiPanel.getChild("list_choose")
        let btn_start: fgui.GButton = uiPanel.getChild("btn_start")
        let btn_free: fgui.GButton = uiPanel.getChild("btn_free")
        let btn_stop: fgui.GButton = uiPanel.getChild("btn_stop")
        let btn_xf: fgui.GButton = uiPanel.getChild("btn_xf")
        
        let btn_7: fgui.GButton = uiPanel.getChild("btn_7")
        let btn_30: fgui.GButton = uiPanel.getChild("btn_30")
        let label_time: fgui.GButton = uiPanel.getChild("label_time");
        let interval 
        uiPanel.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenAuto, 0, null)
        });
        let havenRoot = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)
        let haveItems :Array<any> = []
        let xmlhaveItems = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)._resource[0]._item
        for (let i = 0; i < xmlhaveItems.length; i++) {
            let isIns: boolean = true
            for (let j = 0; j < haveItems.length; j++) {
                if (xmlhaveItems[i].itemId == haveItems[j].itemId) {
                    isIns = false
                    if (Number(xmlhaveItems[i].level) > Number(haveItems[j].level)) {
                        haveItems[j].level = xmlhaveItems[i].level
                    }
                }   
            }
            if (isIns) {
                haveItems.push({
                    itemId: xmlhaveItems[i].itemId,
                    level: xmlhaveItems[i].level,
                })
            }
        }

        let getIemaAuto = (itemId): number =>{
            itemId = Number(itemId)
            for (let index = 0; index < havenData.autoResourceCollection.length; index++) {
                let element = havenData.autoResourceCollection[index];
                if (element.itemId == itemId) {
                    return element.itemLevel
                }
            }
            return 0  
        }
        
        list_choose.itemRenderer = (index: number, child: fgui.GComponent)=>{
            let btn_zuhe: fgui.GButton = child.getChild("btn_zuhe")
            let cbox_buff: fgui.GComboBox = child.getChild("cbox_buff")
            let haveItem = haveItems[index]
            let itmeVaule:Array<string> = []
            let itemString:Array<string> = []
            for (let index = 1; index <= Number(haveItem.level); index++) {
                itmeVaule.push(String(index))
                itemString.push(UtilsTool.stringFormat(StrVal.LYHAVEN.STR25, [String(index)]) )
            }
            let name:string = LocaleData.getItemProto(haveItem.itemId).name;
            btn_zuhe.text = name
            cbox_buff.values = itmeVaule
            cbox_buff.items = itemString
            let level = getIemaAuto(haveItem.itemId)
            btn_zuhe.onClick(()=>{
                if (havenData.isAutoCollectionActivated == 1) {
                    autoFun()
                }
            });

            cbox_buff.on(fgui.Event.STATUS_CHANGED, ()=>{
                if (btn_zuhe.selected) {
                    if (havenData.isAutoCollectionActivated == 1) {
                        autoFun()
                    }
                }
            }, this)
            
            btn_zuhe.selected = false
            if (level == 0) {
                btn_zuhe.selected = false
                cbox_buff.selectedIndex = 0
            }else{
                btn_zuhe.selected = true
                cbox_buff.selectedIndex = level - 1
            }
        }
   

        
        let openTime = GameServerData.getInstance().getServerCreateMilliseconds()
        let nowTime =  GameServerData.getInstance().getServerTime()
        let havenData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN).data.activityHaven
        list_choose.numItems = haveItems.length
        let refreshPage: Function = ()=>{
            if (havenData.autoCollectionTime == 0) {
                 //免费使用
                if (Number(openTime) + ((Number(havenRoot.autoUnlockDay)) * 24 * 60 * 60) >= nowTime && havenData.startTrial == 0) {
                    btn_free.text = StrVal.LYHAVEN.STR26
                    con_open.selectedIndex = 2
                }else{
                    con_open.selectedIndex = 0
                    let auto7dayData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.havenAuto7day)
                    UtilsUI.setButtonIcon(btn_7, VarVal.bonusType.chance, String(Number(auto7dayData.money) /100))
                    let auto30dayData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.havenAuto30day)
                    UtilsUI.setButtonIcon(btn_30, VarVal.bonusType.chance, String(Number(auto30dayData.money) /100))
                }
            }else{
                con_open.selectedIndex = 1
                if (havenData.isAutoCollectionActivated == 1) {
                    //正在自动
                    btn_start.visible = false
                    btn_stop.visible = true
                    btn_stop.text = StrVal.LYHAVEN.STR29
                }else{
                    btn_stop.visible = false
                    btn_start.visible = true
                    btn_start.text = StrVal.LYHAVEN.STR28
                }
                let serverTime = GameServerData.getInstance().getServerTime()
                label_time.text = UtilsTool.stringFormat(StrVal.LYHAVEN.STR57, [UtilsTool.parseTimeToString(havenData.autoCollectionTime - serverTime)]) 
                this.clearInterval(interval)
                interval = this.setInterval(()=>{
                    serverTime = GameServerData.getInstance().getServerTime()
                    if (havenData.autoCollectionTime != 0) {
                        label_time.text = UtilsTool.stringFormat(StrVal.LYHAVEN.STR57, [UtilsTool.parseTimeToString(havenData.autoCollectionTime - serverTime)]) 
                    }else{
                        label_time.text = ""
                    }
                    if (xufeiPage) {
                        let serverTime = GameServerData.getInstance().getServerTime()
                        xufeiPage.getChild("label_time", fgui.GLabel).text = UtilsTool.parseTimeToString(havenData.autoCollectionTime - serverTime);
                    }
                }, 1000);
            }

            
        }

        btn_stop.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenAuto, 0, null)
                    refreshPage()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"autoCollectionActivated", { isOpen: 0, setResource: null  });
        });


        let autoFun = (close?)=>{
            let data = []
            for (let index = 0; index < list_choose.numChildren; index++) {
               let child: fgui.GComponent = list_choose.getChildAt(index)
               let cbox_buff: fgui.GComboBox = child.getChild("cbox_buff")
               let btn_zuhe: fgui.GButton = child.getChild("btn_zuhe");
                if (btn_zuhe.selected) {
                    data.push({
                        itemLevel: Number(cbox_buff.value) ,
                        itemId: Number(haveItems[index].itemId) 
                    })
                }
            }
            if (data.length <= 0) {
                UtilsUI.showMsgTip(StrVal.LYHAVEN.STR51)
            }else {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        if (close) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenAuto, 0, null)
                        }
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                 } ,"autoCollectionActivated", { isOpen: 1, setResource: data  });
            }
        }

        btn_start.onClick(()=>{
            if (havenData.isAutoCollectionActivated == 0) {
                autoFun(true)
            }
        });
        
        btn_free.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    refreshPage()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
        } ,"activityAutoCollectionTrial", null);
        })
        
        let xufeiPage: fgui.GComponent = null
        let openXfPage: Function = ()=>{
            xufeiPage  = fgui.UIPackage.createObject("LyHaven", "group_xufei").asCom;
            let btn_close: fgui.GButton = xufeiPage.getChild("btn_close")
            btn_close.onClick(()=>{
                xufeiPage.dispose()
            })
            xufeiPage.getChild("btn_backMask", fgui.GButton).onClick(()=>{
                xufeiPage.dispose()
            });
            xufeiPage.getChild("btn_close", fgui.GButton).onClick(()=>{
                xufeiPage.dispose()
            });
            xufeiPage.getChild("label_title", fgui.GLabel).text = StrVal.LYHAVEN.STR46
            xufeiPage.getChild("n82", fgui.GLabel).text = StrVal.LYHAVEN.STR47
            xufeiPage.getChild("n85", fgui.GLabel).text = StrVal.LYHAVEN.STR48
            xufeiPage.getChild("n86", fgui.GLabel).text = StrVal.LYHAVEN.STR49
            xufeiPage.getChild("n87", fgui.GLabel).text = StrVal.LYHAVEN.STR50
            let label_time: fgui.GLabel = xufeiPage.getChild("label_time")
            let serverTime = GameServerData.getInstance().getServerTime()
            label_time.text = UtilsTool.parseTimeToString(havenData.autoCollectionTime - serverTime);
            let btn_7: fgui.GButton = xufeiPage.getChild("btn_six")
            let auto7dayData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.havenAuto7day)
            UtilsUI.setButtonIcon(btn_7, VarVal.bonusType.chance, String(Number(auto7dayData.money) /100))
            btn_7.onClick(()=>{
                UtilsUI.payRechargeItem((errmsg:string) => {
                    if (errmsg) {
                        UtilsUI.showMsgTip(errmsg);
                    }
                }, auto7dayData, VarVal.payType.others, VarVal.payOtherType.havenAuto7day);
            });

            let btn_30: fgui.GButton = xufeiPage.getChild("btn_30")
            let auto30dayData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.havenAuto30day)
            UtilsUI.setButtonIcon(btn_30, VarVal.bonusType.chance, String(Number(auto30dayData.money) /100))
            let label_huaxian = btn_30.getChild("n4", fgui.GLabel)
            label_huaxian.text = String(Math.floor(Number(auto30dayData.money)/100 * 1.5)) 
            btn_30.onClick(()=>{
                UtilsUI.payRechargeItem((errmsg:string) => {
                    if (errmsg) {
                        UtilsUI.showMsgTip(errmsg);
                    }
                }, auto30dayData, VarVal.payType.others, VarVal.payOtherType.havenAuto7day);
            });
            this.getUiPanel().addChild(xufeiPage)
            xufeiPage.setPosition(xufeiPage.x, xufeiPage.y + (fgui.GRoot.inst.height - 1334)/2)
        }

        btn_xf.onClick(()=>{
            openXfPage()
        });
        
        btn_7.onClick(()=>{
            if (havenData.autoCollectionTime == 0) {
                let payData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.havenAuto7day)
                UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
                }, payData, VarVal.payType.others, VarVal.payOtherType.havenAuto7day);
            }else {
                openXfPage()
            }
        });

        btn_30.onClick(()=>{
            if (havenData.autoCollectionTime == 0) {
                let payData = LocaleData.getPayItemByOtherType(VarVal.payOtherType.havenAuto30day)
                UtilsUI.payRechargeItem((errmsg:string) => {
                    if (errmsg) {
                        UtilsUI.showMsgTip(errmsg);
                    }
                }, payData, VarVal.payType.others, VarVal.payOtherType.havenAuto30day);
            }else {
                openXfPage()
            }
        });


        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == VarVal.ACTIVITY_ID.HAVEN) {
                havenData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN).data.activityHaven
                refreshPage()
            }
        }, "activityStateChanged");

        this.registerRequest((args) => {
            // 返还
            let rebate = UtilsUI.getRebateBonuseItems();
            if (rebate) {
                UtilsUI.showItemReward({rebateBonuseItems:rebate});
            }
        }, "payXyEventChanged");

        refreshPage()
    }

    public getIsViewMask(): boolean {
        return false;
    };
}


