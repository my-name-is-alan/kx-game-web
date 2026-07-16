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
import { LyGuideDetail } from "./LyGuideDetail";
import { LyMountSkin } from "./LyMountSkin";
import { LyMountAttr } from "./LyMountAttr";
import { LyMainPage } from "./LyMainPage";
import { SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { LocaleUser } from "../Kernel/LocaleUser";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { AudioManager } from "../Kernel/AudioManager";

export class LyMount extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyMount;
        this.viewResI.pkgName = "LyMount";
        this.viewResI.comName = "LyMount";
    }

    private CENTERITEM_OFF:number = 1;
    private list_mount: fgui.GList
    private mountItems: Array<any>;
    private lastIndex: number;

    private mount: any;
    private tactivates: Array<string>;
    private rmPlayer: SpineRoldMountPlayer;

    private currProtoId:string;
    private needCount:number;
    private currCount:number;

    public static isSkipPlayAni:boolean;
 
    public onViewCreate(_params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        if (LyMount.isSkipPlayAni) {
            LyMount.isSkipPlayAni = false;
        } else {
            UtilsUI.playCommonGroupAni(group_main);
        }
        
        let label_title = group_main.getChild("label_title")
        label_title.text = StrVal.LYMOUNT.STR1;

        let btn_detail:fgui.GButton = group_main.getChild("btn_detail");
        btn_detail.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:StrVal.LYMOUNT.STR1, detail:LocaleData.getMountRoot().detail});
        })

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyMount, 0, null);
        })

        let btn_close = group_main.getChild("btn_close")
        btn_close.onClick(()=> {
            btn_back.fireClick();
        })

        let btn_tips = group_main.getChild("btn_tips")
        btn_tips.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyMountAttr, 0, {mount:this.mount})
        })
        
        this.mountItems = LocaleData.getMountTypeItems();
        this.list_mount = group_main.getChild("list_mount")
        this.list_mount.itemRenderer = ((index: number, child: fgui.GComponent)=>{
            child.setPivot(0.5, 0.5);
            
            let mountItem = this.mountItems[index];
            let model = LocaleData.getModelItem(mountItem.modelId);

            let loader_icon:fgui.GLoader = child.getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [model.thumbnail]);

            let img_lock:fgui.GLoader = child.getChild("img_lock");
            img_lock.visible = !this.isActivateMount(mountItem.id);

            let img_dark:fgui.GImage = child.getChild("img_dark");
            img_dark.visible = !this.isActivateMount(mountItem.id);

            let img_count:fgui.GTextField = child.getChild("img_count");
            let label_count:fgui.GTextField = child.getChild("label_count");
            if (Number(mountItem.id) == this.mount.tid) {
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
                    this.scrollItemToCenter(index);
                }
            })
        })
        this.list_mount.setVirtualAndLoop();
        this.list_mount.on(fgui.Event.SCROLL_END, this.onListScrollEnd, this);
        this.list_mount.on(fgui.Event.SCROLL, this.fixScrollItemScale, this);

        // 人物模型
        this.rmPlayer = new SpineRoldMountPlayer(group_main.getChild("group_spine_ram")).loadSpineRole(LocaleData.getCharShowResInfoSelf());

        let btn_used:fgui.GButton = group_main.getChild("btn_used");
        btn_used.text = StrVal.LYMOUNT.STR5;
        btn_used.onClick(() => {
            let mountItem = this.mountItems[this.lastIndex];
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.mount = GameServerData.getInstance().getPlayerFullInfo().mount;
                    this.list_mount.numItems = this.mountItems.length;
                    this.refreshCurrStage(); // 主要变为已使用。
                    this.updateMainPageIcon();
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "mountCat", {tid: Number(mountItem.id)})
        })
        let btn_active:fgui.GButton = group_main.getChild("btn_active");
        btn_active.onClick(() => {
            let mountItem = this.mountItems[this.lastIndex];
            UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "", 
            UtilsTool.stringFormat(StrVal.LYMOUNT.STR15, [mountItem.count, UtilsUI.getItemIconUrl(VarVal.bonusType.stone)]), null, 
            StrVal.COMMON.STR32, null, 
            StrVal.COMMON.STR33, () => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.mount = GameServerData.getInstance().getPlayerFullInfo().mount;
                        this.tactivates = this.mount.tactivate.split(",");
                        this.list_mount.numItems = this.mountItems.length;
                        this.refreshCurrStage(); // 主要变为可使用。
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "mountUnlock", {tid: Number(mountItem.id)})
            }, "", null)
        })

        let label_tipbase = group_main.getChild("label_tipbase")
        label_tipbase.text = StrVal.LYMOUNT.STR6;

        let label_tipc = group_main.getChild("label_tipc")
        label_tipc.text = StrVal.LYMOUNT.STR7;

        let label_tipn = group_main.getChild("label_tipn")
        label_tipn.text = StrVal.LYMOUNT.STR8;

        let btn_clothes:fgui.GButton = group_main.getChild("btn_clothes");
        PointRedData.getInstance().registerPoint(btn_clothes, PointRedType.LyMountSkin);
        btn_clothes.text = StrVal.LYMOUNT.STR9;
        btn_clothes.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyMountSkin, 0, null);
        })

        let loader_spine_exp:fgui.GLoader3D = group_main.getChild("loader_spine_exp");

        let btn_upstage:fgui.GButton = group_main.getChild("btn_upstage");
        btn_upstage.text = StrVal.LYMOUNT.STR11;
        btn_upstage.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyMountAttr, 0, {mount:this.mount, callback:() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.mount = GameServerData.getInstance().getPlayerFullInfo().mount;
                        UtilsUI.loadSpineEffAndShow(loader_spine_exp, VarVal.UI_EFF.loader_spine_exp, false);
                        this.refreshCurrStage();
                        this.refreshCurrLevel();
                        this.updateMainPageIcon();
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {
                            bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.currProtoId, "1"),
                            buyCall:() => {
                                this.refreshCurrLevel();
                        }})
                    }
                }, "mountUpgrades", {count: 0})
            }})
        })

        let btn_uplevel:fgui.GButton = group_main.getChild("btn_uplevel");
        btn_uplevel.text = StrVal.LYMOUNT.STR12;
        btn_uplevel.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    // let oldLevel = this.mount.level;
                    this.mount = GameServerData.getInstance().getPlayerFullInfo().mount;
                    // if (this.mount.level != oldLevel) {
                        UtilsUI.loadSpineEffAndShow(loader_spine_exp, VarVal.UI_EFF.loader_spine_exp, false);
                    // }
                    this.refreshCurrStage();
                    this.refreshCurrLevel();
                    this.updateMainPageIcon();
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                    if (this.currCount < this.needCount) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {
                            bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.currProtoId, "1"),
                            buyCall:() => {
                                this.refreshCurrLevel();
                        }})
                    }
                }
            }, "mountUpgrades", {count: Math.max(Math.min(this.needCount, this.currCount), 1)})
        })

        let btn_check:fgui.GButton = group_main.getChild("btn_check");
        btn_check.selected = (LocaleUser.getUser(VarVal.FIELD_SV.MOUNT_QUICK) == "1");
        btn_check.onClick(() => {
            LocaleUser.setUser(VarVal.FIELD_SV.MOUNT_QUICK, btn_check.selected ? "1" : "0");
            LocaleUser.flush();
            
            this.refreshCurrLevel(); // 主要变为可用数量。
        })

        let label_quick = group_main.getChild("label_quick")
        label_quick.text = StrVal.LYMOUNT.STR13;

        // 第一次进来
        this.mount = GameServerData.getInstance().getPlayerFullInfo().mount;
        this.tactivates = this.mount.tactivate.split(",");
        this.list_mount.numItems = this.mountItems.length;
        let focusIdx = 1;
        for (let i = 0; i < this.mountItems.length; i++) {
            if (this.mountItems[i].id == String(this.mount.tid)) {
                focusIdx = i;
                break;
            }
        }
        this.scrollItemToCenter(focusIdx);

        let btn_arrow_l = group_main.getChild("btn_arrow_l", fgui.GButton);
        btn_arrow_l.onClick(() => {
            let idx = this.lastIndex - 1;
            if (idx < 0) {
                idx = this.mountItems.length - 1;
            }
            this.scrollItemToCenter(idx);
        })
        let btn_arrow_r = group_main.getChild("btn_arrow_r", fgui.GButton);
        btn_arrow_r.onClick(() => {
            let idx = this.lastIndex + 1;
            if (idx >= this.mountItems.length) {
                idx = 0;
            }
            this.scrollItemToCenter(idx);
        })
    }

    public onViewUpdate(params:any): void {
        if (params && params.itemCount) {
            this.refreshCurrLevel(); // 主要变为可用数量。
        } else {
            this.mount = GameServerData.getInstance().getPlayerFullInfo().mount;
            this.refreshMountSpine(this.mountItems[this.lastIndex]);
        }
    }

    private refreshMountSpine(mountItem:any): void {
        let modelId:string;
        if (this.mount.cid > 0) {
            let clothItem = LocaleData.getMountClothesItem(this.mount.cid);
            modelId = clothItem.modelId;
        } else {
            modelId = mountItem.modelId;
        }
        this.rmPlayer.loadSpineMount(modelId);
    }

    /**
     * 设置某项显示在中间。
     */
    private setCurrShowItem(index:number): void {
        // 设置选中状态。
        let childIdx = this.list_mount.itemIndexToChildIndex(index);
        for (let i: number = 0; i < this.list_mount.numChildren; i++) {
            let child: fgui.GComponent = this.list_mount.getChildAt(i);
            let btn_frame:fgui.GButton = child.getChild("btn_frame");
            // btn_frame.enabled = (i != childIdx);
            btn_frame.selected = (i == childIdx);
            // let img_dark:fgui.GImage = child.getChild("img_dark");
            // img_dark.visible = (i != childIdx);
        }
        this.lastIndex = index;
        // 填充数据。
        let mountItem = this.mountItems[this.lastIndex];

        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let label_name:fgui.GTextField = group_main.getChild("label_name");
        label_name.text = mountItem.name;

        // 坐骑模型
        this.refreshMountSpine(mountItem);

        this.refreshCurrStage();
        this.refreshCurrLevel();
    }

    /**
     * 刷新阶级。
     */
    private refreshCurrStage(): void {
        let mountItem = this.mountItems[this.lastIndex];
        let stageItem = LocaleData.getMountStageItem(this.mount.stage);

        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        // 左边
        let label_singer:fgui.GTextField = group_main.getChild("label_singer");
        if (mountItem.resis == "0") {
            label_singer.text = StrVal.LYMOUNT.STR4;
        } else {
            label_singer.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR3, [StrVal.ENTITI_NAMES[Number(mountItem.resis)], stageItem.al_resis])
        }

        let label_used:fgui.GTextField = group_main.getChild("label_used");
        let btn_used:fgui.GButton = group_main.getChild("btn_used");
        let btn_active:fgui.GButton = UtilsUI.setButtonIcon(group_main.getChild("btn_active"), VarVal.bonusType.stone, mountItem.count);

        if (Number(mountItem.id) == this.mount.tid) {
            label_used.text = StrVal.LYMOUNT.STR2;
            btn_used.visible = false;
            btn_active.visible = false;
        } else {
            label_used.text = "";
            if (this.isActivateMount(mountItem.id)) {
                btn_used.visible = true;
                btn_active.visible = false;
            } else {
                btn_used.visible = false;
                btn_active.visible = true;
            }
        }

        // 右边
        let label_attr1:fgui.GTextField = group_main.getChild("label_attr1");
        label_attr1.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR3, [StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.RESISTANCE_VERTIGO], stageItem.resis]);
        let label_attr2:fgui.GTextField = group_main.getChild("label_attr2");
        label_attr2.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR3, [StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.RESISTANCE_CRITICAL], stageItem.resis]);
        let label_attr3:fgui.GTextField = group_main.getChild("label_attr3");
        label_attr3.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR3, [StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.RESISTANCE_COMBO], stageItem.resis]);
        let label_attr4:fgui.GTextField = group_main.getChild("label_attr4");
        label_attr4.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR3, [StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.RESISTANCE_MISS], stageItem.resis]);
        let label_attr5:fgui.GTextField = group_main.getChild("label_attr5");
        label_attr5.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR3, [StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.RESISTANCE_COUNTER], stageItem.resis]);
        let label_attr6:fgui.GTextField = group_main.getChild("label_attr6");
        label_attr6.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR3, [StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.RESISTANCE_VAMPIRE], stageItem.resis]);
    }

    /**
     * 刷新等级。
     */
    private refreshCurrLevel(): void {
        let stageItem = LocaleData.getMountStageItem(this.mount.stage);

        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        // 右边
        let base1Curr = Number(stageItem.hp) + this.mount.level * Number(stageItem.g_hp);
        let base1Next = Number(stageItem.hp) + (this.mount.level + 1) * Number(stageItem.g_hp);
        let label_base1:fgui.GTextField = group_main.getChild("label_base1");
        label_base1.text = UtilsTool.stringFormat("{0}{1}", [StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.FINAL_HP], base1Curr]);
        let label_base1n:fgui.GTextField = group_main.getChild("label_base1n");
        label_base1n.text = String(base1Next);

        let base2Curr = Number(stageItem.atk) + this.mount.level * Number(stageItem.g_atk);
        let base2Next = Number(stageItem.atk) + (this.mount.level + 1) * Number(stageItem.g_atk);
        let label_base2:fgui.GTextField = group_main.getChild("label_base2");
        label_base2.text = UtilsTool.stringFormat("{0}{1}", [StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.FINAL_ATTACK], base2Curr]);
        let label_base2n:fgui.GTextField = group_main.getChild("label_base2n");
        label_base2n.text = String(base2Next);

        let base3Curr = Number(stageItem.def) + this.mount.level * Number(stageItem.g_def);
        let base3Next = Number(stageItem.def) + (this.mount.level + 1) * Number(stageItem.g_def);
        let label_base3:fgui.GTextField = group_main.getChild("label_base3");
        label_base3.text = UtilsTool.stringFormat("{0}{1}", [StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.FINAL_DEFENSE], base3Curr]);
        let label_base3n:fgui.GTextField = group_main.getChild("label_base3n");
        label_base3n.text = String(base3Next);

        // 下边
        let label_stagelevel:fgui.GTextField = group_main.getChild("label_stagelevel");
        label_stagelevel.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR10, [this.mount.stage, this.mount.level]);

        let ADD_MAX = Number(stageItem.level_sum);
        let bar_progress:fgui.GProgressBar = group_main.getChild("bar_progress");
        bar_progress.min = 0;
        bar_progress.max = ADD_MAX;

        // let isUpLevel = (this.mount.item < ADD_MAX);
        let isUpLevel = (this.mount.level != Number(stageItem.mount_level_max));

        let protoId:string;
        if (isUpLevel) {
            bar_progress.value = this.mount.item;

            protoId = stageItem.level_item_id;
            let btn_check:fgui.GButton = group_main.getChild("btn_check");
            if (btn_check.selected) {
                this.needCount = ADD_MAX - this.mount.item;
            } else {
                this.needCount = 1;
            }
        } else {
            bar_progress.value = ADD_MAX;

            protoId = stageItem.stage_item_id;
            this.needCount = Number(stageItem.stage_sum);
        }
        this.currProtoId = protoId;
        this.currCount = GameServerData.getInstance().getItemCountByProtoId(protoId);
        let proto = LocaleData.getItemProto(protoId);
        let loader_icon:fgui.GLoader = group_main.getChild("loader_icon");
        loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [proto.icon]);

        let label_need:fgui.GTextField = group_main.getChild("label_need");
        label_need.text = UtilsTool.stringFormat("{0}/{1}", [this.currCount, this.needCount]);
        label_need.color = UtilsUI.getEnoughColor(this.currCount >= this.needCount);

        group_main.getChild("group_level").visible = isUpLevel;
        let btn_upstage:fgui.GButton = group_main.getChild("btn_upstage");
        btn_upstage.visible = !isUpLevel;
        let btn_uplevel:fgui.GButton = group_main.getChild("btn_uplevel");
        if (isUpLevel) {
            PointRedData.getInstance().updateManualPoint(btn_uplevel, this.currCount >= 1);
        } else {
            PointRedData.getInstance().updateManualPoint(btn_upstage, this.currCount >= this.needCount);
        }

        let label_desc = group_main.getChild("label_desc")
        label_desc.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR14, [Number(stageItem.mount_level_max) - this.mount.level]);
    }

    /**
     * 设置某项显示在中间。
     */
    private scrollItemToCenter(index:number): void {
        let firstIdx = (this.list_mount.numItems + index - this.CENTERITEM_OFF) % this.list_mount.numItems;
        this.list_mount.scrollToView(firstIdx, false, true);
        this.fixScrollItemScale();
        this.setCurrShowItem(index);
    }

    /**
     * 获得中间项的索引。
     */
    private onListScrollEnd(): void {
        let space = this.list_mount.getChildAt(0).width + this.list_mount.columnGap;
        let centIdx = Math.floor(this.list_mount.scrollPane.posX / space + this.CENTERITEM_OFF) % this.list_mount.numItems;
        this.setCurrShowItem(centIdx);
    }

    /**
     * 动态修正缩放。
     */
    private fixScrollItemScale(): void {
        let midX: number = this.list_mount.scrollPane.posX + this.list_mount.viewWidth / 2;
        for (let i: number = 0; i < this.list_mount.numChildren; i++) {
            let obj: fgui.GObject = this.list_mount.getChildAt(i);
            let dist: number = Math.abs(midX - obj.x - obj.width / 2);
            if (dist > obj.width) // no intersection
                obj.setScale(1, 1);
            else {
                let ss: number = 1 + (1 - dist / obj.width) * 0.24;
                obj.setScale(ss, ss);
            }
        }
    }

    /**
     * 动态修正缩放。
     */
    private isActivateMount(tid:string | number): boolean {
        tid = String(tid);
        for (let i: number = 0; i < this.tactivates.length; i++) {
            if (tid == this.tactivates[i]) {
                return true;
            }
        }
        return false;
    }

    private updateMainPageIcon(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {upShowUi:true});
    }

    public getIsViewMask():boolean {
        return false;
    }

    public static isViewRedPointLevelUp():boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.mount)) {
            return false;
        }
        if (GameServerData.getInstance().isMountOpend()) {
            let mount = GameServerData.getInstance().getPlayerFullInfo().mount;
            let stageItem = LocaleData.getMountStageItem(mount.stage);

            let isUpLevel = (mount.level != Number(stageItem.mount_level_max));

            let protoId:string;
            let needCount:number = 1;
            if (isUpLevel) {
                protoId = stageItem.level_item_id;
            } else {
                protoId = stageItem.stage_item_id;
                needCount = Number(stageItem.stage_sum);
            }
            let currCount = GameServerData.getInstance().getItemCountByProtoId(protoId);
            return (currCount >= needCount);
        }
        return false;
    }
}


