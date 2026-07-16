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
import { LocaleData } from "../Kernel/LocaleData";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { StrVal } from "../Values/StrVal";
import { UtilsTool } from "../Kernel/UtilsTool";

export class LyActivityInvasionReward extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyActivityInvasion;
        this.viewResI.pkgName = "LyActivityInvasion";
        this.viewResI.comName = "LyActivityInvasionReward";
    }

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");

        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.INVASION);
        let rewardItems:Array<any> = activityXml._Ranking[0]._item;
        rewardItems.sort((itemA, itemB) => {
            return Number(itemA.rankId) - Number(itemB.rankId);
        })

        let label_title:fgui.GButton = group_main.getChild("label_title");
        label_title.text = StrVal.LYACTIVITY_INVASION.STR5;

        let label_desc:fgui.GButton = group_main.getChild("label_desc");
        label_desc.text = StrVal.LYACTIVITY_INVASION.STR6;

        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityInvasionReward, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        // 列表
        let list_reward:fgui.GList = group_main.getChild("list_reward");
        list_reward.setVirtual();
        list_reward.itemRenderer = (index:number, child:fgui.GComponent) => {
            let rewardItem = rewardItems[index];

            let label_rank:fgui.GTextField = child.getChild("label_rank");
            let label_rank2:fgui.GTextField = child.getChild("label_rank2");
            let loader_rank:fgui.GLoader = child.getChild("loader_rank");
            if (rewardItem.rank.length == 1) {
                let num = Number(rewardItem.rank);
                
                label_rank.text = num <= 3 ? "" : String(num);
                label_rank2.text = "";
                loader_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_ranking_0{0}", [num <= 3 ? num : 0]);
            } else {
                label_rank.text = "";
                label_rank2.text = rewardItem.rank.replace(",", "~");
                loader_rank.url = null;
            }

            // 奖励
            let bonuseItems:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(rewardItem.bonusesId);
            let list_item:fgui.GList = child.getChild("list_item");
            list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
            }
            list_item.numItems = bonuseItems.length;
        }
        UtilsUI.setFguiGlistDelayNumItems(list_reward, rewardItems.length);
    }
    
    public getIsViewMask():boolean {
        return false;
    }
}