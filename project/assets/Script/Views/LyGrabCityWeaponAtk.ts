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
import { Label, ValueType } from "cc";
import { LyBrumeNote } from "./LyBrumeNote";
import { LyBrumeIsleAward } from "./LyBrumeIsleAward";
import { LyBrumeIsleRank } from "./LyBrumeIsleRank";
import { LyBrumeIsleGift } from "./LyBrumeIsleGift";
import { LyBrumeIsleFire } from "./LyBrumeIsleFire";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { LyClanJoin } from "./LyClanJoin";
import { LyGrabCityZone } from "./LyGrabCityZone";
import { LyGrabCity } from "./LyGrabCity";
import { LyItemRewardCity } from "./LyItemRewardCity";
import { LocaleUser } from "../Kernel/LocaleUser";
import { LyGrabCityWeapon } from "./LyGrabCityWeapon";

export class LyGrabCityWeaponAtk extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyGrabCity";
        this.viewResI.pkgName = "LyGrabCity";
        this.viewResI.comName = "LyGrabCityWeaponAtk";
    }
    private xmlRoot: any
    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel()
        let group_main: fgui.GComponent = getUiPanel.getChild("main") ;
      
        getUiPanel.getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityWeaponAtk, 0, null);
        });
        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityWeaponAtk, 0, null);
        });
        
        let cityRankArr: any = params
        let list_all: fgui.GList = group_main.getChild("list_all")
        list_all.itemRenderer = (index: number, child:fgui.GComponent)=>{
            let singerClan = cityRankArr[index]
            let pro_hp = child.getChild("pro_hp", fgui.GProgressBar)
            let label_name = child.getChild("label_name", fgui.GLabel)
            let icon_flag = child.getChild("icon_flag", fgui.GLoader)
            pro_hp.value = (singerClan.HP / singerClan.maxHP) * 100
            label_name.text = UtilsTool.stringFormat("{0}  {1}",[singerClan.name, singerClan.level]) 
            let tt = LocaleData.getClanFlagById(singerClan.flag)
            if (tt) {
                icon_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [tt.icon])
            }
            child.getChild("btn_atk").onClick(()=>{
                UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        let skipAnim = LocaleUser.getUser("LyGrabCityWeapon_skipAnim")
                        if (skipAnim != undefined || skipAnim != "1")  {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyGrabCityZone, 0, {wid: "1", harm: args.harm ,city:args.battleList, callBack: ()=>{
                                let boun = LyGrabCity.getRewardBonuseItem(args.activityItem, args.bonusesResult)
                                if (boun.length > 0) {
                                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyItemRewardCity, 0, { tip: UtilsTool.stringFormat(StrVal.LYGRABCITY.STR18, [UtilsTool.nToFStr(args.harm)]),
                                        bonuseItems : boun
                                    });
                                }
                            }});
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityWeapon, 0, null);
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityWeaponAtk, 0, null);
                        }else{
                            let boun = LyGrabCity.getRewardBonuseItem(args.activityItem, args.bonusesResult)
                            if (boun.length > 0) {
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyItemRewardCity, 0, { tip: UtilsTool.stringFormat(StrVal.LYGRABCITY.STR18, [UtilsTool.nToFStr(args.harm)]),
                                    bonuseItems : boun
                                });
                            }
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityWeaponAtk, 0, null);
                        }
                    } ,"siegeSkill", {skill: 1, battleClanId: singerClan.guid});
            });
        }
        UtilsUI.setFguiGlistDelayNumItems(list_all, cityRankArr.length)
    }

    public onViewUpdate(params: any): void {
        
    }

    public onViewDestroy(): void {
    }
}


