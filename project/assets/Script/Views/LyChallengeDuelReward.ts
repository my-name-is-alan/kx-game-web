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
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { GameServerData } from "../Kernel/GameServerData";

export class LyChallengeDuelReward extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyChallengeDuel;
        this.viewResI.pkgName = "LyChallengeDuel";
        this.viewResI.comName = "LyChallengeDuelReward";
    }

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let duelRoot = LocaleData.getDuelRoot();
        let rewardItems:Array<any> = duelRoot._rankReward[0]._item;

        let label_title:fgui.GButton = group_main.getChild("label_title");

        let label_time:fgui.GButton = group_main.getChild("label_time");
        let timeCall = () => {
            let serverTime = GameServerData.getInstance().getServerTime() * 1000;
            let lastTime:number;
            if (isDayList) {
                lastTime = UtilsTool.getNextDateTime(serverTime);
            } else {
                lastTime = UtilsTool.getNextSpecificTimeByDay(serverTime, 1);
            }
            let remain = lastTime - serverTime;
            let num = Math.floor(remain / UtilsTool.ONEDAY_MILLISECONDS);
            if (num > 0) {
                label_time.text = UtilsTool.stringFormat(StrVal.LYCHALLENGE_DUEL.STR6, [num, UtilsTool.splitTimeString((remain % UtilsTool.ONEDAY_MILLISECONDS) / 1000, true)]);
            } else {
                label_time.text = UtilsTool.stringFormat(StrVal.LYCHALLENGE_DUEL.STR5, [UtilsTool.splitTimeString(remain / 1000, true)]);
            }
        }
        this.setInterval(timeCall, 1000)

        let btn_back:fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyChallengeDuelReward, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let isDayList:boolean = false;

        // 列表
        let list_reward:fgui.GList = group_main.getChild("list_reward");
        list_reward.setVirtual();
        list_reward.itemRenderer = (index:number, child:fgui.GComponent) => {
            let rewardItem = rewardItems[index];
            let ranking:string = rewardItem.ranking;

            let loader_rank:fgui.GLoader = child.getChild("loader_rank");
            let label_rank:fgui.GTextField = child.getChild("label_rank");
            if (ranking.indexOf(",") >= 0) {
                label_rank.text = ranking.replace(",", "~");
                loader_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_ranking_{0}", [0]);
            } else {
                let num = Number(ranking);
                label_rank.text = num <= 3 ? "" : ranking;
                loader_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_ranking_{0}", [num <= 3 ? num : 0]);
            }

            // 奖励
            let bonuseItems:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(isDayList ? rewardItem.dailyBonusesId : rewardItem.weeklyBonusesId);
            let list_item:fgui.GList = child.getChild("list_item");
            list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
            }
            list_item.numItems = bonuseItems.length;
        }

        let btn_week:fgui.GButton = group_main.getChild("btn_week");
        btn_week.text = StrVal.LYCHALLENGE_DUEL.STR3;
        btn_week.onClick(() => {
            if (isDayList) {
                isDayList = false;
                UtilsUI.setFguiGlistDelayNumItems(list_reward, rewardItems.length);
                btn_week.touchable = false;
                btn_week.selected = true;
                btn_day.touchable = true;
                btn_day.selected = false;
                UtilsUI.updateTabButtonColor(btn_week);
                UtilsUI.updateTabButtonColor(btn_day);
                label_title.text = StrVal.LYCHALLENGE_DUEL.STR3;
                timeCall();
            }
        })
        let btn_day:fgui.GButton = group_main.getChild("btn_day");
        btn_day.text = StrVal.LYCHALLENGE_DUEL.STR4;
        let onDayClick = () => {
            if (!isDayList) {
                isDayList = true;
                UtilsUI.setFguiGlistDelayNumItems(list_reward, rewardItems.length);
                btn_week.touchable = true;
                btn_week.selected = false;
                btn_day.touchable = false;
                btn_day.selected = true;
                UtilsUI.updateTabButtonColor(btn_week);
                UtilsUI.updateTabButtonColor(btn_day);
                label_title.text = StrVal.LYCHALLENGE_DUEL.STR4;
                timeCall();
            }
        }
        btn_day.onClick(onDayClick)
        onDayClick();
    }
    
    public getIsViewMask():boolean {
        return false;
    }
}