//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { AudioManager } from "../Kernel/AudioManager";
import { VarVal } from "../Values/VarVal";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { LocaleData } from "../Kernel/LocaleData";

export class LyItemRewardCityLose extends ViewLayer {

    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyItemReward;
        this.viewResI.pkgName = "LyItemReward";
        this.viewResI.comName = "LyItemRewardCityLose";
    }

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params: any): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_GETITEM);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);
        // tween动画
        // UtilsUI.playCommonResultAni(group_main.getChild("back_win"), () => {
        //     group_main.getChild("group_outani").visible = true;
        // });
        // new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        //     
        //     group_main.getChild("title_win", fgui.GImage).visible = false;
        // }, group_main.getChild("loader_spine", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_result);
        new SpinePlayer().loadSpine((spp: SpinePlayer)=>{
            spp.playAnimation("stand", true);
        }, group_main.getChild("loader_spine2", fgui.GLoader3D), "jm_jiesuan_gonyong");
        uiPanel.getChild("btn_back").onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyItemRewardCityLose, this.getViewUuid(), null);
        })
        let label_desc1: fgui.GLabel = group_main .getChild("label_desc1")
        let label_desc2: fgui.GLabel = group_main .getChild("label_desc2")
        label_desc1.text = params.tip
        label_desc2.text = params.tip1
    }

    public getIsViewMask(): boolean {
        return false;
    }
}