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
import { LyChatRoom } from "./LyChatRoom";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { StrVal } from "../Values/StrVal";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { LyGuideDetail } from "./LyGuideDetail";
import { UtilsTool } from "../Kernel/UtilsTool";
import { LyConquestSeekMain } from "./LyConquestSeekMain";

import { LyConquestSeekRankReward } from "./LyConquestSeekRankReward";
import { LyConquestSeekRank } from "./LyConquestSeekRank";
import { LyConquestSeekTask } from "./LyConquestSeekTask";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { LyConquestSeekWiner } from "./LyConquestSeekWiner";
import { LyConquestSeekHeadRank } from "./LyConquestSeekHeadRank";

export enum ConquestState {
    CLOSE = 1,
    READY,
    LOCK,
    BATTLE,
    OVER
}

export class LyConquestSeek extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyConquestSeek;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyConquestSeek;
        this.viewResI.comName = "LyConquestSeek";
    }

    conquestRoot:any;
    conquestInfo:any;

    private group_chat: fgui.GComponent;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();

        this.conquestRoot = LocaleData.getConquestRoot();
        this.conquestInfo = GameServerData.getInstance().getConquestInfo();

        // 关闭
        let btn_close = uiPanel.getChild("btn_close", fgui.GButton);
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyConquestSeek, 0, null);
        })

        // 描述
        let btn_detail = uiPanel.getChild("btn_detail", fgui.GButton);
        btn_detail.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:this.conquestRoot.name, detail:this.conquestRoot.desc});
        })

        // 点赞
        let btn_lastwiner = uiPanel.getChild("btn_lastwiner", fgui.GButton);
        PointRedData.getInstance().registerPoint(btn_lastwiner, PointRedType.LyConquestSeekWiner);
        btn_lastwiner.onClick(() => {
            let conquestInfo = GameServerData.getInstance().getConquestInfo();
            if (conquestInfo.lastTopPlayer.serverId) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyConquestSeekWiner, 0, null);
            } else {
                UtilsUI.showMsgTip(StrVal.LYCONQUESTSEEK.STR502);
            }
        })

        // 奖励
        let btn_reward = uiPanel.getChild("btn_reward", fgui.GButton);
        PointRedData.getInstance().registerPoint(btn_reward, PointRedType.LyConquestSeekReward);
        btn_reward.onClick(() => {
            // 暂时不用事件，先主动获取一次可领取状态（为了红点需要事件通知）
            GameServer.getInstance().send((args: any) => {
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyConquestSeekRankReward, 0, null);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "getConquestInfo", null)
        })

        // 排行
        let btn_rank = uiPanel.getChild("btn_rank", fgui.GButton);
        btn_rank.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyConquestSeekRank, 0, null);
        })

        // 任务
        let btn_task = uiPanel.getChild("btn_task", fgui.GButton);
        PointRedData.getInstance().registerPoint(btn_task, PointRedType.LyConquestSeekTask);
        btn_task.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyConquestSeekTask, 0, null);
        })

        // 头像排名
        let btn_headRank = uiPanel.getChild("btn_headRank", fgui.GButton);
        btn_headRank.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyConquestSeekHeadRank, 0, null);
        })

        // 活动时间
        let label_time = uiPanel.getChild("label_time", fgui.GTextField);
        label_time.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR102, [
            UtilsTool.TimeToStr(this.conquestInfo.activityInfo.startTime, "/"),
            UtilsTool.TimeToStr(this.conquestInfo.activityInfo.endTime, "/")
        ]);

        let openDay = new Date(this.conquestInfo.activityInfo.startTime * 1000 + UtilsTool.ONEDAY_MILLISECONDS);
        let ttt0 = this.conquestRoot.lockTime.split(":");
        openDay.setHours(Number(ttt0[0]));
        openDay.setMinutes(Number(ttt0[1]));
        openDay.setSeconds(Number(ttt0[2]));
        let lockTimeStart = openDay.getTime();
        let playTimeArr = (<string>this.conquestRoot.playTime).split("-");
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
        let label_battle = uiPanel.getChild("label_battle", fgui.GTextField);
        label_battle.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR103, [openDay.getMonth() + 1, openDay.getDate(), this.conquestRoot.playTime]);

        // 报名倒计时，锁定倒计时，开战中倒计时
        let label_cd = uiPanel.getChild("label_cd", fgui.GTextField);
        let timeCall = () => {
            let serverTime = GameServerData.getInstance().getServerTime() * 1000;
            let cdstr:string;
            let remainTime:number;
            if (this.conquestInfo.activityInfo.phase == ConquestState.READY) {
                cdstr = StrVal.LYCONQUESTSEEK.STR104;
                remainTime = lockTimeStart - serverTime;
            } else if (this.conquestInfo.activityInfo.phase == ConquestState.LOCK) {
                cdstr = StrVal.LYCONQUESTSEEK.STR105;
                remainTime = playTimeStart - serverTime;
            } else if (this.conquestInfo.activityInfo.phase == ConquestState.BATTLE) {
                cdstr = StrVal.LYCONQUESTSEEK.STR106;
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

        // 进入，报名，领奖中
        let btn_enter = uiPanel.getChild("btn_enter", fgui.GButton);
        btn_enter.onClick(() => {
            if (this.conquestInfo.activityInfo.phase == ConquestState.READY) {
                if (this.conquestInfo.myInfo.isEnroll == 0) {
                    UtilsUI.lockWait();
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait();
                        if (args.errorcode == 0) {
                            this.conquestInfo = GameServerData.getInstance().getConquestInfo();
                            this.updateEnterState();
                        } else {
                            UtilsUI.showMsgTip(args.errorcode);
                        }
                    }, "conquestEnroll", null)
                }
            } else if (this.conquestInfo.activityInfo.phase == ConquestState.BATTLE) {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyConquestSeekMain, 0, null);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "conquestEnterScene", null)
            } else if (this.conquestInfo.activityInfo.phase == ConquestState.OVER) {
                UtilsUI.showMsgTip(StrVal.LYCONQUESTSEEK.STR101);
            }
        })
        this.registerRequest(() => {
            this.conquestInfo = GameServerData.getInstance().getConquestInfo();
            this.updateEnterState();
            this.tryShowCloseMsg(); // 尝试触发关闭。
        }, "onConquestPhaseChange");
        this.updateEnterState();

        // 聊天框
        this.group_chat = uiPanel.getChild("group_chat")
        this.group_chat.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyChatRoom, 0, {activityId:null});
        })
        this.showChatRoomLast();
    }

    // 聊天
    private showChatRoomLast(): void {
        let label_content = this.group_chat.getChild("label_content", fgui.GTextField);
        let chatmsg = LyChatRoom.getChatShowMainPage();
        if (chatmsg) {
            label_content.text = chatmsg;
        } else {
            label_content.text = "";
        }
    }

    private updateEnterState(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();

        let btn_enter = uiPanel.getChild("btn_enter", fgui.GButton);
        btn_enter.grayed = false;
        let selIndex = 3;

        if (this.conquestInfo.activityInfo.phase == ConquestState.READY) {
            if (this.conquestInfo.myInfo.isEnroll == 0) {
                selIndex = 0;
            } else {
                btn_enter.grayed = true;
                selIndex = 1;
            }
        } else if (this.conquestInfo.activityInfo.phase == ConquestState.LOCK) {
            btn_enter.grayed = true;
            if (this.conquestInfo.myInfo.isEnroll == 0) {
                selIndex = 0;
            } else {
                selIndex = 1;
            }
        } else if (this.conquestInfo.activityInfo.phase == ConquestState.BATTLE) {
            selIndex = 2;
        } else if (this.conquestInfo.activityInfo.phase == ConquestState.OVER) {
            selIndex = 3;
        }
        btn_enter.getController("c1").selectedIndex = selIndex;
    }

    public static isConquestOpen(): boolean{
        let conquestInfo = GameServerData.getInstance().getConquestInfo();
        if (GameServerData.getInstance().getPlayerFullInfo().conquestOpen && conquestInfo && conquestInfo.activityInfo.phase != ConquestState.CLOSE) {
            return true;
        }
        return false;
    }

    /**
     * 当主界面要被某处刷新时。
     */
    public onViewUpdate(params: any): void {
        if (params && params.isChatRoomMsg) {
            this.showChatRoomLast();
        }
    }

    public onViewShowFront(): void {
        this.tryShowCloseMsg();
    }

    private tryShowCloseMsg(): void {
        if (this.conquestInfo.activityInfo.phase == ConquestState.CLOSE && ViewDispatcher.isViewTop(LyConquestSeek)) {
            UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_ONE, "", 
            StrVal.LYCONQUESTSEEK.STR504, null, 
            "", null, 
            "", null, 
            StrVal.COMMON.STR33, () =>  {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyConquestSeek, 0, null);
            });
        }
    }
}