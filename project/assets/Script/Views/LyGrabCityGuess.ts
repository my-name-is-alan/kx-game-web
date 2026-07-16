//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { VarVal } from "../Values/VarVal";
import { StrVal } from "../Values/StrVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServer } from "../Kernel/GameServer";
import { GrabCityState } from "./LyGrabCity";
import { LyGrabCityGuessReward } from "./LyGrabCityGuessReward";

export class LyGrabCityGuess extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGrabCity;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyGrabCity;
        this.viewResI.comName = "LyGrabCityGuess";
    }

    grabCityPlayer:any;
    activityXml:any;

    guesStates:Array<string>;
    factions:Array<any>;

    public onViewCreate(params:any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main = uiPanel.getChild("group_main", fgui.GComponent);
        UtilsUI.playCommonGroupAni(group_main);

        this.activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.GRABCITY);
        this.grabCityPlayer = GameServerData.getInstance().getGrabCityPlayer();
        this.guesStates = [
            "",
            "",
            ""
        ];
        this.factions = new Array<any>();
        for (let jj = 0; jj < params.factions.length; jj++) {
            if (params.factions[jj].stage == 2) {
                this.factions.push(params.factions[jj]);
            }
        }
        this.factions.sort((itemA, itemB) => {
            let aaa = Number(itemA.guessingCount)
            let bbb = Number(itemB.guessingCount)
            return (bbb ? bbb : 0) - (aaa ? aaa : 0);
        })

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityGuess, 0, null);
        })

        let btn_close: fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let btn_reward: fgui.GButton = group_main.getChild("btn_reward");
        btn_reward.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityGuessReward, 0, null);
        })

        // 倒计时
        let label_time = group_main.getChild("label_time", fgui.GTextField);
        let timeCall = () => {
            let serverTime = GameServerData.getInstance().getServerTime();
            let cdstr:string;
            let remainTime:number;
            if (this.grabCityPlayer.state == GrabCityState.ready2) {
                cdstr = StrVal.LYGRABCITY.STR508;
                remainTime = this.grabCityPlayer.timeList.secondPrepareTime[1] - serverTime;
            } else if (this.grabCityPlayer.state == GrabCityState.battle2) {
                cdstr = StrVal.LYGRABCITY.STR509;
                remainTime = this.grabCityPlayer.timeList.secondFightTime[1] - serverTime;
            } else if (this.grabCityPlayer.state == GrabCityState.over) {
                cdstr = StrVal.LYGRABCITY.STR510;
                remainTime = this.grabCityPlayer.timeList.activityTime[1] - serverTime;
            }
            if (remainTime) {
                label_time.text = UtilsTool.stringFormat(cdstr, [UtilsTool.splitTimeString(remainTime, true)]);
            } else {
                label_time.text = "";
            }
        }
        this.setInterval(timeCall, 1000);
        timeCall();

        let btn_save: fgui.GButton = group_main.getChild("btn_save");
        btn_save.text = StrVal.LYGRABCITY.STR507;
        btn_save.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    UtilsUI.showMsgTip(StrVal.LYGRABCITY.STR506);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "siegeGuessing", {guessing:this.guesStates})
        })

        let label_title: fgui.GTextField = group_main.getChild("label_title");
        label_title.text = StrVal.LYGRABCITY.STR501;

        let label_sub1: fgui.GTextField = group_main.getChild("label_sub1");
        label_sub1.text = StrVal.LYGRABCITY.STR502;

        this.fillGuessingStates();
        for (let i = 0; i < this.guesStates.length; i++) {
            let group_add = group_main.getChild("group_add" + String(i + 1), fgui.GComponent)
            group_add.getChild("loader_rank", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/frame_ranking_{0}", [i + 1]);
            this.updateAddSelect(i);
        }

        let label_sub2: fgui.GTextField = group_main.getChild("label_sub2");
        if (this.grabCityPlayer.guessingResult && this.grabCityPlayer.guessingResult.length > 0) {
            group_main.getController("c1").selectedIndex = 1;
            for (let i = 0; i < this.guesStates.length; i++) {
                let group_result = group_main.getChild("group_result" + String(i + 1), fgui.GComponent)
                group_result.getChild("loader_rank", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/frame_ranking_{0}", [i + 1]);
                group_result.getController("c1").selectedIndex = 2;
                this.fillGuessItem(group_result, this.grabCityPlayer.guessingResult[i])
            }
            label_sub2.text = StrVal.LYGRABCITY.STR504;
        } else {
            group_main.getController("c1").selectedIndex = 0;
            label_sub2.text = StrVal.LYGRABCITY.STR503;

            // 列表
            let list_item:fgui.GList = group_main.getChild("list_item");
            list_item.setVirtual();
            list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
                let faction = this.factions[index];

                group_item.getController("c1").selectedIndex = 1;
                this.fillGuessItem(group_item, faction.guid);

                let btn_check = group_item.getChild("btn_check", fgui.GButton);
                btn_check.clearClick() // 这样会把复选框勾的click删除，不能这么用。。。
                btn_check.onClick(() => {
                    if (!btn_check.selected) {
                        for (let i = 0; i < this.guesStates.length; i++) {
                            if (this.guesStates[i].length == 0) {
                                this.guesStates[i] = faction.guid;
                                btn_check.selected = true;
                                this.updateAddSelect(i);
                                break;
                            }
                        }
                    } else {
                        for (let i = 0; i < this.guesStates.length; i++) {
                            if (this.guesStates[i] == faction.guid) {
                                this.guesStates[i] = "";
                                btn_check.selected = false;
                                this.updateAddSelect(i);
                                break;
                            }
                        }
                    }
                })
                btn_check.selected = this.isHitSelect(faction.guid);
            }
            UtilsUI.setFguiGlistDelayNumItems(list_item, this.factions.length);
            this.updateCheckList();
        }
    }

    private updateAddSelect(slot:number): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main = uiPanel.getChild("group_main", fgui.GComponent);
        let group_add = group_main.getChild("group_add" + String(slot + 1), fgui.GComponent)
        if (this.guesStates[slot].length > 0) {
            group_add.getController("c1").selectedIndex = 3;
            this.fillGuessItem(group_add, this.guesStates[slot])
        } else {
            group_add.getController("c1").selectedIndex = 0;
        }
    }

    private isHitSelect(guid:string): boolean {
        for (let i = 0; i < this.guesStates.length; i++) {
            if (this.guesStates[i] == guid) {
                return true;
            }
        }
    }

    private updateCheckList(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main = uiPanel.getChild("group_main", fgui.GComponent);
        let list_item:fgui.GList = group_main.getChild("list_item");
        for (let i: number = 0; i < list_item.numChildren; i++) {
            let isHit = false;
            let itemIndex:number = list_item.childIndexToItemIndex(i);
            for (let jj = 0; jj < this.guesStates.length; jj++) {
                if (this.factions[itemIndex].guid == this.guesStates[jj]) {
                    isHit = true;
                    break;
                }
            }
            let btn_check: fgui.GButton = list_item.getChildAt(i, fgui.GComponent).getChild("btn_check");
            btn_check.selected = isHit;
        }
    }

    private fillGuessingStates(): void {
        let clanPlayerInfo = GameServerData.getInstance().getGrabCityClanPlayerInfo();
        if (clanPlayerInfo && clanPlayerInfo.guessing) {
            let __gues:Array<string> = clanPlayerInfo.guessing;
            for (let jjj = 0; jjj < this.guesStates.length; jjj++) {
                this.guesStates[jjj] = __gues[jjj] ? __gues[jjj] : "";
            }
        }
    }

    private fillGuessItem(guessItem:fgui.GComponent, fguid:string): void {
        let faction:any;
        for (let i = 0; i < this.factions.length; i++) {
            let info = this.factions[i];
            if (info.guid == fguid) {
                faction = info;
                break;
            }
        }
        if (faction) {
            guessItem.visible = true;

            let loader_flag: fgui.GLoader = guessItem.getChild("loader_flag")
            loader_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(faction.flag).icon])

            let label_name: fgui.GTextField = guessItem.getChild("label_name")
            label_name.text = faction.name;

            let label_count: fgui.GTextField = guessItem.getChild("label_count")
            label_count.text = String(faction.guessingCount ? faction.guessingCount : 0);
        } else {
            guessItem.visible = false;
        }
    }

    public getIsViewMask(): boolean {
        return false;
    }

    public static isViewRedPoint(): boolean {
        let grabCityPlayer = GameServerData.getInstance().getGrabCityPlayer();
        if (grabCityPlayer && grabCityPlayer.state == GrabCityState.ready2) {
            let clanPlayerInfo = GameServerData.getInstance().getGrabCityClanPlayerInfo();
            if (clanPlayerInfo) {
                if (!clanPlayerInfo.guessing || clanPlayerInfo.guessing.length == 0) {
                    return true;
                }
            }
        }
        return false;
    }
}