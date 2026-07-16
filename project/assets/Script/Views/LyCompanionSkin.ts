//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyDetailAttr, LyDetailAttrType } from "./LyDetailAttr";

export class LyCompanionSkin extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyCompanion";
        this.viewResI.pkgName = "LyCompanion";
        this.viewResI.comName = "LyCompanionSkin";
    }
    private uiPanel: fgui.GComponent
    private companionXml: any
    private companionSkins: any//已拥有兽友皮肤
    private companionsItem: any//选中的兽友
    private skinArr: any
    private selectIndex: number = 0
    private btn_changeSkin: fgui.GButton
    private btn_lockSkin: fgui.GButton
    private btn_upLevelSkin: fgui.GButton
    private companionId: number
    private companionAttrs: any
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel()
        this.companionId = params.companionId
        // 关闭
        let btn_close: fgui.GButton = this.uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCompanionSkin, 0, null);
        })
        this.btn_lockSkin = this.uiPanel.getChild("btn_lockSkin")
        this.btn_lockSkin.text = StrVal.LYCOMPANION.STR15
        this.btn_changeSkin = this.uiPanel.getChild("btn_changeSkin")
        this.btn_changeSkin.text = StrVal.LYCOMPANION.STR25
        this.btn_upLevelSkin = this.uiPanel.getChild("btn_upLevelSkin")
        this.btn_upLevelSkin.text = StrVal.LYCOMPANION.STR37
        this.uiPanel.getChild("label_str45", fgui.GLabel).text = StrVal.LYCOMPANION.STR45
        this.uiPanel.getChild("label_str26", fgui.GLabel).text = StrVal.LYCOMPANION.STR26
        this.btn_lockSkin.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    this.initialize()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "unlockCompanionSkin", {
                skinId: Number(this.skinArr[this.selectIndex].id),
            });
        })
        this.btn_changeSkin.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    this.initialize()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "changeCompanionSkin", {
                skinId: Number(this.skinArr[this.selectIndex].id),
                companionId: this.companionId
            });
        })
        this.btn_upLevelSkin.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    this.initialize()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "unlockCompanionSkin", {
                skinId: Number(this.skinArr[this.selectIndex].id),
            });
        })
        this.initialize()
    };
    private initialize(): void {
        let companionData = GameServerData.getInstance().getPlayerFullInfo().companionData
        let btn_attr: fgui.GButton = this.uiPanel.getChild("btn_attr")
        btn_attr.clearClick()
        btn_attr.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDetailAttr, 0, { type: LyDetailAttrType.COMPANION, attr: companionData.companionSkinAttrs });
        })
        this.companionSkins = companionData.companionSkins
        let companions = companionData.companions
        this.companionAttrs = companionData.companions
        for (let i = 0; i < companions.length; i++) {
            const element = companions[i];
            if (element.companionId == this.companionId) {
                this.companionsItem = element
            }
        }
        this.companionXml = LocaleData.getCompanionById(this.companionId)
        let skinItem = {
            id: 0,
            name: this.companionXml.name,
            attrValue: 0,
            modelId: this.companionXml.modelId
        }
        this.skinArr = LocaleData.getCompanionSkin(this.companionXml.id)
        this.skinArr.unshift(skinItem)
        let list_skin: fgui.GList = this.uiPanel.getChild("list_skin")
        list_skin.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            let data: any = this.skinArr[index]
            let label_skinName: fgui.GLabel = obj.getChild("label_skinName")
            let loader_qu: fgui.GLoader = obj.getChild("loader_qu")
            label_skinName.text = data.name
            let group_use: fgui.GGroup = obj.getChild("group_use")
            group_use.visible = false
            if (this.companionsItem && this.companionsItem.skinId) {
                if (data.id == this.companionsItem.skinId) {
                    group_use.visible = true
                }
            } else {
                if (data.id == 0) {
                    group_use.visible = true
                }
            }
            label_skinName.visible = !group_use.visible
            if (data.quality) {
                loader_qu.url = UtilsTool.stringFormat("ui://LyCompanion/companion_bg{0}", [data.quality]);
            } else {
                loader_qu.url = "ui://LyCompanion/companion_bg1";
            }
            let img_lock: fgui.GImage = obj.getChild("img_lock")
            img_lock.visible = data.id != 0
            for (let i = 0; i < this.companionSkins.length; i++) {
                let item: any = this.companionSkins[i]
                if (item.skinId == data.id) {
                    //已拥有
                    img_lock.visible = false
                }
            }
            let img_icon: fgui.GLoader = obj.getChild("img_icon")
            let models = LocaleData.getModelItem(data.modelId)
            img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [models.thumbnail]);
            obj.clearClick()
            obj.onClick(() => {
                if (this.selectIndex == index) {
                    return
                }
                this.loadSkill(index)
            })
        }).bind(this)
        list_skin.numItems = this.skinArr.length
        list_skin.selectedIndex = 0
        let label_skinNum: fgui.GLabel = this.uiPanel.getChild("label_skinNum")
        let companionSkinNum: number = 0
        for (let i = 0; i < this.companionSkins.length; i++) {
            for (let j = 0; j < this.skinArr.length; j++) {
                if (this.companionSkins[i].skinId == this.skinArr[j].id) {
                    companionSkinNum++
                }
            }
        }
        label_skinNum.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR11, [companionSkinNum + 1, this.skinArr.length])
        this.loadSkill(this.selectIndex)
    }

    private loadSkill(index: number): void {
        this.selectIndex = index
        let selectSkill: any//选中的皮肤companionSkins
        let label_lockDesc: fgui.GTextField = this.uiPanel.getChild("label_lockDesc")
        let img_lockDesc: fgui.GLoader = this.uiPanel.getChild("img_lockDesc")
        let label_upLevelDesc: fgui.GTextField = this.uiPanel.getChild("label_upLevelDesc")
        let img_upLevelDesc: fgui.GLoader = this.uiPanel.getChild("img_upLevelDesc")
        let group_lockSkin: fgui.GGroup = this.uiPanel.getChild("group_lockSkin")// 未解锁
        let group_changeSkin: fgui.GGroup = this.uiPanel.getChild("group_changeSkin")//穿戴
        let group_upLevelSkin: fgui.GGroup = this.uiPanel.getChild("group_upLevelSkin")//升级
        if (this.companionsItem) {
            group_changeSkin.visible = this.skinArr[this.selectIndex].id != this.companionsItem.skinId
        } else {
            group_changeSkin.visible = false
        }
        if (this.skinArr[this.selectIndex].id != 0) {
            let companionSkin = LocaleData.getCompanionSkinById(this.skinArr[this.selectIndex].id)
            let unlockItemNum = GameServerData.getInstance().getItemCountByProtoId(companionSkin.unlockItemId)
            label_lockDesc.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR12, [unlockItemNum, 1])
            label_lockDesc.color = UtilsUI.getEnoughColor(unlockItemNum >= 1);
            img_lockDesc.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(companionSkin.unlockItemId).icon]);
            this.btn_lockSkin.enabled = unlockItemNum >= 1
            group_lockSkin.visible = true
            for (let i = 0; i < this.companionSkins.length; i++) {
                const element = this.companionSkins[i];
                if (element.skinId == this.skinArr[this.selectIndex].id) {
                    selectSkill = this.companionSkins[i];
                    group_lockSkin.visible = false
                    break
                }
            }
        } else {
            group_lockSkin.visible = false
        }
        if (!selectSkill) {
            selectSkill = { level: 1 }
        }
        if (group_changeSkin.visible) {
            group_changeSkin.visible = !group_lockSkin.visible
        }
        if (this.skinArr[this.selectIndex].id != 0) {
            group_upLevelSkin.visible = !group_changeSkin.visible && !group_lockSkin.visible

        } else {
            group_upLevelSkin.visible = false
        }
        let companionSkin = LocaleData.getCompanionSkinById(this.skinArr[this.selectIndex].id)
        if (group_upLevelSkin.visible) {
            let unlockItemCountStrs = companionSkin.unlockItemCount.split(",")
            if (selectSkill.level < unlockItemCountStrs.length) {
                let unlockItemNum = GameServerData.getInstance().getItemCountByProtoId(companionSkin.unlockItemId)
                label_upLevelDesc.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR12, [unlockItemNum, unlockItemCountStrs[selectSkill.level - 1]])
                label_upLevelDesc.color = UtilsUI.getEnoughColor(unlockItemNum >= unlockItemCountStrs[selectSkill.level - 1]);
                img_upLevelDesc.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(companionSkin.unlockItemId).icon]);

            } else {
                group_upLevelSkin.visible = false
            }
        }
        let group_attr: fgui.GGraph = this.uiPanel.getChild("group_attr")
        group_attr.visible = false
        if (companionSkin && companionSkin.attrValuePer) {
            group_attr.visible = true
            let attrValuePerStrs = companionSkin.attrValuePer.split(",")
            let maxNum = this.skinArr[this.selectIndex].level > attrValuePerStrs.length ? attrValuePerStrs.length : selectSkill.level
            let label_attrValuePer1: fgui.GLabel = this.uiPanel.getChild("label_attrValuePer1")
            let label_attrValuePer2: fgui.GLabel = this.uiPanel.getChild("label_attrValuePer2")
            label_attrValuePer1.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR38, [(attrValuePerStrs[(maxNum - 1) < 0 ? 0 : (maxNum - 1)])])
            let likingData = LocaleData.getCompanionById(this.companionId)
            let mainAttrValueStr: string[] = likingData.mainAttrValue.split(",")
            let attr = ((attrValuePerStrs[(maxNum - 1) < 0 ? 0 : (maxNum - 1)]) / 100) * (Number(mainAttrValueStr[this.companionsItem.phase]) / 100)
            label_attrValuePer2.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR39, [LocaleData.getCompanionAttrById(likingData.mainAttr).name, attr.toFixed(2)])

            let img_attrValuePer: fgui.GLoader = this.uiPanel.getChild("img_attrValuePer")
            img_attrValuePer.url = UtilsTool.stringFormat("ui://CCommon/{0}", [companionSkin.icon]);
        }
        let loader_spine: fgui.GLoader3D = this.uiPanel.getChild("loader_spine")
        new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, loader_spine, this.skinArr[this.selectIndex].modelId);
    }

    public getIsViewMask(): boolean {
        return false;
    };

}