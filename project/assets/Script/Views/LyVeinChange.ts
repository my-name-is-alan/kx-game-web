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
import { LyVein } from "./LyVein";
import { LocaleUser } from "../Kernel/LocaleUser";
import { LyMainPage } from "./LyMainPage";

export class LyVeinChange extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyVein";
        this.viewResI.pkgName = "LyVein";
        this.viewResI.comName = "LyVeinChange";
    }

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

    private static isFroget: boolean = false
    private uiPanel: fgui.GComponent
    private gems: any
    private newGem
    private btn_automatic: fgui.GButton
    private refreshUI: Function
    private oldGem: any = null
    public onViewCreate(_params:any):void {
        this.uiPanel = this.getUiPanel()
        let c1: fgui.Controller = this.uiPanel.getController("c1")
        let img_quality: fgui.GLoader = this.uiPanel.getChild("img_quality")
        let label_name: fgui.GTextField = this.uiPanel.getChild("label_name")
        let list_attr: fgui.GList = this.uiPanel.getChild("list_attr")
        let img_icon: fgui.GComponent = this.uiPanel.getChild("img_icon")
        let img_qualityNew: fgui.GLoader = this.uiPanel.getChild("img_qualityNew")
        let list_attrNew: fgui.GList = this.uiPanel.getChild("list_attrNew")
        let label_nameNew: fgui.GTextField = this.uiPanel.getChild("label_nameNew")
        let label_addNew: fgui.GTextField = this.uiPanel.getChild("label_addNew")
        let btn_breakdown: fgui.GButton = this.uiPanel.getChild("btn_breakdown")
        let btn_attach: fgui.GButton = this.uiPanel.getChild("btn_attach")
        let btn_attach1: fgui.GButton = this.uiPanel.getChild("btn_attach1")
        let img_iconNew: fgui.GComponent = this.uiPanel.getChild("img_iconNew")
        this.btn_automatic = this.uiPanel.getChild("btn_automatic")
        let label_oldBuff: fgui.GLabel = this.uiPanel.getChild("label_buff")
        let label_newbuff: fgui.GLabel = this.uiPanel.getChild("label_newbuff")
        let btn_close: fgui.GButton = this.uiPanel.getChild("btn_close")
        btn_close.onClick(()=>{
            this.closePage()
        })

        //刷新界面
        this.refreshUI = ()=>{
            this.gems = GameServerData.getInstance().getPlayerFullInfo().veinInfo.battleGems
            this.newGem = GameServerData.getInstance().getPlayerFullInfo().veinInfo.pendingGems[0]
            this.oldGem = null
            if (this.gems) {
                this.oldGem = this.findGemBySolt(this.newGem.slot)
            }
            let attrsData: Array<any> = []
            if (this.oldGem) {
                c1.selectedIndex = 0
                img_quality.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}_title", [Number(this.oldGem.quality)])
                let soltProto = LocaleData.getVeinSoltByen(this.oldGem.slot)
                label_name.text = StrVal.LYVEIN.STR22 + LocaleData.getVeinQua()[this.oldGem.quality - 1].name + soltProto.name
                label_name.strokeColor = UtilsUI.getQualityColor(this.oldGem.quality)
                let load_icon: fgui.GLoader = img_icon.getChild("loader_icon");
                img_icon.getChild("label_solt").text = soltProto.name;
                (<fgui.GLabel>img_icon.getChild("label_count")).text = UtilsTool.stringFormat(StrVal.LYVEIN.STR3, [this.oldGem.level])
                load_icon.url = UtilsTool.stringFormat("ui://LyVein/{0}{1}", [soltProto.icon, this.oldGem.quality]) 
                let battleAttrs: string[] = [] 
                battleAttrs = this.oldGem.attrs.split(",")
                list_attr.itemProvider = ():string =>{
                    return "ui://CCommon/group_equipAttr"
                }
                for (let index = 0; index < battleAttrs.length; index++) {
                    let attrsew = battleAttrs[index]
                    if (attrsew != "0"){
                        let attrsDataOne = {
                            attrPos: index,
                            attr: attrsew,
                            url: "",
                        }
                        attrsData.push(attrsDataOne)
                    }
                }
                list_attr.itemRenderer = ((index: number, obj: fgui.GComponent)=>{
                    this.loadAttr(obj, attrsData[index])
                }).bind(this)
                list_attr.numItems = attrsData.length
                if (this.oldGem.setId != 0) {
                    let zuheCount = this.getGemZuheNumber(this.oldGem.setId)
                    let buffProto =  LocaleData.getVeinAttrSetById(this.oldGem.setId)
                    let skillIDs = buffProto.skillId.split(",")
                    let skill = LocaleData.getSkillProto(skillIDs[zuheCount - 1])
                    label_oldBuff.text = "【" + buffProto.name  +"】" + skill.desc  + "  (" + (zuheCount) + "/4)";
                    load_icon.url = UtilsTool.stringFormat("ui://LyVein/{0}{1}", [buffProto.icon, this.oldGem.quality]) 
                }else{
                    load_icon.url = UtilsTool.stringFormat("ui://LyVein/{0}{1}", [soltProto.icon, this.oldGem.quality]) 
                }
            }
            else{
                c1.selectedIndex = 1
            }
            img_qualityNew.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}_title", [Number(this.newGem.quality) ])
            let soltProto = LocaleData.getVeinSoltByen(this.newGem.slot)
            label_nameNew.text = StrVal.LYVEIN.STR21 + LocaleData.getVeinQua()[this.newGem.quality - 1].name + soltProto.name
            label_nameNew.strokeColor = UtilsUI.getQualityColor(this.newGem.quality)
            let load_icon2: fgui.GLoader = img_iconNew.getChild("loader_icon")
            img_iconNew.getChild("label_solt").text = soltProto.name
            load_icon2.url = UtilsTool.stringFormat("ui://LyVein/{0}{1}", [soltProto.icon, this.newGem.quality]);
            (<fgui.GLabel>img_iconNew.getChild("label_count")).text = UtilsTool.stringFormat(StrVal.LYVEIN.STR3, [this.newGem.level])
            label_addNew.text = UtilsTool.nToFStr(this.newGem.diffCombatPower);  
            if (this.newGem.diffCombatPower >= 0) {
                label_addNew.text = "+ "+ this.newGem.diffCombatPower
                label_addNew.color = UtilsUI.getEnoughColor(true)
            }else{
                label_addNew.color = UtilsUI.getEnoughColor(false)
            }
            list_attrNew.itemProvider = ():string =>{
                return "ui://CCommon/group_equipAttr"
            }
            let attrsNew: string[] = this.newGem.attrs.split(",")
            let attrsNewData: Array<any> = []
            for (let index = 0; index < attrsNew.length; index++) {
                let attrsew = attrsNew[index]
                if (attrsew != "0"){
                    let attrsNewDataOne = {
                        attrPos: index,
                        attr: attrsNew[index],
                        url: "",
                    }
                    if (attrsData.length < 0) {
                        attrsNewDataOne.url = "n31"
                    }else{
                        attrsNewDataOne.url = "n31"
                        for (let index = 0; index < attrsData.length; index++) {
                            let element = attrsData[index];
                            if (element.attrPos == attrsNewDataOne.attrPos) {
                                if (Number(attrsNewDataOne.attr) > Number(element.attr)) {
                                    attrsNewDataOne.url = "n31"
                                } else if (Number(attrsNewDataOne.attr) < Number(element.attr)) {
                                    attrsNewDataOne.url = "n32"
                                } else {
                                    attrsNewDataOne.url = ""
                                }
                                break;
                            }
                        }
                    }
                    attrsNewData.push(attrsNewDataOne)    
                }
            }
           
            if (this.newGem.setId != 0) {
                let addNumber = 1
                if (this.oldGem && this.newGem.setId == this.oldGem.setId) {
                    addNumber = 0
                }
                let zuheCount = this.getGemZuheNumber(this.newGem.setId)
                let buffProto =  LocaleData.getVeinAttrSetById(this.newGem.setId)
                let skillIDs = buffProto.skillId.split(",")
                let skill = LocaleData.getSkillProto(skillIDs[zuheCount + addNumber - 1])
                label_newbuff.text = "【" + buffProto.name  +"】" + skill.desc  + "  (" + (zuheCount + addNumber) + "/4)";
                load_icon2.url = UtilsTool.stringFormat("ui://LyVein/{0}{1}", [buffProto.icon, this.newGem.quality]) 
            }else{
                load_icon2.url = UtilsTool.stringFormat("ui://LyVein/{0}{1}", [soltProto.icon, this.newGem.quality]) 
            }

            list_attrNew.itemRenderer = ((index: number, obj: fgui.GComponent)=>{
                this.loadAttr(obj, attrsNewData[index])
            }).bind(this)
            list_attrNew.numItems = Object.keys(attrsNewData).length
        }
       
         // 是否分解
        this.btn_automatic.selected = LocaleUser.getUser(VarVal.FIELD_SV.VEIN_BREAKDOWN) == "1"
        this.btn_automatic.text = StrVal.LYVEIN.STR9        
        this.btn_automatic.onClick(() => {
            LocaleUser.setUser(VarVal.FIELD_SV.VEIN_BREAKDOWN, this.btn_automatic.selected ? "1" : "0");
            LocaleUser.flush()
        })
        btn_attach1.text = StrVal.LYVEIN.STR6
        btn_attach1.onClick(()=>{
           this.attachGem()
        })
        btn_attach.text = StrVal.LYVEIN.STR7
        btn_attach.onClick(()=>{
            this.attachGem()
        })
        btn_breakdown.text = StrVal.LYVEIN.STR8
        btn_breakdown.onClick(()=>{
            if (this.newGem.diffCombatPower > 0) {
                if (LyVeinChange.isFroget) {
                    this.disGemsFun()
                }else{
                    UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                    StrVal.LYVEIN.STR27, null,
                    StrVal.LYVEIN.STR28, (isCheckSel: boolean)=>{
                        LyVeinChange.isFroget = isCheckSel;
                    },
                    StrVal.LYVEIN.STR29, (isCheckSel: boolean) => {
                        LyVeinChange.isFroget = isCheckSel;
                        this.disGemsFun()
                    }, "", null, {
                        checkBoxText: StrVal.COMMON.STR35
                    })
                }
            }else{
                this.disGemsFun()
            }
        })

        this.refreshUI()
    }

    private disGemsFun() {
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                if (LyVein.veinAutoInfo) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { veinStartAuto: true });
                }
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyVein, 0, { isRefresVein: true })
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyVeinChange, 0, null)
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        } , "discardGems", { gemsId: this.newGem.gid} )
    }

    private attachGem(){
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                if (this.btn_automatic.selected || !this.oldGem) {
                    if (LyVein.veinAutoInfo) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { veinStartAuto: true });
                    }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyVeinChange, 0, null)
                }else {
                    this.refreshUI()
                }
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyVein, 0, { isRefresVein: true, attGid: this.newGem.gid})
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        } , "attachGems", {discard: this.btn_automatic.selected ? 1 : 0, gemsId: this.newGem.gid} )
    }

    private loadAttr(group: fgui.GComponent, data: any): void {
        let label_name: fgui.GLabel = group.getChild("label_name")
        let xh = data.attrPos < 4? "":"%";
        label_name.text = StrVal.ENTITI_NAMES[this.allAttr[Number(data.attrPos)]] 
        let label_num: fgui.GLabel = group.getChild("label_num")
        data.attr = data.attrPos < 4 ? Math.floor(Number(data.attr)) : data.attr
        label_num.text = data.attr + xh
        let img_icon: fgui.GLoader = group.getChild("img_icon")
        if (data.url) {
            img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [data.url]);
        }
    };

    private findGemBySolt(slot): any{
        let retgem = null
        this.gems.forEach(gem => {
            if (gem.slot == slot) {
                retgem = gem
            }
        });
        return retgem
    }
     //获取组合数量
     private getGemZuheNumber(zuheId): number {
        let number = 0
        for (let index = 0; index < this.gems.length; index++) {
            let gem = this.gems[index]
            if (gem.setId != 0 && gem.setId == zuheId) {
                number = number + 1
            }
        }
        return number
    }

    private closePage(): void {
        LyVein.veinAutoInfo = null
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyVein, 0, { isAutoStateChange: 0 });
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyVeinChange, 0, null);
    }
    
    public getIsViewMask(): boolean {
        return false;
    };
}


                 