//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServerData } from "../Kernel/GameServerData";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { BattleResultParams, BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { LyBattleMain } from "./LyBattleMain";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { VarVal } from "../Values/VarVal";
import { LyGuideDetail } from "./LyGuideDetail";
import { LyDetailAttr, LyDetailAttrType } from "./LyDetailAttr";
import { LyBattleResult } from "./LyBattleResult";
import { LyActivityMonsterTowerReward } from "./LyActivityMonsterTowerReward";
import { LyActivityMonsterTowerRank } from "./LyActivityMonsterTowerRank";
import { LyActivityMonsterTowerAddVal } from "./LyActivityMonsterTowerAddVal";
import { LyActivityMonsterTowerOneKey } from "./LyActivityMonsterTowerOneKey";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { AudioManager } from "../Kernel/AudioManager";

export class LyActivityMonsterTower extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyActivityMonsterTower;
        this.viewResI.pkgName = "LyActivityMonsterTower";
        this.viewResI.comName = "LyActivityMonsterTower";
    }
    public static isSkipPlayAni:boolean;

    private towerItem:any;
    private monsterProto:any;
    
    private isTowerEnd:boolean;
    private curTier:number;
    private highTier:number;
    private isQuick:boolean;
    private buffList:Array<number>;
    private buff:Array<any>;
    private isOneKeyAdd:boolean;

    public onViewCreate(params:any): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = uiPanel.getChild("group_main");
        if (LyActivityMonsterTower.isSkipPlayAni) {
            LyActivityMonsterTower.isSkipPlayAni = false;
        } else {
            UtilsUI.playCommonGroupAniBook(group_main);
        }

        let label_title: fgui.GTextField = group_main.getChild("label_title");
        label_title.text = params.outItem.name;

        let label_time:fgui.GButton = group_main.getChild("label_time");
        let timeCall = () => {
            let serverTime = GameServerData.getInstance().getServerTime() * 1000;
            let lastTime = UtilsTool.getNextDateTime(serverTime);
            let remain = lastTime - serverTime;
            label_time.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_MONSTERTOWER.STR6, [UtilsTool.splitTimeString(remain / 1000)]);
        }
        this.setInterval(timeCall, 1000);
        timeCall();

        let lastState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.MONSTOR_TOWER);
        this.registerRequest((args) => { // 凌晨刷新
            if (args.activityState.activityId == Number(VarVal.ACTIVITY_ID.MONSTOR_TOWER)) {
                let lastTier = 0;
                if (lastState && lastState.data) {
                    lastTier = lastState.data.activityTower.curTier;
                }
                lastState = args.activityState;
                let curTier = 0;
                if (lastState && lastState.data) {
                    curTier = lastState.data.activityTower.curTier;
                }
                if (lastTier != 0 && curTier == 0) { // 由于这里刷新比较复杂，通过标记判断是否重置时刻。
                    this.resetState(group_main);
                }
            }
        }, "activityStateChanged");

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityMonsterTower, 0, null);
        })

        // 介绍
        let btn_detail: fgui.GButton = group_main.getChild("btn_detail");
        btn_detail.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:params.outItem.name, detail:LocaleData.getActivityXml(VarVal.ACTIVITY_ID.MONSTOR_TOWER).detail});
        })

        // 怪物属性详情
        let label_info: fgui.GTextField = group_main.getChild("label_info");
        label_info.text = StrVal.LYACTIVITY_MONSTERTOWER.STR13;
        let btn_info: fgui.GButton = group_main.getChild("btn_info");
        btn_info.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDetailAttr, 0, {type:LyDetailAttrType.STAGEMONSTER, monsterProto:this.monsterProto});
        })
        let graph_info: fgui.GGraph = group_main.getChild("graph_info");
        graph_info.onClick(() => {
            btn_info.fireClick();
        })

        // 奖励
        let btn_reward: fgui.GButton = group_main.getChild("btn_reward");
        btn_reward.text = StrVal.LYACTIVITY_MONSTERTOWER.STR101;
        btn_reward.onClick(() => {
            let nowID:number;
            let towerItem = LocaleData.getTowerItem(this.highTier + 1);
            if (towerItem) {
                nowID = Number(towerItem.tierID);
            } else {
                towerItem = LocaleData.getTowerItem(this.highTier);
                nowID = Number(towerItem.tierID) + 1;
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityMonsterTowerReward, 0, {groupID:nowID});
        })

        // 排行榜
        let btn_rank: fgui.GButton = group_main.getChild("btn_rank");
        btn_rank.text = StrVal.LYACTIVITY_MONSTERTOWER.STR14;
        btn_rank.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityMonsterTowerRank, 0, args);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "towerRanks", null);
        })

        let label_reward1: fgui.GTextField = group_main.getChild("label_reward1");
        label_reward1.text = StrVal.LYACTIVITY_MONSTERTOWER.STR2;

        let label_reward2: fgui.GTextField = group_main.getChild("label_reward2");
        label_reward2.text = StrVal.LYACTIVITY_MONSTERTOWER.STR3;

        // 一键加成
        let btn_auto: fgui.GButton = group_main.getChild("btn_auto");
        PointRedData.getInstance().registerPoint(btn_auto, PointRedType.LyActivityMonsterTowerAuto);
        // btn_auto.text = StrVal.LYACTIVITY_MONSTERTOWER.STR7;
        btn_auto.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityMonsterTowerOneKey, 0, null);
        })

        let label_add: fgui.GTextField = group_main.getChild("label_add");
        label_add.text = StrVal.LYACTIVITY_MONSTERTOWER.STR5;

        // 挑战
        let btn_battle: fgui.GButton = group_main.getChild("btn_battle");
        PointRedData.getInstance().registerPoint(btn_battle, PointRedType.LyActivityMonsterTowerBattle);
        btn_battle.onClick(() => {
            if (this.buffList && this.buffList.length > 0) {
                if (this.isOneKeyAdd) {
                    UtilsUI.lockWait();
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait();
                        if (args.errorcode == 0) {
                            this.refreshState();
                            LyActivityMonsterTower.fillAttr8Comp(group_main.getChild("group_attr8"), this.towerItem, this.buff);
                        } else {
                            UtilsUI.showMsgTip(args.errorcode);
                        }
                    }, "towerBuff", {
                        buff:0,
                        trench:0,
                    });
                } else {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityMonsterTowerAddVal, 0, {towerItem:this.towerItem});
                }
            } else {
                let lastSlotCount = this.buff.length;
                let lasttierID = this.towerItem.tierID;
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        let bonuseString:string;
                        if (args.bonusesResultArr && args.bonusesResultArr.length > 0) {
                            bonuseString = GameServerData.getInstance().bonusesResultsToString(args.bonusesResultArr);
                        }
                        let resultParams:BattleResultParams = {
                            battleResult: args.battleResult,
                            bonuseString: bonuseString,
                            typeInfo: {
                                type: VarVal.BATTLE_TYPE.MONSTER_TOWER,
                            }
                        }
                        if (this.isQuick) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleResult, 0, resultParams);
                        } else {
                            resultParams.typeInfo.towerCDCall = () => {
                                if (this.buffList && this.buffList.length > 0) {
                                    if (!this.isOneKeyAdd) {
                                        btn_battle.fireClick();
                                    }
                                } else {
                                    btn_battle.fireClick();
                                }
                            }
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleMain, 0, {
                                img_battle:this.towerItem.img_battle,
                                resultParams:resultParams,
                            });
                        }
                        this.refreshState();
                        if (!this.isQuick) { // 下一关文本在刷新后填充吧。
                            resultParams.typeInfo.towerCDText = UtilsTool.stringFormat(StrVal.LYBATTLE_RESULT.STR3, [this.towerItem.tierID, this.towerItem.stageID]);
                        }
                        if (lastSlotCount != this.buff.length || (this.isOneKeyAdd && lasttierID != this.towerItem.tierID)) { // 槽开放或升级层
                            LyActivityMonsterTower.fillAttr8Comp(group_main.getChild("group_attr8"), this.towerItem, this.buff);
                        }
                        this.refreshShowTower();
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "towerFight", null);
            }
        })
        
        this.resetState(group_main);
    }

    private resetState(group_main:fgui.GComponent): void {
        this.refreshState();
        LyActivityMonsterTower.fillAttr8Comp(group_main.getChild("group_attr8"), this.towerItem, this.buff);
        this.refreshShowTower();
    }

    public onViewUpdate(params: any): void {
        this.refreshState();
        if (params.type == 1) {
            let getUiPanel: fgui.GComponent = this.getUiPanel();
            let group_main: fgui.GComponent = getUiPanel.getChild("group_main");

            LyActivityMonsterTower.fillAttr8Comp(group_main.getChild("group_attr8"), this.towerItem, this.buff);
        }
    }

    private refreshState(): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");

        this.curTier = 0;
        this.highTier = 0;
        this.isQuick = false;
        this.buffList = null;
        this.buff = null;
        this.isOneKeyAdd = false;
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.MONSTOR_TOWER);
        if (activityState && activityState.data) {
            this.curTier = activityState.data.activityTower.curTier;
            this.highTier = activityState.data.activityTower.highTier;
            this.isQuick = (activityState.data.activityTower.quick != 0);
            this.buffList = activityState.data.activityTower.buffList;
            this.buff = activityState.data.activityTower.buff;
            this.isOneKeyAdd = (activityState.data.activityTower.preinstallStart == 1);
        }
        this.towerItem = LocaleData.getTowerItem(this.curTier + 1);
        if (!this.towerItem) { // 最后一关。
            this.isTowerEnd = true;
            this.towerItem = LocaleData.getTowerItem(this.curTier);
        } else {
            this.isTowerEnd = false;
        }
        this.monsterProto = LocaleData.getMonsterProto(this.towerItem.monsterID);

        let btn_battle: fgui.GButton = group_main.getChild("btn_battle");
        btn_battle.grayed = this.isTowerEnd;
        if (this.buffList && this.buffList.length > 0) {
            if (this.isOneKeyAdd) {
                btn_battle.text = StrVal.LYACTIVITY_MONSTERTOWER.STR9;
            } else {
                btn_battle.text = StrVal.LYACTIVITY_MONSTERTOWER.STR10;
            }
        } else {
            if (this.isQuick) {
                btn_battle.text = StrVal.LYACTIVITY_MONSTERTOWER.STR8;
            } else {
                btn_battle.text = StrVal.LYACTIVITY_MONSTERTOWER.STR11;
            }
        }

        // let btn_auto: fgui.GButton = group_main.getChild("btn_auto");
        // btn_auto.grayed = !this.isOneKeyAdd;
    }

    public static fillAttr8Comp(group_attr8: fgui.GComponent, towerItem:any, slotBuffs:Array<any>, isUseList?:boolean, isCanSelect?:boolean): void {
        let trenchs = LocaleData.getTowerTrenchItems();
        let fillListItem = (slot:number, group_item:fgui.GComponent) => {
            let loader_back: fgui.GLoader = group_item.getChild("loader_back");
            let label_lock: fgui.GTextField = group_item.getChild("label_lock");
            let label_attr: fgui.GTextField = group_item.getChild("label_attr");
            let label_level: fgui.GTextField = group_item.getChild("label_level");
            let loader_level: fgui.GLoader = group_item.getChild("loader_level");
            loader_level.visible = true;
            let img_arrow: fgui.GImage = group_item.getChild("img_arrow");

            img_arrow.visible = false;
            UtilsUI.setUIDescTipItem(group_item, null);

            let trench = trenchs[slot];
            let quality = "0";
            let quality_p:string;
            if (slot < slotBuffs.length) {
                let slotBuff = slotBuffs[slot];
                if (slotBuff && slotBuff.buffId > 0) {
                    let buffItem = LocaleData.getTowerBuffItem(slotBuff.buffId);
                    quality = buffItem.trait;
                    label_lock.text = "";
                    label_attr.text = buffItem.name;
                    quality_p = buffItem.trait;
                    label_level.text = String(slotBuff.buffLevel);

                    if (!isCanSelect) {
                        UtilsUI.setUIDescTipItem(group_item, {
                            name:label_attr.text,
                            level:label_level.text,
                            desc:UtilsTool.stringFormat(StrVal.LYDETAILATTR.STR204, [StrVal.ENTITI_NAMES[Number(buffItem.buffId)], Number(buffItem.buffParam) * slotBuff.buffLevel])
                        });
                    }
                } else {
                    quality = "";
                    label_lock.text = "";
                    label_attr.text = "";
                    label_level.text = "";
                }
            } else {
                let openTowerItem = LocaleData.getTowerItem(Number(trench.tierID) + 1);
                label_lock.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_MONSTERTOWER.STR12, [openTowerItem.tierID, openTowerItem.stageID]);
                label_attr.text = "";
                label_level.text = "";
            }
            loader_back.url = UtilsTool.stringFormat("ui://LyActivityMonsterTower/frame_buff{0}", [quality]);
            loader_level.url = UtilsTool.stringFormat("ui://LyActivityMonsterTower/frame_buff-subscript{0}", [quality_p]);
        }
        // 列表1
        let list_attr:fgui.GList = group_attr8.getChild("list_attr");
        if (isUseList) {
            list_attr.itemRenderer = (slot:number, group_item:fgui.GComponent) => {
                fillListItem(slot, group_item);

                if (isCanSelect) {
                    let btn_frame:fgui.GButton = group_item.getChild("btn_frame");
                    btn_frame.mode = fgui.ButtonMode.Check; // 选中才会显示选中框
                    btn_frame.clearClick();
                    btn_frame.onClick(() => {
                        if (slot < slotBuffs.length) {
                            let childIdx = list_attr.itemIndexToChildIndex(slot);
                            for (let i: number = 0; i < list_attr.numChildren; i++) {
                                let child: fgui.GComponent = list_attr.getChildAt(i);
                                let btn_frame:fgui.GButton = child.getChild("btn_frame");
                                btn_frame.selected = (i == childIdx);
                            }
                        }
                    })
                }
            }
            list_attr.numItems = trenchs.length;

            if (isCanSelect) {
                let childIdx = list_attr.itemIndexToChildIndex(0);
                for (let i: number = 0; i < list_attr.numChildren; i++) {
                    let child: fgui.GComponent = list_attr.getChildAt(i);
                    let btn_frame:fgui.GButton = child.getChild("btn_frame");
                    btn_frame.selected = (i == childIdx);
                }
            }
        } else {
            list_attr.visible = false;
            group_attr8.getChild("group_attr").visible = true;
            for (let slot = 0; slot < 8; slot++) {
                fillListItem(slot, group_attr8.getChild("group_attr" + slot));
            }
        }
    }

    private refreshShowTower(): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");

        let loader_poster:fgui.GLoader = group_main.getChild("loader_poster");
        loader_poster.url = UtilsTool.stringFormat("ui://CCommonBG/{0}", [this.towerItem.img_poster]);

        let label_stage: fgui.GTextField = group_main.getChild("label_stage");
        label_stage.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_MONSTERTOWER.STR4, [this.towerItem.tierID, this.towerItem.stageID]);

        let bonuseItems1:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(this.towerItem.farstBonuseID);
        // 列表1
        let list_item1:fgui.GList = group_main.getChild("list_item1");
        list_item1.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            UtilsUI.setUIGroupItem(bonuseItems1[index], group_item, null);
            let img_dark:fgui.GGraph = group_item.getChild("img_dark");
            let img_check:fgui.GImage = group_item.getChild("img_check");
            if (this.curTier < this.highTier) {
                img_dark.visible = true;
                img_check.visible = true;
            } else {
                img_dark.visible = false;
                img_check.visible = false;
            }
        }
        list_item1.numItems = bonuseItems1.length;

        let bonuseItems2:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(this.towerItem.bonuseID);
        // 列表2
        let list_item2:fgui.GList = group_main.getChild("list_item2");
        list_item2.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            UtilsUI.setUIGroupItem(bonuseItems2[index], group_item, null);
        }
        list_item2.numItems = bonuseItems2.length;

        let eliteProtos:Array<any> = LocaleData.getEliteMonsterByMonsterProto(this.monsterProto);
        // 列表
        let list_elite:fgui.GList = group_main.getChild("list_elite");
        list_elite.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            UtilsUI.setUIEliteItem(eliteProtos[index], group_item, null);
        }
        list_elite.numItems = eliteProtos.length;
        group_main.getChild("group_elite").visible = eliteProtos.length > 0;

        // spine模型
        new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, group_main.getChild("loader_spine_role"), this.monsterProto.modelId);
        if (this.monsterProto.pet_id.length > 1) {
            let petProto = LocaleData.getPetProto(this.monsterProto.pet_id);
            new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }, group_main.getChild("loader_spine_pet"), petProto.modelId);
        }
    }

    public getIsViewMask(): boolean {
        return false;
    }

    public static isViewRedPointBattle():boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.monster_tower)) {
            return false;
        }
        let curTier = 0;
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.MONSTOR_TOWER);
        if (activityState && activityState.data) {
            curTier = activityState.data.activityTower.curTier;
        }
        return curTier == 0;
    }

    public static isViewRedPointAuto():boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.monster_tower)) {
            return false;
        }
        let isOneKeyAdd = false;
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.MONSTOR_TOWER);
        if (activityState && activityState.data) {
            isOneKeyAdd = (activityState.data.activityTower.preinstallStart == 1);
        }
        return !isOneKeyAdd;
    }
}