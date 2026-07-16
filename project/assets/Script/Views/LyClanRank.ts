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
import { LyClanInfo } from "./LyClanInfo";

export class LyClanRank extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanRank";
    }
    private group_clanRank: fgui.GComponent

    public onViewCreate(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel()
        this.group_clanRank = uiPanel.getChild("group_clanRank")
        UtilsUI.playCommonGroupAni(this.group_clanRank, null)

        // 关闭
        let btn_close: fgui.GButton = uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanRank, 0, null);
        })
        let btn_close1: fgui.GButton = this.group_clanRank.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanRank, 0, null);
        })
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanInfo = playerClanInfo.clanInfo
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                this.onClanRank(args.clanList)
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "getClanRank", null)
        this.group_clanRank.getChild("label_bxl").text = StrVal.LYCLAN.STR112
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                this.onClanSelfRank(args.clanList[0])
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "searchClanInfo", { keyword: clanInfo.shortId })

        let label_searchClanInfo: fgui.GTextInput = this.group_clanRank.getChild("label_searchClanInfo")
        label_searchClanInfo.promptText = StrVal.LYCLAN.STR137
        UtilsUI.setGTextInputAlign(label_searchClanInfo, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.CLAMP);
        let btn_searchClanInfo: fgui.GButton = this.group_clanRank.getChild("btn_searchClanInfo")
        btn_searchClanInfo.onClick(() => {
            if (label_searchClanInfo.text != "") {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.onClanRank(args.clanList)
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "searchClanInfo", { keyword: label_searchClanInfo.text })
            } else {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.onClanRank(args.clanList)
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "getClanRank", null)
            }
        })
    };
    private onClanSelfRank(clanSelf: any): void {
        let label_name: fgui.GLabel = this.group_clanRank.getChild("label_name")
        label_name.text = clanSelf.name

        let label_flag: fgui.GLoader = this.group_clanRank.getChild("label_flag")
        label_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(clanSelf.flag).icon])
        let label_level: fgui.GLabel = this.group_clanRank.getChild("label_level")
        label_level.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR2, [clanSelf.level])
        let label_leaderName: fgui.GLabel = this.group_clanRank.getChild("label_leaderName")
        label_leaderName.text = clanSelf.leaderName
        let label_rank: fgui.GLabel = this.group_clanRank.getChild("label_rank")
        label_rank.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR18, [clanSelf.rankOf])

        let label_combatPower: fgui.GLabel = this.group_clanRank.getChild("label_combatPower")
        label_combatPower.text = UtilsTool.nToFStr(clanSelf.combatPower)
    }
    private onClanRank(clanList: any): void {
        let list_clan: fgui.GList = this.group_clanRank.getChild("list_clan")
        list_clan.setVirtual();
        list_clan.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let clanInfoItem = clanList[index]
            obj.getChild("btn_item").clearClick()
            obj.getChild("btn_item").onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanInfo, 0, { members: args.members, calnItem: clanInfoItem });
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "getMembersByClan", {
                    clanId: clanInfoItem.clanId
                })
            })
            obj.getChild("label_name").text = clanInfoItem.name
            obj.getChild("label_level").text = UtilsTool.stringFormat(StrVal.LYCLAN.STR2, [clanInfoItem.level])
            obj.getChild("label_leaderName").text = clanInfoItem.leaderName
            obj.getChild("label_combatPower").text = UtilsTool.nToFStr(clanInfoItem.combatPower)
            let clanPhase = LocaleData.getClanPhaseById(clanInfoItem.phase)
            obj.getChild("img_phase", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}", [clanPhase.icon]);

            let label_rank: fgui.GLabel = obj.getChild("label_rank")
            let group_top: fgui.GLoader = obj.getChild("group_top")

            if (index + 1 <= 3) {
                group_top.url = UtilsTool.stringFormat("ui://CCommon/frame_ranking_0{0}", [index + 1]);
                label_rank.visible = false
                group_top.visible = true
            } else {
                label_rank.text = String(index + 1)
                label_rank.visible = true
                group_top.visible = false
            }
            let label_flag: fgui.GLoader = obj.getChild("label_flag")


            label_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(clanInfoItem.flag).icon])
            // obj.onClick(() => {
            //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanInfo, 0, null);
            // })
        }).bind(this)
        list_clan.numItems = clanList ? clanList.length : 0
    }



    public getIsViewMask(): boolean {
        return false;
    };

}