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

export class LyClanInfo extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanInfo";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanInfo, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanInfo, 0, null);
        })


        this.uiPanel.getChild("label_bxl").text = StrVal.LYCLAN.STR113
        let clanInfo = params.calnItem

        let ClanXmlData = LocaleData.getClanByLevel(clanInfo.level)

        let img_flag: fgui.GLoader = this.uiPanel.getChild("img_flag")

        img_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(clanInfo.flag).icon])

        let label_number: fgui.GLabel = this.uiPanel.getChild("label_number")
        label_number.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR9, [clanInfo.number, ClanXmlData.number])

        let label_name: fgui.GLabel = this.uiPanel.getChild("label_name")
        label_name.text = clanInfo.name

        let label_level: fgui.GLabel = this.uiPanel.getChild("label_level")
        label_level.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR2, [clanInfo.level])
        let label_guid: fgui.GLabel = this.uiPanel.getChild("label_guid")
        label_guid.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR3, [clanInfo.shortId])

        let label_declaration: fgui.GLabel = this.uiPanel.getChild("label_declaration")
        label_declaration.text = clanInfo.notice

        let label_combatPower: fgui.GLabel = this.uiPanel.getChild("label_combatPower")
        label_combatPower.text =  UtilsTool.nToFStr(clanInfo.combatPower)
        let clanMember = params.members

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
        
        let list_people: fgui.GList = this.uiPanel.getChild("list_people")
        list_people.setVirtual();
        list_people.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let clanMemberItem = clanMember[index]
            obj.clearClick()
            obj.onClick(() => {
                UtilsUI.onShowPlayerInfo(clanMemberItem.playerId)
            })
            obj.getChild("label_name").text = clanMemberItem.playerInfo.name
            obj.getChild("label_combatPower").text =  UtilsTool.nToFStr(clanMemberItem.playerInfo.combatPower)
            let img_role: fgui.GLoader = obj.getChild("img_role")
            img_role.url = UtilsTool.stringFormat("ui://LyClan/role{0}", [clanMemberItem.role])
            // obj.getChild("label_phase").text = LocaleData.getPlayerPhaseById(clanMemberItem.playerInfo.phase).name

            let loader_phase: fgui.GComponent = obj.getChild("loader_phase");
            UtilsUI.setTitleIconByTitleId(loader_phase, clanMemberItem.playerInfo.phase, clanMemberItem.playerInfo.title);

            let group_head: fgui.GComponent = obj.getChild("group_head");
            let loader_icon: fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            let playerInfo = clanMemberItem.playerInfo
            let charInfo = LocaleData.getCharShowResInfo(playerInfo.character, playerInfo.phase, playerInfo.appearance, playerInfo.avatar);
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);

        }).bind(this)
        list_people.numItems = clanMember.length

    };




    public getIsViewMask(): boolean {
        return false;
    };

}