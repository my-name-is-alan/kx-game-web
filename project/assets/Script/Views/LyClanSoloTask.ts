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
import { PointRedData } from "../Kernel/PointRedData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanSoloTask extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClanSolo";
        this.viewResI.pkgName = "LyClanSolo";
        this.viewResI.comName = "LyClanSoloTask";
    }
    private btn_gr: fgui.GButton
    private btn_bp: fgui.GButton
    private uiPanel: fgui.GComponent
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloTask, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloTask, 0, null);
        })
        this.btn_gr = this.uiPanel.getChild("btn_gr");
        this.btn_gr.text = StrVal.LYCLANSOLO.STR10

        this.btn_bp = this.uiPanel.getChild("btn_bp");
        this.btn_bp.text = StrVal.LYCLANSOLO.STR9

        this.uiPanel.getChild("label_title", fgui.GLabel).text = StrVal.LYCLANSOLO.STR6
        this.initialize()
        // let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        // let clanSoloPlayer: any = fullInfo.clanSoloPlayer
        // let clanSoloMyselfInfo: any = clanSoloPlayer.clanSoloMyselfInfo
        // let myselfClanInfo: any = clanSoloPlayer.myselfClanInfo
        // let clanSoloTaskPlayer = LocaleData.getClanSoloTaskByType(1)
        // let playerTaskCount = 0
        // for (let i = 0; i < clanSoloTaskPlayer.length; i++) {
        //     const element = clanSoloTaskPlayer[i];
        //     if (Number(element.fightCount) < clanSoloMyselfInfo.fightCount) {
        //         playerTaskCount++
        //     }
        // }
        // PointRedData.getInstance().updateManualPoint(this.btn_gr, playerTaskCount > clanSoloMyselfInfo.playerTaskCount);
        // if (myselfClanInfo) {
        //     let clanSoloTaskClan = LocaleData.getClanSoloTaskByType(2)
        //     let clanTaskCount = 0
        //     for (let i = 0; i < clanSoloTaskClan.length; i++) {
        //         const element = clanSoloTaskClan[i];
        //         if (Number(element.fightCount) < myselfClanInfo.fightCount) {
        //             clanTaskCount++
        //         }
        //     }
        //     PointRedData.getInstance().updateManualPoint(this.btn_bp, clanTaskCount > clanSoloMyselfInfo.clanTaskCount);
        // }
    };

    private initialize(): void {
        let clanSoloTask = LocaleData.getClanSoloTaskByType(2)
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanSoloPlayer: any = fullInfo.clanSoloPlayer
        let clanSoloMyselfInfo: any = clanSoloPlayer.clanSoloMyselfInfo
        let myselfClanInfo: any = clanSoloPlayer.myselfClanInfo
        for (let i = 0; i < clanSoloTask.length; i++) {
            const element = clanSoloTask[i];
            element.index = i + 1
        }
        clanSoloTask.sort((itemA, itemB) => {
            let numA: number
            let numB: number
            numA = clanSoloMyselfInfo.clanTaskCount >= Number(itemA.index) ? 1 : 0
            numB = clanSoloMyselfInfo.clanTaskCount >= Number(itemB.index) ? 1 : 0
            return numA - numB
        })
        let list_clanTask: fgui.GList = this.uiPanel.getChild("list_clanTask")
        let isClanRed: boolean = false
        list_clanTask.setVirtual();
        list_clanTask.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let item: any = clanSoloTask[index]
            let label_dec: fgui.GLabel = obj.getChild("label_dec")
            // 列表
            let list_item: fgui.GList = obj.getChild("list_item")
            // list_item.setVirtual();
            // list_item.numItems = 0
            let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(item.bonusesId);
            list_item.itemRenderer = (i: number, group_item: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[i], group_item, null);
            }
            list_item.numItems = bonuseItems.length
            let label_state3: fgui.GGroup = obj.getChild("label_state3")
            let btn_go: fgui.GButton = obj.getChild("btn_go")
            btn_go.text = StrVal.LYCLANSOLO.STR46
            btn_go.clearClick()
            btn_go.onClick(() => {
            })
            let btn_takeTaskBonuses: fgui.GButton = obj.getChild("btn_takeTaskBonuses")
            btn_takeTaskBonuses.text = StrVal.LYCLANSOLO.STR45
            btn_takeTaskBonuses.clearClick()
            btn_takeTaskBonuses.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.initialize()
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "clanSoloFinishTask", {
                    type: 2
                })
            })
            let bar_num: fgui.GProgressBar = obj.getChild("bar_num")
            bar_num.max = item.fightCount
            let isOk = Number(clanSoloMyselfInfo.fightCount) > Number(item.fightCount)
            let isGet: boolean
            isGet = clanSoloMyselfInfo.clanTaskCount >= Number(item.index)
            label_dec.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR23, [item.fightCount])
            label_state3.visible = isGet
            if (myselfClanInfo) {
                bar_num.value = myselfClanInfo.fightCount > item.fightCount ? item.fightCount : myselfClanInfo.fightCount
                btn_go.visible = Number(myselfClanInfo.fightCount) < Number(item.fightCount)
            } else {
                bar_num.value = 0
                btn_go.visible = true
            }
            btn_takeTaskBonuses.visible = !btn_go.visible && !label_state3.visible
            if (btn_takeTaskBonuses.visible) {
                isClanRed = true
                PointRedData.getInstance().updateManualPoint(this.btn_bp, isClanRed);
            }
            if (!isClanRed) {
                PointRedData.getInstance().updateManualPoint(this.btn_gr, false);
            }
        }).bind(this)
        // list_task.numItems = taskArr.length
        UtilsUI.setFguiGlistDelayNumItems(list_clanTask, clanSoloTask.length);

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        let playerSoloTask = LocaleData.getClanSoloTaskByType(1)
        for (let i = 0; i < playerSoloTask.length; i++) {
            const element = playerSoloTask[i];
            element.index = i + 1
        }
        playerSoloTask.sort((itemA, itemB) => {
            let numA: number
            let numB: number
            numA = clanSoloMyselfInfo.playerTaskCount >= Number(itemA.index) ? 1 : 0
            numB = clanSoloMyselfInfo.playerTaskCount >= Number(itemB.index) ? 1 : 0
            return numA - numB
        })

        let list_task: fgui.GList = this.uiPanel.getChild("list_task")
        let isPlayerRed: boolean = false
        list_task.setVirtual();
        list_task.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let item: any = playerSoloTask[index]
            let label_dec: fgui.GLabel = obj.getChild("label_dec")
            // 列表
            let list_item: fgui.GList = obj.getChild("list_item")
            // list_item.setVirtual();
            // list_item.numItems = 0
            let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(item.bonusesId);
            list_item.itemRenderer = (i: number, group_item: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[i], group_item, null);
            }
            list_item.numItems = bonuseItems.length
            let label_state3: fgui.GGroup = obj.getChild("label_state3")
            let btn_go: fgui.GButton = obj.getChild("btn_go")
            btn_go.text = StrVal.LYCLANSOLO.STR46
            btn_go.clearClick()
            btn_go.onClick(() => {
            })
            let btn_takeTaskBonuses: fgui.GButton = obj.getChild("btn_takeTaskBonuses")
            btn_takeTaskBonuses.text = StrVal.LYCLANSOLO.STR45
            btn_takeTaskBonuses.clearClick()
            btn_takeTaskBonuses.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.initialize()
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "clanSoloFinishTask", {
                    type: 1
                })
            })
            let bar_num: fgui.GProgressBar = obj.getChild("bar_num")
            bar_num.max = item.fightCount
            let isOk = Number(clanSoloMyselfInfo.fightCount) > Number(item.fightCount)
            let isGet: boolean
            // clanSoloMyselfInfo.fightCount
            isGet = clanSoloMyselfInfo.playerTaskCount >= Number(item.index)
            label_dec.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR22, [item.fightCount])
            label_state3.visible = isGet
            bar_num.value = clanSoloMyselfInfo.fightCount > item.fightCount ? item.fightCount : clanSoloMyselfInfo.fightCount
            // console.log(clanSoloMyselfInfo.fightCount);
            console.log(Number(clanSoloMyselfInfo.fightCount) < Number(item.fightCount));

            btn_go.visible = Number(clanSoloMyselfInfo.fightCount) < Number(item.fightCount)
            btn_takeTaskBonuses.visible = !btn_go.visible && !label_state3.visible
            if (btn_takeTaskBonuses.visible) {
                isPlayerRed = true
                PointRedData.getInstance().updateManualPoint(this.btn_gr, isPlayerRed);
            }
            if (!isPlayerRed) {
                PointRedData.getInstance().updateManualPoint(this.btn_gr, false);
            }
        }).bind(this)
        // list_task.numItems = taskArr.length
        UtilsUI.setFguiGlistDelayNumItems(list_task, playerSoloTask.length);

    }

    public static isViewRedPointTask(): boolean {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanSoloPlayer: any = fullInfo.clanSoloPlayer
        if (clanSoloPlayer && clanSoloPlayer.clanSoloMyselfInfo) {
            let clanSoloMyselfInfo: any = clanSoloPlayer.clanSoloMyselfInfo
            let myselfClanInfo: any = clanSoloPlayer.myselfClanInfo
            let clanSoloTaskPlayer = LocaleData.getClanSoloTaskByType(1)
            let playerTaskCount = 0
            for (let i = 0; i < clanSoloTaskPlayer.length; i++) {
                const element = clanSoloTaskPlayer[i];
                if (Number(element.fightCount) <= clanSoloMyselfInfo.fightCount) {
                    playerTaskCount++
                }
            }
            if (playerTaskCount > clanSoloMyselfInfo.playerTaskCount) {
                return true
            }
            if (myselfClanInfo) {
                let clanSoloTaskClan = LocaleData.getClanSoloTaskByType(2)
                let clanTaskCount = 0
                for (let i = 0; i < clanSoloTaskClan.length; i++) {
                    const element = clanSoloTaskClan[i];
                    if (Number(element.fightCount) <= myselfClanInfo.fightCount) {
                        clanTaskCount++
                    }
                }
                if (clanTaskCount > clanSoloMyselfInfo.clanTaskCount) {
                    return true
                }
            }

        }
        return false
    }
    public getIsViewMask(): boolean {
        return false;
    };

}