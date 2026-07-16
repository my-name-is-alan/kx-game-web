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
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { Label, ValueType, math } from "cc";
import { LyBrumeNote } from "./LyBrumeNote";
import { LyBrumeIsleAward } from "./LyBrumeIsleAward";
import { LyBrumeIsleRank } from "./LyBrumeIsleRank";
import { LyBrumeIsleGift } from "./LyBrumeIsleGift";
import { LyBrumeIsleFire } from "./LyBrumeIsleFire";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { LyClanJoin } from "./LyClanJoin";
import { LyGrabCityZone } from "./LyGrabCityZone";
import { GrabCityState, LyGrabCity } from "./LyGrabCity";
import { LyItemRewardCity } from "./LyItemRewardCity";
import { LocaleUser } from "../Kernel/LocaleUser";
import { LyGrabCityWeapon } from "./LyGrabCityWeapon";
import { LyGrabCityBattle } from "./LyGrabCityBattle";

export class LyGrabCityStats extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyGrabCity";
        this.viewResI.pkgName = "LyGrabCity";
        this.viewResI.comName = "LyGrabCityStats";
    }
    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel()
        let group_main: fgui.GComponent = getUiPanel.getChild("main") ;
        let xmlRoot = LocaleData.getGrabCityRoot()
        getUiPanel.getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityStats, 0, null);
        });


        let list_all: fgui.GList = group_main.getChild("list_all")
        let cityLevelxmls: Array<any> = LocaleData.getGrabCityRoot()._prepare[0]._item
        cityLevelxmls.sort((a, b):number=>{
            return Number(a.id) -  Number(b.id) 
        })
        list_all.itemRenderer = (index: number, child: fgui.GComponent)=>{
            let xml = cityLevelxmls[index]
            child.getChild("label_des").text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR27, [xml.level]); 
            child.getChild("label_attr").text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR28, [xml.buff]); 
        }
        UtilsUI.setFguiGlistDelayNumItems(list_all, cityLevelxmls.length)
        
        let peos = params
        let list_all2: fgui.GList = group_main.getChild("list_all2")
        let allpeople = []
        for (let index = 0; index < peos.length; index++) {
            let temp: any = {}
            temp.name = peos[index].name
            temp.donate = peos[index].donate
            allpeople.push(temp)
        }
        allpeople.sort((a, b): number=>{
            return b.donate - a.donate
        })
        list_all2.itemRenderer = (index: number, child: fgui.GComponent)=>{
            let data = allpeople[index]
            child.getChild("label_name").text = data.name 
            child.getChild("label_number").text = data.donate 
        }
        UtilsUI.setFguiGlistDelayNumItems(list_all2, allpeople.length)
    }

    public onViewUpdate(params: any): void {
        
    }

    public onViewDestroy(): void {
    }
}


