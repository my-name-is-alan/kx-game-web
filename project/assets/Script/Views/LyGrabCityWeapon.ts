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
import { LyGrabCityWeaponAtk } from "./LyGrabCityWeaponAtk";
import { LocaleUser } from "../Kernel/LocaleUser";

export class LyGrabCityWeapon extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyGrabCity";
        this.viewResI.pkgName = "LyGrabCity";
        this.viewResI.comName = "LyGrabCityWeapon";
    }
  
    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel()
        let group_main: fgui.GComponent = getUiPanel.getChild("main") ;
        let xmlRoot = LocaleData.getGrabCityRoot()
        getUiPanel.getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityWeapon, 0, null);
        });
        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityWeapon, 0, null);
        })

        group_main.getChild("btn_point").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:StrVal.LYGRABCITY.STR19, detail: xmlRoot.detailCannon });
        })
        
        let weaponXmls = LocaleData.getGrabCityRoot()._skill[0]._item
        let list_weapon: fgui.GList = group_main.getChild("list_weapon")
        let slefInfo = GameServerData.getInstance().getGrabCityClanPlayerInfo()
        list_weapon.itemRenderer = (index: number, child:fgui.GComponent)=>{
            let weaponXml = weaponXmls[index]
            child.getChild("label_name").text = weaponXml.name
            child.getChild("label_desc").text = weaponXml.desc + UtilsTool.stringFormat(StrVal.LYGRABCITY.STR44, [UtilsTool.nToFStr(slefInfo.combatPower * 2)])
            child.getChild("group_skillIcon", fgui.GComponent).getChild("icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyGrabCity/{0}", [weaponXml.icon])
            let group_need: fgui.GComponent = child.getChild("group_need")
            UtilsUI.setNeedItemGroup(group_need, UtilsUI.getItemIconUrl(VarVal.bonusType.grabCitysw), GameServerData.getInstance().getValueTypeCount(VarVal.bonusType.grabCitysw), 1)
            let btn_use = child.getChild("btn_use", fgui.GButton)
            btn_use.clearClick()
            btn_use.onClick(()=>{
                if (weaponXml.id == "1") {
                    let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
                    let grabCityData = fullInfo.grabCityPlayer
                    let selfclan = grabCityData.clanState
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            let temp = []
                            for (let index = 0; index < args.rankList.length; index++) {
                                const element = args.rankList[index];
                                if (element.guid != grabCityData.clanState.guid && element.HP != 0) {
                                    temp.push(element)
                                }
                            }
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityWeaponAtk, 0, temp);
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"siegeGroupPacketClanRank",  {stage: selfclan.stage, packet: selfclan.packet});
                }else if(weaponXml.id == "2"){
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            if (!btn_skipAnim.selected) {
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyGrabCityZone, 0, {wid:weaponXml.id, harm: args.harm, city:args.battleList, callBack: ()=>{
                                    let boun = LyGrabCity.getRewardBonuseItem(args.activityItem, args.bonusesResult)
                                    if (boun.length > 0) {
                                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyItemRewardCity, 0, { tip: UtilsTool.stringFormat(StrVal.LYGRABCITY.STR18, [UtilsTool.nToFStr(args.harm)]),
                                            bonuseItems : boun
                                        });
                                    }
                                }});
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityWeapon, 0, null);
                            }else{
                                let boun = LyGrabCity.getRewardBonuseItem(args.activityItem, args.bonusesResult)
                                if (boun.length > 0) {
                                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyItemRewardCity, 0, { tip: UtilsTool.stringFormat(StrVal.LYGRABCITY.STR18, [UtilsTool.nToFStr(args.harm)]),
                                        bonuseItems : boun
                                    });
                                }
                            }
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"siegeSkill", {skill: Number(weaponXml.id)});
                }
            });
        }
        list_weapon.numItems = weaponXmls.length
        let bounItems = UtilsUI.getBonuseItemsByBonusesId(weaponXmls[0].bonusId)
        let list_reward: fgui.GList = group_main.getChild("list_reward")
        list_reward.itemRenderer = (index: number, child: fgui.GComponent)=>{
            UtilsUI.setUIGroupItem(bounItems[index], child, null)
        }
        UtilsUI.setFguiGlistDelayNumItems(list_reward, bounItems.length)

        // list_reward.numItems = 
        // btn_gou     
        
        // btn_speed.onClick(()=>{
        //     if (!PlatformAPI.isBinaryExamine()) {
        //         let openData = UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.vein_speed);
        //         if (openData) {
                    
        //         }else{
        //             ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.MONTHCARD, type: MonthCardType.Life});
        //             btn_speed.selected = false
        //         }  
        //     }
        // })
        let btn_skipAnim = group_main.getChild("btn_skipAnim", fgui.GButton)
        let skipAnim = LocaleUser.getUser("LyGrabCityWeapon_skipAnim")
        if (skipAnim != undefined) {
            btn_skipAnim.selected = LocaleUser.getUser("LyGrabCityWeapon_skipAnim") == "1"
        }
        btn_skipAnim.on(fgui.Event.STATUS_CHANGED, ()=>{
            LocaleUser.setUser("LyGrabCityWeapon_skipAnim", btn_skipAnim.selected? "1":"0")
            LocaleUser.flush()
        }, this)
    }

    public onViewUpdate(params: any): void {
        
    }

    public onViewDestroy(): void {
        // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityZone, 0, { refreshList: true });
    }
}


