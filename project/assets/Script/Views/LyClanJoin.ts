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
import { LyClanFound } from "./LyClanFound";
import { LyClanInfo } from "./LyClanInfo";
import { LyCompanionInfo } from "./LyCompanionInfo";
import { AudioManager } from "../Kernel/AudioManager";

export class LyClanJoin extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanJoin";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanJoin, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanJoin, 0, null);
        })

        this.uiPanel.getChild("label_title").text = StrVal.LYCLAN.STR19
        this.uiPanel.getChild("label_str80").text = StrVal.LYCLAN.STR80

        let btn_clanFound: fgui.GButton = this.uiPanel.getChild("btn_clanFound")
        btn_clanFound.text = StrVal.LYCLAN.STR82
        btn_clanFound.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanFound, 0, null);
        })
        let btn_joinClan: fgui.GButton = this.uiPanel.getChild("btn_joinClan")
        btn_joinClan.text = StrVal.LYCLAN.STR81
        btn_joinClan.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYCLAN.STR23, [args.clanInfo.name]))
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClan, 0, null);
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanJoin, 0, null);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "joinClan", {
            })
        })
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                this.onClanJoin(args.clanList)
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "getClanRank", null)
        let label_searchClanInfo: fgui.GTextInput = this.uiPanel.getChild("label_searchClanInfo")
        label_searchClanInfo.promptText = StrVal.LYCLAN.STR137
        // label_searchClanInfo.updateText()
        UtilsUI.setGTextInputAlign(label_searchClanInfo, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.CLAMP);
        let btn_searchClanInfo: fgui.GButton = this.uiPanel.getChild("btn_searchClanInfo")
        btn_searchClanInfo.text = StrVal.LYCLAN.STR83
        btn_searchClanInfo.onClick(() => {
            if (label_searchClanInfo.text != "") {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        if (args.clanList.length <= 0) {
                            UtilsUI.showMsgTip(StrVal.LYCLAN.STR132)
                        }
                        this.onClanJoin(args.clanList)
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "searchClanInfo", { keyword: label_searchClanInfo.text })
            } else {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.onClanJoin(args.clanList)
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "getClanRank", null)
            }
        })
    };
    private onClanJoin(clanList: any): void {
        let list_clan: fgui.GList = this.uiPanel.getChild("list_clan")
        clanList.sort((itemA, itemB) => {
            return itemA.rankOf - itemB.rankOf;
        })
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

            // frame_ranking_01
            let label_rank: fgui.GLabel = obj.getChild("label_rank")
            let img_rank: fgui.GLoader = obj.getChild("img_rank")
            if (Number(index + 1) <= 3) {
                img_rank.url = UtilsTool.stringFormat("ui://CCommon/frame_ranking_0{0}", [index + 1]);
                img_rank.visible = true
                label_rank.visible = false
            } else {
                img_rank.visible = false
                label_rank.visible = true
                label_rank.text = String(index + 1)
            }
            // obj.getChild("label_rank").text = clanInfoItem.rankOf
            obj.getChild("label_name").text = clanInfoItem.name
            obj.getChild("label_level").text = UtilsTool.stringFormat(StrVal.LYCLAN.STR2, [clanInfoItem.level])
            obj.getChild("label_leaderName").text = clanInfoItem.leaderName
            let ClanXmlData = LocaleData.getClanByLevel(clanInfoItem.level)

            let label_number: fgui.GTextField = obj.getChild("label_number")
            label_number.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR5, [clanInfoItem.number, ClanXmlData.number])
            // label_number.color = UtilsUI.getEnoughColor(clanInfoItem.number >= ClanXmlData.number);


            let img_ren: fgui.GImage = obj.getChild("img_ren")
            let group_number: fgui.GGraph = obj.getChild("group_number")

            obj.getChild("label_str84").text = StrVal.LYCLAN.STR84
            let group_selfApply: fgui.GLoader = obj.getChild("group_selfApply")
            let btn_joinClan: fgui.GButton = obj.getChild("btn_joinClan")
            btn_joinClan.text = StrVal.LYCLAN.STR85
            btn_joinClan.clearClick()
            btn_joinClan.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        if (args.clanInfo) {
                            UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYCLAN.STR23, [args.clanInfo.name]))
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanJoin, 0, null);
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClan, 0, null);
                        } else {
                            group_number.visible = false
                            btn_joinClan.visible = false
                            group_selfApply.visible = true
                        }
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "joinClan", {
                    clanId: clanInfoItem.clanId
                })
            })


            let img_flag: fgui.GLoader = obj.getChild("img_flag")

            img_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(clanInfoItem.flag).icon])

            group_selfApply.visible = clanInfoItem.selfApply == 1
            group_number.visible = clanInfoItem.selfApply == 0
            btn_joinClan.visible = clanInfoItem.selfApply == 0
            if (btn_joinClan.visible) {
                if (clanInfoItem.number >= ClanXmlData.number) {
                    btn_joinClan.visible = false
                    group_number.y = 38
                    img_ren.color = UtilsUI.getEnoughColor(clanInfoItem.number >= ClanXmlData.number);
                } else {
                    btn_joinClan.visible = true
                    group_number.y = 10
                }
            }
        }).bind(this)
        list_clan.numItems = clanList ? clanList.length : 0
    }



    public getIsViewMask(): boolean {
        return false;
    };

}