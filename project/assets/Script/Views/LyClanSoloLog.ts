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
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyClanSoloMain } from "./LyClanSoloMain";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanSoloLog extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClanSolo";
        this.viewResI.pkgName = "LyClanSolo";
        this.viewResI.comName = "LyClanSoloLog";
    }
    private uiPanel: fgui.GComponent
    private group_isClanLog: fgui.GGroup
    private group_isPlayerLog: fgui.GGroup

    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloLog, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloLog, 0, null);
        })
        this.uiPanel.getChild("label_title", fgui.GLabel).text = StrVal.LYCLANSOLO.STR3
        this.uiPanel.getChild("btn_bp", fgui.GLabel).text = StrVal.LYCLANSOLO.STR9
        this.uiPanel.getChild("btn_hjb", fgui.GLabel).text = StrVal.LYCLANSOLO.STR63
        this.group_isClanLog = this.uiPanel.getChild("group_isClanLog")
        this.group_isPlayerLog = this.uiPanel.getChild("group_isPlayerLog")
        this.uiPanel.getChild("label_str110", fgui.GLabel).text = StrVal.LYCLANSOLO.STR110
        this.uiPanel.getChild("label_str111", fgui.GLabel).text = StrVal.LYCLANSOLO.STR110

        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                this.onClanSoloChallengeList(args)
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "getClanSoloChallengeList", {

        })

        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                this.onClanSoloCounterList(args)
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "getClanSoloCounterList", {
        })
    };
    private onClanSoloChallengeList(args): void {
        let recordList = args.recordList

        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanSoloPlayer: any = fullInfo.clanSoloPlayer
        let myselfClanInfo: any = clanSoloPlayer.myselfClanInfo
        let clanId = ""
        if (myselfClanInfo) {
            clanId = myselfClanInfo.clanId
        }
        let list_playerLog: fgui.GList = this.uiPanel.getChild("list_playerLog")
        list_playerLog.setVirtual();
        list_playerLog.itemRenderer = (index: number, child: fgui.GComponent) => {
            let data = recordList[index]
            let playerInfo = data.playerInfo
            let playerClanInfo = data.playerClanInfo
            let targetClanInfo = data.targetClanInfo
            let playerClanId = data.playerClanId

            let group_icon: fgui.GComponent = child.getChild("group_icon")
            let charInfo = LocaleData.getCharShowResInfo(playerInfo.character, playerInfo.phase, playerInfo.appearance, playerInfo.avatar);
            let loader_icon: fgui.GLoader = group_icon.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            let loader_phase: fgui.GComponent = child.getChild("loader_phase")
            UtilsUI.setTitleIconByTitleId(loader_phase, playerInfo.phase, playerInfo.title);
            let label_playerName: fgui.GLabel = child.getChild("label_playerName")
            label_playerName.text = playerInfo.name
            let label_clanName: fgui.GTextField = child.getChild("label_clanName")
            label_clanName.text = playerClanInfo.name
            label_clanName.color = new Color(68, 150, 31, 255);
            let label_dec: fgui.GLabel = child.getChild("label_dec")
            label_dec.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR76, [targetClanInfo.name, data.winCount])
            let label_createTime: fgui.GLabel = child.getChild("label_createTime")
            label_createTime.text = UtilsTool.TimeToStr(data.createTime, "-").split(" ")[1]
            let btn_battle: fgui.GButton = child.getChild("btn_battle")
            btn_battle.text = StrVal.LYCLANSOLO.STR65
            btn_battle.visible = playerClanId != clanId
            btn_battle.clearClick()
            btn_battle.onClick(() => {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",

                    UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR104, ["ui://CCommon/Props_challengeletter", playerClanInfo.name]), null,
                    StrVal.COMMON.STR32, null,
                    StrVal.COMMON.STR33, () => {
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloLog, 0, null);
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloMain, 0, null);
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        }, "clanSoloChallenge", {
                            recordId: data.id,
                            from: 1
                        })

                    }, "", null)
            })
        }
        this.group_isPlayerLog.visible = recordList.length == 0
        UtilsUI.setFguiGlistDelayNumItems(list_playerLog, recordList.length);
    }
    private onClanSoloCounterList(args): void {
        let recordList = args.recordList
        let list_clanLog: fgui.GList = this.uiPanel.getChild("list_clanLog")
        list_clanLog.setVirtual();
        list_clanLog.itemRenderer = (index: number, child: fgui.GComponent) => {
            let data = recordList[index]
            let playerInfo = data.playerInfo
            let playerClanInfo = data.playerClanInfo
            let group_icon: fgui.GComponent = child.getChild("group_icon")
            let charInfo = LocaleData.getCharShowResInfo(playerInfo.character, playerInfo.phase, playerInfo.appearance, playerInfo.avatar);
            let loader_icon: fgui.GLoader = group_icon.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            let loader_phase: fgui.GComponent = child.getChild("loader_phase")
            UtilsUI.setTitleIconByTitleId(loader_phase, playerInfo.phase, playerInfo.title);
            let label_playerName: fgui.GLabel = child.getChild("label_playerName")
            label_playerName.text = playerInfo.name
            let label_clanName: fgui.GTextField = child.getChild("label_clanName")
            label_clanName.text = playerClanInfo.name
            label_clanName.color = new Color(216, 42, 33, 255);
            let label_dec: fgui.GLabel = child.getChild("label_dec")

            label_dec.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR66, [data.winCount, data.preLossScore])
            let label_createTime: fgui.GLabel = child.getChild("label_createTime")
            label_createTime.text = UtilsTool.TimeToStr(data.createTime, "-").split(" ")[1]
            let btn_battle: fgui.GButton = child.getChild("btn_battle")
            btn_battle.text = StrVal.LYCLANSOLO.STR64
            btn_battle.clearClick()
            btn_battle.onClick(() => {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                    UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR104, ["ui://CCommon/Props_challengeletter", playerClanInfo.name]), null,
                    StrVal.COMMON.STR32, null,
                    StrVal.COMMON.STR33, () => {
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloLog, 0, null);
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloMain, 0, null);
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        }, "clanSoloChallenge", {
                            recordId: data.id,
                            from: 2
                        })
                    }, "", null)
            })
        }
        this.group_isClanLog.visible = recordList.length == 0
        UtilsUI.setFguiGlistDelayNumItems(list_clanLog, recordList.length);
    }
    public getIsViewMask(): boolean {
        return false;
    };

}