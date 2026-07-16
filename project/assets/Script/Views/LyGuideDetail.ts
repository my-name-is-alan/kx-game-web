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
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";

export class LyGuideDetail extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGuideDetail;
        this.viewResI.pkgName = "LyGuideDetail";
        this.viewResI.comName = "LyGuideDetail";
    }

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        let btn_close:fgui.GButton = uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGuideDetail, 0, null);
        })

        let label_title:fgui.GButton = group_main.getChild("label_title");
        label_title.text = params.title;

        let __detail:string = "";
        if (params.detail) {
            __detail = params.detail;
        }
        let titleData = __detail.split("@");
        let oneData = titleData[0].split("-");
        if (oneData.length <= 1) {
            let group_content:fgui.GButton = group_main.getChild("group_content");
            group_content.visible = true;
            let label_text:fgui.GButton = group_content.getChild("label_text");
            label_text.text = __detail;
        }else{
            let list_allDes: fgui.GList = group_main.getChild("list_allDes");
            list_allDes.visible = true
            list_allDes.itemProvider = (index: number):string =>{
                return "ui://LyGuideDetail/group_des"
            }
            list_allDes.itemRenderer = (index: number, child: fgui.GComponent) =>{
                let onedes = titleData[index].split("-");
                (child.getChild("label_name") as fgui.GLabel).text = onedes[0];
                let label_content:fgui.GLabel = child.getChild("label_content");
                label_content.text = onedes[1];
            }
            list_allDes.numItems = titleData.length
        }
    }

    public getIsViewMask():boolean {
        return false;
    }

    public static getTiandaoDesc(): string {
        let strs = new Array<string>();
        let hallData = GameServerData.getInstance().getPalaceHallData();
        let buffId = String(hallData.buffId);
        let items = LocaleData.getPalaceBuffItems();
        for (let i = 0 ; i < items.length; i++) {
            let item = items[i];
            let append = "";
            if (item.id == buffId) {
                let count = Number(item.limit) - hallData.buffCount;
                append = UtilsTool.stringFormat(StrVal.LYPALACE.STR13, [UtilsUI.getEnoughColorToHEX(count > 0), count, item.limit]);
            }
            strs.push(UtilsTool.stringFormat("[color=#{0}]{1}[/color]{3}-[color=#{0}]{2}[/color]", [UtilsUI.getEnoughColorToHEX(item.id == buffId, 2), item.name, item.desc, append]));
        }
        return strs.join("@");
    }
}