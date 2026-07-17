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
        
        let label_cost:fgui.GTextField = group_main.getChild("label_cost");
        let loader_icon:fgui.GLoader3D = group_main.getChild("loader_icon");
        let dynamic_cost:fgui.GRichTextField = null;
        if (isDynamicBazaar) {
            dynamic_cost = new fgui.GRichTextField();
            dynamic_cost.name = "bazaar_dynamic_cost";
            dynamic_cost.setPosition(30, 345);
            dynamic_cost.setSize(380, 50);
            dynamic_cost.fontSize = 22;
            dynamic_cost.align = fgui.AlignType.Center;
            dynamic_cost.verticalAlign = fgui.VertAlignType.Middle;
            dynamic_cost.ubbEnabled = true;
            dynamic_cost.touchable = false;
            dynamic_cost.color = label_cost.color;
            group_main.addChild(dynamic_cost);
            loader_icon.visible = false;
            label_cost.visible = false;
        }
        let setCostText = (text:string):void => {
            if (dynamic_cost) dynamic_cost.text = text;
            else label_cost.text = text;
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
                setCostText("配置已更新");
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
                setCostText("不可购买");
                return;
            }
            if (selectedCount == lastRequestedQuoteCount) return;
            lastRequestedQuoteCount = selectedCount;
            quoteReady = false;
            btn_buy.enabled = false;
            setCostText("报价中...");
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
                    setCostText(LyActivityShop.formatBazaarQuoteRichText(quote));
                    updateRewardCount(Number(quote.actualItems));
                    quoteReady = true;
                    btn_buy.enabled = true;
                } else {
                    showBazaarRequestError(args);
                }
            }, "bazaarQuotePurchase", {
                id:Number(params.shopItem.id),
                num:selectedCount,
                policyVersion:policyVersion
            });
        }

        let onValueChange:Function = () => {
            if (slider_count.value <= 0) {
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
        slider_count.on(fgui.Event.STATUS_CHANGED, onValueChange);
        btn_sub.onClick(() => {
            if (slider_count.value > 1) {
                slider_count.value = slider_count.value - 1;
                onValueChange();
            }
        })
        btn_add.onClick(() => {
            if (slider_count.value < slider_maxvalue) {
                slider_count.value = slider_count.value + 1;
                onValueChange();
            }
        })

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
