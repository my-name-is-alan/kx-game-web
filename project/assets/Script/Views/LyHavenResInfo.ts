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
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { RESPONSE_TYPE } from "../Kernel/HttpClient";
import { LocaleData } from "../Kernel/LocaleData";
import { VarVal } from "../Values/VarVal";
import { LyHaven } from "./LyHaven";
import { Label } from "cc";

export class LyHavenResInfo extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyHaven";
        this.viewResI.pkgName = "LyHaven";
        this.viewResI.comName = "LyHavenResInfo";
    }

    public static isSkipPlayAni: boolean
    private resData: any
    private xmlRoot: any
    private uiPanel:fgui.GComponent
    private label_time:fgui.GLabel
    private otherGuId: string 
    private plunderNumber:number = 1

    private win1:fgui.GImage
    private win_Me:fgui.GImage
    private label_desc1: fgui.GLabel
    private label_desc2: fgui.GLabel
    public onViewCreate(_params:any):void {
        this.resData = _params.data
        this.otherGuId = _params.otherGuId
        
        // let resProto = LocaleData.getItemProto(this.resData.resourceXml.itemId)
        this.uiPanel = this.getUiPanel().getChild("main")
        this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenResInfo, 0, null)
        })
        if (LyHavenResInfo.isSkipPlayAni) {
            LyHavenResInfo.isSkipPlayAni = false
        }else{
            UtilsUI.playCommonGroupAni(this.uiPanel, null)
        }
        let btn_close = this.uiPanel.getChild("btn_close")
        let label_title = this.uiPanel.getChild("label_title")
        let btn_go = this.uiPanel.getChild("btn_go")
        let btn_goBack = this.uiPanel.getChild("btn_goBack")
        let label_free = (this.uiPanel.getChild("btn_manage") as fgui.GComponent).getChild("label_free");
        let label_all = (this.uiPanel.getChild("btn_manage") as fgui.GComponent).getChild("label_all");
        this.win1 = this.uiPanel.getChild("win1")
        this.win_Me = this.uiPanel.getChild("winMe")
        this.label_desc1 = this.uiPanel.getChild("label_desc1")
        this.label_desc2 = this.uiPanel.getChild("label_desc2")
        label_title.text = StrVal.LYHAVEN.STR1;
        (this.uiPanel.getChild("n27")as fgui.GLabel).text = StrVal.LYHAVEN.STR2;
        btn_go.text = StrVal.LYHAVEN.STR3;
        let label_now: fgui.GLabel = this.uiPanel.getChild("label_number")
        btn_goBack.text = StrVal.LYHAVEN.STR12;
        let group_item: fgui.GComponent = this.uiPanel.getChild("group_item", fgui.GComponent).getChild("group_item");
        let bonuseItem :BonuseItem;
        let label_resName: fgui.GTextField = this.uiPanel.getChild("group_item", fgui.GComponent).getChild("label_name", fgui.GTextField)
        label_resName.stroke = 2
        if (this.resData.resourceXml.itemId.length > 1) {
            bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.resData.resourceXml.itemId, UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [this.resData.resourceXml.level]))
            label_resName.strokeColor = UtilsUI.getQualityColor(bonuseItem.proto.quality)
        }else if (this.resData.resourceXml.itemId.length > 0) {
            bonuseItem = UtilsUI.getBonuseItem(this.resData.resourceXml.itemId, null, null, UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [this.resData.resourceXml.level]))
            label_resName.strokeColor = UtilsUI.getQualityColor(bonuseItem.proto.quality); 
        }
        UtilsUI.setUIGroupItem(bonuseItem, group_item, null);
        label_resName.text = bonuseItem.name
        let btn_contrl: fgui.Controller = this.uiPanel.getController("btn");
        this.xmlRoot = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)
        let maxNumber = Number(this.xmlRoot.maxAmount)
        // let label_number = this.uiPanel.getChild("label_number")
        this.label_time = this.uiPanel.getChild("label_time")
        // label_number.text = this.resData.resourceXml.amonut
        let label_max = this.uiPanel.getChild("label_max")
        label_max.text = UtilsTool.stringFormat(StrVal.LYHAVEN.STR4, [this.plunderNumber, maxNumber])
        label_now.text = UtilsTool.stringFormat(StrVal.LYHAVEN.STR61,[this.resData.resourceXml.amonut])
        let selfHavenData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN).data.activityHaven
        label_free.text = UtilsTool.stringFormat(StrVal.LYHAVEN.STR8, [selfHavenData.restMouse]);
        label_all.text =  UtilsTool.stringFormat(StrVal.LYHAVEN.STR9, [selfHavenData.totalMouse]);
        let otherImg = this.uiPanel.getChild("img_xg1")
        this.uiPanel.getChild("btn_add").onClick(()=>{
            this.plunderNumber =  this.plunderNumber + 1
            if (this.plunderNumber > selfHavenData.totalMouse) {
                this.plunderNumber = selfHavenData.totalMouse
            }
            if (this.plunderNumber > maxNumber) {
                this.plunderNumber = maxNumber
            }
            label_max.text = UtilsTool.stringFormat(StrVal.LYHAVEN.STR4, [this.plunderNumber, maxNumber])
            this.label_time.text = UtilsTool.parseTimeToString(this.getTime())
            goArgs["mouseCount"] = this.plunderNumber
        });

        this.uiPanel.getChild("btn_rud").onClick(()=>{
            this.plunderNumber = this.plunderNumber - 1
            if (this.plunderNumber < 1) {
                this.plunderNumber = 1
            }
            label_max.text = UtilsTool.stringFormat(StrVal.LYHAVEN.STR4, [this.plunderNumber, maxNumber])
            this.label_time.text = UtilsTool.parseTimeToString(this.getTime())
            goArgs["mouseCount"] = this.plunderNumber
        });
        if (this.resData.data.isSpecialResource == 1) {
            this.uiPanel.getChild("group_left").visible = false
        }
        btn_close.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenResInfo, 0, null)
        })
        btn_contrl.selectedIndex = 0
        let playerId = 0
        let selfPlayerId = GameServerData.getInstance().getPlayerFullInfo().base.guid
        let mouseAmount = 0
        let goBackArgs = {}
        let gobackProtoNmae = "";

        let goProtoNmae = "";
        let goArgs = {}
        if (this.otherGuId == "0") {
            //自家福地
            gobackProtoNmae = "gatheringRecall"
            playerId = selfPlayerId
            if (this.resData.data.defender.playerId == selfPlayerId) {
                btn_contrl.selectedIndex = 1
            } 
            otherImg.visible = this.resData.data.attacker.mouseAmount > 0
            mouseAmount = this.resData.data.defender.mouseAmount
            goBackArgs["mouseCount"] = mouseAmount
            goBackArgs["id"] = this.resData.data.id

            goProtoNmae = "gatheringHavenResources"
            goArgs["mouseCount"] = this.plunderNumber
            goArgs["id"] = this.resData.data.id
            
            this.label_desc1.text = this.resData.data.attacker.mouseAmount > 0 ? this.resData.data.attacker.name: StrVal.LYHAVEN.STR36
            this.label_desc2.text = this.resData.data.defender.mouseAmount > 0 ? StrVal.LYHAVEN.STR60: StrVal.LYHAVEN.STR36
        }else{
            gobackProtoNmae = "plunderingRecall"
            if (this.resData.data.attacker.playerId == selfPlayerId) {
                btn_contrl.selectedIndex = 1
            } 
            otherImg.visible = this.resData.data.defender.mouseAmount > 0
            mouseAmount = this.resData.data.attacker.mouseAmount
            goBackArgs["targetPlayerId"] = this.otherGuId
            goBackArgs["mouseCount"] = mouseAmount
            goBackArgs["id"] = this.resData.data.id

            goProtoNmae = "plunderingHavenResources"
            goArgs["mouseCount"] = this.plunderNumber
            goArgs["id"] = this.resData.data.id
            goArgs["targetPlayerId"] = this.otherGuId

            this.label_desc1.text = this.resData.data.defender.mouseAmount > 0 ? this.resData.data.defender.name: StrVal.LYHAVEN.STR36
            if (this.resData.data.attacker.mouseAmount > 0) {
                //我在抢别人的福地
                if (this.resData.data.attacker.playerId == selfPlayerId) {
                    this.label_desc2.text = StrVal.LYHAVEN.STR60
                }else{
                    this.label_desc2.text = this.resData.data.attacker.name
                }
            }else{
                this.label_desc2.text = StrVal.LYHAVEN.STR36
            }
        }
        if (this.resData.data.defender.playerId == selfPlayerId || this.resData.data.attacker.playerId == selfPlayerId) {
            this.plunderNumber = mouseAmount
        }else{
            this.plunderNumber = 1
        }
        goArgs["mouseCount"] = this.plunderNumber
      
        this.label_time.text = UtilsTool.parseTimeToString(this.getTime())
        label_max.text = UtilsTool.stringFormat(StrVal.LYHAVEN.STR4, [this.plunderNumber, maxNumber])
        btn_go.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    // if (this.otherGuId == "0") {
                    //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyHaven, 0, null)
                    // }else{
                    //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyHaven, 0,  { changeHaven: args.targetHavenResource })
                    // }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenResInfo, 0, null)
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,goProtoNmae, goArgs)
        });
      
        
        btn_goBack.onClick(()=>{
            if (this.resData.data.isSpecialResource == 1) {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_THREE, "", 
                StrVal.LYHAVEN.STR56, null, 
                StrVal.COMMON.STR32, null, 
                StrVal.COMMON.STR33, ()=>{
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyHaven, 0, null)
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenResInfo, 0, null)
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,gobackProtoNmae, goBackArgs)
                }, 
                "", null);
            }else{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyHaven, 0, null)
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenResInfo, 0, null)
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,gobackProtoNmae, goBackArgs)
            }
        });
        
    }

    private getTime(): number{
        this.win1.visible = false
        this.win_Me.visible = false
        //最终时间除算
        let fl3 = 0
        let lastLc = 0
        let acqXml = null
        let staminaConsumed = 0
        let trainLevel = 0
        let totalMouse = 0
        let selfHavenData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN).data.activityHaven      
        let extStaminaAdd = 0

        //福地拥有者获胜
        let havenOwnWin = false
        // let 
        if (this.otherGuId != "0") {
            //otherHaven
            acqXml = LocaleData.getHavenAcquisition(this.resData.data.defender.mouseAmount, this.plunderNumber)
            fl3 = Number(acqXml.timeRatio) / 100
            if (acqXml.winer == "1") {
                //other win
                lastLc = Math.floor(Number(this.resData.data.route))
                staminaConsumed = this.resData.data.defender.staminaConsumed
                trainLevel = this.resData.data.defender.trainLevel
                totalMouse = this.resData.data.defender.totalMouse
                this.win1.visible = true
                extStaminaAdd = this.resData.data.defender.extStaminaAdd
                havenOwnWin = true
            }else{
                //attact self win
                lastLc = Math.floor(Number(this.resData.resourceXml.route) - Number(this.resData.data.route))
                staminaConsumed = selfHavenData.staminaConsumed
                trainLevel = selfHavenData.trainLevel
                totalMouse = selfHavenData.totalMouse
                this.win_Me.visible = true
                extStaminaAdd = selfHavenData.extStaminaAdd
            }
        }else {
            //selfHaven
            lastLc = Math.floor(Number(this.resData.data.route))
            acqXml = LocaleData.getHavenAcquisition(this.plunderNumber, this.resData.data.attacker.mouseAmount)
            fl3 = Number(acqXml.timeRatio) / 100
            if (acqXml.winer == "2") {
                //other win
                lastLc = Math.floor(Number(this.resData.resourceXml.route) - Number(this.resData.data.route))
                staminaConsumed = this.resData.data.attacker.staminaConsumed
                trainLevel = this.resData.data.attacker.trainLevel
                totalMouse = this.resData.data.attacker.totalMouse
                this.win1.visible = true
                extStaminaAdd = this.resData.data.attacker.extStaminaAdd
            }else{
                //self win
                lastLc = Math.floor(Number(this.resData.data.route))
                staminaConsumed = selfHavenData.staminaConsumed
                trainLevel = selfHavenData.trainLevel
                totalMouse = selfHavenData.totalMouse
                this.win_Me.visible = true
                extStaminaAdd = selfHavenData.extStaminaAdd
                havenOwnWin = true
            }
        }
        if (fl3 == 0) {
            fl3 = 1
        }

       
     

        //体力倍率
        let bl1 = Number(LocaleData.getHavenWorker(staminaConsumed, extStaminaAdd).effi)  / 100
        //训练等级 倍率 或者 老鼠个数倍率
        let bl2 = 1
        if (havenOwnWin) {
            if (trainLevel > 0) {
                bl2 = Number(LocaleData.getHavenTrain(trainLevel).speedUp)  / 100
            }else{
                let hireNumber = 0
                if (totalMouse == Number(this.xmlRoot.initialAmount)) {
                    hireNumber = totalMouse
                }else {
                    hireNumber = totalMouse - Number(this.xmlRoot.initialAmount)
                }
                bl2 = Number(LocaleData.getHavenHire(hireNumber).speedUp)  / 100
            }
        }


        //  //测试代码
        //  let allStamina = 0
        //  let allWoakerData = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)._worker[0]._item
        //  for (let index = 0; index < allWoakerData.length; index++) {
        //      const element = allWoakerData[index];
        //      let add = 0
        //      if (index == 0) {
        //          add = extStaminaAdd
        //      }else {
                 
        //      }
        //      allStamina = allStamina + Number(element.stamina) + add
        //  }
        //  let str = "胜利方体力: " +  (allStamina - staminaConsumed) +"\n" + "体力倍率: " +  bl1  +"\n" + "胜利方训练等级: " +  trainLevel + "\n" + "胜利方老鼠速度: " +  totalMouse + "\n" + "胜利方仙友加成: " +  extStaminaAdd + "\n" + "路程: " +  lastLc
        //  this.uiPanel.getChild("n58").text = str
        //DDDDDD
         
        return Math.ceil((lastLc / (Number(this.xmlRoot.velocity) * bl1 * bl2 / fl3)))
    }
 

    public getIsViewMask(): boolean {
        return false;
    };
}


