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
import { GrabCityState } from "./LyGrabCity";

export class LyGrabCityAward extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyGrabCity";
        this.viewResI.pkgName = "LyGrabCity";
        this.viewResI.comName = "LyGrabCityAward";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityAward, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityAward, 0, null);
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

        let grabCityPlayer: any = GameServerData.getInstance().getGrabCityPlayer()
        let slefInfo = null
        if (grabCityPlayer.clanState) {
            slefInfo = grabCityPlayer.clanState.playerInfo[grabCityPlayer.selfRank -1]
        }
        
        // UtilsUI.lockWait()
        // GameServer.getInstance().send((args: any) => {
        //     UtilsUI.unlockWait()
        //     if (args.errorcode == 0) {
        //         for (let index = 0; index < args.rankList.length; index++) {
        //             const element = args.rankList[index];
        //             if (element.guid == slefInfo.guid) {
        //                 myRank = index + 1
        //                 break
        //             }
        //         }
        //         // UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
        //     } else {
        //         UtilsUI.showMsgTip(args.errorcode)
        //     }
        // }, "siegegroupPlayerRank", {
        //     type: 0
        // })

        let awardXml: any = LocaleData.getGrabCityRoot()._rank[0]._item   
        this.uiPanel.getChild("label_str43", fgui.GLabel).text = StrVal.LYCLANSOLO.STR43
        this.uiPanel.getChild("label_str44", fgui.GLabel).text = StrVal.LYCLANSOLO.STR43
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
                c1.selectedIndex = 0
                let palaceItem = LocaleData.getPalaceItem(data.palaceId.split(";")[grabCityPlayer.bonusesLevel - 1]);
                UtilsUI.setTitleIconByTitleId(img_title, null, palaceItem.titleId);
            } else if (index == 2) {
                label_top2.visible = true
                label_top2.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(index)])
                c1.selectedIndex = 0
                let palaceItem = LocaleData.getPalaceItem(data.palaceId.split(";")[grabCityPlayer.bonusesLevel - 1]);
                UtilsUI.setTitleIconByTitleId(img_title, null, palaceItem.titleId);
            } else if (index == 3) {
                label_top3.visible = true
                label_top3.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(index)])
                c1.selectedIndex = 0
                let palaceItem = LocaleData.getPalaceItem(data.palaceId.split(";")[grabCityPlayer.bonusesLevel - 1]);
                UtilsUI.setTitleIconByTitleId(img_title, null, palaceItem.titleId);
            } else {
                label_tops.visible = true
                if (data.minRank == data.maxRank) {
                    label_tops.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(data.minRank)])
                } else {
                    label_tops.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR13, [data.minRank, data.maxRank])
                }
            }
            let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(data.bonuseId.split(";")[grabCityPlayer.bonusesLevel - 1]);
            list_award.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index1], obj1, null);
            }).bind(this)
            list_award.numItems = bonuseItems.length
        }).bind(this)
        UtilsUI.setFguiGlistDelayNumItems(list_my, awardXml.length);


        let group_myIcon: fgui.GComponent = this.uiPanel.getChild("group_myIcon")
        let loader_icon: fgui.GLoader = group_myIcon.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        let playerInfo = GameServerData.getInstance().getPlayerFullInfo().base
        let charInfo = LocaleData.getCharShowResInfo(playerInfo.character, playerInfo.phase, playerInfo.appearance, playerInfo.avatar);
        loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);

        let label_myScore: fgui.GLabel = this.uiPanel.getChild("label_myScore")
        label_myScore.text = slefInfo ? UtilsTool.nToFStr(slefInfo.harm) : "0"
        let label_myRank: fgui.GLabel = this.uiPanel.getChild("label_myRank");
        let btn_myGet: fgui.GButton = this.uiPanel.getChild("btn_myGet")
        if (slefInfo) {
            label_myRank.text = slefInfo.rankOf == undefined || slefInfo.rankOf < 1 ? StrVal.LYCLANSOLO.STR32 : String(slefInfo.rankOf) 
            btn_myGet.enabled = slefInfo && slefInfo.rankAward == 0 && grabCityPlayer.state == GrabCityState.over
        }else{
            label_myRank.text = StrVal.LYCLANSOLO.STR32
            btn_myGet.enabled = false
        }
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
            }, "siegeRankAward", {
              
            })
        })

        let list_clan: fgui.GList = this.uiPanel.getChild("list_clan")
        let clan_awardXml: any = LocaleData.getGrabCityRoot()._clanRank[0]._item   
        // list_clan.setVirtual();
        list_clan.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let data = clan_awardXml[index]
            index = index + 1
            let img_bg: fgui.GLoader = obj.getChild("img_bg")
            let c1: fgui.Controller = obj.getController("c1")
            c1.selectedIndex = 1
           
            let group1 : fgui.GComponent = obj.getChild("loader_line1")
            let group2 : fgui.GComponent = obj.getChild("loader_line2")
            let group3 : fgui.GComponent = obj.getChild("loader_line3")

            let list_award1: fgui.GList = group1.getChild("list_award")
            let list_award2: fgui.GList = group2.getChild("list_award")
            let list_award3: fgui.GList = group3.getChild("list_award")

            let img_title1: fgui.GList = group1.getChild("img_title")
            let img_title2: fgui.GList = group2.getChild("img_title")
            let img_title3: fgui.GList = group3.getChild("img_title")

            let label_tip1: fgui.GTextField = group1.getChild("img_title")
            let label_tip2: fgui.GTextField = group2.getChild("img_title")
            let label_tip3: fgui.GTextField = group3.getChild("img_title")

            let label_top1: fgui.GLabel = obj.getChild("label_top1")
            let label_top2: fgui.GLabel = obj.getChild("label_top2")
            let label_top3: fgui.GLabel = obj.getChild("label_top3")
            let label_tops: fgui.GLabel = obj.getChild("label_tops")
            
            label_top1.visible = false
            label_top2.visible = false
            label_top3.visible = false
            label_tops.visible = false

            if (data.leaderPalaceId != "0") {
                group1.getController("c1").selectedIndex = 0
                let palaceItem = LocaleData.getPalaceItem(data.leaderPalaceId.split(";")[grabCityPlayer.bonusesLevel - 1]);
                UtilsUI.setTitleIconByTitleId(img_title1, null, palaceItem.titleId);
            }else{
                group1.getController("c1").selectedIndex = 1
            }

            if (data.viceLeaderPalaceId != "0") {
                group2.getController("c1").selectedIndex = 0
                let palaceItem = LocaleData.getPalaceItem(data.viceLeaderPalaceId.split(";")[grabCityPlayer.bonusesLevel - 1]);
                UtilsUI.setTitleIconByTitleId(img_title2, null, palaceItem.titleId);
            }else{
                group2.getController("c1").selectedIndex = 1
            }

            if (data.PalaceId != "0") {
                group3.getController("c1").selectedIndex = 0
                let palaceItem = LocaleData.getPalaceItem(data.PalaceId.split(";")[grabCityPlayer.bonusesLevel - 1]);
                UtilsUI.setTitleIconByTitleId(img_title3, null, palaceItem.titleId);
            }else{
                group3.getController("c1").selectedIndex = 1
            }

            let lineName = ""
            label_tip1.color = UtilsUI.getRankBonuseColor(index);
            label_tip2.color = label_tip1.color;
            label_tip3.color = label_tip1.color;
            group1.getChild("label_job").text = StrVal.LYGRABCITY.STR35
            group2.getChild("label_job").text = StrVal.LYGRABCITY.STR36
            group3.getChild("label_job").text = StrVal.LYGRABCITY.STR37
            if (index > 3) {
                img_bg.url = "ui://LyClanSolo/frame_reward_no4"
                lineName = "ui://LyConquestSeek/frame_fengexian4"
            } else {
                img_bg.url = UtilsTool.stringFormat("ui://LyClanSolo/frame_reward_no{0}", [index]);
            }
            if (index == 1) {
                lineName = "ui://LyConquestSeek/frame_fengexian1" 
                label_top1.visible = true
                label_top1.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(index)])
            } else if (index == 2) {
                lineName = "ui://LyConquestSeek/frame_fengexian2" 
                label_top2.visible = true
                label_top2.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(index)])
            } else if (index == 3) {
                lineName = "ui://LyConquestSeek/frame_fengexian3" 
                label_top3.visible = true
                label_top3.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(index)])
            } else {
                label_tops.visible = true
                if (data.minRank == data.maxRank) {
                    label_tops.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(data.minRank)])
                } else {
                    label_tops.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR13, [data.minRank, data.maxRank])
                }
            }

            group1.getChild("loader_line", fgui.GLoader).url = lineName
            group2.getChild("loader_line", fgui.GLoader).url = lineName
            group3.getChild("loader_line", fgui.GLoader).url = lineName


            let bonuseItems1: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(data.leaderBonuseId.split(";")[grabCityPlayer.bonusesLevel - 1]);
            list_award1.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems1[index1], obj1, null);
            }).bind(this)
            list_award1.numItems = bonuseItems1.length
            UtilsUI.setFguiGlistDelayNumItems(list_award1, bonuseItems1.length);

            let bonuseItems2: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(data.viceLeaderBonuseId.split(";")[grabCityPlayer.bonusesLevel - 1]);
            list_award2.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems2[index1], obj1, null);
            }).bind(this)
            list_award2.numItems = bonuseItems2.length
            UtilsUI.setFguiGlistDelayNumItems(list_award2, bonuseItems2.length);

            let bonuseItems3: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(data.BonuseId.split(";")[grabCityPlayer.bonusesLevel - 1]);
            list_award3.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems3[index1], obj1, null);
            }).bind(this)
            list_award3.numItems = bonuseItems3.length
            UtilsUI.setFguiGlistDelayNumItems(list_award3, bonuseItems3.length);

        }).bind(this)
        // list_clan.numItems = awardXml.length
        UtilsUI.setFguiGlistDelayNumItems(list_clan, clan_awardXml.length);
        let img_clanFlag: fgui.GLoader = this.uiPanel.getChild("img_clanFlag")
        let label_str24: fgui.GLabel = this.uiPanel.getChild("label_str24")
        label_str24.text = StrVal.LYGRABCITY.STR38
        let label_clanName: fgui.GLabel = this.uiPanel.getChild("label_clanName")
        let label_clanRank: fgui.GLabel = this.uiPanel.getChild("label_clanRank")
        let myselfClanInfo = grabCityPlayer.clanState
        let btn_clanGet: fgui.GButton = this.uiPanel.getChild("btn_clanGet")

        if (myselfClanInfo) {
            label_clanName.text = myselfClanInfo.name
            label_clanRank.text = myselfClanInfo.rankOf < 0 ? StrVal.LYCLANSOLO.STR32 : myselfClanInfo.rankOf
            btn_clanGet.enabled = myselfClanInfo.rankAward == 0 && grabCityPlayer.state == GrabCityState.over 
        } else {
            let clanPlayer = GameServerData.getInstance().getPlayerFullInfo().clan
            if (clanPlayer.clanInfo && clanPlayer.clanInfo.name) {
                label_clanName.text = clanPlayer.clanInfo.name
                label_clanRank.text = StrVal.LYCLANSOLO.STR32
            } else {
                label_clanName.text = StrVal.LYCLANSOLO.STR94
                label_clanRank.text = StrVal.LYCLANSOLO.STR32
            }
            btn_clanGet.enabled = false
        }
        btn_clanGet.clearClick()
        btn_clanGet.onClick(() => {
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
                type:  0
            })
        })
    };

    public getIsViewMask(): boolean {
        return false;
    };

}