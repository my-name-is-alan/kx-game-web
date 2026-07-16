//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { VarVal } from "../Values/VarVal";

export class LyGrabCityTowerReward extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGrabCity;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyGrabCity;
        this.viewResI.comName = "LyGrabCityTowerReward";
    }

    public onViewCreate(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let label_title: fgui.GTextField = group_main.getChild("label_title");
        label_title.text = StrVal.LYGRABCITY.STR407;
        
        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityTowerReward, 0, null);
        })

        let btn_close: fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        this.refreshList();
    }

    private refreshList(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = uiPanel.getChild("group_main");

        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.GRABCITY);
        let rewardItems:Array<any> = activityXml._tower[0]._item;
        // 列表
        let list_reward:fgui.GList = group_main.getChild("list_reward");
        list_reward.setVirtual();
        list_reward.itemRenderer = (index:number, group_rewarditem:fgui.GComponent) => {
            let rewItem = rewardItems[index];
            let label_tips:fgui.GTextField = group_rewarditem.getChild("label_tips");
            label_tips.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR406, [rewItem.id]);

            // 奖励
            let bonuseItems:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(rewItem.bonuseId);
            let list_item:fgui.GList = group_rewarditem.getChild("list_item");
            list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
            }
            list_item.numItems = bonuseItems.length;
        }
        UtilsUI.setFguiGlistDelayNumItems(list_reward, rewardItems.length);

        let group_final:fgui.GComponent = group_main.getChild("group_final");
        let label_tips:fgui.GTextField = group_final.getChild("label_tips");
        label_tips.text = StrVal.LYGRABCITY.STR405;
        // 奖励
        let bonuseItems:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(rewardItems[rewardItems.length - 1].passBonuseId);
        let list_item:fgui.GList = group_final.getChild("list_item");
        list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
        }
        list_item.numItems = bonuseItems.length;
    }

    public getIsViewMask(): boolean {
        return false;
    }
}