//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { VarVal } from "../Values/VarVal";
import { StrVal } from "../Values/StrVal";

export class FmWait extends ViewLayer {
	
    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.CMemory;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.CMemory;
        this.viewResI.comName = "FmWait";
    }

    private count:number = 0;

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        let uiPanel:fgui.GComponent = this.getUiPanel();
        uiPanel.getChild("label_tips", fgui.GTextField).text = StrVal.COMMON.STR24;
        let trans_circle:fgui.Transition = uiPanel.getTransition("trans_circle");
        trans_circle.play(() => {
            trans_circle.play(null, -1, 0, 2.5, 3.5);
        }, 1, 0, null, null);
    }

    public onViewUpdate(params:any):void {
        this.count = this.count + params.count;
        if (this.count <= 0) {
            ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_DESTROY, FmWait, this.getViewUuid(), null);
        }
    }

    public getIsViewMask():boolean {
        return false;
    }
}

export class FmMask extends ViewLayer {
	/**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = "CMemory";
        this.viewResI.pkgName = "CMemory";
        this.viewResI.comName = "FmMask";
    }

    private count:number = 0;

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {}

    public onViewUpdate(params:any):void {
        this.count = this.count + params.count;
        if (this.count <= 0) {
            ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_DESTROY, FmMask, this.getViewUuid(), null);
        }
    }

    public getIsViewMask():boolean {
        return false;
    }
}