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

export class LyGrabCityGroup extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyGrabCity";
        this.viewResI.pkgName = "LyGrabCity";
        this.viewResI.comName = "LyGrabCityGroup";
    }
    private xmlRoot: any
    public onViewCreate(params:any): void {
        this.xmlRoot = LocaleData.getGrabCityRoot()
        let FZNAME = ["A-","B-","C-","D-"]
        let FZNAMEBIG = [this.xmlRoot.primaryName, this.xmlRoot.advancedName]

        let getUiPanel: fgui.GComponent = this.getUiPanel()
        let group_main: fgui.GComponent = getUiPanel.getChild("main") ;
      
        getUiPanel.getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityGroup, 0, null);
        });
        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityGroup, 0, null);
        });
        let cbox_group: fgui.GComboBox = group_main.getChild("cbox_group")
        let label_groupName: fgui.GComboBox = group_main.getChild("label_groupName")
        
        let grabCityData = GameServerData.getInstance().getGrabCityPlayer()

         //cbox_group
         let city_groupData = []
         for (let index = 0; index < grabCityData.initial; index++) {
             let data = {}
             data["stage"] = 1
             data["packet"] = index + 1
             data["name"] = FZNAME[index] + FZNAMEBIG[0]
             city_groupData.push(data)
         }
         for (let index = 0; index < grabCityData.advanced; index++) {
             let data = {}
             data["stage"] = 2
             data["packet"] = index + 1
             data["name"] = FZNAME[index] + FZNAMEBIG[1]
             city_groupData.push(data)
         }

        let groupValues:Array<string> = []
        for (let index = 0; index < city_groupData.length; index++) {
            let data = city_groupData[index]
            groupValues.push(data.name)
        }
        cbox_group.items = groupValues
        cbox_group.on(fgui.Event.STATUS_CHANGED, ()=>{
            label_groupName.text = cbox_group.value
            chooseClanRank(city_groupData[cbox_group.selectedIndex].stage, city_groupData[cbox_group.selectedIndex].packet)
        }, this)
        cbox_group.selectedIndex = 0
        label_groupName.text = city_groupData[cbox_group.selectedIndex].name
       
        let clanArr = []
        let upRank = 0        
        let chooseClanRank = (stage: number, packet:number)=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    clanArr = args.rankList
                    upRank = Math.ceil(clanArr.length / 2)
                    label_groupName.text = city_groupData[cbox_group.selectedIndex].name
                    UtilsUI.setFguiGlistDelayNumItems(list_all, clanArr.length)
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"siegeGroupPacketClanRank",  {stage:stage  , packet:packet });
        }
        chooseClanRank(city_groupData[cbox_group.selectedIndex].stage, city_groupData[cbox_group.selectedIndex].packet)
        // let cityRankArr: any = params
     
    
        // let getData = (arr)=>{
        //     clanArr = []
        //     allHurt = 0
        //     for (let index = 0; index < arr.length; index++) {
        //         const data = arr[index];
        //         allHurt = data.harm + allHurt
        //         for (let index2 = 0; index2 < cityRankArr.length; index2++) {
        //             let city = cityRankArr[index2];
        //             if (city.guid == data.guid) {
        //                 let temp: any = {}
        //                 temp.data = data
        //                 temp.city = city
        //                 clanArr.push(temp)
        //                 break
        //             }
        //         }
        //     }
        //     clanArr.sort((a, b): number=>{
        //         return b.data.harm - a.data.harm
        //     })
        //     
        // }
     

        let list_all: fgui.GList = group_main.getChild("list_item")
        list_all.itemRenderer = (index: number, child:fgui.GComponent)=>{
            let singerClan = clanArr[index]
            let rank = index + 1
            let label_severName = child.getChild("label_severName", fgui.GLabel)
            let label_rank = child.getChild("label_rank", fgui.GLabel)
            let loader_rank = child.getChild("loader_rank", fgui.GLoader)
            let label_name = child.getChild("label_name", fgui.GLabel)
            let label_bzname = child.getChild("label_bzname", fgui.GLabel)
            let label_harm = child.getChild("label_harm", fgui.GLabel)
            let label_score = child.getChild("label_score", fgui.GLabel)
            let icon_flag = child.getChild("icon_flag", fgui.GLoader)
            child.getChild("n18", fgui.GImage).visible = rank <= upRank
            if (index < 3) {
                loader_rank.visible = true
                loader_rank.url = UtilsTool.stringFormat("ui://LyGrabCity/frame_{0}", [rank])
                label_rank.text = ""
            }else{
                loader_rank.visible = false
                label_rank.text = String(rank)
            }
            let severData = PlatformAPI.getGameServerItem(singerClan.serverId)
            if (severData) {
                label_severName.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR23, [severData.name]) 
            }else{
                label_severName.text = ""
            }
            label_name.text =  singerClan.name
            label_bzname.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR22, [singerClan.leaderName]) 
            label_harm.text = UtilsTool.nToFStr(clanArr[index].harm)
            let tt = LocaleData.getClanFlagById(singerClan.flag)
            if (tt) {
                icon_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [tt.icon])
            }
            label_score.text = LocaleData.getGrabCityCombatScore(city_groupData[cbox_group.selectedIndex].stage, rank)
            
        }
    }

    public onViewUpdate(params: any): void {
        
    }

    public onViewDestroy(): void {
    }
}


