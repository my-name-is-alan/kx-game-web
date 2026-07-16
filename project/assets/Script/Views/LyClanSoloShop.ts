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
import { PointRedData } from "../Kernel/PointRedData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyActivityShopBuy, ShopBuy } from "./LyActivityShopBuy";
import { LyCompanionInfo } from "./LyCompanionInfo";
import { LyGuideGetItem } from "./LyGuideGetItem";

export class LyClanSoloShop extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClanSolo";
        this.viewResI.pkgName = "LyClanSolo";
        this.viewResI.comName = "LyClanSoloShop";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloShop, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloShop, 0, null);
        })
        this.uiPanel.getChild("label_title", fgui.GLabel).text = StrVal.LYCLANSOLO.STR5
        this.initialize()

        this.registerRequest((args) => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloShop, 0, null);
        }, "onClanSoloShopRefresh");

    };
    private initialize(): void {
        let clanSoloPlayer: any = GameServerData.getInstance().getPlayerFullInfo().clanSoloPlayer
        let shopXml: any = LocaleData.getClanSoloShop()
        let group_icon: fgui.GComponent = this.uiPanel.getChild("group_icon")
        // let url: string = UtilsTool.stringFormat("ui://CCommon/Props-jianling", [LocaleData.getItemProto(petRoot.summon_currency_item).icon]);
        group_icon.getChild("loader_icon", fgui.GLoader).url = "ui://CCommon/Props-reputation"
        group_icon.getChild("label_number", fgui.GLabel).text = String(clanSoloPlayer.clanSoloMyselfInfo.prestige)

        let btn_add: fgui.GButton = group_icon.getChild("btn_add")
        btn_add.clearClick()
        btn_add.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {
                bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.clansolo, null, null, "1"), buyCall: () => {
                    // this.group_icon1.getChild("label_number").text = String(itemCount)
                }
            });
        })
        let label_oncePrestige: fgui.GLabel = this.uiPanel.getChild("label_oncePrestige")
        label_oncePrestige.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR44, [clanSoloPlayer.clanSoloMyselfInfo.oncePrestige])
        let list_shop: fgui.GList = this.uiPanel.getChild("list_shop")

        shopXml.sort((itemA, itemB) => {
            return Number(itemA.unlock) - Number(itemB.unlock);
        })

        list_shop.itemRenderer = (index: number, child: fgui.GComponent) => {
            let rankItem = shopXml[index];
            let dataItem = LocaleData.getItemProto(rankItem.itemId)
            let bonuseItem: BonuseItem;
            if (!LocaleData.isItem(rankItem.itemId)) {
                let bonusType = LocaleData.getShopItemBonusType(rankItem.itemId);
                bonuseItem = UtilsUI.getBonuseItem(bonusType, null, null, rankItem.count);
            } else {
                bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, rankItem.itemId, rankItem.count);
            }
            let group_lock: fgui.GGroup = child.getChild("group_lock")
            group_lock.visible = clanSoloPlayer.clanSoloMyselfInfo.oncePrestige < Number(rankItem.unlock)
            let label_lock: fgui.GLabel = child.getChild("label_lock")
            label_lock.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR58, [rankItem.unlock])
            let label_name: fgui.GTextField = child.getChild("label_name");
            label_name.text = String(bonuseItem.name);
            let group_item: fgui.GComponent = child.getChild("group_item");
            UtilsUI.setUIGroupItem(bonuseItem, group_item, null);
            let label_limit: fgui.GTextField = child.getChild("label_limit");
            let maxCount: number = rankItem.dailyLimit
            for (let i = 0; i < clanSoloPlayer.clanSoloBuyGoods.length; i++) {
                let item = clanSoloPlayer.clanSoloBuyGoods[i]
                if (item.cfgId == rankItem.id) {
                    maxCount = Number(rankItem.dailyLimit) - item.count
                }
            }
            let group_over: fgui.GGroup = child.getChild("group_over")
            let group_buy: fgui.GGroup = child.getChild("group_buy")
            group_over.visible = maxCount == 0
            group_buy.visible = maxCount != 0
            label_limit.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR12, [maxCount]);
            let btn_buy: fgui.GButton = child.getChild("btn_buy")
            PointRedData.getInstance().updateManualPoint(btn_buy, false);
            if (rankItem.prestige == "0") {
                btn_buy.text = StrVal.LYCLANSOLO.STR40
                btn_buy.icon = ""
                // btn_buy.
                PointRedData.getInstance().updateManualPoint(btn_buy, true);
            } else {
                btn_buy.text = rankItem.prestige
                btn_buy.icon = UtilsUI.getItemIconUrl(VarVal.bonusType.clansolo);
            }
            btn_buy.clearClick()
            btn_buy.onClick(() => {
                if (maxCount > 0) {
                    let type = Number(rankItem.itemId) > 100 ? VarVal.bonusType.item : rankItem.itemId
                    let shopBuy: ShopBuy = {
                        costBonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.clansolo, null, null, rankItem.prestige),
                        bonuseItem: UtilsUI.getBonuseItem(type, null, rankItem.itemId, rankItem.count),
                        set_need: rankItem.prestige
                    }
                    if (rankItem.prestige == "0") {
                        UtilsUI.lockWait();
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait();
                            if (args.errorcode == 0) {
                                UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([{ inserts: args.itemInserts }]) });
                                this.onViewUpdate();
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityShopBuy, 0, null);
                            } else {
                                UtilsUI.showMsgTip(args.errorcode);
                            }
                        }, "clanSoloGoodsBuy", {
                            goodsId: Number(rankItem.id),
                            count: 1
                        });
                    } else {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityShopBuy, 0, {
                            shopBuy: shopBuy, maxCount: maxCount, doneCall: (buyCount: number) => {
                                UtilsUI.lockWait();
                                GameServer.getInstance().send((args: any) => {
                                    UtilsUI.unlockWait();
                                    if (args.errorcode == 0) {
                                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([{ inserts: args.itemInserts }]) });
                                        this.onViewUpdate();
                                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityShopBuy, 0, null);
                                    } else {
                                        UtilsUI.showMsgTip(args.errorcode);
                                    }
                                }, "clanSoloGoodsBuy", {
                                    goodsId: Number(rankItem.id),
                                    count: buyCount
                                });
                            }
                        });
                    }
                }
            })
        }
        list_shop.numItems = shopXml.length
    }
    public onViewUpdate(): void {
        this.initialize()
    };

    public static isViewRedPointShop(): boolean {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanSoloPlayer: any = fullInfo.clanSoloPlayer
        if (clanSoloPlayer) {
            let clanSoloBuyGoods: any = clanSoloPlayer.clanSoloBuyGoods
            let shopXml: any = LocaleData.getClanSoloShop()
            for (let i = 0; i < shopXml.length; i++) {
                const element = shopXml[i];
                let maxCount
                if (element.prestige == "0") {
                    if (clanSoloBuyGoods.length == 0) {
                        return true
                    }
                    for (let i = 0; i < clanSoloBuyGoods.length; i++) {
                        let item = clanSoloBuyGoods[i]
                        if (item.cfgId == Number(element.id)) {
                            maxCount = element.dailyLimit - item.count
                        }
                    }
                }
                if (maxCount > 0) {
                    return true
                }
            }
            return false
        }
        return false
    }
    public getIsViewMask(): boolean {
        return false;
    };

}