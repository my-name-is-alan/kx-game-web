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

        if (params.shopItem) {
            let shopData = LyActivityShop.getShopBuyData(params.shopItem);
            isVoucherPurchase = shopData.mode == 2;
            let costType = isVoucherPurchase ? VarVal.bonusType.chance : VarVal.bonusType.stone;
            let rewardCount = isVoucherPurchase ? 100 : params.shopItem.count;
            costBonuseItem = UtilsUI.getBonuseItem(costType, null, null, isVoucherPurchase ? "1" : params.shopItem.stone);
            if (!LocaleData.isItem(params.shopItem.itemId)) {
                let bonusType = LocaleData.getShopItemBonusType(params.shopItem.itemId);
                bonuseItem = UtilsUI.getBonuseItem(bonusType, null, null, rewardCount);
                have_count = GameServerData.getInstance().getValueTypeCount(bonusType);
            } else {
                bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, params.shopItem.itemId, rewardCount);
                have_count = GameServerData.getInstance().getItemCountByProtoId(bonuseItem.proto.id);
            }
            quality = bonuseItem.proto.quality;

            set_need = isVoucherPurchase ? 1 : shopData.dst_price;
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
        if (costBonuseItem.type == VarVal.bonusType.item) {
            loader_icon.url = UtilsUI.getItemIconUrl(costBonuseItem.proto);
        } else {
            loader_icon.url = UtilsUI.getItemIconUrl(costBonuseItem.type);
        }

        let onValueChange:Function = () => {
            if (slider_count.value <= 0) {
                slider_count.value = 1;
            }
            let __bonuseItem:BonuseItem = {
                type: bonuseItem.type,
                proto: bonuseItem.proto,
                count: String(Number(bonuseItem.count) * slider_count.value),
                name: bonuseItem.name,
                desc: bonuseItem.desc
            }
            UtilsUI.setUIGroupItem(__bonuseItem, group_item, null, true);
            label_num.text = UtilsTool.stringFormat(StrVal.ACTIVITY_SHOPBUY.STR4, [slider_count.value]);
            let need = set_need * slider_count.value;
            label_cost.text = UtilsTool.stringFormat("{0}/{1}", [curr_coin, need]);
            label_cost.color = UtilsUI.getEnoughColor(need > 0 ? (curr_coin >= need) : true)
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
        if (set_need > 0) {
            slider_maxvalue = Math.max(Math.floor(curr_coin / set_need), 1);
        } else {
            slider_maxvalue = params.maxCount;
        }
        slider_maxvalue = Math.min(slider_maxvalue, params.maxCount);
        slider_count.max = slider_maxvalue;
        slider_count.value = 1;
        onValueChange();

        let btn_buy:fgui.GButton = group_main.getChild("btn_buy");
        btn_buy.text = StrVal.ACTIVITY_SHOPBUY.STR5;
        btn_buy.onClick(() => {
            if (params.shopItem) {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        if (params.doneCall) {
                            params.doneCall(slider_count.value);
                        }
                        UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                        btn_back.fireClick();
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, isVoucherPurchase ? "bazaarVoucherBuy" : "shopBuy", {
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
