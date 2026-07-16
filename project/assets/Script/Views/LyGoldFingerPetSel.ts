//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { VarVal } from "../Values/VarVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { StrVal } from "../Values/StrVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServer } from "../Kernel/GameServer";
import { LocaleData } from "../Kernel/LocaleData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { LyPetDevourpet } from "./LyPetDevourpet";
import { LyPetTisp } from "./LyPetTisp";

export class LyGoldFingerPetSel extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.comName = "LyGoldFingerPetSel";
    }

    levelItem:any;
    levelDatas:Array<any>
    itemInsts:Array<any>;
    lastSelect:number;

    petProtos:Array<any>;
    selDstIndex:number;
    dstProto:any;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        group_main.visible = true;
        UtilsUI.playCommonGroupAni(group_main);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGoldFingerPetSel, 0, null);
        })

        let btn_close: fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_title = group_main.getChild("label_title", fgui.GTextField);
        label_title.text = StrVal.LYGOLDFINGER.STR401;
        let label_desc = group_main.getChild("label_desc", fgui.GTextField);
        label_desc.text = StrVal.LYGOLDFINGER.STR402;
        let label_empty = group_main.getChild("label_empty", fgui.GTextField);
        label_empty.text = StrVal.LYGOLDFINGER.STR406;

        this.levelItem = params.levelItem;
        this.levelDatas = this.levelItem.data.split(",");
        this.itemInsts = GameServerData.getInstance().getPetInstsByQuality(this.levelDatas[0]);

        group_main.getChild("group_empty").visible = (this.itemInsts.length == 0);

        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.setVirtual();
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            let graph_frame = child.getChild("graph_frame", fgui.GGraph);
            graph_frame.clearClick();
            graph_frame.onClick(() => {
                let todayCanSel = LocaleData.getGoldFingerLevelItemMax(this.levelItem) - GameServerData.getInstance().getGoldFingerLevelItemCount(this.levelItem.functionType);
                if (todayCanSel == 0) {
                    return UtilsUI.showMsgTip(StrVal.LYGOLDFINGER.STR405);
                }

                this.lastSelect = index;
                this.updatePage2Desc(this.itemInsts[this.lastSelect]);
                group_main.visible = false;
                this.changePage2();
            })

            let itemInst = this.itemInsts[index];

            child.getChild("label_name").text = itemInst.proto.name;
            child.getChild("label_level").text = UtilsTool.stringFormat(StrVal.LYPET.STR9, [itemInst.level])

            let group_model = child.getChild("group_model", fgui.GComponent);
            group_model.getChild("img_quality", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyPet/frame{0}", [itemInst.proto.quality]);
            new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
            }, group_model.getChild("loader_spine"), itemInst.proto.modelId);

            LyPetDevourpet.onPetGroup(child, itemInst);
        }
        UtilsUI.setFguiGlistDelayNumItems(list_item, this.itemInsts.length);

        if (this.itemInsts.length > 0) {
            this.initPage2();
            this.initPage3();
        }
    }

    private updatePage2Desc(itemInst:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main2");

        let proto = itemInst.proto;
        if (!proto) {
            proto = itemInst;
        }

        let label_recruitingAttr1: fgui.GTextField = group_main.getChild("label_recruitingAttr1");
        let label_recruitingAttr2: fgui.GTextField = group_main.getChild("label_recruitingAttr2");
        let label_recruitingAttr3: fgui.GTextField = group_main.getChild("label_recruitingAttr3");
        if (itemInst.proto) {
            label_recruitingAttr1.text = UtilsTool.stringFormat(StrVal.LYPET.STR1, [itemInst.healthPercentage]);
            label_recruitingAttr2.text = UtilsTool.stringFormat(StrVal.LYPET.STR2, [itemInst.attackPercentage]);
            label_recruitingAttr3.text = UtilsTool.stringFormat(StrVal.LYPET.STR3, [itemInst.defensePercentage]);
        } else {
            let attrs = LocaleData.getPetMaxAttr(proto.id, 1, 0);
            label_recruitingAttr1.text = UtilsTool.stringFormat(StrVal.LYPET.STR1, [attrs[0]]);
            label_recruitingAttr2.text = UtilsTool.stringFormat(StrVal.LYPET.STR2, [attrs[1]]);
            label_recruitingAttr3.text = UtilsTool.stringFormat(StrVal.LYPET.STR3, [attrs[2]]);
        }

        let label_level: fgui.GTextField = group_main.getChild("label_level");
        label_level.text = UtilsTool.stringFormat(StrVal.LYPET.STR134, [6 - Number(LocaleData.getPetLevelByIdLevel1(proto.id, "1")), ""]);

        let petLevel: any = LocaleData.getPetLevelByIdLevel(proto.id, "1");
        group_main.getChild("label_desc", fgui.GTextField).text = LocaleData.getSkillProto(petLevel.skill_id).desc;
    }

    private initPage2():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main2");

        let btn_close: fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGoldFingerPetSel, 0, null);
        })

        let label_title = group_main.getChild("label_title", fgui.GTextField);
        label_title.text = StrVal.LYGOLDFINGER.STR403;

        let btn_comfirm = group_main.getChild("btn_comfirm", fgui.GButton);
        btn_comfirm.text = StrVal.COMMON.STR33;
        btn_comfirm.onClick(() => {
            let itemInst = this.itemInsts[this.lastSelect];
            if (!itemInst) {
                return UtilsUI.showMsgTip(StrVal.LYGOLDFINGER.STR404);
            }
            let protoId:number;
            if (this.levelDatas[1] == "0") {
                // 随机
            } else {
                if (this.dstProto) {
                    protoId = Number(this.dstProto.id);
                } else {
                    return UtilsUI.showMsgTip(StrVal.LYGOLDFINGER.STR404);
                }
            }

            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPetTisp, 0, {
                        type: 1,
                        pet: args.pet
                    });
                    btn_close.fireClick();
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "replacePetInst", {
                petId:itemInst.id,
                protoId:protoId
            });
        })
    }

    private changePage2():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main2");
        group_main.visible = true;

        let itemInst = this.itemInsts[this.lastSelect];
        if (this.dstProto && this.dstProto.id == itemInst.proto.id) {
            this.dstProto = undefined;
        }

        let group_model = group_main.getChild("group_model", fgui.GComponent);
        let img_quality: fgui.GLoader = group_model.getChild("img_quality");
        img_quality.url = UtilsTool.stringFormat("ui://LyPet/frame{0}", [itemInst.proto.quality]);
        let img_quality2: fgui.GLoader = group_model.getChild("img_quality2");
        img_quality2.url = UtilsTool.stringFormat("ui://LyPet/qualityItem{0}", [itemInst.proto.quality]);
        group_model.getChild("label_name").text = itemInst.proto.name;
        new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
        }, group_model.getChild("loader_spine"), itemInst.proto.modelId);
        group_model.clearClick();
        group_model.onClick(() => {
            group_main.visible = false;
            uiPanel.getChild("group_main").visible = true;
        })

        let group_model2 = group_main.getChild("group_model2", fgui.GComponent);
        let img_quality_2: fgui.GLoader = group_model2.getChild("img_quality");
        img_quality_2.url = img_quality.url;
        let img_quality2_2: fgui.GLoader = group_model2.getChild("img_quality2")
        img_quality2_2.url = img_quality2.url;
        group_model2.getChild("label_name").text = "";
        group_model2.clearClick();

        let controller = group_model2.getController("c1");
        if (this.levelDatas[1] == "0") {
            controller.selectedIndex = 1;
            group_model2.getChild("loader_spine", fgui.GLoader3D).freeSpine();
        } else {
            if (this.dstProto) {
                controller.selectedIndex = 0;
                group_model2.getChild("label_name").text = this.dstProto.name;
                new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                }, group_model2.getChild("loader_spine", fgui.GLoader3D), this.dstProto.modelId);
            } else {
                controller.selectedIndex = 2;
                group_model2.getChild("loader_spine", fgui.GLoader3D).freeSpine();
            }
            group_model2.onClick(() => {
                group_main.visible = false;
                uiPanel.getChild("group_main3").visible = true;

                this.petProtos = LocaleData.getPetProtosByQuality(this.levelDatas[0], itemInst.proto.id);
                UtilsUI.setFguiGlistDelayNumItems(uiPanel.getChild("group_main3", fgui.GComponent).getChild("list_item"), this.petProtos.length);
                if (this.petProtos.length > 0 && this.selDstIndex == undefined) {
                    this.setSelectIdx(0);
                }
            })
        }
    }

    private initPage3():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main3");

        if (this.levelDatas[1] != "0") {
            group_main.getChild("label_title", fgui.GTextField).text = StrVal.LYGOLDFINGER.STR401;
            group_main.getChild("label_sub", fgui.GTextField).text = StrVal.LYGOLDFINGER.STR407;

            let btn_comfirm = group_main.getChild("btn_comfirm", fgui.GButton);
            btn_comfirm.text = StrVal.COMMON.STR33;
            btn_comfirm.onClick(() => {
                this.updatePage2Desc(this.dstProto);
                group_main.visible = false;
                this.changePage2();
            })

            // 列表
            let list_item:fgui.GList = group_main.getChild("list_item");
            list_item.setVirtual();
            list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                let proto = this.petProtos[index];
                let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, proto.id, "0");
                UtilsUI.setUIGroupItem(bonuseItem, child, () => {
                    if (index != this.selDstIndex) {
                        this.setSelectIdx(index);
                    }
                }, true);
            }
        }
    }

    private setSelectIdx(index:number):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main3");

        this.selDstIndex = index;
        this.dstProto = this.petProtos[this.selDstIndex];
        // 大选中状态。
        let list_item:fgui.GList = group_main.getChild("list_item");
        let childIdx = list_item.itemIndexToChildIndex(this.selDstIndex);
        for (let i: number = 0; i < list_item.numChildren; i++) {
            let __child: fgui.GComponent = list_item.getChildAt(i);
            let btn_frame:fgui.GButton = __child.getChild("btn_frame");
            btn_frame.mode = fgui.ButtonMode.Check; // 选中才会显示选中框
            btn_frame.selected = (i == childIdx);
        }

        group_main.getChild("label_name", fgui.GTextField).text = this.dstProto.name;
        group_main.getChild("label_level", fgui.GTextField).text = UtilsTool.stringFormat(StrVal.LYPET.STR9, ["1"]);
        let petLevel: any = LocaleData.getPetLevelByIdLevel(this.dstProto.id, "1");
        group_main.getChild("label_desc", fgui.GTextField).text = LocaleData.getSkillProto(petLevel.skill_id).desc;

        let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.dstProto.id, "0");
        UtilsUI.setUIGroupItem(bonuseItem, group_main.getChild("group_item"), () => {
            //
        }, true);
    }

    public getIsViewMask():boolean {
        return false;
    }
}