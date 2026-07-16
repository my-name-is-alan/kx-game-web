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
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BattleResultParams, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyActivityShopBuy, ShopBuy } from "./LyActivityShopBuy";
import { LyBattleMain } from "./LyBattleMain";
import { LyBattleResult } from "./LyBattleResult";
import { LyCrossQunYinAchievement } from "./LyCrossQunYinAchievement";
import { LyCrossQunYinAward } from "./LyCrossQunYinAward";
import { LyCrossQunYinLog } from "./LyCrossQunYinLog";
import { LyCrossQunYinRank } from "./LyCrossQunYinRank";
import { LyCrossQunYinShop } from "./LyCrossQunYinShop";
import { LyGuideDetail } from "./LyGuideDetail";

export class LyCrossQunYin extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyCrossQunYin";
        this.viewResI.pkgName = "LyCrossQunYin";
        this.viewResI.comName = "LyCrossQunYin";
    }
    private QUNYIN_ID: string = "120021"
    private uiPanel: fgui.GComponent

    private fullInfo: any
    private qunyinData: any
    private selfRank: number = 99999//自己的排名
    private selfHighRank: number = 99999//自己的最高排名

    private achievementItme: any //当前成就
    private activityState: any
    private activityXml: any
    private randomXml: any

    private rank1: any
    private rank2: any
    private rank3: any

    private ani: fgui.Transition
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel()
        // 关闭
        let btn_close: fgui.GButton = this.uiPanel.getChild("btn_close");

        let group_qunyin: fgui.GGraph = this.uiPanel.getChild("group_qunyin")
        group_qunyin.visible = false
        let spinePlayer3 = new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            spp.playAnimation("animation", false, 0, () => {
                btn_close.onClick(() => {
                    this.clearInterval(this.timea)
                    this.timea = null
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCrossQunYin, 0, null);
                })
                group_qunyin.visible = true
            }, null);
        }, this.getUiPanel().getChild("loader3d_join", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_yunwu_guochang);



        let btn_plaint: fgui.GButton = this.uiPanel.getChild("btn_plaint");
        btn_plaint.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, { title: this.activityXml.name, detail: this.activityXml.desc });
        })


        this.ani = this.uiPanel.getTransition("ani")
        this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                this.activityState = args.activityState
                this.loadQunyinData(args)
                this.initialize()
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "queryChallengeList", {
        })
        this.activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.QUNYIN);
        this.randomXml = this.activityXml._random[0]._item

        let btn_refresh: fgui.GButton = this.uiPanel.getChild("btn_refresh")
        btn_refresh.text = StrVal.LYQUNYIN.STR21
        btn_refresh.onClick(() => {
            if (this.activityXml.refreshCount - this.fullInfo.base.qunyinRefreshCount <= 0) {
                UtilsUI.showMsgTip(StrVal.LYQUNYIN.STR38)
            } else {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.loadQunyinData(args)
                        this.initialize()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "refreshQunYinList", {
                })
            }
        })
        let btn_shop: fgui.GButton = this.uiPanel.getChild("btn_shop")
        let btn_rank: fgui.GButton = this.uiPanel.getChild("btn_rank")
        let btn_award: fgui.GButton = this.uiPanel.getChild("btn_award")
        let btn_log: fgui.GButton = this.uiPanel.getChild("btn_log")
        btn_shop.text = StrVal.LYQUNYIN.STR16
        btn_rank.text = StrVal.LYQUNYIN.STR17
        btn_award.text = StrVal.LYQUNYIN.STR18
        btn_log.text = StrVal.LYQUNYIN.STR19

        btn_shop.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCrossQunYinShop, 0, null);
        })
        btn_rank.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    let data = {
                        rank: this.selfRank,
                        ranks: args.result
                    }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCrossQunYinRank, 0, data);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "viewRankInfo", {
                page: 1
            })
        })
        btn_award.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCrossQunYinAward, 0, null);
        })
        btn_log.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCrossQunYinLog, 0, args);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "queryChallengeLog", {
                page: 1
            })
        })
        let btn_box: fgui.GButton = this.uiPanel.getChild("btn_box")
        btn_box.text = StrVal.LYQUNYIN.STR20
        btn_box.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCrossQunYinAchievement, 0, null);
        })
        let group_rank: fgui.GGroup = this.uiPanel.getChild("group_rank")
        group_rank.onClick(() => {
            if (this.achievementItme) {
                if (this.selfRank <= this.achievementItme.rank) {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                            this.initialize()
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    }, "takeQunYinAchievement", {
                        id: this.achievementItme.rank
                    })
                } else {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCrossQunYinAchievement, 0, null);
                }
            } else {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCrossQunYinAchievement, 0, null);
            }
        })
        let btn_qunyinBuy: fgui.GButton = this.uiPanel.getChild("btn_qunyinBuy")
        // let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.SHOP);
        // let shopItems: Array<any> = activityXml._shop[0]._item;
        let qunyinItem = LocaleData.getItemProtoBySubType(VarVal.itemtype.qunyin_challenge)
        this.QUNYIN_ID = qunyinItem.id
        let qunYinItme = LocaleData.getItemProto(this.QUNYIN_ID)
        btn_qunyinBuy.onClick(() => {
            let maxCount: number = this.activityXml.chaBuyMax - this.fullInfo.chaBuyCount;
            if (maxCount > 0) {
                let shopBuy: ShopBuy = {
                    costBonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.stone, null, null, "1"),
                    bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.QUNYIN_ID, "1"),
                    set_need: qunYinItme.data,
                }
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityShopBuy, 0, {
                    shopBuy: shopBuy, maxCount: maxCount, doneCall: (buyCount: number) => {
                        UtilsUI.lockWait();
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait();
                            if (args.errorcode == 0) {
                                UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([{ inserts: args.itemInserts }]) });
                                this.onViewUpdate(null);
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityShopBuy, 0, null);
                            } else {
                                UtilsUI.showMsgTip(args.errorcode);
                            }
                        }, "qunyin_buy", {
                            count: buyCount
                        });
                    }
                });
            } else {
                UtilsUI.showMsgTip(StrVal.LYQUNYIN.STR31)
            }
        })
        // let btn_refresh:fgui.GButton = this.uiPanel.getChild("btn_refresh")
        this.registerRequest(() => {
            if (this.qunyinData) {
                this.initialize()
            }
        }, "activityStateChanged")
        this.registerRequest(() => {
            if (this.qunyinData) {
                this.initialize()
            }
        }, "qunyinChaBuyCountChanged")
    };
    private lessRank: number = 0
    private loadQunyinData(args): void {

        this.qunyinData = []
        let oppsArr: any = []
        oppsArr = args.opps
        oppsArr.sort((a, b) => {
            return a.rank - b.rank
        })

        for (let i = 0; i < oppsArr.length; i++) {
            let item = oppsArr[i];
            if (item.rank == 1) {
                this.rank1 = item
            } else if (item.rank == 2) {
                this.rank2 = item
            } else if (item.rank == 3) {
                this.rank3 = item
            } else {
                this.qunyinData.push(item)
            }
            if (item.id == this.fullInfo.base.guid) {
                this.lessRank = oppsArr[i + 1].rank
            }
        }
    }

    private onAchievement(): void {
        let achievementArr: any = this.activityXml._achievement[0]._item
        achievementArr.sort((a, b) => {
            return a.rank - b.rank
        })
        if (this.activityState.taid) {
            this.achievementItme = achievementArr[achievementArr.length - (1 + this.activityState.taid.length)]
        } else {
            this.achievementItme = achievementArr[achievementArr.length - 1]
        }
        let label_rank1: fgui.GLabel = this.uiPanel.getChild("label_rank1")
        let label_rank2: fgui.GLabel = this.uiPanel.getChild("label_rank2")
        if (this.achievementItme) {
            label_rank1.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR3, [this.achievementItme.rank])
            if (this.selfRank == 99999) {
                label_rank2.text = StrVal.LYQUNYIN.STR34
            } else {
                label_rank2.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR4, [this.selfRank])
            }
            if (this.selfRank <= this.achievementItme.rank) {
                this.ani.play(null, -1)
            } else {
                this.ani.stop()
            }
        } else {
            label_rank1.visible = false
            label_rank2.visible = false
            this.ani.stop()
        }
    }
    private onTime
    public loadExplore(): void {
        let label_coin: fgui.GComponent = this.uiPanel.getChild("label_coin")
        let itemCount = GameServerData.getInstance().getItemCountByProtoId(this.QUNYIN_ID)
        label_coin.text = UtilsTool.stringFormat("{0}/{1}", [itemCount, this.activityXml.chaTokenMax])
        let chaRecoverTime: number = this.fullInfo.chaRecoverTime + this.activityXml.chaRecoverMin * 60
        let label_time: fgui.GLabel = this.uiPanel.getChild("label_time")
        if (chaRecoverTime < GameServerData.getInstance().getServerTime() && itemCount < this.activityXml.chaTokenMax) {
            chaRecoverTime = GameServerData.getInstance().getServerTime() + this.activityXml.chaRecoverMin * 60
        }
        if (itemCount >= this.activityXml.chaTokenMax) {
            label_time.text = StrVal.LYQUNYIN.STR33
        } else {
            if (this.onTime) {
                this.clearInterval(this.onTime)
                this.onTime = null
            }
            this.onTime = this.setInterval(() => {
                let serverTime = GameServerData.getInstance().getServerTime()
                let time = chaRecoverTime - serverTime
                if (time <= 0) {
                    this.clearInterval(this.onTime)
                    label_time.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR7, [UtilsTool.splitTimeString(time)]);
                    this.onTime = null
                    this.loadExplore()
                } else {
                    label_time.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR7, [UtilsTool.splitTimeString(time)]);
                }
            }, 1000);
        }
    };

    private timea
    private initialize(): void {
        if (GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.QUNYIN)) {
            this.activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.QUNYIN).data.activityQunYin;
        }
        this.selfRank = this.activityState.rank <= 0 ? 99999 : this.activityState.rank
        // this.selfHighRank = this.activityState.highRank <= 0 ? 99999 : this.activityState.highRank
        this.selfHighRank = this.activityState.highRank == 0 ? 99999 : this.activityState.highRank
        this.onAchievement()
        // let label_coin: fgui.GComponent = this.uiPanel.getChild("label_coin")
        // let itemCount = GameServerData.getInstance().getItemCountByProtoId(this.QUNYIN_ID)
        // label_coin.text = UtilsTool.stringFormat("{0}/{1}", [itemCount, this.activityXml.chaTokenMax])
        // let label_time: fgui.GLabel = this.uiPanel.getChild("label_time")
        // if (itemCount >= this.activityXml.chaTokenMax) {
        //     label_time.text = StrVal.LYQUNYIN.STR33
        // } else {
        //     let chaRecoverTime: number = this.fullInfo.chaRecoverTime + this.activityXml.chaRecoverMin * 60
        //     chaRecoverTime = chaRecoverTime - Math.round(new Date().getTime() / 1000)
        //     if (this.timea == null) {
        //         this.timea = this.setInterval(() => {
        //             label_time.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR7, [UtilsTool.splitTimeString(chaRecoverTime)]);
        //             chaRecoverTime -= 1
        //             if (itemCount >= this.activityXml.chaTokenMax) {
        //                 // this.clearInterval(this.timea)
        //                 this.timea = null
        //                 // }
        //             }
        //         }, 1000)
        //     }
        // }
        this.loadExplore()
        let label_gold: fgui.GLabel = this.uiPanel.getChild("label_gold")
        label_gold.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR2, [this.fullInfo.base.stone, this.activityXml.refreshStone])

        let label_refreshNum: fgui.GLabel = this.uiPanel.getChild("label_refreshNum")

        label_refreshNum.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR1, [this.activityXml.refreshCount - this.fullInfo.base.qunyinRefreshCount, this.activityXml.refreshCount])
        let group_charts: fgui.GComponent = this.uiPanel.getChild("group_charts")
        let list_rank: fgui.GList = group_charts.getChild("list_rank")
        list_rank.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            if (index % 2 == 0) {
                obj.x = 100
            } else {
                obj.x = 450
            }
            if (index != 0) {
                if (index % 2 == 0) {
                    obj.getChild("img_right").visible = true
                } else {
                    obj.getChild("img_left").visible = true
                }
            }
            this.loadPlayer(obj, this.qunyinData[index])
        }).bind(this)
        list_rank.numItems = this.qunyinData.length
        list_rank.height = 310 * (this.qunyinData.length) + 200
        let img_bg: fgui.GLoader = group_charts.getChild("img_bg")
        // let bgHeight = 350 * (this.qunyinData.length) + 923
        // img_bg.height = bgHeight >= fgui.GRoot.inst.height ? bgHeight : fgui.GRoot.inst.height
        let group_rank1: fgui.GComponent = group_charts.getChild("group_rank1")
        let group_rank2: fgui.GComponent = group_charts.getChild("group_rank2")
        let group_rank3: fgui.GComponent = group_charts.getChild("group_rank3")
        this.loadPlayer(group_rank1, this.rank1)
        this.loadPlayer(group_rank2, this.rank2)
        this.loadPlayer(group_rank3, this.rank3)
    }

    private loadPlayer(obj: fgui.GComponent, data: any): void {
        if (data.isPlayer == 0) {
            let suit: any = null
            data.character = 1
            // data.model = 16
            data.model = this.onNpcRandom(data.rank).model
            suit = LocaleData.getCharSuitItem(data.model)
            data.jingjie = suit.phase
        }
        let label_combatPower: fgui.GTextField = obj.getChild("label_combatPower")
        label_combatPower.text = UtilsTool.nToFStr(data.power);
        let label_name: fgui.GTextField = obj.getChild("label_name")

        let loader_stage: fgui.GComponent = obj.getChild("loader_stage")
        UtilsUI.setTitleIconByTitleId(loader_stage, data.jingjie, data.title);
        let label_server: fgui.GLabel = obj.getChild("label_server")
        if (data.isPlayer == 1) {
            let serverItem = PlatformAPI.getGameServerItem(data.serverId);
            if (serverItem) {
                label_server.text = serverItem.name;
            } else {
                label_server.text = StrVal.LYQUNYIN.STR30
            }
            label_name.text = data.name
        } else {
            label_name.text = this.onNpcRandom(data.rank).name
            label_server.text = this.onNpcRandom(data.rank).serverName
        }
        // 上面2行要改为这样：
        let charInfo = LocaleData.getCharShowResInfo(data.character, data.jingjie, data.model, data.avatar);
        let mountInfo = LocaleData.getMountShowResInfo(data.mountType, data.mountSkin);
        new SpineRoldMountPlayer(obj.getChild("group_spine_ram")).loadSpineRole(charInfo).loadSpineMount(mountInfo);
        let group_player: fgui.GGroup = obj.getChild("group_player")
        group_player.visible = data.rank == this.selfRank
        let label_rank: fgui.GLabel = obj.getChild("label_rank")
        label_rank.text = data.rank
        label_rank.visible = data.rank > 3
        let loader_rank: fgui.GLoader = obj.getChild("loader_rank")
        if (data.rank <= 3) {
            loader_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_rank{0}", [data.rank])
            label_name.color = new Color(22, 25, 26);
        } else {
            loader_rank.url = "ui://CCommon/frame_rank odinary"
        }
        let btn_battle: fgui.GButton = obj.getChild("btn_battle")
        let btn_playerInfo: fgui.GButton = obj.getChild("btn_playerInfo")
        let group_speed: fgui.GGraph = obj.getChild("group_speed")
        let btn_speedBattle: fgui.GButton = obj.getChild("btn_speedBattle")
        btn_speedBattle.text = StrVal.LYQUNYIN.STR13
        let btn_speedNumBattle: fgui.GButton = obj.getChild("btn_speedNumBattle")
        let itemCount = GameServerData.getInstance().getItemCountByProtoId(this.QUNYIN_ID)
        btn_speedNumBattle.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR14, [itemCount])
        btn_playerInfo.onClick(() => {
            if (data.isPlayer == 1) {
                UtilsUI.onShowPlayerInfo(data.id);
            }
        })
        if (data.rank > 3 || this.selfRank <= 10) {
            if (data.rank == this.selfRank) {
                btn_battle.visible = false
                group_speed.visible = false
            } else {
                btn_battle.visible = data.rank < this.selfRank
                group_speed.visible = data.rank == this.lessRank
                if (data.rank > this.selfHighRank && data.isPlayer == 0) {
                    btn_battle.text = StrVal.LYQUNYIN.STR29
                } else {
                    btn_battle.text = StrVal.LYQUNYIN.STR15
                }
            }
            btn_battle.clearClick()
            btn_battle.onClick(() => {
                let oldRank = this.activityState.rank <= 0 ? 10000 : this.activityState.rank
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        let goldFinger:string;
                        if (args.itemInserts) {
                            goldFinger = GameServerData.getInstance().bonusesResultsToString([{inserts:args.itemInserts}]);
                        }
                        if (data.rank > this.selfHighRank && data.isPlayer == 0) {
                            let resultParams: BattleResultParams = {
                                battleResult: args.battleResult,
                                bonuseString: null,
                                bonuseStringGoldFinger: goldFinger,
                                typeInfo: {
                                    type: VarVal.BATTLE_TYPE.CROSS_QUNYIN,
                                    duelIcon1: LocaleData.getCharShowResInfoSelf().icon,
                                    duelIcon2: charInfo.icon,
                                    duelName1: GameServerData.getInstance().getPlayerFullInfo().base.name,
                                    duelName2: data.name,
                                    qunyinCount: 1,
                                    qunyinScore: Number(this.activityXml.score)
                                }
                            }
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleResult, 0, resultParams);
                        } else {
                            let resultParams: BattleResultParams = {
                                battleResult: args.battleResult,
                                bonuseString: null,
                                bonuseStringGoldFinger: goldFinger,
                                typeInfo: {
                                    type: VarVal.BATTLE_TYPE.CROSS_QUNYIN,
                                    duelIcon1: LocaleData.getCharShowResInfoSelf().icon,
                                    duelIcon2: charInfo.icon,
                                    duelName1: GameServerData.getInstance().getPlayerFullInfo().base.name,
                                    duelName2: data.name,
                                    qunyinRank: data.rank,
                                    qunyinRankUp: oldRank - data.rank,
                                    qunyinScore: Number(this.activityXml.score)
                                }
                            }
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleMain, 0, {
                                resultParams: resultParams,
                            });
                        }
                        this.loadQunyinData(args)
                        this.initialize()
                    } else {
                        this.initialize()
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "challengeOpp", {
                    oppRank: data.rank,
                    battleModelInfo: {
                        character: data.character,
                        phase: data.jingjie
                    }
                })
            })
            //速战
            btn_speedBattle.clearClick()
            btn_speedBattle.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        let goldFinger:string;
                        if (args.itemInserts) {
                            goldFinger = GameServerData.getInstance().bonusesResultsToString([{inserts:args.itemInserts}]);
                        }
                        // this.loadQunyinData(args)
                        let resultParams: BattleResultParams = {
                            battleResult: args.battleResult,
                            bonuseString: null,
                            bonuseStringGoldFinger: goldFinger,
                            typeInfo: {
                                type: VarVal.BATTLE_TYPE.CROSS_QUNYIN,
                                duelIcon1: LocaleData.getCharShowResInfoSelf().icon,
                                duelIcon2: charInfo.icon,
                                duelName1: GameServerData.getInstance().getPlayerFullInfo().base.name,
                                duelName2: data.name,
                                qunyinCount: 1,
                                qunyinScore: Number(this.activityXml.score)
                            }
                        }
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleResult, 0, resultParams);
                        this.initialize()
                    } else {
                        this.initialize()
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "challengeOpp", {
                    oppRank: data.rank,
                    battleModelInfo: {
                        character: data.character,
                        phase: data.jingjie
                    }
                })
            })
            //次数速战
            btn_speedNumBattle.clearClick()
            btn_speedNumBattle.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        let goldFinger:string;
                        if (args.itemInserts) {
                            goldFinger = GameServerData.getInstance().bonusesResultsToString([{inserts:args.itemInserts}]);
                        }
                        // this.loadQunyinData(args)
                        let resultParams: BattleResultParams = {
                            battleResult: args.battleResult,
                            bonuseString: null,
                            bonuseStringGoldFinger: goldFinger,
                            typeInfo: {
                                type: VarVal.BATTLE_TYPE.CROSS_QUNYIN,
                                duelIcon1: LocaleData.getCharShowResInfoSelf().icon,
                                duelIcon2: charInfo.icon,
                                duelName1: GameServerData.getInstance().getPlayerFullInfo().base.name,
                                duelName2: data.name,
                                qunyinCount: Number(itemCount),
                                qunyinScore: Number(this.activityXml.score) * Number(itemCount)
                            }
                        }
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleResult, 0, resultParams);
                        this.initialize()
                    } else {
                        this.initialize()
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "challengeOpp", {
                    oppRank: data.rank,
                    count: Number(itemCount),
                    battleModelInfo: {
                        character: data.character,
                        phase: data.jingjie
                    }
                })
            })
        }
    }

    public static isViewRedPoint(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.qunyin)) {
            return false;
        }
        if (GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.QUNYIN)) {
            let activityState: any
            let achievementItme: any
            activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.QUNYIN).data.activityQunYin;
            let selfRank = activityState.rank <= 0 ? 99999 : activityState.rank
            let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.QUNYIN);
            let achievementArr: any = activityXml._achievement[0]._item
            achievementArr.sort((a, b) => {
                return a.rank - b.rank
            })
            if (activityState.taid) {
                achievementItme = achievementArr[achievementArr.length - (1 + activityState.taid.length)]
            } else {
                achievementItme = achievementArr[achievementArr.length - 1]
            }
            let qunyinItem = LocaleData.getItemProtoBySubType(VarVal.itemtype.qunyin_challenge)
            let itemCount = GameServerData.getInstance().getItemCountByProtoId(qunyinItem.id)
            if (achievementItme) {
                let isRed = selfRank <= achievementItme.rank;
                if (!isRed) {
                    isRed = itemCount >= activityXml.chaTokenMax
                }
                return isRed
            }
        }
        return false
    }

    private onNpcRandom(rank: number): any {
        for (let i = 0; i < this.randomXml.length; i++) {
            const element = this.randomXml[i];
            if (rank < Number(element.rank)) {
                return element
            }
        }
    }
    public onViewUpdate(params: any): void {
        this.initialize()
    }


}