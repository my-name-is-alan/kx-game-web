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
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { PlatformAPI } from "../Kernel/PlatformAPI";

interface RankPlayer {
    playerId:string,
    name:string,
    serverId:number,
    avatar:number,
    character:number,
    appearance:number,
    combatPower:number,
    phase:number,
    title:number,
}

export class LyPalaceRank extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPalace;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyPalace;
        this.viewResI.comName = "LyPalaceRecord";
    }

    private recordItems:Array<any>;
    private palaceInfos:Array<any>;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        this.recordItems = params.recordInfos;
        this.palaceInfos = params.palaceInfos;
        this.recordItems.sort((itemA, itemB) => {
			return itemB.startTime - itemA.startTime;
		})

        let btn_back:fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPalaceRank, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_title:fgui.GButton = group_main.getChild("label_title");
        label_title.text = StrVal.LYPALACE.STR5;

        // 列表
        let list_record:fgui.GList = group_main.getChild("list_record");
        list_record.setVirtual();
        list_record.itemRenderer = (index:number, child:fgui.GComponent) => {
            let recordItem = this.recordItems[index];
            let rankPlayer:RankPlayer = recordItem.playerInfo;

            let charInfo = LocaleData.getCharShowResInfo(rankPlayer.character, rankPlayer.phase, rankPlayer.appearance, rankPlayer.avatar);

            let group_head:fgui.GComponent = child.getChild("group_head");
            let loader_icon:fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            let btn_frame:fgui.GButton = group_head.getChild("btn_frame");
            btn_frame.clearClick();
            btn_frame.onClick(() => {
                UtilsUI.onShowPlayerInfo(rankPlayer.playerId);
            })

            let label_name:fgui.GTextField = child.getChild("label_name");
            label_name.text = rankPlayer.name;

            let label_time:fgui.GTextField = child.getChild("label_time");
            label_time.text = UtilsTool.TimeToDateStr(recordItem.startTime, "/");

            let label_rank:fgui.GTextField = child.getChild("label_rank");
            let label_new:fgui.GTextField = child.getChild("label_new");
            if (this.isInPalaceRoom(rankPlayer.playerId)) {
                label_new.text = StrVal.LYPALACE.STR6;
                label_rank.text = "";
            } else {
                label_new.text = "";
                label_rank.text = UtilsTool.stringFormat(StrVal.LYPALACE.STR7, [this.recordItems.length - index]);
            }

            let label_server:fgui.GTextField = child.getChild("label_server");
            let serverItem = PlatformAPI.getGameServerItem(rankPlayer.serverId);
            if (serverItem) {
                label_server.text = UtilsTool.stringFormat("({0})", [serverItem.name]);
            } else {
                label_server.text = "";
            }

            let loader_phase:fgui.GComponent = child.getChild("loader_phase");
            UtilsUI.setTitleIconByTitleId(loader_phase, rankPlayer.phase, rankPlayer.title);
        }
        UtilsUI.setFguiGlistDelayNumItems(list_record, this.recordItems.length);
        
        group_main.getChild("img_empty").visible = this.recordItems.length == 0;
    }

    private isInPalaceRoom(playerId:string):boolean {
        for (let i = 0; i < this.palaceInfos.length; i++) {
            if (this.palaceInfos[i].playerId == playerId) {
                return true;
            }
        }
    }
    
    public getIsViewMask():boolean {
        return false;
    }
}