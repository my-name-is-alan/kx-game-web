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
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { GameServer } from "../Kernel/GameServer";
import { LyGuideGetItem } from "./LyGuideGetItem";

export class LyItemCraft extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyBackPack";
        this.viewResI.pkgName = "LyBackPack";
        this.viewResI.comName = "LyItemCraft";
    }

    public onViewCreate(params:any): void {
        let mergesData = params.mergesData
        let group_main: fgui.GComponent = this.getUiPanel();
        let mergesProto = LocaleData.getProto(mergesData.mergeItemId)
        let needProto = LocaleData.getProto(mergesData.itemId)


        // 关闭
        let btn_back: fgui.GButton = group_main.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyItemCraft, 0, null);
        })

        let Loader_qu: fgui.GLoader = group_main.getChild("Loader_qu");
        let label_name: fgui.GTextField = group_main.getChild("label_name");
        let label_dec1:fgui.GTextField = group_main.getChild("label_dec1");
        let loader_item: fgui.GLoader = group_main.getChild("loader_item");
        let label_have :fgui.GTextField = group_main.getChild("label_have");
        let btn_craft: fgui.GButton = group_main.getChild("btn_craft");
        btn_craft.text = StrVal.LYBACKPACK.STR3;
        (group_main.getChild("n20") as fgui.GLabel).text = StrVal.LYBACKPACK.STR4;
        let btn_add: fgui.GButton = group_main.getChild("btn_add");
        let btn_reduct: fgui.GButton = group_main.getChild("btn_reduct");
        let pro_use: fgui.GSlider =  group_main.getChild("pro_use");
        let label_count: fgui.GTextField = group_main.getChild("label_count");
        let label_will: fgui.GTextField = group_main.getChild("label_will");
     
        let quality = ""
        let icon = ""
        let des = ""
        if (LocaleData.isItem(mergesProto.id)) {
            icon = mergesProto.icon
            des = mergesProto.desc
        }else{
            icon = LocaleData.getModelShowInfo(mergesProto.modelId).icon
            if (LocaleData.isPet(mergesProto.id)) {
                let petLevel: any = LocaleData.getPetLevelByIdLevel(mergesProto.id, 1)
                des = LocaleData.getSkillProto(petLevel.skill_id).desc
            }
        }
        Loader_qu.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}_title", [mergesProto.quality]);
        label_name.text = mergesProto.name;
        label_name.strokeColor = UtilsUI.getQualityColor(mergesProto.quality);
        label_dec1.text = des;
        loader_item.url = UtilsTool.stringFormat("ui://CCommon/{0}", [icon]);

        let loader_item1:fgui.GComponent = group_main.getChild("loader_item1");
        UtilsUI.setUIGroupItem({
            type: VarVal.bonusType.item,
            proto: needProto,
            count: "0",
            name: "",
            desc: ""
        }, loader_item1, null)
        loader_item1.getChild("loader_back").visible = false
        loader_item1.getChild("loader_spine_item").visible = false
     
        // let needIcon = ""
        // if (LocaleData.isItem(needProto.id)) {
        //     needIcon = needProto.icon
        // }else{
        //     needIcon = LocaleData.getModelShowInfo(needProto.modelId).icon
        // }
        // console.log(needIcon)
        // if (condition) {
            
        // }
        // loader_item1.url = UtilsTool.stringFormat("ui://CCommon/{0}", [needProto]);
        let bl = Number(mergesData.count)
        let count = 1
        let haveCount = GameServerData.getInstance().getItemCountByProtoId(needProto.id)
        let maxMumber = Math.floor(haveCount / bl)

        let valueChage:Function = ()=>{
            haveCount = GameServerData.getInstance().getItemCountByProtoId(needProto.id)
            maxMumber = Math.floor(haveCount / bl)
            if (maxMumber <= 0) {
                pro_use.max = 1
            }else {
                pro_use.max = maxMumber
            }
            pro_use.value = count
            let needCount = count * bl
            label_have.color = UtilsUI.getEnoughColor(haveCount >= needCount)
            label_have.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR5, [haveCount, needCount])
            label_will.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR9, [count])
            if (maxMumber == 0) {
                btn_add.enabled = false
                btn_reduct.enabled = false
                pro_use.enabled = false
            }else {
                btn_add.enabled = pro_use.value != maxMumber
                btn_reduct.enabled = pro_use.value > 1
            }
        }

        btn_reduct.onClick(()=>{
            count = count - 1
            if (count <= 0) {
                count = 1
            }
            pro_use.value = count
            valueChage()
        })
        btn_add.onClick(()=>{
            count = count + 1
            if (count >= pro_use.max) {
                count = pro_use.max
            }
            pro_use.value = count
            valueChage()
        });
        pro_use.on(fgui.Event.STATUS_CHANGED, ()=>{
            count = pro_use.value
            if (pro_use.value = 0) {
                pro_use.value = 1
                count = pro_use.value
            }
            valueChage()
        });
        valueChage()
        btn_craft.onClick(()=>{

            if (haveCount != 0 || count < haveCount) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([{inserts: args.itemInserts}])});
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyItemCraft, 0, null);
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                } ,"mergeItem", {mergeId: mergesData.id, count: count })
            }else {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, needProto.id, "1"), buyCall:() => {
                    // this.updateShow();
                }});
            }
        });
    }

    public getIsViewMask(): boolean {
        return false;
    }
}



