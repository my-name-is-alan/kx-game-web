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
import { LyChatRoom } from "./LyChatRoom";
import { GameServer } from "../Kernel/GameServer";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { LyClanJoin } from "./LyClanJoin";
import { LyGrabCityTower } from "./LyGrabCityTower";
import { LyGrabCityGuess } from "./LyGrabCityGuess";
import { LyGrabCityZone } from "./LyGrabCityZone";
import { LyGrabCityZongLan } from "./LyGrabCityZongLan";
import { LyGrabCityReady } from "./LyGrabCityReady";
import { LyItemRewardCityWin } from "./LyItemRewardCityWin";
import { LyItemRewardCityLose } from "./LyItemRewardCityLose";
import { LyGrabCityRank } from "./LyGrabCityRank";
import { LyGrabCityGift } from "./LyGrabCityGift";
import { LyGrabCityAward } from "./LyGrabCityAward";
import { LyGrabCityClanHelp } from "./LyGrabCityClanHelp";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { LyGrabCityGroup } from "./LyGrabCityGroup";
import { LyPalaceLike, PalaceLikeData } from "./LyPalaceLike";
import { LyGuideDetail } from "./LyGuideDetail";

export enum GrabCityState {
    close   = 0,
    signUp  = 1,
    ready1  = 2,
    battle1 = 3,
    ready2  = 4,
    battle2 = 5,
    over    = 6,
}





export class LyGrabCity extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyGrabCity";
        this.viewResI.pkgName = "LyGrabCity";
        this.viewResI.comName = "LyGrabCity";
    }
    public static GrabCityActItem = [VarVal.bonusType.grabCityTiger, VarVal.bonusType.grabCitysw, VarVal.bonusType.grabCityDonate, VarVal.bonusType.grabCityDraw];
    private group_chat: fgui.GComponent
    private xmlRoot: any
    private grabCityData: any
    public onViewCreate(params:any): void {
        // let getUiPanel: fgui.GComponent = ;
        let group_main: fgui.GComponent = this.getUiPanel()
        let durationOpen: boolean = false
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        this.grabCityData = fullInfo.grabCityPlayer
        let actState = fullInfo.grabCityPlayer.state
        this.xmlRoot = LocaleData.getGrabCityRoot()
        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCity, 0, null);
        });
        let label_stateTime = group_main.getChild("label_stateTime", fgui.GLabel)
        let label_openTime = group_main.getChild("label_openTime", fgui.GLabel)
        let label_jointime = group_main.getChild("label_jointime", fgui.GLabel)
        let btn_join = group_main.getChild("btn_join", fgui.GButton) 
        let label_sever = group_main.getChild("label_sever", fgui.GLabel) 
        let label_moreSever = group_main.getChild("label_moreSever", fgui.GLabel) 
        let group_sever = group_main.getChild("group_sever", fgui.GGroup) 
        let list_allSever = group_main.getChild("list_allSever", fgui.GList) 
        let btn_severCloseBtn = group_main.getChild("btn_closeSever")
        let group_signUp = group_main.getChild("group_signUp", fgui.GGroup)
        let label_signUp = group_main.getChild("label_signUp", fgui.GGroup)
        let label_baomingdes = group_main.getChild("label_baomingdes", fgui.GLabel) 
        let label_myRank = group_main.getChild("label_myRank", fgui.GLabel) 
        let label_goJoin = group_main.getChild("label_goJoin", fgui.GLabel) 
        let btn_pileUp = group_main.getChild("btn_pileUp", fgui.GButton) 
        let group_state5: fgui.GGroup = group_main.getChild("group_state5")
        group_state5.visible = false
        btn_pileUp.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityReady, 0, null);
        });
        let btn_tower = group_main.getChild("btn_tower", fgui.GButton)
        btn_tower.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityTower, 0, null);
        })

        let btn_allview = group_main.getChild("btn_allview", fgui.GButton)
        btn_allview.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityZongLan, 0, null);
        })

        group_main.getChild("btn_point", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:this.xmlRoot.name, detail: this.xmlRoot.desc });
        });

        let btn_chests = group_main.getChild("btn_chests", fgui.GButton)
        btn_chests.onClick(() => {
            if (this.grabCityData.clanState && (
                this.grabCityData.state == GrabCityState.ready2
                || this.grabCityData.state == GrabCityState.battle2
                || this.grabCityData.state == GrabCityState.over)) {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityGuess, 0, {factions:args.rankList});
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "siegeGroupScoreClanRank", null);
            } else {
                UtilsUI.showMsgTip(StrVal.LYGRABCITY.STR505);
            }
        })
       
        label_goJoin.onClick(()=>{
            if (GameServerData.getInstance().isClanHas()) {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityRank, 0, { rankList: args.rankList, type: 1 , selfClan: args.selfClan } );
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "siegeClanCombatPowerRank", null);
            }else{
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanJoin, 0, null);
            }
        });

        label_moreSever.onClick(()=>{
            group_sever.visible = true
        });
       
        label_openTime.text = UtilsTool.TimeToStr(this.grabCityData.timeList.activityTime[0]) + "~" + UtilsTool.TimeToStr(this.grabCityData.timeList.activityTime[1])
        label_jointime.text = label_openTime.text
        label_baomingdes.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR2, [ this.grabCityData.serverList.length * 12])
        let btn_rank = group_main.getChild("btn_rank", fgui.GButton)
        btn_rank.onClick(()=>{
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityRank, 0, { rankList: args.rankList, type: 2} );
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "siegegroupPlayerRank", null);
        });
        let btn_reward = group_main.getChild("btn_reward", fgui.GButton)
        btn_reward.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityAward, 0, null);
        });
        // group_main.getChild("btn_point", fgui.GButton).onClick(()=>{
        //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:StrVal.LyBRUMEISLE.STR0, detail: this.xmlRoot.detail });
        // });

        let btn_fenzu = group_main.getChild("btn_fenzu", fgui.GButton)
        btn_fenzu.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityGroup, 0, null);
        });

        let btn_gift = group_main.getChild("btn_gift", fgui.GButton)
        // PointRedData.getInstance().registerPoint(btn_gift, PointRedType.LyBrumeIsGift);
        btn_gift.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityGift, 0, null);
        });
        // group_main.getChild("btn_note", fgui.GButton).onClick(()=>{
        //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeNote, 0, null);
        // });

        let btn_assist = group_main.getChild("btn_assist", fgui.GButton)
        // PointRedData.getInstance().registerPoint(btn_chests, PointRedType.LyBrumeIsFire);
        btn_assist.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityClanHelp, 0, null);
        });
        
        btn_severCloseBtn.onClick(()=>{
            group_sever.visible = false
        });

        let arrName = []
        for (let index = 0; index < this.grabCityData.serverList.length; index++) {
            let serverId = this.grabCityData.serverList[index];
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
        list_allSever.itemRenderer = (index:number, child:fgui.GComponent)=>{
            child.getChild("n36").text = arrName[index]
        }
        list_allSever.numItems = arrName.length;

        // let activityOpenState = GameServerData.getInstance().getActivityOpenState(VarVal.ACTIVITY_ID.GRABCITY);
        let stateChangeUI = ()=>{
            group_signUp.visible = false
            btn_join.visible = true
            btn_chests.visible = true
            btn_fenzu.visible = true
            btn_assist.visible = true
            btn_pileUp.visible = true
            btn_tower.visible = true
            btn_reward.visible = true
            btn_rank.visible = true
            btn_allview.visible = true
            //报名期显示
            if (actState == GrabCityState.signUp) {
                group_signUp.visible = true
                btn_join.visible = false
                if (GameServerData.getInstance().isClanHas()) {
                    let ranks = []
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            ranks = args.rankList
                            let selfClan = args.selfClan
                            label_myRank.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR3, [selfClan.rankOf]) 
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } , "siegeClanCombatPowerRank", null)
                    label_goJoin.text = StrVal.LYGRABCITY.STR6
                } else {
                    label_myRank.text = StrVal.LYGRABCITY.STR4
                    label_goJoin.text = StrVal.LYGRABCITY.STR5
                }
                btn_chests.visible = false
                btn_fenzu.visible = false
                btn_assist.visible = false
                btn_pileUp.visible = false
                btn_tower.visible = false
            }else {
                //有资格参与战斗
                if (this.grabCityData.clanState != undefined) {
                    // label_stateTime
                    
                }else{
                    //无资格参与战斗
                    label_stateTime.text = StrVal.LYGRABCITY.STR7
                    btn_join.visible = false
                    if (actState == GrabCityState.ready1 ||  actState == GrabCityState.ready2 || actState == GrabCityState.battle1 || actState == GrabCityState.battle2 || actState == GrabCityState.over) {
                        btn_assist.visible = false
                        btn_pileUp.visible = false
                        btn_tower.visible = false

                        btn_allview.visible = false
                        btn_reward.visible = false
                        btn_fenzu.visible = false
                        btn_chests.visible = false
                    }
                }
                if (actState == GrabCityState.over) {
                    btn_fenzu.visible = false
                    pageOver()
                }
            }
        }

        //结算界面 排名展示
        let pageOver = ()=>{
            group_state5.visible = true
            let group_clanTop1: fgui.GComponent = group_main.getChild("group_clanTop1")
            let group_clanTop2: fgui.GComponent = group_main.getChild("group_clanTop2")
            let group_clanTop3: fgui.GComponent = group_main.getChild("group_clanTop3")
            let group_playerTop: fgui.GComponent = group_main.getChild("group_playerTop")
            let btn_like: fgui.GButton = group_main.getChild("btn_like")
            // let createDay = Math.floor((GameServerData.getInstance().getServerTime() - clanSoloInfo.startTime) / (24 * 60 * 60 * 1000))
            let awardXml: any =LocaleData.getGrabCityRoot()._rank[0]._item[0]
            // let label_openTime: fgui.GLabel = btn_like.getChild("label_openTime")
            // this.onTime(label_openTime, clanSoloInfo.nextStateTime)
            let group_clanTops = [group_clanTop1, group_clanTop2, group_clanTop3]
            let playerInfo = this.grabCityData.playerChampion
            if (playerInfo) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args1: any) => {
                    UtilsUI.unlockWait()
                    if (args1.errorcode == 0) {
                        let playerInfo = args1.playerInformation.simpleBase
                        group_playerTop.getChild("label_level", fgui.GLabel).text = playerInfo.level
                        group_playerTop.getChild("label_name", fgui.GLabel).text = playerInfo.name
                        group_playerTop.getChild("label_server", fgui.GLabel).text = PlatformAPI.getGameServerItem(playerInfo.serverid).name
                        let palaceItem = LocaleData.getPalaceItem(awardXml.palaceId.split(";")[this.grabCityData.bonusesLevel - 1]);
                        UtilsUI.setTitleIconByTitleId(group_playerTop.getChild("loader_title", fgui.GComponent), null, palaceItem.titleId);
                        UtilsUI.setTitleIconByTitleId(group_playerTop.getChild("loader_phase", fgui.GComponent), playerInfo.phase);
                        let charInfo = LocaleData.getCharShowResInfo(playerInfo.character, playerInfo.phase, playerInfo.appearance, null);
                        let mountInfo = LocaleData.getMountShowResInfo(playerInfo.mountType, playerInfo.mountSkin);
                        new SpineRoldMountPlayer(group_playerTop.getChild("group_spine_ram")).loadSpineRole(charInfo).loadSpineMount(mountInfo);
                        if (playerInfo.summonPetProtoId && String(playerInfo.summonPetProtoId).length > 1) {
                            let petProto = LocaleData.getPetProto(playerInfo.summonPetProtoId);
                            new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                            }, group_playerTop.getChild("loader_spine_pet"), petProto.modelId);
                        }
                        group_playerTop.clearClick()
                        group_playerTop.onClick(() => {
                            UtilsUI.onShowPlayerInfo(String(playerInfo.guid));
                        })
                    } else {
                        UtilsUI.showMsgTip(args1.errorcode)
                    }
                }, "queryPlayerInfo", {
                    guid: playerInfo.guid
                })
            }
            if (this.grabCityData.clanTopThree) {
                for (let i = 0; i < this.grabCityData.clanTopThree.length; i++) {
                    let clanInfo = this.grabCityData.clanTopThree[i];
                    let group_top = group_clanTops[i]
                    group_top.visible = true
                    group_top.getChild("label_clanName", fgui.GLabel).text = clanInfo.name
                    group_top.getChild("label_clanServer", fgui.GLabel).text = PlatformAPI.getGameServerItem(clanInfo.serverId).name
                    group_top.getChild("img_clanFlag", fgui.GLabel).text = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(clanInfo.flag).icon])
                } 
            }
            console.log(this.grabCityData.playerInfo.praiseAward)
            btn_like.enabled = this.grabCityData.playerInfo.praiseAward == undefined || this.grabCityData.playerInfo.praiseAward < 1
            btn_like.clearClick()
            btn_like.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        let doCallReward = () => {
                            UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                            btn_like.enabled = false
                        }
                        let randItems = LocaleData.getPalaceGrantItems();
                        let params: PalaceLikeData = {
                            playerId: playerInfo.guid,
                            grantId: randItems[UtilsTool.random(0, randItems.length - 1)].id,
                            stone: args.stone,
                            palaceIds: awardXml.palaceId1,
                            doneCall: doCallReward
                        }
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPalaceLike, 0, params);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "siegePraiseAward", null)
            })
            // btn_log.visible = false
        }

        stateChangeUI()
        // PointRedData.getInstance().registerPoint(btn_join, PointRedType.LyBrumeIsJoin)        
        btn_join.onClick(()=>{
            if (durationOpen) {
           
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityZone, 0, null);
        });
        
        let interCallBack = ()=>{
            let severTime = GameServerData.getInstance().getServerTime()
            if (actState == GrabCityState.signUp) { //报名倒计时
                label_signUp.text = UtilsTool.splitTimeString(this.grabCityData.timeList.applyTime[1] - severTime)
            }else if(this.grabCityData.clanState){ //有资格
                if (actState == GrabCityState.ready1) {
                    label_stateTime.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR20, [UtilsTool.splitTimeString(this.grabCityData.timeList.firstPrepareTime[1] - severTime)])
                }else if(actState == GrabCityState.battle1){
                    label_stateTime.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR21, [ UtilsTool.splitTimeString(this.grabCityData.timeList.firstFightTime[1] - severTime)])
                }else if(actState == GrabCityState.ready2){
                    label_stateTime.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR20, [UtilsTool.splitTimeString(this.grabCityData.timeList.secondPrepareTime[1] - severTime)])
                }else if(actState == GrabCityState.battle2){
                    label_stateTime.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR21, [UtilsTool.splitTimeString(this.grabCityData.timeList.secondFightTime[1] - severTime)])
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
        this.registerRequest((args) => {
            stateChangeUI()
        }, "siegeStateChage");


        //阶段结算 
        if (this.grabCityData.clanState != undefined && actState == GrabCityState.ready2) {
            // let slefInfo = this.grabCityData.clanState.playerInfo[this.grabCityData.selfRank -1]
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                   if (args.state == 1) {
                        let clanState = this.grabCityData.clanState
                        if (clanState.stage == 2) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyItemRewardCityWin, 0, { 
                            tip: UtilsTool.stringFormat(StrVal.LYGRABCITY.STR29,  [this.xmlRoot.advancedName]),
                            tip1:  UtilsTool.stringFormat(StrVal.LYGRABCITY.STR30, [ clanState.frastRank, clanState.score, clanState.scoreRank ]),
                            });
                        }else if(clanState.stage == 1){
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyItemRewardCityLose, 0, { 
                                tip: UtilsTool.stringFormat(StrVal.LYGRABCITY.STR31,  [this.xmlRoot.primaryName]),
                                tip1: UtilsTool.stringFormat(StrVal.LYGRABCITY.STR30, [ clanState.frastRank, clanState.score, clanState.scoreRank ]),
                            });
                        }
                   }
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } , "siegeState", null)
        }
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
            VarVal.bonusType
        }
    }

    public static getRewardBonuseItem(newActity?, bonusesResult?): Array<BonuseItem>{
        let get = []
        if (!newActity) {
            newActity = []
        }
        let grabCityPlayer = GameServerData.getInstance().getPlayerFullInfo().grabCityPlayer
        for (let index = 0; index < newActity.length; index++) {
            let newE = newActity[index]
            const element = grabCityPlayer.lastActItem[index];
            if (newE > element) {
                let temp = {}
                temp["index"] = index
                temp["count"] = newE - element
                get.push(temp)
            }
        }
        let bonArr: Array<BonuseItem> = []
        if (get.length > 0) {
            for (let index = 0; index < get.length; index++) {
                const element = get[index];
                if (element.count > 0) {
                    bonArr.push(UtilsUI.getBonuseItem(LyGrabCity.GrabCityActItem[element.index], "", "", element.count))
                }
            }
        }
        if (bonusesResult) {
            let bonuseString:string;
            bonuseString = GameServerData.getInstance().bonusesResultsToString([bonusesResult]);
            let arr =  UtilsUI.getBonuseItemsByString(bonuseString)
            for (let index = 0; index < arr.length; index++) {
                let element = arr[index];
                bonArr.push(element)
            }
        }
        return bonArr
        // UtilsUI.showItemReward({ bonuseItems: bonArr});
    }

    // public getIsViewMask(): boolean {
    //     return false;
    // }

    // public static isActOpen(): boolean {
    //     if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.BrumeIsle)) {
    //         return false
    //     }
    //     // 雾隐岛
    //     let activityBRUMOpenState = GameServerData.getInstance().getActivityOpenState(VarVal.ACTIVITY_ID.BRUMEISLE);
    //     if (activityBRUMOpenState && (activityBRUMOpenState.state == 1))  { // 1是开始
    //         return true
    //     }
    //     return false
    // }

    // public static isActNoClose(): boolean {
    //     if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.BrumeIsle)) {
    //         return false
    //     }
    //     // 雾隐岛
    //     let activityBRUMOpenState = GameServerData.getInstance().getActivityOpenState(VarVal.ACTIVITY_ID.BRUMEISLE);
    //     if (activityBRUMOpenState && (activityBRUMOpenState.state == 1 || activityBRUMOpenState.state == 2))  { // 1是开始
    //         return true
    //     }
    //     return false
    // }
    
    // public static isRedPointMarkDie(): boolean {
    //     // 雾隐岛
    //     if (LyBrumeIsle.isActOpen()) {
    //         let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE);
    //         if (activityState && activityState.data) {
    //             let burmData = activityState.data.activityDomainMonster;
    //             if (burmData) {
    //                 if (burmData.moarkMonsterList.length > 0 && burmData.moarkMonsterList[0].monsterCURHP <= 0) {
    //                     return true
    //                 }
    //             }
    //         }
    //     }
    //     return false
    // }

    // public static isRedPointFullPower(): boolean {
    //     // 雾隐岛
    //     if (LyBrumeIsle.isActOpen()) {
    //         let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE);
    //         if (activityState && activityState.data) {
    //             let xmlRoot = LocaleData.getBrumeIsleConfig()
    //             let burmData = activityState.data.activityDomainMonster;
    //             if (burmData && burmData.energy >= Number(xmlRoot.energyMax)) {
    //                 return true
    //             }
    //         }
    //     }
    //     return false
    // }
}


