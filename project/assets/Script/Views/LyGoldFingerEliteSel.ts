//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { VarVal } from "../Values/VarVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { StrVal } from "../Values/StrVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServer } from "../Kernel/GameServer";
import { LocaleData } from "../Kernel/LocaleData";

export class LyGoldFingerEliteSel extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.comName = "LyGoldFingerEliteSel";
    }

    levelItem:any;
    levelDatas:Array<any>
    itemInsts:Array<any>;
    lastSelect:number;
    selMaxNum:number;
    selCURNum:number;

    eliteProtos:Array<any>;
    dstProto:any;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        group_main.visible = true;
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGoldFingerEliteSel, 0, null);
        })

        let btn_close: fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_empty = group_main.getChild("label_empty", fgui.GTextField);
        label_empty.text = StrVal.LYGOLDFINGER.STR305;

        this.levelItem = params.levelItem;
        this.levelDatas = this.levelItem.data.split(",");
        this.itemInsts = GameServerData.getInstance().getEliteItemInstsByQuality(this.levelDatas[0]);

        group_main.getChild("group_empty").visible = (this.itemInsts.length == 0);

        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.setVirtual();
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            let itemInst = this.itemInsts[index];
            child.getChild("label_name", fgui.GTextField).text = itemInst.proto.name;
            let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, itemInst.proto.id, String(itemInst.count));
            let group_item = child.getChild("group_item", fgui.GComponent);
            UtilsUI.setUIGroupItem(bonuseItem, group_item, () => {
                if (this.lastSelect != index) {
                    this.setSelIndex(index);
                }
            }, true);
            let btn_frame:fgui.GButton = group_item.getChild("btn_frame");
            btn_frame.mode = fgui.ButtonMode.Check; // 选中才会显示选中框
            btn_frame.selected = (index == this.lastSelect);
        }
        UtilsUI.setFguiGlistDelayNumItems(list_item, this.itemInsts.length);

        let btn_sub:fgui.GButton = group_main.getChild("btn_sub");
        let slider_count:fgui.GSlider = group_main.getChild("slider_count");
        let btn_add:fgui.GButton = group_main.getChild("btn_add");

        slider_count.on(fgui.Event.STATUS_CHANGED, this.onValueChange, this);
        btn_sub.onClick(() => {
            if (slider_count.value > 1) {
                slider_count.value = slider_count.value - 1;
                this.onValueChange();
            }
        })
        btn_add.onClick(() => {
            if (slider_count.value < this.selMaxNum) {
                slider_count.value = slider_count.value + 1;
                this.onValueChange();
            }
        })
        // 初始化当前购买数量
        slider_count.max = 1;
        slider_count.min = 0;
        slider_count.value = 1;
        this.onValueChange();

        let btn_comfirm = group_main.getChild("btn_comfirm", fgui.GButton);
        btn_comfirm.text = StrVal.COMMON.STR33;
        btn_comfirm.onClick(() => {
            let itemInst = this.itemInsts[this.lastSelect];
            if (itemInst) {
                group_main.visible = false;
                this.changePage2();
            }
        })

        if (this.itemInsts.length > 0) {
            this.setSelIndex(0);
            this.initPage2();
            this.initPage3();
        } else {
            btn_comfirm.grayed = true;
            btn_comfirm.enabled = false;
        }
    }

    private onValueChange():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");

        let slider_count:fgui.GSlider = group_main.getChild("slider_count");
        let label_num:fgui.GTextField = slider_count.getChild("label_num");
        if (slider_count.value <= 0) {
            slider_count.value = 1;
        }
        this.selCURNum = slider_count.value;
        label_num.text = String(this.selCURNum);
    }

    private setSelIndex(index:number):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");

        this.lastSelect = index;

        // 大选中状态。
        let list_item:fgui.GList = group_main.getChild("list_item");
        let childIdx = list_item.itemIndexToChildIndex(index);
        for (let i: number = 0; i < list_item.numChildren; i++) {
            let child: fgui.GComponent = list_item.getChildAt(i);
            let group_item = child.getChild("group_item", fgui.GComponent);
            let btn_frame:fgui.GButton = group_item.getChild("btn_frame");
            btn_frame.mode = fgui.ButtonMode.Check; // 选中才会显示选中框
            btn_frame.selected = (i == childIdx);
        }

        let todayCanSel = LocaleData.getGoldFingerLevelItemMax(this.levelItem) - GameServerData.getInstance().getGoldFingerLevelItemCount(this.levelItem.functionType);
        let itemInst = this.itemInsts[index];
        this.selMaxNum = Math.min(itemInst.count, Math.max(1, todayCanSel));

        let slider_count:fgui.GSlider = group_main.getChild("slider_count");
        slider_count.max = this.selMaxNum;
        if (slider_count.value > slider_count.max) {
            slider_count.value = slider_count.max;
            this.onValueChange();
        }
    }

    private initPage2():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main2");

        let btn_close: fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGoldFingerEliteSel, 0, null);
        })

        let label_count = group_main.getChild("label_count", fgui.GTextField);
        let todayCanSel = LocaleData.getGoldFingerLevelItemMax(this.levelItem) - GameServerData.getInstance().getGoldFingerLevelItemCount(this.levelItem.functionType);
        label_count.text = UtilsTool.stringFormat(StrVal.LYGOLDFINGER.STR301, [todayCanSel]);

        let btn_comfirm = group_main.getChild("btn_comfirm", fgui.GButton);
        btn_comfirm.text = StrVal.COMMON.STR33;
        btn_comfirm.onClick(() => {
            let itemInst = this.itemInsts[this.lastSelect];
            if (!itemInst) {
                return UtilsUI.showMsgTip(StrVal.LYGOLDFINGER.STR304);
            }
            let protoId:number;
            if (this.levelDatas[1] == "0") {
                // 随机
            } else {
                if (this.dstProto) {
                    protoId = Number(this.dstProto.id);
                } else {
                    return UtilsUI.showMsgTip(StrVal.LYGOLDFINGER.STR304);
                }
            }

            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([{inserts:args.itemInserts}])});
                    btn_close.fireClick();
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "exchangeDebris", {
                id:itemInst.id,
                protoId:protoId,
                count:this.selCURNum
            });
        })
    }

    private changePage2():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main2");
        group_main.visible = true;

        let itemInst = this.itemInsts[this.lastSelect];
        if (this.dstProto && this.dstProto.id == itemInst.proto.id) {
            this.dstProto = undefined;
        }

        group_main.getChild("label_name", fgui.GTextField).text = itemInst.proto.name;
        let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, itemInst.proto.id, String(this.selCURNum));
        UtilsUI.setUIGroupItem(bonuseItem, group_main.getChild("group_item", fgui.GComponent), () => {
            group_main.visible = false;
            uiPanel.getChild("group_main").visible = true;
        }, true);

        if (this.levelDatas[1] == "0") {
            group_main.getChild("label_name2", fgui.GTextField).text = StrVal.LYGOLDFINGER.STR302;
            let bonuseItem2 = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, itemInst.proto.id, String(this.selCURNum));
            let group_item2:fgui.GComponent = group_main.getChild("group_item2", fgui.GComponent);
            UtilsUI.setUIGroupItem(bonuseItem2, group_item2, () => {
                // 无需操作
            }, true);
            group_item2.getChild("loader_icon", fgui.GLoader).url = "ui://LyGoldFinger/frame_suipianwenhao";
        } else {
            let group_item2:fgui.GComponent = group_main.getChild("group_item2", fgui.GComponent);
            let protoId:string;
            if (this.dstProto) {
                group_main.getChild("label_name2", fgui.GTextField).text = this.dstProto.name;
                protoId = this.dstProto.id;
            } else {
                group_main.getChild("label_name2", fgui.GTextField).text = StrVal.LYGOLDFINGER.STR303;
                protoId = itemInst.proto.id;
            }
            let bonuseItem2 = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, protoId, String(this.selCURNum));
            UtilsUI.setUIGroupItem(bonuseItem2, group_item2, () => {
                group_main.visible = false;
                uiPanel.getChild("group_main3").visible = true;

                this.eliteProtos = LocaleData.getEliteMonsterDebProtosByQuality(this.levelDatas[0], itemInst.proto.id);
                UtilsUI.setFguiGlistDelayNumItems(uiPanel.getChild("group_main3", fgui.GComponent).getChild("list_item"), this.eliteProtos.length);
            }, true);
            if (this.dstProto) {
            } else {
                group_item2.getChild("loader_icon", fgui.GLoader).url = "ui://LyGoldFinger/frame_jiahao";
            }
        }
    }

    private initPage3():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main3");

        if (this.levelDatas[1] != "0") {
            // 列表
            let list_item:fgui.GList = group_main.getChild("list_item");
            list_item.setVirtual();
            list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                let proto = this.eliteProtos[index];
                child.getChild("label_name", fgui.GTextField).text = proto.name;
                let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, proto.id, "0");
                UtilsUI.setUIGroupItem(bonuseItem, child.getChild("group_item", fgui.GComponent), () => {
                    // 大选中状态。
                    let childIdx = list_item.itemIndexToChildIndex(index);
                    for (let i: number = 0; i < list_item.numChildren; i++) {
                        let __child: fgui.GComponent = list_item.getChildAt(i);
                        let group_item = __child.getChild("group_item", fgui.GComponent);
                        let btn_frame:fgui.GButton = group_item.getChild("btn_frame");
                        btn_frame.mode = fgui.ButtonMode.Check; // 选中才会显示选中框
                        btn_frame.selected = (i == childIdx);
                    }

                    this.dstProto = proto;
                    group_main.visible = false;
                    this.changePage2();
                }, true);
            }
        }
    }

    public getIsViewMask():boolean {
        return false;
    }
}