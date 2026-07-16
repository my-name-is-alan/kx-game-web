//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { LocaleData } from "../Kernel/LocaleData";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { LyEliteMonster } from "./LyEliteMonster";
import { GameServerData } from "../Kernel/GameServerData";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { VarVal } from "../Values/VarVal";
import { LyEliteGet } from "./LyEliteGet";
import { PointRedData } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";


export class LyEliteInfo extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyEliteInfo";
    }

    private uiPanel:fgui.GComponent;
    private allData: any
    private moseterInfo: any
    private pos: number
    private nowArrts: any[] = []
    private nextArrts: any[] = []
    private isTop

    private eliteMosterTeam: any
    private elitemonsterInfo: any
    private playerbase: any

    private loader3d_spine: fgui.GLoader3D
    private label_grade: fgui.GLabel
    private label_name: fgui.GLabel
    private label_skill: fgui.GLabel
    private label_skilDes: fgui.GLabel
    private list_arrts: fgui.GList
    private pro_level: fgui.GProgressBar
    private label_next: fgui.GLabel
    private btn_eliteM: fgui.GButton
    private btn_up: fgui.GButton
    private btn_deploy: fgui.GButton
    private btn_deployDown: fgui.GButton
    private btn_last:fgui.GButton
    private btn_next:fgui.GButton
    private label_nextGrade:fgui.GLabel
    private skillBtn:fgui.GComponent
    private group_des:fgui.GComponent

    private getAttr = []
    public onViewCreate(_params:any): void {
        this.pos = 0
        this.moseterInfo = _params.info
        if (_params.protoId) {
            this.moseterInfo = {}
            this.moseterInfo["own"] = GameServerData.getInstance().getLyEliteMonsterByProto(_params.protoId);
            this.moseterInfo["proto"] = LocaleData.getEliteMonsterProto(_params.protoId);
            this.moseterInfo["ownDebr"] = GameServerData.getInstance().getItemCount(this.moseterInfo.proto.debris_id);
            this.moseterInfo["modelShowInfo"] =  LocaleData.getModelShowInfo(this.moseterInfo.proto.modelId)
        }else {
            this.allData = _params.allData
            for (let index = 0; index < this.allData.length; index++) {
                let element = this.allData[index];
                if (element.proto.id == this.moseterInfo.proto.id) {
                    this.pos = index
                }
            }
        }
        this.uiPanel = this.getUiPanel().getChild("main");
        (<fgui.GButton>this.getUiPanel().getChild("btn_closeMask")).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteInfo, 0, null)
        });
        (<fgui.GButton>this.uiPanel.getChild("btn_close")).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteInfo, 0, null)
        });
        this.loader3d_spine = this.uiPanel.getChild("loader3d_spine")
        this.label_grade = this.uiPanel.getChild("label_grade")
        this.label_name = this.uiPanel.getChild("label_name")
        this.label_skill = this.uiPanel.getChild("label_skill")
        this.label_skilDes = this.uiPanel.getChild("label_skilDes")
        this.list_arrts = this.uiPanel.getChild("list_arrts")
        this.pro_level = this.uiPanel.getChild("pro_level")
        this.label_next = this.uiPanel.getChild("label_next")
        this.btn_eliteM = this.uiPanel.getChild("btn_eliteM")
        this.btn_up = this.uiPanel.getChild("btn_up")
        this.btn_deploy = this.uiPanel.getChild("btn_deploy")
        this.btn_deployDown = this.uiPanel.getChild("btn_down")
        this.btn_last = this.uiPanel.getChild("btn_last")
        this.btn_next = this.uiPanel.getChild("btn_next");
        this.label_nextGrade = this.uiPanel.getChild("label_nextGrade");
        this.skillBtn = this.uiPanel.getChild("skillBtn");
        this.group_des = this.uiPanel.getChild("group_des");
        this.btn_last.visible = this.allData ? true : false;
        this.btn_next.visible = this.allData ? true : false;
        this.btn_last.onClick(()=>{
            this.pos -= 1
            if (this.pos < 0) {
                this.pos = this.allData.length - 1
            }
            this.moseterInfo = this.allData[this.pos]
            this.onViewShowFront()
        });
        this.btn_next.onClick(()=>{
            this.pos += 1
            if (this.pos >= this.allData.length) {
                this.pos = 0
            }
            this.moseterInfo = this.allData[this.pos]
            this.onViewShowFront()
        });
        this.btn_next.visible = this.allData ? true : false;
        (this.uiPanel.getChild("n70") as fgui.GLabel).text = StrVal.LYELITEMONSTER.STR35;
        (this.uiPanel.getChild("n69") as fgui.GLabel).text = StrVal.LYELITEMONSTER.STR36;
       
        this.list_arrts.itemProvider = ():string =>{
            return "ui://LyEliteMonster/group_infoArr2"
        }
        this.list_arrts.itemRenderer = ((index: number, child: fgui.GComponent)=>{
           let attr = this.nowArrts[index];
           (<fgui.GLabel>child.getChild("title")).text =  StrVal.ELITEATTR_NAME[attr.id] + "+" + attr.num + "%"
        }).bind(this)

        this.skillBtn.onClick(()=>{
            if (this.group_des.visible) {
                this.group_des.visible = false
            }else{
                this.group_des.visible = true
            }
        });

        this.btn_up.onClick(()=>{
            if (this.moseterInfo.own) {
                if ( this.moseterInfo.ownDebr >= Number(LocaleData.getEliteMonsterLevel(this.moseterInfo.proto.id, this.moseterInfo.own.level).upgrade_cost)) {
                    //升级
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.moseterInfo.own = args.elitemonster
                            this.refreshAllData()
                            this.refrehPage()
                            if (this.moseterInfo.own.level % 5 == 0) {
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteGet, 0, {inst: this.moseterInfo});
                            }else{
                                UtilsUI.showMsgTip(StrVal.LYELITEMONSTER.STR20)
                            }
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } , "levelUpEliteMonster", {eliteMonsterId: this.moseterInfo.own.id })
                }else{
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.moseterInfo.proto.debris_id, "1"), buyCall:() => {
                        // this.updateShow();
                    }});
                }
            }else{
                if ( this.moseterInfo.ownDebr >= Number(this.moseterInfo.proto.debris_count)) {
                    //激活
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.moseterInfo.own = args.elitemonster
                            this.refreshAllData()
                            this.refrehPage()
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteGet, 0, {inst: this.moseterInfo, desArr: this.getAttr});
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } , "activiteEliteMonster", {eliteMonsterProtoId: this.moseterInfo.proto.id })
                }else{
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.moseterInfo.proto.debris_id, "1"), buyCall:() => {
                        // this.updateShow();
                    }});
                }
            }
        })

        this.btn_deploy.text = StrVal.LYELITEMONSTER.STR16
        this.btn_deploy.onClick(()=>{
        //    if (this.isOnTeam(this.moseterInfo.own.id)) {
        //         //下阵
        //         let index = this.eliteMosterTeam.indexOf(this.moseterInfo.own.id)
        //         this.eliteMosterTeam[index] = "0"
        //    }else{
            //上阵
            let index = this.eliteMosterTeam.indexOf("0")
            this.eliteMosterTeam[index] = this.moseterInfo.own.id
            if (index == -1) {
                UtilsUI.showMsgTip(StrVal.LYELITEMONSTER.STR18)
                return
            }
        //    }
           let str = ""
           for (let index = 0; index < this.eliteMosterTeam.length; index++) {
                str = str + this.eliteMosterTeam[index] + ";"
            }
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.loadInfoData()
                    this.refrehPage()
                    UtilsUI.showMsgTip(StrVal.LYELITEMONSTER.STR21)
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } , "editteamcomposition", { teamId: this.playerbase.eliteMonsterBattleTeamId, eliteMonsterIdStr: str })
        })

        this.btn_deployDown.text = StrVal.LYELITEMONSTER.STR17
        this.btn_deployDown.onClick(()=>{
            // if (this.isOnTeam(this.moseterInfo.own.id)) {
            //      //下阵
            let index = this.eliteMosterTeam.indexOf(this.moseterInfo.own.id)
            this.eliteMosterTeam[index] = "0"
            // }else{
             //上阵
            // let index = this.eliteMosterTeam.indexOf("0")
            // this.eliteMosterTeam[index] = this.moseterInfo.own.id
            // if (index == -1) {
            //     UtilsUI.showMsgTip(StrVal.LYELITEMONSTER.STR18)
            //     return
            // }
            // }
            let str = ""
            for (let index = 0; index < this.eliteMosterTeam.length; index++) {
                 str = str + this.eliteMosterTeam[index] + ";"
             }
             UtilsUI.lockWait()
             GameServer.getInstance().send((args: any) => {
                 UtilsUI.unlockWait()
                 if (args.errorcode == 0) {
                     UtilsUI.showMsgTip(StrVal.LYELITEMONSTER.STR53)
                     this.loadInfoData()
                     this.refrehPage()
                 } else {
                     UtilsUI.showMsgTip(args.errorcode)
                 }
             } , "editteamcomposition", { teamId: this.playerbase.eliteMonsterBattleTeamId, eliteMonsterIdStr: str })
         })
 

        let  btn_info:fgui.GButton = this.uiPanel.getChild("btn_info")
        btn_info.onClick(()=>{
            let mGCom = this.getUiPanel().getChild("group_skillInfoitem", fgui.GComponent);
            mGCom.visible = true;
            (<fgui.GButton>(mGCom.getChild("btn_close"))).onClick(()=>{
                mGCom.visible = false
            });
            let allLevel = LocaleData.getEliteMonsterAllSkill(this.moseterInfo.proto.id)
            let  list_all: fgui.GList = mGCom.getChild("list_all")
            list_all.itemProvider = ():string =>{
                return "ui://LyEliteMonster/group_oneSkill"
            }
            list_all.itemRenderer = ((index: number, child: fgui.GComponent)=>{
                let levelData = allLevel[index]
                // let label_skillGrade:fgui.GLabel = child.getChild("label_skillGrade")
                let label_lock:fgui.GLabel = child.getChild("label_lock")
                let label_des:fgui.GLabel = child.getChild("label_des")
                let label_skillName:fgui.GLabel = child.getChild("label_skillName")
                let skill = LocaleData.getSkillProto(levelData.skill_id)
                if (levelData.skill_level == "1") {
                    label_lock.text = StrVal.LYELITEMONSTER.STR41
                }else{
                    label_lock.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR42, [levelData.level])
                }
                label_skillName.text = skill.name + " " + UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR37, [levelData.level]) 
                label_des.text = skill.desc
            })
            list_all.numItems = allLevel.length
        })

        this.loadInfoData()
        this.refrehPage()
    }

    private refreshAllData (){
        this.loadInfoData()
        if (this.allData) {
            for (let index = 0; index < this.allData.length; index++) {
                if (this.allData[index].proto.id == this.moseterInfo.proto.id) {
                    this.allData[index] = this.moseterInfo
                }
            }
            
        }
        // this.elitemonsterInfo.elitemonsterDebris.forEach(debris => {
        //     if (String(debris.protoId) == String(this.moseterInfo.proto.debris_id)) {
        //         this.moseterInfo.ownDebr = debris.count
        //     }
        // });
        this.moseterInfo.ownDebr = GameServerData.getInstance().getItemCount(this.moseterInfo.proto.debris_id)
    }

    private isOnTeam(id: string): boolean{
        for (let index = 0; index < this.eliteMosterTeam.length; index++) {
            let ids = this.eliteMosterTeam[index]
            if (ids == id) {
                return true
            }
        }   
        return false
    }

    private isFullTeam(id: string): boolean{
        for (let index = 0; index < this.eliteMosterTeam.length; index++) {
            let ids = this.playerbase.eliteMonsterTeam[index]
            if (ids == id) {
                return true
            }
        }   
        return false
    }

    private loadInfoData(): void{
        this.playerbase = GameServerData.getInstance().getPlayerFullInfo().base
        this.elitemonsterInfo = GameServerData.getInstance().getPlayerFullInfo().elitemonsterInfo
        this.eliteMosterTeam = this.playerbase.eliteMonsterTeam[this.playerbase.eliteMonsterBattleTeamId - 1].eliteMonsterId.split(";")
    }
    private refrehPage(): void{
        this.label_name.text = this.moseterInfo.proto.name
        let monsterGrade = 0
        let mosterLevelData
        let nextMosterLevelData
        this.pro_level.max = 4
        if (this.moseterInfo.own) {
            monsterGrade = this.moseterInfo.own.level
            this.label_grade.visible = true
            this.label_grade.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR37,[monsterGrade])
            this.btn_deploy.visible = !this.isOnTeam(this.moseterInfo.own.id) 
            // this.btn_deploy.text = this.isOnTeam(this.moseterInfo.own.id) 
            this.btn_deployDown.visible = this.isOnTeam(this.moseterInfo.own.id)
            this.pro_level.value = this.moseterInfo.own.level % 5
            
        }else{
            monsterGrade = 0
            this.label_grade.text = StrVal.LYELITEMONSTER.STR34
            this.pro_level.value = 0
            this.btn_deploy.visible = false
            this.btn_deployDown.visible = false
        }
        let showLevel = Math.floor(monsterGrade / 5) * 5
        this.label_nextGrade.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR38, [ monsterGrade + 1])
        mosterLevelData = LocaleData.getEliteMonsterLevel(this.moseterInfo.proto.id, monsterGrade)
        nextMosterLevelData = LocaleData.getEliteMonsterLevel(this.moseterInfo.proto.id, (monsterGrade + 1))
        let skillData: any
        if (monsterGrade == 0) {
            skillData = LocaleData.getSkillProto(nextMosterLevelData.skill_id)
            this.label_skill.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR33, [skillData.name, nextMosterLevelData.skill_level])  
        }else {
            skillData = LocaleData.getSkillProto(mosterLevelData.skill_id)
            this.label_skill.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR33, [skillData.name, mosterLevelData.skill_level])  
        }
        this.label_skilDes.text = skillData.desc 
      
        this.nowArrts = LyEliteInfo.getProtoAttr(mosterLevelData);
        this.nextArrts = []
        this.list_arrts.numItems = this.nowArrts.length;
        if (nextMosterLevelData) {
            this.nextArrts = LyEliteInfo.getProtoAttr(nextMosterLevelData);
            //前4级 前后等级属性个数不相同
            if (this.nextArrts.length > this.nowArrts.length) {
                for (let index = 0; index < this.nextArrts.length; index++) {
                    let have = false
                    for (let index2 = 0; index2 < this.nowArrts.length; index2++) {
                        
                        if (this.nextArrts[index].id == this.nowArrts[index2].id) {
                            have = true
                            break
                        }
                    }
                    if (!have) {
                        this.label_next.text = StrVal.ELITEATTR_NAME[this.nextArrts[index].id]+ "+" + this.nextArrts[index].num + "%"
                        this.getAttr.push(StrVal.ELITEATTR_NAME[this.nextArrts[index].id])
                        this.getAttr.push("+" + this.nextArrts[index].num + "%")
                        break
                    }
                }
            }else{
                let diffData = null
                for (let index = 0; index < this.nextArrts.length; index++) {
                    for (let index2 = 0; index2 < this.nowArrts.length; index2++) {
                        if (this.nextArrts[index].id == this.nowArrts[index2].id && this.nextArrts[index].num > this.nowArrts[index2].num) {
                            diffData = this.nextArrts[index]
                            break
                        }
                    }
                }
                //属性变化
                if (diffData) {
                    this.label_next.text = StrVal.ELITEATTR_NAME[diffData.id] + "+" + diffData.num + "%"      
                }
                //技能变化 技能等级 + 1
                else{
                    this.label_next.text =  UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR37,[skillData.name + nextMosterLevelData.skill_level])
                }
            }
            PointRedData.getInstance().updateManualPoint(this.btn_up, this.moseterInfo.ownDebr >= Number(mosterLevelData.upgrade_cost));
        }else{
            //满级处理
            showLevel = monsterGrade - 5
            this.btn_up.visible = false
            this.label_next.text = ""
            this.pro_level.value = this.pro_level.max
            this.label_nextGrade.text = ""
        }

        for (let index = 0; index < 4; index++) {
            let group_level:fgui.GComponent = this.uiPanel.getChild("group_nextLevel"+ index);
            (group_level.getChild("n62") as fgui.GLabel).text = String(showLevel + index + 1) ;
            (group_level.getChild("n61") as fgui.GImage).grayed = (showLevel + index + 1) > monsterGrade
        }

        


        (<fgui.GLoader>this.uiPanel.getChild("Loader_qua")).url = UtilsTool.stringFormat("ui://LyEliteMonster/frame_skill{0}", [this.moseterInfo.proto.quality]);
        // // 头像框设置
        (<fgui.GLoader>this.btn_eliteM.getChild("laoder_qua")).url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [ Number(this.moseterInfo.proto.quality)]);
        let laoder_icon:fgui.GLoader = this.btn_eliteM.getChild("laoder_icon");
        laoder_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [this.moseterInfo.modelShowInfo.icon_square]);
        let label_grade: fgui.GLabel = this.btn_eliteM.getChild("label_grade");
        let pro_suip: fgui.GProgressBar = this.btn_eliteM.getChild("pro_suip");

        if (this.moseterInfo.own) {
            pro_suip.max = Number(mosterLevelData.upgrade_cost) 
        }else {
            pro_suip.max = Number(this.moseterInfo.proto.debris_count);
        }
        pro_suip.value = this.moseterInfo.ownDebr;
        (<fgui.GLabel>this.btn_eliteM.getChild("label_suip")).text = UtilsTool.stringFormat("{0}/{1}",[ pro_suip.value, pro_suip.max]);
        if (this.moseterInfo.own) {
            label_grade.visible = true
            laoder_icon.grayed = false
        }
        else{
            label_grade.visible = false
            laoder_icon.grayed = true
        }
        if (this.moseterInfo.own) {
            this.btn_up.text = StrVal.LYELITEMONSTER.STR15
            this.btn_up.x = 140
        }else{
            this.btn_up.text = StrVal.LYELITEMONSTER.STR14
            this.btn_up.x = 268
        }

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                
        }, this.loader3d_spine, this.moseterInfo.modelShowInfo.spine);
    }

    public static getProtoAttr(proto:any): Array<any> {
        let nowArrts = [];
        for (const key in proto) {
            let isArrt = false
            for (const key2 in StrVal.ELITEATTR_NAME) {
                if (key == key2) {
                    isArrt = true;
                    break;
                }
            }
            if (isArrt && proto[key] != "0") {
                nowArrts.push({
                    id:key,
                    num:Number(proto[key])
                })
            }
        }
        return nowArrts;
    }

    public onViewDestroy(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyEliteMonster, 0, null)
    }

    public onViewShowFront(): void {
        this.loadInfoData()
        this.refrehPage()
    }

    public getIsViewMask(): boolean {
        return false;
    };
}