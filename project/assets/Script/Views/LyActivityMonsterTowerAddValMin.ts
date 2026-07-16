//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServerData } from "../Kernel/GameServerData";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyActivityMonsterTower } from "./LyActivityMonsterTower";

export class LyActivityMonsterTowerAddValMin extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyActivityMonsterTower;
        this.viewResI.pkgName = "LyActivityMonsterTower";
        this.viewResI.comName = "LyActivityMonsterTowerAddValMin";
    }

    private towerItem:any;

    private buff:Array<any>;

    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");

        this.towerItem = params.towerItem;

        let label_title: fgui.GTextField = group_main.getChild("label_title");
        label_title.text = StrVal.LYACTIVITY_MONSTERTOWER.STR306;

        let label_desc: fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = StrVal.LYACTIVITY_MONSTERTOWER.STR304;

        // 关闭
        let btn_back: fgui.GButton = getUiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityMonsterTowerAddValMin, 0, null);
        })

        // 取消
        let btn_cancel: fgui.GButton = group_main.getChild("btn_cancel");
        btn_cancel.text = StrVal.COMMON.STR32;
        btn_cancel.onClick(() => {
            btn_back.fireClick();
        })

        // 确定
        let btn_comfirm: fgui.GButton = group_main.getChild("btn_comfirm");
        btn_comfirm.text = StrVal.COMMON.STR33;
        btn_comfirm.onClick(() => {
            let toIndex = 0;
            let list_attr:fgui.GList = (<fgui.GComponent>group_main.getChild("group_attr8")).getChild("list_attr");
            for (let i: number = 0; i < list_attr.numChildren; i++) {
                let child: fgui.GComponent = list_attr.getChildAt(i);
                let btn_frame:fgui.GButton = child.getChild("btn_frame");
                if (btn_frame.selected) {
                    toIndex = list_attr.childIndexToItemIndex(i);
                    break;
                }
            }
            params.callback(toIndex + 1);
            btn_back.fireClick();
        })
        this.refreshState();
        LyActivityMonsterTower.fillAttr8Comp(group_main.getChild("group_attr8"), this.towerItem, this.buff, true, true);
    }

    private refreshState(): void {
        this.buff = null;
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.MONSTOR_TOWER);
        if (activityState && activityState.data) {
            this.buff = activityState.data.activityTower.buff;
        }
    }

    public getIsViewMask(): boolean {
        return false;
    }
}