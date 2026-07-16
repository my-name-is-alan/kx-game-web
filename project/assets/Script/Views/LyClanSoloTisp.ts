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
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanSoloTisp extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClanSolo";
        this.viewResI.pkgName = "LyClanSolo";
        this.viewResI.comName = "LyClanSoloTisp";
    }
    private uiPanel: fgui.GComponent
    private tispType: number
    public onViewCreate(params): void {
        this.tispType = params.type

        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloTisp, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloTisp, 0, null);
        })

        let group_1: fgui.GGroup = this.uiPanel.getChild("group_1")
        let group_2: fgui.GGroup = this.uiPanel.getChild("group_2")
        if (this.tispType == 1) {
            group_1.visible = true
            this.uiPanel.getChild("label_str83", fgui.GLabel).text = StrVal.LYCLANSOLO.STR83
            this.uiPanel.getChild("label_str84", fgui.GLabel).text = StrVal.LYCLANSOLO.STR84
            this.uiPanel.getChild("label_str85", fgui.GLabel).text = StrVal.LYCLANSOLO.STR85
            this.uiPanel.getChild("label_str86", fgui.GLabel).text = StrVal.LYCLANSOLO.STR86

            let btn_battle: fgui.GButton = this.uiPanel.getChild("btn_battle")
            btn_battle.text = StrVal.LYCLANSOLO.STR87
            btn_battle.clearClick()
            btn_battle.onClick(() => {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloTisp, 0, null);
                params.call()
            })

        } else if (this.tispType == 2) {
            let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
            let clanSoloPlayer: any = fullInfo.clanSoloPlayer
            let clanSoloInfo: any = clanSoloPlayer.clanSoloInfo

            group_2.visible = true
            let label_clanSoloTime: fgui.GLabel = this.uiPanel.getChild("label_clanSoloTime")
            label_clanSoloTime.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR77, [UtilsTool.TimeToStr(clanSoloInfo.startTime, "-") + "~" + UtilsTool.TimeToStr(clanSoloInfo.endTime, "-")])
            let label_servers: fgui.GLabel = this.uiPanel.getChild("label_servers")
            label_servers.text = StrVal.LYCLANSOLO.STR31
            let label_dec: fgui.GLabel = this.uiPanel.getChild("group_servers", fgui.GComponent).getChild("label_dec")
            let serversStr: string = ""
            for (let i = 0; i < clanSoloInfo.servers.length; i++) {
                const element = clanSoloInfo.servers[i];
                let serverItem = PlatformAPI.getGameServerItem(element);
                if (serverItem) {
                    serversStr += serverItem.name + "\n"
                }
            }
            label_dec.text = serversStr
            let label_str30: fgui.GLabel = this.uiPanel.getChild("label_str30")
            label_str30.text = StrVal.LYCLANSOLO.STR30
            label_str30.visible = clanSoloInfo.state != 4
        }
    };

    public getIsViewMask(): boolean {
        return false;
    };

}