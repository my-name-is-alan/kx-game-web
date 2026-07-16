//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { VarVal } from "../Values/VarVal";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { SpinePlayer } from "../Kernel/SpinePlayer";

export class LyPalaceBuffStart extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPalace;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyPalace;
        this.viewResI.comName = "LyPalaceBuffStart";
    }

    private coldCD:number;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation("Stand", true);
            group_main.getChild("img_back").visible = false;
        }, group_main.getChild("loader_spine"), VarVal.UI_EFF_NAME.spine_langyabangdianzan);

        this.coldCD = 0.5;

        // 关闭
        let btn_back = uiPanel.getChild("btn_back", fgui.GButton);
        btn_back.onClick(() => {
            if (this.coldCD <= 0) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPalaceBuffStart, 0, null);
            }
        })

        let buffItem = LocaleData.getPalaceBuffItem(params.buffId);
        // icon
        let loader_name = group_main.getChild("loader_name", fgui.GLoader);
        loader_name.url = UtilsTool.stringFormat("ui://LyPalace/{0}", [buffItem.icon]);
        // 描述
        let label_title = group_main.getChild("label_title", fgui.GTextField);
        label_title.text = buffItem.desc;
        // 剩余
        let label_desc = group_main.getChild("label_desc", fgui.GTextField);
        label_desc.text = UtilsTool.stringFormat(StrVal.LYPALACE.STR3, [buffItem.limit, buffItem.limit]);

        // 空白
        let label_tips = group_main.getChild("label_tips", fgui.GTextField);
        label_tips.text = StrVal.COMMON.STR9;

        this.setTimeout(() => {
            this.coldCD = 0;
        }, this.coldCD)
    }

    public getIsViewMask(): boolean {
        return false;
    }
}