//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { LocaleData } from "../Kernel/LocaleData";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
interface RankPlayer {
    rank: number,
    model: string,
    power: string;
    isPlayer: number,
    jingjie: number,
    name: string,
    serverId: number,
    id: number,
    character: string,
    mountType: number,
    mountSkin: number,
    summonPet: string,
    appearance: number,
    avatar: string,
    title: number

}
export class LyCrossQunYinRank extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyCrossQunYin";
        this.viewResI.pkgName = "LyCrossQunYin";
        this.viewResI.comName = "LyCrossQunYinRank";
    }
    // private uiPanel: fgui.GComponent


    public onViewCreate(params): void {
        // this.uiPanel = this.getUiPanel()
        // 关闭
        // let btn_close = this.uiPanel.getChild("btn_close")
        // btn_close.onClick(() => {
        //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCrossQunYinRank, 0, null)
        // })
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GButton = uiPanel.getChild("group_main");

        let label_title: fgui.GButton = group_main.getChild("label_title");
        label_title.text = StrVal.LYACTIVITY_INVASION.STR7;

        let btn_close1 = uiPanel.getChild("btn_close1")
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCrossQunYinRank, 0, null)
        })
        let btn_close: fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCrossQunYinRank, 0, null)
        })

        let label_rank: fgui.GButton = group_main.getChild("label_rank");
        label_rank.text = StrVal.LYACTIVITY_INVASION.STR8;
        let label_name: fgui.GButton = group_main.getChild("label_name");
        label_name.text = StrVal.LYACTIVITY_INVASION.STR9;

        let label_selfrank: fgui.GButton = group_main.getChild("label_selfrank");
        label_selfrank.text = (params.rank > 0 ? String(params.rank) : StrVal.LYCHALLENGE_DUEL.STR9);
        // let label_selfdamage: fgui.GButton = group_main.getChild("label_selfdamage");
        // label_selfdamage.text = UtilsTool.nToFStr(params.duelScore);

        let charInfoself = LocaleData.getCharShowResInfoSelf();
        let group_headself:fgui.GComponent = group_main.getChild("group_head");
        let loader_iconself:fgui.GLoader = group_headself.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        loader_iconself.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfoself.icon]);

        let duelRanks: Array<RankPlayer> = params.ranks;
        let group_players: Array<fgui.GComponent> = [
            group_main.getChild("group_player0"),
            group_main.getChild("group_player1"),
            group_main.getChild("group_player2")
        ]
        // 列表
        let list_rank: fgui.GList = group_main.getChild("list_rank");
        list_rank.setVirtual();
        list_rank.itemRenderer = (index: number, child: fgui.GComponent) => {
            let rankItem = duelRanks[index + 3];
            if (rankItem.isPlayer == 0) {
                let suit: any = null
                rankItem.character = "1"
                // data.model = 16
                rankItem.model = this.onNpcRandom(rankItem.rank).model
                suit = LocaleData.getCharSuitItem(rankItem.model)
                rankItem.jingjie = suit.phase
            }
            let charInfo = LocaleData.getCharShowResInfo(rankItem.character, rankItem.jingjie, rankItem.model, rankItem.avatar);
            let label_rank: fgui.GTextField = child.getChild("label_rank");
            let loader_rank: fgui.GLoader = child.getChild("loader_rank");
            let num = rankItem.rank;
            label_rank.text = num <= 3 ? "" : String(num);
            loader_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_ranking_{0}", [num <= 3 ? num : 0]);
            let group_head: fgui.GComponent = child.getChild("group_head");
            let loader_icon: fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            // let btn_frame: fgui.GButton = group_head.getChild("btn_frame");
            // btn_frame.clearClick();
            // btn_frame.onClick(() => {
            //     UtilsUI.onShowPlayerInfo(rankItem.guid);
            // })
            let label_name: fgui.GTextField = child.getChild("label_name");
            if (rankItem.isPlayer == 0) {
                label_name.text = this.onNpcRandom(rankItem.rank).name;
            } else {
                label_name.text = rankItem.name;
            }
            let loader_phase: fgui.GComponent = child.getChild("loader_phase");
            UtilsUI.setTitleIconByTitleId(loader_phase, rankItem.jingjie, rankItem.title);
            child.clearClick()
            child.onClick(() => {
                if (rankItem.isPlayer == 0) {
                    UtilsUI.showMsgTip(StrVal.LYQUNYIN.STR37)
                }
                else {
                    UtilsUI.onShowPlayerInfo(String(rankItem.id));
                }
            })
        }
        if (duelRanks.length > 3) {
            list_rank.numItems = duelRanks.length - 3;
        } else {
            list_rank.numItems = 0;
        }

        group_main.getChild("img_empty_mask").visible = (list_rank.numItems == 0);
        // list_rank.setVirtualAndLoop();
        // 下面是三个冠军位置
        for (let i = 0; i < 3; i++) {
            let group_player = group_players[i];
            let rankItem = duelRanks[i];
            if (rankItem) {
                group_player.getChild("group_empty").visible = false;
                group_player.getChild("group_used").visible = true;

                if (rankItem.isPlayer == 0) {
                    let suit: any = null
                    rankItem.character = "1"
                    // data.model = 16
                    rankItem.model = this.onNpcRandom(rankItem.rank).model
                    suit = LocaleData.getCharSuitItem(rankItem.model)
                    rankItem.jingjie = suit.phase
                }
                let charInfo = LocaleData.getCharShowResInfo(rankItem.character, rankItem.jingjie, rankItem.model, rankItem.avatar);

                let mountInfo = LocaleData.getMountShowResInfo(rankItem.mountType, rankItem.mountSkin);
                new SpineRoldMountPlayer(group_player.getChild("group_spine_ram")).loadSpineRole(charInfo).loadSpineMount(mountInfo);
                if (rankItem.summonPet && String(rankItem.summonPet).length > 1) {
                    let petProto = LocaleData.getPetProto(rankItem.summonPet);
                    new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                        spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                    }, group_player.getChild("loader_spine_pet"), petProto.modelId);
                }
                let loader_phase: fgui.GComponent = group_player.getChild("loader_phase");
                UtilsUI.setTitleIconByTitleId(loader_phase, rankItem.jingjie, rankItem.title);

                let loader_rank: fgui.GLoader = group_player.getChild("loader_rank");
                loader_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_rank{0}", [rankItem.rank]);
                let label_name: fgui.GTextField = group_player.getChild("label_name");

                if (rankItem.isPlayer == 0) {
                    label_name.text = this.onNpcRandom(rankItem.rank).name;
                } else {
                    label_name.text = rankItem.name;
                }


                let btn_graph: fgui.GButton = group_player.getChild("btn_graph");
                btn_graph.clearClick();
                btn_graph.onClick(() => {
                    if (rankItem.isPlayer == 0) {
                        UtilsUI.showMsgTip(StrVal.LYQUNYIN.STR37)
                    }
                    else {
                        UtilsUI.onShowPlayerInfo(String(rankItem.id));
                    }
                })
            } else {
                group_player.getChild("group_empty").visible = true;
                group_player.getChild("group_used").visible = false;
            }
        }
    };
    private onNpcRandom(rank: number): any {
        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.QUNYIN);
        let randomXml = activityXml._random[0]._item

        for (let i = 0; i < randomXml.length; i++) {
            const element = randomXml[i];
            if (rank < Number(element.rank)) {
                return element
            }
        }
    }

    public getIsViewMask(): boolean {
        return false;
    };

}
