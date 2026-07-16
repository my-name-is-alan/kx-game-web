//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, MonthCardItemType, UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { Color, ValueType, color } from "cc";
import { VarVal } from "../Values/VarVal";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { LyClanJoin } from "./LyClanJoin";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { LyMainPage } from "./LyMainPage";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { AudioManager } from "../Kernel/AudioManager";

export class LyEvolution extends ViewLayer {

    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = "LyMainPage";
        this.viewResI.pkgName = "LyMainPage";
        this.viewResI.comName = "LyEvolution";
    }

    private evolutionRoot: any
    private levelData: any
    private levelNowQua: any
    private levelNowWei: any
    private levelNext: any
    private levelNextQua: Array<any> 
    private levelNextWei: Array<any> 
    private baseInfo: any
    private materials: Array<any>
    private list_show: fgui.GList
    private list_reward: fgui.GList
    private btn_up: fgui.GButton
    private label_time: fgui.GTextField
    private label_timeDes: fgui.GTextField
    private label_des1: fgui.GLabel
    private label_des2: fgui.GLabel
    private label_addNumber: fgui.GLabel
    private btn_addSpeed: fgui.GButton
    private group_speed: fgui.GComponent
    private group_need1: fgui.GComponent
    private group_need2: fgui.GComponent
    private group_up: fgui.GComponent 
    private img_no: fgui.GImage
    private img_ing: fgui.GImage
    private btn_xiezu: fgui.GLoader
    private label_xiezu: fgui.GLabel
    private prop_time: fgui.GLabel
    private useNumber: number
    private adXml: any
    private adData: any
    private btn_ad: fgui.GButton
    private label_adtime: fgui.GLabel
    private c1Con: fgui.Controller
    private group_adTime: fgui.GGroup
    private lastLevel = 0
    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel()
        uiPanel.getChild("btn_backMask", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEvolution, 0, null)
        });
        this.list_show = uiPanel.getChild("list_show")
        this.list_reward = uiPanel.getChild("list_reward")
        this.btn_up = uiPanel.getChild("btn_up")
        this.label_time = uiPanel.getChild("label_time")
        this.label_timeDes = uiPanel.getChild("label_timeDes")
        this.group_need1 = uiPanel.getChild("group_need1")
        let btn_close: fgui.GButton = uiPanel.getChild("btn_close")
        this.label_des1 = uiPanel.getChild("label_des1")
        this.label_des2 = uiPanel.getChild("label_des2")
        this.group_speed = uiPanel.getChild("group_speed")
        this.group_up = uiPanel.getChild("group_up")
        this.label_addNumber = uiPanel.getChild("label_addNumber")
        this.btn_addSpeed = uiPanel.getChild("btn_addSpeed")
        this.btn_up.text = StrVal.LYEVOLUTION.STR9
        this.btn_addSpeed.text = StrVal.LYEVOLUTION.STR10
        this.group_need2 = uiPanel.getChild("group_need2")
        this.img_no = uiPanel.getChild("n38")
        this.img_ing = uiPanel.getChild("n53")
        this.btn_xiezu = uiPanel.getChild("btn_xiezu");
        this.label_xiezu = uiPanel.getChild("label_xiezu")
        this.label_adtime = uiPanel.getChild("label_adtime")
        this.c1Con = uiPanel.getController("c1")
        this.group_adTime = uiPanel.getChild("group_adTime")
        uiPanel.getChild("n43", fgui.GLabel).text = StrVal.LYEVOLUTION.STR5
        uiPanel.getChild("label_xxsx", fgui.GLabel).text = StrVal.LYEVOLUTION.STR6

        this.adXml = LocaleData.getAdXml(4)
        this.btn_ad = uiPanel.getChild("btn_ad")
        this.btn_ad.text = StrVal.LYEVOLUTION.STR15
        this.btn_ad.onClick(()=>{
            let mGCom  = fgui.UIPackage.createObject("LyMainPage", "group_timeAd").asCom;
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
            mGCom.getChild("label_title", fgui.GLabel).text = StrVal.LYEVOLUTION.STR15
            mGCom.getChild("label_con", fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYEVOLUTION.STR16, [this.adXml.param]) 
            let group_item: fgui.GComponent = mGCom.getChild("group_item")
            let count = Number(this.evolutionRoot.skipAdStone) 
            UtilsUI.setNeedItemGroup(group_item , UtilsUI.getItemIconUrl(VarVal.bonusType.stone), GameServerData.getInstance().getValueTypeCount(VarVal.bonusType.stone), count)
            let btn_sure: fgui.GButton = mGCom.getChild("btn_sure")
            btn_sure.text = StrVal.LYEVOLUTION.STR18
            btn_sure.onClick(()=>{
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.loadData()
                            this.updateUI()
                            mGCom.dispose()
                            if (this.lastLevel == this.baseInfo.evolutionLevel) {
                                UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYEVOLUTION.STR19, [ this.adXml.param ]))
                            }
                            this.lastLevel = this.baseInfo.evolutionLevel
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"speedUpEvolveForAd", { costStone: 1 })
            });
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
                                this.loadData()
                                this.updateUI()
                                mGCom.dispose()
                                if (this.lastLevel == this.baseInfo.evolutionLevel) {
                                    UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYEVOLUTION.STR19, [ this.adXml.param ]))
                                }
                                this.lastLevel = this.baseInfo.evolutionLevel
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        } ,"speedUpEvolveForAd", { costStone: 0 })
                    }
                }, UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.skip_ad))
            });
            mGCom.setSize(this.getUiPanel().width, this.getUiPanel().height);
            this.getUiPanel().addChild(mGCom)
        });
        let mGCom:fgui.GComponent
        PointRedData.getInstance().registerPoint(this.btn_addSpeed, PointRedType.LyEvolutionSpeed)
        this.btn_addSpeed.onClick(() => {
            let haveCount = GameServerData.getInstance().getItemCountByProtoId(this.evolutionRoot.speedUpItemId)
            if (haveCount == 0) { // 这里因设计要求，这样需要先发协议后，触发礼包弹窗，再弹出这个。
                UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.evolutionRoot.speedUpItemId, "1"), buyCall:() => {
                            this.loadData()
                            this.updateUI()
                        }});
                    }
                } ,"speedUpEvolve", {count:1})
            }else{
                let needCount = (this.baseInfo.evolveFinishTime - GameServerData.getInstance().getServerTime()) / (Number(this.evolutionRoot.eachSpeedUpTime) * 60)
                needCount = Math.ceil(needCount)
                mGCom  = fgui.UIPackage.createObject("LyMainPage", "group_addSpeed").asCom;
                (<fgui.GButton>mGCom.getChild("btn_close")).onClick(()=>{
                    this.loadData()
                    this.updateUI()
                    mGCom.dispose()
                    this.prop_time = null
                })

                mGCom.getChild("btn_backMask", fgui.GButton).onClick(()=>{
                    this.loadData()
                    this.updateUI()
                    mGCom.dispose()
                    this.prop_time = null

                });
                mGCom.getChild("label_title", fgui.GLabel).text = StrVal.LYEVOLUTION.STR10
                let label_number = mGCom.getChild("label_number")
                let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.evolutionRoot.speedUpItemId, String(haveCount))
                UtilsUI.setUIGroupItem(bonuseItem, mGCom.getChild("group_item"), null)
                let pro: fgui.GSlider = mGCom.getChild("pro")
                let showNumber = 0
                if (haveCount < needCount) {
                    showNumber = haveCount
                }else{
                    showNumber = needCount
                }
                let vualeChange = ()=>{
                    if (pro.value == 0) {
                        pro.value = 1
                    }
                    this.useNumber = pro.value
                    upDataFun()
                    label_number.text = UtilsTool.stringFormat(StrVal.LYEVOLUTION.STR21, [this.useNumber])
                    btn_jian.enabled = this.useNumber != 1
                    btn_add.enabled = this.useNumber != needCount                 
                }
                pro.max = showNumber
                if (pro.max == 1) {
                    pro.enabled = false
                }
                pro.value = showNumber
                this.useNumber = pro.value
                label_number.text = UtilsTool.stringFormat(StrVal.LYEVOLUTION.STR21, [this.useNumber])
                // let titleNumber = pro.getChild("title13", fgui.GLabel)
                let btn_jian = mGCom.getChild("btn_jian")
                let btn_add = mGCom.getChild("btn_add")
                btn_jian.onClick(()=>{
                    if (pro.value > 1) {
                        pro.value -= 1
                    }
                    vualeChange()
                });
                this.useNumber = pro.value
                btn_jian.enabled = this.useNumber != 1
                btn_add.enabled = this.useNumber != needCount
                btn_add.onClick(()=>{
                    if (pro.value < showNumber) {
                        pro.value += 1
                    }
                    vualeChange()
                });
                pro.on(fgui.Event.STATUS_CHANGED, vualeChange);
                // titleNumber.text = String(pro.value)
                mGCom.setSize(this.getUiPanel().width, this.getUiPanel().height);
                uiPanel.addChild(mGCom)
                mGCom.getChild("btn_sure", fgui.GButton).onClick(()=>{
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.loadData()
                            this.updateUI()
                            mGCom.dispose()
                            this.prop_time = null
                            if (this.lastLevel == this.baseInfo.evolutionLevel) {
                                UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYEVOLUTION.STR12, [ UtilsTool.parseTimeToString(this.useNumber * (Number(this.evolutionRoot.eachSpeedUpTime)) * 60)]))
                            }
                            this.lastLevel = this.baseInfo.evolutionLevel
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"speedUpEvolve", { count: this.useNumber })
                });
                this.prop_time = mGCom.getChild("n64")
                upDataFun()
            }
        })

        btn_close.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEvolution, 0, null)
        })

        this.btn_xiezu.onClick(()=>{
            if (GameServerData.getInstance().getPlayerFullInfo().clan.clanInfo) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.loadData()
                        this.updateUI()
                        this.btn_xiezu.grayed = true
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"clanEvolveSpeedUpReq", null)
            } else {
                console.log("无帮派");
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanJoin, 0, null);
            }
        })

        this.btn_up.onClick(()=> {
            let nextMoney: number = this.levelNext.money
            if (this.baseInfo.money >= nextMoney) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.loadData()
                        this.updateUI()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                 } ,"evolve", null)
            
            }else{
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.money, null, null, "1"), buyCall:() => {
                    this.loadData()
                    this.updateUI()
                }});
            }
        })
        PointRedData.getInstance().registerPoint(this.btn_up, PointRedType.LyEvolutionLevelUp)
        this.list_show.itemRenderer = this.initShow.bind(this)
        this.list_reward.itemProvider = (index: number):string => {
            return "ui://CCommon/GroupItem2"
        }
        this.list_reward.itemRenderer = this.initUnLockItem.bind(this)
        this.evolutionRoot = LocaleData.getEvolutionRoot()
        this.loadData()
        this.updateUI()
        this.lastLevel = this.baseInfo.evolutionLevel
        this.registerRequest((args) => {
            this.loadData()
            this.updateUI()
         }, "onEvolveTimeChange");


        let upDataFun: Function = ()=>{
            if(this.baseInfo && this.baseInfo.evolveFinishTime != 0)
            {
                let serverTime = GameServerData.getInstance().getServerTime()
                let time = this.baseInfo.evolveFinishTime - serverTime
                this.label_time.text = UtilsTool.parseTimeToString(time)
                if (this.prop_time) {
                    let addTime = Number(this.evolutionRoot.eachSpeedUpTime) * 60 * this.useNumber
                    this.prop_time.text = UtilsTool.stringFormat(StrVal.LYEVOLUTION.STR11, [this.label_time.text, UtilsTool.parseTimeToString(addTime)]) 
                    if (time <= 1) {
                        this.prop_time = null
                        mGCom.dispose()
                    }
                }

                let adTime = this.adData.updateTime + Number(this.adXml.cd) - serverTime
                if (adTime > 0) {
                    this.label_adtime.text = UtilsTool.parseTimeToString(adTime)
                }else {
                    this.label_adtime.text = ""
                    this.btn_ad.enabled = adTime <= 0
                    this.group_adTime.visible = adTime > 0
                }
            }
         }
         upDataFun()
         this.setInterval(()=>{
            upDataFun()
        }, 1000);
    }
    
    private updateUI(): void {
        if (this.levelNext) {
            this.group_speed.visible = true
            this.group_up.visible = true
            UtilsUI.setNeedItemGroup(this.group_need1, UtilsUI.getItemIconUrl(VarVal.bonusType.money),this.baseInfo.money, this.levelNext.money)
        }else{
            this.group_speed.visible = false
            this.group_up.visible = false
        }
        this.label_des1.text = UtilsTool.stringFormat(StrVal.LYEVOLUTION.STR3, [this.baseInfo.evolutionLevel]) 
        this.label_des2.text = UtilsTool.stringFormat(StrVal.LYEVOLUTION.STR4, [this.baseInfo.evolutionLevel + 1]) 
        this.list_show.numItems = this.levelNowQua.length
        this.list_reward.numItems = this.materials.length
        this.img_no.visible = true
        if(this.baseInfo.evolveFinishTime != 0 ) {
            if (this.adData.count >= Number(this.adXml.count)) {
                //无广告次数
                this.c1Con.selectedIndex = 0
            }else {
                this.c1Con.selectedIndex = 1
                let adTime = this.adData.updateTime + Number(this.adXml.cd) - GameServerData.getInstance().getServerTime()
                this.btn_ad.enabled = adTime <= 0
                this.group_adTime.visible = adTime > 0
            }
            this.img_no.visible = false
            this.img_ing.visible = true
            this.group_speed.visible = true
            this.group_up.visible = false
            let needItem = (this.baseInfo.evolveFinishTime - GameServerData.getInstance().getServerTime()) / (Number(this.evolutionRoot.eachSpeedUpTime) * 60)
            needItem = Math.ceil(needItem)
            UtilsUI.setNeedItemGroup(this.group_need2, UtilsTool.stringFormat("ui://CCommon/{0}",[LocaleData.getItemProto(this.evolutionRoot.speedUpItemId).icon]), GameServerData.getInstance().getItemCountByProtoId(this.evolutionRoot.speedUpItemId), needItem);
            this.label_timeDes.text = StrVal.LYEVOLUTION.STR2
            this.label_time.text = UtilsTool.parseTimeToString(this.baseInfo.evolveFinishTime - GameServerData.getInstance().getServerTime())
            // this.setViewBehaviour(true)
            this.label_timeDes.color = new Color(255, 255, 255)
            this.label_time.color = new Color(255, 255, 255)
        }
        else{
            this.c1Con.selectedIndex = 0
            this.img_no.visible = true
            this.img_ing.visible = false
            this.group_up.visible = true
            this.group_speed.visible = false
            this.label_timeDes.text = StrVal.LYEVOLUTION.STR1
            this.label_time.text = UtilsTool.parseTimeToString(this.levelNext.time * 60)
            this.label_timeDes.color = new Color(22, 25, 26)
            this.label_time.color = new Color(48, 161, 45)
        }

        

        if (GameServerData.getInstance().getPlayerFullInfo().clan.clanInfo) {
            this.btn_xiezu.grayed = GameServerData.getInstance().getPlayerFullInfo().clan.myselfInfo.evolveHelpLevel > this.baseInfo.evolutionLevel
            this.label_xiezu.grayed = GameServerData.getInstance().getPlayerFullInfo().clan.myselfInfo.evolveHelpLevel > this.baseInfo.evolutionLevel
            this.label_xiezu.text = GameServerData.getInstance().getPlayerFullInfo().clan.myselfInfo.evolveHelpLevel > this.baseInfo.evolutionLevel ? StrVal.LYEVOLUTION.STR14: StrVal.LYEVOLUTION.STR13
        } else {
            console.log("无帮派");
            this.label_xiezu.text = StrVal.LYEVOLUTION.STR13
            this.btn_xiezu.grayed = false
            this.label_xiezu.grayed = false
        }
        // this.btn_xiezu.visible = false
        // this.label_xiezu.visible = false
        // this.btn_up.visible = 
    }

    
    private loadData(): void {
        this.baseInfo = GameServerData.getInstance().getPlayerFullInfo().base
        this.levelData = LocaleData.getEvolutionByLevel(this.baseInfo.evolutionLevel)
        this.adData = GameServerData.getInstance().getAdData(4)
        if (this.levelData) {
            this.levelNowQua = this.levelData.quality.split(",")
            this.levelNowWei = this.levelData.qualityDropWeight.split(",")
        }
        this.levelNext = LocaleData.getEvolutionByLevel(this.baseInfo.evolutionLevel + 1)
        if (this.levelNext) {
            this.levelNextQua = this.levelNext.quality.split(",")
            this.levelNextWei = this.levelNext.qualityDropWeight.split(",")
        }else{
           
        }

        for (let index = 0; index < this.levelNowQua.length; index++) {
            let ins = index
            for (let j = 0; j < this.levelNextQua.length; j++) {
                if (this.levelNextQua[j] == this.levelNowQua[index]) {
                    ins = -1
                    break
                }
            }
            if (ins != -1) {
                this.levelNextQua.splice(ins, 0 , this.levelNowQua[ins])
                this.levelNextWei.splice(ins, 0, 0)
            }
        }
        let data = LocaleData.getEvolutions()
        this.materials = LocaleData.getEvolutionsDrop()
        // for (let index = 0; index < data.length; index++) {
        //     let element: any = data[index]
        //     if (element.bonusesId != "0") {
        //         let bonuseItem = UtilsUI.getBonuseItemsByBonusesId(element.bonusesId)
        //         for (let index = 0; index < bonuseItem.length; index++) {
        //             let bonu = bonuseItem[index];
        //             let temp = {}
        //             temp["level"] = element.level
        //             temp["bonuseItem"] = bonu
        //             this.materials.push(temp)
        //         }
        //     }
        // }
    }

    private getProbability(now: string | Number, all: Array<string | Number>): string {
        let _now:number = Number(now)
        let sum: number = 0
        for (let item of all) {
            let _item: number = Number(item)
            sum = sum + _item
        }
        return UtilsTool.stringFormat("{0}%", [((_now / sum)*100).toFixed(2)])
    }
    
    private getNextProbability(index: number): string {
        let zero = true
        let showNumber: number = 0
        for (let item of this.levelNowQua) {
           if (item == this.levelNextQua[index]) {
              zero = false
           }
        }
        if (zero) {
            return "0%"
        }
        else{
           return this.getProbability(this.levelNextWei[index], this.levelNextWei)
        }

    }
    private initShow(index: number, child: fgui.GComponent): void {
        let label_now: fgui.GTextField = child.getChild("label_now")
        let quaProtoNow =  LocaleData.getEquipQualityProto(this.levelNowQua[index])
        let showQua = quaProtoNow.star == "0" ? quaProtoNow.id: quaProtoNow.star
        let quaProtoNext =  LocaleData.getEquipQualityProto(this.levelNowQua[index])
        let showQuaNext = quaProtoNext.star == "0" ? quaProtoNext.id: quaProtoNext.star
        let nowCOlor = UtilsUI.getQualityColor(showQua)
        label_now.strokeColor = nowCOlor
        label_now.text = this.getProbability(this.levelNowWei[index], this.levelNowWei)
        // child.getChild("label_name").text = LocaleData.getEquipQualityProto(this.levelNowQua[index]).name
        if (this.levelNext) {
            child.getChild("label_next").text = this.getNextProbability(index)
        }
        let loader_now: fgui.GLoader = child.getChild("loader_now")
        let loader_next: fgui.GLoader = child.getChild("loader_next")
        loader_now.url = UtilsTool.stringFormat("ui://CCommon/frame_gailvdi{0}", [Number(showQua)])
        loader_next.url = UtilsTool.stringFormat("ui://CCommon/frame_gailvdi{0}", [Number(showQuaNext)])
        let label_name: fgui.GTextField = child.getChild("label_name")
        label_name.text = quaProtoNow.name
        label_name.strokeColor = nowCOlor
    }

    private initUnLockItem(index: number, child: fgui.GComponent): void {
        let meData = this.materials[index]
        let group_item = child.getChild("group_item", fgui.GComponent)
        let bonuseItem :BonuseItem;
        if (LocaleData.isItem(meData.id)) {
            bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, meData.id, UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [meData.level]))
        }else {
            bonuseItem = UtilsUI.getBonuseItem(meData.id, null, null, UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [meData.level]))
        }
        UtilsUI.setUIGroupItem(bonuseItem, group_item, null)
        group_item.getChild("group_count").visible = false
        let label_name: fgui.GTextField = child.getChild("label_name")
        label_name.color = UtilsUI.getEnoughColor(this.baseInfo.evolutionLevel >= meData.level)
        if (this.baseInfo.evolutionLevel >= meData.level) {
            label_name.text = StrVal.LYEVOLUTION.STR7
        }else{
            label_name.text = UtilsTool.stringFormat(StrVal.LYEVOLUTION.STR8, [meData.level])
        }
    }

    public onViewUpdate(params: any): void {
        this.loadData()
        this.updateUI()
        if (params && params.up) {
            UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYEVOLUTION.STR20, [this.baseInfo.evolutionLevel]))
        }
    }


    public getIsViewMask(): boolean {
        return false;
    };

    public onViewDestroy(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {updatePlayerShow : true})
    }

     
    public onViewShowFront(): void {
        this.loadData();
        this.updateUI();
    }

    public static cnaUpLevel(): boolean{
        let baseInfo = GameServerData.getInstance().getPlayerFullInfo().base
        let nextMoney = LocaleData.getEvolutionByLevel(baseInfo.evolutionLevel + 1).money
        if (baseInfo.evolveFinishTime != 0) {
            return false
        }
        return baseInfo.money >= Number(nextMoney) 
    }


    public static canAddSpeed(): boolean{
        let baseInfo = GameServerData.getInstance().getPlayerFullInfo().base
        if (baseInfo.evolveFinishTime == 0) {
            return false
        }
        let evolutionRoot = LocaleData.getEvolutionRoot()
        let haveCount = GameServerData.getInstance().getItemCountByProtoId(evolutionRoot.speedUpItemId)
        let needCount = (baseInfo.evolveFinishTime - GameServerData.getInstance().getServerTime()) / (Number(evolutionRoot.eachSpeedUpTime) * 60)
        return haveCount >= needCount 
    }
    
    
}