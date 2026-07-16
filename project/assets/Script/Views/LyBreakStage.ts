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
import { GuideManager } from "../Kernel/GuideManager";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyThunder } from "./LyThunder";
import { AudioManager } from "../Kernel/AudioManager";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";

export class LyBreakStage extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyBreakStage";
        this.viewResI.pkgName = "LyBreakStage";
        this.viewResI.comName = "LyBreakStage";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        this.uiPanel = this.getUiPanel().getChild("group_breakStage");
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBreakStage, 0, null);
        })
        let btn_close1: fgui.GButton = this.getUiPanel().getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBreakStage, 0, null);
        })
        let label_str4: fgui.GLabel = this.uiPanel.getChild("label_str4")
        let label_str3: fgui.GLabel = this.uiPanel.getChild("label_str3")
        let label_str5_1: fgui.GLabel = this.uiPanel.getChild("label_str5_1")
        let label_str5_2: fgui.GLabel = this.uiPanel.getChild("label_str5_2")
        label_str4.text = StrVal.LYBREAKSTAGE.STR4
        label_str3.text = StrVal.LYBREAKSTAGE.STR3
        label_str5_1.text = StrVal.LYBREAKSTAGE.STR5
        label_str5_2.text = StrVal.LYBREAKSTAGE.STR5
        this.registerRequest((args) => {
            this.initialize()
        }, "playerAttrChanged");
        //--- 角色信息 ---
        this.initialize()
    };
    private initialize(): void {
        let fullInfo: any = GameServerData.getInstance().getPlayerFullInfo()
        let playerbase: any = fullInfo.base

        let playerPhase0: any = LocaleData.getPlayerPhaseById(playerbase.phase)
        let playerPhase1: any = LocaleData.getPlayerPhaseById(playerbase.phase + 1)
        let playerPhase2: any = LocaleData.getPlayerPhaseById(playerbase.phase + 2)
        if (!playerPhase1) {
            playerPhase1 = playerPhase0
        }
        if (!playerPhase2) {
            playerPhase2 = playerPhase0
        }
        // let playerPhase: any = [playerPhase11, playerPhase22]
        let playerLevel: any = LocaleData.getPlayerGrowByLevel(playerbase.level)//升级信息
        // 等级上线
        let label_level1: fgui.GLabel = this.uiPanel.getChild("label_level1")
        let label_level2: fgui.GLabel = this.uiPanel.getChild("label_level2")
        let exp: number = playerbase.exp
        let maxLevel: number = playerPhase1.level
        while (exp >= 0) {
            let itemExp = 0
            if (LocaleData.getPlayerGrowByLevel(maxLevel)) {
                itemExp = LocaleData.getPlayerGrowByLevel(maxLevel).exp
                exp = exp - itemExp
                maxLevel++
            } else {
                exp = -1
            }
        }
        maxLevel--
        if (maxLevel <= playerPhase1.level) {
            maxLevel++
        }
        maxLevel = maxLevel > playerPhase2.level ? playerPhase2.level : maxLevel
        let levelArr1 = LocaleData.getPlayerGrowArrByLevel(fullInfo.base.level)
        let levelArr2 = LocaleData.getPlayerGrowArrByLevel(maxLevel)
        let hp1: number = 0
        let attack1: number = 0
        let defense1: number = 0
        let spd1: number = 0

        let hp2: number = 0
        let attack2: number = 0
        let defense2: number = 0
        let spd2: number = 0
        for (let i = 0; i < levelArr1.length; i++) {
            let item = levelArr1[i];
            let itemAttr = item.baseAttrs.split(",")
            hp1 += Number(itemAttr[0])
            attack1 += Number(itemAttr[1])
            defense1 += Number(itemAttr[2])
            spd1 += Number(itemAttr[3])
        }
        for (let i = 0; i < levelArr2.length; i++) {
            let item = levelArr2[i];
            let itemAttr = item.baseAttrs.split(",")
            hp2 += Number(itemAttr[0])
            attack2 += Number(itemAttr[1])
            defense2 += Number(itemAttr[2])
            spd2 += Number(itemAttr[3])
        }

        hp2 -= hp1
        attack2 -= attack1
        defense2 -= defense1
        spd2 -= spd1
        label_level1.text = UtilsTool.stringFormat(StrVal.LYBREAKSTAGE.STR1, [playerPhase1.level])
        label_level2.text = UtilsTool.stringFormat(StrVal.LYBREAKSTAGE.STR1, [playerPhase2.level])
        let label_attack1: fgui.GLabel = this.uiPanel.getChild("label_attack1")
        let label_attack2: fgui.GLabel = this.uiPanel.getChild("label_attack2")
        label_attack1.text = UtilsTool.nToFStr(attack1);
        label_attack2.text = UtilsTool.stringFormat(StrVal.LYBREAKSTAGE.STR2, [UtilsTool.nToFStr(attack2)]);
        let label_hp1: fgui.GLabel = this.uiPanel.getChild("label_hp1")
        let label_hp2: fgui.GLabel = this.uiPanel.getChild("label_hp2")
        label_hp1.text = UtilsTool.nToFStr(hp1);
        label_hp2.text = UtilsTool.stringFormat(StrVal.LYBREAKSTAGE.STR2, [UtilsTool.nToFStr(hp2)]);
        let label_defense1: fgui.GLabel = this.uiPanel.getChild("label_defense1")
        let label_defense2: fgui.GLabel = this.uiPanel.getChild("label_defense2")
        label_defense1.text = UtilsTool.nToFStr(defense1);
        label_defense2.text = UtilsTool.stringFormat(StrVal.LYBREAKSTAGE.STR2, [UtilsTool.nToFStr(defense2)]);
        let label_spd1: fgui.GLabel = this.uiPanel.getChild("label_spd1")
        let label_spd2: fgui.GLabel = this.uiPanel.getChild("label_spd2")
        label_spd1.text = UtilsTool.nToFStr(spd1);
        label_spd2.text = UtilsTool.stringFormat(StrVal.LYBREAKSTAGE.STR2, [UtilsTool.nToFStr(spd2)]);

        let bar_exp: fgui.GProgressBar = this.uiPanel.getChild("bar_exp")
        if (playerLevel.exp == "0") {
            bar_exp.value = 1;
        } else {
            bar_exp.max = playerLevel.exp
            bar_exp.value = playerbase.exp
        }
        let btn_up: fgui.GButton = this.uiPanel.getChild("btn_up")
        btn_up.text = StrVal.LYBREAKSTAGE.STR6
        // 阶段名字
        let label_stage1: fgui.GLabel = this.uiPanel.getChild("label_stage1")
        label_stage1.text = playerPhase0.name
        let group_stage: fgui.GComponent = this.uiPanel.getChild("group_stage")

        let img_stage: fgui.GLoader = group_stage.getChild("img_stage")
        let img_stage1: fgui.GLoader = group_stage.getChild("img_stage1")
        if (playerPhase1) {
            img_stage.url = UtilsTool.stringFormat("ui://CCommon/s_phase{0}", [Math.ceil(playerPhase1.id / 3)]);
            img_stage1.url = UtilsTool.stringFormat("ui://CCommon/phase_stage_{0}", [playerPhase1.id % 3]);
        }
        let stageData1: any = {
            data: playerPhase0,
            attrs: [
                label_hp1.text,
                label_attack1.text,
                label_defense1.text,
                label_spd1.text
            ]
        }
        let stageData2: any = {
            data: playerPhase1,
            attrs: [
                UtilsTool.nToFStr(hp1 + hp2),
                UtilsTool.nToFStr(attack1 + attack2),
                UtilsTool.nToFStr(defense1 + defense2),
                UtilsTool.nToFStr(spd1 + spd2)
            ]
        }
        PointRedData.getInstance().registerPoint(btn_up, PointRedType.LyBreakStageBreak);
        btn_up.clearClick()
        btn_up.onClick(() => {
            // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyThunder, 0, { "stageData1": stageData1, "stageData2": stageData2 });
            // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBreakStage, 0, null);

            if (fullInfo.base.level < Number(LocaleData.getPlayerMaxLevel())) {
                let isGet: boolean = false
                let taskStates = GameServerData.getInstance().getTaskState(VarVal.taskType.break);
                for (let i = 0; i < taskStates.length; i++) {
                    if (String(taskStates[i].state) == "2") {
                        isGet = true
                    }
                }
                if (playerbase.level == playerPhase1.level && playerbase.exp >= playerLevel.exp && this.isTaskOpen) {
                    // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBreakStage, 0, null);
                    if (isGet) {
                        UtilsUI.showMsgTip(StrVal.LYBREAKSTAGE.STR7)
                    } else {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyThunder, 0, { "stageData1": stageData1, "stageData2": stageData2 });
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBreakStage, 0, null);
                    }
                } else {
                    UtilsUI.showMsgTip(StrVal.LYBREAKSTAGE.STR8)
                }
            } else {

            }

        })
        let group_task1: fgui.GComponent = this.uiPanel.getChild("group_task1")
        let group_task2: fgui.GComponent = this.uiPanel.getChild("group_task2")
        let group_task3: fgui.GComponent = this.uiPanel.getChild("group_task3")
        this.taskArr = [group_task1, group_task2, group_task3]
        let taskStates = GameServerData.getInstance().getTaskState(VarVal.taskType.break);
        for (let i = 0; i < taskStates.length; i++) {
            this.onTask(this.taskArr[i], taskStates[i])
        }
    }
    private taskArr: Array<fgui.GComponent> = []
    private isTaskOpen: boolean = true//任务是否全部完成
    private onTask(group_task: fgui.GComponent, taskData: any): void {
        if (group_task && taskData) {
            //任务
            let img_icon: fgui.GButton = group_task.getChild("img_icon");
            let label_dec: fgui.GButton = group_task.getChild("label_dec");
            let label_task: fgui.GButton = group_task.getChild("label_task");
            let label_state: fgui.GTextField = group_task.getChild("label_state")
            let img_state: fgui.GLoader = group_task.getChild("img_state")
            let ani_ok: fgui.Transition = group_task.getTransition("ani_ok")
            let group_icon: fgui.GComponent = group_task.getChild("group_icon")
            if (taskData.state == 1) {
                this.isTaskOpen = false
                label_state.text = StrVal.LYBREAKSTAGE.STR9
                label_state.color = new Color(71, 117, 87, 255);
                img_state.url = "ui://LyBreakStage/frame_task reward1"
                ani_ok.stop()
                group_icon.rotation = 0
            } else if (taskData.state == 2) {
                label_state.text = StrVal.LYBREAKSTAGE.STR10
                label_state.color = new Color(179, 93, 0, 255);
                img_state.url = "ui://LyBreakStage/frame_task reward2"
                // ani_ok.play()
            } else if (taskData.state == 3) {
                label_state.text = StrVal.LYBREAKSTAGE.STR11
                label_state.color = new Color(130, 145, 147, 255);
                img_state.url = "ui://LyBreakStage/frame_task reward3"
                ani_ok.stop()
                group_icon.rotation = 0
            }
            let mainTaskId: any = taskData.id

            let taskInfo: any = LocaleData.getTaskRoot(mainTaskId)
            let taskNum: number = taskInfo.conditionParam.split(",")[0]

            let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(taskInfo.bonusesId);
            UtilsUI.setUIGroupItem(bonuseItems[0], group_icon, null);
            let mainCount: number = taskData.count
            if (LocaleData.getTaskSpecialTaskType(taskInfo.conditionType)) {
                taskNum = 1
            }
            if (LocaleData.getTaskSpecialTaskType(taskInfo.conditionType)) {
                if (taskData.state == 2 || taskData.state == 3) {//可领取
                    mainCount = 1
                } else {
                    mainCount = 0
                }
            }
            label_dec.text = taskInfo.desc
            label_task.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR2, [mainCount, taskNum]);
            group_task.clearClick()
            group_task.onClick(() => {
                if (taskData.state == 2) {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                            let taskStates = GameServerData.getInstance().getTaskState(VarVal.taskType.break);
                            for (let i = 0; i < taskStates.length; i++) {
                                this.onTask(this.taskArr[i], taskStates[i])
                            }
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    }, "takeTaskBonuses", {
                        id: taskData.id
                    })
                } else if (taskData.state == 1) {
                    // UtilsUI.showMsgTip(StrVal.LYBREAKSTAGE.STR12)
                    let taskXml: any = LocaleData.getTaskRoot(taskData.id)
                    if (taskXml.conditionType == VarVal.StageTaskType.cutTree ||
                        taskXml.conditionType == VarVal.StageTaskType.level) {
                        GuideManager.startGuide({
                            guideType: VarVal.GUIDE_TYPE.KANSHU, // 砍树
                        });
                    } else if (taskXml.conditionType == VarVal.StageTaskType.adventureMax) {
                        GuideManager.startGuide({
                            guideType: VarVal.GUIDE_TYPE.CHALLENGE_STAGE,// 冒险
                        });
                    } else if (taskXml.conditionType == VarVal.StageTaskType.evolution) {
                        GuideManager.startGuide({
                            guideType: VarVal.GUIDE_TYPE.EVOLUTION, // 仙树升级
                        });
                    }
                } else if (taskData.state == 3) {
                    // UtilsUI.showMsgTip(StrVal.LYBREAKSTAGE.STR10)
                }
            })
        }
    }
    public static isViewRedPointBreak(): boolean {
        let fullInfo: any = GameServerData.getInstance().getPlayerFullInfo()
        if (!fullInfo || !fullInfo.base) {
            return false;
        }
        let playerbase: any = fullInfo.base
        let playerPhase0: any = LocaleData.getPlayerPhaseById(playerbase.phase)
        let playerPhase1: any = LocaleData.getPlayerPhaseById(playerbase.phase + 1)
        let playerLevel: any = LocaleData.getPlayerGrowByLevel(playerbase.level)//升级信息
        if (!playerPhase1) {
            playerPhase1 = playerPhase0
        }
        if (!playerPhase1 || !playerLevel) {
            return false;
        }
        let taskStates = GameServerData.getInstance().getTaskState(VarVal.taskType.break) || [];
        let isDone = true;
        for (let i = 0; i < taskStates.length; i++) {
            if (taskStates[i].state == 1) {
                isDone = false;
                break;
            }
        }
        return (playerbase.level == playerPhase1.level && playerbase.exp >= playerLevel.exp) && isDone;
    }

    public static isViewRedPointTake(): boolean {
        let taskStates = GameServerData.getInstance().getTaskState(VarVal.taskType.break) || [];
        for (let i = 0; i < taskStates.length; i++) {
            if (taskStates[i].state == 2) {
                return true;
            }
        }
        return false;
    }

    public onViewUpdate(params: any): void {
        this.initialize()
    }
    public getIsViewMask(): boolean {
        return false;
    };

}