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
import { LocaleUser } from "../Kernel/LocaleUser";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyClan } from "./LyClan";

export class LyClanApply extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanApply";
    }
    private btn_sort: fgui.GButton
    private clanInfo: any
    private myselfInfo: any
    private group_clanApply: fgui.GComponent
    public onViewCreate(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel()
        this.group_clanApply = uiPanel.getChild("group_clanApply")
        UtilsUI.playCommonGroupAni(this.group_clanApply, null)
        // 关闭
        let btn_close: fgui.GButton = uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            if ((this.myselfInfo.role == 0 || this.myselfInfo.role == 1) && ((btn_needApply.selected ? 0 : 1) == Number(this.clanInfo.needApply)) && Number(cbox_mixPlayerPhase.value) == Number(this.clanInfo.mixPlayerPhase)) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanApply, 0, null);
            } else {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanApply, 0, null);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanApply, 0, null);
                    }
                }, "clanEditInfo", {
                    needApply: btn_needApply.selected ? 0 : 1,
                    mixPlayerPhase: Number(cbox_mixPlayerPhase.value),
                })
            }
        })
        let btn_close1: fgui.GButton = this.group_clanApply.getChild("btn_close1");
        btn_close1.onClick(() => {
            if ((this.myselfInfo.role == 0 || this.myselfInfo.role == 1) && ((btn_needApply.selected ? 0 : 1) == Number(this.clanInfo.needApply)) && Number(cbox_mixPlayerPhase.value) == Number(this.clanInfo.mixPlayerPhase)) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanApply, 0, null);
            } else {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanApply, 0, null);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanApply, 0, null);
                    }
                }, "clanEditInfo", {
                    needApply: btn_needApply.selected ? 0 : 1,
                    mixPlayerPhase: Number(cbox_mixPlayerPhase.value),
                })
            }
        })
        this.btn_sort = this.group_clanApply.getChild("btn_sort")
        this.btn_sort.selected = LocaleUser.getUser(VarVal.FIELD_SV.CLAN_APPLY_SORT) == "1"
        this.btn_sort.onClick(() => {
            LocaleUser.setUser(VarVal.FIELD_SV.CLAN_APPLY_SORT, this.btn_sort.selected ? "1" : "0");
            LocaleUser.flush()
            this.onListClanApply()
        })

        let btn_clanApproveMemberNo: fgui.GButton = this.group_clanApply.getChild("btn_clanApproveMemberNo")
        btn_clanApproveMemberNo.clearClick()
        btn_clanApproveMemberNo.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                this.onListClanApply()
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClan, 0, null);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "clanApproveMember", {

            })
        })
        this.onListClanApply()
        this.group_clanApply.getChild("label_bxl").text = StrVal.LYCLAN.STR111

        let cbox_mixPlayerPhase: fgui.GComboBox = this.group_clanApply.getChild("cbox_mixPlayerPhase")
        let btn_mixPlayerPhase: fgui.GButton = this.group_clanApply.getChild("btn_mixPlayerPhase")
        let btn_needApply: fgui.GButton = this.group_clanApply.getChild("btn_needApply")

        btn_needApply.selected = this.clanInfo.needApply == 0
        btn_mixPlayerPhase.selected = this.clanInfo.mixPlayerPhase > 0
        let phaseArr = LocaleData.getPlayerPhase()
        let phaseAttrValues: any = []
        let phaseAttrItems: any = []
        for (let i = 0; i < phaseArr.length; i++) {
            const element = phaseArr[i];
            if (i % 3 == 0) {
                phaseAttrItems.push(element.phaseName)
                phaseAttrValues.push(element.id)
            }
        }
        cbox_mixPlayerPhase.items = phaseAttrItems
        cbox_mixPlayerPhase.values = phaseAttrValues
        cbox_mixPlayerPhase.value = this.clanInfo.mixPlayerPhase == 0 ? phaseAttrValues[0] : String(this.clanInfo.mixPlayerPhase)

    };

    private onListClanApply(): void {
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        this.clanInfo = playerClanInfo.clanInfo
        this.myselfInfo = playerClanInfo.myselfInfo
        let clanApply = playerClanInfo.clanApply
        if (this.btn_sort.selected) {
            let clanApplySort = []
            for (let i = 0; i < clanApply.length; i++) {
                const element = clanApply[i];
                clanApplySort.push(element)
            }

            clanApplySort.sort((a, b) => {
                let aPlayerInfo = a.playerInfo
                let bPlayerInfo = b.playerInfo
                let aCombatPower = Number(aPlayerInfo.combatPower)
                let bCombatPower = Number(bPlayerInfo.combatPower)
                return bCombatPower - aCombatPower
            })
            clanApply = clanApplySort
        }
        let list_clanApply: fgui.GList = this.group_clanApply.getChild("list_clanApply")
        list_clanApply.numItems = 0
        list_clanApply.setVirtual();
        list_clanApply.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let data = clanApply[index]
            let group_head: fgui.GComponent = obj.getChild("group_head");
            let loader_icon: fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            let playerInfo = data.playerInfo
            let charInfo = LocaleData.getCharShowResInfo(playerInfo.character, playerInfo.phase, playerInfo.appearance, playerInfo.avatar);
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            obj.getChild("label_name").text = data.playerInfo.name
            obj.getChild("label_combatPower").text = UtilsTool.nToFStr(data.playerInfo.combatPower)
            obj.getChild("label_uid").text = data.playerInfo.uid
            // obj.getChild("label_lastOfflineTime").text = UtilsTool.pastTimeToString(data.applyTime)
            obj.getChild("btn_clanApproveMember").clearClick()
            obj.getChild("btn_clanApproveMember").onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    this.onListClanApply()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClan, 0, null);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "clanApproveMember", {
                    playerId: data.playerInfo.guid,
                    pass: 1,
                })
            })
            obj.getChild("btn_clanApproveMemberNo").clearClick()
            obj.getChild("btn_clanApproveMemberNo").onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    this.onListClanApply()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClan, 0, null);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "clanApproveMember", {
                    playerId: data.playerInfo.guid,
                    pass: 0,
                })
            })
            obj.getChild("btn_item").clearClick()
            obj.getChild("btn_item").onClick(() => {
                UtilsUI.onShowPlayerInfo(data.playerInfo.guid)
            })
        }).bind(this)
        list_clanApply.numItems = clanApply.length
    }

    public static isViewRedPoint(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.clan) || !GameServerData.getInstance().isClanHas()) {
            return false;
        }
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanApply = playerClanInfo.clanApply
        return clanApply.length > 0
    }

    public getIsViewMask(): boolean {
        return false;
    };

}