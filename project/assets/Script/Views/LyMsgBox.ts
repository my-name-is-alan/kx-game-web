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
import { UtilsUI } from "../Kernel/UtilsUI";
import { StrVal } from "../Values/StrVal";
import { UtilsTool } from "../Kernel/UtilsTool";

export interface MsgBoxOth {
    checkBoxText?:string,
    needCountText?:string
}

export class LyMsgBox extends ViewLayer {

    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = "CMemory";
        this.viewResI.pkgName = "CMemory";
        this.viewResI.comName = "LyMsgBox";
    }

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let label_title:fgui.GTextField = group_main.getChild("label_title");
		label_title.text = params.title;

        let content:string = params.contentText;
        let label_text_rich:fgui.GTextField = group_main.getChild("label_text_rich");
        let label_text:fgui.GTextField = group_main.getChild("label_text");
        if (UtilsUI.isUBBText(content)) {
            label_text_rich.text = content;
        } else {
            label_text.text = content;
        }

        let oth:MsgBoxOth = params.oth;
        let btn_checkbox:fgui.GButton = group_main.getChild("btn_checkbox");
        let label_checkbox:fgui.GTextField = group_main.getChild("label_checkbox");
        let group_checkbox:fgui.GGroup = group_main.getChild("group_checkbox");
        if (oth && oth.checkBoxText) {
            label_checkbox.text = oth.checkBoxText;
            group_checkbox.width = label_checkbox.x + label_checkbox.width - btn_checkbox.x;
        } else {
            group_checkbox.visible = false;
        }

        let label_count:fgui.GTextField = group_main.getChild("label_count");
        if (oth && oth.needCountText) {
            label_count.text = oth.needCountText;
        }

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick((target) => {
            if (params.callClose) {
                params.callClose(this.getCheckBoxSelected(btn_checkbox));
            }
			this.onCloseClick();
        })
        let btn_cancel:fgui.GButton = group_main.getChild("btn_cancel");
		btn_cancel.onClick(() => {
            if (params.callCancel) {
                params.callCancel(this.getCheckBoxSelected(btn_checkbox));
            }
            this.onCloseClick();
        })

		let btn_confirm:fgui.GButton = group_main.getChild("btn_confirm");
		btn_confirm.onClick(() => {
            if (params.callConfirm) {
                params.callConfirm(this.getCheckBoxSelected(btn_checkbox));
            }
            this.onCloseClick();
        })

		let btn_ok:fgui.GButton = group_main.getChild("btn_ok");
		btn_ok.onClick(() => {
            if (params.callOk) {
                params.callOk(this.getCheckBoxSelected(btn_checkbox));
            }
            this.onCloseClick();
        })

        if (!params.callClose) {
            btn_close.visible = false;
        }
        if (params.style == VarVal.LyMsgBox.STYLE_ONE) {
            btn_cancel.visible = false;
			btn_confirm.visible = false;
			btn_ok.text = params.okText;
        } else if (params.style == VarVal.LyMsgBox.STYLE_TWO) {
            btn_ok.visible = false;
			btn_cancel.text = params.cancelText;
			btn_confirm.text = params.confirmText;
        } else if(params.style == VarVal.LyMsgBox.STYLE_TWO2){
            btn_ok.visible = false;
			btn_cancel.text = params.cancelText;
            let ss :number = 3
            btn_confirm.text = UtilsTool.stringFormat(StrVal.COMMON.STR208,[params.confirmText , ss])
            btn_confirm.enabled = false 
            let intervalId = this.setInterval(() => {
                if (ss > 1) {
                    ss --
                    btn_confirm.text = UtilsTool.stringFormat(StrVal.COMMON.STR208,[params.confirmText , ss])
                }else{
                    this.clearInterval(intervalId);
                    btn_confirm.text = params.confirmText
                    btn_confirm.enabled = true 
                }
            }, 1000);

        } else { // VarVal.LyMsgBox.STYLE_THREE
            btn_ok.visible = false; // 目前第三个按钮区域重叠，所以先隐藏
			btn_cancel.text = params.cancelText;
			btn_confirm.text = params.confirmText;
        }
    }

    private getCheckBoxSelected(btn_checkbox:fgui.GButton):boolean {
        return btn_checkbox.selected ? true : false;
    }

    private onCloseClick():void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyMsgBox, this.getViewUuid(), null);
		ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_DESTROY, FmMsgBox, this.getViewUuid(), null); // 兼容SysBox。
    }

    public getIsViewMask():boolean {
        return false;
    }
}

export class FmMsgBox extends LyMsgBox {}