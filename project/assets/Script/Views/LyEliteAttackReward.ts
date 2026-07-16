//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { SpinePlayer } from "../Kernel/SpinePlayer";

export class LyEliteAttackReward extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyItemReward";
        this.viewResI.pkgName = "LyItemReward";
        this.viewResI.comName = "LyEliteAttackReward";
    }

    public onViewCreate(_params:any): void {
        let args = _params
        this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteAttackReward, 0, null)
        });
        let uiPanel: fgui.GComponent = this.getUiPanel().getChild("group_main")
        UtilsUI.playCommonGroupAni(uiPanel, null);

        // tween动画
        UtilsUI.playCommonResultAni(uiPanel.getChild("back_win"), () => {
            uiPanel.getChild("group_outani").visible = true;
        });
        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation("stand_gxhd", true);
            uiPanel.getChild("title_win").visible = false;
        }, uiPanel.getChild("loader_spine", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_result);

        uiPanel.getChild("label_score", fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYELITEATTACK.STR21, [args.addScore])  
        uiPanel.getChild("n55", fgui.GLabel).text = StrVal.LYELITEATTACK.STR22
        uiPanel.getChild("label_rank", fgui.GLabel).text = args.rank
        let list_item: fgui.GList = uiPanel.getChild("list_item")
        let bonuseString = GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])
        let bonuseItems = UtilsUI.getBonuseItemsByString(bonuseString);
        list_item.itemRenderer = (index: number, child: fgui.GComponent)=>{
            UtilsUI.setUIGroupItem(bonuseItems[index], child, null)
        };
        list_item.numItems = bonuseItems.length
    }

    public getIsViewMask(): boolean {
        return false;
    };

    public onViewDestroy(): void {
       
    }
}


