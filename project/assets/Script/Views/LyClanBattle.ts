//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { Color } from "cc";
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BattleResultParams, BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyBattleMain } from "./LyBattleMain";
import { LyClanBattleRank } from "./LyClanBattleRank";
import { LyClanBattleReward } from "./LyClanBattleReward";
import { LyClanBattleTask } from "./LyClanBattleTask";
import { LyClanLog } from "./LyClanLog";
import { LyClanPopup } from "./LyClanPopup";
import { LyCompanionInfo } from "./LyCompanionInfo";
import { LyGuideDetail } from "./LyGuideDetail";

export class LyClanBattle extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanBattle";
    }
    private uiPanel: fgui.GComponent
    private clanRootXml: any

    public onViewCreate(): void {
        this.uiPanel = this.getUiPanel().getChild("group_clanBattle")
        UtilsUI.playCommonGroupAniBook(this.uiPanel);
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanBattle, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanBattle, 0, null);
        })
        this.uiPanel.getChild("label_str73", fgui.GLabel).text = StrVal.LYCLAN.STR73
        this.uiPanel.getChild("label_str74", fgui.GLabel).text = StrVal.LYCLAN.STR74
        this.uiPanel.getChild("label_str78", fgui.GLabel).text = StrVal.LYCLAN.STR78
        this.uiPanel.getChild("label_str79", fgui.GLabel).text = StrVal.LYCLAN.STR79
        let btn_clanLog: fgui.GButton = this.uiPanel.getChild("btn_clanLog");
        btn_clanLog.onClick(() => {
            // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanLog, 0, { type: 1 });
        })
        let btn_calnPopup1: fgui.GButton = this.uiPanel.getChild("btn_calnPopup1");
        btn_calnPopup1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanPopup, 0, { tispType: 1 });
        })
        let btn_calnPopup3: fgui.GButton = this.uiPanel.getChild("btn_calnPopup3");
        btn_calnPopup3.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanPopup, 0, { tispType: 3 });
        })

        let btn_rank: fgui.GButton = this.uiPanel.getChild("btn_rank")
        btn_rank.text = StrVal.LYCLAN.STR77
        btn_rank.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    let data = {
                        rank: args.myRankOf,
                        ranks: args.members,
                        dailyDuelDamage: this.myselfInfo.dailyDuelDamage
                    }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanBattleRank, 0, data);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "getClanDuelDamageRank", {
            })
        })



        this.onClanBattle()
        this.onClanDuelBuff()
    };

    private myselfInfo
    //布局界面更新
    private onClanDuelBuff(): void {
        let btn_task: fgui.GButton = this.uiPanel.getChild("btn_task")
        btn_task.text = StrVal.LYCLAN.STR76
        PointRedData.getInstance().registerPoint(btn_task, PointRedType.LyClanBattleTask);
        btn_task.clearClick()
        btn_task.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanBattleTask, 0, null);
        })
        let btn_reward: fgui.GButton = this.uiPanel.getChild("btn_reward")
        PointRedData.getInstance().registerPoint(btn_reward, PointRedType.LyClanBattleReward);
        btn_reward.text = StrVal.LYCLAN.STR75
        btn_reward.clearClick()
        btn_reward.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanBattleReward, 0, null);
        })

        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanInfo = playerClanInfo.clanInfo
        this.myselfInfo = playerClanInfo.myselfInfo
        let label_duelBuffAttr: fgui.GLabel = this.uiPanel.getChild("label_duelBuffAttr")
        label_duelBuffAttr.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR8, [clanInfo.duelBuffCount * this.clanRootXml.buffAttrBonus])
        let label_duelBuffCount: fgui.GLabel = this.uiPanel.getChild("label_duelBuffCount")
        label_duelBuffCount.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR9, [clanInfo.duelBuffCount, this.clanRootXml.maxBuffCount])
        let btn_clanDuelBuff: fgui.GButton = this.uiPanel.getChild("btn_clanDuelBuff")
        btn_clanDuelBuff.visible = this.myselfInfo.dailyDuelBuffTime == "0"
        this.btn_clanDuel.visible = this.myselfInfo.dailyDuelBuffTime != "0"
        btn_clanDuelBuff.text = StrVal.LYCLAN.STR61
        btn_clanDuelBuff.clearClick()
        btn_clanDuelBuff.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    UtilsUI.showMsgTip(StrVal.LYCLAN.STR146)
                    this.onClanDuelBuff()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "clanDuelBuff", {

            })
        })
    }

    private btn_clanDuel: fgui.GButton
    private onClanBattle(): void {
        let maxBoss: boolean = false
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanInfo = playerClanInfo.clanInfo
        let clanMember = playerClanInfo.clanMember
        let myselfInfo = playerClanInfo.myselfInfo
        let clanMonsterXml: any
        if (LocaleData.getClanMonsterById(clanInfo.duelMonsterId)) {
            clanMonsterXml = LocaleData.getClanMonsterById(clanInfo.duelMonsterId)
        } else {
            //通关了
            clanMonsterXml = LocaleData.getClanMonsterById(clanInfo.duelMonsterId - 1)
            maxBoss = true
        }
        this.clanRootXml = LocaleData.getClanRoot()
        let btn_duelDesc: fgui.GButton = this.uiPanel.getChild("btn_duelDesc")
        btn_duelDesc.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, { title: StrVal.LYCLAN.STR73, detail: this.clanRootXml.duelDesc });
        })
        let monsterData: any = LocaleData.getMonsterProto(clanMonsterXml.monsterId)
        //怪物模型
        let loader_spine: fgui.GLoader3D = this.uiPanel.getChild("loader_spine")
        new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, loader_spine, monsterData.modelId);
        //怪物名字
        let label_monsterName: fgui.GLabel = this.uiPanel.getChild("label_monsterName")
        label_monsterName.text = monsterData.monster_name
        //怪物血量
        let group_blood: fgui.GComponent = this.uiPanel.getChild("group_blood")
        let bar_blood: fgui.GProgressBar = group_blood.getChild("bar_blood")
        bar_blood.max = monsterData.hp
        bar_blood.value = clanInfo.duelMonsterHP

        let label_dec: fgui.GLabel = group_blood.getChild("label_dec")
        label_dec.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR20, [clanMonsterXml.damageReward])
        //奖励
        let list_duelBonuses: fgui.GList = this.uiPanel.getChild("list_duelBonuses")
        let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(clanMonsterXml.duelBonusesId);
        // 列表
        list_duelBonuses.itemRenderer = (index: number, group_item: fgui.GComponent) => {
            UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
        }
        list_duelBonuses.numItems = bonuseItems.length;
        let label_damageReward: fgui.GLabel = group_blood.getChild("label_damageReward")
        // label_damageReward.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR5, [
        //     Math.round(Number(clanInfo.duelMonsterHP) / Number(monsterData.hp) * (100 / clanMonsterXml.damageReward)),
        //        100 / Number(clanMonsterXml.damageReward)])
        label_damageReward.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR5, [Math.round((100 / Number(clanMonsterXml.damageReward)))
            - Math.round(((Number(monsterData.hp) - Number(clanInfo.duelMonsterHP)) / Number(monsterData.hp) * 100 / Number(clanMonsterXml.damageReward)))
            , Math.round(100 / clanMonsterXml.damageReward)])
        let label_dailyDuelCount: fgui.GLabel = this.uiPanel.getChild("label_dailyDuelCount")
        label_dailyDuelCount.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR10, [(myselfInfo.dailyDuelAvailableCount)])
        this.btn_clanDuel = this.uiPanel.getChild("btn_clanDuel")
        this.btn_clanDuel.enabled = myselfInfo.dailyDuelAvailableCount != 0
        this.btn_clanDuel.visible = myselfInfo.dailyDuelBuffTime != "0"
        this.btn_clanDuel.clearClick()
        this.btn_clanDuel.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    let damageNum = Math.round(args.damage / monsterData.hp * 100)
                    let resultParams: BattleResultParams = {
                        battleResult: args.battleResult,
                        bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]),
                        typeInfo: {
                            type: VarVal.BATTLE_TYPE.CLAN,
                            desc1: args.damageRewardCount > 0 ?
                                UtilsTool.stringFormat(StrVal.LYCLAN.STR30, [monsterData.monster_name, UtilsTool.nToFStr(args.damage), damageNum > 100 ? 100 : damageNum, args.damageRewardCount]) :
                                UtilsTool.stringFormat(StrVal.LYCLAN.STR29, [monsterData.monster_name, UtilsTool.nToFStr(args.damage), damageNum > 100 ? 100 : damageNum]),
                            desc3: UtilsTool.stringFormat(StrVal.LYCLAN.STR15, [clanMonsterXml.damageReward]),
                        }
                    }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleMain, 0, {
                        resultParams: resultParams,
                    });
                    this.onClanBattle()
                    this.onClanDuelBuff()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "clanDuel", null)
        })
        // let bonuseArr: Array<BonuseItem> = []
        // let maxNum: Number = clanInfo.duelMonsterId
        // for (let i = myselfInfo.dailyDuelMonsterReward + 1; i < clanInfo.duelMonsterId; i++) {
        //     let clanMonster: any = LocaleData.getClanMonsterById(i)
        //     let bonuseItem: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(clanMonster.duelBonusesId);
        //     for (let j = 0; j < bonuseItem.length; j++) {
        //         const element = bonuseItem[j];
        //         bonuseArr.push(element)
        //     }
        // }
        // let clanRoot: any = maxBoss ? LocaleData.getClanRoot() + 1 : LocaleData.getClanRoot()
        // let boxNum: number = clanInfo.duelRewardNum - myselfInfo.dailyDuelRewardNum
        // for (let i = 0; i < boxNum; i++) {
        //     let Items: BonuseItem = UtilsUI.getBonuseItemsByBonusesId(clanRoot.boxItemId)[0];
        //     bonuseArr.push(Items)
        // }
        // UtilsUI.getBonuseItemsByBonusesId(clanMonsterXml.duelBonusesId);
        // let list_reward: fgui.GList = this.uiPanel.getChild("list_reward")
        // list_reward.itemRenderer = (index: number, obj: fgui.GComponent) => {
        //     UtilsUI.setUIGroupItem(bonuseArr[index], obj, null);
        // }
        // list_reward.numItems = bonuseArr.length;
        // let btn_clanDuelClaimReward: fgui.GButton = this.uiPanel.getChild("btn_clanDuelClaimReward")
        // btn_clanDuelClaimReward.enabled = bonuseArr.length > 0
        // btn_clanDuelClaimReward.clearClick()
        // btn_clanDuelClaimReward.onClick(() => {
        //     UtilsUI.lockWait()
        //     GameServer.getInstance().send((args: any) => {
        //         UtilsUI.unlockWait()
        //         if (args.errorcode == 0) {
        //             console.log(args.claimReward);
        //             console.log("aaaaaaaaaaaaaaaaaaaaaaa");
        //             UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString(args.claimReward) });
        //             this.onClanBattle()
        //         } else {
        //             UtilsUI.showMsgTip(args.errorcode)
        //         }
        //     }, "clanDuelClaimReward", {
        //     })
        // })
    }

    public static isViewRedPointDuel(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.clan) || !GameServerData.getInstance().isClanHas()) {
            return false;
        }
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let myselfInfo = playerClanInfo.myselfInfo
        if (UtilsTool.TimeToDateStr(myselfInfo.joinTime) == UtilsTool.TimeToDateStr(GameServerData.getInstance().getServerTime())) {
            return false;
        }

        if (myselfInfo.dailyDuelBuffTime == 0) {
            return true
        }
        if (myselfInfo.dailyDuelAvailableCount > 0) {
            return true
        }
        return false
    }


    public getIsViewMask(): boolean {
        return false;
    };

}