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
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { VarVal } from "../Values/VarVal";
import { LyItemCraft } from "./LyItemCraft";
import { LyBagRandom } from "./LyBagRandom";
import { LyBagChoose } from "./LyBagChoose";
import { LySettingMsgBox } from "./LySettingMsgBox";
import { PointRedData } from "../Kernel/PointRedData";
import { AudioManager } from "../Kernel/AudioManager";

export class LyBackPack extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyBackPack";
        this.viewResI.pkgName = "LyBackPack";
        this.viewResI.comName = "LyBackPack";
    }

    private list_item: fgui.GList

    private con_page: fgui.Controller
    private uiPanel:fgui.GComponent

    private itemMerges: any
    private items: any

    private onClickNumner = 0
    public onViewCreate(_params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        this.uiPanel = this.getUiPanel()
        this.con_page = this.uiPanel.getController("c1")
        this.list_item = this.uiPanel.getChild("list_item")
        let btn_close = this.uiPanel.getChild("btn_close")
        let label_title = this.uiPanel.getChild("label_title")
        label_title.text = StrVal.LYBACKPACK.STR1
        btn_close.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBackPack, 0, null)
        })
        this.uiPanel.getChild("btn_mask", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBackPack, 0, null)
        });
        this.getItems()
        this.list_item.itemProvider = (index: number): string=>{
            return "ui://CCommon/GroupItem"
        }
        this.list_item.setVirtual()
        let btn_craft: fgui.GButton = this.uiPanel.getChild("btn_craft")
        btn_craft.onClick(()=>{
            this.refeshPage();
        })
        let btn_property: fgui.GButton = this.uiPanel.getChild("btn_property")
        btn_property.onClick(()=>{
            this.refeshPage();
        })
        this.refeshPage();
    }

    private getItems() {
        this.items = GameServerData.getInstance().getItems()
        this.items.sort((a, b): number=>{
            let aProto = LocaleData.getItemProto(a.protoId)
            let bProto = LocaleData.getItemProto(b.protoId)
            if (aProto.quality == bProto.quality) {
                let canUseA = Number(aProto.canUse) 
                let canUseB = Number(bProto.canUse) 
                if (canUseA == canUseB) {
                    return Number(a.protoId) - Number(b.protoId) 
                }else{
                    return canUseB - canUseA
                }
            }else {
                return Number(bProto.quality) - Number(aProto.quality)
            }
        })
        this.itemMerges = LocaleData.getAllItemMerge()
    }

    private refeshPage(){
        this.list_item.itemRenderer = ((index: number, child: fgui.GComponent)=>{
            let bonuseItem:BonuseItem 
            let callBack: any
            if (this.con_page.selectedIndex == 0) {
                let itemData = LocaleData.getItemProto(this.items[index].protoId)
                bonuseItem = {
                    type: VarVal.bonusType.item, 
                    proto:itemData, 
                    count: this.items[index].count,
                    name: "",
                    desc: ""
                }
                // callBack = () =>{
                //     let mGCom :fgui.GComponent = fgui.UIPackage.createObject("CCommon", "Group_Item").asCom
                //     let label_name: fgui.GTextField =  mGCom.getChild("label_name")
                //     label_name.text = itemData.name
                //     label_name.strokeColor = UtilsUI.getQualityColor(itemData.quality);
                //     mGCom.getChild("label_dec1").text = itemData.useDesc
                //     let loader_item: fgui.GLoader = mGCom.getChild("loader_item")
                //     loader_item.url = UtilsTool.stringFormat("ui://CCommon/", [itemData.icon])
                //     let Loader_qu: fgui.GLoader = mGCom.getChild("Loader_qu")
                //     Loader_qu.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}_title", [itemData.quality])
                //     mGCom.getChild("label_count").text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR2, [this.items[index].count]) 
                //     fgui.GRoot.inst.showPopup(mGCom, child, false)
                // }
                let callBack: Function = null
                if (bonuseItem.proto && bonuseItem.proto.canUse == "1") {
                    PointRedData.getInstance().updateManualPoint(child, true);
                    callBack = ()=>{
                        this.onClickNumner = index
                        if (bonuseItem.proto.subType == VarVal.itemtype.randomChest) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBagRandom, 0, {itemInst: this.items[index], bonuseItem: bonuseItem})
                        }else if(bonuseItem.proto.subType == VarVal.itemtype.chooseChest){
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBagChoose, 0, {itemInst: this.items[index], bonuseItem: bonuseItem})
                        }else if(bonuseItem.proto.subType == VarVal.itemtype.rename){
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LySettingMsgBox, 0, { type: 1 });
                        }
                    }
                }else {
                    PointRedData.getInstance().updateManualPoint(child, false);
                }
                UtilsUI.setUIGroupItem(bonuseItem, child, callBack)
            }else {
                let mergesData = this.itemMerges[index]
                let itemProto = LocaleData.getProto(mergesData.mergeItemId)
                let count = 0
                
                bonuseItem = {
                    type: VarVal.bonusType.item,
                    proto: itemProto,
                    count: "0",
                    name: "",
                    desc: ""
                };
                if (bonuseItem.type == VarVal.bonusType.item) {
                    //神通
                    if (LocaleData.isTheurgy(bonuseItem.proto.id)) {
                        count = GameServerData.getInstance().getTheurgyByProto(bonuseItem.proto.id).frag
                    }else if(LocaleData.isEliteMonsterDebris(bonuseItem.proto.id)){
                        let debrisInst = GameServerData.getInstance().getEliteMonsterDebByProtoId(bonuseItem.proto.id);
                        if (debrisInst) {
                            count = debrisInst.count
                        }else{
                            count = 0
                        }
                    }
                    else{
                        count = GameServerData.getInstance().getItemCountByProtoId(bonuseItem.proto.id);
                    }
                } else {
                    count = GameServerData.getInstance().getValueTypeCount(bonuseItem.type);
                }
                bonuseItem.count = String(count)
                callBack = ()=>{
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyItemCraft, 0, { mergesData: mergesData})
                }
                UtilsUI.setUIGroupItem(bonuseItem, child, ()=> {
                    callBack()
                })
            }
            
        }).bind(this)
        this.list_item.numItems = 0
        if (this.con_page.selectedIndex == 0) {
            this.list_item.numItems = this.items.length
            if (this.onClickNumner <= this.list_item.numItems && this.onClickNumner !=0 ) {
                this.list_item.scrollToView(this.onClickNumner, false, true)
            }
        }else{
            this.list_item.numItems = this.itemMerges.length
        }
    }
    public getIsViewMask(): boolean {
        return false;
    };

    public onViewShowFront(): void {
        this.getItems()
        this.refeshPage()
    }
}


