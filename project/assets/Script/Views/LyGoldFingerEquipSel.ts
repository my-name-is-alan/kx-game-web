//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { UtilsTool } from "../Kernel/UtilsTool";
import { LocaleData } from "../Kernel/LocaleData";
import { GameServerData } from "../Kernel/GameServerData";
import { GameServer } from "../Kernel/GameServer";

export class LyGoldFingerEquipSel extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.comName = "LyGoldFingerEquipSel";
    }

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGoldFingerEquipSel, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_name = group_main.getChild("label_name", fgui.GTextField);
        label_name.text = StrVal.LYGOLDFINGER.STR501;

        let todayCanSel = LocaleData.getGoldFingerLevelItemMax(params.levelItem) - GameServerData.getInstance().getGoldFingerLevelItemCount(params.levelItem.functionType);
        let label_count = group_main.getChild("label_count", fgui.GTextField);
        label_count.text = UtilsTool.stringFormat(StrVal.LYGOLDFINGER.STR301, [todayCanSel]);

        let equipArr = new Array<any>();
        let equipSlotArr = LocaleData.getSoltQualityProto("");
        equipSlotArr.forEach(item => {
            equipArr.push(GameServerData.getInstance().newEquipShowInst(item.id));
        });
        let selIndex:number = -1;

        // 列表
        let list_item:fgui.GList = group_main.getChild("list_equip");
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            UtilsUI.setUIGroupEquip(equipArr[index], child, () => {
                selIndex = index;
                group_main.getChild("label_name").text = equipSlotArr[selIndex].name;

                // 大选中状态。
                let childIdx = list_item.itemIndexToChildIndex(index);
                for (let i: number = 0; i < list_item.numChildren; i++) {
                    let __child: fgui.GComponent = list_item.getChildAt(i);
                    let btn_frame:fgui.GButton = __child.getChild("btn_frame");
                    btn_frame.mode = fgui.ButtonMode.Check; // 选中才会显示选中框
                    btn_frame.selected = (i == childIdx);
                }
            });
        }
        UtilsUI.setFguiGlistDelayNumItems(list_item, 12);

        let btn_comfirm:fgui.GButton = group_main.getChild("btn_comfirm");
        btn_comfirm.text = StrVal.COMMON.STR33;
        btn_comfirm.onClick(() => {
            if (selIndex < 0) {
                UtilsUI.showMsgTip(StrVal.LYGOLDFINGER.STR502);
            } else {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        UtilsUI.showMsgTip(StrVal.LYGOLDFINGER.STR503);
                        btn_close.fireClick();
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "onReplaceEquip", {
                    slot:selIndex + 1
                });
            }
        })
    }

    public getIsViewMask():boolean {
        return false;
    }
}