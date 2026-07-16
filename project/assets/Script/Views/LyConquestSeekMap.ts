//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { Asset, EventTouch, math, v3, Vec2, Vec3 } from "cc";
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { ConquestState } from "./LyConquestSeek";

//怪物实体
interface monsterEntity {
    id: number,//玩家id
    x: number,
    y: number,
    hp: number,//血量
    monsterForkId: number,//怪物生成id
}
export class LyConquestSeekMap extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyConquestSeek";
        this.viewResI.pkgName = "LyConquestSeek";
        this.viewResI.comName = "LyConquestSeekMap";
    }
    private mapMovePos: Vec2
    private monstersArr = []
    private playersArr = []
    private uiPanel: fgui.GComponent
    private group_map: fgui.GComponent
    private monstersData
    private params: any
    public onViewCreate(params): void {
        this.params = params
        this.uiPanel = this.getUiPanel()
        // UtilsUI.playCommonGroupAni(this.uiPanel, null)
        this.setViewBehaviour(true);
        // 关闭
        let btn_close = this.getUiPanel().getChild("btn_close")
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyConquestSeekMap, 0, null)
        })
        this.onEvent()
        this.initialize()
        this.onShowPlayer()
    };

    private onEvent(): void {
        this.registerRequest((args) => {
            let monstersData = []
            let playersData = []
            for (let i = 0; i < args.monsters.length; i++) {
                let item = {
                    data: args.monsters[i],
                    comp: null
                }
                monstersData.push(item)
            }
            for (let i = 0; i < args.players.length; i++) {
                let item = {
                    data: args.players[i],
                    comp: null
                }
                playersData.push(item)
            }
            for (let i = 0; i < monstersData.length; i++) {
                const item1 = monstersData[i];
                for (let j = 0; j < this.monstersArr.length; j++) {
                    const item2 = this.monstersArr[j];
                    if (item1.data.monsterForkId == item2.data.monsterForkId) {
                        item1.comp = this.monstersArr[j].comp
                    }
                }
            }
            this.monstersArr = monstersData
            for (let i = 0; i < playersData.length; i++) {
                const item1 = playersData[i];
                for (let j = 0; j < this.playersArr.length; j++) {
                    const item2 = this.playersArr[j];
                    if (item1.data.id == item2.data.id) {
                        item1.comp = this.playersArr[j].comp
                    }
                }
            }
            this.playersArr = playersData
            this.onShowMonsters()
        }, "onConquestSceneChange");
        this.registerRequest((args) => {
            let conquestInfo = GameServerData.getInstance().getConquestInfo();
            if (conquestInfo.activityInfo.phase == ConquestState.OVER) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyConquestSeekMap, 0, null)
            }
        }, "onConquestPhaseChange");
    }
    private initialize(): void {
        this.group_map = this.uiPanel.getChild("group_map")
        this.group_map.on(fgui.Event.CLICK, (context) => {
            this.group_select.x = (context.pos.x + this.group_map.scrollPane.posX * 0.4) * 2.5
            this.group_select.y = (context.pos.y + this.group_map.scrollPane.posY * 0.4) * 2.5 - 330
        })

        let btn_conquestTP: fgui.GButton = this.uiPanel.getChild("btn_conquestTP")
        btn_conquestTP.clearClick()
        btn_conquestTP.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyConquestSeekMap, 0, null)
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "conquestTP", { x: Math.round(this.group_select.x), y: Math.round(this.group_select.y) })
        })
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let conquestPlayer = fullInfo.conquestPlayer
        //----------地图大小---------
        let group_scene: fgui.GImage = this.group_map.getChild("group_scene")
        let group_bg: fgui.GImage = this.group_map.getChild("group_bg")
        let scene = LocaleData.getConquestSceneById(conquestPlayer.activityInfo.sceneId)//
        group_scene.width = Number(scene.width)
        group_scene.height = Number(scene.height)
        group_bg.width = Number(scene.width)
        group_bg.height = Number(scene.height)
        this.monstersArr = []
        this.playersArr = []
        for (let i = 0; i < conquestPlayer.scene.monsters.length; i++) {
            let item = {
                data: conquestPlayer.scene.monsters[i],
                comp: null
            }
            this.monstersArr.push(item)
        }
        for (let i = 0; i < conquestPlayer.scene.players.length; i++) {
            let item = {
                data: conquestPlayer.scene.players[i],
                comp: null
            }
            this.playersArr.push(item)
        }
        this.onShowMonsters()
    }
    private onShowMonsters(): void {
        for (let i = 0; i < this.monstersArr.length; i++) {
            const element = this.monstersArr[i];
            if (element.comp) {
                element.comp.setPosition(element.data.x, element.data.y)
                let currentTime: number = GameServerData.getInstance().getServerTime()
                let monster = LocaleData.getConquestMonsterById(element.data.id)
                if (monster.quality == "3") {
                    let time = element.data.showTime - currentTime
                    if (time > 0) {
                        let timeCall = this.setInterval(() => {
                            time--
                            if (time > 0) {
                                element.comp.text = UtilsTool.parseTimeToString(time)
                            } else {
                                element.comp.text = monster.name
                                this.clearInterval(timeCall)
                            }
                        }, 1000);
                    } else {
                        element.comp.text = monster.name
                    }
                }

            } else {
                let group_point: fgui.GButton = fgui.UIPackage.createObject("LyConquestSeek", "group_point") as fgui.GButton;
                let monster = LocaleData.getConquestMonsterById(element.data.id)
                if (monster.quality != "1") {
                    if (monster.quality == "2") {
                        group_point.icon = "ui://LyConquestSeek/frame_xiaoguai"
                    } else if (monster.quality == "3") {
                        group_point.icon = "ui://LyConquestSeek/frame_shouling"
                        let currentTime: number = GameServerData.getInstance().getServerTime()
                        let time = element.data.showTime - currentTime
                        if (time > 0) {
                            let timeCall = this.setInterval(() => {
                                time--
                                if (time > 0) {
                                    group_point.text = UtilsTool.parseTimeToString(time)
                                } else {
                                    group_point.text = monster.name
                                    this.clearInterval(timeCall)
                                }
                            }, 1000);
                        } else {
                            group_point.text = monster.name
                        }
                    }
                    group_point.setPosition(element.data.x, element.data.y)
                    group_point.scaleX = 2.5
                    group_point.scaleY = 2.5
                    element.comp = group_point
                    this.group_map.addChild(group_point)

                }
            }
        }
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let features = fullInfo.conquestPlayer.features
        for (let i = 0; i < this.playersArr.length; i++) {
            const element = this.playersArr[i];
            if (element.comp) {
                element.comp.setPosition(element.data.x, element.data.y)
            } else {
                if (element.data.x != 0) {
                    let group_point: fgui.GButton = fgui.UIPackage.createObject("LyConquestSeek", "group_point") as fgui.GButton;
                    let playerInfo
                    for (let j = 0; j < features.length; j++) {
                        if (features[j].playerId == element.data.id) {
                            playerInfo = features[j]
                        }
                    }
                    if (playerInfo) {
                        if (playerInfo.clanId != "" && playerInfo.clanId == fullInfo.conquestPlayer.myClanInfo.clanId) {
                            group_point.icon = "ui://LyConquestSeek/frame_duiyou2"
                        } else {
                            group_point.icon = "ui://LyConquestSeek/frame_diren2"
                        }
                    }
                    group_point.setPosition(element.data.x, element.data.y)
                    group_point.scaleX = 2.5
                    group_point.scaleY = 2.5
                    element.comp = group_point
                    this.group_map.addChild(group_point)
                }
            }
        }
    }
    private group_select: fgui.GComponent
    private onShowPlayer(): void {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let conquestPlayer = fullInfo.conquestPlayer
        let myself = conquestPlayer.myself
        this.group_select = fgui.UIPackage.createObject("LyConquestSeek", "group_select") as fgui.GComponent;
        if (this.params && this.params.x) {
            this.group_select.setPosition(this.params.x, this.params.y)
        } else {
            this.group_select.setPosition(myself.x, myself.y)
        }
        this.group_select.scaleX = 2.5
        this.group_select.scaleY = 2.5
        this.group_map.addChild(this.group_select)
        this.group_map.scrollPane.posX = this.group_select.x
    }

    public getIsViewMask(): boolean {
        return false;
    };

}


