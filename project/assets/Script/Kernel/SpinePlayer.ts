//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { Color, Vec2, sp } from "cc";
import * as fgui from "fairygui-cc";
import { PlatformAPI } from "./PlatformAPI";
import { LocaleData, ModelShowInfo } from "./LocaleData";
import { UtilsUI } from "./UtilsUI";
import { VarVal } from "../Values/VarVal";

export interface SpineTrackCall {
    name: string;
    isLoop: boolean; // 是否循环？
    eventCall: Function; // 动画事件回调。
    completeCall: Function; // 动画完成回调。
    isBreakCallComplete: boolean; // 此动作被打断时是否完成回调。
}

export class SpinePlayer {
    private spineSke:sp.Skeleton; // 动画实例。
    private loader_spine:fgui.GLoader3D; // 角色Spine装载器。
    private last_spine_name:string; // 角色Spine当前模型名称。
    private trackCalls:Array<SpineTrackCall>; // 多轨道回调集合在一起。
    private TRACK_MAX:number = 5; // 最大轨道数量。
    private TRACK_OFF:number = 2; // 轨道偏移。
    private isDisposed:boolean;

    public constructor() {
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
        this.isDisposed = false;
    }

    public getLastSpineName(): string {
        return this.last_spine_name;
    }

    public setTimeScale(scale:number): void {
        if (this.spineSke) {
            this.spineSke.timeScale = scale;
        }
    }

    public setGray(isGray:boolean): void {
        if (this.spineSke) {
            if (isGray) {
                this.spineSke.color = new Color(128, 128, 128);
            } else {
                this.spineSke.color = new Color(255, 255, 255);
            }
        }
    }

    public setEventListener(callback:any): void {
        if (this.spineSke) {
            this.spineSke.setEventListener(callback);
        }
    }

    public getSpineSke() {
        if (this.spineSke) {
            return this.spineSke
        } 
    }

    public setSkeInerFlipX(bool:boolean) {
        if (this.spineSke) {
            if ((bool && this.spineSke._skeleton.scaleX > 0) || (!bool && this.spineSke._skeleton.scaleX < 0)) {
                this.spineSke._skeleton.scaleX = 0 - this.spineSke._skeleton.scaleX;
            }
            /* // 也行，但是会被外部设置scale影响
            if ((bool && this.loader_spine.scaleX > 0) || (!bool && this.loader_spine.scaleX < 0)) {
                this.loader_spine.scaleX = 0 - this.loader_spine.scaleX;
            }
            */
        } 
    }

    /**
     * 异步加载动画。
     */
    public loadSpine(doneCall:Function, loader_spine:fgui.GLoader3D, spname:string): SpinePlayer { // 如果需要缩放，在loader3D里改。
        PlatformAPI.loadSpine((asset:any)=> {
            if (loader_spine && !loader_spine.isDisposed && !this.isDisposed) {
                if (this.last_spine_name != spname) {
                this.loader_spine = loader_spine;
                this.last_spine_name = spname;
                // 底居中
                loader_spine.setSpine(asset, new Vec2(0.5, 1), false);
                this.spineSke = <sp.Skeleton>loader_spine.content;
                // 皮肤
                // this.spineSke.setSkin("1");
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
                let aniName:string;
                if (this.spineSke.findAnimation(VarVal.SPINE_ANI_NAME.stand)) {
                    aniName = VarVal.SPINE_ANI_NAME.stand;
                } else {
                    aniName = this.spineSke._skeleton.data.animations[0].name;
                }
                this.playAnimation(aniName, true);
                if (this.spineSke.findAnimation(VarVal.SPINE_ANI_NAME.attach_stand)) {
                    this.playAnimation(VarVal.SPINE_ANI_NAME.attach_stand, true, -1);
                }
                }
                if (doneCall) {doneCall(this);}
            } else {
                this.disposePlayer();
            }
        }, spname)
        return this;
    }

    /**
     * 清空所有动画。
     */
    public clearTracks(): void {
        if (this.spineSke) {
            this.spineSke.clearTracks();
        }
    }

    /**
     * 异步加载动画。
     */
    public loadSpineByModelId(doneCall:Function, loader_spine:fgui.GLoader3D, modelId:string | ModelShowInfo): SpinePlayer { // 如果需要缩放，在loader3D里改。
        let modelShowInfo:ModelShowInfo = LocaleData.getModelShowInfo(modelId);
        return this.loadSpine(doneCall, loader_spine, modelShowInfo.spine);
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
                if (this.spineSke.findAnimation(VarVal.SPINE_ANI_NAME.stand)) {
                    aniName = VarVal.SPINE_ANI_NAME.stand;
                } else {
                    aniName = this.spineSke._skeleton.data.animations[0].name;
                }
            }
            if (trackCall) {
                trackCall.name = aniName;
                trackCall.isLoop = isLoop;
                trackCall.eventCall = eventCall;
                trackCall.completeCall = completeCall;
                trackCall.isBreakCallComplete = isCompleteBreakCall;
            }
            this.spineSke.setAnimation(trackIndex, aniName, isLoop);
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
     * 仅清空spine。
     */
    public clearPlayer():void {
        if (!this.isDisposed) {
            if (this.loader_spine) {
                this.spineSke = null;
                this.last_spine_name = null;
                if (!this.loader_spine.isDisposed) {
                    this.loader_spine.freeSpine();
                }
            }
        }
    }

    /**
     * 释放对象SpinePlayer且不再使用。
     */
    public disposePlayer():void {
        if (!this.isDisposed) {
            this.isDisposed = true;
            if (this.loader_spine) {
                this.spineSke = null;
                this.last_spine_name = null;
                if (!this.loader_spine.isDisposed) {
                    this.loader_spine.freeSpine();
                }
                this.loader_spine = null;
            }
        }
    }
}

export class SpineRoldMountPlayer {
    private mountPlayer:SpinePlayer;
    private rolePlayer:SpinePlayer;
    private loader_spine_mount:fgui.GLoader3D;
    private loader_spine_role:fgui.GLoader3D;
    private mountShowInfo:ModelShowInfo;
    private roleShowInfo:ModelShowInfo;

    public constructor(group_spine_ram:fgui.GComponent) {
        this.loader_spine_mount = group_spine_ram.getChild("loader_spine_mount", fgui.GLoader3D);
        this.loader_spine_role = group_spine_ram.getChild("loader_spine_role", fgui.GLoader3D);
    }

    public getRolePlayer(): SpinePlayer {
        return this.rolePlayer;
    }

    /**
     * 加载坐骑动画（当动画相同时则忽略）。
     */
    public loadSpineMount(modelId:string | ModelShowInfo, doneCall?: Function): SpineRoldMountPlayer {
        if (modelId) {
            let modelShowInfo = LocaleData.getModelShowInfo(modelId);
            if (!this.mountPlayer) {
                this.mountPlayer = new SpinePlayer();
            }
            if (this.mountPlayer.getLastSpineName() != modelShowInfo.spine) {
                this.mountPlayer.loadSpine((spp: SpinePlayer) => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                    this.mountShowInfo = modelShowInfo;
                    this.updateMountPos();
                    if (doneCall) {
                        doneCall(this);
                    }
                }, this.loader_spine_mount, modelShowInfo.spine);
            }
        } else {
            if (this.mountPlayer) {
                this.mountPlayer.clearPlayer();
            }
            this.mountShowInfo = undefined;
            if (doneCall) {
                doneCall(this);
            }
        }
        return this;
    }

    /**
     * 加载角色动画（当动画相同时则忽略）。
     */
    public loadSpineRole(modelId:string | ModelShowInfo, doneCall?: Function): SpineRoldMountPlayer {
        if (modelId) {
            let modelShowInfo = LocaleData.getModelShowInfo(modelId);
            if (!this.rolePlayer) {
                this.rolePlayer = new SpinePlayer();
            }
            if (this.rolePlayer.getLastSpineName() != modelShowInfo.spine) {
                this.rolePlayer.loadSpine((spp: SpinePlayer) => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                    this.roleShowInfo = modelShowInfo;
                    this.updateMountPos();
                    if (doneCall) {
                        doneCall(this);
                    }
                }, this.loader_spine_role, modelShowInfo.spine);
            }
        } else {
            if (this.rolePlayer) {
                this.rolePlayer.clearPlayer();
            }
            this.roleShowInfo = undefined;
            if (doneCall) {
                doneCall(this);
            }
        }
        return this;
    }

    /**
     * 加载角色动画（当动画相同时则忽略）。
     */
    public loadSpineRoleByName(spine:string, doneCall:Function): SpineRoldMountPlayer {
        if (!this.rolePlayer) {
            this.rolePlayer = new SpinePlayer();
        }
        if (this.rolePlayer.getLastSpineName() != spine) {
            this.rolePlayer.loadSpine((spp: SpinePlayer) => {
                this.roleShowInfo = <any>spine;
                this.updateMountPos();
                if (doneCall) {
                    doneCall(this);
                }
            }, this.loader_spine_role, spine);
        } else {
            if (doneCall) {
                doneCall(this);
            }
        }
        return this;
    }

    private updateMountPos(): void {
        if (this.roleShowInfo && this.mountShowInfo) {
            let localPos = UtilsUI.getSkeAniBonePos(this.loader_spine_role, this.mountShowInfo.point);
            this.loader_spine_mount.setPosition(0 - localPos.x, 0 - localPos.y);
        }
    }
}