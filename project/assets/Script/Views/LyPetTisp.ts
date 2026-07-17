//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { VarVal } from "../Values/VarVal";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { applyPetTransferStars } from "./PetTransferDisplay";

export class LyPetTisp extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyPet";
        this.viewResI.pkgName = "LyPet";
        this.viewResI.comName = "LyPetTisp";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(_params: any): void {
        this.uiPanel = this.getUiPanel().getChild("group_petTisp")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)

        let btn_close = this.getUiPanel().getChild("btn_close")
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPetTisp, 0, null)
        })
        let pet = LocaleData.getPetProto(_params.pet.protoId)
        let img_quality: fgui.GLoader = this.uiPanel.getChild("img_quality")
        img_quality.url = UtilsTool.stringFormat("ui://LyPet/frame_quality{0}", [pet.quality]);
        let loader_spine: fgui.GLoader3D = this.uiPanel.getChild("loader_spine")
        new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, loader_spine, pet.modelId);
        let label_petName: fgui.GTextField = this.uiPanel.getChild("label_petName")
        label_petName.text = UtilsTool.stringFormat("[color={0}]{1}[/color]", [this.onColor(pet.quality), pet.name])
        let list_buff: fgui.GList = this.uiPanel.getChild("list_buff")

        list_buff.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            let petItem = _params.pet.buffSkill[index]
            UtilsUI.onPetQualityItem(obj, petItem)
            if (_params.type == 2) {
                let img_up: fgui.GImage = obj.getChild("img_up")
                let img_new: fgui.GImage = obj.getChild("img_new")
                img_up.visible = false
                img_new.visible = true
                for (let i = 0; i < _params.oldPet.buffSkill.length; i++) {
                    const oldPet = _params.oldPet.buffSkill[i];
                    if (petItem.buffId == oldPet.buffId) {
                        if (petItem.buffLevel != oldPet.buffLevel) {
                            img_up.visible = true
                        }
                        img_new.visible = false
                    }
                }
            }
        }).bind(this)
        list_buff.numItems = _params.pet.buffSkill.length

        let label_1str65: fgui.GLabel = this.uiPanel.getChild("label_1str65")
        label_1str65.text = StrVal.LYPET.STR65
        let label_2str65: fgui.GLabel = this.uiPanel.getChild("label_2str65")
        label_2str65.text = StrVal.LYPET.STR65
        list_buff.visible = false


        if (_params.type == 1) {
            //***************************召唤************************
            list_buff.visible = true
            let group_recruitpet: fgui.GGraph = this.uiPanel.getChild("group_recruitpet")
            group_recruitpet.visible = true

            let label_attr1: fgui.GLabel = this.uiPanel.getChild("label_attr1")
            label_attr1.text = UtilsTool.stringFormat(StrVal.LYPET.STR10, [_params.pet.healthPercentage])

            let label_attr2: fgui.GLabel = this.uiPanel.getChild("label_attr2")
            label_attr2.text = UtilsTool.stringFormat(StrVal.LYPET.STR11, [_params.pet.attackPercentage])

            let label_attr3: fgui.GLabel = this.uiPanel.getChild("label_attr3")
            label_attr3.text = UtilsTool.stringFormat(StrVal.LYPET.STR12, [_params.pet.defensePercentage])
        } else if (_params.type == 2) {
            list_buff.visible = true
            let c1: fgui.Controller = this.uiPanel.getController("c1")
            c1.selectedIndex = _params.oldPet.devourLevel == 0 ? 1 : 0

            let group_devourpet: fgui.GGraph = this.uiPanel.getChild("group_devourpet")
            group_devourpet.visible = true

            let label_attrOldName1: fgui.GLabel = this.uiPanel.getChild("label_attrOldName1")
            label_attrOldName1.text = StrVal.LYPET.STR19
            let label_attrOldAttr1: fgui.GLabel = this.uiPanel.getChild("label_attrOldAttr1")
            label_attrOldAttr1.text = "+" + _params.oldPet.healthPercentage + "%"

            let label_attrOldName2: fgui.GLabel = this.uiPanel.getChild("label_attrOldName2")
            label_attrOldName2.text = StrVal.LYPET.STR20
            let label_attrOldAttr2: fgui.GLabel = this.uiPanel.getChild("label_attrOldAttr2")
            label_attrOldAttr2.text = "+" + _params.oldPet.attackPercentage + "%"

            let label_attrOldName3: fgui.GLabel = this.uiPanel.getChild("label_attrOldName3")
            label_attrOldName3.text = StrVal.LYPET.STR21
            let label_attrOldAttr3: fgui.GLabel = this.uiPanel.getChild("label_attrOldAttr3")
            label_attrOldAttr3.text = "+" + _params.oldPet.defensePercentage + "%"

            let label_attrNew1: fgui.GLabel = this.uiPanel.getChild("label_attrNew1")
            label_attrNew1.text = UtilsTool.stringFormat(StrVal.LYPET.STR13, [_params.pet.healthPercentage])

            let label_attrNew2: fgui.GLabel = this.uiPanel.getChild("label_attrNew2")
            label_attrNew2.text = UtilsTool.stringFormat(StrVal.LYPET.STR13, [_params.pet.attackPercentage])

            let label_attrNew3: fgui.GLabel = this.uiPanel.getChild("label_attrNew3")
            label_attrNew3.text = UtilsTool.stringFormat(StrVal.LYPET.STR13, [_params.pet.defensePercentage])

            let group_starOld: fgui.GComponent = this.uiPanel.getChild("group_starOld")

            let starOldArr: fgui.GLoader[] = []
            for (let i = 1; i < 6; i++) {
                let starItem: fgui.GLoader = group_starOld.getChild("img_star" + i)
                starOldArr.push(starItem)
            }
            applyPetTransferStars(starOldArr, _params.oldPet.devourLevel)
            let group_starNew: fgui.GComponent = this.uiPanel.getChild("group_starNew")
            let starNewArr: fgui.GLoader[] = []
            for (let i = 1; i < 6; i++) {
                let starItem: fgui.GLoader = group_starNew.getChild("img_star" + i)
                starNewArr.push(starItem)
            }
            applyPetTransferStars(starNewArr, _params.pet.devourLevel)

        } else if (_params.type == 3) {
            let group_levelpet: fgui.GGroup = this.uiPanel.getChild("group_levelpet")
            group_levelpet.visible = true
            let label_level: fgui.GLabel = this.uiPanel.getChild("label_level")
            label_level.text = UtilsTool.stringFormat(StrVal.LYPET.STR9, [_params.pet.level - 1])
            let label_newLevel: fgui.GLabel = this.uiPanel.getChild("label_newLevel")
            label_newLevel.text = UtilsTool.stringFormat(StrVal.LYPET.STR9, [_params.pet.level])

            let label_attrName1: fgui.GLabel = this.uiPanel.getChild("label_attrName1")
            label_attrName1.text = StrVal.LYPET.STR19
            let label_attrLevel1: fgui.GLabel = this.uiPanel.getChild("label_attrLevel1")
            label_attrLevel1.text = "+" + _params.pet.healthPercentage + "%"

            let label_attrName2: fgui.GLabel = this.uiPanel.getChild("label_attrName2")
            label_attrName2.text = StrVal.LYPET.STR20
            let label_attrLevel2: fgui.GLabel = this.uiPanel.getChild("label_attrLevel2")
            label_attrLevel2.text = "+" + _params.pet.attackPercentage + "%"

            let label_attrName3: fgui.GLabel = this.uiPanel.getChild("label_attrName3")
            label_attrName3.text = StrVal.LYPET.STR21
            let label_attrLevel3: fgui.GLabel = this.uiPanel.getChild("label_attrLevel3")
            label_attrLevel3.text = "+" + _params.pet.defensePercentage + "%"

            let label_skill: fgui.GLabel = this.uiPanel.getChild("label_skill")
            let petLevel: any = LocaleData.getPetLevelByIdLevel(_params.pet.protoId, _params.pet.level)
            label_skill.text = LocaleData.getSkillProto(petLevel.skill_id).desc
            let label_str139: fgui.GLabel = this.uiPanel.getChild("label_str139")
            label_str139.text = StrVal.LYPET.STR139
        }

    }
    private onColor(quality): string {
        let colorStr = ""
        if (quality == 1) {
            colorStr = "#598b27"
        } else if (quality == 2) {
            colorStr = "#2f669f"
        } else if (quality == 3) {
            colorStr = "#6a388a"
        } else if (quality == 4) {
            colorStr = "#904a44"
        } else if (quality == 5) {
            colorStr = "#862017"
        }
        return colorStr
    }

    public getIsViewMask(): boolean {
        return false;
    }
}


