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

export class LyItemRewardExplore extends ViewLayer {

    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyItemReward;
        this.viewResI.pkgName = "LyItemReward";
        this.viewResI.comName = "LyItemRewardExplore";
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
        let bonuseItems;
        if (params.bonuseItems) {
            bonuseItems = params.bonuseItems;
        } else {
            bonuseItems = UtilsUI.getBonuseItemsByString(params.bonuseString);
        }
        let encounterCompanion: any = params.encounterCompanion
        for (let i = 0; i < encounterCompanion.length; i++) {
            bonuseItems.push(encounterCompanion[i])
        }
        // 列表
        let list_item: fgui.GList = group_main.getChild("list_item");
        list_item.itemRenderer = (index: number, child: fgui.GComponent) => {
            let group_explore: fgui.GGraph = child.getChild("group_explore")
            let group_bonuse: fgui.GGraph = child.getChild("group_bonuse")
            if (bonuseItems[index].desc) {
                group_explore.visible = false
                group_bonuse.visible = true
                child.getChild("label_name", fgui.GTextField).text = bonuseItems[index].name;
                UtilsUI.setUIGroupItem(bonuseItems[index], child.getChild("group_item", fgui.GComponent), null);
            } else {
                group_explore.visible = true
                group_bonuse.visible = false
                child.getChild("label_liking", fgui.GTextField).text = "+" + bonuseItems[index].liking
                let companionItem: any = LocaleData.getCompanionById(bonuseItems[index].companionId)
                let models = LocaleData.getModelItem(companionItem.modelId)
                child.getChild("img_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}", [models.avatar2]);
            }
        }
        list_item.numItems = bonuseItems.length;
        uiPanel.getChild("btn_back").onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyItemRewardExplore, this.getViewUuid(), null);
        })
        let label_dec: fgui.GLabel = group_main .getChild("label_dec")
        label_dec.text = params.tip
    }

    public getIsViewMask(): boolean {
        return false;
    }
}