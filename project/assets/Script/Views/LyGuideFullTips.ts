//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { LyEliteInfo } from "./LyEliteInfo";

export class LyGuideFullTips extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGuideFullTips;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyGuideFullTips;
        this.viewResI.comName = VarVal.PACKAGE_FGUIS.LyGuideFullTips;
    }

    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_theurgy: fgui.GComponent = getUiPanel.getChild("group_theurgy");
        let group_pet: fgui.GComponent = getUiPanel.getChild("group_pet");
        let group_elite1: fgui.GComponent = getUiPanel.getChild("group_elite1");
        let group_elite2: fgui.GComponent = getUiPanel.getChild("group_elite2");

        // 关闭
        let btn_back: fgui.GButton = getUiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_DESTROY, LyGuideFullTips, 0, null);
        })

        let protoId = params.protoId;
        let style = params.style;

        let proto:any;
        if (typeof(protoId) == "string" || typeof(protoId) == "number") {
            if (LocaleData.isPet(protoId)) {
                proto = LocaleData.getPetProto(protoId);
            } else if (LocaleData.isTheurgy(protoId)) {
                proto = LocaleData.getTheurgyById(protoId);
            } else if (LocaleData.isEliteMonster(protoId)) {
                proto = LocaleData.getEliteMonsterProto(protoId);
            }
        } else {
            proto = protoId;
        }

        let group_main:fgui.GComponent;
        if (proto) {
            if (LocaleData.isPet(proto.id)) {
                group_main = group_pet;

                let petLevel:any = LocaleData.getPetLevelByIdLevel(proto.id, LocaleData.getPetRoot().level_limit);
                let label_desc: fgui.GTextField = group_main.getChild("label_desc");
                label_desc.text = LocaleData.getSkillProto(petLevel.skill_id).desc;

                let attrs = LocaleData.getPetMaxAttr(proto.id);
                let names = [
                    VarVal.ENTITIATTR.FINAL_HP,
                    VarVal.ENTITIATTR.FINAL_ATTACK,
                    VarVal.ENTITIATTR.FINAL_DEFENSE
                ]
                for (let i = 0; i < 4; i++) {
                    let label_attr: fgui.GTextField = group_main.getChild("label_attr" + String(i + 1));
                    if (attrs[i]) {
                        label_attr.text = StrVal.ENTITI_NAMES[names[i]] + "+" + String(attrs[i]) + "%";
                    } else {
                        label_attr.visible = false;
                    }
                }
            } else if (LocaleData.isTheurgy(proto.id)) {
                group_main = group_theurgy;

                let levelDesc:string;
                let maxPorto = LocaleData.getTheurgPhase(10000);
                if (proto.type == 1) {
                    levelDesc = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR7, [maxPorto.phase]);
                }else if(proto.type == 2){
                    levelDesc = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR8, [maxPorto.phase]);
                }else if(proto.type == 3){
                    levelDesc = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR9, [maxPorto.phase]);
                }else if(proto.type == 4){
                    levelDesc = UtilsTool.stringFormat(StrVal.LYTHEURGY.STR10, [maxPorto.phase]);
                }
                let label_level: fgui.GTextField = group_main.getChild("label_level");
                label_level.text = levelDesc;

                let skillId = proto.phaseSkillId.split(",")[Number(maxPorto.phase) - 1];
                let label_desc: fgui.GTextField = group_main.getChild("label_desc");
                label_desc.text = LocaleData.getSkillProto(skillId).desc;
            } else if (LocaleData.isEliteMonster(proto.id)) {
                if (style == VarVal.PACKAGE_FGUIS.LyPaySevenGiftGroup1) {
                    group_main = group_elite1;
                } else {
                    group_main = group_elite2;
                }

                let maxProto = LocaleData.getEliteMonsterLevel(proto.id,  100000);
                let skillProto = LocaleData.getSkillProto(maxProto.skill_id);
                let label_level: fgui.GTextField = group_main.getChild("label_level");
                label_level.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR33, [skillProto.name, maxProto.skill_level]);

                let label_desc: fgui.GTextField = group_main.getChild("label_desc");
                label_desc.text = skillProto.desc;

                let nowArrts = LyEliteInfo.getProtoAttr(maxProto);
                for (let i = 0; i < 4; i++) {
                    let label_attr: fgui.GTextField = group_main.getChild("label_attr" + String(i + 1));
                    if (nowArrts[i]) {
                        let attr = nowArrts[i];
                        label_attr.text = StrVal.ELITEATTR_NAME[attr.id] + "+" + attr.num + "%";
                    } else {
                        label_attr.visible = false;
                    }
                }
            }
        }
        if (group_main) {
            group_main.visible = true;

            let label_name: fgui.GTextField = group_main.getChild("label_name");
            label_name.text = proto.name;
            let label_note: fgui.GTextField = group_main.getChild("label_note");
            label_note.text = StrVal.LYPAY_SEVEBGIFTGROUP.STR101;

            let pos = getUiPanel.globalToLocal(params.pos.x, params.pos.y);
            let cx = pos.x - group_main.width;
            if (cx < 0) {
                cx = pos.x;
                if (cx + group_main.width > getUiPanel.width) {
                    cx = getUiPanel.width - group_main.width;
                }
            }
            let cy = pos.y - group_main.height;
            if (cy < 0) {
                cy = pos.y + params.size.y;
            }
            group_main.setPosition(cx, cy);
        }
    }

    public getIsViewMask(): boolean {
        return false;
    }
}