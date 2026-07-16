//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { BonuseItem, MonthCardType, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { GameServerData } from "../Kernel/GameServerData";
import { VarVal } from "../Values/VarVal";
import { StrVal } from "../Values/StrVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GuideManager } from "../Kernel/GuideManager";
import { LyActivityShop } from "./LyActivityShop";
import { LocaleData } from "../Kernel/LocaleData";
import { LyPayExquisite, PayExquisitePage } from "./LyPayExquisite";

export class LyGuideGetItem extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGuideDetail;
        this.viewResI.pkgName = "LyGuideDetail";
        this.viewResI.comName = "LyGuideGetItem";
    }

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGuideGetItem, 0, null);
        })
        
        let bonuseItem:BonuseItem = params.bonuseItem;
        let quality:string = bonuseItem.proto.quality;
        let have_count:number; // 当前拥有
        if (bonuseItem.type == VarVal.bonusType.item) {
            //神通
            if (LocaleData.isTheurgy(bonuseItem.proto.id)) {
                quality = String(Number(quality) + 1) 
                have_count = GameServerData.getInstance().getTheurgyByProto(bonuseItem.proto.id).frag
            }else if(LocaleData.isEliteMonsterDebris(bonuseItem.proto.id)){
                quality = String(Number(quality)) 
                let debrisInst = GameServerData.getInstance().getEliteMonsterDebByProtoId(bonuseItem.proto.id);
                if (debrisInst) {
                    have_count = debrisInst.count
                }else{
                    have_count = 0
                }
            }
            else{
                have_count = GameServerData.getInstance().getItemCountByProtoId(bonuseItem.proto.id);
            }
        } else {
            have_count = GameServerData.getInstance().getValueTypeCount(bonuseItem.type);
        }

        let loader_title: fgui.GLoader = group_main.getChild("loader_title");
        loader_title.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}_title", [quality]);

        let label_name:fgui.GTextField = group_main.getChild("label_name");
        label_name.text = bonuseItem.name;
        label_name.strokeColor = UtilsUI.getQualityColor(quality);

        let group_item:fgui.GComponent = group_main.getChild("group_item");
        group_item.touchable = false;
        bonuseItem.count = "";
        UtilsUI.setUIGroupItem(bonuseItem, group_item, null);

        let label_have:fgui.GTextField = group_main.getChild("label_have");
        label_have.text = UtilsTool.stringFormat(StrVal.ACTIVITY_SHOPBUY.STR2, [have_count]);

        let label_desc:fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = bonuseItem.desc;

        let label_tips:fgui.GTextField = group_main.getChild("label_tips");
        label_tips.text = StrVal.ACTIVITY_SHOPBUY.STR1;

        let label_warn:fgui.GTextField = group_main.getChild("label_warn");
        label_warn.text = StrVal.ACTIVITY_SHOPBUY.STR7;

        // 此处是proto里的字段，前往字段（或称为引导类型=即获取方式）
        let paramStr:string;
        if (bonuseItem.proto.getParam.length > 0 && bonuseItem.proto.getParam != "0") {
            paramStr = bonuseItem.proto.getParam;
        }
        let guideTypes:Array<string>;
        if (paramStr) {
            guideTypes = paramStr.split(",");
            label_warn.visible = false;
        } else {
            guideTypes = new Array<string>;
            label_warn.visible = true;
            label_warn.color = UtilsUI.getEnoughColor(false);
        }
        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            let getType = guideTypes[index];

            let label_name:fgui.GTextField = child.getChild("label_name");
            label_name.text = StrVal.GETITEM_NAMES[getType];

            let label_how:fgui.GTextField = child.getChild("label_how");
            label_how.text = StrVal.GETITEM_HOWS[getType];

            let btn_goto:fgui.GButton = child.getChild("btn_goto");
            btn_goto.onClick(() => {
                if (getType == VarVal.GUIDE_TYPE.ACTIVITY_SHOP) { // 不引导去坊市，而是直接弹出购买页面，或提示已售罄。
                    if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.SHOP)) {
                        UtilsUI.showMsgTip(StrVal.ACTIVITY_SHOPBUY.STR9);
                        return;
                    }
                    let shopItem;
                    let equalId:string;
                    if (bonuseItem.type == VarVal.bonusType.item) {
                        equalId = bonuseItem.proto.id;
                    } else {
                        equalId = LocaleData.getShopItemBonusShopType(bonuseItem.type);
                    }
                    let shopShows = LyActivityShop.getShopShows();
                    for (let i = 0; i < shopShows.length; i++) {
                        if (shopShows[i].itemId == equalId) {
                            shopItem = shopShows[i];
                            break;
                        }
                    }
                    // 存在售卖物品。
                    if (shopItem) {
                        let shopData = LyActivityShop.getShopBuyData(shopItem);
                        let call = () => {
                            if (params.buyCall) {
                                params.buyCall();
                            }
                            btn_back.fireClick();
                        }
                        if (shopData.buy_max <= 0) { // 不限制购买数量。
                            LyActivityShop.showLyActivityShopBuy(shopItem, shopData.buy_remain, call);
                        } else if (shopData.buy_remain <= 0) { // 售罄。
                            UtilsUI.showMsgTip(StrVal.ACTIVITY_SHOPBUY.STR3);
                        } else {
                            LyActivityShop.showLyActivityShopBuy(shopItem, shopData.buy_remain, call);
                        }
                    } else {
                        UtilsUI.showMsgTip(StrVal.ACTIVITY_SHOPBUY.STR6);
                    }
                } else if (getType == VarVal.GUIDE_TYPE.MONTH_CARD) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.MONTHCARD, type: MonthCardType.Life});
                    btn_back.fireClick();
                } else if (getType == VarVal.GUIDE_TYPE.DAILY_GIFT) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.GIFT_DAILY});
                    btn_back.fireClick();
                } else if (getType == VarVal.GUIDE_TYPE.LEI_TOTAL) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.LEITOTAL});
                    btn_back.fireClick();
                } else {
                    GuideManager.startGuide({
                        guideType: getType,
                    });
                }
            })
        }
        list_item.numItems = guideTypes.length;
    }

    public getIsViewMask():boolean {
        return false;
    }
}