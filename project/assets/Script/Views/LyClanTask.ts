//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { GuideManager } from "../Kernel/GuideManager";
import { LocaleData } from "../Kernel/LocaleData";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, MonthCardItemType, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";

export class LyClanTask extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanTask";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(): void {
        this.uiPanel = this.getUiPanel().getChild("group_clanTask")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanTask, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanTask, 0, null);
        })
        this.uiPanel.getChild("label_bxl").text = StrVal.LYCLAN.STR109
        this.uiPanel.getChild("label_bxl1").text = StrVal.LYCLAN.STR136
        this.uiPanel.getChild("label_str110").text = StrVal.LYCLAN.STR110


        this.registerRequest((args) => {
            if (String(args.type) == VarVal.taskType.clan) {
                this.onListTask()
            }
        }, "taskChanged");

        this.registerRequest((args) => {
            this.onListTask()
        }, "factionTaskResetChanged");
        this.onListTask()
        this.onListEvolve()
    };


    private onListTask(): void {
        let btn_rw: fgui.GButton = this.uiPanel.getChild("btn_rw")
        btn_rw.text = StrVal.LYCLAN.STR150
        let btn_xz: fgui.GButton = this.uiPanel.getChild("btn_xz")
        btn_xz.text = StrVal.LYCLAN.STR151
        PointRedData.getInstance().registerPoint(btn_rw, PointRedType.LyClanTaskGet);
        PointRedData.getInstance().registerPoint(btn_xz, PointRedType.LyClanTaskEvolve);
        let showBoxItem
        let taskXml: any = LocaleData.getTaskByType(VarVal.taskType.clan);
        let taskArr = []
        let fullInfoTask = GameServerData.getInstance().getTaskState(VarVal.taskType.clan);
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let myselfInfo = playerClanInfo.myselfInfo
        let clanMember = playerClanInfo.clanMember
        let clanInfo = playerClanInfo.clanInfo
        let label_dailyActiveScore: fgui.GLabel = this.uiPanel.getChild("label_dailyActiveScore")
        label_dailyActiveScore.text = clanInfo.dailyActiveScore

        let calnActive: any = LocaleData.getClanActiveById("")

        let bar_dailyActiveNode: fgui.GProgressBar = this.uiPanel.getChild("bar_dailyActiveNode")
        bar_dailyActiveNode.getChild("title").visible = false
        bar_dailyActiveNode.max = calnActive[calnActive.length - 1].activeScore
        bar_dailyActiveNode.value = clanInfo.dailyActiveScore
        let btn_boxClose = this.uiPanel.getChild("btn_boxClose")
        btn_boxClose.visible = false
        btn_boxClose.clearClick()
        btn_boxClose.onClick(() => {
            showBoxItem.visible = false
            btn_boxClose.visible = false
        })
        let list_dailyActiveNode: fgui.GList = this.uiPanel.getChild("list_dailyActiveNode")
        list_dailyActiveNode.itemRenderer = (index: number, obj: fgui.GComponent) => {
            // obj.text = calnActive[index].activeScore
            let group_open: fgui.GGroup = obj.getChild("group_open")
            let group_ok: fgui.GGroup = obj.getChild("group_ok")
            //let ani_ok: fgui.Transition = obj.getTransition("ani_ok")
            let group_close: fgui.GGroup = obj.getChild("group_close")
            let label_score: fgui.GLabel = obj.getChild("label_score")
            let group_boxShow: fgui.GGroup = obj.getChild("group_boxShow")
            let group_click = obj.getChild("group_click")
            let list_show: fgui.GList = obj.getChild("list_show")
            group_boxShow.visible = false
            group_open.visible = false
            group_ok.visible = false
            group_close.visible = false
            label_score.text = calnActive[index].activeScore
            if ((index + 1) > myselfInfo.dailyActiveNode) {
                if (Number(clanInfo.dailyActiveScore) >= Number(calnActive[index].activeScore)) {
                    // obj.text = calnActive[index].activeScore + "可"
                    group_ok.visible = true
                    // PointRedData.getInstance().updateManualPoint(btn_rw, true)
                } else {
                    // obj.text = calnActive[index].activeScore + "不"
                    group_close.visible = true
                    // ani_ok.stop()
                }
            } else {
                //  ani_ok.stop()
                group_open.visible = true
                // obj.text = calnActive[index].activeScore + "已"
            }
            let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(calnActive[index].bonusesId);
            list_show.itemRenderer = (index1: number, group_item: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index1], group_item, null);
            }
            list_show.numItems = bonuseItems.length

            group_click.clearClick()
            group_click.onClick(() => {
                if ((index + 1) > myselfInfo.dailyActiveNode) {
                    if (Number(clanInfo.dailyActiveScore) >= Number(calnActive[index].activeScore)) {
                        UtilsUI.lockWait();
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait();
                            if (args.errorcode == 0) {
                                this.onListTask()
                                UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.claimReward]) });
                            } else {
                                UtilsUI.showMsgTip(args.errorcode);
                            }
                        }, "clanClaimActive", {
                        });
                        // console.log("可领取");
                    } else {
                        // console.log("不能领取");
                        if (showBoxItem) {
                            showBoxItem.visible = false
                        }
                        group_boxShow.visible = true
                        btn_boxClose.visible = true
                        showBoxItem = group_boxShow
                    }
                } else {
                    // console.log("已领取");
                    if (showBoxItem) {
                        showBoxItem.visible = false
                    }
                    group_boxShow.visible = true
                    btn_boxClose.visible = true
                    showBoxItem = group_boxShow
                }
            })
        }
        list_dailyActiveNode.numItems = calnActive.length
        for (let i = 0; i < taskXml.length; i++) {
            const element = taskXml[i];
            if (element.subType == "1") {
                taskArr.push(element)
            }

        }
        taskArr.sort((a, b) => {
            let aState
            let bState
            for (let i = 0; i < fullInfoTask.length; i++) {
                const element = fullInfoTask[i];
                if (element.id == a.id) {
                    aState = element.state
                }
                if (element.id == b.id) {
                    bState = element.state
                }
            }
            aState = aState == 2 ? -1 : aState
            bState = bState == 2 ? -1 : bState
            return aState - bState
        });

        let list_task: fgui.GList = this.uiPanel.getChild("list_task")
        list_task.setVirtual();
        list_task.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let item: any = taskArr[index]
            obj.getChild("label_dec").text = item.desc
            //奖励
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
            let list_item: fgui.GList = obj.getChild("list_item")
            // list_item.setVirtual();
            list_item.numItems = 0
            list_item.itemRenderer = (index: number, group_item: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
            }
            list_item.numItems = bonuseItems.length

            let bar_num: fgui.GProgressBar = obj.getChild("bar_num")
            let btn_go: fgui.GButton = obj.getChild("btn_go")
            let label_state3: fgui.GLabel = obj.getChild("label_state3")
            let btn_takeTaskBonuses: fgui.GButton = obj.getChild("btn_takeTaskBonuses")
            for (let i = 0; i < fullInfoTask.length; i++) {
                const element = fullInfoTask[i];
                if (element.id == item.id) {
                    btn_go.visible = element.state == 1
                    bar_num.max = item.conditionParam
                    bar_num.value = element.count
                    btn_go.text = StrVal.LYCLAN.STR141
                    btn_takeTaskBonuses.text = StrVal.LYCLAN.STR145
                    btn_takeTaskBonuses.visible = element.state == 2
                    label_state3.visible = element.state == 3

                    if (element.state == 2) {
                        // PointRedData.getInstance().updateManualPoint(btn_rw, true)
                    }
                }
            }
            btn_go.clearClick()
            btn_go.onClick(() => {
                if (item.conditionType == "21") {
                    PlatformAPI.doSdkRewardVideoAD((errmsg: string) => {
                        if (errmsg) {
                            UtilsUI.showMsgTip(errmsg);
                        } else {
                            UtilsUI.lockWait();
                            GameServer.getInstance().send((args: any) => {
                                UtilsUI.unlockWait();
                                if (args.errorcode == 0) {
                                }
                                else {
                                    UtilsUI.showMsgTip(args.errorcode);
                                }
                            }, "watchad", {
                            });
                        }
                    }, UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.skip_ad))
                } else {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.KANSHU, // 砍树
                    });
                }
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
        // list_task.numItems = taskArr.length
        UtilsUI.setFguiGlistDelayNumItems(list_task, taskArr.length);
    }

    private onListEvolve(): void {
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let myselfInfo = playerClanInfo.myselfInfo
        let clanMember = playerClanInfo.clanMember
        let clanInfo = playerClanInfo.clanInfo
        let clanRoot = LocaleData.getClanRoot()
        let list_evolve: fgui.GList = this.uiPanel.getChild("list_evolve")
        let img_noData: fgui.GImage = this.uiPanel.getChild("img_noData")
        let clanEvolveArr = []
        for (let i = 0; i < clanMember.length; i++) {
            const element = clanMember[i];
            if (element.evolveHelpLevel > element.playerInfo.evolutionLevel
                && element.playerInfo.evolveFinishTime != 0
                && element.playerInfo.evolveFinishTime > GameServerData.getInstance().getServerTime()) {
                clanEvolveArr.push(element)
            }
        }
        img_noData.visible = clanEvolveArr.length == 0
        list_evolve.itemRenderer = (index: number, obj: fgui.GComponent) => {
            let label_name: fgui.GLabel = obj.getChild("label_name")
            label_name.text = clanEvolveArr[index].playerInfo.name
            let label_dec: fgui.GLabel = obj.getChild("label_dec")
            label_dec.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR13, [clanEvolveArr[index].playerInfo.evolutionLevel + 1])
            let group_head: fgui.GComponent = obj.getChild("group_head")
            let loader_icon: fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            let playerInfo = clanEvolveArr[index].playerInfo
            let charInfo = LocaleData.getCharShowResInfo(playerInfo.character, playerInfo.phase, playerInfo.appearance, playerInfo.avatar);
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            let label_evolveHelpCount: fgui.GLabel = obj.getChild("label_evolveHelpCount")
            label_evolveHelpCount.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR24, [clanEvolveArr[index].evolveHelpCount, clanRoot.evolveMostFreq])
            let btn_clanEvolveSpeedUp: fgui.GButton = obj.getChild("btn_clanEvolveSpeedUp")
            let label_ok: fgui.GLabel = obj.getChild("label_ok")
            // label_ok.visible = false
            btn_clanEvolveSpeedUp.enabled = true
            if (myselfInfo.playerId == clanEvolveArr[index].playerId) {
                btn_clanEvolveSpeedUp.enabled = false
            } else {
                btn_clanEvolveSpeedUp.enabled = clanEvolveArr[index].evolveHelpCount < clanRoot.evolveMostFreq
                if (clanEvolveArr[index].evolveHelper != "") {
                    let evolveHelperStr: string[] = clanEvolveArr[index].evolveHelper.split(",")
                    for (let i = 0; i < evolveHelperStr.length; i++) {
                        if (evolveHelperStr[i] == myselfInfo.playerId) {
                            // label_evolveHelpCount.visible = false
                            btn_clanEvolveSpeedUp.enabled = false
                            // label_ok.visible = true
                            break
                        }
                    }
                }
            }
            btn_clanEvolveSpeedUp.clearClick()
            btn_clanEvolveSpeedUp.onClick(() => {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        this.onListEvolve()
                    }
                    else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "clanEvolveSpeedUp", {
                    playerId: clanEvolveArr[index].playerId,
                });
            })
        }
        list_evolve.numItems = clanEvolveArr.length
    }

    public static isViewRedPoint(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.clan) || !GameServerData.getInstance().isClanHas()) {
            return false;
        }
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let myselfInfo = playerClanInfo.myselfInfo
        let clanInfo = playerClanInfo.clanInfo
        let taskXml: any = LocaleData.getTaskByType(VarVal.taskType.clan);
        let taskArr = []
        let fullInfoTask = GameServerData.getInstance().getTaskState(VarVal.taskType.clan);
        for (let i = 0; i < taskXml.length; i++) {
            const element = taskXml[i];
            if (element.subType == "1") {
                taskArr.push(element)
            }
        }
        for (let i = 0; i < fullInfoTask.length; i++) {
            let item1 = fullInfoTask[i];
            for (let j = 0; j < taskArr.length; j++) {
                let item2 = taskArr[j]
                if (item1.id == item2.id) {
                    if (item1.state == 2) {
                        return true
                    }
                }
            }
        }
        let calnActive: any = LocaleData.getClanActiveById("")
        for (let index = 0; index < calnActive.length; index++) {
            const element = calnActive[index];
            if ((index + 1) > myselfInfo.dailyActiveNode) {
                if (Number(clanInfo.dailyActiveScore) >= Number(calnActive[index].activeScore)) {
                    return true
                } else {
                    // obj.text = calnActive[index].activeScore + "不"
                }
            } else {
                // obj.text = calnActive[index].activeScore + "已"
            }
        }
        return false
    }
    public static isViewRedPointEvolve(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.clan) || !GameServerData.getInstance().isClanHas()) {
            return false;
        }
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanMember = playerClanInfo.clanMember
        let myselfInfo = playerClanInfo.myselfInfo
        let clanEvolveArr = []
        for (let i = 0; i < clanMember.length; i++) {
            const element = clanMember[i];
            if (element.evolveHelpLevel > element.playerInfo.evolutionLevel
                && element.playerInfo.evolveFinishTime != 0
                && element.playerInfo.evolveFinishTime > GameServerData.getInstance().getServerTime()) {
                clanEvolveArr.push(element)
            }
        }
        if (clanEvolveArr.length > 0) {
            for (let index = 0; index < clanEvolveArr.length; index++) {
                if (clanEvolveArr[index].playerId != myselfInfo.playerId) {
                    if (clanEvolveArr[index].evolveHelper != "") {
                        let red: boolean = true
                        let evolveHelperStr: string[] = clanEvolveArr[index].evolveHelper.split(",")
                        if (evolveHelperStr.length == 10) {
                            red = false
                        } else {
                            for (let i = 0; i < evolveHelperStr.length; i++) {
                                if (evolveHelperStr[i] == myselfInfo.playerId) {
                                    red = false
                                }
                            }
                        }
                        if (red) {
                            return true
                        }
                    } else {
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