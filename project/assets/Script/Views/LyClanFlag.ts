//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { Color } from "cc";
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
import { LyClanFound } from "./LyClanFound";
import { LyClanMain } from "./LyClanMain";
import { LyClanManage } from "./LyClanManage";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanFlag extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanFlag";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanFlag, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanFlag, 0, null);
        })
        this.uiPanel.getChild("label_bxl", fgui.GLabel).text = StrVal.LYCLAN.STR69
        let btn_ok: fgui.GButton = this.uiPanel.getChild("btn_ok");
        btn_ok.text = StrVal.LYCLAN.STR91
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        btn_ok.onClick(() => {
            if (playerClanInfo && playerClanInfo.clanInfo && playerClanInfo.clanInfo.guid) {
                let flagArr = LocaleData.getClanFlag()
                if (playerClanInfo.clanInfo.flag != flagArr[list_flag.selectedIndex].id) {
                    console.log(Number(flagArr[list_flag.selectedIndex].id));
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanFlag, 0, null);
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClan, 0, null);
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClanMain, 0, null);
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClanManage, 0, null);
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    }, "clanEditInfo", {
                        flag: Number(flagArr[list_flag.selectedIndex].id)
                    })
                } else {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanFlag, 0, null);
                }
            } else {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClanFound, 0, { flag: list_flag.selectedIndex });
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanFlag, 0, null);
            }
        })

        let flags = LocaleData.getClanFlag()
        let flagArr = []
        if (playerClanInfo && playerClanInfo.clanInfo && playerClanInfo.clanInfo.guid) {
            flagArr = flags
        } else {
            for (let index = 0; index < flags.length; index++) {
                const element = flags[index];
                if (element.type == "1") {
                    flagArr.push(flags[index])
                }
            }
        }
        let img_icon: fgui.GLoader = this.uiPanel.getChild("img_icon")
        img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [flagArr[0].icon]);
        let list_flag: fgui.GList = this.uiPanel.getChild("list_flag")
        let flagOwns = playerClanInfo.clanFlag
        list_flag.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let icon: fgui.GLoader = obj.getChild("img_icon")
            icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [flagArr[index].icon]);
            let img_ownFlag: fgui.GImage = obj.getChild("img_ownFlag")
            if (playerClanInfo && playerClanInfo.clanInfo && playerClanInfo.clanInfo.guid) {
                for (let i = 0; i < flagOwns.length; i++) {
                    const element = flagOwns[i].flagId;
                    if (element == flagArr[index].id) {
                        img_ownFlag.visible = false
                    }
                }
                // if (flagArr[index].type == "1") {
                //     obj.getChild("label_isFlag").visible = false
                // } else {
                obj.getChild("label_isFlag").visible = playerClanInfo.clanInfo.flag == flagArr[index].id
                // }

            } else {
                img_ownFlag.visible = flagArr[index].type != "1"
            }
            obj.onClick(() => {
                img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [flagArr[index].icon]);
            })
        }).bind(this)
        list_flag.selectedIndex = 0
        list_flag.numItems = flagArr.length
        if (playerClanInfo && playerClanInfo.clanInfo && playerClanInfo.clanInfo.guid) {
            let label_str60: fgui.GLabel = this.uiPanel.getChild("label_str60")
            label_str60.text = StrVal.LYCLAN.STR60
            let myselfInfo = playerClanInfo.myselfInfo
            label_str60.visible = myselfInfo.role != VarVal.CLAN_ROLE.leader
            btn_ok.enabled = myselfInfo.role == VarVal.CLAN_ROLE.leader
        }
    };




    public getIsViewMask(): boolean {
        return false;
    };

}