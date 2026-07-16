//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { Color, HorizontalTextAlignment, Overflow, VerticalTextAlignment } from "cc";
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
import { LyClan } from "./LyClan";
import { LyClanFlag } from "./LyClanFlag";
import { LyClanJoin } from "./LyClanJoin";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanFound extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanFound";
    }
    private flag: number = 0
    private img_flag: fgui.GLoader
    private flagArr: any
    private uiPanel: fgui.GComponent
    public onViewCreate(): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanFound, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanFound, 0, null);
        })
        this.uiPanel.getChild("label_bxl", fgui.GLabel).text = StrVal.LYCLAN.STR68
        this.uiPanel.getChild("label_str87", fgui.GLabel).text = StrVal.LYCLAN.STR87
        this.uiPanel.getChild("label_str88", fgui.GLabel).text = StrVal.LYCLAN.STR88
        this.uiPanel.getChild("label_str89", fgui.GLabel).text = StrVal.LYCLAN.STR89
        let btn_clan: fgui.GButton = this.uiPanel.getChild("btn_clan")
        btn_clan.text = StrVal.LYCLAN.STR68
        btn_clan.onClick(() => {
            if (label_name.text == "") {
                UtilsUI.showMsgTip(StrVal.LYCLAN.STR92);
                return
            }
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanJoin, 0, null);
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanFound, 0, null);
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClan, 0, null);
                    UtilsUI.showMsgTip(StrVal.LYCLAN.STR130);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "createClan", {
                name: label_name.text,
                flag: this.flagArr[this.flag].id,
                needApply: btn_needApply.selected ? 0 : 1,
                notice: label_notice.text,
                declaration: label_declaration.text
            });
        })
        let btn_clanFlag: fgui.GButton = this.uiPanel.getChild("btn_clanFlag")
        btn_clanFlag.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanFlag, 0, null);
        })
        let label_name: fgui.GTextInput = this.uiPanel.getChild("label_name")
        label_name.promptText = StrVal.LYCLAN.STR149
        UtilsUI.setGTextInputAlign(label_name, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.CLAMP);
        let label_declaration: fgui.GTextInput = this.uiPanel.getChild("label_declaration")
        label_declaration.text = StrVal.LYCLAN.STR134
        UtilsUI.setGTextInputAlign(label_declaration, HorizontalTextAlignment.LEFT, VerticalTextAlignment.TOP, Overflow.CLAMP);
        let label_notice: fgui.GTextInput = this.uiPanel.getChild("label_notice")
        label_notice.text = StrVal.LYCLAN.STR135
        UtilsUI.setGTextInputAlign(label_notice, HorizontalTextAlignment.LEFT, VerticalTextAlignment.TOP, Overflow.CLAMP);
        let btn_needApply: fgui.GButton = this.uiPanel.getChild("btn_needApply")
        btn_needApply.text = StrVal.LYCLAN.STR90
        let label_stone: fgui.GTextField = this.uiPanel.getChild("group_stone", fgui.GComponent).getChild("label_stone")
        label_stone.text = GameServerData.getInstance().getPlayerFullInfo().base.stone + "/" + LocaleData.getClanRoot().createClanStone
        label_stone.color = UtilsUI.getEnoughColor(GameServerData.getInstance().getPlayerFullInfo().base.stone >= Number(LocaleData.getClanRoot().createClanStone))
        this.flagArr = LocaleData.getClanFlag()
        this.img_flag = this.uiPanel.getChild("img_flag")
        this.img_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [this.flagArr[this.flag].icon]);
        this.img_flag.clearClick()
        this.img_flag.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanFlag, 0, null);
        })
    };

    public onViewUpdate(params: any): void {
        this.flag = params.flag
        this.img_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [this.flagArr[this.flag].icon]);
    }


    public getIsViewMask(): boolean {
        return false;
    };

}