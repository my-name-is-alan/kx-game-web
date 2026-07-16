//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { LyCompanion } from "./LyCompanion";
import { LyCharacter } from "./LyCharacter";
import { LyBackPack } from "./LyBackPack";
import { LyHaven } from "./LyHaven";
import { VarVal } from "../Values/VarVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServerData } from "../Kernel/GameServerData";
import { LyPalaceMain } from "./LyPalaceMain";
import { GameServer } from "../Kernel/GameServer";
import { UtilsUI } from "../Kernel/UtilsUI";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { StrVal } from "../Values/StrVal";

export enum HOME_TYPES {
    HAVEN,
    COMPANION,
    PALACE,
    CHARACTER,
    BACKPACK,
}

export class LyHomeList extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyMainPage";
        this.viewResI.pkgName = "LyMainPage";
        this.viewResI.comName = "LyHomeList";
    }

    private CHALLENGE_ITEMS = [
        { id: HOME_TYPES.HAVEN, name: "龙门镖局", backimg:"frame_longmenbiaoju"},
        { id: HOME_TYPES.COMPANION, name: "兽友", backimg:"frame_shouyou"},
        { id: HOME_TYPES.PALACE, name: "琅琊榜", backimg:"frame_xiangong"},
        { id: HOME_TYPES.CHARACTER, name: "百相阁", backimg:"frame_baixiangge"},
        { id: HOME_TYPES.BACKPACK, name: "行囊", backimg:"frame_xingnang"},
    ];

    public onViewCreate(params: any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        // 列表
        let list_item: fgui.GList = uiPanel.getChild("list_item");
        list_item.itemRenderer = (index: number, group_item: fgui.GComponent) => {
            let item = this.CHALLENGE_ITEMS[index];
            group_item.data = item;

            let label_title: fgui.GTextField = group_item.getChild("label_title");
            label_title.text = item.name;
            
            let btn_challenge: fgui.GLoader = group_item.getChild("btn_challenge");
            btn_challenge.url = UtilsTool.stringFormat("ui://LyMainPage/{0}", [item.backimg]);

            let label_desc:fgui.GTextField = group_item.getChild("label_desc");
            if (item.id == HOME_TYPES.HAVEN) {
                let isActivationSys: boolean = !GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.haven)
                if (!isActivationSys) {
                    PointRedData.getInstance().registerPoint(group_item, PointRedType.LyHaven);
                    let state = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN)
                    if (state && state.data) {
                        let havenData = state.data.activityHaven
                        label_desc.text = UtilsTool.stringFormat(StrVal.ACTIVITY_KINGMONSTER.STR12, [havenData.restMouse])
                        label_desc.color = UtilsUI.getEnoughColor(havenData.restMouse  > 0);
                    }
                }
                btn_challenge.grayed = isActivationSys
                btn_challenge.onClick(() => {
                    if (isActivationSys) {
                        UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.haven)
                        return
                    }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyHaven, 0, null);
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHomeList, 0, null);
                })
            } else if (item.id == HOME_TYPES.COMPANION) {
                let isActivationSys: boolean = !GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.companion)
                if (!isActivationSys) {
                    PointRedData.getInstance().registerPoint(group_item, PointRedType.LyCompanion)
                    label_desc.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR56, [GameServerData.getInstance().getPlayerFullInfo().companionData.stamina]);
                    label_desc.color = UtilsUI.getEnoughColor(GameServerData.getInstance().getPlayerFullInfo().companionData.stamina>0);
                }
                btn_challenge.grayed = isActivationSys
                btn_challenge.onClick(() => {
                    if (isActivationSys) {
                        UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.companion)
                        return
                    }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCompanion, 0, null);
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHomeList, 0, null);
                })
            } else if (item.id == HOME_TYPES.PALACE) {
                let isActivationSys: boolean = !GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.palace)
                if (!isActivationSys) {
                    PointRedData.getInstance().registerPoint(group_item, PointRedType.LyPalaceMain);
                }
                btn_challenge.grayed = isActivationSys
                btn_challenge.onClick(() => {
                    if (isActivationSys) {
                        UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.palace)
                        return
                    }
                    UtilsUI.lockWait();
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait();
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPalaceMain, 0, null);
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHomeList, 0, null);
                        } else {
                            UtilsUI.showMsgTip(args.errorcode);
                        }
                    }, "palaceGetInfo", null)
                })
            } else if (item.id == HOME_TYPES.CHARACTER) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyCharacter);
                btn_challenge.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCharacter, 0, null);
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHomeList, 0, null);
                })
            } else if (item.id == HOME_TYPES.BACKPACK) {
                //背包
                btn_challenge.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBackPack, 0, null);
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHomeList, 0, null);
                })
            }
        }
        list_item.numItems = this.CHALLENGE_ITEMS.length;

        // 重置高度适配（如果编辑器里高度跟当前高度相同，margin计算就会出问题）
        list_item.height = this.CHALLENGE_ITEMS.length * list_item.getChildAt(0).height
        + (this.CHALLENGE_ITEMS.length - 1) * list_item.lineGap
        + list_item.margin.top + list_item.margin.bottom;

        // 背景
        let img_back: fgui.GTextField = uiPanel.getChild("img_back");
        img_back.height = img_back.height - list_item.initHeight + list_item.height;

        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHomeList, 0, null);
        })
    }

    public getIsViewMask(): boolean {
        return false;
    }
}