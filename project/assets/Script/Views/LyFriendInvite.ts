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
import { UtilsUI } from "../Kernel/UtilsUI";
import { LocaleData } from "../Kernel/LocaleData";
import { GameServerData } from "../Kernel/GameServerData";
import { StrVal } from "../Values/StrVal";
import { PointRedData } from "../Kernel/PointRedData";
import { GameServer } from "../Kernel/GameServer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { AudioManager } from "../Kernel/AudioManager";

export class LyFriendInvite extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyFriendInvite;
        this.viewResI.pkgName = "LyFriendInvite";
        this.viewResI.comName = "LyFriendInvite";
    }

    private list_item:fgui.GList;
    private taskItems:Array<any>;
    private label_total:fgui.GTextField;

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyFriendInvite, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        this.label_total = group_main.getChild("label_total");

        this.taskItems = LocaleData.getTaskByType(VarVal.taskType.invite);

        this.list_item = group_main.getChild("list_item");
        this.list_item.setVirtual();
        this.list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            let taskData = this.taskItems[index];

            let label_name:fgui.GTextField = child.getChild("label_name");
            label_name.text = taskData.desc;

            let bonuseItems = UtilsUI.getBonuseItemsByBonusesId(taskData.bonusesId);
            // 列表
            let list_bonus:fgui.GList = child.getChild("list_item");
            list_bonus.itemRenderer = (idx:number, group_item:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[idx], group_item, null);
            }
            list_bonus.numItems = bonuseItems.length;

            let state = 1;
            let maxCount = Number(taskData.conditionParam);
            let doneCount = 0;

            let record = this.getTaskStateById(taskData.id);
            if (record) {
                state = record.state;
                doneCount = record.count;
            }

            let bar_count:fgui.GProgressBar = child.getChild("bar_count");
            bar_count.min = 0;
            bar_count.max = maxCount;
            bar_count.value = doneCount;

            let img_done:fgui.GImage = child.getChild("img_done");
            let label_done:fgui.GTextField = child.getChild("label_done");
            let btn_go:fgui.GButton = child.getChild("btn_go");
            btn_go.clearClick();
            btn_go.onClick(() => {
                UtilsUI.playerShareGame(null, {
                    title: StrVal.COMMON.STR302,
                    query: LyFriendInvite.getWXQuery()
                });
            })
            let btn_take:fgui.GButton = child.getChild("btn_take");
            PointRedData.getInstance().updateManualPoint(btn_take, state == 2);
            btn_take.clearClick();
            btn_take.onClick(() => {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                        // 事件刷新
                    }
                    else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "takeTaskBonuses", {
                    id: taskData.id,
                });
            })
            if (state == 1) { // 前往
                img_done.visible = false;
                label_done.text = "";
                btn_go.visible = true;
                btn_go.text = StrVal.LYFRIENDINVITE.STR1;
                btn_take.visible = false;
            } else if (state == 2) { // 领取
                img_done.visible = false;
                label_done.text = "";
                btn_go.visible = false;
                btn_take.visible = true;
                btn_take.text = StrVal.LYFRIENDINVITE.STR2;
            } else if (state == 3) { // 已领取
                img_done.visible = true;
                label_done.text = StrVal.LYFRIENDINVITE.STR3;
                btn_go.visible = false;
                btn_take.visible = false;
            }
        }
        this.sortListData();

        this.registerRequest((args) => {
            if (String(args.type) == VarVal.taskType.invite) {
                this.sortListData();
            }
        }, "taskChanged");
    }

    private sortListData(): void {
        let __datas:Array<any> = this.taskItems;
        // 先按照id排序
        __datas.sort((itemA, itemB) => {
            return Number(itemA.id) - Number(itemB.id);
        })
        // 把可领取的插入开头
        // 把已领取的插入末尾
        let off = 0; // 注意这个偏移量，要的。
        for (let i = __datas.length - 1; i >= 0 + off; i--) {
            let state1 = 1;
            let record1 = this.getTaskStateById(__datas[i].id);
            if (record1) {
                state1 = record1.state;
            }
            if (state1 == 3) {
                let arr = __datas.splice(i, 1);
                __datas.push(arr[0]);
            } else if (state1 == 2) {
                let arr = __datas.splice(i, 1);
                __datas.unshift(arr[0]);
                off++;
                i++;
            }
        }

        UtilsUI.setFguiGlistDelayNumItems(this.list_item, __datas.length);

        this.label_total.text = UtilsTool.stringFormat(StrVal.LYFRIENDINVITE.STR4, [this.getTaskCurrCount()]);
    }

    private getTaskCurrCount():number {
        let count = 0;
        let taskStates = GameServerData.getInstance().getTaskState(VarVal.taskType.invite);
        for (let i = 0; i < taskStates.length; i++) {
            if (taskStates[i].count > count) {
                count = taskStates[i].count;
            }
        }
        return count;
    }

    private getTaskStateById(id:string | number):any {
        id = Number(id);
        let taskStates = GameServerData.getInstance().getTaskState(VarVal.taskType.invite);
        for (let i = 0; i < taskStates.length; i++) {
            if (taskStates[i].id == id) {
                return taskStates[i];
            }
        }
    }

    public static getWXQuery():any {
        let loginParams = GameServer.getLoginParams();
        let openId:string = "";
        if (loginParams.userInfo.wxLoginData) {
            openId = loginParams.userInfo.wxLoginData.account.extdata1; // accountid;
        }
        return {
            type: "1",
            openid: openId,
            userid: loginParams.userInfo.userId,
            guid: GameServerData.getInstance().getPlayerFullInfo().base.guid
        };
    }

    public getIsViewMask():boolean {
        return false;
    }

    public static isViewRedPoint(isMainPage:boolean):boolean {
        let taskStates = GameServerData.getInstance().getTaskState(VarVal.taskType.invite);
        for (let i = 0; i < taskStates.length; i++) {
            if ((isMainPage && taskStates[i].state != 3) || (!isMainPage && taskStates[i].state == 2)) {
                return true;
            }
        }
        return false;
    }
}