//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { VarVal } from "../Values/VarVal";
import { StrVal } from "../Values/StrVal";
import { LyChatRoom } from "./LyChatRoom";
import { UtilsTool } from "../Kernel/UtilsTool";
import { LyGuideDetail } from "./LyGuideDetail";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { GameServer } from "../Kernel/GameServer";
import { LocaleUser } from "../Kernel/LocaleUser";
import { LyGrabCityTowerReward } from "./LyGrabCityTowerReward";

export class LyGrabCityTower extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGrabCity;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyGrabCity;
        this.viewResI.comName = "LyGrabCityTower";
    }

    MAX_BAOXIANG = 9;
    NEXT_TITLE = "ui://LyGrabCity/word_qianwangxiayiceng";
    CHONGZHI_TITLE = "ui://LyGrabCity/word_chongzhibaota";
    count:number;
    grabCityPlayer:any;
    activityXml:any;

    spinePlayers:Array<SpinePlayer>;

    group_chat: fgui.GComponent;
    btn_check_skip: fgui.GButton;

    public onViewCreate(params:any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main = uiPanel.getChild("group_main", fgui.GComponent);

        this.activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.GRABCITY);
        this.grabCityPlayer = GameServerData.getInstance().getGrabCityPlayer();

        // 关闭
        let btn_close: fgui.GButton = uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGrabCityTower, 0, null);
        })

        // 描述
        let btn_detail = uiPanel.getChild("btn_detail", fgui.GButton);
        btn_detail.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:this.activityXml.towerName, detail:this.activityXml.detailTower});
        })

        let btn_reward: fgui.GButton = uiPanel.getChild("btn_reward");
        btn_reward.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGrabCityTowerReward, 0, null);
        })

        let label_tips: fgui.GTextField = uiPanel.getChild("label_tips");
        label_tips.text = StrVal.LYGRABCITY.STR401;

        this.btn_check_skip = uiPanel.getChild("btn_check_skip", fgui.GButton);
        this.btn_check_skip.text = StrVal.LYGRABCITY.STR402;
        this.btn_check_skip.onClick(() => {
            if (this.btn_check_skip.selected) {
                LocaleUser.setUser(VarVal.FIELD_SV.GRABCITY_SKIP, "1");
            } else {
                LocaleUser.setUser(VarVal.FIELD_SV.GRABCITY_SKIP, "0");
            }
            LocaleUser.flush();
        })
        this.btn_check_skip.selected = (LocaleUser.getUser(VarVal.FIELD_SV.GRABCITY_SKIP) == "1");

        let btn_check_auto = uiPanel.getChild("btn_check_auto", fgui.GButton);
        btn_check_auto.text = StrVal.LYGRABCITY.STR403;
        btn_check_auto.onClick(() => {
            if (this.grabCityPlayer.playerInfo.towerTier <= 1) {
                btn_check_auto.selected = false;
                return UtilsUI.showMsgTip(StrVal.LYGRABCITY.STR408);
            }
            if (btn_check_auto.selected) {
                let proto = LocaleData.getItemProto(VarVal.bonusType.grabCityDraw);
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "", 
                UtilsTool.stringFormat(StrVal.LYGRABCITY.STR409, [proto.name]), null, 
                StrVal.COMMON.STR32, () => {
                    btn_check_auto.selected = false;
                }, 
                StrVal.COMMON.STR33, () => {
                    btn_check_auto.selected = false;
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.doSiegeTowerAniAll(() => {
                                UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString(args.bonusesResult)});
                                this.resetShow();
                            });
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    }, "siegeTowerAllOpen", null)
                }, "", null)
            }
        })

        // 聊天框
        this.group_chat = uiPanel.getChild("group_chat")
        this.group_chat.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyChatRoom, 0, {activityId:null});
        })
        this.showChatRoomLast();

        let loader_icon:fgui.GLoader = group_main.getChild("loader_icon");
        loader_icon.url = UtilsUI.getItemIconUrl(VarVal.bonusType.grabCityDraw);

        let btn_next: fgui.GButton = uiPanel.getChild("btn_next");
        btn_next.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.resetShow();
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "siegeTowerNext", null)
        })

        this.spinePlayers = Array<SpinePlayer>(this.MAX_BAOXIANG);
        for (let i = 0; i < this.MAX_BAOXIANG; i++) {
            let site = i + 1;
            let group_baoxiang = group_main.getChild("group_baoxiang" + String(site), fgui.GComponent);
            new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                this.spinePlayers[i] = spp;
                this.resetTowerOpen(site);
            }, group_baoxiang.getChild("loader_spine", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_jiuchong_baoxiang);
            this.fillSiegeTowerItem(site);
            group_baoxiang.getChild("graph_click").onClick(() => {
                if (!this.isTowerOpenData(site)) {
                    this.doSiegeTowerOpen(site);
                }
            })
        }

        this.updateItemCount();
    }

    private resetShow(): void {
        this.grabCityPlayer = GameServerData.getInstance().getGrabCityPlayer();
        for (let i = 0; i < this.MAX_BAOXIANG; i++) {
            let site = i + 1;
            this.resetTowerOpen(site);
            this.fillSiegeTowerItem(site);
        }
        this.updateItemCount();
    }

    private doSiegeTowerAniAll(doneCall:Function, site?:number): void {
        if (!this.btn_check_skip.selected) {
            if (!site) {
                site = 1;
                for (let i = 0; i < this.MAX_BAOXIANG; i++) {
                    let _site = i + 1;
                    this.resetTowerOpen(_site, true);
                    this.fillSiegeTowerItem(_site, true);
                }
            }
            if (this.spinePlayers[site - 1]) {
                UtilsUI.lockMask();
                this.spinePlayers[site - 1].playAnimation("open", false, null, null, () => {
                    UtilsUI.unlockMask();
                    this.spinePlayers[site - 1].playAnimation("stand_on", true);
                    this.doSiegeTowerAniAll(doneCall, site + 1);
                });
            } else {
                if (site > this.MAX_BAOXIANG) {
                    doneCall();
                } else {
                    this.doSiegeTowerAniAll(doneCall, site + 1);
                }
            }
        } else {
            doneCall();
        }
    }

    private isTowerOpenData(site:number): boolean {
        let _tower:Array<number> = this.grabCityPlayer.playerInfo.tower;
        if (_tower) {
            return (_tower[site - 1] == 1);
        }
        return false;
    }

    private getTowerOpenData(site:number): string {
        let _tower_Log:Array<string> = this.grabCityPlayer.playerInfo.towerLog;
        if (_tower_Log) {
            return _tower_Log[site - 1];
        }
    }

    private resetTowerOpen(site:number, forceHide?:boolean): void {
        let spp = this.spinePlayers[site - 1];
        if (spp) {
            if (forceHide) {
                spp.playAnimation("stand_off", true);
            } else {
                spp.playAnimation(this.isTowerOpenData(site) ? "stand_on" : "stand_off", true);
            }
        }
    }

    private fillSiegeTowerItem(site:number, forceHide?:boolean): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main = uiPanel.getChild("group_main", fgui.GComponent);
        let group_baoxiang = group_main.getChild("group_baoxiang" + String(site), fgui.GComponent);
        let group_item = group_baoxiang.getChild("group_item", fgui.GComponent);
        if (forceHide) {
            group_item.visible = false;
        } else {
            let data = this.getTowerOpenData(site);
            if (data) {
                group_item.visible = true;
                let ttt = data.split(",");
                if (ttt[0].length > 1) {
                    UtilsUI.setUIGroupItem(UtilsUI.getBonuseItem(VarVal.bonusType.item, null, ttt[0], ttt[1]), group_item, null);
                } else {
                    UtilsUI.setUIGroupItem(UtilsUI.getBonuseItem(ttt[0], null, null, ttt[1]), group_item, null);
                }
            } else {
                group_item.visible = false;
            }
        }
    }

    private doSiegeTowerAni(site:number, args:any): void {
        this.fillSiegeTowerItem(site);
        this.updateItemCount();
        UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString(args.bonusesResult)});
    }

    private doSiegeTowerOpen(site:number): void {
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                this.grabCityPlayer = GameServerData.getInstance().getGrabCityPlayer();
                if (this.spinePlayers[site - 1] && !this.btn_check_skip.selected) {
                    UtilsUI.lockMask();
                    this.spinePlayers[site - 1].playAnimation("open", false, null, null, () => {
                        UtilsUI.unlockMask();
                        this.spinePlayers[site - 1].playAnimation("stand_on", true);
                        this.doSiegeTowerAni(site, args);
                    });
                } else {
                    this.resetTowerOpen(site);
                    this.doSiegeTowerAni(site, args);
                }
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "siegeTowerOpen", {
            site: site
        })
    }

    private updateItemCount(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel()
        let group_main = uiPanel.getChild("group_main", fgui.GComponent)

        let label_name: fgui.GTextField = group_main.getChild("label_name");
        label_name.text = UtilsTool.stringFormat(StrVal.LYGRABCITY.STR404, [this.grabCityPlayer.playerInfo.towerTier]);

        this.count = GameServerData.getInstance().getValueTypeCount(VarVal.bonusType.grabCityDraw);

        let label_count:fgui.GTextField = group_main.getChild("label_count");
        label_count.text = UtilsTool.stringFormat("{0}/{1}", [this.count, this.grabCityPlayer.playerInfo.towerTier]);
        // label_count.color = UtilsUI.getEnoughColor(this.count >= this.grabCityPlayer.playerInfo.towerTier);

        let btn_next: fgui.GButton = uiPanel.getChild("btn_next");
        btn_next.visible = (this.grabCityPlayer.playerInfo.towerOpen == 1);
        if (this.grabCityPlayer.playerInfo.towerTier == this.MAX_BAOXIANG) {
            btn_next.icon = this.CHONGZHI_TITLE;
        } else {
            btn_next.icon = this.NEXT_TITLE;
        }
    }

    // 聊天
    private showChatRoomLast(): void {
        let label_content = this.group_chat.getChild("label_content", fgui.GTextField);
        let chatmsg = LyChatRoom.getChatShowMainPage();
        if (chatmsg) {
            label_content.text = chatmsg;
        } else {
            label_content.text = "";
        }
    }

    /**
     * 当主界面要被某处刷新时。
     */
    public onViewUpdate(params: any): void {
        if (params && params.isChatRoomMsg) {
            this.showChatRoomLast();
        }
    }

    public getIsViewMask(): boolean {
        return false;
    }

    public static isViewRedPoint():boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.GrabCity)) {
            return false;
        }
        let count:number = GameServerData.getInstance().getValueTypeCount(VarVal.bonusType.grabCityDraw);
        return count > 0;
    }
}