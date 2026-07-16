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
import { VarVal } from "../Values/VarVal";
import { LyTheurgyDraw } from "./LyTheurgyDraw";
import { Color } from "cc";
import { LyTheurgyInfo } from "./LyTheurgyInfo";
import { LyTheurgyGroup } from "./LyTheurgyGroup";
import { LyGuideDetail } from "./LyGuideDetail";
import { LyMainPage } from "./LyMainPage";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { AudioManager } from "../Kernel/AudioManager";

export class LyTheurgy extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyTheurgy";
        this.viewResI.pkgName = "LyTheurgy";
        this.viewResI.comName = "LyTheurgy";
    }
    public static isSkipPlayAni: boolean
    private list_theurgy: fgui.GList
    private uiPanel:fgui.GComponent
    private con_type: fgui.Controller
  
    private fullInfo: any
    private theurgies: any
    private theurgySeal : any
    private theurgyCatalog : any
    private typeTheurgs: any[] = new Array(4)
    private useTheurgs: any[] = new Array(4)
    private theRoot: any
    private loader_useTheurgy: fgui.GComponent[] = []
    private img_no: fgui.GImage
    private needUpItemProto: any
    public onViewCreate(_params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgy, 0, null)
        });
        this.theRoot = LocaleData.getTheurgyRoot();
        this.uiPanel = this.getUiPanel().getChild("main")
        if (LyTheurgy.isSkipPlayAni) {
            LyTheurgy.isSkipPlayAni = false
        }else{
            UtilsUI.playCommonGroupAni(this.uiPanel, null);
        }
        let root = LocaleData.getTheurgyRoot();
        (<fgui.GButton>this.uiPanel.getChild("btn_what")).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:StrVal.LYTHEURGY.STR34, detail: root.gameplayGuide});
        })
        this.needUpItemProto =  LocaleData.getItemProto(this.theRoot.levelUpItemId)
        let btn_close = this.uiPanel.getChild("btn_close")
        let label_title = this.uiPanel.getChild("label_title")
        this.list_theurgy = this.uiPanel.getChild("list_theurgy")
        this.con_type = this.uiPanel.getController("con_type")
        this.img_no = this.uiPanel.getChild("img_no")
        label_title.text = StrVal.LYTHEURGY.STR1
        btn_close.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgy, 0, null)
        });
        let btn_draw:fgui.GButton = this.uiPanel.getChild("btn_draw");
        btn_draw.title = StrVal.LYTHEURGY.STR2
        btn_draw.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyDraw, 0, null)
        });
        PointRedData.getInstance().registerPoint(btn_draw, PointRedType.LyTheurgyDrawBtn)
        let btn_group:fgui.GButton = this.uiPanel.getChild("btn_group");
        btn_group.title = StrVal.LYTHEURGY.STR3
        btn_group.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyGroup, 0, null)
        });
        PointRedData.getInstance().registerPoint(btn_group, PointRedType.LyTheurgyGroup)
        for (let index = 0; index < 4; index++) {
           let btn = this.uiPanel.getChild("btn_" + index, fgui.GButton)
           btn.text = StrVal.LYTHEURGYNMAE[index];
           btn.onClick(()=>{
                this.list_theurgy.numItems = this.typeTheurgs[this.con_type.selectedIndex].length;
                this.img_no.visible = this.list_theurgy.numItems == 0
           });
           let loader_use:fgui.GComponent = this.uiPanel.getChild("loader_use"+ index)
           this.loader_useTheurgy.push(loader_use)
        }

        let spinePlayer2 = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation("jm_miji_zhuye", true, null, null, null);
        }, this.uiPanel.getChild("loader_3d_effect", fgui.GLoader3D), "jm_miji_zhuye");


        //#region 类GM 事件帮后端处理神通插入
        let theurgyFrags = GameServerData.getInstance().getPlayerFullInfo().theurgyInfo.theurgyFrag
        let noTheInst = []
        let tupoNumber =  Number(LocaleData.getTheurgPhase(1).fragAmount) 
        for (let index = 0; index < theurgyFrags.length; index++) {
            let frag = theurgyFrags[index];
            let theInst = GameServerData.getInstance().getTheurgyByProto(frag.protoId)
            if (!theInst && frag.count >= tupoNumber) {
                noTheInst.push(frag.protoId)
            }
        }
        if (noTheInst.length > 0) {
            for (let index = 0; index < noTheInst.length; index++) {
                let protoId = noTheInst[index];
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        if (index == noTheInst.length - 1) {
                            this.loadData()
                            this.refreshPage()
                        }
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } , "theurgyBreakthrough", { theurgyId: protoId })
            }
        }
        //#endregion
        this.loadData()
        this.refreshPage()
    }
    private textColor3 = [ new Color(71,111,46),new Color(51,88,139),new Color(98,61,165), new Color(172,122,16),]
    private refreshPage(){
        for (let index = 0; index < this.loader_useTheurgy.length; index++) {
            let nowGroup:fgui.GComponent = this.loader_useTheurgy[index]
            nowGroup.getController("part").selectedIndex = index
            let loader_icon:fgui.GLoader = nowGroup.getChild("loader_icon")
            let loader_qua:fgui.GLoader = nowGroup.getChild("loader_qua")
            let loader_part:fgui.GLoader = nowGroup.getChild("loader_part")
            let loader_seal1:fgui.GLoader = nowGroup.getChild("loader_seal1")
            let loader_seal2:fgui.GLoader = nowGroup.getChild("loader_seal2")
            let loaer_stage:fgui.GLoader = nowGroup.getChild("loaer_stage")
            let label_name:fgui.GTextField = nowGroup.getChild("label_name")
            let label_stage:fgui.GLabel = nowGroup.getChild("label_stage");
            let group_all: fgui.GGroup = nowGroup.getChild("all")
            nowGroup.getChild("label_partName", fgui.GLabel).text = StrVal.LYTHEURGYNMAE2[index]
            if (this.useTheurgs[index] != undefined){
               group_all.visible = true
               let theurgyInst = this.useTheurgs[index]
               let theProto = LocaleData.getTheurgyById(theurgyInst.cfgId);
               loader_icon.url = UtilsUI.getTheurgyIconUrl(theProto) 
               label_name.strokeColor = this.textColor3[Number(theProto.quality) - 1]
               loader_part.grayed =  false
               loader_part.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_yuan{0}", [theProto.quality]) 
               loaer_stage.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_grade{0}", [theProto.quality]) 
               loader_qua.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_mj{0}", [theProto.quality]) 
               label_name.text = theProto.name
               label_stage.text = theurgyInst.level
               nowGroup.clearClick()
               nowGroup.onClick(()=>{
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyInfo, 0, {theurgyInst: theurgyInst })
               })
               loader_seal1.visible = false
               loader_seal2.visible = false

               let canSealNumber = 0
               if (theurgyInst.level >= Number(this.theRoot.seal1Level)) {
                    canSealNumber = canSealNumber + 1
               }
               if (theurgyInst.level >= Number(this.theRoot.seal2Level)) {
                    canSealNumber = canSealNumber + 1
                }
               loader_seal2.visible = theurgyInst.level >= Number(this.theRoot.seal1Level)
               loader_seal1.visible = theurgyInst.level >= Number(this.theRoot.seal2Level)
               PointRedData.getInstance().updateManualPoint(nowGroup, LyTheurgy.theRedPoint(theurgyInst))
               if (theurgyInst.seal.length > 0) {
                    loader_seal2.visible = true
                    if (theurgyInst.seal[0] != 0) {
                        let sealProto = LocaleData.getTheurgSealByItemId(theurgyInst.seal[0])
                        loader_seal2.url = UtilsTool.stringFormat("ui://LyTheurgy/icon_seal{0}", [sealProto.quality]);
                    }else{
                        loader_seal2.url = "ui://LyTheurgy/icon_seal0" 
                    }
                }
                if (theurgyInst.seal.length > 1) {
                    if (theurgyInst.seal[1] != 0) {
                        let sealProto = LocaleData.getTheurgSealByItemId(theurgyInst.seal[1])
                        loader_seal1.url = UtilsTool.stringFormat("ui://LyTheurgy/icon_seal{0}", [sealProto.quality]);
                    }else
                    {
                        loader_seal1.url = "ui://LyTheurgy/icon_seal0" 
                    }
                    loader_seal1.visible = true
                }
            }else{
                loader_part.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_yuan{0}", [1]) 
                loader_part.grayed =  true
                group_all.visible = false
            }
        }

        this.list_theurgy.itemProvider = ():string =>{
            return "ui://LyTheurgy/group_theurgy"
        }
        this.list_theurgy.itemRenderer = (index:number, child:fgui.GComponent)=>{
            // child.displayObject.perspective = true
            // child.rotationY = -15
            let theurgInst =  this.typeTheurgs[this.con_type.selectedIndex][index]
            let theProto = LocaleData.getTheurgyById(theurgInst.cfgId)
            let loader_icon: fgui.GLoader = child.getChild("loader_icon");
            let loader_qua: fgui.GLoader = child.getChild("loader_qua");
            let loader_dikuang: fgui.GLoader = child.getChild("loader_dikuang");
            let loader_grade: fgui.GLoader = child.getChild("loader_grade");
            let img_new: fgui.GComponent = child.getChild("img_new");
            loader_dikuang.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_name{0}", [theProto.quality]);
            loader_qua.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_kuang{0}", [theProto.quality]);
            loader_icon.url = UtilsTool.stringFormat("ui://LyTheurgy/f_{0}", [theProto.icon]);
            loader_grade.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_dj{0}", [theProto.quality]);
            if (theurgInst.new) {
                img_new.visible = true
            }else{
                img_new.visible = false
            }
            (child.getChild("label_name") as fgui.GLabel).text = theProto.name;
            (child.getChild("label_grade") as fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR28, [theurgInst.level]);
            child.clearClick()
            child.onClick(()=>{
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyInfo, 0, { theurgyInst: theurgInst })
            });
        }
        this.list_theurgy.numItems = this.typeTheurgs[this.con_type.selectedIndex].length;
        this.img_no.visible = this.list_theurgy.numItems == 0
    }

    private loadData(){
        this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        this.theurgies = this.fullInfo.theurgyInfo.theurgies
        this.theurgySeal = this.fullInfo.theurgyInfo.theurgySeal
        this.theurgyCatalog = this.fullInfo.theurgyInfo.theurgyCatalog
        this.typeTheurgs = new Array(4)
        for (let index = 0; index < this.typeTheurgs.length; index++) {
            this.typeTheurgs[index] = []
        }
        this.useTheurgs = new Array(4)
        for (let index = 0; index < this.theurgies.length; index++) {
            let element = this.theurgies[index];
            if (element.status == 0) {
                this.typeTheurgs[ Number(element.type) - 1].push(element)
            }else{
                this.useTheurgs[Number(element.type) - 1] = element
            }
        }

        for (let index = 0; index < this.typeTheurgs.length; index++) {
            this.typeTheurgs[index].sort((a, b)=>{
                let atheProto = LocaleData.getTheurgyById(a.cfgId)
                let btheProto = LocaleData.getTheurgyById(b.cfgId)
                let aQua = Number(atheProto.quality)
                let bQua = Number(btheProto.quality)
                if (aQua == bQua) {
                    return Number(a.cfgId - b.cfgId)
                }else{
                    return bQua - aQua
                }
            })
        }
        
    }


    public getIsViewMask(): boolean {
        return false;
    };

    public onViewDestroy(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { upShowUi: true });
    }

    public onViewUpdate(params: any): void {
        this.loadData()
        this.refreshPage()
    }

    public static isNoUpSeal(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.theurgy)) {
            return false
        }
        let theurgies = GameServerData.getInstance().getPlayerFullInfo().theurgyInfo.theurgies
        for (let index = 0; index < theurgies.length; index++) {
            let element = theurgies[index];
            if (element.status == 1) {
               if (LyTheurgy.theRedPoint(element)) {
                    return true
               }
            }
        }
        return false
    }

    public static theRedPoint(element): boolean {
        let theRoot = LocaleData.getTheurgyRoot();
        let needUpItemProto =  LocaleData.getItemProto(theRoot.levelUpItemId)
        let canStatusNumber = 0
        if (element.level >= Number(theRoot.seal1Level)) {
            canStatusNumber = canStatusNumber + 1
        }
        if (element.level >= Number(theRoot.seal2Level)) {
            canStatusNumber = canStatusNumber + 1
        }
        let placeC = LyTheurgy.typeSealNumber(element.type)
        
        if (canStatusNumber != 0 && canStatusNumber != element.seal.length && placeC >= canStatusNumber) {
            return true
        }
        let pahasePorto = LocaleData.getTheurgPhase(Number(element.phase))
        if (GameServerData.getInstance().getTheurgyFragNumber(element.cfgId) >= Number(pahasePorto.fragAmount)) {
            return true
        }
        if (element.level < Number(pahasePorto.levelCap)) {
            let theLevelProto = LocaleData.getTheurgLevelByLevel(element.level);
            if (GameServerData.getInstance().getPlayerFullInfo().base.money >= theLevelProto.money && GameServerData.getInstance().getItemCountByProtoId(needUpItemProto.id) >= theLevelProto.amount) {
                return true
            }
        }
        return false
    }

    public static typeSealNumber(type): number{
        type = String(type)
        let placeC = 0
        let allSeal =  GameServerData.getInstance().getPlayerFullInfo().theurgyInfo.theurgySeal
        let sealattr = LocaleData.getTheurgTypeById(type).attr.split(",")
        for (let j = 0; j < allSeal.length; j++) {
            for (let i = 0; i < sealattr.length; i++) {
                if (allSeal[j].proto.sealAttr == sealattr[i]) {
                    if(allSeal[j].placeCount && allSeal[j].placeCount > 0){
                        placeC = placeC + allSeal[j].placeCount
                    }
                }
            }
        }
        return placeC
    }
}


