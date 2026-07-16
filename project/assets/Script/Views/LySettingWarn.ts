//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
export class LySettingWarn extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LySetting";
        this.viewResI.pkgName = "LySetting";
        this.viewResI.comName = "LySettingWarn";
    }
    public onViewCreate(params): void {
        let uiPanel: fgui.GComponent = this.getUiPanel().getChild("group_main")
        UtilsUI.playCommonGroupAni(uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LySettingWarn, 0, null);
        })
        let btn_close1: fgui.GButton = this.getUiPanel().getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LySettingWarn, 0, null);
        })
    };



    public getIsViewMask(): boolean {
        return false;
    };

}