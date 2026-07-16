//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { VarVal } from "../Values/VarVal";
import { LocaleData } from "../Kernel/LocaleData";
import { MonthCardItemType, MonthCardType, UtilsUI } from "../Kernel/UtilsUI";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { FguiGTween } from "../Kernel/FguiGTween";
import { PointRedData } from "../Kernel/PointRedData";

export class LyPayMonthCard extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPayRecharge;
        this.viewResI.pkgName = "LyPayRecharge";
        this.viewResI.comName = "LyPayMonthCard";
    }

    private SEL_TYPE:MonthCardType; // 当前选择
    private isPlaying:boolean;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayMonthCard, 0, null);
        })

        this.initMonthCard();
        this.initLifeCard();
        if (params) {
            this.setAndPlayCardAni(params.type);
        } else {
            this.setAndPlayCardAni(MonthCardType.Month);
        }
    }

    private setAndPlayCardAni(type:MonthCardType): void {
        if (!this.isPlaying && this.SEL_TYPE != type) {
            this.isPlaying = true;
            this.SEL_TYPE = type;

            let group_main: fgui.GComponent = this.getUiPanel().getChild("group_main", fgui.GComponent);
            let group_mask = group_main.getChild("group_mask");
            
            let srcChild:fgui.GComponent;
            let dstChild:fgui.GComponent;
            if (this.SEL_TYPE == MonthCardType.Month) {
                srcChild = group_main.getChild("group_month");
                dstChild = group_main.getChild("group_life");
            } else {
                srcChild = group_main.getChild("group_life");
                dstChild = group_main.getChild("group_month");
            }

            dstChild.sortingOrder = 0;
            group_mask.sortingOrder = 1;
            srcChild.sortingOrder = 2;

            srcChild.getChild("graph_front", fgui.GGraph).visible = false;
            dstChild.getChild("graph_front", fgui.GGraph).visible = true;

            let count = 2;
            let doneCall = () => {
                count--;
                if (count == 0) {
                    this.isPlaying = false;

                    srcChild.getChild("btn_frame", fgui.GButton).selected = true;
                    dstChild.getChild("btn_frame", fgui.GButton).selected = false;
                }
            }

            let TIME = 0.2;
            let SCALE = 0.9;
            srcChild.setScale(SCALE, SCALE);
            FguiGTween.new(srcChild).to(TIME, {scaleX:1, scaleY:1}).call(doneCall).start();
            FguiGTween.new(dstChild).to(TIME, {scaleX:SCALE, scaleY:SCALE}).call(doneCall).start();
        }
    }

    private initMonthCard(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main", fgui.GComponent).getChild("group_month");

        let CARD_TYPE:MonthCardType = MonthCardType.Month; // 月卡
        let monthCardItem = LocaleData.getPayItemByOtherType(VarVal.payOtherType.monthcard);

        let label_tip0:fgui.GTextField = group_main.getChild("label_tip0");
        label_tip0.text = UtilsUI.getMonthCardDesc0(CARD_TYPE);

        let label_fanli:fgui.GTextField = group_main.getChild("label_fanli");
        label_fanli.text = StrVal.LYPAY_RECHARGE.STR208;

        let label_tip1:fgui.GTextField = group_main.getChild("label_tip1");
        label_tip1.text = StrVal.LYPAY_RECHARGE.STR210;

        let label_tip2:fgui.GTextField = group_main.getChild("label_tip2");
        label_tip2.text = StrVal.LYPAY_RECHARGE.STR211;

        let label_desc:fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = UtilsUI.getMonthCardDesc(CARD_TYPE);

        let graph_front:fgui.GGraph = group_main.getChild("graph_front");
        graph_front.onClick(() => {
            this.setAndPlayCardAni(CARD_TYPE);
        })

        let btn_pay:fgui.GButton = group_main.getChild("btn_pay");
        UtilsUI.setButtonIcon(btn_pay, VarVal.bonusType.chance, String(Number(monthCardItem.money) / 100));
        btn_pay.onClick(() => {
            UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            }, monthCardItem, VarVal.payType.others, VarVal.payOtherType.monthcard);
        })

        let btn_renew:fgui.GButton = group_main.getChild("btn_renew");
        UtilsUI.setButtonIcon(btn_renew, VarVal.bonusType.chance,
            UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR10, [String(Number(monthCardItem.money) / 100)]));
        btn_renew.onClick(() => {
            btn_pay.fireClick();
        })

        let btn_take:fgui.GButton = group_main.getChild("btn_take");
        PointRedData.getInstance().updateManualPoint(btn_take, true);
        btn_take.text = StrVal.LYPAY_RECHARGE.STR201;
        btn_take.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    let bonuseItems = UtilsUI.getMonthCardGiveBonuseItems(CARD_TYPE, MonthCardItemType.give_daily);
                    UtilsUI.showItemReward({bonuseItems:bonuseItems});
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "takePayCard", {
                type:Number(CARD_TYPE)
            });
        })

        let label_take:fgui.GTextField = group_main.getChild("label_take");
        label_take.text = StrVal.LYPAY_RECHARGE.STR200;

        this.refreshMonthCard();
    }

    private refreshMonthCard(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main", fgui.GComponent).getChild("group_month");

        let btn_pay:fgui.GButton = group_main.getChild("btn_pay");
        let btn_renew:fgui.GButton = group_main.getChild("btn_renew");
        let btn_take:fgui.GButton = group_main.getChild("btn_take");
        let label_take:fgui.GButton = group_main.getChild("label_take");
        let img_take:fgui.GImage = group_main.getChild("img_take");
        let label_time:fgui.GTextField = group_main.getChild("label_time");

        btn_pay.visible = false;
        btn_renew.visible = false;
        btn_take.visible = false;
        label_take.visible = false;
        img_take.visible = false;

        if (GameServerData.getInstance().isHaveMonthCard()) {
            let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
            btn_renew.visible = true;
            btn_take.visible = (fullInfo.monthCardTake != 1);
            label_take.visible = (fullInfo.monthCardTake == 1);
            label_time.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR204, [fullInfo.monthCardDays]);
            label_time.color = UtilsUI.getEnoughColor(fullInfo.monthCardDays > 3);
            img_take.visible = true;
        } else {
            btn_pay.visible = true;
            label_time.text = "";
        }
    }

    public onViewUpdate(params: any): void {
        this.refreshMonthCard();
        this.refreshLifeCard();
    }

    public initLifeCard():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main", fgui.GComponent).getChild("group_life");

        let CARD_TYPE:MonthCardType = MonthCardType.Life; // 终身卡
        let lifeCardItem = LocaleData.getPayItemByOtherType(VarVal.payOtherType.lifecard);

        let label_tip0:fgui.GTextField = group_main.getChild("label_tip0");
        label_tip0.text = UtilsUI.getMonthCardDesc0(CARD_TYPE);

        let label_fanli:fgui.GTextField = group_main.getChild("label_fanli");
        label_fanli.text = StrVal.LYPAY_RECHARGE.STR209;

        let label_tip1:fgui.GTextField = group_main.getChild("label_tip1");
        label_tip1.text = StrVal.LYPAY_RECHARGE.STR210;

        let label_tip2:fgui.GTextField = group_main.getChild("label_tip2");
        label_tip2.text = StrVal.LYPAY_RECHARGE.STR211;

        let label_desc:fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = UtilsUI.getMonthCardDesc(CARD_TYPE);

        let graph_front:fgui.GGraph = group_main.getChild("graph_front");
        graph_front.onClick(() => {
            this.setAndPlayCardAni(CARD_TYPE);
        })

        let btn_pay:fgui.GButton = group_main.getChild("btn_pay");
        UtilsUI.setButtonIcon(btn_pay, VarVal.bonusType.chance, String(Number(lifeCardItem.money) / 100));
        btn_pay.onClick(() => {
            UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            }, lifeCardItem, VarVal.payType.others, VarVal.payOtherType.lifecard);
        })

        let btn_take:fgui.GButton = group_main.getChild("btn_take");
        PointRedData.getInstance().updateManualPoint(btn_take, true);
        btn_take.text = StrVal.LYPAY_RECHARGE.STR201;
        btn_take.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    let bonuseItems = UtilsUI.getMonthCardGiveBonuseItems(CARD_TYPE, MonthCardItemType.give_daily);
                    UtilsUI.showItemReward({bonuseItems:bonuseItems});
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "takePayCard", {
                type:Number(CARD_TYPE)
            });
        })

        let label_take:fgui.GTextField = group_main.getChild("label_take");
        label_take.text = StrVal.LYPAY_RECHARGE.STR200;

        this.refreshLifeCard();
    }

    private refreshLifeCard(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main", fgui.GComponent).getChild("group_life");

        let btn_pay:fgui.GButton = group_main.getChild("btn_pay");
        let btn_take:fgui.GButton = group_main.getChild("btn_take");
        let label_take:fgui.GButton = group_main.getChild("label_take");
        let img_take:fgui.GImage = group_main.getChild("img_take");

        btn_pay.visible = false;
        btn_take.visible = false;
        label_take.visible = false;
        img_take.visible = false;

        if (GameServerData.getInstance().isHaveLifeCard()) {
            let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
            btn_take.visible = (fullInfo.lifeCardTake != 1);
            label_take.visible = (fullInfo.lifeCardTake == 1);
            img_take.visible = true;
        } else {
            btn_pay.visible = true;
        }
    }

    public getIsViewMask():boolean {
        return false;
    }

    public static isViewRedPointMonth():boolean {
        if (GameServerData.getInstance().isHaveMonthCard()) {
            let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
            return (fullInfo.monthCardTake != 1);
        }
        return false;
    }

    public static isViewRedPointLife():boolean {
        if (GameServerData.getInstance().isHaveLifeCard()) {
            let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
            return (fullInfo.lifeCardTake != 1);
        }
        return false;
    }
}
