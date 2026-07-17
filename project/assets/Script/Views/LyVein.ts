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
import { MonthCardItemType, MonthCardType, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { VarVal } from "../Values/VarVal";
import { LyVeinSatori } from "./LyVeinSatori";
import { LyVeinChange } from "./LyVeinChange";
import { LyVeinAuto } from "./LyVeinAuto";
import { LyMainPage } from "./LyMainPage";
import { LyGuideDetail } from "./LyGuideDetail";
import { Color } from "cc";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { AudioManager } from "../Kernel/AudioManager";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { LyPayExquisite, PayExquisitePage } from "./LyPayExquisite";

export class LyVein extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyVein";
        this.viewResI.pkgName = "LyVein";
        this.viewResI.comName = "LyVein";
    }
    public static isStimulateTip: boolean = false
    public static stimulateAnimTime: number = 0
    public static veinAutoInfo: any = null
    private attGid : any 
    private list_mainArr: fgui.GList
    private list_errArr: fgui.GList
    private uiPanel:fgui.GComponent
    private group_viens: fgui.GComponent
    private label_nowDes: fgui.GLabel
    private group_needItem: fgui.GComponent
    private label_needItemCount: fgui.GLabel
    private btn_satori: fgui.GButton
    private btn_stimulate: fgui.GButton
    private btn_auto: fgui.GButton
    private pro_number: fgui.GProgressBar
    private label_lv: fgui.GLabel
    private veinXmlRoot: any
    private playInfo: any
    private gems: any
    private pendingGems: any
    private veinAttr: any
    private timulateSpineSke: SpinePlayer
    private autoBtnSpineSke: SpinePlayer
    private loader3D_autobtn: fgui.GLoader3D
    private group_add1: fgui.GComponent
    private group_add2: fgui.GComponent
    private label_money1: fgui.GLabel
    private label_money2: fgui.GLabel
    private veinInfoPop: fgui.GComponent
    private loader_dd: fgui.GLoader
    private stimuleAnim: boolean = false
    private basicAttrArr: number[] = [
        VarVal.ENTITIATTR.FINAL_HP,
        VarVal.ENTITIATTR.FINAL_ATTACK,
        VarVal.ENTITIATTR.FINAL_DEFENSE,
        VarVal.ENTITIATTR.FINAL_SPEED,
    ]
    private moreAttrArr: number[] = [
        VarVal.ENTITIATTR.CHANCE_COMBO,
        VarVal.ENTITIATTR.CHANCE_COUNTER,
        VarVal.ENTITIATTR.CHANCE_CRITICAL,
        VarVal.ENTITIATTR.CHANCE_MISS,
        VarVal.ENTITIATTR.CHANGE_VAMPIRE,
        VarVal.ENTITIATTR.CHANCE_VERTIGO,
        VarVal.ENTITIATTR.RESISTANCE_COMBO,
        VarVal.ENTITIATTR.RESISTANCE_COUNTER,
        VarVal.ENTITIATTR.RESISTANCE_CRITICAL,
        VarVal.ENTITIATTR.RESISTANCE_MISS,
        VarVal.ENTITIATTR.RESISTANCE_VAMPIRE,
        VarVal.ENTITIATTR.RESISTANCE_VERTIGO,
    ]

    public allAttr: number[] = [
        VarVal.ENTITIATTR.FINAL_HP,
        VarVal.ENTITIATTR.FINAL_ATTACK,
        VarVal.ENTITIATTR.FINAL_DEFENSE,
        VarVal.ENTITIATTR.FINAL_SPEED,
        VarVal.ENTITIATTR.CHANCE_COMBO,
        VarVal.ENTITIATTR.CHANCE_COUNTER,
        VarVal.ENTITIATTR.CHANCE_CRITICAL,
        VarVal.ENTITIATTR.CHANCE_MISS,
        VarVal.ENTITIATTR.CHANGE_VAMPIRE,
        VarVal.ENTITIATTR.CHANCE_VERTIGO,
        VarVal.ENTITIATTR.RESISTANCE_COMBO,
        VarVal.ENTITIATTR.RESISTANCE_COUNTER,
        VarVal.ENTITIATTR.RESISTANCE_CRITICAL,
        VarVal.ENTITIATTR.RESISTANCE_MISS,
        VarVal.ENTITIATTR.RESISTANCE_VAMPIRE,
        VarVal.ENTITIATTR.RESISTANCE_VERTIGO,
    ]
    public onViewCreate(_params:any): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        const btn_back = this.getUiPanel().getChild("btn_back", fgui.GButton)
        btn_back.text = ""
        btn_back.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyVein, 0, null)
        });
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {berakVeinAuto: true})
        this.uiPanel = this.getUiPanel().getChild("main");
        UtilsUI.playCommonGroupAni(this.uiPanel, null);
        this.veinInfoPop = fgui.UIPackage.createObject("CCommon", "Group_Vein").asCom
        let btn_close = this.uiPanel.getChild("btn_close")
        let label_title = this.uiPanel.getChild("label_title")
        this.list_mainArr = this.uiPanel.getChild("list_mainArr")
        this.list_errArr = this.uiPanel.getChild("list_errArr")
        this.group_viens = this.uiPanel.getChild("group_viens")
        this.label_nowDes = this.uiPanel.getChild("label_nowDes")
        this.group_needItem = this.uiPanel.getChild("group_needItem")
        this.label_needItemCount = this.group_needItem.getChild("label_number")
        this.btn_satori = this.uiPanel.getChild("btn_satori")
        this.btn_stimulate = this.uiPanel.getChild("btn_stimulate")
        this.btn_stimulate.text = StrVal.LYVEIN.STR10
        this.btn_auto = this.uiPanel.getChild("btn_auto")
        this.pro_number = this.uiPanel.getChild("pro")
        label_title.text = StrVal.LYVEIN.STR1
        this.label_lv = this.uiPanel.getChild("label_lv")
        this.loader_dd = this.uiPanel.getChild("loader_dd")
        this.group_add1 = this.uiPanel.getChild("group_add1")
        this.group_add2 = this.uiPanel.getChild("group_add2")


        this.veinXmlRoot = LocaleData.getVeinRoot()
        this.group_add1.getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}",[ LocaleData.getItemProto(this.veinXmlRoot.exciteItemId).icon ])
        this.group_add1.getChild("btn_add", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.veinXmlRoot.exciteItemId, "1"), buyCall:() => {
                this.refreshNeedItemCount()
            }});
        })
        this.label_money1 = this.group_add1.getChild("label_number")

        this.group_add2.getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(this.veinXmlRoot.learnItemId).icon]);
        this.group_add2.getChild("btn_add", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.veinXmlRoot.learnItemId, "1"), buyCall:() => {
                this.refreshNeedItemCount()
            }});
        })
        this.label_money2 = this.group_add2.getChild("label_number")

        btn_close.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyVein, 0, null)
        })
        this.btn_satori.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyVeinSatori, 0, null)
        });
        PointRedData.getInstance().registerPoint(this.btn_satori, PointRedType.LyVeinSatori);
        (this.uiPanel.getChild("btn_what") as fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:StrVal.LYVEIN.STR5, detail: this.veinXmlRoot.gameplayGuide});
        });

        for (let index = 0; index < this.group_viens.numChildren; index++) {
            let soltproto = LocaleData.getVeinSoltById(index + 1);
            let child: fgui.GComponent = this.group_viens.getChildAt(index);
            child.alpha = 0.7
            child.getChild("label_name", fgui.GLabel).text = soltproto.name
        }

        let loader3D_weirao = this.uiPanel.getChild("loader3D_weirao", fgui.GLoader3D);
        // PlatformAPI.loadSpine((asset:any)=> {
        //     if (loader3D_weirao && !loader3D_weirao.isDisposed) {
        //         loader3D_weirao.setScale(1, 1);
        //         // 底居中
        //         loader3D_weirao.setSpine(asset, new Vec2(0.5, 1));
        //         // let 
        //         let spineSke =(<sp.Skeleton>loader3D_weirao.content)
        //         spineSke.setAnimation(0, VarVal.SPINE_ANI_NAME.stand, true);
        //     }
        // }, "jm_xiuxing_qx")

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, loader3D_weirao, "jm_xiuxing_qx");

        // let loader3D_stimulate = this.uiPanel.getChild("loader3D_stimulate", fgui.GLoader3D);

        let loader3D_zhuzi = this.uiPanel.getChild("loader3D_zhuzi", fgui.GLoader3D);
        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, loader3D_zhuzi, "jm_xiuxing_zx");

        this.loader3D_autobtn = this.uiPanel.getChild("loader3D_autobtn", fgui.GLoader3D);
        this.autoBtnSpineSke = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            this.loader3D_autobtn.visible = false
            spp.clearTracks()
            if (LyVein.veinAutoInfo) {
                this.loader3D_autobtn.visible = true
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }
        }, this.uiPanel.getChild("loader3D_autobtn", fgui.GLoader3D), "jm_xiuxing_zd");
        let loader3D_guang = this.uiPanel.getChild("loader3D_guang", fgui.GLoader3D);

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, loader3D_guang, "jm_xiuxing_g");

        let loader_item: fgui.GLoader = this.group_needItem.getChild("loader_item")
        loader_item.url = UtilsTool.stringFormat("ui://CCommon/{0}",[LocaleData.getItemProto(this.veinXmlRoot.exciteItemId).icon]) 
        this.loadInfoData()
        this.refreshNeedItemCount()
        this.refrehGam()
       
        this.label_nowDes.text = UtilsTool.stringFormat(StrVal.LYVEIN.STR2, [this.playInfo.veinInfo.veinLevel])
        // this.list_mainArr.itemProvider = ():string =>{
        //     return "ui://LyVein/label_attr(1)"
        // }
        this.list_mainArr.itemProvider = ():string =>{
            return "ui://LyVein/label_attr"
        }
        this.list_mainArr.itemRenderer = ((index: number, obj: fgui.GComponent)=>{
      
            obj.getChild("label_txt").text = UtilsTool.stringFormat("{0}", [StrVal.ENTITI_NAMES[this.basicAttrArr[index]]]) 
            obj.getChild("label_number").text = UtilsTool.stringFormat("+{0}", [ UtilsTool.nToFStr(this.veinAttr[index])])
        }).bind(this)
         
        this.list_mainArr.numItems = this.basicAttrArr.length

        this.list_errArr.itemProvider = ():string =>{
            return "ui://LyVein/label_attr"
        }
        this.list_errArr.itemRenderer =  ((index: number, obj: fgui.GComponent)=>{
            let str: string = UtilsTool.stringFormat(StrVal.LYVEIN.STR32, [StrVal.ENTITI_NAMES[this.moreAttrArr[index]], UtilsTool.nToFStr(this.veinAttr[index + 4])])
            obj.getChild("label_txt").text = str
        }).bind(this)
        this.list_errArr.numItems = this.moreAttrArr.length

        this.btn_stimulate.onClick(()=>{
            if (!this.stimuleAnim) {
                let itemNumber = GameServerData.getInstance().getItemCountByProtoId(this.veinXmlRoot.learnItemId)
                if (itemNumber > 0) {
                    if (LyVein.isStimulateTip) {
                        this.veinExciteFun()
                    }else {
                        UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                        StrVal.LYVEIN.STR24, null,
                        StrVal.LYVEIN.STR25, (isCheckSel: boolean)=>{
                            LyVein.isStimulateTip = isCheckSel;
                            this.veinExciteFun()
                        },
                        StrVal.LYVEIN.STR26, (isCheckSel: boolean) => {
                            LyVein.isStimulateTip = isCheckSel;
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyVeinSatori, 0, null)
                        }, "", ()=>{} , {
                            checkBoxText: StrVal.COMMON.STR35
                        })
                    }
                }else {
                    this.veinExciteFun()
                }
            }else {
                this.breakAuto()
            }
        })
        PointRedData.getInstance().registerPoint(this.btn_stimulate, PointRedType.LyVeinStimule);


        this.btn_auto.onClick(()=>{
            this.breakAuto()
            if (GameServerData.getInstance().getItemCountByProtoId(this.veinXmlRoot.exciteItemId) > 0)  {
                if (this.playInfo.base.phase >= Number(this.veinXmlRoot.autoExcitePlayerPhase)) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyVeinAuto, 0, null)
                }else{
                    let levelData = LocaleData.getPlayerPhaseById(this.veinXmlRoot.autoExcitePlayerPhase)
                    if (PlatformAPI.isBinaryExamine()) {
                        UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYVEIN.STR34, [levelData.name]))
                    }else{
                        let openData = UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.vein_auto);
                        if (openData) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyVeinAuto, 0, null)
                        }else{
                            UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYVEIN.STR23, [levelData.name]))
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.MONTHCARD, type: MonthCardType.Life});
                        }
                    }
                }
            }else{
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.veinXmlRoot.exciteItemId, "1"), buyCall:() => {
                    this.loadInfoData()
                    this.refreshNeedItemCount()
                }});
            }
        })

        this.loader_dd.onClick(()=>{
            if (this.pendingGems.length > 0) {
                this.openVeinChange()
            }
        });

        this.timulateSpineSke = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            // this.timulateSpineSke.playAnimation(VarVal.SPINE_ANI_NAME.stand, false, 0, null, ()=>{
                
            //     // this.stimuleAnim = false
              
            // })
            spp.clearTracks()
            LyVein.stimulateAnimTime = spp.getSpineSke().findAnimation((spp.getSpineSke()._skeleton.data.animations[0].name)).duration

            //tmd 新增 如果处于自动状态 切没有暂停自动
            if (LyVein.veinAutoInfo) {
                spp.setTimeScale(LyVein.veinAutoInfo.speed)
                if (this.pendingGems.length > 0) {
                    // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyVein, 0, { isAutoStateChange: true })
                    this.loader_dd.url = ""
                    this.doExciteAnim(()=>{
                        if (LyVein.onReachVein(this.pendingGems[0])) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyVeinChange, 0, null);
                        } else {
                            UtilsUI.lockWait()
                            GameServer.getInstance().send((args: any) => {
                                UtilsUI.unlockWait()
                                if (args.errorcode == 0) {
                                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyVein, 0, { isRefresVein: true })
                                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { veinStartAuto: true })
                                } else {
                                    UtilsUI.showMsgTip(args.errorcode)
                                }
                            }, "discardGems", {
                                gemsIds: [this.pendingGems[0].eid]
                            })
                        }
                    })
                }else{
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { veinStartAuto: true })
                }
            }
        }, this.uiPanel.getChild("loader3D_stimulate", fgui.GLoader3D), "jm_xiuxing_cq");

    }

    private pendingGemUI(){
        if (this.pendingGems.length > 0) {
            this.loader_dd.visible = true
            if (this.pendingGems[0].setId != 0) {
                let buffProto = LocaleData.getVeinAttrSetById(this.pendingGems[0].setId)
                this.loader_dd.url = UtilsTool.stringFormat("ui://LyVein/{0}{1}", [buffProto.icon, this.pendingGems[0].quality]);
            }else{
                let soltProto = LocaleData.getVeinSoltByen(this.pendingGems[0].slot)
                this.loader_dd.url = UtilsTool.stringFormat("ui://LyVein/{0}{1}", [soltProto.icon, this.pendingGems[0].quality]);
            }
        }else {
            this.loader_dd.visible = false
            this.loader_dd.url = ""
        }
    }

    private breakAuto() {
        this.refrehPage()
        this.loader3D_autobtn.visible = false
        this.autoBtnSpineSke.clearTracks()
        LyVein.veinAutoInfo = null
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { berakVeinAuto: true})
    }
    

    private openVeinChange() {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyVeinChange, 0, null)
    }

    private veinExciteFun() {
        if (this.pendingGems != undefined && this.pendingGems.length > 0) {
           this.openVeinChange()
        }else{
            if (LyVein.veinAutoInfo) {
                this.breakAuto()
            }else{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        // this.refreshNeedItemCount()
                        this.doExciteAnim(()=>{
                            this.loadInfoData()
                            this.refrehPage()
                            this.openVeinChange()
                        })
                    } else {
                        if (GameServerData.getInstance().getItemCountByProtoId(this.veinXmlRoot.exciteItemId) > 0) {
                            UtilsUI.showMsgTip(args.errorcode)
                        }else{
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.veinXmlRoot.exciteItemId, "1"), buyCall:() => {
                                this.loadInfoData()
                                this.refreshNeedItemCount()
                            }});
                        }
                        this.breakAuto()
                    }
                } , "veinExcite", {count: 1})
            }
        }
    }


    private loadInfoData(): void{
       this.playInfo = GameServerData.getInstance().getPlayerFullInfo()
       this.veinAttr = this.playInfo.veinInfo.attrs
       this.gems = this.playInfo.veinInfo.battleGems
       this.pendingGems = this.playInfo.veinInfo.pendingGems
    }

    private showVeinPop(gem:any, child:fgui.GComponent, soltproto){
        let mGCom = this.veinInfoPop
        let label_name: fgui.GTextField =  mGCom.getChild("label_name")
        label_name.text = LocaleData.getVeinQua()[gem.quality - 1].name + soltproto.name
        label_name.strokeColor = UtilsUI.getQualityColor(gem.quality);
        let battleAttrs = gem.attrs.split(",")
        let attr = []
        let attrIndex = []
        for (let index = 0; index < battleAttrs.length; index++) {
            if (Number(battleAttrs[index]) > 0) {
                attr.push(battleAttrs[index])
                attrIndex.push(index)
            }
        }
        for (let i = 0; i < attr.length; i++) {
            let xh = attrIndex[i] < 4 ? "" : "%";
            attr[i]= attrIndex[i] < 4 ? Math.floor(Number(attr[i])) : attr[i]
            mGCom.getChild("label_name"+ (i+1), fgui.GLabel).text = StrVal.ENTITI_NAMES[this.allAttr[attrIndex[i]]] 
            mGCom.getChild("label_num"+ (i+1), fgui.GLabel).text = "+" + attr[i] + xh
        }

        if (attr.length != 4) {
            //解锁等级
            for (let index = attr.length; index < 4; index++) {
                let level = LocaleData.getVeinAttrNumber(index + 1).level
                mGCom.getChild("label_name"+ (index + 1), fgui.GLabel).text = "?"
                mGCom.getChild("label_num"+ (index + 1), fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYVEIN.STR33, [level]);
            }
        }

        let zuheCount = this.getGemZuheNumber(gem.setId).length
        let Loader_icon = mGCom.getChild("Loader_icon", fgui.GLoader)
        if (zuheCount > 0) {
           let c1 = mGCom.getController("c1")
           c1.selectedIndex = 1
           let buffProto =  LocaleData.getVeinAttrSetById(gem.setId)
           let skillIDs = buffProto.skillId.split(",")
           for (let index = 0; index < 4; index++) {
               let skill = LocaleData.getSkillProto(skillIDs[index])
               let label_buffName: fgui.GTextField =  mGCom.getChild("label_buffName" + (index + 1))
               let label_buffDes: fgui.GTextField =  mGCom.getChild("label_buffDes" + (index + 1))
               if (zuheCount == index + 1) {
                   label_buffName.color = new Color(43,132,28)
                   label_buffDes.color = new Color(43,132,28)
               }else{
                   label_buffName.color = new Color(22,25,26)
                   label_buffDes.color = new Color(22,25,26)
               }
               label_buffName.text = buffProto.name
               label_buffDes.text = skill.desc  + "  (" + (index + 1) + "/"+ (index+1) + ")";
           }
           Loader_icon.url = UtilsTool.stringFormat("ui://LyVein/{0}{1}", [buffProto.icon, gem.quality]) 
        }else{
            Loader_icon.url = UtilsTool.stringFormat("ui://LyVein/{0}{1}", [soltproto.icon, gem.quality]) 
        }
        let Loader_qu: fgui.GLoader = mGCom.getChild("loader_qua")
        Loader_qu.url =   UtilsTool.stringFormat("ui://CCommon/frame_{0}_title", [gem.quality])
      
        mGCom.getChild("label_grade").text = UtilsTool.stringFormat(StrVal.LYVEIN.STR3, [gem.level]) 
        UtilsUI.showPopup(mGCom, child)
    }

    private refrehGam(): void{
        let tz: any[] = []
        for (let index = 0; index < this.gems.length; index++) {
           let gem = this.gems[index]
           let soltproto = LocaleData.getVeinSoltByen(gem.slot)
           let child: fgui.GComponent =  this.group_viens.getChildAt(soltproto.id - 1)
           child.alpha = 1
           let groupLevel = child.getChild("n60", fgui.GGroup)
           if (groupLevel) {
                groupLevel.visible = true
           }
           let loader_vein: fgui.GLoader = child.getChild("loader_gem")
       
           let spineEff = child.getChild("effect", fgui.GLoader3D)
           if (this.attGid && this.attGid == gem.gid) {
            
            let spinePlayer2 = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                spp.playAnimation("animation", false, 0, null, ()=>{
                    spineEff.freeSpine()
                    this.attGid = null
                });
            }, spineEff, "jm_xiuxing_shangzheng")
           }


           loader_vein.url = UtilsTool.stringFormat("ui://LyVein/{0}{1}", [soltproto.icon, gem.quality]) 
           let label_grade: fgui.GLabel = child.getChild("label_level")
           label_grade.text = gem.level
           if (gem.setId != 0) {
                let have = false
                for (let index = 0; index < tz.length; index++) {
                    let element = tz[index];
                    if (element.id == gem.setId) {
                        element.num = element.num + 1
                        have = true
                    }
                }
                if (!have) {
                   let data = { id:gem.setId, num: 1 }
                   tz.push(data)
                }
            let buffProto = LocaleData.getVeinAttrSetById(gem.setId)
            loader_vein.url = UtilsTool.stringFormat("ui://LyVein/{0}{1}", [buffProto.icon, gem.quality]) 
           }else{
            loader_vein.url = UtilsTool.stringFormat("ui://LyVein/{0}{1}", [soltproto.icon, gem.quality]) 
           }
           child.clearClick()
           child.onClick(()=>{
                this.showVeinPop(gem, child, soltproto)
           })
        }
        this.list_mainArr.numItems = this.basicAttrArr.length
        this.list_errArr.numItems = this.moreAttrArr.length

        for (let index = 0; index < 4; index++) {
            let label_zhuhe: fgui.GLabel = this.uiPanel.getChild("label_zuhe"+ index)
            label_zhuhe.visible = false
           if (index < tz.length) {
                let artSet =  LocaleData.getVeinAttrSetById(tz[index].id)
                label_zhuhe.visible = true
                label_zhuhe.text = artSet.name + " (" + tz[index].num + ")"
                label_zhuhe.clearClick()
                label_zhuhe.onClick(()=>{
                let gems = this.getGemZuheNumber(tz[index].id).sort((a, b)=>{
                    return  b.quality - a.quality
                })
                let soltproto = LocaleData.getVeinSoltByen(gems[0].slot)
                this.showVeinPop(gems[0], label_zhuhe, soltproto)
                }, this)
           }
        }
        this.pendingGemUI()
    }

    //获取组合数量
    private getGemZuheNumber(zuheId): Array<any> {
        let typeGem = []
        for (let index = 0; index < this.gems.length; index++) {
            let gem = this.gems[index]
            if (gem.setId != 0 && gem.setId == zuheId) {
                typeGem.push(gem)
            }
        }
        return typeGem
    }
    private refreshNeedItemCount(): void{
        this.label_lv.text = UtilsTool.stringFormat(StrVal.LYVEIN.STR11, [this.playInfo.veinInfo.veinLevel])
        this.label_nowDes.text = UtilsTool.stringFormat(StrVal.LYVEIN.STR2, [this.playInfo.veinInfo.veinLevel])
        let itemNumber = GameServerData.getInstance().getItemCountByProtoId(this.veinXmlRoot.exciteItemId)
        UtilsUI.setNeedItemGroup(this.group_needItem, UtilsTool.stringFormat("ui://CCommon/{0}",[LocaleData.getItemProto(this.veinXmlRoot.exciteItemId).icon]), itemNumber, 1)
        this.pro_number.max  = Number(LocaleData.getVeinLevel(this.playInfo.veinInfo.veinLevel).exp) 
        this.pro_number.value = this.playInfo.veinInfo.veinExp
        this.label_money1.text = String(itemNumber) 
        this.label_money2.text = String(GameServerData.getInstance().getItemCountByProtoId(this.veinXmlRoot.learnItemId)) 
    }
    
    private doExciteAnim(callBack?){
        this.stimuleAnim = true
        if (this.timulateSpineSke) {
            this.timulateSpineSke.playAnimation(VarVal.SPINE_ANI_NAME.stand, false, 0, null, ()=>{
                if (callBack) {
                    callBack()
                }
                this.stimuleAnim = false
            })
            
        }else{
            
           
        }
    }

    private refrehPage(): void{
        this.loadInfoData()
        this.refrehGam()
        this.refreshNeedItemCount()
    }


    public onViewUpdate(params: any): void {
        if (params) {
            if(params.isAutoExciteAnim){
                if (!this.stimuleAnim) {
                    this.doExciteAnim()
                }
            }

            if (params.isRefresVein) {
                this.attGid = params.attGid
                this.refrehPage()
            }

            // if (params.autoStateChange) {
            //     if (LyVein.veinAutoInfo) {
            //         //存在灵脉自动数据
            //         this.loader3D_autobtn.visible = true
            //         this.autoBtnSpineSke.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            //         if (this.timulateSpineSke) {
            //             this.timulateSpineSke.setTimeScale(LyVein.veinAutoInfo.speed)
            //         }else{
            //             this.timulateSpineSke.setTimeScale(1)
            //         } 
            //     }else{
            //         this.autoBtnSpineSke.clearTracks()
            //         this.breakAuto()
            //     }
            // }
            if (params.isAutoStateChange == 0 || params.isAutoStateChange == 1) {
                if (LyVein.veinAutoInfo) {
                    //存在灵脉自动数据
                    this.loader3D_autobtn.visible = true
                    this.autoBtnSpineSke.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                    if (this.timulateSpineSke) {
                        this.timulateSpineSke.setTimeScale(LyVein.veinAutoInfo.speed)
                    }
                }else{
                    this.breakAuto()
                    if (this.timulateSpineSke) {
                        this.timulateSpineSke.setTimeScale(1)
                    }
                }

                if (params.isAutoStateChange == 0) {
                    //关闭

                }else{
                    //开启
                }
            }
        }
        
    }

    public onViewDestroy(): void {
        // 关闭界面 动画回调被打断
        // if (this.mainPageCallBack && this.stimuleAnim && this.autoData) {
        //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateVeinAutomation: true, automationVeinData: this.autoData, spineAutoBreak: true})
        // }
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {upShowUi:true});
    }

    public getIsViewMask(): boolean {
        return false;
    };

    public static isViewRedPointStimule(): boolean{
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.gem)) {
            return false
        }
        let veinXmlRoot = LocaleData.getVeinRoot()
        return  GameServerData.getInstance().getItemCountByProtoId(veinXmlRoot.exciteItemId) > 0
    }

    public static onReachVein(pendingGem): boolean {
        let isOpen: boolean = false
        if (LyVein.veinAutoInfo) {
            let battleAttrs: string[] = pendingGem.attrs.split(",")
            if (pendingGem.quality >= LyVein.veinAutoInfo.quality) {//品阶大X
                isOpen = true
                let power = false
                let isAtt = false
                let isBuffMz = false
                if (LyVein.veinAutoInfo.combatPower) {
                    power = pendingGem.diffCombatPower > 0
                }
                if ((LyVein.veinAutoInfo.attr.battleAttr == "-1" || battleAttrs[LyVein.veinAutoInfo.attr.battleAttr] != "0")
                    && (LyVein.veinAutoInfo.attr.defenseAttr == "-1" || battleAttrs[LyVein.veinAutoInfo.attr.defenseAttr] != "0")) {
                    isAtt = true
                }
                if (LyVein.veinAutoInfo.buff == pendingGem.setId) {
                    isBuffMz = true
                }
                //同时
                if (LyVein.veinAutoInfo.isAnd == 1) {
                    if (LyVein.veinAutoInfo.combatPower && LyVein.veinAutoInfo.isAttr1 && isAtt && power) {
                        isOpen = true
                    } else {
                        isOpen = false
                    }
                    //或
                } else if (LyVein.veinAutoInfo.isAnd == 0) {
                    if (LyVein.veinAutoInfo.combatPower && LyVein.veinAutoInfo.isAttr1 && (isAtt || power)) {
                        isOpen = true
                    } else {
                        isOpen = false
                    }
                } else {
                    if (LyVein.veinAutoInfo.combatPower) {
                        if (isOpen) {
                            isOpen = power
                        }
                    }
                    if (LyVein.veinAutoInfo.isAttr1) {
                        if (isOpen) {
                            isOpen = isAtt
                        }
                    }
                }
                if (LyVein.veinAutoInfo.isBuff) {
                    if (isOpen) {
                        isOpen = isBuffMz
                    }
                }
            }
        } else {
            isOpen = true
        }
        return isOpen
    }
   
}


