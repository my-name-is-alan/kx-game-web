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
import { BattleResultParams, UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { LyBattleMain } from "./LyBattleMain";
import { LyChallengeDuel, RankPlayer } from "./LyChallengeDuel";
import { LyGuideGetItem } from "./LyGuideGetItem";

export class LyChallengeDuelRecord extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyChallengeDuel;
        this.viewResI.pkgName = "LyChallengeDuel";
        this.viewResI.comName = "LyChallengeDuelRecord";
    }

    private count:number;
    private recordItems:Array<any>;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let btn_back:fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyChallengeDuelRecord, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_title:fgui.GButton = group_main.getChild("label_title");
        label_title.text = StrVal.LYCHALLENGE_DUEL.STR11;

        let evolutionRoot = LocaleData.getEvolutionRoot();
        let proto = LocaleData.getItemProto(evolutionRoot.duelItemId);

        let btn_add:fgui.GButton = group_main.getChild("btn_add");
        btn_add.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, proto.id, "1"), buyCall:() => {
                this.updateShow();
            }});
        })

        // 列表
        let list_record:fgui.GList = group_main.getChild("list_record");
        list_record.setVirtual();
        list_record.itemRenderer = (index:number, child:fgui.GComponent) => {
            let recordItem = this.recordItems[index];
            let rankPlayer:RankPlayer = recordItem.opponent;

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

            let label_time:fgui.GTextField = child.getChild("label_time");
            let nowtime = recordItem.timestamp * 1000;
            let daystart = UtilsTool.getStartDateTime(GameServerData.getInstance().getServerTime() * 1000);
            if (nowtime < daystart) {
                label_time.text = StrVal.LYCHALLENGE_DUEL.STR17;
            } else {
                label_time.text = UtilsTool.stringFormat(StrVal.LYCHALLENGE_DUEL.STR16, [UtilsTool.splitTimeString((nowtime - daystart) / 1000, true)]);
            }

            let label_power:fgui.GTextField = child.getChild("label_power");
            label_power.text = UtilsTool.nToFStr(rankPlayer.combatPower);

            let loader_need:fgui.GLoader = child.getChild("loader_need");
            loader_need.url = UtilsTool.stringFormat("ui://CCommon/{0}", [proto.icon]);

            let label_count:fgui.GTextField = child.getChild("label_count");
            label_count.text = "1";
            label_count.color = UtilsUI.getEnoughColor(this.count > 0);

            let btn_challenge:fgui.GButton = child.getChild("btn_challenge");
            btn_challenge.clearClick();
            btn_challenge.onClick(() => {
                if (recordItem.canCounter == 0) {
                    UtilsUI.showMsgTip(StrVal.LYCHALLENGE_DUEL.STR18);
                    return;
                }
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
                        // 刷新挑战令数量
                        this.updateShow();
                        // 刷新排行榜显示
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyChallengeDuel, 0, null);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "duel", {
                    opponentId:rankPlayer.guid
                });
            })

            let label_result:fgui.GTextField = child.getChild("label_result");
            let label_score:fgui.GTextField = child.getChild("label_score");
            label_result.text = "";
            label_score.text = "";
            if (recordItem.scoreChange > 0) {
                label_result.text = UtilsTool.stringFormat(StrVal.LYCHALLENGE_DUEL.STR19, [recordItem.scoreChange]);
            } else if (recordItem.scoreChange < 0) {
                label_score.text = UtilsTool.stringFormat(StrVal.LYCHALLENGE_DUEL.STR14, [recordItem.scoreChange]);
            }

            if (recordItem.won == 1) {
                loader_need.visible = false;
            } else {
                loader_need.visible = recordItem.canCounter == 1;
            }
            label_count.visible = loader_need.visible;
            btn_challenge.visible = loader_need.visible;

            child.getChild("img_win").visible = recordItem.won == 1;
            child.getChild("img_lost").visible = recordItem.won == 0;

            child.getChild("img_bedo").visible = recordItem.side == 1;
            child.getChild("img_selfdo").visible = recordItem.side == 0;
        }
        this.updateShow();
    }

    private updateShow():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");

        let evolutionRoot = LocaleData.getEvolutionRoot();
        this.count = GameServerData.getInstance().getItemCountByProtoId(evolutionRoot.duelItemId);
        let countMax:number = UtilsUI.getDuelItemLimitCount();

        let label_count:fgui.GButton = group_main.getChild("label_count");
        label_count.text = UtilsTool.stringFormat("{0}/{1}", [this.count, countMax]);
        // label_count.color = UtilsUI.getEnoughColor(this.count > 0);

        let proto = LocaleData.getItemProto(evolutionRoot.duelItemId);
        let loader_icon:fgui.GLoader = group_main.getChild("loader_icon");
        loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [proto.icon]);

        let duelInfo = GameServerData.getInstance().getDuelInfo();
        this.recordItems = duelInfo.duelRecord;
        // 按照timestamp大到小排序
        this.recordItems.sort((itemA, itemB) => {
            return itemB.timestamp - itemA.timestamp;
        })
        let list_record:fgui.GList = group_main.getChild("list_record");
        UtilsUI.setFguiGlistDelayNumItems(list_record, this.recordItems.length);
    }
    
    public getIsViewMask():boolean {
        return false;
    }
}