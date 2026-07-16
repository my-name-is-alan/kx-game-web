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

export class LyCrossQunYinAchievement extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyCrossQunYin";
        this.viewResI.pkgName = "LyCrossQunYin";
        this.viewResI.comName = "LyCrossQunYinAchievement";
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
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCrossQunYinAchievement, 0, null)
        })
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCrossQunYinAchievement, 0, null)
        })
        let achievementArr: any = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.QUNYIN).data.activityQunYin;

        this.activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.QUNYIN);
        let achievementItem: any = this.activityXml._achievement[0]._item
        achievementItem.sort((a, b) => {
            return a.rank - b.rank
        })
        let list_award: fgui.GList = this.uiPanel.getChild("list_award")
        let selectIndex = -1
        list_award.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            // let label_combatPower: fgui.GList = obj.getChild("label_combatPower")
            // this.loadPlayer(obj, this.qunyinData[index])indexOf(8)
            if (achievementItem[index].rank == 1) {
                let group_top1: fgui.GGraph = obj.getChild("group_top1")
                group_top1.visible = true
            } else if (achievementItem[index].rank == 2) {
                let group_top2: fgui.GGraph = obj.getChild("group_top2")
                group_top2.visible = true
            } else if (achievementItem[index].rank == 3) {
                let group_top3: fgui.GGraph = obj.getChild("group_top3")
                group_top3.visible = true
            } else {
                let label_top: fgui.GLabel = obj.getChild("label_top")
                label_top.visible = true
                label_top.text = achievementItem[index].rank
            }
            let list_rankItem: fgui.GList = obj.getChild("list_rankItem")
            let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(achievementItem[index].bonusesId);
            list_rankItem.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index1], obj1, null);
            }).bind(this)
            list_rankItem.numItems = bonuseItems.length

            let label_stage: fgui.GTextField = obj.getChild("label_stage")
            let group_stage: fgui.GGraph = obj.getChild("group_stage")
            let isUp: boolean = Number(achievementItem[index].rank) >= achievementArr.highRank && achievementArr.highRank != 0
            label_stage.color = UtilsUI.getCompleteColor(isUp);
            // label_stage.visible = achievementArr.indexOf(Number(achievementItem[index].rank)) == -1
            label_stage.text = isUp ? StrVal.LYQUNYIN.STR35 : StrVal.LYQUNYIN.STR36
            // label_stage.text = achievementArr.indexOf(Number(achievementItem[index].rank)) != -1 ? StrVal.LYQUNYIN.STR35 : StrVal.LYQUNYIN.STR36
            group_stage.visible = isUp
            if (selectIndex == -1 && isUp) {
                selectIndex = index
                list_award.scrollToView(index)
            }
        }).bind(this)
        list_award.numItems = achievementItem.length
        let label_str23: fgui.GLabel = this.uiPanel.getChild("label_str23")
        label_str23.text = StrVal.LYQUNYIN.STR23
        let label_str24: fgui.GLabel = this.uiPanel.getChild("label_str24")
        label_str24.text = StrVal.LYQUNYIN.STR24
    };


    public getIsViewMask(): boolean {
        return false;
    };

}