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
import { AudioManager } from "../Kernel/AudioManager";
import { GameServerData } from "../Kernel/GameServerData";
import { GameServer } from "../Kernel/GameServer";
import { LocaleData } from "../Kernel/LocaleData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { StrVal } from "../Values/StrVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { FguiGTween } from "../Kernel/FguiGTween";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { LyTreeRebateGift } from "./LyTreeRebateGift";

export class LyTreeRebate extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyTreeRebate;
        this.viewResI.pkgName = "LyTreeRebate";
        this.viewResI.comName = "LyTreeRebate";
    }

    private static isOncePlayDrop:boolean;

    private spinePlayer: SpinePlayer;
    private spineIndex: string = "0";
    private DRAW_ITEM_NUM:number = 7;
    private isPlayingGrop:boolean;

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTreeRebate, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let btn_gifts:fgui.GButton = group_main.getChild("btn_gifts");
        PointRedData.getInstance().registerPoint(btn_gifts, PointRedType.LyTreeRebateGift);
        btn_gifts.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTreeRebateGift, 0, null);
        })

        let btn_take:fgui.GButton = group_main.getChild("btn_take");
        PointRedData.getInstance().registerPoint(btn_take, PointRedType.LyTreeRebatePool);
        btn_take.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    // 事件里刷新
                    UtilsUI.showItemReward({bonuseItems:[UtilsUI.getBonuseItem(VarVal.bonusType.chance, null, null, String(args.chance))]});
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "takeTreeRebate", null);
        })

        let label_tips: fgui.GTextField = group_main.getChild("label_tips");
        let rebateChance = Math.floor(100 * Number(LocaleData.getActivityXml(VarVal.ACTIVITY_ID.TREE_REBATE).treeRate));
        label_tips.text = UtilsTool.stringFormat(StrVal.LYTREEREBATE.STR2, [rebateChance]);

        // 任务
        let group_task: fgui.GComponent = group_main.getChild("group_task");
        group_task.onClick(() => {
            if (GameServerData.getInstance().getPlayerFullInfo().rebateState == 2) {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        // 事件里刷新
                        UtilsUI.showItemReward({bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "takeTaskBonuses", {
                    id: GameServerData.getInstance().getPlayerFullInfo().rebateTaskId,
                });
            }
        })
        let label_chance:fgui.GTextField = group_main.getChild("label_chance");
        label_chance.text = GameServerData.getInstance().getPlayerFullInfo().base.chance;
        this.registerRequest((args) => { // 事件后到了
            if (args.key == "chance" && args.isNewValue) {
                label_chance.text = GameServerData.getInstance().getPlayerFullInfo().base.chance;
            }
        }, "playerAttrChanged");

        let group_item: fgui.GComponent = group_task.getChild("group_item");
        group_item.getChild("img_count").visible = false
        group_item.getChild("loader_spine_item").visible = false
        group_item.getChild("loader_back").visible = false

        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            spp.playAnimation("stand", true, null, null, () => {});
        }, group_task.getChild("loader_spine_get", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_main_task);

        this.spinePlayer = new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            this.spinePlayer = spp; // 如果是已存在缓存资源，那么会先执行回调，再赋值，这里要加一下。
            this.playSpine();
        }, group_main.getChild("loader_spine_main", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_jubaopen);

        for (let i = 0; i < this.DRAW_ITEM_NUM; i++) {
            let group_drawitem = group_main.getChild("group_drawitem" + String(i + 1), fgui.GComponent);
            let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.chance, null, null, "");
            UtilsUI.setUIGroupItem(bonuseItem, group_drawitem, null);
        }
        this.playDropAni(group_main);

        this.refreshTaskState();
        this.refreshActivityState();

        this.registerRequest((args) => {
            if (String(args.type) == VarVal.taskType.rebate) {
                this.refreshTaskState();
            }
        }, "taskChanged");
        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == VarVal.ACTIVITY_ID.TREE_REBATE) {
                this.refreshActivityState();
            }
        }, "activityStateChanged");
    }

    private playTweenAni(group_main:fgui.GComponent):void {
        for (let i = 0; i < this.DRAW_ITEM_NUM; i++) {
            let group_drawitem = group_main.getChild("group_drawitem" + String(i + 1), fgui.GComponent);
            this.addTween(group_drawitem, i);
        }
    }

    private playDropAni(group_main:fgui.GComponent):void {
        if (!LyTreeRebate.isOncePlayDrop) {
            LyTreeRebate.isOncePlayDrop = true;

            let dropCount = 0;
            let state = this.getState();
            let pool = state.pool;
            let today = state.today;
            for (let i = 0; i < this.DRAW_ITEM_NUM; i++) {
                if (pool >= i + 1) {
                    dropCount++;
                }
            }
            if (dropCount > 0) {
                UtilsUI.lockMask();
                this.isPlayingGrop = true;
                this.setTimeout(() => {
                    this.visibleGropItem(group_main, dropCount);
                    for (let i = 0; i < dropCount; i++) {
                        let group_drawitem = group_main.getChild("group_drawitem" + String(i + 1), fgui.GComponent);
                        let dropStartPos = group_main.localToGlobal(group_main.width * 0.5, group_main.height * 0.1);
                        let dropEndPos = group_main.localToGlobal(group_main.width * 0.5, group_main.height * 0.6);

                        let initX = group_drawitem.x;
                        let initY = group_drawitem.y;
                        let scale = group_drawitem.scaleX;
                        let alpha = group_drawitem.alpha;
                        UtilsUI.playCommonDropToAni(() => {
                            group_drawitem.x = initX;
                            group_drawitem.y = initY;
                            group_drawitem.scaleX = group_drawitem.scaleY = scale;
                            group_drawitem.alpha = alpha;

                            dropCount--;
                            if (dropCount == 0) {
                                UtilsUI.unlockMask();
                                this.isPlayingGrop = false;
                                this.visibleGropItem(group_main, today);
                                this.playTweenAni(group_main);
                            }
                        }, group_drawitem, dropStartPos, UtilsTool.random(-200, 200), 100, dropEndPos);
                    }
                }, 500)
            } else {
                this.playTweenAni(group_main);
            }
        } else {
            this.playTweenAni(group_main);
        }
    }

    private playSpine():void {
        if (this.spinePlayer.getSpineSke()) {
            this.spinePlayer.playAnimation("stand" + this.spineIndex, true, null, null, () => {});
        }
    }

    private refreshTaskState():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        let group_task: fgui.GComponent = group_main.getChild("group_task");
        let group_item: fgui.GComponent = group_task.getChild("group_item");

        let rebateState = GameServerData.getInstance().getPlayerFullInfo().rebateState;
        let taskInfo: any = LocaleData.getTaskRoot(GameServerData.getInstance().getPlayerFullInfo().rebateTaskId);
        let bonuseItems = UtilsUI.getBonuseItemsByBonusesId(taskInfo.bonusesId)
        UtilsUI.setUIGroupItem(bonuseItems[0], group_item, null);
        let taskNum: number = taskInfo.conditionParam.split(",")[0]
        let rebateCount: number = GameServerData.getInstance().getPlayerFullInfo().rebateCount;
        if (LocaleData.getTaskSpecialTaskType(taskInfo.conditionType)) {
            taskNum = 1
        }
        if (LocaleData.getTaskSpecialTaskType(taskInfo.conditionType)) {
            if (rebateState == 2) { // 可领取
                rebateCount = 1
            } else {
                rebateCount = 0
            }
        }
        let label_dec: fgui.GTextField = group_task.getChild("label_dec");
        label_dec.text = taskInfo.desc;

        let label_task: fgui.GTextField = group_task.getChild("label_task");
        label_task.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR2, [rebateCount, taskNum]);
        label_task.color = UtilsUI.getEnoughColor(rebateCount >= taskNum);

        let loader_spine_get: fgui.GLoader3D = group_task.getChild("loader_spine_get");
        loader_spine_get.visible = (rebateState == 2);
        group_item.grayed = (rebateState == 3);
    }

    private refreshActivityState():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        // 聚宝盆
        let state = this.getState();
        let pool = state.pool;
        let today = state.today;

        let label_today:fgui.GTextField = group_main.getChild("label_today");
        label_today.text = String(state.today);

        if (!this.isPlayingGrop) {
            this.visibleGropItem(group_main, today);
        }

        let label_pool:fgui.GTextField = group_main.getChild("label_pool");
        label_pool.text = UtilsTool.stringFormat(StrVal.LYTREEREBATE.STR1, [pool]);

        let pic:string;
        if (pool < 1) {
            pic = "0";
        } else if (pool < 10) {
            pic = "1";
        } else if (pool < 100) {
            pic = "2";
        } else {
            pic = "3";
        }
        this.spineIndex = pic;
        this.playSpine();
    }

    private visibleGropItem(group_main:fgui.GComponent, today:number):void {
        for (let i = 0; i < this.DRAW_ITEM_NUM; i++) {
            let group_drawitem = group_main.getChild("group_drawitem" + String(i + 1), fgui.GComponent);
            if (today >= i + 1) {
                group_drawitem.visible = true;
            } else {
                group_drawitem.visible = false;
            }
        }
    }

    private getState():any {
        let total = 0;
        let pool = 0;
        let today = 0;
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.TREE_REBATE);
        if (activityState && activityState.data) {
            total = activityState.data.activityRebateItem.total;
            pool = activityState.data.activityRebateItem.pool;
            today = activityState.data.activityRebateItem.today;
        }
        return {
            total:total,
            pool:pool,
            today:today
        }
    }

    private addTween(com:fgui.GComponent, idx:number){
        let yyy = 30;
        let ttt = 4;
        this.setTimeout(() => {
            if (!com.isDisposed) {
                let tw = FguiGTween.new(com).by(ttt, {y:yyy}, {easing: fgui.EaseType.SineOut}).by(ttt, {y:-yyy}, {easing: fgui.EaseType.SineOut}).repeat().start();
            }
        }, 1000 * ((idx + 1) / 10))
    }

    public getIsViewMask():boolean {
        return false;
    }

    public static isViewRedPointPool():boolean {
        let pool = 0;
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.TREE_REBATE);
        if (activityState && activityState.data) {
            pool = activityState.data.activityRebateItem.pool;
        }
        return pool >= 10;
    }

    public static isViewRedPointTask():boolean {
        return (GameServerData.getInstance().getPlayerFullInfo().rebateState == 2);
    }
}