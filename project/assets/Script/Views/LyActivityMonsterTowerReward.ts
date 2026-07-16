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

export class LyActivityMonsterTowerReward extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyActivityMonsterTower;
        this.viewResI.pkgName = "LyActivityMonsterTower";
        this.viewResI.comName = "LyActivityMonsterTowerReward";
    }

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");

        let rewardItems:Array<any> = this.getRewardItems();

        let label_title:fgui.GButton = group_main.getChild("label_title");
        label_title.text = StrVal.LYACTIVITY_MONSTERTOWER.STR101;

        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityMonsterTowerReward, 0, null);
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

            let label_tips:fgui.GTextField = child.getChild("label_tips");
            label_tips.text = StrVal.LYACTIVITY_MONSTERTOWER.STR102;

            let label_desc:fgui.GTextField = child.getChild("label_desc");
            label_desc.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_MONSTERTOWER.STR105, [rewardItem.groupID]);

            let label_take:fgui.GTextField = child.getChild("label_take");
            if (params.groupID > Number(rewardItem.groupID)) {
                label_take.text = StrVal.LYACTIVITY_MONSTERTOWER.STR104;
            } else {
                label_take.text = StrVal.LYACTIVITY_MONSTERTOWER.STR103;
            }
            label_take.color = UtilsUI.getCompleteColor(params.groupID > Number(rewardItem.groupID));
            
            // 奖励
            let bonuseItems:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(rewardItem.bonuseID);
            let list_item:fgui.GList = child.getChild("list_item");
            list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
            }
            list_item.numItems = bonuseItems.length;
        }
        UtilsUI.setFguiGlistDelayNumItems(list_reward, rewardItems.length);
    }

    private getRewardItems():Array<any> {
        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.MONSTOR_TOWER);
        let rewardItems:Array<any> = activityXml._quick[0]._item;
        rewardItems.sort((itemA, itemB) => {
            return Number(itemA.id) - Number(itemB.id);
        })
        return rewardItems;
    }
    
    public getIsViewMask():boolean {
        return false;
    }
}