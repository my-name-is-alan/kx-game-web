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
import { UtilsTool } from "../Kernel/UtilsTool";
import { ActivityRankPlayer, BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyGuideDetail } from "./LyGuideDetail";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { AudioManager } from "../Kernel/AudioManager";

export class LyActivityRisingStar extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyActivityRisingStar";
        this.viewResI.pkgName = "LyActivityRisingStar";
        this.viewResI.comName = "LyActivityRisingStar";
    }
    private group_main: fgui.GButton

    public onViewCreate(params): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel()
        this.group_main = uiPanel.getChild("group_main");
        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityRisingStar, 0, null);
        })
        let btn_close: fgui.GButton = this.group_main.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityRisingStar, 0, null);
        })

        let btn_award: fgui.GButton = this.group_main.getChild("btn_award")
        let btn_rank: fgui.GButton = this.group_main.getChild("btn_rank")
        let label_title: fgui.GLabel = this.group_main.getChild("label_title")
        btn_award.onClick(() => {
            label_title.text = StrVal.LYACTIVITYRISINGSTAR.STR9
        })
        btn_rank.onClick(() => {
            label_title.text = StrVal.LYACTIVITYRISINGSTAR.STR8
        })
        label_title.text = StrVal.LYACTIVITYRISINGSTAR.STR8
        let btn_detail: fgui.GButton = this.group_main.getChild("btn_detail");
        btn_detail.clearClick()
        btn_detail.onClick(() => {
            let dec = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.RISINGSTAR)
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, { title: dec.name, detail: dec.detail });
        })
        this.group_main.getChild("label_str10", fgui.GLabel).text = StrVal.LYACTIVITYRISINGSTAR.STR10
        UtilsUI.lockWait();
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait();
            if (args.errorcode == 0) {
                this.onRank(args)
            } else {
                UtilsUI.showMsgTip(args.errorcode);
            }
        }, "risingStar", null);
        this.onAward()

        this.registerRequest((args) => {
            let state = args.activityGlobalState.state
            if (state == 2) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityRisingStar, 0, null);
            }
        }, "activityGlobalStateChanged");

    };

    private onRank(params): void {
        let label_rank: fgui.GButton = this.group_main.getChild("label_rank");
        label_rank.text = StrVal.LYACTIVITY_INVASION.STR8;
        let label_name: fgui.GButton = this.group_main.getChild("label_name");
        label_name.text = StrVal.LYACTIVITY_INVASION.STR9;
        let label_damage: fgui.GButton = this.group_main.getChild("label_damage");
        label_damage.text = StrVal.LYACTIVITY_MONSTERTOWER.STR203;

        let label_time: fgui.GLabel = this.group_main.getChild("label_time")
        let label_date: fgui.GLabel = this.group_main.getChild("label_date")
        let activity = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.RISINGSTAR)
        let date1 = UtilsTool.TimeToDateStr(activity.data.risingStar.startTime).split("-")
        let date2 = UtilsTool.TimeToDateStr(activity.data.risingStar.endTime).split("-")
        label_date.text = UtilsTool.stringFormat(StrVal.LYACTIVITYRISINGSTAR.STR6, [date1[1], date1[2], date2[1], date2[2]])
        this.setInterval(() => {
            let serverTime = GameServerData.getInstance().getServerTime();
            let lastTime = activity.data.risingStar.endTime
            let remain = lastTime - serverTime;
            label_time.text = UtilsTool.stringFormat(StrVal.LYACTIVITYRISINGSTAR.STR7, [UtilsTool.splitTimeString(remain)]);
        }, 1000)

        let label_selfrank: fgui.GButton = this.group_main.getChild("label_selfrank");

        let charInfoself = LocaleData.getCharShowResInfoSelf();
        let group_headself:fgui.GComponent = this.group_main.getChild("group_head");
        let loader_iconself:fgui.GLoader = group_headself.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        loader_iconself.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfoself.icon]);

        if (params.selfRank.rankOf) {
            let towerItem = LocaleData.getStageItem(params.selfRank.score > 0 ? params.selfRank.score : 1);
            label_selfrank.text = UtilsTool.stringFormat(StrVal.LYACTIVITYRISINGSTAR.STR3, [params.selfRank.rankOf > 0 ? params.selfRank.rankOf : StrVal.LYCHALLENGE_DUEL.STR9]);
            let label_selfdamage: fgui.GButton = this.group_main.getChild("label_selfdamage");
            label_selfdamage.text = UtilsTool.stringFormat(StrVal.LYACTIVITYRISINGSTAR.STR5, [towerItem.chapter_id, towerItem.stage_id]);
        } else {
            label_selfrank.text = StrVal.LYACTIVITYRISINGSTAR.STR4
        }
        if (params.ranks) {
            let duelRanks: Array<ActivityRankPlayer> = params.ranks;
            let group_players: Array<fgui.GComponent> = [
                this.group_main.getChild("group_player0"),
                this.group_main.getChild("group_player1"),
                this.group_main.getChild("group_player2")
            ]
            // 列表
            let list_rank: fgui.GList = this.group_main.getChild("list_rank");
            list_rank.setVirtual();
            list_rank.itemRenderer = (index: number, child: fgui.GComponent) => {
                let rankItem = duelRanks[index + 3];
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
                    UtilsUI.onShowPlayerInfo(rankItem.guid);
                })
                let label_name: fgui.GTextField = child.getChild("label_name");
                label_name.text = rankItem.name;

                let loader_phase: fgui.GComponent = child.getChild("loader_phase");
                UtilsUI.setTitleIconByTitleId(loader_phase, rankItem.phase, rankItem.title);

                let label_duelScore: fgui.GTextField = child.getChild("label_duelScore");
                let item = LocaleData.getStageItem(rankItem.score > 0 ? rankItem.score : 1);
                label_duelScore.text = UtilsTool.stringFormat(StrVal.LYACTIVITYRISINGSTAR.STR5, [item.chapter_id, item.stage_id]);
            }

            if (duelRanks.length > 3) {
                list_rank.numItems = duelRanks.length - 3;
            } else {
                list_rank.numItems = 0;
            }
            this.group_main.getChild("img_empty_mask").visible = (list_rank.numItems == 0);

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
                        new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                            spp.playAnimation("stand", true);
                        }, group_player.getChild("loader_spine_pet", fgui.GLoader3D), petProto.modelId);
                    }

                    let loader_phase: fgui.GComponent = group_player.getChild("loader_phase");
                    UtilsUI.setTitleIconByTitleId(loader_phase, rankItem.phase, rankItem.title);

                    let loader_rank: fgui.GLoader = group_player.getChild("loader_rank");
                    loader_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_rank{0}", [rankItem.rankOf]);

                    let label_name: fgui.GTextField = group_player.getChild("label_name");
                    label_name.text = rankItem.name;

                    let label_duelScore: fgui.GTextField = group_player.getChild("label_duelScore");
                    let item = LocaleData.getStageItem(rankItem.score > 0 ? rankItem.score : 1);
                    label_duelScore.text = UtilsTool.stringFormat(StrVal.LYACTIVITYRISINGSTAR.STR5, [item.chapter_id, item.stage_id]);

                    let btn_graph: fgui.GButton = group_player.getChild("btn_graph");
                    btn_graph.clearClick();
                    btn_graph.onClick(() => {
                        UtilsUI.onShowPlayerInfo(rankItem.guid);
                    })
                } else {
                    group_player.getChild("group_empty").visible = true;
                    group_player.getChild("group_used").visible = false;
                }
            }
        }


    }
    private onAward(): void {
        let activityDaysXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.RISINGSTAR)._bonuse[0]._item;
        activityDaysXml.sort((a, b) => {
            return a.id - b.id
        })

        let list_award: fgui.GList = this.group_main.getChild("list_award")
        // list_award.setVirtual();
        list_award.itemRenderer = (index: number, obj: fgui.GComponent) => {
            if (activityDaysXml[index].id == "1") {
                let group_top1: fgui.GGraph = obj.getChild("group_top1")
                group_top1.visible = true
            } else if (activityDaysXml[index].id == "2") {
                let group_top2: fgui.GGraph = obj.getChild("group_top2")
                group_top2.visible = true
            } else if (activityDaysXml[index].id == "3") {
                let group_top3: fgui.GGraph = obj.getChild("group_top3")
                group_top3.visible = true
            } else {
                let label_top: fgui.GLabel = obj.getChild("label_top")
                label_top.visible = true
                if (activityDaysXml[index].max) {
                    label_top.text = UtilsTool.stringFormat(StrVal.LYACTIVITYRISINGSTAR.STR1, [activityDaysXml[index].min, activityDaysXml[index].max])
                } else {
                    label_top.text = UtilsTool.stringFormat(StrVal.LYACTIVITYRISINGSTAR.STR2, [activityDaysXml[index].min])
                }
            }
            let list_rankItem: fgui.GList = obj.getChild("list_rankItem")
            let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(activityDaysXml[index].bonuseID);
            list_rankItem.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index1], obj1, null);
            }).bind(this)
            list_rankItem.numItems = bonuseItems.length
        }
        list_award.numItems = activityDaysXml.length;
    }

    public getIsViewMask(): boolean {
        return false;
    };

}