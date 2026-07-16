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

export class LyCompanionLock extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyCompanion";
        this.viewResI.pkgName = "LyCompanion";
        this.viewResI.comName = "LyCompanionLock";
    }
    private uiPanel: fgui.GComponent
    private companionInfo: any
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel()
        this.companionInfo = params.companionInfo
        // 关闭
        let btn_close: fgui.GButton = this.uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCompanionLock, 0, null);
        })
        let img_quality: fgui.GLoader = this.uiPanel.getChild("img_quality")
        let label_name: fgui.GLabel = this.uiPanel.getChild("label_name")
        let loader_spine: fgui.GLoader3D = this.uiPanel.getChild("loader_spine")
        let label_mainDec: fgui.GLabel = this.uiPanel.getChild("label_mainDec")
        let label_mainAttr: fgui.GLabel = this.uiPanel.getChild("label_mainAttr")
        let label_likingDec: fgui.GLabel = this.uiPanel.getChild("label_likingDec")
        let label_sideAttr: fgui.GLabel = this.uiPanel.getChild("label_sideAttr")
        this.uiPanel.getChild("label_str43", fgui.GLabel).text = StrVal.LYCOMPANION.STR43
        this.uiPanel.getChild("label_str44", fgui.GLabel).text = StrVal.LYCOMPANION.STR44
        let companionXml = LocaleData.getCompanionById(this.companionInfo.companionId)
        img_quality.url = UtilsTool.stringFormat("ui://CCommon/frame_name{0}", [companionXml.quality]);
        label_name.text = companionXml.name
        new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, loader_spine, companionXml.modelId);
        let likingData = LocaleData.getCompanionById(this.companionInfo.companionId)
        let mainAttrValueStr: string[] = likingData.mainAttrValue.split(",")
        label_mainDec.text = LocaleData.getCompanionAttrById(likingData.mainAttr).name
        label_mainAttr.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR34, [mainAttrValueStr[0]])
        if (likingData.subAttr == "0") {
            let boostValueStr: string[] = likingData.boostValue.split(",")
            label_sideAttr.text = UtilsTool.stringFormat(LocaleData.getBoostById(likingData.boostId).desc, [boostValueStr[0]])
        } else {
            let subAttrValueStr: string[] = likingData.subAttrValue.split(",")
            label_sideAttr.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR3, [LocaleData.getCompanionAttrById(likingData.subAttr).name, subAttrValueStr[0]])
        }
        let likingPhase = LocaleData.getCompanionLikingByPhase(1)
        label_likingDec.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR1, [likingPhase.likingLevel])
    };

    public getIsViewMask(): boolean {
        return false;
    };

}