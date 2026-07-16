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
import { LocaleData } from "../Kernel/LocaleData";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { LyEliteDraw } from "./LyEliteDraw";
import { GameServer } from "../Kernel/GameServer";
import { LyEliteAttackReward } from "./LyEliteAttackReward";
import { LyEliteAttack } from "./LyEliteAttack";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { Vec2, sp } from "cc";
import { SpinePlayer } from "../Kernel/SpinePlayer";

export class LyEliteDisperse extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyEliteDisperse";
    }
    private dynamicParam
    private monsterState: any
    private monsterXml: any
    private upEliteData: Array<any> = []
    private monstersData: any
    private maxUpNumber: number
    private attenCoeNumber: Array<string>
    
    private label_desScore: fgui.GLabel
    private list_Use: fgui.GList
    private list_Item: fgui.GList
    private list_Elite: fgui.GList

    public onViewCreate(params:any): void {
        this.monsterState = params.monsterState
        this.monsterXml = params.monsterXml
        this.dynamicParam = params.dynamicParam
        this.maxUpNumber = Number(this.monsterXml.slotCount) 
        this.attenCoeNumber = this.dynamicParam.data.attenuationCoefGroup.split(",")
        let activityData = GameServerData.getInstance().getActivityState(this.dynamicParam.id).data.activityGremlinExperience;
        let lastRecoverTime = GameServerData.getInstance().getActivityGlobalState(this.dynamicParam.id).data.activityGlobalGremlinExperience.lastRecoverTime + Number(this.dynamicParam.data.attackCountRecoverTime) 

        this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteDisperse, 0, null)
        });
        let uiPanel = this.getUiPanel().getChild("main", fgui.GComponent)
        UtilsUI.playCommonGroupAni(uiPanel, null);
        uiPanel.getChild("btn_close").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteDisperse, 0, null)
        });
        uiPanel.getChild("loader_EliteQua", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyEliteMonster/frame_{0}", [this.monsterXml.quality]);
        uiPanel.getChild("label_name", fgui.GLabel).text = this.monsterXml.name
        uiPanel.getChild("group_title", fgui.GLabel).text = StrVal.LYELITEATTACK.STR16
        uiPanel.getChild("group_title", fgui.GLabel).text = StrVal.LYELITEATTACK.STR16
        uiPanel.getChild("group_title2", fgui.GLabel).text = StrVal.LYELITEATTACK.STR18
        uiPanel.getChild("n40", fgui.GLabel).text = StrVal.LYELITEATTACK.STR20
        let group_add: fgui.GComponent = uiPanel.getChild("group_add")
        let loader_use:fgui.GLoader = group_add.getChild("loader_icon")
        let label_number:fgui.GLabel = group_add.getChild("label_number")
        let label_time:fgui.GLabel = uiPanel.getChild("label_time")
        let btn_add: fgui.GLoader = group_add.getChild("btn_add")
        btn_add.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyEliteAttack, 0, {isSkipTask: true})
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteDisperse, 0, null)
        })
        loader_use.url = UtilsUI.getItemIconUrl(VarVal.bonusType.elitescore);
        label_number.text = String(activityData.attackCount) 
        let loader_spine = uiPanel.getChild("loader3D_monster", fgui.GLoader3D)
        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, loader_spine, this.monsterXml.icon);
        this.label_desScore = uiPanel.getChild("label_desScore")
        this.label_desScore.text = String(UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR17, [0])) 
        let btn_goDraw: fgui.GButton = uiPanel.getChild("btn_goDraw")
        btn_goDraw.text = StrVal.LYELITEATTACK.STR19
        btn_goDraw.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteDraw, 0, null)
        });
        let btn_qusan: fgui.GButton = uiPanel.getChild("btn_qusan")
        btn_qusan.icon = UtilsUI.getItemIconUrl(VarVal.bonusType.elitescore);
        btn_qusan.text = 1 +  StrVal.LYELITEATTACK.STR14
        btn_qusan.onClick(()=>{
            let str = ""
            for (let index = 0; index < this.upEliteData.length; index++) {
                let data = this.upEliteData[index];
                if (index < this.upEliteData.length -1) {
                    str = str +  data.own.id + ","
                }else{
                    str = str +  data.own.id
                }
            }
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteAttackReward, 0, args)
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteDisperse, 0, args)
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"gremlinExperienceExorcise", { activityId: this.dynamicParam.id, id:this.monsterXml.id,  gremlinIds:str })
        });
        this.list_Use = uiPanel.getChild("list_Use")
        this.list_Item = uiPanel.getChild("list_Item")
        this.list_Elite = uiPanel.getChild("list_Elite")
        this.list_Use.itemRenderer = (index: number, child:fgui.GComponent)=>{
            let data = this.upEliteData[index]
            let icon: fgui.GLoader = child.getChild("icon")
            let bg_Loader: fgui.GLoader = child.getChild("loader_back")
            if (index < this.upEliteData.length) {
                icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [data.modelShowInfo.icon_square]);
                bg_Loader.url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [data.proto.quality]);
            }else{
                icon.url = "ui://CCommon/icon_add"
                bg_Loader.url = ""
            }
        };
        this.list_Elite.itemRenderer = (index: number, child:fgui.GComponent)=>{
            let mosterData = this.monstersData[index];
            (<fgui.GLoader>child.getChild("laoder_qua")).url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [mosterData.proto.quality]);
            let laoder_icon:fgui.GLoader = child.getChild("laoder_icon");
            if (!mosterData.modelShowInfo) {
                mosterData.modelShowInfo = LocaleData.getModelShowInfo(mosterData.proto.modelId)
            }
            let group_suo: fgui.GGroup = child.getChild("group_suo");
            laoder_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [mosterData.modelShowInfo.icon_square]);
            if (mosterData.own) {
                group_suo.visible = false
                laoder_icon.grayed = !mosterData.canUp
            }else{
                group_suo.visible = true
                laoder_icon.grayed = false
            }
            let label_grade: fgui.GLabel = child.getChild("label_grade");
            let group_grade: fgui.GGroup = child.getChild("group_grade")
            let pro_suip: fgui.GProgressBar = child.getChild("pro_suip");
            group_grade.visible = true
            label_grade.text =  UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [mosterData.level]);  
            pro_suip.max = mosterData.needNumber
            pro_suip.value = mosterData.ownDebr;
            (<fgui.GLabel>child.getChild("label_suip")).text = UtilsTool.stringFormat("{0}/{1}",[ pro_suip.value, pro_suip.max]);
            label_grade.visible = true
            child.getChild("label_sore",fgui.GLabel).text = UtilsTool.stringFormat("{0}~{1}", [mosterData.minScore, mosterData.maxScore])
            let img_gou: fgui.GImage = child.getChild("img_gou")
            img_gou.visible = false
            for (let index = 0; index < this.upEliteData.length; index++) {
                let proto = this.upEliteData[index].proto;
                if (proto.id == mosterData.proto.id) {
                    img_gou.visible = true
                }
            }
            child.clearClick()
            child.onClick(()=>{
                if (mosterData.own) {
                    if (mosterData.canUp) {
                        let have = -1
                        for (let index = 0; index < this.upEliteData.length; index++) {
                            let proto = this.upEliteData[index].proto;
                            if (proto.id == mosterData.proto.id) {
                                img_gou.visible = false
                                have = index
                                break
                            }
                        }
                        if(have != -1){
                            this.upEliteData.splice(have, 1)
                            this.list_Use.numItems = this.maxUpNumber
                            this.refreshAllScore()
                        }else{
                            if (this.upEliteData.length >= this.maxUpNumber) {
                                UtilsUI.showMsgTip("上阵已满")
                            }else{
                                this.upEliteData.push(mosterData)
                                this.list_Use.numItems = this.maxUpNumber
                                this.refreshAllScore()
                                img_gou.visible = true
                            }
                        }
                    }else{
                        UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_ONE, "", 
                        StrVal.LYELITEATTACK.STR33, null, 
                        "", null, 
                        "", null, 
                        StrVal.COMMON.STR33, null);
                    }
                }else{
                    UtilsUI.showImgTip("LyEliteMonster", "group_liking")
                }
            });
        };
        this.list_Elite.setVirtual();

        let bonusItem: Array<BonuseItem> = UtilsUI.getBonuseItemsByString(this.monsterXml.bonuses) 
        this.list_Item.itemRenderer = (index: number, child:fgui.GComponent)=>{
            UtilsUI.setUIGroupItem(bonusItem[index], child, null);
        };
        this.list_Item.numItems = bonusItem.length;
        this.refrshUI()


        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == this.dynamicParam.id) {
                let activityData = GameServerData.getInstance().getActivityState(this.dynamicParam.id).data.activityGremlinExperience;
                label_number.text = String(activityData.attackCount) 
            }
        }, "activityStateChanged");

        this.registerRequest((args) => {
            if (args.activityGlobalState.activityId == this.dynamicParam.id) {
                lastRecoverTime = args.activityGlobalState.data.activityGlobalGremlinExperience.lastRecoverTime + this.dynamicParam.data.attackCountRecoverTime
                let serverTime = GameServerData.getInstance().getServerTime()
                label_time.text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR30, [UtilsTool.parseTimeToString(lastRecoverTime - serverTime)]); 
            }
        }, "activityGlobalStateChanged");

        this.setInterval(()=>{
            let serverTime = GameServerData.getInstance().getServerTime()
            label_time.text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR30, [UtilsTool.parseTimeToString(lastRecoverTime - serverTime)]); 
        }, 1000);
    }

    private refrshUI (){
        let activityData = GameServerData.getInstance().getActivityState(this.dynamicParam.id).data.activityGremlinExperience;
        let xmls = LocaleData.getEliteMonsterRoot()._elitemonster[0]._item
        this.monstersData = []
        for (let index = 0; index < xmls.length; index++) {
            let monster = xmls[index];
            let temp = {};
            let own = GameServerData.getInstance().getLyEliteMonsterByProto(monster.id);   
            let templevel = 1 
            let tempCan = true
            if (own) {
                templevel = own.level
                for (let index = 0; index < activityData.gremlinsLog.length; index++) {
                    let strId = activityData.gremlinsLog[index];
                    if (strId == own.id) {
                        tempCan = false
                        break
                    }
                }
            }
            temp["own"] = own         
            temp["ownDebr"] = this.ownMonsterDebrisCount(monster.debris_id);
            temp["needNumber"] = Number(LocaleData.getEliteMonsterLevel(monster.id, templevel).upgrade_cost)
            let proto = LocaleData.getEliteMonsterProto(monster.id)
            temp["proto"] = proto
            temp["minScore"] = this.getEliteMinScore(proto.quality, templevel)
            temp["maxScore"] = this.getEliteMaxScore(proto.quality, templevel)
            temp["id"] = monster.id
            temp["level"] = templevel
            temp["canUp"] = tempCan
            this.monstersData.push(temp)
        }
        this.monstersData.sort((a: any, b: any): number =>{
            let canUpA = a.canUp? 1:2
            let canUpB = b.canUp? 1:2
            let ownA = a.own? 1:2
            let ownB = b.own? 1:2
            if (ownA == ownB) {
                if (canUpB == canUpA) {
                    if (a.proto.quality == b.proto.quality) {
                        return Number(a.proto.id) - Number(b.proto.id)
                    }else{
                        return Number(b.proto.quality) - Number(a.proto.quality)
                    } 
                }else{
                    return canUpA - canUpB
                }
            }else{
                return ownA - ownB
            }
        })
        this.list_Use.numItems = this.maxUpNumber
        this.list_Elite.numItems = this.monstersData.length
    }
    private ownMonsterDebrisCount(protoId): any {
        let elitemonsterInfo =  GameServerData.getInstance().getPlayerFullInfo().elitemonsterInfo
        let number = 0
        elitemonsterInfo.elitemonsterDebris.forEach(debris => {
            if (String(debris.protoId) == String(protoId)) {
                number = debris.count
            }
        });
        return number;
    }

    private getEliteMinScore(eliteQua, level): number{
        let monstQua = this.monsterXml.quality
        monstQua = Number(monstQua)
        let data = this.getQuaGroup(eliteQua)
        if (monstQua == 1) {
            return Number(data.scoreMinQuality1) + (Number(data.levelAddScore) * level-1)
        }else if(monstQua == 2){
            return Number(data.scoreMinQuality2) + (Number(data.levelAddScore) * level-1)
        }else if(monstQua == 3){
            return Number(data.scoreMinQuality3)  + (Number(data.levelAddScore) * level-1)
        }
    }

    private getQuaGroup(eliteQua): any{
        for (let index = 0; index < this.dynamicParam.data.qualityGroups.length; index++) {
            let element = this.dynamicParam.data.qualityGroups[index];
            if (element.quality == eliteQua) {
                return element
            }
        }
    }

    private getEliteMaxScore(eliteQua, level): number{
        let monstQua = this.monsterXml.quality
        eliteQua = Number(eliteQua)
        monstQua = String(monstQua)
        let data = this.getQuaGroup(eliteQua)
        if (monstQua == 1) {
            return Number(data.scoreMaxQuality1) + (Number(data.levelAddScore) * level-1)
        }else if(monstQua == 2){
            return Number(data.scoreMaxQuality2) + (Number(data.levelAddScore) * level-1)
        }else if(monstQua == 3){
            return Number(data.scoreMaxQuality3) + (Number(data.levelAddScore) * level-1)
        }
    }

    private refreshAllScore(){
        // let min = Number(this.monsterXml.scoreMin) 
        // let max = Number(this.monsterXml.scoreMax)
        let min = 0
        let max = 0
        for (let index = 0; index < this.upEliteData.length; index++) {
            let data = this.upEliteData[index];
            min = data.minScore + min
            max = data.maxScore + max
        }
        if(this.upEliteData.length == 0)
        {
            this.label_desScore.text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR17, [0])
        }
        else{
            let xs = Number(this.attenCoeNumber[this.upEliteData.length - 1]) / 10000
            min = min * xs
            max = max * xs
            this.label_desScore.text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR17, [ UtilsTool.stringFormat("{0}~{1}", [ Math.floor(min), Math.floor(max)]) ])
        }
    }

    public getIsViewMask(): boolean {
        return false;
    }

    public onViewUpdate(params: any): void {
        this.refrshUI()
    }
    
    public onViewDestroy(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyEliteAttack, 0, null)
    }
}


