//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { Color } from "cc";
import * as fgui from "fairygui-cc";
import { AudioManager } from "../Kernel/AudioManager";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { LocaleUser } from "../Kernel/LocaleUser";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { PErrCode } from "../Values/PErrCode";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyMainPage } from "./LyMainPage";
export class LyAttachEquip extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyMainPage";
        this.viewResI.pkgName = "LyMainPage";
        this.viewResI.comName = "LyAttachEquip";
    }
    public static isGuideCanPush: boolean = false;
    private static isAttachCheckSel: boolean = false;
    private static isBreakdownCheckSel: boolean = false;
    private isAutomation: boolean = false//是否自动
    private equipIndex: number = 0//显示的第几个装备
    public onViewCreate(params: any): void {
        if (params) {
            if (params.automation) {
                this.isAutomation = params.automation
            }
            if (params.equipIndex) {
                this.equipIndex = params.equipIndex
            }
        }

        this.initialize()
        this.onAddEvent()
    }

    private uiPanel: fgui.GComponent
    private playerbase: any


    private forgeEquips: any = null
    private battleEquips: any = null
    private initialize(): void {
        this.uiPanel = this.getUiPanel();
        // 关闭
        let btn_close: fgui.GButton = this.uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            if (this.isAutomation) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateAutomation: true, hideEff: true });
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAttachEquip, 0, null);
        })
        let btn_breakdown: fgui.GButton = this.uiPanel.getChild("btn_breakdown");
        btn_breakdown.text = StrVal.LYATTACHEQUIP.STR5;
        let btn_attach: fgui.GButton = this.uiPanel.getChild("btn_attach");
        btn_attach.text = StrVal.LYATTACHEQUIP.STR6;
        let btn_attach1: fgui.GButton = this.uiPanel.getChild("btn_attach1");
        btn_attach1.text = StrVal.LYATTACHEQUIP.STR7;

        let label_th: fgui.GLabel = this.uiPanel.getChild("label_th");
        label_th.text = StrVal.LYATTACHEQUIP.STR4
        this.playerbase = GameServerData.getInstance().getPlayerFullInfo()
        this.forgeEquips = this.playerbase.forgeEquips[this.equipIndex]//可能一次性砍好几个，默认取第一个
        let battleArr: any[] = this.playerbase.battleEquips
        for (let i = 0; i < battleArr.length; i++) {
            let item = battleArr[i]
            if (item.slot == this.forgeEquips.slot) {
                this.battleEquips = item
            }
        }
        let battleAttrs: string[] = []
        let specialArr: any[] = []
        if (this.battleEquips) {
            let battleEuip = LocaleData.getEquipProto(this.battleEquips.cid);//新获得的装备
            battleAttrs = this.battleEquips.attrs.split(",")
            let list_attr: fgui.GList = this.uiPanel.getChild("list_attr")
            list_attr.itemRenderer = ((index: number, obj: fgui.GButton) => {
                let img_icon: fgui.GLoader = obj.getChild("img_icon")
                let data = {
                    id: index,
                    attr: battleAttrs[index]
                }
                this.loadAttr(obj, data)
                img_icon.visible = false
            }).bind(this)
            list_attr.numItems = 4
            let qualityXml = LocaleData.getEquipQualityProto(this.battleEquips.quality)
            let star: string = qualityXml.star
            let qualityType: number = star == "0" ? this.battleEquips.quality : Number(star)
            let label_name: fgui.GTextField = this.uiPanel.getChild("label_name")
            label_name.text = UtilsTool.stringFormat(StrVal.LYATTACHEQUIP.STR1, [StrVal.LYATTACHEQUIP.STR2, LocaleData.getEquipQualityProto(battleEuip.quality).name, battleEuip.name])
            label_name.strokeColor = UtilsUI.getQualityColor(qualityType);
            let img_icon: fgui.GComponent = this.uiPanel.getChild("img_icon")
            UtilsUI.setUIGroupEquip(this.battleEquips, img_icon, () => {
            });
            let img_quality: fgui.GLoader = this.uiPanel.getChild("img_quality")

            img_quality.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}_title", [qualityType]);
            // let label_solt: fgui.GLabel = this.uiPanel.getChild("label_solt")
            // label_solt.text = LocaleData.getSoltQualityProto(this.battleEquips.slot).name
            //额外的属性
            for (let i = 4; i < battleAttrs.length; i++) {
                if (battleAttrs[i] != "0") {
                    let data = {
                        id: i,
                        attr: battleAttrs[i]
                    }
                    specialArr.push(data)
                }
            }
            let group_special1: fgui.GGroup = this.uiPanel.getChild("group_special1")
            let group_special2: fgui.GGroup = this.uiPanel.getChild("group_special2")
            let group_attr1: fgui.GComponent = this.uiPanel.getChild("group_attr1")
            let label_dec1: fgui.GLabel = this.uiPanel.getChild("label_dec1")
            let group_attr2: fgui.GComponent = this.uiPanel.getChild("group_attr2")
            let label_dec2: fgui.GLabel = this.uiPanel.getChild("label_dec2")
            group_attr1.getChild("img_icon").visible = false
            group_attr2.getChild("img_icon").visible = false
            group_special1.visible = group_special2.visible = false
            if (specialArr.length > 1) {
                group_special1.visible = group_special2.visible = true
                this.loadAttr(group_attr1, specialArr[0])
                this.loadAttr(group_attr2, specialArr[1])
                label_dec1.text = LocaleData.getCombatAttrs(Number(specialArr[0].id) + 1).desc
                label_dec2.text = LocaleData.getCombatAttrs(Number(specialArr[1].id) + 1).desc
            } else if (specialArr.length > 0) {
                group_special1.visible = true
                this.loadAttr(group_attr1, specialArr[0])
                label_dec1.text = LocaleData.getCombatAttrs(Number(specialArr[0].id) + 1).desc
            }
        }
        //====================新获得========================
        let attrsNew: string[] = this.forgeEquips.attrs.split(",")
        let newEuip = LocaleData.getEquipProto(this.forgeEquips.cid);//新获得的装备
        let list_attrNew: fgui.GList = this.uiPanel.getChild("list_attrNew")
        list_attrNew.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let data = {
                id: index,
                attr: attrsNew[index],
                url: "",
            }
            if (battleAttrs[index]) {
                if (Number(attrsNew[index]) > Number(battleAttrs[index])) {
                    data.url = "n31"
                } else if (Number(attrsNew[index]) < Number(battleAttrs[index])) {
                    data.url = "n32"
                } else {
                    data.url = ""
                }
            } else {
                data.url = "n31"
            }
            this.loadAttr(obj, data)
        }).bind(this)
        list_attrNew.numItems = 4
        let label_nameNew: fgui.GTextField = this.uiPanel.getChild("label_nameNew")
        label_nameNew.text = UtilsTool.stringFormat(StrVal.LYATTACHEQUIP.STR1, [StrVal.LYATTACHEQUIP.STR3, LocaleData.getEquipQualityProto(newEuip.quality).name, newEuip.name])
        let qualityXml = LocaleData.getEquipQualityProto(this.forgeEquips.quality)
        let star: string = qualityXml.star
        let qualityType: number = star == "0" ? this.forgeEquips.quality : Number(star)
        label_nameNew.strokeColor = UtilsUI.getQualityColor(qualityType);
        let img_iconNew: fgui.GComponent = this.uiPanel.getChild("img_iconNew")
        UtilsUI.setUIGroupEquip(this.forgeEquips, img_iconNew, () => {
        });
        let img_qualityNew: fgui.GLoader = this.uiPanel.getChild("img_qualityNew")

        img_qualityNew.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}_title", [qualityType]);
        // let label_soltNew: fgui.GLabel = this.uiPanel.getChild("label_soltNew")
        // label_soltNew.text = LocaleData.getSoltQualityProto(this.forgeEquips.slot).name
        //额外的属性
        let specialNewArr: any[] = []
        for (let i = 4; i < attrsNew.length; i++) {
            if (attrsNew[i] != "0") {
                let data = {
                    id: i,
                    attr: attrsNew[i],
                    url: ""
                }
                if (battleAttrs[i] == "0") {
                    data.url = "new"
                } else {
                    if (Number(attrsNew[i]) > Number(battleAttrs[i])) {
                        data.url = "n31"
                    } else if (Number(attrsNew[i]) < Number(battleAttrs[i])) {
                        data.url = "n32"
                    } else {
                        data.url = ""
                    }
                }
                specialNewArr.push(data)
            }
        }
        let label_addNew: fgui.GTextField = this.uiPanel.getChild("label_addNew")
        let label_str10: fgui.GLabel = this.uiPanel.getChild("label_str10")
        let img_jt: fgui.GLoader = this.uiPanel.getChild("img_jt")
        let group_specialNew1: fgui.GGroup = this.uiPanel.getChild("group_specialNew1")
        let group_specialNew2: fgui.GGroup = this.uiPanel.getChild("group_specialNew2")
        let group_attr1New: fgui.GComponent = this.uiPanel.getChild("group_attr1New")
        let label_dec1New: fgui.GLabel = this.uiPanel.getChild("label_dec1New")
        let group_attr2New: fgui.GComponent = this.uiPanel.getChild("group_attr2New")
        let label_dec2New: fgui.GLabel = this.uiPanel.getChild("label_dec2New")
        group_specialNew1.visible = group_specialNew2.visible = false
        label_addNew.text = this.forgeEquips.diffCombatPower >= 0 ? "+" + this.forgeEquips.diffCombatPower : this.forgeEquips.diffCombatPower
        label_str10.text = StrVal.LYATTACHEQUIP.STR10
        label_addNew.color = this.forgeEquips.diffCombatPower >= 0 ? new Color(43, 132, 28) : new Color(195, 51, 18)
        label_str10.visible = label_addNew.visible = img_jt.visible = this.forgeEquips.diffCombatPower != 0
        img_jt.url = UtilsTool.stringFormat("ui://CCommon/{0}", [this.forgeEquips.diffCombatPower >= 0 ? "n31" : "n32"]);
        if (specialNewArr.length > 1) {
            group_specialNew1.visible = group_specialNew2.visible = true
            this.loadAttr(group_attr1New, specialNewArr[0])
            this.loadAttr(group_attr2New, specialNewArr[1])
            label_dec1New.text = LocaleData.getCombatAttrs(Number(specialNewArr[0].id) + 1).desc
            label_dec2New.text = LocaleData.getCombatAttrs(Number(specialNewArr[1].id) + 1).desc

        } else if (specialNewArr.length > 0) {
            group_specialNew1.visible = true
            this.loadAttr(group_attr1New, specialNewArr[0])
            label_dec1New.text = LocaleData.getCombatAttrs(Number(specialNewArr[0].id) + 1).desc
        }
    }
    private onAddEvent(): void {
        let c1: fgui.Controller = this.uiPanel.getController("c1")
        c1.selectedIndex = this.battleEquips ? 0 : 1
        // 是否分解
        let btn_automatic: fgui.GButton = this.uiPanel.getChild("btn_automatic")
        btn_automatic.selected = LocaleUser.getUser(VarVal.FIELD_SV.EQUIP_BREAKDOWN) == "1"
        btn_automatic.onClick(() => {
            LocaleUser.setUser(VarVal.FIELD_SV.EQUIP_BREAKDOWN, btn_automatic.selected ? "1" : "0");
            LocaleUser.flush()
        })
        //分解
        let btn_breakdown: fgui.GButton = this.uiPanel.getChild("btn_breakdown")

        let onBreakdownClick = () => {
            AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFF_EQUIP_DECOMPOSE);
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    if (args.dropReward) {
                        // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyItemReward, 0, args.dropReward);
                    }
                    if (this.isAutomation) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAttachEquip, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips: true, data: this.forgeEquips, UpDateAutomation: true, isBreakdown: true });
                    } else {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAttachEquip, 0, null);
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips: true, data: this.forgeEquips, isBreakdown: true });
                    }
                } else {
                    if (args.errorcode == PErrCode.equip_forge_not_found || args.errorcode == PErrCode.equip_breakdown_empty) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips1: true });
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAttachEquip, 0, null);
                    }
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "breakdown", {
                equipIds: [this.forgeEquips.eid]
            })
        }

        btn_breakdown.onClick(() => {
            if (this.forgeEquips.diffCombatPower <= 0) {
                onBreakdownClick()
            } else {
                if (LyAttachEquip.isBreakdownCheckSel) {
                    onBreakdownClick()
                } else {
                    UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                        StrVal.LYATTACHEQUIP.STR8, null,
                        StrVal.COMMON.STR32, null,
                        StrVal.COMMON.STR33, (isCheckSel: boolean) => {
                            LyAttachEquip.isBreakdownCheckSel = isCheckSel;
                            onBreakdownClick()
                        }, "", null, {
                        checkBoxText: StrVal.COMMON.STR35
                    })
                }

            }
        })
        let onAttachClick = () => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    if (args.dropReward) {
                        // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyItemReward, 0, args.dropReward);
                    }
                    if (btn_automatic.selected) {
                        if (this.isAutomation) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAttachEquip, 0, null);
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips: true, isAttach: true, data: this.forgeEquips, UpDateAutomation: true });
                        } else {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAttachEquip, 0, null);
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips: true, isAttach: true, data: this.forgeEquips });
                        }
                    } else {
                        if (c1.selectedIndex == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips: true, data: this.forgeEquips });
                            this.initialize()
                        } else {
                            if (this.isAutomation) {
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAttachEquip, 0, null);
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips: true, data: this.forgeEquips, UpDateAutomation: true });
                            } else {
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAttachEquip, 0, null);
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips: true, data: this.forgeEquips });
                            }
                        }
                    }
                } else {
                    if (args.errorcode == PErrCode.equip_forge_not_found || args.errorcode == PErrCode.equip_breakdown_empty) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips1: true });
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAttachEquip, 0, null);
                    }
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "attachEquip", {
                breakdown: btn_automatic.selected ? 1 : 0,
                equipId: this.forgeEquips.eid
            })
        }
        //穿戴装备
        let btn_attach: fgui.GButton = this.uiPanel.getChild("btn_attach")
        btn_attach.onClick(() => {
            if (this.forgeEquips.diffCombatPower >= 0 || !btn_automatic.selected) {
                onAttachClick()
            } else {
                if (LyAttachEquip.isAttachCheckSel) {
                    onAttachClick()
                } else {
                    UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                        StrVal.LYATTACHEQUIP.STR9, null,
                        StrVal.COMMON.STR32, null,
                        StrVal.COMMON.STR33, (isCheckSel: boolean) => {
                            LyAttachEquip.isAttachCheckSel = isCheckSel;
                            onAttachClick()
                        }, "", null, {
                        checkBoxText: StrVal.COMMON.STR35
                    })
                }
            }
        })
        let btn_attach1: fgui.GButton = this.uiPanel.getChild("btn_attach1")
        btn_attach1.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    if (args.dropReward) {
                        // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyItemReward, 0, args.dropReward);
                    }
                    if (btn_automatic.selected) {
                        if (this.isAutomation) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAttachEquip, 0, null);
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips: true, data: this.forgeEquips, UpDateAutomation: true, isAttach1: true });
                        } else {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAttachEquip, 0, null);
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips: true, data: this.forgeEquips, isAttach1: true });
                        }
                    } else {
                        if (c1.selectedIndex == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips: true, data: this.forgeEquips, isAttach1: true });
                            this.initialize()
                        } else {
                            if (this.isAutomation) {
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAttachEquip, 0, null);
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips: true, data: this.forgeEquips, UpDateAutomation: true, isAttach1: true });
                            } else {
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAttachEquip, 0, null);
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips: true, data: this.forgeEquips, isAttach1: true });
                            }
                        }
                    }
                } else {
                    if (args.errorcode == PErrCode.equip_forge_not_found || args.errorcode == PErrCode.equip_breakdown_empty) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips1: true });
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyAttachEquip, 0, null);
                    }
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "attachEquip", {
                breakdown: btn_automatic.selected ? 1 : 0,
                equipId: this.forgeEquips.eid
            })
        })
    }
    private loadAttr(group: fgui.GComponent, data: any): void {
        let label_name: fgui.GLabel = group.getChild("label_name")
        label_name.text = StrVal.EQUIPATTR_NAMES[Number(data.id)]
        let label_num: fgui.GLabel = group.getChild("label_num")
        if (data.id > 3) {
            label_num.text = data.attr + "%"
        } else {
            label_num.text = data.attr
        }
        let img_icon: fgui.GLoader = group.getChild("img_icon")
        if (data.url) {
            img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [data.url]);
        }
    };
    public getIsViewMask(): boolean {
        return false;
    };

}