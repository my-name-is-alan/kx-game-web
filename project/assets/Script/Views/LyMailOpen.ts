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
import { GameServer } from "../Kernel/GameServer";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LyMail } from "./LyMail";
import { LyEliteDraw } from "./LyEliteDraw";

export class LyMailOpen extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyMail";
        this.viewResI.pkgName = "LyMail";
        this.viewResI.comName = "LyMailOpen";
    }
  
    private uiPanel:fgui.GComponent
    public onViewCreate(_params:any):void {
        let mail = _params
        this.getUiPanel().getChild("btn_mask", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyMailOpen, 0, null)
        });

        let group_mail:fgui.GComponent = this.getUiPanel().getChild("main")
        let c1: fgui.Controller = group_mail.getController("c1")
        UtilsUI.playCommonGroupAni(group_mail, null);
        group_mail.getChild("label_title").text = mail.title
        group_mail.getChild("label_content").text = mail.content
        let list_prop: fgui.GList = group_mail.getChild("list_prop")
        let btn_get: fgui.GButton = group_mail.getChild("btn_get")
        let btn_delect: fgui.GButton = group_mail.getChild("btn_delect")
        let label_name: fgui.GLabel = group_mail.getChild("label_name")
        let label_time: fgui.GLabel = group_mail.getChild("label_time")
        group_mail.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyMailOpen, 0, null)
        })
        btn_get.text = StrVal.LYMAIL.STR2
        btn_delect.text = StrVal.LYMAIL.STR1
        label_name.text = UtilsTool.stringFormat(StrVal.LYMAIL.STR7, [mail.senderName] ) 
        label_time.text = UtilsTool.stringFormat(StrVal.LYMAIL.STR8, [UtilsTool.TimeToDateStr(mail.createTime)]) 
        btn_delect.visible = false
        btn_delect.visible = mail.state == 2
        let items = UtilsUI.getBonuseItemsByString(mail.attaches)
        list_prop.itemRenderer = ((index: number, child:fgui.GComponent) => {
            UtilsUI.setUIGroupItem(items[index], child, null)
        }).bind(this)
        if (mail.attaches != "") {
            c1.selectedIndex = 0
            list_prop.numItems = items.length
        }else{
            c1.selectedIndex = 1
            btn_delect.visible = true
        }
        btn_get.visible = mail.state != 2
       
        btn_get.onClick(()=> {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                    UtilsUI.showImgTip("LyMail", "group_getSuccsee");
                    btn_delect.visible = true
                    btn_get.visible = false
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
             } ,"takeMailBonuses", { mailId: mail.id })
        })

        btn_delect.onClick(()=> {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyMailOpen, 0, null)
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
             } ,"deleteMail", { mailId: mail.id })
        })
    }

    public onViewDestroy(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMail, 0, null)
    }

    public getIsViewMask(): boolean {
        return false;
    };
}


