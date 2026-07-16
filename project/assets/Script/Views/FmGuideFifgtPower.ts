//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { UtilsTool } from "../Kernel/UtilsTool";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { VarVal } from "../Values/VarVal";

export class FmGuideFifgtPower extends ViewLayer {
	
    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGuideDetail;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyGuideDetail;
        this.viewResI.comName = "FmGuideFifgtPower";
    }

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        this.touchable = false;

        let num_powerold = Number(params.power);
        let num_powernew = Number(params.powernew);
        let num_add = num_powernew - num_powerold;

        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main", fgui.GComponent).getChild("mian");

        let label_power:fgui.GTextField = group_main.getChild("label_power");
        label_power.text = UtilsTool.nToFStr(num_powerold);

		let label_red:fgui.GTextField = group_main.getChild("label_red");
        let img_red:fgui.GImage = group_main.getChild("img_red");

        let label_green:fgui.GTextField = group_main.getChild("label_green");
        let img_green:fgui.GImage = group_main.getChild("img_green");

        let label_add:fgui.GTextField;
        if (num_add >= 0) {
            label_red.visible = false;
            img_red.visible = false;
            label_add = label_green;
        } else {
            label_green.visible = false;
            img_green.visible = false;
            label_add = label_red;
        }

        let str = UtilsTool.nToFStr(num_add);
        label_add.text = num_add >= 0 ? ("+" + str) : str;
        label_add.x = label_power.x + label_power.width + 10;
        img_red.x = img_green.x = label_add.x + label_add.width;
        group_main.width = img_red.x + img_red.width;

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
        }, group_main.getChild("loader_spine"), "jm_zhanlizengjia");
        uiPanel.getChild("group_main", fgui.GComponent).getTransition("t0").play(()=>{
            new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                spp.playAnimation("Stand", false)
            }, group_main.getChild("loader_spine2"), "jm_zhanlizengjia02");
            this.setTimeout(() => {
                let STEP_MAX = 40;
                let counter = 0;
                let time = this.setInterval(() => {
                    counter++;
                    label_power.text = UtilsTool.nToFStr(String(num_powerold + Math.floor(num_add / STEP_MAX * counter)));
                    if (counter == STEP_MAX) {
                        this.setTimeout(() => {
                            uiPanel.getChild("group_main", fgui.GComponent).getTransition("t0").playReverse(()=>{
                                ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_DESTROY, FmGuideFifgtPower, this.getViewUuid(), null);
                            },)
                        }, 500)
                        this.clearInterval(time)
                    }
                }, 500 / STEP_MAX)
            }, 500)
        });
    }

    public getIsViewMask():boolean {
        return false;
    }
}