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

export class LyBagChoose extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyBackPack";
        this.viewResI.pkgName = "LyBackPack";
        this.viewResI.comName = "LyBagChoose";
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
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBagChoose, 0, null);
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
        let list_item: fgui.GList = group_main.getChild("list_item")
        let list_the: fgui.GList = group_main.getChild("list_the")
       
        Loader_qu.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}_title", [bonuseItem.proto.quality]);
        label_name.text = bonuseItem.proto.name;
        label_name.strokeColor = UtilsUI.getQualityColor(bonuseItem.proto.quality);
        label_dec1.text = bonuseItem.proto.desc;
        loader_item.url = UtilsTool.stringFormat("ui://CCommon/{0}", [bonuseItem.proto.icon]);
        label_count.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR2, [GameServerData.getInstance().getItemCountByProtoId(bonuseItem.proto.id)]);
        let showBounseItems = []
        let bonId = bonuseItem.proto.data.split(",")
        for (let index = 0; index < bonId.length; index++) {
            showBounseItems.push(UtilsUI.getBonuseItemsByBonusesId(bonId[index])[0])
        }
        let chooseCount = [];
        for (let index = 0; index < showBounseItems.length; index++) {
            chooseCount.push(0)
        }

        let getChooseAllCount: Function = () : number =>{
            let allCount = 0
            for (let index = 0; index < chooseCount.length; index++) {
                let element = chooseCount[index];
                allCount = allCount + element
            }
            return allCount
        }

        let valueChange: Function = ()=>{
            if (isItem) {
                list_item.numItems = chooseCount.length
            }else{
                list_the.numItems = chooseCount.length
            }
            let useCount = getChooseAllCount()
            label_haveNumber.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR7, [ UtilsUI.getEnoughColorToHEX(useCount != itemInst.count), useCount, itemInst.count]) 
        }
        
        //神通
        if (LocaleData.isTheurgy(showBounseItems[0].proto.id)) {
            isItem = false
            list_item.visible = false
            list_the.itemRenderer = (index:number, gc:fgui.GComponent)=>{
                let theProto = showBounseItems[index].proto 
                let child = gc.getChild("the", fgui.GComponent)
                let loader_icon: fgui.GLoader = child.getChild("loader_icon");
                let loader_qua: fgui.GLoader = child.getChild("loader_qua");
                let loader_dikuang: fgui.GLoader = child.getChild("loader_dikuang");
                let loader_grade: fgui.GLoader = child.getChild("loader_grade");
                loader_dikuang.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_name{0}", [theProto.quality]);
                loader_qua.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_kuang{0}", [theProto.quality]);
                loader_icon.url = UtilsTool.stringFormat("ui://LyTheurgy/f_{0}", [theProto.icon]);
                loader_grade.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_dj{0}", [theProto.quality]);
                (child.getChild("label_name") as fgui.GLabel).text = theProto.name;
                child.getChild("group_grade").visible = false
                let group_have: fgui.GGroup = gc.getChild("group_have")
                if (GameServerData.getInstance().getTheurgyByProto(showBounseItems[index].proto.id)) {
                    group_have.visible = true
                }else{
                    group_have.visible = false
                }
                let label_number: fgui.GLabel = gc.getChild("label_number")
                let btn_add: fgui.GButton = gc.getChild("btn_add")
                let btn_jianshao: fgui.GLabel = gc.getChild("btn_jianshao")
                let refreshFun = ()=>{
                    btn_jianshao.grayed = chooseCount[index] == 0
                    btn_add.grayed = getChooseAllCount() == itemInst.count
                    label_number.text = chooseCount[index]
                } 
                btn_add.clearClick()               
                btn_add.onClick(()=>{
                    if (getChooseAllCount() < itemInst.count) {
                        chooseCount[index] = chooseCount[index] + 1
                        refreshFun()
                        valueChange()
                    }
                });
                btn_jianshao.clearClick()
                btn_jianshao.onClick(()=>{
                    if (chooseCount[index] > 0) {
                        chooseCount[index] = chooseCount[index] - 1
                        refreshFun()
                        valueChange()
                    }
                });
                refreshFun()
            }
            // list_the.numItems = showBounseItems.length
        }else{
            //其他
            isItem = true
            list_the.visible = false
            list_item.itemRenderer = (index:number, child:fgui.GComponent)=>{
                UtilsUI.setUIGroupItem(showBounseItems[index], child.getChild("item"), null)
                child.getChild("label_name", fgui.GLabel).text = showBounseItems[index].proto.name
                child.getChild("group_have").visible = GameServerData.getInstance().getItemCountByProtoId(showBounseItems[index].proto.id) != 0
                let label_number: fgui.GLabel = child.getChild("label_number")
                let btn_add: fgui.GButton = child.getChild("btn_add")
                let btn_jianshao: fgui.GLabel = child.getChild("btn_jianshao")
                let refreshFun = ()=>{
                    btn_jianshao.grayed = chooseCount[index] == 0
                    btn_add.grayed = getChooseAllCount() == itemInst.count
                    label_number.text = chooseCount[index]
                }      
                btn_add.clearClick()          
                btn_add.onClick(()=>{
                    if (getChooseAllCount() < itemInst.count) {
                        chooseCount[index] = chooseCount[index] + 1
                        refreshFun()
                        valueChange()
                    }
                });
                btn_jianshao.onClick(()=>{
                    if (chooseCount[index] > 0) {
                        chooseCount[index] = chooseCount[index] - 1
                        refreshFun()
                        valueChange()
                    }
                });
                refreshFun()
            }
            // list_item.numItems = showBounseItems.length
        }

        btn_use.onClick(()=>{
            let arrt = []
            for (let index = 0; index < chooseCount.length; index++) {
                let element = chooseCount[index];
                if (element != 0) {
                    let arg = {}
                    arg["index"] = index + 1
                    arg["count"] = element
                    arrt.push(arg)
                }
            }
            if (arrt.length > 0) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        let itemCount = GameServerData.getInstance().getItemCountByProtoId(bonuseItem.proto.id)
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])})
                        if (itemCount == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBagChoose, 0, null);
                        }else{
                            label_count.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR2, [itemCount]);
                            itemInst = GameServerData.getInstance().getItemInstByProtoId(bonuseItem.proto.id)
                            chooseCount = [];
                            for (let index = 0; index < showBounseItems.length; index++) {
                                chooseCount.push(0)
                                valueChange()
                            }
                        }
                      
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "openChest", { instId: itemInst.id, count: getChooseAllCount(), chestSelectArr: arrt  })
            }
        });

        valueChange()

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


