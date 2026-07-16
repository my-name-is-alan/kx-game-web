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
import { Color } from "cc";
import { LyEliteDraw } from "./LyEliteDraw";
import { LyEliteGroup } from "./LyEliteGroup";
import { GComponent } from "fairygui-cc/GComponent";
import { LyEliteInfo } from "./LyEliteInfo";
import { LyGuideDetail } from "./LyGuideDetail";
import { LyMainPage } from "./LyMainPage";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { AudioManager } from "../Kernel/AudioManager";


export class LyEliteMonster extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyEliteMonster";
    }
    public static isSkipPlayAni: boolean;
    private uiPanel:fgui.GComponent
    private spineLoaderArr: fgui.GLoader3D[] = []
    private spineLoaderEffectArr: fgui.GLoader3D[] = []
    private imgLoaderArr: fgui.GLoader[] = []

    private btn_changeTeam: fgui.GButton
    private btn_editTeam: fgui.GButton
    private btn_close: fgui.GButton
 
    private list_mainArr: fgui.GList
    private list_errArr: fgui.GList
    private list_allEditMo: fgui.GList
    private btn_darwCard: fgui.GButton
    private btn_resonance: fgui.GButton
    private label_number: fgui.GLabel

    //数据
    private upTeamId: number
    private eliteMosterTeam: any
    private elitemonsterInfo: any
    private playerbase: any
    private emAttr: Array<any> = []
    private ownNumber: number
    private monstersData: Array<any> = []
    private UNLOCK_MAX = 1

    private basicAttrArr: number[] = [
        VarVal.ENTITIATTR.FINAL_HP,
        VarVal.ENTITIATTR.FINAL_ATTACK,
        VarVal.ENTITIATTR.FINAL_DEFENSE,
        VarVal.ENTITIATTR.FINAL_SPEED,
    ]
    private moreAttrArr: number[] = [
        // VarVal.ENTITIATTR.ATTACK,
        // VarVal.ENTITIATTR.HEALTH,
        // VarVal.ENTITIATTR.DEFENSE,
        // VarVal.ENTITIATTR.ATTACK,
        VarVal.ENTITIATTR.CHANCE_VERTIGO,
        VarVal.ENTITIATTR.CHANCE_CRITICAL,
        VarVal.ENTITIATTR.CHANCE_COMBO,
        VarVal.ENTITIATTR.CHANCE_MISS,
        VarVal.ENTITIATTR.CHANCE_COUNTER,
        VarVal.ENTITIATTR.CHANGE_VAMPIRE,
        VarVal.ENTITIATTR.RESISTANCE_VERTIGO,
        VarVal.ENTITIATTR.RESISTANCE_CRITICAL,
        VarVal.ENTITIATTR.RESISTANCE_COMBO,
        VarVal.ENTITIATTR.RESISTANCE_MISS,
        VarVal.ENTITIATTR.RESISTANCE_COUNTER,
        VarVal.ENTITIATTR.RESISTANCE_VAMPIRE,
        VarVal.ENTITIATTR.FINAL_ADD_DAMADE,
        VarVal.ENTITIATTR.FINAL_REDUCE_DAMADE,
        VarVal.ENTITIATTR.ENHANCE_CIRTIAL,
        VarVal.ENTITIATTR.ENHANCE_HEALING,
        VarVal.ENTITIATTR.WEAKNESS_HEALING,
        VarVal.ENTITIATTR.ENHANCE_SPIRIT_PET,
        VarVal.ENTITIATTR.WEAKNESS_SPIRIT_PET,
        VarVal.ENTITIATTR.ENHANCE_MAGIC,
        VarVal.ENTITIATTR.IGNORE_BATTLE_ATTR,
        VarVal.ENTITIATTR.IGNORE_BATTLE_RESISTANCE,
        VarVal.ENTITIATTR.WEAKNESS_MAGIC,
    ]
    public onViewCreate(_params:any): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        this.getUiPanel().getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteMonster, 0, null)
        });
        this.uiPanel = this.getUiPanel().getChild("group_main")

        if (LyEliteMonster.isSkipPlayAni) {
            LyEliteMonster.isSkipPlayAni = false;
        }else{
            UtilsUI.playCommonGroupAni(this.uiPanel, null)
        }

        let btn_close = this.uiPanel.getChild("btn_close")
        let label_title = this.uiPanel.getChild("label_title")
        this.list_mainArr = this.uiPanel.getChild("list_mainArr")
        this.list_errArr = this.uiPanel.getChild("list_errArr")
        this.list_allEditMo = this.uiPanel.getChild("list_allEditMo")

        this.btn_editTeam = this.uiPanel.getChild("btn_editTeam")
        this.btn_darwCard = this.uiPanel.getChild("btn_darwCard")
        this.btn_resonance = this.uiPanel.getChild("btn_resonance")
        this.btn_changeTeam = this.uiPanel.getChild("btn_changeTeam");
        this.label_number = this.uiPanel.getChild("label_number");
       
        (<fgui.GTextField>this.uiPanel.getChild("label_de2")).text =  StrVal.LYELITEMONSTER.STR32;
        this.btn_changeTeam.onClick(()=>{
            this.refrehChooseTeam()
        });
       
        this.btn_editTeam.onClick(()=>{
            this.refrehChooseHero()
        })
        label_title.text = StrVal.LYELITEMONSTER.STR1
        btn_close.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteMonster, 0, null)
        })

        for (let index = 0; index < 3; index++) {
            let lader3D: fgui.GLoader3D
            lader3D = this.uiPanel.getChild("loader_on"+ index)
            this.spineLoaderArr.push(lader3D)
            this.spineLoaderEffectArr.push(this.uiPanel.getChild("loader_spine"+ index))
            // lader3D.onClick(()=>{
            //     let pos = index
            //     let element = this.eliteMosterTeam[pos];
            //     if (element != 0) {
            //         let mosterData = this.getMonsetInfoData(element)
            //          ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteInfo, 0,{ info:mosterData , allData: this.monstersData })
                    
            //     }
            // })    
            let loader_img: fgui.GLoader = this.uiPanel.getChild("loader_img" + index)        
            this.imgLoaderArr.push(loader_img)
        }

        this.btn_editTeam.title = StrVal.LYELITEMONSTER.STR5
        this.btn_darwCard.title = StrVal.LYELITEMONSTER.STR2
        this.btn_resonance.title = StrVal.LYELITEMONSTER.STR3
        this.btn_changeTeam.title = StrVal.LYELITEMONSTER.STR4
        this.btn_darwCard.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteDraw, 0, null)
        })
        PointRedData.getInstance().registerPoint(this.btn_darwCard, PointRedType.LyEliteMonsterDraw)

        this.btn_resonance.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteGroup, 0, null)
        })
        PointRedData.getInstance().registerPoint(this.btn_resonance, PointRedType.LyEliteMonsterGroup)

        this.list_allEditMo.itemProvider = ():string =>{
            return "ui://LyEliteMonster/btn_eliteM"
        }
        this.list_allEditMo.setVirtual()
        this.list_allEditMo.itemRenderer = ((index: number, child: fgui.GComponent)=>{
            let mosterData = this.monstersData[index];
            (<fgui.GLoader>child.getChild("laoder_qua")).url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [Number(mosterData.proto.quality)]);
            let laoder_icon:fgui.GLoader = child.getChild("laoder_icon");
            laoder_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [mosterData.modelShowInfo.icon_square]);
            let label_grade: fgui.GLabel = child.getChild("label_grade");
            let group_grade: fgui.GGroup = child.getChild("group_grade")
            let pro_suip: fgui.GProgressBar = child.getChild("pro_suip");
            if (mosterData.own) {
                group_grade.visible = true
                label_grade.text =  UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [mosterData.own.level]);  
                pro_suip.max = mosterData.needNumber
            }else {
                group_grade.visible = false
                pro_suip.max = mosterData.needNumber
            }
            PointRedData.getInstance().updateManualPoint(child, mosterData.ownDebr >= mosterData.needNumber)
            pro_suip.value = mosterData.ownDebr;
            (<fgui.GLabel>child.getChild("label_suip")).text = UtilsTool.stringFormat("{0}/{1}",[ pro_suip.value, pro_suip.max]);
            label_grade.visible = mosterData.own ? true : false; 
            laoder_icon.grayed = mosterData.own ? false : true; 
            child.getChild("img_up").visible = mosterData.inTeam
        }).bind(this)
        this.list_allEditMo.on(fgui.Event.CLICK_ITEM, (onClickitem: GComponent)=>{
            let childIndex = this.list_allEditMo.childIndexToItemIndex(this.list_allEditMo.getChildIndex(onClickitem))
            let mosterData = this.monstersData[childIndex];
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteInfo, 0, { info:mosterData , allData: this.monstersData, index: childIndex })
        }, this)
        this.list_mainArr.itemProvider = ():string =>{
            return "ui://LyEliteMonster/group_infoArr"
        }
        let color = [
            new Color(111, 153, 104),
            new Color(204, 84, 84),
            new Color(73, 121, 152),
            new Color(207, 138, 152),
        ]
        this.list_mainArr.itemRenderer = ((index: number, obj: fgui.GComponent)=>{
            let str: string = UtilsTool.stringFormat("{0}+{1}%", [StrVal.ENTITI_NAMES[this.basicAttrArr[index]], UtilsTool.getBigNumToUnit(this.emAttr[index])])
            let title: fgui.GTextField =  obj.getChild("title")
            title.text = str
            title.color = color[index]
        }).bind(this)
        
        this.list_errArr.itemProvider = ():string =>{
            return "ui://LyEliteMonster/group_infoArr2"
        }
        this.list_errArr.itemRenderer =  ((index: number, obj: fgui.GComponent)=>{
            let title:fgui.GTextField = obj.getChild("title")
            if (StrVal.ENTITI_NAMES[this.moreAttrArr[index]].length > 4) {
                title.fontSize = 14
            }else {
                title.fontSize = 18
            }
            let str: string = UtilsTool.stringFormat("{0} +{1}%", [StrVal.ENTITI_NAMES[this.moreAttrArr[index]], UtilsTool.getBigNumToUnit(this.emAttr[index + 4])])
            title.text = str
        }).bind(this)
        

        this.loadInfoData();
        this.initData();
        this.refrehPage()
        // this.list_errArr.numItems = this.moreAttrArr.length
        // this.list_mainArr.numItems = this.basicAttrArr.length
        //     for (let index = 0; index < 3; index++) {
        //         let element = this.eliteMosterTeam[index];
        //         if (String(element) != "0") {
        //             let own = this.getMonsetInfoData(element)
        //             this.onLoadSpine(own.proto.modelId, index);
        //             this.imgLoaderArr[index].visible = false
        //         }else{
        //             this.spineLoaderArr[index].freeSpine();
        //             this.imgLoaderArr[index].visible = true
        //         }
        //     }
        // this.setTimeout(()=>{
        //     this.list_allEditMo.numItems = this.monstersData.length
        //     // for (var i: number = 0; i < this.monstersData.length; i++) {
        //     //     let item  this.list_allEditMo.getChildAt(i);
        //     //     if (this.list_allEditMo.isChildInView(item)) {
        //     //         item.playEffect(delay);
        //     //         delay += 0.2;
        //     //     }
        //     //     else
        //     //         break;
        //     // }
        // },100);
        // this.list_allEditMo.numItems = this.monstersData.length
        // this.list_errArr.numItems = this.moreAttrArr.length
        // this.list_mainArr.numItems = this.basicAttrArr.length
        // for (let index = 0; index < 3; index++) {
        //     let element = this.eliteMosterTeam[index];
        //     if (String(element) != "0") {
        //         let own = this.getMonsetInfoData(element)
        //         this.onLoadSpine(own.proto.modelId, index);
        //         this.imgLoaderArr[index].visible = false
        //     }else{
        //         this.spineLoaderArr[index].freeSpine()
        //         this.imgLoaderArr[index].visible = true
        //     }
        // }
        this.label_number.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR31, [this.ownNumber, this.monstersData.length])

        let root = LocaleData.getEliteMonsterRoot()
        this.imgLoaderArr[0].onClick(()=>{
            if (String(this.eliteMosterTeam[0]) != "0") {
                let data = this.getMonsetInfoData(this.eliteMosterTeam[0])
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteInfo, 0, { info:data , allData: this.monstersData, index: 1 })
            }else {
                this.refrehChooseHero()
            }
        });
        if (this.playerbase.level >= Number(root.unlockPosition2)) {
            this.UNLOCK_MAX = this.UNLOCK_MAX + 1
            this.imgLoaderArr[1].onClick(()=>{
                // UtilsUI.showMsgTip( UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR44, [root.unlockPosition2]))
                if (String(this.eliteMosterTeam[1]) != "0") {
                    let data = this.getMonsetInfoData(this.eliteMosterTeam[1])
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteInfo, 0, { info:data , allData: this.monstersData, index: 1 })
                }else {
                    this.refrehChooseHero()
                }
            });
        }else{
            this.imgLoaderArr[1].onClick(()=>{
                UtilsUI.showMsgTip( UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR44, [root.unlockPosition2]))
            });
        }
        if (this.playerbase.level >= Number(root.unlockPosition3)) {
            this.UNLOCK_MAX = this.UNLOCK_MAX + 1
            this.imgLoaderArr[2].onClick(()=>{
                if (String(this.eliteMosterTeam[2]) != "0") {
                    let data = this.getMonsetInfoData(this.eliteMosterTeam[2])
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteInfo, 0, { info:data , allData: this.monstersData, index: 1 })
                }else {
                    this.refrehChooseHero()
                }
            });
        }else{
            this.imgLoaderArr[2].onClick(()=>{
                UtilsUI.showMsgTip( UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR44, [root.unlockPosition3]))
            });
        }
        this.imgLoaderArr[1].url = this.playerbase.level >= Number(root.unlockPosition2)? "ui://LyEliteMonster/btn_add" : "ui://LyEliteMonster/btn_lock";
        this.imgLoaderArr[2].url = this.playerbase.level >= Number(root.unlockPosition3)? "ui://LyEliteMonster/btn_add" : "ui://LyEliteMonster/btn_lock";
        (<fgui.GButton>this.uiPanel.getChild("btn_what")).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:StrVal.LYELITEMONSTER.STR40, detail: root.detail });
        });
    }
    

    private initData(){
        this.ownNumber = 0
        let xmls = LocaleData.getEliteMonsterRoot()._elitemonster[0]._item
        this.monstersData = []
        xmls.forEach(monster => {
            let temp = {};
            let own = this.ownMonster(monster.id);
            temp["own"] = own
            temp["ownDebr"] = this.ownMonsterDebrisCount(monster.debris_id);
            temp["proto"] = monster;
            if (own) {
                this.ownNumber = this.ownNumber + 1
                temp["needNumber"] = Number(LocaleData.getEliteMonsterLevel(monster.id, own.level).upgrade_cost) 
            }else{
                temp["needNumber"] = Number(monster.debris_count) 
            }
            temp["modelShowInfo"] =  LocaleData.getModelShowInfo(monster.modelId)
            temp["inTeam"] = false;
            this.monstersData.push(temp);
        });
        
        this.monstersData.sort((a: any, b: any): number =>{
            // 同时满碎片
            // let aneedNumber = 0
            // let bneedNumber = 0
            // if (a.own) {
            //     aaneedNumber
            // }else {
            //     aneedNumber = a.proto.debris_count
            // }
            // if (b.own) {
            //     bneedNumber = LocaleData.getEliteMonsterLevel(b.proto.id, b.own.level).upgrade_cost
            // }else {
            //     bneedNumber = b.proto.debris_count
            // }
            let afullSuip =  a.ownDebr >= a.needNumber? 2:1
            let bfullSuip =  b.ownDebr >= b.needNumber? 2:1
            if (afullSuip == bfullSuip && afullSuip == 2) {
                if (a.proto.quality == b.proto.quality) {
                    return Number(a.proto.id) - Number(b.proto.id)
                }else{
                    return Number(b.proto.quality) - Number(a.proto.quality)
                }
            }else if(afullSuip == 2 || bfullSuip == 2){  
                return bfullSuip - afullSuip
            }
            else{
                let aOwnNumber = a.own? 2:1
                let bOwnNumber = b.own? 2:1
                if (aOwnNumber - bOwnNumber == 0) {
                    if (a.proto.quality == b.proto.quality) {
                        return Number(a.proto.id) - Number(b.proto.id)
                    }else{
                        return Number(b.proto.quality) - Number(a.proto.quality)
                    }
                }else{
                    return bOwnNumber - aOwnNumber  
                }
            }
        })
    }


    private onLoadSpine(modelId, pos){
        new SpinePlayer().loadSpineByModelId(null, this.spineLoaderArr[pos], modelId);
    }

    private ownMonster(protoId): any {
        let temp = false
        this.elitemonsterInfo.elitemonster.forEach(monster => {
            if (monster.protoId == protoId) {
                temp = monster;
            }
        });
        return temp;
    }

    private getMonsetInfoData(id) :any {
        for (let index = 0; index < this.monstersData.length; index++) {
            let element = this.monstersData[index];
            if (element.own) {
                if (id == element.own.id) {
                    return element
                }
            }
        }
    }

    private ownMonsterDebrisCount(protoId): any {
        let number = 0
        this.elitemonsterInfo.elitemonsterDebris.forEach(debris => {
            if (String(debris.protoId) == String(protoId)) {
                number = debris.count
            }
        });
        return number;
    }

    private loadInfoData(): void{
        this.elitemonsterInfo = GameServerData.getInstance().getPlayerFullInfo().elitemonsterInfo
        this.playerbase = GameServerData.getInstance().getPlayerFullInfo().base
        this.eliteMosterTeam = this.playerbase.eliteMonsterTeam[this.playerbase.eliteMonsterBattleTeamId - 1].eliteMonsterId.split(";")
        this.upTeamId = this.playerbase.eliteMonsterBattleTeamId
        this.emAttr = this.elitemonsterInfo.activityEliteMonsterAttrs
    }

    private refrehPage(): void{
        this.loadInfoData();
        this.initData();
        for (let index = 0; index < 3; index++) {
            let element = this.eliteMosterTeam[index];
            if (String(element) != "0") {
                let own = this.getMonsetInfoData(element)
                if (this.imgLoaderArr[index].alpha == 1) {
                    let spinePlayer2 = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                        spp.playAnimation("shangzhen", false, 0, null, ()=>{
                            this.onLoadSpine(own.proto.modelId, index);
                        });
                    }, this.spineLoaderEffectArr[index], "jm_menke_shangzheng");
                }else{
                    this.onLoadSpine(own.proto.modelId, index);
                }
                this.imgLoaderArr[index].alpha = 0
                own.inTeam = true
            }else{
                this.spineLoaderArr[index].freeSpine()
                if (this.imgLoaderArr[index].alpha == 0) {
                    let spinePlayer2 = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                        spp.playAnimation("xiazhen", false,);
                    }, this.spineLoaderEffectArr[index], "jm_menke_shangzheng");
                }
                this.imgLoaderArr[index].alpha = 1
            }
        }
        if (this.list_allEditMo.numItems == 0) {
           UtilsUI.setFguiGlistDelayNumItems(this.list_allEditMo, this.monstersData.length)
        }else{
            this.list_allEditMo.numItems = this.monstersData.length
        }
        this.list_errArr.numItems = this.moreAttrArr.length
        this.list_mainArr.numItems = this.basicAttrArr.length
        this.label_number.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR31, [this.ownNumber, LocaleData.getEliteMonsterRoot()._elitemonster[0]._item.length])
    }

    private refrehChooseTeam(){
        let teamGCom = this.getUiPanel().getChild("group_mainTeam", fgui.GComponent);
        //次级界面 按钮
        (<fgui.GButton>teamGCom.getChild("btn_back")).clearClick();
        (<fgui.GButton>teamGCom.getChild("btn_back")).onClick(()=>{
            teamGCom.visible = false
        })
        this.refreshChoosePageUI(teamGCom)
        for (let index = 0; index < 3; index++) {
            let group: fgui.GComponent
            group = teamGCom.getChild("label_xuhao" + index)
            let btn_up: fgui.GButton
            btn_up = group.getChild("btn_up");
            (<fgui.GLabel>group.getChild("label_xuhao")).text = String(index + 1) 
            btn_up.clearClick()
            btn_up.onClick(()=>{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.refrehPage()
                        this.refreshChoosePageUI(teamGCom)
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } , "setelitemonsterbattleteamid", {teamId: index + 1})
            })
        }
        teamGCom.visible = true;
    }

    private refreshChoosePageUI(mGCom){
        for (let index = 0; index < 3; index++) {
            let group: fgui.GComponent
            let eliteMosterTeamData = this.playerbase.eliteMonsterTeam[index].eliteMonsterId.split(";")
            group = mGCom.getChild("label_xuhao" + index)
            for (let i = 0; i < 3; i++) {
                 let loader_btn : fgui.GButton = group.getChild("loader_icon" + i)
                 let laoder_qua : fgui.GLoader = loader_btn.getChild("laoder_qua");
                 let laoder_icon : fgui.GLoader = loader_btn.getChild("laoder_icon");
                if (eliteMosterTeamData[i] != "0") {
                    let data = this.getMonsetInfoData(eliteMosterTeamData[i])
                    laoder_qua.url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [ Number(data.proto.quality)]);
          
                    laoder_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [data.modelShowInfo.icon_square]);
                }else{
                    laoder_qua.url = "ui://CCommon/item_back1"
                    laoder_icon.url = ""
                }
            }
            let btn_up: fgui.GButton  = group.getChild("btn_up");
            btn_up.text = StrVal.LYELITEMONSTER.STR16
            btn_up.visible = (Number(this.upTeamId) == Number(index + 1)) ? false: true;
            group.getChild("group_now").visible = (Number(this.upTeamId) == Number(index + 1)) ? true: false;
            (<fgui.GLabel>group.getChild("label_xuhao")).text = String(index + 1); 
            (<fgui.GLabel>group.getChild("n14")).text = StrVal.LYELITEMONSTER.STR39
        }
    }

    private refrehChooseHero(){
        let mGCom = this.getUiPanel().getChild("group_editTeam", fgui.GComponent)
        mGCom.visible = true;
        // let mGCom :fgui.GComponent = fgui.UIPackage.createObject("LyEliteMonster", "group_editTeam").asCom;
        (<fgui.GButton>mGCom.getChild("btn_back")).clearClick();
        (<fgui.GButton>mGCom.getChild("btn_back")).onClick(()=>{
            mGCom.visible = false
        })
        //次级界面 按钮
        let list_choose: fgui.GList
        list_choose = mGCom.getChild("list_choose")
        list_choose.itemProvider = ():string =>{
            return "ui://LyEliteMonster/btn_eliteM"
        }
        let chooseId : string[] = [ ]
        let allselfm : any[] = []

        for (let index = 0; index < this.monstersData.length; index++) {
            let info = this.monstersData[index];
            if(info.own){
                allselfm.push(info)
            }
            if(info.inTeam) {
                console.log(info.proto.name)
                chooseId.push(info.own.id)
            }
        }
        allselfm.sort((a, b): number=>{
            let inA = a.inTeam ? 2 : 1
            let inB = b.inTeam ? 2 : 1
            if (inA == inB) {
                if (a.proto.quality == b.proto.quality) {
                    return Number(a.proto.id) - Number(b.proto.id)
                }else {
                    return Number(b.proto.quality) - Number(a.proto.quality)
                }
            }else {
                return inB - inA
            }
        });
        list_choose.itemRenderer = ((index: number, child: fgui.GComponent)=>{
            let mosterData: any = allselfm[index];
            (<fgui.GLoader>child.getChild("laoder_qua")).url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [ Number(mosterData.proto.quality)]);
            let laoder_icon:fgui.GLoader = child.getChild("laoder_icon");

            laoder_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [mosterData.modelShowInfo.icon_square]);
            let label_grade: fgui.GLabel = child.getChild("label_grade");
            let img_gou: fgui.GComponent = child.getChild("img_gou")
            let group_suip: fgui.GGroup = child.getChild("group_suip")
            group_suip.visible = false;
            img_gou.visible = false;
            for (let index = 0; index < chooseId.length; index++) {
                if (mosterData.own.id == chooseId[index]) {
                    img_gou.visible = true;
                    break
                }
            }
            child.clearClick()
            child.onClick(()=>{
                let childIndex = index
                let mosterData = allselfm[childIndex]
                let have = false
                for (let index = 0; index < chooseId.length; index++) {
                   if (chooseId[index] == mosterData.own.id) {
                        have = true
                        break
                    }
                }
                if (have) {
                    let index = chooseId.indexOf(mosterData.own.id)
                    chooseId.splice(index, 1)
                    list_choose.numItems = allselfm.length
                }else{
                    if (chooseId.length >= this.UNLOCK_MAX) {
                        UtilsUI.showMsgTip(StrVal.LYELITEMONSTER.STR43)
                    }else{
                        chooseId.push(mosterData.own.id)
                          list_choose.numItems = allselfm.length
                    }
                }
            });
        }).bind(this)
        
        
        list_choose.numItems = allselfm.length;
        let btn_sure: fgui.GButton = mGCom.getChild("btn_sure")
        btn_sure.clearClick()
        btn_sure.onClick(()=>{
           let str = ""
           for (let index = 0; index < 3; index++) {
                let tempstr = ""
                if (index < chooseId.length) {
                    tempstr = chooseId[index]
                }else{
                    tempstr = "0"
                }
                str = str + tempstr + ";"
            }
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    // UtilsUI.showMsgTip(StrVal.LYELITEMONSTER.STR21)
                    // fgui.GRoot.inst.hidePopup(mGCom) 
                    // this.uiPanel.addChild(mGCom)
                    this.refrehPage()
                    // this.refreshChoosePageUI(mGCom)
                    mGCom.visible = false
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } , "editteamcomposition", { teamId: this.playerbase.eliteMonsterBattleTeamId, eliteMonsterIdStr: str })
        })
    }

    public onViewUpdate(params?: any): void {
        this.refrehPage()
    }
    public onViewDestroy(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {upShowUi:true});
    }

    public getIsViewMask(): boolean {
        return false;
    };

    public static isViewRedPointFull(){
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.elite)) {
            return false
        }
        let xmls = LocaleData.getEliteMonsterRoot()._elitemonster[0]._item
        for (let index = 0; index < xmls.length; index++) {
            let monster = xmls[index];
            let ownDeb = GameServerData.getInstance().getItemCount(monster.debris_id)
            let needDeb = 0
            let monstInst = GameServerData.getInstance().getEliteMonsterById(monster.id)
            if (monstInst) {
                needDeb = Number(LocaleData.getEliteMonsterLevel(monster.id, monstInst.level).upgrade_cost) 
            }else{
                needDeb = Number(monster.debris_count) 
            }
            if (ownDeb >= needDeb) {
                return true
            }
        }
        console.log("isViewRedPointFull")
        return false
    }
}


