//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { LyTheurgy } from "./LyTheurgy";
import { Color } from "cc";
import { LyTheurgyGroupInfo } from "./LyTheurgyGroupInfo";

export class LyTheurgyInfoPlayer extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyTheurgy";
        this.viewResI.pkgName = "LyTheurgy";
        this.viewResI.comName = "LyTheurgyInfoPlayer";
    }

    private textColor1 = [new Color(156, 221, 123), new Color(137, 207, 249), new Color(205, 180, 255), new Color(255, 194, 82),]
    private textColor2 = [new Color(89, 139, 39), new Color(47, 120, 159), new Color(106, 56, 138), new Color(140, 68, 29),]
    private textColor3 = [new Color(89, 139, 39), new Color(47, 120, 159), new Color(106, 56, 138), new Color(178, 87, 47),]

    private theurgyInst: any
    private playerBase: any
    private needUpItemProto: any
    private theRoot: any
    private upLevelNumber: number

    private uiPanel: fgui.GComponent
    private group_item: fgui.GComponent
    private label_name: fgui.GTextField
    // private label_des1: fgui.GLabel
    private label_skillDes: fgui.GLabel
    private group_tupo: fgui.GComponent
    private label_yj1: fgui.GLabel
    private loader_yj1: fgui.GComponent
    private label_yj2: fgui.GLabel
    private loader_yj2: fgui.GComponent
    private label_gj: fgui.GLabel
    private label_sm: fgui.GLabel
    private label_fy: fgui.GLabel
    private label_stage: fgui.GLabel
    public onViewCreate(_params: any): void {
        this.getUiPanel().getChild("btn_back").onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgyInfoPlayer, 0, null)
        });
        this.uiPanel = this.getUiPanel().getChild("main")
        this.theRoot = LocaleData.getTheurgyRoot();
        let btn_close = this.uiPanel.getChild("btn_close")
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgyInfoPlayer, 0, null)
        });
        UtilsUI.playCommonGroupAni(this.uiPanel, null);
        (<fgui.GLabel>this.uiPanel.getChild("n66")).text = StrVal.LYTHEURGY.STR19;
        (<fgui.GLabel>this.uiPanel.getChild("label_title")).text = StrVal.LYTHEURGY.STR29;
        (<fgui.GLabel>this.uiPanel.getChild("n69")).text = StrVal.LYTHEURGY.STR5;
        this.group_item = this.uiPanel.getChild("group_item");
        this.label_name = this.uiPanel.getChild("label_name");
        // this.label_des1 = this.uiPanel.getChild("label_des1");
        this.label_skillDes = this.uiPanel.getChild("label_skillDes");
        this.group_tupo = this.uiPanel.getChild("group_tupo");
        this.loader_yj1 = this.uiPanel.getChild("loader_yj1");
        this.label_yj1 = this.loader_yj1.getChild("group_seal", fgui.GComponent).getChild("label_lock");
        this.loader_yj2 = this.uiPanel.getChild("loader_yj2");
        this.label_yj2 = this.loader_yj2.getChild("group_seal", fgui.GComponent).getChild("label_lock");
        this.label_gj = this.uiPanel.getChild("label_gj");
        this.label_sm = this.uiPanel.getChild("label_sm");
        this.label_fy = this.uiPanel.getChild("label_fy");
        this.label_stage = this.uiPanel.getChild("label_stage");







        this.loader_yj1.onClick(() => {
            // if (this.theurgyInst.level >= Number(this.theRoot.seal1Level)) {
            //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgySeal, 0, { theurgyInst: this.theurgyInst, pos: 0 })
            // }
        });
        this.label_yj1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR21, [this.theRoot.seal1Level])
        this.loader_yj2.onClick(() => {
            // if (this.theurgyInst.level >= Number(this.theRoot.seal2Level)) {
            //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgySeal, 0, { theurgyInst: this.theurgyInst, pos: 1 })
            // }
        });
        this.label_yj2.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR21, [this.theRoot.seal2Level])

        this.theurgyInst = _params.theurgyInst
        this.needUpItemProto = LocaleData.getItemProto(LocaleData.getTheurgyRoot().levelUpItemId)
        if (this.theurgyInst.new) {
            this.theurgyInst.new = null
        }
        this.refreshPage()
    }
    private refreshPage() {
        this.LoadData()
        let theProto = LocaleData.getTheurgyById(this.theurgyInst.cfgId);
        // this.group_suip.getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/f_{0}", [theProto.icon]);
        // this.group_suip.getChild("loader_bg", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [Number(theProto.quality) + 1]);
        (this.group_item.getChild("loader_dikuang") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_name{0}", [theProto.quality]);
        (this.group_item.getChild("loader_qua") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_kuang{0}", [theProto.quality]);
        (this.group_item.getChild("loader_grade") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_dj{0}", [theProto.quality]);
        (this.group_item.getChild("loader_icon") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/f_{0}", [theProto.icon]);
        (this.group_item.getChild("label_name") as fgui.GLabel).text = theProto.name;
        (this.group_item.getChild("label_grade") as fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR28, [this.theurgyInst.level]);
        (this.group_item.getChild("group_type") as fgui.GGroup).visible = true;
        (this.group_item.getChild("label_type") as fgui.GTextField).strokeColor = this.textColor3[Number(theProto.quality) - 1];
        (this.group_item.getChild("label_type") as fgui.GLabel).text = StrVal.LYTHEURGYNMAE3[Number(this.theurgyInst.type) - 1];
        (this.group_item.getChild("loader_type") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_typeDi{0}", [theProto.quality]);


        (this.uiPanel.getChild("loader_bg") as fgui.GLoader).url = UtilsTool.stringFormat("ui://LyTheurgy/frame_infoBg{0}", [theProto.quality]);
        this.label_name.color = this.textColor1[Number(theProto.quality) - 1]
        this.label_name.strokeColor = this.textColor2[Number(theProto.quality) - 1]
        this.label_name.text = theProto.name;
        let label_des1: fgui.GLabel = this.uiPanel.getChild("label_des1");
        if (this.theurgyInst.type == 1) {
            label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR7, [this.theurgyInst.phase]);
        } else if (this.theurgyInst.type == 2) {
            label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR8, [this.theurgyInst.phase]);
        } else if (this.theurgyInst.type == 3) {
            label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR9, [this.theurgyInst.phase]);
        } else if (this.theurgyInst.type == 4) {
            label_des1.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR10, [this.theurgyInst.phase]);
        }
        let skillId = theProto.phaseSkillId.split(",")[this.theurgyInst.phase - 1];
        this.label_skillDes.text = LocaleData.getSkillProto(skillId).desc;
        let pahasePorto = LocaleData.getTheurgPhase(Number(this.theurgyInst.phase) + 1)
        this.label_stage.text = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR28, [this.theurgyInst.level]);

        this.loader_yj2.visible = LocaleData.getTheurgQua(theProto.quality).sealNumber == "2"

        //印记
        if (this.theurgyInst.seal.length == 0) {
            this.setGroupSeal(this.loader_yj1, null);
            this.setGroupSeal(this.loader_yj2, null);
        } else if (this.theurgyInst.seal.length > 1) {
            //两个槽位
            this.setGroupSeal(this.loader_yj1, this.theurgyInst.seal[0] == 0 ? null : this.theurgyInst.seal[0]);
            this.setGroupSeal(this.loader_yj2, this.theurgyInst.seal[1] == 0 ? null : this.theurgyInst.seal[1]);
        } else {
            //一个槽位
            this.setGroupSeal(this.loader_yj1, this.theurgyInst.seal[0] == 0 ? null : this.theurgyInst.seal[0]);
            this.setGroupSeal(this.loader_yj2, null);
        };
        let c1: fgui.Controller = this.uiPanel.getController("c1")
        c1.selectedIndex = this.theurgyInst.seal.length
        this.loader_yj1.getChild("group_seal", fgui.GComponent).getChild("group_lock").visible = this.theurgyInst.level < Number(this.theRoot.seal1Level)
        this.loader_yj2.getChild("group_seal", fgui.GComponent).getChild("group_lock").visible = this.theurgyInst.level < Number(this.theRoot.seal2Level)


        let theLevelProto = LocaleData.getTheurgLevelByLevel(this.theurgyInst.level);
        this.label_gj.text = UtilsTool.stringFormat("{0}:{1}", [StrVal.ELITEATTR_NAME.attack, theLevelProto.strength]);
        this.label_sm.text = UtilsTool.stringFormat("{0}:{1}", [StrVal.ELITEATTR_NAME.hp, theLevelProto.health])
        this.label_fy.text = UtilsTool.stringFormat("{0}:{1}", [StrVal.ELITEATTR_NAME.defense, theLevelProto.defense])
    }

    private LoadData() {
        this.playerBase = GameServerData.getInstance().getPlayerFullInfo().base
    }

    private setGroupSeal(com: fgui.GComponent, protoId: any) {
        let label_yjName: fgui.GLabel = com.getChild("label_name")
        let group_seal: fgui.GComponent = com.getChild("group_seal")
        let loader_icon: fgui.GLoader = group_seal.getChild("loader_icon");
        let label_name: fgui.GLabel = group_seal.getChild("label_buff");
        let loader_dikuang: fgui.GLoader = group_seal.getChild("loader_dikuang")
        if (protoId) {
            let sealProto = LocaleData.getTheurgSealByItemId(protoId)
            label_name.text = sealProto.name
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [sealProto.icon]);
            // label_name.text = sealProto.desc;
            label_yjName.text = sealProto.desc;
            loader_dikuang.url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [Number(sealProto.quality) + 1]);
        } else {
            loader_icon.url = "ui://LyTheurgy/btn_add"
            label_yjName.text = ""
            label_name.text = ""
            loader_dikuang.url = "ui://LyTheurgy/frame_prop add box"
        }
    }

    private getTheurgyFragNumber(protoId) {
        let allFrag = GameServerData.getInstance().getPlayerFullInfo().theurgyInfo.theurgyFrag
        for (let index = 0; index < allFrag.length; index++) {
            const element = allFrag[index];
            if (element.protoId == protoId) {
                return element.count
            }
        }
        return 0
    }

    public getIsViewMask(): boolean {
        return false;
    };

    public onViewDestroy(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyTheurgy, 0, null)
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyTheurgyGroupInfo, 0, { theurgyInst: this.theurgyInst, protoId: LocaleData.getTheurgyById(this.theurgyInst.cfgId) });
    }

    public onViewUpdate(params: any): void {
        this.theurgyInst = params.theurgyInst
        this.refreshPage()

    }

    public onViewShowFront(): void {
        this.refreshPage()
    }
}


