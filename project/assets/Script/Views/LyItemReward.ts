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
import { StrVal } from "../Values/StrVal";
import { LocaleUser } from "../Kernel/LocaleUser";
import { Vec2 } from "cc";
import { LyMainPage } from "./LyMainPage";

interface AllInSet {
    bonuseItem:BonuseItem,
    url:string,
}

export class LyItemReward extends ViewLayer {

    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyItemReward;
        this.viewResI.pkgName = "LyItemReward";
        this.viewResI.comName = "LyItemReward";
    }

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_GETITEM);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        let group_rebate:fgui.GComponent = group_main.getChild("group_rebate");
        UtilsUI.playCommonGroupAni(group_main);

        // tween动画
        UtilsUI.playCommonResultAni(group_main.getChild("back_win"), () => {
            group_main.getChild("group_outani").visible = true;
        });

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation("stand_gxhd", true);
            group_main.getChild("title_win").visible = false;
        }, group_main.getChild("loader_spine", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_result);
        new SpinePlayer().loadSpine(null, group_main.getChild("loader_spine2", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_result2);

        let dropChance:string;

        let bonuseItems:Array<BonuseItem>;
        if (params.bonuseItems) {
            bonuseItems = params.bonuseItems;
        } else {
            bonuseItems = UtilsUI.getBonuseItemsByString(params.bonuseString);
        }
        let allInSet:Array<AllInSet> = new Array<AllInSet>();
        for (let i = 0; i < bonuseItems.length; i++) {
            allInSet.push({
                bonuseItem:bonuseItems[i],
                url:undefined,
            });
        }
        if (params.bonuseStringCompanion) {
            let companion = UtilsUI.getBonuseItemsByString(params.bonuseStringCompanion);
            for (let i = 0; i < companion.length; i++) {
                allInSet.push({
                    bonuseItem:companion[i],
                    url:"ui://CCommon/frame_shouyouyyy",
                });
            }
        }
        if (params.bonuseStringPalace) {
            let palace = UtilsUI.getBonuseItemsByString(params.bonuseStringPalace);
            for (let i = 0; i < palace.length; i++) {
                allInSet.push({
                    bonuseItem:palace[i],
                    url:"ui://CCommon/frame_tiandao2",
                });
            }
        }
        if (params.rebateBonuseItems) {
            let chanceCount:string;
            let items:BonuseItem[] = params.rebateBonuseItems;
            for (let i = 0; i < items.length; i++) {
                allInSet.push({
                    bonuseItem:items[i],
                    url:"ui://CCommon/frame_fanli",
                });
                if (items[i].type == VarVal.bonusType.chance) {
                    chanceCount = items[i].count;
                }
            }

            // 返利
            if (chanceCount) {
                dropChance = VarVal.bonusType.chance;
                this.setTimeout(() => {
                    group_rebate.visible = true;
                    UtilsUI.playCommonGroupAni(group_rebate);
                }, 500)
                
                new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                    group_rebate.getChild("img_back").visible = false;
                }, group_rebate.getChild("loader_spine_back", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_fanli);

                new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                    //spp.playAnimation("stand", true, null, null, () => {});
                }, group_rebate.getChild("loader_spine_light", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_fanli_light);

                let label_chance:fgui.GTextField = group_rebate.getChild("label_chance");
                label_chance.text = chanceCount;

                let CHANCE_REBATE = LocaleUser.getUser(VarVal.FIELD_SV.CHANCE_REBATE);
                let rebateCount = CHANCE_REBATE ? Number(CHANCE_REBATE) : 0;
                if (Number(rebateCount) < 20) {
                    LocaleUser.setUser(VarVal.FIELD_SV.CHANCE_REBATE, String(rebateCount + 1));
                    LocaleUser.flush();

                    let label_tips:fgui.GTextField = group_rebate.getChild("label_tips");
                    label_tips.text = StrVal.LYTREEREBATE.STR3;
                }
            }
        }

        // 列表
        let list_item01:fgui.GList = group_main.getChild("list_item");
        let list_item10:fgui.GList = group_main.getChild("list_item10");
        let list_item:fgui.GList;
        if (allInSet.length > 10) {
            list_item01.visible = false;
            list_item10.visible = true;
            list_item = list_item10;
        } else {
            list_item01.visible = true;
            list_item10.visible = false;
            list_item = list_item01;
        }
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            child.getChild("label_name", fgui.GTextField).text = allInSet[index].bonuseItem.name;
            let group_item = child.getChild("group_item", fgui.GComponent);
            UtilsUI.setUIGroupItem(allInSet[index].bonuseItem, group_item, null);
            if (allInSet[index].url) {
                let loader_superscript = group_item.getChild("loader_superscript", fgui.GLoader);
                loader_superscript.url = allInSet[index].url;
            }
        }
        UtilsUI.setFguiGlistDelayNumItems(list_item, allInSet.length);

        uiPanel.getChild("btn_back").onClick(() => {
            if (params.doneCall) {
                params.doneCall();
            }
            if (dropChance) {
                let iconUrl:string;
                let dropEndPos:Vec2;
                let viewLayer = ViewDispatcher.isViewExist(LyMainPage);
                if (viewLayer) {
                    let list_activity = viewLayer.getUiPanel().getChild("list_activity", fgui.GList);
                    if (list_activity.numItems > 0) {
                        let child:fgui.GButton = list_activity.getChildAt(list_activity.itemIndexToChildIndex(0));
                        if (child) {
                            iconUrl = child.icon;
                            dropEndPos = child.localToGlobal(child.width / 2, child.height / 2);
                        }
                    }
                }
                UtilsUI.showDropItems({
                    protoId:dropChance,
                    dropUrl:iconUrl,
                    dropCount:5,
                    dropEndPos:dropEndPos
                });
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyItemReward, this.getViewUuid(), null);
        })
    }

    public getIsViewMask():boolean {
        return false;
    }
}