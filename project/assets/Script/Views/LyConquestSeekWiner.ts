//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { LocaleData } from "../Kernel/LocaleData";
import { SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { LyConquestSeek } from "./LyConquestSeek";
import { PointRedData } from "../Kernel/PointRedData";

export class LyConquestSeekWiner extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyConquestSeek;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyConquestSeek;
        this.viewResI.comName = "LyConquestSeekWiner";
    }

    public onViewCreate(params:any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel()
        let group_main = uiPanel.getChild("group_main", fgui.GComponent)
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyConquestSeekWiner, 0, null);
        })

        let btn_close: fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let btn_dianzan: fgui.GButton = group_main.getChild("btn_dianzan");
        PointRedData.getInstance().updateManualPoint(btn_dianzan, LyConquestSeekWiner.isViewRedPoint());
        btn_dianzan.text = StrVal.LYCONQUESTSEEK.STR501;
        btn_dianzan.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    PointRedData.getInstance().updateManualPoint(btn_dianzan, LyConquestSeekWiner.isViewRedPoint());
                    btn_dianzan.enabled = false;
                    btn_dianzan.text = StrVal.LYCONQUESTSEEK.STR503;
                    UtilsUI.showItemReward({
                        bonuseItems:[UtilsUI.getBonuseItem(VarVal.bonusType.stone, null, null, String(args.stone))]
                    });
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "conquestLiking", null)
        })

        let conquestInfo = GameServerData.getInstance().getConquestInfo();
        let lastTopClan = conquestInfo.lastTopClan
        let lastTopPlayer = conquestInfo.lastTopPlayer

        let c1 = group_main.getController("c1")
        if (lastTopClan.serverId) {
            c1.selectedIndex = 0
        } else {
            c1.selectedIndex = 1
        }

        if (conquestInfo.myInfo.isLiking) {
            btn_dianzan.enabled = false;
            btn_dianzan.text = StrVal.LYCONQUESTSEEK.STR503;
        }

        let group_faction = group_main.getChild("group_faction", fgui.GComponent);
        let label_name = group_faction.getChild("label_name", fgui.GTextField);
        label_name.text = lastTopClan.name;
        let label_server = group_faction.getChild("label_server", fgui.GTextField);
        let server = PlatformAPI.getGameServerItem(lastTopClan.serverId)
        if (server) {
            label_server.text = server.name
        } else {
            label_server.text = ""
        }
        let loader_flag: fgui.GLoader = group_main.getChild("loader_flag")
        if (lastTopClan.flag) {
            let flagItem = LocaleData.getClanFlagById(lastTopClan.flag)
            loader_flag.url = UtilsTool.stringFormat("ui://CCommon/{0}", [flagItem.icon])
        }

        let group_player = group_main.getChild("group_player", fgui.GComponent);
        let label_name1 = group_player.getChild("label_name", fgui.GTextField);
        label_name1.text = lastTopPlayer.name;
        let label_server1 = group_player.getChild("label_server", fgui.GTextField);
        let server1 = PlatformAPI.getGameServerItem(lastTopPlayer.serverId)
        if (server1) {
            label_server1.text = server1.name
        } else {
            label_server1.text = ""
        }
        if (lastTopPlayer.serverId) {
            let loader_phase: fgui.GComponent = group_main.getChild("loader_phase");
            UtilsUI.setTitleIconByTitleId(loader_phase, lastTopPlayer.phase, lastTopPlayer.title);
            let charInfo = LocaleData.getCharShowResInfo(lastTopPlayer.character, lastTopPlayer.phase, lastTopPlayer.appearance, null);
            new SpineRoldMountPlayer(group_main.getChild("group_spine_ram")).loadSpineRole(charInfo);
        }
    };

    public getIsViewMask(): boolean {
        return false;
    };

    public static isViewRedPoint(): boolean {
        if (LyConquestSeek.isConquestOpen()) {
            let conquestInfo = GameServerData.getInstance().getConquestInfo();
            if (conquestInfo.lastTopClan.serverId && !conquestInfo.myInfo.isLiking) {
                return true;
            }
        }
        return false;
    }
}