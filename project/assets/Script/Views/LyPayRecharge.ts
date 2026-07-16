//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { GameServerData } from "../Kernel/GameServerData";
import { VarVal } from "../Values/VarVal";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { AudioManager } from "../Kernel/AudioManager";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { GameServer } from "../Kernel/GameServer";

export class LyPayRecharge extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPayRecharge;
        this.viewResI.pkgName = "LyPayRecharge";
        this.viewResI.comName = "LyPayRecharge";
    }

    public static lastPayItem:any; // 上次充值的购买项（充值档次、或礼包）在此保存吧，只是客户端模拟显示。

    private payShowType: string;
    private stoneItems:Array<any>;
    private baseChanceItems:Array<any>;
    private chanceItems:Array<any>;
    private voucherPricesReady:boolean = false;
    private voucherPricesLoading:boolean = false;
    private voucherPriceLoadFailed:boolean = false;
    private lastStone:number;
    private lastChance:number;

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayRecharge, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_tips:fgui.GTextField = group_main.getChild("label_tips");
        this.updateHdhiveTips();
        PlatformAPI.refreshHdhiveStatus((st: any) => {
            if (this.isDisposed) {
                return;
            }
            this.updateHdhiveTips();
            if (st && st.bound) {
                PlatformAPI.fetchHdhiveMe((_res: any) => {
                    if (!this.isDisposed) {
                        this.updateHdhiveTips();
                    }
                });
            }
        });
        label_tips.onClick(() => {
            if (!PlatformAPI.isHdhiveBound()) {
                PlatformAPI.startHdhiveBindFlow();
            } else {
                PlatformAPI.fetchHdhiveMe((res: any) => {
                    if (this.isDisposed) {
                        return;
                    }
                    this.updateHdhiveTips();
                    if (res && res.data && res.data.points != null) {
                        UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR9, [
                            PlatformAPI.getHdhivePointsCache(),
                        ]));
                    } else if (res && res.errmsg) {
                        UtilsUI.showMsgTip(res.errmsg);
                    }
                });
            }
        });

        let btn_stone:fgui.GButton = group_main.getChild("btn_stone");
        btn_stone.text = LocaleData.getItemProto(VarVal.bonusType.stone).name;
        btn_stone.onClick(() => {
            if (this.payShowType != VarVal.bonusType.stone) {
                this.onViewUpdate({type:VarVal.bonusType.stone, isClick:true});
            }
        })

        let btn_chance:fgui.GButton = group_main.getChild("btn_chance");
        btn_chance.text = LocaleData.getItemProto(VarVal.bonusType.chance).name;
        btn_chance.onClick(() => {
            if (this.payShowType != VarVal.bonusType.chance) {
                this.onViewUpdate({type:VarVal.bonusType.chance, isClick:true});
            }
        })

        let label_warn:fgui.GTextField = group_main.getChild("label_warn");
        label_warn.onClick(() => {
            if (this.payShowType == VarVal.bonusType.chance
                && !this.voucherPricesReady
                && !this.voucherPricesLoading) {
                this.queryVoucherPrices();
            }
        });

        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.setVirtual();
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            let back1:fgui.GImage = child.getChild("back1");
            back1.visible = this.payShowType != VarVal.bonusType.stone;
            let back2:fgui.GImage = child.getChild("back2");
            back2.visible = this.payShowType == VarVal.bonusType.stone;
            
            let showItem:any;
            if (this.payShowType == VarVal.bonusType.stone) {
                showItem = this.stoneItems[index];
            } else {
                showItem = this.chanceItems[index];
            }
            
            //let label_name:fgui.GTextField = child.getChild("label_name");
            //label_name.text = showItem.name;

            let loader_icon = child.getChild("loader_icon", fgui.GLoader);
            loader_icon.url = UtilsUI.getItemIconUrl(this.payShowType);

            let label_count:fgui.GTextField = child.getChild("label_count");
            label_count.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR4, [
                UtilsUI.getItemIconUrl(this.payShowType),
                showItem.value,
            ]);

            let label_rmb:fgui.GTextField = child.getChild("label_rmb");
            if (this.payShowType == VarVal.bonusType.chance) {
                label_rmb.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR3, [showItem.points]);
            } else {
                label_rmb.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR8, [String(Number(showItem.money) / 100)]);
            }

            // 是否首购？
            let group_double = child.getChild("group_double");
            group_double.visible = false;
            let group_give = child.getChild("group_give");
            group_give.visible = false;
            let img_nofirst:fgui.GImage = child.getChild("img_nofirst");
            let img_first:fgui.GImage = child.getChild("img_first");
            let label_give:fgui.GTextField = child.getChild("label_give");

            let givstone:string;
            if (this.payShowType == VarVal.bonusType.stone) {
                if (GameServerData.getInstance().isHavePayRecharge(showItem.id)) {
                    givstone = String(showItem.data2 || "");
                } else {
                    givstone = String(showItem.data1 || "");
                }
            } else {
                if (GameServerData.getInstance().isHavePayRecharge(showItem.id)) {
                    givstone = "";
                } else {
                    givstone = String(showItem.data2 || "");
                }
            }
            if (givstone.length > 0) {
                if (this.payShowType == VarVal.bonusType.stone) {
                    if (GameServerData.getInstance().isHavePayRecharge(showItem.id)) { // 再充送
                        img_nofirst.visible = true;
                        img_first.visible = false;
                        group_give.visible = true;
                        label_give.text = givstone;
                    } else {
                        if (givstone == showItem.value) { // 首充双倍
                            group_double.visible = true;
                        } else { // 首充送
                            img_nofirst.visible = false;
                            img_first.visible = true;
                            group_give.visible = true;
                            label_give.text = givstone;
                        }
                    }
                } else { // 首充送
                    img_nofirst.visible = false;
                    img_first.visible = true;
                    group_give.visible = true;
                    label_give.text = givstone;
                }
            }

            let graph_back:fgui.GGraph = child.getChild("graph_back");
            graph_back.clearClick();
            graph_back.onClick(() => {
                let payType = VarVal.payType.chance;
                if (this.payShowType == VarVal.bonusType.stone) {
                    payType = VarVal.payType.stone;
                    this.lastStone = Number(showItem.value);
                    if (givstone.length > 0) {
                        this.lastStone += Number(givstone);
                    }
                } else {
                    if (!this.voucherPricesReady) {
                        UtilsUI.showMsgTip(this.voucherPricesLoading
                            ? StrVal.LYPAY_RECHARGE.STR6
                            : StrVal.LYPAY_RECHARGE.STR7);
                        if (!this.voucherPricesLoading) {
                            this.queryVoucherPrices();
                        }
                        return;
                    }
                }
                UtilsUI.payRechargeItem((errmsg:string) => {
                    if (errmsg) {
                        UtilsUI.showMsgTip(errmsg);
                    } else if (payType == VarVal.payType.chance) {
                        this.lastChance = Number(showItem.value);
                        if (givstone.length > 0) {
                            this.lastStone = Number(givstone);
                        }
                        this.onViewUpdate(null);
                    }
                }, showItem, payType, null);
            })
        }

        this.stoneItems = LocaleData.getPayItemsByType(VarVal.payType.stone);
        this.baseChanceItems = LocaleData.getPayItemsByType(VarVal.payType.chance);
        this.chanceItems = [];
        this.payShowType = VarVal.bonusType.stone;
        this.onViewUpdate({
            type: params && params.type != null ? params.type : VarVal.bonusType.stone,
            isClick: true,
        });
    }

    public onViewShow(params:any, isCreate:boolean):void {
        super.onViewShow(params, isCreate);
        if (!isCreate) {
            this.updateHdhiveTips();
        }
        if (!isCreate && params && params.type != null
            && this.normalizePayShowType(params.type) != this.payShowType) {
            this.onViewUpdate(params);
        }
    }

    private updateHdhiveTips():void {
        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        let label_tips:fgui.GTextField = group_main.getChild("label_tips");
        if (!label_tips || label_tips.isDisposed) {
            return;
        }

        let isBound = PlatformAPI.isHdhiveBound();
        let bindTip = isBound ? StrVal.LYSETTING.STR50 : StrVal.LYSETTING.STR51;
        label_tips.text = StrVal.LYPAY_RECHARGE.STR1 + "  |  " + bindTip;
        if (isBound) {
            label_tips.text += "  |  " + UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR9, [
                PlatformAPI.getHdhivePointsCache(),
            ]);
        }
    }

    private normalizePayShowType(type:any):string {
        let value = String(type);
        if (value == VarVal.bonusType.chance || value == VarVal.payType.chance) {
            return VarVal.bonusType.chance;
        }
        return VarVal.bonusType.stone;
    }

    private mergeVoucherPrices(prices:Array<any>):Array<any> {
        let staticItems:{[id:string]:any} = {};
        for (let i = 0; i < this.baseChanceItems.length; i++) {
            staticItems[String(this.baseChanceItems[i].id)] = this.baseChanceItems[i];
        }

        let seen:{[id:string]:boolean} = {};
        let merged:Array<any> = [];
        for (let i = 0; i < prices.length; i++) {
            let row = prices[i];
            let id = Number(row && row.id);
            let points = Number(row && row.points);
            let chance = Number(row && row.chance);
            let money = Number(row && row.money);
            let firstStone = Number(row && row.first_stone);
            let key = String(id);
            let baseItem = staticItems[key];
            let valid = id > 0 && id == Math.floor(id)
                && points > 0 && points <= 100000 && points == Math.floor(points)
                && chance == points * 10
                && money == points * 1000
                && firstStone == points * 100;
            if (!valid || !baseItem || seen[key]) {
                continue;
            }

            let item:any = {};
            for (let field in baseItem) {
                if (Object.prototype.hasOwnProperty.call(baseItem, field)) {
                    item[field] = baseItem[field];
                }
            }
            item.id = String(id);
            item.type = VarVal.payType.chance;
            item.points = points;
            item.value = String(chance);
            item.money = String(money);
            item.data2 = String(firstStone);
            seen[key] = true;
            merged.push(item);
        }
        return merged;
    }

    private queryVoucherPrices():void {
        if (this.voucherPricesLoading) {
            return;
        }
        this.voucherPricesReady = false;
        this.voucherPricesLoading = true;
        this.voucherPriceLoadFailed = false;
        this.chanceItems = [];
        this.onViewUpdate(null);

        GameServer.getInstance().send((args:any) => {
            if (this.isDisposed) {
                return;
            }
            this.voucherPricesLoading = false;
            if (!args || args.errorcode != 0) {
                this.voucherPricesReady = false;
                this.voucherPriceLoadFailed = true;
                this.chanceItems = [];
                this.onViewUpdate(null);
                return;
            }

            let prices = Array.isArray(args.prices) ? args.prices : [];
            let items = this.mergeVoucherPrices(prices);
            if (items.length == 0) {
                this.voucherPricesReady = false;
                this.voucherPriceLoadFailed = true;
                this.chanceItems = [];
            } else {
                this.voucherPricesReady = true;
                this.voucherPriceLoadFailed = false;
                this.chanceItems = items;
            }
            this.onViewUpdate(null);
        }, "queryHdhiveVoucherPrices", {});
    }

    public onViewUpdate(params: any): void { // 在属性事件中要刷新界面
        let shouldQueryVoucherPrices = false;
        if (params && params.type != null) {
            this.payShowType = this.normalizePayShowType(params.type);
            shouldQueryVoucherPrices = this.payShowType == VarVal.bonusType.chance;
        }
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        this.updateHdhiveTips();
        let base = GameServerData.getInstance().getPlayerFullInfo().base;

        let back1:fgui.GImage = group_main.getChild("back1");
        let paster1:fgui.GImage = group_main.getChild("paster1");
        paster1.visible = back1.visible = this.payShowType != VarVal.bonusType.stone;
        let back2:fgui.GImage = group_main.getChild("back2");
        let paster2:fgui.GImage = group_main.getChild("paster2");
        paster2.visible = back2.visible = this.payShowType == VarVal.bonusType.stone;

        let loader_icon = group_main.getChild("loader_icon", fgui.GLoader);
        loader_icon.url = UtilsUI.getItemIconUrl(this.payShowType);

        let btn_stone:fgui.GButton = group_main.getChild("btn_stone");
        btn_stone.selected = this.payShowType == VarVal.bonusType.stone;
        let btn_chance:fgui.GButton = group_main.getChild("btn_chance");
        btn_chance.selected = this.payShowType != VarVal.bonusType.stone;

        let label_stone:fgui.GTextField = group_main.getChild("label_stone");
        let list_item:fgui.GList = group_main.getChild("list_item");
        let label_warn:fgui.GTextField = group_main.getChild("label_warn");
        if (this.payShowType == VarVal.bonusType.stone) {
            label_stone.text = base.stone;
            // 首充标志刷新。
            UtilsUI.setFguiGlistDelayNumItems(list_item, this.stoneItems.length);
            label_warn.text = "";
        } else {
            label_stone.text = base.chance;
            UtilsUI.setFguiGlistDelayNumItems(list_item,
                this.voucherPricesReady ? this.chanceItems.length : 0);
            if (this.voucherPricesLoading) {
                label_warn.text = StrVal.LYPAY_RECHARGE.STR6;
            } else if (this.voucherPriceLoadFailed || !this.voucherPricesReady) {
                label_warn.text = StrVal.LYPAY_RECHARGE.STR7;
            } else {
                label_warn.text = StrVal.LYPAY_RECHARGE.STR2;
            }
        }

        if (params && params.isClick) {
            this.lastStone = undefined;
            this.lastChance = undefined;
        }
        // 虚拟获得奖励弹窗
        let bonuseStone;
        let bonuseChance;
        if (this.lastStone) {
            bonuseStone = UtilsUI.getBonuseItem(VarVal.bonusType.stone, null, null, String(this.lastStone));
            this.lastStone = undefined;
        }
        if (this.lastChance) {
            bonuseChance = UtilsUI.getBonuseItem(VarVal.bonusType.chance, null, null, String(this.lastChance));
            this.lastChance = undefined;
        }
        if (bonuseStone || bonuseChance) {
            let bonuseItems = [];
            if (bonuseChance) {
                bonuseItems.push(bonuseChance);
            }
            if (bonuseStone) {
                bonuseItems.push(bonuseStone);
            }
            UtilsUI.showItemReward({
                bonuseItems:bonuseItems,
                rebateBonuseItems:UtilsUI.getRebateBonuseItems()
            });
        }

        if (shouldQueryVoucherPrices) {
            this.queryVoucherPrices();
        }
    }

    public getIsViewMask():boolean {
        return false;
    }
}
