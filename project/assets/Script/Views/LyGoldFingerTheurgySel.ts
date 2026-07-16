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
import { LyTheurgyReward } from "./LyTheurgyReward";

export class LyGoldFingerTheurgySel extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.comName = "LyGoldFingerTheurgySel";
    }

    levelItem:any;
    levelDatas:Array<any>
    itemInsts:Array<any>;
    lastSelect:number;
    selMaxNum:number;
    selCURNum:number;

    theurgyProtos:Array<any>;
    dstProto:any;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        group_main.visible = true;
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGoldFingerTheurgySel, 0, null);
        })

        let btn_close: fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_empty = group_main.getChild("label_empty", fgui.GTextField);
        label_empty.text = StrVal.LYGOLDFINGER.STR305;

        this.levelItem = params.levelItem;
        this.levelDatas = this.levelItem.data.split(",");
        this.itemInsts = GameServerData.getInstance().getTheurgyFragInstsByQuality(this.levelDatas[0]);

        group_main.getChild("group_empty").visible = (this.itemInsts.length == 0);

        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.setVirtual();
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            let itemInst = this.itemInsts[index];

            let group_item = child.getChild("main", fgui.GComponent);
            this.setGroupCompItem(group_item, itemInst.proto, itemInst.count);

            let btn_frame:fgui.GButton = group_item.getChild("btn_frame");
            btn_frame.mode = fgui.ButtonMode.Check; // 选中才会显示选中框
            btn_frame.selected = (index == this.lastSelect);
            btn_frame.clearClick();
            btn_frame.onClick(() => {
                if (this.lastSelect != index) {
                    this.setSelIndex(index);
                }
            })
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
            let group_item = child.getChild("main", fgui.GComponent);
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
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGoldFingerTheurgySel, 0, null);
        })

        let label_count = group_main.getChild("label_count", fgui.GTextField);
        let todayCanSel = LocaleData.getGoldFingerLevelItemMax(this.levelItem) - GameServerData.getInstance().getGoldFingerLevelItemCount(this.levelItem.functionType);
        label_count.text = UtilsTool.stringFormat(StrVal.LYGOLDFINGER.STR301, [todayCanSel]);

        let btn_comfirm = group_main.getChild("btn_comfirm", fgui.GButton);
        btn_comfirm.text = StrVal.COMMON.STR33;
        btn_comfirm.onClick(() => {
            let itemInst = this.itemInsts[this.lastSelect];
            if (!itemInst) {
                return UtilsUI.showMsgTip(StrVal.LYGOLDFINGER.STR601);
            }
            let protoId:number;
            if (this.levelDatas[1] == "0") {
                // 随机
            } else {
                if (this.dstProto) {
                    protoId = Number(this.dstProto.id);
                } else {
                    return UtilsUI.showMsgTip(StrVal.LYGOLDFINGER.STR601);
                }
            }
            let count = this.selCURNum;

            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyReward, 0, {type: LyTheurgyReward.type.goldFinger, args: args, count: count})
                    btn_close.fireClick();
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "replaceTheurgyFrag", {
                instId:itemInst.id,
                count:count,
                bProtoId:protoId
            });
        })
    }

    private setGroupCompItem(group_item:fgui.GComponent, proto:any, count:number):void {
        if (proto) {
            if (proto == 1) { // 随机
                group_item.getChild("loader_qua", fgui.GLoader).url = "ui://LyGoldFinger/frame_mijidi4";
                group_item.getChild("label_name", fgui.GTextField).text = StrVal.LYGOLDFINGER.STR302;
            } else {
                group_item.getChild("loader_dikuang", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_name{0}", [proto.quality]);
                group_item.getChild("loader_qua", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_draw{0}", [proto.quality]);
                group_item.getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/f_{0}", [proto.icon]);
                group_item.getChild("label_name", fgui.GTextField).text = proto.name;

                let img_piece: fgui.GImage =  group_item.getChild("img_piece", fgui.GImage);
                img_piece.visible = true;
                let loader_sort: fgui.GLoader = group_item.getChild("loader_sort");
                loader_sort.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_sort{0}{1}", [proto.type, proto.quality]);
            }
        } else { // 选择
            group_item.getChild("loader_dikuang", fgui.GLoader).url = undefined;
            group_item.getChild("loader_qua", fgui.GLoader).url = "ui://LyGoldFinger/frame_mijidi3";
            group_item.getChild("loader_icon", fgui.GLoader).url = undefined;
            group_item.getChild("label_name", fgui.GTextField).text = "";

            let img_piece: fgui.GImage =  group_item.getChild("img_piece", fgui.GImage);
            img_piece.visible = false;
            let loader_sort: fgui.GLoader = group_item.getChild("loader_sort");
            loader_sort.url = undefined;
        }
        let label_grade: fgui.GLabel = group_item.getChild("label_grade");
        if (count) {
            label_grade.text = UtilsTool.stringFormat("x {0}", [count]);
        } else {
            label_grade.text = "";
        }
    }

    private setGroupComp(group_left:fgui.GComponent, proto:any, count:number):void {
        let phase:number = 1;
        let level:number = 1;

        if (proto) {
            if (proto == 1) { // 随机
                group_left.getController("c1").selectedIndex = 2;

                let group_item_rand = group_left.getChild("group_item_rand", fgui.GComponent).getChild("main", fgui.GComponent);
                this.setGroupCompItem(group_item_rand, proto, count);
            } else {
                group_left.getController("c1").selectedIndex = 1;

                group_left.getChild("loader_bg", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_infoBg{0}", [proto.quality]);
                let label_name = group_left.getChild("label_name", fgui.GTextField);
                UtilsUI.setTheurgyNameColor(label_name, proto.quality);
                label_name.text = proto.name;
                let label_des1 = group_left.getChild("label_des1", fgui.GTextField);
                if (proto.type == 1) {
                    label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR7, [phase]);
                } else if (proto.type == 2) {
                    label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR8, [phase]);
                } else if (proto.type == 3) {
                    label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR9, [phase]);
                } else if (proto.type == 4) {
                    label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR10, [phase]);
                }
                let skillId = proto.phaseSkillId.split(",")[phase - 1];
                group_left.getChild("label_skillDes", fgui.GTextField).text = LocaleData.getSkillProto(skillId).desc;
                group_left.getChild("label_stage", fgui.GTextField).text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR28, [level]);
            }
        } else { // 选择
            group_left.getController("c1").selectedIndex = 0;
        }

        let group_item = group_left.getChild("group_item", fgui.GComponent).getChild("main", fgui.GComponent);
        this.setGroupCompItem(group_item, proto, count);
    }

    private changePage2():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main2");
        group_main.visible = true;
        let group_left = group_main.getChild("group_left", fgui.GComponent);
        let group_right = group_main.getChild("group_right", fgui.GComponent);

        let itemInst = this.itemInsts[this.lastSelect];
        if (this.dstProto && this.dstProto.id == itemInst.proto.id) {
            this.dstProto = undefined;
        }

        this.setGroupComp(group_left, itemInst.proto, this.selCURNum);
        group_left.clearClick();
        group_left.onClick(() => {
            group_main.visible = false;
            uiPanel.getChild("group_main").visible = true;
        })

        if (this.levelDatas[1] == "0") {
            this.setGroupComp(group_right, 1, this.selCURNum);
            group_right.clearClick();
        } else {
            if (this.dstProto) {
                this.setGroupComp(group_right, this.dstProto, this.selCURNum);
            } else {
                this.setGroupComp(group_right, null, this.selCURNum);
            }
            group_right.clearClick();
            group_right.onClick(() => {
                group_main.visible = false;
                uiPanel.getChild("group_main3").visible = true;

                this.theurgyProtos = LocaleData.getTheurgFragProtosByQuality(this.levelDatas[0], itemInst.proto.id);
                UtilsUI.setFguiGlistDelayNumItems(uiPanel.getChild("group_main3", fgui.GComponent).getChild("list_item"), this.theurgyProtos.length);
            })
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
                let proto = this.theurgyProtos[index];

                let group_item = child.getChild("main", fgui.GComponent);
                this.setGroupCompItem(group_item, proto, null);
                let btn_frame:fgui.GButton = group_item.getChild("btn_frame");
                btn_frame.clearClick();
                btn_frame.onClick(() => {
                    // 大选中状态。
                    let childIdx = list_item.itemIndexToChildIndex(index);
                    for (let i: number = 0; i < list_item.numChildren; i++) {
                        let __child: fgui.GComponent = list_item.getChildAt(i);
                        let __group_item = __child.getChild("main", fgui.GComponent);
                        let __btn_frame:fgui.GButton = __group_item.getChild("btn_frame");
                        __btn_frame.mode = fgui.ButtonMode.Check; // 选中才会显示选中框
                        __btn_frame.selected = (i == childIdx);
                    }

                    this.dstProto = proto;
                    group_main.visible = false;
                    this.changePage2();
                })
            }
        }
    }

    public getIsViewMask():boolean {
        return false;
    }
}