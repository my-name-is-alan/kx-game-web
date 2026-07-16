//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { GComponent } from "fairygui-cc/GComponent";
import { LocaleData } from "../Kernel/LocaleData";
import { GameServerData } from "../Kernel/GameServerData";
import { forEach, generateNodeStream } from "jszip";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { GameServer } from "../Kernel/GameServer";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { Color } from "cc";
import { LyEliteInfo } from "./LyEliteInfo";
import { VarVal } from "../Values/VarVal";
import { PointRedData } from "../Kernel/PointRedData";


export class LyEliteGroup extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyEliteGroup";
    }
    private selfPeople: any[]
    private allListData: any[]
    private jhEncyclopedia: any;
    private useData: any[] = []
    private uiPanel:fgui.GComponent;
    private list_jiban: fgui.GList
    public onViewCreate(_params:any): void {
        this.uiPanel = this.getUiPanel();
        (<fgui.GButton>this.uiPanel.getChild("btn_closeMask")).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteGroup, 0, null)
            
        });
        (<fgui.GButton>this.uiPanel.getChild("btn_close")).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteGroup, 0, null)
        });
        (<fgui.GLabel>this.uiPanel.getChild("group_title")).text = StrVal.LYELITEMONSTER.STR27
        this.list_jiban = this.uiPanel.getChild("list_jiban")
        this.list_jiban.itemProvider = (index: number):string => {
            return "ui://CCommon/group_jiban";
        }
        this.list_jiban.setVirtual()
        this.list_jiban.itemRenderer = (index: number, child:GComponent) => {
            let oneData = this.useData[index];
            (<fgui.GLabel>child.getChild("label_name")).text = oneData.proto.resonance_name;
            let label_grade:fgui.GTextField = child.getChild("label_grade")
            let label_des:fgui.GLabel = child.getChild("label_des")

            let list_eliteM: fgui.GList
            let monsterNumber: number =  Number((oneData.proto.associated_monster_id_group.split(",")).length)
            let btn_up : fgui.GButton
            btn_up = child.getChild("btn_up")
            let label_arrt: fgui.GTextField = child.getChild("label_arrt")
            //未激活
            if (oneData.level == 0) {
                btn_up.text = StrVal.LYELITEMONSTER.STR26
                label_des.text =  UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR23,[UtilsUI.getEnoughColorToHEX(oneData.canJhNumber >= monsterNumber), oneData.canJhNumber, monsterNumber])  
                label_grade.text = UtilsTool.stringFormat("({0}/{1})",[oneData.canJhNumber, monsterNumber])
                PointRedData.getInstance().updateManualPoint(btn_up, oneData.canJhNumber >= monsterNumber)
                if (oneData.canJhNumber >= monsterNumber) {
                   
                    label_grade.color = new Color(43, 132, 28)
                }else{
                    label_grade.color = new Color(213,46,38)
                }
                label_arrt.color = new Color(144, 144, 144)
            }else{
                btn_up.text = StrVal.LYELITEMONSTER.STR25
                label_des.text =  UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR24, [oneData.level + 1, UtilsUI.getEnoughColorToHEX(oneData.canUpNumber >= monsterNumber), oneData.canUpNumber, monsterNumber])
                label_grade.color = new Color(22,25,28)
                label_grade.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [oneData.level])
                label_arrt.color = new Color(43, 132, 28)
                PointRedData.getInstance().updateManualPoint(btn_up, oneData.canUpNumber >= monsterNumber)
                if (oneData.level == LocaleData.getEliteMonsMaxLevel(oneData.id)) {
                    //满级
                    label_des.text = "满级"
                    btn_up.visible = false
                }
            }
        
            for (const key in oneData.proto) {
                let isArrt = false
                for (const key2 in StrVal.ELITEATTRGROUP_NAME) { 
                   if (key == key2 && oneData.proto[key] !="0" ) {
                    label_arrt.text = StrVal.ELITEATTRGROUP_NAME[key2]+ ":" + oneData.proto[key] + "%"
                    break
                   }
                }
            }

            list_eliteM = child.getChild("list_eliteM")
            list_eliteM.itemProvider = ():string =>{
                return "ui://LyEliteMonster/btn_eliteM"
            }
            list_eliteM.itemRenderer = ((index: number, child: fgui.GComponent)=>{
                let data = oneData.eliteMonsterArr[index];
                let mostserProto = LocaleData.getEliteMonsterProto(data.protoId);
                (<fgui.GLoader>child.getChild("laoder_qua")).url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [Number(mostserProto.quality)]);
                let laoder_icon:fgui.GLoader = child.getChild("laoder_icon");
                let modelShowInfo = LocaleData.getModelShowInfo(mostserProto.modelId)
                laoder_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [modelShowInfo.icon_square]);
                let label_grade: fgui.GLabel = child.getChild("label_grade");
                label_grade.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [data.level]) + mostserProto.name
                let group_suip: fgui.GGroup = child.getChild("group_suip");
                group_suip.visible = false;
                //未激活
                if (data.level == 0) {
                    laoder_icon.grayed = true 
                    // label_grade.visible = false
                }else{
                    laoder_icon.grayed = false 
                    // label_grade.visible = true
                }
                
                child.clearClick()
                child.onClick(()=>{
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteInfo, 0, { protoId: data.protoId })
                });
            }).bind(this)
            list_eliteM.numItems = oneData.eliteMonsterArr.length
            btn_up.clearClick()
            btn_up.onClick(()=>{
                // if (oneData.canJhNumber >= monsterNumber || oneData.canUpNumber >= monsterNumber) {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.refrehPage()
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } , "activateOrUpgradeEliteMonsterEncyclopedia", { resonanceId: oneData.id })
                // }
            });

            let btn_info: fgui.GButton = child.getChild("btn_info")
            btn_info.clearClick()
            btn_info.onClick(()=>{
               let diaDatas =  LocaleData.getOneTypeEncyclopedia(oneData.id)
                let mGCom :fgui.GComponent = fgui.UIPackage.createObject("LyEliteMonster", "group_jbInfo").asCom;
                (<fgui.GButton>(mGCom.getChild("btn_close"))).onClick(()=>{
                    mGCom.dispose()
                });
                (<fgui.GLabel>mGCom.getChild("label_title")).text = diaDatas[0].resonance_name
                //次级界面 按钮
                let list_all: fgui.GList
                list_all = mGCom.getChild("list_all")
                list_all.itemProvider = ():string =>{
                    return "ui://CCommon/grou_jbItem"
                }
                list_all.itemRenderer = ((index: number, child: fgui.GComponent)=>{
                    let diaD = diaDatas[index];
                   (<fgui.GLabel>child.getChild("label_level")).text = diaD.resonance_level;
                   (<fgui.GLabel>child.getChild("label_jc")).text = StrVal.LYELITEMONSTER.STR30;

                    let label_des: fgui.GLabel = child.getChild("label_des")
                    let label_attr: fgui.GTextField = child.getChild("label_attr")
                    let number = 0
                    if (index == 0) {
                        label_attr.color = new Color(43, 132, 28) 
                        for (let index = 0; index < oneData.eliteMonsterArr.length; index++) {
                            let element = oneData.eliteMonsterArr[index];
                            if (element.level > 0) {
                                number = number + 1
                            }
                        }
                        label_des.text =  UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR28, [UtilsUI.getEnoughColorToHEX(number >= monsterNumber), oneData.canJhNumber, monsterNumber])  
                    }else{
                        for (let index = 0; index < oneData.eliteMonsterArr.length; index++) {
                            let element = oneData.eliteMonsterArr[index];
                            if (element.level >= Number(diaD.all_monsters_level_reached)) {
                                number = number + 1
                            }
                        }
                        label_des.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR29, [diaD.all_monsters_level_reached, UtilsUI.getEnoughColorToHEX(number >= monsterNumber), number, monsterNumber]) 
                    }
                    label_attr.color = number >= monsterNumber ? new Color(43, 132, 28) : new Color(144, 144, 144)
                    for (const key in diaD) {
                        let isArrt = false
                        for (const key2 in StrVal.ELITEATTRGROUP_NAME) {
                           if (key == key2 && diaD[key] !="0" ) {
                            label_attr.text = StrVal.ELITEATTRGROUP_NAME[key2]+ ":" + diaD[key] + "%"
                            break
                           }
                        }
                    }
                }).bind(this);
                list_all.numItems = diaDatas.length
                mGCom.setSize(this.getUiPanel().width, this.getUiPanel().height);
                this.uiPanel.addChild(mGCom)
                // mGCom.setPosition(fgui.GRoot.inst.width / 2 - mGCom.width/2, mGCom.height - 100)
                // mGCom.setPosition(mGCom.x, mGCom.y + (fgui.GRoot.inst.height - 1334)/2)
            })
        }
       this.refrehPage()
    }

    private loadInfoData(): void{
        this.allListData = LocaleData.getEliteMonsterEncyclopedia()
        this.jhEncyclopedia = GameServerData.getInstance().getPlayerFullInfo().elitemonsterInfo.activityEliteMonsterEncyclopedia
        this.selfPeople = GameServerData.getInstance().getPlayerFullInfo().elitemonsterInfo.elitemonster
        this.useData = []
        this.allListData.forEach(element => {
            let have = false
            for (let index = 0; index < this.useData.length; index++) {
                const element1 = this.useData[index];
                if (element.resonance_id == element1.id) {
                    have = true
                }
            }
            if (!have) {
                let tlevel = 0
                let canUpNumber = 0 //可升级
                let canJhNumber = 0
                this.jhEncyclopedia.forEach(element3 => {
                    if (element3.resonanceId == element.resonance_id) {
                        tlevel = element3.resonanceLevel
                    }
                });
                let maxLevel = LocaleData.getOneTypeEncyclopedia(element.resonance_id).length
                let isTopLevel = tlevel >= maxLevel ? 2:1
                let xml = LocaleData.getEliteMonsterEncyclopediaById(element.resonance_id, tlevel == 0 ? 1:tlevel);
                let maxNmuber =  xml.associated_monster_id_group.split(",").length
                let eliteMonsterArr: any[] = []
                if (isTopLevel == 1) {
                    let nextXml =  LocaleData.getEliteMonsterEncyclopediaById(element.resonance_id,  tlevel + 1);
                    let protoArr = nextXml.associated_monster_id_group.split(",");
                    for (let index = 0; index < protoArr.length; index++) {
                        let temp = protoArr[index];
                        let ms = GameServerData.getInstance().getLyEliteMonsterByProto(temp)
                        if (ms) {
                            canJhNumber = canJhNumber + 1
                            if (ms.level >= Number(nextXml.all_monsters_level_reached)) {
                                canUpNumber = canUpNumber + 1
                            } 
                            eliteMonsterArr.push({protoId: ms.protoId, level: ms.level })
                        }else{
                            eliteMonsterArr.push({protoId: temp, level: 0 })
                        }
                    }
                   
                }
                this.useData.push({ id:element.resonance_id, level: tlevel, isTopLevel:isTopLevel, proto:xml, eliteMonsterArr: eliteMonsterArr, canUpNumber:canUpNumber,  canJhNumber:canJhNumber, maxNmuber:maxNmuber })
            }
        });

        this.useData.sort((a: any, b: any): number =>{
            let akejihuo = 1;
            if (a.level == 0 && a.canJhNumber >= a.maxNmuber ) {
                akejihuo = 2
            }
            let bkejihuo = 1;
            if (b.level == 0 && b.canJhNumber >= b.maxNmuber ) {
                bkejihuo = 2
            }
            let canUpA = 1
            if (a.level != 0 && a.canUpNumber >= a.maxNmuber ) {
                canUpA = 2
            }
            let canUpB = 1
            if (b.level != 0 && b.canUpNumber >= b.maxNmuber ) {
                canUpB = 2
            }
            if (akejihuo == bkejihuo && akejihuo == 2) {
                return Number(b.id) - Number(a.id)
            }else if(akejihuo == 2 || bkejihuo == 2){
                return bkejihuo - akejihuo
            }
            else{
                if (canUpA - canUpB == 0) {
                    return Number(b.id) - Number(a.id)
                }else {
                    return canUpB - canUpA
                }
            }

        })
    }


    private refrehPage(): void{
        this.loadInfoData()
        this.list_jiban.numItems = this.useData.length
    }

    private getMaxNum(): number{
        let max = 0
        for (let index = 0; index < this.allListData.length; index++) {
            const element = this.allListData[index];
            if (max < Number(element.resonance_id)) {
                max = element.resonance_id
            }
        }
        return max
    }

    public onViewShowFront(): void {
        this.refrehPage()
    }

    public getIsViewMask(): boolean {
        return false;
    };

    public static isViewRedPoint(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.elite)) {
            return false
        }
        let allListData = LocaleData.getEliteMonsterEncyclopedia()
        let jhEncyclopedia = GameServerData.getInstance().getPlayerFullInfo().elitemonsterInfo.activityEliteMonsterEncyclopedia
        for (let index = 0; index < allListData.length; index++) {
            let element = allListData[index];
            let tlevel = 0
            let canUpNumber = 0 //可升级
            let canJhNumber = 0
            let isTopLevel = tlevel == LocaleData.getOneTypeEncyclopedia(element.resonance_id).length ? 2:1
            jhEncyclopedia.forEach(element3 => {
                if (element3.resonanceId == element.resonance_id) {
                    tlevel = element3.resonanceLevel
                }
            });
            let xml = LocaleData.getEliteMonsterEncyclopediaById(element.resonance_id, tlevel == 0 ? 1:tlevel);
            let maxNmuber = xml.associated_monster_id_group.split(",").length
            if (isTopLevel == 1) {
                let nextXml =  LocaleData.getEliteMonsterEncyclopediaById(element.resonance_id,  tlevel + 1);
                let protoArr = nextXml.associated_monster_id_group.split(",");
                for (let index = 0; index < protoArr.length; index++) {
                    let temp = protoArr[index];
                    let ms = GameServerData.getInstance().getLyEliteMonsterByProto(temp)
                    if (ms) {
                        canJhNumber = canJhNumber + 1
                        if (ms.level >= Number(nextXml.all_monsters_level_reached)) {
                            canUpNumber = canUpNumber + 1
                        } 
                    }
                }
            }
            if (tlevel == 0) {
                if (canJhNumber >= maxNmuber) {
                    return true
                }
            }else{
                if (canUpNumber >= maxNmuber) {
                    return true
                }
            }
        }
        return false
    }
}


