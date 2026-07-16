//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BattleResultParams, BonuseItem, MonthCardItemType, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { StrVal } from "../Values/StrVal";
import { GameServer } from "../Kernel/GameServer";
import { LyBattleMain } from "./LyBattleMain";
import { LyGuideDetail } from "./LyGuideDetail";
import { PointRedData } from "../Kernel/PointRedData";
import { AudioManager } from "../Kernel/AudioManager";

export class LyActivityKingMonster extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyActivityKingMonster;
        this.viewResI.pkgName = "LyActivityKingMonster";
        this.viewResI.comName = "LyActivityKingMonster";
    }

    private static isCheckSel:boolean = false;
    private list_king:fgui.GList;

    private speedIdx:number; // 已开放且已通关的最后一个（速战）
    private openIdx:number; // 已开放的最后一个（挑战）
    private chalIdx:number; // 当前挑战

    private kings:Array<any>;
    private activityXml:any;

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        this.activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.KING_MONSTER);
        this.kings = LyActivityKingMonster.getKingItems();

        this.registerRequest((args) => { // 凌晨刷新
            if (args.activityState.activityId == Number(VarVal.ACTIVITY_ID.KING_MONSTER)) {
                this.updateListItems();
            }
        }, "activityStateChanged");

        let label_title:fgui.GButton = group_main.getChild("label_title");
        label_title.text = params.outItem.name;

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityKingMonster, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let btn_detail:fgui.GButton = group_main.getChild("btn_detail");
        btn_detail.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:params.outItem.name, detail:this.activityXml.detail});
        })

        let label_desc:fgui.GButton = group_main.getChild("label_desc");
        label_desc.text = this.activityXml.desc;

        // 列表
        this.list_king = group_main.getChild("list_king");
        this.list_king.setVirtual();
        this.list_king.itemRenderer = (index:number, child:fgui.GComponent) => {
            let kingItem = this.kings[index];
            
            let monsterProto = LocaleData.getMonsterProto(kingItem.monsterID);
            let modelShowInfo = LocaleData.getModelShowInfo(monsterProto.modelId);
            let openPhase:string = LocaleData.getConditionItem(kingItem.conditionID).paramList;
            let levelItem = LocaleData.getPlayerPhaseById(openPhase);

            let loader_icon:fgui.GLoader = child.getChild("group_head", fgui.GComponent).getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [modelShowInfo.icon]);

            // let label_level:fgui.GTextField = child.getChild("label_level");
            // label_level.text = levelItem.name;
            let loader_phase:fgui.GComponent = child.getChild("loader_phase");
            UtilsUI.setTitleIconByTitleId(loader_phase, openPhase);

            let bonuseID:string = kingItem.bonuseID;

            let label_addition:fgui.GTextField = child.getChild("label_addition");
            label_addition.text = "";

            let btn_speed:fgui.GButton = child.getChild("btn_speed");
            PointRedData.getInstance().updateManualPoint(btn_speed, false);
            btn_speed.clearClick();
            let btn_stone:fgui.GButton = child.getChild("btn_stone");
            btn_stone.clearClick();
            let btn_challenge:fgui.GButton = child.getChild("btn_challenge");
            btn_challenge.clearClick();
            let label_done:fgui.GTextField = child.getChild("label_done");
            label_done.text = StrVal.ACTIVITY_KINGMONSTER.STR1;
            let img_done:fgui.GImage = child.getChild("img_done");
            let label_count:fgui.GTextField = child.getChild("label_count");
            let label_open:fgui.GTextField = child.getChild("label_open");
            let img_lock:fgui.GImage = child.getChild("img_lock");

            btn_speed.visible = false;
            btn_stone.visible = false;
            btn_challenge.visible = false;
            label_done.visible = false;
            img_done.visible = false;
            label_count.visible = false;
            label_open.visible = false;
            img_lock.visible = false;
            if (index > this.chalIdx) { // 待解锁
                if (index <= this.openIdx) {
                    label_open.text = StrVal.ACTIVITY_KINGMONSTER.STR10;
                } else {
                    label_open.text = UtilsTool.stringFormat(StrVal.ACTIVITY_KINGMONSTER.STR2, [levelItem.name]);
                }
                label_open.visible = true;
                img_lock.visible = true;
            } else {
                if (index == this.speedIdx) { // 速战
                    let speedInfo = LyActivityKingMonster.getKingSpeedInfo(kingItem.quickGroup);
                    if (speedInfo.quickRem <= 0) {
                        speedInfo = LyActivityKingMonster.getKingSpeedInfo(kingItem.quickGroup, speedInfo.quickMax);
                    }
                    bonuseID = speedInfo.quickItem.bonuseID;
                    let needStone:number;
                    if (speedInfo.quickItem.costID.length > 2) {
                        needStone = Number(speedInfo.quickItem.costID.split(",")[1]);
                    } else {
                        needStone = 0;
                    }

                    label_count.visible = true;
                    label_count.text = UtilsTool.stringFormat(StrVal.ACTIVITY_KINGMONSTER.STR4, [speedInfo.quickRem, speedInfo.quickMax]);
                    label_count.color = UtilsUI.getEnoughColor(speedInfo.quickRem > 0);

                    if (speedInfo.quickRem > 0) {
                        let onClick:Function = () => {
                            UtilsUI.lockWait();
                            GameServer.getInstance().send((args: any) => {
                                UtilsUI.unlockWait();
                                if (args.errorcode == 0) {
                                    let companion:string;
                                    let palace:string;
                                    if (args.companionBoostBonuses) {
                                        companion = GameServerData.getInstance().bonusesResultsToString([args.companionBoostBonuses]);
                                    }
                                    if (args.palaceBoostBonuses) {
                                        palace = GameServerData.getInstance().bonusesResultsToString([args.palaceBoostBonuses]);
                                    }
                                    UtilsUI.showItemReward({
                                        bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]),
                                        bonuseStringCompanion:companion,
                                        bonuseStringPalace:palace,
                                    });
                                    // 活动变化刷新本界面。
                                } else {
                                    UtilsUI.showMsgTip(args.errorcode);
                                }
                            }, "monsterKingChallenge", {
                                id:kingItem.id,
                                isQuick:1
                            });
                        }
                        if (needStone > 0) {
                            btn_stone.visible = true;
                            UtilsUI.setButtonIcon(btn_stone, VarVal.bonusType.stone, String(needStone));
                            let stone:number = GameServerData.getInstance().getPlayerFullInfo().base.stone;
                            btn_stone.titleColor = UtilsUI.getEnoughColor(stone >= needStone);
                            btn_stone.onClick(() => {
                                if (LyActivityKingMonster.isCheckSel) {
                                    onClick();
                                } else {
                                    UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "", 
                                    UtilsTool.stringFormat(StrVal.ACTIVITY_KINGMONSTER.STR7, [needStone, UtilsUI.getItemIconUrl(VarVal.bonusType.stone)]), null, 
                                    StrVal.COMMON.STR32, null, 
                                    StrVal.COMMON.STR33, (isCheckSel:boolean) => {
                                        LyActivityKingMonster.isCheckSel = isCheckSel;
                                        onClick();
                                    }, "", null, {
                                        checkBoxText: StrVal.COMMON.STR35
                                    })
                                }
                            })
                        } else {
                            PointRedData.getInstance().updateManualPoint(btn_speed, true);
                            btn_speed.visible = true;
                            btn_speed.enabled = true;
                            btn_speed.text = StrVal.ACTIVITY_KINGMONSTER.STR3;
                            btn_speed.onClick(onClick);
                        }
                    } else {
                        btn_speed.visible = true;
                        btn_speed.enabled = false;
                        btn_speed.text = StrVal.ACTIVITY_KINGMONSTER.STR5;
                    }
                    label_addition.text = this.getCompanionDesc();
                } else if (index == this.chalIdx) { // 挑战（所以要先判断速战后，才是挑战）
                    btn_challenge.visible = true;
                    btn_challenge.text = StrVal.ACTIVITY_KINGMONSTER.STR6;
                    PointRedData.getInstance().updateManualPoint(btn_challenge, true);
                    btn_challenge.onClick(() => {
                        UtilsUI.lockWait();
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait();
                            let resultParams:BattleResultParams = {
                                battleResult: args.battleResult,
                                bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]),
                                typeInfo: {
                                    type: VarVal.BATTLE_TYPE.KING_MONSTER,
                                }
                            }
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleMain, 0, {
                                resultParams:resultParams,
                            });
                            // 活动变化刷新本界面。
                        }, "monsterKingChallenge", {
                            id:kingItem.id,
                            isQuick:0
                        });
                    })
                } else { // 已挑战
                    label_done.visible = true;
                    img_done.visible = true;

                    let speedInfo = LyActivityKingMonster.getKingSpeedInfo(kingItem.quickGroup, 1);
                    bonuseID = speedInfo.quickItem.bonuseID;
                }
            }
            
            this.updateKingBonuses(child.getChild("list_item"), bonuseID, label_addition.text.length > 0);

            let group_quick = child.getChild("group_quick");
            if (!this.initBTNY) {
                this.initBTNY = group_quick.y;
            }
            group_quick.y = label_addition.text.length > 0 ? (this.initBTNY + 20) : this.initBTNY;
        }
        this.updateListItems();
    }
    private initBTNY:number;

    private static getKingSpeedInfo(groupID:string, rem?:number):any {
        let quickMax:number = LocaleData.getKingMonsterMaxCount(); // 最大次数
        let quickCnt:number = 0;
        let quickItem:any;

        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.KING_MONSTER);
        if (activityState && activityState.data) {
            quickCnt = activityState.data.activityKingMonster.quickCnt;
        }
        let curNum = quickCnt + 1; // 第几次速通
        if (rem) {
            curNum = rem;
        }
        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.KING_MONSTER);
        let quickItems:Array<any> = activityXml._quick[0]._item;
        for (let i = 0; i < quickItems.length; i++) {
            if (quickItems[i].groupID == groupID && Number(quickItems[i].cnt) == curNum) {
                quickItem = quickItems[i];
                break;
            }
        }
        if (!quickItem) { // 这里在数据表中必须填有足够数量，此处只是防错。
            quickItem = quickItems[quickItems.length - 1];
        }
        return {
            quickRem:quickMax - quickCnt,
            quickMax:quickMax,
            quickItem:quickItem
        }
    }

    private static getKingMonsterData(id:string | number):any {
        id = Number(id);
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.KING_MONSTER);
        if (activityState && activityState.data) {
            let kingDatas:Array<any> = activityState.data.activityKingMonster.data;
            for (let i = 0; i < kingDatas.length; i++) {
                if (kingDatas[i].id == id) {
                    return kingDatas[i];
                }
            }
        }
    }

    private static getAtcIndexs():any {
        let speedIdx = -1;
        let openIdx = -1;
        let chalIdx = 0;
        let isHitChallenge = false;

        let currPhase:number = GameServerData.getInstance().getPlayerFullInfo().base.phase;
        let kings = LyActivityKingMonster.getKingItems();
        for (let i = 0; i < kings.length; i++) {
            let kingItem = kings[i];
            let openPhase:string = LocaleData.getConditionItem(kingItem.conditionID).paramList;
            if (currPhase >= Number(openPhase)) {
                openIdx = i;
                let kingData = LyActivityKingMonster.getKingMonsterData(kingItem.id);
                if (kingData && (kingData.state == 1 || kingData.state == 2)) {
                    if (!isHitChallenge) {
                        chalIdx = i;
                        /* 给服务器防错
                        现在是：
                        {id:"1001", state:2}
                        {id:"1002", state:1} 
                        {id:"1003", state:1} 
                        {id:"1004", state:1} 
                        {id:"1005", state:1} 
                        应该是：
                        {id:"1001", state:2}
                        {id:"1002", state:1} 
                        {id:"1003", state:0} 
                        {id:"1004", state:0} 
                        {id:"1005", state:0} 
                        */
                        if (kingData.state == 1) {
                            isHitChallenge = true;
                        }
                    }
                }
                if (kingData && kingData.state == 2) {
                    speedIdx = i;
                }
            }
        }

        return {speedIdx:speedIdx, openIdx:openIdx, chalIdx:chalIdx}
    }

    private updateListItems() {
        let actData = LyActivityKingMonster.getAtcIndexs();
        this.speedIdx = actData.speedIdx;
        this.openIdx = actData.openIdx;
        this.chalIdx = actData.chalIdx;

        this.list_king.numItems = this.kings.length;

        // 滚动到当前
        this.list_king.scrollToView(Math.max(Math.max(this.speedIdx, 0), this.chalIdx));
    }

    private initY:number;
    private updateKingBonuses(list_item:fgui.GList, bonuseID:string, isAdd:boolean):void {
        let bonuseItems:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(bonuseID);
        list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
        }
        list_item.numItems = bonuseItems.length;

        if (!this.initY) {
            this.initY = list_item.y;
        }
        if (isAdd) {
            list_item.y = this.initY + 20;
        } else {
            list_item.y = this.initY;
        }
    }

    public static getKingItems():Array<any> {
        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.KING_MONSTER);
        return activityXml._item[0]._item;
    }

    private getCompanionDesc():string {
        let desc:string = "";
        let companion = GameServerData.getInstance().getCompanionData(VarVal.kingAddCompanion);
        if (companion && companion.phase > 0) {
            let companionProto = LocaleData.getCompanionById(VarVal.kingAddCompanion);
            let ttt = companionProto.boostValue.split(",");
            let attr = ttt[companion.phase - 1];
            if (!attr) {
                attr = ttt[ttt.length - 1];
            }
            desc = UtilsTool.stringFormat(StrVal.ACTIVITY_KINGMONSTER.STR11, [companionProto.name, attr]);
        }
        return desc;
    }

    public getIsViewMask():boolean {
        return false;
    }

    public static getQuickData():any {
        let quickMax:number = LocaleData.getKingMonsterMaxCount();
        let quickCnt:number = 0;
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.KING_MONSTER);
        if (activityState && activityState.data) {
            quickCnt = activityState.data.activityKingMonster.quickCnt;
        }
        return {quickMax:quickMax, quickCnt:quickCnt};
    }

    public static isViewRedPoint():boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.king_monster)) {
            return false;
        }
        let actData = LyActivityKingMonster.getAtcIndexs();
        let speedIdx = actData.speedIdx;
        let chalIdx = actData.chalIdx;
        /*
        let kings = LyActivityKingMonster.getKingItems();
        for (let index = 0; index < kings.length; index++) {
            let kingItem = kings[index];
            if (index > chalIdx) { // 待解锁
            } else {
                if (index == speedIdx) { // 速战
                    let speedInfo = LyActivityKingMonster.getKingSpeedInfo(kingItem.quickGroup);
                    let needStone:number;
                    if (speedInfo.quickItem.costID.length > 2) {
                        needStone = Number(speedInfo.quickItem.costID.split(",")[1]);
                    } else {
                        needStone = 0;
                    }
                    if (speedInfo.quickRem > 0) {
                        if (needStone <= 0) {
                            return true;
                        }
                    }
                }
            }
        }
        */
        let quickData:any = LyActivityKingMonster.getQuickData();
        if (quickData.quickMax - quickData.quickCnt > 0 || chalIdx > speedIdx) {
            return true;
        }
        return false;
    }
}