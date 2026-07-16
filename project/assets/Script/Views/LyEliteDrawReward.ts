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
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { VarVal } from "../Values/VarVal";
import { LyEliteDraw } from "./LyEliteDraw";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { LyPayGiftGroup } from "./LyPayGiftGroup";
import { FguiGTween } from "../Kernel/FguiGTween";

export class LyEliteDrawReward extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyEliteDrawReward";
    }
    

    public onViewCreate(_params:any): void {
        let animNmae = [
            "lv",
            "lan",
            "zi",
            "cheng",
            "hong"
        ]
        let uiPanel:fgui.GComponent
        uiPanel = this.getUiPanel()
        let debris = _params.debris
        let isAd = _params.ad
        let group_one = uiPanel.getChild("group_one", fgui.GGroup)
        let group_five = uiPanel.getChild("group_five", fgui.GGroup)
        let icon = uiPanel.getChild("icon", fgui.GLoader)
        let label_number = uiPanel.getChild("label_number", fgui.GLabel)
        let list_all = uiPanel.getChild("list_all", fgui.GList)
        let btn_one = uiPanel.getChild("btn_one", fgui.GButton)
        let btn_five = uiPanel.getChild("btn_five", fgui.GButton)
        let btn_back = uiPanel.getChild("btn_back", fgui.GButton)
        let spinePlayer = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation("stand", true);
        }, uiPanel.getChild("loade3d_light", fgui.GLoader3D), "jm_xiuxing_g");
        btn_one.text = StrVal.LYELITEMONSTER.STR50
        btn_five.text = StrVal.LYELITEMONSTER.STR50
        btn_back.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteDrawReward, 0, null)
        });
        let root = LocaleData.getEliteMonsterRoot()
        let costProto = LocaleData.getItemProto(root.recruit_cost_item)
        let itemNumber = GameServerData.getInstance().getItemCountByProtoId(root.recruit_cost_item)
        icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [costProto.icon]);
        
        let spineArr = []
        let animNum = 0

        list_all.itemRenderer = (index: number, child: fgui.GComponent)=>{
            let debri = debris[index]
            let mProto = LocaleData.getEliteMonsterByDebrisid(debri.debrisProtoId)
            let loader3D =  child.getChild("loader_icon", fgui.GComponent).getChild("loader_icon", fgui.GLoader3D)
            child.getChild("loader_qua", fgui.GLoader).url = ""
            let modelShowInfo = LocaleData.getModelShowInfo(mProto.modelId)
            let loader_3deffect = child.getChild("loader_3deffect", fgui.GLoader3D)
            let img_card = child.getChild("n9")
            child.getChild("loader_card", fgui.GLoader3D).freeSpine()
            img_card.visible = true
            loader_3deffect.freeSpine()
            loader3D.freeSpine()

            let spine = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                spp.clearTracks()
            }, loader3D, modelShowInfo.spine);
      
            spineArr.push(spine)
            let targetY = 0
            if (index % 2 == 0) {
                child.y = - 1160
                targetY =  40 
            }else{
                child.y = - 1200
                targetY =  0
            }

            FguiGTween.new(child).delay(0.1 * index).to(0.7, {y: targetY}, {easing: fgui.EaseType.BackInOut}).start().call(()=>{
                if ((animNum == 5 && index == 3) || (animNum == 1 && index == 0)) {
                    for (let index = 0; index < list_all.numChildren; index++) {
                        let child:fgui.GComponent = list_all.getChildAt(index);
                        let debri = debris[index]
                        FguiGTween.new(child).delay(0.25 * index).to(debri.debrisCount > 1? 0.35: 0.25, {scaleX: 0}).start().call(() => {
                            let loader3D =  child.getChild("loader_icon", fgui.GComponent).getChild("loader_icon", fgui.GLoader3D)
                            let debri = debris[index]
                            let mProto = LocaleData.getEliteMonsterByDebrisid(debri.debrisProtoId)
                            let label_count: fgui.GTextField = child.getChild("label_count")
                            label_count.color = UtilsUI.getQualityColor(Number(mProto.quality))
                            label_count.text = debri.debrisCount
                            child.getChild("n9").visible = false
                            child.getChild("loader_qua", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyEliteMonster/frame_get{0}", [mProto.quality])
                            child.getChild("loader_di", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyEliteMonster/frame_getD{0}", [mProto.quality])
                            if (debri.debrisCount > 1) {
                                new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                                    spp.playAnimation(animNmae[ Number(mProto.quality) -2], true);
                                }, child.getChild("loader_3deffect", fgui.GLoader3D), "jm_menke_biankuang_tx");
                                // let spineSke = <sp.Skeleton>loader3D.content;
                                // // 皮肤
                                // spineSke.setAnimation(0, VarVal.SPINE_ANI_NAME.stand, true);
                                spineArr[index].playAnimation(VarVal.SPINE_ANI_NAME.stand, true);

                                new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                                    spp.playAnimation( String(Number(mProto.quality)-1) , false);
                                }, child.getChild("loader_card", fgui.GLoader3D), "jm_menke_fanpai");
                            }
                            
                        }).to(debri.debrisCount > 1 ? 0.4 : 0.15,{scaleX: 1}).call(()=>{
                            animNum = animNum - 1
                            if (animNum == 0) {
                                uiPanel.touchable = true
                            }
                        });
                        // tweens.push(R2)
                    }
                }
            });
            // tweens.push(R)
        };

        let initList = ()=>{
            // for (let index = 0; index < tweens.length; index++) {
            //     tweens[index].kill();
            // }
            spineArr = []
            for (let index = 0; index < list_all.numChildren; index++) {
                let child: fgui.GComponent = list_all.getChildAt(index)
                child.setScale(1,1)
                child.getChild("loader_3deffect", fgui.GLoader3D).freeSpine()
                child.getChild("loader_icon", fgui.GComponent).getChild("loader_icon", fgui.GLoader3D).freeSpine()
                child.getChild("n9").visible = true
            }
        }

        let refrehFun: Function = ()=>{
            uiPanel.touchable = false
            itemNumber = GameServerData.getInstance().getItemCountByProtoId(root.recruit_cost_item)
            animNum = debris.length
            initList()
            list_all.numItems = debris.length
            label_number.text = UtilsTool.stringFormat("{0}/{1}", [itemNumber, debris.length > 1? 5:1])  
        }
        refrehFun()
        
        // if (isAd) {
            // group_one.visible = false
            // group_five.visible = false
        // }else {
            group_one.visible = debris.length == 1
            group_five.visible = debris.length == 5
       
        btn_one.onClick(()=>{
            if (animNum <= 0) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        // bonuseString =  GameServerData.getInstance().bonusesResultsToString([{inserts: args.itemInserts}])
                        // BounseItmes = UtilsUI.getBonuseItemsByString(bonuseString)
                        debris = args.debris
                        refrehFun()
                    } else {
                        if (itemNumber < 1) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, root.recruit_cost_item, "1"), buyCall:() => {
                                refrehFun()
                            }});
                        }
                        this.tryShowLyPayGiftGroup()
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } , "recruitsingleelitemonster", null)
            }else{
                
                
            }
        });

        btn_five.onClick(()=>{
            // if (itemNumber >= 5) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        // bonuseString =  GameServerData.getInstance().bonusesResultsToString([{inserts: args.itemInserts}]) 
                        // BounseItmes = UtilsUI.getBonuseItemsByString(bonuseString)
                        debris = args.debris
                        refrehFun()
                    } else {
                        if (itemNumber < 5) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, root.recruit_cost_item, "1"), buyCall:() => {
                                refrehFun()
                            }});
                        }
                        this.tryShowLyPayGiftGroup()
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } , "recruitmultipleelitemonsters", null)
            // }else{
                
                
            // }
        });
    }

    public onViewDestroy(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyEliteDraw, 0, null)
    }

    private giftId:number;
    public onViewUpdate(params: any): void {
        if (params && params.giftId) { // 如果是神通，延迟限时礼包弹出功能。
            this.giftId = params.giftId;
        } 
    }

    private tryShowLyPayGiftGroup(): void {
        if (this.giftId &&!PlatformAPI.isBinaryExamine()) {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayGiftGroup, 0, {giftId:this.giftId});
            this.giftId = 0;
        }
    }
}


