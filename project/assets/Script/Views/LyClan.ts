//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { LyClanBattle } from "./LyClanBattle";
import { LyClanMerchant } from "./LyClanMerchant";
import { LyClanApply } from "./LyClanApply";
import { LyClanHelp } from "./LyClanHelp";
import { LyClanMain } from "./LyClanMain";
import { LyClanRank } from "./LyClanRank";
import { LyClanShop } from "./LyClanShop";
import { LyClanTask } from "./LyClanTask";
import { LyClanTitle } from "./LyClanTitle";
import { LocaleData } from "../Kernel/LocaleData";
import { StrVal } from "../Values/StrVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { VarVal } from "../Values/VarVal";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";

export class LyClan extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClan";
    }
    private uiPanel: fgui.GComponent
    private btn_clanApply: fgui.GButton
    private btn_clanMerchant: fgui.GButton
    private btn_clanShop: fgui.GButton
    private btn_clanTask: fgui.GButton
    private btn_clanBattle: fgui.GButton

    public onViewCreate(): void {
        this.uiPanel = this.getUiPanel()
        // 关闭
        let btn_close: fgui.GButton = this.uiPanel.getChild("btn_close");
        let group_clan: fgui.GGraph = this.uiPanel.getChild("group_clan")
        group_clan.visible = false
        let spinePlayer3 = new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            spp.playAnimation("animation", false, 0, () => {
                btn_close.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClan, 0, null);
                })
                group_clan.visible = true
            }, null);
        }, this.getUiPanel().getChild("loader3d_join", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_yunwu_guochang);
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let myselfInfo = playerClanInfo.myselfInfo
        if (myselfInfo) {
            this.onClan()
        } else {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.onClan()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "getMyClanInfo", {
            })
        }
    };

    private onClan(): void {
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanInfo = playerClanInfo.clanInfo
        // let clanMember = playerClanInfo.clanMember
        let myselfInfo = playerClanInfo.myselfInfo
        // let clanFlag = playerClanInfo.clanFlag
        // let clanBuy = playerClanInfo.clanBuy
        // let clanLog = playerClanInfo.clanLog
        // let clanRecharge = playerClanInfo.clanRecharge
        // let clanApply = playerClanInfo.clanApply
        // console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓帮派信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        // console.log(clanInfo);
        // console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓自己信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        // console.log(myselfInfo);
        // console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓所有成员↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        // console.log(clanMember);
        // console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓帮派旗帜↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        // console.log(clanFlag);
        // console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓购买信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        // console.log(clanBuy);
        // console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓帮派动态↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        // console.log(clanLog);
        // console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓帮派充值↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        // console.log(clanRecharge);
        // console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓申请列表↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
        // console.log(clanApply);
        let group_clanMap: fgui.GComponent = this.uiPanel.getChild("group_clanMap")
        group_clanMap.scrollPane.posX = 120
        this.btn_clanShop = group_clanMap.getChild("btn_clanShop")
        this.btn_clanShop.text = StrVal.LYCLAN.STR120
        let btn_clanMain: fgui.GButton = group_clanMap.getChild("btn_clanMain")
        btn_clanMain.text = StrVal.LYCLAN.STR117
        let btn_clanMain1: fgui.GLoader = this.uiPanel.getChild("btn_clanMain1")
        this.btn_clanMerchant = group_clanMap.getChild("btn_clanMerchant")
        this.btn_clanTask = group_clanMap.getChild("btn_clanTask")
        this.btn_clanTask.text = StrVal.LYCLAN.STR118

        //地下按钮

        let btn_clanHelp: fgui.GButton = this.uiPanel.getChild("btn_clanHelp")

        this.btn_clanApply = this.uiPanel.getChild("btn_clanApply")


        let btn_clanRank: fgui.GButton = this.uiPanel.getChild("btn_clanRank")

        let btn_clanEvolveSpeedUpReq: fgui.GButton = this.uiPanel.getChild("btn_clanEvolveSpeedUpReq")
        this.btn_clanShop.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanShop, 0, null);
        })
        btn_clanMain.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanMain, 0, null);
        })
        btn_clanMain1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanMain, 0, null);
        })
        this.btn_clanMerchant.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanMerchant, 0, null);
        })
        this.btn_clanTask.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanTask, 0, null);
        })

        this.btn_clanBattle = group_clanMap.getChild("btn_clanBattle")
        this.btn_clanBattle.text = StrVal.LYCLAN.STR116
        this.btn_clanBattle.onClick(() => {
            if (clanInfo.duelMonsterId == 0 || UtilsTool.TimeToDateStr(myselfInfo.joinTime) == UtilsTool.TimeToDateStr(GameServerData.getInstance().getServerTime())) {
                UtilsUI.showMsgTip(StrVal.LYCLAN.STR67)
            } else {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanBattle, 0, null);
            }
        })
        let currentTime: number = GameServerData.getInstance().getServerTime();
        btn_clanHelp.visible = currentTime < clanInfo.rechargeTime
        btn_clanHelp.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanHelp, 0, null);
        })
        this.btn_clanApply.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanApply, 0, null);
        })

        btn_clanRank.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanRank, 0, null);
        })
        btn_clanEvolveSpeedUpReq.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "clanEvolveSpeedUpReq", {
            })
        })
        let btn_leaveClan: fgui.GButton = this.uiPanel.getChild("btn_leaveClan")
        btn_leaveClan.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClan, 0, null);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "leaveClan", {
            })
        })
        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            spp.playAnimation("stand", true);
        }, group_clanMap.getChild("loader_spine_bg"), "cj_bangpai")
        this.initialize()
    }
    private initialize(): void {
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanInfo = playerClanInfo.clanInfo
        let myselfInfo = playerClanInfo.myselfInfo
        let clanApply = playerClanInfo.clanApply
        let btn_clanTitle: fgui.GLoader = this.uiPanel.getChild("btn_clanTitle")
        let clanPhase = LocaleData.getClanPhaseById(clanInfo.phase)
        btn_clanTitle.url = UtilsTool.stringFormat("ui://CCommon/{0}", [clanPhase.icon])
        btn_clanTitle.clearClick()
        btn_clanTitle.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanTitle, 0, null);
        })
        let label_name: fgui.GLabel = this.uiPanel.getChild("label_name")
        label_name.text = clanInfo.name
        let img_flag: fgui.GLoader = this.uiPanel.getChild("img_flag")
        img_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(clanInfo.flag).icon])
        // img_flag.clearClick()
        // img_flag.onClick(() => {
        //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanTitle, 0, null);
        // })
        let ClanXmlData = LocaleData.getClanByLevel(clanInfo.level)
        let label_number: fgui.GLabel = this.uiPanel.getChild("label_number")
        label_number.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR14, [clanInfo.number, ClanXmlData.number])

        this.btn_clanApply.visible = (myselfInfo.role == VarVal.CLAN_ROLE.deputy) || (myselfInfo.role == VarVal.CLAN_ROLE.leader)

        let currentTime: number = GameServerData.getInstance().getServerTime();
        let time: number = clanInfo.merchantTime - currentTime
        this.btn_clanMerchant.visible = time > 0
        this.btn_clanMerchant.text = UtilsTool.parseTimeToString(time)
        if (time > 0) {
            let timeCall = this.setInterval(() => {
                time--
                if (time > 0) {
                    this.btn_clanMerchant.text = UtilsTool.parseTimeToString(time)
                } else {
                    this.clearInterval(timeCall)
                    this.initialize()
                }
            }, 1000);
        }
        PointRedData.getInstance().registerPoint(this.btn_clanApply, PointRedType.LyClanApply);
        PointRedData.getInstance().registerPoint(this.btn_clanShop, PointRedType.LyClanShop);
        PointRedData.getInstance().registerPoint(this.btn_clanTask, PointRedType.LyClanTask);
        PointRedData.getInstance().registerPoint(this.btn_clanBattle, PointRedType.LyClanBattle);
        PointRedData.getInstance().registerPoint(this.btn_clanMerchant, PointRedType.LyClanMerchant);
    }

    public onViewUpdate(params: any): void {
        this.initialize()
    }
}