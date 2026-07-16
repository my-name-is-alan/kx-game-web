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
import { LyTheurgyInfo } from "./LyTheurgyInfo";

export class LyTheurgySeal extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyTheurgy";
        this.viewResI.pkgName = "LyTheurgy";
        this.viewResI.comName = "LyTheurgySeal";
    }
    private theurgyInst: any
    private pos: number
    private typeSeals: any[]
    private showAllSeal: any[]
    private chooseSeal: any

    private uiPanel:fgui.GComponent
    private btn_xiexia: fgui.GButton
    private btn_zhuangbei: fgui.GButton
    private btn_merge: fgui.GButton
    private list_all: fgui.GList
    private seal1: fgui.GComponent
    private seal2: fgui.GComponent
    private img_noSeal: fgui.GGroup
    public onViewCreate(_params:any):void {
        this.theurgyInst = _params.theurgyInst
        this.pos = _params.pos
        this.getUiPanel().getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgySeal, 0, null)
        });
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)

        let btn_close = this.uiPanel.getChild("btn_close");
        let label_title = this.uiPanel.getChild("label_title")
        label_title.text = StrVal.LYTHEURGY.STR19;
        (<fgui.GLabel>this.uiPanel.getChild("n42")).text = StrVal.LYTHEURGY.STR15;
        (<fgui.GLabel>this.uiPanel.getChild("n43")).text = StrVal.LYTHEURGY.STR16;
        btn_close.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgySeal, 0, null)
        })
        this.seal1 = this.uiPanel.getChild("seal1");
        this.seal2 = this.uiPanel.getChild("seal2");
        this.seal2.getChild("label_lock").text = StrVal.LYTHEURGY.STR43
        this.seal2.getChild("group_lock").visible = true
        this.btn_xiexia = this.uiPanel.getChild("btn_xiexia");
        this.btn_xiexia.text = StrVal.LYTHEURGY.STR17;
        this.btn_zhuangbei = this.uiPanel.getChild("btn_zhuangbei")
        this.btn_zhuangbei.text = StrVal.LYTHEURGY.STR18;
        this.btn_merge = this.uiPanel.getChild("btn_merge")
        this.btn_merge.text = StrVal.LYTHEURGY.STR20;
        this.img_noSeal = this.uiPanel.getChild("img_noHave")
        this.list_all = this.uiPanel.getChild("list_all")
        this.list_all.itemProvider = (index: Number):string=> { 
            return "ui://LyTheurgy/group_seal"
        }
        this.list_all.itemRenderer = (index: number, child: fgui.GComponent)=> { 
            let sealInst = this.showAllSeal[index];
            this.setGroupSeal(child, sealInst, false);
            child.clearClick()
            child.onClick(()=>{
                this.chooseSeal = sealInst
                this.btn_zhuangbei.visible = true
                this.setGroupSeal(this.seal2, sealInst, true);
                this.seal2.getChild("group_lock").visible = false
                this.btn_zhuangbei.visible = true
            });
        }
        
        this.btn_xiexia.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.theurgyInst = args.theurgy
                    this.loadData()
                    this.refreshPage()
                    UtilsUI.showMsgTip(StrVal.LYTHEURGY.STR51)
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } , "theurgyDetachSeal", { theurgyId:this.theurgyInst.cfgId, slot: this.pos + 1})
        })
        this.btn_zhuangbei.visible = false
        this.btn_zhuangbei.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.theurgyInst = args.theurgy
                    this.btn_zhuangbei.visible = false
                    this.setGroupSeal(this.seal2, null, true);
                    this.seal2.getChild("group_lock").visible = true
                    this.loadData()
                    this.refreshPage()
                    UtilsUI.showMsgTip(StrVal.LYTHEURGY.STR48)
                } else {
                    this.btn_zhuangbei.visible = false
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } , "theurgyAttachSeal", { theurgyId:this.theurgyInst.cfgId, sealId: this.chooseSeal.protoId, slot: this.pos + 1})
        })

        this.btn_merge.onClick(()=>{
            if (this.showAllSeal.length > 0) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        if (args.itemInserts.length != 0) {
                            this.loadData()
                            this.setGroupSeal(this.seal2, null, true);
                            this.seal2.getChild("group_lock").visible = true
                            let mGCom :fgui.GComponent = fgui.UIPackage.createObject("LyTheurgy", "group_getSeal").asCom;
                            (<fgui.GButton>mGCom.getChild("btn_back")).onClick(()=>{
                                mGCom.dispose()
                                this.refreshPage()
                            })
                            mGCom.getChild("label_title", fgui.GLabel).text = StrVal.LYTHEURGY.STR39
                            mGCom.getChild("n42", fgui.GLabel).text = StrVal.LYTHEURGY.STR40
                            mGCom.getChild("n44", fgui.GLabel).text = StrVal.LYTHEURGY.STR41
                            let list_all: fgui.GList = mGCom.getChild("list_all")
                            let items: Array<any> = LocaleData.getTheurgyRoot()._quality[0]._item;
                            let all = 0
                            for (let index = 0; index < items.length; index++) {
                                let element = items[index];
                                all = all + Number(element.weight) 
                            }
                            list_all.itemRenderer = (index: number, child:fgui.GComponent)=>{
                                let sealInst = this.showAllSeal[index];
                                this.setGroupSeal(child, sealInst, false);
                                child.clearClick()
                                child.onClick(()=>{
                                    this.chooseSeal = sealInst
                                    this.btn_zhuangbei.visible = true
                                    this.setGroupSeal(this.seal2, sealInst, true);
                                });
                            };
                            list_all.numItems = this.showAllSeal.length
                            mGCom.setSize(this.getUiPanel().width, this.getUiPanel().height);
                            this.getUiPanel().addChild(mGCom)
                            this.list_all.numItems = this.showAllSeal.length
                        }else{
                            UtilsUI.showMsgTip(StrVal.LYTHEURGY.STR52)
                        }
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } , "mergeSealByType", { theurgyType: this.theurgyInst.type }) 
            }else{
                UtilsUI.showMsgTip(StrVal.LYTHEURGY.STR47)
            }
        })

        this.loadData()
        this.refreshPage()
    }

    private loadData(){
        this.typeSeals = []
        this.showAllSeal = []
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let allSeal =  fullInfo.theurgyInfo.theurgySeal
        let sealattr = LocaleData.getTheurgTypeById(this.theurgyInst.type).attr.split(",")
        for (let j = 0; j < allSeal.length; j++) {
            for (let i = 0; i < sealattr.length; i++) {
                if (allSeal[j].proto.sealAttr == sealattr[i]) {
                    if (!allSeal[j].placeCount) {
                        this.typeSeals.push(allSeal[j])
                        break
                    }
                    else if(allSeal[j].placeCount > 0){
                        this.typeSeals.push(allSeal[j])
                        this.showAllSeal.push(allSeal[j])
                        break
                    }
                }
            }
        }
        this.showAllSeal.sort((a, b): number=>{
            let aproto = a.proto
            let bproto = b.proto
            let aLevel = Number(aproto.level)
            let bLevel = Number(bproto.level)
            if (aLevel == bLevel) {
                return Number(aproto.itemId) - Number(bproto.itemId)
            }else{
                return bLevel - aLevel
            }
        })
    }

    

    private setGroupSeal(com:fgui. GComponent, sealInst: any, showdesc: boolean){
        let loader_icon: fgui.GLoader = com.getChild("loader_icon");
        let label_name: fgui.GLabel = com.getChild("label_name");
        let label_count: fgui.GLabel = com.getChild("label_count");
        let label_buff: fgui.GLabel = com.getChild("label_buff");
        let loader_dikuang: fgui.GLoader = com.getChild("loader_dikuang")
        if (sealInst) {
            let sealProto = LocaleData.getTheurgSealByItemId(sealInst.protoId);
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [sealProto.icon]);
            if (!sealInst.placeCount) {
                label_count.visible = false
            }else{
                label_count.visible = true
                label_count.text = sealInst.placeCount
            }
            if (showdesc) {
                label_buff.text = sealProto.desc
            }else{
                label_buff.text = ""
                label_name.text = sealProto.name;
            }
            loader_dikuang.url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [ Number(sealProto.quality) + 1]);
        }else{
            loader_icon.url = "ui://LyTheurgy/btn_add"
            label_name.text = ""
            label_count.text = ""
            label_buff.text = ""
            loader_dikuang.url = "ui://LyTheurgy/frame_prop add box"
        }
    }

    private findInstByProtoId(protoId: number| string) :any{
        protoId = Number(protoId)
        for (let index = 0; index < this.typeSeals.length; index++) {
            const element = this.typeSeals[index];
            if (element.protoId == protoId) {
                return element
            }
        }
    }

    private refreshPage(){
        if (this.theurgyInst.seal[this.pos] && this.theurgyInst.seal[this.pos] != 0){
            this.setGroupSeal(this.seal1 , this.findInstByProtoId(this.theurgyInst.seal[this.pos]), true)
            this.btn_xiexia.visible = true
        }else{
            this.setGroupSeal(this.seal1 , null, true)
            this.btn_xiexia.visible = false
        }
        this.list_all.numItems = this.showAllSeal.length
        this.img_noSeal.visible = this.showAllSeal.length == 0
    }

    public getIsViewMask(): boolean {
        return false;
    };

    public onViewDestroy(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyTheurgyInfo, 0, {theurgyInst:this.theurgyInst})
    }
}


