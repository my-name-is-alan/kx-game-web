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

export class LyPetBuffTips extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyPet";
        this.viewResI.pkgName = "LyPet";
        this.viewResI.comName = "LyPetBuffTips";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(_params: any): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        // UtilsUI.playCommonGroupAni(this.uiPanel, null)
        let btn_close = this.getUiPanel().getChild("btn_close")
        btn_close.onClick(() => {
            ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_DESTROY, LyPetBuffTips, 0, null)
        })
        let buffData = _params.buffData
        let buff = LocaleData.getPetBuffById(buffData.buffId)

        let label_name: fgui.GLabel = this.uiPanel.getChild("label_name")
        let colorStr
        if (buff.buffQuality == "1") {
            colorStr = "#A4C2FF"
        } else if (buff.buffQuality == "2") {
            colorStr = "#EE9AFF"
        } else if (buff.buffQuality == "3") {
            colorStr = "#F6B768"
        }

        label_name.text = UtilsTool.stringFormat(StrVal.LYPET.STR18, [buff.buffName, colorStr, buffData.buffLevel])

        let label_level: fgui.GLabel = this.uiPanel.getChild("label_level")
        label_level.text = UtilsTool.stringFormat(StrVal.LYPET.STR9, [buffData.buffLevel])

        let label_dec: fgui.GLabel = this.uiPanel.getChild("label_dec")
        let buffParams = buff.buffParam.split(",")
        label_dec.text = UtilsTool.stringFormat(StrVal.LYPET.STR109, [buff.buffName, buffParams[buffData.buffLevel - 1]])

        let pos = this.getUiPanel().globalToLocal(_params.pos.x, _params.pos.y);
        let cx = pos.x - this.uiPanel.width;
        if (cx < 0) {
            cx = pos.x;
            if (cx + this.uiPanel.width > this.getUiPanel().width) {
                cx = this.getUiPanel().width - this.uiPanel.width;
            }
        }
        let cy = pos.y - this.uiPanel.height;
        if (cy < 0) {
            cy = pos.y + _params.size.y;
        }
        this.uiPanel.setPosition(cx + 10, cy + 10);
    }


    public getIsViewMask(): boolean {
        return false;
    }
}


