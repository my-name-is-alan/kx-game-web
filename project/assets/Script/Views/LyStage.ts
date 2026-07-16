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
import { LyStageReward } from "./LyStageReward";
import { UtilsTool } from "../Kernel/UtilsTool";
import { LyDetailAttr, LyDetailAttrType } from "./LyDetailAttr";
import { VarVal } from "../Values/VarVal";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { AudioManager } from "../Kernel/AudioManager";

export class LyStage extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyStage;
        this.viewResI.pkgName = "LyStage";
        this.viewResI.comName = "LyStage";
    }
    public static isSkipPlayAni:boolean;

    private stageItem:any;

    public onViewCreate(): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");
        if (LyStage.isSkipPlayAni) {
            LyStage.isSkipPlayAni = false;
        } else {
            UtilsUI.playCommonGroupAniBook(group_main);
        }

        let label_reward: fgui.GTextField = group_main.getChild("label_reward");
        label_reward.text = StrVal.LYSTAGE.STR2;

        // 关闭
        let btn_back: fgui.GButton = getUiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyStage, 0, null);
        })

        // 章节奖励
        let btn_reward: fgui.GButton = group_main.getChild("btn_reward");
        PointRedData.getInstance().registerPoint(btn_reward, PointRedType.LyStageReward);
        btn_reward.text = StrVal.LYSTAGE.STR5;
        btn_reward.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyStageReward, 0, null);
        })

        // 挑战
        let btn_battle: fgui.GButton = group_main.getChild("btn_battle");
        PointRedData.getInstance().registerPoint(btn_battle, PointRedType.LyStageBattle);
        btn_battle.text = StrVal.LYSTAGE.STR4;
        btn_battle.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    let resultParams:BattleResultParams = {
                        battleResult: args.battleResult,
                        bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]),
                        typeInfo: {
                            type: VarVal.BATTLE_TYPE.STAGE,
                        }
                    }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleMain, 0, {
                        img_battle:this.stageItem.img_battle,
                        resultParams:resultParams,
                    });
                    // 通关后刷新本界面。
                    if (Number(this.stageItem.id) == args.stageId) {
                        this.refreshStage();
                    }
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "challengestage", {
                stageId:Number(this.stageItem.id)
            });
        })
        this.refreshStage();
    }

    private refreshStage(): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");

        let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
        this.stageItem = LocaleData.getStageItem(fullInfo.base.curStageLevel + 1);
        if (!this.stageItem) { // 最后一关。
            this.stageItem = LocaleData.getStageItem(fullInfo.base.curStageLevel);
        }
        let monsterProto = LocaleData.getMonsterProto(this.stageItem.monster_id);

        let loader_poster:fgui.GLoader = group_main.getChild("loader_poster");
        loader_poster.url = UtilsTool.stringFormat("ui://CCommonBG/{0}", [this.stageItem.img_poster]);

        let label_stage: fgui.GTextField = group_main.getChild("label_stage");
        label_stage.text = this.stageItem.stage_name;

        let label_chapter: fgui.GTextField = group_main.getChild("label_chapter");
        label_chapter.text = UtilsTool.stringFormat(StrVal.LYSTAGE.STR6, [this.stageItem.chapter_id, this.stageItem.stage_id])

        let label_monster: fgui.GTextField = group_main.getChild("label_monster");
        label_monster.text = monsterProto.monster_name;

        let label_info: fgui.GTextField = group_main.getChild("label_info");
        label_info.text = UtilsTool.nToFStr(monsterProto.monster_power);

        let btn_info: fgui.GButton = group_main.getChild("btn_info");
        btn_info.clearClick();
        btn_info.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDetailAttr, 0, {type:LyDetailAttrType.STAGEMONSTER, monsterProto:monsterProto});
        })

        let bonuseItems:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(this.stageItem.reward);
        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
        }
        list_item.numItems = bonuseItems.length;

        let eliteProtos:Array<any> = LocaleData.getEliteMonsterByMonsterProto(monsterProto);
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
        }, group_main.getChild("loader_spine_role"), monsterProto.modelId);
        if (monsterProto.pet_id.length > 1) {
            let petProto = LocaleData.getPetProto(monsterProto.pet_id);
            new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }, group_main.getChild("loader_spine_pet"), petProto.modelId);
        }
    }

    public getIsViewMask(): boolean {
        return false;
    }

    public static isViewRedPointBattle():boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.adventure)) {
            return false;
        }
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
        let stageItem = LocaleData.getStageItem(fullInfo.base.curStageLevel + 1);
        if (!stageItem) { // 最后一关。
            stageItem = LocaleData.getStageItem(fullInfo.base.curStageLevel);
        }
        let monsterProto = LocaleData.getMonsterProto(stageItem.monster_id);
        return fullInfo.base.combatPower >= Number(monsterProto.monster_power);
    }
}