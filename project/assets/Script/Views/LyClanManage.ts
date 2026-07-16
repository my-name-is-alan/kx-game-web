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
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyClan } from "./LyClan";
import { LyClanFlag } from "./LyClanFlag";
import { LyClanMain } from "./LyClanMain";
import { LyClanRevise } from "./LyClanRevise";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanManage extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanManage";
    }
    private uiPanel: fgui.GComponent
    private clanInfo: any
    private label_declaration: fgui.GTextInput
    private label_notice: fgui.GTextInput

    public onViewCreate(): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            if (this.myselfInfo.role == VarVal.CLAN_ROLE.leader || this.myselfInfo.role == VarVal.CLAN_ROLE.deputy) {
                if (this.label_notice.text != this.clanInfo.notice || this.label_declaration.text != this.clanInfo.declaration) {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClan, 0, null);
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClanMain, 0, null);

                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanManage, 0, null);
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    }, "clanEditInfo", {
                        notice: this.label_notice.text,
                        declaration: this.label_declaration.text,
                    })
                } else {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanManage, 0, null);
                }
            } else {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanManage, 0, null);
            }
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            if (this.myselfInfo.role == VarVal.CLAN_ROLE.leader || this.myselfInfo.role == VarVal.CLAN_ROLE.deputy) {
                if (this.label_notice.text != this.clanInfo.notice || this.label_declaration.text != this.clanInfo.declaration) {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClan, 0, null);
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClanMain, 0, null);

                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanManage, 0, null);
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    }, "clanEditInfo", {
                        notice: this.label_notice.text,
                        declaration: this.label_declaration.text,
                    })
                } else {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanManage, 0, null);
                }
            } else {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanManage, 0, null);
            }
        })
        this.label_declaration = this.uiPanel.getChild("label_declaration")

        let label_bxl: fgui.GLabel = this.uiPanel.getChild("label_bxl")
        label_bxl.text = StrVal.LYCLAN.STR53

        this.uiPanel.getChild("label_str98", fgui.GLabel).text = StrVal.LYCLAN.STR98
        this.uiPanel.getChild("label_str99", fgui.GLabel).text = StrVal.LYCLAN.STR99
        this.uiPanel.getChild("label_str100", fgui.GLabel).text = StrVal.LYCLAN.STR100
        this.uiPanel.getChild("label_str101", fgui.GLabel).text = StrVal.LYCLAN.STR101
        this.uiPanel.getChild("label_str102", fgui.GLabel).text = StrVal.LYCLAN.STR103
        this.uiPanel.getChild("label_str103", fgui.GLabel).text = StrVal.LYCLAN.STR102
        this.initialize()

        let ClanXmlData = LocaleData.getClanByLevel(this.clanInfo.level)

        let label_number: fgui.GLabel = this.uiPanel.getChild("label_number")
        label_number.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR5, [this.clanInfo.number, ClanXmlData.number])
        let label_combatPower: fgui.GLabel = this.uiPanel.getChild("label_combatPower")
        label_combatPower.text = UtilsTool.nToFStr(this.clanInfo.combatPower)
        let label_guid: fgui.GLabel = this.uiPanel.getChild("label_guid")
        label_guid.text = this.clanInfo.shortId



        let btn_clanFlag: fgui.GButton = this.uiPanel.getChild("btn_clanFlag")
        btn_clanFlag.visible = this.myselfInfo.role == VarVal.CLAN_ROLE.leader
        btn_clanFlag.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanFlag, 0, null);
        })
        let btn_name: fgui.GButton = this.uiPanel.getChild("btn_name")
        btn_name.visible = this.myselfInfo.role == VarVal.CLAN_ROLE.leader || this.myselfInfo.role == VarVal.CLAN_ROLE.deputy
        btn_name.clearClick()
        btn_name.onClick(() => {
            // if (this.myselfInfo.role != VarVal.CLAN_ROLE.leader) {
            //     UtilsUI.showMsgTip(StrVal.LYCLAN.STR59)
            //     return
            // }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanRevise, 0, { reviseType: 1 });//改名
        })
        let btn_vx: fgui.GButton = this.uiPanel.getChild("btn_vx")
        btn_vx.visible = this.myselfInfo.role == VarVal.CLAN_ROLE.leader
        btn_vx.clearClick()
        btn_vx.onClick(() => {
            // if (this.myselfInfo.role != VarVal.CLAN_ROLE.leader) {
            //     UtilsUI.showMsgTip(StrVal.LYCLAN.STR59)
            //     return
            // }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanRevise, 0, { reviseType: 2 });//改微信
        })
        let btn_copyGuid: fgui.GButton = this.uiPanel.getChild("btn_copyGuid")
        btn_copyGuid.clearClick()
        btn_copyGuid.onClick(() => {
            PlatformAPI.doSdkCopyToClipboard((errmsg: string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                } else {
                    UtilsUI.showMsgTip(StrVal.LYSETTING.STR32);
                }
            }, String(this.clanInfo.shortId))
        })
        let btn_copyVx: fgui.GButton = this.uiPanel.getChild("btn_copyVx")
        btn_copyVx.clearClick()
        btn_copyVx.onClick(() => {
            if (this.clanInfo.contact) {
                PlatformAPI.doSdkCopyToClipboard((errmsg: string) => {
                    if (errmsg) {
                        UtilsUI.showMsgTip(errmsg);
                    } else {
                        UtilsUI.showMsgTip(StrVal.LYSETTING.STR32);
                    }
                }, String(this.clanInfo.contact))
            }
        })
        let btn_declaration: fgui.GButton = this.uiPanel.getChild("btn_declaration")
        btn_declaration.visible = this.myselfInfo.role == VarVal.CLAN_ROLE.leader || this.myselfInfo.role == VarVal.CLAN_ROLE.deputy
        btn_declaration.clearClick()
        btn_declaration.onClick(() => {
            this.label_declaration.requestFocus();
        })
        let btn_notice: fgui.GButton = this.uiPanel.getChild("btn_notice")
        btn_notice.visible = this.myselfInfo.role == VarVal.CLAN_ROLE.leader || this.myselfInfo.role == VarVal.CLAN_ROLE.deputy
        btn_notice.clearClick()
        btn_notice.onClick(() => {
            this.label_notice.requestFocus();
        })
    };
    private myselfInfo
    private initialize(): void {
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        this.clanInfo = playerClanInfo.clanInfo
        let clanMember = playerClanInfo.clanMember
        this.myselfInfo = playerClanInfo.myselfInfo

        let label_name: fgui.GLabel = this.uiPanel.getChild("label_name")
        label_name.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR21, [this.clanInfo.name, this.clanInfo.level])
        let label_contact: fgui.GLabel = this.uiPanel.getChild("label_contact")
        label_contact.text = this.clanInfo.contact

        UtilsUI.setGTextInputAlign(this.label_declaration, HorizontalTextAlignment.LEFT, VerticalTextAlignment.TOP, Overflow.CLAMP);
        this.label_declaration.enabled = this.myselfInfo.role == VarVal.CLAN_ROLE.leader || this.myselfInfo.role == VarVal.CLAN_ROLE.deputy
        this.label_declaration.text = this.clanInfo.declaration
        this.label_notice = this.uiPanel.getChild("label_notice")
        UtilsUI.setGTextInputAlign(this.label_notice, HorizontalTextAlignment.LEFT, VerticalTextAlignment.TOP, Overflow.CLAMP);
        this.label_notice.enabled = this.myselfInfo.role == VarVal.CLAN_ROLE.leader || this.myselfInfo.role == VarVal.CLAN_ROLE.deputy
        this.label_notice.text = this.clanInfo.notice
        let img_flag: fgui.GLoader = this.uiPanel.getChild("img_flag")
        img_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(this.clanInfo.flag).icon])
        img_flag.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanFlag, 0, null);
        })
    }

    public onViewUpdate(params: any): void {
        this.initialize()
    }


    public getIsViewMask(): boolean {
        return false;
    };

}


