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
import { LyTheurgyReward } from "./LyTheurgyReward";
import { LyTheurgyInfo } from "./LyTheurgyInfo";
import { FguiGTween } from "../Kernel/FguiGTween";
import { LyGuideGetItem } from "./LyGuideGetItem";

export class LyTheurgyTuPo extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyTheurgy";
        this.viewResI.pkgName = "LyTheurgy";
        this.viewResI.comName = "LyTheurgyTuPo";
    }

   
    public onViewCreate(_params:any):void {
        this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgyTuPo, 0, null)
        });
        let uiPanel: fgui.GComponent = this.getUiPanel().getChild("main");
        UtilsUI.playCommonGroupAni(uiPanel, null);
        uiPanel.getChild("btn_close",fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgyTuPo, 0, null)
        });

      
        uiPanel.getChild("n42",fgui.GLabel).text = StrVal.LYTHEURGY.STR37;
        uiPanel.getChild("n43",fgui.GLabel).text = StrVal.LYTHEURGY.STR38;

        

        let theurgyInst = _params
        let theProto = LocaleData.getTheurgyById(theurgyInst.cfgId);
        let phase1: any
        let phase2: any
        let refresh: Function =() =>{
            let group_item1:fgui.GComponent = uiPanel.getChild("group_item1");
            let group_item2:fgui.GComponent = uiPanel.getChild("group_item2");
            phase1 = LocaleData.getTheurgPhase(theurgyInst.phase);
            phase2 = LocaleData.getTheurgPhase(theurgyInst.phase + 1);
            (group_item1.getChild("loader_dikuang") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_name{0}", [theProto.quality]);
            (group_item1.getChild("loader_qua") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_kuang{0}", [theProto.quality]);
            (group_item1.getChild("loader_grade") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_dj{0}", [theProto.quality]);
            (group_item1.getChild("loader_icon") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/f_{0}", [theProto.icon]);
            (group_item1.getChild("label_name") as fgui.GLabel).text = theProto.name;
            (group_item1.getChild("label_grade") as fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR46, [theurgyInst.phase]);

            (group_item2.getChild("loader_dikuang") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_name{0}", [theProto.quality]);
            (group_item2.getChild("loader_qua") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_kuang{0}", [theProto.quality]);
            (group_item2.getChild("loader_grade") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_dj{0}", [theProto.quality]);
            (group_item2.getChild("loader_icon") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/f_{0}", [theProto.icon]);
            (group_item2.getChild("label_name") as fgui.GLabel).text = theProto.name;
            (group_item2.getChild("label_grade") as fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR46, [phase2.phase]);

            let phaseSkill = theProto.phaseSkillId.split(",")[Number(phase2.phase) - 1]
            uiPanel.getChild("label_maxLevel", fgui.GLabel).text = phase1.levelCap;
            uiPanel.getChild("label_nextMaxLevel", fgui.GLabel).text = phase2.levelCap;
            uiPanel.getChild("label_maxSkill", fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR28, [phase1.phase]);
            uiPanel.getChild("label_nextMaxSkill", fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR28, [phase2.phase]);
            uiPanel.getChild("label_skillDes", fgui.GComponent).getChild("label_skillDes", fgui.GLabel).text = LocaleData.getSkillProto(phaseSkill).desc2; 
            
            let group_needThe: fgui.GComponent = uiPanel.getChild("group_needThe")
            UtilsUI.setNeedItemGroup(group_needThe, UtilsTool.stringFormat("ui://CCommon/suipian_{0}",[theProto.icon]), this.getTheurgyFragNumber(theProto.id), phase1.fragAmount)
        }
        
        let btn_tupo: fgui.GButton = uiPanel.getChild("btn_tupo");
        btn_tupo.text = StrVal.LYTHEURGY.STR12
        btn_tupo.onClick(()=>{
            if (Number(this.getTheurgyFragNumber(theProto.id)) < Number(phase1.fragAmount)) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, theurgyInst.cfgId, "1"), buyCall:() => {
                    // this.loadInfoData()
                    // this.refreshNeedItemCount()
                }});
            }else{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        theurgyInst = args.theurgy
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyTheurgyInfo, 0, {theurgyInst: args.theurgy, isTuPo: true })
                        let mGCom :fgui.GComponent = fgui.UIPackage.createObject("LyTheurgy", "word_level_up2")as fgui.GComponent;
                        this.getUiPanel().addChild(mGCom)
                        mGCom.setPosition(fgui.GRoot.inst.width / 2 - mGCom.width / 2 , fgui.GRoot.inst.height / 2 - mGCom.height / 2 + 100)
                        FguiGTween.new(mGCom).to(0.5, { y: fgui.GRoot.inst.height / 2 - mGCom.height / 2 - 100 }).call(() => {
                            this.setTimeout(() => {
                                mGCom.dispose()
                            }, 500);
                        }).start();
                        refresh()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } , "theurgyBreakthrough", { theurgyId: theurgyInst.cfgId })
            }
        });
        refresh()
    }

    private getTheurgyFragNumber(protoId){
        let allFrag = GameServerData.getInstance().getPlayerFullInfo().theurgyInfo.theurgyFrag
        for (let index = 0; index < allFrag.length; index++) {
            const element = allFrag[index];
            if (element.protoId == protoId) {
                return element.count
            }
        }
        return 0
    }

    public getIsViewMask(): boolean {
        return false;
    };
}


