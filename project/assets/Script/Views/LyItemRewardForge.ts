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
import { StrVal } from "../Values/StrVal";

export class LyItemRewardForge extends ViewLayer {

    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyItemReward;
        this.viewResI.pkgName = "LyItemReward";
        this.viewResI.comName = "LyItemRewardForge";
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
        UtilsUI.playCommonResultAni(group_main.getChild("back_win"), () => {
            group_main.getChild("group_outani").visible = true;
        });

        // new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        //     spp.playAnimation("stand_gxhd", true);
        //     group_main.getChild("title_win", fgui.GImage).visible = false;
        // }, group_main.getChild("loader_spine", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_result);
        new SpinePlayer().loadSpine(null, group_main.getChild("loader_spine2", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_result2);

        let bonuseItems: Array<BonuseItem>;
        if (params.bonuseItems) {
            bonuseItems = params.bonuseItems;
        } else {
            bonuseItems = UtilsUI.getBonuseItemsByString(params.bonuseString);
        }

        // 列表
        let list_item: fgui.GList = group_main.getChild("list_item");
        list_item.itemRenderer = (index: number, child: fgui.GComponent) => {
            child.getChild("label_name", fgui.GTextField).text = bonuseItems[index].name;
            UtilsUI.setUIGroupItem(bonuseItems[index], child.getChild("group_item", fgui.GComponent), null);
        }
        list_item.numItems = bonuseItems.length;

        let btn_back:fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_DESTROY, LyItemRewardForge, 0, null);
        })

        let label_str14: fgui.GButton = group_main.getChild("label_str14");
        label_str14.text = StrVal.LYMAINPAGE.STR14
        let label_time: fgui.GButton = group_main.getChild("label_time");
        let time: number = 4
        let timeCall = () => {
            time--
            label_time.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR13, [time])
            if (time <= 0) {
                btn_back.fireClick();
            }
        }
        this.setInterval(timeCall, 1000);
        timeCall();
    }

    public getIsViewMask(): boolean {
        return false;
    }
}