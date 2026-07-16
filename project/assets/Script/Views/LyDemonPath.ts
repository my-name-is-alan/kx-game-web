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
import { PointRedData } from "../Kernel/PointRedData";
import { AudioManager } from "../Kernel/AudioManager";

export class LyDemonPath extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyMainPage";
        this.viewResI.pkgName = "LyMainPage";
        this.viewResI.comName = "LyDemonPath";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_backMask");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyDemonPath, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyDemonPath, 0, null);
        })
        let label_title:fgui.GLabel = this.uiPanel.getChild("label_title")
        label_title.text = LocaleData.getActivation(VarVal.SYSYTEM_ID.demonPath).name
        let list_all: fgui.GList = this.uiPanel.getChild("list_all")

        list_all.itemRenderer = (index: number, child:fgui.GComponent)=>{
            let sysData = syss[index]
            child.getChild("loader_icon",fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}", [sysData.icon])
            child.getChild("label_name",fgui.GLabel).text = sysData.name
            child.getChild("label_des",fgui.GLabel).text = sysData.info
            let group_suo = child.getChild("group_suo", fgui.GGroup)
            let label_task: fgui.GLabel = child.getChild("label_task")
            let group_item: fgui.GComponent = child.getChild("gourp_item")
            let btn_get = child.getChild("btn_get", fgui.GButton)
            let bon = UtilsUI.getBonuseItemsByBonusesId(sysData.bonuseId)
            let isget = child.getChild("get", fgui.GGroup)
            UtilsUI.setUIGroupItem(bon[0], group_item, null);
            btn_get.visible = false
            isget.visible = false
            let sysOpne = GameServerData.getInstance().isActivationSys(sysData.id) 
            let sys = GameServerData.getInstance().getActivationSys(sysData.id)
            if (sysOpne && sys && sys.take != 0) {
                group_suo.visible = false
                btn_get.visible = sys.take == 1
                PointRedData.getInstance().updateManualPoint(btn_get, sys.take == 1)
                isget.visible = sys.take == 2
                btn_get.text = StrVal.LYMAINPAGE.STR20
                btn_get.clearClick()
                btn_get.onClick(()=>{
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            list_all.numItems = syss.length
                            UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } , "takeGuideBonuses", {id: sys.id })
                });
            }else{
                group_suo.visible = true
                let taskDes = ""
                if (sysData.day == "0") {
                    let finishCount:number = GameServerData.getInstance().getPlayerFullInfo().finishCount
                    taskDes = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR16, [Number(sysData.taskNum) - finishCount])
                } else {
                    taskDes = UtilsTool.stringFormat(StrVal.LYMAINPAGE.STR17, [sysData.level, GameServerData.getInstance().getServerCreateDay(), sysData.day])
                }
                label_task.text = taskDes
            }
        }

        let allsys = LocaleData.getActivationAll()
        let syss = []
        for (let index = 0; index < allsys.length; index++) {
            let now = allsys[index];
            if (now.bonuseId != "") {
                syss.push(now)
            }
        }
        syss.sort((a, b): number=>{
            let sysA =  GameServerData.getInstance().getActivationSys(a.id)
            let sysB =  GameServerData.getInstance().getActivationSys(b.id)
            let numbera = 1
            let numberb = 1
            if (sysA) {
                numbera = sysA.take == 2 ? 0:2
            }
            if (sysB) {
                numbera = sysB.take == 2 ? 0:2
            }
            if (numbera == numberb) {
                return Number(a.id) - Number(b.id)
            }else{
                return numbera - numberb
            }
        });
       UtilsUI.setFguiGlistDelayNumItems(list_all, syss.length)
    };

    


    public getIsViewMask(): boolean {
        return false;
    };

    public static inViewRedPoint(): boolean{
        let allsys = LocaleData.getActivationAll()
        for (let index = 0; index < allsys.length; index++) {
            let now = allsys[index];
            if (now.bonuseId != "") {
                let sys = GameServerData.getInstance().getActivationSys(now.id)
                if (sys && sys.take == 1) {
                    return true
                }
            }
        }
        return false
    } 

}