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

export class LyEquipTips extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.CCommon;
        this.viewResI.pkgName = "CCommon";
        this.viewResI.comName = "LyEquipTips";
    }

    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");

        // let bonuseItem:BonuseItem = params.bonuseItem;

        let pos = getUiPanel.globalToLocal(params.pos.x, params.pos.y);
        let cx = pos.x - group_main.width;
        if (cx < 0) {
            cx = pos.x;
            if (cx + group_main.width > getUiPanel.width) {
                cx = getUiPanel.width - group_main.width;
            }
        }
        let cy = pos.y - group_main.height;
        if (cy < 0) {
            cy = pos.y + params.size.y;
        }
        group_main.setPosition(cx, cy);

        // 关闭
        let btn_back: fgui.GButton = getUiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEquipTips, 0, null);
        })
        let battleEuip;
        let attrs = []
        if (params.equipInst.cid) {
            battleEuip = LocaleData.getEquipProto(params.equipInst.cid); //新获得的装备
            attrs = params.equipInst.attrs.split(",")
        } else { // 原型proto结构
            battleEuip = params.equipInst;//新获得的装备
            attrs = params.equipInst.attrs.split(",")
        }
        let img_icon: fgui.GComponent = group_main.getChild("group_eq")
        UtilsUI.setUIGroupEquip(params.equipInst, img_icon, () => {
        });
        let label_name: fgui.GTextField =  group_main.getChild("label_name")
        label_name.text = UtilsTool.stringFormat(StrVal.LYATTACHEQUIP.STR1, [LocaleData.getEquipQualityProto(battleEuip.quality).name, battleEuip.name])
        let star: string = LocaleData.getEquipQualityProto(battleEuip.quality).star
        let showQua: number = star == "0" ? battleEuip.quality : Number(star)
        label_name.strokeColor = UtilsUI.getQualityColor(showQua);
        // mGCom.getChild("label_pos").text = LocaleData.getSoltQualityProto(equipInst.slot).name
        // mGCom.getChild("label_grade").text = UtilsTool.stringFormat(StrVal.LYVEIN.STR3, [equipInst.level]) 
        // let list_star: fgui.GList = mGCom.getChild("list_star")
        let loader_qua :fgui.GLoader = group_main.getChild("loader_qua")
        loader_qua.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}_title", [showQua])
        // let Loader_icon :fgui.GLoader = mGCom.getChild("Loader_icon")
        // Loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [battleEuip.icon])
      
        for (let index = 0; index < 4; index++) {
            group_main.getChild(UtilsTool.stringFormat("label_name{0}", [index + 1])).text = StrVal.EQUIPATTR_NAMES[index]
            group_main.getChild(UtilsTool.stringFormat("label_num{0}", [index + 1])).text = attrs[index]
        }
        let specialArr: any[] = []
        for (let i = 4; i < attrs.length; i++) {
            if (attrs[i] != "0") {
                let data = {
                    id: i,
                    attr: attrs[i]
                }
                specialArr.push(data)
            }
        }
        let list_special: fgui.GList = group_main.getChild("list_special")
        list_special.itemProvider = ():string =>{
            return "ui://CCommon/group_special"
        }
        list_special.itemRenderer = ((index: number, obj: fgui.GComponent)=>{
            obj.getChild("label_name").text = StrVal.EQUIPATTR_NAMES[specialArr[index].id]
            obj.getChild("label_num").text = specialArr[index].attr + "%"
            obj.getChild("label_dec").text = LocaleData.getCombatAttrs(Number(specialArr[index].id) + 1).desc
        }).bind(this)
        list_special.numItems = specialArr.length
    }

    public getIsViewMask(): boolean {
        return false;
    }
}


