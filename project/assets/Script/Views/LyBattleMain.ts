//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { AudioManager } from "../Kernel/AudioManager";
import { VarVal } from "../Values/VarVal";
import { LocaleData, ModelShowInfo } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { Asset, Color, Vec2, sp, sys } from "cc";
import { BUILD_TYPE, PlatformAPI } from "../Kernel/PlatformAPI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { LyBattleResult } from "./LyBattleResult";
import { FguiGTween } from "../Kernel/FguiGTween";
import { LocaleUser } from "../Kernel/LocaleUser";
import { LyBattleDetail } from "./LyBattleDetail";
import { BattleResultParams, BodyPointType, UtilsUI } from "../Kernel/UtilsUI";
import { SpinePlayer, SpineTrackCall } from "../Kernel/SpinePlayer";
import { GameServerData } from "../Kernel/GameServerData";
import { LyActivityInvasion } from "./LyActivityInvasion";

interface petInfo {
    readonly pos: number,
    readonly protoID: number,
}

interface eliteInfo {
    readonly pos: number,
    readonly protoID: number,
}

interface triggerInfo {
    readonly entityID: number,
    readonly petProtoID: number,
    readonly eliteProtoID: number,
    readonly pos: number,
    readonly targetID: number,
    // readonly targetName: string,
    // readonly entityName: string,
}

interface bufData {
    readonly triggerInfo: triggerInfo,
    readonly bufID: number,
    readonly type: number,
    // readonly round: number,
    readonly value: string,
    readonly final: string,
    readonly battleMaxHP: number,
    readonly skillId: number,
}

interface skillData {
    readonly skillId: number,
    readonly beforeAddBuff: Array<bufData>,
    readonly beforeHitBuff: Array<bufData>,
    readonly beforeRemoveBuff: Array<bufData>,
    readonly triggerInfo: triggerInfo,
    readonly afterAddBuff: Array<bufData>,
    readonly afterHitBuff: Array<bufData>,
    readonly afterRemoveBuff: Array<bufData>,
    // readonly name: string,
    readonly multiple: number,
    readonly addBloodInfo: addBloodInfo,
    readonly petAddBloodInfo: petAddBloodInfo,
    // readonly effectShowIndex:number,
    readonly costBloodInfo:costBloodInfo,
}

interface addBloodInfo {
    readonly value: string,
    readonly final: string,
}

interface petAddBloodInfo {
    readonly value: string,
    readonly final: string,
}

interface costBloodInfo {
    readonly value: string,
    readonly final: string,
}

interface entityInfo {
    // readonly name: string,
    readonly entityID: number,
    readonly protoID: number,
    // readonly battleCamp: number,
    readonly battleHP: string,
    readonly battleMaxHP: string,
    readonly battleAnger: number,
    readonly battleMaxAnger: number,
    // readonly type: number,
    readonly petInfoArr: Array<petInfo>,
    readonly eliteInfoArr: Array<eliteInfo>,
    // readonly startSkillDataArr: Array<skillData>,

    readonly character: number,
    readonly appearance: number,
    readonly phase: number,
    readonly mountType: number,
    readonly mountSkin: number,
}

interface roundInfo {
    readonly actionInfoArr: Array<actionInfo>,
    // readonly roundId: number,
    readonly startAddBuff: Array<bufData>,
    readonly startHitBuff: Array<bufData>,
    readonly startRemoveBuff: Array<bufData>,
    readonly repMonsterArr: Array<number>,
    
    readonly targetEndHP: string,
    readonly targetEndAnger: number,
    readonly targetEndMaxHP: string,
}

interface actionInfo {
    readonly critital: boolean,
    readonly targetCounter: boolean,
    readonly targetMiss: boolean,
    readonly cooperateAttack: boolean,
    readonly addAnger: number,
    readonly endAnger: number,

    readonly targetAddHP: string,
    readonly targetEndHP: string,
    readonly targetAddAnger: number,
    readonly targetEndAnger: number,
    readonly targetEndMaxHP: string,

    readonly comboCnt: number,
    readonly skillData: skillData,
    // readonly actionID: number,
    readonly repMonsterArr: Array<number>,
}

interface battleResult {
    readonly roundAll: number,
    readonly isWin: boolean,
    readonly entityAttack: entityInfo,
    readonly entityDefence: entityInfo,
    readonly roundInfoArr: Array<roundInfo>,
    readonly roundInfoStr: string,
}

export interface BattleTestResShow {
    type?:string,
    attack_ani?:string,
    attack_with?:string,
    bullet_file?:string,
    fall_file?:string,
    hit_file?:string

    buffId?:string,

    spine?:string,
    skin?:string,

    mount?:string,
}

enum BUFF_TYPE {
    type_add_attr           =1,       // 玩家属性
 
    type_damage_appent      =101,     // 伤害追加                  (伤害在hit)
    type_damage_burn        =102,     // 烧伤                      (伤害在hit)
    type_freezing           =103,     // 冰冻                      (没有hit)  （暂时不处理)
    type_vertigo            =104,     // 眩晕                      (没有hit)
    type_restoreHP          =105,     // 回复生命                   (回复在hit)
    type_riseRestoreHP      =106,     // 复活并回复生命              (回复在hit)
    type_restoreAnger       =107,     // 回复怒气                   (回复在hit)
    type_defenceChangeAck   =108,     // 防御率转攻击               (没有hit)
    type_easyDamage         =109,     // 易伤                      (没有hit)
    type_lossHP             =110,     // 流血                      (伤害在hit）
    type_damageMaxPct       =111,     // 伤害不高于最大生命百分比    (没有hit)
    type_damageCounter      =113,     // 反伤                      (伤害在hit）
    type_fireAir            =114,     // 煌气                      (没有hit)
    type_add_attr_steal     =115,     // 属性窃取                  (伤害在hit）
    type_damage_costHp      =116,     // 扣除生命并造成伤害         (在hit)跟伤害追加一样
}

interface BattleBuff {
    bufData: bufData,
    readonly bufItem: any,
    readonly bufLoader3D: fgui.GLoader3D,
}

interface AnimationEventTime {
    allTime: number,
    envTime: number,
}

enum DamageUIType {
    Damage = 101,
    Cure = 102,
    Skill = 103,
    TBaoJi = 1,
    TFanJi = 2,
    TLianJi = 3,
    TShanBi = 4,
    TXiXue = 5,
    TXieTong = 6,
}

interface BattleDisplayInfo {
    readonly slot:number,
    readonly x:number,
    readonly y:number,
    readonly scaleX:number,
    readonly scaleY:number,
}

interface BattleInitParams { // 初始化参数太长了，这里做一个结构体
    readonly entityID:number,
    readonly petProtoID:number,
    readonly eliteProtoID:number,
    readonly pos:number,

    readonly battleView:LyBattleMain,
    readonly displayStart:fgui.GComponent, // fgui的显示对象，start层。
    readonly displayObj:fgui.GComponent, // fgui的显示对象，spine需要挂载到此处。
    readonly displayInfo:BattleDisplayInfo, // 战斗对象坑位信息。

    readonly resultParams:BattleResultParams,
    readonly modelShowInfo:ModelShowInfo,
    readonly mountShowInfo:ModelShowInfo,
    readonly initHP:number,
    readonly maxHP:number,
    readonly initAnger:number,
    readonly maxAnger:number,

    readonly testResShow:BattleTestResShow,
}

class BattleObject {
    private initParams:BattleInitParams; // 初始化的参数。
    private currHP:number; // 当前血量。
    private currMaxHP:number; // 当前最大血量。
    private currAnger:number; // 当前血量。

    private group_head:fgui.GComponent; // 【精怪仅有】

    // 以下【非精怪仅有】
    private group_topui:fgui.GComponent;
    private group_spine_ram:fgui.GComponent;
    private loader_spine_mount:fgui.GLoader3D; // 坐骑Spine装载器。
    private loader_spine_role:fgui.GLoader3D; // 角色Spine装载器。
    private list_bufficon:fgui.GList;
    private bar_blood:fgui.GProgressBar;
    private bar_anger:fgui.GProgressBar;
    private loader_spine_anger:fgui.GLoader3D;

    private zuoqiSke:sp.Skeleton; // 坐骑动画实例。
    private last_spine_mountname:string; // 坐骑Spine当前模型名称。
    private spineSke:sp.Skeleton; // 角色动画实例。
    private last_spine_rolename:string; // 角色Spine当前模型名称。
    private trackCalls:Array<SpineTrackCall>; // 多轨道回调集合在一起。
    private TRACK_MAX:number = 5; // 最大轨道数量。
    private TRACK_OFF:number = 2; // 轨道偏移。
    // 以上【非精怪仅有】

    private SKE_SCALE_DEFAULT:number = 0.6; // spine在战斗中的默认缩放倍数。
    private isCurrFlipX:boolean = false;
    private isPlayDied:boolean; // 是否已经播放死亡动作。
    private isSourcePos:boolean;
    private sourcePos:Vec2;
    private battleBuffs:Array<BattleBuff>;

    public constructor(params:BattleInitParams) {
        this.trackCalls = new Array<SpineTrackCall>();
        for (let i = 0; i < this.TRACK_MAX; i++) {
            this.trackCalls.push({
                name: undefined,
                isLoop: false,
                eventCall: undefined,
                completeCall: undefined,
                isBreakCallComplete: false
            })
        }
        this.initParams = params;
        this.isSourcePos = true;
        this.battleBuffs = new Array<BattleBuff>();
        if (this.isElite()) {
            // nothing
        } else {
            this.initParams.displayObj.setPosition(this.initParams.displayInfo.x, this.initParams.displayInfo.y);
            this.sourcePos = new Vec2(this.initParams.displayInfo.x, this.initParams.displayInfo.y);
            this.group_topui = this.initParams.displayObj.getChild("group_topui");
            this.group_spine_ram = this.initParams.displayObj.getChild("group_spine_ram");
            this.loader_spine_mount = this.group_spine_ram.getChild("loader_spine_mount");
            this.loader_spine_role = this.group_spine_ram.getChild("loader_spine_role");
            // buff列表
            this.list_bufficon = this.group_topui.getChild("list_bufficon");
            this.list_bufficon.itemRenderer = (index:number, group_item:fgui.GComponent) => {
                let loader_icon:fgui.GLoader = group_item.getChild("loader_icon");
                loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [this.battleBuffs[index].bufItem.icon]);
            }
            // 血条显示、怒气显示。
            this.bar_blood = this.group_topui.getChild("bar_blood");
            this.bar_anger = this.group_topui.getChild("bar_anger");
            this.bar_anger.visible = GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.theurgy);
            this.group_topui.getChild("img_anger_back").visible = this.bar_anger.visible;
            this.setUIVisible(false);
        }
    }

    /**
     * 获得初始化参数。
     */
    public getBattleInitParams():BattleInitParams {
        return this.initParams;
    }

    /**
     * 需要预加载的spine。
     */
    public getLoadSpineNames():Array<string> {
        let names:Array<string> = new Array<string>();
        let testInfo = this.initParams.testResShow;
        if (testInfo && testInfo.mount) {
            names.push(testInfo.mount);
        } else {
            if (this.initParams.mountShowInfo) {
                names.push(this.initParams.mountShowInfo.spine);
            }
        }
        if (testInfo && testInfo.spine && this.isTestSpineSide()) {
            names.push(testInfo.spine);
        } else {
            names.push(this.initParams.modelShowInfo.spine);
        }
        return names;
    }

    /**
     * 加载资源。
     */
    public loadRes():void {
        if (this.isElite()) {
            // 精怪头像
            this.group_head = this.initParams.displayStart.getChild("group_head" + this.initParams.displayInfo.slot);
            this.group_head.visible = true;
            UtilsUI.setUIEliteItem(this.initParams.eliteProtoID, this.group_head, null);
            let loader_back:fgui.GLoader = this.group_head.getChild("loader_back");
            loader_back.url = undefined;
            let loader_icon:fgui.GLoader = this.group_head.getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [this.initParams.modelShowInfo.icon]);
        } else {
            // 模型显示
            this.addSpineRole();
            if (this.isLeftSide()) {
                this.setFlipX(true);
            }
            // UI位置
            let barPos = this.getSkeAniBoneInContentPos(BodyPointType.top, new Vec2(0, 0));
            this.group_topui.setPosition(barPos.x, barPos.y);
        }
        if (this.isEntity()) {
            if (this.isEntityInvasionBoss()) {
            } else {
                this.setUIVisible(true);
            }
            this.setCurrHP(0, this.initParams.initHP, this.initParams.maxHP);
            this.setCurrAnger(0, this.initParams.initAnger);
        }
    }

    /**
     * 加spine坐骑（分开与角色加载，角色会动态更换）。
     */
    private addSpineZuoQi():void {
        let showInfo:ModelShowInfo;
        let spineName:string;
        let testInfo = this.initParams.testResShow;
        if (testInfo && testInfo.mount) {
            spineName = testInfo.mount;
        } else {
            if (this.initParams.mountShowInfo) {
                spineName = this.initParams.mountShowInfo.spine;
                showInfo = this.initParams.mountShowInfo;
            }
        }
        if (spineName) {
            if (this.last_spine_mountname != spineName) {
                if (this.zuoqiSke) {
                    this.initParams.battleView.delSkillSpine(this.zuoqiSke);
                }
                this.initParams.battleView.addGLoader3DSpine(this.loader_spine_mount, spineName, false);
                let scaleX = this.SKE_SCALE_DEFAULT * this.initParams.displayInfo.scaleX;
                if (showInfo) { // 非测试战斗
                    scaleX = Number(showInfo.battleScale) * this.initParams.displayInfo.scaleX;
                }
                this.loader_spine_mount.setScale(scaleX, scaleX);
                this.last_spine_mountname = spineName;
                this.zuoqiSke = <sp.Skeleton>this.loader_spine_mount.content;
                this.zuoqiSke.setAnimation(0, this.zuoqiSke._skeleton.data.animations[0].name, true);
            }
        } else {
            if (this.zuoqiSke) {
                this.last_spine_mountname = null;
                this.initParams.battleView.delSkillSpine(this.zuoqiSke);
                this.zuoqiSke = null;
            }
        }
    }

    /**
     * 更新坐骑挂载点。
     */
    private updateMountPos(roleShowInfo:ModelShowInfo, mountShowInfo:ModelShowInfo): void {
        if (roleShowInfo && mountShowInfo) {
            let localPos = UtilsUI.getSkeAniBonePos(this.loader_spine_role, mountShowInfo.point);
            this.loader_spine_mount.setPosition(0 - localPos.x, 0 - localPos.y);
        }
    }

    /**
     * 加spine角色。
     */
    public addSpineRole(_showInfo?:ModelShowInfo):void {
        if (!_showInfo) {
            // 先加载坐骑，再加载模型
            this.addSpineZuoQi();
        }
        let showInfo:ModelShowInfo;
        let spineName:string;
        let spineSkin:string;
        if (_showInfo) {
            spineName = _showInfo.spine;
            spineSkin = _showInfo.skin;
            showInfo = _showInfo;
        } else {
            let testInfo = this.initParams.testResShow;
            if (testInfo && testInfo.spine && this.isTestSpineSide()) {
                spineName = testInfo.spine;
                spineSkin = testInfo.skin;
            } else {
                spineName = this.initParams.modelShowInfo.spine;
                spineSkin = this.initParams.modelShowInfo.skin;
                showInfo = this.initParams.modelShowInfo;
            }
        }
        if (this.last_spine_rolename != spineName) {
            this.initParams.displayObj.getChild("img_shadow").visible = true;
            if (this.spineSke) {
                this.initParams.battleView.delSkillSpine(this.spineSke);
            }
            this.initParams.battleView.addGLoader3DSpine(this.loader_spine_role, spineName, false);
            let scaleX = this.SKE_SCALE_DEFAULT * this.initParams.displayInfo.scaleX;
            if (showInfo) { // 非测试战斗
                scaleX = Number(showInfo.battleScale) * this.initParams.displayInfo.scaleX;
            }
            this.loader_spine_role.setScale(scaleX, scaleX);
            this.last_spine_rolename = spineName;
            this.spineSke = <sp.Skeleton>this.loader_spine_role.content;
            // 皮肤
            this.spineSke.setSkin(spineSkin);
            // 监听注册事件
            this.spineSke.setEventListener((trackEntry:sp.spine.TrackEntry, event:sp.spine.Event) => {
                let trackCall = this.trackCalls[trackEntry.trackIndex];
                if (trackCall) {
                    if (trackCall.eventCall) {
                        trackCall.eventCall(trackEntry.animation.name, event.stringValue);
                    }
                }
            })
            this.spineSke.setCompleteListener((trackEntry:sp.spine.TrackEntry) => { // setEndListener触发不了？
                let trackCall = this.trackCalls[trackEntry.trackIndex];
                if (trackCall) {
                    this.onAnimationComplete(trackCall, trackEntry.animation.name);
                }
            })
            this.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            if (this.spineSke.findAnimation(VarVal.SPINE_ANI_NAME.attach_stand)) {
                this.playAnimation(VarVal.SPINE_ANI_NAME.attach_stand, true, -1);
            }
            
            // spineSke.setToSetupPose();
            // spineSke.setMix(VarVal.SPINE_ANI_NAME.attack, VarVal.SPINE_ANI_NAME.stand, 0.2);
            // spineSke.updateAnimation(100);
        }

        // 更新位置。
        this.updateMountPos(showInfo, this.initParams.mountShowInfo);
    }

    /**
     * 设置角色组合体翻转。
     */
    private setFlipX(bool:boolean):void {
        if ((bool && !this.isCurrFlipX) || (!bool && this.isCurrFlipX)) {
            this.group_spine_ram.scaleX = 0 - this.group_spine_ram.scaleX;
            this.isCurrFlipX = bool;
        }
    }

    /**
     * 设置spine倍速。
     */
    public setTimeScale(timeScale:number):void {
        if (this.spineSke) {
            this.spineSke.timeScale = timeScale;
        }
        if (this.zuoqiSke) {
            this.zuoqiSke.timeScale = timeScale;
        }
    }

    /**
     * 设置UI可见。
     */
    private setUIVisible(bool:boolean):void {
        this.group_topui.visible = bool;
    }

    /**
     * 是否左边位置。
     */
    public isLeftSide():boolean {
        return (this.initParams.displayInfo.slot % 2) > 0;
    }

    /**
     * 是否测试模型。
     */
    public isTestSpineSide():boolean {
        return (this.isLeftSide() == LyBattleMain.isTestLeftSide);
    }

    /**
     * 是否主角实体。
     */
    public isEntity():boolean {
        if (this.initParams.petProtoID || this.initParams.eliteProtoID) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 是否异兽BOSS。
     */
    private isEntityInvasionBoss():boolean {
        if (this.isEntity() && !this.isLeftSide()) {
            if (this.initParams.resultParams.typeInfo.type == VarVal.BATTLE_TYPE.INVASION) {
                return true;
            }
        }
        return false;
    }

    /**
     * 是否精怪实体。
     */
    public isElite():boolean {
        if (this.initParams.eliteProtoID) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 此对象是否是。
     */
    public isMatchThis(entityID:number, petProtoID:number, eliteProtoID:number, pos:number):boolean {
        if (this.initParams.entityID == entityID) {
            if (this.initParams.petProtoID) { // 我是宠物。
                return (petProtoID && this.initParams.petProtoID == petProtoID && this.initParams.pos == pos);
            } else if (this.initParams.eliteProtoID) { // 我是精怪。
                return (eliteProtoID && this.initParams.eliteProtoID == eliteProtoID && this.initParams.pos == pos);
            } else { // 我是角色。
                return (!petProtoID && !eliteProtoID);
            }
        } else {
            return false;
        }
    }

    /**
     * 获得显示对象节点。
     */
    public getDisplayObj():fgui.GComponent {
        return this.initParams.displayObj;
    }

    /**
     * 获得当前伤害飘字位置。
     */
    public getShowDamagePosition():Vec2 {
        if (this.isElite()) {
            return new Vec2(this.group_head.x, this.group_head.y);
        } else {
            return new Vec2(this.initParams.displayObj.x + this.group_topui.x, this.initParams.displayObj.y + this.group_topui.y - 100);
        }
    }

    /**
     * 获得头像组件。
     */
    public getDisplayGroupHead():fgui.GComponent {
        return this.group_head;
    }

    /**
     * 是否在初始位置上（近战时它不在）。
     */
    public isSourcePosition():boolean {
        return this.isSourcePos;
    }

    /**
     * 设置是否在初始位置上（近战时它不在）。
     */
    public setIsSourcePosition(bool:boolean):void {
        this.isSourcePos = bool;
    }

    /**
     * 获得初始战斗位置。
     */
    public getSourcePosition():Vec2 {
        return new Vec2(this.sourcePos);
    }

    private onAnimationComplete(trackCall:SpineTrackCall, aniName:string):void {
        if (trackCall) {
            if (!trackCall.isLoop) {
                trackCall.eventCall = null;
            }
            if (trackCall.completeCall) {
                let completeCall = trackCall.completeCall;
                if (!trackCall.isLoop) {
                    trackCall.completeCall = null;
                }
                completeCall(aniName);
            }
        }
    }
    

    /**
     * 播放动作。
     */
    public playAnimation(aniName:string, isLoop:boolean, trackIndex?:number, eventCall?:Function, completeCall?:Function, isCompleteBreakCall:boolean = false):void {
        if (!trackIndex) {trackIndex = 0;};
        trackIndex += this.TRACK_OFF;
        let trackCall = this.trackCalls[trackIndex];
        if (this.spineSke) {
            if (trackCall) {
                if (trackCall.isBreakCallComplete) {
                    this.onAnimationComplete(trackCall, trackCall.name);
                }
            }
            // 兼容无某攻击动作，保底。
            if (!this.spineSke.findAnimation(aniName)) {
                aniName = VarVal.SPINE_ANI_NAME.attack;
            }
            if (trackCall) {
                trackCall.name = aniName;
                trackCall.isLoop = isLoop;
                trackCall.eventCall = eventCall;
                trackCall.completeCall = completeCall;
                trackCall.isBreakCallComplete = isCompleteBreakCall;
            }
            this.spineSke.setAnimation(trackIndex, aniName, isLoop);
            if (aniName == VarVal.SPINE_ANI_NAME.hurt) {
                AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_BATTLE_HIT);
            }
        } else {
            if (trackCall) {
                trackCall.name = aniName;
                trackCall.isLoop = isLoop;
                trackCall.eventCall = eventCall;
                trackCall.completeCall = completeCall;
                trackCall.isBreakCallComplete = isCompleteBreakCall;
                this.onAnimationComplete(trackCall, aniName);
            }
        }
    }

    /**
     * 播放死亡动作辅助接口。
     */
    public tryPlayDiedAnimation(callback?:Function):void {
        if (this.spineSke) {
            if (!this.isPlayDied && this.currHP <= 0) {
                this.isPlayDied = true;
                this.setUIVisible(false);
                this.playAnimation(VarVal.SPINE_ANI_NAME.death, false, null, null, callback, true);
            } else {
                if (callback) {
                    callback();
                }
            }
        } else {
            if (callback) {
                callback();
            }
        }
    }

    /**
     * 暂停当前动作。
     */
    private pauseAnimation(bool:boolean):void {
        if (this.spineSke) {
            this.spineSke.paused = bool;
        }
        if (this.zuoqiSke) {
            this.zuoqiSke.paused = bool;
        }
    }

    /**
     * 获得骨骼相对于战斗场景的全局位置。
     */
    public getSkeAniBoneInContentPos(ptype:BodyPointType, globalPos?:Vec2):Vec2 {
        let localPos = UtilsUI.getSkeAniBonePos(this.loader_spine_role, ptype); // 它还有父节点，不过父节点跟爷爷是一样大小一个点。
        if (this.isLeftSide()) { // 左边需要翻转一下它的内部坐标。
            localPos.x = 0 - localPos.x;
        }
        if (globalPos) {
            return new Vec2(globalPos.x + localPos.x, globalPos.y - localPos.y);
        } else {
            return new Vec2(this.initParams.displayObj.x + localPos.x, this.initParams.displayObj.y - localPos.y);
        }
    }

    /**
     * 获得动作的时长。
     */
    public getAnimationEventTime(aniName:string, envName?:string):AnimationEventTime {
        let envTime:number;
        let ani = this.spineSke.findAnimation(aniName);
        if (ani) {
            if (envName) {
                for (let i = 0; i < ani.timelines.length; i++) {
                    let timeline:any = ani.timelines[i];
                    if (timeline instanceof sp.spine.EventTimeline) {
                        let isBreak:boolean = false;
                        let envtimeline:sp.spine.EventTimeline = timeline;
                        for (let j = 0; j < envtimeline.events.length; j++) {
                            if (envtimeline.events[j].stringValue == envName) {
                                envTime = envtimeline.events[j].time;
                                isBreak = true;
                                break;
                            }
                        }
                        if (isBreak) {
                            break;
                        }
                    }
                }
            }
            return {allTime:ani.duration, envTime:envTime};
        } else {
            return {allTime:0, envTime:0};
        }
    }

    /**
     * 获得连击的动作名。
     */
    public getAnimationLanName(aniName:string, comboNum:number):string {
        let REPS = "{0}_{1}{2}";
        let maxAniLan = 0;
        for (let i = 1; i <= 3; i++) { // 超过3个就是牛逼的角色，嗯精品，不会报错，但会被忽略。
            if (this.spineSke.findAnimation(UtilsTool.stringFormat(REPS, [aniName, VarVal.SPINE_ENV_NAME.attack_lan, i]))) {
                maxAniLan = i;
            } else {
                break;
            }
        }
        if (maxAniLan > 0) {
            let cb = comboNum % maxAniLan;
            return UtilsTool.stringFormat(REPS, [aniName, VarVal.SPINE_ENV_NAME.attack_lan, (cb == 0) ? maxAniLan : cb]);
        } else {
            return aniName;
        }
    }

    /**
     * 当前血量。
     */
    public getCurrHP():number {
        return this.currHP;
    }

    /**
     * 设置血量。
     */
    public setCurrHP(addHP:number | string, endHP:number | string, maxHP?:number | string):void {
        if (endHP || endHP == 0) {
            endHP = Number(endHP);
            // 音效。
            if (endHP > this.currHP && !this.isEntityInvasionBoss()) {
                AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_BATTLE_HEALTH);
            }
            
            this.currHP = endHP;
        }
        if (maxHP || maxHP == 0) {
            this.currMaxHP = Number(maxHP);
        }
        if (this.isEntity()) {
            this.bar_blood.value = this.currHP / this.currMaxHP * 100;
        }
        if (this.isEntityInvasionBoss()) {
            this.initParams.battleView.setInvasionProgress(null, this.currHP, this.currMaxHP);
        }
    }

    /**
     * 当前怒气。
     */
    public getCurrAnger():number {
        return this.currAnger;
    }

    /**
     * 设置怒气。
     */
    public setCurrAnger(addAnger:number | string, endAnger:number | string, maxAnger?:number | string):void {
        if (endAnger || endAnger == 0) {
            this.currAnger = Number(endAnger);
        }
        if (this.isEntity()) {
            this.bar_anger.value = this.currAnger / this.initParams.maxAnger * 100;
        }
        // 能量条特效
        if (this.currAnger >= this.initParams.maxAnger) {
            if (!this.loader_spine_anger && GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.theurgy)) {
                this.loader_spine_anger = this.group_topui.getChild("loader_spine_anger", fgui.GLoader3D);
                new SpinePlayer().loadSpine(null, this.loader_spine_anger, VarVal.UI_EFF_NAME.spine_battleanger);
            }
            if (this.loader_spine_anger) {
                this.loader_spine_anger.visible = true;
            }
        } else {
            if (this.loader_spine_anger) {
                this.loader_spine_anger.visible = false;
            }
        }
    }

    /**
     * 重生（满血量满怒气）。
     */
    public reborn(): void {
        this.setCurrHP(this.currMaxHP, this.currMaxHP);
        this.setCurrAnger(this.initParams.maxAnger, this.initParams.maxAnger);
        
        this.isPlayDied = false;
        this.setUIVisible(true);
        this.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
    }

    private addbuffSpine(buffItem:any, isHit:boolean, isSkipLoopPlay?:boolean):fgui.GLoader3D {
        if (buffItem.effect_file && buffItem.effect_file.length > 1) {
            let fallInfo:Array<any> = buffItem.effect_file.split(",");
            let spineName:string = fallInfo[0];
            let bodyTypeDst:BodyPointType = fallInfo[1];
            let isLoop:boolean = (fallInfo[2] == "1" ? true : false);
            if (isHit) {
                isLoop = false;
            }

            if (isSkipLoopPlay && isLoop) {
                // 仅播放非循环特效。
            } else {
                // 生成
                let loader = this.addSpineBuffEffect(spineName, isLoop);
                let dstPos = this.getSkeAniBoneInContentPos(bodyTypeDst, new Vec2(0, 0));
                loader.setPosition(dstPos.x, dstPos.y);
                
                // 手动移除
                if (isLoop) {
                    return loader;
                }
            }
        }
    }

    /**
     * 插入buff。
     */
    public buffInsert(buff:bufData, battleObject:BattleObject):void {
        let battleBuffs = this.battleBuffs;
        let hitbuffData:BattleBuff;
        for (let i = 0; i < battleBuffs.length; i++) {
            if (battleBuffs[i].bufData.bufID == buff.bufID) {
                hitbuffData = battleBuffs[i];
                break;
            }
        }
        if (hitbuffData) {
            hitbuffData.bufData = buff;
            this.addbuffSpine(hitbuffData.bufItem, false, true); // 循环特效在第一次附BUFF时已经存在，第3参数就是跳过重复（非循环特效可以重复叠加）
        } else {
            let buffItem = LocaleData.getSkillBuffItem(buff.bufID);
            this.battleBuffs.push({
                bufData: buff,
                bufItem: buffItem,
                bufLoader3D: this.addbuffSpine(buffItem, false)
            });
            if (this.isEntity()) {
                this.list_bufficon.numItems = this.battleBuffs.length;
            }
        }
        if (buff.type == BUFF_TYPE.type_freezing) {
            // this.pauseAnimation(true);
        }
        if (battleObject.isElite()) { // 目前精怪没有行动，只会释放BUFF，所以加表现。
            let skillProto = LocaleData.getSkillProto(buff.skillId);
            this.initParams.battleView.doEliteAttack(battleObject, skillProto);
        }
    }

    /**
     * 生效buff。
     */
    public buffHit(buff:bufData, battleObject:BattleObject):void {
        if (buff.type == BUFF_TYPE.type_damage_appent
            || buff.type == BUFF_TYPE.type_damage_burn
            || buff.type == BUFF_TYPE.type_restoreHP
            || buff.type == BUFF_TYPE.type_lossHP
            || buff.type == BUFF_TYPE.type_damageCounter
            || buff.type == BUFF_TYPE.type_add_attr_steal
            || buff.type == BUFF_TYPE.type_damage_costHp) {
                this.setCurrHP(buff.value, buff.final);
                if (buff.type == BUFF_TYPE.type_restoreHP) {
                    this.initParams.battleView.showDamageText(this, DamageUIType.Cure, buff.value); // 加血
                } else {
                    this.initParams.battleView.showDamageText(this, DamageUIType.Damage, buff.value); // 伤害
                }
        } else if (buff.type == BUFF_TYPE.type_restoreAnger) {
            this.setCurrAnger(buff.value, buff.final);
            // this.initParams.battleView.showDamageText(this, DamageUIType.Cure, buff.value); // 加怒气
        } else if (buff.type == BUFF_TYPE.type_riseRestoreHP) { // 复活
            this.setCurrHP(buff.value, buff.final);
            this.initParams.battleView.showDamageText(this, DamageUIType.Cure, buff.value); // 加血
            
            this.isPlayDied = false;
            this.setUIVisible(true);
            this.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }
        if (buff.battleMaxHP) { // BUFF_TYPE.type_add_attr
            this.setCurrHP(null, null, buff.battleMaxHP);
        }
        // 特效
        let buffItem = LocaleData.getSkillBuffItem(buff.bufID);
        this.addbuffSpine(buffItem, true);
        if (battleObject.isElite()) { // 目前精怪没有行动，只会释放BUFF，所以加表现。
            let skillProto = LocaleData.getSkillProto(buff.skillId);
            this.initParams.battleView.doEliteAttack(battleObject, skillProto);
        }
    }

    /**
     * 移除buff。
     */
    public buffRemove(buff:bufData, isRemove?:boolean):void {
        let battleBuffs = this.battleBuffs;
        if (buff.type == BUFF_TYPE.type_vertigo && !isRemove) {
            for (let i = battleBuffs.length - 1; i >= 0; i--) {
                let buffData = battleBuffs[i].bufData;
                if (buffData.type == BUFF_TYPE.type_vertigo) {
                    this.buffRemove(buffData, true);
                }
            }
            return;
        }
        let hitIdx:number = -1;
        for (let i = 0; i < battleBuffs.length; i++) {
            let buffData = battleBuffs[i].bufData;
            if (buffData.bufID == buff.bufID) {
                hitIdx = i;
                break;
            }
        }
        if (hitIdx == -1) {
            console.warn("error remove buff id ->", buff.bufID);
        } else {
            let removes = this.battleBuffs.splice(hitIdx, 1);
            if (removes[0].bufLoader3D) {
                this.initParams.battleView.delSkillSpine(<sp.Skeleton>(removes[0].bufLoader3D.content));
                removes[0].bufLoader3D.removeFromParent();
                if (removes[0].bufData.type == BUFF_TYPE.type_freezing) {
                    this.pauseAnimation(false);
                }
            }
            if (this.isEntity()) {
                this.list_bufficon.numItems = this.battleBuffs.length;
            }
        }
    }

    /**
     * 添加BUFF特效辅助接口。
     */
    private addSpineBuffEffect(spname:string, loop:boolean):fgui.GLoader3D {
        let loader_spine = this.initParams.battleView.addGLoader3DSpine(<fgui.GLoader3D>this.initParams.displayObj.addChild(new fgui.GLoader3D()), spname, this.isLeftSide());
        let ske:sp.Skeleton = <sp.Skeleton>loader_spine.content;
        if (!loop) {
            // 事件帧
            ske.setCompleteListener((trackEntry:sp.spine.TrackEntry) => {
                this.initParams.battleView.delSkillSpine(ske);
                loader_spine.removeFromParent();
            })
        }
        // 皮肤
        // ske.setSkin("1");
        // 动画
        ske.setAnimation(0, ske._skeleton.data.animations[0].name, loop);
        return loader_spine;
    }
}

interface SyncObject {
    readonly isChase?: boolean,
    chaseCount?: number,
    chaseCall?: Function,
    readonly isCooperate?: boolean,
    cooperateCount?: number
}

export class LyBattleMain extends ViewLayer {
    public static isTestLeftSide:boolean = true;

    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyBattleMain;
        this.viewResI.pkgName = "LyBattleMain";
        this.viewResI.comName = "LyBattleMain";
    }

    // UI
    private graph_mask:fgui.GGraph;
    private group_start:fgui.GComponent;
    private label_round:fgui.GLabel;
    private btn_speed:fgui.GButton;
    private label_break:fgui.GLabel;
    private group_battle:fgui.GComponent;
    private group_iner_ctn:fgui.GComponent;
    private group_iner_eft:fgui.GComponent;
    private group_progressboss:fgui.GComponent;
    // 数据
    private resultParams:BattleResultParams;
    private battleResult:battleResult;
    private battleObjects:Array<BattleObject>;
    private battleObjectPoss:Array<BattleDisplayInfo>;
    private loadSpineNameMap:any;
    // 跳过
    private BREAK_ROUNDIDX:number = 6;
    private curr_roundidx:number = 0;
    private isBattleResult:boolean = false;
    // 倍速
    private skillSpines:Array<sp.Skeleton>;
    private fguiGTweens:Array<FguiGTween>;
    private speedNumber:number;
    // 飘字
    private damageTextWaits:Array<any>;
    private replaceMonsterNum:number;
    // 测试
    private isPlayLoop:boolean;
    private testResShow:BattleTestResShow;

    public getIsViewMask():boolean {
        return false;
    }

    private setBattleSpeed(speed:number):void {
        for (let i = 0; i < this.battleObjects.length; i++) {
            this.battleObjects[i].setTimeScale(speed);
        }
        for (let i = 0; i < this.skillSpines.length; i++) {
            this.skillSpines[i].timeScale = speed;
        }
        for (let i = 0; i < this.fguiGTweens.length; i++) {
            this.fguiGTweens[i].setTimeScale(speed);
        }
        this.setButtonSpeed(speed);
        this.speedNumber = speed;
    }

    private setButtonSpeed(speed:number):void {
        this.btn_speed.getController("speed").selectedIndex = speed - 1;
    }

    private addSkillSpine(ske: sp.Skeleton): void {
        ske.timeScale = this.speedNumber;
        this.skillSpines.push(ske);
    }

    public delSkillSpine(ske: sp.Skeleton): void {
        for (let i = 0; i < this.skillSpines.length; i++) {
            if (this.skillSpines[i] === ske) {
                this.skillSpines.splice(i, 1);
                break;
            }
        }
    }

    private getGTween(target: fgui.GObject): FguiGTween {
        let tw:FguiGTween = FguiGTween.new(target).setTimeScale(this.speedNumber);
        this.fguiGTweens.push(tw);
        return tw;
    }

    private delGTween(tw: any): void {
        for (let i = 0; i < this.fguiGTweens.length; i++) {
            if (this.fguiGTweens[i] === tw) {
                this.fguiGTweens.splice(i, 1);
                break;
            }
        }
    }

    private createDisplayObjTo(): fgui.GComponent {
        let displayObj:fgui.GComponent = fgui.UIPackage.createObject(VarVal.PACKAGE_FGUIS.LyBattleMain, "group_object").asCom;
        this.group_iner_ctn.addChild(displayObj);
        return displayObj;
    }

    private newBattleObjectElite(entityInfo: entityInfo, eliteInfo: eliteInfo, slot:number): BattleObject {
        let eliteItem = LocaleData.getEliteMonsterProto(eliteInfo.protoID);
        return new BattleObject({
            entityID:entityInfo.entityID,
            petProtoID:null,
            eliteProtoID:eliteInfo.protoID,
            pos:eliteInfo.pos,
            battleView:this,
            displayStart:this.group_start,
            displayObj:null,
            displayInfo:this.battleObjectPoss[slot],
            resultParams:this.resultParams,
            modelShowInfo:LocaleData.getModelShowInfo(eliteItem.modelId),
            mountShowInfo:null,
            initHP:0,
            maxHP:0,
            initAnger:0,
            maxAnger:0,
            testResShow:null,
        });
    }

    private newBattleObjectPet(entityInfo: entityInfo, petInfo: petInfo, slot:number): BattleObject {
        let petItem = LocaleData.getPetProto(petInfo.protoID);
        return new BattleObject({
            entityID:entityInfo.entityID,
            petProtoID:petInfo.protoID,
            eliteProtoID:null,
            pos:petInfo.pos,
            battleView:this,
            displayStart:this.group_start,
            displayObj:this.createDisplayObjTo(),
            displayInfo:this.battleObjectPoss[slot],
            resultParams:this.resultParams,
            modelShowInfo:LocaleData.getModelShowInfo(petItem.modelId),
            mountShowInfo:null,
            initHP:0,
            maxHP:0,
            initAnger:0,
            maxAnger:0,
            testResShow:null,
        });
    }

    private newBattleObjectEntity(entityInfo: entityInfo, slot:number): BattleObject {
        let charInfo:ModelShowInfo;
        let mountInfo:ModelShowInfo;
        if (entityInfo.protoID) {
            let monsterItem = LocaleData.getMonsterProto(entityInfo.protoID);
            if (!monsterItem) { // 如果找不到就找宠物（虚拟战斗需要）
                monsterItem = LocaleData.getPetProto(entityInfo.protoID);
            }
            charInfo = LocaleData.getModelShowInfo(monsterItem.modelId);
        } else {
            charInfo = LocaleData.getCharShowResInfo(entityInfo.character, entityInfo.phase, entityInfo.appearance, null);
            mountInfo = LocaleData.getMountShowResInfo(entityInfo.mountType, entityInfo.mountSkin);
        }
        return new BattleObject({
            entityID:entityInfo.entityID,
            petProtoID:null,
            eliteProtoID:null,
            pos:null,
            battleView:this,
            displayStart:this.group_start,
            displayObj:this.createDisplayObjTo(),
            displayInfo:this.battleObjectPoss[slot],
            resultParams:this.resultParams,
            modelShowInfo:charInfo,
            mountShowInfo:mountInfo,
            initHP:Number(entityInfo.battleHP),
            maxHP:Number(entityInfo.battleMaxHP),
            initAnger:entityInfo.battleAnger,
            maxAnger:entityInfo.battleMaxAnger,
            testResShow:this.testResShow,
        });
    }

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params: any): void {
        AudioManager.playBGM(VarVal.AUDIO_SOURCE.BGM_BATTLE);
        // 开始音效
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_BATTLE_START);

        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = uiPanel.getChild("group_main");
        let loader_back:fgui.GLoader = group_main.getChild("loader_back");
        loader_back.url = UtilsTool.stringFormat("ui://CCommonBG/{0}", [params.img_battle ? params.img_battle : "bg_langyabang_yulan"]);

        this.graph_mask = uiPanel.getChild("graph_mask");
        this.group_start = group_main.getChild("group_start");
        this.label_round = group_main.getChild("label_round");
        this.btn_speed = group_main.getChild("btn_speed");
        this.label_break = group_main.getChild("label_break");
        this.group_battle = group_main.getChild("group_battle");
        this.group_iner_ctn = this.group_battle.getChild("group_iner_ctn");
        this.group_iner_eft = this.group_battle.getChild("group_iner_eft");
        this.group_progressboss = group_main.getChild("group_progressboss");

        this.resultParams = params.resultParams;
        this.battleResult = this.resultParams.battleResult;
        this.battleObjects = new Array<BattleObject>();
        this.battleObjectPoss = new Array<BattleDisplayInfo>();
        for (let idx = 0; idx < this.group_iner_ctn.numChildren; idx++) {
            let slot = idx;
            let child = this.group_iner_ctn.getChild("init_entity" + slot);
            if (child) {
                this.battleObjectPoss.push({
                    slot:slot,
                    x:child.x,
                    y:child.y,
                    scaleX:child.scaleX,
                    scaleY:child.scaleY,
                });
            }
        }
        let objectPosLen = this.battleObjectPoss.length;
        for (let i = 0; i < this.group_start.numChildren; i++) {
            let slot = objectPosLen + i;
            let child = this.group_start.getChild("group_head" + slot);
            if (child) {
                this.battleObjectPoss.push({
                    slot:slot,
                    x:child.x,
                    y:child.y,
                    scaleX:child.scaleX,
                    scaleY:child.scaleY,
                });
            }
        }
        this.group_iner_ctn.removeChildren(0, this.group_iner_ctn.numChildren, true);
        this.loadSpineNameMap = {};

        this.skillSpines = new Array<sp.Skeleton>();
        this.fguiGTweens = new Array<FguiGTween>();
        this.speedNumber = 1;

        this.damageTextWaits = new Array<any>();
        this.replaceMonsterNum = 0;
        this.setInvasionProgress(this.replaceMonsterNum, null, null);
        this.setInvasionProgress(null, 0, 0);

        let btn_back:fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            if (this.curr_roundidx >= this.BREAK_ROUNDIDX) {
                this.isPlayLoop = false;
                this.playRound(this.battleResult.roundInfoArr.length + 1);
                if (this.resultParams.typeInfo.type == VarVal.BATTLE_TYPE.PLAYVIRTUAL
                    || this.resultParams.typeInfo.type == VarVal.BATTLE_TYPE.PLAYVIRTUAL_SKIN) {
                    this.resultParams.closeBack();
                }
            }
        })
        let btn_skip:fgui.GButton = group_main.getChild("btn_skip");
        btn_skip.onClick(() => {
            if (this.curr_roundidx >= this.BREAK_ROUNDIDX) {
                btn_back.fireClick();
            } else {
                UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYBATTLEMAIN.STR2, [this.BREAK_ROUNDIDX - this.curr_roundidx]));
            }
        })
        this.btn_speed.onClick(() => {
            let sp = 1;
            if (this.speedNumber == 1) {
                sp = 2;
            } else if (this.speedNumber == 2) {
                if (PlatformAPI.isBinaryExamine()) {
                    sp = 1;
                } else {
                    if (GameServerData.getInstance().isHasFirstPay() || GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.BATTLE_SPEED)) {
                        sp = 3;
                    } else {
                        UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.BATTLE_SPEED);
                        sp = 1;
                    }
                }
            }
            this.setBattleSpeed(sp);
            LocaleUser.setUser(VarVal.FIELD_SV.BATTLE_SPEED, String(sp));
            LocaleUser.flush();
        })

        this.isPlayLoop = params.isPlayLoop;
        this.testResShow = params.testResShow;
        this.onBattleLoad();



        let btn_replay:fgui.GButton = group_main.getChild("btn_replay");
        btn_replay.onClick(() => {
            this.resultParams.replayBack();
        })
        let btn_detail:fgui.GButton = group_main.getChild("btn_detail");
        btn_detail.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleDetail, 0, {detail:this.battleResult.roundInfoStr});
        })
        btn_replay.visible = false;
        btn_detail.visible = false;
        if (this.resultParams.typeInfo.type == VarVal.BATTLE_TYPE.PLAYVIRTUAL
            || this.resultParams.typeInfo.type == VarVal.BATTLE_TYPE.PLAYVIRTUAL_SKIN) {
            btn_skip.visible = false;
            this.btn_speed.visible = false;
            this.BREAK_ROUNDIDX = 1;
            if (this.resultParams.typeInfo.type == VarVal.BATTLE_TYPE.PLAYVIRTUAL) {
                group_main.getChild("img_play_firstpay").visible = true;
            }
        } else {
            if (this.resultParams.typeInfo.type == VarVal.BATTLE_TYPE.INVASION) {
                if (LyActivityInvasion.getChallengeCount() > 1) {
                    this.BREAK_ROUNDIDX = 1;
                }
            }
            if (PlatformAPI.BUILD_CURRENT == BUILD_TYPE.ALPHA) {
                this.resultParams.replayBack = () => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBattleMain, 0, null);
                    AudioManager.setBGMPause(false);
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleMain, 0, params);
                }
                btn_replay.visible = true;
                btn_detail.visible = true;
                if (sys.platform == sys.Platform.EDITOR_PAGE) {
                    this.BREAK_ROUNDIDX = 1;
                    console.log(this.battleResult.roundInfoStr);   
                }
            }
        }
    }

    /**
     * 获得战斗中所有使用的spine文件名。
     */
    private getAllLoadSpineNames(): Array<string> {
        let __map = {};
        // 战斗对象
        for (let i = 0; i < this.battleObjects.length; i++) {
            let names:Array<string> = this.battleObjects[i].getLoadSpineNames();
            for (let j = 0; j < names.length; j++) {
                if (!__map[names[j]]) {
                    __map[names[j]] = true;
                }
            }
        }
        // buff特效
        let handlerReplaceModel = (monsterIds: Array<number>) => {
            if (monsterIds && monsterIds.length > 0) {
                let monsterProto = LocaleData.getMonsterProto(monsterIds[monsterIds.length - 1]);
                let showInfo = LocaleData.getModelShowInfo(monsterProto.modelId);
                if (!__map[showInfo.spine]) {
                    __map[showInfo.spine] = true;
                }
            }
        }
        // 技能特效
        let handlerEffectShow = (effectShow) => {
            // 跟随特效
            if (effectShow.attack_with.length > 1) {
                let blocks:Array<string> = effectShow.attack_with.split(";");
                for (let i = 0; i < blocks.length; i++) {
                    let fallInfo:Array<any> = blocks[i].split(",");
                    if (!__map[fallInfo[0]]) {
                        __map[fallInfo[0]] = true;
                    }
                }
            }
            // 飞行特效
            if (effectShow.bullet_file.length > 1) {
                let bulletInfo:Array<any> = effectShow.bullet_file.split(",");
                if (!__map[bulletInfo[0]]) {
                    __map[bulletInfo[0]] = true;
                }
            }
            // 下落特效
            if (effectShow.fall_file.length > 1) {
                let fallInfo:Array<any> = effectShow.fall_file.split(",");
                if (!__map[fallInfo[0]]) {
                    __map[fallInfo[0]] = true;
                }
            }
            // 击中特效
            if (effectShow.hit_file.length > 1) {
                let hitInfo:Array<any> = effectShow.hit_file.split(",");
                if (!__map[hitInfo[0]]) {
                    __map[hitInfo[0]] = true;
                }
            }
        }
        // buff特效
        let handlerBuffEffectShow = (bufDatas: Array<bufData>) => {
            if (bufDatas) {
                for (let i = 0; i < bufDatas.length; i++) {
                    let buffItem = LocaleData.getSkillBuffItem(bufDatas[i].bufID);
                    if (buffItem.effect_file && buffItem.effect_file.length > 1) {
                        let fallInfo:Array<any> = buffItem.effect_file.split(",");
                        if (!__map[fallInfo[0]]) {
                            __map[fallInfo[0]] = true;
                        }
                    }
                }
            }
        }
        for (let roundNum = 0; roundNum < this.battleResult.roundInfoArr.length; roundNum++) {
            let roundInfo = this.battleResult.roundInfoArr[roundNum];
            handlerBuffEffectShow(roundInfo.startAddBuff);
            handlerBuffEffectShow(roundInfo.startHitBuff);
            handlerReplaceModel(roundInfo.repMonsterArr);
            for (let actionNum = 0; actionNum < roundInfo.actionInfoArr.length; actionNum++) {
                let actionInfo = roundInfo.actionInfoArr[actionNum];
                handlerBuffEffectShow(actionInfo.skillData.beforeAddBuff);
                handlerBuffEffectShow(actionInfo.skillData.afterAddBuff);
                handlerBuffEffectShow(actionInfo.skillData.beforeHitBuff);
                handlerBuffEffectShow(actionInfo.skillData.afterHitBuff);
                handlerReplaceModel(actionInfo.repMonsterArr);
                if (actionInfo.skillData.skillId != 0) {
                    let skillProto = LocaleData.getSkillProto(actionInfo.skillData.skillId);
                    let effectShow = LocaleData.getSkillEffectShow(skillProto.effectShow, true);
                    handlerEffectShow(effectShow);
                }
            }
        }
        let testInfo = this.testResShow;
        if (testInfo && testInfo.type) {
            handlerEffectShow({
                attack_with:testInfo.attack_with,
                bullet_file:testInfo.bullet_file,
                fall_file:testInfo.fall_file,
                hit_file:testInfo.hit_file,
            });
        }
        if (testInfo && Number(testInfo.buffId)) {
            handlerBuffEffectShow([{
                triggerInfo:undefined,
                bufID:Number(testInfo.buffId),
                type:undefined,
                value:undefined,
                final:undefined,
                battleMaxHP:undefined,
                skillId:undefined
            }]);
        }
        let spineNames = new Array<string>();
        for (let key in __map) {
            spineNames.push(key);
        }
        return spineNames;
    }

    /**
     * 加载战斗。
     * 
     * 7-9-11   6-8-10
     *   战斗位置图
     *   1        0
     *   3        2
     *   5        4
     */
    public onBattleLoad(): void {
        let battleResult:battleResult = this.battleResult;
        let entityAttack = battleResult.entityAttack;
        let entityDefend = battleResult.entityDefence;

        // 生成战斗单位
        for (let slot = 0; slot < 12; slot++) {
            let battleObject:BattleObject;
            if (slot == 0) { // 怪物随从（宠物）
                if (entityDefend.petInfoArr && entityDefend.petInfoArr.length > 0) {
                    battleObject = this.newBattleObjectPet(entityDefend, entityDefend.petInfoArr[0], slot); // 战斗位置右上
                }
            } else if (slot == 1) { // 角色随从（宠物）
                if (entityAttack.petInfoArr && entityAttack.petInfoArr.length > 0) {
                    battleObject = this.newBattleObjectPet(entityAttack, entityAttack.petInfoArr[0], slot); // 战斗位置【左】上
                }
            } else if (slot == 2) { // 怪物
                battleObject = this.newBattleObjectEntity(entityDefend, slot); // 战斗位置右中
            } else if (slot == 3) { // 角色
                battleObject = this.newBattleObjectEntity(entityAttack, slot); // 战斗位置【左】中
            } else if (slot == 4) { // 怪物随从（宠物）
                if (entityDefend.petInfoArr && entityDefend.petInfoArr.length > 1) {
                    battleObject = this.newBattleObjectPet(entityDefend, entityDefend.petInfoArr[1], slot); // 战斗位置右下
                }
            } else if (slot == 5) { // 角色随从（宠物）
                if (entityAttack.petInfoArr && entityAttack.petInfoArr.length > 1) {
                    battleObject = this.newBattleObjectPet(entityAttack, entityAttack.petInfoArr[1], slot); // 战斗位置【左】下
                }
            } else if (slot == 6) { // 怪物精怪1
                if (entityDefend.eliteInfoArr && entityDefend.eliteInfoArr.length > 0) {
                    battleObject = this.newBattleObjectElite(entityDefend, entityDefend.eliteInfoArr[0], slot);
                }
            } else if (slot == 7) { // 角色精怪1
                if (entityAttack.eliteInfoArr && entityAttack.eliteInfoArr.length > 0) {
                    battleObject = this.newBattleObjectElite(entityAttack, entityAttack.eliteInfoArr[0], slot);
                }
            } else if (slot == 8) { // 怪物精怪2
                if (entityDefend.eliteInfoArr && entityDefend.eliteInfoArr.length > 1) {
                    battleObject = this.newBattleObjectElite(entityDefend, entityDefend.eliteInfoArr[1], slot);
                }
            } else if (slot == 9) { // 角色精怪2
                if (entityAttack.eliteInfoArr && entityAttack.eliteInfoArr.length > 1) {
                    battleObject = this.newBattleObjectElite(entityAttack, entityAttack.eliteInfoArr[1], slot);
                }
            } else if (slot == 10) { // 怪物精怪3
                if (entityDefend.eliteInfoArr && entityDefend.eliteInfoArr.length > 2) {
                    battleObject = this.newBattleObjectElite(entityDefend, entityDefend.eliteInfoArr[2], slot);
                }
            } else if (slot == 11) { // 角色精怪3
                if (entityAttack.eliteInfoArr && entityAttack.eliteInfoArr.length > 2) {
                    battleObject = this.newBattleObjectElite(entityAttack, entityAttack.eliteInfoArr[2], slot);
                }
            }
            if (battleObject) {
                this.battleObjects.push(battleObject);
            }
        }

        // 显示初始回合
        this.setRoundLabelText(0);

        // 显示速度
        let __sp:string = LocaleUser.getUser(VarVal.FIELD_SV.BATTLE_SPEED);
        let sp = __sp ? Number(__sp) : 1;
        let isSetSpeed:boolean = false;
        if (this.resultParams.typeInfo.type != VarVal.BATTLE_TYPE.PLAYVIRTUAL
            && this.resultParams.typeInfo.type != VarVal.BATTLE_TYPE.PLAYVIRTUAL_SKIN) {
            this.setButtonSpeed(sp);
            isSetSpeed = true;
        }
        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            let loadSpineNames = this.getAllLoadSpineNames();
            let loadCount:number = loadSpineNames.length + 1;
            let loadCall:Function = () => {
                loadCount--;
                if (loadCount == 0) {
                    UtilsUI.unlockWait();
                    for (let i = 0; i < this.battleObjects.length; i++) {
                        this.battleObjects[i].loadRes();
                    }
                    // 开场动画下
                    spp.playAnimation("end", false, null, null, () => {
                        // 解开界面输入
                        this.graph_mask.visible = false;

                        this.group_start.getChild("loader_spine", fgui.GLoader3D).freeSpine();
                        
                        if (isSetSpeed) {
                            this.setBattleSpeed(sp);
                        }
                        // 开始播放回合
                        this.playRound(1);
                    });
                }
            }
            // 开场动画上
            spp.playAnimation("start", false, null, null, () => {
                UtilsUI.lockWait();
                loadCall();
            });
            for (let i = 0; i < loadSpineNames.length; i++) {
                let spineName = loadSpineNames[i];
                PlatformAPI.loadSpine((asset:Asset)=> {
                    asset.addRef();
                    this.loadSpineNameMap[spineName] = asset;
                    loadCall();
                }, spineName)
            }
        }, this.group_start.getChild("loader_spine", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_battlestart);
    }

    /**
     * 显示回合文字。
     */
    private setRoundLabelText(roundIdx:number):void {
        this.curr_roundidx = roundIdx;
        if (this.resultParams.typeInfo.type == VarVal.BATTLE_TYPE.PLAYVIRTUAL) {
            this.label_round.text = StrVal.LYBATTLEMAIN.STR101;
        } else if (this.resultParams.typeInfo.type == VarVal.BATTLE_TYPE.PLAYVIRTUAL_SKIN) {
            this.label_round.text = StrVal.LYBATTLEMAIN.STR102;
        } else {
            this.label_round.text = UtilsTool.stringFormat(StrVal.LYBATTLEMAIN.STR1, [roundIdx, 15]); // this.battleResult.roundAll
        }
        if (roundIdx == 0) {
            this.label_break.text = "";
        } else if (roundIdx < this.BREAK_ROUNDIDX) {
            this.label_break.text = UtilsTool.stringFormat(StrVal.LYBATTLEMAIN.STR2, [this.BREAK_ROUNDIDX - roundIdx]);
        } else if (roundIdx == this.BREAK_ROUNDIDX) {
            this.label_break.text = StrVal.LYBATTLEMAIN.STR3;
        }
    }

    /**
     * 异兽入侵BOSS血量条、切换显示数字。
     */
    public setInvasionProgress(count:number, currHP:number, currMaxHP:number):void {
        if (this.resultParams.typeInfo.type == VarVal.BATTLE_TYPE.INVASION) {
            if (!this.group_progressboss.visible) {
                this.group_progressboss.visible = true;
            }
            if (count || count == 0) {
                let label_count:fgui.GProgressBar = this.group_progressboss.getChild("label_count");
                label_count.text = String(count);
                if (count > 0) {
                    let ___spp: SpinePlayer = this.group_progressboss.data;
                    if (___spp) {
                        ___spp.playAnimation("stand", false);
                    } else {
                        this.group_progressboss.data = new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                            spp.playAnimation("stand", false);
                        }, this.group_progressboss.getChild("loader_spine_box"), VarVal.UI_EFF_NAME.spine_battlebox);
                    }
                }
            } else {
                let bar_bloodboss:fgui.GProgressBar = this.group_progressboss.getChild("bar_bloodboss");
                bar_bloodboss.min = 0;
                bar_bloodboss.max = currMaxHP;
                bar_bloodboss.value = currMaxHP - currHP;
                bar_bloodboss.text = UtilsTool.stringFormat("{0}/{1}", [UtilsTool.nToFStr(currMaxHP - currHP), UtilsTool.nToFStr(currMaxHP)]);
            }
        }
    }

    /**
     * 排序战斗对象层级。
     */
    private sortBattleObjects():void {
        for (let sortIdx = 0; sortIdx < this.group_iner_ctn.numChildren; sortIdx++) {
            let minChild:fgui.GObject;
            for (let iii = sortIdx; iii < this.group_iner_ctn.numChildren; iii++) {
                let child = this.group_iner_ctn.getChildAt(iii);
                if (!minChild || child.y < minChild.y) {
                    minChild = child;
                }
            }
            if (minChild && this.group_iner_ctn.getChildIndex(minChild) != sortIdx) {
                this.group_iner_ctn.setChildIndex(minChild, sortIdx);
            }
        }
    }

    /**
     * 找到对应的战斗对象。
     */
    private getBattleObject(entityID: number, petProtoID: number, eliteProtoID: number, pos: number):BattleObject {
        for (let i = 0; i < this.battleObjects.length; i++) {
            if (this.battleObjects[i].isMatchThis(entityID, petProtoID, eliteProtoID, pos)) {
                return this.battleObjects[i];
            }
        }
    }

    /**
     * 找到防守者的实体战斗对象。
     */
    private getRightEntityBattleObject():BattleObject {
        for (let i = 0; i < this.battleObjects.length; i++) {
            if (this.battleObjects[i].isEntity() && !this.battleObjects[i].isLeftSide()) {
                return this.battleObjects[i];
            }
        }
    }

    /**
     * 播放回合。
     */
    private playRound(roundIdx:number):void {
        let battleResult:battleResult = this.battleResult;
        if (roundIdx > battleResult.roundInfoArr.length) { // 战斗结束，进结算界面。
            if (this.isPlayLoop) { // 循环播放比繁琐，目前只有展示技能才这样，先简单处理。
                this.setTimeout(() => {
                    for (let i = 0; i < this.battleObjects.length; i++) {
                        this.battleObjects[i].reborn();
                    }
                    this.setRoundLabelText(1);
                    this.playAction(1, 1)
                }, 500)
            } else {
                if (!this.isBattleResult) {
                    this.isBattleResult = true;
                    this.resultParams.closeBack = () => {
                        AudioManager.setBGMPause(false);
                        AudioManager.playBGMBack();
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBattleMain, 0, null);
                    }
                    AudioManager.setBGMPause(true);
                    if (this.resultParams.typeInfo.type != VarVal.BATTLE_TYPE.PLAYVIRTUAL
                        && this.resultParams.typeInfo.type != VarVal.BATTLE_TYPE.PLAYVIRTUAL_SKIN) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleResult, 0, this.resultParams);
                    }
                }
            }
        } else {
            this.setRoundLabelText(roundIdx);
            this.playAction(roundIdx, 1)
        }
    }

    /**
     * 播放行动。
     */
    private playAction(roundIdx:number, actionIdx:number, syncObj?:SyncObject):void {
        if (this.isBattleResult) { // 跳过战斗时停止动作。
            return;
        }
        let roundInfo = this.battleResult.roundInfoArr[roundIdx - 1];
        if (actionIdx > roundInfo.actionInfoArr.length) { // 本回合结束，进下一回合。
            this.playRoundBuff(() => {
                this.playRound(roundIdx + 1);
            }, roundInfo, actionIdx);
        } else {
            this.playRoundBuff(() => {
                this.playActionBuff(roundInfo, roundIdx, actionIdx, syncObj);
            }, roundInfo, actionIdx);
        }
    }

    /**
     * 播放回合前BUFF。
     */
    private playRoundBuff(doneCall:Function, roundInfo:roundInfo, actionIdx:number):void {
        if (actionIdx == 1) {
            this.replaceModel(roundInfo.repMonsterArr, roundInfo.targetEndHP, roundInfo.targetEndMaxHP, roundInfo.targetEndAnger);
            // 行动前buff
            this.handlerBuffDatas(roundInfo.startAddBuff, roundInfo.startHitBuff, roundInfo.startRemoveBuff, true, doneCall);
        } else {
            doneCall();
        }
    }

    /**
     * 切换模型。
     */
    private replaceModel(monsterIds:Array<number>, endHP?:number | string, endMaxHP?:number | string, endAnger?:number | string):void {
        if (monsterIds && monsterIds.length > 0) {
            let monsterProto = LocaleData.getMonsterProto(monsterIds[monsterIds.length - 1]);
            let battleObject = this.getRightEntityBattleObject();
            battleObject.addSpineRole(LocaleData.getModelShowInfo(monsterProto.modelId));
            // 血量
            battleObject.setCurrHP(null, endHP, endMaxHP);
            battleObject.setCurrAnger(null, endAnger);
            // 掉落动画
            for (let i = 0; i < monsterIds.length; i++) {
                this.playBossDropAni(battleObject);
            }
        }
    }

    /**
     * BOSS掉落动画。
     */
    private playBossDropAni(battleObject:BattleObject):void {
        let group_box = fgui.UIPackage.createObject(VarVal.PACKAGE_FGUIS.LyBattleMain, "group_box").asCom;
        this.group_iner_eft.addChild(group_box);
        let start = new Vec2(battleObject.getDisplayObj().x, battleObject.getDisplayObj().y);
        let img_box = this.group_progressboss.getChild("img_box");
        let end = new Vec2(this.group_progressboss.x + img_box.x, this.group_progressboss.y + img_box.y);
        UtilsUI.playCommonDropAni(() => {
            group_box.removeFromParent();
            // 数量
            this.replaceMonsterNum += 1;
            this.setInvasionProgress(this.replaceMonsterNum, null, null);
        }, group_box, start, UtilsTool.random(-200, 200), 150, end);
    }

    /**
     * 播放行动前BUFF。
     */
    private playActionBuff(roundInfo:roundInfo, roundIdx:number, actionIdx:number, syncObj:SyncObject):void {
        let actionInfo = roundInfo.actionInfoArr[actionIdx - 1];
        // 前置buff
        this.handlerBuffDatas(actionInfo.skillData.beforeAddBuff, actionInfo.skillData.beforeHitBuff, actionInfo.skillData.beforeRemoveBuff, true, () => {
            this.playActionStart(actionInfo, roundIdx, actionIdx, syncObj);
        });
    }

    /**
     * 获得下一次行动数据。
     */
    private getNextActionInfo(roundIdx:number, actionIdx:number): actionInfo {
        let roundInfo = this.battleResult.roundInfoArr[roundIdx - 1];
        if (roundInfo) {
            if (actionIdx > roundInfo.actionInfoArr.length) { // 本回合结束，进下一回合。
                return this.getNextActionInfo(roundIdx + 1, 1);
            } else {
                return roundInfo.actionInfoArr[actionIdx - 1];
            }
        }
    }

    /**
     * 获得下一次行动攻击者。
     */
    private getNextActionBattleObject(roundIdx:number, actionIdx:number): BattleObject {
        let actionInfo = this.getNextActionInfo(roundIdx, actionIdx);
        if (actionInfo) {
            let triggerInfo = actionInfo.skillData.triggerInfo;
            let battleObject = this.getBattleObject(triggerInfo.entityID, triggerInfo.petProtoID, triggerInfo.eliteProtoID, triggerInfo.pos);
            return battleObject;
        }
    }

    /**
     * 获得下一次行动防御者。
     */
    private getNextActionDefenseObject(roundIdx:number, actionIdx:number): BattleObject {
        let actionInfo = this.getNextActionInfo(roundIdx, actionIdx);
        if (actionInfo) {
            let triggerInfo = actionInfo.skillData.triggerInfo;
            let defenseObject = this.getBattleObject(triggerInfo.targetID, null, null, null); // 非实体都不能作为防守者进行计算，否则错误。
            return defenseObject;
        }
    }

    /**
     * 播放行动开始。
     */
    private playActionStart(actionInfo:actionInfo, roundIdx:number, actionIdx:number, syncObj:SyncObject):void {
            let roundInfo = this.battleResult.roundInfoArr[roundIdx - 1];

            let arrIdx = actionIdx - 1;
            let isCurrCounter:boolean = false; // 本次行动是否属于反击。
            if (arrIdx > 0 && roundInfo.actionInfoArr[arrIdx - 1].targetCounter) { // 上一次行动触发了反击，此时攻击方还没回到原战斗位。
                isCurrCounter = true;
            }
            let isCurrCooperate:boolean = false; // 本次行动是否属于协同。
            if (arrIdx > 0 && roundInfo.actionInfoArr[arrIdx - 1].cooperateAttack) { // 上一次行动触发了协同，此时攻击方还没回到原战斗位。
                isCurrCooperate = true;
            }
            let currComboNum:number = 0; // 本次行动是否属于连击。
            if (arrIdx > 0) { // 计算这次是几连击。
                for (let i = arrIdx - 1; i >= 0; i--) {
                    if (roundInfo.actionInfoArr[i].comboCnt) {
                        currComboNum++;
                    } else {
                        break;
                    }
                }
            }

            let triggerInfo = actionInfo.skillData.triggerInfo;
            let battleObject = this.getBattleObject(triggerInfo.entityID, triggerInfo.petProtoID, triggerInfo.eliteProtoID, triggerInfo.pos);
            let defenseObject = this.getBattleObject(triggerInfo.targetID, null, null, null); // 非实体都不能作为防守者进行计算，否则错误。

            let othParams = {
                currComboNum:currComboNum,
                roundIdx:roundIdx,
                actionIdx:actionIdx,
                skillProto:undefined,
                effectShow:undefined,
                hitCompleteCount:2, // 本次行动结束的综合计数回调标记。
                syncObj:syncObj,
            }
            
        if (actionInfo.skillData.skillId == 0) { // 死亡复活、眩晕、冰冻
            othParams.hitCompleteCount = 1;
            this.doAnimationHitComplete(actionInfo, battleObject, null, othParams);
        } else {
            let skillProto = LocaleData.getSkillProto(actionInfo.skillData.skillId);
            othParams.skillProto = skillProto;
            let chaseCall:Function = () => {
                if (battleObject.isElite()) {
                    this.doEliteAttack(battleObject, othParams.skillProto, () => {
                        this.doAnimationFall(actionInfo, battleObject, defenseObject, othParams);
                    }, () => {
                        this.doAnimationHitComplete(actionInfo, battleObject, defenseObject, othParams);
                    });
                } else {
                    this.doAnimationAttack(actionInfo, battleObject, defenseObject, othParams);
                }
            }
            let waitChaseCall:Function = () => {
                if (isCurrCounter) { // 飘字“反击”
                    this.showDamageText(battleObject, DamageUIType.TFanJi);
                }
                if (isCurrCooperate) { // 飘字“协同”
                    this.showDamageText(battleObject, DamageUIType.TXieTong);
                }
                if (currComboNum) { // 飘字“连击”
                    this.showDamageText(battleObject, DamageUIType.TLianJi);
                }

                if (skillProto.name_img && skillProto.name_img.length > 0) {
                    this.showDamageText(battleObject, DamageUIType.Skill, skillProto.name_img);
                }

                if (syncObj && syncObj.isChase) {
                    syncObj.chaseCount = syncObj.chaseCount - 1;
                    if (syncObj.chaseCount == 0) {
                        chaseCall();
                    } else {
                        syncObj.chaseCall = chaseCall;
                    }
                } else {
                    chaseCall();
                }
            }
            if (battleObject.isElite()) {
                waitChaseCall();
            } else {
                let effectShow = LocaleData.getSkillEffectShow(skillProto.effectShow, true);
                let testInfo = this.testResShow;
                if (testInfo && testInfo.type && battleObject.isEntity() && battleObject.isTestSpineSide()) {
                    effectShow = {
                        id:effectShow.id,
                        type:testInfo.type,
                        attack_ani:testInfo.attack_ani,
                        attack_with:testInfo.attack_with,
                        bullet_file:testInfo.bullet_file,
                        fall_file:testInfo.fall_file,
                        hit_file:testInfo.hit_file,
                    }
                }
                othParams.effectShow = effectShow;
                // 近战需要前进到防守者跟前位置。
                if (effectShow.type == VarVal.SKILL_SHOWTYPE.ACTION) { // 此类型需要靠近位置平砍，如需远程平砍，请使用类型FALL然后不填下落的动画。
                    if (battleObject.isSourcePosition() && defenseObject.isSourcePosition()) { // 如果没有前进过。
                        battleObject.setIsSourcePosition(false);
                        // 跳跃。
                        let dstPos = defenseObject.getSourcePosition();
                        if (defenseObject.isLeftSide()) {
                            dstPos.x = dstPos.x + 150;
                        } else {
                            dstPos.x = dstPos.x - 150;
                        }
                        let move_begin = battleObject.getAnimationEventTime(VarVal.SPINE_ANI_NAME.move, VarVal.SPINE_ENV_NAME.move_begin);
                        if (move_begin.allTime > 0) {
                            let move_end = battleObject.getAnimationEventTime(VarVal.SPINE_ANI_NAME.move, VarVal.SPINE_ENV_NAME.move_end);
                            let envTime1:number = move_begin.envTime ? move_begin.envTime : 0;
                            let envTime2:number = move_end.envTime ? move_end.envTime : move_end.allTime;
                            let count = 2;
                            let doneCall = () => {
                                count--;
                                if (count == 0) {
                                    waitChaseCall();
                                }
                            }
                            this.getGTween(battleObject.getDisplayObj()).delay(envTime1).to(envTime2 - envTime1, {x:dstPos.x, y:dstPos.y}).call((tw) => {
                                this.delGTween(tw);
                                this.sortBattleObjects();
                                doneCall();
                            }).start();
                            battleObject.playAnimation(VarVal.SPINE_ANI_NAME.move, false, null, null, (aniName:string) => {
                                doneCall();
                            }, true);
                        } else {
                            this.getGTween(battleObject.getDisplayObj()).to(0.2, {x:dstPos.x, y:dstPos.y}).call((tw) => {
                                this.delGTween(tw);
                                this.sortBattleObjects();
                                waitChaseCall();
                            }).start();
                        }
                    } else {
                        waitChaseCall();
                    }
                } else if (effectShow.type == VarVal.SKILL_SHOWTYPE.BULLET) {
                    waitChaseCall();
                } else { // FALL
                    waitChaseCall();
                }
            }
        }
    }

    /**
     * 回退复位。
     */
    private doAnimationBack(backObject:BattleObject, callback:Function):void {
        if (!backObject.isSourcePosition() && (!backObject.isEntity() || backObject.getCurrHP() > 0)) { // 回退。
            backObject.setIsSourcePosition(true);
            let dstPos = backObject.getSourcePosition();
            let back_up = backObject.getAnimationEventTime(VarVal.SPINE_ANI_NAME.back_up);
            if (back_up.allTime > 0) {
                let count = 2;
                let doneCall = () => {
                    count--;
                    if (count == 0) {
                        callback();
                    }
                }
                this.getGTween(backObject.getDisplayObj()).to(back_up.allTime, {x:dstPos.x, y:dstPos.y}).call((tw) => {
                    this.delGTween(tw);
                    this.sortBattleObjects();
                    doneCall();
                }).start();
                backObject.playAnimation(VarVal.SPINE_ANI_NAME.back_up, false, null, null, (aniName:string) => {
                    backObject.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                    doneCall();
                }, true);
            } else {
                this.getGTween(backObject.getDisplayObj()).to(0.2, {x:dstPos.x, y:dstPos.y}).call((tw) => {
                    this.delGTween(tw);
                    this.sortBattleObjects();
                    callback();
                }).start();
                backObject.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }
        } else {
            callback();
        }
    }

    /**
     * 回退复位All。
     */
    private doAnimationBackAll(battleObject:BattleObject, defenseObject:BattleObject, callback:Function):void {
        let counter = 2;
        let doneCall = () => {
            counter--;
            if (counter == 0) {
                callback();
            }
        }
        this.doAnimationBack(battleObject, doneCall);
        this.doAnimationBack(defenseObject, doneCall);
    }

    /**
     * BUFF辅助接口。
     */
    private handlerBuffDatas(insertDatas: Array<bufData>, hitDatas: Array<bufData>, removeDatas: Array<bufData>, isDelay?:boolean, doneCall?:Function):void {
        // 插入buff【根据叠加数显示头顶图标icon】
        let testInfo = this.testResShow;
        if (testInfo && Number(testInfo.buffId)) {
            insertDatas = [{
                triggerInfo:{
                    entityID: this.battleResult.entityDefence.entityID,
                    petProtoID: 0,
                    eliteProtoID: 0,
                    pos: 0,
                    targetID: this.battleResult.entityDefence.entityID
                },
                bufID:Number(testInfo.buffId),
                type:undefined,
                value:undefined,
                final:undefined,
                battleMaxHP:undefined,
                skillId:undefined,
            }];
        }
        if ((insertDatas && insertDatas.length > 0) || (hitDatas && hitDatas.length > 0) || (removeDatas && removeDatas.length > 0)) {
            if (isDelay) {
                this.getGTween(this.group_battle).delay(0.2).call((tw) => {
                    this.handlerDoBuffDatas(insertDatas, hitDatas, removeDatas);
                    this.tryPlayAllDiedAnimation();
                }).delay(0.2).call((tw) => {
                    this.delGTween(tw);
                    if (doneCall) {
                        doneCall();
                    }
                }).start();
            } else {
                this.handlerDoBuffDatas(insertDatas, hitDatas, removeDatas);
                if (doneCall) {
                    doneCall();
                }
            }
        } else {
            if (doneCall) {
                doneCall();
            }
        }
    }

    /**
     * BUFF辅助接口。
     */
    private handlerDoBuffDatas(insertDatas: Array<bufData>, hitDatas: Array<bufData>, removeDatas: Array<bufData>):void {
        // 移除buff【根据叠加数移除头顶图标icon】
        if (removeDatas && removeDatas.length > 0) {
            for (let i = 0; i < removeDatas.length; i++) {
                let buff = removeDatas[i];
                let battleObject = this.getBattleObject(buff.triggerInfo.targetID, null, null, null);
                battleObject.buffRemove(buff);
            }
        }

        // 生效buff（例如每回合回血的buff要生效，这次回了多少血bufData.value值。例如每回合扣血的buff要生效，这次扣了多少血bufData.value值等等）【飘字显示+血条、怒气条变动】
        if (hitDatas && hitDatas.length > 0) {
            for (let i = 0; i < hitDatas.length; i++) {
                let buff = hitDatas[i];
                let battleObject = this.getBattleObject(buff.triggerInfo.targetID, null, null, null);
                let attackObject = this.getBattleObject(buff.triggerInfo.entityID, buff.triggerInfo.petProtoID, buff.triggerInfo.eliteProtoID, buff.triggerInfo.pos);
                battleObject.buffHit(buff, attackObject);
            }
        }

        // 插入buff【根据叠加数显示头顶图标icon】
        if (insertDatas && insertDatas.length > 0) {
            for (let i = 0; i < insertDatas.length; i++) {
                let buff = insertDatas[i];
                let battleObject = this.getBattleObject(buff.triggerInfo.targetID, null, null, null);
                let attackObject = this.getBattleObject(buff.triggerInfo.entityID, buff.triggerInfo.petProtoID, buff.triggerInfo.eliteProtoID, buff.triggerInfo.pos);
                battleObject.buffInsert(buff, attackObject);
            }
        }
    }

    /**
     * 精怪起手（精怪没有行动，只会释放BUFF）。
     */
    public doEliteAttack(battleObject:BattleObject, skillProto:any, fallCall?:Function, doneCall?:Function):void {
        let label_text:fgui.GTextField = new fgui.GTextField();
        label_text.autoSize = fgui.AutoSizeType.Both;
        label_text.fontSize = 28;
        label_text.font = VarVal.FONT_NAME.ART_BIG;
        label_text.stroke = 2;
        label_text.strokeColor = new Color(0, 0, 0, 255);
        label_text.color = new Color(255, 225, 166, 255);
        label_text.text = skillProto.name;
        label_text.setPivot(0.5, 0.5, true);
        this.group_start.addChild(label_text);
        let group_head = battleObject.getDisplayGroupHead();
        label_text.setPosition(group_head.x, group_head.y);
        this.getGTween(label_text).by(0.2, {scaleX:0, scaleY:0, y:-50}, {easing: fgui.EaseType.QuadOut}).call(() => {
            if (fallCall) {fallCall()}
        }).delay(0.5).by(0.2, {scaleX:-0.5, scaleY:-0.5, y:-50}, {easing: fgui.EaseType.QuadIn}).call((tw) => {
            this.delGTween(tw);
            label_text.removeFromParent();
            if (doneCall) {doneCall()}
        }).start();
        // 头像放大（会被下次攻击覆盖tween？时间间隔应该没那么快）
        let scale = group_head.scaleX > 0 ? 0.5 : -0.5;
        this.getGTween(group_head).by(0.2, {scaleX:scale, scaleY:0.5}, {easing: fgui.EaseType.QuadOut}).by(0.2, {scaleX:-scale, scaleY:-0.5}, {easing: fgui.EaseType.QuadIn}).call((tw) => {
            this.delGTween(tw);
        }).start();
    }

    /**
     * 起手特效。
     */
    private doAnimationAttack(actionInfo:actionInfo, battleObject:BattleObject, defenseObject:BattleObject, othParams:any):void {
        // 随机动画名
        let name_ani:string = othParams.effectShow.attack_ani;
        if (name_ani.indexOf("|") >= 0) {
            let randNames = name_ani.split("|");
            name_ani = randNames[UtilsTool.random(0, randNames.length - 1)];
        }
        if (othParams.currComboNum) { // 本次是连击
            name_ani = battleObject.getAnimationLanName(name_ani, othParams.currComboNum);
        }
        let isCanComplete = 0;
        battleObject.playAnimation(name_ani, false, null, (aniName:string, envName:string) => { // 这里注意，动画制作中，事件帧最好不能放在首帧、或未帧。
            if (envName == VarVal.SPINE_ENV_NAME.attack_hit) {
                isCanComplete = 1;
                this.doAnimationBullet(actionInfo, battleObject, defenseObject, othParams);
            } else if (envName == VarVal.SPINE_ENV_NAME.attack_atk) {
                defenseObject.playAnimation(VarVal.SPINE_ANI_NAME.hurt, false);
                this.doAnimationHit(actionInfo, battleObject, defenseObject, othParams, true);
            } else if (envName == VarVal.SPINE_ENV_NAME.attack_lan) {
                if (actionInfo.comboCnt) { // 下一次是连击
                    // 如果事件帧与完成帧在同一逻辑帧触发，那么在事件帧中重新播放此动作时，会触发上一次动作的完成帧，暂时没有办法。
                    isCanComplete = 2; // 限制完成帧不会再触发。
                    this._partner.callLater(() => { // 如果不加延迟，那么残留的完成帧则会直接触发新回调，延迟是为了让它把残留忽略掉。
                        battleObject.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                        this.doAnimationHitComplete(actionInfo, battleObject, defenseObject, othParams);
                    })
                }
            }
        }, (aniName:string) => {
            if (isCanComplete == 2) {
                return;
            }
            if (isCanComplete == 0) {
                this.doAnimationBullet(actionInfo, battleObject, defenseObject, othParams);
            }
            battleObject.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            this.doAnimationHitComplete(actionInfo, battleObject, defenseObject, othParams);
        }); // 这里被打断怎么办？应该不能被打断！
        // 跟随特效
        if (othParams.effectShow.attack_with.length > 1) {
            let blocks:Array<string> = othParams.effectShow.attack_with.split(";");
            for (let i = 0; i < blocks.length; i++) {
                let fallInfo:Array<any> = blocks[i].split(",");
                let spineName:string = fallInfo[0];
                let bodyTypeDst:BodyPointType = fallInfo[1];

                let loader_spine = this.addSpineEffect(spineName, false, battleObject.isLeftSide(), null);
                // 位置
                let dstPos = battleObject.getSkeAniBoneInContentPos(bodyTypeDst);
                loader_spine.setPosition(dstPos.x, dstPos.y);
            }
        }
    }

    /**
     * 添加特效GLoader3D与spine辅助接口。
     */
    public addGLoader3DSpine(loader_spine:fgui.GLoader3D, spname:string, isFlipX:boolean):fgui.GLoader3D {
        loader_spine.setSize(2, 2);
        loader_spine.setPivot(0.5, 1, true);
        // 底居中
        loader_spine.setSpine(this.loadSpineNameMap[spname], new Vec2(0.5, 1), false);
        let ske:sp.Skeleton = <sp.Skeleton>loader_spine.content;
        // 添加到倍速管理
        this.addSkillSpine(ske);
        // 翻转
        if (isFlipX) {
            ske._skeleton.scaleX = 0 - ske._skeleton.scaleX;
        }
        return loader_spine;
    }

    /**
     * 添加特效辅助接口。
     */
    private addSpineEffect(spname:string, loop:boolean, isFlipX:boolean, hitCall:Function):fgui.GLoader3D {
        let loader_spine = this.addGLoader3DSpine(<fgui.GLoader3D>this.group_iner_eft.addChild(new fgui.GLoader3D()), spname, isFlipX);
        let ske:sp.Skeleton = <sp.Skeleton>loader_spine.content;
        if (!loop) {
            // 事件帧
            ske.setEventListener((trackEntry:sp.spine.TrackEntry, event:sp.spine.Event) => {
                if (hitCall) {
                    hitCall(trackEntry.animation.name, event.stringValue);
                    if (event.stringValue == VarVal.SPINE_ENV_NAME.attack_hit) {
                        hitCall = null;
                    }
                }
            })
            ske.setCompleteListener((trackEntry:sp.spine.TrackEntry) => {
                this.delSkillSpine(ske);
                loader_spine.removeFromParent();
                if (hitCall) {
                    hitCall(trackEntry.animation.name, VarVal.SPINE_ENV_NAME.attack_hit);
                    hitCall = null;
                }
            })
        }
        // 皮肤
        // ske.setSkin("1");
        // 动画
        ske.setAnimation(0, ske._skeleton.data.animations[0].name, loop);
        return loader_spine;
    }

    /**
     * 飞行特效。
     */
    private doAnimationBullet(actionInfo:actionInfo, battleObject:BattleObject, defenseObject:BattleObject, othParams:any):void {
        if (othParams.effectShow.bullet_file.length > 1) {
            let bulletInfo:Array<any> = othParams.effectShow.bullet_file.split(",");
            let spineName:string = bulletInfo[0];
            let bodyTypeSrc:BodyPointType = bulletInfo[1];
            let bodyTypeDst:BodyPointType = bulletInfo[2];
            let speed:number = Number(bulletInfo[3] ? bulletInfo[3] : 100); // 1秒多少像素。

            let loader_spine = this.addSpineEffect(spineName, true, battleObject.isLeftSide(), null);
            // 飞行
            let srcPos = battleObject.getSkeAniBoneInContentPos(bodyTypeSrc);
            let dstPos = defenseObject.getSkeAniBoneInContentPos(bodyTypeDst);
            if (bodyTypeDst == BodyPointType.none) { // 使用攻击者的高度Y，水平射出。
                dstPos.y = srcPos.y;
            }
            loader_spine.setPosition(srcPos.x, srcPos.y);
            let duration = Math.sqrt(Math.pow((dstPos.x - srcPos.x), 2) + Math.pow((dstPos.y - srcPos.y), 2)) / speed;
            this.getGTween(loader_spine).to(duration, {x:dstPos.x, y:dstPos.y}).call((tw) => {
                this.delGTween(tw);
                this.delSkillSpine(<sp.Skeleton>loader_spine.content);
                loader_spine.removeFromParent();
                this.doAnimationFall(actionInfo, battleObject, defenseObject, othParams);
            }).start();
        } else {
            this.doAnimationFall(actionInfo, battleObject, defenseObject, othParams);
        }
    }

    /**
     * 下落特效。
     */
    private doAnimationFall(actionInfo:actionInfo, battleObject:BattleObject, defenseObject:BattleObject, othParams:any):void {
        if (othParams.effectShow.fall_file.length > 1) {
            let fallInfo:Array<any> = othParams.effectShow.fall_file.split(",");
            let spineName:string = fallInfo[0];
            let bodyTypeDst:BodyPointType = fallInfo[1];

            let loader_spine = this.addSpineEffect(spineName, false, !defenseObject.isLeftSide(), (aniName:string, envName:string) => {
                if (envName == VarVal.SPINE_ENV_NAME.attack_hit) {
                    this.doAnimationHit(actionInfo, battleObject, defenseObject, othParams);
                } else if (envName == VarVal.SPINE_ENV_NAME.attack_atk) {
                    defenseObject.playAnimation(VarVal.SPINE_ANI_NAME.hurt, false);
                    this.doAnimationHit(actionInfo, battleObject, defenseObject, othParams, true);
                }
            });
            // 位置
            let dstPos = defenseObject.getSkeAniBoneInContentPos(bodyTypeDst);
            loader_spine.setPosition(dstPos.x, dstPos.y);
        } else {
            this.doAnimationHit(actionInfo, battleObject, defenseObject, othParams);
        }
    }

    /**
     * 击中特效。
     */
    private doAnimationHit(actionInfo:actionInfo, battleObject:BattleObject, defenseObject:BattleObject, othParams:any, isSkipDamage:boolean = false):void {
        if (othParams.effectShow.hit_file.length > 1) {
            let hitInfo:Array<any> = othParams.effectShow.hit_file.split(",");
            let spineName:string = hitInfo[0];
            let bodyTypeDst:BodyPointType = hitInfo[1];

            let loader_spine = this.addSpineEffect(spineName, false, !defenseObject.isLeftSide(), (aniName:string, envName:string) => {
                if (envName == VarVal.SPINE_ENV_NAME.attack_hit) {
                    if (!isSkipDamage) {
                        this.doSkillDamage(actionInfo, battleObject, defenseObject, othParams);
                    }
                }
            });
            // 位置
            let dstPos = defenseObject.getSkeAniBoneInContentPos(bodyTypeDst);
            loader_spine.setPosition(dstPos.x, dstPos.y);
        } else {
            if (!isSkipDamage) {
                this.doSkillDamage(actionInfo, battleObject, defenseObject, othParams);
            }
        }
    }

    /**
     * 伤害显示。
     */
    private doSkillDamage(actionInfo:actionInfo, battleObject:BattleObject, defenseObject:BattleObject, othParams:any):void {
        // 攻击方增加怒气。
        battleObject.setCurrAnger(actionInfo.addAnger, actionInfo.endAnger);
        // 防守方增加怒气。
        defenseObject.setCurrHP(actionInfo.targetAddHP, actionInfo.targetEndHP, actionInfo.targetEndMaxHP);
        defenseObject.setCurrAnger(actionInfo.targetAddAnger, actionInfo.targetEndAnger, actionInfo.targetEndAnger);

        if (actionInfo.targetMiss) { // 飘字“闪避”
            this.showDamageText(defenseObject, DamageUIType.TShanBi);
        } else { // 需要区分治疗还是伤害？目前都是伤害。
            if (Number(actionInfo.targetAddHP) > 0) {
                this.showDamageText(defenseObject, DamageUIType.Damage, actionInfo.targetAddHP, actionInfo.critital);
            }
        }
        if (actionInfo.skillData.addBloodInfo) { // 攻击者飘“吸血”，攻击者飘“+1000”
            let entityObject = this.getBattleObject(actionInfo.skillData.triggerInfo.entityID, null, null, null);
            entityObject.setCurrHP(actionInfo.skillData.addBloodInfo.value, actionInfo.skillData.addBloodInfo.final);
            this.showDamageText(battleObject, DamageUIType.TXiXue);
            this.showDamageText(entityObject, DamageUIType.Cure, actionInfo.skillData.addBloodInfo.value);
        }
        if (actionInfo.skillData.petAddBloodInfo) { // 攻击者的宠物飘“吸血”，攻击者飘“+1000”
            let entityObject = this.getBattleObject(actionInfo.skillData.triggerInfo.entityID, null, null, null);
            entityObject.setCurrHP(actionInfo.skillData.petAddBloodInfo.value, actionInfo.skillData.petAddBloodInfo.final);
            // this.showDamageText(battleObject, DamageUIType.TXiXue);
            this.showDamageText(entityObject, DamageUIType.Cure, actionInfo.skillData.petAddBloodInfo.value);
        }
        if (actionInfo.skillData.costBloodInfo) { // 额外伤害
            let entityObject = this.getBattleObject(actionInfo.skillData.triggerInfo.entityID, null, null, null);
            entityObject.setCurrHP(actionInfo.skillData.costBloodInfo.value, actionInfo.skillData.costBloodInfo.final);
            this.showDamageText(entityObject, DamageUIType.Damage, actionInfo.skillData.costBloodInfo.value);
        }
        if (actionInfo.critital) { // 飘字“暴击”
            // this.showDamageText(defenseObject, DamageUIType.TBaoJi);
        }

        if (actionInfo.cooperateAttack) { // 下一次行动会协同。（一定要在伤害后协同，可能伤害前后扣除等次序可能错乱）
            let syncObj:SyncObject = {
                isCooperate: true,
                cooperateCount: 2
            }
            // 直接让下一位出手，两者都行动完才会继续下一行动。
            this.playAction(othParams.roundIdx, othParams.actionIdx + 1, syncObj);
            othParams.syncObj = syncObj;
        }

        let nextObject = this.getNextActionBattleObject(othParams.roundIdx, othParams.actionIdx + 1);
        // let nextDefense = this.getNextActionDefenseObject(othParams.roundIdx, othParams.actionIdx + 1);
        if (nextObject && nextObject === defenseObject && // 下回合一定是defenseObject出手
                (actionInfo.targetCounter // 是反击
                || (battleObject.isSourcePosition() && defenseObject.isSourcePosition()) // 或都站在原地
                )
            ) {
            if (defenseObject.getCurrHP() > 0) {
                if (Number(actionInfo.targetAddHP) > 0) {
                    defenseObject.playAnimation(VarVal.SPINE_ANI_NAME.hurt, false, null, null, (aniName:string) => { // 受击动作
                        defenseObject.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                        this.doAnimationHitComplete(actionInfo, battleObject, defenseObject, othParams);
                    }, true);
                } else {
                    this.doAnimationHitComplete(actionInfo, battleObject, defenseObject, othParams);
                }
            } else { // 死亡动作
                defenseObject.tryPlayDiedAnimation(() => {
                    this.doAnimationHitComplete(actionInfo, battleObject, defenseObject, othParams);
                })
            }
        } else {
            if (defenseObject.getCurrHP() > 0) {
                if (Number(actionInfo.targetAddHP) > 0) {
                    defenseObject.playAnimation(VarVal.SPINE_ANI_NAME.hurt, false, null, null, (aniName:string) => { // 受击动作
                        defenseObject.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                    }, true);
                }
            } else { // 死亡动作
                defenseObject.tryPlayDiedAnimation(null);
            }
            // 不要等受击动作，直接继续（近战的回退会有延迟感）
            this.doAnimationHitComplete(actionInfo, battleObject, defenseObject, othParams);
        }
    }

    /**
     * 伤害&效果飘字迭代。
     */
    private doShowDamageTextOne(showArr:Array<any>):void {
        let showData = showArr[0];
        if (showData) { // 没有正在进行的显示。
            let battleObject:BattleObject = showData.battleObject;
            let type:DamageUIType = showData.type;
            let num:any = showData.num;
            let isCrit:boolean = showData.isCrit;

            let pos = battleObject.getShowDamagePosition();
            // 文本
            let bmp_text:fgui.GTextField | fgui.GLoader;
            if (type == DamageUIType.Damage) {
                bmp_text = new fgui.GTextField();
                if (isCrit) {
                    bmp_text.font = "ui://CCommon/font_bmp_crit";
                    bmp_text.fontSize = 64;
                    bmp_text.letterSpacing = -20;
                } else {
                    bmp_text.font = "ui://CCommon/font_bmp_damage";
                    bmp_text.fontSize = 48;
                    bmp_text.letterSpacing = -10;
                }
                bmp_text.autoSize = fgui.AutoSizeType.Both;
                bmp_text.text = String(0 - Number(num));
            } else if (type == DamageUIType.Cure) {
                bmp_text = new fgui.GTextField();
                bmp_text.font = "ui://CCommon/font_bmp_cure";
                bmp_text.fontSize = 48;
                bmp_text.letterSpacing = -10;
                bmp_text.autoSize = fgui.AutoSizeType.Both;
                bmp_text.text = "+" + String(num);
            } else {
                bmp_text = new fgui.GLoader();
                bmp_text.autoSize = true;
                if (type == DamageUIType.Skill) {
                    bmp_text.url = UtilsTool.stringFormat("ui://LyBattleMain/{0}", [num]);
                } else {
                    bmp_text.url = UtilsTool.stringFormat("ui://LyBattleMain/battle_text{0}", [type]);
                }
            }
            // 添加
            this.group_start.addChild(bmp_text);
            bmp_text.setPivot(0.5, 0.5, true);
            if (type == DamageUIType.Damage || type == DamageUIType.Cure) { // 伤害、血量
                bmp_text.setPosition(pos.x, pos.y + 200);
                // 动效
                bmp_text.setScale(2.5, 2.5);
                bmp_text.alpha = 0.5;
                this.getGTween(bmp_text).by(0.3, {y:-200, scaleX:-1.5, scaleY:-1.5, alpha:0.5}, {easing: fgui.EaseType.QuadOut}).call((tw) => {
                    showArr.shift();
                    this.doShowDamageTextOne(showArr);
                }).delay(0.2).by(0.2, {y:-120, alpha:0}, {easing: fgui.EaseType.QuadIn}).call((tw) => {
                    this.delGTween(tw);
                    bmp_text.removeFromParent();
                }).start();

            } else if (type == DamageUIType.Skill) { // 技能名称
                let outPos:Vec2;
                if (battleObject.isLeftSide()) {
                    outPos = new Vec2(pos.x - 200, pos.y - 100);
                } else {
                    outPos = new Vec2(pos.x + 200, pos.y - 100);
                }
                bmp_text.setPosition(outPos.x, outPos.y);
                // 动效
                bmp_text.setScale(0.5, 0.5);
                bmp_text.alpha = 0.5;
                this.getGTween(bmp_text).to(0.3, {x:pos.x, alpha:1}, {easing: fgui.EaseType.QuadOut}).call((tw) => {
                    showArr.shift();
                    this.doShowDamageTextOne(showArr);
                }).delay(0.2).to(0.2, {x:outPos.x, alpha:0.5}, {easing: fgui.EaseType.QuadIn}).call((tw) => {
                    this.delGTween(tw);
                    bmp_text.removeFromParent();
                }).start();
                
            } else { // 效果名
                bmp_text.setPosition(pos.x, pos.y);
                // 动效
                this.getGTween(bmp_text).by(0.15, {scaleX:1, scaleY:1}, {easing: fgui.EaseType.QuadOut})
                .by(0.15, {scaleX:-1, scaleY:-1}, {easing: fgui.EaseType.QuadOut}).call((tw) => {
                    showArr.shift();
                    this.doShowDamageTextOne(showArr);
                }).delay(0.2).by(0.2, {y:-120, alpha:0}, {easing: fgui.EaseType.QuadIn}).call((tw) => {
                    this.delGTween(tw);
                    bmp_text.removeFromParent();
                }).start();
            }
        }
    }

    /**
     * 伤害&效果飘字。
     */
    public showDamageText(battleObject:BattleObject, type:DamageUIType, num?:any, isCrit?:boolean):void {
        let displaySlot = battleObject.getBattleInitParams().displayInfo.slot;
        let showArr:Array<any> = this.damageTextWaits[displaySlot];
        if (!showArr) {
            showArr = new Array<any>();
            this.damageTextWaits[displaySlot] = showArr;
        }
        showArr.push({
            battleObject: battleObject,
            type: type,
            num: num,
            isCrit: isCrit
        });
        if (showArr.length == 1) { // 没有正在进行的显示。
            this.doShowDamageTextOne(showArr);
        }
    }

    /**
     * 所有对象死亡动画。
     */
    private tryPlayAllDiedAnimation(callback?:Function):void {
        let counter = this.battleObjects.length;
        for (let i = 0; i < this.battleObjects.length; i++) {
            this.battleObjects[i].tryPlayDiedAnimation(() => {
                counter--;
                if (counter == 0 && callback) {
                    callback();
                }
            });
        }
    }

    /**
     * 回合结束。
     */
    private doAnimationHitComplete(actionInfo:actionInfo, battleObject:BattleObject, defenseObject:BattleObject, othParams:any):void {
        othParams.hitCompleteCount--;
        if (othParams.hitCompleteCount == 0) {
            // 后置buff
            this.handlerBuffDatas(actionInfo.skillData.afterAddBuff, actionInfo.skillData.afterHitBuff, actionInfo.skillData.afterRemoveBuff);

            let isTie:boolean = !defenseObject; // 眩晕或者束缚等，表示这回合轮空。

            let doneCall:Function = () => {
                // 这2个字段同时只能出现1个。
                if (actionInfo.targetCounter) { // 如果下一次是反击。
                    /*
                    let syncObj:SyncObject = {
                        isChase: true,
                        chaseCount: 2,
                        chaseCall: undefined
                    };
                    this.doAnimationBack(battleObject, () => {
                        syncObj.chaseCount = syncObj.chaseCount - 1;
                        if (syncObj.chaseCount == 0) {
                            syncObj.chaseCall();
                            syncObj.chaseCall = null;
                        }
                    });
                    this.playAction(othParams.roundIdx, othParams.actionIdx + 1, syncObj);
                    */
                    this.playAction(othParams.roundIdx, othParams.actionIdx + 1);
                } else if (actionInfo.comboCnt) { // 如果下一次是连击。
                    this.playAction(othParams.roundIdx, othParams.actionIdx + 1);
                } else {
                    this.doAnimationBackAll(battleObject, defenseObject, () => {
                        this.playAction(othParams.roundIdx, othParams.actionIdx + 1);
                    });
                }
            }
            // 换模型
            this.replaceModel(actionInfo.repMonsterArr);
            // 与hitBuffDatas配对，因它可能产生buff伤害等。
            this.tryPlayAllDiedAnimation(() => {
                let _syncObj:SyncObject = othParams.syncObj;
                if (_syncObj && _syncObj.isCooperate) {
                    this.doAnimationBack(battleObject, () => {
                        _syncObj.cooperateCount = _syncObj.cooperateCount - 1;
                        if (_syncObj.cooperateCount == 0) {
                            doneCall();
                        }
                    });
                } else {
                    if (isTie) {
                        this.playAction(othParams.roundIdx, othParams.actionIdx + 1);
                    } else {
                        doneCall();
                    }
                }
            })
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
     * 创建一个回合的虚拟战斗数据。
     * @param monster2Id 敌人，宠物或怪物ID
     * @param skillId 技能ID
     * @param monsterId 攻击方，如果不是自己，则填上宠物或怪物ID
     */
    public static createrBattleResultOneRound(monster2Id:string, skillId:string, monsterId?:string):battleResult {
        // 角色1
        let protoID = 0;
        let character = 0;
        let appearance = 0;
        let phase = 0;
        // 如果没有protoID则填character,phase,appearance
        if (monsterId) {
            protoID = Number(monsterId);
        } else {
            let base = GameServerData.getInstance().getPlayerFullInfo().base;
            character = base.character;
            appearance = base.appearance;
            phase = base.phase;
        }
        // 角色2
        let proto2ID = Number(monster2Id);
        // 血量
        let battleMaxHP = "1998";

        // 数据构造
        let entityAttack:entityInfo = {
            entityID: 1,
            protoID: protoID,
            battleHP: battleMaxHP,
            battleMaxHP: battleMaxHP,
            battleAnger: Number(battleMaxHP),
            battleMaxAnger: Number(battleMaxHP),
            petInfoArr: [],
            eliteInfoArr: [],
            character: character,
            appearance: appearance,
            phase: phase,
            mountType: 0,
            mountSkin: 0
        }
        let entityDefence:entityInfo = {
            entityID: 2,
            protoID: proto2ID,
            battleHP: battleMaxHP,
            battleMaxHP: battleMaxHP,
            battleAnger: Number(battleMaxHP),
            battleMaxAnger: Number(battleMaxHP),
            petInfoArr: [],
            eliteInfoArr: [],
            character: 0,
            appearance: 0,
            phase: 0,
            mountType: 0,
            mountSkin: 0
        }
        let triggerInfo:triggerInfo = {
            entityID: 1,
            petProtoID: 0,
            eliteProtoID: 0,
            pos: 0,
            targetID: 2
        }
        let skillData:skillData = {
            skillId: Number(skillId),
            beforeAddBuff: [],
            beforeHitBuff: [],
            beforeRemoveBuff: [],
            triggerInfo: triggerInfo,
            afterAddBuff: [],
            afterHitBuff: [],
            afterRemoveBuff: [],
            multiple: 0,
            addBloodInfo: undefined,
            petAddBloodInfo: undefined,
            costBloodInfo: undefined
        }
        let actionInfo:actionInfo = {
            critital: false,
            targetCounter: false,
            targetMiss: false,
            cooperateAttack: false,
            addAnger: 0,
            endAnger: 0,
            targetAddHP: battleMaxHP,
            targetEndHP: "0",
            targetAddAnger: 0,
            targetEndAnger: Number(battleMaxHP),
            targetEndMaxHP: battleMaxHP,
            comboCnt: 0,
            skillData: skillData,
            repMonsterArr: []
        }
        let roundInfo:roundInfo = {
            actionInfoArr: [actionInfo],
            startAddBuff: [],
            startHitBuff: [],
            startRemoveBuff: [],
            repMonsterArr: [],
            targetEndHP: "",
            targetEndAnger: 0,
            targetEndMaxHP: ""
        }
        let result:battleResult = {
            roundAll: 1,
            isWin: true,
            entityAttack: entityAttack,
            entityDefence: entityDefence,
            roundInfoArr: [roundInfo],
            roundInfoStr: ""
        }
        return result;
    }

    /**
     * 显示虚拟战斗数据。
     * @param battleType 战斗类型
     * @param testResShow 如果存在，则会替换战斗过程中的模型、动作、特效等
     * @param isPlayLoop 是否循环播放
     */
    public static showVirtualBattle(battleResult:battleResult, battleType:number, testResShow?:BattleTestResShow, isPlayLoop?:boolean): void {
        let resultParams:BattleResultParams = {
            battleResult: battleResult,
            bonuseString: null,
            typeInfo: {
                type: battleType,
            }
        }
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleMain, 0, {
            resultParams:resultParams,
            testResShow:testResShow,
            isPlayLoop:isPlayLoop
        });
    }
}