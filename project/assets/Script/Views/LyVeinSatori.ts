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
import { LyVein } from "./LyVein";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";

export class LyVeinSatori extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyVein";
        this.viewResI.pkgName = "LyVein";
        this.viewResI.comName = "LyVeinSatori";
    }
    private playInfo
    private uiPanel:fgui.GComponent
    private label_nowLearn: fgui.GLabel
    private list_gl: fgui.GList
    private btn_jian: fgui.GButton
    private btn_add: fgui.GButton
    private btn_use: fgui.GButton
    private loader_spine: fgui.GLoader3D
    // private label_needItemCount: fgui.GLabel
    private label_useNumber: fgui.GLabel
    private pro_number: fgui.GSlider
    private group_needItem: fgui.GComponent
    private useItmeXml: any
    private useNumber = 0
    private itemNumber = 0
    private veinXmlRoot
    private veinQuas
    public onViewCreate(_params:any):void {
        this.getUiPanel().getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyVein, 0, { isRefresVein: true })
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyVeinSatori, 0, null)
        });
        this.uiPanel = this.getUiPanel().getChild("main");
        UtilsUI.playCommonGroupAni(this.uiPanel, null);
        let btn_close = this.uiPanel.getChild("btn_close")
        let label_title = this.uiPanel.getChild("label_title")
        let loader_item: fgui.GComponent = this.uiPanel.getChild("loader_item")
        let label_itemName: fgui.GLabel = this.uiPanel.getChild("label_itemName")
        let label_itemDes: fgui.GLabel = this.uiPanel.getChild("label_itemDes")
        this.label_nowLearn = this.uiPanel.getChild("label_nowLearn")
        this.list_gl = this.uiPanel.getChild("list_gl")
        this.group_needItem = this.uiPanel.getChild("group_needItem")
        // this.label_needItemCount = group_needItem.getChild("label_number")
        // let loader_item2: fgui.GLoader = group_needItem.getChild("loader_item")
        this.btn_jian = this.uiPanel.getChild("btn_jian")
        this.btn_add = this.uiPanel.getChild("btn_add")
        this.btn_use = this.uiPanel.getChild("btn_use")
        this.btn_use.text = StrVal.LYVEIN.STR16
        this.pro_number = this.uiPanel.getChild("pro_number")
        this.label_useNumber = this.uiPanel.getChild("label_useNumber")
        this.uiPanel.getChild("n5", fgui.GLabel).text = StrVal.LYVEIN.STR13
        this.uiPanel.getChild("n4", fgui.GLabel).text = StrVal.LYVEIN.STR15
        this.loader_spine = this.uiPanel.getChild("loader_spine")
        this.veinXmlRoot = LocaleData.getVeinRoot()

        this.useItmeXml = LocaleData.getItemProto(this.veinXmlRoot.learnItemId)
        label_title.text = StrVal.LYVEIN.STR12
        UtilsUI.setUIGroupItem({
            type: VarVal.bonusType.item,
            proto: this.useItmeXml,
            count: "0",
            name: "",
            desc: "",
        }, loader_item, null)
        // loader_item.url = UtilsTool.stringFormat("ui://CCommon/{0}", [this.useItmeXml.icon])
        label_itemName.text = this.useItmeXml.name
        label_itemDes.text = this.useItmeXml.desc

        btn_close.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyVein, 0, { isRefresVein: true })
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyVeinSatori, 0, null)
        })

        this.btn_jian.onClick(()=>{
            if (this.pro_number.value > 0) 
            {
                this.pro_number.value = this.pro_number.value - 1
                vauleChange()
            }
        })
        this.btn_add.onClick(()=>{
            let max = 0
            if (this.itemNumber == 0) {
                max = 1
            }else {
                max = this.itemNumber
            }
            if (this.useNumber < max) 
            {
                this.pro_number.value = this.pro_number.value + 1
                vauleChange()
            }
        })
    
        this.btn_use.onClick(()=>{
            if (this.useNumber > this.itemNumber) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.veinXmlRoot.learnItemId, "1"), buyCall:() => {
                   
                }});             
            }else{
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        let spinePlayer2 = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                            spp.playAnimation("xiazhen", false, 0,null, ()=>{
                                this.loader_spine.freeSpine()
                            });
                        }, this.loader_spine, "jm_xiuxing_shengji")
                      this.useNumber = 0
                      this.loadInfoData()
                      this.refreshNeedItemCount()
                      vauleChange()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } , "veinLearn", { count: this.useNumber})
            }
        })
        this.loadInfoData()
        PointRedData.getInstance().registerPoint(this.btn_use, PointRedType.LyVeinSatori)

        this.veinQuas = LocaleData.getVeinQua()
        this.list_gl.itemProvider = ():string =>{
            return "ui://LyVein/group_chance"
        }
        this.refreshNeedItemCount()
        
        let vauleChange: Function = ()=>{
            if (this.pro_number.value == 0) {
                this.useNumber = 1
                this.pro_number.value = 1
            }else{
                this.useNumber = this.pro_number.value
            }
            this.btn_add.enabled = this.pro_number.value != this.pro_number.max
            this.btn_jian.enabled = this.pro_number.value != 0
            UtilsUI.setNeedItemGroup(this.group_needItem, UtilsTool.stringFormat("ui://CCommon/{0}", [this.useItmeXml.icon]), this.itemNumber, this.useNumber)
            this.label_useNumber.text = UtilsTool.stringFormat(StrVal.LYVEIN.STR14, [this.useNumber]) 
            this.refreshNeedItemCount()
        }
        this.pro_number.on(fgui.Event.STATUS_CHANGED, vauleChange, this)
        vauleChange()
    }

    private loadInfoData(){
        this.playInfo = GameServerData.getInstance().getPlayerFullInfo()
        this.itemNumber = GameServerData.getInstance().getItemCountByProtoId(this.veinXmlRoot.learnItemId)
        if (this.itemNumber == 0) {
            this.pro_number.max = 1
            this.useNumber = 1
            this.pro_number.enabled = false
            this.btn_add.enabled = false
            this.btn_jian.enabled = false
        }else{
            this.pro_number.max = this.itemNumber
            this.useNumber = this.itemNumber
            this.pro_number.enabled = true
            this.btn_add.enabled = true
            this.btn_jian.enabled = true
        }
        this.pro_number.value = this.useNumber
    }
    private refreshNeedItemCount(): void{
        let showLevel = this.playInfo.veinInfo.learnLevel + this.useNumber
        this.label_nowLearn.text = this.playInfo.veinInfo.learnLevel
        let quaData = LocaleData.getVeinQua()
        let nowQuaArr = this.getQua(this.playInfo.veinInfo.learnLevel)
        let nextQuaArr = this.getQua(showLevel)
        this.list_gl.itemRenderer = ((index: number, obj: fgui.GComponent)=>{
            let loader_color: fgui.GLoader = obj.getChild("loader_bg")
            let label_now: fgui.GTextField =  obj.getChild("label_now")
            let img_up: fgui.GImage = obj.getChild("img_up")
            let img_down: fgui.GImage = obj.getChild("img_down")
            let label_next : fgui.GLabel = obj.getChild("next")
            let group_arrow: fgui.GGroup = obj.getChild("group_arrow")
            label_now.strokeColor = UtilsUI.getQualityColor(index + 1)
            loader_color.url = UtilsTool.stringFormat("ui://CCommon/frame_gailvdi{0}", [index + 1]);
            let nowNumber = Number(((nowQuaArr[index])/10000000).toFixed(2)) 
            let nextNumber = Number(((nextQuaArr[index])/10000000).toFixed(2)) 
            if (index == nowQuaArr.length) {
                nowNumber = 0
                nextNumber = 0
            }
            img_up.visible = false
            img_down.visible = false
            group_arrow.visible = true
            label_next.visible = true
            if (nowNumber == nextNumber) {
                group_arrow.visible = false
                label_next.visible = false
            }else if(nextNumber > nowNumber) {
                img_up.visible = true
            }else{
                img_down.visible = true
            }
            let now = UtilsTool.stringFormat("{0}%", [nowNumber])
            let next = UtilsTool.stringFormat("{0}%", [nextNumber]) 
            label_now.text = String(now)
            label_next.text = String(next)
        }).bind(this)
        this.list_gl.numItems = quaData.length
    }

    // private getQua(index , quaIndexs, weights) {
    //     index = String(index)
    //     let all = 0
    //     for (let j = 0; j < weights.length; j++) {
    //         all += Number(weights[j]) 
    //     }
    //     for (let i = 0; i < quaIndexs.length; i++) {
    //        if (index == quaIndexs[i]) {
    //             return Number(weights[i]) / all
    //        }
    //     }
    //     return 0
    // }

    private getQua(learnLevel: number): Array<number>{
        let items: Array<any> =  LocaleData.getVeinRoot()._learn[0]._item;
        let nowqjIndex = 0
        for (let index = 1; index < items.length; index++) {
            let item = items[index];
            if (Number(item.levelLower) <= learnLevel && Number(item.levelUpper) >= learnLevel) {
                nowqjIndex = index
                break
            }
        }
        //初始概率
        let quaArr = items[0].change.split(",")
        let pushQuaArr: Array<number> = []
        for (let index = 0; index < quaArr.length; index++) {
            pushQuaArr.push(Number(quaArr[index]));
        }
        for (let index = 1; index <= nowqjIndex; index++) {
            let item = items[index];
            let qua = item.change.split(",")
            for (let index2 = 0; index2 < pushQuaArr.length; index2++) {
                let bl = 0
                if (learnLevel > Number(item.levelUpper)) {
                    bl = Number(item.levelUpper) - Number(item.levelLower) + 1
                }else {
                    bl = learnLevel - Number(item.levelLower)
                }
                pushQuaArr[index2] = pushQuaArr[index2] + (Number(qua[index2]) * bl)
            }
        }
        return pushQuaArr
    }
    public getIsViewMask(): boolean {
        return false;
    };

    public static learnNumber(): boolean{
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.gem)) {
            return false
        }
        let veinXmlRoot = LocaleData.getVeinRoot()
        return  GameServerData.getInstance().getItemCountByProtoId(veinXmlRoot.learnItemId) > 0
    }
}


