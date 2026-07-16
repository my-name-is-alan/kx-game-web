//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { AudioManager } from "../Kernel/AudioManager";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { LocaleUser } from "../Kernel/LocaleUser";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyCharacter } from "./LyCharacter";
import { LyDetailAttr, LyDetailAttrType } from "./LyDetailAttr";
import { LyLoginNotice } from "./LyLoginNotice";
import { LySettingBlacklist } from "./LySettingBlacklist";
import { LySettingMsgBox } from "./LySettingMsgBox";
import { LySettingWarn } from "./LySettingWarn";
import { LyPalaceGrant } from "./LyPalaceGrant";
import { GameServer } from "../Kernel/GameServer";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { LyPalaceLike } from "./LyPalaceLike";

export class LySetting extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LySetting";
        this.viewResI.pkgName = "LySetting";
        this.viewResI.comName = "LySetting";
    }
    private label_name: fgui.GLabel
    private label_level: fgui.GLabel
    private img_icon: fgui.GLoader
    private label_faction: fgui.GLabel
    private img_avatarBorder: fgui.GLoader
    public onViewCreate(params): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel().getChild("group_main")
        UtilsUI.playCommonGroupAni(uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LySetting, 0, null);
        })
        let btn_close1: fgui.GButton = this.getUiPanel().getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LySetting, 0, null);
        })
        let fullInfo: any = GameServerData.getInstance().getPlayerFullInfo()
        let label_sz: fgui.GLabel = uiPanel.getChild("label_sz")
        label_sz.text = StrVal.LYSETTING.STR1
        let label_attr: fgui.GTextField = uiPanel.getChild("label_attr")
        label_attr.text = StrVal.LYSETTING.STR28
        label_attr.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDetailAttr, 0, { type: LyDetailAttrType.MAINPAGE });
        })
        this.label_name = uiPanel.getChild("label_name")
        this.label_level = uiPanel.getChild("label_level")
        this.label_faction = uiPanel.getChild("label_faction")
        this.img_icon = uiPanel.getChild("img_icon")

        this.img_avatarBorder = uiPanel.getChild("img_avatarBorder")
        let label_uid: fgui.GLabel = uiPanel.getChild("label_uid")
        label_uid.text = UtilsTool.stringFormat(StrVal.LYSETTING.STR2, [fullInfo.base.uid])

        let label_server: fgui.GLabel = uiPanel.getChild("label_server")
        label_server.text = UtilsTool.stringFormat(StrVal.LYSETTING.STR25, [GameServer.getLoginParams().serverItem.name])

        let label_ip: fgui.GLabel = uiPanel.getChild("label_ip")
        PlatformAPI.getIPAddress((address: string) => {
            if (label_ip && !label_ip.isDisposed && address) {
                label_ip.text = UtilsTool.stringFormat(StrVal.LYSETTING.STR41, [address]);
            }
        }, fullInfo.base.ip);

        let label_beian: fgui.GLabel = uiPanel.getChild("label_beian")
        label_beian.text = UtilsTool.stringFormat(StrVal.LYSETTING.STR40, ["WCLDSG"])
        let label_versions: fgui.GLabel = uiPanel.getChild("label_versions")
        label_versions.text = UtilsTool.stringFormat(StrVal.LYSETTING.STR19, [PlatformAPI.getProtocolVersion()])
        label_versions.onClick(() => {
            PlatformAPI.startHdhiveBindFlow();
        })
        PlatformAPI.refreshHdhiveStatus((st: any) => {
            if (label_versions.isDisposed) {
                return;
            }
            let bindTip = (st && st.bound) ? StrVal.LYSETTING.STR50 : StrVal.LYSETTING.STR51;
            label_versions.text = UtilsTool.stringFormat(StrVal.LYSETTING.STR19, [PlatformAPI.getProtocolVersion()]) + "  " + bindTip;
        })
        let group_item: fgui.GComponent = uiPanel.getChild("group_item")
        let btn_copy: fgui.GButton = uiPanel.getChild("btn_copy")
        btn_copy.onClick(() => {
            PlatformAPI.doSdkCopyToClipboard((errmsg: string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                } else {
                    UtilsUI.showMsgTip(StrVal.LYSETTING.STR32);
                }
            }, String(fullInfo.base.uid))
        })

        let btn_langyacifu: fgui.GButton = uiPanel.getChild("btn_langyacifu")
        PointRedData.getInstance().registerPoint(btn_langyacifu, PointRedType.LyPalaceGrant);
        let palacestate: number;
        let dolangyacifu = () => {
            palacestate = GameServerData.getInstance().getSelfPalaceState();
            btn_langyacifu.grayed = (palacestate != 1);
        }
        dolangyacifu();
        btn_langyacifu.onClick(() => {
            if (palacestate == 0) {
                UtilsUI.showMsgTip(StrVal.LYSETTING.STR42);
            } else if (palacestate == 1) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPalaceGrant, 0, {
                    doneCall: () => {
                        dolangyacifu();
                    }
                });
            } else {
                UtilsUI.showMsgTip(StrVal.LYSETTING.STR45);
            }
        })

        let btn_rename: fgui.GButton = uiPanel.getChild("btn_rename")
        btn_rename.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LySettingMsgBox, 0, { type: 1 });
        })

        let btn_character: fgui.GButton = uiPanel.getChild("btn_character")
        btn_character.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCharacter, 0, null);
        })
        this.img_avatarBorder.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCharacter, 0, null);
        })

        let btn_music: fgui.GButton = uiPanel.getChild("btn_music")
        btn_music.text = StrVal.LYSETTING.STR5
        btn_music.selected = LocaleUser.getGlobal(VarVal.FIELD_SV.AUDIO_BGM_ENABLED) == "1"
        btn_music.onClick(() => {
            LocaleUser.setGlobal(VarVal.FIELD_SV.AUDIO_BGM_ENABLED, btn_music.selected ? "1" : "0");
            LocaleUser.flush()
            AudioManager.setBGMEnabled(btn_music.selected)
        })

        let btn_soundEffect: fgui.GButton = uiPanel.getChild("btn_soundEffect")
        btn_soundEffect.selected = LocaleUser.getGlobal(VarVal.FIELD_SV.AUDIO_EFT_ENABLED) == "1"
        btn_soundEffect.onClick(() => {
            LocaleUser.setGlobal(VarVal.FIELD_SV.AUDIO_EFT_ENABLED, btn_soundEffect.selected ? "1" : "0");
            LocaleUser.flush()
            AudioManager.setEFTEnabled(btn_soundEffect.selected)
        })
        btn_soundEffect.text = StrVal.LYSETTING.STR6

        let btn_grant: fgui.GButton = uiPanel.getChild("btn_grant")
        btn_grant.selected = !LyPalaceLike.isIgnoreGrant;
        btn_grant.onClick(() => {
            LyPalaceLike.isIgnoreGrant = !LyPalaceLike.isIgnoreGrant;
        })
        btn_grant.text = StrVal.LYSETTING.STR46

        let btn_notice: fgui.GButton = group_item.getChild("btn_notice")
        btn_notice.text = StrVal.LYSETTING.STR8
        btn_notice.onClick(() => {
            PlatformAPI.onAnnouncement((announcement: any) => {
                if (announcement) {
                    PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.LUNCH_NOTICE_VIEW);
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyLoginNotice, 0, { notice: announcement });
                } else {
                    UtilsUI.showMsgTip(StrVal.LYLOGIN.STR9);
                }
            })
        })

        let btn_kefu: fgui.GButton = group_item.getChild("btn_kefu")
        btn_kefu.text = StrVal.LYSETTING.STR11
        btn_kefu.onClick(() => {
            PlatformAPI.doSdkOpenKeFu((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            })
        })

        let btn_code: fgui.GButton = group_item.getChild("btn_code")
        btn_code.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LySettingMsgBox, 0, { type: 2 });
        })
        let btn_blacklist: fgui.GButton = group_item.getChild("btn_blacklist")
        btn_blacklist.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LySettingBlacklist, 0, null);
        })
        let btn_warn: fgui.GButton = group_item.getChild("btn_warn")
        btn_warn.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LySettingWarn, 0, null);
        })
        let btn_agreement: fgui.GButton = group_item.getChild("btn_agreement")
        btn_agreement.text = StrVal.LYSETTING.STR13
        btn_agreement.clearClick()
        btn_agreement.onClick(() => {
            PlatformAPI.doSdkCopyToClipboard((errmsg: string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                } else {
                    UtilsUI.showMsgTip(StrVal.LYSETTING.STR47);
                }
            }, PlatformAPI.getLinkAgreement())
        })
        let btn_policy: fgui.GButton = group_item.getChild("btn_policy")
        btn_policy.text = StrVal.LYSETTING.STR14
        btn_policy.clearClick()
        btn_policy.onClick(() => {
            PlatformAPI.doSdkCopyToClipboard((errmsg: string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                } else {
                    UtilsUI.showMsgTip(StrVal.LYSETTING.STR48);
                }
            }, PlatformAPI.getLinkPolicy())
        })
        let btn_server: fgui.GButton = uiPanel.getChild("btn_server")
        btn_server.text = StrVal.LYSETTING.STR16
        btn_server.onClick(() => {
            UtilsUI.restartGame();
        })
        let btn_sign: fgui.GButton = uiPanel.getChild("btn_sign")
        btn_sign.text = StrVal.LYSETTING.STR24
        btn_sign.onClick(() => {
            LocaleUser.setGlobal(VarVal.FIELD_SV.LOGIN_CH_ACC, "1");
            LocaleUser.flush();
            UtilsUI.restartGame();
        })
        this.initialize()
    };

    private initialize(): void {
        let fullInfo: any = GameServerData.getInstance().getPlayerFullInfo()
        this.label_name.text = fullInfo.base.name
        //升级信息
        let playerLevel: any = LocaleData.getPlayerGrowByLevel(fullInfo.base.level)
        //经验条
        this.label_level.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR3, [fullInfo.base.level, playerLevel.name])
        let charInfo = LocaleData.getCharShowResInfoSelf()


        this.img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon])
        //角色头像框
        this.img_avatarBorder.url = UtilsTool.stringFormat("ui://CCommon/head_{0}", [fullInfo.base.avatarBorder])

        if (GameServerData.getInstance().isClanHas()) {
            this.label_faction.text = UtilsTool.stringFormat(StrVal.LYSETTING.STR26, [fullInfo.clan.clanInfo.name])
        } else {
            this.label_faction.text = UtilsTool.stringFormat(StrVal.LYSETTING.STR26, [StrVal.LYSETTING.STR44])
        }
    }

    public onViewUpdate(params: any): void {
        this.initialize()
    }
    public getIsViewMask(): boolean {
        return false;
    };

}
