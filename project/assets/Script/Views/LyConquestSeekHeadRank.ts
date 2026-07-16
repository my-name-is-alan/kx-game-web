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


export class LyConquestSeekHeadRank extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyConquestSeek";
        this.viewResI.pkgName = "LyConquestSeek";
        this.viewResI.comName = "LyConquestSeekHeadRank";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("group_main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close = this.getUiPanel().getChild("btn_close")
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyConquestSeekHeadRank, 0, null)
        })
        let btn_close1 = this.uiPanel.getChild("btn_close1")
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyConquestSeekHeadRank, 0, null)
        })

        let fullInfoBase = GameServerData.getInstance().getPlayerFullInfo().base;
        let conquestInfo = GameServerData.getInstance().getConquestInfo();
        let myInfo = conquestInfo.myInfo

        let group_rankInfo: fgui.GGroup = this.uiPanel.getChild("group_rankInfo")
        group_rankInfo.visible = myInfo.combatRankOf != -1
        let group_noInfo: fgui.GGroup = this.uiPanel.getChild("group_noInfo")
        group_noInfo.visible = myInfo.combatRankOf == -1

        this.uiPanel.getChild("label_title", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR13
        this.uiPanel.getChild("label_str14", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR14
        this.uiPanel.getChild("label_str15", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR15
        this.uiPanel.getChild("label_str16", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR16
        this.uiPanel.getChild("label_str17", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR17
        this.uiPanel.getChild("label_str19", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR19
        this.uiPanel.getChild("label_str20", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR20
        this.uiPanel.getChild("label_str21", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR21
        this.uiPanel.getChild("label_str22", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR22
        this.uiPanel.getChild("label_str23", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR23
        this.uiPanel.getChild("label_str24", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR24
        this.uiPanel.getChild("label_str26", fgui.GLabel).text = StrVal.LYCONQUESTSEEK.STR26

        if (myInfo.combatRankOf == -1) {
        } else {
            let img_icon: fgui.GLoader = this.uiPanel.getChild("img_icon")
            let charInfo = LocaleData.getCharShowResInfoSelf();
            img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            let img_iconFrame: fgui.GLoader = this.uiPanel.getChild("img_iconFrame")
            let ranking = LocaleData.getConquestRankingByRange(myInfo.combatRankOf);
            let attrs = ranking.damagePVE.split(";")
            if (ranking) {
                img_iconFrame.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}", [ranking.frame]);
            } else {
                img_iconFrame.url = ""
            }
            let label_name: fgui.GLoader = this.uiPanel.getChild("label_name")
            label_name.text = fullInfoBase.name
            let label_monsterAttr1: fgui.GLoader = this.uiPanel.getChild("label_monsterAttr1")
            label_monsterAttr1.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR27, [attrs[0]])
            let label_monsterAttr2: fgui.GLoader = this.uiPanel.getChild("label_monsterAttr2")
            label_monsterAttr2.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR27, [attrs[1]])
            let label_monsterAttr3: fgui.GLoader = this.uiPanel.getChild("label_monsterAttr3")
            label_monsterAttr3.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR27, [attrs[2]])
            let label_rank: fgui.GLoader = this.uiPanel.getChild("label_rank")
            label_rank.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR18, [myInfo.combatRankOf])
        }


        let rankings = LocaleData.getConquestRankingByRange();
        let list_rank: fgui.GList = this.uiPanel.getChild("list_rank")
        list_rank.setVirtual();
        list_rank.itemRenderer = (index: number, obj: fgui.GComponent) => {
            let item = rankings[index]
            let img_iconFrame: fgui.GLoader = obj.getChild("img_iconFrame")
            img_iconFrame.url = UtilsTool.stringFormat("ui://CCommon/frame_{0}", [item.frame]);
            let attrs = item.damagePVE.split(";")
            let label_monsterAttr1: fgui.GLabel = obj.getChild("label_monsterAttr1")
            label_monsterAttr1.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR27, [attrs[0]])
            let label_monsterAttr2: fgui.GLabel = obj.getChild("label_monsterAttr2")
            label_monsterAttr2.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR27, [attrs[1]])
            let label_monsterAttr3: fgui.GLabel = obj.getChild("label_monsterAttr3")
            label_monsterAttr3.text = UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR27, [attrs[2]])

            let label_rank: fgui.GLabel = obj.getChild("label_rank")
            let rank = item.range.split(";")
            label_rank.text = rank[0] == rank[1] ? UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR28, [rank[0]]) : UtilsTool.stringFormat(StrVal.LYCONQUESTSEEK.STR25, [rank[0], rank[1]])
        }
        UtilsUI.setFguiGlistDelayNumItems(list_rank, rankings.length);
    };




    public getIsViewMask(): boolean {
        return false;
    };

}


