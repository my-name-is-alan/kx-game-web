//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { ConquestState, LyConquestSeek } from "./LyConquestSeek";
import { LocaleUser } from "../Kernel/LocaleUser";

export class LyConquestSeekStart extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyConquestSeek;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyConquestSeek;
        this.viewResI.comName = "LyConquestSeekStart";
    }

    public static isWaitForOpen:boolean;

    selIndex:number;
    initSolo:boolean;
    initPlayer:boolean;

    public onViewCreate(params:any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel()
        let group_main = uiPanel.getChild("group_main", fgui.GComponent)
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyConquestSeekStart, 0, null);
        })

        let btn_close: fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let conquestRoot = LocaleData.getConquestRoot();
        let conquestInfo = GameServerData.getInstance().getConquestInfo();

        let openDay = new Date(conquestInfo.activityInfo.startTime * 1000 + UtilsTool.ONEDAY_MILLISECONDS);
        let ttt0 = conquestRoot.lockTime.split(":");
        openDay.setHours(Number(ttt0[0]));
        openDay.setMinutes(Number(ttt0[1]));
        openDay.setSeconds(Number(ttt0[2]));
        let lockTimeStart = openDay.getTime();
        let playTimeArr = (<string>conquestRoot.playTime).split("-");
        let ttt1 = playTimeArr[0].split(":");
        openDay.setHours(Number(ttt1[0]));
        openDay.setMinutes(Number(ttt1[1]));
        openDay.setSeconds(Number(ttt1[2]));
        let playTimeStart = openDay.getTime();
        let ttt2 = playTimeArr[1].split(":");
        openDay.setHours(Number(ttt2[0]));
        openDay.setMinutes(Number(ttt2[1]));
        openDay.setSeconds(Number(ttt2[2]));
        let playTimeEnd = openDay.getTime();

        // 开战时间
        let label_battle = group_main.getChild("label_battle", fgui.GTextField);
        label_battle.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR401, [openDay.getMonth() + 1, openDay.getDate(), conquestRoot.playTime]);

        // 报名倒计时，锁定倒计时，开战中倒计时
        let label_cd = group_main.getChild("label_cd", fgui.GTextField);
        let timeCall = () => {
            let serverTime = GameServerData.getInstance().getServerTime() * 1000;
            let cdstr:string;
            let remainTime:number;
            if (conquestInfo.activityInfo.phase == ConquestState.READY) {
                cdstr = StrVal.LYCONQUESTSEEK.STR404;
                remainTime = lockTimeStart - serverTime;
            } else if (conquestInfo.activityInfo.phase == ConquestState.LOCK) {
                cdstr = StrVal.LYCONQUESTSEEK.STR405;
                remainTime = playTimeStart - serverTime;
            } else if (conquestInfo.activityInfo.phase == ConquestState.BATTLE) {
                cdstr = StrVal.LYCONQUESTSEEK.STR406;
                remainTime = playTimeEnd - serverTime;
            }
            if (remainTime) {
                label_cd.text = UtilsTool.stringFormat(cdstr, [UtilsTool.splitTimeString(remainTime / 1000)]);
            } else {
                label_cd.text = "";
            }
        }
        this.setInterval(timeCall, 1000);
        timeCall();

        let data:any;
        let players = LocaleData.getConquestRankRewardItems(false);
        for (let i = 0; i < players.length; i++) {
            if (players[i].max == "1") {
                data = players[i];
                break;
            }
        }

        let openServerDay = GameServerData.getInstance().getServerCreateDay();
        let bonuseId:string;
        let bonusArr = (<string>data.bonusesID).split(";");
        let openArr = (<string>data.openDays).split(";");
        for (let i = 0; i < openArr.length; i++) {
            if (openServerDay < Number(openArr[i])) {
                bonuseId = bonusArr[i];
                break;
            }
        }
        let bonuseItems = UtilsUI.getBonuseItemsByBonusesId(bonuseId);
        let list_award: fgui.GList = group_main.getChild("list_award");
        list_award.itemRenderer = (index1: number, obj1: fgui.GComponent) => {
            UtilsUI.setUIGroupItem(bonuseItems[index1], obj1, null);
        }
        UtilsUI.setFguiGlistDelayNumItems(list_award, bonuseItems.length);

        let btn_enter:fgui.GButton = group_main.getChild("btn_enter");
        btn_enter.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyConquestSeek, 0, null);
            btn_back.fireClick();
        })

        let btn_check = group_main.getChild("btn_check", fgui.GButton);
        if (params && params.isForce) { // 强制弹窗
            btn_check.visible = false;
        } else {
            btn_check.text = StrVal.COMMON.STR39;
            btn_check.onClick(() => {
                if (btn_check.selected) {
                    let dateStr = UtilsTool.TimeToDateStr(GameServerData.getInstance().getServerTime());
                    if (dateStr != LocaleUser.getUser(VarVal.FIELD_SV.CONQUESTSEEK)) {
                        LocaleUser.setUser(VarVal.FIELD_SV.CONQUESTSEEK, dateStr);
                        LocaleUser.flush();
                    }
                } else {
                    LocaleUser.setUser(VarVal.FIELD_SV.CONQUESTSEEK, "0");
                    LocaleUser.flush();
                }
            })
        }
    };

    public getIsViewMask(): boolean {
        return false;
    };
}