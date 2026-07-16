//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";

export class LyCrossQunYinLog extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyCrossQunYin";
        this.viewResI.pkgName = "LyCrossQunYin";
        this.viewResI.comName = "LyCrossQunYinLog";
    }
    private uiPanel: fgui.GComponent


    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close = this.getUiPanel().getChild("btn_close")
        let btn_close1 = this.uiPanel.getChild("btn_close1")
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCrossQunYinLog, 0, null)
        })
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCrossQunYinLog, 0, null)
        })
        let label_str9: fgui.GLabel = this.uiPanel.getChild("label_str9")
        label_str9.text = StrVal.LYQUNYIN.STR9

        this.initialize(params.result)
    };
    private randomXml: any
    private activityXml: any
    private initialize(args: any): void {
        let label_bl: fgui.GLabel = this.uiPanel.getChild("label_bl")
        label_bl.text = StrVal.LYQUNYIN.STR22
        let fullInfoId: any = GameServerData.getInstance().getPlayerFullInfo().base.guid
        let list_log: fgui.GList = this.uiPanel.getChild("list_log")
        this.activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.QUNYIN);
        this.randomXml = this.activityXml._random[0]._item
        list_log.itemRenderer = ((index: number, obj: fgui.GComponent) => {

            let label_str28_1: fgui.GLabel = obj.getChild("label_str28_1")
            let label_str28_2: fgui.GLabel = obj.getChild("label_str28_2")
            // label_str28_1.text = fullInfoId == args[index].attId ? "挑战" : "防守"
            label_str28_1.text = StrVal.LYQUNYIN.STR28
            label_str28_2.text = StrVal.LYQUNYIN.STR28
            let img_isWin: fgui.GLoader = obj.getChild("img_isWin")
            let img_icon: fgui.GImage = obj.getChild("img_icon")
            let label_name: fgui.GLabel = obj.getChild("label_name")
            let label_level: fgui.GLabel = obj.getChild("label_level")
            let label_rank: fgui.GLabel = obj.getChild("label_rank")
            let group_isBattle: fgui.GGraph = obj.getChild("group_isBattle")
            let group_head: fgui.GComponent = obj.getChild("group_head")
            let loader_icon: fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");



            let img_isWin1: fgui.GLoader = obj.getChild("img_isWin1")
            let img_icon1: fgui.GImage = obj.getChild("img_icon1")
            let label_name1: fgui.GLabel = obj.getChild("label_name1")
            let label_level1: fgui.GLabel = obj.getChild("label_level1")
            let label_rank1: fgui.GLabel = obj.getChild("label_rank1")
            let group_isBattle1: fgui.GGraph = obj.getChild("group_isBattle1")
            let group_head1: fgui.GComponent = obj.getChild("group_head1")
            let loader_icon1: fgui.GLoader = group_head1.getChild("group_icon", fgui.GComponent).getChild("loader_icon");

            console.log(args[index]);



            let attIcon = LocaleData.getCharShowResInfo(1, 1, args[index].attModel, args[index].attAvatar).icon_square;
            let defIcon = LocaleData.getCharShowResInfo(1, 1, args[index].defModel, args[index].defAvatar).icon_square;


            if (args[index].attId == "") {
                let NpcRandom = this.onNpcRandom(args[index].attRank)
                let charInfo = LocaleData.getCharShowResInfo(1, 1, NpcRandom.model, args[index].attAvatar)
                attIcon = charInfo.icon_square;
                args[index].attName = NpcRandom.name
            }
            if (args[index].defId == "") {
                let NpcRandom = this.onNpcRandom(args[index].defRank)
                let charInfo = LocaleData.getCharShowResInfo(1, 1, NpcRandom.model, args[index].defAvatar)
                defIcon = charInfo.icon_square;
                args[index].defName = NpcRandom.name
            }

            if (fullInfoId == args[index].attId) {
                group_isBattle.visible = true
                img_isWin.url = args[index].isWin == 1 ? "ui://LyCrossQunYin/frame_left2" : "ui://LyCrossQunYin/frame_left1";
                label_name.text = args[index].attName
                label_level.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR10, [args[index].attLevel])
                label_rank.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR11, [args[index].attRank == 0 ? StrVal.COMMON.STR19 : args[index].attRank])
                loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [attIcon]);



                img_isWin1.url = args[index].isWin == 0 ? "ui://LyCrossQunYin/frame_right2" : "ui://LyCrossQunYin/frame_right1";
                label_name1.text = args[index].defName
                label_level1.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR10, [args[index].defLevel])
                label_rank1.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR11, [args[index].defRank == 0 ? StrVal.COMMON.STR19 : args[index].defRank])
                loader_icon1.url = UtilsTool.stringFormat("ui://CCommon/{0}", [defIcon]);
            } else {
                group_isBattle1.visible = true
                img_isWin.url = args[index].isWin == 0 ? "ui://LyCrossQunYin/frame_left2" : "ui://LyCrossQunYin/frame_left1";
                label_name.text = args[index].defName
                label_level.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR10, [args[index].defLevel])
                label_rank.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR11, [args[index].defRank == 0 ? StrVal.COMMON.STR19 : args[index].defRank])

                loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [defIcon]);

                img_isWin1.url = args[index].isWin == 1 ? "ui://LyCrossQunYin/frame_right2" : "ui://LyCrossQunYin/frame_right1";
                label_name1.text = args[index].attName
                label_level1.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR10, [args[index].attLevel])
                label_rank1.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR11, [args[index].attRank == 0 ? StrVal.COMMON.STR19 : args[index].attRank])
                loader_icon1.url = UtilsTool.stringFormat("ui://CCommon/{0}", [attIcon]);
            }


        }).bind(this)
        list_log.numItems = args.length
    }

    private onNpcRandom(rank: number): any {
        for (let i = 0; i < this.randomXml.length; i++) {
            const element = this.randomXml[i];
            if (rank < Number(element.rank)) {
                return element
            }
        }
    }
    public getIsViewMask(): boolean {
        return false;
    };

}