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
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyChangeCharacter } from "./LyChangeCharacter";
import { LyDetailAttr, LyDetailAttrType } from "./LyDetailAttr";
import { LyMainPage } from "./LyMainPage";
import { LySetting } from "./LySetting";
import { AudioManager } from "../Kernel/AudioManager";
enum AvatarType {
    PHASE = "1",
    ACTIVITY = "2",
    ELITE = "3",
    PET = "4",
}

//称号
enum TitleType {
    ACTIVITY = "1",//活动
    SPECIAL = "2",//特殊
    MEDAL = "3",//勋章
}

//个性化类型
enum characterType {
    MODEL_SUIT1 = "1",//1：境界形象
    MODEL_ACTIVITY2 = "2",//2：活动形象
    HEAD_SUIT3 = "3",//3：境界头像
    HEAD_ACTIVITY4 = "4",//4：活动头像
    HEAD_ELITEMONSTER5 = "5",//5：精怪头像
    HEAD_PET6 = "6",//6：宠物头像
    HEADK7 = "7",//7：头像框
    BUBBLE8 = "8",//8：聊天气泡
    TITLE_ACTIVITY9 = "9",//9：活动称号
    TITLE_SPECIAL10 = "10",//10：特殊称号
    TITLE_MEDAL11 = "11",//11：勋章称号
}
export class LyCharacter extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyCharacter";
        this.viewResI.pkgName = "LyCharacter";
        this.viewResI.comName = "LyCharacter";
    }
    private uiPanel: fgui.GComponent
    private companionInfo: any
    private group_model: fgui.GComponent
    private fullInfo: any
    private btn_xx: fgui.GButton
    public onViewCreate(params): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        this.uiPanel = this.getUiPanel().getChild("group_character")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCharacter, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCharacter, 0, null);
        })
        let label_bxl: fgui.GLabel = this.uiPanel.getChild("label_bxl")
        label_bxl.text = StrVal.LYCHARACTER.STR10
        this.group_model = this.uiPanel.getChild("group_model")
        this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        this.btn_xx = this.uiPanel.getChild("btn_xx")
        this.btn_xx.text = StrVal.LYCHARACTER.STR32

        let btn_tx: fgui.GButton = this.uiPanel.getChild("btn_tx")
        btn_tx.text = StrVal.LYCHARACTER.STR33
        let btn_ch: fgui.GButton = this.uiPanel.getChild("btn_ch")
        btn_ch.text = StrVal.LYCHARACTER.STR34
        let btn_qt: fgui.GButton = this.uiPanel.getChild("btn_qt")
        btn_qt.text = StrVal.LYCHARACTER.STR35
        this.onCharacterData()
        this.loadModel()
        this.loadAvatar()
        this.loadTitle()
    };
    private characterArr1: any = []//1：境界形象
    private characterArr2: any = []//2：活动形象
    private characterArr3: any = []//3：境界头像
    private characterArr4: any = []//4：活动头像
    private characterArr5: any = []//5：精怪头像
    private characterArr6: any = []//6：宠物头像
    private characterArr7: any = []//7：头像框
    private characterArr8: any = []//8：聊天气泡
    private characterArr9: any = []//9：活动称号
    private characterArr10: any = []//10：特殊称号
    private characterArr11: any = []//11：勋章称号
    private onCharacterData(): void {
        this.fullInfo.personalization.forEach(item => {
            if (item.type == characterType.MODEL_SUIT1) {
                this.characterArr1.push(item)
            } else if (item.type == characterType.MODEL_ACTIVITY2) {
                this.characterArr2.push(item)
            } else if (item.type == characterType.HEAD_SUIT3) {
                this.characterArr3.push(item)
            } else if (item.type == characterType.HEAD_ACTIVITY4) {
                this.characterArr4.push(item)
            } else if (item.type == characterType.HEAD_ELITEMONSTER5) {
                this.characterArr5.push(item)
            } else if (item.type == characterType.HEAD_PET6) {
                this.characterArr6.push(item)
            } else if (item.type == characterType.HEADK7) {
                this.characterArr7.push(item)
            } else if (item.type == characterType.BUBBLE8) {
                this.characterArr8.push(item)
            } else if (item.type == characterType.TITLE_ACTIVITY9) {
                this.characterArr9.push(item)
            } else if (item.type == characterType.TITLE_SPECIAL10) {
                this.characterArr10.push(item)
            } else if (item.type == characterType.TITLE_MEDAL11) {
                this.characterArr11.push(item)
            }
        });
    }
    private loadArrData(dataArr: any, typeArr: any, type: string): any {
        let modelArr: any = []
        dataArr.forEach(item => {
            let dataItem: any = {
                state: 0, //0 未解锁，1 已
                data: item,
                type: type,
                value: 0,
                expire: -1,
            }
            for (let i = 0; i < typeArr.length; i++) {
                let item2: any = typeArr[i];
                if (String(item.id) == String(item2.cfgId)) {
                    dataItem.state = 1
                    dataItem.value = item2.value
                    dataItem.expire = item2.expire
                }

            }
            modelArr.push(dataItem)
        });
        modelArr.sort((a, b): number => {
            if (Number(b.state) == Number(a.state)) {
                return Number(b.data.id) - Number(a.data.id)
            } else {
                return Number(b.state) - Number(a.state)
            }
        })
        return modelArr
    }
    private editPersonalization(type: string, cfgId: string, call): void {
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
                call()
                UtilsUI.showMsgTip(StrVal.LYCHARACTER.STR28)
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { updatePlayerShow: true })
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LySetting, 0, {});
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "editPersonalization", {
            type: Number(type),
            cfgId: Number(cfgId),
        })
    }
    //------------------------称号-------------------------
    private group_title: fgui.GComponent
    private titleIndex: number = 0//0 活动，1：特殊，2勋章
    private loadTitle(): void {
        let titleActivityDataArr: any = this.loadArrData(LocaleData.getCharacterTitleByType(TitleType.ACTIVITY), this.characterArr9, characterType.TITLE_ACTIVITY9)
        let titleSpecialDataArr: any = this.loadArrData(LocaleData.getCharacterTitleByType(TitleType.SPECIAL), this.characterArr10, characterType.TITLE_SPECIAL10)
        let titleMedalDataArr: any = this.loadArrData(LocaleData.getCharacterTitleByType(TitleType.MEDAL), this.characterArr11, characterType.TITLE_MEDAL11)
        this.group_title = this.uiPanel.getChild("group_title")
        let btn_activity: fgui.GButton = this.group_title.getChild("btn_activity")
        btn_activity.text = StrVal.LYCHARACTER.STR9
        let btn_special: fgui.GButton = this.group_title.getChild("btn_special")
        btn_special.text = StrVal.LYCHARACTER.STR18
        let btn_medal: fgui.GButton = this.group_title.getChild("btn_medal")
        btn_medal.text = StrVal.LYCHARACTER.STR19
        btn_activity.onClick(() => {
            this.titleIndex = 0
            this.loadTitleData(titleActivityDataArr)
        })
        btn_special.onClick(() => {
            this.titleIndex = 1
            this.loadTitleData(titleSpecialDataArr)

        })
        btn_medal.onClick(() => {
            this.titleIndex = 2
            this.loadTitleData(titleMedalDataArr)
        })
        this.loadTitleData(titleActivityDataArr)
    }

    private loadTitleData(titleArr: any): void {
        let aNum: number = 0
        let zNum: number = 0
        titleArr.forEach(item => {
            zNum++
            if (item.state == "1") {
                aNum++
            }
        });
        let label_num: fgui.GLabel = this.group_title.getChild("label_num")
        label_num.text = UtilsTool.stringFormat(StrVal.LYCHARACTER.STR8, [aNum, zNum])
        let btn_attr: fgui.GButton = this.group_title.getChild("btn_attr")
        btn_attr.clearClick()
        btn_attr.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDetailAttr, 0, { type: LyDetailAttrType.CHARACTER, attr: this.fullInfo.personalizationAttr });
        })
        let list_title: fgui.GList = this.group_title.getChild("list_title")
        list_title.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            let group_title: fgui.GComponent = obj.getChild("group_title")
            // let icon: fgui.GLoader = group_title.getChild("loader_ch")
            UtilsUI.setTitleIconByTitleId(group_title, null, titleArr[index].data.id);
            // icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [titleArr[index].data.icon]);
            let img_suo: fgui.GImage = obj.getChild("img_suo")
            img_suo.visible = titleArr[index].state == "0"
            let img_select: fgui.GImage = obj.getChild("img_select")
            img_select.visible = this.fullInfo.base.avatar == titleArr[index].data.id
            obj.clearClick();
            obj.onClick(() => {
                this.loadTitleInfo(titleArr, index)
                list_title.selectedIndex = index
            })
            if (this.fullInfo.base.title == titleArr[index].data.id) {
                list_title.selectedIndex = index
            }
            if (list_title.selectedIndex == -1) {
                list_title.selectedIndex = 0
            }
        }).bind(this)
        list_title.numItems = 0
        list_title.itemProvider = (index: number): string => {
            if (this.titleIndex == 0) {
                return "ui://LyCharacter/btn_icon2"
            } else if (this.titleIndex == 1) {
                return "ui://LyCharacter/btn_icon2"
            } else if (this.titleIndex == 2) {
                return "ui://LyCharacter/btn_icon3"
            }
        }
        list_title.numItems = titleArr.length
        // list_title.selectedIndex = 0
        this.loadTitleInfo(titleArr, list_title.selectedIndex)
    }
    private loadTitleInfo(titleArr: any, index: number): void {
        let info: any = titleArr[index]
        if (info) {
        } else {
            return
        }
        let dataItem: any = info.data
        let label_dec1: fgui.GLabel = this.group_title.getChild("label_dec1")
        let label_dec2: fgui.GLabel = this.group_title.getChild("label_dec2")
        let label_name: fgui.GLabel = this.group_title.getChild("label_name")
        label_name.text = dataItem.name

        let group_titleIcon: fgui.GComponent = this.group_title.getChild("group_titleIcon")
        UtilsUI.setTitleIconByTitleId(group_titleIcon, null, dataItem.id);
        let label_syz: fgui.GLabel = this.group_title.getChild("label_syz")
        label_syz.text = StrVal.LYCHARACTER.STR21
        let btn_alter: fgui.GButton = this.group_title.getChild("btn_alter")
        // label_dec1.text = StrVal.LYCHARACTER.STR20
        label_dec1.text = UtilsTool.stringFormat(StrVal.LYCHARACTER.STR1, [dataItem.desc, dataItem.expire == "0" ? StrVal.LYCHARACTER.STR2 : UtilsTool.stringFormat(StrVal.LYCHARACTER.STR3, [dataItem.expire])])
        label_dec2.text = dataItem.attrId == "0" ? StrVal.LYCHARACTER.STR6 : UtilsTool.stringFormat(StrVal.LYCHARACTER.STR7, [LocaleData.getCharacterAttrById(dataItem.attrId).name, dataItem.attrValue])
        btn_alter.visible = info.state != "0"//幻化
        label_syz.visible = info.state != "0"//幻化
        btn_alter.visible = info.state != "0" ? this.fullInfo.base.title != dataItem.id : false
        btn_alter.text = StrVal.LYCHARACTER.STR36
        btn_alter.clearClick()
        btn_alter.onClick(() => {
            this.editPersonalization(info.type, dataItem.id, () => {
                this.loadTitle()
                // this.loadActivityInfo(titleArr, index)
            })
        })
    }
    //------------------------头像------------------------
    private group_head: fgui.GComponent
    private avatarIndex: number = 0 // 0:头像，1头像框，2气泡
    private avatarDaraArr: any = []
    private loadAvatar(): void {
        this.group_head = this.uiPanel.getChild("group_head")
        let avatarDataArr: any = LocaleData.getCharacterAvatar()
        let avatarArr1: any = []
        let avatarArr2: any = []
        let avatarArr3: any = []
        let avatarArr4: any = []
        avatarDataArr.forEach(item => {
            if (item.type == AvatarType.PHASE) {
                avatarArr1.push(item)
            } else if (item.type == AvatarType.ACTIVITY) {
                avatarArr2.push(item)
            } else if (item.type == AvatarType.ELITE) {
                avatarArr3.push(item)
            } else if (item.type == AvatarType.PET) {
                avatarArr4.push(item)
            }
        });
        let avatarArr: any = [avatarArr1, avatarArr2, avatarArr3, avatarArr4]
        let avatarBorderDataArr: any = [LocaleData.getCharacterAvatarBorder()]
        let avatarBubbleDataArr: any = [LocaleData.getCharacterChatBubble()]
        let btn_head: fgui.GButton = this.group_head.getChild("btn_head")
        btn_head.text = StrVal.LYCHARACTER.STR14
        let btn_headK: fgui.GButton = this.group_head.getChild("btn_headK")
        btn_headK.text = StrVal.LYCHARACTER.STR15
        let btn_bubble: fgui.GButton = this.group_head.getChild("btn_bubble")
        btn_bubble.text = StrVal.LYCHARACTER.STR16
        btn_head.onClick(() => {
            this.avatarIndex = 0
            this.avatarDaraArr = avatarArr
            this.loadAvatarData(true)
            // this.loadAvatarInfo(0, 0)
        })
        btn_headK.onClick(() => {
            this.avatarIndex = 1
            this.avatarDaraArr = avatarBorderDataArr
            this.loadAvatarData(true)
            // this.loadAvatarInfo(0, 0)
        })
        btn_bubble.onClick(() => {
            this.avatarIndex = 2
            this.avatarDaraArr = avatarBubbleDataArr
            this.loadAvatarData(true)
            // this.loadAvatarInfo(0, 0)
        })
        this.avatarDaraArr = avatarArr
        this.avatarIndex = 0
        this.loadAvatarData(true)
    }
    private avatarArr: any = []
    private loadAvatarData(isOne?: boolean): void {
        this.avatarArr = []
        if (this.avatarIndex == 0) {
            this.avatarArr = [
                this.loadArrData(this.avatarDaraArr[0], this.characterArr3, characterType.HEAD_SUIT3),
                this.loadArrData(this.avatarDaraArr[1], this.characterArr4, characterType.HEAD_ACTIVITY4),
                this.loadArrData(this.avatarDaraArr[2], this.characterArr5, characterType.HEAD_ELITEMONSTER5),
                this.loadArrData(this.avatarDaraArr[3], this.characterArr6, characterType.HEAD_PET6)]


        } else if (this.avatarIndex == 1) {
            this.avatarArr = [
                this.loadArrData(this.avatarDaraArr[0], this.characterArr7, characterType.HEADK7)]

        } else if (this.avatarIndex == 2) {
            this.avatarArr = [
                this.loadArrData(this.avatarDaraArr[0], this.characterArr8, characterType.BUBBLE8)]
        }
        let aNum: number = 0
        let zNum: number = 0
        this.avatarArr.forEach(item => {
            item.forEach(item2 => {
                zNum++
                if (item2.state == "1") {
                    aNum++
                }
            });
        });

        let label_num: fgui.GLabel = this.group_head.getChild("label_num")
        label_num.text = UtilsTool.stringFormat(StrVal.LYCHARACTER.STR8, [aNum, zNum])

        let btn_attr: fgui.GButton = this.group_head.getChild("btn_attr")
        btn_attr.clearClick()
        btn_attr.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDetailAttr, 0, { type: LyDetailAttrType.CHARACTER, attr: this.fullInfo.personalizationAttr });
        })
        let list_headIcon1: fgui.GList = this.group_head.getChild("list_headIcon1")
        let list_headIcon2: fgui.GList = this.group_head.getChild("list_headIcon2")
        let list_headIcon3: fgui.GList = this.group_head.getChild("list_headIcon3")
        if (this.avatarIndex == 0) {
            let a = []
            list_headIcon1.itemRenderer = ((index: number, obj: fgui.GComponent) => {
                let data: any = this.avatarArr[index]
                let label_name: fgui.GLabel = obj.getChild("label_name")
                let list_head: fgui.GList = obj.getChild("list_head")
                let headStr: Array<string> = []
                if (this.avatarIndex == 0) {
                    headStr = [StrVal.LYCHARACTER.STR11, StrVal.LYCHARACTER.STR9, StrVal.LYCHARACTER.STR22, StrVal.LYCHARACTER.STR23]
                } else if (this.avatarIndex == 1) {
                    headStr = [StrVal.LYCHARACTER.STR9]
                } else if (this.avatarIndex == 2) {
                    headStr = [StrVal.LYCHARACTER.STR9]
                }
                label_name.text = headStr[index]
                list_head.selectedIndex = -1
                list_head.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                    let icon: fgui.GLoader = obj1.getChild("icon")
                    let avatarModel = this.onHead(data[index1].data)
                    if (avatarModel) {
                        icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [avatarModel.avatar2]);
                    }
                    let img_suo: fgui.GImage = obj1.getChild("img_suo")
                    img_suo.visible = data[index1].state == "0"
                    let img_select: fgui.GImage = obj1.getChild("img_select")
                    if (data[index1].type == characterType.HEAD_SUIT3 || data[index1].type == characterType.HEAD_ACTIVITY4 || data[index1].type == characterType.HEAD_ELITEMONSTER5 || data[index1].type == characterType.HEAD_PET6) {
                        if (this.fullInfo.base.avatar == 0) {
                            img_select.visible = LocaleData.getCharShowResInfoSelf().icon == avatarModel.avatar2
                        } else {
                            img_select.visible = this.fullInfo.base.avatar == data[index1].data.id
                        }
                    } else if (data[index1].type == characterType.HEADK7) {
                        img_select.visible = this.fullInfo.base.avatarBorder == data[index1].data.id
                    } else if (data[index1].type == characterType.BUBBLE8) {
                        img_select.visible = this.fullInfo.base.chatBubble == data[index1].data.id
                    }
                    if (img_select.visible) {
                        list_headIcon1.scrollToView(index);
                        // list_headIcon1.scrollPane.posY = obj1.y + list_headIcon1.scrollPane.posY
                        list_head.selectedIndex = index1
                    }
                    obj1.clearClick();
                    obj1.onClick(() => {
                        for (let i = 0; i < a.length; i++) {
                            a[i].selectedIndex = -1
                        }
                        this.loadAvatarInfo(index, index1)
                        list_head.selectedIndex = index1
                    })
                    if (img_select.visible && isOne) {
                        // list_headIcon1.scrollToView(index);
                        // list_head.selectedIndex = index1
                        this.loadAvatarInfo(index, index1)
                    }
                }).bind(this)
                a.push(list_head)
                list_head.height = data.length / 4 * 150 + 100
                list_head.numItems = data.length
            }).bind(this)
            list_headIcon1.numItems = this.avatarArr.length

        } else if (this.avatarIndex == 1) {
            list_headIcon2.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                let data: any = this.avatarArr[0]
                let icon: fgui.GLoader = obj1.getChild("icon")
                let avatarModel = this.onHead(data[index1].data)
                if (avatarModel) {
                    icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [avatarModel.avatar2]);
                }
                let img_suo: fgui.GImage = obj1.getChild("img_suo")
                img_suo.visible = data[index1].state == "0"
                let img_select: fgui.GImage = obj1.getChild("img_select")
                if (data[index1].type == characterType.HEAD_SUIT3 || data[index1].type == characterType.HEAD_ACTIVITY4 || data[index1].type == characterType.HEAD_ELITEMONSTER5 || data[index1].type == characterType.HEAD_PET6) {
                    img_select.visible = this.fullInfo.base.avatar == data[index1].data.id
                } else if (data[index1].type == characterType.HEADK7) {
                    img_select.visible = this.fullInfo.base.avatarBorder == data[index1].data.id
                } else if (data[index1].type == characterType.BUBBLE8) {
                    img_select.visible = this.fullInfo.base.chatBubble == data[index1].data.id
                }
                obj1.clearClick();
                obj1.onClick(() => {
                    this.loadAvatarInfo(0, index1)
                    list_headIcon2.selectedIndex = index1
                })
                if (img_select.visible && isOne) {
                    list_headIcon2.selectedIndex = index1
                    this.loadAvatarInfo(0, index1)
                }
            }).bind(this)
            // list_headIcon2.numItems = this.avatarArr[0].length
            UtilsUI.setFguiGlistDelayNumItems(list_headIcon2, this.avatarArr[0].length);
        } else if (this.avatarIndex == 2) {
            list_headIcon3.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                let data: any = this.avatarArr[0]
                let icon: fgui.GLoader = obj1.getChild("icon")
                let avatarModel = this.onHead(data[index1].data)
                if (avatarModel) {
                    icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [avatarModel.avatar2]);
                }
                let img_suo: fgui.GImage = obj1.getChild("img_suo")
                img_suo.visible = data[index1].state == "0"
                let img_select: fgui.GImage = obj1.getChild("img_select")
                if (data[index1].type == characterType.HEAD_SUIT3 || data[index1].type == characterType.HEAD_ACTIVITY4 || data[index1].type == characterType.HEAD_ELITEMONSTER5 || data[index1].type == characterType.HEAD_PET6) {
                    img_select.visible = this.fullInfo.base.avatar == data[index1].data.id
                } else if (data[index1].type == characterType.HEADK7) {
                    img_select.visible = this.fullInfo.base.avatarBorder == data[index1].data.id
                } else if (data[index1].type == characterType.BUBBLE8) {
                    img_select.visible = this.fullInfo.base.chatBubble == data[index1].data.id
                }
                obj1.clearClick();
                obj1.onClick(() => {
                    this.loadAvatarInfo(0, index1)
                    list_headIcon3.selectedIndex = index1
                })
                if (img_select.visible && isOne) {
                    list_headIcon3.selectedIndex = index1
                    this.loadAvatarInfo(0, index1)
                }
            }).bind(this)
            // list_headIcon3.numItems = this.avatarArr[0].length
            UtilsUI.setFguiGlistDelayNumItems(list_headIcon3, this.avatarArr[0].length);
        }
    }
    private onHead(data): any {
        let avatarModel;
        if (data.type == AvatarType.PHASE) {
            // let charItem = LocaleData.getCharacterItem(this.fullInfo.base.character);
            let suitItem = LocaleData.getCharSuitItem(data.typeId);
            avatarModel = LocaleData.getModelItem(suitItem.modelId);
        } else if (data.type == AvatarType.ACTIVITY) {
            let suitItem = LocaleData.getCharActivityItem(data.typeId);
            avatarModel = LocaleData.getModelItem(suitItem.modelId);
        } else if (data.type == AvatarType.ELITE) {
            let proto = LocaleData.getEliteMonsterProto(data.typeId);
            avatarModel = LocaleData.getModelItem(proto.modelId);
        } else if (data.type == AvatarType.PET) {
            let proto = LocaleData.getPetProto(data.typeId);
            avatarModel = LocaleData.getModelItem(proto.modelId);
        } else {
            avatarModel = LocaleData.getModelItem(data.icon);
        }
        return avatarModel
    }
    private loadAvatarInfo(index: number, index1: number): void {
        let info: any = this.avatarArr[index][index1]
        let dataItem: any = info.data
        let group_bubble: fgui.GGraph = this.group_head.getChild("group_bubble")
        group_bubble.visible = this.avatarIndex == 2
        let img_bubbleIcon: fgui.GLoader = this.group_head.getChild("img_bubbleIcon")
        img_bubbleIcon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [dataItem.icon]);
        let btn_icon: fgui.GButton = this.group_head.getChild("btn_icon")
        btn_icon.visible = this.avatarIndex != 2
        let icon: fgui.GLoader = btn_icon.getChild("icon")
        // icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [dataItem.icon]);
        if (this.onHead(dataItem)) {
            icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [this.onHead(dataItem).avatar2]);
        }
        // this.onHead()
        let label_name: fgui.GLabel = this.group_head.getChild("label_name")
        let label_dec: fgui.GLabel = this.group_head.getChild("label_dec")
        let label_attr: fgui.GLabel = this.group_head.getChild("label_attr")
        let label_syz: fgui.GLabel = this.group_head.getChild("label_syz")
        label_syz.text = StrVal.LYCHARACTER.STR21
        let btn_alter: fgui.GButton = this.group_head.getChild("btn_alter")
        btn_alter.text = StrVal.LYCHARACTER.STR12
        let btn_unlock: fgui.GButton = this.group_head.getChild("btn_unlock")
        btn_alter.clearClick();
        btn_alter.onClick(() => {
            this.editPersonalization(info.type, dataItem.id, () => {
                this.loadAvatarData()
                this.loadAvatarInfo(index, index1)
            })
        })
        btn_unlock.clearClick()
        btn_unlock.onClick(() => {
            let str: string = ""
            if (this.avatarIndex == 1) {
                str = "unlockAvatarBorder"
            } else if (this.avatarIndex == 2) {
                str = "unlockChatBubble"
            }
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.onCharacterData()
                    this.loadAvatarData()
                    this.loadAvatarInfo(index, index1)

                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, str, {
                id: Number(dataItem.id)
            })
        })
        label_name.text = dataItem.name
        if (dataItem.expire) {
            label_dec.text = UtilsTool.stringFormat(StrVal.LYCHARACTER.STR1, [dataItem.desc, dataItem.expire == "0" ? StrVal.LYCHARACTER.STR2 : UtilsTool.stringFormat(StrVal.LYCHARACTER.STR3, [dataItem.expire])])
            label_attr.text = dataItem.attrId == "0" ? StrVal.LYCHARACTER.STR6 : UtilsTool.stringFormat(StrVal.LYCHARACTER.STR7, [LocaleData.getCharacterAttrById(dataItem.attrId).name, dataItem.attrValue])
        } else {
            label_dec.text = dataItem.desc
            label_attr.text = ""
        }
        btn_alter.visible = info.state != "0"//幻化
        btn_unlock.visible = this.avatarIndex == 0 ? false : info.state == "0"
        let group_needItem: fgui.GComponent = this.group_head.getChild("group_needItem")
        group_needItem.visible = btn_unlock.visible

        if (LocaleData.getItemProto(dataItem.unlockItemId)) {
            let label_needItemCount: fgui.GTextField = group_needItem.getChild("label_number")
            let loader_item2: fgui.GLoader = group_needItem.getChild("loader_item")
            loader_item2.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(dataItem.unlockItemId).icon])
            let itemCount = GameServerData.getInstance().getItemCountByProtoId(dataItem.unlockItemId)
            label_needItemCount.color = UtilsUI.getEnoughColor(Number(itemCount) >= 1)
            label_needItemCount.text = UtilsTool.stringFormat("{0}/1", [itemCount])
        }



        label_syz.visible = info.state != "0"//幻化
        if (dataItem.type == characterType.MODEL_SUIT1 || dataItem.type == characterType.MODEL_ACTIVITY2 || dataItem.type == characterType.HEAD_SUIT3 || dataItem.type == characterType.HEAD_ACTIVITY4 || dataItem.type == characterType.HEAD_ELITEMONSTER5 || dataItem.type == characterType.HEAD_PET6) {
            btn_alter.visible = info.state != "0" ? this.fullInfo.base.avatar != dataItem.id : false
        } else if (dataItem.type == characterType.HEADK7) {
            btn_alter.visible = info.state != "0" ? this.fullInfo.base.avatarBorder != dataItem.id : false
        } else if (dataItem.type == characterType.BUBBLE8) {
            btn_alter.visible = info.state != "0" ? this.fullInfo.base.chatBubble != dataItem.id : false
        }

        // this.btn_upLevel.text = info.state == "0" ? "激活解锁" : "升级"
    }


    //---------------------形象---------------------------
    private list_activity: fgui.GList
    private activity
    private btn_modelActivity: fgui.GButton
    private loadModel(): void {
        //注册事件
        let modelIdIndex: number = 1//1：活动，2：境界
        this.list_activity = this.group_model.getChild("list_activity")
        this.activity = this.loadArrData(LocaleData.getCharacterActivity(), this.characterArr2, characterType.MODEL_ACTIVITY2)
        let suit: any = this.loadArrData(LocaleData.getCharacterSuitArr(this.fullInfo.base.character), this.characterArr1, characterType.MODEL_SUIT1)
        this.list_activity.on(fgui.Event.CLICK_ITEM, (onClickitem: fgui.GButton) => {
            let index = this.list_activity.childIndexToItemIndex(this.list_activity.getChildIndex(onClickitem))
            if (modelIdIndex == 1) {
                this.loadActivityInfo(this.activity, index)
            } else if (modelIdIndex == 2) {
                this.loadActivityInfo(suit, index)
            }
        }, this)
        this.btn_modelActivity = this.group_model.getChild("btn_modelActivity")
        this.btn_modelActivity.text = StrVal.LYCHARACTER.STR9
        let btn_modelSuit: fgui.GButton = this.group_model.getChild("btn_modelSuit")
        btn_modelSuit.text = StrVal.LYCHARACTER.STR11
        this.btn_modelActivity.clearClick()
        this.btn_modelActivity.onClick(() => {
            this.btn_modelActivity.selected = true
            btn_modelSuit.selected = false
            modelIdIndex = 1
            this.list_activity.selectedIndex = 0
            this.loadModelData(this.activity)
            this.loadActivityInfo(this.activity, 0)
        })
        btn_modelSuit.clearClick()
        btn_modelSuit.onClick(() => {
            this.btn_modelActivity.selected = false
            btn_modelSuit.selected = true
            modelIdIndex = 2
            this.list_activity.selectedIndex = 0
            this.loadModelData(suit)
            this.loadActivityInfo(suit, 0)
        })
        this.loadModelData(this.activity)
        if (this.fullInfo.base.appearance == 0) {
            this.list_activity.selectedIndex = 0
            this.loadActivityInfo(this.activity, 0)
        }
        let btn_attr: fgui.GButton = this.group_model.getChild("btn_attr")
        btn_attr.clearClick()
        btn_attr.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyDetailAttr, 0, { type: LyDetailAttrType.CHARACTER, attr: this.fullInfo.personalizationAttr });
        })
    }
    private loadModelData(modelArr: any): void {
        this.list_activity.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            let icon: fgui.GLoader = obj.getChild("icon")
            let models = LocaleData.getModelItem(modelArr[index].data.modelId)
            icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [models.avatar]);
            let img_select: fgui.GLoader = obj.getChild("img_select")
            let img_suo: fgui.GLoader = obj.getChild("img_suo")
            if (this.fullInfo.base.appearance == modelArr[index].data.id) {
                this.list_activity.selectedIndex = index
                this.loadActivityInfo(modelArr, index)
            }
            if (this.fullInfo.base.appearance == 0) {
                img_select.visible = LocaleData.getCharShowResInfoSelf().icon_square == models.avatar
            } else {
                img_select.visible = this.fullInfo.base.appearance == modelArr[index].data.id
            }
            img_suo.visible = modelArr[index].state == "0"
            let isRed: boolean = false
            if (modelArr[index].state == "0") {
                isRed = GameServerData.getInstance().getItemCountByProtoId(modelArr[index].data.levelUpItemId) > 0
            }
            PointRedData.getInstance().updateManualPoint(obj, isRed);
        }).bind(this)
        // this.list_activity.numItems = modelArr.length
        UtilsUI.setFguiGlistDelayNumItems(this.list_activity, modelArr.length);
        if (this.list_activity.selectedIndex == -1) {
            this.list_activity.selectedIndex = 0
            this.loadActivityInfo(this.activity, 0)
        }
    }

    private loadActivityInfo(modelArr: any, index: number): void {
        let info: any = modelArr[index]
        let dataItem: any = info.data
        let modelItem: any = LocaleData.getModelItem(dataItem.modelId)
        let label_name: fgui.GLabel = this.group_model.getChild("label_name")
        let label_attr1: fgui.GLabel = this.group_model.getChild("label_attr1")
        let label_attr2: fgui.GLabel = this.group_model.getChild("label_attr2")
        let label_syz: fgui.GLabel = this.group_model.getChild("label_syz")
        label_syz.text = StrVal.LYCHARACTER.STR21
        let btn_alter: fgui.GButton = this.group_model.getChild("btn_alter")
        btn_alter.text = StrVal.LYCHARACTER.STR12
        let btn_upLevel: fgui.GButton = this.group_model.getChild("btn_upLevel")
        label_name.text = modelItem.name

        let group_needItem: fgui.GComponent = this.group_model.getChild("group_needItem")
        let label_needItemCount: fgui.GTextField = group_needItem.getChild("label_number")
        if (LocaleData.getItemProto(dataItem.levelUpItemId)) {
            let loader_item2: fgui.GLoader = group_needItem.getChild("loader_item")
            loader_item2.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(dataItem.levelUpItemId).icon])
            let itemCount = GameServerData.getInstance().getItemCountByProtoId(dataItem.levelUpItemId)
            label_needItemCount.text = UtilsTool.stringFormat("{0}/1", [itemCount])
            label_needItemCount.color = UtilsUI.getEnoughColor(Number(itemCount) >= 1)
            group_needItem.visible = true
        } else {
            group_needItem.visible = false
        }
        let loader_spine: fgui.GLoader3D = this.group_model.getChild("loader_spine")
        // let spinePlayer = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
        //     spp.playAnimation("stand", true);
        // }, loader_spine,dataItem.modelId);
        //    UtilsUI.loadSpineAndShow(loader_spine, dataItem.modelId, 0.8);


        new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
            spp.playAnimation("stand", true);
        }, loader_spine, dataItem.modelId);

        //境界
        if (dataItem.phase) {
            if (LocaleData.getPlayerPhaseById(dataItem.phase)) {
                label_attr1.text = UtilsTool.stringFormat(StrVal.LYCHARACTER.STR5, [LocaleData.getPlayerPhaseById(dataItem.phase).name])
            } else {
                label_attr1.text = UtilsTool.stringFormat(StrVal.LYCHARACTER.STR5, [dataItem.phase])
            }
            label_attr2.text = StrVal.LYCHARACTER.STR6
        } else {//活动
            label_attr1.text = UtilsTool.stringFormat(StrVal.LYCHARACTER.STR1, [dataItem.desc, dataItem.expire == "0" ?
                StrVal.LYCHARACTER.STR2 : UtilsTool.stringFormat(StrVal.LYCHARACTER.STR3, [dataItem.expire])])
            let level = info.value == 0 ? 0 : info.value - 1
            let attrArr: string[] = dataItem.attrValue.split(",")
            let strAttr: string = ""
            if (level + 1 == attrArr.length) {
                strAttr = StrVal.LYCHARACTER.STR30
            } else {
                strAttr = UtilsTool.stringFormat(StrVal.LYCHARACTER.STR31, [attrArr[level + 1]])
            }
            label_attr2.text = UtilsTool.stringFormat(StrVal.LYCHARACTER.STR29, [LocaleData.getCharacterAttrById(dataItem.attrId).name, attrArr[level], strAttr])
        }
        btn_alter.clearClick();
        btn_alter.onClick(() => {
            if (dataItem.phase) {
                this.editPersonalization(info.type, dataItem.id, () => {
                    this.loadModelData(modelArr)
                    this.loadActivityInfo(modelArr, index)
                    this.loadAvatarData(true)
                })
            } else {
                this.editPersonalization(info.type, dataItem.id, () => {
                    this.loadModelData(modelArr)
                    this.loadActivityInfo(modelArr, index)
                    this.loadAvatarData(true)
                })
            }
        })


        btn_upLevel.clearClick();
        btn_upLevel.onClick(() => {
            if (dataItem.phase) {
                // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyChangeCharacter, 0, null);
            } else {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.onCharacterData()
                        let modelArrNew = this.loadArrData(LocaleData.getCharacterActivity(), this.characterArr2, characterType.MODEL_ACTIVITY2)
                        this.activity = this.loadArrData(LocaleData.getCharacterActivity(), this.characterArr2, characterType.MODEL_ACTIVITY2)
                        this.loadModelData(modelArrNew)
                        this.loadActivityInfo(modelArrNew, index)
                        this.loadAvatarData()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "levelUpAppearance", {
                    appearance: Number(dataItem.id)
                })
            }
        })
        // group_needItem.visible = info.state == "0"
        btn_alter.enabled = info.state != "0"//幻化
        label_syz.visible = info.state != "0"//幻化
        btn_alter.enabled = info.state != "0" ? this.fullInfo.base.appearance != dataItem.id : false//幻化
        let isRed: boolean = false
        if (dataItem.phase) {
            //   btn_upLevel.text = StrVal.LYCHARACTER.STR24
            btn_upLevel.visible = false
            group_needItem.visible = false
        } else {
            btn_upLevel.visible = true
            btn_upLevel.text = info.state == "0" ? StrVal.LYCHARACTER.STR25 : StrVal.LYCHARACTER.STR13
            if (info.state == "0") {
                isRed = GameServerData.getInstance().getItemCountByProtoId(dataItem.levelUpItemId) > 0
            }
        }
        PointRedData.getInstance().updateManualPoint(btn_upLevel, isRed);
        PointRedData.getInstance().updateManualPoint(this.btn_xx, LyCharacter.isViewRedPoint());
        PointRedData.getInstance().updateManualPoint(this.btn_modelActivity, LyCharacter.isViewRedPoint());
    }

    public static isViewRedPoint(): boolean {
        let fullInfo: any = GameServerData.getInstance().getPlayerFullInfo()
        let personalization: any = fullInfo.personalization
        let characterActivity: any = LocaleData.getCharacterActivity()
        for (let i = 0; i < characterActivity.length; i++) {
            let item1 = characterActivity[i]
            let isOpen = true
            for (let j = 0; j < personalization.length; j++) {
                let item2 = personalization[j]
                if (item1.id == item2.cfgId && item2.type == VarVal.Personalization.MODEL_ACTIVITY) {
                    isOpen = false
                }
            }
            if (isOpen) {
                let num = GameServerData.getInstance().getItemCountByProtoId(item1.levelUpItemId)
                return num > 0;
            }
        }
        return false
    }



    public getIsViewMask(): boolean {
        return false;
    };

}