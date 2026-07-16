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

export class LyClanPopup extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanPopup";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params): void {
        let tispType: number = params.tispType
        this.uiPanel = this.getUiPanel().getChild("group_clanPopup")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanPopup, 0, null);
        })

        let group_popup1: fgui.GGroup = this.uiPanel.getChild("group_popup1")
        let group_popup2: fgui.GGroup = this.uiPanel.getChild("group_popup2")
        let group_popup3: fgui.GGroup = this.uiPanel.getChild("group_popup3")
        group_popup1.visible = tispType == 1
        group_popup2.visible = tispType == 2
        group_popup3.visible = tispType == 3
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanInfo = playerClanInfo.clanInfo
        let clanMember = playerClanInfo.clanMember
        let myselfInfo = playerClanInfo.myselfInfo
        if (tispType == 1) {
            //********************布阵详情*****************/
            let list_dailyDuelBuff: fgui.GList = this.uiPanel.getChild("list_dailyDuelBuff")
            list_dailyDuelBuff.setVirtual();
            list_dailyDuelBuff.itemRenderer = ((index: number, obj: fgui.GButton) => {
                let clanMemberItem = clanMember[index]
                obj.getChild("label_name").text = clanMemberItem.playerInfo.name
                obj.getChild("label_isDailyDuelBuff").text = clanMemberItem.dailyDuelBuffTime == "0" ? StrVal.LYCLAN.STR63 : StrVal.LYCLAN.STR62
                obj.getChild("label_dailyDuelBuffTime").visible = clanMemberItem.dailyDuelBuff != "0"
                if (clanMemberItem.dailyDuelBuffTime) {
                    obj.getChild("label_dailyDuelBuffTime").text = UtilsTool.TimeToStr(clanMemberItem.dailyDuelBuffTime, "-").split(" ")[1]
                }
            }).bind(this)
            list_dailyDuelBuff.numItems = clanMember.length
        } else if (tispType == 2) {
            //********************未砍价*****************/
            this.uiPanel.getChild("label_title").text = StrVal.LYCLAN.STR108
            this.uiPanel.getChild("label_str52").text = StrVal.LYCLAN.STR52
            this.uiPanel.getChild("label_str107").text = StrVal.LYCLAN.STR107
            let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
            btn_close1.onClick(() => {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanPopup, 0, null);
            })
            let merchantStatusArr = []//未砍价
            for (let i = 0; i < clanMember.length; i++) {
                const element = clanMember[i];
                if (element.merchantStatus == 0) {
                    merchantStatusArr.push(element)
                }
            }

            let label_merchant: fgui.GList = this.uiPanel.getChild("label_merchant")
            label_merchant.setVirtual();
            label_merchant.itemRenderer = ((index: number, obj: fgui.GButton) => {
                let clanMemberItem = merchantStatusArr[index]
                obj.getChild("label_name").text = clanMemberItem.playerInfo.name
                obj.getChild("label_time").text = UtilsTool.pastTimeToString(clanMemberItem.playerInfo.lastOfflineTime)
            }).bind(this)
            label_merchant.numItems = merchantStatusArr.length
        }
        else if (tispType == 3) {
            //********************怪物奖励*****************/
            let clanRoot: any = LocaleData.getClanRoot()
            let clanMonster: any = LocaleData.getClanMonsterById("")
            this.uiPanel.getChild("label_str139").text = StrVal.LYCLAN.STR139
            this.uiPanel.getChild("label_str76").text = StrVal.LYCLAN.STR76
            this.uiPanel.getChild("label_str140").text = StrVal.LYCLAN.STR140
            let list_monster: fgui.GList = this.uiPanel.getChild("list_monster")
            list_monster.setVirtual();
            list_monster.itemRenderer = ((index: number, obj: fgui.GButton) => {
                let clanMonsterItem = clanMonster[index]
                let monsterData: any = LocaleData.getMonsterProto(clanMonsterItem.monsterId)
                obj.getChild("label_name").text = monsterData.monster_name
                obj.getChild("label_name1").text = UtilsTool.stringFormat(StrVal.LYCLAN.STR22, [UtilsUI.onNumberToChinese(index + 1)])
                let list_duelBonuses: fgui.GList = obj.getChild("list_duelBonuses")
                let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(clanMonsterItem.duelBonusesId);
                // 列表
                list_duelBonuses.itemRenderer = (index: number, group_item: fgui.GComponent) => {
                    UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
                }
                list_duelBonuses.numItems = bonuseItems.length
                let bonuseItems1: BonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, clanRoot.boxItemId, "1")
                let group_defeatReward: fgui.GComponent = obj.getChild("group_defeatReward")
                UtilsUI.setUIGroupItem(bonuseItems1, group_defeatReward, null);
            }).bind(this)
            list_monster.numItems = clanMonster.length
            this.uiPanel.getChild("label_str123").text = StrVal.LYCLAN.STR123
            this.uiPanel.getChild("label_str125").text = StrVal.LYCLAN.STR125
        }
    };




    public getIsViewMask(): boolean {
        return false;
    };

}