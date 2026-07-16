//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { PlatformAPI } from "../Kernel/PlatformAPI";

interface RankPlayer {
    playerId: string,
    name: string,
    character: number,
    avatar: number,
    appearance: number,
    combatPower: number,
    phase: number,
    level: number,
    mountType: number,
    mountSkin: number,
    summonPetProtoId: number,
    title: number,
    rankOf: number,
    score: number,
    serverId: number
}

export class LyConquestSeekRank extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyConquestSeek;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyConquestSeek;
        this.viewResI.comName = "LyConquestSeekRank";
    }

    selIndex:number;
    initSolo:boolean;
    initPlayer:boolean;

    public onViewCreate(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel()
        let group_main = uiPanel.getChild("group_main", fgui.GComponent)
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_close: fgui.GButton = uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyConquestSeekRank, 0, null);
        })

        let btn_close1: fgui.GButton = group_main.getChild("btn_close1");
        btn_close1.onClick(() => {
            btn_close.fireClick();
        })

        this.selIndex = 1;
        
        let label_title: fgui.GLabel = group_main.getChild("label_title")
        label_title.text = StrVal.LYCLANSOLO.STR4

        let btn_gr: fgui.GButton = group_main.getChild("btn_gr")
        btn_gr.text = StrVal.LYCLANSOLO.STR10
        btn_gr.onClick(() => {
            this.selIndex = 2;
            this.refreshRankInfo()
            label_title.text = StrVal.LYCLANSOLO.STR100
        })

        let btn_bp: fgui.GButton = group_main.getChild("btn_bp")
        btn_bp.text = StrVal.LYCLANSOLO.STR9
        btn_bp.onClick(() => {
            this.selIndex = 1;
            this.refreshRankInfo()
            label_title.text = StrVal.LYCLANSOLO.STR4
        })

        this.refreshRankInfo();
    };

    private refreshRankInfo(): void {
        if (this.selIndex == 1) {
            if (!this.initSolo) {
                this.initSolo = true;
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        if (args.clanRanks) {
                            this.onClanRanks(args);
                        }
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "getConquestClanScoreRank", {
                    from: 1,
                    to: 200
                })
            }
        } else {
            if (!this.initPlayer) {
                this.initPlayer = true;
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        if (args.playerRanks) {
                            this.onPlayerRanks(args);
                        }
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "getConquestPlayerKillRank", {
                    from: 1,
                    to: 200
                })
            }
        }
    }

    private onClanRanks(args: any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel()
        let group_main = uiPanel.getChild("group_main", fgui.GComponent)

        let clanList = args.clanRanks;
        let list_clan: fgui.GList = group_main.getChild("list_clan")
        list_clan.setVirtual();
        list_clan.itemRenderer = (index: number, group_item: fgui.GButton) => {
            let clanInfoItem = clanList[index];

            let label_rank: fgui.GLabel = group_item.getChild("label_rank")
            let img_rank: fgui.GLoader = group_item.getChild("img_rank")
            if (clanInfoItem.rankOf <= 3) {
                img_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_ranking_0{0}", [clanInfoItem.rankOf]);
                label_rank.visible = false
                img_rank.visible = true
            } else {
                label_rank.text = String(clanInfoItem.rankOf)
                label_rank.visible = true
                img_rank.visible = false
            }

            let img_flag: fgui.GLoader = group_item.getChild("img_flag")
            img_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(clanInfoItem.flag).icon])

            let btn_item = group_item.getChild("btn_item", fgui.GButton);
            btn_item.clearClick();
            btn_item.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        // clanInfoItem 参数不足以显示
                        // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanInfo, 0, { members: args.members, calnItem: clanInfoItem });
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "getMembersByClan", {
                    clanId: clanInfoItem.clanId
                })
            })

            group_item.getChild("label_name").text = clanInfoItem.name
            group_item.getChild("label_level").text = UtilsTool.stringFormat(StrVal.LYCLAN.STR2, [clanInfoItem.level])
            let server = PlatformAPI.getGameServerItem(clanInfoItem.serverId)
            if (server) {
                group_item.getChild("label_leaderName").text = server.name
            } else {
                group_item.getChild("label_leaderName").text = ""
            }
            group_item.getChild("label_score").text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR61, [clanInfoItem.score])
        }
        UtilsUI.setFguiGlistDelayNumItems(list_clan, clanList.length);
        group_main.getChild("img_empty_mask1").visible = (list_clan.numItems == 0);

        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let label_str94: fgui.GLabel = group_main.getChild("label_str94")
        if (GameServerData.getInstance().isClanHas()) {
            label_str94.visible = false
            group_main.getChild("group_selfclan").visible = true;

            let label_flag: fgui.GLoader = group_main.getChild("label_flag")
            label_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(fullInfo.clan.clanInfo.flag).icon])

            let label_clanName: fgui.GLabel = group_main.getChild("label_clanName")
            label_clanName.text = fullInfo.clan.clanInfo.name

            let label_clanRank: fgui.GLabel = group_main.getChild("label_clanRank")
            label_clanRank.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR18, [args.myClanRankOf < 0 ? StrVal.LYCLANSOLO.STR32 : args.myClanRankOf])

            let label_myClanRankScore: fgui.GLabel = group_main.getChild("label_myClanRankScore")
            label_myClanRankScore.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR61, [args.myClanRankScore])
        } else {
            group_main.getChild("group_selfclan").visible = false;
            label_str94.visible = true
            label_str94.text = StrVal.LYCLANSOLO.STR94
        }
    }

    private onPlayerRanks(args: any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel()
        let group_main = uiPanel.getChild("group_main", fgui.GComponent)

        let label_rank: fgui.GLabel = group_main.getChild("label_rank");
        label_rank.text = StrVal.LYACTIVITY_INVASION.STR8;
        let label_name: fgui.GLabel = group_main.getChild("label_name");
        label_name.text = StrVal.LYACTIVITY_INVASION.STR9;
        let label_desc: fgui.GLabel = group_main.getChild("label_desc");
        label_desc.text = StrVal.LYCONQUESTSEEK.STR208;

        let label_selfrank: fgui.GLabel = group_main.getChild("label_selfrank");
        label_selfrank.text = (args.myRankOf > 0 ? String(args.myRankOf) : StrVal.LYCHALLENGE_DUEL.STR9);
        let label_selfdamage: fgui.GLabel = group_main.getChild("label_selfdamage");
        label_selfdamage.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR207, [UtilsTool.nToFStr(args.myRankScore)])

        let label_selfName: fgui.GLabel = group_main.getChild("label_selfName");
        label_selfName.text = GameServerData.getInstance().getPlayerFullInfo().base.name;
        let duelRanks: Array<RankPlayer> = args.playerRanks;
        let group_players: Array<fgui.GComponent> = [
            group_main.getChild("group_player0"),
            group_main.getChild("group_player1"),
            group_main.getChild("group_player2")
        ]

        let charInfoself = LocaleData.getCharShowResInfoSelf();
        let group_headself: fgui.GComponent = group_main.getChild("group_head");
        let loader_iconself: fgui.GLoader = group_headself.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        loader_iconself.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfoself.icon]);

        // 列表
        let list_rank: fgui.GList = group_main.getChild("list_rank");
        list_rank.setVirtual();
        list_rank.itemRenderer = (index: number, child: fgui.GComponent) => {
            let rankItem = duelRanks[index + 3];
            if (rankItem.phase == 0) {
                rankItem.phase = 1
            }

            let label_rank: fgui.GTextField = child.getChild("label_rank");
            let loader_rank: fgui.GLoader = child.getChild("loader_rank");
            let num = rankItem.rankOf;
            label_rank.text = num <= 3 ? "" : String(num);
            loader_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_ranking_{0}", [num <= 3 ? num : 0]);
            let group_head: fgui.GComponent = child.getChild("group_head");

            let charInfo = LocaleData.getCharShowResInfo(rankItem.character, rankItem.phase, rankItem.appearance, rankItem.avatar);
            let loader_icon: fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            let btn_frame: fgui.GButton = group_head.getChild("btn_frame");
            btn_frame.clearClick();
            btn_frame.onClick(() => {
                UtilsUI.onShowPlayerInfo(rankItem.playerId);
            })

            let label_duelScore: fgui.GTextField = child.getChild("label_duelScore");
            label_duelScore.text = UtilsTool.nToFStr(rankItem.score);

            let label_name: fgui.GTextField = child.getChild("label_name");
            label_name.text = rankItem.name;

            let label_server = child.getChild("label_server")
            let server = PlatformAPI.getGameServerItem(rankItem.serverId)
            if (server) {
                label_server.text = server.name
            } else {
                label_server.text = ""
            }

            let loader_phase: fgui.GComponent = child.getChild("loader_phase");
            UtilsUI.setTitleIconByTitleId(loader_phase, rankItem.phase, rankItem.title);

            /*
            child.clearClick()
            child.onClick(() => {
                UtilsUI.onShowPlayerInfo(rankItem.playerId);
            })
            */
        }
        if (duelRanks.length > 3) {
            UtilsUI.setFguiGlistDelayNumItems(list_rank, duelRanks.length - 3);
        } else {
            list_rank.numItems = 0;
        }
        group_main.getChild("img_empty_mask").visible = (list_rank.numItems == 0);
        
        // 下面是三个冠军位置
        for (let i = 0; i < 3; i++) {
            let group_player = group_players[i];
            let rankItem = duelRanks[i];
            if (rankItem) {
                group_player.getChild("group_empty").visible = false;
                group_player.getChild("group_used").visible = true;

                let charInfo = LocaleData.getCharShowResInfo(rankItem.character, rankItem.phase, rankItem.appearance, null);
                let mountInfo = LocaleData.getMountShowResInfo(rankItem.mountType, rankItem.mountSkin);
                new SpineRoldMountPlayer(group_player.getChild("group_spine_ram")).loadSpineRole(charInfo).loadSpineMount(mountInfo);
                if (rankItem.summonPetProtoId && String(rankItem.summonPetProtoId).length > 1) {
                    let petProto = LocaleData.getPetProto(rankItem.summonPetProtoId);
                    new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                        spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                    }, group_player.getChild("loader_spine_pet"), petProto.modelId);
                }
                let loader_phase: fgui.GComponent = group_player.getChild("loader_phase");
                UtilsUI.setTitleIconByTitleId(loader_phase, rankItem.phase, rankItem.title);

                let loader_rank: fgui.GLoader = group_player.getChild("loader_rank");
                loader_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_rank{0}", [rankItem.rankOf]);
                let label_name: fgui.GTextField = group_player.getChild("label_name");
                label_name.text = rankItem.name;
                let label_duelScore: fgui.GTextField = group_player.getChild("label_duelScore");
                label_duelScore.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR207, [UtilsTool.nToFStr(rankItem.score)])

                let server = PlatformAPI.getGameServerItem(rankItem.serverId)
                let label_server: fgui.GTextField = group_player.getChild("label_server");
                if (server) {
                    label_server.text = server.name
                } else {
                    label_server.text = ""
                }
                
                let btn_graph: fgui.GButton = group_player.getChild("btn_graph");
                btn_graph.clearClick();
                btn_graph.onClick(() => {
                    UtilsUI.onShowPlayerInfo(String(rankItem.playerId));
                })
            } else {
                group_player.getChild("group_empty").visible = true;
                group_player.getChild("group_used").visible = false;
            }
        }
    }

    public getIsViewMask(): boolean {
        return false;
    };
}