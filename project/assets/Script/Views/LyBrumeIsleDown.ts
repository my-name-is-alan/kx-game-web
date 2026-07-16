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
import { LyBrumeIsleChoose } from "./LyBrumeIsleChoose";

export class LyBrumeIsleDown extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyItemReward";
        this.viewResI.pkgName = "LyItemReward";
        this.viewResI.comName = "LyBrumeIsleDown";
    }
    private group_chat: fgui.GComponent


    private xmlRoot: any

    private isLeData
    private battleInfoData: any
    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        let domianBattleInfo = params
        this.battleInfoData = params
        this.xmlRoot = LocaleData.getBrumeIsleConfig()
        getUiPanel.getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleDown, 0, null);
        });
        UtilsUI.playCommonGroupAni(group_main, null);
        
        let bounm = UtilsUI.getBonuseItem(VarVal.bonusType.brumeIsleClanScore, null, null, domianBattleInfo.defenceTempgRankNum)
        let ffqInfo = PlatformAPI.getGameServerItem(domianBattleInfo.attackServerId)
        let name = ""
        if (ffqInfo) {
            name = ffqInfo.name
        }
        group_main.getChild("label_desc").text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR25, [name + domianBattleInfo.attackName, LocaleData.getBrumeIsleZone(3).name, UtilsTool.nToFStr(domianBattleInfo.costDamage), Math.abs(domianBattleInfo.defenceAddgRankNum), bounm.proto.name ])
        let list_item = group_main.getChild("list_item", fgui.GList)
        // list_item.itemProvider = ():string =>{
        //     return "ui://LyItemReward/GroupItem2"
        // }
        list_item.itemRenderer = (index: number, child:fgui.GComponent)=>{
            UtilsUI.setUIGroupItem(bounm, child.getChild("group_item"), null);
        }
        list_item.numItems = 1
        group_main.getChild("label_befer").text = domianBattleInfo.defenceOldTempgRankNum
        group_main.getChild("label_now").text = domianBattleInfo.defenceTempgRankNum
        group_main.getChild("label_back").text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR26, [LocaleData.getBrumeIsleZone(2).name])
    }

    public onViewUpdate(params: any): void {
        
    }
    
    public getIsViewMask(): boolean {
        return false;
    }

    public onViewDestroy(): void {
        if (this.battleInfoData.isLeaveMaxZone == 1) {
            if (ViewDispatcher.isViewExist(LyBrumeIsleLand)) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleChoose, 0, { back: true});
            }
        }
    }
}


