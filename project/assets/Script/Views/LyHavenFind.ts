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
import { RESPONSE_TYPE } from "../Kernel/HttpClient";
import { LocaleData } from "../Kernel/LocaleData";
import { VarVal } from "../Values/VarVal";
import { LyHaven } from "./LyHaven";

export class LyHavenFind extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyHaven";
        this.viewResI.pkgName = "LyHaven";
        this.viewResI.comName = "LyHavenFind";
    }
    public static isSkipPlayAni: boolean
    private selfHaven
    private nearbyHaven: Array<any> = []
    private peerHaven: Array<any> = []
    private intervalId: number

    private uiPanel: fgui.GComponent
    private group_nearby: fgui.GComponent
    private group_peer: fgui.GComponent
    private label_time: fgui.GLabel
    private btn_refresh: fgui.GButton
    public onViewCreate(_params:any):void {
        this.refrehHavenData(_params.data)
        this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenFind, 0, null)
        });
        this.uiPanel = this.getUiPanel().getChild("main")
        if (LyHavenFind.isSkipPlayAni) {
            LyHavenFind.isSkipPlayAni = false
        }else{
            UtilsUI.playCommonGroupAni(this.uiPanel, null)
        }
        
        this.uiPanel.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenFind, 0, null)
        });
        let group_dragCom = this.uiPanel.getChild("group_dragCom", fgui.GComponent)
        this.group_nearby = group_dragCom.getChild("group_nearby")
        this.group_nearby.getChild("name", fgui.GLabel).text = StrVal.LYHAVEN.STR14
        this.group_peer = group_dragCom.getChild("group_peer")
        this.group_peer.getChild("name", fgui.GLabel).text = StrVal.LYHAVEN.STR15

        this.label_time = this.uiPanel.getChild("label_time")
        this.btn_refresh  = this.uiPanel.getChild("btn_refresh", fgui.GButton)
        this.btn_refresh.text = StrVal.LYHAVEN.STR13
        this.btn_refresh.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.nearbyHaven = []
                    this.nearbyHaven = args.getHavenResourceArr
                    this.selfHaven = args.activityHaven
                    this.refrehUI();
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"refreshHavenRandomPlayers", null);
        });
        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == VarVal.ACTIVITY_ID.HAVEN) {
                let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN)
                this.selfHaven = activityState.data.activityHaven
                this.refrehUI();
            }
        }, "activityStateChanged");
        this.refrehUI()
    }

    private refrehUI(){
        //刷新倒计时
        let serverTime = GameServerData.getInstance().getServerTime()
        if (serverTime > this.selfHaven.randomPlayersRefreshTime) {
            this.label_time.visible = false
            this.clearInterval(this.intervalId);
            this.btn_refresh.enabled = true
        }else{
            this.label_time.visible = true
            this.intervalId = this.setInterval(()=>{
                serverTime = GameServerData.getInstance().getServerTime()
                this.label_time.text = UtilsTool.parseTimeToString(this.selfHaven.randomPlayersRefreshTime - serverTime);
                if (this.selfHaven.randomPlayersRefreshTime - serverTime == 0) {
                    this.btn_refresh.enabled = true
                    this.label_time.visible = false
                }
            }, 1000)
            this.btn_refresh.enabled = false
        }

        if (this.peerHaven.length > 0) {
            this.group_peer.visible = true
            let list_pree: fgui.GList = this.group_peer.getChild("list_pree")
            let mGCom :fgui.GComponent = fgui.UIPackage.createObject("LyHaven", "group_otherItem").asCom;
            let height = mGCom.height * this.peerHaven.length + (list_pree.lineGap *  this.peerHaven.length - 1);
            mGCom.dispose()
            list_pree.height = height
            this.group_peer.height = height + list_pree.y
            list_pree.itemRenderer = (index: number, child: fgui.GComponent)=>{
                let havenRes = this.peerHaven[index].havenResource;
                let loader_tx: fgui.GLoader = child.getChild("loader_tx");
                let label_name: fgui.GLabel = child.getChild("label_name");
                let simpleBase = this.peerHaven[index].playerInfo
                let charInfo = LocaleData.getCharShowResInfo(simpleBase.character, simpleBase.phase, simpleBase.appearance, simpleBase.avatar);
                loader_tx.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
                label_name.text = simpleBase.name
                let isMeCon = false //采集中
                for (let index = 0; index < 6; index++) {
                    let item:fgui.GComponent = child.getChild("item" + index)
                    let posHavenData = null
                    for (let index2 = 0; index2 < havenRes.length; index2++) {
                        let element = havenRes[index2];
                        if (element.id == index + 1) {
                            posHavenData = element
                            break
                        }
                    }
                    let bonuseItem : BonuseItem;
                    if (posHavenData.itemId != 0) {
                        item.visible = true
                        let resourceXml = LocaleData.getHavenItem(posHavenData.itemId);
                        if (resourceXml.itemId.length > 1) {
                            bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, resourceXml.itemId, UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [resourceXml.level]))
                        }else if(resourceXml.itemId.length > 0) {
                            bonuseItem = UtilsUI.getBonuseItem(resourceXml.itemId, null, null, UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [resourceXml.level]))
                        }
                        UtilsUI.setUIGroupItem(bonuseItem, item, null);
                    }else {
                        item.visible = false
                    }
                    if (posHavenData.attacker.playerId == GameServerData.getInstance().getPlayerFullInfo().base.guid) {
                        isMeCon = true
                    }
                }
                child.getChild("isCj").visible = isMeCon
                let btn_go: fgui.GButton = child.getChild("btn_go");
                btn_go.text = StrVal.LYHAVEN.STR17;
                btn_go.clearClick()
                btn_go.onClick(()=>{
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyHaven, 0, {otherHaven : this.peerHaven[index]})
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenFind, 0, null)
                });
                
            }
            list_pree.numItems = 0
            list_pree.numItems = this.peerHaven.length
        }else{
            this.group_peer.visible = false
        }
        
        let list_allItem: fgui.GList = this.group_nearby.getChild("list_allItem")
        list_allItem.itemRenderer = (index: number, child: fgui.GComponent)=>{
            let havenRes = this.nearbyHaven[index].havenResource;
            let loader_tx: fgui.GLoader = child.getChild("loader_tx");
            let label_name: fgui.GLabel = child.getChild("label_name");
            let simpleBase = this.nearbyHaven[index].playerInfo
            let charInfo = LocaleData.getCharShowResInfo(simpleBase.character, simpleBase.phase, simpleBase.appearance, simpleBase.avatar);
            loader_tx.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            label_name.text = simpleBase.name
            let isMeCon = false //采集中
            for (let index = 0; index < 6; index++) {
                let item:fgui.GComponent = child.getChild("item" + index)
                let posHavenData = null
                for (let index2 = 0; index2 < havenRes.length; index2++) {
                    let element = havenRes[index2];
                    if (element.id == index + 1) {
                        posHavenData = element
                        break
                    }
                }
                let bonuseItem : BonuseItem;
                if (posHavenData.itemId != 0) {
                    item.visible = true
                    let resourceXml = LocaleData.getHavenItem(posHavenData.itemId);
                    if (resourceXml.itemId.length > 1) {
                        bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, resourceXml.itemId, UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [resourceXml.level]))
                    }else if(resourceXml.itemId.length > 0) {
                        bonuseItem = UtilsUI.getBonuseItem(resourceXml.itemId, null, null, UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [resourceXml.level]))
                    }
                    UtilsUI.setUIGroupItem(bonuseItem, item, null);
                }else {
                    item.visible = false
                }
                if (posHavenData.attacker.playerId == GameServerData.getInstance().getPlayerFullInfo().base.guid) {
                    isMeCon = true
                }
            }
            child.getChild("isCj").visible = isMeCon
            let btn_go: fgui.GButton = child.getChild("btn_go");
            btn_go.text = StrVal.LYHAVEN.STR17;
            btn_go.clearClick()
            btn_go.onClick(()=>{
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyHaven, 0, {otherHaven : this.nearbyHaven[index]})
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenFind, 0, null)
            });
            
        }
        list_allItem.numItems = 0
        list_allItem.numItems = this.nearbyHaven.length
    }

    private refrehHavenData(data){
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN)
        this.selfHaven = activityState.data.activityHaven
        this.nearbyHaven = []
        this.peerHaven = []
        for (let index = 0; index < data.length; index++) {
            if (index < 3) {
                this.nearbyHaven.push(data[index])
            }else{
                this.peerHaven.push(data[index])
            }
        }
    }

    public getIsViewMask(): boolean {
        return false;
    };
}


