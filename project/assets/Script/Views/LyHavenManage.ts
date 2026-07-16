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
import { Color } from "cc";
import { LyHavenFind } from "./LyHavenFind";
import { LyHaven } from "./LyHaven";

export class LyHavenManage extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyHaven";
        this.viewResI.pkgName = "LyHaven";
        this.viewResI.comName = "LyHavenManage";
    }
    public static isSkipPlayAni: boolean
    private xmlRoot: any
    private activityState: any
    private havenData: any
    private resourceData: any
    private collectingInProgress: any
    private list_funs : Array<Function> = []
    private uiPanel:fgui.GComponent
    private pro_tili:fgui.GProgressBar
    private list_all:fgui.GList;
    private label_free: fgui.GLabel;
    private label_all: fgui.GButton;
    private label_number: fgui.GTextField;
    private loader_item: fgui.GLoader;
    private img_no: fgui.GImage

    public onViewCreate(_params:any):void {
        this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenManage, 0, null)
        });
        this.uiPanel = this.getUiPanel().getChild("mian");
        this.pro_tili = this.uiPanel.getChild("pro_tili");
        this.list_all = this.uiPanel.getChild("list_all");
        this.label_free = this.uiPanel.getChild("label_free");
        this.label_all = this.uiPanel.getChild("label_all");
        this.label_number = this.uiPanel.getChild("label_number");
        this.loader_item = this.uiPanel.getChild("loader_item");
        this.img_no = this.uiPanel.getChild("img_no")
        this.uiPanel.getChild("n55", fgui.GLabel).text = StrVal.LYHAVEN.STR34;
        if (LyHavenManage.isSkipPlayAni) {
            LyHavenManage.isSkipPlayAni = false
        }else{
            UtilsUI.playCommonGroupAni(this.uiPanel, null);
        }
        (this.uiPanel.getChild("btn_close") as fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenManage, 0, null)
        });

        (this.uiPanel.getChild("n21") as fgui.GLabel).text = StrVal.LYHAVEN.STR7;

        this.uiPanel.getChild("btn_find", fgui.GButton).onClick(()=>{
            let str: Array<any> = []
            let temp1 = this.havenData.randomPlayers.split(";") 
            for (let index = 0; index < temp1.length ; index++) {
                if (temp1[index]!= '') {
                    str.push(temp1[index]);
                }
            } 
            let temp2 = this.havenData.specialPlayers.split(";")
            for (let index = 0; index < temp2.length ; index++) {
                if (temp2[index]!= '') {
                    str.push(temp2[index]);
                }
            } 
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyHavenFind, 0, {data: args.getHavenResourceArr})
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenManage, 0, null)
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"getHavenResourceByPlayerId", { targetPlayerIdArr: str });
        });

        this.uiPanel.getChild("btn_gy", fgui.GLoader).onClick(()=>{
            let lastNumber = this.havenData.totalMouse
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    let maxMou = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)._hire[0]._item.length + Number(this.xmlRoot.initialAmount)
                    if (lastNumber < maxMou) {
                        UtilsUI.showMsgTip(StrVal.LYHAVEN.STR32)
                    }else {
                        UtilsUI.showMsgTip(StrVal.LYHAVEN.STR33)
                    }
                    this.freshUI()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"hireAndTrainMouse", null);
        });
    
        this.list_all.itemProvider = (index: number): string=>{
            return "ui://LyHaven/group_my"
        }
        let selfGuid = GameServerData.getInstance().getPlayerFullInfo().base.guid
        this.list_all.itemRenderer = (index: number, child:fgui.GComponent) => {
            let proData = this.collectingInProgress[index]
            let winleft = child.getChild("winleft", fgui.GImage)
            let winright = child.getChild("winright", fgui.GImage) 
            let img_other = child.getChild("img_other", fgui.GImage)
            let group_item = child.getChild("group_item", fgui.GComponent);
            let label_time = child.getChild("label_time", fgui.GTextField);
            let label_name = child.getChild("label_name", fgui.GTextField);
            let group_other = child.getChild("group_other", fgui.GGroup)
            let label_other = child.getChild("label_other", fgui.GLabel)
            let label_me = child.getChild("label_me", fgui.GLabel)
            winleft.visible = false
            winright.visible = false
            let sceText 
            let resourceXml 
            let bonuseItem : BonuseItem;
            if (proData.itemId != 0) {
                resourceXml = LocaleData.getHavenItem(proData.itemId);
            }
            if (resourceXml.itemId.length > 1) {
                bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, resourceXml.itemId, UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [resourceXml.level]))
            }else if(resourceXml.itemId.length > 0) {
                bonuseItem = UtilsUI.getBonuseItem(resourceXml.itemId, null, null, UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR22, [resourceXml.level]))
            }
            UtilsUI.setUIGroupItem(bonuseItem, group_item, null);

            let btn_go: fgui.GButton = child.getChild("btn_go")
            btn_go.text = StrVal.LYHAVEN.STR17
            btn_go.clearClick()
            btn_go.onClick(()=>{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyHaven, 0, { otherHaven : args.getHavenResourceArr[0]})
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyHavenManage, 0, null)
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"getHavenResourceByPlayerId", { targetPlayerIdArr: [proData.targetPlayerId]  });
            });
            let btn_summon: fgui.GButton = child.getChild("btn_summon")
            btn_summon.text = StrVal.LYHAVEN.STR12
            btn_summon.clearClick()
            btn_summon.onClick(()=>{
                let selfPlayerId = GameServerData.getInstance().getPlayerFullInfo().base.guid
                let gobackProtoNmae = ""
                let playerId = ""
                let args = {}
                if (proData.targetPlayerId == selfPlayerId) {
                    gobackProtoNmae = "gatheringRecall"
                    playerId = selfPlayerId
                    args["id"] = proData.resourceId
                    args["mouseCount"] = proData.mouseCount
                }else{
                    gobackProtoNmae = "plunderingRecall"
                    playerId = selfPlayerId
                    args["id"] = proData.resourceId
                    args["mouseCount"] = proData.mouseCount
                    args["targetPlayerId"] = proData.targetPlayerId
                }
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                    StrVal.LYHAVEN.STR53, null,
                    StrVal.COMMON.STR32, null,
                    StrVal.COMMON.STR33, (isCheckSel: boolean) => {
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        } , gobackProtoNmae, args )
                }, "", null, null)

                
            });
            //有竞争对手
            if (proData.playerName) {
                group_other.visible = true
                if (selfGuid == proData.targetPlayerId) { //自家福地
                    btn_go.visible = false
                    if (proData.winner == 1) {  //自己防守方获胜
                        winright.visible = true
                        sceText = label_time
                        
                    }else {
                        winleft.visible = true
                        label_time.text = ""
                        label_name.color = new Color(214, 51, 38)
                        sceText = label_name
                        // label_other.m
                    }
                }else{ //别人家福地
                    btn_go.visible = true
                    if (proData.winner == 1) {
                        winleft.visible = true
                        label_time.text = ""
                        label_name.color = new Color(214, 51, 38)
                        sceText = label_name
                    }else {  //自己防守方获胜
                        winright.visible = true
                        sceText = label_time
                    }
                }
                label_name.text = proData.playerName
            }else{ //无竞争对手
                group_other.visible = false
                winright.visible = true
                label_name.text = StrVal.LYHAVEN.STR22
                label_name.color = new Color(127 , 108, 81)
                sceText = label_time
            }
            label_other.text = proData.targetMouseCount
            label_me.text = proData.mouseCount
            let lastTimeNumer =  proData.route / Number(proData.velocity) 
            sceText.text =  UtilsTool.stringFormat(StrVal.LYHAVEN.STR19, [UtilsTool.splitTimeString(lastTimeNumer)]);
            let fun = ()=>{
                if (lastTimeNumer > 0) {
                    lastTimeNumer = lastTimeNumer - 1
                    sceText.text =  UtilsTool.stringFormat(StrVal.LYHAVEN.STR19, [UtilsTool.splitTimeString(lastTimeNumer)]);
                }else{
                    this. list_funs.splice(index, 1);
                }
            };
           this.list_funs.push(fun)
        }   
        
        this.LoadData();
        let allWoakerData = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)._worker[0]._item
        let nowPro = 0
        let allStamina = 0
        for (let index = 0; index < allWoakerData.length; index++) {
            const element = allWoakerData[index];
            let add = 0
            if (index == 0) {
                add = this.havenData.extStaminaAdd 
            }
            allStamina = allStamina + Number(element.stamina) + add
        }
        for (let index = 0; index < allWoakerData.length; index++) {
            const element = allWoakerData[index];
            let add = 0
            if (index == 0) {
                add = this.havenData.extStaminaAdd 
                nowPro = nowPro + Number(element.stamina) + add
            }else {
                nowPro = nowPro + Number(element.stamina) 
            }
            let img = this.uiPanel.getChild("img_pos" + (index + 1))
            img.x = this.pro_tili.x + (this.pro_tili.width * nowPro/allStamina) - img.width
        }
        this.pro_tili.max = allStamina
        console.log("体力" + (allStamina - this.havenData.staminaConsumed))
        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == VarVal.ACTIVITY_ID.HAVEN) {
                 this.LoadData();
                 this.freshUI();
            }
        }, "activityStateChanged");
        this.xmlRoot = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)
        this.freshUI();
        this.setInterval(()=>{
            for (let index = 0; index < this.list_funs.length; index++) {
               if (this.list_funs[index]) {
                   this.list_funs[index]()
                }
            }
        }, 1000);
    }

    private LoadData(){
        this.activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN)
        this.havenData = this.activityState.data.activityHaven
    }

    private freshUI(){
        this.label_free.text = UtilsTool.stringFormat(StrVal.LYHAVEN.STR8, [this.havenData.restMouse]);
        this.label_all.text =  UtilsTool.stringFormat(StrVal.LYHAVEN.STR9, [this.havenData.totalMouse]);
        (this.pro_tili.getChild("bar") as fgui.GGraph).color = this.getBarColor(LocaleData.getHavenWorker(this.havenData.staminaConsumed, this.havenData.extStaminaAdd).phase)
        this.pro_tili.value = this.pro_tili.max - this.havenData.staminaConsumed
        let maxMou = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)._hire[0]._item.length + Number(this.xmlRoot.initialAmount)
        let itemCount = 0;
        let needCount = 0;
        if (this.havenData.totalMouse < maxMou) {
            let hireXml  = LocaleData.getHavenHire(this.havenData.totalMouse)
            itemCount = GameServerData.getInstance().getItemCountByProtoId(hireXml.item);
            needCount = Number(hireXml.price)
            this.loader_item.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(hireXml.item).icon]) 
            this.uiPanel.getChild("n35").text = StrVal.LYHAVEN.STR10
        }else{
            let maxLevel = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)._train[0]._item.length 
            if (this.havenData.trainLevel == maxLevel) {
                
            }else{
                let trainXml = LocaleData.getHavenTrain(this.havenData.trainLevel + 1)
                itemCount = GameServerData.getInstance().getItemCountByProtoId(trainXml.item);
                needCount = Number(trainXml.price)
                this.loader_item.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(trainXml.item).icon]) 
                this.uiPanel.getChild("n35").text = StrVal.LYHAVEN.STR11
            }
        }
        this.label_number.color = UtilsUI.getEnoughColor(itemCount >= needCount);
        this.label_number.text = UtilsTool.stringFormat("{0}/{1}", [ itemCount, needCount]);

        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                this.list_funs = []
                this.collectingInProgress = args.collectingInProgress
                if (this.collectingInProgress) {
                    this.list_all.numItems = this.collectingInProgress.length
                    if (this.collectingInProgress.length == 0) {
                        this.img_no.visible = true
                    }else {
                        this.img_no.visible = false
                    }
                }
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        } ,"getHavencollectingInProgress", null);
    }
    
    private getBarColor(phase): Color {
        phase = String(phase)
        if (phase == 1) {
            return new Color(96, 172, 49);
        }else if(phase == 2){
            return new Color(228, 200, 102);
        }else if(phase == 3){
            return new Color(181, 129, 82);
        }else if(phase == 4){
            return new Color(137, 62, 62);
        }
    }

    public getIsViewMask(): boolean {
        return false;
    };
}


