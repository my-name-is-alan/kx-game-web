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
import { Label, animation, loader, math } from "cc";
import { LyBrumeNote } from "./LyBrumeNote";
import { LyBrumeIsleAward } from "./LyBrumeIsleAward";
import { LyBrumeIsleRank } from "./LyBrumeIsleRank";
import { LyBrumeIsleGift } from "./LyBrumeIsleGift";
import { LyBrumeIsleFire } from "./LyBrumeIsleFire";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { LyClanJoin } from "./LyClanJoin";
import { LyGrabCityBattle } from "./LyGrabCityBattle";
import { LyGrabCityWeapon } from "./LyGrabCityWeapon";
import { GrabCityState } from "./LyGrabCity";
import { LyGrabCityBattleLog } from "./LyGrabCityBattleLog";
import { FguiGTween } from "../Kernel/FguiGTween";

export class LyGrabCityZone extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyGrabCity";
        this.viewResI.pkgName = "LyGrabCity";
        this.viewResI.comName = "LyGrabCityZone";
    }
    
    private group_chat: fgui.GComponent
    private xmlRoot: any
    private grabCityData: any
    private selfclan:any
    private cityRankArr: any = []
    private myZoneCityRankArr: any = []
    private timeInsFun = []
    private actState: any 

    private group_draw: fgui.GComponent
    private list_bg: fgui.GList
    private list_city: fgui.GList

    //ui
    private bar_hp: fgui.GProgressBar
    private label_rank: fgui.GLabel
    private label_rankDes: fgui.GLabel
    private label_time: fgui.GLabel
    public onViewCreate(params:any): void {
        this.xmlRoot = LocaleData.getGrabCityRoot()
        let FZNAME = ["A-","B-","C-","D-"]
        let FZNAMEBIG = [this.xmlRoot.primaryName, this.xmlRoot.advancedName]
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        this.actState = fullInfo.grabCityPlayer.state
        this.grabCityData = fullInfo.grabCityPlayer
        this.selfclan = this.grabCityData.clanState
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        
        this.group_draw = group_main.getChild("draw_main")
        this.list_bg = this.group_draw.getChild("list_bg")
        this.list_city = this.group_draw.getChild("list_city")

        this.list_bg.itemRenderer = (index: number, child:fgui.GComponent)=>{
            if (index % 2 != 0) {
                child.scaleX = -1
                child.x = 750
            }
        };

        this.list_city.itemRenderer = (index: number, child:fgui.GComponent)=>{
            let singerClan = this.cityRankArr[index]
            let c1: fgui.Controller = child.getController("c1")
            c1.selectedIndex = index % 2
            let loader_city: fgui.GLoader = child.getChild("loader_city")
            let pro_hp = child.getChild("pro_hp", fgui.GProgressBar)
            let img_xiuzhan = child.getChild("img_xiuzhan", fgui.GImage)
            let loader_rank = child.getChild("loader_rank", fgui.GLoader)
            let label_name = child.getChild("label_name", fgui.GLabel)
            let label_severName = child.getChild("label_severName", fgui.GLabel)
            let label_rank = child.getChild("label_rank", fgui.GLabel)
            let group_rank = child.getChild("group_rank", fgui.GGroup)
            let loader_fire1 = child.getChild("loader_fire1", fgui.GLoader3D)
            let loader_fire2 = child.getChild("loader_fire2", fgui.GLoader3D)

            // new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
            //     spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            // }, loader_atkSpine_pet, petProto.modelId);

            let starIMG = []
            for (let index = 1; index <= 3; index++) {
                let star = child.getChild("star" + index, fgui.GLabel)
                star.grayed = true
                starIMG.push(star)
            }
            let prepare = LocaleData.getGrabCityPrepare(singerClan.level)
            for (let index = 0; index < Number(prepare.star); index++) {
                starIMG[index].grayed = false
            }
            if (singerClan.rankOf <= 3) {
                loader_rank.visible = true
                group_rank.visible = false
                loader_rank.url = UtilsTool.stringFormat("ui://LyGrabCity/frame_{0}", [singerClan.rankOf])
            }else{
                group_rank.visible = true
                loader_rank.visible = false
                label_rank.text = String(singerClan.rankOf)
            }
            let cityName = prepare.pic
            if (singerClan.HP == 0) {
                cityName = cityName + "_zero"
            }
            loader_city.url = UtilsTool.stringFormat("ui://LyGrabCity/{0}", [cityName])
            pro_hp.tweenValue((singerClan.HP / singerClan.maxHP) * 100, 0.5) 
            label_name.text = singerClan.name

            let severData = PlatformAPI.getGameServerItem(singerClan.serverId)
            if (severData) {
                label_severName.text = severData.name 
            }else{
                label_severName.text = ""
            }
            img_xiuzhan.visible = this.actState == GrabCityState.ready1 || this.actState == GrabCityState.ready2
            loader_city.clearClick()
            loader_city.onClick(()=>{
                if (this.actState == GrabCityState.ready1 || this.actState == GrabCityState.ready2) {
                    UtilsUI.showMsgTip(StrVal.LYGRABCITY.STR9)
                }else if(singerClan.stage != this.selfclan.stage || singerClan.packet != this.selfclan.packet){
                    UtilsUI.showMsgTip(StrVal.LYGRABCITY.STR11)
                }else if (singerClan.guid == this.selfclan.guid) {
                    UtilsUI.showMsgTip(StrVal.LYGRABCITY.STR10)
                }else if (singerClan.present == 0) {
                    UtilsUI.showMsgTip(StrVal.LYGRABCITY.STR12)
                }else{
                    if(this.actState == GrabCityState.battle1 || this.actState == GrabCityState.battle2){
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityBattle, 0, singerClan);
                    }
                }
            });

            if (singerClan.fireTime != undefined && singerClan.fireTime > severTime) {
                new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                    spp.playAnimation("animation", true); 
                }, loader_fire1, "cj_gongcheng_fire");
                new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                    spp.playAnimation("animation", true); 
                }, loader_fire2, "cj_gongcheng_fire");
            }else{
                loader_fire2.freeSpine()
                loader_fire1.freeSpine()
            }
        };

        //UI
        let main_ui: fgui.GComponent = getUiPanel.getChild("main_ui");
        main_ui.getChild("btn_close").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityZone, 0, null);
        });
        main_ui.getChild("btn_point", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:this.xmlRoot.name, detail: this.xmlRoot.desc });
        });
        let cbox_group: fgui.GComboBox = main_ui.getChild("cbox_group")
        let icon_flag = main_ui.getChild("icon_flag", fgui.GLoader)
        this.bar_hp = main_ui.getChild("bar_hp")
        this.label_rank = main_ui.getChild("label_rank")
        this.label_rankDes = main_ui.getChild("label_rankDes")
        this.label_time = main_ui.getChild("label_time")
        console.log(this.selfclan)
        main_ui.getChild("label_name").text = UtilsTool.stringFormat("{0} {1}级", [this.selfclan.name, this.selfclan.level])
        let btn_gongcheng = main_ui.getChild("btn_gongcheng")
        btn_gongcheng.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityWeapon, 0, null);
        });

        let btn_zhanbao = main_ui.getChild("btn_zhanbao")
        btn_zhanbao.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityBattleLog, 0, args.rankList);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"siegeGroupPacketClanRank",  {stage: this.selfclan.stage  , packet: this.selfclan.packet });
        });
        //cbox_group
        let city_groupData = []
        for (let index = 0; index < this.grabCityData.initial; index++) {
            let data = {}
            data["stage"] = 1
            data["packet"] = index + 1
            data["name"] = FZNAME[index] + FZNAMEBIG[0]
            city_groupData.push(data)
        }

        for (let index = 0; index < this.grabCityData.advanced; index++) {
            let data = {}
            data["stage"] = 2
            data["packet"] = index + 1
            data["name"] = FZNAME[index] + FZNAMEBIG[1]
            city_groupData.push(data)
        }
        
        let groupValues:Array<string> = []
        let selectGroup = 0
        for (let index = 0; index < city_groupData.length; index++) {
            let data = city_groupData[index]
            groupValues.push(data.name)
            if (data.stage == this.selfclan.stage && data.packet == this.selfclan.packet) {
                selectGroup = index
            }
        }
        cbox_group.items = groupValues
        cbox_group.selectedIndex = selectGroup
        cbox_group.on(fgui.Event.STATUS_CHANGED, ()=>{
            this.chooseClanRank(city_groupData[cbox_group.selectedIndex].stage, city_groupData[cbox_group.selectedIndex].packet)
        }, this)

        let tt = LocaleData.getClanFlagById(this.selfclan.flag)
        if (tt) {
            icon_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [tt.icon])
        }

        this.chooseClanRank(this.selfclan.stage, this.selfclan.packet)
        let severTime: number = GameServerData.getInstance().getServerTime()
        let targetTime: number = UtilsTool.getStartDateTime(severTime) + (22* 3600)
        
        let interCallBack = ()=>{
            severTime = GameServerData.getInstance().getServerTime()
            this.label_time.text = UtilsTool.splitTimeString(targetTime - severTime)
        }
        
        
        
        this.setInterval(()=>{
            interCallBack()
        }, 1000);
    }

    public chooseClanRank(stage: number, packet:number){
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                this.cityRankArr = args.rankList
                this.refreshPageCity()
                this.refrshUI()
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        } ,"siegeGroupPacketClanRank",  {stage:stage  , packet:packet });
    }
    
    private refreshPageCity(){
        this.list_bg.numItems = (this.cityRankArr.length - 2) / 3 
        this.list_city.numItems = this.cityRankArr.length
        this.group_draw.height = this.group_draw.getChild("sky").height - 1 + this.list_bg.numItems * 1178
    }

    private refrshUI(){
        this.bar_hp.value = this.selfclan.maxHP
        this.bar_hp.max = this.selfclan.HP
        this.label_rank.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR8, [this.selfclan.rankOf.rankOf == undefined || this.selfclan.rankOf.rankOf < 1 ? StrVal.LYCLANSOLO.STR32 : String(this.selfclan.rankOf.rankOf) ])
        this.label_rankDes.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR13, [ Math.ceil(this.cityRankArr.length / 2)]);
    }

    // 聊天
    private showChatRoomLast(): void {
        let label_content = this.group_chat.getChild("label_content", fgui.GTextField);
        let chatmsg = LyChatRoom.getChatShowMainPage();
        if (chatmsg) {
            label_content.text = chatmsg;
        } else {
            label_content.text = "";
        }
    }

    public onViewUpdate(params: any): void {
        if (params.isChatRoomMsg) {
            this.showChatRoomLast();
        }
        if (params.refreshList) {
            this.chooseClanRank(this.selfclan.stage, this.selfclan.packet)
        }
        if (params.city) {
            this.palyWeaponAnim(params.city, params.wid, params.harm, params.callBack)
        }
    }


    public palyWeaponAnim(citys, attackId, harm, callBack){
        let ui = this.getUiPanel()
        ui.touchable = false
        let number = citys.length
        let animName = attackId == "1" ? "stand_2": "stand_1"
        for (let index = 0; index < citys.length; index++) {
            let city = citys[index];
            for (let index2 = 0; index2 < this.cityRankArr.length; index2++) {
                let cityRank = this.cityRankArr[index2];
                if (city.guid == cityRank.guid) {
                    let gc: fgui.GComponent = this.list_city.getChildAt(index2)
                    if (index == 0) {
                        ui.getChild("main", fgui.GComponent).scrollPane.posY = gc.y  + this.list_city.y - 400
                    }
                    let loader_attack = gc.getChild("loader_attack", fgui.GLoader3D)
                    loader_attack.freeSpine()
                    new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                        spp.playAnimation(animName, false, 0, null, ()=>{
                            number = number - 1
                            if (number == 0) {
                                ui.enabled = true
                                if (callBack) {
                                    callBack()
                                    this.chooseClanRank(this.selfclan.stage, this.selfclan.packet)
                                }
                            }
                            this.onBattleShow(gc, UtilsTool.nToFStr(harm))
                        }); 
                    }, loader_attack, "jm_gcld_jinen");
                }
            }
        }
    }

    private onBattleShow(battleComp:fgui.GComponent, damagetext, fontStr?: string): void {
        let bmp_text: fgui.GTextField
        bmp_text = new fgui.GTextField();
        if (fontStr) {
            bmp_text.font = "ui://CCommon/" + fontStr;
        } else {
            bmp_text.font = "ui://CCommon/font_bmp_damage";
        }
        bmp_text.fontSize = 64;
        bmp_text.letterSpacing = -20;
        bmp_text.setPivot(0.5, 0.5, true);
        bmp_text.autoSize = fgui.AutoSizeType.Both;
        // let battleComp = this.monsterPlayerArr[args.target].comp
        bmp_text.text = "-" + damagetext
        console.log(damagetext)
        // battleComp.getChild("bar_hp", fgui.GProgressBar).value = args.monsterBattleResult.monsterHP
        if (battleComp) {
            bmp_text.x = battleComp.getChild("loader_city").x + battleComp.getChild("loader_city").width / 2
            battleComp.addChild(bmp_text);
            let tw: FguiGTween = FguiGTween.new(bmp_text);
            tw.by(0.1, { scaleX: 0.5, scaleY: 0.5, y: -50 }, { easing: fgui.EaseType.QuadOut }).call(() => {
            }).delay(0.2).by(0.1, { scaleX: -0.5, scaleY: -0.5, y: -50 }, { easing: fgui.EaseType.QuadIn }).call((tw) => {
                bmp_text.removeFromParent();
            }).start();
        }
    }
    // public getIsViewMask(): boolean {
    //     return false;
    // }

    // public static isActOpen(): boolean {
    //     if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.BrumeIsle)) {
    //         return false
    //     }
    //     // 雾隐岛
    //     let activityBRUMOpenState = GameServerData.getInstance().getActivityOpenState(VarVal.ACTIVITY_ID.BRUMEISLE);
    //     if (activityBRUMOpenState && (activityBRUMOpenState.state == 1))  { // 1是开始
    //         return true
    //     }
    //     return false
    // }

    // public static isActNoClose(): boolean {
    //     if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.BrumeIsle)) {
    //         return false
    //     }
    //     // 雾隐岛
    //     let activityBRUMOpenState = GameServerData.getInstance().getActivityOpenState(VarVal.ACTIVITY_ID.BRUMEISLE);
    //     if (activityBRUMOpenState && (activityBRUMOpenState.state == 1 || activityBRUMOpenState.state == 2))  { // 1是开始
    //         return true
    //     }
    //     return false
    // }
    
    // public static isRedPointMarkDie(): boolean {
    //     // 雾隐岛
    //     if (LyBrumeIsle.isActOpen()) {
    //         let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE);
    //         if (activityState && activityState.data) {
    //             let burmData = activityState.data.activityDomainMonster;
    //             if (burmData) {
    //                 if (burmData.moarkMonsterList.length > 0 && burmData.moarkMonsterList[0].monsterCURHP <= 0) {
    //                     return true
    //                 }
    //             }
    //         }
    //     }
    //     return false
    // }

    // public static isRedPointFullPower(): boolean {
    //     // 雾隐岛
    //     if (LyBrumeIsle.isActOpen()) {
    //         let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE);
    //         if (activityState && activityState.data) {
    //             let xmlRoot = LocaleData.getBrumeIsleConfig()
    //             let burmData = activityState.data.activityDomainMonster;
    //             if (burmData && burmData.energy >= Number(xmlRoot.energyMax)) {
    //                 return true
    //             }
    //         }
    //     }
    //     return false
    // }
}


