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
import { LyTheurgyDraw } from "./LyTheurgyDraw";
import { SpinePlayer } from "../Kernel/SpinePlayer";

export class LyTheurgyReward extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyItemReward";
        this.viewResI.pkgName = "LyItemReward";
        this.viewResI.comName = "LyTheurgyReward";
    }
    public static type ={
        draw : 0, //秘籍抽卡界面
        goldFinger : 1, //金手指兑换界面
    }
    public onViewCreate(_params:any):void {
        this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgyReward, 0, null)
        })
        let args: any = _params.args
        let showCount = _params.count
        let rewardType = _params.type
        let allProto: any = []
        if (rewardType == 0) {
            allProto = args.deriveTheurgyId
        }else if(rewardType == 1){
            allProto = args.deriveTheurgyId
        }
        let uiPanel = this.getUiPanel().getChild("main", fgui.GComponent);
        let group_show: fgui.GGroup = uiPanel.getChild("group_show")
        let group_add: fgui.GComponent = uiPanel.getChild("group_add")
        let loader_need: fgui.GComponent = group_add.getChild("loader_icon")
        let label_number: fgui.GComponent = group_add.getChild("label_number")

        let label_tips = uiPanel.getChild("label_tips", fgui.GTextField);
        label_tips.text = StrVal.COMMON.STR9;

        UtilsUI.playCommonGroupAni(uiPanel, null)

        // tween动画
        UtilsUI.playCommonResultAni(uiPanel.getChild("back_win"), () => {
            uiPanel.getChild("group_outani").visible = true;
        });
        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation("stand_gxhd", true);
            uiPanel.getChild("title_win").visible = false;
        }, uiPanel.getChild("loader_spine", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_result);
        
        let list_item:fgui.GList = uiPanel.getChild("list_item")
        list_item.itemProvider = ():string =>{
            return "ui://LyTheurgy/group_drawTen"
        }
        let newProto = []
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()

        let isNewThe: Function = (protoId) => {
            protoId = Number(protoId)
            for (let index = 0; index < args.newTheurgies.length; index++) {
                let the = args.newTheurgies[index];
                if (the.cfgId == protoId) {
                    return true
                }
            }
            return false
        }
        let haveProto = []
        let isHave: Function = (protoId): boolean =>  {
            for (let index = 0; index < haveProto.length; index++) {
                let element = haveProto[index];
                if (protoId == element) {
                    return true
                }
            }
            return false
        }

        list_item.itemRenderer = (index:number, child2:fgui.GComponent)=>{
            let theProto = LocaleData.getTheurgyById(allProto[index]);
            let child = child2.getChild("main", fgui.GComponent);
            // list_item[index].getTransition("t0").play(null, null, index*0.125)
            (child.getChild("loader_dikuang") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_name{0}", [theProto.quality]);
            (child.getChild("loader_qua") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_draw{0}", [theProto.quality]);
            (child.getChild("loader_icon") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/f_{0}", [theProto.icon]);
            (child.getChild("label_name") as fgui.GLabel).text = theProto.name;
            let label_grade: fgui.GLabel = child.getChild("label_grade");
            let loader_grade: fgui.GImage = child.getChild("n10");
            let img_piece: fgui.GImage =  child.getChild("img_piece", fgui.GImage)
            let loader_sort: fgui.GLoader = child.getChild("loader_sort") 
            let img_new: fgui.GImage = child.getChild("img_new")
            img_new.visible = false
            loader_sort.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_sort{0}{1}", [theProto.type, theProto.quality]);

            if (rewardType == 0) {
                let havep = isHave(theProto.id)
                let isNew = isNewThe(theProto.id)
                if (!havep) {
                    haveProto.push(theProto.id)
                    if (isNew) {
                        label_grade.visible = false
                        loader_grade.visible = false
                        img_piece.visible = false
                        img_new.visible = true
                    }else{
                        img_piece.visible = true    
                        label_grade.text = "x 50"
                    }
                }else{
                    img_piece.visible = true    
                    label_grade.text = "x 50"
                }
            }else if(rewardType == 1){
                img_piece.visible = true
                label_grade.text = "x " + String(showCount)
            }
           
        }
        uiPanel.getChild("btn_draw",fgui.GButton).onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    allProto = args.deriveTheurgyId
                    refreshPage()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } , "theurgyDerive", { count: 10 })
        });
        let refreshPage: Function = ()=>{
            list_item.numItems = allProto.length;
            if (rewardType == 0) {
                if (allProto.length > 10) {
                    group_show.visible = true
                }else{
                    group_show.visible = false
                }
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyTheurgyDraw, 0, null)
        }
        refreshPage()
    }

    public getIsViewMask(): boolean {
        return false;
    };

    public onViewDestroy(): void {
    }
}


