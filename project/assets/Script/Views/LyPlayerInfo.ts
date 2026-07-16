//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { LocaleData } from "../Kernel/LocaleData";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI, simplePlayerBase } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyDetailAttr, LyDetailAttrType } from "./LyDetailAttr";
import { LyTheurgyInfoPlayer } from "./LyTheurgyInfoPlayer";
import { GameServerData } from "../Kernel/GameServerData";

export class LyPlayerInfo extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyPlayerInfo";
        this.viewResI.pkgName = "LyPlayerInfo";
        this.viewResI.comName = "LyPlayerInfo";
    }
    private equipArr: any[]
    private list_equip: fgui.GList
    public onViewCreate(params): void {
        let uiPanel: fgui.GComponent = this.getUiPanel().getChild("group_playerInfo")
        UtilsUI.playCommonGroupAni(uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPlayerInfo, 0, null);
        })
        let btn_close1: fgui.GButton = uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPlayerInfo, 0, null);
        })
        let label_bxl: fgui.GLabel = uiPanel.getChild("label_bxl")
        label_bxl.text = StrVal.LYPLAYERINFO.STR111
        let label_str107: fgui.GLabel = uiPanel.getChild("label_str107")
        label_str107.text = StrVal.LYPLAYERINFO.STR107
        let simpleBase: simplePlayerBase = params.simpleBase
        let label_name: fgui.GLabel = uiPanel.getChild("label_name")
        label_name.text = simpleBase.name

        let label_level: fgui.GLabel = uiPanel.getChild("label_level")
        label_level.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR4, [simpleBase.level])
        
        let loader_phase: fgui.GComponent = uiPanel.getChild("loader_phase")
        UtilsUI.setTitleIconByTitleId(loader_phase, simpleBase.phase,simpleBase.title);

        let label_combatPower: fgui.GLabel = uiPanel.getChild("label_combatPower")
        label_combatPower.text = UtilsTool.nToFStr(simpleBase.combatPower)
        let label_serverid: fgui.GLabel = uiPanel.getChild("label_serverid")
        let serverItem = PlatformAPI.getGameServerItem(simpleBase.serverid);
        if (serverItem) {
            label_serverid.text = serverItem.name;
        } else {
            label_serverid.text = StrVal.LYQUNYIN.STR30
        }
        //装备
        this.equipArr = []
        let equipXmlArr: any[] = LocaleData.getSoltQualityProto("0")
        equipXmlArr.forEach(item1 => {
            let data: any = {
            }
            params.battleEquips.forEach(item2 => {
                if (item1.id == item2.slot) {
                    data.eid = item2.eid
                    data.cid = item2.cid
                    data.slot = item2.slot
                    data.quality = item2.quality
                    data.level = item2.level
                    data.attrs = item2.attrs
                }
            });
            this.equipArr.push(data)
        });
        this.list_equip = uiPanel.getChild("list_equip")
        let list_equip1: fgui.GList = uiPanel.getChild("list_equip1")
        let equipSlotArr = LocaleData.getSoltQualityProto("")
        list_equip1.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            obj.getChild("label_name").text = equipSlotArr[index].name
        }).bind(this)
        list_equip1.numItems = equipSlotArr.length
        this.list_equip.itemRenderer = ((index: number, obj: fgui.GButton) => {
            if (this.equipArr[index].eid) {
                obj.visible = true
                UtilsUI.setUIGroupEquip(this.equipArr[index], obj, () => {
                    if (UtilsTool.isNotEmptyObject(this.equipArr[index])) {
                        UtilsUI.showEquipInfo(obj, this.equipArr[index])
                    }
                });
            } else {
                obj.visible = false
            }
        }).bind(this)

        this.list_equip.numItems = 12
        //*************************************************/
        let basicAttrArr: number[] = [
            VarVal.ENTITIATTR.FINAL_HP,
            VarVal.ENTITIATTR.FINAL_ATTACK,
            VarVal.ENTITIATTR.FINAL_DEFENSE,
            VarVal.ENTITIATTR.FINAL_SPEED,
        ]
        let basicAttrArr2: number[] = [
            VarVal.ENTITIATTR.CHANCE_VERTIGO,
            VarVal.ENTITIATTR.CHANCE_CRITICAL,
            VarVal.ENTITIATTR.CHANCE_COMBO,
            VarVal.ENTITIATTR.CHANCE_MISS,
            VarVal.ENTITIATTR.CHANCE_COUNTER,
            VarVal.ENTITIATTR.CHANGE_VAMPIRE,
        ]
        let list_basicAttr: fgui.GList = uiPanel.getChild("list_basicAttr")
        list_basicAttr.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let val = params.simpleBase.playerEntityAttr[basicAttrArr[index] - 1];
            let str: string = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR6, [StrVal.ENTITI_NAMES[basicAttrArr[index]], UtilsTool.nToFStr(val)])
            obj.getChild("label_txt").text = str
        }).bind(this)
        list_basicAttr.numItems = basicAttrArr.length
        let list_basicAttr2: fgui.GList = uiPanel.getChild("list_basicAttr2")
        list_basicAttr2.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let val = params.simpleBase.playerEntityAttr[basicAttrArr2[index] - 1];
            let str: string = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR6, [StrVal.ENTITI_NAMES[basicAttrArr2[index]], UtilsTool.nToFStr(val)])
            obj.getChild("label_txt").text = UtilsTool.stringFormat("{0}%", [str])
        }).bind(this)
        list_basicAttr2.numItems = basicAttrArr2.length
        let btn_mount: fgui.GButton = uiPanel.getChild("btn_mount")
        btn_mount.touchable = false
        let fullInfoMount = params.mount;
        if (fullInfoMount && fullInfoMount.tid) {
            let mountInfo = LocaleData.getMountShowResInfo(fullInfoMount.tid, fullInfoMount.cid);
            if (mountInfo && mountInfo.thumbnail) {
                btn_mount.icon = UtilsTool.stringFormat("ui://CCommon/{0}", [mountInfo.thumbnail]);
                btn_mount.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR10, [fullInfoMount.stage, fullInfoMount.level])
                btn_mount.touchable = true
            }
        }
        let isMount: boolean = true
        let proup_mount = fgui.UIPackage.createObject("LyPlayerInfo", "proup_mount").asCom
        btn_mount.getChild("label_name").text = LocaleData.getActivation(VarVal.SYSYTEM_ID.mount).name
        btn_mount.onClick(() => {
            if (isMount) {
                isMount = false
                let img_icon: fgui.GLoader = proup_mount.getChild("img_icon")
                let mountIcon = LocaleData.getMountShowResInfo(fullInfoMount.tid, fullInfoMount.cid);
                img_icon.icon = UtilsTool.stringFormat("ui://CCommon/{0}", [mountIcon.thumbnail]);
                let label_baseName1: fgui.GLabel = proup_mount.getChild("label_baseName1")
                let label_baseName2: fgui.GLabel = proup_mount.getChild("label_baseName2")
                let label_baseName3: fgui.GLabel = proup_mount.getChild("label_baseName3")
                let label_base1: fgui.GLabel = proup_mount.getChild("label_base1")
                let label_base2: fgui.GLabel = proup_mount.getChild("label_base2")
                let label_base3: fgui.GLabel = proup_mount.getChild("label_base3")
                let stageItem = LocaleData.getMountStageItem(fullInfoMount.stage);
                let base1Curr = Number(stageItem.hp) + fullInfoMount.level * Number(stageItem.g_hp);
                label_baseName1.text = StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.FINAL_HP]
                label_base1.text = String(base1Curr)
                let base2Curr = Number(stageItem.atk) + fullInfoMount.level * Number(stageItem.g_atk);
                label_baseName2.text = StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.FINAL_ATTACK]
                label_base2.text = String(base2Curr)
                let base3Curr = Number(stageItem.def) + fullInfoMount.level * Number(stageItem.g_def);
                label_baseName3.text = StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.FINAL_DEFENSE]
                label_base3.text = String(base3Curr)
                let label_str100: fgui.GLabel = proup_mount.getChild("label_str100")
                label_str100.text = StrVal.LYPLAYERINFO.STR100
                let label_str101: fgui.GLabel = proup_mount.getChild("label_str101")
                label_str101.text = StrVal.LYPLAYERINFO.STR101
                let label_name: fgui.GLabel = proup_mount.getChild("label_name")
                let mountInfo = LocaleData.getMountShowResInfo(simpleBase.mountType, simpleBase.mountSkin);
                label_name.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR2, [mountInfo.name, fullInfoMount.stage, fullInfoMount.level])
                let label_attrName1: fgui.GLabel = proup_mount.getChild("label_attrName1")
                let label_attrName2: fgui.GLabel = proup_mount.getChild("label_attrName2")
                let label_attrName3: fgui.GLabel = proup_mount.getChild("label_attrName3")
                let label_attrName4: fgui.GLabel = proup_mount.getChild("label_attrName4")
                let label_attrName5: fgui.GLabel = proup_mount.getChild("label_attrName5")
                let label_attrName6: fgui.GLabel = proup_mount.getChild("label_attrName6")
                let label_attr1: fgui.GLabel = proup_mount.getChild("label_attr1")
                let label_attr2: fgui.GLabel = proup_mount.getChild("label_attr2")
                let label_attr3: fgui.GLabel = proup_mount.getChild("label_attr3")
                let label_attr4: fgui.GLabel = proup_mount.getChild("label_attr4")
                let label_attr5: fgui.GLabel = proup_mount.getChild("label_attr5")
                let label_attr6: fgui.GLabel = proup_mount.getChild("label_attr6")
                label_attrName1.text = StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.RESISTANCE_VERTIGO]
                label_attr1.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR1, [stageItem.resis]);
                label_attrName2.text = StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.RESISTANCE_CRITICAL]
                label_attr2.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR1, [stageItem.resis]);
                label_attrName3.text = StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.RESISTANCE_COMBO]
                label_attr3.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR1, [stageItem.resis]);
                label_attrName4.text = StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.RESISTANCE_MISS]
                label_attr4.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR1, [stageItem.resis]);
                label_attrName5.text = StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.RESISTANCE_COUNTER]
                label_attr5.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR1, [stageItem.resis]);
                label_attrName6.text = StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.RESISTANCE_VAMPIRE]
                label_attr6.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR1, [stageItem.resis]);
            }
            fgui.GRoot.inst.showPopup(proup_mount)
            proup_mount.setPosition(fgui.GRoot.inst.width / 2 - proup_mount.width / 2, fgui.GRoot.inst.height / 2 - proup_mount.height / 2)
        })
        //***************************灵脉**********************/
        let veinInfo: any = params.veinInfo
        let btn_gem: fgui.GButton = uiPanel.getChild("btn_gem")
        btn_gem.touchable = false
        if (veinInfo && veinInfo.veinLevel) {
            if (veinInfo.battleGems.length > 0) {
                btn_gem.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR9, [veinInfo.veinLevel])
                btn_gem.getChild("label_name").text = LocaleData.getActivation(VarVal.SYSYTEM_ID.gem).name
                btn_gem.icon = "ui://CCommon/z_miji_Soul"
                btn_gem.touchable = true
            }
        }
        btn_gem.getChild("label_name").text = LocaleData.getActivation(VarVal.SYSYTEM_ID.gem).name
        let proup_gem = fgui.UIPackage.createObject("LyPlayerInfo", "proup_gem").asCom
        let isGem: boolean = true
        btn_gem.onClick(() => {
            fgui.GRoot.inst.showPopup(proup_gem)
            proup_gem.setPosition(fgui.GRoot.inst.width / 2 - proup_gem.width / 2, fgui.GRoot.inst.height / 2 - proup_gem.height / 2)
            if (isGem) {
                isGem = false
                let group_icon: fgui.GComponent = proup_gem.getChild("group_icon")
                group_icon.getChild("loader_icon", fgui.GLoader).url = "ui://CCommon/z_miji_Soul"
                let label_name: fgui.GLabel = proup_gem.getChild("label_name")
                label_name.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR7, [veinInfo.veinLevel])
                let attrArr: number[] = [
                    VarVal.ENTITIATTR.FINAL_HP,
                    VarVal.ENTITIATTR.FINAL_ATTACK,
                    VarVal.ENTITIATTR.FINAL_DEFENSE,
                    VarVal.ENTITIATTR.FINAL_SPEED,
                    VarVal.ENTITIATTR.CHANCE_COMBO,
                    VarVal.ENTITIATTR.CHANCE_CRITICAL,
                    VarVal.ENTITIATTR.RESISTANCE_COMBO,
                    VarVal.ENTITIATTR.RESISTANCE_CRITICAL,
                    VarVal.ENTITIATTR.CHANCE_MISS,
                    VarVal.ENTITIATTR.CHANCE_VERTIGO,
                    VarVal.ENTITIATTR.RESISTANCE_MISS,
                    VarVal.ENTITIATTR.RESISTANCE_VERTIGO,
                    VarVal.ENTITIATTR.CHANCE_COUNTER,
                    VarVal.ENTITIATTR.CHANGE_VAMPIRE,
                    VarVal.ENTITIATTR.RESISTANCE_COUNTER,
                    VarVal.ENTITIATTR.RESISTANCE_VAMPIRE,
                ]
                let list_errArr: fgui.GList = proup_gem.getChild("list_errArr")
                list_errArr.itemRenderer = ((index: number, child: fgui.GComponent) => {
                    let label_name: fgui.GLabel = child.getChild("label_name")
                    label_name.text = StrVal.ENTITI_NAMES[attrArr[index]]
                    let label_attr: fgui.GLabel = child.getChild("label_attr")
                    if (index < 4) {
                        label_attr.text = "+" + UtilsTool.nToFStr(veinInfo.attrs[index])
                    } else {
                        label_attr.text = "+" + UtilsTool.nToFStr(veinInfo.attrs[index]) + "%"
                    }
                }).bind(this)

                list_errArr.numItems = attrArr.length
                let list_gen: fgui.GList = proup_gem.getChild("list_gen")
                let tz: any[] = []
                for (let index = 0; index < veinInfo.battleGems.length; index++) {
                    let gem = veinInfo.battleGems[index]
                    if (gem.setId) {
                        let have = false
                        for (let index = 0; index < tz.length; index++) {
                            let element = tz[index];
                            if (element.id == gem.setId) {
                                element.num = element.num + 1
                                have = true
                            }
                        }
                        if (!have) {
                            let data = { id: gem.setId, num: 1 }
                            tz.push(data)
                        }
                    }
                }
                list_gen.itemRenderer = ((index: number, child: fgui.GComponent) => {
                    let label_name: fgui.GLabel = child.getChild("label_name")
                    let label_dec: fgui.GLabel = child.getChild("label_dec")
                    let artSet = LocaleData.getVeinAttrSetById(tz[index].id)
                    let skillIDs = artSet.skillId.split(",")
                    let skill = LocaleData.getSkillProto(skillIDs[tz[index].num - 1])
                    label_name.text = UtilsTool.stringFormat("{0}({1})", [artSet.name, tz[index].num])
                    label_dec.text = skill.desc
                }).bind(this)
                list_gen.numItems = tz.length
                let label_str105: fgui.GLabel = proup_gem.getChild("label_str105")
                label_str105.text = StrVal.LYPLAYERINFO.STR105
            }
        })
        //***************************精怪**********************/
        let elitemonster: any = params.elitemonster
        let btn_elite: fgui.GButton = uiPanel.getChild("btn_elite")

        let proup_elite = fgui.UIPackage.createObject("LyPlayerInfo", "proup_elite").asCom
        let isElite: boolean = true
        btn_elite.getChild("label_name").text = LocaleData.getActivation(VarVal.SYSYTEM_ID.elite).name
        btn_elite.touchable = elitemonster && elitemonster.length > 0
        if (elitemonster && elitemonster.length > 0) {
            for (let index = 0; index < elitemonster.length; index++) {
                let element = elitemonster[index];
                let proto = LocaleData.getEliteMonsterProto(element.protoId)
                let level = element.level
                let eliteModel = LocaleData.getModelItem(proto.modelId)
                if (eliteModel) {
                    btn_elite.icon = UtilsTool.stringFormat("ui://CCommon/{0}", [eliteModel.avatar]);
                    btn_elite.getChild("loader_bg", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [Number(proto.quality)]);
                }
                btn_elite.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR9, [level])
                break;
            }
        }
        btn_elite.onClick(() => {
            if (isElite) {
                isElite = false
                let list_elite: fgui.GList = proup_elite.getChild("list_elite")
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
                let loadData = (index: number) => {
                    let mosterData = elitemonster[index];
                    let mosterLevelData = LocaleData.getEliteMonsterLevel(mosterData.protoId, mosterData.level)
                    let skillData = LocaleData.getSkillProto(mosterLevelData.skill_id)
                    let label_skillName: fgui.GLabel = proup_elite.getChild("label_skillName")
                    let label_skillLevel: fgui.GLabel = proup_elite.getChild("label_skillLevel")
                    let label_skillDec: fgui.GLabel = proup_elite.getChild("label_skillDec", fgui.GComponent).getChild("label_dec")
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
                    let list_attr: fgui.GList = proup_elite.getChild("list_attr")
                    list_attr.itemRenderer = ((index: number, child: fgui.GComponent) => {
                        let attr = nowArrts[index]
                        let label_name: fgui.GLabel = child.getChild("label_name")
                        label_name.text = StrVal.ELITEATTR_NAME[attr.id]
                        let label_attr: fgui.GLabel = child.getChild("label_attr")
                        label_attr.text = "+" + attr.num + "%"
                    }).bind(this)
                    list_attr.numItems = nowArrts.length
                }
                loadData(0)
                let label_str102: fgui.GLabel = proup_elite.getChild("label_str102")
                let label_str103: fgui.GLabel = proup_elite.getChild("label_str103")
                // let label_str104: fgui.GLabel = proup_elite.getChild("label_str104")
                label_str102.text = StrVal.LYPLAYERINFO.STR102
                label_str103.text = StrVal.LYPLAYERINFO.STR103
                // label_str104.text = StrVal.LYPLAYERINFO.STR104
            }
            fgui.GRoot.inst.showPopup(proup_elite)
            proup_elite.setPosition(fgui.GRoot.inst.width / 2 - proup_elite.width / 2, fgui.GRoot.inst.height / 2 - proup_elite.height / 2)
        })
        //***************************灵兽**********************/
        let petInfo: any = params.petInfo
        let btn_pet: fgui.GButton = uiPanel.getChild("btn_pet")
        btn_pet.getChild("label_name").text = LocaleData.getActivation(VarVal.SYSYTEM_ID.pet).name
        if (petInfo && petInfo.protoId) {
            btn_pet.touchable = true
            let petData = LocaleData.getPetProto(petInfo.protoId)
            if (petData) {
                let petModel = LocaleData.getModelItem(petData.modelId)
                if (petModel) {
                    btn_pet.icon = UtilsTool.stringFormat("ui://CCommon/{0}", [petModel.avatar]);
                }
                btn_pet.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR9, [petInfo.level])
            }
        } else {
            btn_pet.touchable = false
        }
        let isPet: boolean = true
        let proup_pet = fgui.UIPackage.createObject("LyPlayerInfo", "proup_pet").asCom
        btn_pet.onClick(() => {
            if (isPet) {
                isPet = false
                let pet = LocaleData.getPetProto(petInfo.protoId)
                let group_icon: fgui.GComponent = proup_pet.getChild("group_icon")
                let petData = LocaleData.getPetProto(petInfo.protoId)
                if (petData) {
                    let petModel = LocaleData.getModelItem(petData.modelId)
                    if (petModel) {
                        group_icon.getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}", [petModel.avatar]);
                    }
                }
                let label_name: fgui.GLabel = proup_pet.getChild("label_name")
                label_name.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR5, [petInfo.level, petInfo.tier, pet.name])
                let petLevel: any = LocaleData.getPetLevelByIdLevel(petInfo.protoId, petInfo.level)
                let label_skill: fgui.GLabel = proup_pet.getChild("label_skill")
                label_skill.text = pet.name
                let label_level: fgui.GLabel = proup_pet.getChild("label_level")
                label_level.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR4, [petLevel.level])
                let label_skillDec: fgui.GLabel = proup_pet.getChild("label_skillDec", fgui.GComponent).getChild("label_dec")
                label_skillDec.text = LocaleData.getSkillProto(petLevel.skill_id).desc
                let label_attrName1: fgui.GLabel = proup_pet.getChild("label_attrName1")
                let label_attrName2: fgui.GLabel = proup_pet.getChild("label_attrName2")
                let label_attrName3: fgui.GLabel = proup_pet.getChild("label_attrName3")
                let label_attr1: fgui.GLabel = proup_pet.getChild("label_attr1")
                let label_attr2: fgui.GLabel = proup_pet.getChild("label_attr2")
                let label_attr3: fgui.GLabel = proup_pet.getChild("label_attr3")
                label_attrName1.text = StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.FINAL_HP]
                label_attr1.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR6, [petInfo.healthPercentage])
                label_attrName2.text = StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.FINAL_ATTACK]
                label_attr2.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR6, [petInfo.attackPercentage])
                label_attrName3.text = StrVal.ENTITI_NAMES[VarVal.ENTITIATTR.FINAL_DEFENSE]
                label_attr3.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR6, [petInfo.defensePercentage])
                let label_str106: fgui.GLabel = proup_pet.getChild("label_str106")
                label_str106.text = StrVal.LYPLAYERINFO.STR106
                let label_str103: fgui.GLabel = proup_pet.getChild("label_str103")
                label_str103.text = StrVal.LYPLAYERINFO.STR103

                let group_buffs: Array<fgui.GComponent> = []
                for (let i = 0; i < 4; i++) {
                    let group_buff: fgui.GComponent = proup_pet.getChild("group_buff" + (i + 1))
                    group_buffs.push(group_buff)
                }
                for (let i = 0; i < petInfo.buffSkill.length; i++) {
                    let item = petInfo.buffSkill[i];
                    let group_buff = group_buffs[i]
                    UtilsUI.onPetQualityItem(group_buff, item)
                    // if (pet.refreshBuffSkill.length > 0) {
                    //     let group_suo = group_buff.getChild("group_suo")
                    //     group_suo.visible = pet.refreshBuffSkill[i] == 1
                    // }
                }

            }
            fgui.GRoot.inst.showPopup(proup_pet)
            proup_pet.setPosition(fgui.GRoot.inst.width / 2 - proup_pet.width / 2, fgui.GRoot.inst.height / 2 - proup_pet.height / 2)
        })
        let btn_treasure: fgui.GButton = uiPanel.getChild("btn_treasure")
        btn_treasure.getChild("label_name").text = StrVal.LYMAINPAGE.STR21
        let btn_arrows: fgui.GButton = uiPanel.getChild("btn_arrows")
        btn_arrows.text = StrVal.LYPLAYERINFO.STR108
        btn_arrows.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDetailAttr, 0, { type: LyDetailAttrType.MAINPAGE, attr: simpleBase.playerEntityAttr });
        })

        let theRoot: any = LocaleData.getTheurgyRoot();
        let theurgies = params.battleTheurgy
        let useTheurgs: any[] = new Array(4)
        let typeTheurgs: any[] = new Array(4)
        useTheurgs = new Array(4)
        for (let index = 0; index < theurgies.length; index++) {
            let element = theurgies[index];
            if (element.status == 0) {
                typeTheurgs[Number(element.type) - 1].push(element)
            } else {
                useTheurgs[Number(element.type) - 1] = element
            }
        }
        let loader_useTheurgy: fgui.GComponent[] = []
        for (let index = 0; index < 4; index++) {
            let loader_use: fgui.GComponent = uiPanel.getChild("loader_use" + index)
            loader_useTheurgy.push(loader_use)
        }
        let group_theurgy: fgui.GComponent = uiPanel.getChild("group_theurgy")
        let label_noTheurgy: fgui.GLabel = uiPanel.getChild("label_noTheurgy")
        group_theurgy.visible = theurgies.length > 0
        label_noTheurgy.visible = theurgies.length == 0
        for (let index = 0; index < loader_useTheurgy.length; index++) {
            let nowGroup: fgui.GComponent = loader_useTheurgy[index]
            let loader_icon: fgui.GLoader = nowGroup.getChild("loader_icon")
            let loader_qua: fgui.GLoader = nowGroup.getChild("loader_qua")
            let loader_part: fgui.GLoader = nowGroup.getChild("loader_part")
            let loader_seal1: fgui.GLoader = nowGroup.getChild("loader_seal1")
            let loader_seal2: fgui.GLoader = nowGroup.getChild("loader_seal2")
            let loaer_stage: fgui.GLoader = nowGroup.getChild("loaer_stage")
            let label_name: fgui.GLabel = nowGroup.getChild("label_name")
            let label_stage: fgui.GLabel = nowGroup.getChild("label_stage");
            let group_all: fgui.GGroup = nowGroup.getChild("all")
            nowGroup.getChild("label_partName", fgui.GLabel).text = StrVal.LYTHEURGYNMAE2[index]
            if (useTheurgs[index] != undefined) {
                group_all.visible = true
                let theurgyInst = useTheurgs[index]
                let theProto = LocaleData.getTheurgyById(theurgyInst.cfgId);
                loader_icon.url = UtilsUI.getTheurgyIconUrl(theProto);
                loader_part.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_yuan{0}", [theProto.quality])
                loaer_stage.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_grade{0}", [theProto.quality])
                loader_qua.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_mj{0}", [theProto.quality])
                label_name.text = theProto.name
                label_stage.text = theurgyInst.level
                nowGroup.clearClick()
                nowGroup.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyInfoPlayer, 0, { theurgyInst: theurgyInst })
                })
                loader_seal1.visible = false
                loader_seal2.visible = false
                loader_seal2.visible = theurgyInst.level > Number(theRoot.seal1Level)
                loader_seal1.visible = theurgyInst.level > Number(theRoot.seal2Level)
                if (theurgyInst.seal.length > 0) {
                    loader_seal2.visible = true
                    if (theurgyInst.seal[0] != 0) {
                        let sealProto = LocaleData.getTheurgSealByItemId(theurgyInst.seal[0])
                        loader_seal2.url = UtilsTool.stringFormat("ui://LyTheurgy/icon_seal{0}", [sealProto.quality]);
                    } else {
                        loader_seal2.url = "ui://LyTheurgy/icon_seal0"
                    }
                }
                if (theurgyInst.seal.length > 1) {
                    if (theurgyInst.seal[1] != 0) {
                        let sealProto = LocaleData.getTheurgSealByItemId(theurgyInst.seal[1])
                        loader_seal1.url = UtilsTool.stringFormat("ui://LyTheurgy/icon_seal{0}", [sealProto.quality]);
                    } else {
                        loader_seal1.url = "ui://LyTheurgy/icon_seal0"
                    }
                    loader_seal1.visible = true
                }
            }
            else {
                group_all.visible = false
            }
        }
        let btn_blockPlayer: fgui.GButton = uiPanel.getChild("btn_blockPlayer")
        btn_blockPlayer.visible = params.simpleBase.guid != GameServerData.getInstance().getPlayerFullInfo().base.guid
        btn_blockPlayer.onClick(() => {
            if (!GameServerData.getInstance().isPlayerBlacklist(params.simpleBase.guid)) {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                    UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR8, [simpleBase.name]), null,
                    StrVal.COMMON.STR32, null,
                    StrVal.COMMON.STR33, () => {
                        UtilsUI.lockWait();
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait();
                            if (args.errorcode == 0) {
                            } else {
                                UtilsUI.showMsgTip(args.errorcode);
                            }
                        }, "blockPlayer", { flag: 1, counterId: params.simpleBase.guid });
                    }, "", null)
            } else {
                UtilsUI.showMsgTip(StrVal.LYPLAYERINFO.STR110);
            }
        })
        //角色显示
        let charInfo = LocaleData.getCharShowResInfo(simpleBase.character, simpleBase.phase, simpleBase.appearance, simpleBase.avatar);
        let mountInfo = LocaleData.getMountShowResInfo(simpleBase.mountType, simpleBase.mountSkin);

        let group_head: fgui.GComponent = uiPanel.getChild("group_head");
        let loader_icon: fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);

        let group_spine_ram: fgui.GComponent = uiPanel.getChild("group_spine_ram")
        new SpineRoldMountPlayer(group_spine_ram).loadSpineRole(charInfo).loadSpineMount(mountInfo);
        if (petInfo && petInfo.protoId) {
            let petProto = LocaleData.getPetProto(petInfo.protoId);
            new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }, uiPanel.getChild("loader_spine_pet"), petProto.modelId);
        } else { group_spine_ram.x = 485 }
        //宗门信息
        let group_clan: fgui.GGroup = uiPanel.getChild("group_clan")
        group_clan.visible = false
        if (params.clanInfo && params.clanInfo.number) {
            group_clan.visible = true
            let img_flag: fgui.GLoader = uiPanel.getChild("img_flag")
            img_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getClanFlagById(params.clanInfo.flag).icon])
            let label_clanName: fgui.GLabel = uiPanel.getChild("label_clanName")
            label_clanName.text = params.clanInfo.name
            let label_clanNum: fgui.GLabel = uiPanel.getChild("label_clanNum")
            let ClanXmlData = LocaleData.getClanByLevel(params.clanInfo.level)
            label_clanNum.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR3, [params.clanInfo.number, ClanXmlData.number])
            let label_clanLevel: fgui.GLabel = uiPanel.getChild("label_clanLevel")
            label_clanLevel.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR4, [params.clanInfo.level])
        }
        let label_ip: fgui.GLabel = uiPanel.getChild("label_ip")
        if (simpleBase.ip) {
            PlatformAPI.getIPAddress((address: string) => {
                if (!label_ip.isDisposed && address) {
                    label_ip.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR9, [address]);
                }
            }, simpleBase.ip);
        }
    }
    public getIsViewMask(): boolean {
        return false;
    };

}