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
import { StrVal } from "../Values/StrVal";
import { GameServerData } from "../Kernel/GameServerData";
import { GameServer } from "../Kernel/GameServer";
import { Color } from "cc";
import { UtilsTool } from "../Kernel/UtilsTool";
import { LyPayFundPreview } from "./LyPayFundPreview";
import { LyPayAllEntry } from "./LyPayAllEntry";
import { SpinePlayer } from "../Kernel/SpinePlayer";

export class LyPayFunds extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPayFunds;
        this.viewResI.pkgName = "LyPayFunds";
        this.viewResI.comName = "LyPayFunds";
    }

    private payItem:any;
    private payOtherType:string;

    private currLevel:number;
    private isHaveRecharge:boolean;
    private awardId:number;
    private awardExtraId:number;

    private list_item:fgui.GList;
    private fundItems:Array<any>;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        this.payOtherType = params.payOtherType;

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayFunds, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let btn_preview:fgui.GButton = group_main.getChild("btn_preview");
        btn_preview.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayFundPreview, 0, {payOtherType:this.payOtherType});
        })

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
        }, group_main.getChild("loader_effect"), VarVal.UI_EFF_NAME.spine_qingdian_denglong);

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
        }, group_main.getChild("loader_effect3"), VarVal.UI_EFF_NAME.spine_qingdian_niao);

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
        }, group_main.getChild("loader_effect1"), VarVal.UI_EFF_NAME.spine_qingdian_saoguang);

        this.registerRequest((args) => {
            this.onViewUpdate(null);
            // 返还
            let rebate = UtilsUI.getRebateBonuseItems();
            if (rebate) {
                UtilsUI.showItemReward({rebateBonuseItems:rebate});
            }
        }, "payXyEventChanged");

        let controller = group_main.getController("c1");
        let label_tips:fgui.GTextField = group_main.getChild("label_tips");
        let label_desc1:fgui.GTextField = group_main.getChild("label_desc1");
        let label_desc2:fgui.GTextField = group_main.getChild("label_desc2");
        if (this.payOtherType == VarVal.payOtherType.fundxiuwei) {
            label_tips.text = StrVal.LYPAY_FUNDS.STR51;
            label_desc1.text = StrVal.LYPAY_FUNDS.STR52;
            label_desc2.text = StrVal.LYPAY_FUNDS.STR53;
            controller.selectedIndex = 0;
        } else if (this.payOtherType == VarVal.payOtherType.fundstage) {
            label_tips.text = StrVal.LYPAY_FUNDS.STR61;
            label_desc1.text = StrVal.LYPAY_FUNDS.STR62;
            label_desc2.text = StrVal.LYPAY_FUNDS.STR63;
            controller.selectedIndex = 1;
        } else if (this.payOtherType == VarVal.payOtherType.fundxianshu) {
            label_tips.text = StrVal.LYPAY_FUNDS.STR71;
            label_desc1.text = StrVal.LYPAY_FUNDS.STR72;
            label_desc2.text = StrVal.LYPAY_FUNDS.STR73;
            controller.selectedIndex = 2;
        } else if (this.payOtherType == VarVal.payOtherType.fundtower) {
            label_tips.text = StrVal.LYPAY_FUNDS.STR81;
            label_desc1.text = StrVal.LYPAY_FUNDS.STR82;
            label_desc2.text = StrVal.LYPAY_FUNDS.STR83;
            controller.selectedIndex = 3;
        }

        this.payItem = LocaleData.getPayItemByOtherType(this.payOtherType);
        let btn_pay:fgui.GButton = UtilsUI.setPayItemButtonName(group_main.getChild("btn_pay"), this.payItem);
        btn_pay.onClick(() => {
            UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            }, this.payItem, VarVal.payType.others, this.payOtherType);
        })

        let label_tab1:fgui.GTextField = group_main.getChild("label_tab1");
        label_tab1.text = StrVal.LYPAY_FUNDS.STR1;
        let label_tab2:fgui.GTextField = group_main.getChild("label_tab2");
        label_tab2.text = StrVal.LYPAY_FUNDS.STR2;

        let doSendGetReward = () => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString(args.bonusesResultArr)});
                    this.onViewUpdate(null);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "takeFundsBonuses", {
                id: Number(LocaleData.getFundRootByType(this.payOtherType).id),
                payOtherType:this.payOtherType // 协议维护中使用
            })
        }

        this.fundItems = LocaleData.getFundItemsByType(this.payOtherType);
        // 列表
        this.list_item = group_main.getChild("list_item", fgui.GList);
        this.list_item.setVirtual();
        this.list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let fundItem = this.fundItems[index];
            let needlevel = Number(fundItem.condition);

            let label_level:fgui.GTextField = group_item.getChild("label_level");
            if (this.payOtherType == VarVal.payOtherType.fundxiuwei) {
                label_level.text = UtilsTool.stringFormat(StrVal.LYPAY_FUNDS.STR54, [fundItem.condition]);
            } else if (this.payOtherType == VarVal.payOtherType.fundstage) {
                let stageItem = LocaleData.getStageItem(fundItem.condition);
                if (stageItem) {
                    label_level.text = UtilsTool.stringFormat(StrVal.LYPAY_FUNDS.STR64, [stageItem.chapter_id, stageItem.stage_id]);
                }
            } else if (this.payOtherType == VarVal.payOtherType.fundxianshu) {
                label_level.text = UtilsTool.stringFormat(StrVal.LYPAY_FUNDS.STR54, [fundItem.condition]);
            } else if (this.payOtherType == VarVal.payOtherType.fundtower) {
                let towerItem = LocaleData.getTowerItem(fundItem.condition);
                if (towerItem) {
                    label_level.text = UtilsTool.stringFormat(StrVal.LYPAY_FUNDS.STR64, [towerItem.tierID, towerItem.stageID]);
                }
            }

            let ggg_item = group_item.getChild("group_item", fgui.GComponent);
            this.playAnim(group_item, false);
            let img_dark:fgui.GGraph = ggg_item.getChild("img_dark");
            let img_check:fgui.GImage = ggg_item.getChild("img_check");
            if (Number(fundItem.id) <= this.awardId) {
                img_dark.visible = true;
                img_check.visible = true;
                UtilsUI.setUIGroupItem(UtilsUI.getBonuseItemsByBonusesId(fundItem.bonuseID)[0], ggg_item, null);
            } else {
                img_dark.visible = false;
                img_check.visible = false;
                if (this.currLevel >= needlevel) {
                    this.playAnim(group_item, true);
                    UtilsUI.setUIGroupItem(UtilsUI.getBonuseItemsByBonusesId(fundItem.bonuseID)[0], ggg_item, doSendGetReward);
                } else {
                    UtilsUI.setUIGroupItem(UtilsUI.getBonuseItemsByBonusesId(fundItem.bonuseID)[0], ggg_item, null);
                }
            }

            let bonuseItems = UtilsUI.getBonuseItemsByBonusesId(fundItem.extraBonuseID);
            // 列表
            let list_item:fgui.GList = group_item.getChild("list_item");
            list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                let ggg_item:fgui.GComponent = child.getChild("group_item");
                let img_lock:fgui.GImage = ggg_item.getChild("img_lock");
                let img_dark:fgui.GGraph = ggg_item.getChild("img_dark");
                let img_check:fgui.GImage = ggg_item.getChild("img_check");
                this.playAnim(child, false);
                if (this.isHaveRecharge) {
                    img_lock.visible = false;
                    if (Number(fundItem.id) <= this.awardExtraId) {
                        img_dark.visible = true;
                        img_check.visible = true;
                        UtilsUI.setUIGroupItem(bonuseItems[index], ggg_item, null);
                    } else {
                        img_dark.visible = false;
                        img_check.visible = false;
                        if (this.currLevel >= needlevel) {
                            // 摇晃
                            this.playAnim(child, true);
                            UtilsUI.setUIGroupItem(bonuseItems[index], ggg_item, doSendGetReward);
                        } else {
                            UtilsUI.setUIGroupItem(bonuseItems[index], ggg_item, null);
                        }
                    }
                } else {
                    img_lock.visible = true;
                    img_dark.visible = true;
                    img_check.visible = false;
                    UtilsUI.setUIGroupItem(bonuseItems[index], ggg_item, null);
                }
            }
            list_item.numItems = bonuseItems.length;

            let img_light:fgui.GImage = group_item.getChild("img_light");
            let img_gray:fgui.GImage = group_item.getChild("img_gray");
            if (needlevel <= this.currLevel) {
                img_light.visible = true;
                img_gray.visible = false;
            } else {
                img_light.visible = false;
                img_gray.visible = true;
            }

            let img_bar_gray:fgui.GImage = group_item.getChild("img_bar_gray");
            let img_bar_gray1:fgui.GImage = group_item.getChild("img_bar_gray1");
            let img_bar_light:fgui.GImage = group_item.getChild("img_bar_light");
            let img_bar_light1:fgui.GImage = group_item.getChild("img_bar_light1");

            if (this.currLevel > needlevel) {
                img_bar_gray.visible = false;
                img_bar_gray1.visible = false;
                img_bar_light.visible = true;
                img_bar_light1.visible = true;
            } else if (this.currLevel == needlevel) {
                img_bar_gray.visible = false;
                img_bar_gray1.visible = true;
                img_bar_light.visible = true;
                img_bar_light1.visible = false;
            } else {
                img_bar_gray.visible = true;
                img_bar_gray1.visible = true;
                img_bar_light.visible = false;
                img_bar_light1.visible = false;
                label_level.color = new Color(255,255,255);
            }
            if (index == 0) {
                img_bar_gray.visible = false;
                img_bar_light.visible = false;
            } else if (index == this.fundItems.length - 1) {
                img_bar_gray1.visible = false;
                img_bar_light1.visible = false;
            }
        }

        this.onViewUpdate(null);
    }

    public onViewUpdate(params:any):void {
        this.currLevel = GameServerData.getInstance().getFundLevel(this.payOtherType);
        let fundState = GameServerData.getInstance().getFundState(this.payOtherType);
        this.awardId = fundState.awardId;
        this.awardExtraId = fundState.awardExtraId;

        this.isHaveRecharge = GameServerData.getInstance().isHavePayRecharge(this.payItem.id);
        if (this.isHaveRecharge) {
            let uiPanel: fgui.GComponent = this.getUiPanel();
            let group_main:fgui.GComponent = uiPanel.getChild("group_main");
            let btn_pay:fgui.GButton = group_main.getChild("btn_pay");
            btn_pay.text = StrVal.LYPAY_ACTIVITYS.STR102;
            btn_pay.enabled = false;
        }

        this.list_item.numItems = this.fundItems.length;

        // 滚动到能领取
        let minIdx = -1;
        let finalFundItem = this.fundItems[this.fundItems.length - 1];
        if ((Number(finalFundItem.id) == this.awardId) && (Number(finalFundItem.id) == this.awardExtraId)) { // 全部已领取
            minIdx = this.fundItems.length - 1;
            // 入口消失
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayAllEntry, 0, null);
        } else {
            let takeIdx1 = -1;
            let takeIdx2 = -1;
            for (let idx = 0; idx < this.fundItems.length; idx++) {
                let fundItem = this.fundItems[idx];
                // 基础
                if (Number(fundItem.id) > this.awardId) { // 未领取
                    if (takeIdx1 < 0) {
                        takeIdx1 = idx;
                    }
                }
                // 额外
                if (this.isHaveRecharge) {
                    if (Number(fundItem.id) > this.awardExtraId) { // 未领取
                        if (takeIdx2 < 0) {
                            takeIdx2 = idx;
                        }
                    }
                }
            }
            if (takeIdx2 < 0) { // 仅计算基础的
                if (takeIdx1 >= 0) {
                    minIdx = takeIdx1;
                }
            } else if (takeIdx2 >= 0) {
                minIdx = Math.min(takeIdx1, takeIdx2)
            }
        }
        if (minIdx >= 0) {
            this.list_item.scrollToView(minIdx, true, true);
        }
    }

    private playAnim(com:fgui.GComponent, isPlay: boolean){
        if (isPlay) {
            com.getTransition("t0").play(null , -1)
        }else{
            com.getTransition("t0").stop()
        }
    }

    public getIsViewMask():boolean {
        return false;
    }

    /**
     * 获得基金状态（0无可领、1可领、2已全部领取、3未开启）
     */
    public static getFundState(payOtherType: string): number {
        if (GameServerData.getInstance().getPlayerFullInfo().base.level < Number(LocaleData.getFundRootByType(payOtherType).needLevel)) {
            return 3;
        }

        let fundState = GameServerData.getInstance().getFundState(payOtherType);
        let currLevel = GameServerData.getInstance().getFundLevel(payOtherType);
        let awardId = fundState.awardId;
        let awardExtraId = fundState.awardExtraId;

        let payItem = LocaleData.getPayItemByOtherType(payOtherType);
        let isHaveRecharge = GameServerData.getInstance().isHavePayRecharge(payItem.id);

        let fundItems = LocaleData.getFundItemsByType(payOtherType);
        let finalFundItem = fundItems[fundItems.length - 1];
        if ((Number(finalFundItem.id) == awardId) && (Number(finalFundItem.id) == awardExtraId)) { // 全部已领取
            return 2;
        } else {
            for (let idx = 0; idx < fundItems.length; idx++) {
                let fundItem = fundItems[idx];
                let needlevel = Number(fundItem.condition);
                // 基础
                if (Number(fundItem.id) > awardId) { // 未领取
                    if (currLevel >= needlevel) {
                        return 1;
                    }
                }
                // 额外
                if (isHaveRecharge) {
                    if (Number(fundItem.id) > awardExtraId) { // 未领取
                        if (currLevel >= needlevel) {
                            return 1;
                        }
                    }
                }
            }
        }
        return 0;
    }
}