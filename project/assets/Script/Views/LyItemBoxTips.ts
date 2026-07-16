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
import { UI } from "cc";

export class LyItemBoxTips extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.CCommon;
        this.viewResI.pkgName = "CCommon";
        this.viewResI.comName = "LyItemBoxTips";
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
            ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_DESTROY, LyItemBoxTips, 0, null);
        })

        let Loader_qu: fgui.GLoader = group_main.getChild("Loader_qu");
        let label_name: fgui.GTextField = group_main.getChild("label_name");
        let label_dec1:fgui.GTextField = group_main.getChild("label_dec1");
        let loader_item: fgui.GLoader = group_main.getChild("loader_item");
        let label_count: fgui.GTextField = group_main.getChild("label_count");

        Loader_qu.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}_title", [bonuseItem.proto.quality]);
        label_name.text = bonuseItem.proto.name;
        label_name.strokeColor = UtilsUI.getQualityColor(bonuseItem.proto.quality);
        label_dec1.text = bonuseItem.proto.desc;
        loader_item.url = UtilsUI.getItemIconUrl(bonuseItem.proto);
        if (bonuseItem.type == VarVal.bonusType.item) {
            label_count.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR2, [GameServerData.getInstance().getItemCountByProtoId(bonuseItem.proto.id)]);
        } else {
            label_count.text = UtilsTool.stringFormat(StrVal.LYBACKPACK.STR2, [GameServerData.getInstance().getValueTypeCount(bonuseItem.type)]);
        }

        let showBounseItems = []
        if (bonuseItem.proto.subType == VarVal.itemtype.randomChest) {
            showBounseItems = UtilsUI.getBonuseItemsByBonusesId(bonuseItem.proto.data)
        }else if(bonuseItem.proto.subType == VarVal.itemtype.chooseChest){
            let bonId = bonuseItem.proto.data.split(",")
            for (let index = 0; index < bonId.length; index++) {
                showBounseItems.push(UtilsUI.getBonuseItemsByBonusesId(bonId[index])[0])
            }
        }
        let list_item = group_main.getChild("list_item", fgui.GList)
        list_item.itemRenderer = (index: number, child: fgui.GComponent)=>{
            UtilsUI.setUIGroupItem(showBounseItems[index], child.getChild("item"), null)
            child.getChild("group_have").visible = GameServerData.getInstance().getItemCount(showBounseItems[index].proto.id) >= 1
        }
        UtilsUI.setFguiGlistDelayNumItems(list_item, showBounseItems.length)
    }

    public getIsViewMask(): boolean {
        return false;
    }
}


