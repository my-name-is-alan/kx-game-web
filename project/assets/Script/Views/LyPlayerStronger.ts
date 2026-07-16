//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { LocaleData } from "../Kernel/LocaleData";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI, simplePlayerBase } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyDetailAttr, LyDetailAttrType } from "./LyDetailAttr";
import { LyTheurgyInfoPlayer } from "./LyTheurgyInfoPlayer";
import { GameServerData } from "../Kernel/GameServerData";
import { LyPlayerTisp } from "./LyPlayerTisp";
import { LyGuideDetail } from "./LyGuideDetail";
import { LyTheurgyInfoStronger } from "./LyTheurgyInfoStronger";

export class LyPlayerStronger extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyPlayerInfo";
        this.viewResI.pkgName = "LyPlayerInfo";
        this.viewResI.comName = "LyPlayerStronger";
    }

    private uiPanel: fgui.GComponent
    private loader_quality: fgui.GLoader3D
    private loader_quality_eff
    private strongerData: any
    private isPraiseArr: any
    private praiseNumArr: any
    public onViewCreate(params): void {
        this.isPraiseArr = params.data.praise//是否点赞
        this.praiseNumArr = params.data.data//点赞数
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPlayerStronger, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPlayerStronger, 0, null);
        })
        this.uiPanel.getChild("label_bxl", fgui.GLabel).text = StrVal.LYPLAYERINFO.STR10
        // let btn_attrs = []
        this.strongerData = LocaleData.getStronger()
        let btn_zrm: fgui.GButton = this.uiPanel.getChild("btn_zrm")
        btn_zrm.text = StrVal.LYPLAYERINFO.STR16
        btn_zrm.onClick(() => {
            this.strongerData.sort((itemA, itemB) => {
                return this.praiseNumArr[Number(itemB.id) - 1] - this.praiseNumArr[Number(itemA.id) - 1]
            })
            this.getStronger()
            this.initialize(1)
        })
        let btn_zx: fgui.GButton = this.uiPanel.getChild("btn_zx")
        btn_zx.text = StrVal.LYPLAYERINFO.STR17
        btn_zx.onClick(() => {
            this.strongerData.sort((itemA, itemB) => {
                return Number(itemB.id) - Number(itemA.id)
            })
            this.getStronger()
            this.initialize(1)
        })
        let btn_tg: fgui.GButton = this.uiPanel.getChild("btn_tg")
        btn_tg.text = StrVal.LYPLAYERINFO.STR18
        btn_tg.onClick(() => {
            UtilsUI.showMsgTip(StrVal.LYPLAYERINFO.STR22);
        })
        let btn_syy: fgui.GButton = this.uiPanel.getChild("btn_syy")
        btn_syy.text = StrVal.LYPLAYERINFO.STR19
        btn_syy.onClick(() => {
            UtilsUI.showMsgTip(StrVal.LYPLAYERINFO.STR23);
        })
        let btn_xyy: fgui.GButton = this.uiPanel.getChild("btn_xyy")
        btn_xyy.text = StrVal.LYPLAYERINFO.STR20
        btn_xyy.onClick(() => {
            UtilsUI.showMsgTip(StrVal.LYPLAYERINFO.STR23);
        })
        this.loader_quality = this.uiPanel.getChild("loader_quality")
        this.loader_quality_eff = new SpinePlayer().loadSpine((spp: SpinePlayer) => {

        }, this.loader_quality, "jm_xialv_mingpai")
        this.getStronger()
        this.initialize(1)
    }
    private getStronger(): any {
        for (let i = 0; i < 7; i++) {
            let btn_attr: fgui.GButton = this.uiPanel.getChild("btn_attr" + (i + 1))
            if (i == 0) {
                btn_attr.selected = true
            }
            btn_attr.clearClick()
            btn_attr.onClick(() => {
                btn_attr.selected = true
                this.initialize(i + 1)
            })
            let attr = this.strongerData[i].attr
            let attrStrs = attr.split(";")
            let group_1: fgui.GGroup = btn_attr.getChild("group_1")
            let group_2: fgui.GGroup = btn_attr.getChild("group_2")
            group_1.visible = group_2.visible = false
            if (attrStrs.length > 1) {
                group_2.visible = true
                let label_name1: fgui.GLabel = btn_attr.getChild("label_name1")
                let label_name2: fgui.GLabel = btn_attr.getChild("label_name2")
                label_name1.text = LocaleData.getStrongerAttr(attrStrs[0]).name
                label_name2.text = LocaleData.getStrongerAttr(attrStrs[1]).name
            } else {
                group_1.visible = true
                let label_name: fgui.GLabel = btn_attr.getChild("label_name")
                label_name.text = LocaleData.getStrongerAttr(attrStrs[0]).name
            }
        }
    }
    private initialize(index: number): void {
        let strongerArr = this.strongerData[index - 1]
        let attr = strongerArr.attr
        let attrStrs = attr.split(";")
        let attrStr: string = ""
        for (let i = 0; i < attrStrs.length; i++) {
            const element = attrStrs[i];
            let data = LocaleData.getStrongerAttr(element)
            attrStr += data.name
            if (i != attrStrs.length - 1) {
                attrStr += "、"
            }
        }
        let label_attr: fgui.GLabel = this.uiPanel.getChild("label_attr")
        label_attr.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR11, [attrStr])
        let btn_praise: fgui.GButton = this.uiPanel.getChild("btn_praise")
        btn_praise.text = this.praiseNumArr[Number(strongerArr.id) - 1]
        btn_praise.clearClick()
        btn_praise.onClick(() => {
            if (this.isPraiseArr[Number(strongerArr.id) - 1] == 0) {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        this.isPraiseArr = args.praise//是否点赞
                        this.praiseNumArr = args.data//点赞数
                        btn_praise.text = this.praiseNumArr[Number(strongerArr.id) - 1]
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "strongerPraise", { praise: strongerArr.id })
            } else {
                UtilsUI.showMsgTip(StrVal.LYPLAYERINFO.STR21);
            }
        })
        let btn_detail: fgui.GButton = this.uiPanel.getChild("btn_detail")
        btn_detail.clearClick()
        btn_detail.onClick(() => {
            UtilsUI.showMsgTip(StrVal.LYPLAYERINFO.STR22);
            // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, { title: StrVal.LYPLAYERINFO.STR24, detail: strongerArr.info });
        })
        let btn_comment: fgui.GButton = this.uiPanel.getChild("btn_comment")
        btn_comment.clearClick()
        btn_comment.onClick(() => {
            UtilsUI.showMsgTip(StrVal.LYPLAYERINFO.STR22);
        })
        let gameOptions = LocaleData.getStrongerGameOptions(strongerArr.gameOptions)
        let label_gameOptions: fgui.GLabel = this.uiPanel.getChild("label_gameOptions")
        label_gameOptions.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR12, [gameOptions.name])
        let img_gameOptions: fgui.GLoader = this.uiPanel.getChild("img_gameOptions")
        img_gameOptions.url = UtilsTool.stringFormat("ui://CCommon/{0}", [gameOptions.image])
        let group_head: fgui.GComponent = this.uiPanel.getChild("group_head")
        let loader_icon: fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        // let playerInfo = data.playerInfo
        let charInfo = LocaleData.getCharShowResInfo("", 1, 1, strongerArr.playerImage);
        loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
        let label_name: fgui.GLabel = this.uiPanel.getChild("label_name")
        label_name.text = strongerArr.playerName
        let label_desc: fgui.GLabel = this.uiPanel.getChild("label_desc")
        label_desc.text = strongerArr.desc
        let label_serverid: fgui.GLabel = this.uiPanel.getChild("label_serverid")
        label_serverid.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR15, [strongerArr.server])
        //===============宠物====================
        let pet = LocaleData.getPetProto(strongerArr.pet)
        new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, this.uiPanel.getChild("loader_spine_pet"), pet.modelId);
        let btn_pet: fgui.GLoader = this.uiPanel.getChild("btn_pet")
        btn_pet.clearClick()
        btn_pet.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPlayerTisp, 0, { data: strongerArr.pet, type: 3 });
        })
        let img_quality: fgui.GLoader = this.uiPanel.getChild("img_quality")
        img_quality.url = UtilsTool.stringFormat("ui://CCommon/frame_name{0}", [pet.quality]);
        let label_petName: fgui.GTextField = this.uiPanel.getChild("label_petName")
        label_petName.text = UtilsTool.stringFormat("[color={0}]{1}[/color]", [UtilsUI.getQualityColor1(pet.quality), pet.name]);
        if (Number(pet.quality) > 3) {
            this.loader_quality_eff.playAnimation("hong+cheng", true)
        } else if (Number(pet.quality) > 2) {
            this.loader_quality_eff.playAnimation("zi", true)
        } else {
        }
        if (pet.quality > 3) {
            this.loader_quality.visible = true
        } else if (pet.quality > 2) {
            this.loader_quality.visible = true
        } else {
            this.loader_quality.visible = false
        }
        let elitemonster = strongerArr.eliteMonsters.split("@")
        this.elitemonsterIndex = 0
        this.onElitemonster(elitemonster[this.elitemonsterIndex])
        let btn_elite: fgui.GButton = this.uiPanel.getChild("btn_elite")
        btn_elite.clearClick()
        btn_elite.onClick(() => {
            if (this.elitemonsterIndex < elitemonster.length - 1) {
                this.elitemonsterIndex++
            } else {
                this.elitemonsterIndex = 0
            }
            this.onElitemonster(elitemonster[this.elitemonsterIndex])
        })
        let strongerAttrSet = LocaleData.getStrongerAttrSet(strongerArr.vein)
        let img_veinIcon: fgui.GLoader = this.uiPanel.getChild("img_veinIcon")
        img_veinIcon.url = UtilsTool.stringFormat("ui://LyPlayerInfo/{0}", [strongerAttrSet.icon]);
        let label_veinName: fgui.GLabel = this.uiPanel.getChild("label_veinName")
        label_veinName.text = strongerAttrSet.name
        let label_veinDec: fgui.GLabel = this.uiPanel.getChild("label_veinDec")
        label_veinDec.text = strongerAttrSet.desc
        let btn_vien: fgui.GLoader = this.uiPanel.getChild("btn_vien")
        btn_vien.clearClick()
        btn_vien.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPlayerTisp, 0, { data: strongerAttrSet.skillId, type: 2 });
        })
        //================神通==================
        let theurgyStr = strongerArr.theurgy
        let theurgyArr = theurgyStr.split(";")
        // let btn_treasure: fgui.GButton = this.uiPanel.getChild("btn_treasure")
        // btn_treasure.getChild("label_name").text = StrVal.LYMAINPAGE.STR21
        // let btn_arrows: fgui.GButton = uiPanel.getChild("btn_arrows")
        // btn_arrows.text = StrVal.LYPLAYERINFO.STR108
        // btn_arrows.onClick(() => {
        //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDetailAttr, 0, { type: LyDetailAttrType.MAINPAGE, attr: simpleBase.playerEntityAttr });
        // })

        // let theRoot: any = LocaleData.getTheurgyRoot();
        // let theurgies = params.battleTheurgy
        // let useTheurgs: any[] = new Array(4)
        // let typeTheurgs: any[] = new Array(4)
        // useTheurgs = new Array(4)
        // for (let index = 0; index < theurgies.length; index++) {
        //     let element = theurgies[index];
        //     if (element.status == 0) {
        //         typeTheurgs[Number(element.type) - 1].push(element)
        //     } else {
        //         useTheurgs[Number(element.type) - 1] = element
        //     }
        // }




        let loader_useTheurgy: fgui.GComponent[] = []
        for (let index = 0; index < 4; index++) {
            let loader_use: fgui.GComponent = this.uiPanel.getChild("loader_use" + index)
            loader_useTheurgy.push(loader_use)
        }
        // let group_theurgy: fgui.GComponent = this.uiPanel.getChild("group_theurgy")

        for (let index = 0; index < theurgyArr.length; index++) {
            let nowGroup: fgui.GComponent = loader_useTheurgy[index]
            let loader_icon: fgui.GLoader = nowGroup.getChild("loader_icon")
            let loader_qua: fgui.GLoader = nowGroup.getChild("loader_qua")
            let loader_part: fgui.GLoader = nowGroup.getChild("loader_part")
            let loader_seal1: fgui.GLoader = nowGroup.getChild("loader_seal1")
            let loader_seal2: fgui.GLoader = nowGroup.getChild("loader_seal2")
            let loaer_stage: fgui.GLoader = nowGroup.getChild("loaer_stage")
            let label_name: fgui.GLabel = nowGroup.getChild("label_name")
            let label_stage: fgui.GLabel = nowGroup.getChild("label_stage");
            let group_all: fgui.GGroup = nowGroup.getChild("all")
            nowGroup.getChild("label_partName", fgui.GLabel).text = StrVal.LYTHEURGYNMAE2[index]
            // if (useTheurgs[index] != undefined) {
            //     group_all.visible = true
            //     let theurgyInst = useTheurgs[index]
            let theProto = LocaleData.getTheurgyById(theurgyArr[index]);
            loader_icon.url = UtilsUI.getTheurgyIconUrl(theProto);
            loader_part.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_yuan{0}", [theProto.quality])
            loaer_stage.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_grade{0}", [theProto.quality])
            loader_qua.url = UtilsTool.stringFormat("ui://LyTheurgy/frame_mj{0}", [theProto.quality])
            label_name.text = theProto.name
            // label_stage.text = theurgyInst.level
            let pahasePorto = LocaleData.getTheurgPhase(10000)
            label_stage.text = pahasePorto.levelCap
            nowGroup.clearClick()
            nowGroup.onClick(() => {
                let theurgyInst = {
                    cfgId: theurgyArr[index],
                    level: pahasePorto.levelCap,
                    phase: pahasePorto.phase,
                    frag: "",
                    type: index + 1,
                    status: "",
                    seal: "",
                }
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyTheurgyInfoStronger, 0, { theurgyInst: theurgyInst })
            })
            loader_seal1.visible = false
            loader_seal2.visible = false
            // }
            // else {
            //     group_all.visible = false
            // }
        }
    }
    private elitemonsterIndex: number = 0
    private onElitemonster(elitemonsterStr): void {
        let list_elite: fgui.GList = this.uiPanel.getChild("list_elite")
        let elitemonster = elitemonsterStr.split(";")
        let data = []
        for (let i = 0; i < elitemonster.length; i++) {
            const element = elitemonster[i];
            let eliteMonsterLevel = LocaleData.getEliteMonsterLevel(element, 9999)
            let item = {
                protoId: element,
                level: eliteMonsterLevel.level
            }
            data.push(item)
        }
        list_elite.numItems = 0
        list_elite.itemRenderer = ((index: number, child: fgui.GComponent) => {
            let mosterData = elitemonster[index];
            let eliteMonsterLevel = LocaleData.getEliteMonsterLevel(mosterData, 9999)
            let monProto = LocaleData.getEliteMonsterProto(mosterData)
            let label_name: fgui.GLabel = child.getChild("label_name")
            label_name.text = monProto.name
            let item_elite: fgui.GComponent = child.getChild("item_elite")
            let loader_back: fgui.GLoader = item_elite.getChild("loader_back");
            loader_back.url = UtilsTool.stringFormat("ui://CCommon/item_back{0}", [monProto.quality]);
            let laoder_icon: fgui.GLoader = item_elite.getChild("loader_icon");
            laoder_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getModelShowInfo(monProto.modelId).icon_square]);
            let label_count: fgui.GLabel = item_elite.getChild("label_count");

            label_count.text = UtilsTool.stringFormat(StrVal.LYPLAYERINFO.STR4, [eliteMonsterLevel.level])
            child.clearClick()
            child.onClick(() => {
                let clickData = {
                    data: data,
                    index: index
                }
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPlayerTisp, 0, { data: clickData, type: 1 });
            })
        }).bind(this)
        list_elite.numItems = elitemonster.length
    }


    public getIsViewMask(): boolean {
        return false;
    };

}