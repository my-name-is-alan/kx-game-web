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
import { GameServerData } from "../Kernel/GameServerData";
import { StrVal } from "../Values/StrVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { PointRedData } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { AudioManager } from "../Kernel/AudioManager";
import { LyActivityOpenRank, openRankItem } from "./LyActivityOpenRank";
import { LocaleData } from "../Kernel/LocaleData";

export class LyActivityOpenRankRecord extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyActivityOpenRank;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyActivityOpenRank;
        this.viewResI.comName = "LyActivityOpenRankRecord";
    }

    private TITLE_imgS = [
        "word_xialv·1-2",
        "word_xialv·2-2",
        "word_menke·1-2",
        "word_menke·2-2",
        "word_miji·1-2",
        "word_miji·2-2"
    ];

    private TITLE_bgS = [
        "frame_ranklist_xialv·1",
        "frame_ranklist_xialv·2",
        "frame_ranklist_menke·1",
        "frame_ranklist_menke·2",
        "frame_ranklist_miji·1",
        "frame_ranklist_miji·2"
    ];
    
    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
        }, group_main.getChild("loader_effect"), VarVal.UI_EFF_NAME.spine_qingdian_denglong);

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
        }, group_main.getChild("loader_effect3"), VarVal.UI_EFF_NAME.spine_qingdian_niao);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityOpenRankRecord, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        // list_item.setVirtual();
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            let loader_bg:fgui.GLoader = child.getChild("loader_bg");
            loader_bg.url = UtilsTool.stringFormat("ui://LyActivityOpenRank/{0}", [this.TITLE_bgS[index]]);
            let loader_title:fgui.GLoader = child.getChild("loader_title");
            loader_title.url = UtilsTool.stringFormat("ui://LyActivityOpenRank/{0}", [this.TITLE_imgS[index]]);

            let openDay = GameServerData.getInstance().getServerCreateDay();
            let day = index + 1;

            let label_desc = child.getChild("label_desc", fgui.GTextField);
            if (day < openDay) {
                label_desc.text = StrVal.ACTIVITY_OPENRANK.STR41;
            } else if (day == openDay) {
                let timeCall = () => {
                    let serverTime = GameServerData.getInstance().getServerTime() * 1000;
                    let lastTime:number = UtilsTool.getNextDateTime(serverTime);
                    label_desc.text = UtilsTool.stringFormat(StrVal.ACTIVITY_OPENRANK.STR42, [UtilsTool.splitTimeString((lastTime - serverTime) / 1000, true)]);
                }
                this.setInterval(timeCall, 1000)
                timeCall();
            } else {
                let timeCall = () => {
                    let serverTime = GameServerData.getInstance().getServerTime() * 1000;
                    let lastTime:number = UtilsTool.getNextDateTime(serverTime, day - openDay);
                    label_desc.text = UtilsTool.stringFormat(StrVal.ACTIVITY_OPENRANK.STR43, [UtilsTool.splitTimeString((lastTime - serverTime) / 1000, true)]);
                }
                this.setInterval(timeCall, 1000)
                timeCall();
            }

            PointRedData.getInstance().updateManualPoint(child, LyActivityOpenRank.isCanTakeDayBonuse(day) == 1);
            child.clearClick();
            if (day <= openDay) {
                GameServer.getInstance().send((args: any) => {
                    if (!this.isDisposed) {
                        if (args.errorcode == 0) {
                            let group_head:fgui.GComponent = child.getChild("group_head");
                            let datds:Array<openRankItem> = args.data;
                            for (let i = 0; i < datds.length; i++) {
                                if (datds[i].rank == 1) {
                                    let rankItem = datds[i];
                                    let charInfo = LocaleData.getCharShowResInfo(rankItem.character, rankItem.phase, rankItem.appearance, rankItem.avatar);
                                    let loader_icon:fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
                                    loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
                                    let btn_frame:fgui.GButton = group_head.getChild("btn_frame");
                                    btn_frame.clearClick();
                                    btn_frame.onClick(() => {
                                        UtilsUI.onShowPlayerInfo(rankItem.guid);
                                    })

                                    let label_name:fgui.GTextField = child.getChild("label_name");
                                    label_name.text = rankItem.name;
                                    label_name.strokeColor = UtilsUI.getRankColor(1);

                                    group_head.visible = true;
                                    label_name.visible = true;
                                    break;
                                }
                            }
                            child.getChild("img_xuwei").visible = !group_head.visible;
                        } else {
                            child.getChild("img_xuwei").visible = true;
                        }
                    }
                }, "viewOpenRanks", {
                    page:1,
                    day:day
                });

                child.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyActivityOpenRank, 0, {day:day});
                    btn_back.fireClick();
                })
            } else {
                child.getChild("img_xuwei").visible = true;
                child.getChild("img_lock").visible = true;
            }
        }
        list_item.numItems = this.TITLE_imgS.length;
    }

    public getIsViewMask():boolean {
        return false;
    }
}