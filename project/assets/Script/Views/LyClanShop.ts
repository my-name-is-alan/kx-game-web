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
import { LyActivityShopBuy, ShopBuy } from "./LyActivityShopBuy";
import { LyCompanionInfo } from "./LyCompanionInfo";
import { LyGuideGetItem } from "./LyGuideGetItem";

export class LyClanShop extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanShop";
    }
    private group_clanShop: fgui.GComponent
    private shopType = 1
    private shopType1: string = VarVal.bonusType.clanPoint
    public onViewCreate(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel()
        this.group_clanShop = uiPanel.getChild("group_clanShop")
        UtilsUI.playCommonGroupAni(this.group_clanShop, null)
        // 关闭
        let btn_close: fgui.GButton = uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanShop, 0, null);
        })
        let btn_close1: fgui.GButton = this.group_clanShop.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanShop, 0, null);
        })
        this.group_clanShop.getChild("label_bxl").text = StrVal.LYCLAN.STR114

        let btn_shop1: fgui.GButton = this.group_clanShop.getChild("btn_shop1")
        let btn_shop2: fgui.GButton = this.group_clanShop.getChild("btn_shop2")
        let btn_shop3: fgui.GButton = this.group_clanShop.getChild("btn_shop3")
        btn_shop1.onClick(() => {
            this.shopType = 1
            this.shopType1 = VarVal.bonusType.clanPoint
            this.onListShop()
        })
        btn_shop2.onClick(() => {
            this.shopType = 2
            this.shopType1 = VarVal.bonusType.clanGlory
            this.onListShop()
        })
        btn_shop3.onClick(() => {
            this.shopType = 3
            this.shopType1 = VarVal.bonusType.clanRare
            this.onListShop()
        })
        this.onListShop()
    };

    private onListShop(): void {
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let myselfInfo = playerClanInfo.myselfInfo
        let clanInfo = playerClanInfo.clanInfo
        let clanBuy = playerClanInfo.clanBuy

        let shopXml: any = LocaleData.getClanShopByType(this.shopType)

        shopXml.sort((itemA, itemB) => {
            if (itemA.requirePhase == itemB.requirePhase) {
                return Number(itemA.requireLevel) - Number(itemB.requireLevel);
            } else {
                return Number(itemA.requirePhase) - Number(itemB.requirePhase);
            }
        })
        let list_shop: fgui.GList = this.group_clanShop.getChild("list_shop")

        let group_gold: fgui.GComponent = this.group_clanShop.getChild("group_gold")
        let label_number: fgui.GLabel = group_gold.getChild("label_number")
        let loader_icon: fgui.GLoader = group_gold.getChild("loader_icon")
        loader_icon.url = UtilsUI.getItemIconUrl(this.shopType1);
        group_gold.getChild("btn_add").onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {
                bonuseItem: UtilsUI.getBonuseItem(this.shopType1, null, null, "1"), buyCall: () => {
                }
            });
        })
        if (this.shopType == 1) {
            label_number.text = String(myselfInfo.point)
        } else if (this.shopType == 2) {
            label_number.text =String( myselfInfo.glory)
        } else if (this.shopType == 3) {
            label_number.text =String( myselfInfo.rare)        }
        list_shop.itemRenderer = ((index: number, child: fgui.GButton) => {
            let rankItem = shopXml[index];
            let bonuseItems: BonuseItem
            if (!LocaleData.isItem(rankItem.itemId)) {
                // if (goodsData.itemId == VarVal.bonusType.money) {
                let bonusType = LocaleData.getShopItemBonusType(rankItem.itemId);
                bonuseItems = UtilsUI.getBonuseItem(bonusType, null, null, rankItem.itemCount);
                // bonuseItems1 = UtilsUI.getBonuseItem(VarVal.bonusType.money, null, null, goodsData.itemCount)
            } else {
                bonuseItems = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, rankItem.itemId, rankItem.itemCount)
            }
            let label_name: fgui.GTextField = child.getChild("label_name");
            label_name.text = bonuseItems.name
            let group_item: fgui.GComponent = child.getChild("group_item");
            UtilsUI.setUIGroupItem(bonuseItems, group_item, null);
            let label_limit: fgui.GTextField = child.getChild("label_limit");
            let maxCount: number = rankItem.limit
            for (let i = 0; i < clanBuy.length; i++) {
                let item = clanBuy[i]
                if (item.goodsId == Number(rankItem.id)) {
                    maxCount = rankItem.limit - item.count
                }
            }
            label_limit.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR12, [maxCount]);
            let label_lock: fgui.GLabel = child.getChild("label_lock")
            let group_lock: fgui.GLabel = child.getChild("group_lock")
            let group_over: fgui.GGroup = child.getChild("group_over")
            let group_buy: fgui.GGroup = child.getChild("group_buy")
            group_over.visible = maxCount == 0
            group_buy.visible = maxCount != 0
            // label_lock.text =rankItem.
            group_lock.visible = false
            if (clanInfo.level < Number(rankItem.requireLevel)) {
                group_lock.visible = true
                label_lock.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR17, [rankItem.requireLevel])
            } else {
                if (clanInfo.phase < Number(rankItem.requirePhase)) {
                    group_lock.visible = true
                    let clanPhase = LocaleData.getClanPhaseById(rankItem.requirePhase)
                    label_lock.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR16, [clanPhase.name])
                } else {
                }
            }
            let btn_buy: fgui.GButton = child.getChild("btn_buy")
            btn_buy.text = rankItem.amount == "0" ? StrVal.LYQUNYIN.STR39 : rankItem.amount
            btn_buy.icon = UtilsUI.getItemIconUrl(this.shopType1);
            btn_buy.clearClick()
            btn_buy.onClick(() => {
                if (maxCount > 0) {
                    if (rankItem.amount != "0") {
                        let bonuseItems1: BonuseItem
                        if (!LocaleData.isItem(rankItem.itemId)) {
                            let bonusType = LocaleData.getShopItemBonusType(rankItem.itemId);
                            bonuseItems1 = UtilsUI.getBonuseItem(bonusType, null, null, rankItem.itemCount);
                        } else {
                            bonuseItems1 = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, rankItem.itemId, rankItem.itemCount)
                        }
                        let shopBuy: ShopBuy = {
                            costBonuseItem: UtilsUI.getBonuseItem(this.shopType1, null, null, rankItem.amount),
                            bonuseItem: bonuseItems1,
                            set_need: rankItem.amount
                        }
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityShopBuy, 0, {
                            shopBuy: shopBuy, maxCount: maxCount, doneCall: (buyCount: number) => {
                                this.onClanBuyGoods(Number(rankItem.id), buyCount)
                            }
                        });
                    } else {
                        this.onClanBuyGoods(Number(rankItem.id), maxCount)
                    }
                }
            })
        }).bind(this)
        list_shop.numItems = shopXml.length
    }
    private onClanBuyGoods(goodsId: number, count: number): void {
        UtilsUI.lockWait();
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait();
            if (args.errorcode == 0) {
                UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([{ inserts: args.itemInserts }]) });
                this.onListShop()
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityShopBuy, 0, null);
            } else {
                UtilsUI.showMsgTip(args.errorcode);
            }
        }, "clanBuyGoods", {
            goodsId: goodsId,
            count: count
        });
    }


    public static isViewRedPoint(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.clan) || !GameServerData.getInstance().isClanHas()) {
            return false;
        }
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanBuy = playerClanInfo.clanBuy
        let shopXml: any = LocaleData.getClanShop()
        for (let i = 0; i < shopXml.length; i++) {
            const element = shopXml[i];
            let maxCount
            if (element.amount == "0") {
                if (clanBuy.length == 0) {
                    return true
                }
                for (let i = 0; i < clanBuy.length; i++) {
                    let item = clanBuy[i]
                    if (item.goodsId == Number(element.id)) {
                        maxCount = element.limit - item.count
                    }
                }
            }
            if (maxCount > 0) {
                return true
            }
        }
        return false
    }

    public getIsViewMask(): boolean {
        return false;
    };

}