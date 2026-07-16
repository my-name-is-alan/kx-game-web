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
import { UtilsUI } from "../Kernel/UtilsUI";
import { StrVal } from "../Values/StrVal";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { AudioManager } from "../Kernel/AudioManager";
import { LyGuideFullTips } from "./LyGuideFullTips";
import { FguiGTween } from "../Kernel/FguiGTween";
import { Vec2 } from "cc";
import { LocaleUser } from "../Kernel/LocaleUser";

export class LyPaySevenGiftGroup extends ViewLayer {
    public onConstructor(params:any) {
        let comName = "LyPaySevenGiftGroup" + params.activeGroups[0].giftItems[0].background.split(",")[0];
        this.viewResI.resName = comName;
        this.viewResI.pkgName = comName;
        this.viewResI.comName = comName;
    }

    private timeCall:Function;
    private activeGroups:Array<any>;

    private giftItems:Array<any>;
    private giftIndex:number;
    private lastTime:number;

    private spineRMPlayer:SpineRoldMountPlayer;
    private spineRMPlayer2:SpineRoldMountPlayer;

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPaySevenGiftGroup, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_time:fgui.GButton = group_main.getChild("label_time");
        this.timeCall = () => {
            let remain = this.lastTime - GameServerData.getInstance().getServerTime();
            let strr:string;
            if (this.viewResI.comName == VarVal.PACKAGE_FGUIS.LyPaySevenGiftGroup3) {
                strr = StrVal.LYPAY_SEVEBGIFTGROUP.STR4;
            } else {
                strr = StrVal.LYPAY_SEVEBGIFTGROUP.STR1;
            }
            label_time.text = UtilsTool.stringFormat(strr, [UtilsTool.splitTimeString(remain)]);
        }
        this.setInterval(this.timeCall, 1000);
        this.timeCall();

        let btn_pay:fgui.GButton = group_main.getChild("btn_pay");
        btn_pay.onClick(() => {
            UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            }, this.giftItems[this.giftIndex], VarVal.payType.gift, VarVal.payGiftType.openGift);
        })

        this.onViewUpdate(null);

        if (this.viewResI.comName == VarVal.PACKAGE_FGUIS.LyPaySevenGiftGroup4) {
            for (let i = 0; i < 3; i++) {
                let group_skill:fgui.GComponent = group_main.getChild("group_skill" + String(i + 1));
                this.addTween(group_skill, i);
            }
        }
    }

    private addTween(com:fgui.GComponent, idx:number){
        let yyy = 30;
        let ttt = 4;
        this.setTimeout(() => {
            if (!com.isDisposed) {
                let tw = FguiGTween.new(com).by(ttt, {y:yyy}, {easing: fgui.EaseType.SineOut}).by(ttt, {y:-yyy}, {easing: fgui.EaseType.SineOut}).repeat().start();
            }
        }, 1000 * ((idx + 1) / 10))
    }

    public onViewUpdate(params: any): void {
        this.activeGroups = LocaleData.getActiveSevenGiftGroups();
        if (params && params.isNewDay) {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH_MULTI, LyPaySevenGiftGroup, 0, {activeGroups:this.activeGroups});
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPaySevenGiftGroup, this.getViewUuid(), null);
        } else {
            this.refreshCurrGroup();
        }
    }

    private refreshCurrGroup():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let activeGroup = this.activeGroups[0];
        this.giftItems = activeGroup.giftItems;

        // 档次列表
        let list_group:fgui.GList = group_main.getChild("list_group");
        list_group.itemRenderer = (index:number, btn_switch:fgui.GButton) => {
            let giftItem = this.giftItems[index];
            let gift = GameServerData.getInstance().getPaySevenGiftGroupRecord(giftItem.id);
            if (gift && gift.count >= Number(giftItem.buyCount)) {
                btn_switch.text = StrVal.LYPAY_SEVEBGIFTGROUP.STR2;
                btn_switch.grayed = true;
            } else {
                UtilsUI.setPayItemButtonName(btn_switch, giftItem);
                btn_switch.grayed = false;
            }
            btn_switch.clearClick();
            btn_switch.onClick(() => {
                if (this.giftIndex != index) {
                    this.giftIndex = index;
                    this.refreshCurrPayItem();
                }
            })
        }
        list_group.numItems = activeGroup.giftItems.length;

        if (!this.giftIndex) {
            this.giftIndex = 0;
        }
        if (this.giftIndex >= this.giftItems.length) {
            this.giftIndex = this.giftItems.length - 1;
        }
        this.refreshCurrPayItem();
    }

    private refreshCurrPayItem():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let list_group:fgui.GList = group_main.getChild("list_group");
        let childIdx = list_group.itemIndexToChildIndex(this.giftIndex);
        for (let i: number = 0; i < list_group.numChildren; i++) {
            let btn_frame: fgui.GButton = list_group.getChildAt(i);
            // btn_frame.enabled = (i != childIdx);
            btn_frame.selected = (i == childIdx);
            let style = 3;
            if (this.viewResI.comName == VarVal.PACKAGE_FGUIS.LyPaySevenGiftGroup1) {
                style = 3;
            } else if (this.viewResI.comName == VarVal.PACKAGE_FGUIS.LyPaySevenGiftGroup2) {
                style = 4;
            } else if (this.viewResI.comName == VarVal.PACKAGE_FGUIS.LyPaySevenGiftGroup3
                || this.viewResI.comName == VarVal.PACKAGE_FGUIS.LyPaySevenGiftGroup4) {
                style = 5;
            }
            UtilsUI.updateTabButtonColor(btn_frame, style);
        }

        let giftItem = this.giftItems[this.giftIndex];
        let bonuseItems = LocaleData.getPayChooseBonuseItemsByGroup(giftItem.fixItems);

        // giftItem.background = "1,20043,2,0,0";
        // giftItem.desc = "反击连击";

        let descRate:string = "";
        if (this.viewResI.comName == VarVal.PACKAGE_FGUIS.LyPaySevenGiftGroup3) {
            let ddd = giftItem.desc.split(";");
            descRate = ddd[0];
            let label_desc:fgui.GTextField = group_main.getChild("label_desc");
            label_desc.text = ddd[1];
            let label_desc2:fgui.GTextField = group_main.getChild("label_desc2");
            label_desc2.text = ddd[2];

            let btn_detail:fgui.GButton = group_main.getChild("btn_detail");
            btn_detail.clearClick();
            let btn_detail2:fgui.GButton = group_main.getChild("btn_detail2");
            btn_detail2.clearClick();

            if (!this.spineRMPlayer) {
                this.spineRMPlayer = new SpineRoldMountPlayer(group_main.getChild("group_spine_ram"));
            }
            if (!this.spineRMPlayer2) {
                this.spineRMPlayer2 = new SpineRoldMountPlayer(group_main.getChild("group_spine_ram2"));
            }
            if (giftItem.background && giftItem.background.length > 0) {
                let bbbsss = giftItem.background.split(";");
                if (bbbsss[0]) {
                    let loader_spine_role = group_main.getChild("group_spine_ram", fgui.GComponent).getChild("loader_spine_role");
                    let ttt = bbbsss[0].split(",");
                    if (ttt[2]) {
                        let scaleX = Number(ttt[2]);
                        loader_spine_role.setScale(scaleX, scaleX);
                    }
                    if (ttt[3]) {
                        loader_spine_role.x = Number(ttt[3]);
                    }
                    if (ttt[4]) {
                        loader_spine_role.y = 0 - Number(ttt[4]);
                    }
                    let petProto = LocaleData.getPetProto(ttt[1]);
                    this.spineRMPlayer.loadSpineRole(LocaleData.getModelShowInfo(petProto.modelId), (smp:SpineRoldMountPlayer) => {
                        smp.getRolePlayer().playAnimation(VarVal.SPINE_ANI_NAME.stand_poss, true);
                        smp.getRolePlayer().setSkeInerFlipX(true);
                    })
        
                    let label_name:fgui.GTextField = group_main.getChild("label_name");
                    label_name.text = petProto.name;

                    btn_detail.onClick(() => {
                        ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideFullTips, 0, {
                            protoId:petProto,
                            pos:btn_detail.localToGlobal(0, 0),
                            size:new Vec2(btn_detail.width, btn_detail.height)
                        });
                    })
                }
                if (bbbsss[1]) {
                    let loader_spine_role = group_main.getChild("group_spine_ram2", fgui.GComponent).getChild("loader_spine_role");
                    let ttt = bbbsss[1].split(",");
                    if (ttt[2]) {
                        let scaleX = Number(ttt[2]);
                        loader_spine_role.setScale(scaleX, scaleX);
                    }
                    if (ttt[3]) {
                        loader_spine_role.x = Number(ttt[3]);
                    }
                    if (ttt[4]) {
                        loader_spine_role.y = 0 - Number(ttt[4]);
                    }
                    let petProto = LocaleData.getPetProto(ttt[1]);
                    this.spineRMPlayer2.loadSpineRole(LocaleData.getModelShowInfo(petProto.modelId), (smp:SpineRoldMountPlayer) => {
                        smp.getRolePlayer().playAnimation(VarVal.SPINE_ANI_NAME.stand_poss, true);
                    })
        
                    let label_name2:fgui.GTextField = group_main.getChild("label_name2");
                    label_name2.text = petProto.name;

                    btn_detail2.onClick(() => {
                        ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideFullTips, 0, {
                            protoId:petProto,
                            pos:btn_detail2.localToGlobal(0, 0),
                            size:new Vec2(btn_detail2.width, btn_detail2.height)
                        });
                    })
                }
            } else {
                this.spineRMPlayer.loadSpineRole(null);
                this.spineRMPlayer2.loadSpineRole(null);
            }
        } else if (this.viewResI.comName == VarVal.PACKAGE_FGUIS.LyPaySevenGiftGroup4) {
            let ddd = giftItem.desc.split(",");
            descRate = ddd[0];
            let label_desc:fgui.GTextField = group_main.getChild("label_desc");
            label_desc.text = ddd[2];
            let label_name:fgui.GTextField = group_main.getChild("label_name");
            label_name.text = ddd[1];

            let protoIds:Array<string>;
            if (giftItem.background && giftItem.background.length > 0) {
                let prottt:string = giftItem.background.split(",")[1];
                protoIds = prottt.split("-");
            }
            for (let i = 0; i < 3; i++) {
                let group_skill:fgui.GComponent = group_main.getChild("group_skill" + String(i + 1));
                if (protoIds && protoIds[i]) {
                    group_skill.visible = true;
                    let proto = LocaleData.getTheurgyById(protoIds[i]);
                    group_skill.getChild("label_name", fgui.GTextField).text = proto.name;
                    group_skill.getChild("loader_icon", fgui.GLoader).url = UtilsUI.getTheurgyIconUrl(proto);
                    let loader_detail = group_skill.getChild("loader_detail", fgui.GLoader);
                    loader_detail.clearClick();
                    loader_detail.onClick(() => {
                        ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideFullTips, 0, {
                            protoId:proto,
                            pos:loader_detail.localToGlobal(0, 0),
                            size:new Vec2(loader_detail.width, loader_detail.height)
                        });
                    });
                } else {
                    group_skill.visible = false;
                }
            }
        } else {
            let ddd = giftItem.desc.split(";");
            descRate = ddd[0];
            let label_desc:fgui.GTextField = group_main.getChild("label_desc");
            label_desc.text = ddd[1];

            let btn_detail:fgui.GButton = group_main.getChild("btn_detail");
            btn_detail.clearClick();

            if (!this.spineRMPlayer) {
                this.spineRMPlayer = new SpineRoldMountPlayer(group_main.getChild("group_spine_ram"));
            }
            if (giftItem.background && giftItem.background.length > 0) {
                let loader_spine_role = group_main.getChild("group_spine_ram", fgui.GComponent).getChild("loader_spine_role");
                let ttt = giftItem.background.split(",");
                if (ttt[2]) {
                    let scaleX = Number(ttt[2]);
                    loader_spine_role.setScale(scaleX, scaleX);
                }
                if (ttt[3]) {
                    loader_spine_role.x = Number(ttt[3]);
                }
                if (ttt[4]) {
                    loader_spine_role.y = 0 - Number(ttt[4]);
                }
                let eliteProto = LocaleData.getEliteMonsterProto(ttt[1]);
                this.spineRMPlayer.loadSpineRole(LocaleData.getModelShowInfo(eliteProto.modelId), (smp:SpineRoldMountPlayer) => {
                    smp.getRolePlayer().playAnimation(VarVal.SPINE_ANI_NAME.stand_poss, true);
                })//.loadSpineMount(mountInfo);
    
                let label_name:fgui.GTextField = group_main.getChild("label_name");
                label_name.text = eliteProto.name;

                btn_detail.onClick(() => {
                    ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideFullTips, 0, {
                        protoId:eliteProto,
                        pos:btn_detail.localToGlobal(0, 0),
                        size:new Vec2(btn_detail.width, btn_detail.height),
                        style:this.viewResI.comName
                    });
                })
            } else {
                this.spineRMPlayer.loadSpineRole(null);
            }
        }

        // 列表奖励
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
        }
        list_item.numItems = bonuseItems.length;

        let img_arrow = group_main.getChild("img_arrow", fgui.GComponent);
        img_arrow.getChild("label_name", fgui.GTextField).text = descRate;
        this._partner.callLater(() => { // 初始化的时候是x=0？疯了
            let child: fgui.GComponent = list_item.getChildAt(list_item.numChildren - 1);
            let pos = child.localToGlobal(child.width, 0);
            pos = group_main.globalToLocal(pos.x, pos.y);
            img_arrow.x = pos.x; // 列表居中后，不能用相对位置相加，只能计算pos。
        });

        UtilsUI.setPayItemRebateComp(group_main.getChild("group_rebeatfan"), giftItem);

        let gift = GameServerData.getInstance().getPaySevenGiftGroupRecord(giftItem.id);
        if (false) {
            this.lastTime = gift.expiredTime;
        } else {
            this.lastTime = UtilsTool.getNextDateTime(GameServerData.getInstance().getServerTime() * 1000) / 1000;
        }
        this.timeCall();
        let btn_pay = UtilsUI.setPayItemButtonName(group_main.getChild("btn_pay"), giftItem);
        if (gift && gift.count >= Number(giftItem.buyCount)) {
            btn_pay.enabled = false;
        } else {
            btn_pay.enabled = true;
        }

        let label_count:fgui.GTextField = group_main.getChild("label_count");
        label_count.text = UtilsTool.stringFormat(StrVal.LYPAY_SEVEBGIFTGROUP.STR3, [Number(giftItem.buyCount) - gift.count, giftItem.buyCount]);
    }
    
    public getIsViewMask():boolean {
        return false;
    }

    public static isSevenGiftGroupsOpen():boolean {
        let sevenGroups = LocaleData.getActiveSevenGiftGroups(true);
        if (sevenGroups.length > 0 && GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.pet)) {
            return true;
        }
        return false;
    }

    public static isViewRedPoint():boolean {
        if (LyPaySevenGiftGroup.isSevenGiftGroupsOpen()) {
            let dateStr = UtilsTool.TimeToDateStr(GameServerData.getInstance().getServerTime());
            if (dateStr != LocaleUser.getUser(VarVal.FIELD_SV.PAY_SEVENTGIFTGROUP)) {
                return true;
            }
        }
        return false;
    }
}