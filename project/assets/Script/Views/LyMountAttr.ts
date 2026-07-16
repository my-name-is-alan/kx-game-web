//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { LocaleData } from "../Kernel/LocaleData";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsUI } from "../Kernel/UtilsUI";

export class LyMountAttr extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyMount;
        this.viewResI.pkgName = "LyMount";
        this.viewResI.comName = "LyMountAttr";
    }
 
    public onViewCreate(params:any):void {
        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);
        
        let label_title = group_main.getChild("label_title")
        label_title.text = StrVal.LYMOUNT.STR201;

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyMountAttr, 0, null);
        })

        let btn_close = group_main.getChild("btn_close")
        btn_close.onClick(()=> {
            btn_back.fireClick();
        })

        let label_stagelevel:fgui.GTextField = group_main.getChild("label_stagelevel");
        label_stagelevel.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR10, [params.mount.stage, params.mount.level]);

        let mountItem = LocaleData.getMountTypeItem(params.mount.tid);
        let stageItem = LocaleData.getMountStageItem(params.mount.stage);
        let nextItem = LocaleData.getMountStageItem(params.mount.stage + 1);
        if (!nextItem) {
            nextItem = stageItem;
        }

        let label_desc = group_main.getChild("label_desc")
        label_desc.text = UtilsTool.stringFormat(StrVal.LYMOUNT.STR202, [Number(stageItem.mount_level_max) - params.mount.level]);

        // 右边
        let label_tipbase = group_main.getChild("label_tipbase")
        label_tipbase.text = StrVal.LYMOUNT.STR203;

        let label_tipcurr = group_main.getChild("label_tipcurr")
        label_tipcurr.text = StrVal.LYMOUNT.STR204;

        let label_tipnext = group_main.getChild("label_tipnext")
        label_tipnext.text = StrVal.LYMOUNT.STR205;

        let group_name1 = group_main.getChild("group_name1")
        let label_tipnone = group_main.getChild("label_tipnone")
        label_tipnone.text = StrVal.LYMOUNT.STR4;

        let label_name1:fgui.GTextField = group_main.getChild("label_name1");
        label_name1.text = StrVal.ENTITI_NAMES[Number(mountItem.resis)];
        let label_valc1:fgui.GTextField = group_main.getChild("label_valc1");
        label_valc1.text = UtilsTool.stringFormat("{0}%", [stageItem.al_resis]);
        let label_valn1:fgui.GTextField = group_main.getChild("label_valn1");
        label_valn1.text = UtilsTool.stringFormat("{0}%", [nextItem.al_resis]);
        if (mountItem.resis == "0") {
            group_name1.visible = false;
        } else {
            label_tipnone.visible = false;
        }

        // 右边
        let label_tipbase_n = group_main.getChild("label_tipbase_n")
        label_tipbase_n.text = StrVal.LYMOUNT.STR206;

        let label_tipcurr_n = group_main.getChild("label_tipcurr_n")
        label_tipcurr_n.text = StrVal.LYMOUNT.STR204;

        let label_tipnext_n = group_main.getChild("label_tipnext_n")
        label_tipnext_n.text = StrVal.LYMOUNT.STR205;

        let arr = [
            VarVal.ENTITIATTR.RESISTANCE_VERTIGO,
            VarVal.ENTITIATTR.RESISTANCE_CRITICAL,
            VarVal.ENTITIATTR.RESISTANCE_COMBO,
            VarVal.ENTITIATTR.RESISTANCE_MISS,
            VarVal.ENTITIATTR.RESISTANCE_COUNTER,
            VarVal.ENTITIATTR.RESISTANCE_VAMPIRE,
        ]
        for (let i = 0; i < arr.length; i++) {
            let label_name1_n:fgui.GTextField = group_main.getChild(UtilsTool.stringFormat("label_name{0}_n", [i+1]));
            label_name1_n.text = StrVal.ENTITI_NAMES[arr[i]];
            let label_valc1_n:fgui.GTextField = group_main.getChild(UtilsTool.stringFormat("label_valc{0}_n", [i+1]));
            label_valc1_n.text = UtilsTool.stringFormat("{0}%", [stageItem.resis]);
            let label_valn1_n:fgui.GTextField = group_main.getChild(UtilsTool.stringFormat("label_valn{0}_n", [i+1]));
            label_valn1_n.text = UtilsTool.stringFormat("{0}%", [nextItem.resis]);
        }

        let btn_upstage:fgui.GButton = group_main.getChild("btn_upstage");
        btn_upstage.text = StrVal.LYMOUNT.STR11;
        btn_upstage.onClick(() => {
            params.callback();
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyMountAttr, 0, null)
        })
        if (params.callback) {
            label_desc.visible = false;

            let currCount = GameServerData.getInstance().getItemCountByProtoId(stageItem.stage_item_id);
            let needCount = Number(stageItem.stage_sum);
            let proto = LocaleData.getItemProto(stageItem.stage_item_id);
            let loader_icon:fgui.GLoader = group_main.getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [proto.icon]);

            let label_need:fgui.GTextField = group_main.getChild("label_need");
            label_need.text = UtilsTool.stringFormat("{0}/{1}", [currCount, needCount]);
            label_need.color = UtilsUI.getEnoughColor(currCount >= needCount);
        } else {
            group_main.getChild("group_upstage").visible = false;
        }
    }

    public getIsViewMask():boolean {
        return false;
    }
}


