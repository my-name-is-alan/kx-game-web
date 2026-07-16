//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { VarVal } from "../Values/VarVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { StrVal } from "../Values/StrVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";

export class LyGoldFingerSucc extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyItemReward;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyItemReward;
        this.viewResI.comName = "LyGoldFingerSucc";
    }

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            if (params && params.doneCall) {
                params.doneCall();
            }
            ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_DESTROY, LyGoldFingerSucc, 0, null);
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGoldFingerSucc, 0, null);
        })

        let goldItem = params.goldItem;

        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        }, group_main.getChild("loader_spine_main", fgui.GLoader3D), goldItem.spineName);

        let loader_name = group_main.getChild("loader_name", fgui.GLoader);
        loader_name.url = UtilsTool.stringFormat("ui://LyGoldFinger/{0}", [goldItem.iconName]);

        let label_tips = group_main.getChild("label_tips", fgui.GTextField);
        label_tips.text = StrVal.COMMON.STR9;
    }

    public getIsViewMask():boolean {
        return false;
    }
}