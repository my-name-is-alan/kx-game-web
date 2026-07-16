//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServerData } from "../Kernel/GameServerData";
import { VarVal } from "../Values/VarVal";

export class FmDebugStatus extends ViewLayer {
	
    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.CMemory;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.CMemory;
        this.viewResI.comName = "FmDebugStatus";
    }

    private label_servertime:fgui.GTextField;

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        this.setViewBehaviour(true);
        this.touchable = false;

        let uiPanel:fgui.GComponent = this.getUiPanel();
        this.label_servertime = uiPanel.getChild("label_servertime");

        this.onBehaviourUpdate(0);
    }

    public onBehaviourUpdate(deltaTime: number): void {
        this.label_servertime.text = UtilsTool.TimeToStr(GameServerData.getInstance().getServerTime(), null, true);
    }

    public getIsViewMask():boolean {
        return false;
    }
}