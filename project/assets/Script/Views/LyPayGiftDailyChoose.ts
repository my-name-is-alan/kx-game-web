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
import { LyPayGiftDailyChooseSel } from "./LyPayGiftDailyChooseSel";
import { PointRedData } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { GameServer } from "../Kernel/GameServer";

export class LyPayGiftDailyChoose extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPayRecharge;
        this.viewResI.pkgName = "LyPayRecharge";
        this.viewResI.comName = "LyPayGiftDailyChoose";
    }

    private list_daily:fgui.GList;
    private payItems:Array<any>;

    private sendSelectIds:Array<number>;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayGiftDailyChoose, 0, null);
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

        this.payItems = LocaleData.getPayGiftDailyChooseItems();

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

            let selectIds:Array<string>;

            let maxCount = Number(giftItem.buyCount);
            let buyCount = 0;
            let record = GameServerData.getInstance().getPayDailyGiftChooseRecord(giftItem.id);
            if (record) {
                buyCount = record.count;
            }

            // 列表
            let list_item:fgui.GList = group_item.getChild("list_item");
            let group_choose:fgui.GGroup = group_item.getChild("group_choose");

            let solidItems = LocaleData.getPayChooseBonuseItemsByGroup(giftItem.fixItems);
            if (giftItem.optionItems.length > 0) { // 有选择样式
                list_item.visible = false;
                group_choose.visible = true;

                let optionIds:Array<string> = giftItem.optionItems.split(",");
                selectIds = new Array<string>();
                for (let i = 0; i < optionIds.length; i++) {
                    if (record && record.opItems && record.opItems.length > i) {
                        selectIds.push(String(record.opItems[i]));
                    } else {
                        selectIds.push("");
                    }
                }
                // 第一个
                UtilsUI.setUIGroupItem(solidItems[0], group_item.getChild("group_item", fgui.GComponent), null);

                // 选择列表
                let list_choose:fgui.GList = group_item.getChild("list_choose");
                list_choose.itemRenderer = (index:number, child:fgui.GComponent) => {
                    let selectId = selectIds[index];
                    if (selectId.length > 0) {
                        let bItems = LocaleData.getPayChooseBonuseItems(selectId);
                        UtilsUI.setUIGroupItem(bItems[0], child, null);
                    } else {
                        // 清空
                        UtilsUI.setUIGroupItem(null, child, null);
                        // 设置+号
                        let loader_icon:fgui.GLoader = child.getChild("loader_icon");
                        loader_icon.url = "ui://CCommon/icon_add";
                    }
                    // 设置按钮
                    let btn_frame:fgui.GButton = child.getChild("btn_frame");
                    btn_frame.clearClick();
                    btn_frame.onClick(() => {
                        if (maxCount - buyCount > 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayGiftDailyChooseSel, 0, {
                                optionIds:optionIds,
                                selectIds:selectIds,
                                startIndex:index,
                                callback:(ids:Array<string>) => {
                                    let nums = new Array<number>();
                                    for (let i = 0; i < ids.length; i++) {
                                        nums.push(Number(ids[i]));
                                    }
                                    UtilsUI.lockWait()
                                    GameServer.getInstance().send((args: any) => {
                                        UtilsUI.unlockWait()
                                        if (args.errorcode == 0) {
                                            list_choose.numItems = optionIds.length;
                                        } else {
                                            UtilsUI.showMsgTip(args.errorcode)
                                        }
                                    }, "setOptGiftItems", {
                                        giftId: Number(giftItem.id),
                                        opts: nums
                                    })
                                }
                            });
                        } else {
                            UtilsUI.showMsgTip(StrVal.LYPAY_RECHARGE.STR308);
                        }
                    });
                }
                list_choose.numItems = optionIds.length;
            } else { // 非选择样式
                list_item.visible = true;
                group_choose.visible = false;

                list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                    UtilsUI.setUIGroupItem(solidItems[index], child, null);
                }
                list_item.numItems = solidItems.length;
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
                this.sendSelectIds = new Array<number>();
                if (selectIds) {
                    for (let i = 0; i < selectIds.length; i++) {
                        if (selectIds[i].length == 0) {
                            UtilsUI.showMsgTip(StrVal.LYPAY_RECHARGE.STR306);
                            return;
                        } else {
                            this.sendSelectIds.push(Number(selectIds[i]));
                        }
                    }
                }
                UtilsUI.payRechargeItem((errmsg:string) => {
                    if (errmsg) {
                        UtilsUI.showMsgTip(errmsg);
                    }
                }, giftItem, VarVal.payType.gift, VarVal.payGiftType.dailychoose, this.sendSelectIds);
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
        this.sortListData();
    }

    public onViewUpdate(params: any): void {
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
                let record1 = GameServerData.getInstance().getPayDailyGiftChooseRecord(giftItem.id);
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
        let payItems = LocaleData.getPayGiftDailyChooseItems();
        for (let i = 0; i < payItems.length; i++) {
            let giftItem = LocaleData.getPayGiftItem(payItems[i].id);
            if (Number(giftItem.money) <= 0) {
                let maxCount = Number(giftItem.buyCount);
                let buyCount = 0;
                let record = GameServerData.getInstance().getPayDailyGiftChooseRecord(giftItem.id);
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