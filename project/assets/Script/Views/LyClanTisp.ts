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
import { LyClanLog } from "./LyClanLog";
import { LyClanMain } from "./LyClanMain";
import { LyClanManage } from "./LyClanManage";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanTisp extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanTisp";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params: any): void {
        let tispType: number = params.tispType
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanTisp, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanTisp, 0, null);
        })
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanInfo = playerClanInfo.clanInfo
        let clanMember = playerClanInfo.clanMember
        let myselfInfo = playerClanInfo.myselfInfo
        let group_info: fgui.GGroup = this.uiPanel.getChild("group_info")
        let group_manage: fgui.GGroup = this.uiPanel.getChild("group_manage")
        group_info.visible = tispType == 1
        group_manage.visible = tispType == 2
        this.uiPanel.getChild("label_bxl", fgui.GLabel).text = StrVal.LYCLAN.STR97
        if (tispType == 1) {
            //******************************信息 ************************/
            let label_name1: fgui.GLabel = this.uiPanel.getChild("label_name1");
            label_name1.text = myselfInfo.playerInfo.name
            let btn_clanManage: fgui.GButton = this.uiPanel.getChild("btn_clanManage");
            btn_clanManage.text = StrVal.LYCLAN.STR53
            btn_clanManage.onClick(() => {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanManage, 0, null);
            })
            let btn_clanLog: fgui.GButton = this.uiPanel.getChild("btn_clanLog");
            btn_clanLog.text = StrVal.LYCLAN.STR54
            btn_clanLog.onClick(() => {
                // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanLog, 0, { type: 0 });
            })
            let btn_leaveClan: fgui.GButton = this.uiPanel.getChild("btn_leaveClan");
            btn_leaveClan.text = StrVal.LYCLAN.STR55
            btn_leaveClan.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanTisp, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanMain, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClan, 0, null);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "leaveClan", {
                })
            })

            let btn_dissolveClan: fgui.GButton = this.uiPanel.getChild("btn_dissolveClan");
            btn_dissolveClan.text = StrVal.LYCLAN.STR56
            btn_dissolveClan.visible = myselfInfo.role == VarVal.CLAN_ROLE.leader
            btn_dissolveClan.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanTisp, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanMain, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClan, 0, null);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "dissolveClan", {
                })
            })

        } else if (tispType == 2) {
            //******************************管理 ************************/


            let clanMemberItem: any = params.clanMemberItem

            let playerInfo = clanMemberItem.playerInfo
            let label_name2: fgui.GLabel = this.uiPanel.getChild("label_name2");
            label_name2.text = playerInfo.name

            let group_head: fgui.GComponent = this.uiPanel.getChild("group_head");
            let loader_icon: fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            let charInfo = LocaleData.getCharShowResInfo(playerInfo.character, playerInfo.phase, playerInfo.appearance, playerInfo.avatar);
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);

            let btn_clanKickMember: fgui.GButton = this.uiPanel.getChild("btn_clanKickMember")
            btn_clanKickMember.text = StrVal.LYCLAN.STR50
            btn_clanKickMember.onClick(() => {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO2, "",
                    UtilsTool.stringFormat(StrVal.LYCLAN.STR27, [playerInfo.name]), null,
                    StrVal.COMMON.STR32, null,
                    StrVal.COMMON.STR33, () => {
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClan, 0, null);
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClanMain, 0, null);

                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanTisp, 0, null);
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        }, "clanKickMember", {
                            playerId: clanMemberItem.playerId,
                        })
                    }, "", null)


            })
            let intRole1: number = 0//普通成员数量
            let intRole2: number = 0//精英数量
            let intRole9: number = 0//副帮主数量
            let intRole10: number = 0//帮主数量
            for (let i = 0; i < clanMember.length; i++) {
                let item = clanMember[i]
                if (item.role == VarVal.CLAN_ROLE.member) {
                    intRole1++
                } else if (item.role == VarVal.CLAN_ROLE.elite) {
                    intRole2++
                } else if (item.role == VarVal.CLAN_ROLE.deputy) {
                    intRole9++
                } else if (item.role == VarVal.CLAN_ROLE.leader) {
                    intRole10++
                }
            }
            let btn_clanDesignateMember1: fgui.GButton = this.uiPanel.getChild("btn_clanDesignateMember1")
            let btn_clanDesignateMember2: fgui.GButton = this.uiPanel.getChild("btn_clanDesignateMember2")
            let btn_clanDesignateMember9: fgui.GButton = this.uiPanel.getChild("btn_clanDesignateMember9")
            let btn_clanDesignateMember10: fgui.GButton = this.uiPanel.getChild("btn_clanDesignateMember10")
            // btn_clanDesignateMember10.visible = myselfInfo.role != 9
            let c1: fgui.Controller = this.uiPanel.getController("c1")
            c1.selectedIndex = myselfInfo.role != VarVal.CLAN_ROLE.deputy ? 0 : 1
            if (clanMemberItem.role == VarVal.CLAN_ROLE.leader) {
                c1.selectedIndex = 2
            }


            let ClanXmlData: any = LocaleData.getClanByLevel(clanInfo.level)
            btn_clanDesignateMember1.text = StrVal.LYCLAN.STR52
            btn_clanDesignateMember2.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR7, [intRole2, ClanXmlData.elite])
            btn_clanDesignateMember9.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR6, [intRole9, ClanXmlData.deputy])
            btn_clanDesignateMember10.text = StrVal.LYCLAN.STR51
            btn_clanDesignateMember2.enabled = intRole2 < Number(ClanXmlData.elite)
            btn_clanDesignateMember9.enabled = intRole9 < Number(ClanXmlData.deputy)

            if (btn_clanDesignateMember1.enabled) {
                btn_clanDesignateMember1.enabled = clanMemberItem.role != VarVal.CLAN_ROLE.member
            }
            if (btn_clanDesignateMember2.enabled) {
                btn_clanDesignateMember2.enabled = clanMemberItem.role != VarVal.CLAN_ROLE.elite
            }


            if (btn_clanDesignateMember9.enabled) {
                btn_clanDesignateMember9.enabled = clanMemberItem.role != VarVal.CLAN_ROLE.deputy
            }
            if (btn_clanDesignateMember10.enabled) {
                btn_clanDesignateMember10.enabled = clanMemberItem.role != VarVal.CLAN_ROLE.leader
            }

            btn_clanDesignateMember1.onClick(() => {
                this.onClanDesignateMember(VarVal.CLAN_ROLE.member, clanMemberItem.playerId)
            })
            btn_clanDesignateMember2.onClick(() => {
                this.onClanDesignateMember(VarVal.CLAN_ROLE.elite, clanMemberItem.playerId)
            })
            btn_clanDesignateMember9.onClick(() => {
                this.onClanDesignateMember(VarVal.CLAN_ROLE.deputy, clanMemberItem.playerId)
            })
            btn_clanDesignateMember10.onClick(() => {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO2, "",
                    UtilsTool.stringFormat(StrVal.LYCLAN.STR26, [playerInfo.name]), null,
                    StrVal.COMMON.STR32, null,
                    StrVal.COMMON.STR33, () => {
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClanMain, 0, null);
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClan, 0, null);

                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanTisp, 0, null);
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        }, "transferLeader", {
                            playerId: clanMemberItem.playerId,
                        })
                    }, "", null)



            })



            let btn_dissolveClanSelf: fgui.GButton = this.uiPanel.getChild("btn_dissolveClanSelf");
            btn_dissolveClanSelf.text = StrVal.LYCLAN.STR56
            btn_dissolveClanSelf.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanTisp, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanMain, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClan, 0, null);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "dissolveClan", {
                })
            })
            let btn_leaveClanSelf: fgui.GButton = this.uiPanel.getChild("btn_leaveClanSelf");
            btn_leaveClanSelf.text = StrVal.LYCLAN.STR55
            btn_leaveClanSelf.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanTisp, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanMain, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClan, 0, null);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "leaveClan", {
                })
            })
        }
    };

    private onClanDesignateMember(role: number, playerId: string): void {
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClanMain, 0, null);
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClan, 0, null);

                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanTisp, 0, null);
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "clanDesignateMember", {
            playerId: playerId,
            role: role
        })
    }


    public getIsViewMask(): boolean {
        return false;
    };

}