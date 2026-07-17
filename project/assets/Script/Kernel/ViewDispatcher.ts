//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "./ViewLayer";
import { PlatformAPI } from "./PlatformAPI";
import { LyMainPage } from "../Views/LyMainPage";
import { LyLogo } from "../Views/LyLogo";
import { GameServerData } from "./GameServerData";
import { GuideManager } from "./GuideManager";
import { director, sp, sys } from "cc";
import { VarFunc } from "../Values/VarFunc";

/*
关于viewTarg的说明：
关于单例界面，同一时刻只存在一个同类型界面。
关于多例界面，同一时刻可存在多个同类型界面。
界面设计的时候应该考虑是否单例，viewTarg自行斟酌，默认请传0。
*/

interface ViewLoadCalls {
    isIgnoreQueue?: boolean; // 立即执行，不等待队列。
}

export class ViewDispatcher {
    private constructor () {}

    private static backCtn:fgui.GComponent;
    private static viewCtn:fgui.GComponent;
    private static notiCtn:fgui.GComponent;

    private static envQueue:Array<any> = new Array<any>();

    /**
     * 设置初始化，并创建view层。
     */
    public static init() {
        // 每个场景都需要有一个GRoot，这是UI的根节点。场景载入后，需要手动创建GRoot
        fgui.GRoot.create();
        // fgui.GRoot.inst.node.addComponent(SafeArea).updateArea(); 不行，看GRoot源码至少xy不会变。

        // 分上中下层
        ViewDispatcher.backCtn = new fgui.GComponent();
        ViewDispatcher.viewCtn = new fgui.GComponent();
        ViewDispatcher.notiCtn = new fgui.GComponent();
        ViewDispatcher.addViewParent(fgui.GRoot.inst, ViewDispatcher.backCtn);
        ViewDispatcher.addViewParent(fgui.GRoot.inst, ViewDispatcher.viewCtn);
        ViewDispatcher.addViewParent(fgui.GRoot.inst, ViewDispatcher.notiCtn);

        // 启动页
        PlatformAPI.loadUiPackage((err:any, isDone:boolean) => {
            if (isDone) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyLogo, 0, null);
                let SplashSprite = director.getScene().getChildByName('Canvas').getChildByName('SplashSprite');
                if (SplashSprite) {
                    SplashSprite.destroy();
                }
            } else {
                // 重新加载？
                console.warn("预加载资源失败->", LyLogo.resName);
            }
        }, LyLogo.resName, false);
    }

    /**
     * 添加为父节点并设置子节点宽高。
     */
    private static addViewParent(root:fgui.GComponent, container:fgui.GComponent):void {
        root.addChild(container);
        // if (container.id == ViewDispatcher.backCtn.id) {
        if (false) {
            container.setSize(root.width, root.height);
        } else {
            let safeRect = sys.getSafeAreaRect();
            let safeX:number = safeRect.x;
            let safeY:number = safeRect.y;
            let safeWidth:number = safeRect.width;
            let safeHeight:number = safeRect.height;
            if (safeRect.y > 0) {
                safeY = root.height - safeRect.y - safeRect.height;
                let devY = Math.floor(safeY * 0.3);
                safeY -= devY;
                safeHeight = Math.floor(devY + safeRect.height + safeRect.y * 0.65);
                if (safeY < 0) {
                    safeY = 0;
                }
                if (safeY + safeHeight > root.height) {
                    safeHeight = root.height - safeY;
                }
            }
            if (safeWidth / safeHeight > 9 / 16) { // 适配iPad，此处不能直接设置safeWidth它是固定值750跟设计分辨率一致。
                let dstWidth = safeHeight / 16 * 9; // 修正后的宽度
                safeX = Math.floor((root.width - dstWidth) * 0.5);
                safeHeight = Math.floor(safeWidth / dstWidth * safeHeight); // 由于不能直接设置safeWidth，换个方式先增加同比例高度，再缩放。
                container.scaleX = container.scaleY = dstWidth / safeWidth;
            }
            container.setPosition(safeX, safeY);
            container.setSize(safeWidth, safeHeight);
        }
    }

    /**
     * 添加显示节点并设置节点宽高。
     */
    private static addViewChild(container:fgui.GComponent, child:ViewLayer, idx:number):boolean {
        // 检查显示节点
        let displayObject:fgui.GComponent;
        try {
            displayObject = fgui.UIPackage.createObject(child.viewResI.pkgName, child.viewResI.comName).asCom;
        } catch (error) {
            PlatformAPI.postGameError(error.stack);
            return false;
        }
        container.addChildAt(child, idx);
        child.setSize(container.width, container.height);
        // 添加显示节点
        child.addChild(displayObject);
        displayObject.setSize(child.width, child.height);
        // displayObject.sortingOrder = ?; // 根据cococ显示节点树的前后顺序规则，不需要再设置。
        
        return true;
    }

    /**
     * 获得初始化view层。
     */
    public static getViewContainer():fgui.GComponent {
        return ViewDispatcher.viewCtn;
    }

    /**
     * 获得初始化noti层。
     */
    public static getNotiContainer():fgui.GComponent {
        return ViewDispatcher.notiCtn;
    }

    /**
     * 获得view层的最上层。
     */
    public static getViewTop():ViewLayer {
        if (ViewDispatcher.viewCtn.numChildren > 0) {
            return <ViewLayer>ViewDispatcher.viewCtn.getChildAt(ViewDispatcher.viewCtn.numChildren - 1);
        }
    }

    /**
     * 是否view层的最上层。
     */
    public static isViewTop(viewCtor: new () => ViewLayer):boolean {
        if (ViewDispatcher.viewCtn.numChildren > 0) {
            let child:ViewLayer = <ViewLayer>ViewDispatcher.viewCtn.getChildAt(ViewDispatcher.viewCtn.numChildren - 1);
            if (child.getViewCtor() == viewCtor) {
                return true;
            }
        }
        return false;
    }

    /**
     * 当前view是否存在。
     */
    public static isViewExist(viewCtor: new () => ViewLayer):ViewLayer {
        let container = ViewDispatcher.viewCtn;
        for (let i:number = container.numChildren - 1; i >= 0; i--) {
            let child:ViewLayer = <ViewLayer>container.getChildAt(i);
            if (child.getViewCtor() == viewCtor) {
                return child;
            }
        }
    }

    /**
     * 重置遮挡关系，尽可能优化绘制性能。
     */
    private static setViewMask(container:fgui.GComponent):void {
        let isMask:boolean = false;
        for (let i:number = container.numChildren - 1; i >= 0; i--) {
            let child:ViewLayer = <ViewLayer>container.getChildAt(i);
            if (isMask) {
                child.visible = false;
            }
            else {
                child.visible = true;
                if (child.getIsViewMask()) {
                    isMask = true;
                }
            }
        }
    }

    /**
     * 界面优先级，数字越大越是在上层，具体数值定义在VarVal中。
     */
    private static getViewPriority(viewCtor: new () => ViewLayer):number {
        return VarFunc.getViewPriority(viewCtor);
    }

    /**
     * 安全调用。
     */
    private static doViewCreate(viewLayer:ViewLayer, params:any):boolean {
        try {
            viewLayer.onViewCreate(params);
        } catch (error) {
            PlatformAPI.postGameError(error.stack);
            return false;
        }
        return true;
    }

    /**
     * 安全调用。
     */
    private static doViewShow(viewLayer:ViewLayer, params:any, isCreate: boolean):boolean {
        try {
            viewLayer.onViewShow(params, isCreate);
        } catch (error) {
            PlatformAPI.postGameError(error.stack);
            return false;
        }
        return true;
    }

    /**
     * 安全调用。
     */
    private static doViewShowFront(viewLayer:ViewLayer):boolean {
        try {
            viewLayer.onViewShowFront();
            if (viewLayer.parent === ViewDispatcher.viewCtn) { // 最上层页面触发调度。
                GuideManager.triggerGuide(null);
            }
        } catch (error) {
            PlatformAPI.postGameError(error.stack);
            return false;
        }
        return true;
    }

    /**
     * 安全调用。
     */
    private static doViewShowBack(viewLayer:ViewLayer):boolean {
        try {
            viewLayer.onViewShowBack();
        } catch (error) {
            PlatformAPI.postGameError(error.stack);
            return false;
        }
        return true;
    }

    /**
     * 安全调用。
     */
    private static doViewUpdate(viewLayer:ViewLayer, params:any):boolean {
        try {
            viewLayer.onViewUpdate(params);
        } catch (error) {
            PlatformAPI.postGameError(error.stack);
            return false;
        }
        return true;
    }

    /**
     * 安全调用。
     */
    private static doViewDestroy(viewLayer:ViewLayer):boolean {
        try {
            viewLayer.onViewDispose();
            viewLayer.onViewDestroy();
        } catch (error) {
            PlatformAPI.postGameError(error.stack);
            return false;
        }
        return true;
    }

    private static viewCollectFguiTexUsedEx(obj:fgui.GObject, ref:any, refSpine:any):void {
        if (obj instanceof fgui.GImage) {
            if (ref) {
                ref[obj.packageItem.file] = true;
            }
        } else if (obj instanceof fgui.GLoader) {
            if (obj._contentItem && ref) {
                ref[obj._contentItem.file] = true;
            }
        } else if (obj instanceof fgui.GTextField) {
            if (obj.font && ref) {
                let pi = fgui.UIPackage.getItemByURL(obj.font);
                if (pi) {
                    ref[pi.file] = true;
                }
            }
        } else if (obj instanceof fgui.GLoader3D) {
            if (obj.content && refSpine) {
                let skeletonData = (<sp.Skeleton>obj.content).skeletonData;
                refSpine[skeletonData.uuid] = skeletonData;
            }
        } else if (obj instanceof fgui.GList) { // 对象池里会隐藏。
            ViewDispatcher.viewCollectFguiTexUsed(obj, ref, refSpine);
            obj.itemPool.scanAll((poolObj:fgui.GObject) => {
                ViewDispatcher.viewCollectFguiTexUsedEx(poolObj, ref, refSpine);
            });
        } else if (obj instanceof fgui.GComponent) {
            ViewDispatcher.viewCollectFguiTexUsed(obj, ref, refSpine);
        }
    }

    /**
     * 获得当前正在使用的Texture2D资源列表。
     */
    public static viewCollectFguiTexUsed(container:fgui.GComponent, ref:any, refSpine:any):void {
        for (let i = 0; i < container.numChildren; i++) {
            ViewDispatcher.viewCollectFguiTexUsedEx(container.getChildAt(i), ref, refSpine);
        }
    }

    private static viewRecreateFguiGObjectEx(obj:fgui.GObject, pi:fgui.PackageItem | string):void {
            if (obj instanceof fgui.GImage) {
                /*
                if (obj.packageItem === pi) {
                    // obj._content.spriteFrame.texture = tex; // 更换Texture2D并不能更新渲染，需要刷新SpriteFrame
                    obj.reloadContentSpriteFrame();
                }
                */
            } else if (obj instanceof fgui.GLoader) {
                /*
                if (obj._contentItem && obj._contentItem === pi) {
                    obj.reloadContent();
                }
                */
            } else if (obj instanceof fgui.GTextField) {
                if (pi instanceof fgui.PackageItem) {
                    if (obj._label && obj._label.font === pi.asset) {
                        obj._label.updateRenderData(true);
                    }
                } else {
                    if (obj._label && obj.font == pi) {
                        // 通过 FairyGUI 自己的 setter 重新解析已注册字体，兼容未导出 getFontByName 的运行库。
                        let fontName = obj.font;
                        obj.font = null;
                        obj.font = fontName;
                        obj._label.updateRenderData(true);
                    }
                }
            } else if (obj instanceof fgui.GList) { // 对象池里会隐藏。
                ViewDispatcher.viewRecreateFguiGObject(obj, pi);
                obj.itemPool.scanAll((poolObj:fgui.GObject) => {
                    ViewDispatcher.viewRecreateFguiGObjectEx(poolObj, pi);
                });
            } else if (obj instanceof fgui.GComponent) {
                ViewDispatcher.viewRecreateFguiGObject(obj, pi);
            }
    }

    /**
     * 刷新动态资源显示。
     */
    public static viewRecreateFguiGObject(container:fgui.GComponent, pi:fgui.PackageItem | string):void {
        for (let i = 0; i < container.numChildren; i++) {
            ViewDispatcher.viewRecreateFguiGObjectEx(container.getChildAt(i), pi);
        }
    }

    /**
     * 生成一个界面。
     */
    private static newViewLayer(viewCtor: new () => ViewLayer, viewTarg:number, params:any):ViewLayer {
        let newChild:ViewLayer = new viewCtor();
        newChild.setViewCtor(viewCtor);
        // newChild.setViewName(viewCtor.name); // viewCtor.name在小游戏中会变得无规律。
        newChild.setViewTarg(viewTarg);
        // newChild.setViewPrms(params); // 暂时没用到，防止垃圾回收延迟。
        newChild.onConstructor(params);
        return newChild;
    }

    /**
     * 压入一个界面，若已存在相同类型的界面则忽略，单例应使用此接口。
     */
    private static viewPush(container:fgui.GComponent, loadCalls:ViewLoadCalls, viewCtor: new () => ViewLayer, viewTarg:number, params:any):void {
        let hitChild:ViewLayer = null;
        for (let i:number = container.numChildren - 1; i >= 0; i--) {
            let child:ViewLayer = <ViewLayer>container.getChildAt(i);
            if (child.getViewCtor() == viewCtor) {
                hitChild = child;
                break;
            }
        }
        if (hitChild == null) {
            ViewDispatcher.viewPushMulti(container, loadCalls, viewCtor, viewTarg, params);
        }
        else {
            let toIndex:number = 0;// 一定在本优先级最上面。
            for (let i:number = container.numChildren - 1; i >= 0; i--) {
                let child:ViewLayer = <ViewLayer>container.getChildAt(i);
                if (ViewDispatcher.getViewPriority(viewCtor/*hitChild.getViewName()*/) >= ViewDispatcher.getViewPriority(child.getViewCtor())) {
                    toIndex = i;
                    break;
                }
            }
            let currIndex:number = container.getChildIndex(hitChild);
            if (toIndex != currIndex) { // 若目标与原位置不同。
                container.setChildIndex(hitChild, toIndex);
                ViewDispatcher.setViewMask(container);
            }
            ViewDispatcher.doViewShow(hitChild, params, false);
            if (toIndex != currIndex && toIndex == container.numChildren - 1) { // 原位置不在本优先级最上面，现已移至本优先级最上面，且现为栈顶。
                ViewDispatcher.doViewShowFront(hitChild);
                if (toIndex > 0) { // 确保底部存在界面，其实这个一定成立不需要判断。
                    let child:ViewLayer = <ViewLayer>container.getChildAt(toIndex - 1);
                    ViewDispatcher.doViewShowBack(child);
                }
            }
        }
    }

    /**
     * 压入一个界面，可以压入多个相同类型的界面。
     */
    private static viewPushMulti(container:fgui.GComponent, loadCalls:ViewLoadCalls, viewCtor: new () => ViewLayer, viewTarg:number, params:any):void {
        let newChild:ViewLayer = ViewDispatcher.newViewLayer(viewCtor, viewTarg, params);
        let addIndex:number = 0;
        for (let i:number = container.numChildren - 1; i >= 0; i--) {
            let child:ViewLayer = <ViewLayer>container.getChildAt(i);
            if (ViewDispatcher.getViewPriority(viewCtor/*newChild.getViewName()*/) >= ViewDispatcher.getViewPriority(child.getViewCtor())) {
                addIndex = i + 1;
                break;
            }
        }
        if (!ViewDispatcher.addViewChild(container, newChild, addIndex)) {
            return; // 继续执行已经没有意义。
        }
        if (!ViewDispatcher.doViewCreate(newChild, params)) {
            container.removeChild(newChild, true);
            return; // 继续执行已经没有意义。
        }
        if (container.numChildren > 1) { // 优化一下，2个及以上才刷新，当然可以去掉判断直接刷新。
            ViewDispatcher.setViewMask(container);
        }
        ViewDispatcher.doViewShow(newChild, params, false);
        if (addIndex == container.numChildren - 1) { // 确保添加在最上层。
            ViewDispatcher.doViewShowFront(newChild);
            if (addIndex > 0) { // 确保底部存在界面。
                let child:ViewLayer = <ViewLayer>container.getChildAt(addIndex - 1);
                ViewDispatcher.doViewShowBack(child);
            }
        }
        /*
        PlatformAPI.loadUiPackageAtlas(newChild.viewResI.resName, (fname:string) => {
            ViewDispatcher.viewRecreateFguiGObject(container.parent, fname);
        });
        */
    }

    /**
     * 清除界面直到遇到viewName停止。
     */
    private static viewPopUntil(container:fgui.GComponent, viewCtor: new () => ViewLayer, viewTarg:number, params:any):void {
        let hitIndex:number = -1;
        for (let i:number = container.numChildren - 1; i >= 0; i--) {
            let child:ViewLayer = <ViewLayer>container.getChildAt(i);
            if (child.getViewCtor() == viewCtor) { // 暂时不分 viewTarg > 0 || viewTarg == 0 || viewTarg < 0，感觉上也没有什么用处。
                hitIndex = i;
                break;
            }
        }
        let isRemoved:boolean = false;
        if (hitIndex > -1 && container.numChildren - 1 != hitIndex) { // 如果显示列表中存在，并且不在最上层。
            for (let i:number = container.numChildren - 1; i >= 0; i--) {
                let child:ViewLayer = <ViewLayer>container.getChildAt(i);
                if (child.getViewCtor() == viewCtor) {
                    break;
                }
                else {
                    container.removeChild(child);
                    isRemoved = true;
                }
            }
        }
        if (isRemoved) { // 如果有移除必然存在2个以上界面，topChild 为 viewName。
            ViewDispatcher.setViewMask(container);
            let topChild:ViewLayer = <ViewLayer>container.getChildAt(container.numChildren - 1);
            ViewDispatcher.doViewShowFront(topChild);
        }
    }

    /**
     * 清除（优先级 >= priority）界面。
     */
    private static viewPopWithPriority(container:fgui.GComponent, priority:number):boolean {
        let isRemoved:boolean = false;
        for (let i:number = container.numChildren - 1; i >= 0; i--) {
            let child:ViewLayer = <ViewLayer>container.getChildAt(i);
            if (ViewDispatcher.getViewPriority(child.getViewCtor()) >= priority) {
                container.removeChild(child);
                isRemoved = true;
            }
            else {
                break;
            }
        }
        return isRemoved;
    }

    /**
     * 清除（优先级 > viewName优先级）界面。
     */
    private static viewPopTo(container:fgui.GComponent, viewCtor: new () => ViewLayer, viewTarg:number, params:any):void {
        let isRemoved:boolean = ViewDispatcher.viewPopWithPriority(container, ViewDispatcher.getViewPriority(viewCtor) + 1);
        if (isRemoved && container.numChildren > 0) { // 有删除后并且还存在界面则刷新。
            ViewDispatcher.setViewMask(container);
            let topChild:ViewLayer = <ViewLayer>container.getChildAt(container.numChildren - 1);
            ViewDispatcher.doViewShowFront(topChild);
        }
    }

    /**
     * 清除（优先级 >= viewName优先级）界面。
     */
    private static viewPopWith(container:fgui.GComponent, viewCtor: new () => ViewLayer, viewTarg:number, params:any):void {
        let isRemoved:boolean = ViewDispatcher.viewPopWithPriority(container, ViewDispatcher.getViewPriority(viewCtor));
        if (isRemoved && container.numChildren > 0) { // 有删除后并且还存在界面则刷新。
            ViewDispatcher.setViewMask(container);
            let topChild:ViewLayer = <ViewLayer>container.getChildAt(container.numChildren - 1);
            ViewDispatcher.doViewShowFront(topChild);
        }
    }

    /**
     * 手动刷新函数。
     * viewTarg < 0 是刷新指定界面。
     * viewTarg == 0 是刷新所有viewName的界面。
     * viewName > 0 是刷新具有指定viewTarg的viewName的界面。
     */
    private static viewUpdate(container:fgui.GComponent, viewCtor: new () => ViewLayer, viewTarg:number, params:any):void {
        // 可以改为正向遍历。
        if (viewTarg < 0) { // 指定uuid的对象，通过这些接口可防止操作已移除于stage的对象。
            for (let i:number = container.numChildren - 1; i >= 0; i--) {
                let child:ViewLayer = <ViewLayer>container.getChildAt(i);
                if (child.getViewUuid() == viewTarg) {
                    ViewDispatcher.doViewUpdate(child, params);
                    break;
                }
            }
        }
        else if (viewTarg == 0) {
            for (let i:number = container.numChildren - 1; i >= 0; i--) {
                let child:ViewLayer = <ViewLayer>container.getChildAt(i);
                if (child.getViewCtor() == viewCtor) {
                    ViewDispatcher.doViewUpdate(child, params);
                }
            }
        }
        else {
            for (let i:number = container.numChildren - 1; i >= 0; i--) {
                let child:ViewLayer = <ViewLayer>container.getChildAt(i);
                if (child.getViewCtor() == viewCtor && child.getViewTarg() == viewTarg) {
                    ViewDispatcher.doViewUpdate(child, params);
                }
            }
        }
    }

    /**
     * 设置移除界面具体操作。
     */
    private static doDestroyView(child:ViewLayer):void {
        let container:fgui.GComponent = child.parent;
        let removeIndex:number = container.getChildIndex(child);
        container.removeChild(child, true);
        ViewDispatcher.doViewDestroy(child);
        if (removeIndex > 0) { // 优化一下，不是0被删除才刷新，当然可以去掉判断直接刷新。
            ViewDispatcher.setViewMask(container);
        }
        if (container.numChildren == removeIndex && removeIndex > 0) { // 是否最上层被删除，并且不是0被删除。
            let topChild:ViewLayer = <ViewLayer>container.getChildAt(removeIndex - 1);
            ViewDispatcher.doViewShowFront(topChild);
        }
    }

    /**
     * 移除一个界面。
     * viewTarg < 0 是删除指定界面。
     * viewTarg == 0 是删除所有viewName的界面。
     * viewName > 0 是删除具有指定viewTarg的viewName的界面。
     */
    private static viewDestroy(container:fgui.GComponent, viewCtor: new () => ViewLayer, viewTarg:number, params:any):void {
        if (viewTarg < 0) { // 指定uuid的对象，通过这些接口可防止操作已移除于stage的对象。
            for (let i:number = container.numChildren - 1; i >= 0; i--) {
                let child:ViewLayer = <ViewLayer>container.getChildAt(i);
                if (child.getViewUuid() == viewTarg) {
                    ViewDispatcher.doDestroyView(child);
                    break;
                }
            }
        }
        else if (viewTarg == 0) {
            for (let i:number = container.numChildren - 1; i >= 0; i--) {
                let child:ViewLayer = <ViewLayer>container.getChildAt(i);
                if (child.getViewCtor() == viewCtor) {
                    ViewDispatcher.doDestroyView(child);
                }
            }
        }
        else {
            for (let i:number = container.numChildren - 1; i >= 0; i--) {
                let child:ViewLayer = <ViewLayer>container.getChildAt(i);
                if (child.getViewCtor() == viewCtor && child.getViewTarg() == viewTarg) {
                    ViewDispatcher.doDestroyView(child);
                }
            }
        }
    }

    /**
     * 清除容器。
     */
    public static viewClearAll(container:fgui.GComponent, viewCtor: new () => ViewLayer, viewTarg:number, params:any):void {
        for (let i:number = container.numChildren - 1; i >= 0; i--) {
            let child:ViewLayer = <ViewLayer>container.getChildAt(i);
            ViewDispatcher.doDestroyView(child);
        }
    }

    /**
     * 清除容器至指定viewCtor。
     */
    public static viewClearTo(container:fgui.GComponent, viewCtor: new () => ViewLayer, viewTarg:number, params:any):void {
        for (let i:number = container.numChildren - 1; i >= 0; i--) {
            let child:ViewLayer = <ViewLayer>container.getChildAt(i);
            if (child.getViewCtor() == viewCtor) {
                break;
            } else {
                ViewDispatcher.doDestroyView(child);
            }
        }
    }

    private static doViewCtnReconnect(container:fgui.GComponent):void {
        for (let i:number = 0; i < container.numChildren; i++) {
            let child:ViewLayer = <ViewLayer>container.getChildAt(i);
            child.onViewReconnect();
        }
    }

    /**
     * 重连调用。
     */
    public static doViewReconnect():void {
        ViewDispatcher.doViewCtnReconnect(ViewDispatcher.viewCtn);
        if (true) {
            return;
        }
        GuideManager.clear();
        GameServerData.getInstance().clearViewStack();
        // 清除上层
        ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_CLEARALL, null, null, null);
        // 清除中层
        let container:fgui.GComponent = ViewDispatcher.viewCtn;
        let childrenNum:number = container.numChildren;
        let numRec:number = 0;
        let numNew:number = 0;
        let stack:Array<any> = new Array<any>();
        for (let i:number = 0; i < childrenNum; i++) {
            let child:ViewLayer = <ViewLayer>container.getChildAt(i);
            if (child.onViewReconnect()) {
                // 已处理重连
                numRec += 1;
                stack.push({viewCtor:child.getViewCtor()});
            }
            else {
                if (child.getViewPrms()) {
                    // 有外部传参，此处（包含）开始销毁
                    break;
                }
                else {
                    numNew += 1;
                    stack.push({viewCtor:child.getViewCtor(), viewTarg:child.getViewTarg()});
                }
            }
        }
        if (stack.length == 0) { // 主页
            container.removeChildren();
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyMainPage, 0, null);
        }
        else {
            // 尝试需要删除的（如果有）
            for (let i:number = childrenNum - 1; i >= stack.length; i--) {
                container.removeChildAt(i);
            }
            // 需要重建的（如果有）
            for (let i:number = 0; i < stack.length; i++) {
                if (stack[i].viewTarg != undefined) { // 需要重建
                    container.removeChildAt(i);
                    let newChild:ViewLayer = ViewDispatcher.newViewLayer(stack[i].viewCtor, stack[i].viewTarg, null);
                    if (ViewDispatcher.addViewChild(container, newChild, i)) {
                        ViewDispatcher.doViewCreate(newChild, null);
                    }
                }
            }
            /*
            if (numRec == childrenNum || (numRec + numNew) == childrenNum) {
                // 如果当前只有已处理重连的
                // 或者当前只有已处理重连的 + 需要重建的
                if (numRec + numNew == childrenNum) { // 可去掉判断
                    ViewDispatcher.setViewMask(container);
                    let topChild:ViewLayer = <ViewLayer>container.getChildAt(container.numChildren - 1);
                    ViewDispatcher.doViewShowFront(topChild);
                }
            }
            else {
                // 含有直接删除的
                let topChild:ViewLayer = <ViewLayer>container.getChildAt(container.numChildren - 1);
                ViewDispatcher.doViewShowFront(topChild);
            }
            */

            // 统一处理，必须刷新吧
            ViewDispatcher.setViewMask(container);
            let topChild:ViewLayer = <ViewLayer>container.getChildAt(container.numChildren - 1);
            ViewDispatcher.doViewShowFront(topChild);
        }
    }

    public static EVENT_PUSH:number = 1;
    public static EVENT_PUSH_MULTI:number = 2;
    public static EVENT_POP_UNTIL:number = 3;
    public static EVENT_POP_TO:number = 4;
    public static EVENT_POP_WITH:number = 5;
    public static EVENT_UPDATE:number = 6;
    public static EVENT_DESTROY:number = 7;
    public static EVENT_CLEARALL:number = 8;
    public static EVENT_CLEARTO:number = 9;

    private static pushEvent(container:fgui.GComponent, loadCalls:ViewLoadCalls, eventId:number, viewCtor: new () => ViewLayer, viewTarg:number, params:any):void {
        if (eventId == ViewDispatcher.EVENT_PUSH) {
            ViewDispatcher.viewPush(container, loadCalls, viewCtor, viewTarg, params);
        } else if (eventId == ViewDispatcher.EVENT_PUSH_MULTI) {
            ViewDispatcher.viewPushMulti(container, loadCalls, viewCtor, viewTarg, params);
        } else if (eventId == ViewDispatcher.EVENT_POP_UNTIL) {
            ViewDispatcher.viewPopUntil(container, viewCtor, viewTarg, params);
        } else if (eventId == ViewDispatcher.EVENT_POP_TO) {
            ViewDispatcher.viewPopTo(container, viewCtor, viewTarg, params);
        } else if (eventId == ViewDispatcher.EVENT_POP_WITH) {
            ViewDispatcher.viewPopWith(container, viewCtor, viewTarg, params);
        } else if (eventId == ViewDispatcher.EVENT_UPDATE) {
            ViewDispatcher.viewUpdate(container, viewCtor, viewTarg, params);
        } else if (eventId == ViewDispatcher.EVENT_DESTROY) {
            ViewDispatcher.viewDestroy(container, viewCtor, viewTarg, params);
        } else if (eventId == ViewDispatcher.EVENT_CLEARALL) {
            ViewDispatcher.viewClearAll(container, viewCtor, viewTarg, params);
        } else if (eventId == ViewDispatcher.EVENT_CLEARTO) {
            ViewDispatcher.viewClearTo(container, viewCtor, viewTarg, params);
        }
    }

    private static tryQueueEvent(container:fgui.GComponent, loadCalls:ViewLoadCalls, eventId:number, viewCtor: new () => ViewLayer, viewTarg:number, params:any):void {
        if (container && !(loadCalls && loadCalls.isIgnoreQueue)) {
            ViewDispatcher.envQueue.push({
                isEnvDoing: false,
                container: container,
                loadCalls: loadCalls,
                eventId: eventId,
                viewCtor: viewCtor,
                viewTarg: viewTarg,
                params: params,
            });
        }
        if (loadCalls && loadCalls.isIgnoreQueue) {
            ViewDispatcher.pushEvent(container, loadCalls, eventId, viewCtor, viewTarg, params);
        } else {
            let env:any = ViewDispatcher.envQueue[0];
            if (env && !env.isEnvDoing) {
                env.isEnvDoing = true;
                ViewDispatcher.pushEvent(env.container, env.loadCalls, env.eventId, env.viewCtor, env.viewTarg, env.params);
                ViewDispatcher.envQueue.shift();
                ViewDispatcher.tryQueueEvent(null, null, null, null, null, null);
            }
        }
    }

    /**
     * 界面操作接口 eventId:
     * 
     * EVENT_PUSH
     * 
     * EVENT_PUSH_MULTI
     * 
     * EVENT_POP_UNTIL
     * 
     * EVENT_POP_TO
     * 
     * EVENT_POP_WITH
     * 
     * EVENT_UPDATE
     * 
     * EVENT_DESTROY
     * 
     * EVENT_CLEARALL
     */
    public static pushBackEvent(loadCalls:ViewLoadCalls, eventId:number, viewCtor: new () => ViewLayer, viewTarg:number, params:any):void {
        ViewDispatcher.tryQueueEvent(ViewDispatcher.backCtn, loadCalls, eventId, viewCtor, viewTarg, params);
    }

    public static pushViewEvent(loadCalls:ViewLoadCalls, eventId:number, viewCtor: new () => ViewLayer, viewTarg:number, params:any):void {
        ViewDispatcher.tryQueueEvent(ViewDispatcher.viewCtn, loadCalls, eventId, viewCtor, viewTarg, params);
    }

    public static pushNotiEvent(loadCalls:ViewLoadCalls, eventId:number, viewCtor: new () => ViewLayer, viewTarg:number, params:any):void {
        ViewDispatcher.tryQueueEvent(ViewDispatcher.notiCtn, loadCalls, eventId, viewCtor, viewTarg, params);
    }

    public static clear():void {
        ViewDispatcher.pushBackEvent(null, ViewDispatcher.EVENT_CLEARALL, null, null, null);
        ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_CLEARALL, null, null, null);
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARALL, null, null, null);
        ViewDispatcher.envQueue = new Array<any>();
    }
}
