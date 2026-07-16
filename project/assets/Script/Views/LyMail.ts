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
import { LyMailOpen } from "./LyMailOpen";
import { AudioManager } from "../Kernel/AudioManager";
import { VarVal } from "../Values/VarVal";

export class LyMail extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyMail";
        this.viewResI.pkgName = "LyMail";
        this.viewResI.comName = "LyMail";
    }

    private list_mails: fgui.GList
    private mails: any
    private uiPanel:fgui.GComponent
    private img_null: fgui.GImage
    private label_number: fgui.GLabel
    public onViewCreate(_params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        this.mails = GameServerData.getInstance().getMails()
        this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyMail, 0, null)
        });
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        this.img_null = this.uiPanel.getChild("img_null")
        this.label_number = this.uiPanel.getChild("label_emailNumber")
        this.list_mails = this.uiPanel.getChild("list_mails")
        let btn_close = this.uiPanel.getChild("btn_close")
        let btn_allGet = this.uiPanel.getChild("allget_btn", fgui.GButton)
        btn_allGet.text = StrVal.LYMAIL.STR5
        this.uiPanel.getChild("label_title").text = StrVal.LYMAIL.STR3
        let btn_alldelet = this.uiPanel.getChild("delet_btn")
        btn_alldelet.text = StrVal.LYMAIL.STR4
        btn_close.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyMail, 0, null)
        })
        btn_allGet.onClick(()=> {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    if (args.mailIds.length > 0) {
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                        UtilsUI.showImgTip("LyMail", "group_getSuccsee");
                    }
                    this.updataMail()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"quickTakeMailBonuses", null)
        })

        btn_alldelet.onClick(()=> {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.updataMail()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"quickDeleteMails", null)
        })

        this.list_mails.itemRenderer = this.initMail.bind(this)
        this.list_mails.on(fgui.Event.CLICK_ITEM, this.mailOnClick, this)
        this.updataMail()
    }

    private initMail(index: number, child: fgui.GComponent): void {
        let mail = this.mails[index]
        let con_read = child.getController("con_read")
        child.getChild("title_text").text = mail.title
        child.getChild("time_text").text = UtilsTool.TimeToDateStr(mail.createTime) 
        child.getChild("label_deletime").text = UtilsTool.stringFormat(StrVal.LYMAIL.STR9, [UtilsTool.parseTimeToString(mail.createTime + 30*24*60*60 - GameServerData.getInstance().getServerTime())]) 
        let img_haveReward: fgui.GImage = child.getChild("n29")
        img_haveReward.grayed = false
        con_read.selectedIndex = mail.state
        if (mail.attaches != "") {
            img_haveReward.grayed = mail.state == 2
            child.getChild("n27").visible = false
            child.getChild("n28").visible = false
        }else {
            child.getChild("n27").visible = true
            child.getChild("n28").visible = true
            img_haveReward.visible = false
        }
    }

    private mailOnClick(onClickitem: fgui.GObject) {
        let index = this.list_mails.childIndexToItemIndex(this.list_mails.getChildIndex(onClickitem))
        let mail = this.mails[index]
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyMailOpen, 0, mail)
                this.updataMail()
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
         } ,"readMail", { mailId: mail.id })
    }

    private updataMail(): void {
        this.mails = GameServerData.getInstance().getMails()
        if (this.mails.length == 0) {
            this.list_mails.numItems = 0
            this.img_null.visible = true
            this.label_number.text  = UtilsTool.stringFormat(StrVal.LYMAIL.STR6, [0])
        }else{
            this.list_mails.numItems = this.mails.length
            this.img_null.visible = false
            this.label_number.text  = UtilsTool.stringFormat(StrVal.LYMAIL.STR6, [this.mails.length])
        }
    }

    public onViewUpdate(params: any): void {
        this.updataMail()
    }

    public getIsViewMask(): boolean {
        return false;
    };
}


