//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
export class LySettingBlacklist extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LySetting";
        this.viewResI.pkgName = "LySetting";
        this.viewResI.comName = "LySettingBlacklist";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("group_main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LySettingBlacklist, 0, null);
        })
        let btn_close1: fgui.GButton = this.getUiPanel().getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LySettingBlacklist, 0, null);
        })
        let label_str35: fgui.GLabel = this.uiPanel.getChild("label_str35")
        label_str35.text = StrVal.LYSETTING.STR35
        let label_str36: fgui.GLabel = this.uiPanel.getChild("label_str36")
        label_str36.text = StrVal.LYSETTING.STR36
        this.onBlacklist()
    };
    private onBlacklist(): void {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let list_blacklistitem: fgui.GList = this.uiPanel.getChild("list_blacklistitem")
        list_blacklistitem.itemRenderer = (index: number, child: fgui.GComponent) => {
            let player: any = fullInfo.blacklist[index]
            let label_level: fgui.GLabel = child.getChild("label_level")
            label_level.text = LocaleData.getPlayerPhaseById(player.phase).phaseName;
            let charInfo = LocaleData.getCharShowResInfo(player.character, player.phase, player.appearance, player.avatar);
            let group_head: fgui.GComponent = child.getChild("group_head");
            let loader_icon: fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            let label_name: fgui.GLabel = child.getChild("label_name")
            label_name.text = player.name
            let label_combatPower: fgui.GLabel = child.getChild("label_combatPower")
            label_combatPower.text = UtilsTool.nToFStr(player.combatPower)
            let btn_blockPlayer: fgui.GButton = child.getChild("btn_blockPlayer")
            btn_blockPlayer.text = StrVal.LYSETTING.STR39
            btn_blockPlayer.clearClick()
            btn_blockPlayer.onClick(() => {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        this.onBlacklist()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "blockPlayer", { flag: 0, counterId: player.guid });
            })
        }
        list_blacklistitem.numItems = fullInfo.blacklist.length
        let label_blockPlayerNum: fgui.GLabel = this.uiPanel.getChild("label_blockPlayerNum")
        let playerRoot: any = LocaleData.getPlayerRoot()
        label_blockPlayerNum.text = UtilsTool.stringFormat(StrVal.LYSETTING.STR37, [fullInfo.blacklist.length, playerRoot.blacklistLimit])
        let btn_blockPlayerAll: fgui.GButton = this.uiPanel.getChild("btn_blockPlayerAll")
        btn_blockPlayerAll.enabled = fullInfo.blacklist.length > 0
        btn_blockPlayerAll.text = StrVal.LYSETTING.STR38
        btn_blockPlayerAll.clearClick()
        btn_blockPlayerAll.onClick(() => {
            UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                StrVal.LYSETTING.STR43, null,
                StrVal.COMMON.STR32, null,
                StrVal.COMMON.STR33, () => {
                    UtilsUI.lockWait();
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait();
                        if (args.errorcode == 0) {
                            this.onBlacklist()
                        } else {
                            UtilsUI.showMsgTip(args.errorcode);
                        }
                    }, "blockPlayer", { flag: 0 });
                }, "", null)
        })
    }


    public getIsViewMask(): boolean {
        return false;
    };

}