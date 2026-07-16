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
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { LocaleUser } from "../Kernel/LocaleUser";
import { LyEliteInfo } from "./LyEliteInfo";
import { LyEliteDraw } from "./LyEliteDraw";
import { LyEliteDrawGift } from "./LyEliteDrawGift";

export class LyEliteGiftChoose extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyEliteGiftChoose";
    }

    private chooseId = null
    public onViewCreate(_params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        // let xmlRoot = LocaleData.getBrumeIsleConfig()
        getUiPanel.getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteGiftChoose, 0, null);
        });
        group_main.getChild("btn_close").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteGiftChoose, 0, null);
        });
        let root = LocaleData.getEliteMonsterRoot()
        let playBase = GameServerData.getInstance().getPlayerFullInfo().base;

        let loader3d_spine = group_main.getChild("loader3d_spine", fgui.GLoader3D)
        let btn_up = group_main.getChild("btn_up", fgui.GButton)
        btn_up.text = StrVal.LYELITEMONSTER.STR58
        btn_up.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.chooseId = null
                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([{ inserts: args.itemInserts }]) });
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyEliteDraw, 0, {refreshUI: true});
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyEliteDrawGift, 0, null);
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteGiftChoose, 0, null);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } , "openSpecialguarantees", { itemId: Number(rewardProto.id), eliteMonsterProtoId: this.chooseId })
        })
        let label_name = group_main.getChild("label_name", fgui.GLabel)
        let label_skill = group_main.getChild("label_skill", fgui.GLabel)
        let label_skilDes = group_main.getChild("label_skilDes", fgui.GLabel)
        let list_arrts = group_main.getChild("list_arrts", fgui.GList)
        let list_allEditMo = group_main.getChild("list_allEditMo", fgui.GList)
        let label_grade = group_main.getChild("label_grade", fgui.GList)
        let Loader_qua = group_main.getChild("Loader_qua", fgui.GLoader) 

        list_allEditMo.setVirtual()
        list_allEditMo.itemRenderer = ((index: number, child: fgui.GComponent)=>{
            let mosterProto = monstersData[index];
            let modelShowInfo = LocaleData.getModelShowInfo(mosterProto.modelId);
            (<fgui.GLoader>child.getChild("laoder_qua")).url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [Number(mosterProto.quality)]);
            let laoder_icon:fgui.GLoader = child.getChild("laoder_icon");
            laoder_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [modelShowInfo.icon_square]);
            let label_grade: fgui.GLabel = child.getChild("label_grade");
            let group_grade: fgui.GGroup = child.getChild("group_grade")
            let pro_suip: fgui.GProgressBar = child.getChild("pro_suip");
            group_grade.visible = false
            child.getChild("group_suip").visible = false
            child.getChild("label_name").text = mosterProto.name
            child.clearClick()
            child.onClick(()=>{
                showFun(mosterProto)
            });
        }).bind(this)
        
        let nowArrts = []
        list_arrts.itemRenderer = ((index: number, child: fgui.GComponent)=>{
            let attr = nowArrts[index];
            (<fgui.GLabel>child.getChild("title")).text =  StrVal.ELITEATTR_NAME[attr.id] + "+" + attr.num + "%"
         }).bind(this)

        let showFun = (proto)=>{
            this.chooseId = proto.id
            label_name.text = proto.name
            label_grade.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR37, [5])
            let modelShowInfo = LocaleData.getModelShowInfo(proto.modelId);
            new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            }, loader3d_spine, modelShowInfo.spine);
            Loader_qua.url = UtilsTool.stringFormat("ui://LyEliteMonster/frame_skill{0}", [proto.quality]);
            let mosterLevelData = LocaleData.getEliteMonsterLevel(proto.id, 5)
            let skillData = LocaleData.getSkillProto(mosterLevelData.skill_id)
            label_skill.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR33, [skillData.name, mosterLevelData.skill_level]);
            label_skilDes.text = skillData.desc
            nowArrts = LyEliteInfo.getProtoAttr(mosterLevelData);
            list_arrts.numItems = nowArrts.length
        }

        let xmls = LocaleData.getEliteMonsterRoot()._elitemonster[0]._item
        let monstersData = []
        let rewardProto = _params
        console.log(rewardProto)
        for (let index = 0; index < xmls.length; index++) {
            if (xmls[index].quality == rewardProto.quality) {
                monstersData.push(xmls[index])
            }
        }
        UtilsUI.setFguiGlistDelayNumItems(list_allEditMo, monstersData.length);
        showFun(monstersData[0])
        // xmls.forEach(monster => {
        //     let temp = {};
        //     let own = this.ownMonster(monster.id);
        //     temp["own"] = own
        //     temp["ownDebr"] = this.ownMonsterDebrisCount(monster.debris_id);
        //     temp["proto"] = monster;
        //     if (own) {
        //         this.ownNumber = this.ownNumber + 1
        //         temp["needNumber"] = Number(LocaleData.getEliteMonsterLevel(monster.id, own.level).upgrade_cost) 
        //     }else{
        //         temp["needNumber"] = Number(monster.debris_count) 
        //     }
        //     temp["modelShowInfo"] =  LocaleData.getModelShowInfo(monster.modelId)
        //     temp["inTeam"] = false;
        //     this.monstersData.push(temp);
        // });
        
        // this.monstersData.sort((a: any, b: any): number =>{
        //     // 同时满碎片
        //     // let aneedNumber = 0
        //     // let bneedNumber = 0
        //     // if (a.own) {
        //     //     aaneedNumber
        //     // }else {
        //     //     aneedNumber = a.proto.debris_count
        //     // }
        //     // if (b.own) {
        //     //     bneedNumber = LocaleData.getEliteMonsterLevel(b.proto.id, b.own.level).upgrade_cost
        //     // }else {
        //     //     bneedNumber = b.proto.debris_count
        //     // }
        //     let afullSuip =  a.ownDebr >= a.needNumber? 2:1
        //     let bfullSuip =  b.ownDebr >= b.needNumber? 2:1
        //     if (afullSuip == bfullSuip && afullSuip == 2) {
        //         if (a.proto.quality == b.proto.quality) {
        //             return Number(a.proto.id) - Number(b.proto.id)
        //         }else{
        //             return Number(b.proto.quality) - Number(a.proto.quality)
        //         }
        //     }else if(afullSuip == 2 || bfullSuip == 2){  
        //         return bfullSuip - afullSuip
        //     }
        //     else{
        //         let aOwnNumber = a.own? 2:1
        //         let bOwnNumber = b.own? 2:1
        //         if (aOwnNumber - bOwnNumber == 0) {
        //             if (a.proto.quality == b.proto.quality) {
        //                 return Number(a.proto.id) - Number(b.proto.id)
        //             }else{
        //                 return Number(b.proto.quality) - Number(a.proto.quality)
        //             }
        //         }else{
        //             return bOwnNumber - aOwnNumber  
        //         }
        //     }
        // })

    }

  
    public onViewDestroy(): void {
        
    }

    private giftId:number;
    public onViewUpdate(params: any): void {
       
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


