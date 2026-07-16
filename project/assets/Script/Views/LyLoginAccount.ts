//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { UtilsUI } from "../Kernel/UtilsUI";

export class LyLoginAccount extends ViewLayer {
	
    public constructor() {
        super();
        this.viewResI.resName = "LyLogin";
        this.viewResI.pkgName = "LyLogin";
        this.viewResI.comName = "LyLoginAccount";
    }

    private params:any;

    public onViewCreate(_params:any):void {
        this.params = _params;
        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let label_title:fgui.GTextField = group_main.getChild("label_title");
        label_title.text = StrVal.LYLOGINACCOUNT.STR1;
        for (let name of ["label_acount", "label_pass", "input_account", "input_password"]) {
            let child:any = group_main.getChild(name);
            if (child) { child.visible = false; }
        }

        let btn_cancel:fgui.GComponent = group_main.getChild("btn_cancel");
        btn_cancel.text = StrVal.LYLOGINACCOUNT.STR4;
        btn_cancel.onClick(() => this.onCloseClick());

        let btn_confirm:fgui.GComponent = group_main.getChild("btn_confirm");
        btn_confirm.text = StrVal.LYLOGINACCOUNT.STR16;
        btn_confirm.onClick(() => this.onAuthorizeClick());

        UtilsUI.showMsgTip(StrVal.LYLOGINACCOUNT.STR17);
    }

    private onCloseClick():void {
        this.params.callback({errmsg: StrVal.LYLOGINACCOUNT.STR10});
        this.doCloseClick();
    }

    private doCloseClick():void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyLoginAccount, 0, null);
    }

    private onAuthorizeClick():void {
        this.params.callback({ hdhiveRedirect: true });
        this.doCloseClick();
    }

    public getIsViewMask():boolean {
        return false;
    };
}
