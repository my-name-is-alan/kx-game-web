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
import { PayItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { GameServer } from "../Kernel/GameServer";
import { GuideManager } from "../Kernel/GuideManager";
import { LyGuideDetail } from "./LyGuideDetail";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { AudioManager } from "../Kernel/AudioManager";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { LyPayExquisite, PayExquisitePage } from "./LyPayExquisite";

export class LyActivityReincarnationHall extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyActivityReincarnationHall;
        this.viewResI.pkgName = "LyActivityReincarnationHall";
        this.viewResI.comName = "LyActivityReincarnationHall";
    }

    private dynamicParam:any;

    private list_tab1:fgui.GList;
    private list_tab2:fgui.GList;
    private list_init:Array<boolean> = new Array<boolean>(false, false);

    private payShowType:number;
    private lastGiftData:any;

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let group_main:fgui.GComponent = this.getUiPanel();

        this.dynamicParam = params.dynamicParam;

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityReincarnationHall, 0, null);
        })

        let btn_detail:fgui.GButton = group_main.getChild("btn_detail");
        btn_detail.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:this.dynamicParam.name, detail:this.dynamicParam.detail});
        })

        // 前往
        let btn_goto: fgui.GButton = group_main.getChild("btn_goto");
        btn_goto.text = this.dynamicParam.desc;
        btn_goto.onClick(() => {
            let taskData = this.dynamicParam.data.taskGroup[0];
            if (taskData.type == VarVal.ReincarnationHallTaskType.costAnimalStone) { // 抽宠物
                GuideManager.startGuide({
                    guideType: VarVal.GUIDE_TYPE.PET_CALL,
                });
            } else if (taskData.type == VarVal.ReincarnationHallTaskType.dhamaPump) { // 抽法宝
                GuideManager.startGuide({
                    guideType: VarVal.GUIDE_TYPE.FABAO_CALL,
                });
            } else if (taskData.type == VarVal.ReincarnationHallTaskType.gremlinCall) { // 抽精怪
                GuideManager.startGuide({
                    guideType: VarVal.GUIDE_TYPE.ELITE_CALL,
                });
            } else if (taskData.type == VarVal.ReincarnationHallTaskType.theurgyPump) { // 抽神通
                GuideManager.startGuide({
                    guideType: VarVal.GUIDE_TYPE.THEURG_CALL,
                });
            }
        })

        let btn_addchance:fgui.GButton = group_main.getChild("btn_addchance");
        if (PlatformAPI.isBinaryExamine() && PlatformAPI.isMiniGameOniOS()) {
            btn_addchance.visible = false;
        }
        btn_addchance.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.RECHARGE, type:VarVal.bonusType.chance});
        })

        let btn_add:fgui.GButton = group_main.getChild("btn_add");
        if (PlatformAPI.isBinaryExamine() && PlatformAPI.isMiniGameOniOS()) {
            btn_add.visible = false;
        }
        btn_add.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.RECHARGE, type:VarVal.bonusType.stone});
        })

        let lastState = GameServerData.getInstance().getActivityState(this.dynamicParam.id);
        this.registerRequest((args) => {
            if (args.activityState.activityId == this.dynamicParam.id) {
                if (this.payShowType == 2 && this.lastGiftData) {
                    let oldrecord = LyActivityReincarnationHall.getDaysGiftsRecord(this.dynamicParam.id, this.lastGiftData.id, lastState);
                    let newrecord = LyActivityReincarnationHall.getDaysGiftsRecord(this.dynamicParam.id, this.lastGiftData.id);
                    if (oldrecord.tookCount != newrecord.tookCount) {
                        UtilsUI.showItemReward({
                            bonuseString:this.lastGiftData.bonuses,
                            rebateBonuseItems:UtilsUI.getRebateBonuseItems()
                        });
                    }
                }
                if (this.payShowType == 1) {
                    this.sortListData(1);
                } else if (this.payShowType == 2) {
                    this.sortListData(2);
                }
                lastState = args.activityState;

                this.setLabelLunCi();
            }
        }, "activityStateChanged");

        let btn_tab1:fgui.GButton = group_main.getChild("btn_tab1");
        PointRedData.getInstance().registerPoint(btn_tab1, PointRedType.LyActivityReincarnationHallTask, this.dynamicParam.id);
        btn_tab1.text = StrVal.LYACTIVITY_REINCARNATIONHALL.STR1;
        btn_tab1.onClick(() => {
            if (this.payShowType != 1) {
                this.payShowType = 1;
                this.setViewPage();
            }
        })

        let btn_tab2:fgui.GButton = group_main.getChild("btn_tab2");
        PointRedData.getInstance().registerPoint(btn_tab2, PointRedType.LyActivityReincarnationHallGifts, this.dynamicParam.id);
        btn_tab2.text = StrVal.LYACTIVITY_REINCARNATIONHALL.STR2;
        btn_tab2.onClick(() => {
            if (this.payShowType != 2) {
                this.payShowType = 2;
                this.setViewPage();
            }
        })

        let label_time:fgui.GButton = group_main.getChild("label_time");
        let timeCall = () => {
            let remainTime = this.dynamicParam.endTime - GameServerData.getInstance().getServerTime();
            label_time.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_REINCARNATIONHALL.STR3, [UtilsTool.parseTimeToString(remainTime)]);
        }
        this.setInterval(timeCall, 1000);
        timeCall();

        let doSendTaskBonuses = (taskData) => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                    // 事件里刷新
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "takeReincarnationHallTaskBonuses", {
                activityId:this.dynamicParam.id,
                taskId:taskData.id
            });
        }

        this.list_tab1 = group_main.getChild("list_tab1", fgui.GList);
        this.list_tab1.setVirtual();
        this.list_tab1.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let taskData = this.dynamicParam.data.taskGroup[index];

            let label_name:fgui.GTextField = group_item.getChild("label_name");
            label_name.text = taskData.name;

            let label_desc:fgui.GTextField = group_item.getChild("label_desc");
            label_desc.text = StrVal.LYACTIVITY_REINCARNATIONHALL.STR4;

            let state = 0;
            let maxCount = Number(taskData.params);
            let doneCount = 0;

            let record = this.getTasksStatesRecord(taskData.id);
            if (record) {
                state = record.state;
                doneCount = record.value;
            }

            let bar_count:fgui.GProgressBar = group_item.getChild("bar_count");
            bar_count.min = 0;
            bar_count.max = maxCount;
            bar_count.value = doneCount;

            let bonuseItems = UtilsUI.getBonuseItemsByString(taskData.bonuses);
            // 列表
            let list_item:fgui.GList = group_item.getChild("list_item");
            list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                let gggitem:fgui.GComponent = child.getChild("group_item");
                if (state == 0) { // 前往
                    UtilsUI.setUIGroupItem(bonuseItems[index], gggitem, null);
                } else if (state == 1) { // 领取
                    UtilsUI.setUIGroupItem(bonuseItems[index], gggitem, () => {
                        doSendTaskBonuses(taskData);
                    });
                } else if (state == 2) { // 已领取
                    UtilsUI.setUIGroupItem(bonuseItems[index], gggitem, null);
                }
                this.playAnim(child, state == 1);
                gggitem.getChild("img_check").visible = state == 2;
                gggitem.getChild("img_dark").visible = state == 2;
            }
            list_item.numItems = bonuseItems.length;
        }

        this.list_tab2 = group_main.getChild("list_tab2", fgui.GList);
        this.list_tab2.setVirtual();
        this.list_tab2.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let giftData = this.dynamicParam.data.giftsGroup[index];
            let giftItem:PayItem;
            if (giftData.type == VarVal.ReincarnationHallGiftType.free) {
                giftItem = {
                    money:String(giftData.param) // 0,-1
                }
            } else if (giftData.type == VarVal.ReincarnationHallGiftType.recharge) {
                giftItem = LocaleData.getPayItem(giftData.param);
            }

            let label_name:fgui.GTextField = group_item.getChild("label_name");
            label_name.text = giftData.name;

            let bonuseItems = UtilsUI.getBonuseItemsByString(giftData.bonuses);
            // 列表
            let list_item:fgui.GList = group_item.getChild("list_item");
            list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], child, null);
            }
            list_item.numItems = bonuseItems.length;

            let maxCount = giftData.maxBuyCount;
            let buyCount = 0;
            let record = LyActivityReincarnationHall.getDaysGiftsRecord(this.dynamicParam.id, giftData.id);
            if (record) {
                buyCount = record.tookCount;
            }

            let label_count:fgui.GTextField = group_item.getChild("label_count");
            if (buyCount > 0) {
                label_count.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR302, [maxCount - buyCount, maxCount]);
                label_count.color = UtilsUI.getEnoughColor(maxCount - buyCount > 0);
            } else {
                let str:string;
                if (giftData.refreshType == VarVal.ReincarnationHallGiftRefreshType.days) {
                    str = StrVal.LYPAY_RECHARGE.STR301;
                } else if (giftData.refreshType == VarVal.ReincarnationHallGiftRefreshType.never) {
                    str = StrVal.LYPAY_RECHARGE.STR304;
                }
                label_count.text = UtilsTool.stringFormat(str, [maxCount]);
                label_count.color = UtilsUI.getEnoughColor(true);
            }

            let btn_buy:fgui.GButton;
            if (giftData.type == VarVal.ReincarnationHallGiftType.stone) {
                group_item.getChild("group_rebeatfan").visible = false;
                btn_buy = group_item.getChild("btn_buy");
                UtilsUI.setButtonIcon(btn_buy, VarVal.bonusType.stone, String(giftData.param));
            } else {
                UtilsUI.setPayItemRebateComp(group_item.getChild("group_rebeatfan"), giftItem);
                btn_buy = UtilsUI.setPayItemButtonName(group_item.getChild("btn_buy"), giftItem);
            }
            PointRedData.getInstance().updateManualPoint(btn_buy, giftData.type == VarVal.ReincarnationHallGiftType.free && maxCount - buyCount > 0);
            btn_buy.clearClick();
            btn_buy.onClick(() => {
                this.lastGiftData = giftData;
                if (giftData.type == VarVal.ReincarnationHallGiftType.recharge) {
                    UtilsUI.payRechargeItem((errmsg:string) => {
                        if (errmsg) {
                            UtilsUI.showMsgTip(errmsg);
                        }
                    }, giftItem, VarVal.payType.others, VarVal.payGiftType.daily);
                } else {
                    UtilsUI.lockWait();
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait();
                        if (args.errorcode == 0) {
                            // 事件里刷新
                        } else {
                            UtilsUI.showMsgTip(args.errorcode);
                        }
                    }, "takeReincarnationHallGiftsBonuses", {
                        activityId:this.dynamicParam.id,
                        id:giftData.id
                    });
                }
            })
            if (maxCount - buyCount > 0) {
                btn_buy.grayed = false;
                btn_buy.enabled = true;
            } else {
                btn_buy.grayed = true;
                btn_buy.enabled = false;
                UtilsUI.setButtonIcon(btn_buy, null, StrVal.LYPAY_ACTIVITYS.STR102);
            }
        }

        if (params) {
            this.payShowType = params.type;
        } else {
            this.payShowType = 1;
        }
        this.setViewPage();
    }

    private setViewPage():void {
        let group_main:fgui.GComponent = this.getUiPanel();

        let btn_tab1:fgui.GButton = group_main.getChild("btn_tab1");
        btn_tab1.selected = this.payShowType == 1;
        let btn_tab2:fgui.GButton = group_main.getChild("btn_tab2");
        btn_tab2.selected = this.payShowType == 2;

        // this.dynamicParam.data.background = "pic_zhaomumenke";
        let aaa = this.payShowType == 1 ? "1" : "";
        let loader_poster = group_main.getChild("loader_poster", fgui.GLoader);
        loader_poster.url = UtilsTool.stringFormat("ui://LyActivityReincarnationHall/{0}{1}", [this.dynamicParam.data.background, aaa]);

        this.list_tab1.visible = false;
        this.list_tab2.visible = false;

        if (this.payShowType == 1) {
            this.list_tab1.visible = true;
            if (!this.list_init[this.payShowType - 1]) {
                this.list_init[this.payShowType - 1] = true;
                this.sortListData(1);
            }
        } else if (this.payShowType == 2) {
            this.list_tab2.visible = true;
            if (!this.list_init[this.payShowType - 1]) {
                this.list_init[this.payShowType - 1] = true;
                this.sortListData(2);
            }
        }

        this.setLabelLunCi();
    }

    private setLabelLunCi():void {
        let group_main:fgui.GComponent = this.getUiPanel();

        let btn_goto: fgui.GButton = group_main.getChild("btn_goto");
        btn_goto.visible = this.payShowType == 1;

        let count:number = 1;
        let activityState = GameServerData.getInstance().getActivityState(this.dynamicParam.id);
        if (activityState && activityState.data) {
            count = activityState.data.activityReincarnationHall.currentReincarnation;
        }

        let img_lunci = group_main.getChild("img_lunci");
        let label_lunci:fgui.GButton = group_main.getChild("label_lunci");
        label_lunci.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_REINCARNATIONHALL.STR6, [count, this.dynamicParam.data.maxReincarnationCount]);

        label_lunci.visible = this.payShowType == 1;
        img_lunci.visible = this.payShowType == 1;

        this.onViewUpdate(null);
    }

    public onViewUpdate(params: any): void {
        let group_main:fgui.GComponent = this.getUiPanel();

        let label_chance:fgui.GButton = group_main.getChild("label_chance");
        let label_stone:fgui.GButton = group_main.getChild("label_stone");

        let base = GameServerData.getInstance().getPlayerFullInfo().base;
        label_chance.text = String(base.chance);
        label_stone.text = String(base.stone);
    }

    private playAnim(com:fgui.GComponent, isPlay: boolean){
        if (isPlay) {
            com.getTransition("t0").play(null , -1)
        }else{
            com.getTransition("t0").stop()
        }
    }

    private sortListData(idx: number): any {
        if (idx == 1) {
            let __datas:Array<any> = this.dynamicParam.data.taskGroup;
            // 先按照id排序
            __datas.sort((itemA, itemB) => {
                return itemA.id - itemB.id;
            })
            // 把可领取的插入开头
            // 把已领取的插入末尾
            let off = 0; // 注意这个偏移量，要的。
            for (let i = __datas.length - 1; i >= 0 + off; i--) {
                let state1 = 0;
                let record1 = this.getTasksStatesRecord(__datas[i].id);
                if (record1) {
                    state1 = record1.state;
                }
                if (state1 == 2) {
                    let arr = __datas.splice(i, 1);
                    __datas.push(arr[0]);
                } else if (state1 == 1) {
                    let arr = __datas.splice(i, 1);
                    __datas.unshift(arr[0]);
                    off++;
                    i++;
                }
            }

            UtilsUI.setFguiGlistDelayNumItems(this.list_tab1, __datas.length);
        } else if (idx == 2) {
            let __datas:Array<any> = this.dynamicParam.data.giftsGroup;
            // 先按照id排序
            __datas.sort((itemA, itemB) => {
                return itemA.id - itemB.id;
            })
            // 把已购买的插入末尾
            for (let i = __datas.length - 1; i >= 0; i--) {
                let maxCount1 = Number(__datas[i].maxBuyCount);
                let buyCount1 = 0;
                let record1 = LyActivityReincarnationHall.getDaysGiftsRecord(this.dynamicParam.id, __datas[i].id);
                if (record1) {
                    buyCount1 = record1.tookCount;
                }
                if (maxCount1 - buyCount1 <= 0) {
                    let arr = __datas.splice(i, 1);
                    __datas.push(arr[0])
                }
            }

            UtilsUI.setFguiGlistDelayNumItems(this.list_tab2, __datas.length);
        }
    }

    private getTasksStatesRecord(id: number | string): any {
        id = String(id);
        let activityState = GameServerData.getInstance().getActivityState(this.dynamicParam.id);
        if (activityState && activityState.data) {
            let tasksStates:Array<any> = activityState.data.activityReincarnationHall.tasksStates;
            for (let i = 0; i < tasksStates.length; i++) {
                if (tasksStates[i].id == id) {
                    return tasksStates[i];
                }
            }
        }
    }

    private static getDaysGiftsRecord(activityId:number | string, id: number, lastState?:any): any {
        let activityState:any;
        if (lastState) {
            activityState = lastState;
        } else {
            activityState = GameServerData.getInstance().getActivityState(activityId);
        }
        if (activityState && activityState.data) {
            let giftsRecords:Array<any> = activityState.data.activityReincarnationHall.giftsRecords;
            for (let i = 0; i < giftsRecords.length; i++) {
                if (giftsRecords[i].id == id) {
                    return giftsRecords[i];
                }
            }
        }
    }

    public static isViewRedPointTask(activityId:number | string):boolean {
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
            let tasksStates:Array<any> = activityState.data.activityReincarnationHall.tasksStates;
            for (let i = 0; i < tasksStates.length; i++) {
                if (tasksStates[i].state == 1) {
                    return true;
                }
            }
        }
        return false;
    }

    public static isViewRedPointGifts(activityId:number | string):boolean {
        let dynamicParam = GameServerData.getInstance().getDynamicActivityParam(activityId);
        let giftsGroup:Array<any> = dynamicParam.data.giftsGroup;
        for (let i = 0; i < giftsGroup.length; i++) {
            let giftData = giftsGroup[i];
            if (giftData.type == VarVal.ReincarnationHallGiftType.free) {
                let maxCount = giftData.maxBuyCount;
                let buyCount = 0;
                let record = LyActivityReincarnationHall.getDaysGiftsRecord(activityId, giftData.id);
                if (record) {
                    buyCount = record.tookCount;
                }
                if (maxCount - buyCount > 0) {
                    return true;
                }
            }
        }
        return false;
    }
}