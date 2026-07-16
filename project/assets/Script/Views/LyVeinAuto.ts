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
import { MonthCardItemType, MonthCardType, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { VarVal } from "../Values/VarVal";
import { LyMainPage } from "./LyMainPage";
import { LocaleUser } from "../Kernel/LocaleUser";
import { LyVein } from "./LyVein";
import { LyVeinSatori } from "./LyVeinSatori";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { LyPayExquisite, PayExquisitePage } from "./LyPayExquisite";

export class LyVeinAuto extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyVein";
        this.viewResI.pkgName = "LyVein";
        this.viewResI.comName = "LyVeinAuto";
    }
    private veinXmlRoot: any 
    public onViewCreate(_params:any):void {
        LyVein.veinAutoInfo = null
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { berakVeinAuto: true})
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyVein, 0, { isAutoStateChange: 0});
        
        this.getUiPanel().getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyVeinAuto, 0, null)
        });
        let uiPanel:fgui.GComponent = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(uiPanel, null)
        let btn_close = uiPanel.getChild("btn_close")
        let label_title = uiPanel.getChild("label_title")
        let con_isAnd: fgui.Controller = uiPanel.getController("con_isAnd")
        let cbox_quality: fgui.GComboBox = uiPanel.getChild("cbox_quality")
        let btn_combatPower: fgui.GButton = uiPanel.getChild("btn_combatPower")
        let btn_attr1: fgui.GButton = uiPanel.getChild("btn_attr1")
        let cbox_battleAttr1: fgui.GComboBox = uiPanel.getChild("cbox_battleAttr1")
        let cbox_defenseAttr1: fgui.GComboBox = uiPanel.getChild("cbox_defenseAttr1")
        let cbox_buff: fgui.GComboBox = uiPanel.getChild("cbox_buff")
        let btn_zuhe: fgui.GButton = uiPanel.getChild("btn_zuhe")
        let btn_speed: fgui.GButton = uiPanel.getChild("btn_speed")
        let btn_start: fgui.GButton = uiPanel.getChild("btn_start");

        let label_zdms: fgui.GLabel = uiPanel.getChild("label_zdms")
        let label_zbpz: fgui.GLabel = uiPanel.getChild("label_zbpz")
        let label_he: fgui.GLabel = uiPanel.getChild("label_he")
        let label_huo: fgui.GLabel = uiPanel.getChild("label_huo")
        let label_fj: fgui.GLabel = uiPanel.getChild("label_fj")
        let btn_ts: fgui.GButton = uiPanel.getChild("btn_ts")
        let btn_h: fgui.GButton = uiPanel.getChild("btn_h")
        let group_isAnd1: fgui.GGroup = uiPanel.getChild("group_isAnd1") 
        uiPanel.getChild("label_fj", fgui.GLabel).text = StrVal.LYVEIN.STR17
        let n89 = uiPanel.getChild("n89", fgui.GLabel)
        n89.text = StrVal.LYVEIN.STR20
        n89.visible = !PlatformAPI.isBinaryExamine()
        // 文字描述
        label_zdms.text = StrVal.LYVEIN.STR18
        label_zbpz.text = StrVal.LYVEIN.STR30
        label_he.text = StrVal.LYAUTOMATION.STR2
        label_huo.text = StrVal.LYAUTOMATION.STR3
        label_fj.text = StrVal.LYVEIN.STR5
        btn_ts.text = StrVal.LYAUTOMATION.STR14
        btn_h.text = StrVal.LYAUTOMATION.STR3
        btn_combatPower.text = StrVal.LYAUTOMATION.STR7
        btn_attr1.text = StrVal.LYAUTOMATION.STR8
        btn_speed.text = StrVal.LYVEIN.STR19
        btn_start.text = StrVal.LYAUTOMATION.STR12
        btn_close.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyVeinAuto, 0, null)
        })

        btn_speed.onClick(()=>{
            if (!PlatformAPI.isBinaryExamine()) {
                let openData = UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.vein_speed);
                if (openData) {
                }else{
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.MONTHCARD, type: MonthCardType.Life});
                    btn_speed.selected = false
                }  
            }
        })
        let speed = LocaleUser.getUser("VeinAuto_SPEED")
        if (speed != undefined) {
            btn_speed.selected = LocaleUser.getUser("VeinAuto_SPEED") == "1"
        }
        btn_speed.on(fgui.Event.STATUS_CHANGED, ()=>{
            let openData = UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.vein_speed);
            if (openData) {
                LocaleUser.setUser("VeinAuto_SPEED", btn_speed.selected ? "1":"0")
            }else{
                LocaleUser.setUser("VeinAuto_SPEED", "0")
            }
        }, this)
        
       //装备品质
       let qualityItems: string[] = []
       let qualityValues: string[] = []
       LocaleData.getVeinQua().forEach(element => {
           let str = UtilsTool.stringFormat(StrVal.LYAUTOMATION.STR13, [element.name])
           qualityItems.push(str)
           qualityValues.push(element.id)
       });
       cbox_quality.items = qualityItems
       cbox_quality.values = qualityValues
       cbox_quality.on(fgui.Event.STATUS_CHANGED, ()=>{
            LocaleUser.setUser("VeinAuto_Qua", cbox_quality.value)
        }, this)
       let qua = LocaleUser.getUser("VeinAuto_Qua")
       if (qua != undefined) {
            cbox_quality.selectedIndex = Number(qua) - 1
       }
       
       btn_combatPower.selected = LocaleUser.getUser("VeinAuto_combatPower") == "1"
       btn_combatPower.onClick(()=>{
            if (btn_combatPower.selected && btn_attr1.selected) {
                btn_ts.enabled = true
                btn_h.enabled = true
            }else {
                btn_ts.enabled = false
                btn_h.enabled = false
                con_isAnd.selectedIndex = -1
            }
            LocaleUser.setUser("VeinAuto_combatPower", btn_combatPower.selected? "1":"0");
       })
       
       let andor = LocaleUser.getUser("VeinAuto_andor") 
       if (andor == undefined) {
            btn_ts.selected = false
            btn_h.selected = false
            con_isAnd.selectedIndex = -1
       }else{
            con_isAnd.selectedIndex = Number(andor)
       }
       
       btn_ts.onClick(()=>{
            if (btn_combatPower.selected && btn_attr1.selected) {
                if (con_isAnd.selectedIndex == 0) {
                    con_isAnd.selectedIndex = -1
                }  
            }
       });

       btn_h.onClick(()=>{
            if (btn_combatPower.selected && btn_attr1.selected) {
                if (con_isAnd.selectedIndex == 1) {
                    con_isAnd.selectedIndex = -1
                }
            }
        });

       con_isAnd.onChanged(()=>{
            LocaleUser.setUser("VeinAuto_andor", String(con_isAnd.selectedIndex)); 
       });

       let boolAttr = LocaleUser.getUser("VeinAuto_boolAttr") 
       if (boolAttr != undefined) {
            btn_attr1.selected = LocaleUser.getUser("VeinAuto_boolAttr") == "1"
       }
       btn_attr1.onClick(()=>{
            if (btn_combatPower.selected && btn_attr1.selected) {
                btn_ts.enabled = true
                btn_h.enabled = true
            }else {
                btn_ts.enabled = false
                btn_h.enabled = false
                con_isAnd.selectedIndex = -1
            }
            LocaleUser.setUser("VeinAuto_boolAttr", btn_attr1.selected? "1":"0")
       });

       let battleAttrValues: string[] = [
        "-1",//任意
        VarVal.EQUIPATTR.COMBO.toString(),
        VarVal.EQUIPATTR.COUNTER.toString(),
        VarVal.EQUIPATTR.CRITICAL.toString(),
        VarVal.EQUIPATTR.MISS.toString(),
        VarVal.EQUIPATTR.LIFESTEAL.toString(),
        VarVal.EQUIPATTR.STUN.toString(),
        ]

        let battleAttrItems: string[] = []
        battleAttrValues.forEach(element => {
            if (element == "-1") {
                battleAttrItems.push("任意")
            } else {
                battleAttrItems.push(StrVal.EQUIPATTR_NAMES[Number(element)])
            }
        });

        

        let defenseAttrValues: string[] = [
            "-1",//任意
            VarVal.EQUIPATTR.COMBO_R.toString(),
            VarVal.EQUIPATTR.COUNTER_R.toString(),
            VarVal.EQUIPATTR.CRITICAL_R.toString(),
            VarVal.EQUIPATTR.MISS_R.toString(),
            VarVal.EQUIPATTR.LIFESTEAL_R.toString(),
            VarVal.EQUIPATTR.STUN_R.toString(),
        ]
        let defenseAttrItems: string[] = []
        defenseAttrValues.forEach(element => {
            if (element == "-1") {
                defenseAttrItems.push("任意")
            } else {
                defenseAttrItems.push(StrVal.EQUIPATTR_NAMES[Number(element)])
            }
        });
        cbox_battleAttr1.items = battleAttrItems
        cbox_battleAttr1.values = battleAttrValues

        let attrValue = LocaleUser.getUser("VeinAuto_attrValue") 
        if (attrValue != undefined) {
            cbox_battleAttr1.selectedIndex = Number(attrValue)
        }
        cbox_battleAttr1.on(fgui.Event.STATUS_CHANGED, ()=>{
            LocaleUser.setUser("VeinAuto_attrValue", String(cbox_battleAttr1.selectedIndex))
        }, this)


        cbox_defenseAttr1.items = defenseAttrItems
        cbox_defenseAttr1.values = defenseAttrValues

        let defenseValue = LocaleUser.getUser("VeinAuto_defenseValue") 
        if (defenseValue != undefined) {
            cbox_defenseAttr1.selectedIndex = Number(defenseValue)
        }
        cbox_defenseAttr1.on(fgui.Event.STATUS_CHANGED, ()=>{
            LocaleUser.setUser("VeinAuto_defenseValue", String(cbox_defenseAttr1.selectedIndex))
        }, this)

        //装备品质
        let buffItems: string[] = []
        let buffValues: string[] = []
        LocaleData.getVeinAttrSet().forEach(element =>{
            buffItems.push(element.name)
            buffValues.push(element.id)
        })
        cbox_buff.items = buffItems
        cbox_buff.values = buffValues

        btn_zuhe.selected = LocaleUser.getUser("VeinAuto_btn_zuhe") == "1"
        btn_zuhe.onClick(()=>{
            LocaleUser.setUser("VeinAuto_btn_zuhe", btn_zuhe.selected? "1":"0");
        })

        cbox_buff.on(fgui.Event.STATUS_CHANGED, ()=>{
            LocaleUser.setUser("VeinAuto_zuhe", String(cbox_buff.selectedIndex))
        }, this)

        let zuheIndex = LocaleUser.getUser("VeinAuto_zuhe")
        if (zuheIndex != undefined) {
            cbox_buff.selectedIndex = Number(zuheIndex)
        }


        let startFun: Function = ()=>{
            let attr: any = {//属性1
                battleAttr: Number(cbox_battleAttr1.value),//战斗属性
                defenseAttr: Number(cbox_defenseAttr1.value)//防御属性
            }
            let automationData: any = {
                quality: Number(cbox_quality.value), //品阶
                combatPower: btn_combatPower.selected,//战斗力提升停止
                isAnd: con_isAnd.selectedIndex,//是否同时满足两个条件
                isAttr1: btn_attr1.selected,
                isBuff: btn_zuhe.selected,
                attr: attr,//属性1
                buff: Number(cbox_buff.value),//属性2
                speed: btn_speed.selected ? 2 : 1,//锤炼速度
                ticket: true//挑战券满时停止
            }
            LyVein.veinAutoInfo = automationData
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyVein, 0, { isAutoStateChange: 1});
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {veinStartAuto: true});
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyVeinAuto, 0, null);
        }


        this.veinXmlRoot = LocaleData.getVeinRoot()
        btn_start.onClick(() => {
            let itemNumber = GameServerData.getInstance().getItemCountByProtoId(this.veinXmlRoot.learnItemId)
            if (itemNumber > 0) {
                if (LyVein.isStimulateTip) {
                    startFun()
                }else {
                    UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                    StrVal.LYVEIN.STR24, null,
                    StrVal.LYVEIN.STR25, ()=>{
                        startFun()
                    },
                    StrVal.LYVEIN.STR26, (isCheckSel: boolean) => {
                        LyVein.isStimulateTip = isCheckSel;
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyVeinSatori, 0, null)
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyVeinAuto, 0, null);
                    }, "", null, {
                        checkBoxText: StrVal.COMMON.STR35
                    })
                }
            }else {
                startFun()
            }
        })
    }

    public onViewDestroy(): void {
        LocaleUser.flush()
    }

    public getIsViewMask(): boolean {
        return false;
    };

}


