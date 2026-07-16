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
import { Color, color, math } from "cc";
import { GameServer } from "../Kernel/GameServer";
import { GuideManager } from "../Kernel/GuideManager";
import { LocaleUser } from "../Kernel/LocaleUser";
import { applyPetTransferStars, petTransferProgress } from "./PetTransferDisplay";

export class LyBuddyChoose extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyBuddyChoose";
    }
    private dynamicParam: any
    public onViewCreate(params:any): void {
        let pageType = params.type
        let teamsInfo = params.temaData
        let teamXml = params.teamXml
        let dynamicParam = params.dynamicParam
        this.dynamicParam = dynamicParam
        let nowSlotId = params.posId
        this.getUiPanel().getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBuddyChoose, 0, null);
        });
        let uiPanel = this.getUiPanel().getChild("main", fgui.GComponent);
        UtilsUI.playCommonGroupAni(uiPanel, null);
        let pageContrl: fgui.Controller = uiPanel.getController("c1")
        let label_des: fgui.GLabel = uiPanel.getChild("label_des")
        label_des.text = StrVal.LYBUDDYMASS.STR34
        pageContrl.selectedIndex = pageType
        uiPanel.getChild("label_title", fgui.GLabel).text = pageContrl.selectedIndex == 0? StrVal.LYBUDDYMASS.STR15: StrVal.LYBUDDYMASS.STR16;
        uiPanel.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBuddyChoose, 0, null);
        });
        let list_pet: fgui.GList = uiPanel.getChild("list_pet")
        let getLeaderAdd: Function = (qua): number =>{
            qua = Number(qua)
            for (let index = 0; index < dynamicParam.data.qualityAddData.length; index++) {
                let now = dynamicParam.data.qualityAddData[index];
                if (Number(now.quality) == qua) {
                    return now.captainAddCoef / 10000 * 100
                }
            }
            return 0
        }
        let isInTeam :Function = (petInstId): boolean =>{
            for (let index = 0; index < teamsInfo.length; index++) {
                let tdata = teamsInfo[index].slotsInfo;
                for (let index2 = 0; index2 < tdata.length; index2++) {
                    let one = tdata[index2];
                    if (one.petId == petInstId) {
                        return true
                    }
                }
            }
            return false
        }

       
        

        let showAllPet: Array<any> = []
        //队长
        if (pageContrl.selectedIndex == 0) {
            list_pet.lineGap = -3
            let leaderProto = teamXml.captainProtoIds.split(",")
            for (let index = 0; index < leaderProto.length; index++) {
                let protoId = leaderProto[index];
                let petArr = GameServerData.getInstance().getPetByProto(protoId)
                let xml = LocaleData.getPetProto(protoId)
                if (petArr.length == 0) {
                    let temp = {}
                    temp["xml"] = xml
                    showAllPet.push(temp)
                }else{
                    for (let index2 = 0; index2 < petArr.length; index2++) {
                        let temp = {}
                        temp["xml"] = xml
                        temp["own"] = petArr[index2]
                        temp["isUp"] = isInTeam(petArr[index2].id)
                        showAllPet.push(temp)
                    }
                }
            }
         
            showAllPet.sort((a,b):number=>{
                let ownA = a.own ? 1: 2
                let ownB = b.own ? 1: 2
                let upA = a.isUp ? 1: 2
                let upB = b.isUp ? 1: 2
                if (ownA == ownB) {
                    return upA - upB
                }else{
                    return ownA - ownB
                }
            })
        }else{
            list_pet.lineGap = -28
            let ownPet = GameServerData.getInstance().getPlayerFullInfo().petModuleInfo.pet
            for (let index = 0; index < ownPet.length; index++) {
                let element = ownPet[index];
                let xml = LocaleData.getPetProto(element.protoId)
                let temp = {}
                temp["xml"] = xml
                temp["own"] = element
                temp["isUp"] = isInTeam(element.id)
                showAllPet.push(temp)
            }
            showAllPet.sort((a,b):number=>{
                let upA = a.isUp ? 1: 2
                let upB = b.isUp ? 1: 2
                if (upA == upB) {
                    let quaA = Number(b.xml.quality)
                    let quaB = Number(a.xml.quality)
                    if (quaA == quaB) {
                        return Number(a.xml.id)  - Number(b.xml.id) 
                    }else{
                        return  quaA  - quaB
                    }
                }else{
                    return upA - upB
                }
            })
        }

        

        list_pet.itemRenderer = (index: number, child: fgui.GComponent) =>{
            let petData = showAllPet[index]
            let loader_icon: fgui.GLoader = child.getChild("loader_icon")
            let showInfo = LocaleData.getModelShowInfo(String(petData.xml.modelId));
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [showInfo.icon_square])
            //队长
            let label_name: fgui.GLabel = child.getChild("label_name")
            label_name.text = petData.xml.name
            let label_speed: fgui.GLabel = child.getChild("label_speed")
            if (pageContrl.selectedIndex == 0) {
                label_speed.text = "+" + getLeaderAdd(petData.xml.quality) + "%"
                label_name.visible = true
            }else{
                label_name.visible = false
                label_speed.text = UtilsTool.stringFormat(StrVal.LYBUDDYMASS.STR17, [this.getOnePetaddTime(petData.xml.quality, petData.own.devourLevel)])
            }
            //已拥有
            let group_noOwn: fgui.GGroup = child.getChild("group_noOwn")
            let img_up: fgui.GImage = child.getChild("img_up")
            let onClickFun = null
            if (petData.own) {
                 let starArr: fgui.GLoader[] = []
                 for (let i = 1; i < 6; i++) {
                     let starItem: fgui.GLoader = child.getChild("img_star" + i)
                     starArr.push(starItem)
                 }
                 applyPetTransferStars(starArr, petData.own.devourLevel)
                 label_speed.text += "  " + petTransferProgress(petData.own.devourLevel)
                 group_noOwn.visible = false
                 img_up.visible = petData.isUp
                 if (petData.isUp) {
                    label_des.text = UtilsTool.stringFormat(StrVal.LYBUDDYMASS.STR35, [getLeaderAdd(petData.xml.quality)]) 
                 }
                 onClickFun = ()=>{
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBuddyChoose, 0, null);
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                    }
                    } ,"animalFairylandTeamBattle", { activityId: dynamicParam.id, teamId:Number(teamXml.id), slotId:nowSlotId, petId: petData.own.id})
                 }
            }else{
                img_up.visible = false
                group_noOwn.visible = true
                for (let i = 1; i < 6; i++) {
                    child.getChild("img_star" + i, fgui.GLoader).url = ""
                }
            }
            child.clearClick()
            child.onClick(()=>{
                if (onClickFun) {
                    onClickFun()
                }
            });
         }
         list_pet.numItems = showAllPet.length

    }

    public getOnePetaddTime(qua, devLevel){
        let xml = this.getQuaAddData(qua)
        return xml.baseValue + xml.devourLevelAdd * devLevel
     }
 
     public getQuaAddData(qua){
         qua = Number(qua)
         for (let index = 0; index < this.dynamicParam.data.qualityAddData.length; index++) {
             let data = this.dynamicParam.data.qualityAddData[index];
             if (data.quality == qua ) {
                return data
             }
         }
     }
   
    public getIsViewMask(): boolean {
        return false;
    }
}


