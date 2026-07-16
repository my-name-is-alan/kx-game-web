//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { LyGuideDetail } from "./LyGuideDetail";
import { LyChatRoom } from "./LyChatRoom";
import { GameServer } from "../Kernel/GameServer";
import { LyBrumeIsleLand } from "./LyBrumeIsleLand";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { Vec2 } from "cc";
import { FguiGTween } from "../Kernel/FguiGTween";
import { LyBrumeIsle } from "./LyBrumeIsle";

export class LyBrumeIsleAddArr extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyBrumeIsle";
        this.viewResI.pkgName = "LyBrumeIsle";
        this.viewResI.comName = "LyBrumeIsleAddArr";
    }
    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        getUiPanel.getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleAddArr, 0, null);
        }); 
        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleAddArr, 0, null);
        })


        let isLeData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster
        group_main.getChild("label_atk", fgui.GLabel).text = "+" + isLeData.ack
        group_main.getChild("label_hp", fgui.GLabel).text = "+" + isLeData.hp
        group_main.getChild("label_def", fgui.GLabel).text = "+" + isLeData.def
        group_main.getChild("label_mj", fgui.GLabel).text = "+" + isLeData.spd

        let list_item: fgui.GList = group_main.getChild("list_item")
        list_item.itemRenderer = (index:number, child:fgui.GComponent)=>{
            let id = 208 + index
            let vn = LyBrumeIsle.getValueNumber(id)
            let bounm = UtilsUI.getBonuseItem(String(id) , null, null, vn)
            UtilsUI.setUIGroupItem(bounm, child, null);
            let label_count = child.getChild("label_count", fgui.GLabel)
            if (vn == "0") {
                label_count.visible = true
                label_count.text = vn
                child.getChild("img_count").visible = true
            }
        }
        list_item.numItems = 9
    }

    public onViewUpdate(params: any): void {
        
    }
    public getIsViewMask(): boolean {
        return false;
    }
}


