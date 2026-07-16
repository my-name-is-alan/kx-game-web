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
import { GameServerData } from "../Kernel/GameServerData";
import { LyChatRoom } from "./LyChatRoom";
import { LyPalaceRank } from "./LyPalaceRank";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI, playerInformation } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { PalaceLikeData, LyPalaceLike } from "./LyPalaceLike";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { PointRedData } from "../Kernel/PointRedData";

export class LyPalaceRoom extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPalace;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyPalace;
        this.viewResI.comName = "LyPalaceRoom";
    }

    private palaceItem:any;

    private group_chat: fgui.GComponent;
    private palaceInfos:Array<any>;
    private selectIndex:number;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        this.palaceItem = params.palaceItem;
        this.palaceInfos = GameServerData.getInstance().getPalaceInfos(this.palaceItem.id);
        this.selectIndex = 0;

        let graph_player = group_main.getChild("graph_player", fgui.GGraph);
        graph_player.onClick(() => {
            if (this.palaceInfos.length > 0) {
                let palaceInfo = this.palaceInfos[this.selectIndex];
                UtilsUI.onShowPlayerInfo(palaceInfo.playerId);
            }
        })

        // 箭头
        let btn_arrowbigL = group_main.getChild("btn_arrowbigL", fgui.GButton);
        btn_arrowbigL.onClick(() => {
            if (this.selectIndex > 0) {
                this.selectIndex--;
                this.showSelectIndex();
            }
        })
        let btn_arrowbigR = group_main.getChild("btn_arrowbigR", fgui.GButton);
        btn_arrowbigR.onClick(() => {
            if (this.selectIndex < this.palaceInfos.length - 1) {
                this.selectIndex++;
                this.showSelectIndex();
            }
        })

        // 关闭
        let btn_close = uiPanel.getChild("btn_close", fgui.GButton);
        btn_close.getChild("loader_name", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyPalace/word_{0}",[this.palaceItem.id]);
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPalaceRoom, 0, null);
        })

        // 英豪路
        let btn_yinghaolu = uiPanel.getChild("btn_yinghaolu", fgui.GButton);
        btn_yinghaolu.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPalaceRank, 0, {recordInfos:args.palaceHistoryInfo, palaceInfos:this.palaceInfos});
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "palaceGetHistoryInfo", {
                palaceId: Number(this.palaceItem.id)
            })
        })

        // 点赞
        let btn_dianzan = uiPanel.getChild("btn_dianzan", fgui.GButton);
        let likeState:number;
        let updateCheck = () => {
            likeState = GameServerData.getInstance().getSelfPalaceLike(this.palaceItem.id);
            btn_dianzan.getController("c1").selectedIndex = (likeState == 1 ? 0 : 1);
            PointRedData.getInstance().updateManualPoint(btn_dianzan, likeState == 1);
        }
        updateCheck();
        btn_dianzan.onClick(() => {
            if (likeState == 2) {
                UtilsUI.showMsgTip(StrVal.LYPALACE.STR2);
            } else if (likeState == 1) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        updateCheck();
                        this.showLyPalaceLike(String(args.stone));
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "palaceLike", {
                    likeType: 2,
                    param: this.palaceItem.id
                })
            }
        })
        btn_dianzan.visible = this.palaceInfos.length > 0;
        // 这个事件后到了，哎。
        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == VarVal.ACTIVITY_ID.PALACE) {
                updateCheck();
            }
        }, "activityStateChanged");

        this.group_chat = uiPanel.getChild("group_chat")
        this.group_chat.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyChatRoom, 0, {activityId:null});
        })
        this.showChatRoomLast();

        let img_empty:fgui.GImage = uiPanel.getChild("img_empty");
        let loader_title:fgui.GComponent = uiPanel.getChild("loader_title");
        UtilsUI.setTitleIconByTitleId(loader_title, null, this.palaceItem.titleId);
        // 先清除内容。
        group_main.visible = this.palaceInfos.length > 0;
        img_empty.visible = this.palaceInfos.length == 0;
        loader_title.visible = img_empty.visible;
        this.showSelectIndex();
    }

    private showLyPalaceLike(likestone:string) {
        let doCallReward = () => {
            let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.stone, null, null, likestone);
            UtilsUI.showItemReward({bonuseItems:[bonuseItem]});
        }
        let pppId:string;
        if (this.palaceInfos.length > 0) {
            pppId = this.palaceInfos[0].playerId;
        }
        if (pppId) {
            let randItems = LocaleData.getPalaceGrantItems();
            let params:PalaceLikeData = {
                playerId: pppId,
                grantId: randItems[UtilsTool.random(0, randItems.length - 1)].id,
                stone: likestone,
                doneCall: doCallReward
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPalaceLike, 0, params);
        } else {
            doCallReward();
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

    private showSelectIndex(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        if (this.palaceInfos.length > 0) {
            let palaceInfo = this.palaceInfos[this.selectIndex];
            this.sendPlayerModel(palaceInfo);

            let btn_arrowbigL = group_main.getChild("btn_arrowbigL", fgui.GButton);
            btn_arrowbigL.visible = this.selectIndex != 0;
            let btn_arrowbigR = group_main.getChild("btn_arrowbigR", fgui.GButton);
            btn_arrowbigR.visible = this.selectIndex != (this.palaceInfos.length - 1);
        }
    }

    private sendPlayerModel(palaceInfo:any): void {
        this.updatePlayerModel(palaceInfo);
    }
    /*
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
    */
    private updatePlayerModel(palaceInfo:any): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let simpleBase = palaceInfo.playerInfo;

        // 等级
        let label_level = group_main.getChild("label_level", fgui.GTextField);
        label_level.text = UtilsTool.stringFormat(StrVal.LYPALACE.STR4, [simpleBase.level]);

        // 名字
        let label_name = group_main.getChild("label_name", fgui.GTextField);
        label_name.text = simpleBase.name;

        // 区服
        let label_server = group_main.getChild("label_server", fgui.GTextField);
        let serverItem = PlatformAPI.getGameServerItem(simpleBase.serverId);
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
        UtilsUI.setTitleIconByTitleId(loader_title, null, this.palaceItem.titleId);

        // 模型
        let charInfo = LocaleData.getCharShowResInfo(simpleBase.character, simpleBase.phase, simpleBase.appearance, simpleBase.avatar);
        let mountInfo = LocaleData.getMountShowResInfo(simpleBase.mountType, simpleBase.mountSkin);
        new SpineRoldMountPlayer(group_main.getChild("group_spine_ram")).loadSpineRole(charInfo).loadSpineMount(mountInfo);

        // 宠物
        let loader_spine_pet1 = group_main.getChild("loader_spine_pet1", fgui.GLoader3D);
        if (simpleBase.summonPetProtoId) {
            let petProto = LocaleData.getPetProto(simpleBase.summonPetProtoId);
            new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }, loader_spine_pet1, petProto.modelId);
        } else {
            loader_spine_pet1.freeSpine();
        }

        // 精怪
        let loader_spine_elite1 = group_main.getChild("loader_spine_elite1", fgui.GLoader3D);
        let loader_spine_elite2 = group_main.getChild("loader_spine_elite2", fgui.GLoader3D);
        let loader_spine_elite3 = group_main.getChild("loader_spine_elite3", fgui.GLoader3D);
        loader_spine_elite1.freeSpine();
        loader_spine_elite2.freeSpine();
        loader_spine_elite3.freeSpine();
        if (simpleBase.elitemonster && simpleBase.elitemonster.length > 0) {
            if (simpleBase.elitemonster.length == 1) {
                let eliteProto1 = LocaleData.getEliteMonsterProto(simpleBase.elitemonster[0].protoId);
                new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                }, loader_spine_elite2, eliteProto1.modelId);
            } else {
                let eliteProto1 = LocaleData.getEliteMonsterProto(simpleBase.elitemonster[0].protoId);
                new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                }, loader_spine_elite1, eliteProto1.modelId);

                let eliteProto2 = LocaleData.getEliteMonsterProto(simpleBase.elitemonster[1].protoId);
                new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                }, loader_spine_elite2, eliteProto2.modelId);
                
                if (simpleBase.elitemonster.length > 2) {
                    let eliteProto = LocaleData.getEliteMonsterProto(simpleBase.elitemonster[2].protoId);
                    new SpinePlayer().loadSpineByModelId((spp:SpinePlayer) => {
                        spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                    }, loader_spine_elite3, eliteProto.modelId);
                }
            }
        } else {
            
        }
    }
}