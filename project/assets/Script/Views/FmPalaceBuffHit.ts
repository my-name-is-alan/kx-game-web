//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { VarVal } from "../Values/VarVal";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsUI } from "../Kernel/UtilsUI";

export class FmPalaceBuffHit extends ViewLayer {
	
    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPalaceLike;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyPalaceLike;
        this.viewResI.comName = "FmPalaceBuffHit";
    }

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        this.touchable = false;

        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let buffItem = LocaleData.getPalaceBuffItem(params.buffId);
		let label_name:fgui.GTextField = group_main.getChild("label_name");
        label_name.text = buffItem.name;

        this.setTimeout(() => {
            ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_DESTROY, FmPalaceBuffHit, this.getViewUuid(), null);
        }, 1000)
    }

    public getIsViewMask():boolean {
        return false;
    }
}