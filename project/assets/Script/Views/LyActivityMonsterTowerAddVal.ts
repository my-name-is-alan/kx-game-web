//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServerData } from "../Kernel/GameServerData";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { VarVal } from "../Values/VarVal";
import { LyActivityMonsterTower } from "./LyActivityMonsterTower";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { LyActivityMonsterTowerAddValMin } from "./LyActivityMonsterTowerAddValMin";

export class LyActivityMonsterTowerAddVal extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyActivityMonsterTower;
        this.viewResI.pkgName = "LyActivityMonsterTower";
        this.viewResI.comName = "LyActivityMonsterTowerAddVal";
    }

    private static isCheckSel:boolean = false;

    private towerItem:any;

    private buffNum:number;
    private buffList:Array<number>;
    private buff:Array<any>;

    private list_add:fgui.GList;

    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");

        this.towerItem = params.towerItem;

        let label_title: fgui.GTextField = group_main.getChild("label_title");
        label_title.text = StrVal.LYACTIVITY_MONSTERTOWER.STR301;

        // 关闭
        let btn_back: fgui.GButton = getUiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityMonsterTowerAddVal, 0, null);
        })

        let btn_close: fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_add: fgui.GTextField = group_main.getChild("label_add");
        label_add.text = StrVal.LYACTIVITY_MONSTERTOWER.STR302;

        this.list_add = group_main.getChild("list_attr");

        let breakClick = () => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    if (this.buffNum > 0) {
                        this.refreshState();
                        this.fillAttr3Add();
                    } else {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyActivityMonsterTower, 0, {type:3});
                        btn_back.fireClick();
                    }
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "towerBuff", {
                buff:0,
                trench:0,
            });
        }

        // 取消
        let btn_cancel: fgui.GButton = group_main.getChild("btn_cancel");
        btn_cancel.text = StrVal.COMMON.STR32;
        btn_cancel.onClick(() => {
            if (LyActivityMonsterTowerAddVal.isCheckSel) {
                breakClick();
            } else {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "", 
                StrVal.LYACTIVITY_MONSTERTOWER.STR305, null, 
                StrVal.COMMON.STR32, null, 
                StrVal.COMMON.STR33, (isCheckSel:boolean) => {
                    LyActivityMonsterTowerAddVal.isCheckSel = isCheckSel;
                    breakClick();
                }, "", null, {
                    checkBoxText: StrVal.COMMON.STR35
                })
            }
        })

        // 确定
        let btn_comfirm: fgui.GButton = group_main.getChild("btn_comfirm");
        btn_comfirm.text = StrVal.COMMON.STR33;
        btn_comfirm.onClick(() => {
            let sendtowerBuff = (selectSlot:number, toSlot:number) => {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyActivityMonsterTower, 0, {type:1});
                        if (this.buffNum > 0) {
                            this.refreshState();
                            LyActivityMonsterTower.fillAttr8Comp(group_main.getChild("group_attr8"), this.towerItem, this.buff, true);
                            this.fillAttr3Add();
                        } else {
                            btn_back.fireClick();
                        }
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "towerBuff", {
                    buff:selectSlot,
                    trench:toSlot,
                });
            }

            let selectIndex = this.getListSelectIndex();
            let toIndex:number;
            // 是否存在列表？
            let sameIndex = this.getExistSlotByBuffId(this.buffList[selectIndex]);
            if (sameIndex) {
                toIndex = sameIndex;
            } else { // 是否空槽？
                let newIndex = this.getEmptySlot();
                if (newIndex) {
                    toIndex = newIndex;
                }
            }
            if (toIndex) {
                sendtowerBuff(selectIndex + 1, toIndex)
            } else { // 满槽
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityMonsterTowerAddValMin, 0, {towerItem:this.towerItem, callback:(toIndex:number) => {
                    sendtowerBuff(selectIndex + 1, toIndex)
                }});
            }
        })
        this.refreshState();
        LyActivityMonsterTower.fillAttr8Comp(group_main.getChild("group_attr8"), this.towerItem, this.buff, true);
        this.fillAttr3Add();
    }

    private refreshState(): void {
        this.buffNum = 0;
        this.buffList = null;
        this.buff = null;
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.MONSTOR_TOWER);
        if (activityState && activityState.data) {
            this.buffNum = activityState.data.activityTower.buffNum;
            this.buffList = activityState.data.activityTower.buffList;
            this.buff = activityState.data.activityTower.buff;
        }
    }

    private fillAttr3Add(): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");

        // 列表1
        this.list_add.itemRenderer = (slot:number, group_item:fgui.GComponent) => {
            let loader_back: fgui.GLoader = group_item.getChild("loader_back");
            let label_lock: fgui.GTextField = group_item.getChild("label_lock");
            let label_attr: fgui.GTextField = group_item.getChild("label_attr");
            let label_level: fgui.GTextField = group_item.getChild("label_level");
            let loader_level: fgui.GLoader = group_item.getChild("loader_level");
            loader_level.visible = false;
            let img_arrow: fgui.GImage = group_item.getChild("img_arrow");
            img_arrow.visible = false;

            let buffid = this.buffList[slot];
            let buffItem = LocaleData.getTowerBuffItem(buffid);

            label_lock.text = "";
            label_attr.text = buffItem.name;
            // 是否存在列表？
            if (this.getExistSlotByBuffId(buffid)) {
                label_level.text = "";
                img_arrow.visible = true;
            } else {
                label_level.text = "";
                loader_level.visible = false;
                //label_level.text = "1";
                //loader_level.visible = true;
                //loader_level.url = UtilsTool.stringFormat("ui://LyActivityMonsterTower/frame_buff-subscript{0}", [buffItem.trait]);
            }
            loader_back.url = UtilsTool.stringFormat("ui://LyActivityMonsterTower/frame_buff{0}", [buffItem.trait]);

            let btn_frame:fgui.GButton = group_item.getChild("btn_frame");
            btn_frame.mode = fgui.ButtonMode.Check; // 选中才会显示选中框
            btn_frame.clearClick();
            btn_frame.onClick(() => {
                this.setListSelect(slot);
            })
        }
        this.list_add.numItems = this.buffList.length;
        this.setListSelect(this.getListSelectIndex());

        let label_desc: fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_MONSTERTOWER.STR303, [this.buffNum + 1]);
    }

    private getExistSlotByBuffId(id:number): number {
        for (let slot = 0; slot < this.buff.length; slot++) {
            if (this.buff[slot].buffId == id) {
                return slot + 1;
            }
        }
    }

    private getEmptySlot(): number {
        for (let slot = 0; slot < this.buff.length; slot++) {
            if (this.buff[slot].buffId == 0) {
                return slot + 1;
            }
        }
    }

    private getListSelectIndex(): number {
        let selectIndex = 0;
        for (let i: number = 0; i < this.list_add.numChildren; i++) {
            let child: fgui.GComponent = this.list_add.getChildAt(i);
            let btn_frame:fgui.GButton = child.getChild("btn_frame");
            if (btn_frame.selected) {
                selectIndex = this.list_add.childIndexToItemIndex(i);
                break;
            }
        }
        return selectIndex;
    }

    private setListSelect(slot:number): void {
        let childIdx = this.list_add.itemIndexToChildIndex(slot);
        for (let i: number = 0; i < this.list_add.numChildren; i++) {
            let child: fgui.GComponent = this.list_add.getChildAt(i);
            let btn_frame:fgui.GButton = child.getChild("btn_frame");
            btn_frame.selected = (i == childIdx);
        }

        let buffid = this.buffList[slot];
        let buffItem = LocaleData.getTowerBuffItem(buffid);

        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");

        /*
        let group_item: fgui.GComponent = group_main.getChild("group_item");
        let loader_back: fgui.GLoader = group_item.getChild("loader_back");
        let label_lock: fgui.GTextField = group_item.getChild("label_lock");
        let label_attr: fgui.GTextField = group_item.getChild("label_attr");
        let label_level: fgui.GTextField = group_item.getChild("label_level");
        let img_arrow: fgui.GImage = group_item.getChild("img_arrow");
        img_arrow.visible = false;

        label_lock.text = "";
        label_attr.text = buffItem.name;
        // 是否存在列表？
        if (this.getExistSlotByBuffId(buffid)) {
            label_level.text = "";
            img_arrow.visible = true;
        } else {
            label_level.text = "1";
        }
        loader_back.url = UtilsTool.stringFormat("ui://LyActivityMonsterTower/frame_buff{0}", [buffItem.trait]);
        */

        let label_attrdesc: fgui.GTextField = group_main.getChild("label_attrdesc");
        label_attrdesc.text = UtilsTool.stringFormat(StrVal.LYDETAILATTR.STR204, [StrVal.ENTITI_NAMES[Number(buffItem.buffId)], buffItem.buffParam]);
    }

    public getIsViewMask(): boolean {
        return false;
    }
}