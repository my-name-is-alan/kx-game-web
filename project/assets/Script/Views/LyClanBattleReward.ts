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
import { LyClanPopup } from "./LyClanPopup";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanBattleReward extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanBattleReward";
    }
    public onViewCreate(params): void {
        let uiPanel: fgui.GComponent = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanBattleReward, 0, null);
        })
        let btn_close1: fgui.GButton = uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanBattleReward, 0, null);
        })

        uiPanel.getChild("label_bxl").text = StrVal.LYCLAN.STR121
        uiPanel.getChild("label_str122").text = StrVal.LYCLAN.STR122
        let btn_calnPopup3: fgui.GButton = uiPanel.getChild("btn_calnPopup3");
        btn_calnPopup3.text = StrVal.LYCLAN.STR123
        btn_calnPopup3.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanPopup, 0, { tispType: 3 });
        })
        this.playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        this.btn_clanDuelClaimReward = uiPanel.getChild("btn_clanDuelClaimReward")
        this.btn_clanDuelClaimReward.text = StrVal.LYCLAN.STR124
        this.list_reward = uiPanel.getChild("list_reward")
        this.onReward()
        let clanLog = this.playerClanInfo.clanLog
        let type = 1
        let clanLogType: any = []
        for (let i = 0; i < clanLog.length; i++) {
            let element = clanLog[i];
            if (element.type == type && element.log != "") {
                clanLogType.push(element)
            }
        }
        clanLogType.sort((b, a) => {
            return a.createTime - b.createTime
        })
        let list_log: fgui.GList = uiPanel.getChild("list_log")
        list_log.itemRenderer = ((index: number, obj: fgui.GButton) => {
            // obj.getChild("label_createTime").text = UtilsTool.TimeToStr(clanLogType[index].createTime, "-")
            obj.getChild("label_dec").text = clanLogType[index].log
        }).bind(this)
        list_log.numItems = clanLogType.length

        let label_noLog: fgui.GLabel = uiPanel.getChild("label_noLog")
        label_noLog.visible = clanLogType.length == 0
    };

    private btn_clanDuelClaimReward: fgui.GButton
    private list_reward: fgui.GList
    private playerClanInfo: any
    private onReward(): void {
        let clanInfo = this.playerClanInfo.clanInfo
        let clanMember = this.playerClanInfo.clanMember
        let myselfInfo = this.playerClanInfo.myselfInfo
        let maxBoss: boolean = false
        let clanMonsterXml: any
        if (LocaleData.getClanMonsterById(clanInfo.duelMonsterId)) {
            clanMonsterXml = LocaleData.getClanMonsterById(clanInfo.duelMonsterId)
        } else {
            //通关了
            clanMonsterXml = LocaleData.getClanMonsterById(clanInfo.duelMonsterId - 1)
            maxBoss = true
        }
        let bonuseArrOld: Array<BonuseItem> = []
        let maxNum: Number = clanInfo.duelMonsterId
        for (let i = myselfInfo.dailyDuelMonsterReward + 1; i < clanInfo.duelMonsterId; i++) {
            let clanMonster: any = LocaleData.getClanMonsterById(i)
            let bonuseItem: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(clanMonster.duelBonusesId);
            for (let j = 0; j < bonuseItem.length; j++) {
                const element = bonuseItem[j];
                bonuseArrOld.push(element)
            }
        }
        let bonuseArr: Array<BonuseItem> = []
        for (let i = 0; i < bonuseArrOld.length; i++) {
            let item = bonuseArrOld[i]
            let data = item
            for (let j = i + 1; j < bonuseArrOld.length; j++) {
                let item2 = bonuseArrOld[j]
                if (item.proto.id == item2.proto.id) {
                    data.count = String(Number(item2.count) + Number(data.count))
                }
            }
            let isPush = true
            for (let z = 0; z < bonuseArr.length; z++) {
                let item3 = bonuseArr[z]
                if (item3.proto.id == data.proto.id) {
                    isPush = false
                }
            }
            if (isPush) {
                bonuseArr.push(data)
            }
        }
        let clanRoot: any = maxBoss ? LocaleData.getClanRoot() + 1 : LocaleData.getClanRoot()
        let boxNum: number = clanInfo.duelRewardNum - myselfInfo.dailyDuelRewardNum
        if (boxNum > 0) {
            let Items: BonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, clanRoot.boxItemId, String(boxNum))
            bonuseArr.push(Items)
        }
        this.list_reward.itemRenderer = (index: number, obj: fgui.GComponent) => {
            UtilsUI.setUIGroupItem(bonuseArr[index], obj, null);
        }
        this.list_reward.numItems = bonuseArr.length;
        this.btn_clanDuelClaimReward.enabled = bonuseArr.length > 0
        this.btn_clanDuelClaimReward.clearClick()
        this.btn_clanDuelClaimReward.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.claimReward]) });
                    this.onReward()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "clanDuelClaimReward", {
            })
        })
    }

    public static isViewRedPointReward(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.clan) || !GameServerData.getInstance().isClanHas()) {
            return false;
        }
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanInfo = playerClanInfo.clanInfo
        let myselfInfo = playerClanInfo.myselfInfo
        if (UtilsTool.TimeToDateStr(myselfInfo.joinTime) == UtilsTool.TimeToDateStr(GameServerData.getInstance().getServerTime())) {
            return false;
        }
        let maxBoss: boolean = false
        let clanMonsterXml: any
        if (LocaleData.getClanMonsterById(clanInfo.duelMonsterId)) {
            clanMonsterXml = LocaleData.getClanMonsterById(clanInfo.duelMonsterId)
        } else {
            clanMonsterXml = LocaleData.getClanMonsterById(clanInfo.duelMonsterId - 1)
            maxBoss = true
        }
        let bonuseArr: Array<BonuseItem> = []
        for (let i = myselfInfo.dailyDuelMonsterReward + 1; i < clanInfo.duelMonsterId; i++) {
            let clanMonster: any = LocaleData.getClanMonsterById(i)
            let bonuseItem: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(clanMonster.duelBonusesId);
            for (let j = 0; j < bonuseItem.length; j++) {
                const element = bonuseItem[j];
                bonuseArr.push(element)
            }
        }
        let clanRoot: any = maxBoss ? LocaleData.getClanRoot() + 1 : LocaleData.getClanRoot()
        let boxNum: number = clanInfo.duelRewardNum - myselfInfo.dailyDuelRewardNum
        if (boxNum > 0) {
            let Items: BonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, clanRoot.boxItemId, String(boxNum))
            bonuseArr.push(Items)
        }
        return bonuseArr.length > 0
    }

    public getIsViewMask(): boolean {
        return false;
    };

}
