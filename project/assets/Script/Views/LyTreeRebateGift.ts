//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { PointRedData } from "../Kernel/PointRedData";

export class LyTreeRebateGift extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyTreeRebate;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyTreeRebate;
        this.viewResI.comName = "LyTreeRebateGift";
    }

    private list_all:fgui.GList;
    private payItems:Array<any>;
    
    public onViewCreate(params:any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let btn_back = uiPanel.getChild("btn_back", fgui.GButton);
        btn_back.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTreeRebateGift, 0, null);
        })

        let btn_close = group_main.getChild("btn_close", fgui.GButton);
        btn_close.onClick(()=>{
            btn_back.fireClick();
        })

        let label_title: fgui.GTextField = group_main.getChild("label_title");
        label_title.text = StrVal.LYTREEREBATE.STR4;

        this.payItems = LocaleData.getPayGiftItemsByGroup(VarVal.GIFT_OTH_GROU.FANLI);

        // 列表
        this.list_all = group_main.getChild("list_all");
        this.list_all.setVirtual();
        this.list_all.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let giftItem = LocaleData.getPayGiftItem(this.payItems[index].id);

            let label_name:fgui.GTextField = group_item.getChild("label_name");
            label_name.text = giftItem.name;

            let bonuseItems = LocaleData.getPayChooseBonuseItemsByGroup(giftItem.fixItems);
            // 列表
            let list_item:fgui.GList = group_item.getChild("list_item");
            list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], child, null);
            }
            list_item.numItems = bonuseItems.length;

            let maxCount = Number(giftItem.buyCount);
            let buyCount = 0;
            let record = GameServerData.getInstance().getPayRebateGiftRecord(giftItem.id);
            if (record) {
                buyCount = record.count;
            }

            let label_count:fgui.GTextField = group_item.getChild("label_count");
            if (buyCount > 0) {
                label_count.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR302, [maxCount - buyCount, maxCount]);
                label_count.color = UtilsUI.getEnoughColor(maxCount - buyCount > 0);
            } else {
                label_count.text = UtilsTool.stringFormat(StrVal.LYTREEREBATE.STR5, [maxCount]);
                label_count.color = UtilsUI.getEnoughColor(false);
            }

            UtilsUI.setPayItemRebateComp(group_item.getChild("group_rebeatfan"), giftItem);

            let btn_buy:fgui.GButton = UtilsUI.setPayItemButtonName(group_item.getChild("btn_buy"), giftItem);
            PointRedData.getInstance().updateManualPoint(btn_buy, Number(giftItem.money) <= 0 && maxCount - buyCount > 0);
            btn_buy.clearClick();
            btn_buy.onClick(() => {
                UtilsUI.payRechargeItem((errmsg:string) => {
                    if (errmsg) {
                        UtilsUI.showMsgTip(errmsg);
                    }
                }, giftItem, VarVal.payType.gift, VarVal.payGiftType.rebateGift);
            })

            let group_done = group_item.getChild("group_done");
            if (maxCount - buyCount > 0) {
                btn_buy.visible = true;
                group_done.visible = false;
            } else {
                btn_buy.visible = false;
                group_done.visible = true;

                group_item.getChild("label_done", fgui.GTextField).text = StrVal.LYPAY_ACTIVITYS.STR102;
            }
        }

        let label_chance:fgui.GTextField = group_main.getChild("label_chance");
        label_chance.text = GameServerData.getInstance().getPlayerFullInfo().base.chance;
        this.registerRequest((args) => { // 事件后到了
            if (args.key == "chance" && args.isNewValue) {
                label_chance.text = GameServerData.getInstance().getPlayerFullInfo().base.chance;
            }
        }, "playerAttrChanged");

        this.registerRequest((args) => {
            this.sortListData();
        }, "rebateGiftChanged");
        this.sortListData();
    }

    private sortListData(): void {
        if (true) {
            let __datas:Array<any> = this.payItems;
            // 先按照id排序
            __datas.sort((itemA, itemB) => {
                return Number(itemB.id) - Number(itemA.id);
            })
            // 把已购买的插入末尾
            for (let i = __datas.length - 1; i >= 0; i--) {
                let giftItem = LocaleData.getPayGiftItem(__datas[i].id);
                let maxCount1 = Number(giftItem.buyCount);
                let buyCount1 = 0;
                let record1 = GameServerData.getInstance().getPayRebateGiftRecord(giftItem.id);
                if (record1) {
                    buyCount1 = record1.count;
                }
                if (maxCount1 - buyCount1 <= 0) {
                    let arr = __datas.splice(i, 1);
                    __datas.push(arr[0])
                }
            }

            UtilsUI.setFguiGlistDelayNumItems(this.list_all, this.payItems.length);
        }
    }

    public getIsViewMask(): boolean {
        return false;
    }

    public static isViewRedPoint():boolean {
        let payItems = LocaleData.getPayGiftItemsByGroup(VarVal.GIFT_OTH_GROU.FANLI);
        for (let i = 0; i < payItems.length; i++) {
            let giftItem = LocaleData.getPayGiftItem(payItems[i].id);
            if (Number(giftItem.money) <= 0) {
                let maxCount = Number(giftItem.buyCount);
                let buyCount = 0;
                let record = GameServerData.getInstance().getPayRebateGiftRecord(giftItem.id);
                if (record) {
                    buyCount = record.count;
                }
                if (maxCount - buyCount > 0) {
                    return true;
                }
            }
        }
        return false;
    }
}