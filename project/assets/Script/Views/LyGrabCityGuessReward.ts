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
import { GameServer } from "../Kernel/GameServer";

export class LyGrabCityGuessReward extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGrabCity;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyGrabCity;
        this.viewResI.comName = "LyGrabCityGuessReward";
    }

    activityXml:any;

    public onViewCreate(params:any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main = uiPanel.getChild("group_main", fgui.GComponent);
        UtilsUI.playCommonGroupAni(group_main);

        this.activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.GRABCITY);
        let taskItems:Array<any> = this.activityXml._guess[0]._item;

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityGuessReward, 0, null);
        })

        let label_title: fgui.GTextField = group_main.getChild("label_title");
        label_title.text = StrVal.LYGRABCITY.STR511;

        let label_desc: fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = StrVal.LYGRABCITY.STR512;

        let clanPlayerInfo = GameServerData.getInstance().getGrabCityClanPlayerInfo();

        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.setVirtual();
        list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let taskItem = taskItems[index];

            let label_tips: fgui.GTextField = group_item.getChild("label_tips");
            label_tips.text = UtilsTool.stringFormat(taskItem.name, [this.getGuessingIdCount(taskItem.id)]);

            let bonuseItems = UtilsUI.getBonuseItemsByBonusesId(taskItem.bonusesId);
            // 列表
            let lisitem:fgui.GList = group_item.getChild("list_item");
            lisitem.itemRenderer = (index:number, child:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], child, null);
            }
            lisitem.numItems = bonuseItems.length;

            let btn_take = group_item.getChild("btn_take", fgui.GButton);
            btn_take.text = StrVal.LYGRABCITY.STR514;
            btn_take.clearClick()
            btn_take.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "siegeGuessingAward", null)
            })

            let group_done = group_item.getChild("group_done");
            if (clanPlayerInfo) {
                if (clanPlayerInfo.guessingId == Number(taskItem.id)) { // 是否领取此奖励
                    if (clanPlayerInfo.guessingAward == 0) { // 是否已领取
                        btn_take.visible = true;
                        group_done.visible = false;
                    } else {
                        btn_take.visible = false;
                        group_done.visible = true;
                        group_item.getChild("label_done", fgui.GTextField).text = StrVal.LYGRABCITY.STR513;
                    }
                } else { // 显示自己是否达成
                    if (this.isGuessingId(taskItem.id)) {
                        btn_take.visible = false;
                        group_done.visible = true;
                        group_item.getChild("label_done", fgui.GTextField).text = StrVal.LYGRABCITY.STR515;
                    } else {
                        btn_take.visible = false;
                        group_done.visible = false;
                    }
                }
            } else {
                btn_take.visible = false;
                group_done.visible = false;
            }
        }
        UtilsUI.setFguiGlistDelayNumItems(list_item, taskItems.length);
    }

    /**
     * 是否猜中某档次（暂未实现）
     * @param rank 
     * @returns 
     */
    private isGuessingId(id:string): boolean {
        let clanPlayerInfo = GameServerData.getInstance().getGrabCityClanPlayerInfo();
        if (clanPlayerInfo && clanPlayerInfo.guessing) {
            let __gues:Array<string> = clanPlayerInfo.guessing;
            for (let jjj = 0; jjj < __gues.length; jjj++) {
                if (__gues[jjj] == "123") {
                    return true;
                }
            }
        }
    }

    private getGuessingIdCount(id:string): number {
        let count = 0;
        let grabCityPlayer = GameServerData.getInstance().getGrabCityPlayer();
        if (grabCityPlayer && grabCityPlayer.guessingCount) {
            let num = grabCityPlayer.guessingCount[Number(id) - 1];
            if (num) {
                count = num;
            }
        }
        return count;
    }

    public getIsViewMask(): boolean {
        return false;
    }

    public static isViewRedPoint(): boolean {
        let clanPlayerInfo = GameServerData.getInstance().getGrabCityClanPlayerInfo();
        if (clanPlayerInfo && clanPlayerInfo.guessingId && clanPlayerInfo.guessingAward == 0) {
            return true;
        }
        return false;
    }
}