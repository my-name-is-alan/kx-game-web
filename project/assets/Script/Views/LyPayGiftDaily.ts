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
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { PointRedData } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";

export class LyPayGiftDaily extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPayRecharge;
        this.viewResI.pkgName = "LyPayRecharge";
        this.viewResI.comName = "LyPayGiftDaily";
    }

    private list_daily:fgui.GList;
    private payItems:Array<any>;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayGiftDaily, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
        }, group_main.getChild("loader_effect"), VarVal.UI_EFF_NAME.spine_qingdian_denglong);

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
        }, group_main.getChild("loader_effect3"), VarVal.UI_EFF_NAME.spine_qingdian_niao);

        let label_time:fgui.GButton = group_main.getChild("label_time");
        let timeCall = () => {
            let serverTime = GameServerData.getInstance().getServerTime() * 1000;
            let lastTime = UtilsTool.getNextDateTime(serverTime);
            let remain = lastTime - serverTime;
            label_time.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR8, [UtilsTool.splitTimeString(remain / 1000)]);
        }
        this.setInterval(timeCall, 1000);
        timeCall();

        this.payItems = LocaleData.getPayGiftDailyItems();

        // 列表
        this.list_daily = group_main.getChild("list_daily");
        this.list_daily.setVirtual();
        this.list_daily.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let giftItem = LocaleData.getPayGiftItem(this.payItems[index].id);

            let selectedIndex = 0;
            if (Number(giftItem.money) >= 12800) {
                selectedIndex = 2;
            } else if (Number(giftItem.money) >= 3000) {
                selectedIndex = 1;
            }
            group_item.getController("c1").selectedIndex = selectedIndex;

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
            let record = GameServerData.getInstance().getPayDailyGiftRecord(giftItem.id);
            if (record) {
                buyCount = record.count;
            }

            let label_count:fgui.GTextField = group_item.getChild("label_count");
            if (buyCount > 0) {
                label_count.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR302, [maxCount - buyCount, maxCount]);
                label_count.color = UtilsUI.getEnoughColor(maxCount - buyCount > 0);
            } else {
                label_count.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR301, [maxCount]);
                label_count.color = UtilsUI.getEnoughColor(true);
            }

            let btn_buy:fgui.GButton = UtilsUI.setPayItemButtonName(group_item.getChild("btn_buy"), giftItem);
            PointRedData.getInstance().updateManualPoint(btn_buy, Number(giftItem.money) <= 0 && maxCount - buyCount > 0);
            btn_buy.clearClick();
            btn_buy.onClick(() => {
                UtilsUI.payRechargeItem((errmsg:string) => {
                    if (errmsg) {
                        UtilsUI.showMsgTip(errmsg);
                    }
                }, giftItem, VarVal.payType.gift, VarVal.payGiftType.daily);
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

        this.onViewUpdate(null);
    }

    public onViewUpdate(params: any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let label_stone:fgui.GTextField = group_main.getChild("label_stone");
        label_stone.text = String(GameServerData.getInstance().getPlayerFullInfo().base.stone);

        this.sortListData();
    }

    private sortListData(): void {
        if (true) {
            let __datas:Array<any> = this.payItems;
            // 先按照id排序
            __datas.sort((itemA, itemB) => {
                return Number(itemA.id) - Number(itemB.id);
            })
            // 把已购买的插入末尾
            for (let i = __datas.length - 1; i >= 0; i--) {
                let giftItem = LocaleData.getPayGiftItem(__datas[i].id);
                let maxCount1 = Number(giftItem.buyCount);
                let buyCount1 = 0;
                let record1 = GameServerData.getInstance().getPayDailyGiftRecord(giftItem.id);
                if (record1) {
                    buyCount1 = record1.count;
                }
                if (maxCount1 - buyCount1 <= 0) {
                    let arr = __datas.splice(i, 1);
                    __datas.push(arr[0])
                }
            }

            UtilsUI.setFguiGlistDelayNumItems(this.list_daily, this.payItems.length);
        }
    }

    public getIsViewMask():boolean {
        return false;
    }

    public static isViewRedPoint():boolean {
        let payItems = LocaleData.getPayGiftDailyItems();
        for (let i = 0; i < payItems.length; i++) {
            let giftItem = LocaleData.getPayGiftItem(payItems[i].id);
            if (Number(giftItem.money) <= 0) {
                let maxCount = Number(giftItem.buyCount);
                let buyCount = 0;
                let record = GameServerData.getInstance().getPayDailyGiftRecord(giftItem.id);
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