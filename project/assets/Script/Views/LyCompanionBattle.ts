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
import { BattleResultParams, BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { LyBattleMain } from "./LyBattleMain";
import { VarVal } from "../Values/VarVal";
import { LyCompanion } from "./LyCompanion";

export class LyCompanionBattle extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyCompanion";
        this.viewResI.pkgName = "LyCompanion";
        this.viewResI.comName = "LyCompanionBattle";
    }
    private uiPanel: fgui.GComponent
    private companionInfo: any
    private companionId: any
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        this.companionId = params.companionInfo.companionId
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCompanionBattle, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCompanionBattle, 0, null);
        })
        let label_str27: fgui.GLabel = this.uiPanel.getChild("label_str27")
        label_str27.text = StrVal.LYCOMPANION.STR27
        this.loadCompanionBattle()
    };

    public loadCompanionBattle(): void {
        // let duelArr: any = LocaleData.getCompanionDuel()
        let companionData = GameServerData.getInstance().getPlayerFullInfo().companionData
        for (let i = 0; i < companionData.companions.length; i++) {
            const element = companionData.companions[i];
            if (element.companionId == this.companionId) {
                this.companionInfo = companionData.companions[i]
                break
            }
        }
        let duelArr: any = LocaleData.getCompanionDuelById(this.companionInfo.companionId)
        let list_battle: fgui.GList = this.uiPanel.getChild("list_battle")
        let companionItem: any = LocaleData.getCompanionById(this.companionInfo.companionId)
        let models = LocaleData.getModelItem(companionItem.modelId)
        // list_battle.setVirtual();
        let fullInfoBase = GameServerData.getInstance().getPlayerFullInfo().base
        let scrollToViewNum: number = 0
        for (let i = 0; i < duelArr.length; i++) {
            const data = duelArr[i];
            if (Number(data.playerLevel) > Number(fullInfoBase.level) || Number(data.likingLevel) > Number(this.companionInfo.level)) {
                scrollToViewNum = i
                break
            }
        }
        scrollToViewNum = scrollToViewNum > Number(this.companionInfo.duelPhase) ? Number(this.companionInfo.duelPhase) + 1 : scrollToViewNum
        // list_battle.setVirtual()
        list_battle.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            let data: any = duelArr[index]
            let img_icon: fgui.GLoader = obj.getChild("img_icon")
            img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [models.avatar2]);
            obj.getChild("label_stage").text = data.phaseName
            let list_prop: fgui.GList = obj.getChild("list_prop")
            let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(data.bonusesId);
            list_prop.itemRenderer = (index: number, group_item: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
            }
            list_prop.numItems = bonuseItems.length;
            let c1: fgui.Controller = obj.getController("c1")
            list_battle.scrollToView(scrollToViewNum)
            if (Number(data.playerLevel) > Number(fullInfoBase.level) || Number(data.likingLevel) > Number(this.companionInfo.level)) {
                c1.selectedIndex = 3
                let label_condition1: fgui.GTextField = obj.getChild("label_condition1")
                let label_condition2: fgui.GTextField = obj.getChild("label_condition2")
                label_condition1.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR10, [data.likingLevel])
                label_condition1.color = UtilsUI.getEnoughColor(!(Number(data.likingLevel) > Number(this.companionInfo.level)));
                label_condition2.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR40, [data.playerLevel])
                label_condition2.color = UtilsUI.getEnoughColor(!(Number(data.playerLevel) > Number(fullInfoBase.level)));
            } else if (Number(this.companionInfo.duelPhase) < index) {
                c1.selectedIndex = 2
            } else if (Number(this.companionInfo.duelPhase) == index) {
                c1.selectedIndex = 1
            } else {
                c1.selectedIndex = 0
            }
            let btn_battle: fgui.GButton = obj.getChild("btn_battle")
            btn_battle.clearClick()
            btn_battle.onClick(() => {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        let resultParams: BattleResultParams = {
                            battleResult: args.battleResult,
                            bonuseString: GameServerData.getInstance().bonusesResultsToString([args.dropReward]),
                            typeInfo: {
                                type: VarVal.BATTLE_TYPE.COMPANION,
                            }
                        }
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleMain, 0, {
                            resultParams: resultParams,
                        });
                        // 通关后刷新本界面。
                        if (args.battleResult.isWin) {
                            this.loadCompanionBattle();
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyCompanion, 0, null);
                        }
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "duelCompanion", {
                    companionId: Number(this.companionInfo.companionId),
                    duelPhase: Number(this.companionInfo.duelPhase) + 1
                });
            })
            // list_prop.itemRenderer = ((index1: number, obj1: fgui.GButton) => {
            //     UtilsUI.setUIGroupItem(LocaleData.getItemProto(data.bonusesId.split(",")[index1]), obj1, null)
            // })
            // list_prop.numItems = data.bonusesId.split(",").length
        }).bind(this)
        UtilsUI.setFguiGlistDelayNumItems(list_battle, duelArr.length);
        // list_battle.numItems = duelArr.length
    }
    public getCompanionData(attr: string, id: string): string[] {
        let attrArr: string[] = attr.split("|")
        for (let i = 0; i < attrArr.length; i++) {
            let item: string = attrArr[i]
            if (item.split(":")[0] == id) {
                return item.split(":")
            }
        }
    }
    public getIsViewMask(): boolean {
        return false;
    };

}