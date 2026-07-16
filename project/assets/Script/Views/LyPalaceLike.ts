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
import { GameServer } from "../Kernel/GameServer";
import { UtilsUI, simplePlayerBase } from "../Kernel/UtilsUI";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { PErrCode } from "../Values/PErrCode";
import { GameServerData } from "../Kernel/GameServerData";

export interface PalaceLikeData {
    palaceIds?:Array<string>, // 入住宫殿ID（如果没有则是大厅、宫殿内点赞）
    playerId:string, // 玩家ID
    grantId:string, // 问候语ID
    stone?:string, // 点赞获得钻石
    doneCall?:Function,
}

export class LyPalaceLike extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPalaceLike;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyPalaceLike;
        this.viewResI.comName = "LyPalaceLike";
    }

    public static isIgnoreGrant:boolean;

    private params:PalaceLikeData;
    private coldCD:number;

    public onViewCreate(__params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        this.params = __params;
        this.coldCD = 1;

        // 关闭
        let btn_back = uiPanel.getChild("btn_back", fgui.GButton);
        btn_back.onClick(() => {
            if (this.coldCD <= 0) {
                if (this.params.palaceIds) {
                    LyPalaceLike.sendPalaceLike(() => {
                        this.viewDestroy();
                    }, this.params.playerId);
                } else {
                    this.viewDestroy();
                }
            }
        })

        let btn_check = group_main.getChild("btn_check", fgui.GButton);
        btn_check.text = StrVal.LYPALACE.STR14;
        btn_check.onClick(() => {
            if (btn_check.selected) {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "", 
                StrVal.LYPALACE.STR15, null, 
                StrVal.COMMON.STR32, () => {
                    btn_check.selected = false;
                }, 
                StrVal.COMMON.STR33, () => {
                    LyPalaceLike.sendPalaceLikeSkipAll(() => {
                        LyPalaceLike.isIgnoreGrant = true;
                        this.viewDestroy();
                    });
                }, "", null)
            }
        })
        if (!this.params.palaceIds) { // 大厅、宫殿点赞
            btn_check.visible = false;
        }

        let grantItem = LocaleData.getPalaceGrantItem(this.params.grantId);
        // 祝福语
        let label_greeting = group_main.getChild("label_greeting", fgui.GTextField);
        label_greeting.text = grantItem.text;
        // 钻石
        let label_stone = group_main.getChild("label_stone", fgui.GTextField);
        if (this.params.stone) {
            label_stone.text = UtilsTool.stringFormat("+{0}", [this.params.stone]);
        } else {
            label_stone.visible = false;
            group_main.getChild("loader_icon", fgui.GLoader).visible = false;
        }

        // 空白
        let label_tips = group_main.getChild("label_tips", fgui.GTextField);
        label_tips.text = StrVal.COMMON.STR9;

        this.setTimeout(() => {
            this.coldCD = 0;
        }, this.coldCD)

        this.sendPlayerModel(this.params.playerId);
    }

    private sendPlayerModel(playerId:string): void {
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                this.updatePlayerModel(args.playerInformation);
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "queryPlayerInfo", {
            guid: playerId
        })
    }

    private updatePlayerModel(playerInfo:any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            // spp.playAnimation("Stand", true);
        }, group_main.getChild("loader_spine"), VarVal.UI_EFF_NAME.spine_quanping_saqian);

        let simpleBase:simplePlayerBase = playerInfo.simpleBase;

        // 名字
        let label_name = group_main.getChild("label_name", fgui.GTextField);
        label_name.text = simpleBase.name;

        // 区服
        let label_server = group_main.getChild("label_server", fgui.GTextField);
        let serverItem = PlatformAPI.getGameServerItem(simpleBase.serverid);
        if (serverItem) {
            label_server.text = serverItem.name;
        } else {
            label_server.text = StrVal.LYQUNYIN.STR30;
        }

        // 境界
        let loader_phase: fgui.GComponent = group_main.getChild("loader_phase")
        UtilsUI.setTitleIconByTitleId(loader_phase, simpleBase.phase);

        // 称号
        let loader_title: fgui.GComponent = group_main.getChild("loader_title")
        if (this.params.palaceIds) {
            if (this.params.palaceIds.length > 1) {
                this.playTitleAni(group_main, 0);
            } else {
                let palaceItem = LocaleData.getPalaceItem(this.params.palaceIds[0]);
                UtilsUI.setTitleIconByTitleId(loader_title, null, palaceItem.titleId);
            }
        } else {
            UtilsUI.setTitleIconByTitleId(loader_title, null, simpleBase.title);
        }

        // 模型
        let charInfo = LocaleData.getCharShowResInfo(simpleBase.character, simpleBase.phase, simpleBase.appearance, simpleBase.avatar);
        let mountInfo = LocaleData.getMountShowResInfo(simpleBase.mountType, simpleBase.mountSkin);
        new SpineRoldMountPlayer(group_main.getChild("group_spine_ram")).loadSpineRole(charInfo).loadSpineMount(mountInfo);

        // 宠物
        if (playerInfo.petInfo && playerInfo.petInfo.protoId) {
            let petProto = LocaleData.getPetProto(playerInfo.petInfo.protoId);
            new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }, group_main.getChild("loader_spine_pet1"), petProto.modelId);
        }
    }

    private playTitleAni(group_main:fgui.GComponent, idx:number): void {
        let sel:number = idx;
        let selnew:number = sel + 1;

        let loader_title: fgui.GComponent = group_main.getChild("loader_title")
        let palaceItem = LocaleData.getPalaceItem(this.params.palaceIds[sel]);
        UtilsUI.setTitleIconByTitleId(loader_title, null, palaceItem.titleId);

        let loader_title_new: fgui.GComponent = group_main.getChild("loader_title_new")
        let palaceItemNew = LocaleData.getPalaceItem(this.params.palaceIds[selnew]);
        UtilsUI.setTitleIconByTitleId(loader_title_new, null, palaceItemNew.titleId);

        group_main.getTransition("title").play(() => {
            if (idx + 2 < this.params.palaceIds.length) {
                this.playTitleAni(group_main, idx + 1);
            }
        })
    }

    private viewDestroy(): void {
        if (this.params.doneCall) {
            this.params.doneCall();
        }
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPalaceLike, 0, null);
    }
    
    public getIsViewMask(): boolean {
        return false;
    }

    private static sendPalaceLike(callback:Function, playerId:string, isSkip?:boolean): void {
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                if (!isSkip) {
                    UtilsUI.showItemReward({bonuseItems:[UtilsUI.getBonuseItem(VarVal.bonusType.stone, null, null, String(args.stone))]});
                }
            } else {
                // 当收到事件时未过期，点赞时已过期的特殊处理。
                if (args.errorcode == PErrCode.palace_grant_expire) {
                    if (!isSkip) {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                    GameServerData.getInstance().setPalaceLikeExpire(playerId);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }
            if (callback) {
                callback();
            }
        }, "palaceLike", {
            likeType: 3,
            param: playerId,
            skipGrant: isSkip
        })
    }

    public static sendPalaceLikeSkipAll(callback?:Function): void {
        let grantInfos = GameServerData.getInstance().getGrantInfo(true);
        let count = grantInfos.length;
        for (let i = 0; i < grantInfos.length; i++) {
            LyPalaceLike.sendPalaceLike(() => {
                count--;
                if (count == 0) {
                    if (callback) {
                        callback();
                    }
                }
            }, grantInfos[i].playerId, true);
        }
    }
}