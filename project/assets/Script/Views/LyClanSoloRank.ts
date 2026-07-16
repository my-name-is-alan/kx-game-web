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
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyClanInfo } from "./LyClanInfo";
import { LyCompanionInfo } from "./LyCompanionInfo";
interface RankPlayer {
    rankOf: number, //排名
    model: string,
    power: string;
    isPlayer: string,
    phase: number,
    name: string,
    serverId: number,
    playerId: number,
    character: string,
    mountType: number,
    mountSkin: number,
    summonPet: string,
    summonPetProtoId: string,
    appearance: number,
    score: number
    avatar: number
    title: number
}
export class LyClanSoloRank extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClanSolo";
        this.viewResI.pkgName = "LyClanSolo";
        this.viewResI.comName = "LyClanSoloRank";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloRank, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloRank, 0, null);
        })
        let label_title: fgui.GLabel = this.uiPanel.getChild("label_title")
        label_title.text = StrVal.LYCLANSOLO.STR4
        let btn_gr: fgui.GButton = this.uiPanel.getChild("btn_gr")
        btn_gr.text = StrVal.LYCLANSOLO.STR10
        btn_gr.onClick(() => {
            label_title.text = StrVal.LYCLANSOLO.STR100
        })

        this.uiPanel.getChild("btn_bp", fgui.GButton).text = StrVal.LYCLANSOLO.STR9
        let btn_bp: fgui.GButton = this.uiPanel.getChild("btn_bp")
        btn_bp.text = StrVal.LYCLANSOLO.STR9
        btn_bp.onClick(() => {
            label_title.text = StrVal.LYCLANSOLO.STR4
        })

        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                console.log(args);
                this.onClanSoloClanRanks(args)
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "getClanSoloClanRanks", {
            from: 1,
            to: 200
        })

        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                console.log(args);
                this.onClanSoloPlayerRanks(args)
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "getClanSoloPlayerRanks", {
            from: 1,
            to: 200
        })
    };

    private onClanSoloPlayerRanks(params: any): void {
        let label_rank: fgui.GLabel = this.uiPanel.getChild("label_rank");
        label_rank.text = StrVal.LYACTIVITY_INVASION.STR8;
        let label_name: fgui.GLabel = this.uiPanel.getChild("label_name");
        label_name.text = StrVal.LYACTIVITY_INVASION.STR9;
        let label_desc: fgui.GLabel = this.uiPanel.getChild("label_desc");
        label_desc.text = StrVal.LYCLANSOLO.STR47;
        let label_selfrank: fgui.GLabel = this.uiPanel.getChild("label_selfrank");
        label_selfrank.text = (params.myRankOf > 0 ? String(params.myRankOf) : StrVal.LYCHALLENGE_DUEL.STR9);
        let label_selfdamage: fgui.GLabel = this.uiPanel.getChild("label_selfdamage");
        label_selfdamage.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR61, [UtilsTool.nToFStr(params.myRankScore)])

        let label_selfName: fgui.GLabel = this.uiPanel.getChild("label_selfName");
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo().base;
        label_selfName.text = fullInfo.name
        let duelRanks: Array<RankPlayer> = params.playerRanks;
        let group_players: Array<fgui.GComponent> = [
            this.uiPanel.getChild("group_player0"),
            this.uiPanel.getChild("group_player1"),
            this.uiPanel.getChild("group_player2")
        ]

        let charInfoself = LocaleData.getCharShowResInfoSelf();
        let group_headself: fgui.GComponent = this.uiPanel.getChild("group_head");
        let loader_iconself: fgui.GLoader = group_headself.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        loader_iconself.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfoself.icon]);

        // 列表
        let list_rank: fgui.GList = this.uiPanel.getChild("list_rank");
        list_rank.setVirtual();
        list_rank.itemRenderer = (index: number, child: fgui.GComponent) => {
            let rankItem = duelRanks[index + 3];
            if (rankItem.phase == 0) {
                rankItem.phase = 1
            }
            let charInfo = LocaleData.getCharShowResInfo(rankItem.character, rankItem.phase, rankItem.appearance, rankItem.avatar);
            let label_rank: fgui.GTextField = child.getChild("label_rank");
            let loader_rank: fgui.GLoader = child.getChild("loader_rank");
            let num = rankItem.rankOf;
            label_rank.text = num <= 3 ? "" : String(num);
            loader_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_ranking_{0}", [num <= 3 ? num : 0]);
            let group_head: fgui.GComponent = child.getChild("group_head");
            let loader_icon: fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            let btn_frame: fgui.GButton = group_head.getChild("btn_frame");
            btn_frame.clearClick();
            btn_frame.onClick(() => {
                UtilsUI.onShowPlayerInfo(String(rankItem.playerId));
            })
            let label_duelScore: fgui.GTextField = child.getChild("label_duelScore");
            label_duelScore.text = UtilsTool.nToFStr(rankItem.score);
            let label_name: fgui.GTextField = child.getChild("label_name");
            label_name.text = rankItem.name;
            let loader_phase: fgui.GComponent = child.getChild("loader_phase");
            UtilsUI.setTitleIconByTitleId(loader_phase, rankItem.phase, rankItem.title);
            child.clearClick()
            child.onClick(() => {
                UtilsUI.onShowPlayerInfo(String(rankItem.playerId));
            })
        }
        if (duelRanks.length > 3) {
            list_rank.numItems = duelRanks.length - 3;
        } else {
            list_rank.numItems = 0;
        }

        this.uiPanel.getChild("img_empty_mask").visible = (list_rank.numItems == 0);
        // list_rank.setVirtualAndLoop();
        // 下面是三个冠军位置
        for (let i = 0; i < 3; i++) {
            let group_player = group_players[i];
            let rankItem = duelRanks[i];
            if (rankItem) {
                group_player.getChild("group_empty").visible = false;
                group_player.getChild("group_used").visible = true;
                rankItem.character = "1"
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
                label_duelScore.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR61, [UtilsTool.nToFStr(rankItem.score)])
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
    private onClanSoloClanRanks(params: any): void {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanSoloPlayer: any = fullInfo.clanSoloPlayer
        let myselfClanInfo: any = clanSoloPlayer.myselfClanInfo
        let clanList = params.clanRanks
        let list_clan: fgui.GList = this.uiPanel.getChild("list_clan")
        list_clan.setVirtual();
        list_clan.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let clanInfoItem = clanList[index]
            obj.getChild("btn_item").clearClick()
            obj.getChild("btn_item").onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanInfo, 0, { members: args.members, calnItem: clanInfoItem });
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "getMembersByClan", {
                    clanId: clanInfoItem.clanId
                })
            })
            obj.getChild("label_name").text = clanInfoItem.name
            obj.getChild("label_level").text = UtilsTool.stringFormat(StrVal.LYCLAN.STR2, [clanInfoItem.level])
            obj.getChild("label_leaderName").text = clanInfoItem.leaderName
            obj.getChild("label_score").text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR61, [clanInfoItem.score])
            // obj.getChild("label_combatPower").text = UtilsTool.nToFStr(clanInfoItem.combatPower)
            let clanPhase = LocaleData.getClanPhaseById(clanInfoItem.phase)
            // obj.getChild("img_phase", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}", [clanPhase.icon]);
            let label_rank: fgui.GLabel = obj.getChild("label_rank")
            let img_rank: fgui.GLoader = obj.getChild("img_rank")
            if (index + 1 <= 3) {
                img_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_ranking_0{0}", [index + 1]);
                label_rank.visible = false
                img_rank.visible = true
            } else {
                label_rank.text = String(index + 1)
                label_rank.visible = true
                img_rank.visible = false
            }
            let img_flag: fgui.GLoader = obj.getChild("img_flag")
            img_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(clanInfoItem.flag).icon])
            // obj.onClick(() => {
            //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanInfo, 0, null);
            // })
        }).bind(this)
        let label_str94: fgui.GLabel = this.uiPanel.getChild("label_str94")
        if (myselfClanInfo) {
            label_str94.visible = false
            let label_clanName: fgui.GLabel = this.uiPanel.getChild("label_clanName")
            list_clan.numItems = clanList ? clanList.length : 0
            label_clanName.text = myselfClanInfo.name
            let label_flag: fgui.GLoader = this.uiPanel.getChild("label_flag")
            label_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(myselfClanInfo.flag).icon])
            // let label_level: fgui.GLabel = this.uiPanel.getChild("label_level")
            // label_level.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR2, [myselfClanInfo.level])
            // let label_leaderName: fgui.GLabel = this.uiPanel.getChild("label_leaderName")
            // label_leaderName.text = clanSelf.leaderName
            let label_clanRank: fgui.GLabel = this.uiPanel.getChild("label_clanRank")
            label_clanRank.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR18, [Number(params.myClanRankOf) < 0 ? StrVal.LYCLANSOLO.STR32 : params.myClanRankOf])
            // let label_combatPower: fgui.GLabel = this.uiPanel.getChild("label_combatPower")
            // label_combatPower.text = UtilsTool.nToFStr(myselfClanInfo.combatPower)
            let label_myClanRankScore: fgui.GLabel = this.uiPanel.getChild("label_myClanRankScore")
            label_myClanRankScore.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR61, [params.myClanRankScore])
        } else {
            let clanPlayer = fullInfo.clan
            if (clanPlayer.clanInfo && clanPlayer.clanInfo.name) {
                label_str94.visible = true
                label_str94.text = clanPlayer.clanInfo.name
            } else {
                label_str94.visible = true
                label_str94.text = StrVal.LYCLANSOLO.STR94
            }


        }
    }
    public getIsViewMask(): boolean {
        return false;
    };

}