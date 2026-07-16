//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";

export class LyCrossQunYinAward extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyCrossQunYin";
        this.viewResI.pkgName = "LyCrossQunYin";
        this.viewResI.comName = "LyCrossQunYinAward";
    }
    private uiPanel: fgui.GComponent
    private activityXml: any

    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close = this.getUiPanel().getChild("btn_close")
        let btn_close1 = this.uiPanel.getChild("btn_close1")
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCrossQunYinAward, 0, null)
        })
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCrossQunYinAward, 0, null)
        })
        this.activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.QUNYIN);
        let dayItem: any = this.activityXml._dailyBonuses[0]._item
        dayItem.sort((a, b) => {
            return a.rank - b.rank
        })
        let monthItem: any = this.activityXml._weekBonuses[0]._item
        monthItem.sort((a, b) => {
            return a.rank - b.rank
        })
        let btn_day: fgui.GButton = this.uiPanel.getChild("btn_day")
        let btn_month: fgui.GButton = this.uiPanel.getChild("btn_month")
        btn_day.text = StrVal.LYQUNYIN.STR41
        btn_month.text = StrVal.LYQUNYIN.STR40
        let label_time: fgui.GLabel = this.uiPanel.getChild("label_time")
        let label_timeMonth: fgui.GLabel = this.uiPanel.getChild("label_timeMonth")
        let timeCall = () => {
            let serverTime = GameServerData.getInstance().getServerTime() * 1000;
            let lastTime = UtilsTool.getNextDateTime(serverTime);
            let remain = lastTime - serverTime;
            label_time.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR8, [UtilsTool.splitTimeString(remain / 1000)]);

            let lastTime1 = UtilsTool.getNextSpecificTimeByDay(serverTime, 1);
            let remain1 = lastTime1 - serverTime;
            label_timeMonth.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR8, [UtilsTool.parseTimeToString(remain1 / 1000)]);
        }
        this.setInterval(timeCall, 1000);
        timeCall();

        // let label_time: fgui.GLabel = this.uiPanel.getChild("label_time")
        // let timeCall = () => {
        //     let serverTime = GameServerData.getInstance().getServerTime() * 1000;
        //     let lastTime = UtilsTool.getNextSpecificTimeByDay(serverTime);
        //     let remain = lastTime - serverTime;
        //     label_time.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR8, [UtilsTool.splitTimeString(remain / 1000)]);
        // }
        // this.setInterval(timeCall, 1000);
        // timeCall();

        btn_day.onClick(() => {
            this.onAwardList(dayItem, 1)
        })
        btn_month.onClick(() => {
            this.onAwardList(monthItem, 2)
        })
        this.onAwardList(dayItem, 1)
    };
    private onAwardList(data: any, type: number): void {
        let label_title: fgui.GLabel = this.uiPanel.getChild("label_title")
        if (type == 1) {
            label_title.text = StrVal.LYQUNYIN.STR26
        } else {
            label_title.text = StrVal.LYQUNYIN.STR25
        }
        // label_title.text = 
        let list_award: fgui.GList = this.uiPanel.getChild("list_award")
        list_award.setVirtual()
        list_award.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            // let label_combatPower: fgui.GList = obj.getChild("label_combatPower")
            // this.loadPlayer(obj, this.qunyinData[index])
            let group_top1: fgui.GGraph = obj.getChild("group_top1")
            let group_top2: fgui.GGraph = obj.getChild("group_top2")
            let group_top3: fgui.GGraph = obj.getChild("group_top3")
            let label_top: fgui.GLabel = obj.getChild("label_top")
            group_top1.visible = false
            group_top2.visible = false
            group_top3.visible = false
            label_top.visible = false
            if (data[index].rank == 1) {
                group_top1.visible = true
            } else if (data[index].rank == 2) {
                group_top2.visible = true
            } else if (data[index].rank == 3) {
                group_top3.visible = true
            } else {
                label_top.visible = true
                label_top.text = (Number(data[index - 1].rank) + 1) + "~" + data[index].rank
            }
            let list_rankItem: fgui.GList = obj.getChild("list_rankItem")
            let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(data[index].bonusesId);
            list_rankItem.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index1], obj1, null);
            }).bind(this)
            list_rankItem.numItems = bonuseItems.length
        }).bind(this)
        list_award.numItems = data.length
    }

    public getIsViewMask(): boolean {
        return false;
    };

}