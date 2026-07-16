//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { Color } from "cc";
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyClanSoloMain } from "./LyClanSoloMain";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanSoloAttr extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClanSolo";
        this.viewResI.pkgName = "LyClanSolo";
        this.viewResI.comName = "LyClanSoloAttr";
    }
    private uiPanel: fgui.GComponent
    private fullInfo: any
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloAttr, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloAttr, 0, null);
        })
        this.uiPanel.getChild("label_xxsx", fgui.GLabel).text = StrVal.LYCLANSOLO.STR67
        this.uiPanel.getChild("label_sxgz", fgui.GLabel).text = StrVal.LYCLANSOLO.STR68
        this.uiPanel.getChild("label_str72", fgui.GLabel).text = StrVal.LYCLANSOLO.STR72
        this.uiPanel.getChild("label_str73", fgui.GLabel).text = StrVal.LYCLANSOLO.STR73


        this.uiPanel.getChild("label_jcsx", fgui.GLabel).text = StrVal.LYCLANSOLO.STR69
        this.uiPanel.getChild("label_zdkx", fgui.GLabel).text = StrVal.LYCLANSOLO.STR70
        this.uiPanel.getChild("label_str71", fgui.GLabel).text = StrVal.LYCLANSOLO.STR71
        this.uiPanel.getChild("label_str75", fgui.GLabel).text = StrVal.LYCLANSOLO.STR75

        this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanSoloPlayer: any = this.fullInfo.clanSoloPlayer
        let clanSoloMyselfInfo: any = clanSoloPlayer.clanSoloMyselfInfo

        let list_attr1: fgui.GList = this.uiPanel.getChild("list_attr1")
        let clanSoloBuff = LocaleData.getClanSoloBuff(clanSoloMyselfInfo.buffId)
        this.uiPanel.getChild("label_str74", fgui.GLabel).text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR74, [clanSoloBuff.value])
        // let attr1 = [
        //     VarVal.ENTITIATTR.FINAL_HP,      //生命
        //     VarVal.ENTITIATTR.FINAL_ATTACK,      //攻击
        //     VarVal.ENTITIATTR.FINAL_DEFENSE,         //防御
        // ]
        // list_attr1.itemRenderer = (index: number, child: fgui.GComponent) => {
        //     let label_txt: fgui.GLabel = child.getChild("label_txt")
        //     let strArr = attr1[index]
        //     label_txt.text = StrVal.ENTITI_NAMES[strArr] + " " + clanSoloBuff.value + "%"
        // }
        // UtilsUI.setFguiGlistDelayNumItems(list_attr1, attr1.length);

        let list_attr2: fgui.GList = this.uiPanel.getChild("list_attr2")
        let attr2 = [
            VarVal.ENTITIATTR.FINAL_HP,      //生命
            VarVal.ENTITIATTR.FINAL_ATTACK,      //攻击
            VarVal.ENTITIATTR.FINAL_DEFENSE,         //防御
            VarVal.ENTITIATTR.FINAL_SPEED,       //敏捷
        ]
        list_attr2.setVirtual();
        list_attr2.itemRenderer = (index: number, child: fgui.GComponent) => {
            let data = clanSoloMyselfInfo.fightAttrs[index]
            let strArr = attr2[index]
            let label_txt: fgui.GLabel = child.getChild("label_txt")
            label_txt.text = StrVal.ENTITI_NAMES[strArr] + " " + data
        }
        UtilsUI.setFguiGlistDelayNumItems(list_attr2, attr2.length);

        let attr3 = [
            VarVal.ENTITIATTR.CHANCE_COMBO,        //连击
            VarVal.ENTITIATTR.CHANCE_COUNTER,        //反击
            VarVal.ENTITIATTR.CHANCE_CRITICAL,        //暴击
            VarVal.ENTITIATTR.CHANCE_MISS,        //闪避
            VarVal.ENTITIATTR.CHANGE_VAMPIRE,        //吸血
            VarVal.ENTITIATTR.CHANCE_VERTIGO,        //击晕

            VarVal.ENTITIATTR.RESISTANCE_COMBO,       //抗连击
            VarVal.ENTITIATTR.RESISTANCE_COUNTER,       //抗反击
            VarVal.ENTITIATTR.RESISTANCE_CRITICAL,       //抗暴击
            VarVal.ENTITIATTR.RESISTANCE_MISS,       //抗闪避
            VarVal.ENTITIATTR.RESISTANCE_VAMPIRE,       //抗吸血
            VarVal.ENTITIATTR.RESISTANCE_VERTIGO,       //抗击晕
        ]
        let list_attr3: fgui.GList = this.uiPanel.getChild("list_attr3")
        list_attr3.setVirtual();
        list_attr3.itemRenderer = (index: number, child: fgui.GComponent) => {
            let data = clanSoloMyselfInfo.fightAttrs[index + 4]
            let strArr = attr3[index]
            let label_txt: fgui.GLabel = child.getChild("label_txt")
            label_txt.text = StrVal.ENTITI_NAMES[strArr] + " " + data + "%"
        }
        UtilsUI.setFguiGlistDelayNumItems(list_attr3, attr3.length);
    };




    public getIsViewMask(): boolean {
        return false;
    };

}