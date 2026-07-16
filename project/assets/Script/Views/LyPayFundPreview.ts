//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { VarVal } from "../Values/VarVal";
import { LocaleData } from "../Kernel/LocaleData";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { StrVal } from "../Values/StrVal";
import { UtilsTool } from "../Kernel/UtilsTool";

export class LyPayFundPreview extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPayFunds;
        this.viewResI.pkgName = "LyPayFunds";
        this.viewResI.comName = "LyPayFundPreview";
    }

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayFundPreview, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_title:fgui.GTextField = group_main.getChild("label_title");
        label_title.text = StrVal.LYPAY_FUNDS.STR3;

        let showItems:Array<BonuseItem> = new Array<BonuseItem>();
        let fundItems = LocaleData.getFundItemsByType(params.payOtherType);
        for (let i = 0; i < fundItems.length; i++) {
            let bonuseItems = UtilsUI.getBonuseItemsByBonusesId(fundItems[i].extraBonuseID);
            for (let j = 0; j < bonuseItems.length; j++) {
                let hitItem:BonuseItem;
                let bonuseItem = bonuseItems[j];
                for (let k = 0; k < showItems.length; k++) {
                    if (bonuseItem.type == showItems[k].type) {
                        if (bonuseItem.type == VarVal.bonusType.item) {
                            if (bonuseItem.proto.id == showItems[k].proto.id) {
                                hitItem = showItems[k];
                                break;
                            }
                        } else {
                            hitItem = showItems[k];
                            break;
                        }
                    }
                }
                if (hitItem) {
                    hitItem.count = String(Number(hitItem.count) + Number(bonuseItem.count))
                } else {
                    showItems.push(bonuseItem);
                }
            }
        }
        // 列表
        let list_item = group_main.getChild("list_item", fgui.GList);
        list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let bonuseItem = showItems[index];
            
            let label_count:fgui.GTextField = group_item.getChild("label_count");
            label_count.text = UtilsTool.stringFormat(StrVal.LYPAY_FUNDS.STR4, [bonuseItem.name, bonuseItem.count]);

            bonuseItem.count = "";
            let ggg_item = group_item.getChild("group_item", fgui.GComponent);
            UtilsUI.setUIGroupItem(bonuseItem, ggg_item, null);
        }
        list_item.numItems = showItems.length;
    }

    public getIsViewMask():boolean {
        return false;
    }
}