//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { HorizontalTextAlignment, Overflow, VerticalTextAlignment } from "cc";
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyLoginNotice } from "./LyLoginNotice";
export class LySettingMsgBox extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LySetting";
        this.viewResI.pkgName = "LySetting";
        this.viewResI.comName = "LySettingMsgBox";
    }
    public onViewCreate(params): void {
        let uiPanel: fgui.GComponent = this.getUiPanel().getChild("group_main")
        UtilsUI.playCommonGroupAni(uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LySettingMsgBox, 0, null);
        })
        let btn_close1: fgui.GButton = this.getUiPanel().getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LySettingMsgBox, 0, null);
        })
        let group_rename: fgui.GGraph = uiPanel.getChild("group_rename")
        let group_code: fgui.GGraph = uiPanel.getChild("group_code")
        let group_blessing: fgui.GGraph = uiPanel.getChild("group_blessing")
        let label_title: fgui.GLabel = uiPanel.getChild("label_title")
        if (params.type == 1) {
            group_rename.visible = true
            label_title.text = StrVal.LYSETTING.STR20;
            let label_name: fgui.GTextInput = uiPanel.getChild("label_name")
            let btn_rename: fgui.GButton = uiPanel.getChild("btn_rename")
            UtilsUI.setGTextInputAlign(label_name, HorizontalTextAlignment.CENTER, VerticalTextAlignment.CENTER, Overflow.CLAMP);
            label_name.promptText = StrVal.LYSETTING.STR23;
            btn_rename.text = StrVal.LYSETTING.STR20
            btn_rename.onClick(() => {
                let name: string = label_name.text;
                if (!name || name.length == 0) {
                    UtilsUI.showMsgTip(StrVal.LYCREATEROLE.STR1);
                    return;
                } else if (UtilsTool.getUTF8Count(name) > VarVal.CHARLENGTH.CREATEROLE) {
                    UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.COMMON.STR7, [VarVal.CHARLENGTH.CREATEROLE / 2]))
                    return;
                } else if (UtilsTool.hasSensitive(name)) {
                    UtilsUI.showMsgTip(StrVal.LYCREATEROLE.STR2);
                    return;
                }
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LySettingMsgBox, 0, null);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "rename", { name: name });
            })
            let fullInfoBase = GameServerData.getInstance().getPlayerFullInfo().base
            let playerRoot: any = LocaleData.getPlayerRoot()
            let renameNumMax = playerRoot.changeNameCardLimit
            let label_renameNum: fgui.GTextField = uiPanel.getChild("label_renameNum")
            label_renameNum.text = UtilsTool.stringFormat(StrVal.LYSETTING.STR33, [(Number(renameNumMax) - Number(fullInfoBase.renameNum)), renameNumMax])
            label_renameNum.color = UtilsUI.getEnoughColor((Number(renameNumMax) - Number(fullInfoBase.renameNum)) < renameNumMax);
            let group_itemNum: fgui.GComponent = uiPanel.getChild("group_itemNum")
            let label_itemNum: fgui.GTextField = group_itemNum.getChild("label_itemNum")

            let mainCount = GameServerData.getInstance().getItemCountByProtoId(playerRoot.changeNameCardId)
            label_itemNum.text = UtilsTool.stringFormat(StrVal.LYSETTING.STR34, [mainCount, 1]);
            label_itemNum.color = UtilsUI.getEnoughColor(mainCount >= 1);
        } else if (params.type == 2) {
            group_code.visible = true
            label_title.text = StrVal.LYSETTING.STR9;
            let label_code: fgui.GTextInput = uiPanel.getChild("label_code")
            UtilsUI.setGTextInputAlign(label_code, HorizontalTextAlignment.CENTER, VerticalTextAlignment.CENTER, Overflow.CLAMP);
            label_code.promptText = StrVal.LYSETTING.STR22;
            let btn_code: fgui.GButton = uiPanel.getChild("btn_code")
            btn_code.text = StrVal.LYSETTING.STR21
            let requestInFlight: boolean = false
            let finishRequest = () => {
                requestInFlight = false
                btn_code.touchable = true
                UtilsUI.unlockWait();
            }
            btn_code.onClick(() => {
                if (requestInFlight) { return; }
                let cdkey: string = (label_code.text || "").trim()
                if (!cdkey) {
                    UtilsUI.showMsgTip(StrVal.LYSETTING.STR22);
                    return;
                }
                requestInFlight = true
                btn_code.touchable = false
                UtilsUI.lockWait();
                try {
                    GameServer.getInstance().send((args: any) => {
                        finishRequest();
                        if (args.errorcode == 0) {
                            if (args.replayed !== 1 && args.bonusesResult) {
                                UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                            }
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LySettingMsgBox, 0, null);
                        } else {
                            UtilsUI.showMsgTip(args.errorcode);
                        }
                    }, "cdkey", { cdkey: cdkey });
                } catch (error) {
                    finishRequest();
                    UtilsUI.showMsgTip(String(error));
                }
            })
        } else if (params.type == 4) {
            group_code.visible = true
            label_title.text = StrVal.LYSETTING.STR49;
            let label_code: fgui.GTextInput = uiPanel.getChild("label_code")
            UtilsUI.setGTextInputAlign(label_code, HorizontalTextAlignment.CENTER, VerticalTextAlignment.CENTER, Overflow.CLAMP);
            label_code.promptText = StrVal.LYSETTING.STR52;
            let btn_code: fgui.GButton = uiPanel.getChild("btn_code")
            btn_code.text = StrVal.LYSETTING.STR53
            btn_code.onClick(() => {
                let code: string = (label_code.text || "").trim();
                if (!code) {
                    UtilsUI.showMsgTip(StrVal.LYSETTING.STR52);
                    return;
                }
                UtilsUI.lockWait();
                PlatformAPI.bindHdhiveWithCode(code, (res: any) => {
                    UtilsUI.unlockWait();
                    if (res && res.errmsg) {
                        UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYSETTING.STR56, [res.errmsg]));
                    } else {
                        UtilsUI.showMsgTip(StrVal.LYSETTING.STR55);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LySettingMsgBox, 0, null);
                    }
                });
            })
        } else if (params.type == 3) {
            group_blessing.visible = true
            label_title.text = StrVal.LYSETTING.STR29;
            let label_blessing: fgui.GTextInput = uiPanel.getChild("label_blessing")
            UtilsUI.setGTextInputAlign(label_blessing, HorizontalTextAlignment.CENTER, VerticalTextAlignment.CENTER, Overflow.CLAMP);
            label_blessing.promptText = StrVal.LYSETTING.STR30;
            let btn_blessing: fgui.GButton = uiPanel.getChild("btn_blessing")
            btn_blessing.text = StrVal.LYSETTING.STR31
            btn_blessing.onClick(() => {

            })
        }

        this.initialize()

    };

    private initialize(): void {

    }


    public getIsViewMask(): boolean {
        return false;
    };

}
