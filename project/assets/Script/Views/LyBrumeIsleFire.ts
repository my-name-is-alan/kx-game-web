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
import { PointRedData } from "../Kernel/PointRedData";

export class LyBrumeIsleFire extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyBrumeIsle";
        this.viewResI.pkgName = "LyBrumeIsle";
        this.viewResI.comName = "LyBrumeIsleFire";
    }
    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        getUiPanel.getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleFire, 0, null);
        }); 
        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleFire, 0, null);
        })
        UtilsUI.playCommonGroupAni(group_main,null);
        let loader_1 = group_main.getChild("loader_1", fgui.GLoader)
        let loader_2 = group_main.getChild("loader_2", fgui.GLoader)
        let label_have1 = group_main.getChild("label_have1", fgui.GLabel)
        let label_have2 = group_main.getChild("label_have2", fgui.GLabel)
        let group_needItem1 = group_main.getChild("group_needItem1", fgui.GComponent)
        let group_needItem2 = group_main.getChild("group_needItem2", fgui.GComponent)
        let list_item1 = group_main.getChild("list_item1", fgui.GList)
        let list_item2 = group_main.getChild("list_item2", fgui.GList)
        let btn_get1 = group_main.getChild("btn_get1", fgui.GButton)
        let btn_get2 = group_main.getChild("btn_get2", fgui.GButton)

        let xmlRoot = LocaleData.getBrumeIsleConfig()
        let boxProto1 = LocaleData.getItemProto(VarVal.bonusType.brumeIsleBox1);
        let boxProto2 = LocaleData.getItemProto(VarVal.bonusType.brumeIsleBox2);
        loader_1.url =  UtilsTool.stringFormat("ui://CCommon/{0}", [boxProto1.icon])
        loader_2.url =  UtilsTool.stringFormat("ui://CCommon/{0}", [boxProto2.icon])

        let bonunItems1 = UtilsUI.getBonuseItemsByBonusesId(xmlRoot.silverBonuse)
        list_item1.itemRenderer = (index: number, child: fgui.GComponent) =>{
            UtilsUI.setUIGroupItem(bonunItems1[index], child, null)
        }
        UtilsUI.setFguiGlistDelayNumItems(list_item1, bonunItems1.length)

        let bonunItems2 = UtilsUI.getBonuseItemsByBonusesId(xmlRoot.goldenBonuse)
        list_item2.itemRenderer = (index: number, child: fgui.GComponent) =>{
            UtilsUI.setUIGroupItem(bonunItems2[index], child, null)
        }
        UtilsUI.setFguiGlistDelayNumItems(list_item2, bonunItems2.length)
        let key1Proto = LocaleData.getItemProto(xmlRoot.silverKey)
        let key2Proto = LocaleData.getItemProto(xmlRoot.goldenKey)
        let refreshUI = ()=>{
            let fire1Number = LyBrumeIsle.getValueNumber(VarVal.bonusType.brumeIsleBox1)
            let fire2Number = LyBrumeIsle.getValueNumber(VarVal.bonusType.brumeIsleBox2)
            label_have1.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR30, [fire1Number])
            label_have2.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR30, [fire2Number])
            let key1Number = GameServerData.getInstance().getItemCount(key1Proto.id)
            let key2Number = GameServerData.getInstance().getItemCount(key2Proto.id)
            UtilsUI.setNeedItemGroup(group_needItem1, UtilsTool.stringFormat("ui://CCommon/{0}", [key1Proto.icon]), key1Number, 1)
            UtilsUI.setNeedItemGroup(group_needItem2, UtilsTool.stringFormat("ui://CCommon/{0}", [key2Proto.icon]), key2Number, 1)
            btn_get1.text = StrVal.LyBRUMEISLE.STR31
            btn_get2.text = StrVal.LyBRUMEISLE.STR31
            PointRedData.getInstance().updateManualPoint(btn_get1, Number(fire1Number) != 0 && key1Number >= Number(fire1Number))
            PointRedData.getInstance().updateManualPoint(btn_get2, Number(fire2Number) != 0 && key2Number >= Number(fire2Number))
        }
        refreshUI()
        

        btn_get1.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    refreshUI()
                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"takePropertyBonses", {type:1});
        });

        btn_get2.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    refreshUI()
                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"takePropertyBonses", {type:2});
        });
    }


    public onViewUpdate(params: any): void {
        
    }
    public getIsViewMask(): boolean {
        return false;
    }

    public static isRedPoint(): boolean {
        if (LyBrumeIsle.isActNoClose()) {
            let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE);
            if (activityState && activityState.data) {
                let xmlRoot = LocaleData.getBrumeIsleConfig()
                let key1Proto = LocaleData.getItemProto(xmlRoot.silverKey)
                let key2Proto = LocaleData.getItemProto(xmlRoot.goldenKey)
                let key1Number = GameServerData.getInstance().getItemCount(key1Proto.id)
                let key2Number = GameServerData.getInstance().getItemCount(key2Proto.id)
                let fire1Number = LyBrumeIsle.getValueNumber(VarVal.bonusType.brumeIsleBox1)
                let fire2Number = LyBrumeIsle.getValueNumber(VarVal.bonusType.brumeIsleBox2)
                if ((Number(fire1Number) != 0 && key1Number >= Number(fire1Number)) || (Number(fire2Number) != 0 && key2Number >= Number(fire2Number)) ) {
                    return true
                }
            }
        }
        return false
    }
}


