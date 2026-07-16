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
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { PointRedData } from "../Kernel/PointRedData";
import { ConquestState, LyConquestSeek } from "./LyConquestSeek";

export class LyConquestSeekTask extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyConquestSeek;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyConquestSeek;
        this.viewResI.comName = "LyConquestSeekTask";
    }

    selIndex:number;
    initSolo:boolean;
    initPlayer:boolean;

    public onViewCreate(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel()
        let group_main = uiPanel.getChild("group_main", fgui.GComponent)
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_close: fgui.GButton = uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyConquestSeekTask, 0, null);
        })

        let btn_close1: fgui.GButton = group_main.getChild("btn_close1");
        btn_close1.onClick(() => {
            btn_close.fireClick();
        })

        let label_title: fgui.GLabel = group_main.getChild("label_title")
        label_title.text = StrVal.LYCONQUESTSEEK.STR301;

        let label_desc: fgui.GLabel = group_main.getChild("label_desc")
        label_desc.text = StrVal.LYCONQUESTSEEK.STR302;

        let taskItems = new Array<any>();
		let items = LocaleData.getConquestTaskItems();
		for (let i = 0; i < items.length; i++) {
			taskItems.push(items[i]);
		}

        let conquestInfo = GameServerData.getInstance().getConquestInfo();

        let list_item: fgui.GList = group_main.getChild("list_item")
        list_item.setVirtual();
        list_item.itemRenderer = (index: number, group_item: fgui.GButton) => {
            let taskItem = taskItems[index];

            let label_name: fgui.GLabel = group_item.getChild("label_name")
            label_name.text = taskItem.taskdesc;

            let bonuseItems = UtilsUI.getBonuseItemsByBonusesId(taskItem.bonusesId);
            // 列表
            let __li_item:fgui.GList = group_item.getChild("list_item");
            __li_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], child, null);
            }
            __li_item.numItems = bonuseItems.length;

            let state = 1;
            let maxCount = Number(taskItem.target);
            let doneCount = 0;

            let record = LyConquestSeekTask.getTasksStatesRecord(taskItem.id);
            if (record) {
                state = record.status;
                doneCount = record.value;
            }

            let bar_count:fgui.GProgressBar = group_item.getChild("bar_count");
            bar_count.min = 0;
            bar_count.max = maxCount;
            bar_count.value = doneCount;

            let label_init:fgui.GTextField = group_item.getChild("label_init");
            label_init.text = StrVal.LYCONQUESTSEEK.STR303;

            let group_take = group_item.getChild("group_take", fgui.GComponent);
            let img_done:fgui.GImage = group_take.getChild("img_done");
            let label_done:fgui.GTextField = group_take.getChild("label_done");
            label_done.text = StrVal.LYACTIVITY_OPENCELEBARATION.STR6;

            let btn_take:fgui.GButton = group_take.getChild("btn_take");
            btn_take.text = StrVal.LYACTIVITY_OPENCELEBARATION.STR5;
            PointRedData.getInstance().updateManualPoint(btn_take, state == 2);
            btn_take.clearClick();
            btn_take.onClick(() => {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                        this.sortListData(list_item, taskItems);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "conquestFinishTask", {
                    taskId:taskItem.id,
                    claim:1
                });
            })

            label_init.visible = false;
            img_done.visible = false;
            label_done.visible = false;
            btn_take.visible = false;
            if (state == 1) { // 未完成
                label_init.visible = true;
            } else if (state == 2) { // 领取
                if (conquestInfo.activityInfo.phase == ConquestState.BATTLE) {
                    btn_take.visible = true;
                } else {
                    img_done.visible = true;
                    label_done.visible = true;
                }
            } else if (state == 3) { // 已领取
                img_done.visible = true;
                label_done.visible = true;
            }
        }
        this.sortListData(list_item, taskItems);
    };

    private sortListData(list_item: fgui.GList, taskItems:Array<any>): void {
        let __datas:Array<any> = taskItems;
        // 先按照id排序
        __datas.sort((itemA, itemB) => {
            return Number(itemA.id) - Number(itemB.id);
        })
        // 把可领取的插入开头
        // 把已领取的插入末尾
        let off = 0; // 注意这个偏移量，要的。
        for (let i = __datas.length - 1; i >= 0 + off; i--) {
            let state1 = 1;
            let record1 = LyConquestSeekTask.getTasksStatesRecord(__datas[i].id);
            if (record1) {
                state1 = record1.status;
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

        UtilsUI.setFguiGlistDelayNumItems(list_item, __datas.length);
    }

    private static getTasksStatesRecord(id: number | string): any {
        id = Number(id);
        let conquestInfo = GameServerData.getInstance().getConquestInfo();
        for (let i = 0; i < conquestInfo.tasks.length; i++) {
            if (conquestInfo.tasks[i].taskId == id) {
                return conquestInfo.tasks[i];
            }
        }
    }

    public getIsViewMask(): boolean {
        return false;
    };

    public static isViewRedPoint(): boolean {
        if (LyConquestSeek.isConquestOpen()) {
            let conquestInfo = GameServerData.getInstance().getConquestInfo();
        if (conquestInfo.activityInfo.phase == ConquestState.BATTLE) {
            let __datas:Array<any> = LocaleData.getConquestTaskItems();
            for (let i = 0; i < __datas.length; i++) {
                let record1 = LyConquestSeekTask.getTasksStatesRecord(__datas[i].id);
                if (record1 && record1.status == 2) {
                    return true;
                }
            }
        } 
        }
        return false;
    }
}