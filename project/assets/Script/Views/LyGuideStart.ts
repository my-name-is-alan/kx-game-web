//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { StrVal } from "../Values/StrVal";
import { GuideManager } from "../Kernel/GuideManager";
import { UtilsUI } from "../Kernel/UtilsUI";
import { BUILD_TYPE, PlatformAPI } from "../Kernel/PlatformAPI";

export class LyGuideStart extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGuideStart;
        this.viewResI.pkgName = "LyGuideStart";
        this.viewResI.comName = "LyGuideStart";
    }

    private group_detail:fgui.GComponent;
    private group_guideweak:fgui.GComponent;
    private group_guideforce:fgui.GComponent;
    private group_guide:fgui.GComponent;
    // private img_hand:fgui.GImage;
    private loader_spine_hand:fgui.GLoader3D;
    private btn_skip:fgui.GButton;
    private btn_skipall:fgui.GButton;

    private params:any

    private typeStrArr:Array<string>;
    private typeStrIndex:number;
    private textIndex:number;
    private appendText:string;
    private isTyping:boolean;

    private guideObject:fgui.GComponent;
    public static isForce:boolean;
    private isClickObject:boolean;

    public onViewCreate(params:any):void {
        this.group_detail = this.getUiPanel().getChild("group_detail", fgui.GComponent);
        this.group_guideweak = this.getUiPanel().getChild("group_guide", fgui.GComponent);
        this.group_guideforce = this.getUiPanel().getChild("group_guideforce", fgui.GComponent);
        // this.img_hand = this.getUiPanel().getChild("img_hand");
        this.loader_spine_hand = this.getUiPanel().getChild("loader_spine_hand");
        this.btn_skip = this.getUiPanel().getChild("btn_skip", fgui.GButton);
        this.btn_skipall = this.getUiPanel().getChild("btn_skipall", fgui.GButton);

        this.btn_skip.onClick(() => {
            UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "", 
            StrVal.COMMON.STR23, null, 
            StrVal.COMMON.STR32, null, 
            StrVal.COMMON.STR33, () => {
                GuideManager.finishCurrGuide((guide, isDone:boolean) => {
                    if (isDone) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGuideStart, 0, null);
                    }
                });
            }, "", null)
        })

        // 跳过所有引导（测试协议）
        this.btn_skipall.onClick(() => {
            GuideManager.testfinishAllGuide(() => {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGuideStart, 0, null);
            });
        })

        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            spp.playAnimation("stand", true);
        }, this.loader_spine_hand, VarVal.UI_EFF_NAME.spine_guidehand);

        this.params = params;
        this.guideObject = this.params.guideObject;
        LyGuideStart.isForce = this.params.isForce;

        if (params.detail && params.detail.length > 0) {
            this.showGroupDetail();
        } else {
            this.showGroupGuide();
        }
    }

    private showGroupDetail():void {
        // 初始状态
        this.group_detail.visible = true;
        this.group_guideweak.visible = false;
        this.group_guideforce.visible = false;
        let group_main:fgui.GComponent = this.group_detail.getChild("group_main");

        let label_tips = group_main.getChild("label_tips", fgui.GTextField);
        label_tips.text = StrVal.COMMON.STR9;

        // 背景点击
        let graph_back = this.group_detail.getChild("graph_back", fgui.GGraph);
        graph_back.onClick(() => {
            if (this.isTyping) {
                let text = this.typeStrArr[this.typeStrIndex];
                this.appendText = text;
                label_desc.text = this.appendText;
                this.textIndex = text.length;
                this.isTyping = false;
                this.typeStrIndex++;
            } else {
                if (this.typeStrIndex < this.typeStrArr.length) {
                    this.playNextLine(this.typeStrIndex);
                } else {
                    this.showGroupGuide();
                }
            }
        })

        // 精灵名称
        let label_name:fgui.GTextField = group_main.getChild("label_name");
        label_name.text = StrVal.COMMON.STR102;

        // 精灵引导显示
        let label_desc:fgui.GTextField = group_main.getChild("label_desc");

        // 引导文本
        this.typeStrArr = (<string>this.params.detail).split("&");

        // 打字效果
        this.setInterval(() => {
            if (this.isTyping) {
                if (this.typeStrIndex < this.typeStrArr.length) {
                    let text = this.typeStrArr[this.typeStrIndex];
                    if (this.textIndex < text.length) {
                        this.appendText += text[this.textIndex];
                        label_desc.text = this.appendText;

                        this.textIndex++;
                        if (this.textIndex >= text.length) {
                            this.isTyping = false;
                            this.typeStrIndex++;
                        }
                    }
                }
            }
        }, 100); // 每秒10个字

        // 开始
        this.playNextLine(0);
    }

    private playNextLine(index: number): void {
        this.typeStrIndex = index;
        this.textIndex = 0;
        this.appendText = "";
        this.isTyping = true;
    }

    private showGroupGuide():void {
        // 初始状态
        this.group_detail.visible = false;
        if (LyGuideStart.isForce) {
            this.group_guideweak.visible = false;
            this.group_guideforce.visible = true;
            this.group_guide = this.group_guideforce;
        } else {
            this.group_guideweak.visible = true;
            this.group_guideforce.visible = false;
            this.group_guide = this.group_guideweak;
        }

        this._partner.callLater(() => {
            this._partner.callLater(() => {
                let graph_back = this.getUiPanel().getChild("graph_mask", fgui.GGraph);
                graph_back.visible = false;
                this.showGroupGuideDelay();
            }) // 延时一次不行，不能确定与其他界面的先后顺序，得再延迟一次。
        }) // 延时是因为有些布局中位置更新不是实时的，例如List。
    }

    private showGroupGuideDelay():void {
        let gggObject:fgui.GComponent = this.guideObject;
        if (gggObject) {
            // Convert the complete target bounds through world space. Using only the
            // target's own scale loses the transforms of nested panels and virtual lists.
            let targetX = gggObject.pivotAsAnchor ? -gggObject.width * gggObject.pivotX : 0;
            let targetY = gggObject.pivotAsAnchor ? -gggObject.height * gggObject.pivotY : 0;
            let worldRect = gggObject.localToGlobalRect(targetX, targetY, gggObject.width, gggObject.height);
            let localRect = this.getUiPanel().globalToLocalRect(worldRect.x, worldRect.y, worldRect.width, worldRect.height);
            let showX = Math.min(localRect.x, localRect.x + localRect.width);
            let showY = Math.min(localRect.y, localRect.y + localRect.height);
            let gggWidth = Math.abs(localRect.width);
            let gggHeight = Math.abs(localRect.height);
            // 遮罩位置
            let graph_hole:fgui.GGraph = this.group_guide.getChild("graph_hole");
            /* 矩形
            graph_hole.setPivot(0, 0, false);
            graph_hole.setPosition(showX, showY);
            graph_hole.setSize(gggWidth, gggHeight);
            */
            // 圆形
            graph_hole.setPivot(0.5, 0.5, true);
            graph_hole.setPosition(showX + gggWidth / 2, showY + gggHeight / 2);
            let range = Math.sqrt((gggWidth * gggWidth) + (gggHeight * gggHeight));
            graph_hole.setSize(range, range);
            if (LyGuideStart.isForce) {
                // 左
                let graph_hole_clip1:fgui.GGraph = this.getUiPanel().getChild("graph_hole_clip1");
                graph_hole_clip1.setSize(gggHeight, gggHeight);
                graph_hole_clip1.setPosition(showX, showY + gggHeight / 2);
                // 上
                let graph_hole_clip2:fgui.GGraph = this.getUiPanel().getChild("graph_hole_clip2");
                graph_hole_clip2.setSize(gggWidth, gggWidth);
                graph_hole_clip2.setPosition(showX + gggWidth / 2, showY);
                // 又
                let graph_hole_clip3:fgui.GGraph = this.getUiPanel().getChild("graph_hole_clip3");
                graph_hole_clip3.setSize(gggHeight, gggHeight);
                graph_hole_clip3.setPosition(showX + gggWidth, showY + gggHeight / 2);
                // 下
                let graph_hole_clip4:fgui.GGraph = this.getUiPanel().getChild("graph_hole_clip4");
                graph_hole_clip4.setSize(gggWidth, gggWidth);
                graph_hole_clip4.setPosition(showX + gggWidth / 2, showY + gggHeight);
            }
            // 手指位置
            let handX:number = showX + gggWidth / 2;
            let handY:number = showY + gggHeight / 2;
            /*
            this.img_hand.setPosition(handX, handY);
            FguiGTween.new(this.img_hand)
            .by(0.3, {x:30, y:30, scaleX:0.5, scaleY:0.5}, {easing: fgui.EaseType.CubicOut})
            .by(0.1, {x:-30, y:-30, scaleX:-0.5, scaleY:-0.5}, {easing: fgui.EaseType.CubicOut})
            .repeat()
            .start();
            */
            this.loader_spine_hand.setPosition(handX, handY);
            // 背景点击
            // let graph_back = this.group_guide.getChild("graph_back", fgui.GGraph);
            if (LyGuideStart.isForce) {
                if (PlatformAPI.BUILD_CURRENT == BUILD_TYPE.ALPHA) {
                    this.btn_skipall.visible = true;
                }
                this.setTimeout(() => {
                    this.btn_skip.visible = true;
                }, 2000)
                this.onClickEnv();
            } else {
                // 这里将要触发删除引导界面
                fgui.GRoot.inst.on(fgui.Event.TOUCH_BEGIN, this.onTouchBegin, this);
            }
        } else {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGuideStart, 0, null);
        }
    }

    private onTouchBegin(env:fgui.Event): void {
        this.onClickEnv();
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGuideStart, 0, null);
    }

    private onClickTarget(env:fgui.Event): void {
        this.isClickObject = true;
    }

    private onTouchEndLateFgui(env:fgui.Event): void {
        // env.pos 全局位置
        if (LyGuideStart.isForce) {
            if (this.isClickObject) {
                this.offClickEnv();
                if (this.params.clickCall) {
                    this.params.clickCall(this.isClickObject);
                }
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGuideStart, 0, null);
            }
        } else {
            this.offClickEnv();
            if (this.params.clickCall) {
                this.params.clickCall(this.isClickObject);
            }
        }
    }

    private onClickEnv(): void {
        // 是否点击到了引导按钮（按照现在运行顺序，是先触发按钮的事件，再触发fgui的事件，“触发”顺序不能变！）
        this.guideObject.on(fgui.Event.CLICK_BEFORE, this.onClickTarget, this)
        fgui.GRoot.inst.on(fgui.Event.TOUCH_END_LATE, this.onTouchEndLateFgui, this);
    }

    private offClickEnv(): void {
        // 注销事件
        if (this.guideObject && !this.guideObject.isDisposed) {
            this.guideObject.off(fgui.Event.CLICK_BEFORE, this.onClickTarget, this);
        }
        fgui.GRoot.inst.off(fgui.Event.TOUCH_END_LATE, this.onTouchEndLateFgui, this);
    }

    public onViewDestroy(): void {
        if (LyGuideStart.isForce) {
            this.offClickEnv();
        } else {
            // 如果没操作，需要注销第一个事件
            fgui.GRoot.inst.off(fgui.Event.TOUCH_BEGIN, this.onTouchBegin, this);
        }
    }

    public getIsViewMask():boolean {
        return false;
    }
}
