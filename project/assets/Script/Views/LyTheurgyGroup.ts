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
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { LyTheurgyGroupInfo } from "./LyTheurgyGroupInfo";
import { Color } from "cc";
import { PointRedData } from "../Kernel/PointRedData";
import { VarVal } from "../Values/VarVal";

export class LyTheurgyGroup extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyTheurgy";
        this.viewResI.pkgName = "LyTheurgy";
        this.viewResI.comName = "LyTheurgyGroup";
    }
    private catalogDatas: any
    private theurgies:any
    private fullInfo:any
    private theurgyCatalog:any
    private textColor3 = [ new Color(89,139,39),new Color(47,120,159),new Color(106,56,138), new Color(178,87,47),]
    private uiPanel:fgui.GComponent
    private list_jiban: fgui.GList
    public onViewCreate(_params:any):void {
        this.uiPanel = this.getUiPanel()
        let label_title = this.uiPanel.getChild("label_title")
        this.list_jiban = this.uiPanel.getChild("list_jiban")
        label_title.text = StrVal.LYTHEURGY.STR35

        let btn_close = this.uiPanel.getChild("btn_close", fgui.GButton)
        btn_close.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgyGroup, 0, null)
        })
        let btn_closeMask = this.uiPanel.getChild("btn_closeMask", fgui.GButton)
        btn_closeMask.onClick(()=> {
            btn_close.fireClick();
        })

        this.catalogDatas = LocaleData.getTheurgCatalogs()
        this.loadData();

        this.list_jiban.itemProvider = (index: number): string=>{
            return "ui://LyTheurgy/group_jiban"
        }
        this.list_jiban.itemRenderer = (index: number, child:fgui.GComponent) => {
            let cataLogData = this.theurgyCatalog[index]
            child.getChild("label_name").text = cataLogData.proto.name
            let label_grade: fgui.GTextField = child.getChild("label_grade")
            let list_thes: fgui.GList = child.getChild("list_thes")
            list_thes.itemProvider = (index: number): string=>{
                return "ui://LyTheurgy/group_theurgy"
            }
            list_thes.itemRenderer = (index2: number, child:fgui.GComponent) => {
                let loader_icon: fgui.GLoader = child.getChild("loader_icon");
                let label_grade: fgui.GLabel = child.getChild("label_grade")
                let theurg =  cataLogData.thes[index2]
                let theProto = LocaleData.getTheurgyById(theurg.protoId)
                
                loader_icon.url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [theProto.quality]);
                (child.getChild("loader_dikuang") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_name{0}", [theProto.quality]);
                (child.getChild("loader_qua") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_kuang{0}", [theProto.quality]);
                (child.getChild("loader_grade") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_dj{0}", [theProto.quality]);
                (child.getChild("loader_icon") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/f_{0}", [theProto.icon]);
                (child.getChild("label_name") as fgui.GLabel).text = theProto.name;
                (child.getChild("group_type") as fgui.GGroup).visible = true;
                (child.getChild("label_type") as fgui.GTextField).strokeColor = this.textColor3[ Number(theProto.quality)-1];
                (child.getChild("label_type") as fgui.GLabel).text = StrVal.LYTHEURGYNMAE3[ Number(theProto.type) - 1  ];
                (child.getChild("loader_type") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_typeDi{0}", [theProto.quality]);
                child.getChild("label_name", fgui.GLabel).text = theProto.name
                if (theurg.inst) {
                    child.grayed = false;
                    label_grade.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR46, [theurg.inst.phase]);
                }else{
                    child.grayed = true
                    label_grade.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR46, [1]);
                }
                child.clearClick()
                child.onClick(()=>{
                    if (theurg.inst) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyGroupInfo, 0, {theurgyInst: theurg.inst, protoId: theProto});
                    }else{
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyGroupInfo, 0, { protoId: theProto});
                    }
                     
                })
            }
            list_thes.numItems = cataLogData.thes.length
            let label_des:fgui.GTextField = child.getChild("label_des")
            let btn_active: fgui.GButton = child.getChild("btn_active")
            let btn_up: fgui.GButton = child.getChild("btn_up")
            let btn_info: fgui.GButton = child.getChild("btn_info")
            // //可激活
            // if (cataLogData.canJhNumber >= cataLogData.allNumner) {
               
            //     label_grade.text = UtilsTool.stringFormat("{0}/{1}",[oneData.canJhNumber, monsterNumber])
            //     label_des.text = StrVal.LYELITEMONSTER.STR23
            // }else{
            //     btn_up.text = StrVal.LYELITEMONSTER.STR25
            //     label_grade.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22,[oneData.level])
            //     label_des.text =  UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR24,[oneData.level + 1, oneData.canUpNumber, monsterNumber])
            // }
            //已激活
            btn_up.text = StrVal.LYELITEMONSTER.STR25
            btn_active.text = StrVal.LYELITEMONSTER.STR26
            let label_arrt:fgui.GTextField = child.getChild("label_arrt")
            let allArtData = cataLogData.proto.value.split(",")
            if (cataLogData.inst) {
                label_arrt.text = LocaleData.getTheurgAttr(cataLogData.proto.attr).name + ":" + allArtData[cataLogData.inst.level -1] + "%"
                btn_active.visible = false
                btn_up.visible = true
                label_grade.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR28, [cataLogData.inst.level])
                label_des.color = new Color(0, 0, 0)
                label_des.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR25, [cataLogData.nextPhase, UtilsUI.getEnoughColorToHEX(cataLogData.canUpNumber >= cataLogData.allNumner), cataLogData.canUpNumber, cataLogData.allNumner])
                label_arrt.color = new Color(43, 132, 28)
                label_grade.color = new Color(22,25,28)
            }else{
                //未激活
                btn_active.visible = true
                btn_up.visible = false
                label_grade.text = UtilsTool.stringFormat("({0}/{1})",[cataLogData.canJhNumber, cataLogData.allNumner])
                label_des.text = StrVal.LYTHEURGY.STR22
                label_des.color = new Color(213, 46, 38)
                label_arrt.text = LocaleData.getTheurgAttr(cataLogData.proto.attr).name + ":" + allArtData[0] + "%"
                label_arrt.color = new Color(144, 144, 144)
                label_grade.color = new Color(213,46,38)
            }

            PointRedData.getInstance().updateManualPoint(btn_active, cataLogData.canJhNumber >= cataLogData.allNumner)
            PointRedData.getInstance().updateManualPoint(btn_up, cataLogData.canUpNumber >= cataLogData.allNumner)

            btn_active.clearClick()
            btn_up.clearClick()
            btn_info.clearClick()
            btn_active.onClick(()=>{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.refreshPage()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } , "theurgyCatalogLevelUp", { theurgyCatalogId: Number(cataLogData.proto.id)})
            });
            btn_up.onClick(()=>{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.refreshPage()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } , "theurgyCatalogLevelUp", { theurgyCatalogId: Number(cataLogData.proto.id)})
            });
            btn_info.onClick(()=>{
                let mGCom :fgui.GComponent = fgui.UIPackage.createObject("LyEliteMonster", "group_jbInfo").asCom;
                (<fgui.GButton>(mGCom.getChild("btn_close"))).onClick(()=>{
                    mGCom.dispose()
                });
                (<fgui.GLabel>mGCom.getChild("label_title")).text = cataLogData.proto.name
                //次级界面 按钮
                let list_all: fgui.GList
                list_all = mGCom.getChild("list_all")
                list_all.itemProvider = ():string =>{
                    return "ui://CCommon/grou_jbItem"
                }
                list_all.itemRenderer = ((index: number, child: fgui.GComponent)=>{
                    let diaD = allArtData[index];
                   (<fgui.GLabel>child.getChild("label_level")).text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR28, [String(index + 1)]);
                   (<fgui.GLabel>child.getChild("label_jc")).text = StrVal.LYELITEMONSTER.STR30;

                    let label_des: fgui.GLabel = child.getChild("label_des")
                    // let label_need: fgui.GLabel = child.getChild("label_need")
                    let label_attr: fgui.GTextField = child.getChild("label_attr")
                    let nowPhase = LocaleData.getTheurgCatalogLevel(index + 1).phase
                    nowPhase = Number(nowPhase)
                    let number = 0
                    if (index == 0) {
                        if (cataLogData.nextPhase != 0) {
                            label_attr.color = new Color(43, 132, 28) 
                            label_des.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR24, [UtilsUI.getEnoughColorToHEX(cataLogData.allNumner >= cataLogData.allNumner), cataLogData.allNumner, cataLogData.allNumner]) 
                        }else{
                            let number = 0
                            for (let index = 0; index < cataLogData.thes.length; index++) {
                                let element = cataLogData.thes[index];
                                if (element.inst) {
                                    number = number + 1
                                }
                            }
                            label_attr.color = number >= cataLogData.allNumner ? new Color(43, 132, 28) : new Color(144, 144, 144)
                            label_des.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR24, [UtilsUI.getEnoughColorToHEX(number >= cataLogData.allNumner), number, cataLogData.allNumner]) 
                        }
                    }else{
                        for (let j = 0; j < cataLogData.thes.length; j++) {
                            let element = cataLogData.thes[j];
                            if (element.inst && element.inst.phase >= nowPhase ) {
                                number = number + 1
                            }
                        }
                        label_des.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR25, [nowPhase, UtilsUI.getEnoughColorToHEX(number >= nowPhase), number, cataLogData.allNumner]) 
                        label_attr.color = number >= nowPhase ? new Color(43, 132, 28) : new Color(144, 144, 144)
                    }
                    label_attr.text = LocaleData.getTheurgAttr(cataLogData.proto.attr).name + ": " + allArtData[index] + "%"
                }).bind(this);
                list_all.numItems = allArtData.length
                mGCom.setSize(this.getUiPanel().width, this.getUiPanel().height);
                this.uiPanel.addChild(mGCom)
            })
        }
        this.list_jiban.setVirtual()
        this.refreshPage()
    }

    private refreshPage(){
        this.loadData()
        this.list_jiban.numItems = this.catalogDatas.length
    }

    private loadData(){
        this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        this.theurgies = this.fullInfo.theurgyInfo.theurgies
        this.theurgyCatalog = []
        for (let index = 0; index < this.catalogDatas.length; index++) {
            let proto = this.catalogDatas[index];
            let inst = null
            for (let index = 0; index < this.fullInfo.theurgyInfo.theurgyCatalog.length; index++) {
                let catalogInst = this.fullInfo.theurgyInfo.theurgyCatalog[index]
                if (String(catalogInst.id)  ==  proto.id) {
                    inst = catalogInst
                }
            }
            let nextPhase = 0
            let canUpNumber = 0 //可升级
            let canJhNumber = 0 //可激活
            let theurgyString = proto.theurgy.split(",")
            let thes = []
            if (inst) {
                nextPhase = Number(LocaleData.getTheurgCatalogLevel(inst.level + 1).phase);
            }
            for (let index = 0; index < theurgyString.length; index++) {
                let theurgyInst = GameServerData.getInstance().getTheurgyByProto(theurgyString[index])
                if (inst) {
                    if (theurgyInst.phase >= nextPhase) {
                        canUpNumber = canUpNumber + 1
                    }   
                }else{
                    if(theurgyInst){
                        canJhNumber = canJhNumber + 1
                    }
                }
                thes.push({inst: theurgyInst, protoId:theurgyString[index]})
            }
            this.theurgyCatalog.push({ proto: proto, inst: inst, allNumner:theurgyString.length, canUpNumber: canUpNumber, canJhNumber:canJhNumber, thes:thes , nextPhase:nextPhase})
        }
        this.theurgyCatalog.sort((a, b)=>{
            let aCan = 0
            if (a.canUpNumber == a.allNumner || a.canJhNumber == a.allNumner) {
                aCan = 1
            }
            let bCan = 0
            if (b.canUpNumber == b.allNumner || b.canJhNumber == b.allNumner) {
                bCan = 1
            }
            if (aCan == bCan) {
                return Number(a.proto.id) - Number(b.proto.id)
            }else {
                return bCan - aCan
            }
        })
    }

    public onViewShowFront(): void {
        this.refreshPage()
    }

    public getIsViewMask(): boolean {
        return false;
    };

    public static isViewRedPointGroup(): boolean{
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.theurgy)) {
            return false
        }
        let catalogDatas = LocaleData.getTheurgCatalogs()
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        for (let index = 0; index < catalogDatas.length; index++) {
            let proto = catalogDatas[index];
            let inst = null
            for (let index = 0; index < fullInfo.theurgyInfo.theurgyCatalog.length; index++) {
                let catalogInst = fullInfo.theurgyInfo.theurgyCatalog[index]
                if (String(catalogInst.id)  ==  proto.id) {
                    inst = catalogInst
                }
            }
            let nextPhase = 0
            let canUpNumber = 0 //可升级
            let canJhNumber = 0 //可激活
            let theurgyString = proto.theurgy.split(",")
            if (inst) {
                nextPhase = Number(LocaleData.getTheurgCatalogLevel(inst.level + 1).phase);
            }
            for (let index = 0; index < theurgyString.length; index++) {
                let theurgyInst = GameServerData.getInstance().getTheurgyByProto(theurgyString[index])
                if (inst) {
                    if (theurgyInst.phase >= nextPhase) {
                        canUpNumber = canUpNumber + 1
                    }   
                }else{
                    if(theurgyInst){
                        canJhNumber = canJhNumber + 1
                    }
                }
            }
            if (inst) {
                if (canUpNumber >= theurgyString.length) {
                    return true   
                }
            }else{
                if (canJhNumber >= theurgyString.length) {
                    return true   
                }
            }
        }
        return false
    }
}


