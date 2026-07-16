//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { LyGuideDetail } from "./LyGuideDetail";
import { LyChatRoom } from "./LyChatRoom";
import { GameServer } from "../Kernel/GameServer";
import { LyBrumeIsleLand } from "./LyBrumeIsleLand";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { Label } from "cc";
import { LyBrumeNote } from "./LyBrumeNote";
import { LyBrumeIsleAward } from "./LyBrumeIsleAward";
import { LyBrumeIsleRank } from "./LyBrumeIsleRank";
import { LyBrumeIsleGift } from "./LyBrumeIsleGift";
import { LyBrumeIsleFire } from "./LyBrumeIsleFire";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";

export class LyBrumeIsle extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyBrumeIsle";
        this.viewResI.pkgName = "LyBrumeIsle";
        this.viewResI.comName = "LyBrumeIsle";
    }
    private group_chat: fgui.GComponent


    private xmlRoot: any

    private isLeData
    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        let durationOpen: boolean = false
        this.xmlRoot = LocaleData.getBrumeIsleConfig()
        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsle, 0, null);
        });
        let label_joinPaseTime = group_main.getChild("label_joinPaseTime", fgui.GLabel)
        let label_openTime = group_main.getChild("label_openTime", fgui.GLabel)
        let label_jointime = group_main.getChild("label_jointime", fgui.GLabel)
        let btn_join = group_main.getChild("btn_join", fgui.GButton) 
        let btn_Overreward = group_main.getChild("btn_Overreward", fgui.GButton) 
        let btn_ready = group_main.getChild("btn_ready", fgui.GButton) 
        let label_sever = group_main.getChild("label_sever", fgui.GLabel) 
        let label_moreSever = group_main.getChild("label_moreSever", fgui.GLabel) 
        let group_sever = group_main.getChild("group_sever", fgui.GGroup) 
        let list_allSever = group_main.getChild("list_allSever", fgui.GList) 
        let btn_severCloseBtn = group_main.getChild("btn_closeSever")
        let img_taskLose = group_main.getChild("group_task", fgui.GComponent).getChild("img_lose")
        group_main.getChild("label_actTime", fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR46, [this.xmlRoot.durationTime]); 
        label_moreSever.onClick(()=>{
            group_sever.visible = true
        });
        
        group_main.getChild("btn_rank", fgui.GButton).onClick(()=>{
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleRank, 0, args);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "getDomainPRank", {
                from:1,
                to:200,
            });
        });
        group_main.getChild("btn_reward", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleAward, 0, null);
        });
        group_main.getChild("btn_point", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:StrVal.LyBRUMEISLE.STR0, detail: this.xmlRoot.detail });
        });

        let btn_gift = group_main.getChild("btn_gift", fgui.GButton)
        PointRedData.getInstance().registerPoint(btn_gift, PointRedType.LyBrumeIsGift);
        btn_gift.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleGift, 0, null);
        });
        group_main.getChild("btn_note", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeNote, 0, null);
        });

        let btn_chests = group_main.getChild("btn_chests", fgui.GButton)
        PointRedData.getInstance().registerPoint(btn_chests, PointRedType.LyBrumeIsFire);
        btn_chests.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleFire, 0, null);
        });
        btn_severCloseBtn.onClick(()=>{
            group_sever.visible = false
        });
        let arrName = []
        UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    if (args.serverArr) {
                        for (let index = 0; index < args.serverArr.length; index++) {
                            let serverId = args.serverArr[index];
                            let severData = PlatformAPI.getGameServerItem(serverId)
                            if (severData) {
                                arrName.push(severData.name) 
                            }
                        }
                        let str = ""
                        if (arrName.length <= 2) {
                            for (let index = 0; index < arrName.length; index++) {
                                const element = arrName[index];
                                str = str + element + ","
                            }
                        }else{
                            str = arrName[0] + "," + arrName[1] + "...";
                        }
                        label_sever.text = str
                        list_allSever.numItems = arrName.length;
                        if (args.openTimeData) {
                            label_openTime.text = UtilsTool.TimeToStr(args.openTimeData.openTime) + "~" + UtilsTool.TimeToStr(args.openTimeData.endTime)
                            label_jointime.text = label_openTime.text
                        }
                    }
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
        } ,"getServerGroupList", null);
        list_allSever.itemRenderer = (index:number, child:fgui.GComponent)=>{
            child.getChild("n36").text = arrName[index]
        }
        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true)
        }, group_main.getChild("loader_bg"), "jm_wuyindao_bg");

        let activityOpenState = GameServerData.getInstance().getActivityOpenState(VarVal.ACTIVITY_ID.BRUMEISLE);
        let statChange = ()=>{
            activityOpenState = GameServerData.getInstance().getActivityOpenState(VarVal.ACTIVITY_ID.BRUMEISLE);
            btn_join.visible = activityOpenState.state == 1
            label_joinPaseTime.visible = activityOpenState.state == 1
            btn_Overreward.visible = activityOpenState.state == 2
            btn_ready.visible = activityOpenState.state == 0
        }
        statChange()
        PointRedData.getInstance().registerPoint(btn_join, PointRedType.LyBrumeIsJoin)        
        btn_join.onClick(()=>{
            if (durationOpen) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleLand, 0, null);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"enterDomainActivity", null);
            }else {
                UtilsUI.showMsgTip(StrVal.LyBRUMEISLE.STR41)
            }
        });
        
        //durationTime    10:00-22:00
        let severTime: number = GameServerData.getInstance().getServerTime() * 1000
        let getStartDateTime = UtilsTool.getStartDateTime(severTime)
        let durationTime = this.xmlRoot.durationTime.split("-")
        let start_time = durationTime[0]
        let end_time = durationTime[1]
        let house1 = getStartDateTime + Number(start_time.split(":")[0]) * 3600 *1000
        let house2 = getStartDateTime + Number(end_time.split(":")[0]) * 3600 *1000

        let taskData = LocaleData.getBrumeIsleTask(1)[0]
        let task1 = getStartDateTime + Number(taskData.timeLimit.split(":")[0]) * 3600 *1000 + Number(taskData.timeLimit.split(":")[1] * 60 * 1000)
        let interCallBack = ()=>{
            if (activityOpenState.state == 1) {
                let severTime = GameServerData.getInstance().getServerTime()
                let severTimeHM = severTime * 1000
                if (severTimeHM >= house1 && severTimeHM <= house2) {
                    durationOpen = true
                }else {
                    durationOpen = false
                }
                label_joinPaseTime.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR40, [UtilsTool.splitTimeString(activityOpenState.startTime - severTime)]) 
                if (severTimeHM < task1) {
                    img_taskLose.visible = false
                }else{
                    let taskState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster.domainTask
                    if (taskState.takeState == 0) {
                        img_taskLose.visible = true
                    }
                }
            }
        }
        interCallBack()
        this.setInterval(()=>{
            interCallBack()
        }, 1000);

        // 聊天
        this.group_chat = group_main.getChild("Group_Chat")
        this.group_chat.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyChatRoom, 0, { isNewMsgChannel: true });
        })
        this.showChatRoomLast();
        this.refreshTask()
       
        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == VarVal.ACTIVITY_ID.BRUMEISLE) {
                this.refreshPage()
            }
        }, "activityStateChanged");
        this.registerRequest((args) => {
            if (String(args.id) == VarVal.ACTIVITY_ID.BRUMEISLE) {
                statChange()
            }
        }, "activityOpenState");
    }

    private refreshPage(){
        this.isLeData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster
    }
   
    // 聊天
    private showChatRoomLast(): void {
        let label_content = this.group_chat.getChild("label_content", fgui.GTextField);
        let chatmsg = LyChatRoom.getChatShowMainPage();
        if (chatmsg) {
            label_content.text = chatmsg;
        } else {
            label_content.text = "";
        }
    }

    public onViewUpdate(params: any): void {
        if (params.isChatRoomMsg) {
            this.showChatRoomLast();
        }
    }

    public static getValueNumber(id: number| string): string{
        id = String(id)
        let isLeData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster
        if (isLeData && isLeData.allProperty != undefined) {
            for (let index = 0; index < isLeData.allProperty.length; index++) {
                let property = isLeData.allProperty[index];
                if (property.id == id) {
                    return String(property.count) 
                }
            }  
        }
        return "0"
    }

    public refreshTask(){
        let activityOpenState = GameServerData.getInstance().getActivityOpenState(VarVal.ACTIVITY_ID.BRUMEISLE);
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        let group_task: fgui.GComponent = group_main.getChild("group_task")
        group_task.clearClick()
        if (activityOpenState.state == 1) {
            let taskState
            let domainTasks = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster.domainTask
            let taskData = LocaleData.getBrumeIsleTask(1)[0]
            for (let index = 0; index < domainTasks.length; index++) {
                const element = domainTasks[index];
                if (element.id == 1) {
                    taskState = element
                    break
                }
            }
            group_task.getChild("label_taskDes").text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR53, [taskData.objective]) 
            group_task.getChild("label_time").text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR54, [taskData.timeLimit]);
            let bonunItem = UtilsUI.getBonuseItemsByBonusesId(taskData.bonusesID)
            group_task.getChild("label_number").text = bonunItem[0].count
            group_task.getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}", [bonunItem[0].proto.icon]);
            group_task.getChild("img_red_point").visible = taskState.takeState == 1
            group_task.getChild("img_get").visible = taskState.takeState == 2
            group_task.onClick(()=>{
                // if (taskState.takeState == 1) {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.refreshTask()
                            UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])})
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"domainTakeTaskBonuses", {id: Number(taskData.id)} );
                // }
            })
        }else{
            group_task.visible = false
        }
       
      
    }

    public onViewShowFront(): void {
        this.refreshTask()
    }

    public getIsViewMask(): boolean {
        return false;
    }

    public static isActOpen(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.BrumeIsle)) {
            return false
        }
        // 雾隐岛
        let activityBRUMOpenState = GameServerData.getInstance().getActivityOpenState(VarVal.ACTIVITY_ID.BRUMEISLE);
        if (activityBRUMOpenState && (activityBRUMOpenState.state == 1))  { // 1是开始
            return true
        }
        return false
    }
    

    public static isActNoClose(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.BrumeIsle)) {
            return false
        }
        // 雾隐岛
        let activityBRUMOpenState = GameServerData.getInstance().getActivityOpenState(VarVal.ACTIVITY_ID.BRUMEISLE);
        if (activityBRUMOpenState && (activityBRUMOpenState.state == 1 || activityBRUMOpenState.state == 2))  { // 1是开始
            return true
        }
        return false
    }
    
    public static isRedPointMarkDie(): boolean {
        // 雾隐岛
        if (LyBrumeIsle.isActOpen()) {
            let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE);
            if (activityState && activityState.data) {
                let burmData = activityState.data.activityDomainMonster;
                if (burmData) {
                    if (burmData.moarkMonsterList.length > 0 && burmData.moarkMonsterList[0].monsterCURHP <= 0) {
                        return true
                    }
                }
            }
        }
        return false
    }

    public static isRedPointFullPower(): boolean {
        // 雾隐岛
        if (LyBrumeIsle.isActOpen()) {
            let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE);
            if (activityState && activityState.data) {
                let xmlRoot = LocaleData.getBrumeIsleConfig()
                let burmData = activityState.data.activityDomainMonster;
                if (burmData && burmData.energy >= Number(xmlRoot.energyMax)) {
                    return true
                }
            }
        }
        return false
    }
}


