//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { LocaleData } from "../Kernel/LocaleData";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { VarVal } from "../Values/VarVal";
import { StrVal } from "../Values/StrVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";

export class LyGrabCityZongLan extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGrabCity;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyGrabCity;
        this.viewResI.comName = "LyGrabCityZongLan";
    }

    public onViewCreate(params:any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main = uiPanel.getChild("group_main", fgui.GComponent);
        UtilsUI.playCommonGroupAni(group_main);

        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.GRABCITY);
        let temps:Array<any> = activityXml._combat[0]._item;
        let rankItems:Array<any> = new Array<any>();
        for (let i = 0; i < temps.length; i++) { // 收集比赛1。
            if (temps[i].battlefield == "1") {
                rankItems.push({
                    sort:temps[i].sort,
                    step1:temps[i]
                })
            }
        }
        for (let jjj = 0; jjj < rankItems.length; jjj++) { // 合并比赛2。
            let rankItem = rankItems[jjj];
            for (let i = 0; i < temps.length; i++) {
                if (temps[i].battlefield == "2") {
                    if (temps[i].minRank == rankItem.step1.minRank && temps[i].maxRank == rankItem.step1.maxRank) {
                        rankItem.step2 = temps[i];
                        break;
                    }
                }
            }
        }
        for (let i = 0; i < temps.length; i++) { // 单独的比赛2。
            if (temps[i].battlefield == "2") {
                let isHit = false;
                for (let jjj = 0; jjj < rankItems.length; jjj++) {
                    let rankItem = rankItems[jjj];
                    if (temps[i].minRank == rankItem.step1.minRank && temps[i].maxRank == rankItem.step1.maxRank) {
                        isHit = true;
                        break;
                    }
                }
                if (!isHit) {
                    rankItems.push({ // 如果没有找到则插入
                        sort:temps[i].sort,
                        step2:temps[i]
                    })
                }
            }
        }
        rankItems.sort((itemA, itemB) => {
            return Number(itemA.sort) - Number(itemB.sort);
        })

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityZongLan, 0, null);
        })

        let btn_close: fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_title: fgui.GTextField = group_main.getChild("label_title");
        label_title.text = StrVal.LYGRABCITY.STR601;

        let label_sub1: fgui.GTextField = group_main.getChild("label_sub1");
        label_sub1.text = StrVal.LYGRABCITY.STR602;
        let label_attr1: fgui.GTextField = group_main.getChild("label_attr1");
        label_attr1.text = StrVal.LYGRABCITY.STR606;
        let label_attr2: fgui.GTextField = group_main.getChild("label_attr2");
        label_attr2.text = StrVal.LYGRABCITY.STR607;
        let label_attr3: fgui.GTextField = group_main.getChild("label_attr3");
        label_attr3.text = StrVal.LYGRABCITY.STR608;

        let cityPlayer = GameServerData.getInstance().getGrabCityPlayer();
        let battleTimes = [
            {
                name:activityXml.intermediateName,
                times:cityPlayer.timeList.firstFightTime
            },
            {
                name:activityXml.advancedName,
                times:cityPlayer.timeList.secondFightTime
            }
        ];
        let serverTime = GameServerData.getInstance().getServerTime() * 1000;

        // 列表
        let list_item1:fgui.GList = group_main.getChild("list_item1");
        list_item1.setVirtual();
        list_item1.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let battleTime = battleTimes[index];

            let date = new Date(battleTime.times[0]);

            let isInTime = serverTime >= battleTime.times[0] && serverTime <= battleTime.times[0];
            group_item.getController("c1").selectedIndex = isInTime ? 1 : 0;

            let label_date1: fgui.GTextField = group_item.getChild("label_date1");
            label_date1.text = UtilsTool.stringFormat("{0}/{1}", [date.getMonth() + 1, date.getDate()]);
            let label_date2: fgui.GTextField = group_item.getChild("label_date2");
            label_date2.text = label_date1.text;

            let startTime = UtilsTool.getStartDateTime(battleTime.times[0]);

            let label_time1: fgui.GTextField = group_item.getChild("label_time1");
            label_time1.text = UtilsTool.stringFormat("{0}-{1}", [UtilsTool.splitTimeString((battleTime.times[0] - startTime) / 1000), UtilsTool.splitTimeString((battleTime.times[1] - startTime) / 1000)]);
            let label_time2: fgui.GTextField = group_item.getChild("label_time2");
            label_time2.text = label_time1.text;

            let label_name1: fgui.GTextField = group_item.getChild("label_name1");
            label_name1.text = battleTime.name;
            let label_name2: fgui.GTextField = group_item.getChild("label_name2");
            label_name2.text = label_name1.text;
        }
        UtilsUI.setFguiGlistDelayNumItems(list_item1, battleTimes.length);

        let label_sub2: fgui.GTextField = group_main.getChild("label_sub2");
        label_sub2.text = StrVal.LYGRABCITY.STR603;
        let label_noti1: fgui.GTextField = group_main.getChild("label_noti1");
        label_noti1.text = StrVal.LYGRABCITY.STR609;
        let label_noti2: fgui.GTextField = group_main.getChild("label_noti2");
        label_noti2.text = activityXml.intermediateName;
        let label_noti3: fgui.GTextField = group_main.getChild("label_noti3");
        label_noti3.text = activityXml.advancedName;

        // 列表
        let list_item2:fgui.GList = group_main.getChild("list_item2");
        list_item2.setVirtual();
        list_item2.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let rankItem = rankItems[index];

            let step = rankItem.step1;
            if (!step) {
                step = rankItem.step2;
            }

            let label_sort: fgui.GTextField = group_item.getChild("label_sort");
            if (step.minRank == step.maxRank) {
                label_sort.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR604, [step.minRank]);
            } else {
                label_sort.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR605, [step.minRank, step.maxRank]);
            }

            let label_step1: fgui.GTextField = group_item.getChild("label_step1");
            if (rankItem.step1) {
                label_step1.text = rankItem.step1.score;
            } else {
                label_step1.text = "";
            }

            let label_step2: fgui.GTextField = group_item.getChild("label_step2");
            if (rankItem.step2) {
                label_step2.text = rankItem.step2.score;
            } else {
                label_step2.text = "";
            }
        }
        UtilsUI.setFguiGlistDelayNumItems(list_item2, rankItems.length);
    }

    public getIsViewMask(): boolean {
        return false;
    }
}