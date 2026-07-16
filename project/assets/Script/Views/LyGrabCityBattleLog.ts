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

export class LyGrabCityBattleLog extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyGrabCity";
        this.viewResI.pkgName = "LyGrabCity";
        this.viewResI.comName = "LyGrabCityBattleLog";
    }
    private xmlRoot: any
    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel()
        let group_main: fgui.GComponent = getUiPanel.getChild("main") ;
      
        getUiPanel.getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityBattleLog, 0, null);
        });
        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityBattleLog, 0, null);
        });
        
        let cityRankArr: any = params
        let clanState = GameServerData.getInstance().getGrabCityPlayer().clanState;
        let actState = GameServerData.getInstance().getGrabCityPlayer().state
        let clanArr = []
        let btn_sj = group_main.getChild("btn_sj")
        let btn_jg = group_main.getChild("btn_jg")
        
        let allHurt = 0
        let getData = (arr)=>{
            clanArr = []
            allHurt = 0
            for (let index = 0; index < arr.length; index++) {
                const data = arr[index];
                allHurt = data.harm + allHurt
                for (let index2 = 0; index2 < cityRankArr.length; index2++) {
                    let city = cityRankArr[index2];
                    if (city.guid == data.guid) {
                        let temp: any = {}
                        temp.data = data
                        temp.city = city
                        clanArr.push(temp)
                        break
                    }
                }
            }
            clanArr.sort((a, b): number=>{
                return b.data.harm - a.data.harm
            })
            UtilsUI.setFguiGlistDelayNumItems(list_all, clanArr.length)
        }
        btn_sj.onClick(()=>{
            getData(clanState.defend)
        })

        btn_jg.onClick(()=>{
            getData(clanState.attack)
        })

        let list_all: fgui.GList = group_main.getChild("list_all")
        list_all.itemRenderer = (index: number, child:fgui.GComponent)=>{
            let singerClan = clanArr[index].city
            let label_severName = child.getChild("label_severName", fgui.GLabel)
            let label_rank = child.getChild("label_rank", fgui.GLabel)
            let loader_rank = child.getChild("loader_rank", fgui.GLoader)
            let label_name = child.getChild("label_name", fgui.GLabel)
            let label_bzname = child.getChild("label_bzname", fgui.GLabel)
            let label_harm = child.getChild("label_harm", fgui.GLabel)
            let btn_atk = child.getChild("btn_atk", fgui.GButton)
            let icon_flag = child.getChild("icon_flag", fgui.GLoader)
            if (index < 3) {
                loader_rank.visible = true
                loader_rank.url = UtilsTool.stringFormat("ui://LyGrabCity/frame_{0}", [index + 1])
                label_rank.text = ""
            }else{
                loader_rank.visible = false
                label_rank.text = String(index + 1)
            }
            let severData = PlatformAPI.getGameServerItem(singerClan.serverId)
            if (severData) {
                label_severName.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR23, [severData.name]) 
            }else{
                label_severName.text = ""
            }
            label_name.text =  singerClan.name
            label_bzname.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR22, [singerClan.leaderName]) 
            label_harm.text = UtilsTool.nToFStr(clanArr[index].data.harm)
            // / allHurt * 100).toFixed(2) + "%"  
            let tt = LocaleData.getClanFlagById(singerClan.flag)
            if (tt) {
                icon_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [tt.icon])
            }
            btn_atk.clearClick()
            btn_atk.onClick(()=>{
                if (actState == GrabCityState.ready1 || actState == GrabCityState.ready2) {
                    UtilsUI.showMsgTip(StrVal.LYGRABCITY.STR9)
                }else if (singerClan.present == 0) {
                    UtilsUI.showMsgTip(StrVal.LYGRABCITY.STR12)
                }else{
                    if(actState == GrabCityState.battle1 || actState == GrabCityState.battle2){
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityBattle, 0, singerClan);
                    }
                }
            })
        }
        
        getData(clanState.defend)
    }

    public onViewUpdate(params: any): void {
        
    }

    public onViewDestroy(): void {
    }
}


