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

export class LyBrumeIsleAward extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyBrumeIsle";
        this.viewResI.pkgName = "LyBrumeIsle";
        this.viewResI.comName = "LyBrumeIsleAward";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        // this.uiPanel.getController("c1").selectedIndex = 0
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleAward, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleAward, 0, null);
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
        let isLeData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster

        let myRewardGetState = 0
        let btn_myGet: fgui.GButton = this.uiPanel.getChild("btn_myGet")
        btn_myGet.onClick(() => {
            if (myRewardGetState == 1) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        btn_myGet.text = StrVal.LyBRUMEISLE.STR43
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "getDomainPRank", {
                    isTake: 0
                })
            }
        })

        UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    myRewardGetState = args.bonusesState 
                    btn_myGet.visible = myRewardGetState != 0
                    if (myRewardGetState == 1) {
                        btn_myGet.text = StrVal.LyBRUMEISLE.STR42
                    }else if(myRewardGetState == 2){
                        btn_myGet.text = StrVal.LyBRUMEISLE.STR43
                    }
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
        }, "getDomainPRank", {
            from: 0,
            to: 1,
        })
        
        this.uiPanel.getChild("label_str43", fgui.GLabel).text = StrVal.LYCLANSOLO.STR43
        this.uiPanel.getChild("label_str44", fgui.GLabel).text = StrVal.LYCLANSOLO.STR43
        let rankingXml: any = LocaleData.getBrumeIsleRoot()._personReward[0]._item
        let list_my: fgui.GList = this.uiPanel.getChild("list_my")
        list_my.setVirtual();
        list_my.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let data = rankingXml[index]
            let img_bg: fgui.GLoader = obj.getChild("img_bg")
            let c1: fgui.Controller = obj.getController("c1")
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
            if (data.min != data.max) {
                img_bg.url = "ui://LyClanSolo/frame_reward_no4"
            } else {
                img_bg.url = UtilsTool.stringFormat("ui://LyClanSolo/frame_reward_no{0}", [data.min]);
            }
            if (data.titleReward != "0") {
                let palaceItem = LocaleData.getPalaceItem(data.titleReward);
                UtilsUI.setTitleIconByTitleId(img_title, null, palaceItem.titleId);
                c1.selectedIndex = 0
            }else{
                c1.selectedIndex = 1
            }
            if (data.min == 1) {
                label_top1.visible = true
                label_top1.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(data.min)])
            } else if (data.min == 2) {
                label_top2.visible = true
                label_top2.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(data.min)])
            } else if (data.min == 3) {
                label_top3.visible = true
                label_top3.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(data.min)])
            } else {
                label_tops.visible = true
                label_tops.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR13, [data.min, data.max])
            }
            let openDays = data.openDays.split(";")
            let bonuseItems: Array<BonuseItem>
            for (let index = 0; index < openDays.length; index++) {
                let daystring = openDays[index].split(",");
                if (isLeData.openDay >= Number(daystring[0]) && isLeData.openDay <= Number(daystring[1])) {
                    bonuseItems = UtilsUI.getBonuseItemsByBonusesId(data.bonuseID.split(";")[index]);
                    break
                }
            }
            list_award.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index1], obj1, null);
            }).bind(this)
            list_award.numItems = bonuseItems.length
        }).bind(this)
        UtilsUI.setFguiGlistDelayNumItems(list_my, rankingXml.length);

        // let group_myIcon: fgui.GComponent = this.uiPanel.getChild("group_myIcon")
        // let loader_icon: fgui.GLoader = group_myIcon.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        // let playerInfo = fullInfo.base
        // let charInfo = LocaleData.getCharShowResInfo(playerInfo.character, playerInfo.phase, playerInfo.appearance, playerInfo.avatar);
        // loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);

        this.uiPanel.getChild("label_str7", fgui.GLabel).text = StrVal.LYCLANSOLO.STR7
        this.uiPanel.getChild("label_str8", fgui.GLabel).text = StrVal.LYCLANSOLO.STR8
        let label_myScore: fgui.GLabel = this.uiPanel.getChild("label_myScore")
        label_myScore.text = isLeData.pRankNum
        let label_myRank: fgui.GLabel = this.uiPanel.getChild("label_myRank")
        label_myRank.text = isLeData.rankOf > 0 ? String(isLeData.rankOf) : StrVal.LYCHALLENGE_DUEL.STR9;
        

        let list_clan: fgui.GList = this.uiPanel.getChild("list_clan")
        let clanAwardXml: any = LocaleData.getBrumeIsleRoot()._groupReward[0]._item

        list_clan.setVirtual();
        list_clan.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let data = clanAwardXml[index]
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
            if (data.min != data.max) {
                img_bg.url = "ui://LyClanSolo/frame_reward_no4"
            } else {
                img_bg.url = UtilsTool.stringFormat("ui://LyClanSolo/frame_reward_no{0}", [data.min]);
            }
            if (data.min == 1) {
                label_top1.visible = true
                label_top1.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(data.min)])
            } else if (data.min == 2) {
                label_top2.visible = true
                label_top2.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(data.min)])
            } else if (data.min == 3) {
                label_top3.visible = true
                label_top3.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR12, [UtilsUI.onNumberToChinese(data.min)])
            } else {
                label_tops.visible = true
                label_tops.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR13, [data.min, data.max])
            }
            let openDays = data.openDays.split(";")
            let bonuseItems: Array<BonuseItem>
            for (let index = 0; index < openDays.length; index++) {
                let daystring = openDays[index].split(",");
                if (isLeData.openDay >= Number(daystring[0]) && isLeData.openDay <= Number(daystring[1])) {
                    bonuseItems = UtilsUI.getBonuseItemsByBonusesId(data.bonuseID.split(";")[index]);
                    break
                }
            }
            list_award.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index1], obj1, null);
            }).bind(this)
            list_award.numItems = bonuseItems.length
        }).bind(this)
        UtilsUI.setFguiGlistDelayNumItems(list_clan, clanAwardXml.length);

        let img_clanFlag: fgui.GLoader = this.uiPanel.getChild("img_clanFlag")
        let tt = LocaleData.getClanFlagById(isLeData.flag)
        if (tt) {
            img_clanFlag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [tt.icon])
        }else{
            img_clanFlag.url = ""
        }
        
        let label_str24: fgui.GLabel = this.uiPanel.getChild("label_str24")
        label_str24.text = StrVal.LYCLANSOLO.STR24
        let label_clanName: fgui.GLabel = this.uiPanel.getChild("label_clanName")
        label_clanName.text = isLeData.name == "0" ? "未加入帮派": isLeData.name
        
        let btn_clanGet: fgui.GButton = this.uiPanel.getChild("btn_clanGet")
        let clanRewardGetState = 0
        btn_clanGet.onClick(() => {
            if (clanRewardGetState == 1) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        btn_clanGet.text = StrVal.LyBRUMEISLE.STR43
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "getDomainGRank", {
                    isTake: 0
                })
            }
        })

        UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    clanRewardGetState = args.bonusesState 
                    btn_clanGet.visible = clanRewardGetState != 0
                    if (clanRewardGetState == 1) {
                        btn_clanGet.text = StrVal.LyBRUMEISLE.STR42
                    }else if(clanRewardGetState == 2){
                        btn_clanGet.text = StrVal.LyBRUMEISLE.STR43
                    }
                    let label_clanRank: fgui.GLabel = this.uiPanel.getChild("label_clanRank")
                    label_clanRank.text = args.rankOf > 0 ? UtilsTool.stringFormat(StrVal.LYCLAN.STR18, [args.rankOf]) : StrVal.LYCHALLENGE_DUEL.STR9;
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
        }, "getDomainGRank", {
            from: 0,
            to: 1,
        })
    };

    public getIsViewMask(): boolean {
        return false;
    };

}