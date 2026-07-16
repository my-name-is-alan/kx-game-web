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
import { AudioManager } from "../Kernel/AudioManager";

export class FmMsgTip extends ViewLayer {
	
    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.CMemory;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.CMemory;
        this.viewResI.comName = "FmMsgTip";
    }

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        this.touchable = false;
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_TIPS);

        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group:fgui.GLabel = uiPanel.getChild("group");

		let label_tip:fgui.GLabel = group.getChild("label_tip");
		label_tip.text = params;
        
        uiPanel.getTransition("trans_tips").play(() => {
            ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_DESTROY, FmMsgTip, this.getViewUuid(), null);
        }, 1, null, null, null);
    }

    public getIsViewMask():boolean {
        return false;
    }
}