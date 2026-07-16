//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { GameServerData } from "../Kernel/GameServerData";
import { VarVal } from "../Values/VarVal";
import { LocaleData } from "../Kernel/LocaleData";
import { StrVal } from "../Values/StrVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { LyActivityShopBuy } from "./LyActivityShopBuy";
import { AudioManager } from "../Kernel/AudioManager";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { LyPayExquisite, PayExquisitePage } from "./LyPayExquisite";

export interface ShopBuyData {
    show_type:number, // 当前显示的折扣类型，非本身折扣类型
    buy_max:number, // 可购买
    buy_remain:number, // 剩余可买
    src_price:number, // 原价
    off_per:number, // 折扣，1-0
    dst_price:number, // 现价
    mode:number, // 1普通 2代金券 3售罄
    dailyPaidItemCount:number,
    normalRemainingItems:number,
    dailyRemainingItems:number,
    maxVoucherCount:number,
    isDynamicBazaar:boolean,
    policyVersion:string,
    unitItemCount:number,
    currentPaymentKind:string,
    remainingOrderItems:number,
    nextTierBoundary:number,
    quote:any,
}

export class LyActivityShop extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyActivityShop;
        this.viewResI.pkgName = "LyActivityShop";
        this.viewResI.comName = "LyActivityShop";
    }

    private shopShows:Array<any>;

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let btn_addchance:fgui.GButton = group_main.getChild("btn_addchance");
        if (PlatformAPI.isBinaryExamine() && PlatformAPI.isMiniGameOniOS()) {
            btn_addchance.visible = false;
        }
        btn_addchance.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.RECHARGE, type:VarVal.bonusType.chance});
        })

        let btn_add:fgui.GButton = group_main.getChild("btn_add");
        if (PlatformAPI.isBinaryExamine() && PlatformAPI.isMiniGameOniOS()) {
            btn_add.visible = false;
        }
        btn_add.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.RECHARGE, type:VarVal.bonusType.stone});
        })

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityShop, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_time = group_main.getChild("label_time", fgui.GTextField);
        let timeCall = () => {
            let serverTime = GameServerData.getInstance().getServerTime() * 1000;
            let lastTime = UtilsTool.getNextDateTime(serverTime);
            let remain = lastTime - serverTime;
            if (serverTime < lastTime - UtilsTool.ONEDAY_MILLISECONDS * 0.5) {
                remain = lastTime - UtilsTool.ONEDAY_MILLISECONDS * 0.5 - serverTime;
            }
            label_time.text = UtilsTool.stringFormat(StrVal.ACTIVITY_SHOP.STR5, [UtilsTool.splitTimeString(remain / 1000)]);
        }
        this.setInterval(timeCall, 1000);
        timeCall();

        let label_tips:fgui.GTextField = group_main.getChild("label_tips");
        label_tips.text = StrVal.ACTIVITY_SHOP.STR4;

        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.setVirtual();
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            let shopItem = this.shopShows[index];
            let shopData = LyActivityShop.getShopBuyData(shopItem);
            let displayItemCount = shopData.isDynamicBazaar ? shopData.unitItemCount : shopItem.count;
            if (shopData.isDynamicBazaar && shopData.quote && Number(shopData.quote.actualItems) > 0) {
                displayItemCount = Number(shopData.quote.actualItems);
            }

            let bonuseItem:BonuseItem;
            if (!LocaleData.isItem(shopItem.itemId)) {
                let bonusType = LocaleData.getShopItemBonusType(shopItem.itemId);
                bonuseItem = UtilsUI.getBonuseItem(bonusType, null, null, displayItemCount);
            } else {
                bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, shopItem.itemId, displayItemCount);
            }
            let label_name:fgui.GTextField = child.getChild("label_name");
            label_name.text = bonuseItem.name;

            let group_item:fgui.GComponent = child.getChild("group_item");
            group_item.touchable = false;
            UtilsUI.setUIGroupItem(bonuseItem, group_item, null);

            let label_off1 = child.getChild("label_off1", fgui.GTextField);
            let label_off2 = child.getChild("label_off2", fgui.GTextField);

            let c1 = child.getController("c1");
            let c2 = child.getController("c2");

            let selIdx = 0;
            if (shopData.isDynamicBazaar) {
                c1.selectedIndex = 0;
                selIdx = 0;
            } else if (shopData.mode == 2) {
                c1.selectedIndex = 0;
                selIdx = 0;
            } else if (shopData.show_type == VarVal.Discount_Type.free) {
                c1.selectedIndex = 1;
                selIdx = 1;
            } else if (shopData.show_type == VarVal.Discount_Type.discount) {
                c1.selectedIndex = 2;
                label_off1.text = String(shopData.off_per * 10);
                label_off2.text = StrVal.ACTIVITY_SHOP.STR3;
                selIdx = 1;
            } else {
                if (shopData.dst_price == shopData.src_price) { // 原价
                    c1.selectedIndex = 0;
                    selIdx = 0;
                } else {
                    c1.selectedIndex = 3;
                    label_off1.text = String(shopData.off_per * 10);
                    label_off2.text = StrVal.ACTIVITY_SHOP.STR3;
                    selIdx = 1;
                }
            }

            let btn_buy:fgui.GGraph = child.getChild("btn_buy");
            btn_buy.clearClick();
            btn_buy.onClick(() => {
                LyActivityShop.showLyActivityShopBuy(shopItem, shopData.buy_remain, () => {
                    this.onViewUpdate(null);
                });
            })

            btn_buy.visible = true;
            let label_limit:fgui.GTextField = child.getChild("label_limit");
            if (shopData.isDynamicBazaar) {
                let nextTier = shopData.nextTierBoundary > 0 ? String(shopData.nextTierBoundary) : "无";
                label_limit.text = "支付：" + LyActivityShop.formatBazaarPaymentKind(shopData.currentPaymentKind)
                    + "  剩余额度：" + shopData.remainingOrderItems
                    + "  下一阶梯：" + nextTier;
                if (shopData.currentPaymentKind == "blocked" || shopData.buy_remain <= 0) {
                    btn_buy.visible = false;
                    selIdx = 2;
                }
            } else if (shopData.buy_max <= 0) { // 不限制购买数量。
                label_limit.text = "";
            } else if (shopData.buy_remain <= 0) { // 售罄。
                label_limit.text = "";
                btn_buy.visible = false;
                selIdx = 2;
            } else if (shopData.buy_remain == shopData.buy_max) { // 没买过。
                label_limit.text = UtilsTool.stringFormat(StrVal.ACTIVITY_SHOP.STR1, [shopData.buy_remain]);
            } else { // 买过。
                label_limit.text = UtilsTool.stringFormat(StrVal.ACTIVITY_SHOP.STR2, [shopData.buy_remain, shopData.buy_max]);
            }

            c2.selectedIndex = selIdx;
            let label_need:fgui.GTextField = child.getChild("label_need");
            let label_need1:fgui.GTextField = child.getChild("label_need1");
            let label_need2:fgui.GTextField = child.getChild("label_need2");
            if (shopData.isDynamicBazaar) {
                label_need.text = LyActivityShop.formatBazaarQuote(shopData.quote);
                label_need1.text = "";
                label_need2.text = "";
            } else if (selIdx == 0) {
                label_need.text = String(shopData.src_price);
            } else if (selIdx == 1) {
                label_need1.text = String(shopData.src_price);
                label_need2.text = String(shopData.dst_price);
            }
        }
        this.onViewUpdate(null);

        let label_stone:fgui.GTextField = group_main.getChild("label_stone");
        let label_chance:fgui.GTextField = group_main.getChild("label_chance");
        let updeteChance = () => {
            let base = GameServerData.getInstance().getPlayerFullInfo().base;
            label_stone.text = base.stone;
            label_chance.text = base.chance;
        }
        updeteChance();
        this.registerRequest((args) => { // 事件后到了
            if (args.isNewValue) {
                updeteChance();
            }
        }, "playerAttrChanged");
    }

    public onViewUpdate(params: any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let list_item:fgui.GList = group_main.getChild("list_item");
        this.shopShows = LyActivityShop.getShopShows();
        UtilsUI.setFguiGlistDelayNumItems(list_item, this.shopShows.length);
    }

    /**
     * 调起坊市售卖数量页面。
     * @param shopItem 售卖项数据
     * @param maxCount 最大可购买数
     * @param doneCall 购买成功回调
     */
    public static showLyActivityShopBuy(shopItem:any, maxCount:number, doneCall?:Function) {
        let shopData = LyActivityShop.getShopBuyData(shopItem);
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityShopBuy, 0, {
            shopItem:shopItem,
            shopData:shopData,
            maxCount:maxCount,
            doneCall:doneCall
        });
    }

    public static normalizeBazaarPaymentKind(kind:any):string {
        let value = String(kind || "").toLowerCase();
        if (value == "original" || value == "money" || value == "stone" || value == "voucher" || value == "blocked") {
            return value;
        }
        return "blocked";
    }

    public static formatBazaarPaymentKind(kind:string):string {
        let paymentKind = LyActivityShop.normalizeBazaarPaymentKind(kind);
        if (paymentKind == "original") return "原价";
        if (paymentKind == "money") return "灵石";
        if (paymentKind == "stone") return "玉璧";
        if (paymentKind == "voucher") return "代金券";
        return "不可购买";
    }

    public static formatBazaarQuote(quote:any):string {
        if (!quote) return "以服务端结算为准";
        let moneyCost = Math.max(Math.floor(Number(quote.moneyCost) || 0), 0);
        let stoneCost = Math.max(Math.floor(Number(quote.stoneCost) || 0), 0);
        let voucherCost = Math.max(Math.floor(Number(quote.voucherCost) || 0), 0);
        return "灵石" + moneyCost + " / 玉璧" + stoneCost + " / 代金券" + voucherCost;
    }

    private static getBazaarPolicyItem(activityShop:any, id:number):any {
        if (!activityShop || !activityShop.policyItems) return null;
        let policyItems = activityShop.policyItems;
        let directPolicyItem = policyItems[id];
        if (directPolicyItem && Number(directPolicyItem.entryId) == id) return directPolicyItem;
        if (Array.isArray(policyItems)) {
            for (let i = 0; i < policyItems.length; i++) {
                if (policyItems[i] && Number(policyItems[i].entryId) == id) return policyItems[i];
            }
        } else {
            for (let key in policyItems) {
                let policyItem = policyItems[key];
                if (policyItem && Number(policyItem.entryId) == id) return policyItem;
            }
        }
        return null;
    }

    /**
	 * 获得坊市当前可展示售卖项。
     */
	public static getShopShows():Array<any> {
        let level:number = GameServerData.getInstance().getPlayerFullInfo().base.level;
        let openday:number = GameServerData.getInstance().getServerCreateDay();
        let shops:Array<any> = new Array<any>();
        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.SHOP);
        let shopItems:Array<any> = activityXml._shop[0]._item;
        shopItems.sort((itemA, itemB) => {
            return Number(itemA.id) - Number(itemB.id);
        })
        for (let i = 0; i < shopItems.length; i++) {
            let item = shopItems[i];
            if (level >= Number(item.levelMin) && level <= Number(item.levelMax)
                && openday >= Number(item.openServerDay)
                && GameServerData.getInstance().isActivationSys(item.openID)) {
                shops.push(item);
            }
        }
        return shops;
    }

    public static getShopBuyData(shopItem:any):ShopBuyData {
        let id = Number(shopItem.id);

        let show_type = VarVal.Discount_Type.normal;
        let buy_max = 0;
        let buy_remain = 0;
        let src_price = Number(shopItem.stone);
        let off_per = 0;
        let dst_price = 0;
        let mode = 1;
        let dailyPaidItemCount = 0;
        let normalRemainingItems = 10000;
        let dailyRemainingItems = 9990000;
        let maxVoucherCount = 0;
        let itemCount = Math.max(Math.floor(Number(shopItem.count) || 1), 1);
        let isDynamicBazaar = false;
        let policyVersion = "";
        let unitItemCount = itemCount;
        let currentPaymentKind = "original";
        let remainingOrderItems = 0;
        let nextTierBoundary = 0;
        let quote:any = null;

        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.SHOP);
        if (activityState && activityState.data && activityState.data.activityShop) {
            let activityShop = activityState.data.activityShop;
            let shopDatas:Array<any> = activityShop.shopList || [];
            for (let i = 0; i < shopDatas.length; i++) {
                let shopData = shopDatas[i];
                if (shopData.id == id) {
                    if (activityShop && activityShop.policyVersion != null
                        && String(activityShop.policyVersion).length > 0
                        && shopData.currentPaymentKind != null) {
                        isDynamicBazaar = true;
                        policyVersion = String(activityShop.policyVersion);
                        let policyItem = LyActivityShop.getBazaarPolicyItem(activityShop, id);
                        if (policyItem && Number(policyItem.unitItemCount) > 0) {
                            unitItemCount = Math.max(Math.floor(Number(policyItem.unitItemCount)), 1);
                        }
                        currentPaymentKind = LyActivityShop.normalizeBazaarPaymentKind(shopData.currentPaymentKind);
                        remainingOrderItems = Number(shopData.remainingOrderItems);
                        if (!Number.isFinite(remainingOrderItems)) remainingOrderItems = 0;
                        remainingOrderItems = Math.max(Math.floor(remainingOrderItems), 0);
                        nextTierBoundary = Number(shopData.nextTierBoundary);
                        if (!Number.isFinite(nextTierBoundary)) nextTierBoundary = 0;
                        nextTierBoundary = Math.max(Math.floor(nextTierBoundary), 0);
                        quote = shopData.quote || null;
                        buy_max = Math.floor(remainingOrderItems / unitItemCount);
                        buy_remain = buy_max;
                        dailyRemainingItems = Number(shopData.dailyRemainingItems || remainingOrderItems);
                        normalRemainingItems = Number(shopData.normalRemainingItems || 0);
                        maxVoucherCount = Number(shopData.maxVoucherCount || 0);
                        mode = currentPaymentKind == "voucher" ? 2 : (currentPaymentKind == "blocked" ? 3 : 1);
                        show_type = VarVal.Discount_Type.normal;
                        off_per = 1;
                    }
                    if (!isDynamicBazaar) {
                    mode = Number(shopData.mode || 1);
                    dailyPaidItemCount = Number(shopData.dailyPaidItemCount || 0);
                    normalRemainingItems = Number(shopData.normalRemainingItems);
                    if (!Number.isFinite(normalRemainingItems)) {
                        normalRemainingItems = Math.max(10000 - dailyPaidItemCount, 0);
                    }
                    normalRemainingItems = Math.max(Math.floor(normalRemainingItems), 0);
                    dailyRemainingItems = Number(shopData.dailyRemainingItems || 0);
                    maxVoucherCount = Number(shopData.maxVoucherCount || 0);
                    let normalGroupRemaining = Math.floor(normalRemainingItems / itemCount);
                    if (shopData.mode == 2) {
                        buy_max = maxVoucherCount;
                        buy_remain = maxVoucherCount;
                        off_per = 1;
                        src_price = 1;
                    } else if (shopData.mode == 3) {
                        buy_max = 0;
                        buy_remain = 0;
                        off_per = 1;
                        src_price = 1;
                    } else if (shopData.type == VarVal.Discount_Type.free && shopData.freeCount > 0) {
                        show_type = shopData.type;
                        buy_max = shopData.freeCount;
                        buy_remain = shopData.freeCount;
                        off_per = 0;
                    } else if (shopData.type == VarVal.Discount_Type.discount && shopData.paidDiscounts1Count > 0) {
                        show_type = shopData.type;
                        buy_max = Number(shopItem.paid_discounts_times);
                        buy_remain = Math.min(shopData.paidDiscounts1Count, normalGroupRemaining);
                        off_per = Number(shopItem.Paid_discount1);
                    } else if (shopData.type == VarVal.Discount_Type.discount && shopData.paidDiscounts2Count > 0) {
                        show_type = shopData.type;
                        buy_max = Number(shopItem.paid_discounts_times);
                        buy_remain = Math.min(shopData.paidDiscounts2Count, normalGroupRemaining);
                        off_per = Number(shopItem.Paid_discount2);
                    } else if (shopData.type == VarVal.Discount_Type.discount && shopData.paidDiscounts3Count > 0) {
                        show_type = shopData.type;
                        buy_max = Number(shopItem.paid_discounts_times);
                        buy_remain = Math.min(shopData.paidDiscounts3Count, normalGroupRemaining);
                        off_per = Number(shopItem.Paid_discount3);
                    } else if (shopData.discount1Count > 0) {
                        buy_max = Number(shopItem.discount1_times);
                        buy_remain = Math.min(shopData.discount1Count, normalGroupRemaining);
                        off_per = Number(shopItem.discount1);
                    } else if (shopData.discount2Count > 0) {
                        buy_max = Number(shopItem.discount2_times);
                        buy_remain = Math.min(shopData.discount2Count, normalGroupRemaining);
                        off_per = Number(shopItem.discount2);
                    } else if (shopData.discount3Count > 0) {
                        buy_max = Number(shopItem.discount3_times);
                        buy_remain = Math.min(shopData.discount3Count, normalGroupRemaining);
                        off_per = Number(shopItem.discount3);
                    } else {
                        buy_max = Math.floor(10000 / itemCount);
                        buy_remain = Math.floor(normalRemainingItems / itemCount);
                        off_per = 1;
                    }
                    }
                    break;
                }
            }
        }
        if (off_per > 0) {
            dst_price = Math.max(Math.floor(src_price * off_per), 1) // 下取整，保底1
        }
        let data:ShopBuyData = {
            show_type: show_type,
            buy_max: buy_max,
            buy_remain: buy_remain,
            src_price: src_price,
            off_per: off_per,
            dst_price: dst_price
            ,mode: mode
            ,dailyPaidItemCount: dailyPaidItemCount
            ,normalRemainingItems: normalRemainingItems
            ,dailyRemainingItems: dailyRemainingItems
            ,maxVoucherCount: maxVoucherCount
            ,isDynamicBazaar: isDynamicBazaar
            ,policyVersion: policyVersion
            ,unitItemCount: unitItemCount
            ,currentPaymentKind: currentPaymentKind
            ,remainingOrderItems: remainingOrderItems
            ,nextTierBoundary: nextTierBoundary
            ,quote: quote
        }
        return data;
    }

    public getIsViewMask():boolean {
        return false;
    }
}
