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
import { LyGuideDetail } from "./LyGuideDetail";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { StrVal } from "../Values/StrVal";
import { LyChallengeDuelReward } from "./LyChallengeDuelReward";
import { LyChallengeDuelRecord } from "./LyChallengeDuelRecord";
import { LyChallengeDuelMatch } from "./LyChallengeDuelMatch";
import { AudioManager } from "../Kernel/AudioManager";
import { GameServerData } from "../Kernel/GameServerData";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";

export interface RankPlayer {
    guid: string,
    name: string,
    combatPower: number,
    phase: number,
    duelScore: number,
    rankOf: number,
    robot: number,
    mountType: number,
    mountSkin: number,
    summonPet: number,
    character: number,
    appearance: number,
    avatar: number,
    avatarBorder: number,
    title: number,
}

export class LyChallengeDuel extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyChallengeDuel;
        this.viewResI.pkgName = "LyChallengeDuel";
        this.viewResI.comName = "LyChallengeDuel";
    }

    private group_players:Array<fgui.GComponent>;
    private list_rank:fgui.GList;

    public static isSkipPlayAni:boolean;

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_DUEL_OPEN);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        if (LyChallengeDuel.isSkipPlayAni) {
            LyChallengeDuel.isSkipPlayAni = false;
        } else {
            UtilsUI.playCommonGroupAni(group_main);
        }

        let duelRoot = LocaleData.getDuelRoot();

        let btn_back:fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyChallengeDuel, 0, null);
        })

        let label_title:fgui.GButton = group_main.getChild("label_title");
        label_title.text = params.outItem.name;

        let btn_detail:fgui.GButton = group_main.getChild("btn_detail");
        btn_detail.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:params.outItem.name, detail:duelRoot.gameplayGuide});
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_rank:fgui.GButton = group_main.getChild("label_rank");
        label_rank.text = StrVal.LYACTIVITY_INVASION.STR8;
        let label_name:fgui.GButton = group_main.getChild("label_name");
        label_name.text = StrVal.LYACTIVITY_INVASION.STR9;
        let label_damage:fgui.GButton = group_main.getChild("label_damage");
        label_damage.text = StrVal.LYCHALLENGE_DUEL.STR8;

        this.group_players = [
            group_main.getChild("group_player0"),
            group_main.getChild("group_player1"),
            group_main.getChild("group_player2")
        ]
        // 列表
        this.list_rank = group_main.getChild("list_rank");
        this.list_rank.setVirtual();
        group_main.getChild("img_empty_mask").visible = true;
        this.doRefreshDuelRank();
        this.refreshDuelRank();

        let btn_reward:fgui.GButton = group_main.getChild("btn_reward");
        btn_reward.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyChallengeDuelReward, 0, {title:params.outItem.name, detail:duelRoot.detail});
        })

        let btn_record:fgui.GButton = group_main.getChild("btn_record");
        btn_record.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyChallengeDuelRecord, 0, null);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "getDuelInfo", null);
        })

        let btn_duel:fgui.GButton = group_main.getChild("btn_duel");
        PointRedData.getInstance().registerPoint(btn_duel, PointRedType.LyChallengeDuelMatch);
        btn_duel.text = StrVal.LYCHALLENGE_DUEL.STR21;
        btn_duel.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyChallengeDuelMatch, 0, null);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "getDuelInfo", null);
        })
    }

    public onViewUpdate(params: any): void {
        this.refreshDuelRank();
    }

    private refreshDuelRank():void { // 刷新同步一下
        GameServer.getInstance().send((args: any) => {
            if (args.errorcode == 0) {
                if (!this.isDisposed) {
                    this.doRefreshDuelRank();
                }
            } else {
                UtilsUI.showMsgTip(args.errorcode);
            }
        }, "getDuelRank", {
            from:1,
            to:200
        });
    }

    private doRefreshDuelRank():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");

        let duelInfo = GameServerData.getInstance().getDuelInfo();
        let duelRanks:Array<RankPlayer> = duelInfo.ranks;
        let rankOf:number = duelInfo.rankOf;
        let duelScore:number = duelInfo.duelScore;
        
        let charInfoself:ModelShowInfo = LocaleData.getCharShowResInfoSelf();
        let group_headself:fgui.GComponent = group_main.getChild("group_head");
        let loader_iconself:fgui.GLoader = group_headself.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        loader_iconself.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfoself.icon]);

        group_main.getChild("label_selfrank", fgui.GTextField).text = UtilsTool.stringFormat(StrVal.LYCHALLENGE_DUEL.STR1, [rankOf > 0 ? rankOf : StrVal.LYCHALLENGE_DUEL.STR9]);
        group_main.getChild("label_selfscore", fgui.GTextField).text = UtilsTool.stringFormat(StrVal.LYCHALLENGE_DUEL.STR2, [duelScore]);
        
        this.list_rank.itemRenderer = (index:number, child:fgui.GComponent) => {
            let rankItem = duelRanks[index + 3];

            let charInfo:ModelShowInfo;
            if (rankItem.robot == 0) {
                charInfo = LocaleData.getCharShowResInfo(rankItem.character, rankItem.phase, rankItem.appearance, rankItem.avatar);
            } else {
                let monsterProto = LocaleData.getMonsterProto(rankItem.guid);
                charInfo = LocaleData.getModelShowInfo(monsterProto.modelId);
            }

            let label_rank:fgui.GTextField = child.getChild("label_rank");

            let loader_rank:fgui.GLoader = child.getChild("loader_rank");

            let num = rankItem.rankOf;
            label_rank.text = num <= 3 ? "" : String(num);
            loader_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_ranking_{0}", [num <= 3 ? num : 0]);

            let group_head:fgui.GComponent = child.getChild("group_head");
            let loader_icon:fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            let btn_frame:fgui.GButton = group_head.getChild("btn_frame");
            btn_frame.clearClick();
            btn_frame.onClick(() => {
                if (rankItem.robot == 0) {
                    UtilsUI.onShowPlayerInfo(rankItem.guid);
                }
            })

            let label_name:fgui.GTextField = child.getChild("label_name");
            label_name.text = rankItem.name;

            let loader_phase:fgui.GComponent = child.getChild("loader_phase");
            UtilsUI.setTitleIconByTitleId(loader_phase, rankItem.phase, rankItem.title);
            
            let label_duelScore:fgui.GTextField = child.getChild("label_duelScore");
            label_duelScore.text = String(rankItem.duelScore);

            // child.getChild("loader_item", fgui.GLoader).url = UtilsUI.getItemIconUrl(VarVal.bonusType.duelscore);
        }
        if (duelRanks.length > 3) {
            UtilsUI.setFguiGlistDelayNumItems(this.list_rank, duelRanks.length - 3);
        } else {
            this.list_rank.numItems = 0;
        }
        group_main.getChild("img_empty_mask").visible = (this.list_rank.numItems == 0);

        // 下面是三个冠军位置
        for (let i = 0; i < 3; i++) {
            let group_player = this.group_players[i];
            let rankItem = duelRanks[i];
            if (rankItem) {
                group_player.getChild("group_empty").visible = false;
                group_player.getChild("group_used").visible = true;

                let charInfo:ModelShowInfo;
                if (rankItem.robot == 0) {
                    charInfo = LocaleData.getCharShowResInfo(rankItem.character, rankItem.phase, rankItem.appearance, rankItem.avatar);
                } else {
                    let monsterProto = LocaleData.getMonsterProto(rankItem.guid);
                    charInfo = LocaleData.getModelShowInfo(monsterProto.modelId);
                }
                let mountInfo = LocaleData.getMountShowResInfo(rankItem.mountType, rankItem.mountSkin);
                new SpineRoldMountPlayer(group_player.getChild("group_spine_ram")).loadSpineRole(charInfo).loadSpineMount(mountInfo);

                if (rankItem.summonPet && String(rankItem.summonPet).length > 1) {
                    let petProto = LocaleData.getPetProto(rankItem.summonPet);
                    new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
                        spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                    }, group_player.getChild("loader_spine_pet"), petProto.modelId);
                }

                let loader_phase:fgui.GComponent = group_player.getChild("loader_phase");
                UtilsUI.setTitleIconByTitleId(loader_phase, rankItem.phase, rankItem.title);

                let loader_rank:fgui.GLoader = group_player.getChild("loader_rank");
                loader_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_rank{0}", [rankItem.rankOf]);

                let label_name:fgui.GTextField = group_player.getChild("label_name");
                label_name.text = rankItem.name;

                let label_duelScore:fgui.GTextField = group_player.getChild("label_duelScore");
                label_duelScore.text = UtilsTool.stringFormat(StrVal.LYCHALLENGE_DUEL.STR7, [rankItem.duelScore]);

                // group_player.getChild("loader_item", fgui.GLoader).url = UtilsUI.getItemIconUrl(VarVal.bonusType.duelscore);

                let btn_graph:fgui.GButton = group_player.getChild("btn_graph");
                btn_graph.clearClick();
                btn_graph.onClick(() => {
                    if (rankItem.robot == 0) {
                        UtilsUI.onShowPlayerInfo(rankItem.guid);
                    }
                })
            } else {
                group_player.getChild("group_empty").visible = true;
                group_player.getChild("group_used").visible = false;
            }
        }
    }
    
    public getIsViewMask():boolean {
        return false;
    }
}