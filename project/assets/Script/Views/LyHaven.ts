//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServer } from "../Kernel/GameServer";
import { BonuseItem, MonthCardItemType, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { VarVal } from "../Values/VarVal";
import { LyHavenResInfo } from "./LyHavenResInfo";
import { LyHavenManage } from "./LyHavenManage";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { LyHavenFind } from "./LyHavenFind";
import { LyHavenRecord } from "./LyHavenRecord";
import { LyHavenPot } from "./LyHavenPot";
import { LyHavenAuto } from "./LyHavenAuto";
import { LyGuideDetail } from "./LyGuideDetail";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { AudioManager } from "../Kernel/AudioManager";

export class LyHaven extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyHaven";
        this.viewResI.pkgName = "LyHaven";
        this.viewResI.comName = "LyHaven";
    }
    public static isSkipPlayAni: boolean
    private static isAdMoney: boolean = false;
    private activityState: any
    private havenData: any
    private resourceData : any
    private otherGuId: string = "0"  //访问别人家的id 自家为0
    private otherName: string
    private havenRoot

    private sliders: fgui.GProgressBar[] = []
    private uiPanel:fgui.GComponent
    private label_free: fgui.GLabel;
    private label_all: fgui.GButton;
    private group_name: fgui.GGroup
    private group_ad: fgui.GGroup
    private label_name: fgui.GLabel
    private label_ad: fgui.GLabel
    private pageCon: fgui.Controller
    private autoSpine: SpinePlayer
    public onViewCreate(_params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    let bonuseItems 
                    let bonuseString = GameServerData.getInstance().bonusesResultsToString([{inserts: args.itemInserts}])
                    bonuseItems = UtilsUI.getBonuseItemsByString(bonuseString);
                    if (args.moneyBounse) {
                        for (let index = 0; index < args.moneyBounse.length; index++) {
                            let item = args.moneyBounse[index];
                            let bonuseItem = UtilsUI.getBonuseItem(item.bonusType, null, null, item.bonusCount);
                            bonuseItems.push(bonuseItem)
                        }
                    }
                    if (bonuseItems.length > 0) {
                      UtilsUI.showItemReward({ bonuseItems: bonuseItems });
                    }
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
        } ,"enterHaven", null);
        this.uiPanel = this.getUiPanel().getChild("main")
        let exitPageFun: Function = ()=>{
            if (this.otherGuId == "0") {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
    
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"exitHaven", null);
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHaven, 0, null) 
            }else{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.backSelf()
                        this.loadData()
                        this.freshUI()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"exitRoomHaven", null);
            }
        }
        this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
            exitPageFun()
        });
        this.havenRoot = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)
        this.uiPanel.getChild("btn_what", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:StrVal.LYHAVEN.STR37, detail: this.havenRoot.gameplayGuide });
        });
        if (LyHaven.isSkipPlayAni) {
            LyHaven.isSkipPlayAni = false;
        }else{
            UtilsUI.playCommonGroupAni(this.uiPanel, null)
        }
        let btn_close = this.uiPanel.getChild("btn_close")
        let label_title = this.uiPanel.getChild("label_title")
        label_title.text = StrVal.LYHAVEN.STR6;
        (this.uiPanel.getChild("n23") as fgui.GLabel).text = StrVal.LYHAVEN.STR7;
        btn_close.onClick(()=> {
            exitPageFun()
        })
        this.pageCon = this.uiPanel.getController("page")
        let btn_manage:fgui. GButton = this.uiPanel.getChild("btn_manage");
        this.label_free = btn_manage.getChild("label_free")
        this.label_all = btn_manage.getChild("label_all")
        this.group_name = this.uiPanel.getChild("group_name")
        this.label_name = this.uiPanel.getChild("label_name")
        this.group_ad = this.uiPanel.getChild("group_ad")
        this.label_ad = this.uiPanel.getChild("btn_adRefresh", fgui.GButton).getChild("title")
        btn_manage.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyHavenManage, 0, null)
        });

        for (let i = 0; i < 6; i++) {
            let pro: fgui.GProgressBar = this.uiPanel.getChild("item" + (i+1))
            this.sliders.push(pro)
        }
        //刷新
        this.uiPanel.getChild("btn_refresh", fgui.GButton).onClick(()=>{
            let count = 0
            for (let index = 0; index < this.havenData.resource.length; index++) {
                let element = this.havenData.resource[index];
                if (element.winner == 0) {
                    count += 1
                }
            }
            if (count == 0) {
                UtilsUI.showMsgTip(StrVal.LYHAVEN.STR52)
            }else {
                if (!LyHaven.isAdMoney) {
                    let mGCom  = fgui.UIPackage.createObject("LyHaven", "group_refreshHaven").asCom;
                    let btn_close: fgui.GButton = mGCom.getChild("btn_close")
                    btn_close.onClick(()=>{
                        mGCom.dispose()
                    })
                    mGCom.getChild("btn_backMask", fgui.GButton).onClick(()=>{
                        mGCom.dispose()
                    });
                    count = count * Number(this.havenRoot.refreshCost)
                    UtilsUI.setNeedItemGroup( mGCom.getChild("group_needItem", fgui.GComponent),UtilsUI.getItemIconUrl(VarVal.bonusType.stone),GameServerData.getInstance().getValueTypeCount(VarVal.bonusType.stone), count)
                    mGCom.getChild("label_title", fgui.GLabel).text = StrVal.LYHAVEN.STR39
                    btn_close.text = StrVal.LYHAVEN.STR44
                    mGCom.getChild("label_des", fgui.GLabel).text = StrVal.LYHAVEN.STR38
                    let btn_gou: fgui.GButton = mGCom.getChild("btn_gou")
                    btn_gou.text = StrVal.LYHAVEN.STR45
                    btn_gou.onClick(()=>{
                        LyHaven.isAdMoney = btn_gou.selected
                    });
                    btn_gou.selected = LyHaven.isAdMoney
                    let btn_ad: fgui.GButton = mGCom.getChild("btn")
                    btn_ad.text = StrVal.LYHAVEN.STR39
                    btn_ad.onClick(()=>{
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                mGCom.dispose()
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        } ,"refreshHavenResource", null);
                    });
                    mGCom.setSize(this.getUiPanel().width, this.getUiPanel().height);
                    this.getUiPanel().addChild(mGCom)
                }else{
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"refreshHavenResource", null);
                }
            }
        });

        //AD刷新
        this.uiPanel.getChild("btn_adRefresh", fgui.GButton).onClick(()=>{
            let count = 0
            for (let index = 0; index < this.havenData.resource.length; index++) {
                let element = this.havenData.resource[index];
                if (element.winner == 0) {
                    count += 1
                }
            }
            if (count == 0) {
                UtilsUI.showMsgTip(StrVal.LYHAVEN.STR52)
            }else {
                let mGCom  = fgui.UIPackage.createObject("LyHaven", "group_adRefresh").asCom;
                let btn_close: fgui.GButton = mGCom.getChild("btn_close")
                btn_close.onClick(()=>{
                    mGCom.dispose()
                })
                mGCom.getChild("btn_backMask", fgui.GButton).onClick(()=>{
                    mGCom.dispose()
                });
                mGCom.getChild("btn_sure", fgui.GButton).onClick(()=>{
                    mGCom.dispose()
                });
                mGCom.getChild("label_title", fgui.GLabel).text = StrVal.LYHAVEN.STR41
                mGCom.getChild("label_desc", fgui.GLabel).text = StrVal.LYHAVEN.STR42
                mGCom.getChild("btn_sure", fgui.GButton).text = StrVal.LYHAVEN.STR44
                let btn_ad: fgui.GButton = mGCom.getChild("btn_ad")
                btn_ad.text = StrVal.LYHAVEN.STR43
                btn_ad.onClick(()=>{
                    PlatformAPI.doSdkRewardVideoAD((errmsg:string) => {
                        if (errmsg) {
                            UtilsUI.showMsgTip(errmsg);
                        } else {
                            UtilsUI.lockWait()
                            GameServer.getInstance().send((args: any) => {
                                UtilsUI.unlockWait()
                                if (args.errorcode == 0) {
                                    mGCom.dispose()
                                } else {
                                    UtilsUI.showMsgTip(args.errorcode)
                                }
                            } ,"refreshHavenResourceByAds", null);
                        }
                    }, UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.skip_ad))
                });
                mGCom.setSize(this.getUiPanel().width, this.getUiPanel().height);
                this.getUiPanel().addChild(mGCom)
                // mGCom.setPosition(mGCom.x, mGCom.y + (fgui.GRoot.inst.height - 1334)/2)
            }
        });

        //探寻
        let btn_find = this.uiPanel.getChild("btn_find", fgui.GButton)
        btn_find.onClick(()=>{
            let str: Array<any> = []
            let temp1 = this.havenData.randomPlayers.split(";") 
            for (let index = 0; index < temp1.length ; index++) {
                if (temp1[index]!= '') {
                    str.push(temp1[index]);
                }
            } 
            let temp2 = this.havenData.specialPlayers.split(";")
            for (let index = 0; index < temp2.length ; index++) {
                if (temp2[index]!= '') {
                    str.push(temp2[index]);
                }
            } 
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyHavenFind, 0, {data: args.getHavenResourceArr})
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"getHavenResourceByPlayerId", { targetPlayerIdArr: str });
 
        });
        //记录
        let btn_record = this.uiPanel.getChild("btn_record", fgui.GButton);
        btn_record.text = StrVal.LYHAVEN.STR21;
        btn_record.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyHavenRecord, 0, null)
        });

        //拜神像
        let btn_pot = this.uiPanel.getChild("btn_pot", fgui.GButton);
        btn_pot.visible = !PlatformAPI.isBinaryExamine()
        btn_pot.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyHavenPot, 0, null)
        });

        //托管
        let btn_trusteeship = this.uiPanel.getChild("btn_trusteeship", fgui.GButton)
        btn_pot.visible = !PlatformAPI.isBinaryExamine()
        this.autoSpine = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            if (this.havenData) {
                if ( this.havenData.isAutoCollectionActivated == 0) {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true)
                }else{
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.move, true)
                }
            }
        }, btn_trusteeship.getChild("loader3d_spine", fgui.GLoader3D), "ui_biaoju_tuoguan");

        let isAdventure: boolean = !GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.haven_automation)
        btn_trusteeship.grayed = isAdventure
        btn_trusteeship.onClick(()=>{
            if (isAdventure) {
                UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.haven_automation)
                return
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyHavenAuto, 0, null)
        });

        
        this.loadData()
        this.freshUI()

        let openTime = GameServerData.getInstance().getPlayerFullInfo().openTime
        openTime = (new Date(Date.parse(openTime))).getTime() / 1000
        let nowTime =  GameServerData.getInstance().getServerTime()
        //开服14天后显示ui
        if (Number(openTime) + ((Number(this.havenRoot.autoUnlockDay)) * 24 * 60 * 60) >= nowTime) {
            btn_trusteeship.visible = false
            btn_find.x = 589
        }else{
            if (PlatformAPI.isBinaryExamine()) {
                btn_trusteeship.visible = false
            }else{
                btn_trusteeship.visible = true
            }
            btn_find.x = 474
        }
        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == VarVal.ACTIVITY_ID.HAVEN) {
                if (this.otherGuId == "0") {
                    this.loadData();
                    this.freshUI();
                }else{
                    this.activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN)
                    this.havenData = this.activityState.data.activityHaven
                    this.refreshKun();
                }
            }
        }, "activityStateChanged");
        
        this.registerRequest((args) => {
            if (this.otherGuId == args.roomPlayerId) {
                this.loadData(args.resource);
                this.freshUI();
            }
        }, "updateRoomHavenInfo");
        
        this.registerRequest((args) => {
            if (args.itemInserts && args.itemInserts.length > 0) {
                UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([{ inserts: args.itemInserts}])});
            }else{
               let bonuseItem = UtilsUI.getBonuseItem(args.bonusType, null, null, args.bonusCount)
               UtilsUI.showItemReward({ bonuseItems: [bonuseItem]});
            }
            if (args.sourcePlayerId && args.sourcePlayerId == this.otherGuId) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.onViewUpdate({ otherHaven:args.getHavenResourceArr[0] } )
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"getHavenResourceByPlayerId", { targetPlayerIdArr: [this.otherGuId] });
            }
         }, "activityGetItems");
        this.setViewBehaviour(true)
    }

    private backSelf(){
        this.otherGuId = "0"
        this.otherName = ""
    }

    private refreshKun(){
        this.label_free.text = UtilsTool.stringFormat(StrVal.LYHAVEN.STR8, [this.havenData.restMouse]);
        this.label_all.text =  UtilsTool.stringFormat(StrVal.LYHAVEN.STR9, [this.havenData.totalMouse]);
    }

    private freshUI(){
       this.refreshKun()
       for (let i = 0; i < 6; i++) {
            this.initItem(i)
       }
       this.group_name.visible = this.otherGuId != "0"
       if (this.otherGuId != "0") {
            //别人家
            this.pageCon.selectedIndex = 1
            this.label_name.text = UtilsTool.stringFormat(StrVal.LYHAVEN.STR31, [this.otherName]) 
       }else{
            //自家
            this.pageCon.selectedIndex = 0
            if (this.autoSpine) {
                if (this.havenData.isAutoCollectionActivated == 0) {
                    this.autoSpine.playAnimation(VarVal.SPINE_ANI_NAME.stand, true)
                }else{
                    this.autoSpine.playAnimation(VarVal.SPINE_ANI_NAME.move, true)
                }
            }
       }
       this.group_ad.visible = this.havenData.watchedAdCount < Number(this.havenRoot.advancedRefresh)
       this.label_ad.text = UtilsTool.stringFormat(StrVal.LYHAVEN.STR30, [ Number(this.havenRoot.advancedRefresh) - this.havenData.watchedAdCount ,this.havenRoot.advancedRefresh]) 
       
    }

    private initItem(pos){
        let resData = this.getResDataById(pos + 1)
        if (resData) { 
            this.sliders[pos].visible = true
            let bonuseItem :BonuseItem;
            if (resData.resourceXml.itemId.length > 1) {
                bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, resData.resourceXml.itemId, UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [resData.resourceXml.level]))
            }else if(resData.resourceXml.itemId.length > 0) {
                bonuseItem = UtilsUI.getBonuseItem(resData.resourceXml.itemId, null, null, UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [resData.resourceXml.level]))
            }
            let groupItem:fgui.GComponent = (this.sliders[pos].getChild("grip") as fgui.GComponent).getChild("n0");
            UtilsUI.setUIGroupItem(bonuseItem, groupItem, null, true);
            this.sliders[pos].max = Number(resData.resourceXml.route) 
            this.sliders[pos].value = resData.data.route
            let grip:fgui.GButton = this.sliders[pos].getChild("grip")
            let group_up: fgui.GGroup = grip.getChild("group_up")
            let group_down: fgui.GGroup = grip.getChild("group_down")
            let img_only: fgui.GImage = grip.getChild("img_only")
            group_up.visible = resData.data.attacker.mouseAmount != 0
            group_down.visible = resData.data.defender.mouseAmount != 0
            if (group_up.visible) {
                let spine_up: fgui.GLoader3D = grip.getChild("spine_up")
                new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.move, true);
                }, spine_up, "ui_chefu_xiaoji_bei");
            }
            if (group_down.visible) {
                let spine_down: fgui.GLoader3D = grip.getChild("spine_down")
                new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.move, true);
                }, spine_down, "ui_chefu_xiaoji");
            }
            let group_timeDown: fgui.GGroup = grip.getChild("group_timeDown")
            let group_timeUp : fgui.GGroup = grip.getChild("group_timeUp")
           
            group_timeDown.visible = resData.data.winner == 1
            group_timeUp.visible = resData.data.winner == 2
            grip.clearClick()
            grip.onClick(()=>{
                //别家福地
                if (this.otherGuId != "0" && (resData.data.isSpecialResource == 1 || (resData.data.attacker.playerId != "" && resData.data.attacker.playerId != GameServerData.getInstance().getPlayerFullInfo().base.guid))) {
                    if (resData.data.isSpecialResource == 1) {
                        UtilsUI.showMsgTip(StrVal.LYHAVEN.STR35)
                    }else{
                        UtilsUI.showMsgTip(StrVal.LYHAVEN.STR55)
                    }
                }else {
                     //自家福地
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyHavenResInfo, 0, {data: resData, otherGuId: this.otherGuId})
                }
            })
            img_only.visible = resData.data.isSpecialResource == 1
        }else{
            this.sliders[pos].visible = false
            this.sliders[pos].getChild("grip", fgui.GComponent).getChild("spine_down", fgui.GLoader3D).freeSpine();
            this.sliders[pos].getChild("grip", fgui.GComponent).getChild("spine_up", fgui.GLoader3D).freeSpine();
        }
    }
    
    private loadData(otherHaven?){
        this.activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN)
        this.havenData = this.activityState.data.activityHaven
        let havenResData = null
        if (this.otherGuId == "0") {
            havenResData = this.havenData.resource
        }else{
            havenResData = otherHaven
        }
       this.resourceData = []
        for (let index = 0; index < havenResData.length; index++) {
            let element = havenResData[index];
            if (element.itemId != 0) {
                let data = {}
                data["data"] =  element;
                data["resourceXml"] = LocaleData.getHavenItem(element.itemId);
                this.resourceData.push(data)
            }
        }
    }

    private getResDataById(id): any{
        for (let index = 0; index < this.resourceData.length; index++) {
            let element = this.resourceData[index];
            if (element.data.id == id) {
                return element
            }
        }
        return null
    }

    public getIsViewMask(): boolean {
        return false;
    };

    public onViewUpdate(params: any): void {
        // 此接口主要刷新 别家福地时候数据维护 自家数据刷新在 activityStateChanged 事件监听里面
        if (params && params.otherHaven) {
            if (params.otherHaven.playerInfo.guid == GameServerData.getInstance().getPlayerFullInfo().base.guid) {
                if (this.otherGuId != "0") {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.backSelf()
                            this.loadData()
                            this.freshUI()
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"exitRoomHaven", null);
                }
            }else{
                this.otherGuId = params.otherHaven.playerInfo.guid
                UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.loadData(args.resource)
                            this.otherName = params.otherHaven.playerInfo.name
                            this.freshUI()
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                } ,"enterRoomHaven", {roomPlayerId: this.otherGuId});
            }
        }
        // else{
            // this.backSelf()
        // }
        // this.freshUI()
    }
    
    onBehaviourUpdate(deltaTime: number): void {
       if (this.resourceData && this.resourceData.length > 0) {
            for (let index = 0; index < this.resourceData.length; index++) {
                let resData = this.resourceData[index]
                let velocity = Number(resData.data.velocity)
                if (resData && velocity != 0) {
                    let proIndex = resData.data.id - 1
                    let label_time:fgui.GLabel = resData.data.winner == 1 ? (this.sliders[proIndex].getChild("grip", fgui.GComponent)).getChild("label_uptiem", fgui.GLabel) : this.sliders[proIndex].getChild("grip", fgui.GComponent).getChild("label_downtiem", fgui.GLabel)
                    let lastTimeNumer  = 0
                    if (resData.data.winner == 2) {
                        resData.data.route = resData.data.route + deltaTime * velocity
                        lastTimeNumer = (Number(resData.resourceXml.route) - resData.data.route) / velocity
                    }else if(resData.data.winner == 1) {
                        resData.data.route = resData.data.route - deltaTime * velocity
                        lastTimeNumer = resData.data.route / velocity
                    }
                    this.sliders[proIndex].value = resData.data.route;
                    label_time.visible = true
                    label_time.text = UtilsTool.splitTimeString(Math.ceil(lastTimeNumer))
                    if (lastTimeNumer <= 0) {
                        resData.data.velocity = "0"
                    }
                }
            }
       }
   }

   public static isViewRedPoint(): boolean{
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.haven_automation)) {
            return false
        }
        let state = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN)
        if (state && state.data) {
            let havenData = state.data.activityHaven
            return havenData.restMouse > 0
        }
        return false
   }
   

//    public onViewReconnect(): boolean {
       
//      return true
//    }

}




