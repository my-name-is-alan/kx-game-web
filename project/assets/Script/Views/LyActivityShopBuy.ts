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
import { StrVal } from "../Values/StrVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServer } from "../Kernel/GameServer";
import { LocaleData } from "../Kernel/LocaleData";
import { LyActivityShop } from "./LyActivityShop";
import { Color, EditBox, HorizontalTextAlignment, VerticalTextAlignment } from "cc";

export interface ShopBuy {
    costBonuseItem:BonuseItem,
    bonuseItem:BonuseItem,

    set_need:number, // 单组价格
}

export class LyActivityShopBuy extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyActivityShop;
        this.viewResI.pkgName = "LyActivityShop";
        this.viewResI.comName = "LyActivityShopBuy";
    }

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityShopBuy, 0, null);
        })
        
        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let costBonuseItem:BonuseItem;
        let bonuseItem:BonuseItem;
        let quality:string;

        let have_count:number; // 当前拥有
        let set_need:number; // 单组价格
        let curr_coin:number; // 当前拥有消耗道具数量
        let isVoucherPurchase:boolean = false;
        let shopData:any = null;
        let isDynamicBazaar:boolean = false;
        let policyVersion:string = "";
        let currentPaymentKind:string = "original";

        if (params.shopItem) {
            shopData = params.shopData || LyActivityShop.getShopBuyData(params.shopItem);
            isDynamicBazaar = shopData.isDynamicBazaar === true;
            policyVersion = isDynamicBazaar ? String(shopData.policyVersion || "") : "";
            currentPaymentKind = LyActivityShop.normalizeBazaarPaymentKind(shopData.currentPaymentKind);
            isVoucherPurchase = !isDynamicBazaar && shopData.mode == 2;
            let costType = VarVal.bonusType.stone;
            if (isDynamicBazaar && currentPaymentKind == "money") {
                costType = VarVal.bonusType.money;
            } else if ((isDynamicBazaar && currentPaymentKind == "voucher") || isVoucherPurchase) {
                costType = VarVal.bonusType.chance;
            }
            let rewardCount = isDynamicBazaar ? shopData.unitItemCount : (isVoucherPurchase ? 100 : params.shopItem.count);
            let displayCost = isDynamicBazaar ? "0" : (isVoucherPurchase ? "1" : params.shopItem.stone);
            costBonuseItem = UtilsUI.getBonuseItem(costType, null, null, displayCost);
            if (!LocaleData.isItem(params.shopItem.itemId)) {
                let bonusType = LocaleData.getShopItemBonusType(params.shopItem.itemId);
                bonuseItem = UtilsUI.getBonuseItem(bonusType, null, null, rewardCount);
                have_count = GameServerData.getInstance().getValueTypeCount(bonusType);
            } else {
                bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, params.shopItem.itemId, rewardCount);
                have_count = GameServerData.getInstance().getItemCountByProtoId(bonuseItem.proto.id);
            }
            quality = bonuseItem.proto.quality;

            set_need = isDynamicBazaar ? 0 : (isVoucherPurchase ? 1 : shopData.dst_price);
            curr_coin = GameServerData.getInstance().getValueTypeCount(costType);
        } else {
            let shopBuy:ShopBuy = params.shopBuy;
            costBonuseItem = shopBuy.costBonuseItem;
            bonuseItem = shopBuy.bonuseItem;
            quality = bonuseItem.proto.quality;

            if (bonuseItem.type == VarVal.bonusType.item) {
                have_count = GameServerData.getInstance().getItemCountByProtoId(bonuseItem.proto.id);
            } else {
                have_count = GameServerData.getInstance().getValueTypeCount(bonuseItem.type);
            }
            set_need = shopBuy.set_need;
            if (costBonuseItem.type == VarVal.bonusType.item) {
                curr_coin = GameServerData.getInstance().getItemCountByProtoId(costBonuseItem.proto.id);
            } else {
                curr_coin = GameServerData.getInstance().getValueTypeCount(costBonuseItem.type);
            }
        }

        let slider_maxvalue:number = 0;

        let loader_title: fgui.GLoader = group_main.getChild("loader_title");
        loader_title.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}_title", [quality]);

        let label_name:fgui.GTextField = group_main.getChild("label_name");
        label_name.text = bonuseItem.name;
        label_name.strokeColor = UtilsUI.getQualityColor(quality);

        let group_item:fgui.GComponent = group_main.getChild("group_item");
        group_item.touchable = false;

        let label_have:fgui.GTextField = group_main.getChild("label_have");
        label_have.text = UtilsTool.stringFormat(StrVal.ACTIVITY_SHOPBUY.STR2, [have_count]);

        let label_desc:fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = bonuseItem.desc;

        let btn_sub:fgui.GButton = group_main.getChild("btn_sub");
        let label_num:fgui.GTextField = group_main.getChild("label_num");
        let slider_count:fgui.GSlider = group_main.getChild("slider_count");
        let btn_add:fgui.GButton = group_main.getChild("btn_add");
        let quantityInput:fgui.GTextInput = null;
        let btn_max:fgui.GGraph = null;
        let syncingQuantityInput:boolean = false;
        if (isDynamicBazaar) {
            let rowX = label_num.x + label_num.width / 2 - 115;
            let rowY = label_num.y;
            let rowHeight = Math.max(label_num.height, 36);
            label_num.visible = false;

            let quantityTitle = new fgui.GTextField();
            quantityTitle.name = "bazaar_count_title";
            quantityTitle.text = "数量：";
            quantityTitle.setPosition(rowX, rowY);
            quantityTitle.setSize(70, rowHeight);
            quantityTitle.fontSize = label_num.fontSize;
            quantityTitle.color = label_num.color;
            quantityTitle.align = HorizontalTextAlignment.RIGHT;
            quantityTitle.verticalAlign = VerticalTextAlignment.CENTER;
            quantityTitle.touchable = false;
            group_main.addChild(quantityTitle);

            let quantityInputBackground = new fgui.GGraph();
            quantityInputBackground.name = "bazaar_count_input_background";
            quantityInputBackground.setPosition(rowX + 75, rowY);
            quantityInputBackground.setSize(90, rowHeight);
            quantityInputBackground.drawRect(1, new Color(126, 78, 42, 255), new Color(255, 248, 220, 255), [5]);
            quantityInputBackground.touchable = false;
            group_main.addChild(quantityInputBackground);

            quantityInput = new fgui.GTextInput();
            quantityInput.name = "bazaar_count_input";
            quantityInput.setPosition(rowX + 75, rowY);
            quantityInput.setSize(90, rowHeight);
            quantityInput.fontSize = label_num.fontSize;
            quantityInput.color = new Color(90, 52, 30, 255);
            quantityInput.align = HorizontalTextAlignment.CENTER;
            quantityInput.verticalAlign = VerticalTextAlignment.CENTER;
            quantityInput.singleLine = true;
            quantityInput.maxLength = 10;
            quantityInput._editBox.inputMode = EditBox.InputMode.NUMERIC;
            group_main.addChild(quantityInput);

            btn_max = new fgui.GGraph();
            btn_max.name = "bazaar_btn_max";
            btn_max.setPosition(rowX + 175, rowY);
            btn_max.setSize(55, rowHeight);
            btn_max.drawRect(1, new Color(151, 84, 36, 255), new Color(210, 137, 55, 255), [5]);
            btn_max.touchable = true;
            group_main.addChild(btn_max);

            let labelMax = new fgui.GTextField();
            labelMax.name = "bazaar_label_max";
            labelMax.text = "最大";
            labelMax.setPosition(rowX + 175, rowY);
            labelMax.setSize(55, rowHeight);
            labelMax.fontSize = Math.max(label_num.fontSize - 2, 16);
            labelMax.color = new Color(255, 255, 255, 255);
            labelMax.align = HorizontalTextAlignment.CENTER;
            labelMax.verticalAlign = VerticalTextAlignment.CENTER;
            labelMax.touchable = false;
            group_main.addChild(labelMax);
        }
        
        let label_cost:fgui.GTextField = group_main.getChild("label_cost");
        let loader_icon:fgui.GLoader3D = group_main.getChild("loader_icon");
        let dynamicQuoteView:fgui.GComponent = null;
        if (isDynamicBazaar) {
            dynamicQuoteView = LyActivityShop.getOrCreateBazaarQuoteView(group_main, {
                name:"bazaar_dynamic_quote_view",
                x:30,
                y:345,
                width:380,
                height:50,
                fontSize:22,
                feedbackHeight:20,
            });
            loader_icon.visible = false;
            label_cost.visible = false;
        }
        let setCostStatus = (text:string, isEnough:boolean = true):void => {
            let color = isEnough ? label_cost.color : UtilsUI.getEnoughColor(false);
            if (dynamicQuoteView) {
                LyActivityShop.renderBazaarQuoteView(dynamicQuoteView, null, color, text);
            } else {
                label_cost.text = text;
                label_cost.color = color;
            }
        }
        let btn_buy:fgui.GButton = group_main.getChild("btn_buy");
        btn_buy.text = StrVal.ACTIVITY_SHOPBUY.STR5;
        if (costBonuseItem.type == VarVal.bonusType.item) {
            loader_icon.url = UtilsUI.getItemIconUrl(costBonuseItem.proto);
        } else {
            loader_icon.url = UtilsUI.getItemIconUrl(costBonuseItem.type);
        }

        let quoteRequestSequence = 0;
        let lastRequestedQuoteCount = -1;
        let quoteReady = !isDynamicBazaar;
        let policyMismatchLatched = false;

        let isPolicyVersionMismatch = (args:any):boolean => {
            if (!args) return false;
            if (args.bazaarError == "BAZAAR_POLICY_VERSION_MISMATCH") return true;
            return args.policyVersion != null
                && String(args.policyVersion).length > 0
                && String(args.policyVersion) != policyVersion;
        }

        let showBazaarRequestError = (args:any):void => {
            if (isPolicyVersionMismatch(args)) {
                policyMismatchLatched = true;
                quoteRequestSequence++;
                quoteReady = false;
                btn_buy.enabled = false;
                setCostStatus("配置已更新");
                UtilsUI.showMsgTip("坊市配置已更新，请重新登录");
                return;
            }
            UtilsUI.showMsgTip(formatBazaarError(args));
        }

        let updateRewardCount = (actualItems:number):void => {
            let displayCount = Math.max(Math.floor(Number(actualItems) || 0), 0);
            if (slider_count.value <= 0) {
                slider_count.value = 1;
            }
            let __bonuseItem:BonuseItem = {
                type: bonuseItem.type,
                proto: bonuseItem.proto,
                count: String(displayCount),
                name: bonuseItem.name,
                desc: bonuseItem.desc
            }
            UtilsUI.setUIGroupItem(__bonuseItem, group_item, null, true);
        }

        let requestDynamicQuote = (selectedCount:number):void => {
            if (!isDynamicBazaar) return;
            if (policyMismatchLatched) return;
            if (currentPaymentKind == "blocked") {
                quoteReady = false;
                btn_buy.enabled = false;
                setCostStatus("不可购买");
                return;
            }
            if (selectedCount == lastRequestedQuoteCount) return;
            lastRequestedQuoteCount = selectedCount;
            quoteReady = false;
            btn_buy.enabled = false;
            setCostStatus("报价中...");
            quoteRequestSequence++;
            let requestSequence = quoteRequestSequence;
            GameServer.getInstance().send((args:any) => {
                if (requestSequence !== quoteRequestSequence) return;
                if (isPolicyVersionMismatch(args)) {
                    showBazaarRequestError(args);
                    return;
                }
                if (args && args.errorcode == 0 && args.quote) {
                    let quote = args.quote;
                    let affordability = getBazaarQuoteAffordability(quote, {
                        money:Number(GameServerData.getInstance().getValueTypeCount(VarVal.bonusType.money)) || 0,
                        stone:Number(GameServerData.getInstance().getValueTypeCount(VarVal.bonusType.stone)) || 0,
                        voucher:Number(GameServerData.getInstance().getValueTypeCount(VarVal.bonusType.chance)) || 0,
                    });
                    let quoteColor = affordability.affordable
                        ? label_cost.color
                        : UtilsUI.getEnoughColor(false);
                    LyActivityShop.renderBazaarQuoteView(
                        dynamicQuoteView,
                        quote,
                        quoteColor,
                        "",
                        affordability.affordable ? "" : "货币不足"
                    );
                    updateRewardCount(Number(quote.actualItems));
                    quoteReady = affordability.affordable;
                    btn_buy.enabled = affordability.affordable;
                } else {
                    showBazaarRequestError(args);
                }
            }, "bazaarQuotePurchase", {
                id:Number(params.shopItem.id),
                num:selectedCount,
                policyVersion:policyVersion
            });
        }

        let syncQuantityInput = (count:number):void => {
            if (!quantityInput) return;
            let text = String(count);
            if (quantityInput.text == text) return;
            syncingQuantityInput = true;
            quantityInput.text = text;
            syncingQuantityInput = false;
        }

        let onValueChange:Function = () => {
            if (isDynamicBazaar) {
                slider_count.value = normalizeBazaarPurchaseCount(slider_count.value, slider_maxvalue);
                syncQuantityInput(slider_count.value);
            } else if (slider_count.value <= 0) {
                slider_count.value = 1;
            }
            let unitItemCount = isDynamicBazaar ? Number(shopData.unitItemCount) : Number(bonuseItem.count);
            updateRewardCount(unitItemCount * slider_count.value);
            label_num.text = UtilsTool.stringFormat(StrVal.ACTIVITY_SHOPBUY.STR4, [slider_count.value]);
            if (isDynamicBazaar) {
                if (policyMismatchLatched) return;
                requestDynamicQuote(slider_count.value);
            } else {
                let need = set_need * slider_count.value;
                label_cost.text = UtilsTool.stringFormat("{0}/{1}", [curr_coin, need]);
                label_cost.color = UtilsUI.getEnoughColor(need > 0 ? (curr_coin >= need) : true)
            }
        }

        let applySelectedCount = (rawValue:any):void => {
            let count = normalizeBazaarPurchaseCount(rawValue, slider_maxvalue);
            slider_count.value = count;
            syncQuantityInput(count);
            onValueChange();
        }

        slider_count.on(fgui.Event.STATUS_CHANGED, onValueChange);
        btn_sub.onClick(() => {
            if (slider_count.value > 1) {
                applySelectedCount(slider_count.value - 1);
            }
        })
        btn_add.onClick(() => {
            if (slider_count.value < slider_maxvalue) {
                applySelectedCount(slider_count.value + 1);
            }
        })
        if (quantityInput) {
            quantityInput.on(fgui.Event.TEXT_CHANGE, () => {
                if (syncingQuantityInput) return;
                let rawValue = String(quantityInput.text || "").trim();
                let digits = rawValue.replace(/\D/g, "");
                if (digits != rawValue) {
                    syncingQuantityInput = true;
                    quantityInput.text = digits;
                    syncingQuantityInput = false;
                }
                if (digits.length == 0) {
                    quoteRequestSequence++;
                    lastRequestedQuoteCount = -1;
                    quoteReady = false;
                    btn_buy.enabled = false;
                    setCostStatus("请输入数量");
                    return;
                }
                applySelectedCount(digits);
            });
            quantityInput.on(fgui.Event.Submit, () => {
                applySelectedCount(quantityInput.text);
            });
        }
        if (btn_max) {
            btn_max.onClick(() => {
                applySelectedCount(slider_maxvalue);
            });
        }

        // 初始化当前购买数量
        if (isDynamicBazaar) {
            slider_maxvalue = Math.max(Math.floor(Number(params.maxCount) || 0), 1);
        } else if (set_need > 0) {
            slider_maxvalue = Math.max(Math.floor(curr_coin / set_need), 1);
        } else {
            slider_maxvalue = params.maxCount;
        }
        slider_maxvalue = Math.min(slider_maxvalue, params.maxCount);
        slider_count.max = slider_maxvalue;
        slider_count.value = 1;
        if (quantityInput) {
            quantityInput.maxLength = Math.max(String(slider_maxvalue).length, 1);
        }
        onValueChange();

        btn_buy.onClick(() => {
            if (policyMismatchLatched) return;
            if (params.shopItem) {
                if (isDynamicBazaar && (!quoteReady || currentPaymentKind == "blocked")) return;
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (isDynamicBazaar && isPolicyVersionMismatch(args)) {
                        quoteReady = false;
                        btn_buy.enabled = false;
                        showBazaarRequestError(args);
                        return;
                    }
                    if (args.errorcode == 0) {
                        if (params.doneCall) {
                            params.doneCall(slider_count.value);
                        }
                        UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                        btn_back.fireClick();
                    } else {
                        if (isDynamicBazaar) showBazaarRequestError(args);
                        else UtilsUI.showMsgTip(args.errorcode);
                    }
                }, isDynamicBazaar ? "shopBuy" : (isVoucherPurchase ? "bazaarVoucherBuy" : "shopBuy"),
                isDynamicBazaar ? {
                    id:Number(params.shopItem.id),
                    num:slider_count.value,
                    policyVersion:policyVersion
                } : {
                    id:Number(params.shopItem.id),
                    num:slider_count.value
                });
            } else {
                if (params.doneCall) {
                    params.doneCall(slider_count.value);
                }
            }
        })
    }

    public getIsViewMask():boolean {
        return false;
    }
}

const BAZAAR_ERROR_MESSAGES:Record<string, string> = {
    BAZAAR_DISABLED: "该商品当前不可购买",
    BAZAAR_BLOCKED: "该商品已进入禁止购买阶梯",
    BAZAAR_PER_ORDER_LIMIT: "超过本次购买上限",
    BAZAAR_DAILY_LIMIT: "超过今日购买上限",
    BAZAAR_POLICY_INVALID: "坊市配置异常，请稍后重试",
    PARAM_ERROR: "购买数量无效",
};

function formatBazaarError(args:any):string | number {
    let code = args && typeof args.bazaarError == "string" ? args.bazaarError : "";
    return BAZAAR_ERROR_MESSAGES[code]
        || (args && Number.isFinite(Number(args.errorcode)) ? Number(args.errorcode) : -1);
}

export interface BazaarQuoteBalances {
    money:number,
    stone:number,
    voucher:number,
}

export interface BazaarQuoteAffordability {
    affordable:boolean,
    insufficientKinds:string[],
}

export function getBazaarQuoteAffordability(quote:any, balances:BazaarQuoteBalances):BazaarQuoteAffordability {
    let insufficientKinds:string[] = [];
    let valid = quote != null;
    let compare = (kind:string, rawCost:any, rawBalance:any):void => {
        let cost = Number(rawCost || 0);
        let balance = Number(rawBalance || 0);
        if (!Number.isFinite(cost) || cost < 0 || !Number.isFinite(balance)) {
            valid = false;
        } else if (cost > balance) {
            insufficientKinds.push(kind);
        }
    };
    compare("money", quote && quote.moneyCost, balances.money);
    compare("stone", quote && quote.stoneCost, balances.stone);
    compare("voucher", quote && quote.voucherCost, balances.voucher);
    return { affordable:valid && insufficientKinds.length == 0, insufficientKinds:insufficientKinds };
}

export function normalizeBazaarPurchaseCount(value:any, maxCount:any):number {
    let normalizedMaxCount = Math.max(Math.floor(Number(maxCount) || 0), 1);
    let count = Math.floor(Number(value));
    if (!Number.isFinite(count) || count < 1) count = 1;
    return Math.min(count, normalizedMaxCount);
}
