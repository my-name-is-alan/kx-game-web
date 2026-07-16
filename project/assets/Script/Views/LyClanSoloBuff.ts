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
import { LyClanSoloMain } from "./LyClanSoloMain";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanSoloBuff extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClanSolo";
        this.viewResI.pkgName = "LyClanSolo";
        this.viewResI.comName = "LyClanSoloBuff";
    }
    private uiPanel: fgui.GComponent
    private fullInfo: any
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        // let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        // btn_close.onClick(() => {
        //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloBuff, 0, null);
        // })
        // let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        // btn_close1.onClick(() => {
        //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloBuff, 0, null);
        // })
        this.uiPanel.getChild("label_dec", fgui.GLabel).text = StrVal.LYCLANSOLO.STR37
        this.uiPanel.getChild("label_title", fgui.GLabel).text = StrVal.LYCLANSOLO.STR38
        this.uiPanel.getChild("label_str39", fgui.GLabel).text = StrVal.LYCLANSOLO.STR39
        this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()

        let label_attr1: fgui.GLabel = this.uiPanel.getChild("label_attr1")
        let label_money1: fgui.GTextField = this.uiPanel.getChild("label_money1")
        let btn_buy1: fgui.GButton = this.uiPanel.getChild("btn_buy1")
        this.onAttrs(label_attr1, label_money1, btn_buy1, 0)

        let label_attr2: fgui.GLabel = this.uiPanel.getChild("label_attr2")
        let label_money2: fgui.GTextField = this.uiPanel.getChild("label_money2")
        let btn_buy2: fgui.GButton = this.uiPanel.getChild("btn_buy2")
        this.onAttrs(label_attr2, label_money2, btn_buy2, 1)

        let label_attr3: fgui.GLabel = this.uiPanel.getChild("label_attr3")
        let label_money3: fgui.GTextField = this.uiPanel.getChild("label_money3")
        let btn_buy3: fgui.GButton = this.uiPanel.getChild("btn_buy3")
        this.onAttrs(label_attr3, label_money3, btn_buy3, 2)
    };


    private onAttrs(label_attr: fgui.GLabel, label_money: fgui.GTextField, btn_buy: fgui.GButton, buffIndex: number): void {
        let clanSoloBuff: any = LocaleData.getClanSoloBuff("")[buffIndex]
        label_attr.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR41, [clanSoloBuff.value])
        label_money.text = clanSoloBuff.cost == "0" ? StrVal.LYCLANSOLO.STR40 : UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR48, [clanSoloBuff.cost, this.fullInfo.base.stone])
        label_money.color = UtilsUI.getEnoughColor(this.fullInfo.base.stone >= clanSoloBuff.cost);
        btn_buy.text = StrVal.LYCLANSOLO.STR42
        btn_buy.clearClick()
        btn_buy.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClanSoloMain, 0, null);
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloBuff, 0, null);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "clanSoloBuyBuff", {
                buffId: clanSoloBuff.id
            })
        })
    }

    public getIsViewMask(): boolean {
        return false;
    };

}