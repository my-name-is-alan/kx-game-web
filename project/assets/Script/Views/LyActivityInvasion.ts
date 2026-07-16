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
import { LyActivityInvasionReward } from "./LyActivityInvasionReward";
import { LyActivityInvasionRank } from "./LyActivityInvasionRank";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { AudioManager } from "../Kernel/AudioManager";

export class LyActivityInvasion extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyActivityInvasion;
        this.viewResI.pkgName = "LyActivityInvasion";
        this.viewResI.comName = "LyActivityInvasion";
    }
    public static isSkipPlayAni:boolean;

    private activityXml:any;
    private invasionItem:any;
    private maxCount:number;
    private remainCount:number;

    public onViewCreate(params:any): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");
        if (LyActivityInvasion.isSkipPlayAni) {
            LyActivityInvasion.isSkipPlayAni = false;
        } else {
            UtilsUI.playCommonGroupAniBook(group_main);
        }

        this.activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.INVASION);
        this.maxCount = Number(this.activityXml.challengeCount);

        let label_title: fgui.GTextField = group_main.getChild("label_title");
        label_title.text = params.outItem.name;

        let label_chapter: fgui.GTextField = group_main.getChild("label_chapter");
        label_chapter.text = StrVal.LYACTIVITY_INVASION.STR1;

        let label_time:fgui.GButton = group_main.getChild("label_time");
        let timeCall = () => {
            let serverTime = GameServerData.getInstance().getServerTime() * 1000;
            let lastTime = UtilsTool.getNextDateTime(serverTime);
            let remain = lastTime - serverTime;
            label_time.text = UtilsTool.splitTimeString(remain / 1000);
        }
        this.setInterval(timeCall, 1000);
        timeCall();

        this.registerRequest((args) => { // 凌晨刷新
            if (args.activityState.activityId == Number(VarVal.ACTIVITY_ID.INVASION)) {
                this.refreshStage();
            }
        }, "activityStateChanged");
        
        let label_reward: fgui.GTextField = group_main.getChild("label_reward");
        label_reward.text = StrVal.LYACTIVITY_INVASION.STR2;

        // 关闭
        let btn_back: fgui.GButton = getUiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityInvasion, 0, null);
        })

        // 详情
        let btn_detail: fgui.GButton = group_main.getChild("btn_detail");
        btn_detail.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:params.outItem.name, detail:this.activityXml.desc});
        })

        // 排行奖励
        let btn_reward: fgui.GButton = group_main.getChild("btn_reward");
        btn_reward.text = StrVal.LYACTIVITY_INVASION.STR5;
        btn_reward.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityInvasionReward, 0, null);
        })

        // 每日排行
        let btn_rank: fgui.GButton = group_main.getChild("btn_rank");
        btn_rank.text = StrVal.LYACTIVITY_INVASION.STR7;
        btn_rank.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityInvasionRank, 0, args);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "getInvasionRank", {
                from:1,
                to:200,
            });
        })

        // 挑战
        let btn_battle: fgui.GButton = group_main.getChild("btn_battle");
        PointRedData.getInstance().registerPoint(btn_battle, PointRedType.LyActivityInvasionBattle);
        btn_battle.text = StrVal.LYACTIVITY_INVASION.STR4;
        btn_battle.onClick(() => {
            if (this.remainCount <= 0) {
                UtilsUI.showMsgTip(StrVal.LYACTIVITY_INVASION.STR12);
                return;
            }
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    let bonuseString:string;
                    if (args.bonusesResultArr) {
                        bonuseString = GameServerData.getInstance().bonusesResultsToString(args.bonusesResultArr);
                    }
                    let resultParams:BattleResultParams = {
                        battleResult: args.battleResult,
                        bonuseString: bonuseString,
                        typeInfo: {
                            type: VarVal.BATTLE_TYPE.INVASION,
                            damage: args.damage,
                        }
                    }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleMain, 0, {
                        img_battle:this.invasionItem.img_battle,
                        resultParams:resultParams,
                    });
                    // 事件刷新
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "challengeInvasion", null);
        })
        this.refreshStage();
    }

    private refreshStage(): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");

        this.invasionItem = null;
        let invasionItems:Array<any> = this.activityXml._Invasion[0]._item;
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.INVASION);
        if (activityState && activityState.data) {
            this.remainCount = activityState.data.activityInvasion.challengeCount;
            for (let i = 0; i < invasionItems.length; i++) { 
                if (invasionItems[i].phaseId == String(activityState.data.activityInvasion.curPhase)) {
                    this.invasionItem = invasionItems[i];
                }
            }
        } else {
            this.remainCount = this.maxCount;
        }
        if (!this.invasionItem) {
            this.invasionItem = invasionItems[0];
        }
        let monsterProto = LocaleData.getMonsterProto(this.invasionItem.monsterId.split(",")[0]);

        let loader_poster:fgui.GLoader = group_main.getChild("loader_poster");
        loader_poster.url = UtilsTool.stringFormat("ui://CCommonBG/{0}", [this.invasionItem.img_poster]);

        let label_monster: fgui.GTextField = group_main.getChild("label_monster");
        label_monster.text = monsterProto.monster_name;

        let bonuseItems:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(this.invasionItem.bonusesId);
        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            bonuseItems[index].count = "";
            UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
        }
        list_item.numItems = bonuseItems.length;

        let label_count: fgui.GTextField = group_main.getChild("label_count");
        label_count.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_INVASION.STR11, [UtilsUI.getEnoughColorToHEX(this.remainCount > 0), this.remainCount, this.maxCount]);

        // 挑战
        let btn_battle: fgui.GButton = group_main.getChild("btn_battle");
        btn_battle.grayed = (this.remainCount <= 0);

        // spine模型
        new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, group_main.getChild("loader_spine_role"), monsterProto.modelId);
        if (monsterProto.pet_id.length > 1) {
            let petProto = LocaleData.getPetProto(monsterProto.pet_id);
            new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }, group_main.getChild("loader_spine_pet"), petProto.modelId);
        }
    }

    public static getChallengeCount():number {
        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.INVASION);
        return Number(activityXml.challengeCount) - LyActivityInvasion.getRemainCount();
    }

    public static getRemainCount():number {
        let remainCount:number;
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.INVASION);
        if (activityState && activityState.data) {
            remainCount = activityState.data.activityInvasion.challengeCount;
        } else {
            let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.INVASION);
            remainCount = Number(activityXml.challengeCount);
        }
        return remainCount;
    }

    public getIsViewMask(): boolean {
        return false;
    }

    public static isViewRedPoint():boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.invasion)) {
            return false;
        }
        let remainCount:number = LyActivityInvasion.getRemainCount();
        return remainCount > 0;
    }
}