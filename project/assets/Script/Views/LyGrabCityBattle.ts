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
import { BodyPointType, BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { LyGuideDetail } from "./LyGuideDetail";
import { LyChatRoom } from "./LyChatRoom";
import { GameServer } from "../Kernel/GameServer";
import { LyBrumeIsleLand } from "./LyBrumeIsleLand";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { Label, Vec2, sp } from "cc";
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
import { FguiGTween } from "../Kernel/FguiGTween";

export class LyGrabCityBattle extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyGrabCity";
        this.viewResI.pkgName = "LyGrabCity";
        this.viewResI.comName = "LyGrabCityBattle";
    }
    private group_chat: fgui.GComponent
    private xmlRoot: any

    private pro_atkHp: fgui.GProgressBar
    public onViewCreate(params:any): void {
        // let getUiPanel: fgui.GComponent =
        let group_main: fgui.GComponent =  this.getUiPanel();
        let atkCityData = params
        let durationOpen: boolean = false
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let grabCityData = fullInfo.grabCityPlayer
        this.xmlRoot = LocaleData.getGrabCityRoot()
        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityBattle, 0, null);
        });
        let icon_flag = group_main.getChild("icon_flag", fgui.GLoader)
        let label_atkName = group_main.getChild("label_atkName", fgui.GLabel)
        let label_atkSever = group_main.getChild("label_atkSever", fgui.GLabel)
        this.pro_atkHp = group_main.getChild("pro_atkHp")
        let label_timeref = group_main.getChild("label_timeref", fgui.GLabel)
        let label_power = group_main.getChild("label_power", fgui.GLabel)
        let btn_add = group_main.getChild("btn_add", fgui.GButton)
        let list_rewardItem = group_main.getChild("list_rewardItem", fgui.GList)
        let btn_attack = group_main.getChild("btn_attack", fgui.GButton)

        //敌人
        let group_atkSpine = group_main.getChild("group_atkSpine", fgui.GComponent)
        let loader_atkSpine_pet = group_atkSpine.getChild("loader_atkSpine_pet", fgui.GLoader3D)
        let group_atkspine_ram = group_atkSpine.getChild("group_atkspine_ram", fgui.GComponent)
        let group_phase = group_atkSpine.getChild("group_phase", fgui.GComponent)
        let label_atkPeopleName = group_atkSpine.getChild("label_atkPeopleName", fgui.GLabel)
        let pro_atkselfHp = group_atkSpine.getChild("pro_atkselfHp", fgui.GProgressBar)
        let loader_attlck = group_atkSpine.getChild("loader_attlck", fgui.GLoader3D)
   
        let group_selfPhase = group_main.getChild("group_selfPhase", fgui.GComponent)
        let group_selfSpine_ram = group_main.getChild("group_selfSpine_ram", fgui.GComponent)
        let loader_selfSpine_pet = group_main.getChild("loader_selfSpine_pet", fgui.GLoader3D)
        let label_selfName = group_main.getChild("label_selfName", fgui.GLabel)
        let label_combatPower = group_main.getChild("label_combatPower", fgui.GLabel)
        let group_atkBtn = group_main.getChild("group_atkBtn", fgui.GGroup)
        let label_cityLose = group_main.getChild("label_cityLose", fgui.GLabel)
      
        let loader_xuli = group_main.getChild("loader_xuli", fgui.GLoader3D)
        label_cityLose.text = StrVal.LYGRABCITY.STR16
        group_main.getChild("n20").text = StrVal.LYGRABCITY.STR17
        let bounId = this.xmlRoot.killBonusesId.split(";")[grabCityData.bonusesLevel - 1]
        let bounItems = UtilsUI.getBonuseItemsByBonusesId(bounId)
        console.log(bounItems)
        list_rewardItem.itemRenderer = (index:number, child: fgui.GComponent)=>{
            UtilsUI.setUIGroupItem(bounItems[index], child, null)
        }
        UtilsUI.setFguiGlistDelayNumItems(list_rewardItem, bounItems.length)
        let lastIndex = 0
        btn_attack.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    atkCityData = args.battleClanState
                    selfSpine.getRolePlayer().playAnimation(VarVal.SPINE_ANI_NAME.attack, false, null, (aniName:string, envName:string)=>{
                        if (envName == VarVal.SPINE_ENV_NAME.attack_hit) {
                            //敌人已经倒下
                            if (lastIndex != atkCityData.present) {
                                beAtkSpine.getRolePlayer().playAnimation(VarVal.SPINE_ANI_NAME.death, false)
                                pro_atkselfHp.tweenValue(0, 0.4);
                            }else{
                                beAtkSpine.getRolePlayer().playAnimation(VarVal.SPINE_ANI_NAME.hurt, false)
                                let playerInfo = atkCityData.playerInfo[atkCityData.present - 1]
                                pro_atkselfHp.tweenValue((playerInfo.HP / playerInfo.maxHP) * 100, 0.4);
                            }
                            this.onBattleShow(group_atkSpine, UtilsTool.nToFStr(args.harm))
                            new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                                 // let localPos = new Vec2(0, 0);
                                // let loader_spine_role = (group_atkspine_ram).getChild("loader_spine_role", fgui.GLoader3D)
                                // if (loader_spine_role.content) {
                                //     localPos = UtilsUI.getSkeAniBonePos(loader_spine_role, BodyPointType.center);
                                // }
                                // loader_attlck.setPosition(localPos.x + loader_spine_role.x , loader_spine_role.y - localPos.y) 
                                spp.playAnimation("animation", false, null, null, ()=>{
                                    let boun = LyGrabCity.getRewardBonuseItem(args.activityItem, args.bonusesResult)
                                    if (boun.length > 0) {
                                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyItemRewardCity, 0, { tip: UtilsTool.stringFormat(StrVal.LYGRABCITY.STR18, [UtilsTool.nToFStr(args.harm)]),
                                            bonuseItems : boun
                                        });
                                    }
                                    refreshUI()
                                },)
                            }, loader_attlck, "zd_gcld_shouji_1");
                        }
                    }, ()=>{
                        selfSpine.getRolePlayer().playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                    })

                    new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                        let localPos = new Vec2(0, 0);
                        let loader_spine_role = (group_atkspine_ram).getChild("loader_spine_role", fgui.GLoader3D)
                        if (loader_spine_role.content) {
                            localPos = UtilsUI.getSkeAniBonePos(loader_spine_role, BodyPointType.center);
                        }
                        // loader_attlck.setPosition(localPos.x + loader_spine_role.x , loader_spine_role.y - localPos.y) 
                        spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, false, 0, ()=>{
                            let boun = LyGrabCity.getRewardBonuseItem(args.activityItem, args.bonusesResult)
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyItemRewardCity, 0, { tip: UtilsTool.stringFormat(StrVal.LYGRABCITY.STR18, [UtilsTool.nToFStr(args.harm)]),
                                bonuseItems : boun
                            });
                            refreshUI()
                        },)
                    }, loader_xuli, "zd_gcld_xuli_1");
                    
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"siegeBattle",  {battleClanId: atkCityData.guid,});
        });

        label_atkName.text = UtilsTool.stringFormat("{0}  {1}", [atkCityData.name, atkCityData.level])
        let severData = PlatformAPI.getGameServerItem(atkCityData.serverId)
        if (severData) {
            label_atkSever.text = severData.name 
        }else{
            label_atkSever.text = ""
        }
        let tt = LocaleData.getClanFlagById(atkCityData.flag)
        if (tt) {
            icon_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [tt.icon])
        }


       
        let beAtkSpine = null
        //自身形象 
        let selfInfo = fullInfo.base
        let charInfo = LocaleData.getCharShowResInfo(selfInfo.character, selfInfo.phase, selfInfo.appearance, selfInfo.avatar);
        let mountInfo = LocaleData.getMountShowResInfo(selfInfo.mountType, selfInfo.mountSkin);
        let selfSpine = new SpineRoldMountPlayer(group_selfSpine_ram).loadSpineRole(charInfo).loadSpineMount(mountInfo);
        if (selfInfo.summonPet && String(selfInfo.summonPet).length > 1) {
            let petProto = LocaleData.getPetProto(selfInfo.summonPet);
            new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }, loader_selfSpine_pet, petProto.modelId);
        }
        UtilsUI.setTitleIconByTitleId(group_selfPhase, selfInfo.phase, selfInfo.titleId);
        label_selfName.text = selfInfo.name;
        label_combatPower.text = UtilsTool.nToFStr(selfInfo.combatPower);

        
        let setAtkSpine = ()=>{
            lastIndex = atkCityData.present
            let playerInfo = atkCityData.playerInfo[atkCityData.present - 1]
            let charInfo = LocaleData.getCharShowResInfo(playerInfo.character, playerInfo.phase, playerInfo.appearance, playerInfo.avatar);
            let mountInfo = LocaleData.getMountShowResInfo(playerInfo.mountType, playerInfo.mountSkin);
            beAtkSpine = new SpineRoldMountPlayer(group_atkspine_ram).loadSpineRole(charInfo).loadSpineMount(mountInfo);
            if (playerInfo.summonPet && String(playerInfo.summonPet).length > 1) {
                let petProto = LocaleData.getPetProto(playerInfo.summonPet);
                if (petProto.length > 1) {
                    petProto = petProto[0]
                }
                new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                }, loader_atkSpine_pet, petProto.modelId);
            }
            UtilsUI.setTitleIconByTitleId(group_phase, playerInfo.phase);
            label_atkPeopleName.text = playerInfo.name;
            if (pro_atkselfHp.value == 0) {
                pro_atkselfHp.value = 100
            }
            pro_atkselfHp.tweenValue((playerInfo.HP / playerInfo.maxHP) * 100, 0.4);
        }

        let info = GameServerData.getInstance().getPlayerFullInfo().grabCityPlayer.clanState.playerInfo[grabCityData.selfRank -1]
        let refreshUI = ()=>{
            //城池已被击败
            if (atkCityData.HP == 0 || atkCityData.present == 0) {
                group_atkBtn.visible = false
                group_atkSpine.visible = false
                label_cityLose.visible = true
                this.pro_atkHp.value = 0
            }else{
                group_atkBtn.visible = true
                group_atkSpine.visible = true
                label_cityLose.visible = false
                setAtkSpine()
                info = GameServerData.getInstance().getPlayerFullInfo().grabCityPlayer.clanState.playerInfo[grabCityData.selfRank -1]
                this.pro_atkHp.value = (atkCityData.HP / atkCityData.maxHP) * 100
                label_power.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR14, [info.stamina]) 
            }
        }

        refreshUI()
        let interCallBack = ()=>{
            let severTime = GameServerData.getInstance().getServerTime()
            if (atkCityData.HP != 0 || atkCityData.present != 0) {
                label_timeref.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR15, [UtilsTool.splitTimeString(info.staminaRecover  - severTime)]) 
            }
        }
        interCallBack()
        this.setInterval(()=>{
            interCallBack()
        }, 1000);

        // 聊天
        this.group_chat = group_main.getChild("Group_Chat")
        this.group_chat.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyChatRoom, 0, { isNewMsgChannel: true });
        })
        this.showChatRoomLast();
    }

    
    private onBattleShow(battleComp, damagetext, fontStr?: string): void {
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
        bmp_text.text = damagetext
        // battleComp.getChild("bar_hp", fgui.GProgressBar).value = args.monsterBattleResult.monsterHP
        if (battleComp) {
            bmp_text.x = battleComp.width / 2
            battleComp.addChild(bmp_text);
            let tw: FguiGTween = FguiGTween.new(bmp_text);
            tw.by(0.1, { scaleX: 0.5, scaleY: 0.5, y: -50 }, { easing: fgui.EaseType.QuadOut }).call(() => {
            }).delay(0.2).by(0.1, {scaleX: -0.5, scaleY: -0.5, y: -50 }, { easing: fgui.EaseType.QuadIn }).call((tw) => {
                bmp_text.removeFromParent();
            }).start();
        }
    }

    // private doShowDamageTextOne(showArr:Array<any>):void {
    //     let showData = showArr[0];
    //     if (showData) { // 没有正在进行的显示。
    //         let num:any = showData.num;
    //         let isCrit:boolean = showData.isCrit;
    //         let pos = battleObject.getShowDamagePosition();
    //         // 文本
    //         let bmp_text:fgui.GTextField | fgui.GLoader;
    //         if (type == DamageUIType.Damage) {
    //             bmp_text = new fgui.GTextField();
    //             if (isCrit) {
    //                 bmp_text.font = "ui://CCommon/font_bmp_crit";
    //                 bmp_text.fontSize = 64;
    //                 bmp_text.letterSpacing = -20;
    //             } else {
    //                 bmp_text.font = "ui://CCommon/font_bmp_damage";
    //                 bmp_text.fontSize = 48;
    //                 bmp_text.letterSpacing = -10;
    //             }
    //             bmp_text.autoSize = fgui.AutoSizeType.Both;
    //             bmp_text.text = String(0 - Number(num));
    //         } else if (type == DamageUIType.Cure) {
    //             bmp_text = new fgui.GTextField();
    //             bmp_text.font = "ui://CCommon/font_bmp_cure";
    //             bmp_text.fontSize = 48;
    //             bmp_text.letterSpacing = -10;
    //             bmp_text.autoSize = fgui.AutoSizeType.Both;
    //             bmp_text.text = "+" + String(num);
    //         } else {
    //             bmp_text = new fgui.GLoader();
    //             bmp_text.autoSize = true;
    //             if (type == DamageUIType.Skill) {
    //                 bmp_text.url = UtilsTool.stringFormat("ui://LyBattleMain/{0}", [num]);
    //             } else {
    //                 bmp_text.url = UtilsTool.stringFormat("ui://LyBattleMain/battle_text{0}", [type]);
    //             }
    //         }
    //         // 添加
    //         this.group_start.addChild(bmp_text);
    //         bmp_text.setPivot(0.5, 0.5, true);
    //         if (type == DamageUIType.Damage || type == DamageUIType.Cure) { // 伤害、血量
    //             bmp_text.setPosition(pos.x, pos.y + 200);
    //             // 动效
    //             bmp_text.setScale(2.5, 2.5);
    //             bmp_text.alpha = 0.5;
    //             this.getGTween(bmp_text).by(0.3, {y:-200, scaleX:-1.5, scaleY:-1.5, alpha:0.5}, {easing: fgui.EaseType.QuadOut}).call((tw) => {
    //                 showArr.shift();
    //                 this.doShowDamageTextOne(showArr);
    //             }).delay(0.2).by(0.2, {y:-120, alpha:0}, {easing: fgui.EaseType.QuadIn}).call((tw) => {
    //                 this.delGTween(tw);
    //                 bmp_text.removeFromParent();
    //             }).start();

    //         } else if (type == DamageUIType.Skill) { // 技能名称
    //             let outPos:Vec2;
    //             if (battleObject.isLeftSide()) {
    //                 outPos = new Vec2(pos.x - 200, pos.y - 100);
    //             } else {
    //                 outPos = new Vec2(pos.x + 200, pos.y - 100);
    //             }
    //             bmp_text.setPosition(outPos.x, outPos.y);
    //             // 动效
    //             bmp_text.setScale(0.5, 0.5);
    //             bmp_text.alpha = 0.5;
    //             this.getGTween(bmp_text).to(0.3, {x:pos.x, alpha:1}, {easing: fgui.EaseType.QuadOut}).call((tw) => {
    //                 showArr.shift();
    //                 this.doShowDamageTextOne(showArr);
    //             }).delay(0.2).to(0.2, {x:outPos.x, alpha:0.5}, {easing: fgui.EaseType.QuadIn}).call((tw) => {
    //                 this.delGTween(tw);
    //                 bmp_text.removeFromParent();
    //             }).start();
                
    //         } else { // 效果名
    //             bmp_text.setPosition(pos.x, pos.y);
    //             // 动效
    //             this.getGTween(bmp_text).by(0.15, {scaleX:1, scaleY:1}, {easing: fgui.EaseType.QuadOut})
    //             .by(0.15, {scaleX:-1, scaleY:-1}, {easing: fgui.EaseType.QuadOut}).call((tw) => {
    //                 showArr.shift();
    //                 this.doShowDamageTextOne(showArr);
    //             }).delay(0.2).by(0.2, {y:-120, alpha:0}, {easing: fgui.EaseType.QuadIn}).call((tw) => {
    //                 this.delGTween(tw);
    //                 bmp_text.removeFromParent();
    //             }).start();
    //         }
    //     }
    // }
   
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
    }

    public onViewDestroy(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityZone, 0, { refreshList: true });
    }
}


