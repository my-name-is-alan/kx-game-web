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
import { Color, Label, ValueType, math } from "cc";
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
import { LyGrabCityStats } from "./LyGrabCityStats";

export class LyGrabCityReady extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyGrabCity";
        this.viewResI.pkgName = "LyGrabCity";
        this.viewResI.comName = "LyGrabCityReady";
    }
    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel()
        let group_main: fgui.GComponent = getUiPanel.getChild("main") ;
        let xmlRoot = LocaleData.getGrabCityRoot()
        getUiPanel.getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityReady, 0, null);
        });

        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityReady, 0, null);
        });
        let loader_city = group_main.getChild("loader_city", fgui.GLoader)
        let label_name = group_main.getChild("label_clanname", fgui.GLabel)
        let label_selfname = group_main.getChild("label_name", fgui.GLabel)
        let label_clanLevel = group_main.getChild("label_clanLevel", fgui.GLabel)
        let pro_hp = group_main.getChild("pro_hp", fgui.GProgressBar)
        let pro_label = pro_hp.getChild("title", fgui.GProgressBar)
        let starIMG = []
        let label_hpAdd = group_main.getChild("label_hpAdd", fgui.GLabel)
        let label_nextHpAdd = group_main.getChild("label_nextHpAdd", fgui.GLabel)
        let label_addExp1 = group_main.getChild("label_addExp1", fgui.GLabel)
        let label_addExp2 = group_main.getChild("label_addExp2", fgui.GLabel)
        let label_gxNumber1 = group_main.getChild("label_gxNumber1", fgui.GTextField)
        let list_item = group_main.getChild("list_item", fgui.GList)
        let list_item2 = group_main.getChild("list_item2", fgui.GList)
        let group_needItem1 = group_main.getChild("group_needItem1", fgui.GComponent)
        let group_needItem2 = group_main.getChild("group_needItem2", fgui.GComponent)
        let btn_gx1 = group_main.getChild("btn_gx1", fgui.GButton)
        let btn_gx2 = group_main.getChild("btn_gx2", fgui.GButton)
        let btn_jg = group_main.getChild("btn_jg", fgui.GButton)
        let label_look = group_main.getChild("label_look", fgui.GLabel)
        label_look.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityStats, 0, selfclan.playerInfo);
        });
        btn_gx1.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    // atkCityData = args.battleClanState
                    // let boun = LyGrabCity.showRewardUI(args.activityItem, args.bonusesResult)
                    // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyItemRewardCity, 0, { tip: UtilsTool.stringFormat(StrVal.LYGRABCITY.STR18, [UtilsTool.nToFStr(args.harm)]),
                    //     bonuseItems : boun
                    // });
                    // setAtkSpine()
                    let bouns = LyGrabCity.getRewardBonuseItem(args.activityItem, args.bonusesResult)
                    UtilsUI.showItemReward({ bonuseItems: bouns});
                    refreshUI1()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"siegeDonate",  {amount: 0});
        });
        btn_gx2.onClick(()=>{
            let number = GameServerData.getInstance().getValueTypeCount(VarVal.bonusType.grabCityDonate)
            if (number > 0) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        let bouns = LyGrabCity.getRewardBonuseItem(args.activityItem, args.bonusesResult)
                        UtilsUI.showItemReward({ bonuseItems: bouns});
                        refreshUI1()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"siegeDonate",  {amount: number});
            }
           
        });
        for (let index = 1; index <= 3; index++) {
            let star = group_main.getChild("star" + index, fgui.GLabel)
            star.grayed = true
            starIMG.push(star)
        }
        let grabCityData = GameServerData.getInstance().getGrabCityPlayer()
        let selfclan = grabCityData.clanState
        let citySelfInfo = selfclan.playerInfo[grabCityData.selfRank -1]
        let prepare = LocaleData.getGrabCityPrepare(selfclan.level)
        let nextPrepare = LocaleData.getGrabCityPrepare(selfclan.level + 1)
        let cityName = prepare.pic
        if (selfclan.HP == 0) {
            cityName = cityName + "_zero"
        }
        loader_city.url = UtilsTool.stringFormat("ui://LyGrabCity/{0}", [cityName])
        let bouns1 = UtilsUI.getBonuseItemsByBonusesId(xmlRoot.prepareBonuseId)
        list_item.itemRenderer = (index: number, child:fgui.GComponent)=>{
            UtilsUI.setUIGroupItem(bouns1[index], child, null)
        }
        list_item.numItems = bouns1.length
        let bouns2 = UtilsUI.getBonuseItemsByBonusesId(xmlRoot.highPrepareBonuseId)
        list_item2.itemRenderer = (index: number, child:fgui.GComponent)=>{
            UtilsUI.setUIGroupItem(bouns2[index], child, null)
        }
        list_item2.numItems = bouns2.length
        label_addExp1.text =  UtilsTool.stringFormat(StrVal.LYGRABCITY.STR24, [xmlRoot.prepareExp]); 
        label_addExp2.text =  UtilsTool.stringFormat(StrVal.LYGRABCITY.STR24, [xmlRoot.highPrepareExp]); 

        let refreshUI1 = ()=>{
            let grabP = GameServerData.getInstance().getGrabCityPlayer()
            selfclan = grabP.clanState
            citySelfInfo = selfclan.playerInfo[grabCityData.selfRank -1]
            prepare = LocaleData.getGrabCityPrepare(selfclan.level)
            nextPrepare = LocaleData.getGrabCityPrepare(selfclan.level + 1)
            label_name.text = selfclan.name
            label_selfname.text = citySelfInfo.name
            label_clanLevel.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR26, [selfclan.level]);
            for (let index = 0; index < Number(prepare.star); index++) {
                starIMG[index].grayed = false
            }
            pro_hp.value = (selfclan.EXP / Number(prepare.exp)) * 100
            pro_label.text = selfclan.EXP + "/" + Number(prepare.exp)
            label_hpAdd.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR24, [prepare.buff]); 
            if (nextPrepare) {
                label_nextHpAdd.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR24, [nextPrepare.buff]); 
            }
            let moneyCost = LocaleData.getGrabCityPreCost(Number(xmlRoot.prepareCount) - citySelfInfo.donateCount + 1)
            if (citySelfInfo.donateCount == 0) {
                btn_gx1.enabled = false
                label_gxNumber1.color = UtilsUI.getEnoughColor(false)
            }else{
                btn_gx1.enabled = true
                label_gxNumber1.color = UtilsUI.getEnoughColor(true)
            }
            label_gxNumber1.text = citySelfInfo.donateCount 
            if (Number(moneyCost) == 0) {
                if (citySelfInfo.donateCount != 0) {
                    btn_gx1.text = StrVal.LYGRABCITY.STR43
                }else{
                    btn_gx1.text = StrVal.LYGRABCITY.STR42
                }
                group_needItem1.visible = false
            }else{
                btn_gx1.text = StrVal.LYGRABCITY.STR42
                group_needItem1.visible = true
                UtilsUI.setNeedItemGroup(group_needItem1, UtilsUI.getItemIconUrl(VarVal.bonusType.money), GameServerData.getInstance().getPlayerFullInfo().base.money, moneyCost)
            }
            UtilsUI.setNeedItemGroup(group_needItem2, UtilsUI.getItemIconUrl(VarVal.bonusType.grabCityDonate), GameServerData.getInstance().getValueTypeCount(VarVal.bonusType.grabCityDonate), 1)
           
        }
        refreshUI1()

//---------------------------------------
        let label_clanNumber = group_main.getChild("label_clanNumber", fgui.GLabel)
        let label_baseHp = group_main.getChild("label_baseHp", fgui.GLabel)
        let label_clanLevel2 = group_main.getChild("label_clanLevel2", fgui.GLabel)
        let label_allHp = group_main.getChild("label_allHp", fgui.GLabel)
        let list_all = group_main.getChild("list_all", fgui.GList)
        let pro_selfhp = group_main.getChild("pro_selfhp", fgui.GProgressBar)
        let group_title = group_main.getChild("group_title", fgui.GComponent)
        let label_combatPower = group_main.getChild("label_combatPower", fgui.GComponent)

        let refreshUI2 = ()=>{
            let grabP = GameServerData.getInstance().getGrabCityPlayer()
            selfclan = grabP.clanState
            citySelfInfo = selfclan.playerInfo[grabCityData.selfRank -1]
            prepare = LocaleData.getGrabCityPrepare(selfclan.level)
            UtilsUI.setTitleIconByTitleId(group_title, citySelfInfo.phase, citySelfInfo.title)
            label_clanNumber.text = selfclan.playerInfo.length
            label_clanLevel2.text = selfclan.level
            label_baseHp.text = UtilsTool.nToFStr(selfclan.combatPower * 20)
            label_allHp.text = UtilsTool.nToFStr(selfclan.maxHP) + "+(" + prepare.buff  + "%)"
            label_combatPower.text = UtilsTool.nToFStr(citySelfInfo.combatPower)
            pro_selfhp.value = (citySelfInfo.HP / citySelfInfo.maxHP) * 100
            let charInfo = LocaleData.getCharShowResInfo(citySelfInfo.character, citySelfInfo.phase, citySelfInfo.appearance, citySelfInfo.avatar);
            group_main.getChild("group_head", fgui.GComponent).getChild("group_icon", fgui.GComponent).getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            UtilsUI.setFguiGlistDelayNumItems(list_all, selfclan.playerInfo.length)
        }
       
        list_all.itemRenderer = (index: number, child: fgui.GComponent)=>{
            let info = selfclan.playerInfo[index]
            let pro_hp = child.getChild("pro_hp", fgui.GProgressBar)
            let group_title = child.getChild("group_title", fgui.GComponent)
            let label_combatPower = child.getChild("label_combatPower", fgui.GComponent)
            let charInfo = LocaleData.getCharShowResInfo(info.character, info.phase, info.appearance, info.avatar);
            child.getChild("group_head", fgui.GComponent).getChild("group_icon", fgui.GComponent).getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            label_combatPower.text = UtilsTool.nToFStr(info.combatPower)
            pro_hp.value = (info.HP / info.maxHP) * 100
            UtilsUI.setTitleIconByTitleId(group_title, info.phase, info.title)
            child.getChild("label_name").text = info.name
        }
       

        btn_jg.onClick(()=>{
            refreshUI2()
        });
    }
    public onViewUpdate(params: any): void {
        
    }

    public onViewDestroy(): void {
    }
}


