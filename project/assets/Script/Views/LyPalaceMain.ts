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
import { UtilsUI } from "../Kernel/UtilsUI";
import { LyChatRoom } from "./LyChatRoom";
import { LocaleData } from "../Kernel/LocaleData";
import { FguiGTween } from "../Kernel/FguiGTween";
import { LyGuideDetail } from "./LyGuideDetail";
import { StrVal } from "../Values/StrVal";
import { LyPalaceRoom } from "./LyPalaceRoom";
import { GameServerData } from "../Kernel/GameServerData";
import { GameServer } from "../Kernel/GameServer";
import { LyPalaceLike, PalaceLikeData } from "./LyPalaceLike";
import { UtilsTool } from "../Kernel/UtilsTool";
import { LyPalaceBuffStart } from "./LyPalaceBuffStart";
import { PointRedData } from "../Kernel/PointRedData";
import { LyPalaceShop } from "./LyPalaceShop";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { Rect } from "cc";

export class LyPalaceMain extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPalace;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyPalace;
        this.viewResI.comName = "LyPalaceMain";
    }

    private palaceItems:Array<any>;
    private group_chat: fgui.GComponent;

    public static isSkipPlayAni:boolean;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        // 关闭
        let btn_close = uiPanel.getChild("btn_close", fgui.GButton);
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPalaceMain, 0, null);
        })

        // 描述
        let btn_detail = uiPanel.getChild("btn_detail", fgui.GButton);
        btn_detail.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:StrVal.LYPALACE.STR12, detail:LocaleData.getPalaceRoot().detail});
        })

        // 天道
        let btn_shenyu = uiPanel.getChild("btn_shenyu", fgui.GButton);
        btn_shenyu.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:StrVal.LYPALACE.STR1, detail:LyGuideDetail.getTiandaoDesc()});
        })

        // 悬镜司
        let btn_xuanjinsi = uiPanel.getChild("btn_xuanjinsi", fgui.GButton);
        btn_xuanjinsi.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPalaceShop, 0, null);
        })

        // 点赞
        let btn_dianzan = uiPanel.getChild("btn_dianzan", fgui.GButton);
        let likeState:number;
        let updateCheck = () => {
            likeState = GameServerData.getInstance().getSelfPalaceLike(null);
            btn_dianzan.getController("c1").selectedIndex = (likeState == 1 ? 0 : 1);
            PointRedData.getInstance().updateManualPoint(btn_dianzan, likeState == 1);
        }
        updateCheck();
        btn_dianzan.onClick(() => {
            if (likeState == 2) {
                UtilsUI.showMsgTip(StrVal.LYPALACE.STR2);
            } else if (likeState == 1) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        updateCheck();
                        this.showLyPalaceLike(args.buffId, String(args.stone));
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "palaceLike", {
                    likeType: 1,
                    param: undefined
                })
            }
        })
        // 这个事件后到了，哎。
        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == VarVal.ACTIVITY_ID.PALACE) {
                updateCheck();
            }
        }, "activityStateChanged");

        // 宫殿
        this.palaceItems = LocaleData.getPalaceItems();
        for (let i = 0; i < this.palaceItems.length; i++) {
            let btn_house = group_main.getChild("btn_house" + String(i + 1), fgui.GButton);
            if (btn_house) { // 一般来讲是对应15个的。
                this.addTween(btn_house.getChild("group_title"), 1000 * ((i + 1) / this.palaceItems.length));

                let palaceItem = this.palaceItems[i];
                btn_house.text = palaceItem.name;
                btn_house.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPalaceRoom, 0, {palaceItem:palaceItem});
                })
            }
        }

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation("Stand", true);
        }, group_main.getChild("loader_spine"), VarVal.UI_EFF_NAME.spine_langyabang);

        if (LyPalaceMain.isSkipPlayAni) {
            LyPalaceMain.isSkipPlayAni = false;
        } else {
            this.touchable = false;
            this.setHousesVisible(group_main, false);
            new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                spp.playAnimation("animation", false, null, ()=>{
                    this.setHousesVisible(group_main, true);
                }, ()=>{
                    this.touchable = true;
                });
            }, uiPanel.getChild("loader_yunwu"), VarVal.UI_EFF_NAME.spine_yunwu_guochang);
        }

        this.group_chat = uiPanel.getChild("group_chat")
        this.group_chat.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyChatRoom, 0, {activityId:null});
        })
        this.showChatRoomLast();
    }

    private setHousesVisible(group_main:fgui.GComponent, bool:boolean) {
        for (let i = 0; i < this.palaceItems.length; i++) {
            let btn_house = group_main.getChild("btn_house" + String(i + 1), fgui.GButton);
            if (btn_house) { // 一般来讲是对应15个的。
                btn_house.visible = bool;
            }
        }
    }

    private showLyPalaceLike(buffId:number, likestone:string) {
        let doCallReward = () => {
            let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.stone, null, null, likestone);
            UtilsUI.showItemReward({
                bonuseItems:[bonuseItem],
                doneCall: () => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPalaceBuffStart, 0, {buffId:buffId});
                }
            });
        }
        let pppId:string;
        for (let i = 0; i < this.palaceItems.length; i++) {
            let palaceInfos = GameServerData.getInstance().getPalaceInfos(this.palaceItems[i].id);
            if (palaceInfos.length > 0) {
                pppId = palaceInfos[0].playerId;
                break;
            }
        }
        if (pppId) {
            let randItems = LocaleData.getPalaceGrantItems();
            let params:PalaceLikeData = {
                playerId: pppId,
                grantId: randItems[UtilsTool.random(0, randItems.length - 1)].id,
                stone: likestone,
                doneCall: doCallReward
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPalaceLike, 0, params);
        } else {
            doCallReward();
        }
    }

    private addTween(com:fgui.GComponent, delay:number) {
        let yyy = -30;
        let ttt = 1.5;
        this.setTimeout(() => {
            if (!com.isDisposed) {
                FguiGTween.new(com).by(ttt, {y:yyy}, {easing: fgui.EaseType.SineOut}).by(ttt, {y:-yyy}, {easing: fgui.EaseType.SineOut}).repeat().start();
            }
        }, delay)
    }

    // 聊天
    private showChatRoomLast(): void {
        let label_content = this.group_chat.getChild("label_content", fgui.GTextField);
        let chatmsg = LyChatRoom.getChatShowMainPage();
        if (chatmsg) {
            label_content.text = chatmsg;
        } else {
            label_content.text = "";
        }
    }

    public onViewShowFront(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let hitBtnHouse:fgui.GButton;
        for (let i = 0; i < this.palaceItems.length; i++) {
            let btn_house = group_main.getChild("btn_house" + String(i + 1), fgui.GButton);
            if (btn_house) { // 一般来讲是对应15个的。
                let likeState = GameServerData.getInstance().getSelfPalaceLike(this.palaceItems[i].id);
                PointRedData.getInstance().updateManualPoint(btn_house, likeState == 1);
                if (likeState == 1 && !hitBtnHouse) {
                    hitBtnHouse = btn_house;
                }
            }
        }
        // 滚动到红点位置。
        if (hitBtnHouse) {
            // group_main.scrollPane.scrollToView(hitBtnHouse, true, true); // 需要修正一下。
            let rect = new Rect();
            rect.x = hitBtnHouse.x;
            rect.y = hitBtnHouse.y - group_main.height / 3;
            rect.width = hitBtnHouse.width;
            rect.height = hitBtnHouse.height + group_main.height / 3;
            group_main.scrollPane.scrollToView(rect, true, true);
        }
    }

    /**
     * 当主界面要被某处刷新时。
     */
    public onViewUpdate(params: any): void {
        if (params && params.isChatRoomMsg) {
            this.showChatRoomLast();
        }
    }

    public static isViewRedPointDianZan():boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.palace)) {
            return false;
        }
        let likeState = GameServerData.getInstance().getSelfPalaceLike(null);
        return likeState == 1;
    }

    public static isViewRedPointRoom():boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.palace)) {
            return false;
        }
        let palaceItems = LocaleData.getPalaceItems();
        for (let i = 0; i < palaceItems.length; i++) {
            let likeState = GameServerData.getInstance().getSelfPalaceLike(palaceItems[i].id);
            if (likeState == 1) {
                return true;
            }
        }
        return false;
    }
}