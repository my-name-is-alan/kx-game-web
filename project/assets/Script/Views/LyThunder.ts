//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServerData } from "../Kernel/GameServerData";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { LyBreakStage } from "./LyBreakStage";
import { Color, sp, Vec2 } from "cc";
import { FguiGTween } from "../Kernel/FguiGTween";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { VarVal } from "../Values/VarVal";
import { LyActivitySevenDays } from "./LyActivitySevenDays";

export class LyThunder extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyBreakStage";
        this.viewResI.pkgName = "LyBreakStage";
        this.viewResI.comName = "LyThunder";
    }
    private params: any
    private loader_spine_fetter1: fgui.GLoader3D
    private loader_spine_fetter2: fgui.GLoader3D
    private group_start: fgui.GComponent;
    // private dayNeedLevel: Number
    // private oldLevel: Number
    private spinePlayer
    public onViewCreate(_params): void {
        this.params = _params
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        // 关闭
        this.btn_close = getUiPanel.getChild("btn_close");
        this.btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyThunder, 0, null);
        })
        this.btn_close.touchable = false
        this.group_start = getUiPanel.getChild("group_start")
        // let attrs1: string[] = this.params.stageData1.baseAttrs.split(",")
        // let attrs2: string[] = this.params.stageData2.baseAttrs.split(",")
        let list_attr: fgui.GList = getUiPanel.getChild("list_attr")
        list_attr.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let label_attr1: fgui.GLabel = obj.getChild("label_attr1")
            let label_attr2: fgui.GLabel = obj.getChild("label_attr2")
            label_attr1.text = UtilsTool.stringFormat("{0}          {1}", [StrVal.EQUIPATTR_NAMES[index], this.params.stageData1.attrs[index]])
            label_attr2.text = UtilsTool.stringFormat("{0}", [this.params.stageData2.attrs[index]])
        }).bind(this)
        list_attr.numItems = 4
        this.c1 = getUiPanel.getController("c1")
        this.standard = GameServerData.getInstance().getPlayerFullInfo().base.combatPower
        this.bar_blood = getUiPanel.getChild("bar_blood")
        this.blood = this.standard
        this.bar_blood.max = this.standard
        this.bar_blood.value = this.standard
        this.label_blood = getUiPanel.getChild("label_blood")
        this.label_blood.text = UtilsTool.stringFormat(StrVal.LYTHUNDER.STR1, [UtilsTool.nToFStr(this.blood), UtilsTool.nToFStr(this.standard)])
        // 阶段名字
        let label_stage1: fgui.GLabel = getUiPanel.getChild("label_stage1")
        let label_stage2: fgui.GLabel = getUiPanel.getChild("label_stage2")
        label_stage1.text = this.params.stageData1.data.name
        label_stage2.text = this.params.stageData2.data.name
        // this.onBlood()
        this.loader_spine_fetter1 = getUiPanel.getChild("loader_spine_fetter1")
        this.loader_spine_fetter2 = getUiPanel.getChild("loader_spine_fetter2")
        let loader_spine_fire: fgui.GLoader3D = getUiPanel.getChild("loader_spine_fire")
        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            spp.playAnimation("stand", true);
        }, loader_spine_fire, "dujie_fire")
        this.onEff("stand")
        let fullInfoBase = GameServerData.getInstance().getPlayerFullInfo().base
        let charInfo = LocaleData.getCharShowResInfo(fullInfoBase.character, fullInfoBase.phase, null, fullInfoBase.avatar);
        // UtilsUI.loadSpineAndShow(getUiPanel.getChild("loader_spine"), charInfo.spine);
        this.spinePlayer = new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            spp.playAnimation("dujie_stand", true);
        }, getUiPanel.getChild("loader_spine"), charInfo.spine)

        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            spp.playAnimation("stand", true);
        }, getUiPanel.getChild("loader_spine1"), charInfo.spine)


        this.setInterval(() => {
            if (this.isAni && this.isBreakthrough) {
                this.onbreakthrough()
            } else {
                this.isAni = true
            }
        }, 2000)
        this.damageArr = this.params.stageData2.data.damage.split(",")
        this.img_thunder = getUiPanel.getChild("img_thunder")
        this.img_thunder.onClick(() => {
            this.onbreakthrough()
        })

        // let activity = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.SEVENDAYS)
        // let activityData: any = activity.data.activitySevenDays[0]
        // let topId: number = activityData.id
        // let sevenDaysItems: any = LocaleData.getSevenDaysItems(topId)
        // this.dayNeedLevel = Number(LocaleData.getActivityXml(VarVal.ACTIVITY_ID.SEVENDAYS).needLevel);
        // this.oldLevel = fullInfoBase.level
    }

    private damageArr: string[]
    private isAni: boolean = true
    private img_thunder: fgui.GLoader
    private btn_close: fgui.GButton
    private isBreakthrough: boolean = true

    private onEff(effName: string, call?: Function): void {
        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            if (call) {
                spp.playAnimation(effName, false, null, null, call());
            } else {
                spp.playAnimation(effName, false);
            }
        }, this.loader_spine_fetter1, "dujie_1")

        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            spp.playAnimation(effName, false);
        }, this.loader_spine_fetter2, "dujie_2")
    }

    private onbreakthrough(): void {
        if (this.damageArr.length > this.index) {
            this.isAni = false
            this.onEff("touch")
            this.spinePlayer.playAnimation("dujie_ing", false, null, null, () => {
                this.spinePlayer.playAnimation("dujie_stand", true);
            }, true)
            // this.playAnimation("touch", false);
            let subBlood: number = this.standard * (Number(this.damageArr[this.index]) * 0.01)
            this.blood = Math.ceil(this.blood - subBlood);
            this.onShowDamageText(UtilsTool.stringFormat("-{0}", [UtilsTool.nToFStr(Math.ceil(subBlood))]))
            if (!this.blood) {
                this.blood = 0
            }
            this.bar_blood.value = this.blood
            this.label_blood.text = UtilsTool.stringFormat(StrVal.LYTHUNDER.STR1, [UtilsTool.nToFStr(this.blood), UtilsTool.nToFStr(this.standard)])
            this.index++;
        } else {
            this.img_thunder.touchable = false
            this.isBreakthrough = false
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.isAni = false
                    this.spinePlayer.playAnimation("dujie_end", false, null, null, () => {
                    }, false)
                    this.onEff("open", () => {
                        this.setTimeout(() => {
                            this.btn_close.touchable = true
                            this.c1.selectedIndex = 1
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyBreakStage, 0, null);
                            // if (this.oldLevel < this.dayNeedLevel && GameServerData.getInstance().getPlayerFullInfo().base.level >= this.dayNeedLevel) {
                                // let activityDays = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.SEVENDAYS);
                                // if (activityDays && activityDays.data && activityDays.data.activitySevenDays[0].start == 1) { }
                                // else {
                                //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivitySevenDays, 0, null);
                                // }
                            // }
                        }, 1500);
                    })
                } else {
                    // this.btn_close.touchable = true//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!删除
                    // this.c1.selectedIndex = 1//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!删除
                    UtilsUI.showMsgTip(args.errorcode)
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyThunder, 0, null);//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!打开
                }
            }, "breakthrough", null)

        }
    }

    private c1: fgui.Controller
    private label_blood: fgui.GLabel
    private blood: number
    private bar_blood: fgui.GProgressBar
    private standard: number
    private index: number = 0
    private onShowDamageText(txt: string): void {
        let label_text: fgui.GTextField = new fgui.GTextField();
        label_text.autoSize = fgui.AutoSizeType.Both;
        label_text.fontSize = 65;
        label_text.stroke = 4;
        label_text.strokeColor = new Color(52, 128, 150, 255);
        label_text.color = new Color(235, 235, 235, 255);
        label_text.text = txt;
        label_text.setPivot(0.5, 0.5, true);
        this.group_start.addChild(label_text);
        this.getGTween(label_text).by(0.2, { scaleX: 0.5, scaleY: 0.5, y: -50 }, { easing: fgui.EaseType.QuadOut }).call(() => {
        }).delay(0.5).by(0.2, { scaleX: -0.5, scaleY: -0.5, y: -50 }, { easing: fgui.EaseType.QuadIn }).call((tw) => {
            label_text.removeFromParent();
        }).start();
    }
    private getGTween(target: fgui.GObject): FguiGTween {
        let tw: FguiGTween = FguiGTween.new(target);
        return tw;
    }

    public getIsViewMask(): boolean {
        return false;
    }
}