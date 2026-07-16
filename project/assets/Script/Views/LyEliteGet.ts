//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { GComponent } from "fairygui-cc/GComponent";
import { LocaleData } from "../Kernel/LocaleData";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { LyEliteMonster } from "./LyEliteMonster";
import { GameServerData } from "../Kernel/GameServerData";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { Primitive, Vec2, math, sp } from "cc";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { VarVal } from "../Values/VarVal";
import { SpinePlayer } from "../Kernel/SpinePlayer";


export class LyEliteGet extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyEliteGet";
    }

    public onViewCreate(_params:any): void {
        let nextLevel = _params.nextLevel
        let moseterInfo = _params.inst
        let desArr = []
        if (_params.desArr) {
            desArr = _params.desArr
        }
        let uiPanel:fgui.GComponent = this.getUiPanel()
        uiPanel.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteGet, 0, null)
        });
        let loader_spine: fgui.GLoader3D = uiPanel.getChild("loader_spine")
        uiPanel.getChild("label_str42", fgui.GLabel).text = StrVal.LYELITEMONSTER.STR52
        
        let c1: fgui.Controller = uiPanel.getController("c1")
        let skill_label: fgui.GLabel = uiPanel.getChild("label_sideAttr")
        let label_mainDec: fgui.GLabel = uiPanel.getChild("label_mainDec")
        let label_mainAttr: fgui.GLabel = uiPanel.getChild("label_mainAttr")
        let label_nowLaevel: fgui.GLabel = uiPanel.getChild("label_nowLaevel")
        let label_nextevel: fgui.GLabel = uiPanel.getChild("label_nextevel")
        let img_quality: fgui.GLoader = uiPanel.getChild("img_quality")
        let label_name: fgui.GLabel = uiPanel.getChild("label_name")

        let mosterLevelData = LocaleData.getEliteMonsterLevel(moseterInfo.proto.id, moseterInfo.own.level)
        let skillData = LocaleData.getSkillProto(mosterLevelData.skill_id)
        if (desArr.length > 0) {
            //合成
            c1.selectedIndex = 0
            label_mainDec.text = desArr[0]
            label_mainAttr.text = desArr[1]
        }else{
            //升级
            c1.selectedIndex = 1
            label_nextevel.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR37, [moseterInfo.own.level]) 
            label_nowLaevel.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR37, [moseterInfo.own.level - 1])
        }
        skill_label.text = skillData.desc2
        img_quality.url = UtilsTool.stringFormat("ui://LyPet/frame_quality{0}",[moseterInfo.proto.quality - 1])
        label_name.text = moseterInfo.proto.name
        new SpinePlayer().loadSpineByModelId(null, loader_spine, moseterInfo.proto.modelId);
    }
   
    public getIsViewMask(): boolean {
        return false;
    }
}


