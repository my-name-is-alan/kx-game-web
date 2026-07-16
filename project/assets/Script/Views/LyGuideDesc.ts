//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { UtilsUI } from "../Kernel/UtilsUI";

export class LyGuideDesc extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGuideDetail;
        this.viewResI.pkgName = "LyGuideDetail";
        this.viewResI.comName = "LyGuideDesc";
    }

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let btn_close:fgui.GButton = uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGuideDesc, 0, null);
        })

        let label_title:fgui.GButton = group_main.getChild("label_title");
        label_title.text = params.title;

        let contentItems:Array<any> = params.contentItems;
        let list_item: fgui.GList = group_main.getChild("list_item");
        list_item.itemRenderer = (index: number, child: fgui.GComponent) =>{
            let contentItem = contentItems[index];
            child.getChild("label_name", fgui.GTextField).text = contentItem.name;
            child.getChild("label_desc", fgui.GTextField).text = contentItem.desc;
        }
        list_item.numItems = contentItems.length;
    }

    public getIsViewMask():boolean {
        return false;
    }
}