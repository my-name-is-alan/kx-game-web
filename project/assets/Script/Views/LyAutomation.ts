//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { LocaleUser } from "../Kernel/LocaleUser";
import { UtilsTool } from "../Kernel/UtilsTool";
import { MonthCardType, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyMainPage } from "./LyMainPage";
import { AudioManager } from "../Kernel/AudioManager";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { LyPayExquisite, PayExquisitePage } from "./LyPayExquisite";

export class LyAutomation extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyMainPage";
        this.viewResI.pkgName = "LyMainPage";
        this.viewResI.comName = "LyAutomation";
    }
    private isMonthCard: boolean
    public onViewCreate(): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let getUiPanel: fgui.GComponent = this.getUiPanel().getChild("group_main");
        UtilsUI.playCommonGroupAni(getUiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = getUiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAutomation, 0, null);
        })
        let btn_close1: fgui.GButton = this.getUiPanel().getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAutomation, 0, null);
        })

        let con_isAnd: fgui.Controller = getUiPanel.getController("con_isAnd")
        let cbox_quality: fgui.GComboBox = getUiPanel.getChild("cbox_quality")
        let btn_combatPower: fgui.GButton = getUiPanel.getChild("btn_combatPower")
        let btn_attr1: fgui.GButton = getUiPanel.getChild("btn_attr1")
        let cbox_battleAttr1: fgui.GComboBox = getUiPanel.getChild("cbox_battleAttr1")
        let cbox_defenseAttr1: fgui.GComboBox = getUiPanel.getChild("cbox_defenseAttr1")
        let btn_attr2: fgui.GButton = getUiPanel.getChild("btn_attr2")
        let cbox_battleAttr2: fgui.GComboBox = getUiPanel.getChild("cbox_battleAttr2")
        let cbox_defenseAttr2: fgui.GComboBox = getUiPanel.getChild("cbox_defenseAttr2")
        let btn_ticket: fgui.GButton = getUiPanel.getChild("btn_ticket")
        let btn_speed: fgui.GButton = getUiPanel.getChild("btn_speed")
        let btn_count: fgui.GButton = getUiPanel.getChild("btn_count")
        let cbox_count: fgui.GComboBox = getUiPanel.getChild("cbox_count")
        let btn_start: fgui.GButton = getUiPanel.getChild("btn_start");
        let btn_attrAdd = getUiPanel.getChild("btn_attrAdd");

        let label_zdms: fgui.GLabel = getUiPanel.getChild("label_zdms")
        let label_zbpz: fgui.GLabel = getUiPanel.getChild("label_zbpz")
        let label_he: fgui.GLabel = getUiPanel.getChild("label_he")
        let label_he2: fgui.GLabel = getUiPanel.getChild("label_he2")
        let label_tl: fgui.GLabel = getUiPanel.getChild("label_tl")
        let label_fj: fgui.GLabel = getUiPanel.getChild("label_fj")
        let label_str18: fgui.GLabel = getUiPanel.getChild("label_str18")
        label_str18.visible = !PlatformAPI.isBinaryExamine()
        let label_huo: fgui.GLabel = getUiPanel.getChild("label_huo")
        let btn_ts: fgui.GButton = getUiPanel.getChild("btn_ts")
        let btn_ts1: fgui.GButton = getUiPanel.getChild("btn_ts1")
        let btn_h: fgui.GButton = getUiPanel.getChild("btn_h")
        let btn_h1: fgui.GButton = getUiPanel.getChild("btn_h1")

        let group_isAnd1: fgui.GGroup = getUiPanel.getChild("group_isAnd1")
        let group_isAnd2: fgui.GGroup = getUiPanel.getChild("group_isAnd2")

        // 文字描述
        label_zdms.text = StrVal.LYAUTOMATION.STR1
        label_zbpz.text = StrVal.LYAUTOMATION.STR6
        label_he.text = StrVal.LYAUTOMATION.STR2
        label_he2.text = StrVal.LYAUTOMATION.STR2
        label_huo.text = StrVal.LYAUTOMATION.STR3
        label_tl.text = StrVal.LYAUTOMATION.STR4
        label_fj.text = StrVal.LYAUTOMATION.STR5
        label_str18.text = StrVal.LYAUTOMATION.STR18
        btn_ts.text = StrVal.LYAUTOMATION.STR14
        btn_ts1.text = StrVal.LYAUTOMATION.STR14
        btn_h1.text = StrVal.LYAUTOMATION.STR3
        btn_h.text = StrVal.LYAUTOMATION.STR3
        btn_combatPower.text = StrVal.LYAUTOMATION.STR7
        btn_attr1.text = StrVal.LYAUTOMATION.STR8
        btn_attr2.text = StrVal.LYAUTOMATION.STR8
        btn_ticket.text = StrVal.LYAUTOMATION.STR9
        btn_speed.text = StrVal.LYAUTOMATION.STR10
        btn_count.text = StrVal.LYAUTOMATION.STR11
        btn_start.text = StrVal.LYAUTOMATION.STR12

        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let evolutionRoot: any = LocaleData.getEvolutionRoot()
        btn_attrAdd.visible = fullInfo.base.level < evolutionRoot.attrFilterLevel
        btn_attrAdd.onClick(() => {
            UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYAUTOMATION.STR19, [evolutionRoot.attrFilterLevel]))
        })
        //装备品质
        let qualityItems: string[] = []
        let qualityValues: string[] = []

        let colorIndex: number = 0

        let levelData = LocaleData.getEvolutionByLevel(GameServerData.getInstance().getPlayerFullInfo().base.evolutionLevel)
        let levelNowQua = []
        let levelStrArr = levelData.quality.split(",")
        let qualityDropWeightArr = levelData.qualityDropWeight.split(",")
        for (let i = 0; i < qualityDropWeightArr.length; i++) {
            const element = qualityDropWeightArr[i];
            if (element != "0") {
                levelNowQua.push(levelStrArr[i])
            }
        }
        for (let index = 0; index < levelNowQua.length; index++) {
            let equipQuality = LocaleData.getEquipQualityProto(levelNowQua[index])
            let star: string = equipQuality.star
            let qualityType: number = star == "0" ? Number(equipQuality.id) : Number(star)
            let colorItem = "[color={0}]{1}[/color]"
            let str = UtilsTool.stringFormat(colorItem, [UtilsUI.getQualityColor2(qualityType), UtilsTool.stringFormat(StrVal.LYAUTOMATION.STR13, [LocaleData.getEquipQualityProto(levelNowQua[index]).name])])
            qualityItems.push(str)
            qualityValues.push(equipQuality.id)
            colorIndex++
        }
        LocaleData.getEquipQualityProto("").forEach(element => {
        });
        cbox_quality.items = qualityItems
        cbox_quality.values = qualityValues

        //体力数量
        let countItems: string[] = []
        let countValues: string[] = []
        LocaleData.getEvolutionsStamina().forEach(element => {
            countItems.push(element.count)
            countValues.push(element.count)
        });

        cbox_count.items = countItems
        cbox_count.values = countValues

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
                defenseAttrItems.push(StrVal.LYAUTOMATION.STR17)
            } else {
                defenseAttrItems.push(StrVal.EQUIPATTR_NAMES[Number(element)])
            }
        });
        cbox_battleAttr1.items = battleAttrItems
        cbox_battleAttr1.values = battleAttrValues
        cbox_battleAttr2.items = battleAttrItems
        cbox_battleAttr2.values = battleAttrValues

        cbox_defenseAttr1.items = defenseAttrItems
        cbox_defenseAttr1.values = defenseAttrValues
        cbox_defenseAttr2.items = defenseAttrItems
        cbox_defenseAttr2.values = defenseAttrValues

        //记录本地信息
        cbox_quality.on(fgui.Event.STATUS_CHANGED, () => {
            LocaleUser.setUser(VarVal.FIELD_SV.FORGE_QUALITY, cbox_quality.value);
            LocaleUser.flush()
        }, this);
        if (LocaleUser.getUser(VarVal.FIELD_SV.FORGE_QUALITY)) {
            let isQuality: boolean = false
            for (let i = 0; i < qualityValues.length; i++) {
                let item = qualityValues[i];
                if (LocaleUser.getUser(VarVal.FIELD_SV.FORGE_QUALITY) == item) {
                    isQuality = true
                }
            }
            if (isQuality) {
                cbox_quality.value = LocaleUser.getUser(VarVal.FIELD_SV.FORGE_QUALITY)
            } else {
                cbox_quality.value = qualityValues[0]
            }
        }
        btn_combatPower.onClick(() => {
            LocaleUser.setUser(VarVal.FIELD_SV.FORGE_COMBATPOWER, btn_combatPower.selected ? "1" : "0");
            LocaleUser.flush()
            if (btn_combatPower.selected && (btn_attr1.selected || btn_attr2.selected)) {
                group_isAnd2.visible = false
                group_isAnd1.visible = true
            } else {
                group_isAnd2.visible = true
                group_isAnd1.visible = false
            }
        })
        btn_combatPower.selected = LocaleUser.getUser(VarVal.FIELD_SV.FORGE_COMBATPOWER) == "1"
        btn_ts.onClick(() => {
            if (btn_ts.selected) {
                LocaleUser.setUser(VarVal.FIELD_SV.FORGE_ISAND, btn_ts.selected ? "0" : "1");
                LocaleUser.flush()
            } else {
                con_isAnd.selectedIndex = 0
            }
        })
        btn_h.onClick(() => {
            if (btn_h.selected) {
                LocaleUser.setUser(VarVal.FIELD_SV.FORGE_ISAND, btn_ts.selected ? "0" : "1");
                LocaleUser.flush()
            } else {
                con_isAnd.selectedIndex = 1
            }
        })

        con_isAnd.selectedIndex = LocaleUser.getUser(VarVal.FIELD_SV.FORGE_ISAND) ? Number(LocaleUser.getUser(VarVal.FIELD_SV.FORGE_ISAND)) : 0
        btn_attr1.onClick(() => {
            LocaleUser.setUser(VarVal.FIELD_SV.FORGE_ATTR1, btn_attr1.selected ? "1" : "0");
            LocaleUser.flush()
            if (btn_combatPower.selected && (btn_attr1.selected || btn_attr2.selected)) {
                group_isAnd2.visible = false
                group_isAnd1.visible = true
            } else {
                group_isAnd2.visible = true
                group_isAnd1.visible = false
            }
        })
        btn_attr1.selected = LocaleUser.getUser(VarVal.FIELD_SV.FORGE_ATTR1) == "1"
        cbox_battleAttr1.on(fgui.Event.STATUS_CHANGED, () => {
            LocaleUser.setUser(VarVal.FIELD_SV.FORGE_BATTLEATTR1, cbox_battleAttr1.value);
            LocaleUser.flush()
        }, this);
        if (LocaleUser.getUser(VarVal.FIELD_SV.FORGE_BATTLEATTR1)) {
            cbox_battleAttr1.value = LocaleUser.getUser(VarVal.FIELD_SV.FORGE_BATTLEATTR1)
        }
        cbox_defenseAttr1.on(fgui.Event.STATUS_CHANGED, () => {
            LocaleUser.setUser(VarVal.FIELD_SV.FORGE_DEFENSEATTR1, cbox_defenseAttr1.value);
            LocaleUser.flush()
        }, this);
        if (LocaleUser.getUser(VarVal.FIELD_SV.FORGE_DEFENSEATTR1)) {
            cbox_defenseAttr1.value = LocaleUser.getUser(VarVal.FIELD_SV.FORGE_DEFENSEATTR1)
        }

        btn_attr2.onClick(() => {
            LocaleUser.setUser(VarVal.FIELD_SV.FORGE_ATTR2, btn_attr2.selected ? "1" : "0");
            LocaleUser.flush()
            if (btn_combatPower.selected && (btn_attr1.selected || btn_attr2.selected)) {
                group_isAnd2.visible = false
                group_isAnd1.visible = true
            } else {
                group_isAnd2.visible = true
                group_isAnd1.visible = false
            }
        })
        btn_attr2.selected = LocaleUser.getUser(VarVal.FIELD_SV.FORGE_ATTR2) == "1"
        cbox_battleAttr2.on(fgui.Event.STATUS_CHANGED, () => {
            LocaleUser.setUser(VarVal.FIELD_SV.FORGE_BATTLEATTR2, cbox_battleAttr2.value);
            LocaleUser.flush()
        }, this);
        if (LocaleUser.getUser(VarVal.FIELD_SV.FORGE_BATTLEATTR2)) {
            cbox_battleAttr2.value = LocaleUser.getUser(VarVal.FIELD_SV.FORGE_BATTLEATTR2)
        }
        cbox_defenseAttr2.on(fgui.Event.STATUS_CHANGED, () => {
            LocaleUser.setUser(VarVal.FIELD_SV.FORGE_DEFENSEATTR2, cbox_defenseAttr2.value);
            LocaleUser.flush()
        }, this);
        if (LocaleUser.getUser(VarVal.FIELD_SV.FORGE_DEFENSEATTR2)) {
            cbox_defenseAttr2.value = LocaleUser.getUser(VarVal.FIELD_SV.FORGE_DEFENSEATTR2)
        }
        btn_ticket.onClick(() => {
            LocaleUser.setUser(VarVal.FIELD_SV.FORGE_TICKET, btn_ticket.selected ? "1" : "0");
            LocaleUser.flush()
        })
        this.isMonthCard = GameServerData.getInstance().isHaveMonthCard()// 是否有月卡
        btn_ticket.selected = LocaleUser.getUser(VarVal.FIELD_SV.FORGE_TICKET) == "1"
        btn_speed.onClick(() => {
            if (this.isMonthCard || PlatformAPI.isBinaryExamine()) {
                LocaleUser.setUser(VarVal.FIELD_SV.FORGE_SPEED, btn_speed.selected ? "1" : "0");
                LocaleUser.flush()
            } else {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.MONTHCARD, type: MonthCardType.Month});
                btn_speed.selected = false
            }
        })
        btn_speed.selected = this.isMonthCard ? LocaleUser.getUser(VarVal.FIELD_SV.FORGE_SPEED) == "1" : this.isMonthCard
        btn_count.onClick(() => {
            LocaleUser.setUser(VarVal.FIELD_SV.FORGE_ISCOUNT, btn_count.selected ? "1" : "0");
            LocaleUser.flush()
        })
        btn_count.selected = LocaleUser.getUser(VarVal.FIELD_SV.FORGE_ISCOUNT) == "1"
        // if (LocaleUser.getUser(VarVal.FIELD_SV.FORGE_COUNT)) {
        //     LocaleUser.setUser(VarVal.FIELD_SV.FORGE_COUNT, "1");
        // }
        cbox_count.on(fgui.Event.STATUS_CHANGED, () => {
            let level: number
            LocaleData.getEvolutionsStamina().forEach(element => {
                if (element.count == cbox_count.value) {
                    level = Number(element.level)
                }
            });
            if (fullInfo.base.evolutionLevel >= level) {
                LocaleUser.setUser(VarVal.FIELD_SV.FORGE_COUNT, cbox_count.value);
                LocaleUser.flush()
            } else {
                UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYAUTOMATION.STR15, [level]))
                cbox_count.value = LocaleUser.getUser(VarVal.FIELD_SV.FORGE_COUNT) ? LocaleUser.getUser(VarVal.FIELD_SV.FORGE_COUNT) : "1"
            }
        }, this);
        // if (LocaleUser.getUser(VarVal.FIELD_SV.FORGE_QUALITY)) {
        //     cbox_count.value = LocaleUser.getUser(VarVal.FIELD_SV.FORGE_QUALITY)
        // }
        if (LocaleUser.getUser(VarVal.FIELD_SV.FORGE_COUNT)) {
            // let evolutionLevel: number
            // LocaleData.getEvolutionsStamina().forEach(element => {
            //     if (element.count == LocaleUser.getUser(VarVal.FIELD_SV.FORGE_COUNT)) {
            //         evolutionLevel = Number(element.level)
            //     }
            // });
            // if (fullInfo.base.evolutionLevel >= evolutionLevel) {
            cbox_count.value = LocaleUser.getUser(VarVal.FIELD_SV.FORGE_COUNT)
            // }
        }
        if (btn_combatPower.selected && (btn_attr1.selected || btn_attr2.selected)) {
            group_isAnd2.visible = false
            group_isAnd1.visible = true
        } else {
            group_isAnd2.visible = true
            group_isAnd1.visible = false
        }

        btn_start.onClick(() => {
            if (btn_ticket.selected) {
                let countMax: number = UtilsUI.getDuelItemLimitCount();
                let count: number = GameServerData.getInstance().getItemCountByProtoId(evolutionRoot.duelItemId);
                if (count >= countMax) {
                    UtilsUI.showMsgTip(StrVal.LYAUTOMATION.STR16)
                    return
                }
            }
            let attr1: any = {//属性1
                battleAttr: Number(cbox_battleAttr1.value),//战斗属性
                defenseAttr: Number(cbox_defenseAttr1.value)//防御属性
            }
            let attr2: any = {//属性2
                battleAttr: Number(cbox_battleAttr2.value),//战斗属性
                defenseAttr: Number(cbox_defenseAttr2.value)//防御属性
            }

            let isAnd: boolean = false
            if (group_isAnd1.visible) {
                isAnd = btn_ts.selected
            }
            let automationData: any = {
                quality: Number(cbox_quality.value), //品阶
                combatPower: btn_combatPower.selected,//战斗力提升停止
                isAnd: isAnd,//是否同时满足两个条件
                isAttr1: btn_attr1.selected,
                isAttr2: btn_attr2.selected,
                attr1: attr1,//属性1
                attr2: attr2,//属性2
                speed: btn_speed.selected ? 2 : 1.5,//锤炼速度
                count: btn_count.selected ? Number(cbox_count.value) : 1,//锤炼消耗体力
                ticket: btn_ticket.selected//挑战券满时停止
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateAutomation: true, automationData: automationData });
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAutomation, 0, null);
        })
    };

    public onViewShowFront(): void {
        this.isMonthCard = GameServerData.getInstance().isHaveMonthCard()// 是否有月卡
    }
    public getIsViewMask(): boolean {
        return false;
    };

}