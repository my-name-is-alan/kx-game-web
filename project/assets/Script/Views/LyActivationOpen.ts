//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewLayer } from "../Kernel/ViewLayer";
import { GuideManager } from "../Kernel/GuideManager";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { UtilsTool } from "../Kernel/UtilsTool";

export class LyActivationOpen extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyMainPage";
        this.viewResI.pkgName = "LyMainPage";
        this.viewResI.comName = "LyActivationOpen";
    }

    public onViewCreate(params: any): void {
        let group_main: fgui.GComponent = this.getUiPanel().getChild("group_activationOpen")
        UtilsUI.playCommonGroupAni(group_main, null)

        let openSysItem = params.openSysItem;

        let btn_close = this.getUiPanel().getChild("btn_close")
        btn_close.onClick(() => {
            if (openSysItem.desc.length > 1 || openSysItem.guideId.length > 0) {
                GuideManager.startGuide({
                    isForce: true,
                    openSysId: openSysItem.id,
                    guideDetail: openSysItem.desc,
                    guideType: openSysItem.guideId,
                });
            }
            // 如果未在引导管理器中删除，这里删除一次。
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivationOpen, 0, null)
        })
        let img_icon: fgui.GLoader = group_main.getChild("img_icon")
        let img_title: fgui.GLoader = group_main.getChild("img_title")
        let label_dec: fgui.GLabel = group_main.getChild("label_dec")
        img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}",[params.openSysItem.icon])
        img_title.url = UtilsTool.stringFormat("ui://CCommon/word_{0}",[params.openSysItem.id])
        label_dec.text = params.openSysItem.info
    }

    public getIsViewMask(): boolean {
        return false;
    }
}