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
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServer } from "../Kernel/GameServer";
import { LyBattleMain } from "./LyBattleMain";
import { LocaleUser } from "../Kernel/LocaleUser";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { AudioManager } from "../Kernel/AudioManager";
/*
export class LyPayFirstGift extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPayRecharge;
        this.viewResI.pkgName = "LyPayRecharge";
        this.viewResI.comName = "LyPayFirstGift";
    }

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let firstGiftItem = params.firstGiftItem;
        let bonuseItems = LocaleData.getPayChooseBonuseItemsByGroup(firstGiftItem.fixItems);

        let selectedIndex:number;
        if (firstGiftItem.money == "600") {
            selectedIndex = 0;
        } else if (firstGiftItem.money == "6800") {
            selectedIndex = 1;
        } else {
            selectedIndex = 2;
        }
        group_main.getController("c1").selectedIndex = selectedIndex;

        let label_desc:fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = StrVal.LYPAY_RECHARGE.STR102;

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayFirstGift, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
        }
        list_item.numItems = bonuseItems.length;

        let btn_pay:fgui.GButton = UtilsUI.setPayItemButtonName(group_main.getChild("btn_pay"), firstGiftItem);
        btn_pay.onClick(() => {
            UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            }, firstGiftItem, VarVal.payType.gift, VarVal.payGiftType.first);
        })
    }

    public onViewUpdate(params: any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let btn_pay:fgui.GButton = group_main.getChild("btn_pay");
        btn_pay.text = StrVal.LYPAY_RECHARGE.STR101;
        btn_pay.grayed = true;
        btn_pay.enabled = false;

        let firstGiftItem = LocaleData.getFirstGiftItem();
        if (firstGiftItem) {
            // 刷新一下为下一个首充礼包？
        }
    }

    public getIsViewMask():boolean {
        return false;
    }
}
*/
export class LyPayFirstGift extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPayFirstGift;
        this.viewResI.pkgName = "LyPayFirstGift";
        this.viewResI.comName = "LyPayFirstGift";
    }

    private selectedIdx:number;
    private firstPaySets:Array<any>;
    private moneyArray:Array<number>;
    private lastPaySet:any;
    private currPetId:string;

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayFirstGift, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let btn_play:fgui.GButton = group_main.getChild("btn_play");
        btn_play.text = StrVal.LYPAY_RECHARGE.STR105;
        btn_play.onClick(() => {
            let battleResult = LyBattleMain.createrBattleResultOneRound("1010", "1400101", "14001"); // this.currPetId
            LyBattleMain.showVirtualBattle(battleResult, VarVal.BATTLE_TYPE.PLAYVIRTUAL, null, true);
        })

        let label_desc:fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = StrVal.LYPAY_RECHARGE.STR102;

        this.firstPaySets = this.fillFirstPaySets();
        this.selectedIdx = 0;// this.firstPaySets.length - 1; 显示首挡
        this.refreshShowView();
    }

    private fillFirstPaySets(): Array<any> {
        let __sets = new Array<any>();
        // 归类
        let records:Array<any> = GameServerData.getInstance().getFirstPayItems(3);
        for (let i = 0; i < records.length; i++) {
            let newItem = records[i];
            let firstPayItems:Array<any>;
            for (let jjj = 0; jjj < __sets.length; jjj++) {
                if (newItem.money == __sets[jjj].money) {
                    firstPayItems = __sets[jjj].records;
                    break;
                }
            }
            if (firstPayItems) {
                firstPayItems.push(newItem);
            } else {
                firstPayItems = new Array<any>(newItem);
                __sets.push({
                    records: firstPayItems,
                    money: newItem.money
                });
            }
        }
        // 排序
        __sets.sort((itemA, itemB) => {
            return itemA.money - itemB.money;
        })
        if (!this.moneyArray) {
            this.moneyArray = new Array<number>();
            for (let i = 0; i < __sets.length; i++) {
                this.moneyArray.push(__sets[i].money);
            }
        }
        // 剔除已完成
        for (let i = __sets.length - 1; i >= 0; i--) {
            let isTakeDone = true;
            let firstPayItems:Array<any> = __sets[i].records;
            for (let jjj = 0; jjj < firstPayItems.length; jjj++) {
                if (firstPayItems[jjj].state != 2) {
                    isTakeDone = false;
                    break;
                }
            }
            if (isTakeDone) {
                __sets.splice(i, 1);
            } else {
                let preIdx = i - 1;
                if (preIdx >= 0 && __sets[preIdx].records[0].hasPay == 0) {
                    __sets.splice(i, 1);
                } else {
                    firstPayItems.sort((itemA, itemB) => {
                        return itemA.needDay - itemB.needDay;
                    })
                }
            }
        }
        return __sets;
    }

    private refreshShowView(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let paySet = this.firstPaySets[this.selectedIdx];
        if (!paySet) { // 防止最后一步领取消失时的显示。
            paySet = this.lastPaySet;
            // 原数据被替换对象了，这里手动设置一下。
            for (let i = 0; i < paySet.records.length; i++) {
                paySet.records[i].state = 2;
            }
        }
        this.lastPaySet = paySet;
        let firstRecord = paySet.records[0];
        let firstGiftItem = LocaleData.getPayGiftItem(firstRecord.id);

        let group_speed:fgui.GGroup = group_main.getChild("group_speed");
        group_speed.visible = false;
        for (let i = 0; i < this.moneyArray.length; i++) {
            if (this.moneyArray[i] == paySet.money) {
                group_main.getController("c1").selectedIndex = i;
                if (i == 0) {
                    group_speed.visible = true;
                }
            }
        }

        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            let record = paySet.records[index];
            let giftItem = LocaleData.getPayGiftItem(record.id)

            let label_day:fgui.GTextField = child.getChild("label_day");
            label_day.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR101, [record.needDay]);

            let label_level:fgui.GTextField = child.getChild("label_level");
            if (giftItem.takeLevel.length > 0) {
                label_level.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR103, [giftItem.takeLevel]);
            } else {
                label_level.text = "";
            }

            // 列表
            let bonuseItems = LocaleData.getPayChooseBonuseItemsByGroup(giftItem.fixItems);
            let list_goods:fgui.GList = child.getChild("list_item");
            list_goods.itemRenderer = (index:number, group_item:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
            }
            list_goods.numItems = bonuseItems.length;

            // 状态
            let label_lock:fgui.GTextField = child.getChild("label_lock");
            let ccc1 = child.getController("c1");
            if (record.hasPay == 0) {
                ccc1.selectedIndex = 0;
                label_lock.text = StrVal.LYPAY_RECHARGE.STR111;
            } else {
                if (record.state == 0) {
                    ccc1.selectedIndex = 0;
                    label_lock.text = StrVal.LYPAY_RECHARGE.STR112;
                } else if (record.state == 1) {
                    ccc1.selectedIndex = 1;
                    let btn_take:fgui.GButton = child.getChild("btn_take");
                    PointRedData.getInstance().updateManualPoint(btn_take, true);
                    btn_take.text = StrVal.LYPAY_RECHARGE.STR113;
                    btn_take.clearClick();
                    btn_take.onClick(() => {
                        UtilsUI.lockWait();
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait();
                            if (args.errorcode == 0) {
                                // 事件变化刷新本界面。
                            } else {
                                UtilsUI.showMsgTip(args.errorcode);
                            }
                        }, "takeFirstPayBonuses", {
                            id:record.id
                        });
                    })
                } else {
                    ccc1.selectedIndex = 2;
                    let label_done:fgui.GTextField = child.getChild("label_done");
                    label_done.text = StrVal.LYPAY_RECHARGE.STR114;
                }
            }
        }
        UtilsUI.setFguiGlistDelayNumItems(list_item, paySet.records.length);

        UtilsUI.setPayItemRebateComp(group_main.getChild("group_rebeatfan"), firstGiftItem);

        let img_paydone:fgui.GImage = group_main.getChild("img_paydone");
        let btn_pay:fgui.GButton = UtilsUI.setPayItemButtonName(group_main.getChild("btn_pay"), firstGiftItem);
        btn_pay.clearClick();
        btn_pay.onClick(() => {
            UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            }, firstGiftItem, VarVal.payType.gift, VarVal.payGiftType.first);
        })

        if (firstRecord.hasPay == 0) {
            btn_pay.visible = true;
            img_paydone.visible = false;
        } else {
            btn_pay.visible = false;
            img_paydone.visible = true;
        }

        // 选项组
        let list_group:fgui.GList = group_main.getChild("list_group");
        list_group.itemRenderer = (index:number, btn_frame:fgui.GButton) => {
            let data = this.firstPaySets[index];
            UtilsUI.setButtonIcon(btn_frame, VarVal.bonusType.chance, String(Number(data.money) / 100));
            btn_frame.getChild("img_paydone").visible = data.records[0].hasPay != 0;
            btn_frame.clearClick();
            btn_frame.onClick(() => {
                if (this.selectedIdx != index) {
                    this.selectedIdx = index;
                    this.refreshShowView();
                }
            })
            let isRed = false;
            for (let i = 0; i < data.records.length; i++) {
                if (data.records[i].state == 1) {
                    isRed = true;
                    break;
                }
            }
            PointRedData.getInstance().updateManualPoint(btn_frame, isRed);
        }
        list_group.numItems = this.firstPaySets.length;
        // 选项组
        let childIdx = list_group.itemIndexToChildIndex(this.selectedIdx);
        for (let i: number = 0; i < list_group.numChildren; i++) {
            let btn_frame: fgui.GButton = list_group.getChildAt(i);
            btn_frame.selected = (i == childIdx);
        }
        list_group.visible = this.firstPaySets.length > 1;

        // 装备
        let group_draw:fgui.GList = group_main.getChild("group_draw");
        let equipId:string;
        for (let jjj = 0; jjj < paySet.records.length; jjj++) {
            let record = paySet.records[jjj];
            let giftItem = LocaleData.getPayGiftItem(record.id);
            let bonuseItems = LocaleData.getPayChooseBonuseItemsByGroup(giftItem.fixItems);
            for (let i = 0; i < bonuseItems.length; i++) {
                if (bonuseItems[i].type == VarVal.bonusType.equip) {
                    equipId = bonuseItems[i].proto.id;
                } else if (bonuseItems[i].type == VarVal.bonusType.item && LocaleData.isPet(bonuseItems[i].proto.id)) {
                    this.currPetId = bonuseItems[i].proto.id;
                }
            }
        }
        UtilsUI.setUIGroupEquip(equipId, group_draw, null);
        let label_drop = group_draw.getChild("label_drop", fgui.GTextField);
        label_drop.text = firstGiftItem.desc;
    }

    public onViewUpdate(params: any): void {
        this.firstPaySets = this.fillFirstPaySets();
        if (this.selectedIdx >= this.firstPaySets.length) {
            this.selectedIdx = this.firstPaySets.length - 1;
        }
        this.refreshShowView();
    }

    public getIsViewMask():boolean {
        return false;
    }

    public static trySaveViewRedPointDay():void {
        let dateStr = UtilsTool.TimeToDateStr(GameServerData.getInstance().getServerTime());
        if (dateStr != LocaleUser.getUser(VarVal.FIELD_SV.PAY_FIRSTGIFTDAY)) {
            LocaleUser.setUser(VarVal.FIELD_SV.PAY_FIRSTGIFTDAY, dateStr);
            LocaleUser.flush();
            PointRedData.getInstance().updatePointChild(PointRedType.LyPayFirstGiftDay);
        }
    }

    /**
     * 尝试标记今天已经打开过首充（如果不用手动点击按钮，而弹出界面就算，那么放到界面生成时调用）
     */
    public static isViewRedPointDay():boolean {
        let firstGiftItem = GameServerData.getInstance().getFirstPayItems(1);
        if (firstGiftItem) {
            let dateStr = UtilsTool.TimeToDateStr(GameServerData.getInstance().getServerTime());
            if (dateStr != LocaleUser.getUser(VarVal.FIELD_SV.PAY_FIRSTGIFTDAY)) {
                return true;
            }
        }
        return false;
    }

    public static isViewRedPointGroup():boolean {
        let records:Array<any> = GameServerData.getInstance().getFirstPayItems(1);
        if (records) {
            for (let i = 0; i < records.length; i++) {
                if (records[i].state == 1) {
                    return true;
                }
            }
        }
        return false;
    }
}
