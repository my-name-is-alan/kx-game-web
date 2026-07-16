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
import { LyTheurgyReward } from "./LyTheurgyReward";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { LyTheurgyRewardTen } from "./LyTheurgyRewardTen";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { Color } from "cc";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { LyPayGiftGroup } from "./LyPayGiftGroup";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { LocaleUser } from "../Kernel/LocaleUser";
import { LyPayExquisite, PayExquisitePage } from "./LyPayExquisite";
import { LyPayUniteWeekCard } from "./LyPayUniteWeekCard";
import { LyTheurgyDrawGift } from "./LyTheurgyDrawGift";

export class LyTheurgyDraw extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyTheurgy";
        this.viewResI.pkgName = "LyTheurgy";
        this.viewResI.comName = "LyTheurgyDraw";
    }

    private theurgyDatas: any
    private theurgyRoot: any
    private list_item: fgui.GList
    private uiPanel:fgui.GComponent
    private label_money1: fgui.GLabel
    private label_money2: fgui.GLabel
    private label_baodi: fgui.GLabel
    private label_one: fgui.GTextField
    // private btn_ten: fgui.GButton
    private label_ten: fgui.GTextField
    private btn_adRefresh: fgui.GButton
    private group_itemleft: fgui.GComponent
    private group_itemUnite: fgui.GComponent
    private bx_spine: SpinePlayer
    private label_hxDesc: fgui.GTextField
    public onViewCreate(_params:any):void {
        this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
            PointRedData.getInstance().updatePointChild(PointRedType.LyTheurgy)
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgyDraw, 0, null)
        })
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        let loader3d_draw:fgui.GLoader3D = this.uiPanel.getChild("lorderd_effect")
        this.list_item = this.uiPanel.getChild("list_item")
        let btn_close = this.uiPanel.getChild("btn_close")
        let label_title = this.uiPanel.getChild("label_title")
        label_title.text = StrVal.LYTHEURGY.STR33
        let btn_one: fgui.GButton = this.uiPanel.getChild("btn_one")
        this.label_baodi = this.uiPanel.getChild("label_baodi")
        let btn_ten = this.uiPanel.getChild("btn_ten", fgui.GButton);
        this.theurgyRoot = LocaleData.getTheurgyRoot();
        let drawProto = LocaleData.getItemProto(this.theurgyRoot.deriveItemId)
        let btn_add1: fgui.GComponent = this.uiPanel.getChild("btn_add1");
        btn_add1.getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}",[ drawProto.icon ])
        btn_add1.getChild("btn_add", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.theurgyRoot.deriveItemId, "1"), buyCall:() => {
                this.refreshPage()
            }});
        })
        this.label_money1 = btn_add1.getChild("label_number")
        let btn_add2: fgui.GComponent = this.uiPanel.getChild("btn_add2");
        if (PlatformAPI.isBinaryExamine() && PlatformAPI.isMiniGameOniOS()) {
            btn_add2.visible = false;
        }
        btn_add2.getChild("loader_icon", fgui.GLoader).url = UtilsUI.getItemIconUrl(VarVal.bonusType.stone);
        btn_add2.getChild("btn_add", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, {page:PayExquisitePage.RECHARGE, type:VarVal.bonusType.stone});
        })
        this.label_money2 = btn_add2.getChild("label_number")
        let btn_addone = this.uiPanel.getChild("btn_addone", fgui.GComponent)
        this.label_one = btn_addone.getChild("label_number")
        btn_addone.getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}",[ drawProto.icon ])
        btn_addone.getChild("btn_add", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.theurgyRoot.deriveItemId, "1"), buyCall:() => {
                this.refreshPage()
            }});
        })
        let btn_addten = this.uiPanel.getChild("btn_addten", fgui.GComponent)
        btn_addten.getChild("btn_add", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.theurgyRoot.deriveItemId, "1"), buyCall:() => {
                this.refreshPage()
            }});
        })
        this.label_ten = btn_addten.getChild("label_number")
        btn_addten.getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}",[ drawProto.icon])
        btn_close.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgyDraw, 0, null)
        })
        this.btn_adRefresh = this.uiPanel.getChild("btn_adRefresh")
        PointRedData.getInstance().registerPoint(this.btn_adRefresh, PointRedType.LyTheurgyDrawADbtn)
        loader3d_draw.visible = false
        

        this.uiPanel.getChild("btn_gl", fgui.GButton).onClick(()=>{
            let mGCom :fgui.GComponent = fgui.UIPackage.createObject("LyTheurgy", "group_mainGL").asCom;
            (<fgui.GButton>mGCom.getChild("btn_back")).onClick(()=>{
                mGCom.dispose()
            })
            mGCom.getChild("label_title", fgui.GLabel).text = StrVal.LYTHEURGY.STR36
            let list_gl: fgui.GList = mGCom.getChild("list_gl")
            let items: Array<any> = LocaleData.getTheurgyRoot()._quality[0]._item;
            let all = 0
            for (let index = 0; index < items.length; index++) {
                let element = items[index];
                all = all + Number(element.weight) 
            }
            list_gl.itemRenderer = (index: number, child:fgui.GComponent)=>{
                let item = items[index]
                child.getChild("label_gv", fgui.GLabel).text = (Number(item.weight) / all * 100).toFixed(2)  + "%";
                child.getChild("loader_bg", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/frame_gailvdi{0}",[ index + 1  + 1])
                child.getChild("label_tage", fgui.GLabel).text = item.quality
            };
            list_gl.numItems = items.length
            this.getUiPanel().addChild(mGCom)
            mGCom.setPosition(mGCom.x, mGCom.y + (fgui.GRoot.inst.height - 1334)/2)
        });
        btn_one.text = StrVal.LYTHEURGY.STR31


        this.btn_adRefresh.onClick(()=>{
            PlatformAPI.doSdkRewardVideoAD((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                } else {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
                            let theurgies = fullInfo.theurgyInfo.theurgies
                            let haveTheId = []
                            for (let index = 0; index < theurgies.length; index++) {
                                haveTheId.push(theurgies[index].cfgId)
                            }
                            this.uiPanel.getChild("btn_back").visible = true
                            loader3d_draw.visible = true
                            new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                                spp.playAnimation("animation", false, 0, null, ()=>{
                                    this.uiPanel.getChild("btn_back").visible = false
                                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyReward, 0, {type: LyTheurgyReward.type.draw, args: args})
                                });
                            }, loader3d_draw, "jm_fanshu");
                            this.refreshPage()
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                } , "theurgyDeriveForAd", null)
                }
            }, UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.skip_ad))
        })

        btn_one.onClick(()=>{
                let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
                let theurgies = fullInfo.theurgyInfo.theurgies
                let haveTheId = []
                for (let index = 0; index < theurgies.length; index++) {
                    haveTheId.push(theurgies[index].cfgId)
                }
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.uiPanel.getChild("btn_back").visible = true
                        loader3d_draw.visible = true
                        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                            spp.playAnimation("animation", false, 0, null, ()=>{
                                this.uiPanel.getChild("btn_back").visible = false
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyReward, 0, {type: LyTheurgyReward.type.draw, args: args})

                            });
                        }, loader3d_draw, "jm_fanshu");
                        
                        this.refreshPage()
                    } else {
                        // 要经过协议（协议可能触发限时礼包）
                        if (GameServerData.getInstance().getItemCountByProtoId(this.theurgyRoot.deriveItemId) < 1 * Number(this.theurgyRoot.deriveItemUseAmount)) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.theurgyRoot.deriveItemId, "1"), buyCall:() => {
                                this.refreshPage()
                            }});
                        }
                        this.tryShowLyPayGiftGroup();
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } , "theurgyDerive", { count: 1 })
        })

        
        btn_ten.text = StrVal.LYTHEURGY.STR32

        PointRedData.getInstance().registerPoint(btn_ten, PointRedType.LyTheurgyDrawTenbtn)
        if (GameServerData.getInstance().getItemCountByProtoId(this.theurgyRoot.deriveItemId) >= 10 * Number(this.theurgyRoot.deriveItemUseAmount)) {
            LocaleUser.setUser("LyTheurgyDrawTenRedPoint", UtilsTool.TimeToDateStr(GameServerData.getInstance().getServerTime()))
            LocaleUser.flush()
        }

        btn_ten.onClick(() => {
                let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
                let theurgies = fullInfo.theurgyInfo.theurgies
                let haveTheId = []
                for (let index = 0; index < theurgies.length; index++) {
                    haveTheId.push(theurgies[index].cfgId)
                }
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        loader3d_draw.visible = true
                        this.uiPanel.getChild("btn_back").visible = true
                        // PlatformAPI.loadSpine((asset:any)=> {
                        //     if (loader3d_draw && !loader3d_draw.isDisposed) {
                        //         loader3d_draw.setScale(1, 1);
                        //         // 底居中
                        //         loader3d_draw.setSpine(asset, new Vec2(0.5, 1));
                        //         let spineSke = <sp.Skeleton>loader3d_draw.content;
                        //         // 皮肤
                        //         spineSke.setAnimation(0, "animation", true);
                        //         spineSke.setCompleteListener((trackEntry:sp.spine.TrackEntry) => {
                        //             // this.initParams.battleView.delSkillSpine(ske);
                        //             // loader3d_draw.removeFromParent();
                        //             // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyReward, 0, {have: haveTheId, args: args})
                        //             this.uiPanel.getChild("btn_back").visible = false

                        //             loader3d_draw.freeSpine()
                        //             ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyRewardTen, 0, {have: haveTheId, args: args})
                        //         })
                        //     }
                        // },"jm_fanshu")
                       
                        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                            spp.playAnimation("animation", false, 0, null, ()=>{
                                this.uiPanel.getChild("btn_back").visible = false
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyRewardTen, 0, {have: haveTheId, args: args})
                            });
                        }, loader3d_draw, "jm_fanshu");

                        this.refreshPage()
                    } else {
                         // 要经过协议（协议可能触发限时礼包）
                        if (GameServerData.getInstance().getItemCountByProtoId(this.theurgyRoot.deriveItemId) < 10 * Number(this.theurgyRoot.deriveItemUseAmount)) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.theurgyRoot.deriveItemId, "1"), buyCall:() => {
                                this.refreshPage();
                            }});
                        }
                        this.tryShowLyPayGiftGroup();
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } , "theurgyDerive", { count: 10 })
        })

        let spinePlayer2 = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation("start", false, null, null, ()=>{
                spp.playAnimation("stand", true) 
            });
        }, this.uiPanel.getChild("lorderd_effectJon", fgui.GLoader3D), "jm_chouka");


        //2.0
        this.bx_spine = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation("stand_on", false);
        }, this.uiPanel.getChild("loader_bx", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_jiuchong_baoxiang);

        let btn_unite = this.uiPanel.getChild("btn_unite")
        btn_unite.visible = !PlatformAPI.isBinaryExamine()
        btn_unite.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayUniteWeekCard, 0, {type:1});
        });

        let btn_zs = this.uiPanel.getChild("btn_zs")
        btn_zs.visible = !PlatformAPI.isBinaryExamine()
        btn_zs.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayUniteWeekCard, 0, {type:2});
        });

        this.uiPanel.getChild("loader_bx3", fgui.GLoader).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyDrawGift, 0, null);
        });

        this.group_itemUnite = this.uiPanel.getChild("group_itemUnite")
        this.group_itemleft = this.uiPanel.getChild("group_itemleft")
        this.label_hxDesc = this.uiPanel.getChild("label_hxDesc")
        this.refreshPage()
    }
   

    private refreshPage(){
        let playBase =  GameServerData.getInstance().getPlayerFullInfo().base
        let baodi =  GameServerData.getInstance().getPlayerFullInfo().theurgyInfo.guaranteedCount
        let number = GameServerData.getInstance().getItemCountByProtoId(this.theurgyRoot.deriveItemId)
        this.label_money1.text = String(number) 
        this.label_money2.text = String(GameServerData.getInstance().getPlayerFullInfo().base.stone) 
        this.label_one.text = UtilsTool.stringFormat("{0}/{1}",[number, Number(this.theurgyRoot.deriveItemUseAmount) * (1) ])
        this.label_one.color = number >= Number(this.theurgyRoot.deriveItemUseAmount) * (1)? new Color(246, 222, 156) : new Color(245, 112,114)
        this.label_ten.text = UtilsTool.stringFormat("{0}/{1}",[number, Number(this.theurgyRoot.deriveItemUseAmount) * (10) ])
        this.label_ten.color = number >= Number(this.theurgyRoot.deriveItemUseAmount) * (10)? new Color(246, 222, 156) : new Color(245, 112,114)
        this.label_baodi.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR27, [ 200 - baodi ])

        let nowAdCount = GameServerData.getInstance().getAdData(VarVal.adTimesType.theurgyDarw).count
        let allAdCount = LocaleData.getAdXml(VarVal.adTimesType.theurgyDarw).count
        if (nowAdCount >= allAdCount) {
            this.btn_adRefresh.visible = false
        }else{
            this.btn_adRefresh.visible = true
            this.btn_adRefresh.text =  UtilsTool.stringFormat(StrVal.LYTHEURGY.STR53, [allAdCount - nowAdCount, allAdCount]) 
        }


        //周卡
        let canUniteTakeData = LyPayUniteWeekCard.unitxWeekTakeData(4)
        this.group_itemUnite.visible = canUniteTakeData != null
        if (canUniteTakeData != null) {
            let bounitems = UtilsUI.getBonuseItemsByBonusesId(LocaleData.getPayWeekCard(canUniteTakeData.id).bonuses)
            UtilsUI.setUIGroupItem(bounitems[0], this.group_itemUnite.getChild("GroupItem"), ()=>{
                let xml = LyPayUniteWeekCard.getUniteXml(canUniteTakeData.id)
                if (xml.isFree == "1") {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayUniteWeekCard, 0, {type:1});
                }else{
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.refreshPage()
                            UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString(args.bonusesArr) });
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } , "takeWeekCard", { id: Number(canUniteTakeData.id)});
                }
            });
        }
        let data = LocaleData.getTheurgNextGuarantees(playBase.theurgyDeriveSpecialCount)
        this.label_hxDesc.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR55, [Number(data.time) - playBase.theurgyDeriveSpecialCount])
        if (playBase.theurgyDeriveSpecialBonusesList && playBase.theurgyDeriveSpecialBonusesList.length > 0) {
            this.bx_spine.playAnimation("stand_on3", true)
        }else{
            this.bx_spine.playAnimation("stand_on", true)
        }


        //终身卡
        if (LyPayUniteWeekCard.isViewRedPointTheLife()) {
            this.group_itemleft.visible = true
            let rewardXml = LocaleData.getPayRoot()._compositeLifeCard[0]._item[0]
            let bounitems = UtilsUI.getBonuseItemsByBonusesId(rewardXml.bonuses)
            UtilsUI.setUIGroupItem(bounitems[0], this.group_itemleft.getChild("GroupItem"), ()=>{
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        this.refreshPage()
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString( [args.bonusesResult]) });
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "takeTheurgyCard", null);
            });
        }else{
            this.group_itemleft.visible= false
        }
    }

    public getIsViewMask(): boolean {
        return false;
    };

    public onViewShowFront(): void {
        this.refreshPage()
        this.tryShowLyPayGiftGroup();
    }

    private giftId:number;
    public onViewUpdate(params: any): void {
        if (params && params.giftId) { // 如果是神通，延迟限时礼包弹出功能。
            this.giftId = params.giftId;
        } else {
            this.refreshPage();
        }
    }

    private tryShowLyPayGiftGroup(): void {
        if (this.giftId&&!PlatformAPI.isBinaryExamine()) {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayGiftGroup, 0, {giftId:this.giftId});
            this.giftId = 0;
        }
    }

    public static freeADBtn(): boolean{
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.theurgy)) {
            return false
        }
        let nowAdCount = GameServerData.getInstance().getAdData(VarVal.adTimesType.theurgyDarw).count
        let allAdCount = LocaleData.getAdXml(VarVal.adTimesType.theurgyDarw).count
        if (nowAdCount < Number(allAdCount)) {
            return true
        }
        return false
    }

    public static tenDrawBtn(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.theurgy)) {
            return false
        }
        let theurgyRoot = LocaleData.getTheurgyRoot();
        let data = LocaleUser.getUser("LyTheurgyDrawTenRedPoint")
        
        if (GameServerData.getInstance().getItemCountByProtoId(theurgyRoot.deriveItemId) >= 10 * Number(theurgyRoot.deriveItemUseAmount)) {
            if (data != UtilsTool.TimeToDateStr(GameServerData.getInstance().getServerTime())) {
                return true
            }
        }
       return false 
    }
}


