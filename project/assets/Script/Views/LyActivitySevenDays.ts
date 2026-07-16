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
import { AudioManager } from "../Kernel/AudioManager";

export class LyActivitySevenDays extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyActivitySevenDays";
        this.viewResI.pkgName = "LyActivitySevenDays";
        this.viewResI.comName = "LyActivitySevenDays";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        this.uiPanel = this.getUiPanel().getChild("group_main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivitySevenDays, 0, null);
        })
        this.uiPanel.getChild("label_str4", fgui.GLabel).text = StrVal.LYACTIVITYSEVENDAYS.STR4
        this.uiPanel.getChild("label_str2", fgui.GLabel).text = StrVal.LYACTIVITYSEVENDAYS.STR2
        this.initialize()
    };

    private initialize(): void {
        let group_ok: fgui.GGraph = this.uiPanel.getChild("group_ok")
        let activity = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.SEVENDAYS)
        let activityData: any = activity.data.activitySevenDays[0]
        let topId: number = activityData.id
        let sevenDaysItems: any = LocaleData.getSevenDaysItems(topId)
        let btn_sevenDays: fgui.GButton = this.uiPanel.getChild("btn_sevenDays")
        btn_sevenDays.text = StrVal.LYACTIVITYSEVENDAYS.STR1
        group_ok.visible = activityData.signStart == 1
        btn_sevenDays.visible = activityData.signStart != 1
        btn_sevenDays.clearClick()
        btn_sevenDays.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResultArr]) });
                    this.initialize()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "sevenDays", {
                tid: Number(topId)
            })
        })
        for (let i = 0; i < sevenDaysItems.length; i++) {
            let item: fgui.GComponent = this.uiPanel.getChild(UtilsTool.stringFormat("group_day{0}", [i + 1]))
            let label_title: fgui.GLabel = item.getChild("label_title")
            label_title.text = UtilsTool.stringFormat(StrVal.LYACTIVITYSEVENDAYS.STR3, [i + 1])
            let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(sevenDaysItems[i].bonuseID);
            let group_isGet: fgui.GGraph = item.getChild("group_isGet")
            group_isGet.visible = i < activityData.signNum
            let list_bonuses: fgui.GList = item.getChild("list_bonuses")
            list_bonuses.itemRenderer = ((index: number, obj: fgui.GComponent) => {
                let GroupItem: fgui.GComponent = obj.getChild("GroupItem")
                UtilsUI.setUIGroupItem(bonuseItems[index], GroupItem, null);
            }).bind(this)
            list_bonuses.numItems = bonuseItems.length
        }
    }

    public static isViewRedPoint(): boolean {
        let activityDays = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.SEVENDAYS);
        if (activityDays && activityDays.data && activityDays.data.activitySevenDays[0]) {
            return (activityDays.data.activitySevenDays[0].signStart != 1);
        }
        return false
    }

    public getIsViewMask(): boolean {
        return false;
    };

}