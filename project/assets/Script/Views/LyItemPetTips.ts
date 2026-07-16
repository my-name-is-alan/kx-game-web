//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { LocaleData } from "../Kernel/LocaleData";

export class LyItemPetTips extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.CCommon;
        this.viewResI.pkgName = "CCommon";
        this.viewResI.comName = "LyItemPetTips";
    }

    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");

        let bonuseItem:BonuseItem = params.bonuseItem;

        let pos = getUiPanel.globalToLocal(params.pos.x, params.pos.y);
        let cx = pos.x - group_main.width;
        if (cx < 0) {
            cx = pos.x;
            if (cx + group_main.width > getUiPanel.width) {
                cx = getUiPanel.width - group_main.width;
            }
        }
        let cy = pos.y - group_main.height;
        if (cy < 0) {
            cy = pos.y + params.size.y;
        }
        group_main.setPosition(cx, cy);

        // 关闭
        let btn_back: fgui.GButton = getUiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_DESTROY, LyItemPetTips, 0, null);
        })

        let Loader_qu: fgui.GLoader = group_main.getChild("Loader_qu");
        let label_name: fgui.GTextField = group_main.getChild("label_name");
        let label_dec1:fgui.GTextField = group_main.getChild("label_dec1");
        let loader_item: fgui.GLoader = group_main.getChild("loader_item");

        let showQuality = bonuseItem.proto.quality;
        if (LocaleData.isPet(bonuseItem.proto.id)) {
            showQuality = String(Number(showQuality) + 1);
        }
        Loader_qu.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}_title", [showQuality]);
        label_name.text = bonuseItem.proto.name;
        label_name.strokeColor = UtilsUI.getQualityColor(showQuality);
        let modelShowInfo = LocaleData.getModelShowInfo(bonuseItem.proto.modelId);
        loader_item.url = UtilsTool.stringFormat("ui://CCommon/{0}", [modelShowInfo.icon_square]);
        label_dec1.text = bonuseItem.proto.description;
    }

    public getIsViewMask(): boolean {
        return false;
    }
}


