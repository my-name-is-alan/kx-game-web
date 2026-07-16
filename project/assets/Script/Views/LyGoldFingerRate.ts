//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { LocaleData } from "../Kernel/LocaleData";

export class LyGoldFingerRate extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.comName = "LyGoldFingerRate";
    }

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let raffles = LocaleData.getGoldFingerRaffleItems();
        let goldRef:any;
        let newRefs = new Array<any>();
        for (let i = 0; i < raffles.length; i++) {
            if (raffles[i].bonuses.length > 1) {
                newRefs.push(raffles[i]);
            } else {
                goldRef = raffles[i];
            }
        }

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGoldFingerRate, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_title = group_main.getChild("label_title", fgui.GTextField);
        label_title.text = StrVal.LYGOLDFINGER.STR21;

        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        }, group_main.getChild("loader_spine_main", fgui.GLoader3D), params.goldItem.spineName);

        let loader_name:fgui.GLoader = group_main.getChild("loader_name");
        loader_name.url = UtilsTool.stringFormat("ui://LyGoldFinger/{0}", [params.goldItem.iconName]);

        let label_rate = group_main.getChild("label_rate", fgui.GTextField);
        label_rate.text = UtilsTool.stringFormat(StrVal.LYGOLDFINGER.STR22, [Number(goldRef.prop) / 100]);

        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.setVirtual();
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            let raffle = newRefs[index];
            let bonuseItems = UtilsUI.getBonuseItemsByBonusesId(raffle.bonuses);
            child.getChild("label_name", fgui.GTextField).text = bonuseItems[0].proto.name;
            child.getChild("label_rate", fgui.GTextField).text = UtilsTool.stringFormat("{0}%", [String(Number(raffle.prop) / 100)]);
            let group_item = child.getChild("group_item", fgui.GComponent);
            UtilsUI.setUIGroupItem(bonuseItems[0], group_item, null);
        }
        UtilsUI.setFguiGlistDelayNumItems(list_item, newRefs.length);
    }

    public getIsViewMask():boolean {
        return false;
    }
}