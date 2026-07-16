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
import { UtilsTool } from "../Kernel/UtilsTool";
import { SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { AudioManager } from "../Kernel/AudioManager";
import { PlatformAPI } from "../Kernel/PlatformAPI";

export class LyPayGiftGroup extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPayActivitys;
        this.viewResI.pkgName = "LyPayActivitys";
        this.viewResI.comName = "LyPayGiftGroup";
    }

    private timeCall:Function;
    private activeGroups:Array<any>;
    private pointIndex:number;

    private giftItems:Array<any>;
    private giftIndex:number;
    private lastTime:number;

    private spineRMPlayer:SpineRoldMountPlayer;

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayGiftGroup, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        this.spineRMPlayer = new SpineRoldMountPlayer(group_main.getChild("group_spine_ram"));

        let btn_arrowsmallL:fgui.GButton = group_main.getChild("btn_arrowsmallL");
        btn_arrowsmallL.visible = false;
        btn_arrowsmallL.onClick(() => {
            this.pointIndex--;
            if (this.pointIndex < 0) {
                this.pointIndex = this.activeGroups.length - 1;
            }
            this.refreshCurrGroup();
        })

        let btn_arrowsmallR:fgui.GButton = group_main.getChild("btn_arrowsmallR");
        btn_arrowsmallR.visible = false;
        btn_arrowsmallR.onClick(() => {
            this.pointIndex++;
            if (this.pointIndex >= this.activeGroups.length) {
                this.pointIndex = 0;
            }
            this.refreshCurrGroup();
        })

        let btn_arrowbigL:fgui.GButton = group_main.getChild("btn_arrowbigL");
        btn_arrowbigL.onClick(() => {
            /*
            this.giftIndex--;
            if (this.giftIndex < 0) {
                this.giftIndex = this.giftItems.length - 1;
            }
            this.refreshCurrPayItem();
            */
            btn_arrowsmallL.fireClick();
        })

        let btn_arrowbigR:fgui.GButton = group_main.getChild("btn_arrowbigR");
        btn_arrowbigR.onClick(() => {
            /*
            this.giftIndex++;
            if (this.giftIndex >= this.giftItems.length) {
                this.giftIndex = 0;
            }
            this.refreshCurrPayItem();
            */
            btn_arrowsmallR.fireClick();
        })

        let label_time:fgui.GButton = group_main.getChild("label_time");
        this.timeCall = () => {
            let remain = this.lastTime - GameServerData.getInstance().getServerTime();
            label_time.text = UtilsTool.stringFormat(StrVal.LYPAY_ACTIVITYS.STR101, [UtilsTool.splitTimeString(remain)]);
        }
        this.setInterval(this.timeCall, 1000);
        this.timeCall();

        let btn_pay:fgui.GButton = group_main.getChild("btn_pay");
        btn_pay.onClick(() => {
            UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            }, this.giftItems[this.giftIndex], VarVal.payType.gift, VarVal.payGiftType.giftgroup);
        })
        
        // 点列表
        let list_point:fgui.GList = group_main.getChild("list_point");
        list_point.itemRenderer = (index:number, btn_point:fgui.GButton) => {
            // let activeGroup = this.activeGroups[index];
            btn_point.clearClick();
            btn_point.onClick(() => {
                if (this.pointIndex != index) {
                    this.pointIndex = index;
                    this.refreshCurrGroup();
                }
            })
        }

        this.onViewUpdate(params);
    }

    public onViewUpdate(params: any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        // 新增、删除、修改
        this.activeGroups = LocaleData.getActiveGiftGroups();

        let btn_arrowbigL:fgui.GButton = group_main.getChild("btn_arrowbigL");
        btn_arrowbigL.visible = this.activeGroups.length > 1;
        let btn_arrowbigR:fgui.GButton = group_main.getChild("btn_arrowbigR");
        btn_arrowbigR.visible = btn_arrowbigL.visible;

        if (this.activeGroups.length > 0) {
            let list_point:fgui.GList = group_main.getChild("list_point");
            list_point.numItems = this.activeGroups.length;
            
            let group_point = group_main.getChild("group_point");
            group_point.visible = (this.activeGroups.length > 1);

            let contentWidth = list_point.getChildAt(0).width * (list_point.numItems + 2);
            let btn_arrowsmallL:fgui.GButton = group_main.getChild("btn_arrowsmallL");
            btn_arrowsmallL.x = (group_main.width - contentWidth) / 2;
            let btn_arrowsmallR:fgui.GButton = group_main.getChild("btn_arrowsmallR");
            btn_arrowsmallR.x = group_main.width - btn_arrowsmallL.x;

            if (params) {
                let giftItem = LocaleData.getPayGiftItem(params.giftId);
                for (let i = 0; i < this.activeGroups.length; i++) {
                    if (this.activeGroups[i].giftGroupId == giftItem.giftGroupId) {
                        this.pointIndex = i;
                        break;
                    }
                }
            }
            if (!this.pointIndex) {
                this.pointIndex = 0;
            }
            if (this.pointIndex >= this.activeGroups.length) {
                this.pointIndex = this.activeGroups.length - 1;
            }
            this.refreshCurrGroup();
        } else {
            // 关闭界面？
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayGiftGroup, 0, null);
        }
    }

    private refreshCurrGroup():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let list_point:fgui.GList = group_main.getChild("list_point");
        let childIdx = list_point.itemIndexToChildIndex(this.pointIndex);
        for (let i: number = 0; i < list_point.numChildren; i++) {
            let btn_frame: fgui.GButton = list_point.getChildAt(i);
            // btn_frame.enabled = (i != childIdx);
            btn_frame.selected = (i == childIdx);
        }

        let activeGroup = this.activeGroups[this.pointIndex];
        this.giftItems = activeGroup.giftItems;

        // 档次列表
        let list_group:fgui.GList = group_main.getChild("list_group");
        list_group.itemRenderer = (index:number, btn_switch:fgui.GButton) => {
            let giftItem = this.giftItems[index];
            let gift = GameServerData.getInstance().getPayGiftGroupRecord(giftItem.id);
            if (gift && gift.count >= Number(giftItem.buyCount)) {
                btn_switch.text = StrVal.LYPAY_ACTIVITYS.STR102;
            } else {
                UtilsUI.setPayItemButtonName(btn_switch, giftItem);
            }
            btn_switch.clearClick();
            btn_switch.onClick(() => {
                if (this.giftIndex != index) {
                    this.giftIndex = index;
                    this.refreshCurrPayItem();
                }
            })
        }
        list_group.numItems = activeGroup.giftItems.length;

        // let btn_arrowbigL:fgui.GButton = group_main.getChild("btn_arrowbigL");
        // btn_arrowbigL.visible = (activeGroup.giftItems.length > 1);
        // let btn_arrowbigR:fgui.GButton = group_main.getChild("btn_arrowbigR");
        // btn_arrowbigR.visible = (activeGroup.giftItems.length > 1);

        if (!this.giftIndex) {
            this.giftIndex = 0;
        }
        if (this.giftIndex >= this.giftItems.length) {
            this.giftIndex = this.giftItems.length - 1;
        }
        this.refreshCurrPayItem();
    }

    private refreshCurrPayItem():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let list_group:fgui.GList = group_main.getChild("list_group");
        let childIdx = list_group.itemIndexToChildIndex(this.giftIndex);
        for (let i: number = 0; i < list_group.numChildren; i++) {
            let btn_frame: fgui.GButton = list_group.getChildAt(i);
            // btn_frame.enabled = (i != childIdx);
            btn_frame.selected = (i == childIdx);
            UtilsUI.updateTabButtonColor(btn_frame, 2);
        }

        let giftItem = this.giftItems[this.giftIndex];
        let bonuseItems = LocaleData.getPayChooseBonuseItemsByGroup(giftItem.fixItems);

        let label_title:fgui.GTextField = group_main.getChild("label_title");
        label_title.text = giftItem.name;

        //giftItem.background = "6407";
        //giftItem.desc = "1100%,高额返利";

        let ttt:Array<string> = giftItem.desc.split(",");
        let label_desc:fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = ttt[0];
        let label_desc1:fgui.GTextField = group_main.getChild("label_desc1");
        label_desc1.text = ttt[1];

        let pic_book = group_main.getChild("pic_book");
        if (giftItem.background && giftItem.background.length > 0) {
            pic_book.visible = false;
            let group_spine_ram = group_main.getChild("group_spine_ram");
            let ttt = giftItem.background.split(",");
            if (ttt[1]) {
                group_spine_ram.setScale(Number(ttt[1]), Number(ttt[1]));
            }
            if (ttt[2]) {
                group_spine_ram.x = Number(ttt[2]);
            }
            if (ttt[3]) {
                group_spine_ram.y = Number(ttt[3]);
            }
            this.spineRMPlayer.loadSpineRole(LocaleData.getModelShowInfo(ttt[0]))//.loadSpineMount(mountInfo);
        } else {
            pic_book.visible = true;
            this.spineRMPlayer.loadSpineRole(null);
        }

        // 列表奖励
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
        }
        list_item.numItems = bonuseItems.length;

        let gift = GameServerData.getInstance().getPayGiftGroupRecord(giftItem.id);
        if (gift) {
            this.lastTime = gift.expiredTime;
        } else {
            this.lastTime = UtilsTool.getNextDateTime(GameServerData.getInstance().getServerTime() * 1000) / 1000;
        }
        this.timeCall();
        let btn_pay = UtilsUI.setPayItemButtonName(group_main.getChild("btn_pay"), giftItem);
        if (gift && gift.count >= Number(giftItem.buyCount)) {
            btn_pay.enabled = false;
        } else {
            btn_pay.enabled = true;
        }

        UtilsUI.setPayItemRebateComp(group_main.getChild("group_rebeatfan"), giftItem);
    }

    public static waitBattleGiftId:number;
    public static tryShowPayGiftGroupBattle():boolean {
        if (LyPayGiftGroup.waitBattleGiftId && !PlatformAPI.isBinaryExamine()) {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayGiftGroup, 0, {giftId:LyPayGiftGroup.waitBattleGiftId});
            LyPayGiftGroup.waitBattleGiftId = undefined;
            return true;
        }
        return false;
    }
    
    public getIsViewMask():boolean {
        return false;
    }
}