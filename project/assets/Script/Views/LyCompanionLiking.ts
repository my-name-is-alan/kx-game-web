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
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";

export class LyCompanionLiking extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyCompanion";
        this.viewResI.pkgName = "LyCompanion";
        this.viewResI.comName = "LyCompanionLiking";
    }
    private uiPanel: fgui.GComponent
    private companionInfo: any
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        this.companionInfo = params.companionInfo
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCompanionLiking, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCompanionLiking, 0, null);
        })
        let label_str21: fgui.GLabel = this.uiPanel.getChild("label_str21")
        label_str21.text = StrVal.LYCOMPANION.STR21
        let liking: any = LocaleData.getCompanionLikingByLevel("0")
        let likingData = LocaleData.getCompanionById(this.companionInfo.companionId)
        let list_liking: fgui.GList = this.uiPanel.getChild("list_liking")
        list_liking.setVirtual();
        list_liking.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let likingItem: any = liking[index]
            obj.getChild("label_name").text = likingItem.name
            let label_mainAttr: fgui.GLabel = obj.getChild("label_mainAttr")
            let mainAttrValueStr: string[] = likingData.mainAttrValue.split(",")
            label_mainAttr.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR3, [LocaleData.getCompanionAttrById(likingData.mainAttr).name, mainAttrValueStr[index]])
            let label_sideAttr: fgui.GLabel = obj.getChild("label_sideAttr")
            label_mainAttr.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR3, [LocaleData.getCompanionAttrById(likingData.mainAttr).name, mainAttrValueStr[index]])
            if (likingData.subAttr == "0") {
                let boostValueStr: string[] = likingData.boostValue.split(",")
                label_sideAttr.text = UtilsTool.stringFormat(LocaleData.getBoostById(likingData.boostId).desc, [boostValueStr[index]])
            } else {
                let subAttrValueStr: string[] = likingData.subAttrValue.split(",")
                label_sideAttr.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR3, [LocaleData.getCompanionAttrById(likingData.subAttr).name, subAttrValueStr[index]])
            }
            obj.getChild("label_open").text = StrVal.LYCOMPANION.STR22
            obj.getChild("label_open").visible = this.companionInfo.phase >= likingItem.phase
            let group_item: fgui.GGroup = obj.getChild("group_item")
            let group_unItem: fgui.GGroup = obj.getChild("group_unItem")
            group_item.visible = this.companionInfo.phase >= likingItem.phase
            group_unItem.visible = !group_item.visible
            let label_level: fgui.GLabel = obj.getChild("label_level")
            label_level.text = String(index + 1)
            let img_tiao: fgui.GGroup = obj.getChild("img_tiao")
            let img_unTiao: fgui.GGroup = obj.getChild("img_unTiao")
            img_tiao.visible = index < liking.length - 1
            img_unTiao.visible = index < liking.length - 1

        }).bind(this)
        list_liking.numItems = liking.length
        let list_arrAttr: fgui.GList = this.uiPanel.getChild("list_arrAttr")
        list_arrAttr.setVirtual();
        list_arrAttr.itemRenderer = ((index: number, obj: fgui.GButton) => {
            obj.getChild("label_title").text = liking[index].name
            let level1: number = liking[index - 1] ? Number(liking[index - 1].likingLevel) + 1 : 1
            let attrArr = LocaleData.getCompanionArrLikingLevelByLevel(Number(level1), liking[index].likingLevel)
            let list_attr: fgui.GList = obj.getChild("list_attr")
            list_attr.itemRenderer = ((index: number, obj: fgui.GButton) => {
                obj.enabled = attrArr[index].level <= this.companionInfo.level
                obj.getChild("label_level").text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR32, [attrArr[index].level])
                obj.getChild("label_name").text = LocaleData.getCompanionAttrById(attrArr[index].attr).name
                if (attrArr[index].attr < 5) {
                    obj.getChild("label_attr").text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR33, [attrArr[index].value])
                } else {
                    obj.getChild("label_attr").text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR34, [attrArr[index].value])
                }
            }).bind(this)
            list_attr.numItems = attrArr.length
        }).bind(this)
        list_arrAttr.numItems = liking.length
    };

    public getCompanionData(attr: string, id: string): string[] {
        let attrArr: string[] = attr.split("|")
        for (let i = 0; i < attrArr.length; i++) {
            let item: string = attrArr[i]
            if (item.split(":")[0] == id) {
                return item.split(":")
            }
        }
    }
    public getIsViewMask(): boolean {
        return false;
    };

}