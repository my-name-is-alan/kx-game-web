//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { VarVal } from "../Values/VarVal";

export class LyPlayerTisp extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyPlayerInfo";
        this.viewResI.pkgName = "LyPlayerInfo";
        this.viewResI.comName = "LyPlayerTisp";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(_params: any): void {
        let type = _params.type //--1门客（我要变强），2//灵脉（我要变强）,3//灵兽（我要变强）
        this.uiPanel = this.getUiPanel()
        // UtilsUI.playCommonGroupAni(this.uiPanel, null)
        let btn_close = this.getUiPanel().getChild("btn_close")
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPlayerTisp, 0, null);
        })
        let group_elite: fgui.GComponent = this.uiPanel.getChild("group_elite")
        let group_gem1: fgui.GComponent = this.uiPanel.getChild("group_gem1")
        let proup_pet1: fgui.GComponent = this.uiPanel.getChild("proup_pet1")
        if (type == 1) {
            group_elite.visible = true
            let elitemonster = _params.data.data
            let list_elite: fgui.GList = group_elite.getChild("list_elite")


            list_elite.itemRenderer = ((index: number, child: fgui.GComponent) => {
                let mosterData = elitemonster[index];
                let monProto = LocaleData.getEliteMonsterProto(mosterData.protoId)
                let label_name: fgui.GLabel = child.getChild("label_name")
                label_name.text = monProto.name
                let item_elite: fgui.GComponent = child.getChild("item_elite")
                let loader_back: fgui.GLoader = item_elite.getChild("loader_back");
                loader_back.url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [monProto.quality]);
                let laoder_icon: fgui.GLoader = item_elite.getChild("loader_icon");
                laoder_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getModelShowInfo(monProto.modelId).icon_square]);
                let label_count: fgui.GLabel = item_elite.getChild("label_count");
                label_count.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR4, [mosterData.level])
                child.clearClick()
                child.onClick(() => {
                    loadData(index)
                })
            }).bind(this)
            list_elite.numItems = elitemonster.length
            // list_elite.selectedIndex = _params.data.index
            console.log(_params.data.index);
            let loadData = (index: number) => {
                let mosterData = elitemonster[index];
                let mosterLevelData = LocaleData.getEliteMonsterLevel(mosterData.protoId, mosterData.level)
                let skillData = LocaleData.getSkillProto(mosterLevelData.skill_id)
                let label_skillName: fgui.GLabel = group_elite.getChild("label_skillName")
                let label_skillLevel: fgui.GLabel = group_elite.getChild("label_skillLevel")
                let label_skillDec: fgui.GLabel = group_elite.getChild("label_skillDec", fgui.GComponent).getChild("label_dec")
                label_skillName.text = skillData.name
                label_skillDec.text = skillData.desc
                label_skillLevel.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR9, [mosterLevelData.level])
                let nowArrts: any[] = []
                for (const key in mosterLevelData) {
                    let isArrt = false
                    for (const key2 in StrVal.ELITEATTR_NAME) {
                        if (key == key2) {
                            isArrt = true
                            break
                        }
                    }
                    if (isArrt && mosterLevelData[key] != "0") {
                        let data = { id: key, num: Number(mosterLevelData[key]) }
                        nowArrts.push(data)
                    }
                }
                let list_attr: fgui.GList = group_elite.getChild("list_attr")
                list_attr.itemRenderer = ((index: number, child: fgui.GComponent) => {
                    let attr = nowArrts[index]
                    let label_name: fgui.GLabel = child.getChild("label_name")
                    label_name.text = StrVal.ELITEATTR_NAME[attr.id]
                    let label_attr: fgui.GLabel = child.getChild("label_attr")
                    label_attr.text = "+" + attr.num + "%"
                }).bind(this)
                list_attr.numItems = nowArrts.length
            }
            loadData(_params.data.index)
            let label_str102: fgui.GLabel = group_elite.getChild("label_str102")
            let label_str103: fgui.GLabel = group_elite.getChild("label_str103")
            // let label_str104: fgui.GLabel = proup_elite.getChild("label_str104")
            label_str102.text = StrVal.LYPLAYERINFO.STR102
            label_str103.text = StrVal.LYPLAYERINFO.STR103
            // label_str104.text = StrVal.LYPLAYERINFO.STR104
        } else if (type == 2) {
            group_gem1.visible = true
            let veinAttrSetId = _params.data
            let list_gen: fgui.GList = group_gem1.getChild("list_gen")
            let artSet: any = LocaleData.getVeinAttrSetById(veinAttrSetId)
            let label_str105: fgui.GLabel = group_gem1.getChild("label_str105")
            label_str105.text = artSet.name
            let skillIDs = artSet.skillId.split(",")
            list_gen.itemRenderer = ((index: number, child: fgui.GComponent) => {
                let label_name: fgui.GLabel = child.getChild("label_name")
                let label_dec: fgui.GLabel = child.getChild("label_dec")
                let skill = LocaleData.getSkillProto(skillIDs[index])
                label_name.text = UtilsTool.stringFormat("{0}({1})", [artSet.name, ((index + 1) + "/" + (artSet.number))])
                label_dec.text = skill.desc
            }).bind(this)
            list_gen.numItems = skillIDs.length
        } else if (type == 3) {
            proup_pet1.visible = true
            let petProtoId = _params.data
            let petRoot: any = LocaleData.getPetRoot()
            let pet = LocaleData.getPetProto(petProtoId)
            let group_icon: fgui.GComponent = proup_pet1.getChild("group_icon")
            let petData = LocaleData.getPetProto(petProtoId)
            if (petData) {
                let petModel = LocaleData.getModelItem(petData.modelId)
                if (petModel) {
                    group_icon.getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}", [petModel.avatar]);
                }
            }
            let label_name: fgui.GLabel = proup_pet1.getChild("label_name")
            label_name.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR5, [petRoot.level_limit, 0, pet.name])
            let petLevel: any = LocaleData.getPetLevelByIdLevel(petProtoId, petRoot.level_limit)
            let label_skill: fgui.GLabel = proup_pet1.getChild("label_skill")
            label_skill.text = pet.name
            let label_level: fgui.GLabel = proup_pet1.getChild("label_level")
            label_level.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR4, [petLevel.level])
            let label_skillDec: fgui.GLabel = proup_pet1.getChild("label_skillDec", fgui.GComponent).getChild("label_dec")
            label_skillDec.text = LocaleData.getSkillProto(petLevel.skill_id).desc
            let label_attrName1: fgui.GLabel = proup_pet1.getChild("label_attrName1")
            let label_attrName2: fgui.GLabel = proup_pet1.getChild("label_attrName2")
            let label_attrName3: fgui.GLabel = proup_pet1.getChild("label_attrName3")
            let label_attr1: fgui.GLabel = proup_pet1.getChild("label_attr1")
            let label_attr2: fgui.GLabel = proup_pet1.getChild("label_attr2")
            let label_attr3: fgui.GLabel = proup_pet1.getChild("label_attr3")
            let maxAttr = LocaleData.getPetMaxAttr(petProtoId)
            label_attrName1.text = StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.FINAL_HP]
            label_attr1.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR6, [maxAttr[0]])
            label_attrName2.text = StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.FINAL_ATTACK]
            label_attr2.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR6, [maxAttr[1]])
            label_attrName3.text = StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.FINAL_DEFENSE]
            label_attr3.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR6, [maxAttr[2]])
            let label_str106: fgui.GLabel = proup_pet1.getChild("label_str106")
            label_str106.text = StrVal.LYPLAYERINFO.STR106
            let label_str103: fgui.GLabel = proup_pet1.getChild("label_str103")
            label_str103.text = StrVal.LYPLAYERINFO.STR103
            let group_buffs: Array<fgui.GComponent> = []
            for (let i = 0; i < 4; i++) {
                let group_buff: fgui.GComponent = proup_pet1.getChild("group_buff" + (i + 1))
                group_buffs.push(group_buff)
            }
        }
    }


    public getIsViewMask(): boolean {
        return false;
    }
}


