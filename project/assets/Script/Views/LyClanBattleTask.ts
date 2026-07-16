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
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanBattleTask extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanBattleTask";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(): void {
        this.uiPanel = this.getUiPanel().getChild("group_clanBattleTask")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanBattleTask, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanBattleTask, 0, null);
        })
        this.uiPanel.getChild("label_bxl").text = StrVal.LYCLAN.STR126


        this.registerRequest((args) => {
            this.onListTask()
        }, "factionTaskResetChanged");
        this.onListTask()
    };


    private onListTask(): void {
        let taskXml: any = LocaleData.getTaskByType(VarVal.taskType.clan);
        let taskArr = []
        let fullInfoTask = GameServerData.getInstance().getTaskState(VarVal.taskType.clan);
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let myselfInfo = playerClanInfo.myselfInfo
        let clanMember = playerClanInfo.clanMember
        let clanInfo = playerClanInfo.clanInfo


        for (let i = 0; i < taskXml.length; i++) {
            const element = taskXml[i];
            if (element.subType == "2") {
                taskArr.push(element)
            }
        }
        let list_task: fgui.GList = this.uiPanel.getChild("list_task")
        list_task.setVirtual();
        list_task.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let item: any = taskArr[index]
            // obj.getChild("label_dec").text = item.desc 

            //奖励
            let list_item: fgui.GList = obj.getChild("list_item")
            let bonuseItems = []
            if (item.clanContribution && item.clanContribution != 0) {
                let clanContribution: BonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.clanPoint, null, null, item.clanContribution)
                bonuseItems.push(clanContribution)
            }
            if (item.activeScore && item.activeScore != 0) {
                let activeScore: BonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.activeScore, null, null, item.activeScore)
                bonuseItems.push(activeScore)
            }
            if (item.clanExp && item.clanExp != 0) {
                let clanExp: BonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.clanExp, null, null, item.clanExp)
                bonuseItems.push(clanExp)
            }
            // 列表
            list_item.itemRenderer = (index: number, group_item: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
            }
            list_item.numItems = bonuseItems.length
            // let label_state1: fgui.GLabel = obj.getChild("label_state1")
            let label_state3: fgui.GLabel = obj.getChild("label_state3")
            let btn_go: fgui.GButton = obj.getChild("btn_go")
            btn_go.text = StrVal.LYCLAN.STR141
            let btn_takeTaskBonuses: fgui.GButton = obj.getChild("btn_takeTaskBonuses")
            for (let i = 0; i < fullInfoTask.length; i++) {
                const element = fullInfoTask[i];
                if (element.id == item.id) {
                    btn_go.visible = element.state == 1
                    let colorStr = Number(element.count) >= Number(item.conditionParam) ? "#2B841C" : "#D53026"
                    let str = UtilsTool.stringFormat("[color={0}]({1}/{2})[/color]", [colorStr, UtilsTool.nToFStr(element.count), UtilsTool.nToFStr(item.conditionParam)])
                    obj.getChild("label_dec").text = UtilsTool.stringFormat(item.desc, [str])
                    btn_takeTaskBonuses.visible = element.state == 2
                    label_state3.visible = element.state == 3
                }
            }
            btn_go.clearClick()
            btn_go.onClick(() => {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanBattleTask, 0, null);
            })
            btn_takeTaskBonuses.clearClick()
            btn_takeTaskBonuses.onClick(() => {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        let bonusesResult = []
                        if (args.clanContribution && args.clanContribution != 0) {
                            let clanContribution: BonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.clanPoint, null, null, args.clanContribution)
                            bonusesResult.push(clanContribution)
                        }
                        if (args.activeScore && args.activeScore != 0) {
                            let activeScore: BonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.activeScore, null, null, args.activeScore)
                            bonusesResult.push(activeScore)
                        }
                        if (args.clanExp && args.clanExp != 0) {
                            let clanExp: BonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.clanExp, null, null, args.clanExp)
                            bonusesResult.push(clanExp)
                        }
                        UtilsUI.showItemReward({ bonuseItems: bonusesResult });
                        this.onListTask()
                    }
                    else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "takeTaskBonuses", {
                    id: item.id,
                });
            })

        }).bind(this)
        UtilsUI.setFguiGlistDelayNumItems(list_task, taskArr.length);
        // list_task.numItems = taskArr.length
    }


    public static isViewRedPointTask(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.clan) || !GameServerData.getInstance().isClanHas()) {
            return false;
        }
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let myselfInfo = playerClanInfo.myselfInfo
        if (UtilsTool.TimeToDateStr(myselfInfo.joinTime) == UtilsTool.TimeToDateStr(GameServerData.getInstance().getServerTime())) {
            return false;
        }

        let taskXml: any = LocaleData.getTaskByType(VarVal.taskType.clan);
        let taskArr = []
        for (let i = 0; i < taskXml.length; i++) {
            const element = taskXml[i];
            if (element.subType == "2") {
                taskArr.push(element)
            }
        }
        let fullInfoTask = GameServerData.getInstance().getTaskState(VarVal.taskType.clan);
        for (let j = 0; j < taskArr.length; j++) {
            const item = taskArr[j];
            for (let i = 0; i < fullInfoTask.length; i++) {
                const element = fullInfoTask[i];
                if (element.id == item.id) {
                    if (element.state == 2) {
                        return true
                    }
                }
            }
        }
        return false
    }


    public getIsViewMask(): boolean {
        return false;
    };

}