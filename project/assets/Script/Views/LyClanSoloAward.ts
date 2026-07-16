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
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanSoloAward extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClanSolo";
        this.viewResI.pkgName = "LyClanSolo";
        this.viewResI.comName = "LyClanSoloAward";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloAward, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloAward, 0, null);
        })
        let label_title: fgui.GLabel = this.uiPanel.getChild("label_title")
        label_title.text = StrVal.LYCLANSOLO.STR1
        let btn_bp: fgui.GButton = this.uiPanel.getChild("btn_bp")
        btn_bp.text = StrVal.LYCLANSOLO.STR9
        btn_bp.onClick(() => {
            label_title.text = StrVal.LYCLANSOLO.STR1
        })
        let btn_gr: fgui.GButton = this.uiPanel.getChild("btn_gr")
        btn_gr.text = StrVal.LYCLANSOLO.STR10
        btn_gr.onClick(() => {
            label_title.text = StrVal.LYCLANSOLO.STR11
        })
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanSoloPlayer: any = fullInfo.clanSoloPlayer


        let myselfClanInfo: any = clanSoloPlayer.myselfClanInfo
        let clanSoloInfo: any = clanSoloPlayer.clanSoloInfo
        let clanSoloMyselfInfo: any = clanSoloPlayer.clanSoloMyselfInfo
        let createDay = Math.floor((GameServerData.getInstance().getServerTime() - clanSoloInfo.startTime) / (24 * 60 * 60 * 1000))
        // console.log(GameServerData.getInstance().getServerCreateDay() *);
        let awardXml: any = LocaleData.getClanSoloRank(createDay)
        this.uiPanel.getChild("label_str43", fgui.GLabel).text = StrVal.LYCLANSOLO.STR43
        this.uiPanel.getChild("label_str44", fgui.GLabel).text = StrVal.LYCLANSOLO.STR43
        let rankingXml: any = LocaleData.getClanSoloRanking()
        let palaceIds: any = awardXml[0]
        let list_my: fgui.GList = this.uiPanel.getChild("list_my")
        list_my.setVirtual();
        list_my.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let data = awardXml[index]
            index = index + 1
            let img_bg: fgui.GLoader = obj.getChild("img_bg")
            let c1: fgui.Controller = obj.getController("c1")
            c1.selectedIndex = 1
            let img_title: fgui.GComponent = obj.getChild("img_title")
            let list_award: fgui.GList = obj.getChild("list_award")
            let label_top1: fgui.GLabel = obj.getChild("label_top1")
            let label_top2: fgui.GLabel = obj.getChild("label_top2")
            let label_top3: fgui.GLabel = obj.getChild("label_top3")
            let label_tops: fgui.GLabel = obj.getChild("label_tops")
            label_top1.visible = false
            label_top2.visible = false
            label_top3.visible = false
            label_tops.visible = false
            if (index > 3) {
                img_bg.url = "ui://LyClanSolo/frame_reward_no4"
            } else {
                img_bg.url = UtilsTool.stringFormat("ui://LyClanSolo/frame_reward_no{0}", [index]);
            }

            if (index == 1) {
                label_top1.visible = true
                label_top1.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(index)])
                if (palaceIds.palaceId1 != "0") {
                    let palaceItem = LocaleData.getPalaceItem(palaceIds.palaceId1);
                    UtilsUI.setTitleIconByTitleId(img_title, null, palaceItem.titleId);
                    c1.selectedIndex = 0
                }
            } else if (index == 2) {
                label_top2.visible = true
                label_top2.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(index)])
                if (palaceIds.palaceId2 != "0") {
                    let palaceItem = LocaleData.getPalaceItem(palaceIds.palaceId2);
                    UtilsUI.setTitleIconByTitleId(img_title, null, palaceItem.titleId);
                    c1.selectedIndex = 0
                }
            } else if (index == 3) {
                label_top3.visible = true
                label_top3.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(index)])
                if (palaceIds.palaceId3 != "0") {
                    let palaceItem = LocaleData.getPalaceItem(palaceIds.palaceId3);
                    UtilsUI.setTitleIconByTitleId(img_title, null, palaceItem.titleId);
                    c1.selectedIndex = 0
                }

            } else {
                label_tops.visible = true
                let rankingStrs = rankingXml[index - 1].playerRanking.split(",")
                if (rankingStrs.length == 1) {
                    label_tops.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(rankingStrs[0])])
                } else {
                    label_tops.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR13, [rankingStrs[0], rankingStrs[1]])
                }
            }
            let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(data.playerBonusesId);
            list_award.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index1], obj1, null);
            }).bind(this)
            list_award.numItems = bonuseItems.length
            // if (data.palaceId == "") {
            //     img_title.visible = false
            // } else {
            //     img_title.visible = true
            //     // let palaceItem = LocaleData.getPalaceItem(data.palaceId);
            //     // UtilsUI.setTitleIconByTitleId(img_title, null, palaceItem.titleId);
            // }
        }).bind(this)
        // list_my.numItems = awardXml.length
        UtilsUI.setFguiGlistDelayNumItems(list_my, awardXml.length);

        // let group_myIcon: fgui.GComponent = this.uiPanel.getChild("group_myIcon")
        // let loader_icon: fgui.GLoader = group_myIcon.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        // let playerInfo = fullInfo.base
        // let charInfo = LocaleData.getCharShowResInfo(playerInfo.character, playerInfo.phase, playerInfo.appearance, playerInfo.avatar);
        // loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);

        this.uiPanel.getChild("label_str7", fgui.GLabel).text = StrVal.LYCLANSOLO.STR7
        this.uiPanel.getChild("label_str8", fgui.GLabel).text = StrVal.LYCLANSOLO.STR8
        let label_myScore: fgui.GLabel = this.uiPanel.getChild("label_myScore")
        label_myScore.text = clanSoloMyselfInfo.score
        let label_myRank: fgui.GLabel = this.uiPanel.getChild("label_myRank")
        label_myRank.text = clanSoloMyselfInfo.rankOf < 0 ? StrVal.LYCLANSOLO.STR32 : clanSoloMyselfInfo.rankOf
        let btn_myGet: fgui.GButton = this.uiPanel.getChild("btn_myGet")
        btn_myGet.enabled = clanSoloMyselfInfo.claimRankReward1 == 1
        btn_myGet.clearClick()
        btn_myGet.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    btn_myGet.enabled = false
                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "clanSoloClaimRankReward", {
                type: 0
            })
        })

        let list_clan: fgui.GList = this.uiPanel.getChild("list_clan")
        list_clan.setVirtual();
        list_clan.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let data = awardXml[index]
            index = index + 1
            let img_bg: fgui.GLoader = obj.getChild("img_bg")
            let c1: fgui.Controller = obj.getController("c1")
            c1.selectedIndex = 1
            let list_award: fgui.GList = obj.getChild("list_award")
            let label_top1: fgui.GLabel = obj.getChild("label_top1")
            let label_top2: fgui.GLabel = obj.getChild("label_top2")
            let label_top3: fgui.GLabel = obj.getChild("label_top3")
            let label_tops: fgui.GLabel = obj.getChild("label_tops")
            label_top1.visible = false
            label_top2.visible = false
            label_top3.visible = false
            label_tops.visible = false
            if (index > 3) {
                img_bg.url = "ui://LyClanSolo/frame_reward_no4"
            } else {
                img_bg.url = UtilsTool.stringFormat("ui://LyClanSolo/frame_reward_no{0}", [index]);
            }
            if (index == 1) {
                label_top1.visible = true
                label_top1.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(index)])
            } else if (index == 2) {
                label_top2.visible = true
                label_top2.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(index)])
            } else if (index == 3) {
                label_top3.visible = true
                label_top3.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(index)])
            } else {
                label_tops.visible = true
                let rankingStrs = rankingXml[index - 1].clanRanking.split(",")
                if (rankingStrs.length == 1) {
                    label_tops.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(rankingStrs[0])])
                } else {
                    label_tops.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR13, [rankingStrs[0], rankingStrs[1]])
                }
            }
            let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(data.clanBonusesId);
            list_award.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index1], obj1, null);
            }).bind(this)
            list_award.numItems = bonuseItems.length
        }).bind(this)
        // list_clan.numItems = awardXml.length
        UtilsUI.setFguiGlistDelayNumItems(list_clan, awardXml.length - 3);
        let img_clanFlag: fgui.GLoader = this.uiPanel.getChild("img_clanFlag")
        let label_str24: fgui.GLabel = this.uiPanel.getChild("label_str24")
        label_str24.text = StrVal.LYCLANSOLO.STR24
        let label_clanName: fgui.GLabel = this.uiPanel.getChild("label_clanName")
        let label_clanRank: fgui.GLabel = this.uiPanel.getChild("label_clanRank")
        if (myselfClanInfo) {
            label_clanName.text = myselfClanInfo.name
            label_clanRank.text = myselfClanInfo.rankOf < 0 ? StrVal.LYCLANSOLO.STR32 : clanSoloMyselfInfo.rankOf
        } else {
            let clanPlayer = fullInfo.clan
            if (clanPlayer.clanInfo && clanPlayer.clanInfo.name) {
                label_clanName.text = clanPlayer.clanInfo.name
                label_clanRank.text = StrVal.LYCLANSOLO.STR32
            } else {
                label_clanName.text = StrVal.LYCLANSOLO.STR94
                label_clanRank.text = StrVal.LYCLANSOLO.STR32
            }
        }

        // let btn_clanGet: fgui.GButton = this.uiPanel.getChild("btn_clanGet")
        // btn_clanGet.enabled = myselfClanInfo.claimRankReward2 == 1

        // btn_clanGet.clearClick()
        // btn_clanGet.onClick(() => {
        //     UtilsUI.lockWait()
        //     GameServer.getInstance().send((args: any) => {
        //         UtilsUI.unlockWait()
        //         if (args.errorcode == 0) {
        //             btn_myGet.enabled = false
        //             UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
        //         } else {
        //             UtilsUI.showMsgTip(args.errorcode)
        //         }
        //     }, "clanSoloClaimRankReward", {
        //         type: 0
        //     })
        // })
    };

    public getIsViewMask(): boolean {
        return false;
    };

}