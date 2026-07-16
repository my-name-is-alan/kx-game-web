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
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";

export class LyPayGiftDailyChooseSel extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPayRecharge;
        this.viewResI.pkgName = "LyPayRecharge";
        this.viewResI.comName = "LyPayGiftDailyChooseSel";
    }

    private optionIds:Array<string>;
    private selectIds:Array<string>;
    private startIndex:number;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let label_title:fgui.GTextField = group_main.getChild("label_title");
        label_title.text = StrVal.LYPAY_RECHARGE.STR307;

        this.optionIds = params.optionIds;
        this.selectIds = new Array<string>();
        for (let i = 0; i < params.selectIds.length; i++) {
            this.selectIds.push(params.selectIds[i]);
        }
        this.startIndex = params.startIndex;

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayGiftDailyChooseSel, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let btn_cancel:fgui.GButton = group_main.getChild("btn_cancel");
        btn_cancel.text = StrVal.COMMON.STR32;
        btn_cancel.onClick(() => {
            btn_back.fireClick();
        })

        let btn_confirm:fgui.GButton = group_main.getChild("btn_confirm");
        btn_confirm.text = StrVal.COMMON.STR33;
        btn_confirm.onClick(() => {
            params.callback(this.selectIds);
            btn_back.fireClick();
        })

        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            let selectId = this.selectIds[index];
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
            btn_frame.mode = fgui.ButtonMode.Check; // 选中才会显示选中框
            btn_frame.clearClick();
            btn_frame.onClick(() => {
                if (index != this.startIndex) {
                    this.setCurrShowGroup(index);
                }
            });
        }
        list_item.numItems = this.optionIds.length;
        this.setCurrShowGroup(this.startIndex);
    }

    private setCurrShowGroup(index:number): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let img_arrow = group_main.getChild("img_arrow", fgui.GImage);
        // 大选中状态。
        let list_item:fgui.GList = group_main.getChild("list_item");
        let childIdx = list_item.itemIndexToChildIndex(index);
        for (let i: number = 0; i < list_item.numChildren; i++) {
            let child: fgui.GComponent = list_item.getChildAt(i);
            let btn_frame:fgui.GButton = child.getChild("btn_frame");
            // btn_frame.enabled = (i != childIdx);
            btn_frame.selected = (i == childIdx);
            child.scaleX = child.scaleY = (i == childIdx ? 1.1 : 1);
            child.setPivot(0.5, 0.5);
            if (i == childIdx) {
                this._partner.callLater(() => { // 初始化的时候是x=0？疯了
                    img_arrow.x = list_item.node.getPosition().x
                    + list_item._container.getPosition().x
                    + child.node.getPosition().x
                    + child._container.getPosition().x
                    + child.width / 2;
                });
            }
        }
        this.startIndex = index;

        let chooseItems = LocaleData.getPayChooseItemsByGroup(this.optionIds[index]);
        // 小列表
        let list_choose = group_main.getChild("list_choose", fgui.GList);
        list_choose.itemRenderer = (idx:number, child:fgui.GComponent) => {
            let chooseItem = chooseItems[idx];

            let bItems = LocaleData.getPayChooseBonuseItems(chooseItem.id);
            UtilsUI.setUIGroupItem(bItems[0], child, null);

            // 设置按钮
            let btn_frame:fgui.GButton = child.getChild("btn_frame");
            btn_frame.mode = fgui.ButtonMode.Check; // 选中才会显示选中框
            btn_frame.clearClick();
            btn_frame.onClick(() => {
                this.selectIds[this.startIndex] = chooseItem.id;
                let nextIndex = this.startIndex + 1;
                if (nextIndex >= this.optionIds.length) {
                    nextIndex = 0;
                }
                list_item.numItems = this.optionIds.length;
                this.setCurrShowGroup(nextIndex);
            });
        }
        list_choose.numItems = chooseItems.length;

        let selIdx;
        let selItem;
        for (let iii = 0; iii < chooseItems.length; iii++) {
            if (this.selectIds[this.startIndex] == chooseItems[iii].id) {
                selIdx = iii;
                selItem = chooseItems[iii];
                break;
            }
        }

        // 小选中状态。
        let __childIdx = list_choose.itemIndexToChildIndex(selIdx);
        for (let i: number = 0; i < list_choose.numChildren; i++) {
            let child: fgui.GComponent = list_choose.getChildAt(i);
            let btn_frame:fgui.GButton = child.getChild("btn_frame");
            // btn_frame.enabled = (i != childIdx);
            btn_frame.selected = (i == __childIdx);
        }

        let label_name:fgui.GTextField = group_main.getChild("label_name");
        let label_desc:fgui.GTextField = group_main.getChild("label_desc");
        if (selItem) {
            let bItems = LocaleData.getPayChooseBonuseItems(selItem.id);
            label_name.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR305, [bItems[0].name, bItems[0].count]);
            label_desc.text = bItems[0].desc;
        } else {
            label_name.text = "";
            label_desc.text = "";
        }

        // 按钮是否灰色？
        let isGray = false;
        for (let iii = 0; iii < this.selectIds.length; iii++) {
            if (this.selectIds[iii].length == 0) {
                isGray = true;
                break;
            }
        }
        let btn_confirm:fgui.GButton = group_main.getChild("btn_confirm");
        btn_confirm.grayed = isGray;
        btn_confirm.enabled = !isGray;
    }

    public getIsViewMask():boolean {
        return false;
    }
}