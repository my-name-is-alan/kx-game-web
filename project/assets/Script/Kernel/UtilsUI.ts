//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { HorizontalTextAlignment, Tween, UITransform, Vec2, VerticalTextAlignment, game, Color, sys, sp, TransformBit, EditBox, NodeEventType, Label, Overflow } from "cc";
import { StrVal } from "../Values/StrVal";
import { FmMsgTip } from "../Views/FmMsgTip";
import { FmMask, FmWait } from "../Views/FmWait";
import { LyLogin } from "../Views/LyLogin";
import { LyLoginCreateRole } from "../Views/LyLoginCreateRole";
import { LyMainPage } from "../Views/LyMainPage";
import { FmMsgBox, LyMsgBox, MsgBoxOth } from "../Views/LyMsgBox";
import { UtilsTool } from "./UtilsTool";
import { ViewDispatcher } from "./ViewDispatcher";
import { GameServer } from "./GameServer";
import { ScriptTimer } from "./ScriptTimer";
import { GameServerData } from "./GameServerData";
import { GuideManager } from "./GuideManager";
import { PlatformAPI } from "./PlatformAPI";
import { AudioManager } from "./AudioManager";
import { VarVal } from "../Values/VarVal";
import { PErrCode } from "../Values/PErrCode";
import { LocaleData, ModelShowInfo } from "./LocaleData";
import { LyItemReward } from "../Views/LyItemReward";
import { LyEliteTips, LyMonsTowerBuffTips } from "../Views/LyEliteTips";
import { LyItemTips } from "../Views/LyItemTips";
import { LyPayFirstGift } from "../Views/LyPayFirstGift";
import { LocaleUser } from "./LocaleUser";
import { FguiGTween } from "./FguiGTween";
import { LyItemBoxTips } from "../Views/LyItemBoxTips";
import { FmGuideFifgtPower } from "../Views/FmGuideFifgtPower";
import { LyPlayerInfo } from "../Views/LyPlayerInfo";
import { LyItemPetTips } from "../Views/LyItemPetTips";
import { PointRedData, PointRedType } from "./PointRedData";
import { LyItemRewardForge } from "../Views/LyItemRewardForge";
import { LyPetBuffTips } from "../Views/LyPetBuffTips";
import { petBuffLevel } from "../Views/PetTransferDisplay";
import { LyEquipTips } from "../Views/LyEquipTips";
import { LyPayRecharge } from "../Views/LyPayRecharge";
import { FmDropItemTo, FmJumpItemTo } from "../Views/FmDropItemTo";
import { LyConquestSeekStart } from "../Views/LyConquestSeekStart";
import { SpinePlayer } from "./SpinePlayer";

export interface simplePlayerBase {
    guid: string,
    name: string,
    serverid: number,
    welcome: number,
    level: number,
    combatPower: number,
    phase: number,
    playerEntityAttr: string,
    character: number,
    appearance: number,
    avatar: number,
    avatarBorder: number,
    chatBubble: number,
    title: number,
    mountType: number,
    mountSkin: number,
    summonPet: string,
    lastOfflineTime: number,
    evolutionLevel: number,
   	evolveFinishTime: number,
	ip: string,
	uid: string
}

export interface playerInformation {
    simpleBase: simplePlayerBase,
    battleEquips: Array<any>,
	eliteMonsterId: Array<string>,
	battleTheurgy: Array<any>,
	mount: any,
	petInfo: any,
	elitemonster: Array<any>,
	clanInfo: any,
	veinInfo: any
}

enum SkeBoneName {
    bottom = "bottom",
    center = "center",
    top = "top",
    bullet = "bullet",
}

export enum BodyPointType {
    none = "0",
    bottom = "1", // 脚底
    center = "2", // 中心
    top = "3", // 头顶
    bullet = "4", // 武器发射点
}

export interface BattleTypeInfo {
    type:number,

    towerCDCall?:Function,
    towerCDText?:string,

    damage?:number,

    duelIcon1?:string,
    duelIcon2?:string,
    duelName1?:string,
    duelName2?:string,
    duelScore1?:number,
    duelScore2?:number,
    duelScoreAdd1?:number,
    duelScoreAdd2?:number,

    qunyinRank?:number,
    qunyinRankUp?:number,
    qunyinScore?:number,
    qunyinCount?:number,

    desc1?:string,
    desc3?:string,
	bonunItems?:Array<BonuseItem>,
    callBack?:Function,

    playerScore?:number,
    scoreChange?:number,
    clansoloHpMax1?:number,
    clansoloHpValue1?:number,
    clansoloHpMax2?:number,
    clansoloHpValue2?:number,
}

export interface BattleResultParams {
    battleResult:any,
    bonuseString:string,
    bonuseStringCompanion?:string,
    bonuseStringGoldFinger?:string,
    closeBack?:Function, // 关闭战斗界面。
    replayBack?:Function, // 重播战斗界面。
    typeInfo:BattleTypeInfo,
}

export interface ShareGameQuery {
    type:string,
    userid:string,
    openid:string,
    guid:string,
}

export interface ShareGameData {
    title:string,
    imageUrl?:string,
    query?:ShareGameQuery,
}

export interface ActivityRankPlayer {
    guid: string,
    avatar: number,
    avatarBorder: number;
    name: string,
    combatPower: number,
    phase: number,
    score: number,
    rankOf: number,
    robot: number,
    mountType: number,
    mountSkin: number,
    summonPet: string,
    character: number,
    appearance: number,
    title: number,
}

export interface BonuseItem {
    type: string,
    proto: any,
    count: string,
    name: string,
    desc: string
}

enum ColorHEXType {
    rgb = "#rgb",
    rrggbb = "#rrggbb",
    rrggbbaa = "#rrggbbaa",
}

export enum MonthCardItemType {
    give_now = "1", // 充值给的奖励
    give_daily = "2", // 每日领取的奖励
    king_monster = "3", // 妖王速战数
    kanshu = "4", //砍树速度
    skip_ad = "5", // 跳过广告
    duel_item = "6", // 挑战状上限
    refresh_pet = "7", // 刷新灵兽
    vein_auto = "8", // 灵脉自动
    vein_speed = "9", // 灵脉提速
    auto_kanshu = "10", // 自动钓鱼
}

export enum MonthCardType {
    Month = "1", // 月卡
    Life = "2", // 终身卡
}

export interface PayItem {
    money:string|number,
    id?:string|number,
    type?:string|number,
    points?:string|number,
}

export class UtilsUI {
    private constructor() { }

    /**
     * 在消息层，弹出一个消息飘窗，自动销毁。
     */
    public static showMsgTip(val: any): void {
        let text: string;
        if (typeof val == 'string') {
            text = val;
        }
        else if (typeof val == 'number') {
            text = StrVal.ERRCODE[val];
            if (!text) {
                text = UtilsTool.stringFormat(StrVal.COMMON.STR1, [val]);
            }
        }
        else {
            text = UtilsTool.stringFormat(StrVal.COMMON.STR1, [""]);
        }
        ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_PUSH_MULTI, FmMsgTip, 0, text);
    }

    /**
     * 在消息层，弹出一个掉落弹窗，飞向目的地。
     */
    public static showDropItems(params: any): void {
        ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_PUSH_MULTI, FmDropItemTo, 0, params);
    }

    /**
     * 在消息层，弹出一个掉落弹窗，飞向目的地。
     */
    public static showJumpItems(params: any): void {
        if (params.type == 1) {
            // 暂时兼容其他
        } else {
            let viewLayer = ViewDispatcher.isViewExist(LyMainPage);
            if (viewLayer) {
                let btn_finger = viewLayer.getUiPanel().getChild("btn_finger", fgui.GButton);
                if (btn_finger) {
                    params.jumpUrl = btn_finger.icon;
                    params.jumpStartPos = btn_finger.localToGlobal(btn_finger.width / 2, btn_finger.height / 2);
                    ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_PUSH_MULTI, FmJumpItemTo, 0, params);
                }
            }
        }
    }

	/**
     * 在界面层，弹出一个消息框，点击按钮后自动销毁。
     */
    public static showMsgBox(style: number, title: string, contentText: string, callClose: Function, cancelText: string, callCancel: Function, confirmText: string, callConfirm: Function, okText: string, callOk: Function, oth?: MsgBoxOth): void {
        if (!title || title.length == 0) {
            title = StrVal.COMMON.STR31;
        }
        let params: any = {
            style: style,
            title: title,
            contentText: contentText,
            callClose: callClose,
            cancelText: cancelText,
            callCancel: callCancel,
            confirmText: confirmText,
            callConfirm: callConfirm,
            okText: okText,
            callOk: callOk,
            oth: oth
        }
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH_MULTI, LyMsgBox, 0, params);
    }

    /**
     * 在消息层，弹出一个系统消息框（平常请使用 showMsgBox 做普通消息框！）。
     */
    public static showSysBox(style: number, title: string, contentText: string, callClose: Function, cancelText: string, callCancel: Function, confirmText: string, callConfirm: Function, okText: string, callOk: Function, oth?: MsgBoxOth): void {
        if (!title || title.length == 0) {
            title = StrVal.COMMON.STR31;
        }
        let params: any = {
            style: style,
            title: title,
            contentText: contentText,
            callClose: callClose,
            cancelText: cancelText,
            callCancel: callCancel,
            confirmText: confirmText,
            callConfirm: callConfirm,
            okText: okText,
            callOk: callOk,
            oth: oth
        }
        ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_PUSH_MULTI, FmMsgBox, 0, params);
    }

    /**
     * 往上层添加一个漏斗，单例，但内部有计数，必须与unlockWait成对使用！
     */
    public static lockWait(): void {
        ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_PUSH, FmWait, 0, null);
        ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_UPDATE, FmWait, 0, { count: 1 });
    }

    /**
     * 去掉上层的漏斗，单例，但内部有计数，必须与lockWait成对使用！
     */
    public static unlockWait(): void {
        ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_UPDATE, FmWait, 0, { count: -1 });
    }

    /**
     * 同 lockWait
     */
    public static lockMask(): void {
        ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_PUSH, FmMask, 0, null);
        ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_UPDATE, FmMask, 0, { count: 1 });
    }

    /**
     * 同 unlockWait
     */
    public static unlockMask(): void {
        ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_UPDATE, FmMask, 0, { count: -1 });
    }

    /**
     * 在消息层，弹出一个战斗力飘窗，自动销毁。
     */
    public static showMsgPower(power: string, powernew: string): void {
        ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_DESTROY, FmGuideFifgtPower, 0, null); // 不要重叠了。
        ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_PUSH_MULTI, FmGuideFifgtPower, 0, {power:power, powernew:powernew});
    }

    /**
     * 公共动态二级界面出场动效。
     */
    public static playCommonGroupAni(group_main:fgui.GComponent, doneCall?:Function): void {
        group_main.setScale(0.5, 0.5);
        group_main.setPivot(0.5, 0.5);
        FguiGTween.new(group_main).to(0.5, {scaleX:1, scaleY:1}, {easing: fgui.EaseType.CubicOut}).call(() => {
            if (doneCall) {
                doneCall();
            }
        }).start();
    }

    /**
     * 公共动态二级界面出场动效（书本）。
     */
    public static playCommonGroupAniBook(group_main:fgui.GComponent, doneCall?:Function): void {
        let group_outvisible = group_main.getChild("group_outvisible");
        if (group_outvisible) {
            group_outvisible.visible = false;
        }
        let init_width = group_main.width;
        group_main.width = 160;
        FguiGTween.new(group_main).to(0.8, {width:init_width}, {easing: fgui.EaseType.SineOut}).call(() => {
            if (group_outvisible) {
                group_outvisible.visible = true;
            }
            if (doneCall) {
                doneCall();
            }
        }).start();
    }

    /**
     * 结算奖励界面出场动效。
     */
    public static playCommonResultAni(comp:fgui.GComponent, doneCall?:Function): void {
        let init_height = comp.height;
        comp.height = comp.height / 3;
        FguiGTween.new(comp).to(0.5, {height:init_height}, {easing: fgui.EaseType.CubicOut}).call(() => {
            /*
            if (doneCall) {
                doneCall();
            }
            */
        }).start();
        if (doneCall) {
            doneCall();
        }
    }

    /**
     * 异兽入侵掉落动效。
     */
    public static playCommonDropAni(callback:Function, comp:fgui.GComponent, start:Vec2, dstX:number, dstY:number, end?:Vec2): void {
        comp.setPosition(start.x, start.y);
        let TIME_ALL = 1;
        let counter = 2;
        let doneCall = () => {
            counter--;
            if (counter == 0) {
                if (end) {
                    FguiGTween.new(comp).delay(TIME_ALL/4).to(TIME_ALL/4, {x:end.x, y:end.y}, {easing: fgui.EaseType.CubicOut}).call(() => {
                        if (callback) {callback()}
                    }).start();
                }else{
                    FguiGTween.new(comp).delay(TIME_ALL/2).call(() => {
                        if (callback) {callback()}
                    }).start();
                }
            }
        }
        FguiGTween.new(comp).by(TIME_ALL, {x:dstX}, {easing: fgui.EaseType.Linear}).call(doneCall).start();
        FguiGTween.new(comp).by(TIME_ALL/4, {y:0-dstY}, {easing: fgui.EaseType.CubicOut}).call(() => {
            FguiGTween.new(comp).by(TIME_ALL/4, {y:dstY}, {easing: fgui.EaseType.CubicIn}).call(() => {
                FguiGTween.new(comp).by(TIME_ALL/4, {y:0-dstY/2}, {easing: fgui.EaseType.CubicOut}).call(() => {
                    FguiGTween.new(comp).by(TIME_ALL/4, {y:dstY/2}, {easing: fgui.EaseType.CubicIn}).call(doneCall).start();
                }).start();
            }).start();
        }).start();
    }

    /**
     * 普通掉落动效飞向目的地。
     */
    public static playCommonDropToAni(callback:Function, comp:fgui.GObject, start:Vec2, dstX:number, dstY:number, end:Vec2): void {
        comp.setPosition(start.x, start.y);
        let TIME_ALL = 0.3;
        let counter = 2;
        let doneCall = () => {
            counter--;
            if (counter == 0) {
                FguiGTween.new(comp).delay(TIME_ALL).to(TIME_ALL, {x:end.x, y:end.y, scaleX:0.5, scaleY:0.5, alpha:0}, {easing: fgui.EaseType.CubicOut}).call(() => {
                    if (callback) {callback()}
                }).start();
            }
        }
        FguiGTween.new(comp).by(TIME_ALL, {x:dstX}, {easing: fgui.EaseType.Linear}).call(doneCall).start();
        FguiGTween.new(comp).by(TIME_ALL/2, {y:0-dstY}, {easing: fgui.EaseType.CubicOut}).call(() => {
            FguiGTween.new(comp).by(TIME_ALL/2, {y:dstY}, {easing: fgui.EaseType.CubicIn}).call(() => {
                doneCall();
            }).start();
        }).start();
    }

    /**
     * 普通掉落动效弹跳掉入。
     */
    public static playCommonJumpToAni(callback:Function, comp:fgui.GObject, start:Vec2, dstY:number): void {
        comp.setPosition(start.x, start.y);
        let TIME_ALL = 0.6;
        FguiGTween.new(comp).by(TIME_ALL/2, {y:0-dstY}, {easing: fgui.EaseType.CubicOut}).call(() => {
            FguiGTween.new(comp).by(TIME_ALL/2, {y:dstY}, {easing: fgui.EaseType.CubicIn}).call(() => {
                if (callback) {callback()}
            }).start();
        }).start();
    }

    /**
	 * 发送观看广告协议。
	 */
	public static sendwatchad():void {
        if (GameServer.isGameEnter()) {
            GameServer.getInstance().send((args: any) => {
                // UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    if (args.itemInserts) {
                        UtilsUI.showJumpItems({
                            bonuseString:GameServerData.getInstance().bonusesResultsToString([{inserts:args.itemInserts}])
                        });
                    }
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "watchad", {type:1})
        }
	}

    /**
     * 普通放大动效。
     */
    public static playCommonScaleAni(callback:Function, comp:fgui.GObject, aniTime:number, scale:number): void {
        FguiGTween.new(comp).by(aniTime/2, {scaleX:scale, scaleY:scale}, {easing: fgui.EaseType.CubicOut})
            .by(aniTime/2, {scaleX:-scale, scaleY:-scale}, {easing: fgui.EaseType.CubicOut}).call(() => {
                if (callback) {callback()}
        }).start();
    }

    /**
     * 清除所有容器，所有管理器，卸载资源后重启。
     */
    public static restartGame(): void {
        if (globalThis.wx) {
            globalThis.wx.asdk.asdkRestartMiniProgram({
                success: () => {
                    console.log('restart succ');
                },
                fail: () => {
                    console.log('restart fail');
                }
            })
        } else {
        if (sys.platform == sys.Platform.EDITOR_PAGE) {
            UtilsUI.showMsgTip("当前运行平台【编辑器】无此功能。");
            return;
        }
        PointRedData.destroyInstance();
        GameServer.clear();
        ScriptTimer.clear();
        AudioManager.clear();
        GuideManager.clear();
        ViewDispatcher.clear();
        fgui.GTween.clear(); // 必须要这样，不然里面有个update调度器不会注册新的，所以卡住了。
        Tween.stopAll();
        GameServerData.destroyInstance();
        GameServer.destroyInstance();
        PlatformAPI.clear();
        setTimeout(() => {
            fgui.GRoot.inst.dispose();
            // game.end();
            // game.run();
            game.restart(); // 这里不会重置代码资源。
        }, 100);
        }
    }

    /**
     * 登陆后发送协议（只能GameServer调用）有些进游戏要发协议的坏蛋设计（不保证必定成功）。
     */
	public static showEnterGameSend(type?:number):void {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        // 琅琊榜。
        if ((!type || type == VarVal.CROSS_SYS_TYPE.PALACE) && GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.palace)) {
            // UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                // UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    PointRedData.getInstance().updatePointChild(PointRedType.LyPalaceMain);
                    // 刷一下，如果没其他界面关闭，他不会出来。
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {receiveGrant:true});
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "palaceGetInfo", null)
        }
        // 群英。
        if ((!type || type == VarVal.CROSS_SYS_TYPE.QUNYIN) && GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.qunyin)) {
            GameServer.getInstance().send((args: any) => {
                if (args.errorcode == 0) {
                    PointRedData.getInstance().updatePointChild(PointRedType.LyCrossQunYin);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "queryChallengeList", null)
        }
        // 八荒。
        if ((!type || type == VarVal.CROSS_SYS_TYPE.CONQUSET) && fullInfo.conquestOpen) {
            GameServer.getInstance().send((args: any) => {
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {sendCrossServer:VarVal.CROSS_SYS_TYPE.CONQUSET}); // 插入活动
					PointRedData.getInstance().updatePointChild(PointRedType.LyConquestSeek);
                    if (!type) { // 登录时触发，活动开启时不触发
                        LyConquestSeekStart.isWaitForOpen = true;
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {tryConquestSeek:true});
                    }
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "getConquestInfo", null)
        }
        // 单刀赴会。
        if ((!type || type == VarVal.CROSS_SYS_TYPE.CLANSOLO) && fullInfo.clanSoloOpen && fullInfo.clanSoloOpen.isOpen) {
            GameServer.getInstance().send((args: any) => {
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {sendCrossServer:VarVal.CROSS_SYS_TYPE.CLANSOLO});
			        PointRedData.getInstance().updatePointChild(PointRedType.LyClanSoloPassport);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "clanSoloGetInfo", null)
        }
        //攻城掠地
        if ((!type || type == VarVal.CROSS_SYS_TYPE.GRABCITY) && GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.GrabCity)) {
            GameServer.getInstance().send((args: any) => {
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {sendCrossServer:VarVal.CROSS_SYS_TYPE.GRABCITY});
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "siegeGetDatail", null)
        }
	}

    /**
     * 登陆后弹出主页（只能GameServer调用）。
     */
	public static showEnterGameView(type:number, req:any):void {
		if (type == 1) {
			// 如果在登录页面entergame
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyLogin, 0, null);
			// 如果在建角页面createcharcter
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyLoginCreateRole, 0, null);

            // 初始化红点树。
            PointRedData.getInstance().initPointTree();

            // HDHive 绑定状态（购买前缓存）
            PlatformAPI.refreshHdhiveStatus();

            // 主界面
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyMainPage, 0, null);

			// 其余弹窗公告等在主界面队列生成，排队显示。
		} else {
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyLogin, 0, null);
			
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyLoginCreateRole, 0, req.sarg);
			// 其余界面例如开场视频放创建角色界面内生成;
		}
	}

    /**
     * 弹窗首充礼包。
     */
	public static tryShowPayFirstGift(type:number):boolean {
        let firstGiftItem = GameServerData.getInstance().getFirstPayItems(1);
        if (firstGiftItem && !PlatformAPI.isBinaryExamine()) {
            let saveField:string;
            if (type == 1) {
                saveField = VarVal.FIELD_SV.PAY_FIRSTGIFTSTART;
            } else {
                saveField = VarVal.FIELD_SV.PAY_FIRSTGIFTLOST;
            }
            let dateStr = UtilsTool.TimeToDateStr(GameServerData.getInstance().getServerTime());
            if (dateStr != LocaleUser.getUser(saveField)) {
                LocaleUser.setUser(saveField, dateStr);
                LocaleUser.flush();
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayFirstGift, 0, null);
                return true;
            }
        }
	}

    /**
     * 通用充值接口调用，使用只需调用即可。
     * 内部自己会拉起1充值页面、2机缘购买页面、3免费直接领取通过事件发货、4广告调用观看完后通过事件发货。
     */
    private static isSendServerPaySel:boolean = false;
	private static hdhiveVoucherRequestIds:{[payId:string]:string} = {};
	private static hdhiveVoucherRequestSequence:number = 0;

	private static getHdhiveVoucherRequestId(payId:number):string {
		let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
		let roleId = fullInfo && fullInfo.base ? String(fullInfo.base.guid) : "unknown";
		let key = roleId + ":" + String(payId);
		let requestId = UtilsUI.hdhiveVoucherRequestIds[key];
		if (!requestId) {
			UtilsUI.hdhiveVoucherRequestSequence++;
			let random = Math.random().toString(36).substring(2, 12);
			requestId = "v" + Date.now().toString(36) + "-" + UtilsUI.hdhiveVoucherRequestSequence.toString(36) + "-" + random;
			UtilsUI.hdhiveVoucherRequestIds[key] = requestId.substring(0, 64);
		}
		return UtilsUI.hdhiveVoucherRequestIds[key];
	}

	private static clearHdhiveVoucherRequestId(requestId:string):void {
		for (let key in UtilsUI.hdhiveVoucherRequestIds) {
			if (UtilsUI.hdhiveVoucherRequestIds[key] == requestId) {
				delete UtilsUI.hdhiveVoucherRequestIds[key];
				return;
			}
		}
	}

	private static openVoucherRecharge(missingChance:number):void {
		UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
			UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR5, [missingChance]), null,
			StrVal.COMMON.STR32, null,
			StrVal.COMMON.STR38, () => {
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayRecharge, 0, {
					type: VarVal.bonusType.chance,
					isClick: true,
				});
			}, "", null);
	}

	public static payRechargeItem(callback:Function, payItem:any, payType:string, giftType:string, ext?:any, index?:number):void {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
		let moneyFen = Number(payItem.money);
		let needChance = Math.floor(moneyFen / 100);

		let buildGiftParams = ():any => {
			let sendParams:any = {};
			if (payType == VarVal.payType.gift) {
				sendParams.giftType = Number(giftType);
				sendParams.giftId = Number(payItem.id);
				sendParams.ext = ext;
			} else {
				sendParams.id = Number(payItem.id);
			}
			sendParams.index = index; // 索引相同礼包 ID 时区分类型（雾隐岛）
			return sendParams;
		};

		let sendWithChance = ():void => {
			LyPayRecharge.lastPayItem = payItem;
			UtilsUI.lockWait();
			GameServer.getInstance().send((args:any) => {
				UtilsUI.unlockWait();
				if (args.errorcode != 0) {
					LyPayRecharge.lastPayItem = undefined;
					UtilsUI.showMsgTip(args.errorcode);
				}
			}, "buyGiftWithChance", buildGiftParams());
		};

		let sendVoucherPackOrder = ():void => {
			let payId = Number(payItem.id);
			let requestId = UtilsUI.getHdhiveVoucherRequestId(payId);
			LyPayRecharge.lastPayItem = payItem;
			UtilsUI.lockWait();
			GameServer.getInstance().send((args:any) => {
				UtilsUI.unlockWait();
				if (args.errorcode == 0) {
					PlatformAPI.setHdhivePointsCache(Number(args.remaining_points));
					UtilsUI.clearHdhiveVoucherRequestId(requestId);
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayRecharge, 0, null);
					PlatformAPI.fetchHdhiveMe((_res:any) => {
						ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayRecharge, 0, null);
					});
					if (callback) {
						callback(null);
					}
					return;
				}

				// 失败时保留 request_id，同一档位重试时由服务端幂等恢复。
				// 已完成退款的终态订单可以安全开启下一笔购买。
				if (args.terminal) {
					UtilsUI.clearHdhiveVoucherRequestId(requestId);
				}
				LyPayRecharge.lastPayItem = undefined;
				if (args.errorcode == PErrCode.hdhive_not_bound || args.errorcode == PErrCode.hdhive_rebind_required) {
					UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "", StrVal.LYSETTING.STR57, null,
						StrVal.COMMON.STR32, null,
						StrVal.LYSETTING.STR58, () => {
							PlatformAPI.startHdhiveBindFlow();
						}, "", null);
				} else {
					UtilsUI.showMsgTip(args.errorcode);
				}
			}, "applyHdhiveOrder", {
				id: payId,
				request_id: requestId,
			});
		};

		// 免费和广告档保持原有的 buyGiftWithChance 发货链路。
		if (moneyFen == 0) {
			sendWithChance();
		} else if (moneyFen < 0) {
            PlatformAPI.doSdkRewardVideoAD((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                } else {
					sendWithChance();
                }
			});
		} else if (payType == VarVal.payType.chance) {
			sendVoucherPackOrder();
		} else {
			let isUseChance = Number(fullInfo.base.chance) >= needChance;
			if (!isUseChance) {
				UtilsUI.openVoucherRecharge(needChance - Number(fullInfo.base.chance));
				return;
			}

			if (UtilsUI.isSendServerPaySel) {
				sendWithChance();
			} else {
				UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_THREE, "",
				UtilsTool.stringFormat(StrVal.COMMON.STR36, [
					LocaleData.getItemProto(VarVal.bonusType.chance).name,
					UtilsUI.getItemIconUrl(VarVal.bonusType.chance),
					needChance,
					UtilsUI.getEnoughColorToHEX(false),
					payItem.name
				]), null,
				StrVal.COMMON.STR32, null,
				StrVal.COMMON.STR33, (isCheckSel:boolean) => {
					UtilsUI.isSendServerPaySel = isCheckSel;
					sendWithChance();
				}, "", null, {
					checkBoxText: StrVal.COMMON.STR35,
					needCountText: UtilsTool.stringFormat(StrVal.COMMON.STR37, [UtilsUI.getItemIconUrl(VarVal.bonusType.chance), UtilsUI.getEnoughColorToHEX(true), fullInfo.base.chance, needChance]),
				});
			}
		}
	}

    /**
     * 通用分享接口调用，使用只需调用即可。
     */
	public static playerShareGame(callback:Function, shareData:ShareGameData):void {
        let __query:string;
        if (shareData.query) {
            __query = PlatformAPI.getSendParamsEx(shareData.query);
        }
        PlatformAPI.doSdkShareGame((errmsg:string) => {
            if (errmsg) {
                UtilsUI.showMsgTip(errmsg);
            } else {
            if (shareData.query) { // 邀请
            } else {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        if (callback) {
                            callback();
                        }
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "playerShare", null);
            }
            }
        }, {
            title: shareData.title,
            imageUrl: shareData.imageUrl,
            query: __query
        })
	}

    /**
     * 获得月卡终身卡描述。
     */
	public static getMonthCardDesc(type:MonthCardType): string {
        let redColorStr = UtilsUI.getEnoughColorToHEX(false);
		let payCards = LocaleData.getPayOtherCardItems(type);
        let descText = "";
        for (let i = 0; i < payCards.length; i++) {
            let cardItem = payCards[i];
            let src = StrVal.LYPAY_RECHARGE.STR205[Number(cardItem.ptype) - 1];
            let rep:Array<number | string> = [i+1];
            if (cardItem.ptype == MonthCardItemType.give_now || cardItem.ptype == MonthCardItemType.give_daily) {
                if (cardItem.itemId.length > 1) {
                    rep.push(UtilsUI.getItemIconUrl(cardItem.itemId));
                    rep.push(redColorStr);
                    rep.push(cardItem.itemCount);
                } else {
                    rep.push("");
                    rep.push(redColorStr);
                    rep.push("");
                }
                if (cardItem.stone.length > 1) {
                    rep.push(UtilsUI.getItemIconUrl(VarVal.bonusType.stone));
                    rep.push(cardItem.stone);
                } else {
                    rep.push("");
                    rep.push("");
                }
            } else if (cardItem.ptype == MonthCardItemType.king_monster || cardItem.ptype == MonthCardItemType.duel_item) {
                rep.push(redColorStr);
                rep.push(cardItem.count);
            } else if (cardItem.ptype == MonthCardItemType.kanshu || cardItem.ptype == MonthCardItemType.vein_auto || cardItem.ptype == MonthCardItemType.vein_speed) {
                rep.push(redColorStr);
            } else if (cardItem.ptype == MonthCardItemType.skip_ad || cardItem.ptype == MonthCardItemType.auto_kanshu) {
                //
            } else if (cardItem.ptype == MonthCardItemType.refresh_pet) {
                rep.push(redColorStr);
                rep.push(cardItem.count);
            }
            let line = UtilsTool.stringFormat(src, rep);
            descText = descText + line + ((i == payCards.length - 1) ? "" : "\n");
        }
        return descText;
	}

    /**
     * 获得月卡终身卡描述。
     */
	public static getMonthCardDescNew(type:MonthCardType): string {
		let payCards = LocaleData.getPayOtherCardItems(type);
        payCards.sort((itemA, itemB) => {
            return Number(itemA.sort) - Number(itemB.sort);
        })
        let descText = "";
        let idxCount = 0;
        for (let i = 0; i < payCards.length; i++) {
            let cardItem = payCards[i];
            let src = cardItem.desc;
            let rep:Array<number | string> = [];
            if (cardItem.ptype == MonthCardItemType.king_monster || cardItem.ptype == MonthCardItemType.duel_item) {
                idxCount++;
                rep.push(idxCount);
                rep.push(cardItem.count);
            } else if (cardItem.ptype == MonthCardItemType.kanshu || cardItem.ptype == MonthCardItemType.vein_auto || cardItem.ptype == MonthCardItemType.vein_speed) {
                idxCount++;
                rep.push(idxCount);
            } else if (cardItem.ptype == MonthCardItemType.skip_ad || cardItem.ptype == MonthCardItemType.auto_kanshu) {
                idxCount++;
                rep.push(idxCount);
            } else if (cardItem.ptype == MonthCardItemType.refresh_pet) {
                idxCount++;
                rep.push(idxCount);
                rep.push(cardItem.count);
            }
            if (rep.length > 0) {
                let line = UtilsTool.stringFormat(src, rep);
                descText = descText + line + ((i == payCards.length - 1) ? "" : "\n");
            }
        }
        return descText;
	}

    /**
     * 获得月卡终身卡每日领取项。
     */
	public static getMonthCardGiveDailyItem(type:MonthCardType, ptype:MonthCardItemType): any {
        let payCards = LocaleData.getPayOtherCardItems(type);
        for (let i = 0; i < payCards.length; i++) {
            let cardItem = payCards[i];
            if (cardItem.ptype == ptype) {
                return cardItem;
            }
        }
	}

    /**
     * 获得月卡终身卡每日领取描述。
     */
	public static getMonthCardDesc0(type:MonthCardType): string {
        let cardItem = UtilsUI.getMonthCardGiveDailyItem(type, MonthCardItemType.give_daily);
        let itemProto:any;
        if (cardItem.itemId.length > 1) {
            let proto = LocaleData.getItemProto(cardItem.itemId);
            itemProto = proto;
        }
        
        let src:string;
        if (type == MonthCardType.Month) {
            src = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR206, [
                UtilsTool.stringFormat("ui://CCommon/{0}", [itemProto.icon])
            ]);
        } else {
            src = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR207, [
                UtilsTool.stringFormat("ui://CCommon/{0}", [itemProto.icon]),
                UtilsUI.getItemIconUrl(VarVal.bonusType.stone)
            ]);
        }
        return src;
	}

    /**
     * 获得月卡终身卡每日领取描述。
     */
	public static getMonthCardDesc0New(type:MonthCardType): string {
		let payCards = LocaleData.getPayOtherCardItems(type);
        let descText = "";
        for (let i = 0; i < payCards.length; i++) {
            let cardItem = payCards[i];
            if (cardItem.ptype == MonthCardItemType.give_now) {
                if (cardItem.stone.length > 1) {
                    let line = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR232, [UtilsUI.getItemIconUrl(VarVal.bonusType.stone), cardItem.stone]);
                    descText = descText + line + "\n";
                }
            } else if (cardItem.ptype == MonthCardItemType.give_daily) {
                if (cardItem.itemId.length > 1) {
                    let line = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR233, [UtilsUI.getItemIconUrl(cardItem.itemId), cardItem.itemCount]);
                    descText = descText + line + "\n";
                }
                if (cardItem.stone.length > 1) {
                    let line = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR233, [UtilsUI.getItemIconUrl(VarVal.bonusType.stone), cardItem.stone]);
                    descText = descText + line + "\n";
                }
                if (cardItem.itemId2.length > 1) {
                    let line = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR233, [UtilsUI.getItemIconUrl(cardItem.itemId2), cardItem.itemCount2]);
                    descText = descText + line + "\n";
                }
            }
        }
        return descText;
	}

    /**
     * 获得月卡终身卡每天领取的BonuseItems。
     */
	public static getMonthCardGiveBonuseItems(type:MonthCardType, ptype:MonthCardItemType): Array<BonuseItem> {
        let bonuseItems = new Array<BonuseItem>();
        let cardItem = UtilsUI.getMonthCardGiveDailyItem(type, ptype);
        if (cardItem.itemId.length > 1) {
            bonuseItems.push(UtilsUI.getBonuseItem(VarVal.bonusType.item, null, cardItem.itemId, cardItem.itemCount));
        }
        if (cardItem.stone.length > 1) {
            bonuseItems.push(UtilsUI.getBonuseItem(VarVal.bonusType.stone, null, null, cardItem.stone));
        }
        if (cardItem.itemId2.length > 1) {
            bonuseItems.push(UtilsUI.getBonuseItem(VarVal.bonusType.item, null, cardItem.itemId2, cardItem.itemCount2));
        }
        return bonuseItems;
	}

    /**
     * 是否月卡终身卡功能项生效。
     * */
	public static getMonthLifeCardActiveItem(ptype:MonthCardItemType, type?:MonthCardType): any {
		let payCards = LocaleData.getPayOtherCardItems(null);
        for (let i = 0; i < payCards.length; i++) {
            let cardItem = payCards[i];
            if (cardItem.ptype == ptype && (!type || cardItem.type == type)) {
                if (cardItem.type == MonthCardType.Month && GameServerData.getInstance().isHaveMonthCard()) {
                    return cardItem;
                } else if (cardItem.type == MonthCardType.Life && GameServerData.getInstance().isHaveLifeCard()) {
                    return cardItem;
                }
            }
        }
	}

    /**
     * 获得江湖令上限。
     * */
	public static getDuelItemLimitCount(): number {
		let evolutionRoot = LocaleData.getEvolutionRoot();
        let countMax:number = Number(evolutionRoot.duelItemDropLimit);
        let activeCardItem = UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.duel_item, MonthCardType.Month);
        if (activeCardItem) { // 卡项生效
            countMax = countMax + Number(activeCardItem.count);
        }
        let activeCardItem1 = UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.duel_item, MonthCardType.Life);
        if (activeCardItem1) { // 卡项生效
            countMax = countMax + Number(activeCardItem1.count);
        }
        return countMax;
	}

    /**
     * 获得道具资源路径。
     * */
	public static getItemIconUrl(protoOrId:any): string {
        let proto:any;
        if (typeof(protoOrId) == "string" || typeof(protoOrId) == "number") {
            proto = LocaleData.getItemProto(protoOrId);
        } else {
            proto = protoOrId;
        }
        return UtilsTool.stringFormat("ui://CCommon/{0}", [proto.icon]);
	}

    /**
     * 获得秘籍资源路径。
     * */
	public static getTheurgyIconUrl(protoId:any, isQuad?:boolean): string {
        let proto:any;
        if (typeof(protoId) == "string" || typeof(protoId) == "number") {
            proto = LocaleData.getTheurgyById(protoId);
        } else {
            proto = protoId;
        }
        if (isQuad) {
            return UtilsTool.stringFormat("ui://LyTheurgy/f_{0}", [proto.icon]);
        } else {
            return UtilsTool.stringFormat("ui://LyTheurgy/y_{0}", [proto.icon]);
        }
	}

    /**
     * 获得金额显示文本。
     * */
	public static setPayItemButtonName(btn_item:fgui.GButton, payItem:PayItem): fgui.GButton {
        let money = Number(payItem.money) * 0.01;
        if (money > 0) {
            if (String(payItem.type) == VarVal.payType.chance) {
                let points = UtilsUI.getHdhivePoints(payItem);
                UtilsUI.setButtonIcon(btn_item, null, points > 0
                    ? UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR3, [points])
                    : StrVal.LYPAY_RECHARGE.STR6);
            } else {
                UtilsUI.setButtonIcon(btn_item, VarVal.bonusType.chance, String(money));
            }
        } else if (money == 0) {
            UtilsUI.setButtonIcon(btn_item, null, StrVal.LYPAY_RECHARGE.STR303);
        } else {
            UtilsUI.setButtonIcon(btn_item, VarVal.BUTTON_ICON.reward_ad, StrVal.LYPAY_RECHARGE.STR303);
        }
        return btn_item;
	}

    /**
     * 仅返回服务端价格查询显式下发的正整数积分价。
     */
    public static getHdhivePoints(payItem:any): number {
        if (!payItem || payItem.points == null || payItem.points === "") {
            return 0;
        }
        let points = Number(payItem.points);
        return points > 0 && points == Math.floor(points) ? points : 0;
    }

    /** 弹出 HDHive 授权 code 输入框（复用设置兑换码 UI） */
    public static promptHdhiveBindCode(): void {
        // 延迟引用，避免与 LySettingMsgBox ↔ UtilsUI 循环依赖
        const mod = require("../Views/LySettingMsgBox");
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, mod.LySettingMsgBox, 0, { type: 4 });
    }

    /**
     * 获得金额显示文本。
     * */
	public static setPayItemRebateComp(group_rebeatfan:fgui.GComponent, payItem:PayItem): void {
        if (group_rebeatfan) {
            let money = Number(payItem.money) * 0.01;
            if (money > 0) {
                group_rebeatfan.visible = true;
                let label_rebate = group_rebeatfan.getChild("label_rebate", fgui.GTextField);
                if (label_rebate) {
                    let num = (money * Number(LocaleData.getActivityXml(VarVal.ACTIVITY_ID.TREE_REBATE).rate)).toFixed(1);
                    label_rebate.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR8, [num]);
                }
            } else {
                group_rebeatfan.visible = false;
            }
        }
	}

    /**
     * 在界面层，弹出一个反馈框，点击按钮后自动销毁。
     */
	public static showException(msg:string):void {
		let params = {
            title: "抱歉，出错啦~",
            content: msg,
        }
        //ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH_MULTI, LyMsgPage, 0, params);
	}

    /**
     * 在界面层，弹出一个奖励获得界面，点击任意区域关闭。
     */
	public static showItemReward(params:any):void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH_MULTI, LyItemReward, 0, params);
	}

    /**
     * GameServerData.getInstance().bonusesResultsToString()可以把服务器下发的奖励结构对象转换为bonuseString。
     * 这里把bonuseString转换为Array<BonuseItem>。
     * BonuseItem是参与奖励的判断的结构体。
     */
    public static getBonuseItemsByString(bonuseString:string):Array<BonuseItem> {
        let items:Array<BonuseItem> = new Array<BonuseItem>();
        if (bonuseString && bonuseString.length > 0) {
            let bigBlocks:Array<string> = bonuseString.split(":");
            let itemBlocks:Array<string> = (bigBlocks[2] ? bigBlocks[2] : bigBlocks[0]).split(";");
            for (let i = 0; i < itemBlocks.length; i++) {
                if (itemBlocks[i] != "") {
                    UtilsUI.getBonuseItemsInStr(itemBlocks[i], items);
                }
            }
        }
        return items;
    }

    public static getBonuseItemsByBonusesId(bonusesIds:string):Array<BonuseItem> {
        let items:Array<BonuseItem> = new Array<BonuseItem>();
        let bIds = bonusesIds.split("-");
        for (let jjj = 0; jjj < bIds.length; jjj++) {
            let protos = LocaleData.getBonuseProtos(bIds[jjj]);
            for (let i = 0; i < protos.length; i++) {
                let proto = protos[i];
                // proto.condType != "0" // 需要条件才会掉落。
                if (proto.type == "0") {
                } else if (proto.type == VarVal.bonusType.item) {
                    if (proto.protoId.indexOf("-")) {
                        let ttt1:Array<string> = proto.protoId.split("-");
                        let ttt2:Array<string> = proto.count.split("-");
                        for (let i = 0; i < ttt1.length; i++) {
                            items.push(UtilsUI.getBonuseItem(proto.type, proto.rate, ttt1[i], ttt2[i]));
                        }
                    } else {
                        items.push(UtilsUI.getBonuseItem(proto.type, proto.rate, proto.protoId, proto.count));
                    }
                } else {
                    items.push(UtilsUI.getBonuseItem(proto.type, proto.rate, null, proto.point));
                }
            }
        }
        return items;
    }

    private static getBonuseItemsInStr(blockStr:string, items:Array<BonuseItem>):Array<BonuseItem> {
        if (blockStr.indexOf("-") >= 0) { // 必定是道具、装备。
            let ttt:Array<string> = blockStr.split(",");
            let protoIds = ttt[1].split("-");
            let counts = ttt[2].split("-");
            for (let i = 0; i < protoIds.length; i++) {
                items.push(UtilsUI.getBonuseItem(ttt[0], null, protoIds[i], counts[i]));
            }
        } else {
            let ttt:Array<string> = blockStr.split(",");
            if (ttt[0] == VarVal.bonusType.item || ttt[0] == VarVal.bonusType.equip) {
                items.push(UtilsUI.getBonuseItem(ttt[0], null, ttt[1], ttt[2]));
            } else {
                items.push(UtilsUI.getBonuseItem(ttt[0], null, null, ttt[1]));
            }
        }
        return items;
    }

    public static getBonuseItem(type:string, rate:string, protoId:string, count:string):BonuseItem {
        if (rate === undefined || rate === null) {
            rate = "10000";
        } else {
            rate = String(rate);
        }
        protoId = String(protoId);
        let item:BonuseItem = {
            type: String(type),
            proto: undefined,
            count: String(count),
            name: "",
            desc: ""
        }
        if (item.type == VarVal.bonusType.item) {
            if (LocaleData.isItem(protoId)) { // 物品。
                item.proto = LocaleData.getItemProto(protoId);
                item.desc = item.proto.desc;
            } else if (LocaleData.isEquip(protoId)) { // 装备。
                item.proto = LocaleData.getEquipProto(protoId);
            } else if(LocaleData.isEliteMonster(protoId)) {//精怪
                item.proto = LocaleData.getEliteMonsterProto(protoId);
                let modelShowInfo = LocaleData.getModelShowInfo(item.proto.modelId)
                item.proto["icon"] = modelShowInfo.icon_square
                let nextMosterLevelData = LocaleData.getEliteMonsterLevel(item.proto.id, 0)
                item.desc = LocaleData.getSkillProto(nextMosterLevelData.skill_id).desc
            } else if(LocaleData.isEliteMonsterDebris(protoId)) {//精怪碎片
                item.proto = LocaleData.getEliteMonsterDebProto(protoId);
                item.desc = item.proto.desc
            } else if(LocaleData.isTheurgy(protoId)) {//神通 以及神通碎片
                item.proto = LocaleData.getTheurgyById(protoId);
                let skillId = item.proto.phaseSkillId.split(",")[0];
                item.desc = LocaleData.getSkillProto(skillId).desc;
            } else if(LocaleData.isTheurgySeal(protoId)) {
                item.proto = LocaleData.getTheurgSealByItemId(protoId);
            }else if(LocaleData.isPet(protoId)){
                item.proto = LocaleData.getPetProto(protoId);
                item.desc = item.proto.description;
            }
            item.name = item.proto.name;
        } else if (item.type == VarVal.bonusType.equip) {
            item.proto = LocaleData.getEquipProto(protoId);
            item.name = item.proto.name;
            // item.desc = item.proto.desc; 没有字段
        } else {
            item.proto = LocaleData.getItemProto(item.type);
            item.name = item.proto.name;
            item.desc = item.proto.desc;
        }
        return item;
    }

    public static getRebateBonuseItems():Array<BonuseItem> {
        let payItem = LyPayRecharge.lastPayItem;
        if (payItem) {
            if (payItem.type != VarVal.payType.chance && Number(payItem.money) > 0) {
                let rebateChance = Number(payItem.money) * 0.01 * Number(LocaleData.getActivityXml(VarVal.ACTIVITY_ID.TREE_REBATE).rate);
                // rebateChance.toFixed(1) // 带四舍五入
                rebateChance = Math.floor(rebateChance * 10);
                LyPayRecharge.lastPayItem = undefined;
                return [
                    UtilsUI.getBonuseItem(VarVal.bonusType.chance, null, null, String(rebateChance / 10))
                ];
            }
        }
    }

    /**
     * GameServerData.getInstance().bonusesResultsToString()可以把服务器下发的奖励结构对象转换为bonuseString。
     * 这里把bonuseString转换为Array<BonuseItem>。
     * BonuseItem是参与奖励的判断的结构体。
     */
    public static setUIGroupItem(item:BonuseItem, group_item:fgui.GComponent, onClick:Function, isSkipEffect?:boolean):void {
        // 装备
        if (item && item.type == VarVal.bonusType.equip) {
            UtilsUI.setUIGroupEquip(item.proto.id, group_item, onClick);
            return;
        }
        let isAddEffect = false;

        let loader_back:fgui.GLoader = group_item.getChild("loader_back");
        let loader_icon:fgui.GLoader = group_item.getChild("loader_icon");
        let img_count:fgui.GImage = group_item.getChild("img_count");
        let label_count:fgui.GLabel = group_item.getChild("label_count");
        let btn_frame:fgui.GButton = group_item.getChild("btn_frame");

        let backimg_name:string;
        let text_count:string = "";
        if (item) {
            if (item.type == VarVal.bonusType.item) {
                if (!isSkipEffect && Number(item.proto.quality) > 4) {
                    isAddEffect = true;
                }
                if (LocaleData.isItem(item.proto.id)) { // 物品类型的icon。
                    backimg_name = item.proto.quality;
                    loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [item.proto.icon]);
                    text_count = item.count;
                } else if (LocaleData.isEquip(item.proto.id)) { // 装备类型的icon。
                    backimg_name = item.proto.quality;
                    loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [item.proto.icon]);
                    if (Number(item.count) > 1) {
                        text_count = item.count;
                    }
                } else if (LocaleData.isEliteMonster(item.proto.id)) {// 精怪类型的icon。
                    backimg_name = item.proto.quality;
                    loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [item.proto.icon]);
                    text_count = item.count;
                } else if (LocaleData.isEliteMonsterDebris(item.proto.id)) {// 精怪碎片类型的icon。
                    backimg_name = item.proto.quality;
                    loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [item.proto.icon]);
                    text_count = item.count;
                } else if (LocaleData.isPet(item.proto.id)) {// 灵兽碎片类型的icon。
                    backimg_name = String(Number(item.proto.quality) + 1);
                    let modelShowInfo = LocaleData.getModelShowInfo(item.proto.modelId)
                    loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [modelShowInfo.icon_square]);
                    text_count = item.count;
                } else if (LocaleData.isTheurgy(item.proto.id)) {// 神通碎片icon。
                    backimg_name = String(Number(item.proto.quality) + 1);
                    loader_icon.url = UtilsTool.stringFormat("ui://CCommon/suipian_{0}", [item.proto.icon]);
                    text_count = item.count;
                } else {
                    backimg_name = item.proto.quality;
                    loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [item.proto.icon]);
                    text_count = item.count;
                }
            } else { // 资产类型的icon。
                backimg_name = item.proto.quality;
                loader_icon.url = UtilsUI.getItemIconUrl(item.proto);
                text_count = item.count;
            }
        } else {
            loader_back.url = "ui://CCommon/daojuku_1";
            loader_icon.url = null;
        }

        if (loader_back && backimg_name) {
            loader_back.url = UtilsTool.stringFormat("ui://CCommon/daojuku_{0}", [backimg_name]);
        }
        if (label_count) {
            label_count.text = text_count;
            if (label_count.text == "" || label_count.text == "0") {
                label_count.visible = false;
                if (img_count) {
                    img_count.visible = false;
                }
            } else {
                label_count.visible = true;
                if (img_count) {
                    // img_count.visible = true; 都不显示。
                }
            }
        }

        btn_frame.clearClick();
        if (onClick) {
            btn_frame.onClick(onClick);
        } else {
            if (item) {
                btn_frame.onClick(() => {
                    let _params = {
                        bonuseItem:item,
                        pos:group_item.localToGlobal(0, 0),
                        size:new Vec2(group_item.width, group_item.height)
                    }
                    if (item.type == VarVal.bonusType.item && LocaleData.isPet(item.proto.id)) {
                        ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyItemPetTips, 0, _params);
                    } else {
                        if (item.type == VarVal.bonusType.item && (item.proto.subType == VarVal.itemtype.randomChest || item.proto.subType == VarVal.itemtype.chooseChest)) {
                            ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyItemBoxTips, 0, _params);
                        }else{
                            ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyItemTips, 0, _params);
                        }
                    }
                });
            }
        }

        let loader_spine_item:fgui.GLoader3D = group_item.getChild("loader_spine_item");
        if (loader_spine_item) {
            if (isAddEffect && !loader_spine_item.content) {
                UtilsUI.loadSpineEffAndShow(loader_spine_item, VarVal.UI_EFF.loader_spine_item, true);
            } else if (!isAddEffect && loader_spine_item.content) {
                loader_spine_item.freeSpine();
            }
        }
    }

    /**
     * 精怪头像，其他头像也可以用。
     */
    public static setUIEliteItem(proto:any, group_item:fgui.GComponent, onClick:Function):void {
        let loader_icon:fgui.GLoader = group_item.getChild("loader_icon");
        let btn_frame:fgui.GButton = group_item.getChild("btn_frame");
        if (proto) {
            if (typeof(proto) == "string" || typeof(proto) == "number") {
                proto = LocaleData.getEliteMonsterProto(proto);
            }
            let modelItem = LocaleData.getModelItem(proto.modelId);
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [modelItem.avatar]);
        }
        btn_frame.clearClick();
        if (onClick) {
            btn_frame.onClick(onClick);
        } else {
            btn_frame.onClick(() => {
                ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteTips, 0, {
                    eliteProto:proto,
                    pos:group_item.localToGlobal(0, 0),
                    size:new Vec2(group_item.width, group_item.height)
                });
            });
        }
    }

    /**
     * 其他点击小弹窗提示。
     * descTip = {
     *     name:string,
     *     level:string,
     *     desc:string
     * }
     */
    public static setUIDescTipItem(group_item:fgui.GComponent, descTip:any):void {
        let btn_frame:fgui.GButton = group_item.getChild("btn_frame");
        btn_frame.clearClick();
        if (descTip) {
            btn_frame.onClick(() => {
                ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyMonsTowerBuffTips, 0, {
                    descTip:descTip,
                    pos:group_item.localToGlobal(0, 0),
                    size:new Vec2(group_item.width, group_item.height)
                });
            });
        }
    }

    /**
     * 自动消失的物品获得弹窗提示。
     */
    public static showItemRewardForge(bonuseString:any):void {
        ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyItemRewardForge, 0, {
            bonuseString: bonuseString
        });
    }

    /**
     * 设置称号或阶段图标（如果没有称号则用阶段）。
     */
    public static setTitleIconByTitleId(group: fgui.GComponent, phase:string | number, titleId?:string | number):void {
        let loader_phase: fgui.GLoader = group.getChild("loader_phase")
        let loader_title: fgui.GLoader = group.getChild("loader_ch")
        let loader3d_title: fgui.GLoader3D = group.getChild("loader3d_ch")
        loader3d_title.freeSpine()
        if (titleId && titleId != 0) {
            loader_phase.visible = false
            loader_title.visible = loader3d_title.visible = true
            let titleItem = LocaleData.getCharacterTitle(titleId);
            let titleModel = LocaleData.getModelItem(titleItem.modelId)
            new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                spp.playAnimation("stand", true);
            }, loader3d_title, titleModel.spine);
            loader_title.url   = UtilsTool.stringFormat("ui://CCommon/{0}", [titleItem.icon]);
        } else if (phase) {
            loader_phase.visible = true
            loader_title.visible = loader3d_title.visible = false
            loader_phase.url = UtilsTool.stringFormat("ui://CCommon/phase{0}", [phase]);
        } else {
            loader_phase.url = undefined;
        }
    }
    /**
     * 获得钓鱼掉落特效。
     */
    public static getDiaoyuSpineName(quality:string | number):string {
        quality = Number(quality);
        if (quality > 16) {
            quality = 16;
        }
        return UtilsTool.stringFormat("diaoyu_{0}jie", [quality]);
    }

    /**
     * 设置称号或阶段图标（如果没有称号则用阶段）。 高质量称号使用的是spine
     */
    public static setGroupTitle(group: fgui.GComponent, phase:string | number, titleId?:string | number){
        let loader_title: fgui.GLoader = group.getChild("loader_ch")
        let loader3d_title: fgui.GLoader3D = group.getChild("loader3d_ch")
        loader3d_title.freeSpine()
        if (titleId && titleId != 0) {
            let titleItem = LocaleData.getCharacterTitle(titleId);
            let titleModel = LocaleData.getModelItem(titleItem.modelId)
            // loader_title.url = UtilsTool.stringFormat("ui://CCommon/{0}", [titleItem.icon]);
            new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                spp.playAnimation("stand", true);
            }, loader3d_title, titleModel.spine);
            loader_title.url   = UtilsTool.stringFormat("ui://CCommon/{0}", [titleItem.icon]);
        } else if (phase) {
            loader_title.url = UtilsTool.stringFormat("ui://CCommon/phase{0}", [phase]);
        } else {
            loader_title.url = undefined;
        }
    }

    /**
     * 支持传装备实例或原型id。
     */
    public static setUIGroupEquip(equipInst:any, group_item:fgui.GComponent, onClick:Function):void{
        if (typeof(equipInst) == "string") {
            equipInst = LocaleData.getEquipProto(equipInst);
        }

        let loader_spine_equip:fgui.GLoader3D = group_item.getChild("loader_spine_item");
        if (loader_spine_equip) {
            loader_spine_equip.freeSpine();
        }
        let qualityXml = LocaleData.getEquipQualityProto(equipInst.quality)
        let star: string = qualityXml.star
        let qualityType: number = star == "0" ? equipInst.quality : Number(star)
        if (Number(equipInst.quality) > 4) {
            UtilsUI.loadSpineEffAndShow(loader_spine_equip, VarVal.UI_EFF["equip_" + qualityType], true);
        }
        let loader_back:fgui.GLoader = group_item.getChild("loader_back");
        let loader_icon:fgui.GLoader = group_item.getChild("loader_icon");
        let label_count:fgui.GLabel = group_item.getChild("label_count");
        let label_solt:fgui.GLabel = group_item.getChild("label_solt");
        let btn_frame:fgui.GButton = group_item.getChild("btn_frame");
        let group_star:fgui.GComponent = group_item.getChild("group_star");
        if (group_star) { group_star.visible = false }
        if (equipInst.level) {
            let icon_name:string;
            if (equipInst.cid) {
                icon_name = LocaleData.getEquipProto(equipInst.cid).icon;
            } else { // 原型没有此字段
                icon_name = equipInst.icon;
            }
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [icon_name]);
            if (label_count) {
                label_count.text = UtilsTool.stringFormat(StrVal.COMMON.STR18, [equipInst.level]);
            }
            if (label_solt){
                 label_solt.text = LocaleData.getSoltQualityProto(equipInst.slot).name
            }
            if(loader_back){
                loader_back.url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [qualityType]);
            }
            if(group_star){
                if (qualityXml.star != "0" ) {
                    group_star.visible = true
                    let starNum = LocaleData.getEquipStarNumByStar(qualityXml.id, qualityXml.star)
                    let con_star :fgui.Controller = group_star.getController("con_star")
                    con_star.selectedIndex = starNum - 1
                    for (let i = 0; i < 5; i++) {
                        let star:fgui.GLoader = group_star.getChild("img_star"+(i+1))
                        star.url = UtilsTool.stringFormat("ui://CCommon/icon_level{0}", [qualityXml.star])
                    }
                }
            }
        } else {
            loader_back.url = "ui://CCommon/item_back0";
            loader_icon.url = null;
            label_count.text = "";
        }
        if(btn_frame){
            btn_frame.clearClick();
            if (onClick) {
                btn_frame.onClick(onClick);
            } else {
                btn_frame.onClick(() => {
                    UtilsUI.showEquipInfo(btn_frame, equipInst);
                });
            }
        }
    }

    /**
     * 设置按钮的icon，支持资产类型。
     */
    public static setButtonIcon(btn_item:fgui.GButton, protoId:string, title?:string): fgui.GButton {
        let loader_icon:fgui.GLoader = btn_item.getChild("loader_icon");
        if (loader_icon) { // 有时候会有观看广告的支付按钮，所以显示一个观影图标，要求需要有loader。
            if (protoId) {
                if (protoId == VarVal.BUTTON_ICON.reward_ad) {
                    loader_icon.url = UtilsTool.stringFormat("ui://CCommon/item_value{0}", [protoId]);
                } else {
                    loader_icon.url = UtilsUI.getItemIconUrl(protoId);
                }
            } else {
                loader_icon.url = null;
            }
        }
        if (title) {
            btn_item.text = title;
        }
        return btn_item;
    }

    /**
     * 通过挂载点获得骨骼的名称。
     */
    private static getSkeAniBoneName(ptype:BodyPointType): SkeBoneName {
        if (ptype == BodyPointType.center) {
            return SkeBoneName.center;
        } else if (ptype == BodyPointType.top) {
            return SkeBoneName.top;
        } else if (ptype == BodyPointType.bullet) {
            return SkeBoneName.bullet;
        } else { // BodyPointType.bottom || BodyPointType.none
            return SkeBoneName.bottom;
        }
    }

    /**
     * 获得骨骼相在Loader3D的位置。
     */
    public static getSkeAniBonePos(loader_spine:fgui.GLoader3D, ptype:BodyPointType): Vec2 {
        let spineSke = <sp.Skeleton>loader_spine.content;
        let bone = spineSke.findBone(UtilsUI.getSkeAniBoneName(ptype));
        let localPos:Vec2;
        if (bone) {
            localPos = new Vec2(bone.worldX * loader_spine.scaleX, bone.worldY * loader_spine.scaleY); // cocos的坐标，fgui的坐标除了Y轴相反，缩放倍率这些相同吗？目前相同。
        } else {
            localPos = new Vec2(0, 0);
        }
        return localPos;
    }

    /**
     * 废弃，使用SpinePlayer代替。
     */
    public static loadSpineEffAndShow(loader_spine:fgui.GLoader3D, modelId:string | ModelShowInfo,loop:boolean): void {
        let modelShowInfo:ModelShowInfo = LocaleData.getModelShowInfo(modelId);
        PlatformAPI.loadSpine((asset:any)=> {
            if (loader_spine && !loader_spine.isDisposed) {
                loader_spine.setScale(1, 1);
                // 底居中
                loader_spine.setSpine(asset, new Vec2(0.5, 1), false);
                let spineSke = <sp.Skeleton>loader_spine.content;
                // 皮肤
                spineSke.setSkin(modelShowInfo.skin);
                let ske: sp.Skeleton = <sp.Skeleton>loader_spine.content;
                ske.setAnimation(0, ske._skeleton.data.animations[0].name, loop);
            }
        }, modelShowInfo.spine)
    }

    public static setTheurgyNameColor(label_name:fgui.GTextField, quality:string | Number):void {
        quality = String(quality);
        if (quality == "1") {
            label_name.color = new Color(156, 221, 123);
            label_name.strokeColor = new Color(89, 139, 39);
        } else if (quality == "2") {
            label_name.color = new Color(137, 207, 249);
            label_name.strokeColor = new Color(47, 120, 159);
        } else if (quality == "3") {
            label_name.color = new Color(205, 180, 255);
            label_name.strokeColor = new Color(106, 56, 138);
        } else {
            label_name.color = new Color(255, 194, 82);
            label_name.strokeColor = new Color(140, 68, 29);
        }
    }

    public static getQualityColor(quality:string|Number):Color{
        quality = String(quality)
        let colorStr: Color 
        let colorStr2: string 
        if (quality == "1") {
            // colorStr2 = "#72746A"
            colorStr = new Color(114, 116, 106, 255);
        } else if (quality == "2") {
            // colorStr2 = "#598B27"
            colorStr = new Color(89, 139, 39, 255);
        } else if (quality == "3") {
        //   colorStr2 = "#2F669F"
            colorStr = new Color(47, 102, 159, 255);
        } else if (quality == "4") {
        //   colorStr2 = "#6A388B"
            colorStr = new Color(106, 56, 139, 255);
        } else if (quality == "5") {
        //   colorStr2 = "#A45120"
            colorStr = new Color(164, 81, 32, 255);
        } else if (quality == "6") {
        //   colorStr2 = "#841F1F"
            colorStr = new Color(132, 31, 31, 255);
        } else if (quality == "7") {
        //   colorStr2 = "#897208"
            colorStr = new Color(137, 114, 8, 255);
        } else if (quality == "8") {
        //   colorStr2 = "#1D8FB9"
            colorStr = new Color(29, 143, 185, 255);
        } else if (quality == "9") {
        // colorStr2 = "#00ADC1"     
              colorStr = new Color(0, 173, 193, 255);
        } else if (quality == "10") {
        // colorStr2 = "##3840F1"
            colorStr = new Color(56, 64, 241, 255);
        } else if (quality == "11") {
        // colorStr2 = "#6B3AFF"
            colorStr = new Color(107, 58, 255, 255);
        } else if (quality == "12") {
        // colorStr2 = "#BE5207"
            colorStr = new Color(190, 82, 7, 255);
        } else if (quality == "13") {
            colorStr2 = "#CD3737"
            colorStr = new Color(250, 55, 55, 255);
        } else if (quality == "14") {
            // colorStr2 = "#B8A312"
            colorStr = new Color(184, 163, 18, 255);
        } else if (quality == "15") {
            // colorStr2 = "#F87337"
            colorStr = new Color(248, 115, 55, 255);
        } else {
            // colorStr2 = "#F87337"
            colorStr = new Color(248, 115, 55, 255);
        } 
        return colorStr
    }
    public static getQualityColor2(quality:string|Number):string {
        quality = String(quality)
        let colorStr: Color 
        let colorStr2: string 
        if (quality == "1") {
            colorStr2 = "#E7E7E7"
            // colorStr = new Color(114, 116, 106, 255);
        } else if (quality == "2") {
            colorStr2 = "#B6F279"
            // colorStr = new Color(89, 139, 39, 255);
        } else if (quality == "3") {
          colorStr2 = "#61A8F1"
            // colorStr = new Color(47, 102, 159, 255);
        } else if (quality == "4") {
          colorStr2 = "#C576F8"
            // colorStr = new Color(106, 56, 139, 255);
        } else if (quality == "5") {
          colorStr2 = "#F9A73D"
            // colorStr = new Color(164, 81, 32, 255);
        } else if (quality == "6") {
          colorStr2 = "#E9502C"
            // colorStr = new Color(132, 31, 31, 255);
        } else if (quality == "7") {
          colorStr2 = "#FCF35B"
            // colorStr = new Color(137, 114, 8, 255);
        }else if (quality == "8") {
        colorStr2 = "#66D6FF"   
            //   colorStr = new Color(0, 173, 193, 255);
        } else if (quality == "9") {
        colorStr2 = "#4ED2A4"
            // colorStr = new Color(56, 64, 241, 255);
        } else if (quality == "10") {
        colorStr2 = "#608bff"
            // colorStr = new Color(107, 58, 255, 255);
        } else if (quality == "11") {
        colorStr2 = "#c593d4"
            // colorStr = new Color(190, 82, 7, 255);
        } else if (quality == "12") {
            colorStr2 = "#f08253"
            // colorStr = new Color(250, 55, 55, 255);
        } else if (quality == "13") {
            colorStr2 = "#ea5252"
            // colorStr = new Color(184, 163, 18, 255);
        } else if (quality == "14") {
            colorStr2 = "#afebbc"
            // colorStr = new Color(248, 115, 55, 255);
        } else if (quality == "15") {
            colorStr2 = "#fab6e4"
            // colorStr = new Color(248, 115, 55, 255);
        }  else if (quality == "15") {
            colorStr2 = "#d86cfb"
            // colorStr = new Color(248, 115, 55, 255);
        }  else {
            colorStr2 = "#d86cfb"
            // colorStr = new Color(248, 115, 55, 255);
        } 
        return colorStr2
    }
    public static getQualityColor1(quality): string {
        let colorStr = ""
        if (quality == 1) {
            colorStr = "#598b27"
        } else if (quality == 2) {
            colorStr = "#2f669f"
        } else if (quality == 3) {
            colorStr = "#6a388a"
        } else if (quality == 4) {
            colorStr = "#904a44"
        } else if (quality == 5) {
            colorStr = "#862017"
        }
        return colorStr
    }
    public static getRankColor(rank:number): Color {
        rank = Number(rank);
        if (rank == 1) {
            return new Color(193, 114, 43);
        } else if (rank == 2) {
            return new Color(131, 110, 199);
        } else {
            return new Color(76, 127, 195);
        }
    }
    public static getRankBonuseColor(rank:number): Color {
        rank = Number(rank);
        if (rank == 1) {
            return new Color(212, 132, 27);
        } else if (rank == 2) {
            return new Color(180, 131, 255);
        } else if (rank == 3) {
            return new Color(113, 171, 210);
        } else {
            return new Color(103, 118, 92);
        }
    }
    public static getEnoughColor(isEnough: boolean, type?:number):Color {
        if (type == 1) { // 黑色底的时候
            if (isEnough) {
                return new Color(39, 255, 136);
            } else {
                return new Color(230, 60, 22);
            }
        } else if (type == 2) { // 黑色灰色
            if (isEnough) {
                return new Color(0, 0, 0);
            } else {
                return new Color(128, 128, 128);
            }
        } else if (type == 3) { // 黑色红色
            if (isEnough) {
                return new Color(0, 0, 0);
            } else {
                return new Color(230, 34, 34);
            }
        } else { // 默认白色底
            if (isEnough) {
                // "#2B841C"
                return new Color(43, 132, 28);
            } else {
                // "#D53026"
                return new Color(213, 48, 38);
            }
        }
    }

    public static getEnoughColorToHEX(isEnough: boolean, type?:number):string {
        return UtilsUI.getEnoughColor(isEnough, type).toHEX(ColorHEXType.rrggbb);
    }

    public static getEnoughColorString(isEnough: boolean, str: string):string {
        if (isEnough) {
            // "#2B841C"
            return UtilsTool.stringFormat("[color=2B841C]{0}[/color]",[str]);
        } else {
            // "#D53026"
            return UtilsTool.stringFormat("[color=D53026]{0}[/color]",[str]);
        }
       
    }

    public static getCompleteColor(isComplete: boolean):Color {
        if (isComplete) {
            // "#FFF089"
            return new Color(243, 255, 236);
        } else {
            // "#16191A"
            return new Color(22, 25, 26);
        }
    }

    /**
     * tab栏标签样式文本（颜色+描边）
     */
    public static updateTabButtonColor(button:fgui.GButton, index?:number):void {
        let title = button.getChild("title", fgui.GTextField);
        if (index == 2) {
            if (button.selected) {
                title.color = new Color(255, 253, 202);
                title.strokeColor = new Color(201, 82, 82);
            } else {
                title.color = new Color(66, 35, 31);
                title.strokeColor = new Color(0, 0, 0, 0);
            }
        } else if (index == 3) {
            if (button.selected) {
                title.fontSize = 32;
                title.color = new Color(120, 92, 55);
                title.strokeColor = new Color(255, 254, 198);
            } else {
                title.fontSize = 27;
                title.color = new Color(34, 140, 120);
                title.strokeColor = new Color(244, 247, 187);
            }
        } else if (index == 4) {
            if (button.selected) {
                title.fontSize = 32;
                title.color = new Color(120, 92, 55);
                title.strokeColor = new Color(255, 254, 198);
            } else {
                title.fontSize = 27;
                title.color = new Color(59, 88, 119);
                title.strokeColor = new Color(227, 248, 255);
            }
        } else if (index == 5) {
            if (button.selected) {
                title.fontSize = 32;
                title.color = new Color(120, 92, 55);
                title.strokeColor = new Color(255, 254, 198);
            } else {
                title.fontSize = 27;
                title.color = new Color(133, 77, 30);
                title.strokeColor = new Color(255, 220, 180);
            }
        } else {
            if (button.selected) {
                title.color = new Color(94, 77, 41);
                title.strokeColor = new Color(255, 255, 255);
            } else {
                title.color = new Color(215, 207, 154);
                title.strokeColor = new Color(111, 121, 71);
            }
        }
    }

    /**
     * 是否UBB语法。
     */
	public static isUBBText(str:string):boolean {
        if (str.indexOf("color") >= 0
        || str.indexOf("size") >= 0
        || str.indexOf("img") >= 0) {
            return true;
        }
	}

    /**
     * 把List的第一个Item渲染提到前面。
     */
	public static setListChildSiblingIndex(list:fgui.GList):void {
        // 把第一个渲染提到前面。
        list.getChildAt(0).node.setSiblingIndex(list.numItems - 1);
	}

    /**
     * List逐个加载（优化性能）
     */
    public static setFguiGlistDelayNumItems(list_item:fgui.GList, numItems:number, deltaTime?:number): void {
        let index:number = 0;
        list_item.delayOnChildAdd = (onChildAdd:Function, nodeIdx:number) => {
            index++;
            FguiGTween.new(list_item).delay(index * (deltaTime ? deltaTime : 0.05)).call(() => {
                if (!list_item.isDisposed) {
                    onChildAdd();
                }
            }).start();
        }
        list_item.numItems = numItems;
        list_item.delayOnChildAdd = undefined;
    }

    /**
     * 把fgui中某对象中某位置转换为fgui根对象的位置。
     */
	public static coverUIToRootPos(comp:fgui.GComponent, vec2:Vec2):Vec2 {
        let pos:Vec2;
		if (comp instanceof fgui.GGroup) { // 如果是高级组件。
            pos = comp.parent.localToGlobal(comp.x + vec2.x, comp.y + vec2.y);
		} else {
			pos = comp.localToGlobal(vec2.x, vec2.y);
		}
        return fgui.GRoot.inst.globalToLocal(pos.x, pos.y);
	}

    /**
     * 获得某个FGUI的实际区域。
     */
	public static getUIRectPos(comp:fgui.GComponent):Array<Vec2> {
        let realWidth = comp.width // * comp.scaleX
	    let realHeight = comp.height // * comp.scaleY
        let src:Vec2;
        if (comp.pivotAsAnchor) {
            src = new Vec2(0 - realWidth * comp.pivotX, 0 - realHeight * comp.pivotY);
        } else {
            src = new Vec2(0, 0);
        }
        let posArr:Array<Vec2> = new Array<Vec2>();
		posArr.push(UtilsUI.coverUIToRootPos(comp, src));
		posArr.push(UtilsUI.coverUIToRootPos(comp, new Vec2(src.x + realWidth, src.y)));
		posArr.push(UtilsUI.coverUIToRootPos(comp, new Vec2(src.x + realWidth, src.y + realHeight)));
		posArr.push(UtilsUI.coverUIToRootPos(comp, new Vec2(src.x, src.y + realHeight)));
		return posArr;
	}

    /**
     * 设置GTextInput对齐方式（废弃）。
     */
    /*
    public static doGTextInputAlign(textInput:fgui.GTextInput, align:GTextInputAlign):void {
        let uiComp:UITransform = textInput._editBox.node.getComponent(UITransform);
        let textLabel = textInput._editBox.textLabel;
        let placeholderLabel = textInput._editBox.placeholderLabel;

        let x = 0;
        let y = 0;
        let anchorx = 0;
        let anchory = 0;
        if (align == GTextInputAlign.CENTER_CENTER) {
            textInput.align = HorizontalTextAlignment.CENTER;
            textInput.verticalAlign = VerticalTextAlignment.CENTER;

            x = uiComp.contentSize.width / 2;
            y = 0 - uiComp.contentSize.height / 2;
            anchorx = 0.5;
            anchory = 0.5;
        } else if (align == GTextInputAlign.LEFT_CENTER) {
            textInput.align = HorizontalTextAlignment.LEFT;
            textInput.verticalAlign = VerticalTextAlignment.CENTER;

            y = 0 - uiComp.contentSize.height / 2;
            anchorx = 0;
            anchory = 0.5;
        } else {
            textInput.align = HorizontalTextAlignment.LEFT;
            textInput.verticalAlign = VerticalTextAlignment.TOP;

            y = uiComp.contentSize.height;
            anchorx = 0;
            anchory = 1;
        }
        if (textLabel && (x != textLabel.node.getPosition().x || y != textLabel.node.getPosition().y)) {
            textLabel.node.setPosition(x, y);
            textLabel.node.getComponent(UITransform).setAnchorPoint(anchorx, anchory);
        }
        if (placeholderLabel && (x != placeholderLabel.node.getPosition().x || y != placeholderLabel.node.getPosition().y)) {
            placeholderLabel.node.setPosition(x, y);
            placeholderLabel.node.getComponent(UITransform).setAnchorPoint(anchorx, anchory);
        }
    }
    */

    /**
     * 设置GTextInput对齐方式。
     */
    public static resetGTextInputAlign(label:Label, textInput:fgui.GTextInput, horizontalAlign:HorizontalTextAlignment, verticalAlign:VerticalTextAlignment, overflow:Overflow, isInit:boolean = false):void {
        if (label) {
            if (isInit) {
                // 对齐方式
                label.horizontalAlign = horizontalAlign;
                label.verticalAlign = verticalAlign;
                // 文本超出显示方式
                label.overflow = overflow;
                // setAnchorPoint默认是0.5、0.5
            }
            // size修复
            let size = label.node.getComponent(UITransform).contentSize;
            if (size.width != textInput.width || size.height != textInput.height) {
                label.node.getComponent(UITransform).setContentSize(textInput.width, textInput.height);
            }
            // pos修复
            let pos = label.node.position;
            if (pos.x != textInput.width / 2 || pos.y != 0 - textInput.height / 2) {
                label.node.setPosition(textInput.width / 2, 0 - textInput.height / 2);
            }
        }
    }

    /**
     * 设置GTextInput对齐方式。
     */
    public static setGTextInputAlign(textInput:fgui.GTextInput, horizontalAlign:HorizontalTextAlignment, verticalAlign:VerticalTextAlignment, overflow:Overflow, isSingleLine:boolean = true):void {
        let textLabel = textInput._editBox.textLabel;
        let placeholderLabel = textInput._editBox.placeholderLabel;
        // 初始化
        textInput.singleLine = isSingleLine;
        UtilsUI.resetGTextInputAlign(textLabel, textInput, horizontalAlign, verticalAlign, overflow, true);
        UtilsUI.resetGTextInputAlign(placeholderLabel, textInput, horizontalAlign, verticalAlign, overflow, true);
        // 输入结束时修正（输入结束表示文本size变化，也可以使用下面的SIZE_CHANGED，与TRANSFORM_CHANGED一样操作）
        textInput._editBox.node.on(EditBox.EventType.EDITING_DID_ENDED, () => {
            UtilsUI.resetGTextInputAlign(textLabel, textInput, horizontalAlign, verticalAlign, overflow);
            UtilsUI.resetGTextInputAlign(placeholderLabel, textInput, horizontalAlign, verticalAlign, overflow);
        });
        /*
        if (textLabel) {
            textLabel.node.on(NodeEventType.SIZE_CHANGED, (type:number) => {
                
            });
        }
        if (placeholderLabel) {
            placeholderLabel.node.on(NodeEventType.SIZE_CHANGED, (type:number) => {
                
            });
        }
        */
        // 位置适配改变时修正
        if (textLabel) {
            textLabel.node.on(NodeEventType.TRANSFORM_CHANGED, (type:number) => {
                if (type & TransformBit.POSITION) {
                    UtilsUI.resetGTextInputAlign(textLabel, textInput, horizontalAlign, verticalAlign, overflow);
                }
            });
        }
        if (placeholderLabel) {
            placeholderLabel.node.on(NodeEventType.TRANSFORM_CHANGED, (type:number) => {
                if (type & TransformBit.POSITION) {
                    UtilsUI.resetGTextInputAlign(placeholderLabel, textInput, horizontalAlign, verticalAlign, overflow);
                }
            });
        }
    }
    
    public static showEquipInfo(itemBnt: fgui.GButton, equipInst: any){
        let _params = {
            equipInst: equipInst,
            pos:itemBnt.localToGlobal(0, 0),
            size:new Vec2(itemBnt.width, itemBnt.height)
        }
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEquipTips, 0, _params);
    }

    public static showPopup(obj: fgui.GComponent, btn: fgui.GComponent){
        fgui.GRoot.inst.showPopup(obj, btn, false)
        let vct2: Vec2 = fgui.GRoot.inst.getPopupPosition(obj)
        if (vct2.x < 0) {
             obj.x = 0
        }
        else if(vct2.x + obj.width > fgui.GRoot.inst.width){
            obj.x = fgui.GRoot.inst.width - obj.width
        } 
    }

    public static setNeedItemGroup(com: fgui.GComponent, url:string, nowNmber: number | string, needNumber: number |string){
        nowNmber = Number(nowNmber);
        needNumber = Number(needNumber);
        (com.getChild("loader_item") as fgui.GLoader).url = url;
        (com.getChild("label_number") as fgui.GLabel).text = this.getEnoughColorString( nowNmber >= needNumber, UtilsTool.stringFormat("{0}/{1}",[nowNmber, needNumber]));
    }

    public static showImgTip(pkgName:string, resName:string){
        let mGCom :fgui.GComponent = fgui.UIPackage.createObject(pkgName, resName)as fgui.GComponent;
        mGCom.setPosition(fgui.GRoot.inst.width / 2 - mGCom.width / 2 , fgui.GRoot.inst.height / 2 - mGCom.height / 2 + 150)
        fgui.GRoot.inst.addChild(mGCom)
        FguiGTween.new(mGCom).to(0.5, { y: fgui.GRoot.inst.height / 2 / 2 - 50}).call(() => {
            FguiGTween.new(mGCom).to(0.5, {alpha: 1}).call(() => {
                mGCom.dispose() 
            }).start();
        }).start();
    }

    public static onShowPlayerInfo(playerId:string):void{
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPlayerInfo, 0, args.playerInformation);
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "queryPlayerInfo", {
            guid: playerId
        })
    }
    public static onPetQualityItem(group_buff:fgui.GComponent,buffData:any):void{
        let label_level: fgui.GLabel = group_buff.getChild("label_level")
                
        let img_quality: fgui.GLoader = group_buff.getChild("img_quality")
        let buff = LocaleData.getPetBuffById(buffData.buffId)
        let title: fgui.GTextField = group_buff.getChild("title")
        let colorStr 
        if (buff.buffQuality == "1") {
            // colorStr = "#72746A"
            colorStr = new Color(32, 69, 164, 255);
        } else if (buff.buffQuality == "2") {
          // colorStr = "#598b27"
            colorStr = new Color(106, 56, 138, 255);
        } else if (buff.buffQuality == "3") {
          // colorStr = "#2f669f"
            colorStr = new Color(164, 81, 32, 255);
        } 
        title.strokeColor = colorStr
        title.text = buff.buffName
        label_level.text = petBuffLevel(buffData.buffLevel)
        img_quality.url = UtilsTool.stringFormat("ui://CCommon/frame_fangkuaidi{0}", [buff.buffQuality]);
        let group_level: fgui.GGraph = group_buff.getChild("group_level")
        group_level.visible = true
        let img_wenhao: fgui.GImage = group_buff.getChild("img_wenhao")
        img_wenhao.visible = false
        group_buff.touchable =true
        group_buff.clearClick()
      
        group_buff.onClick(()=>{
            let data ={
                buffData: buffData,
                pos: group_buff.localToGlobal(0, 0),
                size: new Vec2(group_buff.width, group_buff.height)
            }
            ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyPetBuffTips, 0, data);
        })
    }

    public static onShowActivationTisp(type:number):void{
        let activation: any = LocaleData.getActivation(type)
        let str: string = ""
        if (activation.day == "0") {
            let repmsg = StrVal.LYMAINPAGE.STR16;
            if (type == VarVal.SYSYTEM_ID.BATTLE_SPEED) {
                repmsg = StrVal.LYMAINPAGE.STR101;
            }
            let finishCount:number = GameServerData.getInstance().getPlayerFullInfo().finishCount
            str = UtilsTool.stringFormat(repmsg, [Number(activation.taskNum)-finishCount])
        } else {
            let repmsg = StrVal.LYMAINPAGE.STR17;
            if (type == VarVal.SYSYTEM_ID.BATTLE_SPEED) {
                repmsg = StrVal.LYMAINPAGE.STR102;
            }
            str = UtilsTool.stringFormat(repmsg, [activation.level, GameServerData.getInstance().getServerCreateDay(), activation.day])
        }
        UtilsUI.showMsgTip(str);
    }

    public static onNumberToChinese(num:number):string{
        let chineseNums = ["","一","二","三","四","五","六","七","八","九"]
        let chineseUnits = ["","十","百","千"]
        let oldNum:number = num
        if (num == 0) {
            return chineseNums[0]
        }
        let chineseStr :string = ""
        let unitIndex :number = 0
        while (num > 0) {
            let digit:number = num % 10
            if (digit != 0 ){
                chineseStr = chineseNums[digit] + chineseUnits[unitIndex] + chineseStr;
            } else if (chineseStr.charAt(0) != chineseNums[0]){
                chineseStr = chineseNums[0] + chineseStr
            }
            num = Math.floor(num / 10)
            unitIndex++
        }
        if (oldNum > 9 && oldNum < 20) {
            chineseStr = chineseStr.substring(1);
        } 
        return chineseStr
    }
    
}
