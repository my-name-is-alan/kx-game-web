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
import { LocaleData, ModelShowInfo } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { GameServerData } from "../Kernel/GameServerData";
import { BattleResultParams, BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { LyBattleMain } from "./LyBattleMain";
import { LyChallengeDuel, RankPlayer } from "./LyChallengeDuel";
import { LyGuideGetItem } from "./LyGuideGetItem";

export class LyChallengeDuelMatch extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyChallengeDuel;
        this.viewResI.pkgName = "LyChallengeDuel";
        this.viewResI.comName = "LyChallengeDuelMatch";
    }

    private count:number;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let btn_back:fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyChallengeDuelMatch, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let btn_add:fgui.GButton = group_main.getChild("btn_add");
        btn_add.onClick(() => {
            let evolutionRoot = LocaleData.getEvolutionRoot();
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, evolutionRoot.duelItemId, "1"), buyCall:() => {
                this.updateShow();
            }});
        })

        let label_title:fgui.GButton = group_main.getChild("label_title");
        label_title.text = StrVal.LYCHALLENGE_DUEL.STR21;

        let duelInfo = GameServerData.getInstance().getDuelInfo();
        let duelItems:Array<any> = duelInfo.duelList;
        this.sortPower(duelItems);
        
        // 列表
        let list_match:fgui.GList = group_main.getChild("list_match");
        list_match.setVirtual();
        list_match.itemRenderer = (index:number, child:fgui.GComponent) => {
            let rankPlayer:RankPlayer = duelItems[index];

            let charInfo:ModelShowInfo;
            if (rankPlayer.robot == 0) {
                charInfo = LocaleData.getCharShowResInfo(rankPlayer.character, rankPlayer.phase, rankPlayer.appearance, rankPlayer.avatar);
            } else {
                let monsterProto = LocaleData.getMonsterProto(rankPlayer.guid);
                charInfo = LocaleData.getModelShowInfo(monsterProto.modelId);
            }

            let group_head:fgui.GComponent = child.getChild("group_head");
            let loader_icon:fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            let btn_frame:fgui.GButton = group_head.getChild("btn_frame");
            btn_frame.clearClick();
            btn_frame.onClick(() => {
                if (rankPlayer.robot == 0) {
                    UtilsUI.onShowPlayerInfo(rankPlayer.guid);
                }
            })

            let label_name:fgui.GTextField = child.getChild("label_name");
            label_name.text = rankPlayer.name;

            let label_score:fgui.GTextField = child.getChild("label_score");
            label_score.text = UtilsTool.stringFormat(StrVal.LYCHALLENGE_DUEL.STR23, [rankPlayer.duelScore]);

            let label_power:fgui.GTextField = child.getChild("label_power");
            label_power.text = UtilsTool.nToFStr(rankPlayer.combatPower);

            // 奖励
            let bonuseItems:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(LocaleData.getDuelRoot().victoryBonusesId);
            let list_item:fgui.GList = child.getChild("list_item");
            list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
            }
            list_item.numItems = bonuseItems.length;

            let btn_challenge:fgui.GButton = child.getChild("btn_challenge");
            // btn_challenge.text = StrVal.LYCHALLENGE_DUEL.STR21;
            btn_challenge.clearClick();
            btn_challenge.onClick(() => {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (this.count <= 0) {
                        btn_add.fireClick();
                    }
                    if (args.errorcode == 0) {
                        let companion:string;
                        if (args.companionBoostReward) {
                            companion = GameServerData.getInstance().bonusesResultsToString([args.companionBoostReward]);
                        }
                        let goldFinger:string;
                        if (args.itemInserts) {
                            goldFinger = GameServerData.getInstance().bonusesResultsToString([{inserts:args.itemInserts}]);
                        }
                        let resultParams:BattleResultParams = {
                            battleResult: args.battleResult,
                            bonuseString: GameServerData.getInstance().bonusesResultsToString([args.victoryReward]),
                            bonuseStringCompanion: companion,
                            bonuseStringGoldFinger: goldFinger,
                            typeInfo: {
                                type: VarVal.BATTLE_TYPE.DUEL,

                                duelIcon1:LocaleData.getCharShowResInfoSelf().icon,
                                duelIcon2:charInfo.icon,
                                duelName1:GameServerData.getInstance().getPlayerFullInfo().base.name,
                                duelName2:rankPlayer.name,
                                duelScore1:args.duelScore,
                                duelScore2:args.oppScore,
                                duelScoreAdd1:args.myScoreChange,
                                duelScoreAdd2:args.oppScoreChange
                            }
                        }
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleMain, 0, {
                            resultParams:resultParams,
                        });
                        duelItems = args.duelList;
                        this.sortPower(duelItems);
                        list_match.numItems = duelItems.length;
                        // 刷新排行榜显示
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyChallengeDuel, 0, null);
                        // 刷新挑战令剩余+战力提升
                        this.updateShow();
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "duel", {
                    opponentId:rankPlayer.guid
                });
            })
        }
        UtilsUI.setFguiGlistDelayNumItems(list_match, duelItems.length);

        let btn_refresh:fgui.GButton = group_main.getChild("btn_refresh");
        btn_refresh.text = StrVal.LYCHALLENGE_DUEL.STR22;
        btn_refresh.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    duelItems = args.duelList;
                    this.sortPower(duelItems);
                    list_match.numItems = duelItems.length;
                    // 消耗刷新
                    // this.updateShow(); // playerAttrChanged中更新
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "refreshDuelList", null);
        })

        this.updateShow();

        this.registerRequest((args) => {
            if (args.key == "money" && args.isNewValue) {
                this.updateShow();
            }
        }, "playerAttrChanged");
    }

    private sortPower(items:Array<any>):void {
        items.sort((itemA, itemB) => {
            return Number(itemB.combatPower) - Number(itemA.combatPower);
        })
    }

    private updateShow():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");

        let evolutionRoot = LocaleData.getEvolutionRoot();
        let countMax:number = UtilsUI.getDuelItemLimitCount();
        this.count = GameServerData.getInstance().getItemCountByProtoId(evolutionRoot.duelItemId);

        let loader_icon:fgui.GLoader = group_main.getChild("loader_icon");
        loader_icon.url = UtilsUI.getItemIconUrl(evolutionRoot.duelItemId);

        let label_count:fgui.GTextField = group_main.getChild("label_count");
        label_count.text = UtilsTool.stringFormat("{0}/{1}", [this.count, countMax]);
        // label_count.color = UtilsUI.getEnoughColor(this.count > 0);

        let fullInfo = GameServerData.getInstance().getPlayerFullInfo();

        let label_combatPower:fgui.GTextField = group_main.getChild("label_combatPower")
        label_combatPower.text = UtilsTool.nToFStr(fullInfo.base.combatPower);

        let refreshMoneyAmount = Number(LocaleData.getDuelRoot().refreshMoneyAmount);
        let label_need:fgui.GTextField = group_main.getChild("label_need");
        label_need.text = UtilsTool.stringFormat("{0}/{1}", [UtilsTool.nToFStr(fullInfo.base.money), refreshMoneyAmount]);
        label_need.color = UtilsUI.getEnoughColor(fullInfo.base.money >= refreshMoneyAmount);
    }
    
    public getIsViewMask():boolean {
        return false;
    }

    public static isViewRedPoint():boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.duel)) {
            return false;
        }
        let evolutionRoot = LocaleData.getEvolutionRoot();
        let count:number = GameServerData.getInstance().getItemCountByProtoId(evolutionRoot.duelItemId);
        return count > 0;
    }
}