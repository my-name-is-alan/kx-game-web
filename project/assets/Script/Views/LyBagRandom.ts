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
import { GameServer } from "../Kernel/GameServer";
import { LyPet } from "./LyPet";

export class LyBagRandom extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyBackPack";
        this.viewResI.pkgName = "LyBackPack";
        this.viewResI.comName = "LyBagRandom";
    }

    public onViewCreate(params:any): void {
        let bonuseItem = params.bonuseItem
        let itemInst = params.itemInst
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        let isItem = false
        // 关闭
        let btn_back: fgui.GButton = getUiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBagRandom, 0, null);
        })

        let Loader_qu: fgui.GLoader = group_main.getChild("Loader_qu");
        let label_name: fgui.GTextField = group_main.getChild("label_name");
        let label_dec1:fgui.GTextField = group_main.getChild("label_dec1");
        let loader_item: fgui.GLoader = group_main.getChild("loader_item");
        let label_count: fgui.GTextField = group_main.getChild("label_count");
        let label_haveNumber: fgui.GTextField = group_main.getChild("label_haveNumber");
        let btn_use: fgui.GButton = group_main.getChild("btn_use");
        let btn_add: fgui.GButton = group_main.getChild("btn_add");
        let btn_jianshao: fgui.GButton = group_main.getChild("btn_jianshao");
        let slider_use: fgui.GSlider = group_main.getChild("slider");
        let list_item: fgui.GList = group_main.getChild("list_item")
        let list_the: fgui.GList = group_main.getChild("list_the")
        slider_use.max = itemInst.count
        slider_use.value = 1
        let valueChage: Function = ()=>{
            label_haveNumber.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR6, [slider_use.value])
        }
        slider_use.on(fgui.Event.STATUS_CHANGED, valueChage);
        label_haveNumber.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR6, [slider_use.value])
        btn_add.onClick(()=>{
            if (slider_use.value < slider_use.max) {
                slider_use.value = slider_use.value + 1
                valueChage()
            }
        });
        btn_jianshao.onClick(()=>{
            if (slider_use.value > 1) {
                slider_use.value = slider_use.value - 1
                valueChage()
            }
        });
        Loader_qu.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}_title", [bonuseItem.proto.quality]);
        label_name.text = bonuseItem.proto.name;
        label_name.strokeColor = UtilsUI.getQualityColor(bonuseItem.proto.quality);
        label_dec1.text = bonuseItem.proto.desc;
        loader_item.url = UtilsTool.stringFormat("ui://CCommon/{0}", [bonuseItem.proto.icon]);
        label_count.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR2, [GameServerData.getInstance().getItemCountByProtoId(bonuseItem.proto.id)]);
        let showBounseItems = UtilsUI.getBonuseItemsByBonusesId(bonuseItem.proto.data)
        showBounseItems.sort((a, b): number=>{
            let quaA = 0
            let quaB = 0
            if (a.proto && a.proto.quality) {
                quaA = Number(a.proto.quality)
            }
            if (b.proto && b.proto.quality) {
                quaB = Number(b.proto.quality)
            }
            return quaB - quaA
        });
        //神通
        if (LocaleData.isTheurgy(showBounseItems[0].proto.id)) {
            isItem = false
            list_item.visible = false
            list_the.itemRenderer = (index:number, child:fgui.GComponent)=>{
                let theProto = showBounseItems[index].proto 
                let loader_icon: fgui.GLoader = child.getChild("loader_icon");
                let loader_qua: fgui.GLoader = child.getChild("loader_qua");
                let loader_dikuang: fgui.GLoader = child.getChild("loader_dikuang");
                let loader_grade: fgui.GLoader = child.getChild("loader_grade");
                let img_new: fgui.GComponent = child.getChild("img_new");
                loader_dikuang.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_name{0}", [theProto.quality]);
                loader_qua.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_kuang{0}", [theProto.quality]);
                loader_icon.url = UtilsTool.stringFormat("ui://LyTheurgy/f_{0}", [theProto.icon]);
                loader_grade.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_dj{0}", [theProto.quality]);
                (child.getChild("label_name") as fgui.GLabel).text = theProto.name;
                child.getChild("group_grade").visible = false
            }
            list_the.numItems = showBounseItems.length
        }else{
            //其他
            isItem = true
            list_the.visible = false
            list_item.itemRenderer = (index:number, child:fgui.GComponent)=>{
                UtilsUI.setUIGroupItem(showBounseItems[index], child, null)
            }
            list_item.numItems = showBounseItems.length
        }
        
        btn_use.onClick(()=>{
            let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    let itemCount = GameServerData.getInstance().getItemCountByProtoId(bonuseItem.proto.id)
                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])})
                    if (itemCount == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBagRandom, 0, null);
                    }else{
                        itemInst = GameServerData.getInstance().getItemInstByProtoId(bonuseItem.proto.id)
                        slider_use.max = itemInst.count
                        slider_use.value = 1
                        label_count.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR2, [itemCount]);
                        label_haveNumber.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR6, [slider_use.value])
                    }
                } else {
                    if (LocaleData.isPet(showBounseItems[0].proto.id) && fullInfo.petModuleInfo.pet.length + slider_use.value >= fullInfo.base.petBackpackCapacity ) {
                        //前往灵兽
                        UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_ONE, "", 
                        StrVal.LYBACKPACK.STR10, null, 
                        "", null, 
                        "", null, 
                        StrVal.COMMON.STR33, () =>  {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPet, 0, null);
                        });
                    }else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }
            }, "openChest", { instId: itemInst.id, count: slider_use.value })
        });

        let label_paseTime: fgui.GTextField = group_main.getChild("label_paseTime");
        if (bonuseItem.proto.expires != "0") {
            label_paseTime.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR8, [UtilsTool.ymdToAgo(bonuseItem.proto.expires)]) 
            this.setInterval(()=>{
                label_paseTime.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR8, [UtilsTool.ymdToAgo(bonuseItem.proto.expires)]) 
            }, 1000);
        }else {
            label_paseTime.visible = false
        }
    }

    public getIsViewMask(): boolean {
        return false;
    }
}


