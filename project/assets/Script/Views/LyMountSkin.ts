//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { LyDetailAttr, LyDetailAttrType } from "./LyDetailAttr";
import { LyMainPage } from "./LyMainPage";
import { SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { LyMount } from "./LyMount";
import { PointRedData } from "../Kernel/PointRedData";

export class LyMountSkin extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyMount;
        this.viewResI.pkgName = "LyMount";
        this.viewResI.comName = "LyMountSkin";
    }

    private list_mount: fgui.GList
    private clothesItems: Array<any>;
    private lastIndex: number;

    private mount: any;
    private cactivate: any;
    private rmPlayer:SpineRoldMountPlayer;

    private needCount:number;
    private currCount:number;
 
    public onViewCreate(_params:any):void {
        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);
        
        let label_title = group_main.getChild("label_title")
        label_title.text = StrVal.LYMOUNT.STR9;

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyMountSkin, 0, null);
        })

        let btn_close = group_main.getChild("btn_close")
        btn_close.onClick(()=> {
            btn_back.fireClick();
        })

        let btn_additive:fgui.GButton = group_main.getChild("btn_additive");
        btn_additive.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDetailAttr, 0, {type:LyDetailAttrType.MOUNTSKIN, cactivate:this.cactivate});
        })

        let label_additive = group_main.getChild("label_additive")
        label_additive.text = StrVal.LYMOUNT.STR101;

        // 人物模型
        this.rmPlayer = new SpineRoldMountPlayer(group_main.getChild("group_spine_ram")).loadSpineRole(LocaleData.getCharShowResInfoSelf());
        
        this.clothesItems = LocaleData.getMountClothesItems();
        this.list_mount = group_main.getChild("list_mount")
        this.list_mount.itemRenderer = ((index: number, child: fgui.GComponent)=>{
            let clothesItem = this.clothesItems[index];
            let model = LocaleData.getModelItem(clothesItem.modelId);

            let loader_icon:fgui.GLoader = child.getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [model.thumbnail]);

            let img_dark:fgui.GImage = child.getChild("img_dark");
            img_dark.visible = !this.cactivate[clothesItem.id];

            let img_lock:fgui.GLoader = child.getChild("img_lock");
            img_lock.visible = !this.cactivate[clothesItem.id];

            let img_count:fgui.GTextField = child.getChild("img_count");
            let label_count:fgui.GTextField = child.getChild("label_count");
            if (Number(clothesItem.id) == this.mount.cid) {
                label_count.text = StrVal.LYMOUNT.STR2;
                img_count.visible = true;
            } else {
                label_count.text = "";
                img_count.visible = false;
            }

            let btn_frame:fgui.GButton = child.getChild("btn_frame");
            btn_frame.mode = fgui.ButtonMode.Check; // 选中才会显示选中框
            btn_frame.clearClick();
            btn_frame.onClick(() => {
                if (this.lastIndex != index) {
                    this.refreshCurrSuit(index);
                }
            })

            let count = GameServerData.getInstance().getItemCountByProtoId(clothesItem.item_id);
            PointRedData.getInstance().updateManualPoint(child, count > 0);
        })

        let btn_active:fgui.GButton = group_main.getChild("btn_active");
        btn_active.text = StrVal.LYMOUNT.STR103;
        btn_active.onClick(() => {
            let clothesItem = this.clothesItems[this.lastIndex];
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.mount = GameServerData.getInstance().getPlayerFullInfo().mount;
                    this.fillCactivate();
                    this.list_mount.numItems = this.clothesItems.length;
                    this.refreshCurrSuit(this.lastIndex);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "mountClothes", {cid: Number(clothesItem.id)})
        })

        let btn_uplevel:fgui.GButton = group_main.getChild("btn_uplevel");
        btn_uplevel.text = StrVal.LYMOUNT.STR12;
        btn_uplevel.onClick(() => {
            let clothesItem = this.clothesItems[this.lastIndex];
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.mount = GameServerData.getInstance().getPlayerFullInfo().mount;
                    this.fillCactivate();
                    this.list_mount.numItems = this.clothesItems.length; // 仅刷新红点
                    this.refreshCurrSuit(this.lastIndex);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "mountClothes", {cid: Number(clothesItem.id)})
        })

        let btn_used:fgui.GButton = group_main.getChild("btn_used");
        btn_used.text = StrVal.LYMOUNT.STR105;
        btn_used.onClick(() => {
            let clothesItem = this.clothesItems[this.lastIndex];
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.mount = GameServerData.getInstance().getPlayerFullInfo().mount;
                    this.list_mount.numItems = this.clothesItems.length;
                    this.refreshCurrSuit(this.lastIndex);
                    this.updateMainPageIcon();
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "mountCatClothes", {cid: Number(clothesItem.id)})
        })

        let btn_unused:fgui.GButton = group_main.getChild("btn_unused");
        btn_unused.text = StrVal.LYMOUNT.STR106;
        btn_unused.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.mount = GameServerData.getInstance().getPlayerFullInfo().mount;
                    this.list_mount.numItems = this.clothesItems.length;
                    this.refreshCurrSuit(this.lastIndex);
                    this.updateMainPageIcon();
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "mountCatClothes", {cid: 0})
        })

        this.mount = GameServerData.getInstance().getPlayerFullInfo().mount;
        this.fillCactivate();
        this.list_mount.numItems = this.clothesItems.length;
        let firstIdx = 0;
        for (let i = 0; i < this.clothesItems.length; i++) {
            if (Number(this.clothesItems[i].id == this.mount.cid)) {
                firstIdx = i;
                break;
            }
        }
        this.list_mount.scrollToView(firstIdx);
        this.refreshCurrSuit(firstIdx);
    }

    private fillCactivate(): void {
        this.cactivate = {};
        let ttt:Array<string> = this.mount.cactivate.split(";");
        for (let i = 0; i < ttt.length; i++) {
            let ccc:Array<string> = ttt[i].split(",");
            if (ccc[0].length > 0) {
                this.cactivate[ccc[0]] = Number(ccc[1]);
            }
        }
    }

    private refreshCurrSuit(index:number): void {
        this.lastIndex = index;
        let clothesItem = this.clothesItems[this.lastIndex];
        let proto = LocaleData.getItemProto(clothesItem.item_id);

        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        for (let i = 0; i < this.list_mount.numChildren; i++) {
            let child:fgui.GComponent = this.list_mount.getChildAt(i);
            let btn_frame:fgui.GButton = child.getChild("btn_frame");
            btn_frame.selected = (this.lastIndex == this.list_mount.childIndexToItemIndex(i));
        }

        // 坐骑
        this.rmPlayer.loadSpineMount(clothesItem.modelId);

        let label_name = group_main.getChild("label_name");
        label_name.text = clothesItem.name;

        let label_desc = group_main.getChild("label_desc");
        label_desc.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR102, [proto.getDesc]);

        let level = 1;
        if (this.cactivate[clothesItem.id]) {
            level = this.cactivate[clothesItem.id];
        }
        /* 说每级+1写死。
        let attr:number = 0;
        let ttt:Array<string> = clothesItem.attribute.split(";");
        for (let i = ttt.length - 1; i >= 0; i--) {
            let ccc:Array<string> = ttt[i].split(",");
            if (level >= Number(ccc[0])) {
                attr = Number(ccc[1]);
                break;
            }
        }
        */
        let label_attr = group_main.getChild("label_attr");

        this.currCount = GameServerData.getInstance().getItemCountByProtoId(clothesItem.item_id);
        this.needCount = Number(clothesItem.count);

        let group_active = group_main.getChild("group_active");
        let group_uplevel = group_main.getChild("group_uplevel");
        if (this.cactivate[clothesItem.id]) { // 已解锁
            group_active.visible = false;
            group_uplevel.visible = true;

            if (clothesItem.attributeId == "0") {
                label_attr.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR110, [(level + 1) * Number(clothesItem.attribute)]);
            } else {
                label_attr.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR108, [StrVal.ENTITI_NAMES[Number(clothesItem.attributeId)], (level + 1) * Number(clothesItem.attribute)]);
            }

            let loader_icon2:fgui.GLoader = group_main.getChild("loader_icon2");
            loader_icon2.url = UtilsTool.stringFormat("ui://CCommon/{0}", [proto.icon]);
            let label_need2:fgui.GTextField = group_main.getChild("label_need2");
            label_need2.text = UtilsTool.stringFormat("{0}/{1}", [this.currCount, this.needCount]);
            label_need2.color = UtilsUI.getEnoughColor(this.currCount >= this.needCount);

            let btn_used:fgui.GButton = group_main.getChild("btn_used");
            let btn_unused:fgui.GButton = group_main.getChild("btn_unused");
            if (this.mount.cid == Number(clothesItem.id)) {
                btn_used.visible = false;
                btn_unused.visible = true;
            } else {
                btn_used.visible = true;
                btn_unused.visible = false;
            }

            let btn_uplevel:fgui.GButton = group_main.getChild("btn_uplevel");
            PointRedData.getInstance().updateManualPoint(btn_uplevel, this.currCount >= this.needCount);
        } else {
            group_active.visible = true;
            group_uplevel.visible = false;

            if (clothesItem.attributeId == "0") {
                label_attr.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR109, [clothesItem.attribute]);
            } else {
                label_attr.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR107, [StrVal.ENTITI_NAMES[Number(clothesItem.attributeId)], clothesItem.attribute]);
            }

            let loader_icon1:fgui.GLoader = group_main.getChild("loader_icon1");
            loader_icon1.url = UtilsTool.stringFormat("ui://CCommon/{0}", [proto.icon]);
            let label_need1:fgui.GTextField = group_main.getChild("label_need1");
            label_need1.text = UtilsTool.stringFormat("{0}/{1}", [this.currCount, this.needCount]);
            label_need1.color = UtilsUI.getEnoughColor(this.currCount >= this.needCount);

            let btn_active:fgui.GButton = group_main.getChild("btn_active");
            PointRedData.getInstance().updateManualPoint(btn_active, this.currCount >= this.needCount);
        }
    }

    private updateMainPageIcon(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {upShowUi:true});
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMount, 0, null);
    }

    public getIsViewMask():boolean {
        return false;
    }

    public static isViewRedPoint():boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.mount)) {
            return false;
        }
        let clothes = LocaleData.getMountClothesItems();
        for (let i = 0; i < clothes.length; i++) {
            let count = GameServerData.getInstance().getItemCountByProtoId(clothes[i].item_id);
            if (count > 0) {
                return true;
            }
        }
        return false;
    }
}


