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
import { RESPONSE_TYPE } from "../Kernel/HttpClient";
import { LocaleData } from "../Kernel/LocaleData";
import { VarVal } from "../Values/VarVal";
import { LocaleUser } from "../Kernel/LocaleUser";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { LyTheurgyDraw } from "./LyTheurgyDraw";

export class LyTheurgyRewardTen extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyTheurgy";
        this.viewResI.pkgName = "LyTheurgy";
        this.viewResI.comName = "LyTheurgyRewardTen";
    }
    
    public onViewCreate(_params:any):void {
        this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
            if (drawAnim) {
                refreshPage()
            }else {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgyRewardTen, 0, null)
            }
        })
        let drawAnim =  false
        let args: any = _params.args
        let haveThe: any = _params.have
        let allProto: any = args.deriveTheurgyId
        let uiPanel = this.getUiPanel();
        let group_show: fgui.GGroup = uiPanel.getChild("group_show")
        let group_add: fgui.GComponent = uiPanel.getChild("group_add")
        let loader_need: fgui.GLoader = group_add.getChild("loader_icon")
        let label_number: fgui.GLabel = group_add.getChild("label_number")
        let theurgyRoot = LocaleData.getTheurgyRoot();
        let drawProto = LocaleData.getItemProto(theurgyRoot.deriveItemId)
        loader_need.url = UtilsTool.stringFormat("ui://CCommon/{0}",[drawProto.icon])
        group_add.getChild("btn_add", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, theurgyRoot.deriveItemId, "1"), buyCall:() => {
                refreshPage()
            }});
        })
        let list_item: Array<fgui.GComponent> = []
        for (let index = 0; index < 10; index++) {
            list_item.push(uiPanel.getChild("card"+ index))
        }
        
  
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let btn_draw = uiPanel.getChild("btn_draw",fgui.GButton)
        btn_draw.text = StrVal.LYTHEURGY.STR32
        btn_draw.onClick(()=>{
            if (drawAnim) {
                refreshPage()
            } else {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        allProto = args.deriveTheurgyId
                        args = args
                        refreshPage()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } , "theurgyDerive", { count: 10 })
            }
        });
        let refreshPage: Function = ()=>{
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
            if (allProto.length >= 10) {
                group_show.visible = true
                label_number.text = String(GameServerData.getInstance().getItemCountByProtoId(theurgyRoot.deriveItemId))+ "/200" 
            }else{
                group_show.visible = false
            }
            for (let index = 0; index < 10; index++) {
                let child = list_item[index].getChild("main", fgui.GComponent);
                if (!drawAnim) {
                    child.alpha = 0
                    list_item[index].getTransition("t0").play(()=>{
                        if (index == 9) {
                            drawAnim = false
                        }
                    }, null, index * 0.125)
                }else{
                    list_item[index].getTransition("t0").stop(true)
                    child.alpha = 1
                }
                let theProto = LocaleData.getTheurgyById(allProto[index]);
                (child.getChild("loader_dikuang") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_name{0}", [theProto.quality]);
                (child.getChild("loader_qua") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_draw{0}", [theProto.quality]);
                (child.getChild("loader_icon") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/f_{0}", [theProto.icon]);
                (child.getChild("label_name") as fgui.GLabel).text = theProto.name;
                let label_grade: fgui.GLabel = child.getChild("label_grade");
                let loader_grade: fgui.GImage = child.getChild("n10");
                loader_grade.visible = true
                label_grade.visible = true
                let img_piece: fgui.GImage =  child.getChild("img_piece", fgui.GImage)
                let loader_sort: fgui.GLoader = child.getChild("loader_sort") 
                let img_new: fgui.GImage = child.getChild("img_new")
                img_new.visible = false
                loader_sort.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_sort{0}{1}", [theProto.type, theProto.quality]);
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
                        loader_grade.text = "x 50"
                    }
                }else{
                    img_piece.visible = true    
                    loader_grade.text = "x 50"
                }
                
            }
            drawAnim = !drawAnim
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


