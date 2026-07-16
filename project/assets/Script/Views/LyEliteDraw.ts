//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServer } from "../Kernel/GameServer";
import { MonthCardItemType, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { VarVal } from "../Values/VarVal";
import { LyEliteMonster } from "./LyEliteMonster";
import { LyEliteDrawReward } from "./LyEliteDrawReward";
import { LyEliteDisperse } from "./LyEliteDisperse";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { LocaleUser } from "../Kernel/LocaleUser";
import { LyPayGiftGroup } from "./LyPayGiftGroup";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { LyEliteDrawGift } from "./LyEliteDrawGift";
import { LyPayUniteWeekCard } from "./LyPayUniteWeekCard";
import { LyPayExquisite, PayExquisitePage } from "./LyPayExquisite";
import { Vec2 } from "cc";
import { LyItemTips } from "./LyItemTips";

export class LyEliteDraw extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyEliteDraw";
    }

    private uiPanel:fgui.GComponent
    private group_mainGL: fgui.GComponent
    private label_money1: fgui.GLabel
    private label_money2: fgui.GLabel
    private label_one: fgui.GLabel
    private label_five: fgui.GLabel
    private label_baodi: fgui.GLabel
    private label_drawTimes: fgui.GLabel
    private btn_ad: fgui.GButton
    private spinePlayer1:SpinePlayer
    private draw: fgui.GComponent
    private pro_score: fgui.GProgressBar
    private list_item: fgui.GList
    private boxSpine: SpinePlayer
    private group_left: fgui.GComponent 
    private group_right: fgui.GComponent 
    private group_uniteItem: fgui.GComponent 
    private group_zsItem: fgui.GComponent 
    //数据
    private playBase
    private root
    private allDraw: any
    public onViewCreate(_params:any): void {
        this.uiPanel = this.getUiPanel().getChild("mian");
    
        this.uiPanel.visible = false
        let spinePlayer3 = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation("animation", false, 0, ()=>{
                this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteDraw, 0, null)
                });
                this.uiPanel.visible = true
                new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                }, this.uiPanel.getChild("loader_role", fgui.GLoader3D), "jm_menkechouka_yaoyue");
        
                this.spinePlayer1 = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                    spp.playAnimation("stand", true, 0);
                }, this.uiPanel.getChild("loader_dask", fgui.GLoader3D), "jm_menke_chouka");
             }, null);

        }, this.getUiPanel().getChild("loader3d_join", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_yunwu_guochang);

        (<fgui.GButton>this.uiPanel.getChild("btn_close")).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteDraw, 0, null)
        });
       
        let loader_ditem0: fgui.GLoader = this.uiPanel.getChild("group_add1", fgui.GComponent).getChild("loader_icon")
        let loader_it: fgui.GLoader = this.uiPanel.getChild("group_add2", fgui.GComponent).getChild("loader_icon")
        // let group_
        this.label_money1 = this.uiPanel.getChild("group_add1", fgui.GComponent). getChild("label_number")
        this.btn_ad = this.uiPanel.getChild("btn_ad")

        this.group_left = this.uiPanel.getChild("group_left")
        this.group_right = this.uiPanel.getChild("group_right")
        this.group_uniteItem = this.group_left.getChild("GroupItem")
        this.group_zsItem = this.group_right.getChild("GroupItem")
        this.draw = this.uiPanel.getChild("draw");
        this.pro_score = this.draw.getChild("pro_score");
        this.list_item = this.draw.getChild("list_item");
        let loader_bx = this.uiPanel.getChild("loader_bx",fgui.GLoader3D);
        this.draw.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteDrawGift, 0, null)
        });

        this.boxSpine = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            this.refreshUI()
        }, loader_bx, "ui_xiaobaoxiang");
   
        this.root = LocaleData.getEliteMonsterRoot()
        let costProto = LocaleData.getItemProto(this.root.recruit_cost_item)
        this.uiPanel.getChild("group_add1", fgui.GComponent).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, costProto.id, "1"), buyCall:() => {
                this.refreshUI()
            }});
        });
        
        this.allDraw = this.root._specialguarantees[0]._item
        this.list_item.itemRenderer = (index: number, child: fgui.GComponent)=>{
            child.clearClick()
            let group_item: fgui.GComponent = child.getChild("group_item")
            let c1: fgui.Controller = child.getController("c1")
            let label_score: fgui.GLabel = child.getChild("label_score")
            if (index == 0) {
                group_item.visible = false
                label_score.text = "0"
                c1.selectedIndex = 0
            }else{
                index = index - 1
                let drawProt = this.allDraw[index]
                group_item.visible = true
                label_score.text = drawProt.times
                c1.selectedIndex = this.playBase.elityMonsterDrawCardRewardCount >= Number(drawProt.times) ? 0:1
                label_score.text = drawProt.times
                let proto = LocaleData.getItemProto(drawProt.icon)
                group_item.getChild("loader_back", fgui.GLoader3D).url =  UtilsTool.stringFormat("ui://CCommon/item_back{0}", [proto.quality]);
                group_item.getChild("loader_icon", fgui.GLoader3D).url =  UtilsTool.stringFormat("ui://CCommon/{0}", [proto.icon]);
                child.onClick(()=>{
                    let _params = {
                        bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, "", proto.id, "1"),
                        pos:group_item.localToGlobal(0, 0),
                        size:new Vec2(group_item.width, group_item.height)
                    }
                    ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyItemTips, 0, _params);
                });
            }
        }
        
        // group_left.visible = 
        
        let btn_card = this.uiPanel.getChild("btn_card")
        btn_card.visible = !PlatformAPI.isBinaryExamine()
        btn_card.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayUniteWeekCard, 0, {type:1});
        });

        this.uiPanel.getChild("btn_bx", fgui.GComponent).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteDrawGift, 0, null)
        });

        let btn_zs = this.uiPanel.getChild("btn_zs")
        btn_zs.visible = !PlatformAPI.isBinaryExamine()
        btn_zs.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayUniteWeekCard, 0, {type:0});
        });

        let btn_go = this.uiPanel.getChild("group_add2", fgui.GComponent)
        if (PlatformAPI.isBinaryExamine() && PlatformAPI.isMiniGameOniOS()) {
            btn_go.visible = false;
        }
        btn_go.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.RECHARGE, type:VarVal.bonusType.stone});
        });


        this.label_money2  = this.uiPanel.getChild("group_add2", fgui.GComponent).getChild("label_number")
        this.label_baodi = this.uiPanel.getChild("label_baodi")
        let label_glDesc: fgui.GLabel = this.uiPanel.getChild("label_glDesc")
        this.label_drawTimes  = this.uiPanel.getChild("label_drawTimes")
        label_glDesc.text = StrVal.LYELITEMONSTER.STR11

        let btn_one: fgui.GButton = this.uiPanel.getChild("btn_one")
        let loader_ditem1: fgui.GLoader = btn_one.getChild("icon")
        this.label_one = btn_one.getChild("label_number")

        let btn_five: fgui.GButton = this.uiPanel.getChild("btn_five")
        let loader_ditem2: fgui.GLoader = btn_five.getChild("icon")
        this.label_five = btn_five.getChild("label_number")
        PointRedData.getInstance().registerPoint(btn_five, PointRedType.LyEliteDraw)
        
        if (GameServerData.getInstance().getItemCountByProtoId(this.root.recruit_cost_item) >= 5) {
            LocaleUser.setUser("LyEliteDrawRedPoint", UtilsTool.TimeToDateStr(GameServerData.getInstance().getServerTime()))
            LocaleUser.flush()
        }

        let btn_gl: fgui.GButton = this.uiPanel.getChild("btn_gl")
        this.group_mainGL = this.uiPanel.getChild("group_mainGL")

        // this.uiPanel.getChild("label_title", fgui.GLabel).text = StrVal.LYELITEMONSTER.STR45
        // this.uiPanel.getChild("n62", fgui.GLabel).text = StrVal.LYELITEMONSTER.STR46
  
       
        loader_ditem0.url = UtilsUI.getItemIconUrl(costProto);
        loader_it.url = UtilsUI.getItemIconUrl(VarVal.bonusType.stone);
        loader_ditem1.url = UtilsUI.getItemIconUrl(costProto);
        loader_ditem2.url = UtilsUI.getItemIconUrl(costProto);

        let skipAnimBtn = this.uiPanel.getChild("btn_skip", fgui.GButton)
        skipAnimBtn.selected = LocaleUser.getUser(VarVal.FIELD_SV.ElLITE_SKIPANIM) == "1"
        skipAnimBtn.onClick(()=>{
            LocaleUser.setUser(VarVal.FIELD_SV.ElLITE_SKIPANIM, skipAnimBtn.selected? "1":"0");
            LocaleUser.flush()
        })

        //概率
        btn_gl.onClick(()=>{
            let mGCom :fgui.GComponent = fgui.UIPackage.createObject("LyEliteMonster", "group_mainGL").asCom;
            (<fgui.GButton>mGCom.getChild("btn_back")).onClick(()=>{
                mGCom.dispose()
            })
            mGCom.getChild("label_title", fgui.GLabel).text = StrVal.LYELITEMONSTER.STR51
            let list_gl: fgui.GList = mGCom.getChild("list_gl")
            let items: Array<any> = LocaleData.getEliteMonsterRoot()._qualityprobability[0]._item;
            let all = 0
            let getGL: Function = (id): any =>{
                id = String(id)
                for (let index = 0; index < items.length; index++) {
                    let element = items[index];
                    if (id == element.id) {
                        return element
                    }
                }
            }
            for (let index = 0; index < items.length; index++) {
                let element = items[index];
                all = all + Number(element.weight) 
            }
            list_gl.itemRenderer = (index: number, child:fgui.GComponent)=>{
                let item = getGL(index + 1)
                let itemSuipian = getGL(index + 6)
                child.getChild("loader_full", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/frame_gailvdi{0}",[ Number(item.quality)])
                child.getChild("loader_suip", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/frame_gailvdi{0}",[ Number(itemSuipian.quality)])
                let label_name: fgui.GTextField = child.getChild("label_name", fgui.GTextField)
                let color = UtilsUI.getQualityColor(Number(item.quality))
                label_name.strokeColor = color
                let label_1 = child.getChild("label_1", fgui.GTextField)
                label_1.strokeColor = color
                label_1.text = Number(item.probability) * 100 + "%"
                let label_2 = child.getChild("label_2", fgui.GTextField)
                label_2.strokeColor = color
                label_2.text = Number(itemSuipian.probability) * 100 + "%"
                label_name.text = StrVal.LYELITEMONSTERPRONAME[index]
            };
            list_gl.numItems = items.length / 2
            mGCom.setSize(this.getUiPanel().width, this.getUiPanel().height);
            this.getUiPanel().addChild(mGCom)
        });

        btn_one.title = StrVal.LYELITEMONSTER.STR9
        btn_five.title = StrVal.LYELITEMONSTER.STR10


        btn_one.onClick(()=>{
        //    let itemNumber = GameServerData.getInstance().getItemCountByProtoId(this.root.recruit_cost_item)
        //    if (itemNumber >= 1) {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            if (skipAnimBtn.selected) {
                                this.refreshUI()
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteDrawReward, 0, {debris:args.debris})
                            }else{
                                this.pageTouchable(false)
                                this.spinePlayer1.playAnimation("L", false, 1, null, ()=>{
                                    this.pageTouchable(true)
                                    this.refreshUI()
                                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteDrawReward, 0, {debris:args.debris})
                                    this.spinePlayer1.playAnimation(VarVal.SPINE_ANI_NAME.stand, true, 0);
                                })
                            }
                        } else {
                            let itemNumber = GameServerData.getInstance().getItemCountByProtoId(this.root.recruit_cost_item)
                            if (itemNumber < 1) {
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.root.recruit_cost_item, "1"), buyCall:() => {
                                    this.refreshUI();
                                }})
                            }
                            this.tryShowLyPayGiftGroup()
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } , "recruitsingleelitemonster", null)
               
            // }else{
            //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.root.recruit_cost_item, "1"), buyCall:() => {
            //         this.refreshUI()
            //     }});
            // }
        })

        this.btn_ad.onClick(()=>{
            PlatformAPI.doSdkRewardVideoAD((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                } else {
                    UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        if (skipAnimBtn.selected) {
                            this.refreshUI()
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteDrawReward, 0, {debris:args.debris} )
                        }else{
                            this.pageTouchable(false)
                            this.spinePlayer1.playAnimation("L", false, 1, null, ()=>{
                                this.pageTouchable(true)
                                this.refreshUI()
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteDrawReward, 0, {debris :args.debris, ad: true})
                                this.spinePlayer1.playAnimation(VarVal.SPINE_ANI_NAME.stand, true, 0);
                            })
                        }
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"recruitEliteMonsterForAd", null)
                }
            }, UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.skip_ad))
        });
        
        btn_five.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    if (skipAnimBtn.selected) {
                        this.refreshUI()
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteDrawReward, 0, {debris:args.debris})
                    }else{
                        this.pageTouchable(false)
                        this.spinePlayer1.playAnimation("B", false, 1, null, ()=>{
                            this.pageTouchable(true)
                            this.refreshUI()
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteDrawReward, 0, {debris:args.debris})
                            this.spinePlayer1.playAnimation(VarVal.SPINE_ANI_NAME.stand, true, 0);
                        })
                    }
                } else {
                    let itemNumber = GameServerData.getInstance().getItemCountByProtoId(this.root.recruit_cost_item)
                    if (itemNumber < 5) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.root.recruit_cost_item, "1"), buyCall:() => {
                            this.refreshUI();
                        }})
                    }
                    this.tryShowLyPayGiftGroup()
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } , "recruitmultipleelitemonsters", null)
        })
     

        this.refreshUI()
        this.draw.scrollPane.posX = (this.pro_score.value / this.pro_score.max) * this.pro_score.width
    }

    private pageTouchable(bool: boolean){
        this.uiPanel.touchable = bool
        this.getUiPanel().getChild("btn_back").touchable = bool
    }

    private refreshUI(): void {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        this.playBase = fullInfo.base
        let itemNumber = GameServerData.getInstance().getItemCountByProtoId(this.root.recruit_cost_item)
        this.label_money1.text = String(itemNumber) 
        this.label_money2.text = String(this.playBase.stone)
        let lastNumber = fullInfo.elitemonsterInfo.eliteMonsterRecruitLimit ? fullInfo.elitemonsterInfo.eliteMonsterRecruitLimit : Number(this.root.dailyRecruitLimit)
        this.label_drawTimes.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR55, [lastNumber])
        let adXml = LocaleData.getAdXml(1)
        let adData = GameServerData.getInstance().getAdData(1)
        this.btn_ad.visible = adData.count < Number(adXml.count)
        this.btn_ad.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR54, [Number(adXml.count) - adData.count , adXml.count]) 
        // this.label_one.text = UtilsTool.stringFormat("{0}/{1}", [itemNumber,  1]) 
        // this.label_five.text = UtilsTool.stringFormat("{0}/{1}", [itemNumber,  this.root.recruit_cost_number]) 
        let number = this.playBase.elityMonsterPitySystemCount % 200 
        let number2 = this.playBase.elityMonsterPitySystemCount % 100 
        // if (number == 0 && this.playBase.elityMonsterPitySystemCount != 0) { //必得神话
        //     this.label_baodi.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR47, [Number(this.root.guaranteed_base_number) - number, StrVal.LYELITEMONSTER.STR49, ""]) 
        // }else{ //必得传说或神话
        //     this.label_baodi.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR47, [Number(this.root.guaranteed_base_number) - number, StrVal.LYELITEMONSTER.STR48, StrVal.LYELITEMONSTER.STR49]) 
        // }
        if (number == number2) {
            this.label_baodi.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR47, [Number(this.root.guaranteed_base_number) - number, StrVal.LYELITEMONSTER.STR48, StrVal.LYELITEMONSTER.STR49]) 
        }else{
            if (number > number2) {
                this.label_baodi.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR47, [Number(this.root.guaranteed_base_number) - number, StrVal.LYELITEMONSTER.STR49, ""]) 
            }else{
                this.label_baodi.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR47, [Number(this.root.guaranteed_base_number) - number, StrVal.LYELITEMONSTER.STR48, StrVal.LYELITEMONSTER.STR49]) 
            }
        }
        // this.label_baodi.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR47, []) 
        UtilsUI.setFguiGlistDelayNumItems(this.list_item, this.allDraw.length)
        if (this.playBase.elityMonsterDrawCardReward.length > 0) {
            let get = false
            for (let index = 0; index < this.playBase.elityMonsterDrawCardReward.length; index++) {
                if (this.playBase.elityMonsterDrawCardReward == Number(this.allDraw[this.allDraw.length - 1].id)) {
                    get = true
                    break
                }
            }
            if (get) {
                this.boxSpine.playAnimation("stand_3", true)
            }else{
                this.boxSpine.playAnimation("stand_2", true)
            }
        }else{
            this.boxSpine.playAnimation("stand_1", true)
        }
        this.pro_score.value = this.playBase.elityMonsterDrawCardRewardCount
        this.pro_score.max = 200

        //周卡
        let canUniteTakeData = LyPayUniteWeekCard.unitxWeekTakeData(2)
        this.group_left.visible = canUniteTakeData != null
        if (canUniteTakeData != null) {
            let bounitems = UtilsUI.getBonuseItemsByBonusesId(LocaleData.getPayWeekCard(canUniteTakeData.id).bonuses)
            UtilsUI.setUIGroupItem(bounitems[0], this.group_uniteItem, ()=>{
                let xml = LyPayUniteWeekCard.getUniteXml(canUniteTakeData.id)
                if (xml.isFree == "1") {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayUniteWeekCard, 0, {type: 1});
                }else{
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.refreshUI()
                            UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString(args.bonusesArr) });
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } , "takeWeekCard", { id: Number(canUniteTakeData.id)});
                }
            });
        }

        //终身卡
        if (LyPayUniteWeekCard.isViewRedPointLife()) {
            this.group_right.visible = true
            let rewardXml = LocaleData.getPayRoot()._compositeLifeCard[0]._item[0]
            let bounitems = UtilsUI.getBonuseItemsByBonusesId(rewardXml.bonuses)
            UtilsUI.setUIGroupItem(bounitems[0], this.group_zsItem, ()=>{
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        this.refreshUI()
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString( [args.bonusesResult]) });
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "takeEliteMonsterCardCard", null);
            });
        }else{
            this.group_right.visible = false
        }
    }

    public onViewDestroy(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyEliteMonster, 0, null)
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyEliteDisperse, 0, null)
    }


    public onViewShowFront(): void {
        this.refreshUI();
        this.tryShowLyPayGiftGroup();
    }
    private giftId:number;
    public onViewUpdate(params: any): void {
        if (params && params.giftId) { // 如果是神通，延迟限时礼包弹出功能。
            this.giftId = params.giftId;
        }
        if (params && params.refreshUI) {
            this.refreshUI();
        }
    }

    private tryShowLyPayGiftGroup(): void {
        if (this.giftId &&!PlatformAPI.isBinaryExamine()) {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayGiftGroup, 0, {giftId:this.giftId});
            this.giftId = 0;
        }
    }
    public getIsViewMask(): boolean {
        return false;
    }


    public static isViewRedPoint(){
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.elite)) {
            return false
        }
        let root = LocaleData.getEliteMonsterRoot() 
        let count = GameServerData.getInstance().getItemCountByProtoId(root.recruit_cost_item)
        if (count >= 5 && LocaleUser.getUser("LyEliteDrawRedPoint") != UtilsTool.TimeToDateStr( GameServerData.getInstance().getServerTime())) {
            return true
        }
    }
}


