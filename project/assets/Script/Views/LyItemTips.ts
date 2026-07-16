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

export class LyItemTips extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.CCommon;
        this.viewResI.pkgName = "CCommon";
        this.viewResI.comName = "LyItemTips";
    }

    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");

        let bonuseItem:BonuseItem = params.bonuseItem;

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
            ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_DESTROY, LyItemTips, 0, null);
        })

        let Loader_qu: fgui.GLoader = group_main.getChild("Loader_qu");
        let label_name: fgui.GTextField = group_main.getChild("label_name");
        let label_dec1:fgui.GTextField = group_main.getChild("label_dec1");
        let loader_item: fgui.GLoader = group_main.getChild("loader_item");
        let label_count: fgui.GTextField = group_main.getChild("label_count");

        let showQuality = bonuseItem.proto.quality;
        if (LocaleData.isPet(bonuseItem.proto.id) || LocaleData.isTheurgy(bonuseItem.proto.id)) {
            showQuality = String(Number(showQuality) + 1);
        }
        Loader_qu.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}_title", [showQuality]);
        label_name.text = bonuseItem.proto.name;
        label_name.strokeColor = UtilsUI.getQualityColor(showQuality);
        label_dec1.text = bonuseItem.proto.desc;
        if (bonuseItem.proto.desc == undefined) {
            label_dec1.text = bonuseItem.desc; // 这是干嘛？   设计如此 有些表的描述 不叫desc getBountesTiem 的时候赋值了desc字段
        }
        
        if (bonuseItem.type == VarVal.bonusType.item) {
            label_count.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR2, [GameServerData.getInstance().getItemCount(bonuseItem.proto.id)]);
        } else {
            label_count.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR2, [GameServerData.getInstance().getValueTypeCount(bonuseItem.type)]);
        }

        if (LocaleData.isTheurgy(bonuseItem.proto.id)) {
            loader_item.url = UtilsTool.stringFormat("ui://CCommon/zjm_{0}", [bonuseItem.proto.icon2]);
            label_count.text = "";
        }else{
            loader_item.url = UtilsUI.getItemIconUrl(bonuseItem.proto);
        }

        let label_paseTime: fgui.GTextField = group_main.getChild("label_paseTime");
        if (bonuseItem.proto && bonuseItem.proto.expires && bonuseItem.proto.expires != "0") {
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


