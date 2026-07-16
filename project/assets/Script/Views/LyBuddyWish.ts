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
import { Color, color, math } from "cc";
import { GameServer } from "../Kernel/GameServer";
import { GuideManager } from "../Kernel/GuideManager";
import { LocaleUser } from "../Kernel/LocaleUser";

export class LyBuddyWish extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyBuddyWish";
    }
    
    public onViewCreate(params:any): void {
        let dynamicParam = params.dynamicParam
        let buffState = params.buffState
        this.getUiPanel().getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBuddyWish, 0, null);
        });
        let uiPanel = this.getUiPanel().getChild("main", fgui.GComponent);
        UtilsUI.playCommonGroupAni(uiPanel, null);
       
        // uiPanel.getChild("btn_close", fgui.GButton).onClick(()=>{
        //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBuddyWish, 0, null);
        // });
       let buffXml = null
       for (let index = 0; index < dynamicParam.data.blessingBuffs.length; index++) {
            let element = dynamicParam.data.blessingBuffs[index];
            if (buffState.id == element.id) {
                buffXml = element
                break
            }
       }
       uiPanel.getChild("label_title", fgui.GLabel).text = buffXml.name;
       uiPanel.getChild("n21", fgui.GLabel).text = buffXml.desc;
       let group_pet: fgui.GComponent = uiPanel.getChild("group_pet")
    }
   
    public getIsViewMask(): boolean {
        return false;
    }
}


