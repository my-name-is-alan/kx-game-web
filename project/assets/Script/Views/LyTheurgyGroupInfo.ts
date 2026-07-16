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
import { Color } from "cc";
import { LyTheurgyInfo } from "./LyTheurgyInfo";

export class LyTheurgyGroupInfo  extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyTheurgy";
        this.viewResI.pkgName = "LyTheurgy";
        this.viewResI.comName = "LyTheurgyGroupInfo";
    }

    private textColor1 = [ new Color(156,221,123),new Color(137,207,249),new Color(205,180,255), new Color(255,194,82),]
    private textColor2 = [ new Color(89,139,39),new Color(47,120,159),new Color(106,56,138), new Color(140,68,29),]
    private theurgyInst: any
    private uiPanel:fgui.GComponent
    private group_item: fgui.GComponent
    private label_name: fgui.GTextField
    private label_skillDes: fgui.GLabel
    private label_skillDes2: fgui.GLabel
   
    private label_gj: fgui.GLabel
    private label_sm: fgui.GLabel
    private label_fy: fgui.GLabel
    private label_gj2: fgui.GLabel
    private label_sm2: fgui.GLabel
    private label_fy2: fgui.GLabel
  
    public onViewCreate(_params:any):void {
        this.getUiPanel().getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgyGroupInfo, 0, null)
        })
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null);
        let btn_close = this.uiPanel.getChild("btn_close")
        // let label_title = this.uiPanel.getChild("label_title")
        // label_title.text = StrVal.LYBACKPACK.STR1
        btn_close.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgyGroupInfo, 0, null)
        });
        (<fgui.GLabel>this.uiPanel.getChild("n69")).text = StrVal.LYTHEURGY.STR44;
        (<fgui.GLabel>this.uiPanel.getChild("n79")).text = StrVal.LYTHEURGY.STR45;
        (<fgui.GLabel>this.uiPanel.getChild("n81")).text = StrVal.LYTHEURGY.STR26;
        (<fgui.GLabel>this.uiPanel.getChild("label_title")).text = StrVal.LYTHEURGY.STR29;
        this.group_item = this.uiPanel.getChild("group_item");
        this.label_name = this.uiPanel.getChild("label_name");
        this.label_gj = this.uiPanel.getChild("label_gj");
        this.label_sm = this.uiPanel.getChild("label_sm");
        this.label_fy = this.uiPanel.getChild("label_fy");
        this.label_gj2 = this.uiPanel.getChild("label_gj2");
        this.label_sm2 = this.uiPanel.getChild("label_sm2");
        this.label_fy2 = this.uiPanel.getChild("label_fy2");
       
        this.label_skillDes = this.uiPanel.getChild("label_skillDes", fgui.GComponent).getChild("label_skillDes");
        this.label_skillDes2 = this.uiPanel.getChild("label_skillDes2");
        let btn_up: fgui.GButton = this.uiPanel.getChild("btn_up");
        this.theurgyInst = _params.theurgyInst
        if (!this.theurgyInst) {
            this.theurgyInst = { phase:1, level: 1, proto: _params.protoId }
            btn_up.visible = false
        }else{
            this.theurgyInst["proto"] =  LocaleData.getTheurgyById(this.theurgyInst.cfgId);
        }
        btn_up.text = StrVal.LYTHEURGY.STR14
        btn_up.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyInfo, 0, {theurgyInst: _params.theurgyInst })
        });
        (this.uiPanel.getChild("loader_bg") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_infoBg{0}", [this.theurgyInst.proto.quality]);
        this.refreshPage()
    }
    private refreshPage() {
        let theProto = this.theurgyInst.proto;
        (this.group_item.getChild("loader_dikuang") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_name{0}", [theProto.quality]);
        (this.group_item.getChild("loader_qua") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_kuang{0}", [theProto.quality]);
        (this.group_item.getChild("loader_grade") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_dj{0}", [theProto.quality]);
        (this.group_item.getChild("loader_icon") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/f_{0}", [theProto.icon]);
        (this.group_item.getChild("label_name") as fgui.GLabel).text = theProto.name;
        (this.group_item.getChild("label_grade") as fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR28, [this.theurgyInst.level]) ;
        
        this.uiPanel.getChild("label_stage", fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR28, [this.theurgyInst.level]);
        this.label_name.text = theProto.name;
        this.label_name.color = this.textColor1[Number(theProto.quality) - 1] 
        this.label_name.strokeColor = this.textColor2[Number(theProto.quality) - 1] 
        let label_des1: fgui.GLabel = this.uiPanel.getChild("label_des1");
         
        let lastpahasePorto = LocaleData.getTheurgPhase(10000)
        let label_des2: fgui.GLabel = this.uiPanel.getChild("label_des2");

        if (theProto.type == 1) {
            label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR7, [this.theurgyInst.phase]);
            label_des2.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR7, [lastpahasePorto.phase]);
        }else if(theProto.type == 2){
            label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR8, [this.theurgyInst.phase]);
            label_des2.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR8, [lastpahasePorto.phase]);

        }else if(theProto.type == 3){
            label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR9, [this.theurgyInst.phase]);
            label_des2.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR9, [lastpahasePorto.phase]);

        }else if(theProto.type == 4){
            label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR10, [this.theurgyInst.phase]);
            label_des2.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR10, [lastpahasePorto.phase]);
        }
        let skillId = theProto.phaseSkillId.split(",")[this.theurgyInst.phase - 1];
     
        this.label_skillDes.text = LocaleData.getSkillProto(skillId).desc;
        let skillId2 = theProto.phaseSkillId.split(",")[lastpahasePorto.phase - 1];
        this.label_skillDes2.text = LocaleData.getSkillProto(skillId2).desc;

        let theLevelProto = LocaleData.getTheurgLevelByLevel(this.theurgyInst.level);
        this.label_gj.text = UtilsTool.stringFormat("{0}:{1}",[StrVal.ELITEATTR_NAME.attack, theLevelProto.strength]);
        this.label_sm.text = UtilsTool.stringFormat("{0}:{1}",[StrVal.ELITEATTR_NAME.hp, theLevelProto.health])
        this.label_fy.text = UtilsTool.stringFormat("{0}:{1}",[StrVal.ELITEATTR_NAME.defense, theLevelProto.defense]);
       

        let theLastProto = LocaleData.getTheurgLevelByLevel(10000);
        this.label_gj2.text = UtilsTool.stringFormat("{0}:{1}",[StrVal.ELITEATTR_NAME.attack, theLastProto.strength]);
        this.label_sm2.text = UtilsTool.stringFormat("{0}:{1}",[StrVal.ELITEATTR_NAME.hp, theLastProto.health])
        this.label_fy2.text = UtilsTool.stringFormat("{0}:{1}",[StrVal.ELITEATTR_NAME.defense, theLastProto.defense])
    }

    public getIsViewMask(): boolean {
        return false;
    };
    
    public onViewUpdate(params: any): void {
        this.theurgyInst = params.theurgyInst
        this.theurgyInst["proto"] = params.protoId
        this.refreshPage()
    }
}


