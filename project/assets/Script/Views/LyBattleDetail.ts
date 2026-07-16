//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";

export class LyBattleDetail extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyBattleMain;
        this.viewResI.pkgName = "LyBattleMain";
        this.viewResI.comName = "LyBattleDetail";
    }

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();

        let btn_close:fgui.GButton = uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBattleDetail, 0, null);
        })

        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        let group_content:fgui.GButton = group_main.getChild("group_content");
        let label_text:fgui.GButton = group_content.getChild("label_text");
        label_text.text = params.detail;
    }

    public getIsViewMask():boolean {
        return false;
    }
}