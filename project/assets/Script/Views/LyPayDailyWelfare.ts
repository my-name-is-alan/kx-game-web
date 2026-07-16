//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { VarVal } from "../Values/VarVal";
import { LocaleData } from "../Kernel/LocaleData";
import { MonthCardItemType, UtilsUI } from "../Kernel/UtilsUI";
import { StrVal } from "../Values/StrVal";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { AudioManager } from "../Kernel/AudioManager";

export class LyPayDailyWelfare extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPayActivitys;
        this.viewResI.pkgName = "LyPayActivitys";
        this.viewResI.comName = "LyPayDailyWelfare";
    }

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.DAILYWELFARE);
        let bonuseItems = UtilsUI.getBonuseItemsByBonusesId(activityXml.bonuses);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayDailyWelfare, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_tips:fgui.GTextField = group_main.getChild("label_tips");
        label_tips.text = StrVal.LYPAY_ACTIVITYS.STR4;

        let label_desc:fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = StrVal.LYPAY_ACTIVITYS.STR3;

        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
        }
        list_item.numItems = bonuseItems.length;

        let btn_pay:fgui.GButton = UtilsUI.setButtonIcon(group_main.getChild("btn_pay"), VarVal.BUTTON_ICON.reward_ad, StrVal.LYPAY_ACTIVITYS.STR1);
        btn_pay.onClick(() => {
            PlatformAPI.doSdkRewardVideoAD((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                } else {
                    UtilsUI.lockWait();
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait();
                        if (args.errorcode == 0) {
                            UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                            // 通关后刷新本界面。
                            btn_back.fireClick();
                        } else {
                            UtilsUI.showMsgTip(args.errorcode);
                        }
                    }, "takeWelfare", null);
                }
            }, UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.skip_ad))
        })
    }

    public getIsViewMask():boolean {
        return false;
    }
}