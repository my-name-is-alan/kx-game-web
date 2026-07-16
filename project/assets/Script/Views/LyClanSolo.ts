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
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyClanJoin } from "./LyClanJoin";
import { LyClanSoloAward } from "./LyClanSoloAward";
import { LyClanSoloGift } from "./LyClanSoloGift";
import { LyClanSoloLog } from "./LyClanSoloLog";
import { LyClanSoloMain } from "./LyClanSoloMain";
import { LyClanSoloPassport } from "./LyClanSoloPassport";
import { LyClanSoloRank } from "./LyClanSoloRank";
import { LyClanSoloShop } from "./LyClanSoloShop";
import { LyClanSoloTask } from "./LyClanSoloTask";
import { LyClanSoloTisp } from "./LyClanSoloTisp";
import { LyPalaceLike, PalaceLikeData } from "./LyPalaceLike";

export class LyClanSolo extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClanSolo";
        this.viewResI.pkgName = "LyClanSolo";
        this.viewResI.comName = "LyClanSolo";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params: any): void {
        this.uiPanel = this.getUiPanel()
        // UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSolo, 0, null);
        })

        let btn_rank: fgui.GButton = this.uiPanel.getChild("btn_rank")
        btn_rank.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloRank, 0, null);
        })
        let btn_shop: fgui.GButton = this.uiPanel.getChild("btn_shop")
        PointRedData.getInstance().registerPoint(btn_shop, PointRedType.LyClanSoloShop);
        btn_shop.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloShop, 0, null);
        })

        let btn_gift: fgui.GButton = this.uiPanel.getChild("btn_gift")
        PointRedData.getInstance().registerPoint(btn_gift, PointRedType.LyClanSoloGift);
        btn_gift.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloGift, 0, null);
        })
        this.registerRequest((args) => {
            this.clearInterval(this.onTime1)
            this.onTime1 = null
            this.onPropNum()
        }, "onClanSoloPhysicalChange");
        let clanSoloRoot = LocaleData.getClanSoloRoot()
        let activity = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.CLANSOLO)
        this.registerRequest((args) => {
            if (args.activityGlobalState.activityId == clanSoloRoot.id) {
                if (args.activityGlobalState.data.activityGlobalClanSolo.state == 5) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSolo, 0, null);
                } else {
                    this.initialize()
                }
            }
            // if (args.activityGlobalState.activityId == this.dynamicParam.id) {
            // this.lastRecoverTime = args.activityGlobalState.data.activityGlobalGremlinExperience.lastRecoverTime + this.dynamicParam.data.attackCountRecoverTime
            // let serverTime = GameServerData.getInstance().getServerTime()
            // label_time4.text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR30, [UtilsTool.parseTimeToString(this.lastRecoverTime - serverTime)]); 
            // this.refreshUI()
            // }
        }, "activityGlobalStateChanged");
        let clanSoloPlayer: any = GameServerData.getInstance().getPlayerFullInfo().clanSoloPlayer
        this.initialize()
        this.uiPanel.getChild("label_str101", fgui.GLabel).text = StrVal.LYCLANSOLO.STR101
    };

    private initialize(): void {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanPlayer = fullInfo.clan

        let clanSoloPlayer: any = fullInfo.clanSoloPlayer
        let clanSoloInfo: any = clanSoloPlayer.clanSoloInfo
        let myselfClanInfo: any = clanSoloPlayer.myselfClanInfo
        let clanSoloMyselfInfo: any = clanSoloPlayer.clanSoloMyselfInfo
        let label_servers: fgui.GLabel = this.uiPanel.getChild("label_servers")
        let label_clanName: fgui.GLabel = this.uiPanel.getChild("label_clanName")
        if (myselfClanInfo) {
            label_clanName.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR97, [myselfClanInfo.name])
        } else {
            if (clanPlayer.clanInfo && clanPlayer.clanInfo.name) {
                label_clanName.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR97, [clanPlayer.clanInfo.name])
            } else {
                if (clanSoloInfo.state == 2) {
                    label_clanName.text = StrVal.LYCLANSOLO.STR98
                } else {
                    label_clanName.text = StrVal.LYCLANSOLO.STR105
                }
            }
        }
        let label_nextStateTime: fgui.GLabel = this.uiPanel.getChild("label_nextStateTime")
        let label_more: fgui.GTextField = this.uiPanel.getChild("label_more")
        label_more.clearClick()
        label_more.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloTisp, 0, { type: 2 });
        })
        let serversStr: string = ""
        for (let i = 0; i < clanSoloInfo.servers.length; i++) {
            if (i < 2) {
                const element = clanSoloInfo.servers[i];
                let serverItem = PlatformAPI.getGameServerItem(element);
                if (serverItem) {
                    serversStr += serverItem.name + " "
                }
            }
        }
        let btn_fund: fgui.GButton = this.uiPanel.getChild("btn_fund")
        PointRedData.getInstance().registerPoint(btn_fund, PointRedType.LyClanSoloPassport);
        btn_fund.clearClick()
        btn_fund.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloPassport, 0, null);
        })
        let btn_log: fgui.GButton = this.uiPanel.getChild("btn_log")
        btn_log.clearClick()
        btn_log.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloLog, 0, null);
        })
        let btn_task: fgui.GButton = this.uiPanel.getChild("btn_task")
        PointRedData.getInstance().registerPoint(btn_task, PointRedType.LyClanSoloTask);
        btn_task.clearClick()
        btn_task.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloTask, 0, null);
        })
        let btn_award: fgui.GButton = this.uiPanel.getChild("btn_award")
        btn_award.clearClick()
        btn_award.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloAward, 0, null);
        })
        label_servers.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR29, [serversStr]);
        label_nextStateTime.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR77, [UtilsTool.TimeToStr(clanSoloInfo.startTime, "-") + "~" + UtilsTool.TimeToStr(clanSoloInfo.endTime, "-")])
        let group_state2: fgui.GGroup = this.uiPanel.getChild("group_state2")
        let group_state4: fgui.GGroup = this.uiPanel.getChild("group_state4")
        let group_state5: fgui.GGroup = this.uiPanel.getChild("group_state5")
        let group_noJoin: fgui.GGroup = this.uiPanel.getChild("group_noJoin")
        group_state2.visible = false
        group_state4.visible = false
        group_noJoin.visible = false
        group_state5.visible = false
        if (clanSoloInfo.state == 2 || clanSoloInfo.state == 3) {
            //报名
            group_state2.visible = true
            let clanSoloRoot = LocaleData.getClanSoloRoot()
            let myselfClanInfo: any = clanSoloPlayer.myselfClanInfo
            this.uiPanel.getChild("label_str26", fgui.GLabel).text = StrVal.LYCLANSOLO.STR26
            let label_str27: fgui.GTextField = this.uiPanel.getChild("label_str27")
            let label_str92: fgui.GTextField = this.uiPanel.getChild("label_str92")
            label_str92.text = StrVal.LYCLANSOLO.STR92
            let label_join: fgui.GTextField = this.uiPanel.getChild("label_join")
            label_join.text = StrVal.LYCLANSOLO.STR93
            if (clanSoloInfo.state == 2) {
                if (clanPlayer.clanInfo && clanPlayer.clanInfo.name) {
                    label_str27.visible = true
                    label_join.visible = false
                    label_str92.visible = false
                    let clanInfoNumber: number = clanPlayer.clanInfo.number
                    let str: string = Number(clanSoloRoot.numberLimit) <= clanInfoNumber ? StrVal.LYCLANSOLO.STR88 : StrVal.LYCLANSOLO.STR89
                    label_str27.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR27, [clanSoloRoot.numberLimit, str])
                    label_str27.color = Number(clanSoloRoot.numberLimit) <= clanInfoNumber ? new Color(52, 200, 48) : new Color(248, 56, 56);
                } else {
                    label_str27.visible = false
                    label_join.visible = true
                    label_str92.visible = true
                    label_join.clearClick()
                    label_join.onClick(() => {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSolo, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanJoin, 0, null);
                    })
                }
                this.uiPanel.getChild("label_str28", fgui.GLabel).text = StrVal.LYCLANSOLO.STR90
            } else if (clanSoloInfo.state == 3) {
                this.uiPanel.getChild("label_str26", fgui.GLabel).text = StrVal.LYCLANSOLO.STR106
                label_str27.visible = true
                label_join.visible = false
                label_str92.visible = false
                if (myselfClanInfo && myselfClanInfo.number) {
                    label_str27.text = StrVal.LYCLANSOLO.STR107
                } else {
                    label_str27.text = StrVal.LYCLANSOLO.STR108
                }
                this.uiPanel.getChild("label_str28", fgui.GLabel).text = StrVal.LYCLANSOLO.STR91
            }
            let label_nextStateTime2: fgui.GLabel = this.uiPanel.getChild("label_nextStateTime2")
            let serverTime = GameServerData.getInstance().getServerTime()
            // label_nextStateTime2.text = UtilsTool.TimeToStr(clanSoloInfo.nextStateTime - serverTime, "-")
            this.onTime(label_nextStateTime2, clanSoloInfo.nextStateTime)
            btn_log.visible = false
        } else if (clanSoloInfo.state == 4) {
            //战斗
            if (clanSoloMyselfInfo.hasJoin) {
                group_noJoin.visible = false
                group_state4.visible = true
                this.uiPanel.getChild("label_str8", fgui.GLabel).text = StrVal.LYCLANSOLO.STR8
                this.uiPanel.getChild("label_str25", fgui.GLabel).text = StrVal.LYCLANSOLO.STR25
                this.uiPanel.getChild("label_str7", fgui.GLabel).text = StrVal.LYCLANSOLO.STR7
                this.uiPanel.getChild("label_str24", fgui.GLabel).text = StrVal.LYCLANSOLO.STR24
                let label_myScore: fgui.GLabel = this.uiPanel.getChild("label_myScore")
                label_myScore.text = clanSoloMyselfInfo.score
                let label_myRank: fgui.GLabel = this.uiPanel.getChild("label_myRank")
                label_myRank.text = clanSoloMyselfInfo.rankOf < 0 ? StrVal.LYCLANSOLO.STR32 : clanSoloMyselfInfo.rankOf
                let label_clanScore: fgui.GLabel = this.uiPanel.getChild("label_clanScore")
                label_clanScore.text = myselfClanInfo.score
                let label_clanRank: fgui.GLabel = this.uiPanel.getChild("label_clanRank")
                label_clanRank.text = myselfClanInfo.rankOf < 0 ? StrVal.LYCLANSOLO.STR32 : myselfClanInfo.rankOf
                let group_battleLoad: fgui.GComponent = this.uiPanel.getChild("group_battleLoad")
                group_battleLoad.visible = false
                let btn_battle: fgui.GButton = this.uiPanel.getChild("btn_battle")
                if (clanSoloMyselfInfo.isFighting) {
                    btn_battle.icon = "ui://LyClanSolo/word_back"
                } else {
                    btn_battle.icon = "ui://LyClanSolo/word_match"
                }
                btn_battle.clearClick()
                btn_battle.onClick(() => {
                    if (clanSoloMyselfInfo.isFighting) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloMain, 0, null);
                    } else {
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                fullInfo = GameServerData.getInstance().getPlayerFullInfo()
                                let clanSoloPlayer: any = fullInfo.clanSoloPlayer
                                let opponentClanInfo: any = clanSoloPlayer.opponentClanInfo
                                // let myselfClanInfo: any = clanSoloPlayer.myselfClanInfo
                                group_battleLoad.visible = true
                                let img_clanFlag: fgui.GLoader = group_battleLoad.getChild("img_clanFlag")
                                let label_clanName: fgui.GLabel = group_battleLoad.getChild("label_clanName")
                                let label_clanServer: fgui.GLabel = group_battleLoad.getChild("label_clanServer")
                                img_clanFlag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(opponentClanInfo.flag).icon])
                                label_clanName.text = opponentClanInfo.name
                                label_clanServer.text = PlatformAPI.getGameServerItem(opponentClanInfo.serverId).name
                                let label_playerName: fgui.GLabel = group_battleLoad.getChild("label_playerName")
                                let label_playerServer: fgui.GLabel = group_battleLoad.getChild("label_playerServer")
                                let fullInfoBase = fullInfo.base
                                label_playerName.text = fullInfoBase.name
                                label_playerServer.text = GameServer.getLoginParams().serverItem.name

                                let group_spine_ram: fgui.GComponent = group_battleLoad.getChild("group_spine_ram")
                                let loader_spine_pet: fgui.GLoader3D = group_battleLoad.getChild("loader_spine_pet")
                                let loader_playerPhase: fgui.GComponent = group_battleLoad.getChild("loader_playerPhase")

                                let charInfo: ModelShowInfo = LocaleData.getCharShowResInfo(fullInfoBase.character, fullInfoBase.phase, fullInfoBase.appearance, fullInfoBase.avatar);
                                let mountInfo = LocaleData.getMountShowResInfo(fullInfoBase.mountType, fullInfoBase.mountSkin);
                                new SpineRoldMountPlayer(group_spine_ram).loadSpineRole(charInfo).loadSpineMount(mountInfo);
                                if (fullInfoBase.summonPet && String(fullInfoBase.summonPet).length > 1) {
                                    // let petProto = LocaleData.getPetProto(fullInfoBase.summonPet);
                                    let petProto = LocaleData.getPetProto(GameServerData.getInstance().getProtoIdByItemInstId().protoId);
                                    new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                                        spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                                    }, loader_spine_pet, petProto.modelId);
                                }
                                UtilsUI.setTitleIconByTitleId(loader_playerPhase, fullInfoBase.phase, fullInfoBase.title);

                                // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloMain, 0, null);
                                let spinePlayer2 = new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                                    spp.playAnimation("jm_bangpai_duijie", false, null, null, () => {
                                        group_battleLoad.visible = false
                                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloMain, 0, null);
                                    });
                                }, group_battleLoad.getChild("loader_3d_effect", fgui.GLoader3D), "jm_bangpai_duijie");
                                if (clanSoloMyselfInfo.isFighting) {
                                    btn_battle.icon = "ui://LyClanSolo/word_back"
                                } else {
                                    btn_battle.icon = "ui://LyClanSolo/word_match"
                                }
                                // UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        }, "clanSoloFightMatch", {
                        })
                    }
                })
                let label_openTime: fgui.GLabel = btn_battle.getChild("label_openTime")
                // label_openTime.text = UtilsTool.parseTimeToString(clanSoloInfo.nextStateTime)
                // let serverTime = GameServerData.getInstance().getServerTime()
                // label_openTime.text = UtilsTool.parseTimeToString(clanSoloInfo.nextStateTime - serverTime)
                this.onTime(label_openTime, clanSoloInfo.nextStateTime, true)

                this.label_propNum = btn_battle.getChild("label_propNum")
                this.label_propTime = btn_battle.getChild("label_propTime")
                this.label_str33 = btn_battle.getChild("label_str33")

                this.img_propIcon = btn_battle.getChild("img_propIcon")
                this.img_propIcon.url = "ui://CCommon/Props-daggerflag"
                this.onPropNum()

            } else {
                group_noJoin.visible = true
                btn_fund.visible = false
                btn_log.visible = false
                btn_task.visible = false
                btn_award.visible = false
            }

        } else if (clanSoloInfo.state == 5) {
            //结算
            group_state5.visible = true
            let group_clanTop1: fgui.GComponent = this.uiPanel.getChild("group_clanTop1")
            let group_clanTop2: fgui.GComponent = this.uiPanel.getChild("group_clanTop2")
            let group_clanTop3: fgui.GComponent = this.uiPanel.getChild("group_clanTop3")
            let group_playerTop: fgui.GComponent = this.uiPanel.getChild("group_playerTop")
            let btn_like: fgui.GButton = this.uiPanel.getChild("btn_like")
            let group_prop: fgui.GGroup = btn_like.getChild("group_prop")
            group_prop.visible = false
            let createDay = Math.floor((GameServerData.getInstance().getServerTime() - clanSoloInfo.startTime) / (24 * 60 * 60 * 1000))
            let awardXml: any = LocaleData.getClanSoloRank(createDay)[0]
            let label_openTime: fgui.GLabel = btn_like.getChild("label_openTime")
            this.onTime(label_openTime, clanSoloInfo.nextStateTime)
            let group_clanTops = [group_clanTop1, group_clanTop2, group_clanTop3]
            UtilsUI.lockWait()
            let top1PlayerId
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    top1PlayerId = args.top1PlayerId
                    for (let i = 0; i < args.top3ClanInfo.length; i++) {
                        let clanInfo = args.top3ClanInfo[i];
                        let group_top = group_clanTops[i]
                        group_top.visible = true
                        group_top.getChild("label_clanName", fgui.GLabel).text = clanInfo.name
                        group_top.getChild("label_clanServer", fgui.GLabel).text = PlatformAPI.getGameServerItem(clanInfo.serverId).name
                        group_top.getChild("img_clanFlag", fgui.GLabel).text = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(clanInfo.flag).icon])
                    }
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args1: any) => {
                        UtilsUI.unlockWait()
                        if (args1.errorcode == 0) {
                            let playerInfo = args1.playerInformation.simpleBase
                            group_playerTop.getChild("label_level", fgui.GLabel).text = playerInfo.level
                            group_playerTop.getChild("label_name", fgui.GLabel).text = playerInfo.name
                            group_playerTop.getChild("label_server", fgui.GLabel).text = PlatformAPI.getGameServerItem(playerInfo.serverid).name
                            // .text = playerInfo.name

                            let palaceItem = LocaleData.getPalaceItem(awardXml.palaceId1);
                            UtilsUI.setTitleIconByTitleId(group_playerTop.getChild("loader_title", fgui.GComponent), null, palaceItem.titleId);
                            UtilsUI.setTitleIconByTitleId(group_playerTop.getChild("loader_phase", fgui.GComponent), playerInfo.phase);
                            let charInfo = LocaleData.getCharShowResInfo(playerInfo.character, playerInfo.phase, playerInfo.appearance, null);
                            let mountInfo = LocaleData.getMountShowResInfo(playerInfo.mountType, playerInfo.mountSkin);
                            new SpineRoldMountPlayer(group_playerTop.getChild("group_spine_ram")).loadSpineRole(charInfo).loadSpineMount(mountInfo);
                            if (playerInfo.summonPetProtoId && String(playerInfo.summonPetProtoId).length > 1) {
                                let petProto = LocaleData.getPetProto(playerInfo.summonPetProtoId);
                                new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                                }, group_playerTop.getChild("loader_spine_pet"), petProto.modelId);
                            }
                        } else {
                            UtilsUI.showMsgTip(args1.errorcode)
                        }
                    }, "queryPlayerInfo", {
                        guid: args.top1PlayerId
                    })
                    group_playerTop.clearClick()
                    group_playerTop.onClick(() => {
                        UtilsUI.onShowPlayerInfo(String(args.top1PlayerId));
                    })
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "getClanSoloFinishInfo", null)

            btn_like.enabled = !clanSoloMyselfInfo.isLiking
            btn_like.clearClick()
            btn_like.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        let doCallReward = () => {
                            let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.stone, null, null, args.stone);
                            UtilsUI.showItemReward({ bonuseItems: [bonuseItem] });
                            btn_like.enabled = !clanSoloMyselfInfo.isLiking
                        }
                        let randItems = LocaleData.getPalaceGrantItems();
                        let params: PalaceLikeData = {
                            playerId: top1PlayerId,
                            grantId: randItems[UtilsTool.random(0, randItems.length - 1)].id,
                            stone: args.stone,
                            palaceIds: awardXml.palaceId1,
                            doneCall: doCallReward
                        }
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPalaceLike, 0, params);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "clanSoloLike", null)
            })
            if (clanSoloMyselfInfo.hasJoin) {
            } else {
                btn_fund.visible = false
                btn_log.visible = false
                btn_task.visible = false
                btn_award.visible = false
            }
            btn_log.visible = false
        }
        btn_fund.visible = false
    }
    private label_propNum: fgui.GLabel
    private label_propTime: fgui.GLabel
    private img_propIcon: fgui.GLoader
    private label_str33: fgui.GLabel
    private onTime1

    private onPropNum(): void {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanSoloPlayer: any = fullInfo.clanSoloPlayer
        let clanSoloMyselfInfo: any = clanSoloPlayer.clanSoloMyselfInfo

        this.label_str33.text = StrVal.LYCLANSOLO.STR33

        this.label_str33.visible = clanSoloMyselfInfo.physical > 0
        this.img_propIcon.visible = !this.label_str33.visible
        if (clanSoloMyselfInfo.physical > 0) {
            this.label_str33.visible = true
            this.img_propIcon.visible = false
            this.label_propNum.text = clanSoloMyselfInfo.physical + "/" + 5
        } else {
            this.label_str33.visible = false
            this.img_propIcon.visible = true
            let clanSoloRoot = LocaleData.getClanSoloRoot()
            this.label_propNum.text = String(GameServerData.getInstance().getItemCountByProtoId(clanSoloRoot.physicalItemId))
        }


        // label_propTime.text = UtilsTool.parseTimeToString(clanSoloInfo.physical)
        if (clanSoloMyselfInfo.physical < 5) {
            if (this.onTime1 == null) {
                this.label_propTime.visible = true
                let serverTime = GameServerData.getInstance().getServerTime()
                let time = clanSoloMyselfInfo.nextPhysicalRecoverTime - serverTime
                this.label_propTime.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR95, [UtilsTool.parseTimeToString(time)])
                let timeCall = () => {
                    time--
                    this.label_propTime.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR95, [UtilsTool.parseTimeToString(time)])

                }
                this.onTime1 = this.setInterval(timeCall, 1000)
                timeCall()
            }
        } else {
            if (this.onTime1) {
                this.clearInterval(this.onTime1)
                this.onTime1 = null
            }
            this.label_propTime.visible = false
        }
    }
    private onTime2 = null
    private onTime(label_txt: fgui.GLabel, nextStateTime: number, isBattle?: boolean): void {
        let serverTime = GameServerData.getInstance().getServerTime()
        let time = nextStateTime - serverTime
        if (isBattle) {
            label_txt.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR109, [UtilsTool.parseTimeToString(time)])
        } else {
            label_txt.text = UtilsTool.parseTimeToString(time)
        }
        if (this.onTime2 == null) {
            let timeCall = () => {
                time--
                if (isBattle) {
                    label_txt.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR109, [UtilsTool.parseTimeToString(time)])
                } else {
                    label_txt.text = UtilsTool.parseTimeToString(time)
                }
            }
            this.onTime2 = this.setInterval(timeCall, 1000);
            timeCall()
        }
    }
    public static isViewRedPoint(): boolean {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanSoloPlayer: any = fullInfo.clanSoloPlayer
        if (clanSoloPlayer) {
            let clanSoloMyselfInfo: any = clanSoloPlayer.clanSoloMyselfInfo
            let clanSoloInfo: any = clanSoloPlayer.clanSoloInfo
            if (clanSoloInfo.state == 4) {
                return clanSoloMyselfInfo.physical > 0
            }
        }
        return false
    }

    public onViewUpdate(params: any): void {
        this.initialize()
    }
    public getIsViewMask(): boolean {
        return false;
    };

}