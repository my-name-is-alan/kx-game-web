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
import { BattleResultParams, BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { LyGuideDetail } from "./LyGuideDetail";
import { LyChatRoom } from "./LyChatRoom";
import { GameServer } from "../Kernel/GameServer";
import { LyBrumeIsleLand } from "./LyBrumeIsleLand";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { Vec2 } from "cc";
import { FguiGTween } from "../Kernel/FguiGTween";
import { LyBattleResult } from "./LyBattleResult";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { LyBrumeIsle } from "./LyBrumeIsle";

export class LyBrumeIsleLog extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyBrumeIsle";
        this.viewResI.pkgName = "LyBrumeIsle";
        this.viewResI.comName = "LyBrumeIsleLog";
    }
    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        let xmlRoot = LocaleData.getBrumeIsleConfig()
        getUiPanel.getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleLog, 0, null);
        }); 
        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleLog, 0, null);
        })
        let group_null = group_main.getChild("group_null")
        UtilsUI.playCommonGroupAni(group_main, null);
        let isLeData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster

        let label_xzNumber = group_main.getChild("label_xzNumber", fgui.GLabel)
        label_xzNumber.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR27, [Number(xmlRoot.assistanceFrequency) - isLeData.helpBattleCnt]); 
        group_main.getChild("btn_point", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:StrVal.LyBRUMEISLE.STR0, detail: xmlRoot.detail });
        });
        let timeCallBack = []
        let monsterHelp = []
        let list_all: fgui.GList = group_main.getChild("list_all")
        let guid = GameServerData.getInstance().getPlayerFullInfo().base.guid

        list_all.setVirtual()
        list_all.itemRenderer = (index: number, child: fgui.GComponent)=>{
            let markMonsterHelp = monsterHelp[index];
            let markMonsterItem = markMonsterHelp.markMonsterItem
            let monsterEvent = LocaleData.getBrumeIsleMonster(markMonsterItem.monsterConfigID)
            let btn_attack = child.getChild("btn_attack", fgui.GButton)
            btn_attack.clearClick()
            let btn_get = child.getChild("btn_get", fgui.GButton)
            btn_get.clearClick()
            btn_get.title = StrVal.LyBRUMEISLE.STR34
            child.getChild("img_me").visible = markMonsterItem.playerId == guid
            child.getChild("group_attack").visible = markMonsterItem.monsterCURHP != 0
            // child.getChild("self").visible = markMonsterItem.playerId != guid
            child.getChild("group_get").visible = markMonsterItem.monsterCURHP == 0
            child.getChild("img_fail").visible = markMonsterItem.monsterCURHP == 0
            PointRedData.getInstance().updateManualPoint(btn_get, LyBrumeIsle.isActOpen() && markMonsterItem.monsterCURHP == 0)
            child.getChild("label_zone").text = LocaleData.getBrumeIsleZone(monsterEvent.group).name
            let label_time = child.getChild("label_time", fgui.GLabel)
            let monsterProto = LocaleData.getMonsterProto(monsterEvent.monsterId)
            let modelShowInfo = LocaleData.getModelShowInfo(monsterProto.modelId);
            new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true)
            }, child.getChild("loader3d_monster"), modelShowInfo.spine);
            child.getChild("label_name").text = markMonsterItem.name
            let bar_hp: fgui.GProgressBar = child.getChild("bar_hp")
            bar_hp.max = markMonsterItem.monsterMAXHP
            bar_hp.value = markMonsterItem.monsterCURHP
            let boids = monsterEvent.bonuses.split("-")
            let bounItems = []
            for (let index = 0; index < boids.length; index++) {
                let id = boids[index];
                let bs = UtilsUI.getBonuseItemsByBonusesId(id)
                for (let index = 0; index < bs.length; index++) {
                    const element = bs[index];
                    bounItems.push(element)
                }
            }
            child.getChild("label_monstername").text = monsterProto.name
            let list_item: fgui.GList = child.getChild("list_item")
            list_item.itemRenderer = (index1: number, child1:fgui.GComponent)=>{
                UtilsUI.setUIGroupItem(bounItems[index1], child1, null);
            };
            UtilsUI.setFguiGlistDelayNumItems(list_item, bounItems.length);
            if (markMonsterHelp.time != 0 && markMonsterItem.monsterCURHP != 0) {
                label_time.visible = true
                timeCallBack.push((severTime: number)=>{
                    let paseTime = markMonsterHelp.time + (Number(xmlRoot.intervalTime) * 3600) - severTime
                    label_time.text = UtilsTool.splitTimeString(paseTime ) 
                    if (paseTime <= 0) {
                        label_time.visible = false
                    }
                });
            }else{
                label_time.visible = false
            }
            btn_attack.onClick(()=>{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        let bounArr = []
                        if (args.pRankNum) {
                            let boun = UtilsUI.getBonuseItem(VarVal.bonusType.brumeIsleScore, null, null, args.pRankNum)
                            bounArr.push(boun)
                        }
                        if (args.gRankNum) {
                            let bounm = UtilsUI.getBonuseItem(VarVal.bonusType.brumeIsleClanScore, null, null, args.gRankNum)
                            bounArr.push(bounm)
                        }
                        let desc = args.battleResult.isWin ? StrVal.LyBRUMEISLE.STR2: StrVal.LyBRUMEISLE.STR3
                        let resultParams: BattleResultParams = {
                            battleResult: args.battleResult,
                            bonuseString: "",
                            typeInfo: {
                                type: VarVal.BATTLE_TYPE.BRUMELISLE_ATTACK,
                                desc1: UtilsTool.stringFormat(desc, [modelShowInfo.name, UtilsTool.nToFStr(args.attackDamageCount)]),
                                bonunItems: bounArr,
                                callBack: ()=>{
                                    // this.refreshPage()
                                },
                            },
                        }
                        
                        for (let index = 0; index < monsterHelp.length; index++) {
                            const element = monsterHelp[index].markMonsterItem;
                            if (args.markMonsterHelp.markMonsterItem.monsterCURHP == 0 && element.playerId != guid) {
                                monsterHelp.splice(index, 1);
                                break
                            }
                            if (element.playerId == args.markMonsterHelp.markMonsterItem.playerId) {
                                monsterHelp[index] = args.markMonsterHelp
                                break
                            }
                        }
                        refreshUI()
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleResult, 0, resultParams);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"domainHelpBatle", { id: markMonsterItem.playerId });
            });
            btn_get.onClick(()=>{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        for (let index = 0; index < monsterHelp.length; index++) {
                            const element = monsterHelp[index].markMonsterItem;
                            if (element.playerId == guid) {
                                monsterHelp.splice(index, 1);
                                break
                            }
                        }
                        refreshUI()
                        PointRedData.getInstance().updatePointChild(PointRedType.LyBrumeIsMarkGet)
                        let bounArr = []
                        if (args.gRankNum) {
                            let bounm = UtilsUI.getBonuseItem(VarVal.bonusType.brumeIsleClanScore, null, null, args.gRankNum)
                            bounArr.push(bounm)
                        }
                        if (args.bonusesResult) {
                            let bonuseString:string;
                            bonuseString = GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]);
                            let arr =  UtilsUI.getBonuseItemsByString(bonuseString)
                            for (let index = 0; index < arr.length; index++) {
                                let element = arr[index];
                                bounArr.push(element)
                            }
                        }
                        UtilsUI.showItemReward({bonuseItems: bounArr});
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"getMarkMonsterDieBonuses", null);
            });
        }   
        UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    for (let index = 0; index < args.markMonsterHelp.length; index++) {
                        let element = args.markMonsterHelp[index];
            
                        if (element.markMonsterItem.monsterCURHP != 0) {
                            monsterHelp.push(element)
                        }else if (element.markMonsterItem.playerId == guid){
                            monsterHelp.push(element) //自己可领奖的
                        }
                    }
                    monsterHelp.sort((a, b): number=>{
                        let aN = 0
                        let bN = 0
                        if (a.markMonsterItem.playerId == guid) {
                            aN = 1
                        }else{
                            aN = 0
                        }
                        if (b.markMonsterItem.playerId == guid) {
                            bN = 1
                        }else{
                            bN = 0
                        }
                        return bN - aN
                    })
                    refreshUI()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
        } ,"getClanMarkMonsterList", null);

        let severTime: number = 0
        let interCallBack = ()=>{
            severTime = GameServerData.getInstance().getServerTime()
            for (let index = 0; index < timeCallBack.length; index++) {
                timeCallBack[index](severTime)
            }
        }
        interCallBack()
        this.setInterval(()=>{
            interCallBack()
        }, 1000);


        let refreshUI = ()=>{
            group_null.visible = monsterHelp.length == 0
            UtilsUI.setFguiGlistDelayNumItems(list_all, monsterHelp.length);
            isLeData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster
            label_xzNumber.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR27, [Number(xmlRoot.assistanceFrequency) - isLeData.helpBattleCnt]); 
        }
    }

    public onViewUpdate(params: any): void {
        
    }
    public getIsViewMask(): boolean {
        return false;
    }
}


