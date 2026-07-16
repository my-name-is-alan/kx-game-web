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

export class LyClanTitle extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanTitle";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanTitle, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanTitle, 0, null);
        })
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanInfo = playerClanInfo.clanInfo
        let label_highestPhase: fgui.GLabel = this.uiPanel.getChild("label_highestPhase")
        let img_highestPhase: fgui.GLoader = this.uiPanel.getChild("img_highestPhase")
        let higheClanPhase = LocaleData.getClanPhaseById(clanInfo.highestPhase == 0 ? 1 : clanInfo.highestPhase)
        label_highestPhase.text = higheClanPhase.name
        img_highestPhase.url = UtilsTool.stringFormat("ui://CCommon/{0}", [higheClanPhase.icon])
        this.uiPanel.getChild("label_bxl").text = StrVal.LYCLAN.STR133
        let group_titleDec: fgui.GComponent = this.uiPanel.getChild("group_titleDec")
        let clanPhase = LocaleData.getClanPhaseById("")

        for (let i = 0; i < clanPhase.length; i++) {
            let item: fgui.GComponent = group_titleDec.getChild("group_phase" + i)
            let img_icon: fgui.GLoader = item.getChild("img_icon")
            let label_title: fgui.GLabel = item.getChild("label_title")
            img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [clanPhase[i].icon])
            label_title.text = clanPhase[i].name
        }
        let clanRootXml = LocaleData.getClanRoot()
       console.log(clanRootXml.danDesc);
        
        let label_dec: fgui.GLabel = group_titleDec.getChild("label_dec")
        label_dec.text = clanRootXml.danDesc
    };




    public getIsViewMask(): boolean {
        return false;
    };

}