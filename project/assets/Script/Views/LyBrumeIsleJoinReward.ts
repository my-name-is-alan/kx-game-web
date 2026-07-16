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
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { Label } from "cc";
import { LyBrumeNote } from "./LyBrumeNote";

export class LyBrumeIsleJoinReward extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyItemReward";
        this.viewResI.pkgName = "LyItemReward";
        this.viewResI.comName = "LyBrumeIsleJoinReward";
    }
    private group_chat: fgui.GComponent


    private xmlRoot: any
    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        this.xmlRoot = LocaleData.getBrumeIsleConfig()
        getUiPanel.getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleJoinReward, 0, null);
        });
        let data = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster
        group_main.getChild("label_desc").text = StrVal.LyBRUMEISLE.STR23
        let list_item: fgui.GList = group_main.getChild("list_item")
        list_item.itemRenderer = (index:number, child:fgui.GComponent)=>{
            UtilsUI.setUIGroupItem(params.bounArr[index], child, null);
        }
        UtilsUI.playCommonResultAni(group_main.getChild("back_win"), () => {
            group_main.getChild("group_outani").visible = true;
        });
        UtilsUI.setFguiGlistDelayNumItems(list_item, params.bounArr.length)
        group_main.getChild("label_have").text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR24, [0]); 
        group_main.getChild("label_number").text = params.gRankNum
        UtilsUI.playCommonGroupAni(group_main, null);
    }

    public onViewUpdate(params: any): void {
        
    }

    public getIsViewMask(): boolean {
        return false;
    }
}


