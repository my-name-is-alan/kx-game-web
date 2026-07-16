//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { Color, HorizontalTextAlignment, Overflow, VerticalTextAlignment } from "cc";
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyClan } from "./LyClan";
import { LyClanMain } from "./LyClanMain";
import { LyClanManage } from "./LyClanManage";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanRevise extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanRevise";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanRevise, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanRevise, 0, null);
        })

        let label_revise: fgui.GTextInput = this.uiPanel.getChild("label_revise")
        UtilsUI.setGTextInputAlign(label_revise, HorizontalTextAlignment.CENTER, VerticalTextAlignment.CENTER, Overflow.CLAMP);
        let btn_revise: fgui.GButton = this.uiPanel.getChild("btn_revise");

        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanInfo = playerClanInfo.clanInfo
        let label_title: fgui.GLabel = this.uiPanel.getChild("label_title")
        if (params.reviseType == 1) {//改名
            label_title.text = StrVal.LYCLAN.STR71
            label_revise.text = clanInfo.name
        } else if (params.reviseType == 2) {//微信
            label_revise.text = clanInfo.contact
            label_title.text = StrVal.LYCLAN.STR70
        }
        btn_revise.text = StrVal.LYCLAN.STR72
        let group_needItem: fgui.GComponent = this.uiPanel.getChild("group_needItem")
        group_needItem.visible = params.reviseType == 1

        if (params.reviseType == 1) {
            let loader_item: fgui.GLoader = group_needItem.getChild("loader_item")
            loader_item.url = UtilsUI.getItemIconUrl(VarVal.bonusType.stone);
            let label_number: fgui.GTextField = group_needItem.getChild("label_number")
            let clanRenameStone: number = Number(LocaleData.getClanRoot().clanRenameStone)
            let stone: number = Number(GameServerData.getInstance().getPlayerFullInfo().base.stone)
            label_number.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR5, [stone, clanRenameStone])
            label_number.color = UtilsUI.getEnoughColor(clanRenameStone <= stone)
        }
        btn_revise.onClick(() => {
            if (params.reviseType == 1) {//改名
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClan, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClanMain, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClanManage, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanRevise, 0, null);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "clanRename", {
                    name: label_revise.text
                })
            } else if (params.reviseType == 2) {//微信
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClanMain, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClanManage, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanRevise, 0, null);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "clanEditInfo", {
                    contact: label_revise.text
                })
            }
        })
    };




    public getIsViewMask(): boolean {
        return false;
    };

}