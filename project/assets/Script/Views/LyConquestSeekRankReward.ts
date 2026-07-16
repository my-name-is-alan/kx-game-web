//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { VarVal } from "../Values/VarVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { StrVal } from "../Values/StrVal";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServer } from "../Kernel/GameServer";
import { PointRedData } from "../Kernel/PointRedData";
import { ConquestState, LyConquestSeek } from "./LyConquestSeek";

export class LyConquestSeekRankReward extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyConquestSeek;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyConquestSeek;
        this.viewResI.comName = "LyConquestSeekRankReward";
    }

    players:Array<any>;
    factions:Array<any>;
    selIndex:number;

    public onViewCreate(params): void {
        let uiPanel = this.getUiPanel();
        let group_main = uiPanel.getChild("group_main", fgui.GComponent);
        UtilsUI.playCommonGroupAni(group_main);

        this.players = LocaleData.getConquestRankRewardItems(false);
        this.factions = LocaleData.getConquestRankRewardItems(true);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyConquestSeekRankReward, 0, null);
        })

        let btn_close: fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_title: fgui.GTextField = group_main.getChild("label_title");
        label_title.text = StrVal.LYCLANSOLO.STR1;

        let label_desc: fgui.GLabel = group_main.getChild("label_desc")
        label_desc.text = StrVal.LYCONQUESTSEEK.STR302;

        let btn_bp: fgui.GButton = group_main.getChild("btn_bp");
        btn_bp.text = StrVal.LYCLANSOLO.STR9;
        btn_bp.onClick(() => {
            label_title.text = StrVal.LYCLANSOLO.STR1;
            this.selIndex = 1;
            this.refreshState();
        })

        let btn_gr: fgui.GButton = group_main.getChild("btn_gr");
        btn_gr.text = StrVal.LYCLANSOLO.STR10;
        btn_gr.onClick(() => {
            label_title.text = StrVal.LYCLANSOLO.STR11;
            this.selIndex = 2;
            this.refreshState();
        })
        this.selIndex = 1;

        let list_my: fgui.GList = group_main.getChild("list_my");
        list_my.setVirtual();
        list_my.itemRenderer = (index: number, obj: fgui.GComponent) => {
            let data = this.players[index]
            let rank = index + 1;

            let list_award: fgui.GList = obj.getChild("list_award");
            list_award.height = list_award.initHeight;

            let img_bg: fgui.GLoader = obj.getChild("img_bg");
            if (rank > 3) {
                img_bg.url = "ui://LyConquestSeek/frame_complayer4";
            } else {
                img_bg.url = UtilsTool.stringFormat("ui://LyConquestSeek/frame_complayer{0}", [rank]);
            }

            let label_top1: fgui.GTextField = obj.getChild("label_top1")
            let label_top2: fgui.GTextField = obj.getChild("label_top2")
            let label_top3: fgui.GTextField = obj.getChild("label_top3")
            let label_tops: fgui.GTextField = obj.getChild("label_tops")
            label_top1.visible = false
            label_top2.visible = false
            label_top3.visible = false
            label_tops.visible = false

            let palaceIds = (<string>data.palace).split(";");

            let img_title: fgui.GComponent = obj.getChild("img_title")
            img_title.visible = false
            if (rank == 1) {
                label_top1.visible = true
                label_top1.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(rank)])
                if (palaceIds[0] != "0") {
                    let palaceItem = LocaleData.getPalaceItem(palaceIds[0]);
                    UtilsUI.setTitleIconByTitleId(img_title, null, palaceItem.titleId);
                    img_title.visible = true
                } else {
                    list_award.height = list_award.initHeight * 2;
                }
            } else if (rank == 2) {
                label_top2.visible = true
                label_top2.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(rank)])
                if (palaceIds[1] != "0") {
                    let palaceItem = LocaleData.getPalaceItem(palaceIds[1]);
                    UtilsUI.setTitleIconByTitleId(img_title, null, palaceItem.titleId);
                    img_title.visible = true
                } else {
                    list_award.height = list_award.initHeight * 2;
                }
            } else if (rank == 3) {
                label_top3.visible = true
                label_top3.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(rank)])
                if (palaceIds[2] != "0") {
                    let palaceItem = LocaleData.getPalaceItem(palaceIds[2]);
                    UtilsUI.setTitleIconByTitleId(img_title, null, palaceItem.titleId);
                    img_title.visible = true
                } else {
                    list_award.height = list_award.initHeight * 2;
                }
            } else {
                label_tops.visible = true
                label_tops.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR13, [data.min, data.max]);
                list_award.height = list_award.initHeight * 2;
            }

            let openServerDay = GameServerData.getInstance().getServerCreateDay();
            let bonuseId:string;
            let bonusArr = (<string>data.bonusesID).split(";");
            let openArr = (<string>data.openDays).split(";");
            for (let i = 0; i < openArr.length; i++) {
                if (openServerDay < Number(openArr[i])) {
                    bonuseId = bonusArr[i];
                    break;
                }
            }
            let bonuseItems = UtilsUI.getBonuseItemsByBonusesId(bonuseId);
            list_award.itemRenderer = (index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index1], obj1, null);
            }
            UtilsUI.setFguiGlistDelayNumItems(list_award, bonuseItems.length);
        }
        UtilsUI.setFguiGlistDelayNumItems(list_my, this.players.length);

        let list_clan: fgui.GList = group_main.getChild("list_clan");
        list_clan.setVirtual();
        list_clan.itemRenderer = (index: number, obj: fgui.GComponent) => {
            let data = this.factions[index]
            let rank = index + 1;

            let img_bg: fgui.GLoader = obj.getChild("img_bg");
            img_bg.url = UtilsTool.stringFormat("ui://LyConquestSeek/frame_complayer_b{0}", [rank <= 3 ? rank : 4]);

            let loader_line1: fgui.GLoader = obj.getChild("loader_line1")
            let loader_line2: fgui.GLoader = obj.getChild("loader_line2")
            let loader_line3: fgui.GLoader = obj.getChild("loader_line3")
            loader_line1.url = UtilsTool.stringFormat("ui://LyConquestSeek/frame_fengexian{0}", [rank <= 3 ? rank : 4]);
            loader_line2.url = loader_line1.url;
            loader_line3.url = loader_line1.url;

            let label_tip1: fgui.GTextField = obj.getChild("label_tip1")
            let label_tip2: fgui.GTextField = obj.getChild("label_tip2")
            let label_tip3: fgui.GTextField = obj.getChild("label_tip3")
            label_tip1.text = StrVal.LYCONQUESTSEEK.STR201;
            label_tip2.text = StrVal.LYCONQUESTSEEK.STR202;
            label_tip3.text = StrVal.LYCONQUESTSEEK.STR203;
            label_tip1.color = UtilsUI.getRankBonuseColor(rank);
            label_tip2.color = label_tip1.color;
            label_tip3.color = label_tip1.color;

            let label_top1: fgui.GTextField = obj.getChild("label_top1")
            let label_top2: fgui.GTextField = obj.getChild("label_top2")
            let label_top3: fgui.GTextField = obj.getChild("label_top3")
            let label_tops: fgui.GTextField = obj.getChild("label_tops")
            label_top1.visible = false
            label_top2.visible = false
            label_top3.visible = false
            label_tops.visible = false

            if (rank == 1) {
                label_top1.visible = true
                label_top1.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(rank)])
            } else if (rank == 2) {
                label_top2.visible = true
                label_top2.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(rank)])
            } else if (rank == 3) {
                label_top3.visible = true
                label_top3.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(rank)])
            } else {
                label_tops.visible = true
                label_tops.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR13, [data.min, data.max]);
            }

            let openDay = GameServerData.getInstance().getServerCreateDay();
            let bonuseId:string;
            let flagId:string;
            let bonusArr = (<string>data.bonusesID).split(";");
            let flagArr = (<string>data.flag).split(";");
            let openArr = (<string>data.openDays).split(";");
            for (let i = 0; i < openArr.length; i++) {
                if (openDay < Number(openArr[i])) {
                    bonuseId = bonusArr[i];
                    flagId = flagArr[i];
                    break;
                }
            }
            let bonuArr = bonuseId.split(",")

            let bonuseItems1 = UtilsUI.getBonuseItemsByBonusesId(bonuArr[0]);
            let list_award1: fgui.GList = obj.getChild("list_award1");
            list_award1.itemRenderer = (index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems1[index1], obj1, null);
            }
            UtilsUI.setFguiGlistDelayNumItems(list_award1, bonuseItems1.length);

            let label_flag: fgui.GLoader = obj.getChild("label_flag")
            if (flagId != "0") {
                label_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(flagId).icon])
            } else {
                label_flag.url = undefined;
            }

            let bonuseItems2 = UtilsUI.getBonuseItemsByBonusesId(bonuArr[1]);
            let list_award2: fgui.GList = obj.getChild("list_award2");
            list_award2.itemRenderer = (index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems2[index1], obj1, null);
            }
            UtilsUI.setFguiGlistDelayNumItems(list_award2, bonuseItems2.length);

            let bonuseItems3 = UtilsUI.getBonuseItemsByBonusesId(bonuArr[2]);
            let list_award3: fgui.GList = obj.getChild("list_award3");
            list_award3.itemRenderer = (index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems3[index1], obj1, null);
            }
            UtilsUI.setFguiGlistDelayNumItems(list_award3, bonuseItems3.length);
        }
        UtilsUI.setFguiGlistDelayNumItems(list_clan, this.factions.length);

        this.refreshState();
    }

    private refreshState(): void {
        let uiPanel = this.getUiPanel();
        let group_main = uiPanel.getChild("group_main", fgui.GComponent);

        let img_paster: fgui.GImage = group_main.getChild("img_paster");
        let label_take: fgui.GTextField = group_main.getChild("label_take");
        label_take.text = StrVal.LYCONQUESTSEEK.STR205;

        let label_rank: fgui.GTextField = group_main.getChild("label_rank");
        let label_score: fgui.GTextField = group_main.getChild("label_score");

        let btn_take = group_main.getChild("btn_take", fgui.GComponent);
        PointRedData.getInstance().updateManualPoint(btn_take, false);
        btn_take.text = StrVal.LYCONQUESTSEEK.STR204;
        btn_take.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "conquestClaimRankReward", {type:this.selIndex})
        })
        btn_take.enabled = true;
        btn_take.visible = true;
        img_paster.visible = false;
        label_take.visible = false;

        label_rank.text = "";
        label_score.text = "";
        if (this.selIndex == 1) {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    label_rank.text = String(Math.max(args.myClanRankOf, 0));
                    label_score.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR206, [args.myClanRankScore]);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "getConquestClanScoreRank", {from:1, to:200})

            let conquestInfo = GameServerData.getInstance().getConquestInfo();
            if (conquestInfo.myInfo.claimClanScoreReward) {
                btn_take.visible = false;
                img_paster.visible = true;
                label_take.visible = true;
            } else if (!conquestInfo.myInfo.claimClanScoreReward && conquestInfo.myInfo.clanScoreRankOf > 0) {
                if (conquestInfo.activityInfo.phase == ConquestState.OVER) {
                    PointRedData.getInstance().updateManualPoint(btn_take, true);
                } else {
                    btn_take.enabled = false;
                }
            } else {
                btn_take.enabled = false;
            }
        } else {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    label_rank.text = String(Math.max(args.myRankOf, 0));
                    label_score.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR207, [args.myRankScore]);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "getConquestPlayerKillRank", {from:1, to:200})

            let conquestInfo = GameServerData.getInstance().getConquestInfo();
            if (conquestInfo.myInfo.claimPlayerKillReward) {
                btn_take.visible = false;
                img_paster.visible = true;
                label_take.visible = true;
            } else if (!conquestInfo.myInfo.claimPlayerKillReward && conquestInfo.myInfo.playerKillRankOf > 0) {
                if (conquestInfo.activityInfo.phase == ConquestState.OVER) {
                    PointRedData.getInstance().updateManualPoint(btn_take, true);
                } else {
                    btn_take.enabled = false;
                }
            } else {
                btn_take.enabled = false;
            }
        }
    }

    public getIsViewMask(): boolean {
        return false;
    }

    public static isViewRedPoint(): boolean{
        if (LyConquestSeek.isConquestOpen()) {
            let conquestInfo = GameServerData.getInstance().getConquestInfo();
        if (conquestInfo.activityInfo.phase == ConquestState.OVER) {
            if (!conquestInfo.myInfo.claimClanScoreReward && conquestInfo.myInfo.clanScoreRankOf > 0) {
                return true;
            } else if (!conquestInfo.myInfo.claimPlayerKillReward && conquestInfo.myInfo.playerKillRankOf > 0) {
                return true;
            }
        }
        }
        return false;
    }
}