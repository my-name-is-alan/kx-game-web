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
import { RESPONSE_TYPE } from "../Kernel/HttpClient";
import { LocaleData } from "../Kernel/LocaleData";
import { VarVal } from "../Values/VarVal";
import { LyHavenFind } from "./LyHavenFind";
import { LyHaven } from "./LyHaven";

export class LyHavenRecord extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyHaven";
        this.viewResI.pkgName = "LyHaven";
        this.viewResI.comName = "LyHavenRecord";
    }
    
    private uiPanel: fgui.GComponent
    public onViewCreate(_params:any):void {
        let historyRecords = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN).data.activityHaven.historyRecords
        let selfPlayerId = GameServerData.getInstance().getPlayerFullInfo().base.guid
        this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenRecord, 0, null)
        });
        this.uiPanel = this.getUiPanel().getChild("main");
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        this.uiPanel.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenRecord, 0, null)
        });
        this.uiPanel.getChild("label_title", fgui.GLabel).text = StrVal.LYHAVEN.STR16
        let list_all: fgui.GList = this.uiPanel.getChild("list_all");
        list_all.itemRenderer = (index: number, child: fgui.GComponent)=>{
            let historyRecord = historyRecords[index]
            let img_me = child.getChild("img_me")
            let loader_icon = child.getChild("loader_icon", fgui.GLoader);
            let label_des = child.getChild("label_des", fgui.GLabel);
            let label_time = child.getChild("label_time", fgui.GLabel);
            let btn_go = child.getChild("btn_go", fgui.GButton);
            let label_name = child.getChild("label_name", fgui.GLabel)
            let simpleBase = historyRecord.playerInfo
            let charInfo = LocaleData.getCharShowResInfo(simpleBase.character, simpleBase.phase, simpleBase.appearance, simpleBase.avatar);
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            if (selfPlayerId == historyRecord.playerId) {
                btn_go.visible = false
                img_me.visible = true
                label_name.text = GameServerData.getInstance().getPlayerFullInfo().base.name
            }else{
                btn_go.visible = true
                img_me.visible = false
                label_name.text = simpleBase.name
                btn_go.clearClick()
                btn_go.text = StrVal.LYHAVEN.STR17
                btn_go.onClick(()=>{
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyHaven, 0, { otherHaven : args.getHavenResourceArr[0]})
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenRecord, 0, null)
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"getHavenResourceByPlayerId", { targetPlayerIdArr: [historyRecord.playerId] });
                });
            }
            let itemNmae = ""
            let resourceXml = LocaleData.getHavenItem(historyRecord.itemId);
            if (resourceXml.itemId.length > 0) {
                itemNmae = LocaleData.getItemProto(resourceXml.itemId).name;
            }
            label_des.text = UtilsTool.stringFormat(StrVal.LYHAVEN.STR20,[ itemNmae,resourceXml.level])
            label_time.text = UtilsTool.timeToAgo(historyRecord.time)
        }
        list_all.numItems = historyRecords.length
    }

    public getIsViewMask(): boolean {
        return false;
    };
}


