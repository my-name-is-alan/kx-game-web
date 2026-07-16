//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { Asset, EventTouch, math, sp, v3, Vec2, Vec3 } from "cc";
import * as fgui from "fairygui-cc";
import { FguiGTween } from "../Kernel/FguiGTween";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyChatRoom } from "./LyChatRoom";
import { ConquestState } from "./LyConquestSeek";
import { LyConquestSeekMap } from "./LyConquestSeekMap";

//玩家实体
interface playerEntity {
    // id: number,//玩家id
    // x: number,
    // y: number,
    // size: number,//大小 （直径）
    // hp: number,//血量
    // status: number,//状态 1：正常 2：减速 3：击晕 4：死亡

    id: string, //# 玩家id
    x: number,
    y: number,
    size: number,//# 大小 （直径）
    attackRange: number,//# 攻击范围
    hp: number,//# 血量
    hpMax: number,//# 血量上限
    nextAttackTime: number,// # 下次攻击时间
    freeTime: number, //# 下次空闲时间 （脱战）
    stunTime: number, //# 眩晕解除时间
    reviveTime: number, //# 可复活时间
    streakKill: number,// 连杀
    totalKill: number,// 累杀

    isClan: boolean,//是否盟友
    comp: fgui.GComponent,
}
//玩家信息
interface PlayerFeatureEntity {
    playerId: string// id
    name: number,//名字
    avatar: string,//头像
    clanId: number,//血量
}
//怪物实体
interface monsterEntity {
    id: number,//玩家id
    x: number,
    y: number,
    hp: number,//血量
    monsterForkId: number,//怪物生成id
    showTime: number,//显示时间
    comp: fgui.GComponent,
}


export class LyConquestSeekMain extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyConquestSeek";
        this.viewResI.pkgName = "LyConquestSeek";
        this.viewResI.comName = "LyConquestSeekMain";
    }
    private SPEED = 2
    private group_map: fgui.GComponent//地图，所有人加在这里面
    private group_playerMap: fgui.GComponent//地图，主角加在这里面

    private fullInfo: any
    private conquestPlayer: any

    private uiPanel: fgui.GComponent

    private group_conquestRevive: fgui.GGroup
    private rootWidth: number = 0
    private rootHeight: number = 0
    private loadSpineNameMap: any;
    private group_chat: fgui.GComponent;

    private conquestRoot: any
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel()
        // UtilsUI.playCommonGroupAni(this.uiPanel, null)
        this.setViewBehaviour(true);
        // 关闭
        let btn_close = this.getUiPanel().getChild("btn_close")
        btn_close.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyConquestSeekMain, 0, null)
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "conquestLeave", {})

        })
        this.group_map = this.uiPanel.getChild("group_map")
        this.group_playerMap = this.uiPanel.getChild("group_playerMap")

        this.loadSpineNameMap = {}
        let loadSpineNames = ["jm_bahuang_daoguang", "jm_bahuang_shouji", "jm_bahuang_siwan"]
        for (let i = 0; i < loadSpineNames.length; i++) {
            let spineName = loadSpineNames[i];
            PlatformAPI.loadSpine((asset: Asset) => {
                asset.addRef();
                this.loadSpineNameMap[spineName] = asset;
            }, spineName)
        }

        this.onEvent()
        this.initialize()//只加载一次
        // this.onFriendPlayers()//其他玩家(友军)
        // this.onEnemysPlayers()//其他玩家(敌军)
        this.onLoadUi()//ui相关
    };

    private features: any
    private onEvent(): void {
        this.registerRequest((args) => {
            if (args.myself.x != 0 && args.myself.y != 0) {
                if (this.selfData) {
                    this.selfData.x = args.myself.x
                    this.selfData.y = args.myself.y
                    this.selfData.size = args.myself.size
                    this.selfData.hp = args.myself.hp
                    this.selfData.streakKill = args.myself.streakKill
                    this.selfData.totalKill = args.myself.totalKill
                    // this.selfData.status = args.status
                    this.selfData.comp.getChild("bar_hp", fgui.GProgressBar).value = this.selfData.hp
                    if (this.mapMovePos.x == 0 && this.mapMovePos.y == 0) {
                        this.group_map.node.setPosition(-this.selfData.x + this.rootWidth, this.selfData.y + this.rootHeight)
                    }
                    // this.group_map.scaleX = this.group_map.scaleY = (this.selfData.size) / Number(this.conquestRoot.playerSize)
                    if (args.myself.hp == 0) {
                        this.onSelfPlayerDie()
                    }
                } else {
                    this.onMainPlayer()//主角相关
                }

            } else {
                if (this.selfData) {
                    // this.selfData.x = args.myself.x
                    // this.selfData.y = args.myself.y
                    // this.selfData.size = args.myself.size
                    this.selfData.hp = args.myself.hp
                    // this.selfData.status = args.status
                    this.selfData.comp.getChild("bar_hp", fgui.GProgressBar).value = this.selfData.hp
                    // if (this.mapMovePos.x == 0 && this.mapMovePos.y == 0) {
                    //     this.group_map.node.setPosition(-this.selfData.x + this.rootWidth, this.selfData.y + this.rootHeight)
                    // }
                    // this.group_map.scaleX = this.group_map.scaleY = (this.selfData.size) / Number(this.conquestRoot.playerSize)
                    if (args.myself.hp == 0) {
                        this.onSelfPlayerDie()
                    }
                } else {
                    this.onMainPlayer()//主角相关
                }
            }
            this.onShowMap(null, null, args)
        }, "onConquestMyselfChange");
        this.registerRequest((args) => {
            this.onMonsters(args)//怪物(敌军)
            this.onShowMap(args)//怪物(敌军)
        }, "onConquestRangeMonsterChange");

        this.registerRequest((args) => {
            // if (this.selfData && this.monsterPlayerArr && this.elsePlayerArr) {
            this.onMonsterBattle(args)
            // }
        }, "onConquestAttackMonsterChange");
        this.registerRequest((args) => {
            // if (this.selfData && this.elsePlayerArr) {
            this.onPlayerBattle(args)
            // }
        }, "onConquestAttackPlayerChange");
        this.registerRequest((args) => {
            this.onElsePlayers(args)
            this.onShowMap(null, args)
        }, "onConquestRangePlayerChange");
        this.registerRequest((args) => {
            this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
            this.features = this.fullInfo.conquestPlayer.features
        }, "onConquestPlayerFeatureChange");
        this.registerRequest((args) => {
            this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
            this.conquestPlayer = this.fullInfo.conquestPlayer
            this.onTask()
        }, "onConquestTaskChange");
        this.registerRequest((args) => {
            this.onNotice(args)
            this.onBattleInfo()
        }, "onConquestKillChange");
        this.registerRequest((args) => {
            this.onBossLog()
        }, "onConquestSceneChange");
        this.registerRequest((args) => {
            this.onBossLog(args)
        }, "onConquestBossDefeated");
        this.registerRequest((args) => {
            this.unclaimedReward()
        }, "onConquestPlayerRewardChange");

        this.registerRequest((args) => {
            this.onDeletePlayer()
            let player = {
                myself: {
                    x: args.x,
                    y: args.y
                }
            }
            this.onShowMap(null, null, player)
        }, "conquestTP");

        this.registerRequest((args) => {
            this.onBattleInfo()
        }, "onConquestPlayerKillRankChange");

        this.registerRequest((args) => {
            this.onBattleInfo()
        }, "onConquestClanScoreRankChange");

        this.registerRequest((args) => {
            let conquestInfo = GameServerData.getInstance().getConquestInfo();
            if (conquestInfo.activityInfo.phase == ConquestState.OVER) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyConquestSeekMain, 0, null)
            }
        }, "onConquestPhaseChange");




    }
    public addGLoader3DSpine(loader_spine: fgui.GLoader3D, spname: string, rotation: number): fgui.GLoader3D {
        loader_spine.setSize(2, 2);
        loader_spine.setPivot(0.5, 0.5, true);
        loader_spine.setPosition(125, 125);
        // 底居中
        loader_spine.setSpine(this.loadSpineNameMap[spname], new Vec2(0.5, 0.5), false);
        let ske: sp.Skeleton = <sp.Skeleton>loader_spine.content;
        // 添加到倍速管理
        // this.addSkillSpine(ske);
        // 翻转
        // if (isFlipX) {
        //     ske._skeleton.scaleX = 0 - ske._skeleton.scaleX;
        // }
        loader_spine.rotation = rotation
        return loader_spine;
    }

    private addSpineEffect(battleComp: fgui.GComponent, spname: string, loop: boolean, hitCall: Function, rotation: number, animationsName: string): fgui.GLoader3D {
        if (this.loadSpineNameMap[spname]) {
            let loader_spine = this.addGLoader3DSpine(<fgui.GLoader3D>battleComp.addChild(new fgui.GLoader3D()), spname, rotation);
            let ske: sp.Skeleton = <sp.Skeleton>loader_spine.content;
            if (!loop) {
                // 事件帧
                // ske.setEventListener((trackEntry: sp.spine.TrackEntry, event: sp.spine.Event) => {
                //     if (hitCall) {
                //         hitCall(trackEntry.animation.name, event.stringValue);
                //         if (event.stringValue == VarVal.SPINE_ENV_NAME.attack_hit) {
                //             hitCall = null;
                //         }
                //     }
                // })
                ske.setCompleteListener((trackEntry: sp.spine.TrackEntry) => {
                    // this.delSkillSpine(ske);
                    loader_spine.removeFromParent();
                    if (hitCall) {
                        hitCall(trackEntry.animation.name);
                        hitCall = null;
                    }
                })
            }
            // 皮肤
            // ske.setSkin("1");
            // 动画
            // console.log(ske._skeleton.data.animations[0].name);
            ske.setAnimation(0, animationsName, loop);
            return loader_spine;
        }
    }


    // private mapX
    // private mapY
    private initialize(): void {
        this.conquestRoot = LocaleData.getConquestRoot()
        let btn_joystick_x: number = 100
        let btn_joystick_y: number = 100
        this.mapMovePos = new Vec2(0, 0)
        let group_arrow: fgui.GComponent = this.uiPanel.getChild("group_arrow")

        //----------摇杆---------
        // let btn_showArrow: fgui.GButton = this.uiPanel.getChild("btn_showArrow")
        // btn_showArrow.on(fgui.Event.TOUCH_BEGIN, (context) => {
        //     group_arrow.visible = true
        //     console.log("aaaaaaaaaa");

        //     // group_arrow.setPosition(context.x, context.y)
        // })

        // btn_showArrow.on(fgui.Event.TOUCH_END, () => {
        //     group_arrow.visible = false
        // })

        let btn_joystick: fgui.GButton = group_arrow.getChild("btn_joystick")
        let img_di: fgui.GImage = group_arrow.getChild("img_di")
        let btn_yuan: fgui.GImage = btn_joystick.getChild("btn_yuan")
        img_di.visible = btn_yuan.visible = false
        btn_joystick.on(fgui.Event.TOUCH_BEGIN, () => {
            btn_joystick_x = btn_joystick.x
            btn_joystick_y = btn_joystick.y
            this.moveTime = 0
            img_di.visible = btn_yuan.visible = true
        })
        btn_joystick.on(fgui.Event.TOUCH_MOVE, (context) => {
            if (!btn_joystick_x) {
                return
            }
            let pos = group_arrow.globalToLocal(context.pos.x, context.pos.y)
            btn_joystick_x = pos.x
            btn_joystick_y = pos.y

            if (btn_joystick_x >= 0 && btn_joystick_x <= group_arrow.width) {
                btn_joystick.x = pos.x
                this.mapMovePos.x = 0
                if (btn_joystick_x > group_arrow.width / 2 + 15) {
                    this.mapMovePos.x = 2
                }
                if (btn_joystick_x < group_arrow.width / 2 - 15) {
                    this.mapMovePos.x = -2
                }
            } else {
                if (btn_joystick_x < 0) {
                    pos.x = 0
                    btn_joystick.x = pos.x
                    this.mapMovePos.x = -2
                }
                if (btn_joystick_x > group_arrow.width) {
                    pos.x = group_arrow.width
                    btn_joystick.x = pos.x
                    this.mapMovePos.x = 2
                }
            }
            if (btn_joystick_y > 0 && btn_joystick_y < group_arrow.height) {
                btn_joystick.y = pos.y
                // this.mapY = pos.y
                this.mapMovePos.y = 0
                if (btn_joystick_y > group_arrow.height / 2 + 15) {
                    this.mapMovePos.y = 2
                }

                if (btn_joystick_y < group_arrow.height / 2 - 15) {
                    this.mapMovePos.y = -2
                }
            } else {
                if (btn_joystick_y < 0) {
                    pos.y = 0
                    btn_joystick.y = pos.y
                    this.mapMovePos.y = -2
                }
                if (btn_joystick_y > group_arrow.height) {
                    pos.y = group_arrow.height
                    btn_joystick.y = pos.y
                    this.mapMovePos.y = 2
                }
            }
            // Math.round(this.group_map.node.position.y - this.rootHeight)
            // this.mapX = 100 - btn_joystick_x
            // this.mapY = btn_joystick_y - 100
        })
        btn_joystick.on(fgui.Event.TOUCH_END, () => {
            btn_joystick.x = group_arrow.width / 2
            btn_joystick.y = group_arrow.height / 2
            // this.mapX = 0
            // this.mapY = 0
            this.mapMovePos = new Vec2(0, 0)

            this.moveTime = 0
            img_di.visible = btn_yuan.visible = false
        })
        this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        this.conquestPlayer = this.fullInfo.conquestPlayer
        //----------地图大小---------
        let group_scene: fgui.GImage = this.group_map.getChild("group_scene")
        let group_bg: fgui.GImage = this.group_map.getChild("group_bg")
        let scene = LocaleData.getConquestSceneById(this.conquestPlayer.activityInfo.sceneId)//
        group_scene.width = Number(scene.width)
        group_scene.height = Number(scene.height)
        group_bg.width = Number(scene.width)
        group_bg.height = Number(scene.height)
    }

    private moveTime = 0
    onBehaviourUpdate(deltaTime: number): void {
        this.onSelfUpdate(deltaTime)
        this.onMonsterUpdate(deltaTime)
        this.onElsePlayersUpdate(deltaTime)
    }
    //============================主角相关↓==========================
    private selfData: playerEntity = null
    private mapMovePos: Vec2 = new Vec2(0, 0)
    private onMainPlayer(): void {
        this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        this.conquestPlayer = this.fullInfo.conquestPlayer
        let group_player: fgui.GComponent
        group_player = fgui.UIPackage.createObject("LyConquestSeek", "group_player") as fgui.GComponent;
        // this.group_player.setPosition(fgui.GRoot.inst.width / 2 - this.group_player.width / 2, fgui.GRoot.inst.height / 2 - this.group_player.height / 2)
        // this.group_player.setPosition(fgui.GRoot.inst.width / 2, fgui.GRoot.inst.height / 2)
        group_player.setPosition(0, 0)
        this.group_playerMap.addChild(group_player);
        this.rootWidth = fgui.GRoot.inst.width / 2
        this.rootHeight = - fgui.GRoot.inst.height / 2 + group_player.height / 2
        this.selfData = this.conquestPlayer.myself
        this.selfData.comp = group_player
        this.selfData.isClan = true
        // this.selfData.features.avatar = LocaleData.getCharShowResInfoSelf().icon
        // this.selfData.features.name = this.fullInfo.base.name
        // this.selfData.features.clanId = this.fullInfo.conquestPlayer.myClanInfo.clanId
        // this.selfData.comp.scaleX = this.selfData.comp.scaleY = (this.selfData.size) / Number(this.conquestRoot.playerSize)
        this.group_map.node.setPosition(-this.selfData.x + this.rootWidth, this.selfData.y + this.rootHeight)
        let group_money: fgui.GGroup = this.selfData.comp.getChild("group_money")
        if (this.selfData.streakKill > 0) {
            let label_money: fgui.GLabel = this.selfData.comp.getChild("label_money")
            let streakKill = LocaleData.getConquestContinuityNoticeByNum(this.selfData.streakKill)
            label_money.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR11, [streakKill.integral])
            group_money.visible = true
        } else {
            group_money.visible = false
        }
        let label_name: fgui.GLabel = this.selfData.comp.getChild("label_name")
        label_name.text = this.fullInfo.base.name
        let bar_hp: fgui.GProgressBar = this.selfData.comp.getChild("bar_hp")
        bar_hp.max = this.selfData.hpMax
        bar_hp.value = this.selfData.hp

        let charInfoself = LocaleData.getCharShowResInfoSelf();
        let img_icon: fgui.GLoader = this.selfData.comp.getChild("img_icon")
        img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfoself.icon]);
        let img_iconFrame: fgui.GLoader = this.selfData.comp.getChild("img_iconFrame")
        let ranking = LocaleData.getConquestRankingByRange(this.conquestPlayer.myInfo.combatRankOf);
        if (ranking) {
            img_iconFrame.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}", [ranking.frame]);
        } else {
            img_iconFrame.url = ""
        }
        if (this.selfData.hp <= 0) {
            // this.onSelfPlayerDie()
            this.selfData.comp.visible = false
            this.group_conquestRevive.visible = true
            this.uiPanel.getChild("group_revive", fgui.GGroup).visible = false
        }
        // this.group_map.node.setPosition(this.group_map.node.position.x + (fgui.GRoot.inst.width / 2 - this.group_player.width / 2), this.group_map.node.position.y - (fgui.GRoot.inst.height / 2 - this.group_player.height / 2))
        // this.group_map.node.setPosition(fgui.GRoot.inst.width / 2 - this.group_player.width / 2, fgui.GRoot.inst.height / 2 - this.group_player.height / 2)
    }

    private onSelfUpdate(deltaTime: number): void {
        // if (this.mapMovePos.x == 0 && this.mapMovePos.y == 0) {
        //     return
        // }
        // // let dx: number = this.group_map.node.position.x - (-this.enemysPlayerArr[0].node.position.x);
        // // let dy: number = this.group_map.node.position.y - (-this.enemysPlayerArr[0].node.position.y);
        // // let distance: number = Math.sqrt(dx * dx + dy * dy);
        // // if (distance < this.playerData.size) {
        // //     // return
        // // }
        // let severX: number = 0
        // let severY: number = 0
        // // if (-(this.group_map.node.position.x - this.rootWidth) < this.selfData.size) {
        // //     severX = this.selfData.size + 1
        // //     this.mapMovePos.x = 0
        // // }
        // // if (this.group_map.node.position.y - this.rootHeight < this.selfData.size) {
        // //     severY = this.selfData.size + 1
        // //     this.mapMovePos.y = 0
        // // }
        // // if (-(this.group_map.node.position.x - this.rootWidth) > this.group_map.getChild("group_scene").width - this.selfData.size) {
        // //     severX = this.group_map.getChild("group_scene").width - this.selfData.size - 1
        // //     this.mapMovePos.x = 0
        // // }
        // // if (this.group_map.node.position.y - this.rootHeight > this.group_map.getChild("group_scene").height - this.selfData.size) {
        // //     severY = this.group_map.getChild("group_scene").height - this.selfData.size - 1
        // //     this.mapMovePos.y = 0
        // // }

        // let moveVector3Normalized = this.mapMovePos.normalize()
        // // console.log(Number((severX).toFixed(2)));
        // this.group_map.node.translate(v3(moveVector3Normalized.x * this.SPEED * 200 * deltaTime, moveVector3Normalized.y * this.SPEED * 200 * deltaTime, 0));
        // if (severX == 0) {
        //     severX = -(this.group_map.node.position.x - this.rootWidth)
        // }
        // if (severY == 0) {
        //     severY = (this.group_map.node.position.y - this.rootHeight)
        // }
        // this.moveTime += deltaTime
        // if (this.moveTime > 0.1) {
        //     this.moveTime = 0
        //     UtilsUI.lockWait();
        //     GameServer.getInstance().send((args: any) => {
        //         UtilsUI.unlockWait();
        //         if (args.errorcode == 0) {
        //         } else {
        //             UtilsUI.showMsgTip(args.errorcode);
        //         }
        //         console.log(Number((severX).toFixed(2)) + "====" + Number((severY).toFixed(2)));
        //         console.log(this.group_map.node.position);
        //         console.log("..............");

        //     }, "conquestMove", { x: Number((severX).toFixed(2)), y: Number((severY).toFixed(2)) })
        // }
        // console.log(this.mapMovePos.x + this.group_map.node.position.x);
        // console.log(this.mapMovePos.y + this.group_map.node.position.y);
        // console.log("..........");
        // }
        if (this.selfData) {
        } else {
            return
        }
        if (this.mapMovePos.x == 0 && this.mapMovePos.y == 0) {
        } else {
            this.moveTime += deltaTime
            if (this.moveTime > 0.2 || this.moveTime == 0) {
                let severX = this.selfData.x + (this.mapMovePos.x * 15)
                let severY = this.selfData.y + (this.mapMovePos.y * 15)
                this.moveTime = 0.1
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "conquestMove", { x: Number((severX).toFixed(2)), y: Number(severY.toFixed(2)) })
            }
        }

        // this.group_map.node.setPosition(-this.selfData.x + this.rootWidth, this.selfData.y + this.rootHeight)

        // let posxxx: Vec2 = new Vec2(this.group_map.node.position.x - this.rootWidth, this.group_map.node.position.y - this.rootHeight)
        let xx = -(this.selfData.x - this.rootWidth)
        let yy = (this.selfData.y + this.rootHeight)
        let moveVector3 = new Vec2((xx - this.group_map.node.position.x), (yy - this.group_map.node.position.y))
        if (moveVector3.x < 3 && moveVector3.x > -3 && moveVector3.y < 3 && moveVector3.y > -3) {
        } else {
            let moveVector3Normalized = moveVector3.normalize()
            this.group_map.node.translate(v3(moveVector3Normalized.x * this.SPEED * 200 * deltaTime, moveVector3Normalized.y * this.SPEED * 200 * deltaTime, 0));
        }
    }
    //主角死亡
    private onSelfPlayerDie(): void {
        if (this.selfData.hp <= 0) {
            this.addSpineEffect(this.selfData.comp, "jm_bahuang_siwan", false, () => {
                if (this.selfData.hp <= 0) {
                    this.conquestPlayer = this.fullInfo.conquestPlayer
                    this.group_conquestRevive.visible = true
                    this.selfData.comp.visible = false
                    let group_revive: fgui.GGroup = this.uiPanel.getChild("group_revive")
                    let label_reviveTime: fgui.GGroup = this.uiPanel.getChild("label_reviveTime")
                    let btn_conquestRevive: fgui.GButton = this.uiPanel.getChild("btn_conquestRevive")
                    let currentTime: number = GameServerData.getInstance().getServerTime()
                    let time = this.conquestPlayer.myself.reviveTime - currentTime
                    group_revive.visible = time > 0
                    btn_conquestRevive.visible = time <= 0
                    label_reviveTime.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR10, [UtilsTool.parseTimeToString(time)])
                    if (time > 0) {
                        let timeCall = this.setInterval(() => {
                            time--
                            if (time > 0) {
                                label_reviveTime.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR10, [UtilsTool.parseTimeToString(time)])
                            } else {
                                group_revive.visible = false
                                btn_conquestRevive.visible = true
                                this.clearInterval(timeCall)
                            }
                        }, 1000);
                    }
                    this.onDeletePlayer()
                }
            }, 0, "Stand")
        }
    }

    private onDeletePlayer(): void {
        if (this.elsePlayerArr) {
            for (const key in this.elsePlayerArr) {
                const element = this.elsePlayerArr[key];
                element.comp.removeFromParent()
                delete this.elsePlayerArr[key]
            };
            this.elsePlayerArr = []
        }

        if (this.playersPointArr) {
            for (const key in this.playersPointArr) {
                const element = this.playersPointArr[key];
                element.pointComp.removeFromParent()
                delete this.playersPointArr[key]
            };
            this.playersPointArr = []
        }

        if (this.monsterPlayerArr) {
            this.monsterPlayerArr.forEach(element => {
                element.comp.removeFromParent()
            });
            this.monsterPlayerArr = []
        }
        if (this.monstersPointArr) {
            this.monstersPointArr.forEach(element => {
                element.pointComp.removeFromParent()
            });
            this.monstersPointArr = []
        }
    }
    //============================其他玩家 ↓==========================
    private elsePlayerArr: playerEntity[]
    private onElsePlayers(elsePlayerChange: any): void {
        // let group_friendPlayer: fgui.GComponent = fgui.UIPackage.createObject("LyConquestSeek", "group_player_friend") as fgui.GComponent;
        // group_friendPlayer.setPosition(fgui.GRoot.inst.width / 2 - this.group_player.width / 2, fgui.GRoot.inst.height / 2 - this.group_player.height / 2)
        // this.friendPlayerArr.push(group_friendPlayer)
        // this.group_map.addChild(group_friendPlayer);
        if (this.elsePlayerArr) {
            // return
        } else {
            this.elsePlayerArr = []
        }
        let player: playerEntity = elsePlayerChange.player
        if (elsePlayerChange.change == 1) {
            if (this.elsePlayerArr[player.id]) {
                let playerPlayer = this.elsePlayerArr[player.id]
                playerPlayer.x = player.x
                playerPlayer.y = player.y
                let bar_hp: fgui.GProgressBar = playerPlayer.comp.getChild("bar_hp")
                bar_hp.value = player.hp
                let group_money: fgui.GGroup = playerPlayer.comp.getChild("group_money")
                // label_money.text = "x:" + player.x + "=y:" + player.y
                if (player.streakKill > 0) {
                    let label_money: fgui.GLabel = playerPlayer.comp.getChild("label_money")
                    let streakKill = LocaleData.getConquestContinuityNoticeByNum(player.streakKill)
                    label_money.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR11, [streakKill.integral])
                    group_money.visible = true
                } else {
                    group_money.visible = false
                }
            } else {
                let elsePlayerItem;
                this.features = this.fullInfo.conquestPlayer.features
                for (let i = 0; i < this.features.length; i++) {
                    const element = this.features[i];
                    if (element.playerId == player.id) {
                        elsePlayerItem = element
                    }
                }
                console.log(this.features);
                console.log(player.id);
                if (!elsePlayerItem) {
                    console.log(this.features);
                    console.log(player.id);
                    console.log(">.......................");
                    return
                }
                let group_enemysPlayer: fgui.GComponent
                if (elsePlayerItem && elsePlayerItem.clanId != "" && elsePlayerItem.clanId == this.fullInfo.conquestPlayer.myClanInfo.clanId) {
                    group_enemysPlayer = fgui.UIPackage.createObject("LyConquestSeek", "group_player_friend") as fgui.GComponent;
                    player.isClan = true
                } else {
                    player.isClan = false
                    group_enemysPlayer = fgui.UIPackage.createObject("LyConquestSeek", "group_player_enemy") as fgui.GComponent;
                }
                let label_name: fgui.GLabel = group_enemysPlayer.getChild("label_name")
                label_name.text = elsePlayerItem.name
                let bar_hp: fgui.GProgressBar = group_enemysPlayer.getChild("bar_hp")
                bar_hp.max = player.hpMax
                bar_hp.value = player.hp
                let group_money: fgui.GGroup = group_enemysPlayer.getChild("group_money")
                if (player.streakKill > 0) {
                    let label_money: fgui.GLabel = group_enemysPlayer.getChild("label_money")
                    let streakKill = LocaleData.getConquestContinuityNoticeByNum(player.streakKill)
                    label_money.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR11, [streakKill.integral])
                    group_money.visible = true
                } else {
                    group_money.visible = false
                }
                player.comp = group_enemysPlayer
                player.comp.scaleX = player.comp.scaleY = Number(player.size) / Number(this.conquestRoot.playerSize)
                // group_enemysPlayer.clearClick()
                // group_enemysPlayer.onClick(() => {
                //     console.log(player);
                // })
                console.log(player);
                let charInfo = LocaleData.getCharShowResInfo(elsePlayerItem.character, elsePlayerItem.phase, null, elsePlayerItem.avatar);
                let img_icon: fgui.GLoader = group_enemysPlayer.getChild("img_icon")
                img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
                let img_iconFrame: fgui.GLoader = group_enemysPlayer.getChild("img_iconFrame")
                let ranking = LocaleData.getConquestRankingByRange(elsePlayerItem.combatRankOf);
                if (ranking) {
                    img_iconFrame.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}", [ranking.frame]);
                } else {
                    img_iconFrame.url = ""
                }
                group_enemysPlayer.node.setPosition(player.x, -player.y)
                this.group_map.addChild(group_enemysPlayer);
                this.elsePlayerArr[player.id] = player
            }
        } else if (elsePlayerChange.change == 2) {
            if (this.elsePlayerArr[player.id]) {
                // this.elsePlayerArr[player.id].comp.removeFromParent()

                // delete this.elsePlayerArr[player.id]
                // // new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                // //     spp.playAnimation("stand", false, null, null, () => {
                // //         this.elsePlayerArr[player.id].comp.removeFromParent()
                // //         delete this.elsePlayerArr[player.id]
                // //     });
                // // }, this.elsePlayerArr[player.id].comp.getChild("loader_die", fgui.GLoader3D), "11");
                // this.addSpineEffect(this.elsePlayerArr[player.id].comp, "jm_bahuang_siwan", false, () => {
                //     this.elsePlayerArr[player.id].comp.removeFromParent()
                //     delete this.elsePlayerArr[player.id]
                // }, 0)
                let animationsName: string = this.elsePlayerArr[player.id].isClan ? "Stand" : "Stand2"
                let comp = this.elsePlayerArr[player.id].comp
                delete this.elsePlayerArr[player.id]
                comp.getChild("bar_hp", fgui.GProgressBar).value = 0
                this.addSpineEffect(comp, "jm_bahuang_siwan", false, () => {
                    comp.removeFromParent()
                }, 0, animationsName)
                // this.unclaimedReward()
            } else {
                console.log("移除一个本来就没有的玩家？");
            }
        }

    }

    //其他玩家死亡
    private onElsePlayersDie(playerId): void {
    }
    private onPlayerBattle(args): void {
        let battleCompA: fgui.GComponent
        let battleDataA: playerEntity
        let battleCompB: fgui.GComponent
        let battleDataB: playerEntity
        let isSelfA: boolean = true
        let isSelfB: boolean = true
        if (this.selfData.id == args.attacker) {
            if (!this.selfData) {
                return
            }
            battleCompA = this.selfData.comp
            battleDataA = this.selfData
            isSelfA = true
        } else {
            if (!this.elsePlayerArr[args.attacker]) {
                return
            }
            battleCompA = this.elsePlayerArr[args.attacker].comp
            battleDataA = this.elsePlayerArr[args.attacker]
            isSelfA = false
        }
        if (this.selfData.id == args.target) {
            battleCompB = this.selfData.comp
            battleDataB = this.selfData
            isSelfB = true
        } else {
            if (!this.elsePlayerArr[args.target]) {
                return
            }
            battleCompB = this.elsePlayerArr[args.target].comp
            battleDataB = this.elsePlayerArr[args.target]
            isSelfB = false
        }
        // let battleCompA_battleSpine: fgui.GLoader3D = battleCompA.getChild("loader_battle", fgui.GLoader3D)
        // let battleCompB_battleSpine: fgui.GLoader3D = battleCompB.getChild("loader_battle", fgui.GLoader3D)
        let rotationNum = Math.atan2(battleDataA.y - battleDataB.y, battleDataA.x - battleDataB.x) * 180 / Math.PI
        // battleCompA_battleSpine.rotation = rotationNum
        // battleCompB_battleSpine.rotation = 180 + rotationNum
        let BattleNum: number = 0
        let playerBattleResult = args.playerBattleResult
        // new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        //     spp.playAnimation("stand", false);
        // }, battleCompA.getChild("loader_battle", fgui.GLoader3D), "jm_bahuang_daoguang");
        // new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        //     spp.playAnimation("stand", false);
        // }, battleCompB.getChild("loader_die", fgui.GLoader3D), "jm_bahuang_shouji");
        let onShow = () => {
            let call = () => {
                if (BattleNum < playerBattleResult.length) {
                    onShow()
                }
            }
            let bar_hpA = battleCompA.getChild("bar_hp", fgui.GProgressBar)
            let bar_hpB = battleCompB.getChild("bar_hp", fgui.GProgressBar)
            // bar_hpA.value = playerBattleResult[BattleNum].hpA
            // bar_hpB.value = playerBattleResult[BattleNum].hpB
            let hpA = playerBattleResult[BattleNum].hpA
            let hpB = playerBattleResult[BattleNum].hpB
            let animationsNameA: string = battleDataA.isClan ? "Stand" : "Stand2"
            let animationsNameB: string = battleDataB.isClan ? "Stand" : "Stand2"
            if (playerBattleResult[BattleNum].side == 1) {
                this.addSpineEffect(battleCompA, "jm_bahuang_daoguang", false, () => { }, rotationNum, animationsNameA)
                if (hpB > 0) {
                    this.addSpineEffect(battleCompB, "jm_bahuang_shouji", false, () => { bar_hpB.value = hpB }, rotationNum, animationsNameB)
                    if (playerBattleResult[BattleNum].steal > 0) {
                        this.onBattleShow(battleCompA, playerBattleResult[BattleNum].steal, null, "font_bmp_cure")
                    }
                    this.onBattleShow(battleCompB, playerBattleResult[BattleNum].damage, call)
                    BattleNum++
                } else {
                    if (isSelfB) {
                        // this.onSelfPlayerDie()
                    } else {
                        // this.onElsePlayersDie(args.target)
                    }
                }
            } else if (playerBattleResult[BattleNum].side == 2) {
                this.addSpineEffect(battleCompB, "jm_bahuang_daoguang", false, () => { }, rotationNum + 180, animationsNameB)
                if (hpA > 0) {
                    this.addSpineEffect(battleCompA, "jm_bahuang_shouji", false, () => { bar_hpA.value = hpA }, 0, animationsNameA)
                    if (playerBattleResult[BattleNum].steal > 0) {
                        this.onBattleShow(battleCompB, playerBattleResult[BattleNum].steal, null, "font_bmp_cure")
                    }
                    this.onBattleShow(battleCompA, playerBattleResult[BattleNum].damage, call)
                    BattleNum++
                } else {
                    if (isSelfA) {
                        // this.onSelfPlayerDie()
                    } else {
                        // this.onElsePlayersDie(args.attacker)
                    }
                }
            }
        }
        onShow()
        // this.onBattleShowPlayer(args, battleDataA, battleDataB)
        // let call = () => {
        // }
        // this.onBattleShow(battleComp2, playerBattleResult.playerDamage, call)
    }

    private onElsePlayersUpdate(deltaTime: number): void {
        if (this.elsePlayerArr) {
            for (const key in this.elsePlayerArr) {
                // player.x + "=y:" + player.y
                // let playerPlayer = this.elsePlayerArr[player.id]
                // playerPlayer.x = player.x
                // playerPlayer.y = player.y
                const element = this.elsePlayerArr[key];
                let endPosition = new Vec2(element.x, - element.y)
                let moveVector3 = new Vec2(endPosition.x - element.comp.node.position.x, endPosition.y - element.comp.node.position.y)
                if (moveVector3.x < 3 && moveVector3.x > -3 && moveVector3.y < 3 && moveVector3.y > -3) {
                    return
                }
                // console.log("aaaaaaaaaa");

                let moveVector3Normalized = moveVector3.normalize()
                // let newVector3 = deltaTime * SPEED * moveVector3Normalized
                element.comp.node.translate(v3(moveVector3Normalized.x * this.SPEED * 200 * deltaTime, moveVector3Normalized.y * this.SPEED * 200 * deltaTime, 0));
                // }
            };
        }
    }
    //============================怪物↓==========================
    private monsterPlayerArr: monsterEntity[]
    private onMonsters(monsterChange): void {
        if (this.monsterPlayerArr) {
        } else {
            this.monsterPlayerArr = []
        }
        let monster: monsterEntity = monsterChange.monster

        if (monsterChange.change == 1) {
            if (this.monsterPlayerArr[monster.monsterForkId]) {
                let monsterPlayer = this.monsterPlayerArr[monster.monsterForkId]
                monsterPlayer.x = monster.x
                monsterPlayer.y = monster.y
                let bar_hp: fgui.GProgressBar = monsterPlayer.comp.getChild("bar_hp")
                bar_hp.value = monster.hp

                // let label_money: fgui.GLabel = monsterPlayer.comp.getChild("label_money")
                // label_money.text = "x:" + monster.x + "=y:" + monster.y
            } else {
                let group_enemysPlayer: fgui.GComponent = fgui.UIPackage.createObject("LyConquestSeek", "group_player_enemy") as fgui.GComponent;
                let monsterXml = LocaleData.getConquestMonsterById(monster.id)
                let label_name: fgui.GLabel = group_enemysPlayer.getChild("label_name")
                label_name.text = monsterXml.name + monster.monsterForkId
                let bar_hp: fgui.GProgressBar = group_enemysPlayer.getChild("bar_hp")
                bar_hp.max = 100
                bar_hp.value = monster.hp
                // let label_money: fgui.GLabel = group_enemysPlayer.getChild("label_money")
                // label_money.text = "x:" + monster.x + "=y:" + monster.y
                let group_money: fgui.GGroup = group_enemysPlayer.getChild("group_money")
                group_money.visible = false
                let img_icon: fgui.GLoader = group_enemysPlayer.getChild("img_icon")
                img_icon.url = UtilsTool.stringFormat("ui://LyConquestSeek/{0}", [monsterXml.head]);
                monster.comp = group_enemysPlayer
                monster.comp.scaleX = monster.comp.scaleY = Number(monsterXml.size) / Number(this.conquestRoot.playerSize)
                // group_enemysPlayer.clearClick()
                monster.comp.onClick(() => {
                    console.log(monster);
                })
                group_enemysPlayer.node.setPosition(monster.x, -monster.y)
                this.group_map.addChild(group_enemysPlayer);
                this.monsterPlayerArr[monster.monsterForkId] = monster
                let currentTime: number = GameServerData.getInstance().getServerTime()
                let time = monster.showTime - currentTime
                if (time > 0) {
                    monster.comp.visible = false
                    let timeCall = this.setInterval(() => {
                        time--
                        if (time > 2) {
                        } else {
                            monster.comp.visible = true
                            this.clearInterval(timeCall)
                        }
                    }, 1000);
                } else {
                    monster.comp.visible = true
                }
            }
        } else if (monsterChange.change == 2) {
            if (this.monsterPlayerArr[monster.monsterForkId]) {
                let comp = this.monsterPlayerArr[monster.monsterForkId].comp
                delete this.monsterPlayerArr[monster.monsterForkId]
                // comp.getTransition("ani_die").play(() => {
                comp.getChild("bar_hp", fgui.GProgressBar).value = 0
                this.addSpineEffect(comp, "jm_bahuang_siwan", false, () => {
                    // comp.getChild("bar_hp", fgui.GProgressBar).value = 0
                    comp.removeFromParent()
                }, 0, "Stand2")
                // this.unclaimedReward()
                // })
            } else {
                console.log("移除一个本来就没有的怪物？");
            }
        }
    }
    private onMonsterUpdate(deltaTime: number): void {
        if (this.monsterPlayerArr) {
            this.monsterPlayerArr.forEach(element => {
                // if (Math.abs(element.comp.node.position.x - element.x) > 0.1 || Math.abs(element.comp.node.position.y - element.y) > 0.1) {
                let endPosition = new Vec2(element.x, - element.y)
                let moveVector3 = new Vec2(endPosition.x - element.comp.node.position.x, endPosition.y - element.comp.node.position.y)
                if (moveVector3.x < 3 && moveVector3.x > -3 && moveVector3.y < 3 && moveVector3.y > -3 && element.hp > 0) {
                    return
                }
                let moveVector3Normalized = moveVector3.normalize()
                // let newVector3 = deltaTime * SPEED * moveVector3Normalized
                element.comp.node.translate(v3(moveVector3Normalized.x * this.SPEED * 50 * deltaTime, moveVector3Normalized.y * this.SPEED * 50 * deltaTime, 0));
                // }
            });
        }
    }
    private onMonsterBattle(args): void {
        let battleComp1: fgui.GComponent
        let battle1: any
        let isSelf: boolean
        if (!this.selfData) {
            return
        }
        if (this.selfData.id == args.attacker) {
            if (this.selfData) {
            } else {
                console.log("怪物战斗没有自己数据？============");
                return
            }
            battleComp1 = this.selfData.comp
            battle1 = this.selfData
            isSelf = true
        } else {
            if (this.elsePlayerArr[args.attacker]) {
            } else {
                console.log(this.elsePlayerArr);
                console.log(args.attacker);
                console.log("怪物战斗没有这个其他玩家===========");
                return
            }
            battleComp1 = this.elsePlayerArr[args.attacker].comp
            isSelf = false
            battle1 = this.elsePlayerArr[args.attacker]
        }

        let animationsNam1: string = battle1.isClan ? "Stand" : "Stand2"

        if (!this.monsterPlayerArr[args.target]) {
            console.log(this.monsterPlayerArr);
            console.log(args.target);
            console.log("怪物战斗没有这个怪物===========");
            return
        }
        let battleComp2: fgui.GComponent = this.monsterPlayerArr[args.target].comp
        let rotationNum = Math.atan2(battle1.y - this.monsterPlayerArr[args.target].y, battle1.x - this.monsterPlayerArr[args.target].x) * 180 / Math.PI
        let bar_hp1 = battleComp1.getChild("bar_hp", fgui.GProgressBar)
        let bar_hp2 = battleComp2.getChild("bar_hp", fgui.GProgressBar)
        let call = () => {
            if (args.monsterBattleResult.monsterHP > 0) {
                this.addSpineEffect(battleComp2, "jm_bahuang_daoguang", false, () => { }, 180 + rotationNum, "Stand2")
                if (args.monsterBattleResult.playerHP > 0) {
                    this.addSpineEffect(battleComp1, "jm_bahuang_shouji", false, () => { bar_hp1.value = args.monsterBattleResult.playerHP }, 0, animationsNam1)
                }
                let call1 = () => {
                    if (args.monsterBattleResult.playerHP > 0) {
                    } else {
                        // this.onSelfPlayerDie()
                    }
                }
                let str: string = isSelf ? args.monsterBattleResult.monsterDamage : ""
                this.onBattleShow(battleComp1, str, call1)
            } else {
                if (args.monsterBattleResult.healing > 0) {
                    let call2 = () => {
                        bar_hp1.value = args.monsterBattleResult.playerHP
                    }
                    let str: string = isSelf ? "+" + args.monsterBattleResult.healing : ""
                    this.onBattleShow(battleComp1, str, call2, "font_bmp_cure")
                }
                // this.onMonsterDie(args.target)
            }
        }
        let str: string = isSelf ? args.monsterBattleResult.playerDamage : ""
        this.addSpineEffect(battleComp1, "jm_bahuang_daoguang", false, () => { }, rotationNum, "Stand")

        if (args.monsterBattleResult.monsterHP) {
            this.addSpineEffect(battleComp2, "jm_bahuang_shouji", false, () => {
                bar_hp2.value = args.monsterBattleResult.monsterHP
            }, 0, animationsNam1)
        }
        this.onBattleShow(battleComp2, str, call)
    }
    private onBattleShow(battleComp, damagetext, rescall, fontStr?: string): void {
        let bmp_text: fgui.GTextField
        bmp_text = new fgui.GTextField();
        if (fontStr) {
            bmp_text.font = "ui://CCommon/" + fontStr;
        } else {
            bmp_text.font = "ui://CCommon/font_bmp_damage";
        }
        bmp_text.fontSize = 64;
        bmp_text.letterSpacing = -20;
        bmp_text.setPivot(0.5, 0.5, true);
        bmp_text.autoSize = fgui.AutoSizeType.Both;
        // let battleComp = this.monsterPlayerArr[args.target].comp
        bmp_text.text = damagetext
        // battleComp.getChild("bar_hp", fgui.GProgressBar).value = args.monsterBattleResult.monsterHP
        if (battleComp) {
            bmp_text.x = battleComp.width / 2
            battleComp.addChild(bmp_text);
            let tw: FguiGTween = FguiGTween.new(bmp_text);
            tw.by(0.1, { scaleX: 0.5, scaleY: 0.5, y: -50 }, { easing: fgui.EaseType.QuadOut }).call(() => {
            }).delay(0.2).by(0.1, { scaleX: -0.5, scaleY: -0.5, y: -50 }, { easing: fgui.EaseType.QuadIn }).call((tw) => {
                bmp_text.removeFromParent();
                rescall()
            }).start();
        }
    }

    //============================ui相关↓==========================
    private onLoadUi(): void {
        this.group_miniMap = this.uiPanel.getChild("group_miniMap", fgui.GComponent)
        let label_str29: fgui.GLabel = this.group_miniMap.getChild("label_str29")
        label_str29.text = StrVal.LYCONQUESTSEEK.STR29
        let label_endTime: fgui.GLabel = this.group_miniMap.getChild("label_endTime")
        let openDay = new Date(this.conquestPlayer.activityInfo.startTime * 1000 + UtilsTool.ONEDAY_MILLISECONDS);
        let playTimeArr = (<string>this.conquestRoot.playTime).split("-");
        let ttt2 = playTimeArr[1].split(":");
        openDay.setHours(Number(ttt2[0]));
        openDay.setMinutes(Number(ttt2[1]));
        openDay.setSeconds(Number(ttt2[2]));
        let playTimeEnd = openDay.getTime();
        let timeCall = () => {
            let serverTime = GameServerData.getInstance().getServerTime() * 1000;
            let remainTime: number;
            remainTime = playTimeEnd - serverTime;
            if (remainTime) {
                label_endTime.text = UtilsTool.splitTimeString(remainTime / 1000)
            } else {
                label_endTime.text = "";
                label_str29.text = "";
            }
        }
        this.setInterval(timeCall, 1000);
        timeCall();
        let btn_map: fgui.GButton = this.uiPanel.getChild("btn_map")
        btn_map.clearClick()
        btn_map.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyConquestSeekMap, 0, null);
        })
        this.group_conquestRevive = this.uiPanel.getChild("group_conquestRevive")
        this.group_conquestRevive.visible = false
        let btn_conquestRevive: fgui.GButton = this.uiPanel.getChild("btn_conquestRevive")
        btn_conquestRevive.clearClick()
        btn_conquestRevive.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    this.group_conquestRevive.visible = false
                    this.selfData.comp.visible = true
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "conquestRevive", {})
        })

        // 聊天框
        this.group_chat = this.uiPanel.getChild("group_chat")
        this.group_chat.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyChatRoom, 0, { activityId: null });
        })
        this.showChatRoomLast();
        //========任务===========
        // this.fullInfo.conquestPlayer
        this.onTask()
        //=========信息栏==========
        this.uiPanel.getChild("label_str1", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR1
        this.uiPanel.getChild("label_str2", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR2
        this.uiPanel.getChild("label_str3", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR3
        this.uiPanel.getChild("label_str4", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR4
        this.uiPanel.getChild("label_str5", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR5
        this.onBattleInfo()
        // this.onNotice()
        //=========背篓==========
        this.unclaimedReward()
        //=========公告==========
        this.onBossLog()
        //========小地图==========
        this.onMap()
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
    private monstersPointArr = []
    private playersPointArr = []
    private selfPoint = null
    private group_miniMapBg: fgui.GComponent
    private group_miniMap: fgui.GComponent
    private group_selfPoint: fgui.GGroup
    private group_bg: fgui.GImage
    private onMap(): void {

        this.group_miniMapBg = this.group_miniMap.getChild("group_bg")
        this.group_selfPoint = this.group_miniMap.getChild("group_selfPoint")
        let group_scene: fgui.GImage = this.group_miniMapBg.getChild("group_scene")
        this.group_bg = this.group_miniMapBg.getChild("group_bg")
        let scene = LocaleData.getConquestSceneById(this.conquestPlayer.activityInfo.sceneId)//
        group_scene.visible = false
        this.group_bg.visible = false
        this.group_selfPoint.visible = false
        this.group_bg.width = Number(scene.width)
        this.group_bg.height = Number(scene.height)
        // if (this.selfData) {
        //     group_miniMap.scrollPane.posX = this.selfData.x - Number(group_miniMap.width) / 2
        //     group_miniMap.scrollPane.posY = this.selfData.y - Number(group_miniMap.height) / 2
        // }
        // this.onShowMonsters()
    }

    private onShowMap(monsterChange: any, elsePlayerChange?: any, slefChange?: any): void {
        if (this.group_miniMapBg && this.group_miniMap) {
            if (monsterChange) {
                let monster = monsterChange.monster
                if (monsterChange.change == 1) {
                    if (this.monstersPointArr[monster.monsterForkId]) {
                        let monsterPlayer = this.monstersPointArr[monster.monsterForkId]
                        monsterPlayer.x = monster.x
                        monsterPlayer.y = monster.y
                        this.monstersPointArr[monster.monsterForkId].pointComp.node.setPosition(monster.x, -monster.y)
                    } else {
                        let group_point: fgui.GButton = fgui.UIPackage.createObject("LyConquestSeek", "group_point") as fgui.GButton;
                        let monsterXml = LocaleData.getConquestMonsterById(monster.id)
                        monster.pointComp = group_point
                        if (monsterXml.quality == "1") {
                            group_point.icon = "ui://LyConquestSeek/frame_yuanbigguai"
                            monster.pointComp.scaleX = monster.pointComp.scaleY = 10
                        } else if (monsterXml.quality == "2") {
                            group_point.icon = "ui://LyConquestSeek/frame_xiaoguai2"
                            monster.pointComp.scaleX = monster.pointComp.scaleY = 5
                        } else if (monsterXml.quality == "3") {
                            group_point.icon = "ui://LyConquestSeek/frame_shouling2"
                            monster.pointComp.scaleX = monster.pointComp.scaleY = 5
                        }
                        group_point.node.setPosition(monster.x, - monster.y)
                        this.group_miniMapBg.addChild(group_point);
                        this.monstersPointArr[monster.monsterForkId] = monster
                    }
                } else if (monsterChange.change == 2) {
                    if (this.monstersPointArr[monster.monsterForkId]) {
                        let pointComp = this.monstersPointArr[monster.monsterForkId].pointComp
                        // comp.getTransition("ani_die").play(() => {
                        pointComp.removeFromParent()
                        delete this.monstersPointArr[monster.monsterForkId]
                        // })
                    } else {
                        console.log("移除一个本来就没有的怪物？");
                    }
                }
            }
            if (elsePlayerChange) {
                let player = elsePlayerChange.player
                if (elsePlayerChange.change == 1) {
                    if (this.playersPointArr[player.id]) {
                        let playerPlayer = this.playersPointArr[player.id]
                        playerPlayer.x = player.x
                        playerPlayer.y = player.y
                        this.playersPointArr[player.id].pointComp.node.setPosition(player.x, -player.y)
                    } else {
                        let elsePlayerItem;
                        this.features = this.fullInfo.conquestPlayer.features
                        for (let i = 0; i < this.features.length; i++) {
                            const element = this.features[i];
                            if (element.playerId == player.id) {
                                elsePlayerItem = element
                            }
                        }
                        let group_enemysPlayer: fgui.GButton = fgui.UIPackage.createObject("LyConquestSeek", "group_point") as fgui.GButton;
                        if (elsePlayerItem && elsePlayerItem.clanId != "" && elsePlayerItem.clanId == this.fullInfo.conquestPlayer.myClanInfo.clanId) {
                            group_enemysPlayer.icon = "ui://LyConquestSeek/frame_yuanbigblue"
                        } else {
                            group_enemysPlayer.icon = "ui://LyConquestSeek/frame_yuanbigred"
                        }
                        player.pointComp = group_enemysPlayer
                        player.pointComp.scaleX = player.pointComp.scaleY = 10
                        player.pointComp.node.setPosition(player.x, -player.y)
                        this.group_miniMapBg.addChild(group_enemysPlayer);
                        this.playersPointArr[player.id] = player
                    }
                } else if (elsePlayerChange.change == 2) {
                    if (this.playersPointArr[player.id]) {
                        let pointComp = this.playersPointArr[player.id].pointComp
                        delete this.playersPointArr[player.id]
                        pointComp.removeFromParent()
                    } else {
                        console.log("移除一个本来就没有的玩家？");
                    }
                }
            }

            if (slefChange) {
                let player = slefChange.myself
                this.group_miniMapBg.scrollPane.posX = player.x - Number(this.group_miniMapBg.width) / 2
                this.group_miniMapBg.scrollPane.posY = player.y - Number(this.group_miniMapBg.height) / 2
                if (this.selfPoint) {
                    let isSelfPointX = true
                    let isSelfPointY = true
                    if (this.group_miniMapBg.scrollPane.posX <= 0) {
                        // this.selfPoint.node.setPosition(player.x, -player.y)
                        this.selfPoint.node.setPosition.posX = player.x
                        // this.selfPoint.node.position.x = player.x
                        // this.selfPoint.node.position.x = player.x
                        // this.group_selfPoint.visible = false
                        // this.selfPoint.visible = true
                        isSelfPointX = true
                    } else if (this.group_miniMapBg.scrollPane.posX >= (this.group_bg.width - this.group_miniMapBg.width)) {
                        // this.group_selfPoint.visible = false
                        // this.selfPoint.visible = true
                        // this.selfPoint.node.setPosition(player.x, -player.y)
                        // this.selfPoint.node.setPosition.posX = player.x
                        isSelfPointX = true
                    } else {
                        // this.group_selfPoint.visible = true
                        // this.selfPoint.visible = false
                        isSelfPointX = false
                    }
                    if (this.group_miniMapBg.scrollPane.posY <= 0) {
                        // this.selfPoint.node.setPosition(player.x, -player.y)
                        // this.selfPoint.node.position.y = -player.y
                        // this.group_selfPoint.visible = false
                        // this.selfPoint.visible = true
                        isSelfPointY = true
                    } else if (this.group_miniMapBg.scrollPane.posY >= (this.group_bg.height - this.group_miniMapBg.height)) {
                        // this.group_selfPoint.visible = false
                        // this.selfPoint.visible = true
                        // this.selfPoint.node.setPosition(player.x, -player.y)
                        // this.selfPoint.node.position.y = - player.y
                        isSelfPointY = true
                    } else {
                        // this.group_selfPoint.visible = true
                        // this.selfPoint.visible = false
                        isSelfPointY = false
                    }
                    if (isSelfPointX || isSelfPointY) {
                        this.group_selfPoint.visible = false
                        this.selfPoint.visible = true
                        this.selfPoint.node.setPosition(player.x, -player.y)
                    } else {
                        this.group_selfPoint.visible = true
                        this.selfPoint.visible = false
                    }
                } else {
                    let group_piont: fgui.GButton = fgui.UIPackage.createObject("LyConquestSeek", "group_point") as fgui.GButton;
                    group_piont.icon = "ui://LyConquestSeek/frame_ziji"
                    group_piont.scaleX = group_piont.scaleY = 5
                    group_piont.node.setPosition(player.x, -player.y)
                    this.group_miniMapBg.addChild(group_piont);
                    this.selfPoint = group_piont
                    this.selfPoint.visible = true
                }

            }
        }
    }

    private onBossLog(args?: any): void {
        let scene = this.fullInfo.conquestPlayer.scene
        if (scene) {
            let label_log: fgui.GLabel = this.uiPanel.getChild("label_log")
            let btn_goBoss: fgui.GLabel = this.uiPanel.getChild("btn_goBoss")
            btn_goBoss.visible = false
            if (args) {
                let attackerName = ""
                if (this.features) {
                    for (let i = 0; i < this.features.length; i++) {
                        const element = this.features[i];
                        if (element.playerId == args.attacker) {
                            attackerName = element.name
                        }
                    }
                }
                if (attackerName == "") {
                    attackerName = this.fullInfo.base.name
                }
                let monster = LocaleData.getConquestMonsterById(args.monsterId)
                label_log.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR9, [attackerName, monster.name, args.score])
            } else {
                let monsterBoss = null
                let monsterBoss1 = null
                for (let i = 0; i < scene.monsters.length; i++) {
                    const element = scene.monsters[i];
                    let monster = LocaleData.getConquestMonsterById(element.id)
                    if (monster.quality == "3") {
                        monsterBoss = monster
                        monsterBoss1 = element
                    }
                }
                if (monsterBoss) {
                    let time = monsterBoss1.showTime - GameServerData.getInstance().getServerTime()
                    if (time > 0) {
                        label_log.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR7, [monsterBoss.name, UtilsTool.parseTimeToString(time), monsterBoss.integral])
                    } else {
                        label_log.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR8, [monsterBoss.name, monsterBoss.integral])
                        btn_goBoss.visible = true
                        btn_goBoss.clearClick()
                        btn_goBoss.onClick(() => {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyConquestSeekMap, 0, { x: monsterBoss1.x, y: monsterBoss1.y });
                        })
                    }
                }
            }
        }
    }
    private unclaimedReward(): void {
        let label_unclaimedReward: fgui.GLabel = this.uiPanel.getChild("label_unclaimedReward")
        label_unclaimedReward.text = this.conquestPlayer.unclaimedReward.length
        let group_unclaimedReward: fgui.GLoader = this.uiPanel.getChild("group_unclaimedReward")
        if (this.conquestPlayer.unclaimedReward.length < 10) {
            group_unclaimedReward.url = "ui://LyConquestSeek/frame_beilou"
        } else if (this.conquestPlayer.unclaimedReward.length < 20) {
            group_unclaimedReward.url = "ui://LyConquestSeek/frame_beilou2"
        } else {
            group_unclaimedReward.url = "ui://LyConquestSeek/frame_beilou3"
        }
        group_unclaimedReward.clearClick()
        group_unclaimedReward.onClick(() => {
            if (this.conquestPlayer.unclaimedReward.length > 0) {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        this.unclaimedReward()
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "conquestClaimFightReward", {})
            }
        })
    }
    private onTask(): void {



        let taskData: any = null
        for (let i = 0; i < this.conquestPlayer.tasks.length; i++) {
            const element = this.conquestPlayer.tasks[i];
            if (element.status == 2) {
                taskData = element
                break
            }
        }
        if (!taskData) {
            for (let i = 0; i < this.conquestPlayer.tasks.length; i++) {
                const element = this.conquestPlayer.tasks[i];
                if (element.status == 1) {
                    taskData = element
                    break
                }
            }
        }
        let group_task: fgui.GComponent = this.uiPanel.getChild("group_task")
        if (taskData) {
            let taskXml = LocaleData.getConquestTaskById(taskData.taskId)
            group_task.visible = true
            let group_item: fgui.GComponent = group_task.getChild("group_item")
            let taskItem = UtilsUI.getBonuseItemsByBonusesId(taskXml.bonusesId)
            UtilsUI.setUIGroupItem(taskItem[0], group_item, null);
            let label_dec: fgui.GLabel = group_task.getChild("label_dec")
            label_dec.text = taskXml.taskdesc
            let label_task: fgui.GTextField = group_task.getChild("label_task")
            label_task.text = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR2, [taskData.value, taskXml.target]);
            label_task.color = UtilsUI.getEnoughColor(Number(taskData.value) >= Number(taskXml.target));
            group_task.clearClick()
            group_task.onClick(() => {
                if (Number(taskData.value) >= Number(taskXml.target)) {
                    UtilsUI.lockWait();
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait();
                        if (args.errorcode == 0) {
                            this.onTask()
                            this.unclaimedReward()
                        } else {
                            UtilsUI.showMsgTip(args.errorcode);
                        }
                    }, "conquestFinishTask", { taskId: taskData.taskId })
                }
            })
        } else {
            group_task.visible = false
        }
    }
    private onBattleInfo(): void {
        let myInfo = this.conquestPlayer.myInfo
        let myClanInfo = this.fullInfo.conquestPlayer.myClanInfo



        let label_selfRank: fgui.GLabel = this.uiPanel.getChild("label_selfRank")
        label_selfRank.text = myInfo.playerKillRankOf == -1 ? StrVal.LYCONQUESTSEEK.STR6 : myInfo.playerKillRankOf
        let label_totalKill: fgui.GLabel = this.uiPanel.getChild("label_totalKill")
        label_totalKill.text = myInfo.totalKill
        let label_streakKill: fgui.GLabel = this.uiPanel.getChild("label_streakKill")
        label_streakKill.text = myInfo.streakKill
        let label_clanRank: fgui.GLabel = this.uiPanel.getChild("label_clanRank")
        label_clanRank.text = myInfo.clanScoreRankOf == -1 ? StrVal.LYCONQUESTSEEK.STR6 : myInfo.clanScoreRankOf
        let label_clanScore: fgui.GLabel = this.uiPanel.getChild("label_clanScore")




        label_clanScore.text = myClanInfo.score
    }
    //==========公告=========
    private onNotice(args: any): void {
        let label_notice: fgui.GLabel = this.uiPanel.getChild("label_notice")
        let streakKill = LocaleData.getConquestContinuityNoticeByNum(args.streakKill)//连杀
        let totalKill = LocaleData.getConquestCumulativeNoticeByNum(args.totalKill)//累杀
        let nameStr: string = ""
        if (this.features) {
            for (let i = 0; i < this.features.length; i++) {
                const element = this.features[i];
                if (args.attacker == element.playerId) {
                    nameStr = element.name
                }
            }
        }
        if (nameStr == "") {
            nameStr = this.fullInfo.base.name
        }
        if (totalKill) {
            label_notice.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR12, [UtilsTool.stringFormat(totalKill.text1, [nameStr, args.totalKill])])
        } else {
            if (streakKill) {
                label_notice.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR12, [UtilsTool.stringFormat(streakKill.text2, [nameStr, args.streakKill])])
            }
        }

    }

    public onViewDestroy(): void {
        let __map = this.loadSpineNameMap;
        this.loadSpineNameMap = {};
        for (let key in __map) {
            (<Asset>__map[key]).decRef();
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
    public onViewReconnect(): boolean {
        this.onDeletePlayer()
        UtilsUI.lockWait();
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait();
            if (args.errorcode == 0) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyConquestSeekMain, 0, null);
            } else {
                UtilsUI.showMsgTip(args.errorcode);
            }
        }, "conquestEnterScene", null)
        return true
    }
    public getIsViewMask(): boolean {
        return false;
    };

}


