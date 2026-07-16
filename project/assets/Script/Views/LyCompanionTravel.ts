//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { Color } from "cc";
import * as fgui from "fairygui-cc";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyCompanion } from "./LyCompanion";

export class LyCompanionTravel extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyCompanion";
        this.viewResI.pkgName = "LyCompanion";
        this.viewResI.comName = "LyCompanionTravel";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        let exploreData: any = params.explore
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCompanionTravel, 0, null);
        })
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let companion = fullInfo.companionData
        let companionCounter = companion.companionCounter
        this.uiPanel.getChild("label_str46", fgui.GLabel).text = StrVal.LYCOMPANION.STR46
        this.uiPanel.getChild("label_str47", fgui.GLabel).text = StrVal.LYCOMPANION.STR47
        let label_title: fgui.GLabel = this.uiPanel.getChild("label_title")
        label_title.text = exploreData.placeName
        let itemData = exploreData.item.split(",")
        let list_bonuses: fgui.GList = this.uiPanel.getChild("list_bonuses")
        list_bonuses.itemRenderer = (index: number, obj: fgui.GComponent) => {
            let item = itemData[index].split(":")
            let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, item[0], item[1]);
            UtilsUI.setUIGroupItem(bonuseItem, obj, null);
        }
        list_bonuses.numItems = itemData.length;
        let companionData = exploreData.companion.split(",")
        let list_companion: fgui.GList = this.uiPanel.getChild("list_companion")
        list_companion.itemRenderer = (index: number, obj: fgui.GComponent) => {
            let img_icon: fgui.GLoader = obj.getChild("img_icon")
            let label_name: fgui.GTextField = obj.getChild("label_name")
            let companion = LocaleData.getCompanionById(companionData[index])
            label_name.text = companion.name
            let models = LocaleData.getModelItem(companion.modelId)
            img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [models.avatar2]);
            for (let i = 0; i < companionCounter.length; i++) {
                const element = companionCounter[i];
                if (element.id == companionData[index]) {
                    label_name.text = StrVal.LYCOMPANION.STR36
                    label_name.color = new Color(202, 98, 85, 255);
                }
            }
        }
        list_companion.numItems = companionData.length;
    };

    public getIsViewMask(): boolean {
        return false;
    };

}