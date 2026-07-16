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
import { LocaleUser } from "../Kernel/LocaleUser";
import { LyTheurgy } from "./LyTheurgy";
import { LyTheurgySeal } from "./LyTheurgySeal";
import { Color } from "cc";
import { LyTheurgyTuPo } from "./LyTheurgyTuPo";
import { LyTheurgyGroupInfo } from "./LyTheurgyGroupInfo";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { PointRedData } from "../Kernel/PointRedData";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { LyPayExquisite, PayExquisitePage } from "./LyPayExquisite";

export class LyTheurgyInfo extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyTheurgy";
        this.viewResI.pkgName = "LyTheurgy";
        this.viewResI.comName = "LyTheurgyInfo";
    }

    private textColor1 = [ new Color(156,221,123),new Color(137,207,249),new Color(205,180,255), new Color(255,194,82),]
    private textColor2 = [ new Color(89,139,39),new Color(47,120,159),new Color(106,56,138), new Color(140,68,29),]
    private textColor3 = [ new Color(89,139,39),new Color(47,120,159),new Color(106,56,138), new Color(178,87,47),]
    
    private theurgyInst: any
    private playerBase: any
    private needUpItemProto: any
    private theRoot: any
    private upLevelNumber: number

    private uiPanel:fgui.GComponent
    private group_item: fgui.GComponent
    private label_name: fgui.GTextField
    // private label_des1: fgui.GLabel
    private btn_chuzhan: fgui.GLabel
    private btn_chongzhi: fgui.GButton
    private label_skillDes: fgui.GLabel
    private group_tupo: fgui.GComponent
    private btn_tupo: fgui.GButton
    private label_yj1: fgui.GLabel
    private loader_yj1: fgui.GComponent
    private label_yj2: fgui.GLabel
    private loader_yj2: fgui.GComponent
    private label_gj: fgui.GLabel
    private label_sm: fgui.GLabel
    private label_fy: fgui.GLabel
    private needItem1: fgui.GComponent
    private needItem2: fgui.GComponent
    private btn_sj: fgui.GButton
    private btn_isTen: fgui.GButton
    private group_needThe: fgui.GComponent
    private label_stage: fgui.GLabel
    private loader_suip: fgui.GLoader
    private label_money1: fgui.GLabel
    private label_money2: fgui.GLabel
    public onViewCreate(_params:any):void {
        this.getUiPanel().getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgyInfo, 0, null)
        });
        this.uiPanel = this.getUiPanel().getChild("main")
        this.theRoot = LocaleData.getTheurgyRoot();
        let btn_close = this.uiPanel.getChild("btn_close")
        btn_close.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgyInfo, 0, null)
        });
        UtilsUI.playCommonGroupAni(this.uiPanel, null);
        (<fgui.GLabel>this.uiPanel.getChild("label_upDes")).text = StrVal.LYTHEURGY.STR4;
        (<fgui.GLabel>this.uiPanel.getChild("n66")).text = StrVal.LYTHEURGY.STR19;
        (<fgui.GLabel>this.uiPanel.getChild("label_title")).text = StrVal.LYTHEURGY.STR29;
        (<fgui.GLabel>this.uiPanel.getChild("n69")).text = StrVal.LYTHEURGY.STR5;
        this.group_item = this.uiPanel.getChild("group_item");
        this.label_name = this.uiPanel.getChild("label_name");
        // this.label_des1 = this.uiPanel.getChild("label_des1");
        this.btn_chuzhan = this.uiPanel.getChild("btn_chuzhan");
        this.btn_chongzhi = this.uiPanel.getChild("btn_chongzhi");
        this.label_skillDes = this.uiPanel.getChild("label_skillDes", fgui.GComponent).getChild("label_skillDes");
        this.group_tupo = this.uiPanel.getChild("group_tupo");
        this.btn_tupo = this.uiPanel.getChild("btn_tupo");
        this.loader_yj1 = this.uiPanel.getChild("loader_yj1");
        this.label_yj1 = this.loader_yj1.getChild("label_lock");
        this.loader_yj2 = this.uiPanel.getChild("loader_yj2");
        this.label_yj2 =  this.loader_yj2.getChild("label_lock");
        this.label_gj = this.uiPanel.getChild("label_gj");
        this.label_sm = this.uiPanel.getChild("label_sm");
        this.label_fy = this.uiPanel.getChild("label_fy");
        this.needItem1 = this.uiPanel.getChild("needItem1");
        this.needItem2 = this.uiPanel.getChild("needItem2");
        this.btn_sj = this.uiPanel.getChild("btn_sj");
        this.group_needThe = this.uiPanel.getChild("group_needThe");
        this.label_stage = this.uiPanel.getChild("label_stage");
        this.btn_isTen = this.uiPanel.getChild("btn_isTen");
        this.loader_suip = this.group_needThe.getChild("loader_item")

        let drawProto = LocaleData.getItemProto(this.theRoot.levelUpItemId)
        let btn_add1: fgui.GComponent = this.uiPanel.getChild("btn_add1");
        btn_add1.getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}",[ drawProto.icon ])
        btn_add1.getChild("btn_add", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.theRoot.levelUpItemId, "1"), buyCall:() => {
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


        // .text = StrVal.LYTHEURGY.STR30
        this.btn_isTen.selected = LocaleUser.getGlobal(VarVal.FIELD_SV.THEURGY_TENUP) == "1"
        this.btn_isTen.onClick(() => {
            LocaleUser.setGlobal(VarVal.FIELD_SV.THEURGY_TENUP, this.btn_isTen.selected ? "1" : "0");
            LocaleUser.flush()
            let needMoney = 0
            let needItme = 0
            for (let index = 0; index < (this.btn_isTen.selected ? this.upLevelNumber: 1); index++) {
                let theLevelProto = LocaleData.getTheurgLevelByLevel(this.theurgyInst.level + index);
                needMoney = needMoney + Number(theLevelProto.money)
                needItme = needItme + Number(theLevelProto.amount)
            }
            UtilsUI.setNeedItemGroup(this.needItem1, UtilsUI.getItemIconUrl(this.needUpItemProto.icon), GameServerData.getInstance().getItemCountByProtoId(this.needUpItemProto.id), needItme);
            UtilsUI.setNeedItemGroup(this.needItem2, UtilsUI.getItemIconUrl(VarVal.bonusType.money),  this.playerBase.money, needMoney);
            // this.btn_isTen.getChild("n4", fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR30, [this.btn_isTen.selected ? this.upLevelNumber: 1] ) 
        })
        
        this.btn_chuzhan.text = StrVal.LYTHEURGY.STR11
        this.btn_chuzhan.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    let theurgies = GameServerData.getInstance().getPlayerFullInfo().theurgyInfo.theurgies
                    for (let index = 0; index < theurgies.length; index++) {
                        if (theurgies[index].cfgId == this.theurgyInst.cfgId) {
                            this.theurgyInst = theurgies[index];
                            break;
                        }
                    }
                    UtilsUI.showMsgTip(StrVal.LYTHEURGY.STR49)
                    this.refreshPage()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } , "theurgyAttach", { theurgyId: this.theurgyInst.cfgId })
        });
        this.btn_chongzhi.text = StrVal.LYTHEURGY.STR13
        this.btn_chongzhi.onClick(()=>{
            if (this.theurgyInst.level == 1) {
                UtilsUI.showMsgTip(StrVal.LYTHEURGY.STR50)
            }else {
                let needMoney = 0
                let needItme = 0
                for (let index = 1; index < this.theurgyInst.level; index++) {
                    let theLevelProto = LocaleData.getTheurgLevelByLevel(index);
                    needMoney = needMoney + Number(theLevelProto.money)
                    needItme = needItme + Number(theLevelProto.amount)
                }
                let bounses = []
                bounses.push( UtilsUI.getBonuseItem(VarVal.bonusType.money, null, null, String(needMoney)))
                bounses.push( UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.needUpItemProto.id, String(needItme)))
                let mGCom :fgui.GComponent = fgui.UIPackage.createObject("LyTheurgy", "group_reset").asCom;
                (<fgui.GButton>mGCom.getChild("btn_back")).onClick(()=>{
                    mGCom.dispose()
                })
                let group_needThe: fgui.GComponent = mGCom.getChild("group_needThe")
                UtilsUI.setNeedItemGroup(group_needThe, UtilsUI.getItemIconUrl(VarVal.bonusType.stone), this.playerBase.stone, this.theRoot.resetStoneAmount);
                mGCom.getChild("label_title", fgui.GLabel).text = StrVal.LYTHEURGY.STR13
                let list_item: fgui.GList = mGCom.getChild("list_item")
                list_item.itemRenderer = (index: number, child:fgui.GComponent)=>{
                    UtilsUI.setUIGroupItem(bounses[index], child, null)
                };
                list_item.numItems = bounses.length
                mGCom.setSize(this.getUiPanel().width, this.getUiPanel().height);
                this.getUiPanel().addChild(mGCom)
                let btn_chongzhi: fgui.GButton = mGCom.getChild("btn_chongzhi")
                btn_chongzhi.text = StrVal.LYTHEURGY.STR13
                btn_chongzhi.onClick(()=>{
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.theurgyInst = args.theurgy
                            this.refreshPage()
                            UtilsUI.showItemReward({ bonuseItems: bounses});
                            mGCom.dispose()
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } , "theurgyReset", { theurgyId:this.theurgyInst.cfgId })
                });
            }
            
        });
        this.btn_tupo.text = StrVal.LYTHEURGY.STR12
        this.btn_tupo.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyTuPo, 0, this.theurgyInst)
        });
        this.btn_sj.text = StrVal.LYTHEURGY.STR14
        this.btn_sj.onClick(()=>{
            let theLevelProto = LocaleData.getTheurgLevelByLevel(this.theurgyInst.level);
            if (GameServerData.getInstance().getPlayerFullInfo().base.money < Number(theLevelProto.money)) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.money, null, null, "1"), buyCall:() => {
                    this.refreshPage()
                }});
                return
            }
            if (GameServerData.getInstance().getItemCountByProtoId(this.needUpItemProto.id) < Number(theLevelProto.amount) ) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.needUpItemProto.id, "1"), buyCall:() => {
                    this.refreshPage()
                }});
                return 
            }
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.theurgyInst = args.theurgy
                    this.refreshPage()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } , "theurgyLevelUp", { theurgyId:this.theurgyInst.cfgId, count: this.btn_isTen.selected ? this.upLevelNumber : 1})
        });


        this.loader_yj1.onClick(()=>{
            if (this.theurgyInst.level >= Number(this.theRoot.seal1Level)) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgySeal, 0, { theurgyInst: this.theurgyInst , pos: 0 })
            }
        });
        this.label_yj1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR21, [this.theRoot.seal1Level])
        this.loader_yj2.onClick(()=>{
            if (this.theurgyInst.level >= Number(this.theRoot.seal2Level)) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgySeal, 0, { theurgyInst: this.theurgyInst , pos: 1 })
            }
        });
        this.label_yj2.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR21, [this.theRoot.seal2Level])
       
        this.theurgyInst = _params.theurgyInst
        this.needUpItemProto  = LocaleData.getItemProto(LocaleData.getTheurgyRoot().levelUpItemId)
        if (this.theurgyInst.new) {
            this.theurgyInst.new = null
        }
        this.refreshPage()
    }
    private refreshPage() {
        this.LoadData()
        let theProto = LocaleData.getTheurgyById(this.theurgyInst.cfgId);
        // this.group_suip.getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/f_{0}", [theProto.icon]);
        // this.group_suip.getChild("loader_bg", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [Number(theProto.quality) + 1]);
        (this.group_item.getChild("loader_dikuang") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_name{0}", [theProto.quality]);
        (this.group_item.getChild("loader_qua") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_kuang{0}", [theProto.quality]);
        (this.group_item.getChild("loader_grade") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_dj{0}", [theProto.quality]);
        (this.group_item.getChild("loader_icon") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/f_{0}", [theProto.icon]);
        (this.group_item.getChild("label_name") as fgui.GLabel).text = theProto.name;
        (this.group_item.getChild("label_grade") as fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR28, [this.theurgyInst.level]) ;
        (this.group_item.getChild("group_type") as fgui.GGroup).visible = true;
        (this.group_item.getChild("label_type") as fgui.GTextField).strokeColor = this.textColor3[ Number(theProto.quality)-1];
        (this.group_item.getChild("label_type") as fgui.GLabel).text = StrVal.LYTHEURGYNMAE3[ Number(this.theurgyInst.type) - 1  ];
        (this.group_item.getChild("loader_type") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_typeDi{0}", [theProto.quality]);


        (this.uiPanel.getChild("loader_bg") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_infoBg{0}", [theProto.quality]);
        this.label_name.color = this.textColor1[Number(theProto.quality) - 1] 
        this.label_name.strokeColor = this.textColor2[Number(theProto.quality) - 1]
        this.label_name.text = theProto.name; 
        let label_des1: fgui.GLabel = this.uiPanel.getChild("label_des1");
        if (this.theurgyInst.type == 1) {
            label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR7, [this.theurgyInst.phase]);
        }else if(this.theurgyInst.type == 2){
            label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR8, [this.theurgyInst.phase]);
        }else if(this.theurgyInst.type == 3){
            label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR9, [this.theurgyInst.phase]);
        }else if(this.theurgyInst.type == 4){
            label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR10, [this.theurgyInst.phase]);
        }
        let skillId = theProto.phaseSkillId.split(",")[this.theurgyInst.phase - 1];
        this.label_skillDes.text = LocaleData.getSkillProto(skillId).desc;
        let pahasePorto = LocaleData.getTheurgPhase(this.theurgyInst.phase)
        UtilsUI.setNeedItemGroup(this.group_needThe, UtilsTool.stringFormat("ui://CCommon/suipian_{0}", [theProto.icon]), this.getTheurgyFragNumber(theProto.id), pahasePorto.fragAmount)
        this.btn_chuzhan.visible = this.theurgyInst.status == 0
        this.label_stage.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR28, [this.theurgyInst.level]);

        this.loader_yj2.visible = LocaleData.getTheurgQua(theProto.quality).sealNumber == "2"


        let unLocak1 = this.theurgyInst.level < Number(this.theRoot.seal1Level)
        let unLocak2 = this.theurgyInst.level < Number(this.theRoot.seal2Level)
        this.loader_yj1.getChild("group_lock").visible = unLocak1
        this.loader_yj2.getChild("group_lock").visible = unLocak2
        //印记
        if (this.theurgyInst.seal.length == 0) {
            this.setGroupSeal(this.loader_yj1, null, unLocak1);
            this.setGroupSeal(this.loader_yj2, null, unLocak2);
        }else if(this.theurgyInst.seal.length > 1){
            //两个槽位
            this.setGroupSeal(this.loader_yj1, this.theurgyInst.seal[0] == 0 ? null :this.theurgyInst.seal[0], unLocak1);
            this.setGroupSeal(this.loader_yj2, this.theurgyInst.seal[1]== 0 ? null :this.theurgyInst.seal[1], unLocak2);
        }else{
            //一个槽位
            this.setGroupSeal(this.loader_yj1, this.theurgyInst.seal[0] == 0 ? null :this.theurgyInst.seal[0], unLocak1);
            this.setGroupSeal(this.loader_yj2, null, unLocak2);
        };
        

        let theLevelProto = LocaleData.getTheurgLevelByLevel(this.theurgyInst.level);
        this.label_gj.text = UtilsTool.stringFormat("{0}:{1}",[StrVal.ELITEATTR_NAME.attack, theLevelProto.strength]);
        this.label_sm.text = UtilsTool.stringFormat("{0}:{1}",[StrVal.ELITEATTR_NAME.hp, theLevelProto.health])
        this.label_fy.text = UtilsTool.stringFormat("{0}:{1}",[StrVal.ELITEATTR_NAME.defense, theLevelProto.defense])
        
       
        this.uiPanel.getChild("n121").visible = Number(LocaleData.getTheurgPhase(1000000).phase) != this.theurgyInst.phase
        this.uiPanel.getChild("group_maxPhase").visible = Number(LocaleData.getTheurgPhase(1000000).phase) == this.theurgyInst.phase

        let number = GameServerData.getInstance().getItemCountByProtoId(this.theRoot.levelUpItemId)
        this.label_money1.text = String(number) 
        this.label_money2.text = String(GameServerData.getInstance().getPlayerFullInfo().base.stone) 


        let maxLevel = Number(LocaleData.getTheurgLevelByLevel(1000000).level) 
        this.uiPanel.getChild("group_max").visible = this.theurgyInst.level == maxLevel
        this.uiPanel.getChild("n115").visible = this.theurgyInst.level != maxLevel

        //连续十次
        let nowMaxLevel = Number(pahasePorto.levelCap) 
        if (this.theurgyInst.level + 10 > nowMaxLevel && nowMaxLevel != this.theurgyInst.level) {    
            this.upLevelNumber = nowMaxLevel - this.theurgyInst.level
        }else {
            this.upLevelNumber = 10
        }
        this.btn_isTen.getChild("n4", fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR30, [this.upLevelNumber]) 
        let needMoney = 0
        let needItme = 0
        for (let index = 0; index < (this.btn_isTen.selected ? this.upLevelNumber: 1); index++) {
            let theLevelProto = LocaleData.getTheurgLevelByLevel(this.theurgyInst.level + index);
            needMoney = needMoney + Number(theLevelProto.money)
            needItme = needItme + Number(theLevelProto.amount)
        }

        if (this.theurgyInst.level < Number(pahasePorto.levelCap)) {
            if (GameServerData.getInstance().getPlayerFullInfo().base.money >= Number(theLevelProto.money) && GameServerData.getInstance().getItemCountByProtoId(this.needUpItemProto.id) >= Number(theLevelProto.amount)) {
                PointRedData.getInstance().updateManualPoint(this.btn_sj, true)
            }else{
                PointRedData.getInstance().updateManualPoint(this.btn_sj, false)
            }
        }else{
            PointRedData.getInstance().updateManualPoint(this.btn_sj, false)
        }

        PointRedData.getInstance().updateManualPoint(this.btn_tupo, this.getTheurgyFragNumber(theProto.id) >= Number(pahasePorto.fragAmount))
        UtilsUI.setNeedItemGroup(this.needItem1, UtilsTool.stringFormat("ui://CCommon/{0}", [this.needUpItemProto.icon]), GameServerData.getInstance().getItemCountByProtoId(this.needUpItemProto.id), needItme);
        UtilsUI.setNeedItemGroup(this.needItem2, UtilsUI.getItemIconUrl(VarVal.bonusType.money), this.playerBase.money, needMoney);
    }

    private LoadData(){
        this.playerBase = GameServerData.getInstance().getPlayerFullInfo().base
    }

    private setGroupSeal(com:fgui. GComponent, protoId: any, redPoint?:boolean){
        let loader_icon: fgui.GLoader = com.getChild("loader_icon");
        let label_name: fgui.GLabel = com.getChild("label_name");
        let loader_dikuang: fgui.GLoader = com.getChild("loader_dikuang")
        if (protoId) {
            let sealProto = LocaleData.getTheurgSealByItemId(protoId)
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [sealProto.icon]);
            label_name.text = sealProto.desc;
            loader_dikuang.url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [ Number(sealProto.quality) + 1]);
            PointRedData.getInstance().updateManualPoint(com, false)
        }else{
            loader_icon.url = "ui://LyTheurgy/btn_add"
            label_name.text = ""
            loader_dikuang.url = "ui://LyTheurgy/frame_prop add box"
            if (!redPoint) {
                let number = LyTheurgy.typeSealNumber(this.theurgyInst.type)
                PointRedData.getInstance().updateManualPoint(com, number > 0)
            }
        }
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

    public onViewDestroy(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyTheurgy, 0, null)
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyTheurgyGroupInfo, 0, {theurgyInst: this.theurgyInst, protoId: LocaleData.getTheurgyById(this.theurgyInst.cfgId)});
    }

    public onViewUpdate(params: any): void {
        this.theurgyInst = params.theurgyInst
        this.refreshPage()
        
    }

    public onViewShowFront(): void {
        this.refreshPage()
    }
}


