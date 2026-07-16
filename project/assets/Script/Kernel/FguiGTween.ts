//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";

interface FguiGTweenProps {
    x?:number,
    y?:number,
    width?:number,
    height?:number,
    scaleX?:number,
    scaleY?:number,
    alpha?:number,
}

interface FguiGTweenOptions {
    easing?:fgui.EaseType,
}

enum FguiGTweenType {
    to,
    by,
    delay,
    call,
    repeat,
}

export class FguiGTween {
    private queue:Array<any>;
    private actIndex:number;
    private tweeners:Array<fgui.GTweener>;
    private target:fgui.GObject;
    private timeScale:number;

    private constructor(target:fgui.GObject) {
        this.queue = new Array<any>();
        this.actIndex = 0;
        this.target = target;
        this.timeScale = 1;
    }

    public static new(target:fgui.GObject):FguiGTween {
        return new FguiGTween(target);
    }

    public kill():FguiGTween {
        this.killActions(true);
        return this;
    }

    private killActions(isForce?:boolean):FguiGTween {
        if (this.tweeners) {
            if (isForce) {
                // 结束了自己会标记kill，不需要手动kill，这里反而触发了频繁setTimeScale时GTween错乱。
                for (let i = 0; i < this.tweeners.length; i++) {
                    // this.tweeners[i].kill(false);
                    fgui.GTween.kill(this.tweeners[i].target, false); // 一样的。
                }
            }
            this.tweeners = null;
        }
        return this;
    }

    public setTimeScale(scale:number):FguiGTween {
        this.timeScale = scale;
        if (this.tweeners) {
            for (let i = 0; i < this.tweeners.length; i++) {
                this.tweeners[i].setTimeScale(this.timeScale);
            }
        }
        return this;
    }

    public to(duration:number, dst:FguiGTweenProps, option?:FguiGTweenOptions):FguiGTween {
        this.queue.push({
            type:FguiGTweenType.to,
            duration:duration,
            dst:dst,
            option:option,
        })
        return this;
    }

    public by(duration:number, dst:FguiGTweenProps, option?:FguiGTweenOptions):FguiGTween {
        this.queue.push({
            type:FguiGTweenType.by,
            duration:duration,
            dst:dst,
            option:option,
        })
        return this;
    }

    public delay(duration:number):FguiGTween {
        this.queue.push({
            type:FguiGTweenType.delay,
            duration:duration,
        })
        return this;
    }

    public call(func:Function):FguiGTween {
        this.queue.push({
            type:FguiGTweenType.call,
            func:func,
        })
        return this;
    }

    public repeat():FguiGTween {
        this.queue.push({
            type:FguiGTweenType.repeat,
        })
        return this;
    }

    private doAction():void {
        if (this.actIndex < this.queue.length) {
            let atcion:any = this.queue[this.actIndex];
            if (atcion.type == FguiGTweenType.to || atcion.type == FguiGTweenType.by) {
                let propNames:Array<string> = new Array<string>();
                for (let key in atcion.dst) {
                    propNames.push(key);
                }
                let counter = propNames.length;
                let complete = () => {
                    counter--;
                    if (counter == 0) {
                        this.killActions();
                        this.actIndex++;
                        this.doAction();
                    }
                }
                for (let i = 0; i < propNames.length; i++) {
                    let propName:string = propNames[i];
                    let val:number = atcion.dst[propName];
                    if (atcion.type == FguiGTweenType.by) {
                        val = this.target[propName] + val;
                    }
                    let option:FguiGTweenOptions = atcion.option;
                    let easing:fgui.EaseType = fgui.EaseType.Linear;
                    if (option && option.easing) {
                        easing = option.easing;
                    }
                    this.tweeners = new Array<fgui.GTweener>();
                    this.tweeners.push(fgui.GTween.to(this.target[propName], val, atcion.duration)
                    .setEase(easing)
                    .setTimeScale(this.timeScale)
                    .onComplete(complete)
                    .setTarget(this.target, propName));
                }
            } else if (atcion.type == FguiGTweenType.delay) {
                this.tweeners = new Array<fgui.GTweener>();
                this.tweeners.push(fgui.GTween.delayedCall(atcion.duration).onComplete(() => {
                    this.killActions();
                    this.actIndex++;
                    this.doAction();
                }).setTarget(this.target));
            } else if (atcion.type == FguiGTweenType.call) {
                atcion.func(this);
                this.actIndex++;
                this.doAction();
            } else if (atcion.type == FguiGTweenType.repeat) {
                this.actIndex = 0;
                this.doAction();
            }
        }
    }

    public start():FguiGTween {
        this.actIndex = 0;
        this.doAction();
        return this;
    }
}