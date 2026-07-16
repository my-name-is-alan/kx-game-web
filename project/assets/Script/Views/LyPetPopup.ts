//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServer } from "../Kernel/GameServer";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { LyPet } from "./LyPet";
import { GameServerData } from "../Kernel/GameServerData";
import { Color, TiledObjectGroup } from "cc";

export class LyPetPopup extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyPet";
        this.viewResI.pkgName = "LyPet";
        this.viewResI.comName = "LyPetPopup";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(_params: any): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        let btn_close = this.getUiPanel().getChild("btn_close")
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPetPopup, 0, null)
        })
        // this.petProto.refreshBuffSkill = [1, 105, 111, 1]
        let group_gl: fgui.GGraph = this.uiPanel.getChild("group_gl")
        let group_skill: fgui.GGraph = this.uiPanel.getChild("group_skill")
        let group_quality: fgui.GGraph = this.uiPanel.getChild("group_quality")
        if (_params.type == 1) { //概率
            group_gl.visible = true
            let qualityArr = LocaleData.getPetPool()
            let list_quality: fgui.GList = this.uiPanel.getChild("list_quality")
            list_quality.itemRenderer = ((index: number, obj: fgui.GComponent) => {
                obj.getChild("label_tage").text = qualityArr[index].qualityname
                obj.getChild("label_gv").text = qualityArr[index].weights + "%"
                obj.getChild("loader_bg", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/frame_gailvdi{0}", [Number(qualityArr[index].quality) + 1])
            }).bind(this)
            list_quality.numItems = qualityArr.length
        } else if (_params.type == 2) {//技能
            let label_title2: fgui.GLabel = this.uiPanel.getChild("label_title2")
            label_title2.text = StrVal.LYPET.STR133
            group_skill.visible = true
            let petSkill = []
            let arr: any = LocaleData.getPetLevelByIdId(_params.petData.protoId)
            for (let i = arr.length - 1; i >= 0; i--) {
                const element = arr[i];
                petSkill.push(element)
            }
            let list_skill: fgui.GList = this.uiPanel.getChild("list_skill")
            list_skill.itemRenderer = ((index: number, obj: fgui.GComponent) => {
                let petDec = LocaleData.getSkillProto(petSkill[index].skill_id)
                // obj.getChild("label_name").text = UtilsTool.stringFormat(StrVal.LYPET.STR113, [petDec.name, index + 1])
                obj.getChild("label_name").text = UtilsTool.stringFormat(StrVal.LYPET.STR113, [StrVal.LYPET.STR114, index + 1])
                obj.getChild("label_lock").text = petSkill[index].level == "1" ? StrVal.LYPET.STR111 : UtilsTool.stringFormat(StrVal.LYPET.STR112, [petSkill[index].level])
                obj.getChild("label_dec").text = petDec.desc
            }).bind(this)
            list_skill.numItems = petSkill.length
        } else if (_params.type == 3) {//buff品质
            let label_title3: fgui.GLabel = this.uiPanel.getChild("label_title3")
            label_title3.text = StrVal.LYPET.STR132
            group_quality.visible = true
            let buffArr = LocaleData.getPetBuffById("")

            let list_buff: fgui.GList = this.uiPanel.getChild("list_buff")
            list_buff.itemRenderer = ((index: number, obj: fgui.GComponent) => {
                let buffItem = {
                    buffId: buffArr[index].buffId,
                    buffLevel: 10
                }
                UtilsUI.onPetQualityItem(obj, buffItem)
            }).bind(this)
            list_buff.numItems = buffArr.length
        }

    }


    public getIsViewMask(): boolean {
        return false;
    }
}


