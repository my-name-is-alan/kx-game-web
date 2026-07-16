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
import { LocaleData, ModelShowInfo } from "../Kernel/LocaleData";
import { LocaleUser } from "../Kernel/LocaleUser";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BattleResultParams, BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyBattleMain } from "./LyBattleMain";
import { LyBattleResult } from "./LyBattleResult";
import { LyClanSoloAttr } from "./LyClanSoloAttr";
import { LyClanSoloBattleResult } from "./LyClanSoloBattleResult";
import { LyClanSoloBuff } from "./LyClanSoloBuff";
import { LyClanSoloTisp } from "./LyClanSoloTisp";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanSoloMain extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClanSolo";
        this.viewResI.pkgName = "LyClanSolo";
        this.viewResI.comName = "LyClanSoloMain";
    }
    private uiPanel: fgui.GComponent
    private label_winScoreChange: fgui.GLabel
    private btn_skip: fgui.GButton

    private fullInfo: any

    private battleOver: any = null
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel()
        // UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloMain, 0, null);
        })
        // let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        // btn_close1.onClick(() => {
        //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloMain, 0, null);
        // })
        this.uiPanel.getChild("label_str50", fgui.GLabel).text = StrVal.LYCLANSOLO.STR50
        this.uiPanel.getChild("label_str80", fgui.GLabel).text = StrVal.LYCLANSOLO.STR80
        this.label_winScoreChange = this.uiPanel.getChild("label_winScoreChange")
        this.btn_skip = this.uiPanel.getChild("btn_skip")

        let btn_attr: fgui.GButton = this.uiPanel.getChild("btn_attr")
        btn_attr.clearClick()
        btn_attr.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloAttr, 0, null);
        })
        this.initialize()
        let clanSoloPlayer: any = this.fullInfo.clanSoloPlayer
        let opponentClanInfo: any = clanSoloPlayer.opponentClanInfo
        let label_clanName: fgui.GLabel = this.uiPanel.getChild("label_clanName")
        label_clanName.text = opponentClanInfo.name
        let label_clanServer: fgui.GLabel = this.uiPanel.getChild("label_clanServer")
        label_clanServer.text = PlatformAPI.getGameServerItem(opponentClanInfo.serverId).name
        let img_flag: fgui.GLoader = this.uiPanel.getChild("img_flag")
        img_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(opponentClanInfo.flag).icon])
        let clanSoloMyselfInfo: any = clanSoloPlayer.clanSoloMyselfInfo
        if (clanSoloMyselfInfo.buffId == 0) {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloBuff, 0, null);
        }
        let clanSoloRoot = LocaleData.getClanSoloRoot()
        if (clanSoloMyselfInfo.winCount < Number(clanSoloRoot.skipBattleWinCount)) {
            LocaleUser.setUser(VarVal.FIELD_SV.CLAN_SOLO_SKIP, "0");
            LocaleUser.flush()
        }else{
            this.btn_skip.selected = LocaleUser.getUser(VarVal.FIELD_SV.CLAN_SOLO_SKIP) == "1"
        }
        let group_spine_ram: fgui.GComponent = this.uiPanel.getChild("group_spine_ram")
        let loader_spine_pet: fgui.GLoader3D = this.uiPanel.getChild("loader_spine_pet")

        let fullInfoBase: any = this.fullInfo.base
        let charInfo: ModelShowInfo = LocaleData.getCharShowResInfo(fullInfoBase.character, fullInfoBase.phase, fullInfoBase.appearance, fullInfoBase.avatar);
        let mountInfo = LocaleData.getMountShowResInfo(fullInfoBase.mountType, fullInfoBase.mountSkin);
        new SpineRoldMountPlayer(group_spine_ram).loadSpineRole(charInfo).loadSpineMount(mountInfo);
        if (fullInfoBase.summonPet && String(fullInfoBase.summonPet).length > 1) {
            let petProto = LocaleData.getPetProto(GameServerData.getInstance().getProtoIdByItemInstId().protoId);
            new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }, loader_spine_pet, petProto.modelId);
        }
    };
    private clanNumber
    private initialize(): void {
        this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanSoloPlayer: any = this.fullInfo.clanSoloPlayer
        let opponentPlayers: any = clanSoloPlayer.opponentPlayers
        let opponentClanInfo: any = clanSoloPlayer.opponentClanInfo
        let clanSoloMyselfInfo: any = clanSoloPlayer.clanSoloMyselfInfo

        this.clanNumber = opponentClanInfo.number
        let label_number: fgui.GLabel = this.uiPanel.getChild("label_number")
        label_number.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR48, [opponentClanInfo.number - clanSoloMyselfInfo.onceWinCount, opponentClanInfo.number])
        let bar_hp: fgui.GProgressBar = this.uiPanel.getChild("bar_hp")
        bar_hp.value = clanSoloMyselfInfo.fightHP
        bar_hp.max = clanSoloMyselfInfo.fightHPMax
        let bar_energy: fgui.GProgressBar = this.uiPanel.getChild("bar_energy")
        bar_energy.value = clanSoloMyselfInfo.energy
        bar_energy.max = 500

        let group_onceWinCount: fgui.GGroup = this.uiPanel.getChild("group_onceWinCount")
        let label_onceWinCount: fgui.GGroup = this.uiPanel.getChild("label_onceWinCount")
        group_onceWinCount.visible = clanSoloMyselfInfo.onceWinCount > 1
        label_onceWinCount.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR51, [clanSoloMyselfInfo.onceWinCount])

        let label_combatPower: fgui.GLabel = this.uiPanel.getChild("label_combatPower")
        label_combatPower.text = UtilsTool.nToFStr(clanSoloMyselfInfo.combatPower)

        let group_top1: fgui.GComponent = this.uiPanel.getChild("group_top1")
        let group_top2: fgui.GComponent = this.uiPanel.getChild("group_top2")
        let group_top3: fgui.GComponent = this.uiPanel.getChild("group_top3")
        group_top1.visible = false
        group_top2.visible = false
        group_top3.visible = false
        opponentPlayers.sort((itemA, itemB) => {
            return Number(itemB.winScore) - Number(itemA.winScore);
        })
        if (opponentPlayers[0]) {
            this.onBattlePlayer(group_top1, opponentPlayers[0])
        }
        if (opponentPlayers[1]) {
            this.onBattlePlayer(group_top2, opponentPlayers[1])
        }
        if (opponentPlayers[2]) {
            this.onBattlePlayer(group_top3, opponentPlayers[2])
        }
        let btn_battleAll: fgui.GButton = this.uiPanel.getChild("btn_battleAll")
        btn_battleAll.clearClick()
        btn_battleAll.onClick(() => {
            if (clanSoloMyselfInfo.winCount >= Number(clanSoloRoot.quickBattleWinCount)) {
                let call = () => {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.initialize()
                            let battleOver = {
                                score: args.score,
                                winScoreChange: args.winScoreChange,
                                lossScoreChange: args.lossScoreChange,
                                fightFrom: args.fightFrom,
                                clanNumber: this.clanNumber,
                                onceWinCount: args.onceWinCount,
                                server: PlatformAPI.getGameServerItem(opponentClanInfo.serverId).name,
                                clanName: opponentClanInfo.name,
                            }
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloBattleResult, 0, {
                                battleOver: battleOver,
                            });
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    }, "clanSoloFight", null)
                }
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloTisp, 0, {
                    type: 1, call: call
                });

            } else {
                UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR56, [Number(clanSoloRoot.quickBattleWinCount) - clanSoloMyselfInfo.winCount]))
            }
        })
        let clanSoloRoot = LocaleData.getClanSoloRoot()
        this.btn_skip.clearClick()
        this.btn_skip.onClick(() => {
            if (clanSoloMyselfInfo.winCount >= Number(clanSoloRoot.skipBattleWinCount)) {
                this.btn_skip.selected = !this.btn_skip.selected
            } else {
                UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR56, [Number(clanSoloRoot.skipBattleWinCount) - clanSoloMyselfInfo.winCount]))
                this.btn_skip.selected = false
            }
            LocaleUser.setUser(VarVal.FIELD_SV.CLAN_SOLO_SKIP, this.btn_skip.selected ? "1" : "0");
            LocaleUser.flush()
        })
        this.label_winScoreChange.text = this.label_winScoreChange.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR57, [clanSoloMyselfInfo.winScoreChange])
    }
    private onBattlePlayer(group_top: fgui.GComponent, opponentPlayer: any): void {
        group_top.visible = true
        let btn_info: fgui.GLoader = group_top.getChild("btn_info")
        btn_info.clearClick()
        btn_info.onClick(() => {
            UtilsUI.onShowPlayerInfo(String(opponentPlayer.playerId));
        })
        let label_str47: fgui.GLabel = group_top.getChild("label_str47")
        label_str47.text = StrVal.LYCLANSOLO.STR47

        let label_winScore: fgui.GLabel = group_top.getChild("label_winScore")
        label_winScore.text = "+" + opponentPlayer.winScore
        let label_scoreScale: fgui.GLabel = group_top.getChild("label_scoreScale")
        label_scoreScale.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR49, [opponentPlayer.scoreScale])
        let loader_phase: fgui.GComponent = group_top.getChild("loader_phase")
        UtilsUI.setTitleIconByTitleId(loader_phase, opponentPlayer.phase, opponentPlayer.title);
        let label_combatPower: fgui.GLabel = group_top.getChild("label_combatPower")
        label_combatPower.text = UtilsTool.nToFStr(opponentPlayer.combatPower)

        let label_name: fgui.GLabel = group_top.getChild("label_name")
        label_name.text = opponentPlayer.name
        let group_spine_ram: fgui.GComponent = group_top.getChild("group_spine_ram")
        let loader_spine_pet: fgui.GLoader3D = group_top.getChild("loader_spine_pet")

        let charInfo: ModelShowInfo = LocaleData.getCharShowResInfo(opponentPlayer.character, opponentPlayer.phase, opponentPlayer.appearance, opponentPlayer.avatar);
        let mountInfo = LocaleData.getMountShowResInfo(opponentPlayer.mountType, opponentPlayer.mountSkin);
        new SpineRoldMountPlayer(group_spine_ram).loadSpineRole(charInfo).loadSpineMount(mountInfo);
        if (opponentPlayer.summonPet && String(opponentPlayer.summonPet).length > 1) {
            let petProto = LocaleData.getPetProto(opponentPlayer.summonPet);
            new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }, loader_spine_pet, petProto.modelId);
        }
        let btn_battle: fgui.GButton = group_top.getChild("btn_battle")
        btn_battle.clearClick()
        btn_battle.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    let clanSoloPlayer: any = this.fullInfo.clanSoloPlayer
                    let opponentClanInfo: any = clanSoloPlayer.opponentClanInfo
                    let resultParams: BattleResultParams = {
                        battleResult: args.battleResult,
                        bonuseString: null,
                        typeInfo: {
                            type: VarVal.BATTLE_TYPE.CLANSOLO,
                            duelIcon1: LocaleData.getCharShowResInfoSelf().icon,
                            duelIcon2: charInfo.icon,
                            duelName1: GameServerData.getInstance().getPlayerFullInfo().base.name,
                            duelName2: opponentPlayer.name,
                            playerScore: args.winScoreChange,
                            scoreChange: args.scoreChange,
                            clansoloHpMax1: args.fightHPMax,
                            clansoloHpValue1: args.fightHP,
                            clansoloHpMax2: args.battleResult.entityDefence.battleMaxHP,
                            clansoloHpValue2: args.battleResult.entityDefence.battleHP,
                        },
                    }
                    if (this.btn_skip.selected) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleResult, 0, resultParams);
                    } else {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleMain, 0, { resultParams: resultParams });
                    }
                    if (args.isEnd) {
                        args.battleResult.isWin
                        this.battleOver = {
                            score: args.score,
                            winScoreChange: args.winScoreChange,
                            opponentClanScoreChange: args.opponentClanScoreChange,
                            fightFrom: args.fightFrom,
                            clanNumber: this.clanNumber,
                            onceWinCount: args.onceWinCount,
                            server: PlatformAPI.getGameServerItem(opponentClanInfo.serverId).name,
                            clanName: opponentClanInfo.name,
                            lossScoreChange: args.lossScoreChange
                        }
                    }
                    this.label_winScoreChange.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR57, [args.winScoreChange])
                    this.initialize()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "clanSoloFight", {
                opponentId: opponentPlayer.playerId
            })
        })

    }

    public onViewUpdate(params: any): void {
        this.initialize()
    }

    public onViewShowFront(): void {
        if (this.battleOver) {

            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloBattleResult, 0, {
                battleOver: this.battleOver,
            });
            this.battleOver = null
        }

    }



    public getIsViewMask(): boolean {
        return false;
    };

}