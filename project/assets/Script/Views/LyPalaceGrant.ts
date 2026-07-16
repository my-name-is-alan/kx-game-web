//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { VarVal } from "../Values/VarVal";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsUI } from "../Kernel/UtilsUI";

export class LyPalaceGrant extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPalace;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyPalace;
        this.viewResI.comName = "LyPalaceGrant";
    }

    private randItems:Array<any>;
    private selectItem:any;
    private label_desc:fgui.GTextField;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back = uiPanel.getChild("btn_back", fgui.GButton);
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPalaceGrant, 0, null);
        })

        let btn_close = group_main.getChild("btn_close", fgui.GButton);
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_title = group_main.getChild("label_title", fgui.GTextField);
        label_title.text = StrVal.LYPALACE.STR101;

        this.randItems = LocaleData.getPalaceGrantItems();
        this.label_desc = group_main.getChild("label_desc", fgui.GTextField);
        this.randIndex();

        let btn_rand = group_main.getChild("btn_rand", fgui.GButton);
        btn_rand.text = StrVal.LYPALACE.STR102;
        btn_rand.onClick(() => {
            this.randIndex()
        })

        let btn_send = group_main.getChild("btn_send", fgui.GButton);
        btn_send.text = StrVal.LYPALACE.STR103;
        btn_send.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    if (params.doneCall) {
                        params.doneCall();
                    }
                    UtilsUI.showItemReward({bonuseString: GameServerData.getInstance().bonusesResultsToString([{inserts:args.itemInserts}])});
                    btn_back.fireClick();
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "palaceGrant", {
                grantCfgId: Number(this.selectItem.id)
            })
        })
    }

    private randIndex(): void {
        this.selectItem = this.randItems[UtilsTool.random(0, this.randItems.length - 1)];
        this.label_desc.text = this.selectItem.text;
    }

    public getIsViewMask(): boolean {
        return false;
    }

    public static isViewRedPoint():boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.palace)) {
            return false;
        }
        let grantState = GameServerData.getInstance().getSelfPalaceState();
        return grantState == 1;
    }
}