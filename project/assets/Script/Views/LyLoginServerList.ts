//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { LyLogin } from "./LyLogin";
import { UtilsUI } from "../Kernel/UtilsUI";
import { VarVal } from "../Values/VarVal";
import { PlatformAPI, ServerItem, ServerRecord, ServerStatus } from "../Kernel/PlatformAPI";
import { UtilsTool } from "../Kernel/UtilsTool";
import { Color } from "cc";

interface SelectBindItem {
    server:ServerItem,
    player:ServerRecord
}

interface SelectSerItem {
    title:string,
    binds:Array<SelectBindItem>
}

export class LyLoginServerList extends ViewLayer {

    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyLogin;
        this.viewResI.pkgName = "LyLogin";
        this.viewResI.comName = "LyLoginServerList";
    }

    private selectItems:Array<SelectSerItem>;
    private lastIndex:number;

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyLoginServerList, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_title = group_main.getChild("label_title", fgui.GTextField);
        label_title.text = StrVal.LYLELECTSERVER.STR1;

        let title1 = group_main.getChild("title1", fgui.GTextField);
        title1.text = StrVal.LYLELECTSERVER.STR2;
        let title2 = group_main.getChild("title2", fgui.GTextField);
        title2.text = StrVal.LYLELECTSERVER.STR3;
        let title3 = group_main.getChild("title3", fgui.GTextField);
        title3.text = StrVal.LYLELECTSERVER.STR4;

        let serverItems:Array<ServerItem> = params.servers;
        let playerItems:Array<ServerRecord> = params.players;

        let selfBinds:Array<SelectBindItem> = new Array<SelectBindItem>();
        for (let i = 0; i < playerItems.length; i++) {
            let server = PlatformAPI.getGameServerItem(playerItems[i].serverId);
            if (server) { // 有时候在列表中没找到，但有记录（一般不会出现，属于防错）
                selfBinds.push({
                    server: server,
                    player: playerItems[i]
                });
            }
        }
        let allBinds:Array<SelectBindItem> = new Array<SelectBindItem>();
        for (let i = 0; i < serverItems.length; i++) {
            allBinds.push({
                server: serverItems[i],
                player: undefined
            });
        }

        this.selectItems = new Array<SelectSerItem>();
        this.selectItems.push({
            title: StrVal.LYLELECTSERVER.STR6,
            binds: selfBinds
        });
        this.selectItems.push({
            title: StrVal.LYLELECTSERVER.STR7,
            binds: allBinds
        });

        let list_item = group_main.getChild("list_item", fgui.GList);
        list_item.itemRenderer = (index:number, group_item:fgui.GButton) => {
            let selectItem = this.selectItems[index];
            group_item.text = selectItem.title;
            group_item.titleColor = this.lastIndex == index ? new Color(22, 25, 26) : new Color(113, 93, 66);
            group_item.clearClick();
            group_item.onClick(() => {
                if (this.lastIndex != index) {
                    this.refreshCurrBind(index);
                }
            })
        }

        this.refreshCurrBind(1);
    }

    private refreshCurrBind(index:number): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        this.lastIndex = index;

        let list_item = group_main.getChild("list_item", fgui.GList);
        for (let i = 0; i < list_item.numChildren; i++) {
            let btn_frame:fgui.GButton = list_item.getChildAt(i);
            btn_frame.selected = (this.lastIndex == list_item.childIndexToItemIndex(i));
        }
        list_item.numItems = this.selectItems.length;

        let list_server = group_main.getChild("list_server", fgui.GList);
        list_server.itemRenderer = (index:number, group_item:fgui.GButton) => {
            let bindItem = this.selectItems[this.lastIndex].binds[index];
            if (bindItem.player) {
                group_item.text = UtilsTool.stringFormat("{0}@{1}", [bindItem.server.name, bindItem.player.name]);
            } else {
                group_item.text = bindItem.server.name;
            }
            group_item.clearClick();
            group_item.onClick(() => {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyLogin, 0, bindItem.server.serverId);
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyLoginServerList, 0, null);
            })
            // 状态
            let loader_status = group_item.getChild("loader_status", fgui.GLoader);
            if (bindItem.server.status == ServerStatus.HOT || bindItem.server.status == ServerStatus.NORMAL) {
                loader_status.url = UtilsTool.stringFormat("ui://LyLogin/{0}", ["icon_baoman"]);
            } else if (bindItem.server.status == ServerStatus.NEW || bindItem.server.status == ServerStatus.RECOMMEND) {
                loader_status.url = UtilsTool.stringFormat("ui://LyLogin/{0}", ["icon_liuchang"]);
            } else {
                loader_status.url = UtilsTool.stringFormat("ui://LyLogin/{0}", ["icon_weihu"]);
            }
            let img_new = group_item.getChild("img_new", fgui.GImage);
            img_new.visible = (bindItem.server.status == ServerStatus.NEW);
        }
        list_server.numItems = this.selectItems[this.lastIndex].binds.length;
    }

    public getIsViewMask():boolean {
        return false;
    };
}