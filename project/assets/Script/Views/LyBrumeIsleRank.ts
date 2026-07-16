//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { ActivityRankPlayer, BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { LyGuideDetail } from "./LyGuideDetail";
import { LyChatRoom } from "./LyChatRoom";
import { GameServer } from "../Kernel/GameServer";
import { LyBrumeIsleLand } from "./LyBrumeIsleLand";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { Label } from "cc";
import { LyBrumeNote } from "./LyBrumeNote";

export class LyBrumeIsleRank extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyBrumeIsle";
        this.viewResI.pkgName = "LyBrumeIsle";
        this.viewResI.comName = "LyBrumeIsleRank";
    }

    private xmlRoot: any
    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");
        this.xmlRoot = LocaleData.getBrumeIsleConfig()
        getUiPanel.getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleRank, 0, null);
        });
        group_main.getChild("btn_close").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleRank, 0, null);
        });

        let soloScoreProto = LocaleData.getItemProto(VarVal.bonusType.brumeIsleScore)
        let clanScoreProto = LocaleData.getItemProto(VarVal.bonusType.brumeIsleClanScore)

        let data = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster
        let label_rank:fgui.GButton = group_main.getChild("label_rank");
        label_rank.text = StrVal.LYACTIVITY_INVASION.STR8;
        let label_name:fgui.GButton = group_main.getChild("label_name");
        label_name.text = StrVal.LYACTIVITY_INVASION.STR9;
        let label_damage:fgui.GButton = group_main.getChild("label_damage");
        label_damage.text = soloScoreProto.name;

        let charInfoself = LocaleData.getCharShowResInfoSelf();
        let group_headself:fgui.GComponent = group_main.getChild("group_head");
        let loader_iconself:fgui.GLoader = group_headself.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        loader_iconself.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfoself.icon]);

        let label_selfrank:fgui.GButton = group_main.getChild("label_selfrank");
        label_selfrank.text = (params.rankOf > 0 ? String(params.rankOf) : StrVal.LYCHALLENGE_DUEL.STR9);
        let label_selfdamage:fgui.GButton = group_main.getChild("label_selfdamage");
        label_selfdamage.text = soloScoreProto.name + ":" + [UtilsTool.nToFStr(data.pRankNum)];

        let duelRanks:Array<ActivityRankPlayer> = params.ranks;
        let group_players:Array<fgui.GComponent> = [
            group_main.getChild("group_player0"),
            group_main.getChild("group_player1"),
            group_main.getChild("group_player2")
        ]
        // 列表
        let list_rank:fgui.GList = group_main.getChild("list_rank");
        list_rank.setVirtual();
        list_rank.itemRenderer = (index:number, child:fgui.GComponent) => {
            let rankItem = duelRanks[index + 3];

            let charInfo = LocaleData.getCharShowResInfo(rankItem.character, rankItem.phase, rankItem.appearance, rankItem.avatar);

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
                UtilsUI.onShowPlayerInfo(rankItem.guid);
            })

            let label_name:fgui.GTextField = child.getChild("label_name");
            label_name.text = rankItem.name;

            let loader_phase:fgui.GComponent = child.getChild("loader_phase");
            UtilsUI.setTitleIconByTitleId(loader_phase, rankItem.phase, rankItem.title);
            
            let label_duelScore:fgui.GTextField = child.getChild("label_duelScore");
            label_duelScore.text = soloScoreProto.name + ":" + UtilsTool.nToFStr(rankItem.score)
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

                let charInfo = LocaleData.getCharShowResInfo(rankItem.character, rankItem.phase, rankItem.appearance, rankItem.avatar);
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
                label_duelScore.text = soloScoreProto.name + ":" + UtilsTool.nToFStr(rankItem.score);

                let btn_graph:fgui.GButton = group_player.getChild("btn_graph");
                btn_graph.clearClick();
                btn_graph.onClick(() => {
                    UtilsUI.onShowPlayerInfo(rankItem.guid);
                })
            } else {
                group_player.getChild("group_empty").visible = true;
                group_player.getChild("group_used").visible = false;
            }
        }

        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                console.log(args)
                fun(args)
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "getDomainGRank", {
            from: 0,
            to: 200,
        })

        let fun = (params)=>{
            let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
            // let clanSoloPlayer: any = fullInfo.clanSoloPlayer
            // let myselfClanInfo: any = clanSoloPlayer.myselfClanInfo
            let clanList = params.ranks
            let list_clan: fgui.GList = group_main.getChild("list_clan")
            list_clan.setVirtual();
            list_clan.itemRenderer = ((index: number, obj: fgui.GButton) => {
                let clanInfoItem = clanList[index]
                obj.getChild("btn_item").clearClick()
                obj.getChild("btn_item").onClick(() => {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleRank, 0, { members: args.members, calnItem: clanInfoItem });
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
                obj.getChild("label_score").text = clanScoreProto.name + ":" + UtilsTool.nToFStr(clanInfoItem.score); 
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
            list_clan.numItems = clanList ? clanList.length : 0
            let label_clanName: fgui.GLabel = group_main.getChild("label_clanName")
            label_clanName.text = data.name != "0" ? data.name : StrVal.LyBRUMEISLE.STR47
            let label_flag: fgui.GLoader = group_main.getChild("label_flag")
            let tt = LocaleData.getClanFlagById(data.flag)
            if (tt) {
                label_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [tt.icon])
                
            }else{
                label_flag.url = "";
            }
            let label_clanRank: fgui.GLabel = group_main.getChild("label_clanRank")
            label_clanRank.text =  params.rankOf > 0 ? UtilsTool.stringFormat(StrVal.LYCLAN.STR18, [params.rankOf]) : StrVal.LYCHALLENGE_DUEL.STR9;
            let label_myClanRankScore: fgui.GLabel = group_main.getChild("label_myClanRankScore")
            label_myClanRankScore.text = clanScoreProto.name + ":" + UtilsTool.nToFStr(data.gRankNum); 
        }
        
    }

    public onViewUpdate(params: any): void {
        
    }

    public getIsViewMask(): boolean {
        return false;
    }
}


