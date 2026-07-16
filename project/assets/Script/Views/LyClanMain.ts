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
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyClan } from "./LyClan";
import { LyClanFlag } from "./LyClanFlag";
import { LyClanLog } from "./LyClanLog";
import { LyClanManage } from "./LyClanManage";
import { LyClanTisp } from "./LyClanTisp";

export class LyClanMain extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanMain";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanMain, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanMain, 0, null);
        })
        let btn_clanTisp: fgui.GButton = this.uiPanel.getChild("btn_clanTisp")
        btn_clanTisp.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanManage, 0, null);
        })
        let btn_clanLog: fgui.GButton = this.uiPanel.getChild("btn_clanLog")
        btn_clanLog.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanLog, 0, { type: 0 });
        })
        this.uiPanel.getChild("label_str93", fgui.GLabel).text = StrVal.LYCLAN.STR93
        this.uiPanel.getChild("label_str94", fgui.GLabel).text = StrVal.LYCLAN.STR94
        this.uiPanel.getChild("label_str95", fgui.GLabel).text = StrVal.LYCLAN.STR95
        this.uiPanel.getChild("label_bxl", fgui.GLabel).text = StrVal.LYCLAN.STR96
        this.initialize()
    };

    private initialize(): void {
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanInfo = playerClanInfo.clanInfo
        let clanMember = playerClanInfo.clanMember
        let myselfInfo = playerClanInfo.myselfInfo
        let clanFlag = playerClanInfo.clanFlag

        let clanBuy = playerClanInfo.clanBuy
        let clanLog = playerClanInfo.clanLog
        let clanRecharge = playerClanInfo.clanRecharge
        let clanApply = playerClanInfo.clanApply

        console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓帮派信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        console.log(clanInfo);
        console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓自己信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        console.log(myselfInfo);
        console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓所有成员↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        console.log(clanMember);
        console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓帮派旗帜↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        console.log(clanFlag);
        console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓购买信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        console.log(clanBuy);
        console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓帮派动态↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        console.log(clanLog);
        console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓帮派充值↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        console.log(clanRecharge);
        console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓申请列表↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        console.log(clanApply);
        let img_flag: fgui.GLoader = this.uiPanel.getChild("img_flag")
        img_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(clanInfo.flag).icon])
        img_flag.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanFlag, 0, {});
        })
        let ClanXmlData = LocaleData.getClanByLevel(clanInfo.level)
        let label_number: fgui.GLabel = this.uiPanel.getChild("label_number")
        label_number.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR5, [clanMember.length, ClanXmlData.number])

        let bar_point: fgui.GProgressBar = this.uiPanel.getChild("bar_point")
        bar_point.max = ClanXmlData.exp
        bar_point.value = clanInfo.exp

        let label_name: fgui.GLabel = this.uiPanel.getChild("label_name")
        label_name.text = clanInfo.name
        let btn_copyVx: fgui.GButton = this.uiPanel.getChild("btn_copyVx")
        btn_copyVx.clearClick()
        btn_copyVx.onClick(() => {
            if (clanInfo.contact) {
                PlatformAPI.doSdkCopyToClipboard((errmsg: string) => {
                    if (errmsg) {
                        UtilsUI.showMsgTip(errmsg);
                    } else {
                        UtilsUI.showMsgTip(StrVal.LYSETTING.STR32);
                    }
                }, String(clanInfo.contact))
            }
        })

        let label_combatPower: fgui.GLabel = this.uiPanel.getChild("label_combatPower")
        label_combatPower.text = UtilsTool.nToFStr(clanInfo.combatPower)

        let label_level: fgui.GLabel = this.uiPanel.getChild("label_level")
        label_level.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR2, [clanInfo.level])

        // let label_guid: fgui.GLabel = this.uiPanel.getChild("label_guid")
        // label_guid.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR3, [clanInfo.shortId])

        let label_contact: fgui.GLabel = this.uiPanel.getChild("label_contact")
        if (clanInfo.contact) {
            label_contact.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR4, [clanInfo.contact])
        } else {
            label_contact.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR4, [StrVal.LYCLAN.STR138])
        }


        let label_declaration: fgui.GLabel = this.uiPanel.getChild("label_declaration", fgui.GComponent).getChild("label_dec")
        label_declaration.text = clanInfo.declaration

        let list_people: fgui.GList = this.uiPanel.getChild("list_people")
        // list_people.numItems = 0

        clanMember.sort((a, b) => {
            let aRole = Number(a.role)
            let bRole = Number(b.role)
            let acombatPower = Number(a.playerInfo.combatPower)
            let bcombatPower = Number(b.playerInfo.combatPower)
            if (aRole == bRole) {
                return bcombatPower - acombatPower
            } else {
                return bRole - aRole
            }
        })

        let tispStr: string = myselfInfo.role == VarVal.CLAN_ROLE.leader ? StrVal.LYCLAN.STR148 : StrVal.LYCLAN.STR147
        // list_people.setVirtual();
        list_people.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let clanMemberItem = clanMember[index]
            let btn_clanTisp: fgui.GButton = obj.getChild("btn_clanTisp")
            btn_clanTisp.text = StrVal.LYCLAN.STR129
            btn_clanTisp.clearClick()
            btn_clanTisp.onClick(() => {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanTisp, 0, { tispType: 2, clanMemberItem: clanMemberItem });
            })
            btn_clanTisp.visible = false
            if (myselfInfo.role == VarVal.CLAN_ROLE.deputy || myselfInfo.role == VarVal.CLAN_ROLE.leader) {
                if (myselfInfo.role > clanMemberItem.role) {
                    btn_clanTisp.visible = true
                }
            }
            let btn_leaveClan: fgui.GButton = obj.getChild("btn_leaveClan")
            btn_leaveClan.text = StrVal.LYCLAN.STR128
            btn_leaveClan.visible = false
            if (myselfInfo.playerId == clanMemberItem.playerId) {
                btn_leaveClan.visible = true
                btn_leaveClan.clearClick()
                btn_leaveClan.onClick(() => {
                    UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO2, "",
                        tispStr, null,
                        StrVal.COMMON.STR32, null,
                        StrVal.COMMON.STR33, () => {
                            // if (clanMemberItem.role == VarVal.CLAN_ROLE.leader) {
                            //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanTisp, 0, { tispType: 2, clanMemberItem: clanMemberItem });
                            // } else {
                            UtilsUI.lockWait()
                            GameServer.getInstance().send((args: any) => {
                                UtilsUI.unlockWait()
                                if (args.errorcode == 0) {
                                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClan, 0, null);
                                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanMain, 0, null);
                                } else {
                                    UtilsUI.showMsgTip(args.errorcode)
                                }
                            }, "leaveClan", {
                            })
                            // }
                        }, "", null)
                })
            }
            let playerInfo = clanMemberItem.playerInfo
            obj.getChild("label_name").text = playerInfo.name
            obj.getChild("label_combatPower").text = UtilsTool.nToFStr(playerInfo.combatPower)
            obj.getChild("label_point").text = UtilsTool.stringFormat(StrVal.LYCLAN.STR5, [clanMemberItem.dailyPoint, clanMemberItem.clanPoint])
            let img_role: fgui.GLoader = obj.getChild("img_role")
            img_role.url = UtilsTool.stringFormat("ui://LyClan/role{0}", [clanMemberItem.role])
            let charInfo = LocaleData.getCharShowResInfo(playerInfo.character, playerInfo.phase, playerInfo.appearance, playerInfo.avatar);
            let group_head: fgui.GComponent = obj.getChild("group_head");
            let loader_icon: fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            group_head.clearClick()
            group_head.onClick(() => {
                UtilsUI.onShowPlayerInfo(clanMemberItem.playerId)
            })
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);

            let label_lastOfflineTime: fgui.GLabel = obj.getChild("label_lastOfflineTime")
            if (clanMemberItem.isOnline) {
                label_lastOfflineTime.text = StrVal.LYCLAN.STR131
            } else {
                label_lastOfflineTime.text = UtilsTool.pastTimeToString(playerInfo.lastOfflineTime)

            }
            if (btn_clanTisp.visible || btn_leaveClan.visible) {
                label_lastOfflineTime.y = 33
            } else {
                label_lastOfflineTime.y = 51
            }

        }).bind(this)
        list_people.numItems = clanMember.length
        // UtilsUI.setFguiGlistDelayNumItems(this.list_pet, LocaleData.getPetBackpackByIndex("").length);
    }
    public onViewUpdate(params: any): void {
        this.initialize()
    }

    public getIsViewMask(): boolean {
        return false;
    };

}