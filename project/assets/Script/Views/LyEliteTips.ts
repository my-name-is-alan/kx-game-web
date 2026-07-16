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
import { LocaleData } from "../Kernel/LocaleData";

export class LyEliteTips extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.CCommon;
        this.viewResI.pkgName = "CCommon";
        this.viewResI.comName = "LyEliteTips";
    }

    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");

        // 关闭
        let btn_back: fgui.GButton = getUiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteTips, 0, null);
        })

        let name:string;
        let level:string;
        let desc:string;
        
        let eliteProto = params.eliteProto;
        let descTip = params.descTip;
        if (eliteProto) {
            level = "1";
            let levelItem = LocaleData.getEliteMonsterLevel(eliteProto.id, level);
            let skillProto = LocaleData.getSkillProto(levelItem.skill_id);
            name = skillProto.name;
            desc = skillProto.desc;
        } else if (descTip) {
            name = descTip.name;
            level = descTip.level;
            desc = descTip.desc;
        }

        let label_name: fgui.GTextField = group_main.getChild("label_name");
        label_name.text = name;

        let label_level: fgui.GTextField = group_main.getChild("label_level");
        label_level.text = UtilsTool.stringFormat(StrVal.LYSTAGE.STR7, [level]);

        let label_desc: fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = desc;

        group_main.height = label_desc.height + label_desc.y + 5;
        if (group_main.height < group_main.initHeight) {
            group_main.height = group_main.initHeight;
        }

        let pos = getUiPanel.globalToLocal(params.pos.x, params.pos.y);
        let cx = pos.x - group_main.width;
        if (cx < 0) {
            cx = pos.x;
            if (cx + group_main.width > getUiPanel.width) {
                cx = getUiPanel.width - group_main.width;
            }
        }
        let cy = pos.y;
        if (cy + group_main.height > getUiPanel.height) {
            cy = getUiPanel.height - group_main.height;
        }
        group_main.setPosition(cx, cy);
    }

    public getIsViewMask(): boolean {
        return false;
    }
}

export class LyMonsTowerBuffTips extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.CCommon;
        this.viewResI.pkgName = "CCommon";
        this.viewResI.comName = "LyMonsTowerBuffTips";
    }

    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");

        let pos = getUiPanel.globalToLocal(params.pos.x, params.pos.y);
        let cx = pos.x + (params.size.x - group_main.width) / 2;
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
            ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_DESTROY, LyMonsTowerBuffTips, 0, null);
        })

        let name:string;
        let level:string;
        let desc:string;
        
        let eliteProto = params.eliteProto;
        let descTip = params.descTip;
        if (eliteProto) {
            level = "1";
            let levelItem = LocaleData.getEliteMonsterLevel(eliteProto.id, level);
            let skillProto = LocaleData.getSkillProto(levelItem.skill_id);
            name = skillProto.name;
            desc = skillProto.desc;
        } else if (descTip) {
            name = descTip.name;
            level = descTip.level;
            desc = descTip.desc;
        }

        let label_name: fgui.GTextField = group_main.getChild("label_name");
        label_name.text = name;

        let label_level: fgui.GTextField = group_main.getChild("label_level");
        label_level.text = UtilsTool.stringFormat(StrVal.LYSTAGE.STR7, [level]);

        let label_desc: fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = desc;
    }

    public getIsViewMask(): boolean {
        return false;
    }
}