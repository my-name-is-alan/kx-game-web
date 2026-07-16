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
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanLog extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanLog";
    }
    private group_clanLog: fgui.GComponent
    public onViewCreate(params): void {
        let type: number = params.type
        let uiPanel: fgui.GComponent = this.getUiPanel()
        // 关闭
        let btn_close: fgui.GButton = uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanLog, 0, null);
        })
        this.group_clanLog = uiPanel.getChild("group_clanLog")
        UtilsUI.playCommonGroupAni(this.group_clanLog, null)
        let btn_close1: fgui.GButton = this.group_clanLog.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanLog, 0, null);
        })
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanInfo = playerClanInfo.clanInfo
        let clanLog = playerClanInfo.clanLog
        let clanLogType: any = []
        for (let i = 0; i < clanLog.length; i++) {
            let element = clanLog[i];
            if (element.type == type) {
                clanLogType.push(element)
            }
        }

        // UtilsTool.TimeToDateStr( GameServerData.getInstance().getServerTime())
        if (clanLogType.length > 0) {

            let allLog = []
            clanLogType.sort((a, b) => {
                return b.createTime - a.createTime
            })
            let strItem = UtilsTool.TimeToDateStr(clanLogType[0].createTime)
            let itemArr = []
            for (let i = 0; i < clanLogType.length; i++) {
                let item = clanLogType[i];
                if (strItem == UtilsTool.TimeToDateStr(item.createTime)) {
                    itemArr.push(item)
                } else {
                    strItem = UtilsTool.TimeToDateStr(item.createTime)
                    allLog.push(itemArr)
                    itemArr = []
                    itemArr.push(item)
                }
                if (i == clanLogType.length - 1) {
                    allLog.push(itemArr)
                }
            }

            let label_str58: fgui.GLabel = this.group_clanLog.getChild("label_str58");
            label_str58.text = StrVal.LYCLAN.STR58
            let label_str57: fgui.GLabel = this.group_clanLog.getChild("label_str57");
            label_str57.text = StrVal.LYCLAN.STR57
            let list_log: fgui.GList = this.group_clanLog.getChild("list_log")
            list_log.setVirtual();
            list_log.itemRenderer = ((index: number, obj: fgui.GButton) => {
                obj.getChild("label_createTime").text = UtilsTool.TimeToDateStr(allLog[index][0].createTime)
                let list_itemLog: fgui.GList = obj.getChild("list_itemLog")
                let logItem = allLog[index]
                list_itemLog.itemRenderer = ((index1: number, obj1: fgui.GButton) => {
                    let label_log: fgui.GLabel = obj1.getChild("label_log")
                    let time = UtilsTool.TimeToStr(logItem[index1].createTime, "-").split(" ")[1].split(":")
                    label_log.text = time[0] + ":" + time[1] + "  " + logItem[index1].log
                }).bind(this)
                list_itemLog.height = logItem.length * 80
                list_itemLog.numItems = logItem.length
            }).bind(this)
            list_log.numItems = allLog.length

        }

    };




    public getIsViewMask(): boolean {
        return false;
    };

}
