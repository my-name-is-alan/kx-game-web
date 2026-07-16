//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { Tween, tween } from "cc";
import { GameServerData } from "./GameServerData";
import { CustomGameBehaviour } from "../Component/CustomGameBehaviour";
import { PlatformAPI } from "./PlatformAPI";
import { GameServer } from "./GameServer";

interface ViewResI {
    resName: string;
    pkgName: string;
    comName: string;
}

export abstract class ViewLayer extends fgui.GComponent {

    private static uuid:number = 0;
    private viewUuid:number;
    private viewTTag:number;
    private viewCtor:new () => ViewLayer;
    private viewName:string;
    private viewTarg:number;
    private viewPrms:any;
    public viewResI:ViewResI;

    public constructor() {
        super();
        ViewLayer.uuid--;
        this.viewUuid = ViewLayer.uuid;
        this.viewTTag = ViewLayer.uuid - 90086;
        this.viewCtor = null;
        this.viewName = "";
        this.viewTarg = 0;
        this.viewResI = {
            resName: "",
            pkgName: "",
            comName: "",
        };
        // 是否启用刘海适配遮罩。
        if (this.getIsSafeMask()) {
            this.setupOverflow(fgui.OverflowType.Hidden);
        }
    }

    /**
     * 界面唯一ID，-1递减，负数，越小越是新创建。
     */
    public getViewUuid():number {
        return this.viewUuid;
    }

    /**
     * 界面的构造器。
     */
    public getViewCtor():new () => ViewLayer {
        return this.viewCtor;
    }

    /**
     * 界面的构造器。
     */
    public setViewCtor(viewCtor:new () => ViewLayer):void {
        this.viewCtor = viewCtor;
    }

    /**
     * 界面的class名称。
     */
    /*
    public getViewName():string {
        return this.viewName;
    }
    */

    /**
     * 界面的class名称。
     */
    /*
    public setViewName(viewName:string):void {
        this.viewName = viewName;
    }
    */

    /**
     * 界面的标记，默认值请传0。
     */
    public getViewTarg():number {
        return this.viewTarg;
    }

    /**
     * 界面的标记，默认值请传0。
     */
    public setViewTarg(viewTarg:number):void {
        this.viewTarg = viewTarg;
    }

    /**
     * 界面的传递参数。
     */
    public getViewPrms():any {
        return this.viewPrms;
    }

    /**
     * 界面的传递参数。
     */
    public setViewPrms(viewPrms:any):void {
        this.viewPrms = viewPrms;
    }

    /**
     * 默认是true，表明此界面的下层不再绘制，则visible为false以优化性能。
     */
    public getIsViewMask():boolean {
        return true;
    };

    /**
     * 默认是true，表明此界面使用遮罩适配刘海屏处不可见。
     */
    public getIsSafeMask():boolean {
        return true;
    };

    /**
     * 生成类构造函数后，用来动态生成指向UI组件。
     */
    public onConstructor(params:any):void {};

    /**
     * 创建界面并添加到stage后调用，用来传递界面参数。
     */
    public abstract onViewCreate(params:any):void;
    /**
     * 界面被push时调用，在onViewCreate（假如有）之后。
     */
    public onViewShow(params:any, isCreate:boolean):void {
        //界面打点
        if (GameServer.isGameEnter()) {
            this.setTimeout(()=>{
                PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.PAGE_STAR5S)
            }, 5000)
            this.setTimeout(()=>{
                PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.PAGE_STAR30S)
            }, 30000)
            this.setTimeout(()=>{
                PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.PAGE_STAR5M)
            }, 5*60000)
            this.setTimeout(()=>{
                PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.PAGE_STAR10M)
            }, 10*60000)
            this.setTimeout(()=>{
                PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.PAGE_STAR20M)
            }, 20*60000)
            this.setTimeout(()=>{
                PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.PAGE_STAR30M)
            }, 30*60000)
        } 
    };
    /**
     * 界面重新出现在最上层显示时调用。
     */
    public onViewShowFront():void {};
    /**
     * 当此界面在最上层，且被新界面覆盖时调用。
     */
    public onViewShowBack():void {};
    /**
     * 界面之间传递参数和手动刷新。
     */
    public onViewUpdate(params:any):void {};
    /**
     * 界面被移除之后调用。
     */
    public onViewDestroy():void {};
    /**
     * 界面重连触发调用。默认是false，true表明此界面已经处理重连逻辑。
     */
    public onViewReconnect():boolean {
        return false;
    };

    // ######################################################### Behaviour部分 #########################################################
    /**
     * 如果添加了CustomGameBehaviour，会触发此接口。
     */
    public onBehaviourOnLoad():void {};
    /**
     * 如果添加了CustomGameBehaviour，会触发此接口。
     */
    public onBehaviourStart():void {};
    /**
     * 如果添加了CustomGameBehaviour，会触发此接口。
     */
    public onBehaviourUpdate(deltaTime: number):void {};
    /**
     * 如果添加了CustomGameBehaviour，会触发此接口。
     */
    public onBehaviourLateUpdate(dt: number): void {};
    /**
     * 如果添加了CustomGameBehaviour，会触发此接口。
     */
    public onBehaviourOnEnable():void {};
    /**
     * 如果添加了CustomGameBehaviour，会触发此接口。
     */
    public onBehaviourOnDisable():void {};
    /**
     * 如果添加了CustomGameBehaviour，会触发此接口。
     */
    public onBehaviourOnDestroy():void {};

    // ######################################################### ScriptTimer部分（拷贝的相同代码，请同步修改） #########################################################
    private intervalIds:Array<number> = new Array<number>();
    private timeoutIds:Array<number> = new Array<number>();

    private clearTimerAll() {
        for (let i = 0; i < this.intervalIds.length; i++) {
            clearInterval(this.intervalIds[i]);
        }
        this.intervalIds = new Array<number>();
        for (let i = 0; i < this.timeoutIds.length; i++) {
            clearTimeout(this.timeoutIds[i]);
        }
        this.timeoutIds = new Array<number>();
    }

    /**
     * 设置定时器，指定毫秒间隔时间循环触发。
     */
    protected setInterval(callback:TimerHandler, millisecond:number):number {
        let intervalId:number = setInterval(callback, millisecond);
        this.intervalIds.push(intervalId);
        return intervalId;
    }

    /**
     * 清除定时器。
     */
    protected clearInterval(intervalId:number) {
        let hitIndex:number = -1;
        for (let i = 0; i < this.intervalIds.length; i++) {
            if (this.intervalIds[i] == intervalId) {
                hitIndex = i;
                break;
            }
        }
        if (hitIndex >= 0) {
            this.intervalIds.splice(hitIndex, 1);
            clearInterval(intervalId);
        }
    }

    /**
     * 设置超时器，指定毫秒间隔单次触发结束。
     */
    protected setTimeout(callback:Function, millisecond:number):number {
        // 中间再嵌套一层回调，结束后自动移除。
        let timeoutId:number = 0;
        let handler:TimerHandler = () => {
			this.clearTimeout(timeoutId);
            callback();
		};
        timeoutId = setTimeout(handler, millisecond);
        this.timeoutIds.push(timeoutId);
        return timeoutId;
    }

    /**
     * 清除超时器。
     */
    protected clearTimeout(timeoutId:number) {
        let hitIndex:number = -1;
        for (let i = 0; i < this.timeoutIds.length; i++) {
            if (this.timeoutIds[i] == timeoutId) {
                hitIndex = i;
                break;
            }
        }
        if (hitIndex >= 0) {
            this.timeoutIds.splice(hitIndex, 1);
            clearTimeout(timeoutId);
        }
    }

    // ######################################################### 通用接口部分 #########################################################
    /**
     * 获得fgui编辑器创建的组件。
     */
    public getUiPanel():fgui.GComponent {
        // 第一个节点是fgui编辑器创建的组件。
        return this.getChildAt(0);
    }

    /**
     * 设置Behaviour开关。
     */
    protected setViewBehaviour(bool:boolean):void {
        let com = this.node.getComponent(CustomGameBehaviour);
        if (bool) {
            if (!com) {
                com = this.node.addComponent(CustomGameBehaviour);
                com.setViewLayer(this);
            }
        } else {
            if (com) {
                com.destroy();
            }
        }
    }

    /**
     * 绑定View的Tween（界面销毁后这样才能统一销毁Tween对象）。
     */
    protected viewTween<T>(target?: T): Tween<T> {
        let tw:Tween<T> = tween(target);
        tw = tw.tag(this.viewTTag);
        return tw;
    }

    private regRequests:any = {};
    /**
     * 注册服务器事件（界面被创建时可以注册）。
     */
    protected registerRequest(callf:Function, name:string):void {
        let bool:boolean = GameServerData.getInstance().registerRequest(callf, name);
        if (bool) {
            let callbacks:Array<Function> = this.regRequests[name]
			if (!callbacks) {
                this.regRequests[name] = callbacks = new Array<Function>();
            }
			callbacks.push(callf);
        }
    }

    /**
     * 注销服务器事件（如非必要，无需注销）。
     */
    protected unregisterRequest(callf:Function, name:string):void {
        let callbacks:Array<Function> = this.regRequests[name];
        if (callbacks) {
            for (let i = 0; i < callbacks.length; i++) {
				if (callbacks[i] === callf) {
					callbacks.splice(i, 1);
                    GameServerData.getInstance().unregisterRequest(callf, name);
					break;
				}
			}
			if (callbacks.length == 0) {
				delete this.regRequests[name];
			}
        }
    }

    /**
     * 注销所有服务器事件（界面被删除时会自动执行）。
     */
    protected unregisterRequestAll():void {
        for (const name in this.regRequests) {
            let callbacks:Array<Function> = this.regRequests[name];
			for (let i = 0; i < callbacks.length; i++) {
                GameServerData.getInstance().unregisterRequest(callbacks[i], name)
            }
		}
        this.regRequests = {};
    }

    /**
     * 界面被移除之后触发，仅被ViewDispatcher调用。
     */
    public onViewDispose():void {
        this.clearTimerAll();
        Tween.stopAllByTag(this.viewTTag);
        this.unregisterRequestAll();
    }
}