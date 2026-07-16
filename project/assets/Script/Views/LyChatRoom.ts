//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { UtilsUI } from "../Kernel/UtilsUI";
import { StrVal } from "../Values/StrVal";
import { HorizontalTextAlignment, Overflow, VerticalTextAlignment } from "cc";
import { GameServerData } from "../Kernel/GameServerData";
import { GameServer } from "../Kernel/GameServer";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { PErrCode } from "../Values/PErrCode";
import { BUILD_TYPE, PlatformAPI } from "../Kernel/PlatformAPI";
import { AudioManager } from "../Kernel/AudioManager";

export enum CHAT_CHANNELTYPE {
    PLAYER = 1,
    WORLD = 2,
    SYSTEM = 3,
    ACTIVITY = 4,
    FACTION = 5,
}

export class LyChatRoom extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyChatRoom;
        this.viewResI.pkgName = "LyChatRoom";
        this.viewResI.comName = "LyChatRoom";
    }

    private activityId:number;
    private channelType:CHAT_CHANNELTYPE;
    private input_content:fgui.GTextInput;

    private chatInfosWorld:Array<any>;
    private chatInfosFaction:Array<any>;
    private chatInfosActivity:Array<any>;
    private chatInfosCurr:Array<any>;

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        if (params) {
            this.activityId = Number(params.activityId);
        }

        let btn_back:fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyChatRoom, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        // 列表
        let list_chat:fgui.GList = group_main.getChild("list_chat");
        list_chat.setVirtual();
        list_chat.itemRenderer = (index:number, child:fgui.GComponent) => {
            let chatInfo = this.chatInfosCurr[index];
            let content:string = chatInfo.content;

            let group_item:fgui.GComponent;
            let group_left:fgui.GComponent = child.getChild("group_left");
            let group_right:fgui.GComponent = child.getChild("group_right");
            if (this.isSideRight(chatInfo)) {
                group_left.visible = false;
                group_item = group_right;
            } else {
                group_right.visible = false;
                group_item = group_left;
            }
            group_item.visible = true; // 就算是实体列表，它都会复用！！！

            let charInfo = LocaleData.getCharShowResInfo(chatInfo.senderInfo.character, chatInfo.senderInfo.phase, chatInfo.senderInfo.appearance, chatInfo.senderInfo.avatar);

            let group_head:fgui.GComponent = group_item.getChild("group_head");
            let loader_icon:fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
            let btn_frame:fgui.GButton = group_head.getChild("btn_frame");
            btn_frame.clearClick();
            btn_frame.onClick(() => {
                UtilsUI.onShowPlayerInfo(chatInfo.senderInfo.guid);
            })

            let loader_phase:fgui.GComponent = group_item.getChild("loader_phase");
            UtilsUI.setTitleIconByTitleId(loader_phase, chatInfo.senderInfo.phase, chatInfo.senderInfo.title);

            let label_name:fgui.GTextField = group_item.getChild("label_name");
            label_name.text = chatInfo.senderInfo.name;

            let loader_content:fgui.GLoader = group_item.getChild("loader_content");
            let label_content:fgui.GTextField = group_item.getChild("label_content");
            let img_text:fgui.GImage = group_item.getChild("img_text");
            
            let ch:number;
            let emojiItem = LyChatRoom.getChatContentEmoji(content);
            if (emojiItem) {
                loader_content.visible = true;
                label_content.visible = false;
                img_text.visible = false;

                loader_content.url = UtilsTool.stringFormat("ui://LyChatRoom/{0}", [emojiItem.image]);

                ch = loader_content.y + loader_content.height + 10; // n是为了留底边
            } else {
                loader_content.visible = false;
                label_content.visible = true;
                img_text.visible = true;

                label_content.autoSize = fgui.AutoSizeType.Both;
                label_content.text = content;

                if (label_content.width > 350) {
                    label_content.autoSize = fgui.AutoSizeType.Height;
                    label_content.width = 350;
                    label_content.text = content; // 实时刷新一下高度
                }
                
                if (this.isSideRight(chatInfo)) {
                    img_text.width = label_content.width + (img_text.x - label_content.x) + 10; // 左边界长一点
                } else {
                    img_text.width = label_content.width + (label_content.x - img_text.x) + 10; // 左边界长一点
                }
                img_text.height = label_content.height + (label_content.y - img_text.y) * 2;
                
                ch = img_text.y + img_text.height + 10; // n是为了留底边
            }

            child.height = ch > 160 ? ch : 160;

            // 昨天、今天
            let textday:string;
            let prevInfo = this.chatInfosCurr[index - 1];
            if (!prevInfo || chatInfo.time - prevInfo.time >= 3600) { // 间隔1小时内的消息不显示时间。
                textday = UtilsTool.timeToAgo(chatInfo.time);
            }
            let img_time:fgui.GImage = group_item.getChild("img_time");
            let label_time:fgui.GTextField = group_item.getChild("label_time");
            if (textday) {
                img_time.visible = true;
                label_time.visible = true;
                label_time.text = textday;
            } else {
                img_time.visible = false;
                label_time.visible = false;
            }
        }

        let onChatInfoChanged = (args) => {
            if (args.chatInfo.channelType == this.channelType) {
                this.updateNewInfos();
                this.updateChanelList(this.channelType);
            }
        }
        this.registerRequest(onChatInfoChanged, "chatInfoChanged");

        this.input_content = group_main.getChild("input_content");
		this.input_content.promptText = StrVal.LYCHATROOM.STR5;
        UtilsUI.setGTextInputAlign(this.input_content, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.CLAMP);

        let emojiItems:Array<any> = LocaleData.getChatEmojiItems();

        // 表情
        let group_emoji:fgui.GComponent = group_main.getChild("group_emoji");
        group_emoji.visible = false;
        group_emoji.getChild("graph_mask", fgui.GGraph).onClick(() => {
            group_emoji.visible = false;
        });
        let list_emoji:fgui.GList = group_emoji.getChild("list_emoji", fgui.GList);
        list_emoji.setVirtual();
        list_emoji.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let emojiItem = emojiItems[index];
            let loader_icon:fgui.GLoader = group_item.getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://LyChatRoom/{0}", [emojiItem.image]);
            loader_icon.clearClick();
            loader_icon.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        group_emoji.visible = false;
                        // 在消息事件中刷新
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "sendMsgChat", {
                    receiverId: undefined,
                    content: "{" + emojiItem.id + "}",
                    channelType: this.channelType,
                    activityId: this.activityId,
                })
            })
        }
        list_emoji.numItems = emojiItems.length;
        let btn_emoji:fgui.GButton = group_main.getChild("btn_emoji");
        btn_emoji.onClick(() => {
            if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.CHAT_OPEN)) {
                UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.CHAT_OPEN);
                return;
            }
            group_emoji.visible = true;
        })

        // 发送
        let btn_send:fgui.GButton = group_main.getChild("btn_send");
        btn_send.text = StrVal.LYCHATROOM.STR4;
        btn_send.onClick(() => {
            let content:string = this.input_content.text;
            // [P0安全] 移除聊天命令开启GM功能
            // if (PlatformAPI.isBinaryDebug() && content == "xxgame_debug") {
            //     PlatformAPI.BUILD_CURRENT = BUILD_TYPE.ALPHA;
            //     UtilsUI.showMsgTip("已打开GM");
            //     return;
            // }
            if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.CHAT_OPEN)) {
                UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.CHAT_OPEN);
                return;
            }
            if (!content || content.length == 0) {
                UtilsUI.showMsgTip(StrVal.LYCHATROOM.STR7);
                return;
            }
            if (content.length > VarVal.CHARLENGTH.CHATROOM) {
                UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYCHATROOM.STR8, [VarVal.CHARLENGTH.CHATROOM]));
                return;
            }
            let retInfo = GameServerData.getInstance().isChatRoomLimitSend(this.channelType, this.activityId);
        if (!GameServerData.getInstance().isHavePay()
            && GameServerData.getInstance().getPlayerFullInfo().base.level < 80
            && retInfo) { // 充值、到等级，不被前端禁言，任何一个达到则发送。
                let chatInfo = UtilsTool.deepCopy(retInfo);
                chatInfo.content = content;
                chatInfo.time = GameServerData.getInstance().getServerTime();
                let virInfo = {chatInfo:chatInfo};
                GameServerData.getInstance().env_chatInfoChanged(virInfo);
                onChatInfoChanged(virInfo);
        } else {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.input_content.text = "";
                    // 在消息事件中刷新
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "sendMsgChat", {
                receiverId: undefined,
                content: content,
                channelType: this.channelType,
                activityId: this.activityId,
            })
        }
        })

        // 页签
        let btn_chanel_world:fgui.GButton = group_main.getChild("btn_chanel_world");
        btn_chanel_world.text = StrVal.LYCHATROOM.STR1;
        btn_chanel_world.onClick(() => {
            this.updateChanelList(CHAT_CHANNELTYPE.WORLD, true);
        })
        let btn_chanel_faction:fgui.GButton = group_main.getChild("btn_chanel_faction");
        btn_chanel_faction.text = StrVal.LYCHATROOM.STR2;
        btn_chanel_faction.onClick(() => {
            if (GameServerData.getInstance().isClanHas()) {
                this.updateChanelList(CHAT_CHANNELTYPE.FACTION, true);
            } else {
                btn_chanel_faction.selected = false;
                UtilsUI.showMsgTip(PErrCode.chat_player_not_clan);
            }
        })
        let btn_chanel_activity:fgui.GButton = group_main.getChild("btn_chanel_activity");
        btn_chanel_activity.text = StrVal.LYCHATROOM.STR3;
        btn_chanel_activity.onClick(() => {
            this.updateChanelList(CHAT_CHANNELTYPE.ACTIVITY, true);
        })

        this.updateNewInfos();
        if (this.activityId) { // 默认在活动处打开
            this.chatInfosActivity = GameServerData.getInstance().getChatRoomMsgs(CHAT_CHANNELTYPE.FACTION, this.activityId);
            this.updateChanelList(CHAT_CHANNELTYPE.ACTIVITY, true);
        } else {
            btn_chanel_activity.visible = false;
            if (params && params.isNewMsgChannel) {
                this.updateChanelList(LyChatRoom.getChatShowChannel(), true);
            } else {
                this.updateChanelList(CHAT_CHANNELTYPE.WORLD, true);
            }
        }
    }

    private updateNewInfos():void {
        this.chatInfosWorld = GameServerData.getInstance().getChatRoomMsgs(CHAT_CHANNELTYPE.WORLD);
        this.chatInfosFaction = GameServerData.getInstance().getChatRoomMsgs(CHAT_CHANNELTYPE.FACTION);
    }

    private isSideRight(chatInfo:any):boolean {
        return chatInfo.senderInfo.guid == GameServerData.getInstance().getPlayerFullInfo().base.guid;
    }

    /*
    private pushToChanelList(chatInfo:any):boolean {
        if (chatInfo.channelType == CHAT_CHANNELTYPE.WORLD) {
            this.chatInfosWorld.push(chatInfo);
        } else if (chatInfo.channelType == CHAT_CHANNELTYPE.FACTION) {
            this.chatInfosFaction.push(chatInfo);
        } else if (chatInfo.channelType == CHAT_CHANNELTYPE.ACTIVITY) {
            if (this.activityId && chatInfo.activityId == this.activityId) {
                this.chatInfosActivity.push(chatInfo);
            }
        }
        return (chatInfo.channelType == this.channelType);
    }
    */

    private updateChanelList(channel:CHAT_CHANNELTYPE, isInit?:boolean):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");

        if (this.channelType != channel) {
            this.channelType = channel;

            let label_title:fgui.GTextField = group_main.getChild("label_title");
            let btn_chanel_world:fgui.GButton = group_main.getChild("btn_chanel_world");
            let btn_chanel_faction:fgui.GButton = group_main.getChild("btn_chanel_faction");
            let btn_chanel_activity:fgui.GButton = group_main.getChild("btn_chanel_activity");

            btn_chanel_world.touchable = true;
            btn_chanel_world.selected = false;
            btn_chanel_faction.touchable = true;
            btn_chanel_faction.selected = false;
            btn_chanel_activity.touchable = true;
            btn_chanel_activity.selected = false;

            this.chatInfosCurr = null;
            if (this.channelType == CHAT_CHANNELTYPE.WORLD) {
                btn_chanel_world.touchable = false;
                btn_chanel_world.selected = true;
                label_title.text = btn_chanel_world.text;
            } else if (this.channelType == CHAT_CHANNELTYPE.FACTION) {
                btn_chanel_faction.touchable = false;
                btn_chanel_faction.selected = true;
                label_title.text = btn_chanel_faction.text;
            } else if (this.channelType == CHAT_CHANNELTYPE.ACTIVITY) {
                btn_chanel_activity.touchable = false;
                btn_chanel_activity.selected = true;
                label_title.text = btn_chanel_activity.text;
            }
            UtilsUI.updateTabButtonColor(btn_chanel_world);
            UtilsUI.updateTabButtonColor(btn_chanel_faction);
            UtilsUI.updateTabButtonColor(btn_chanel_activity);
        }
        if (this.channelType == CHAT_CHANNELTYPE.WORLD) {
            this.chatInfosCurr = this.chatInfosWorld;
        } else if (this.channelType == CHAT_CHANNELTYPE.FACTION) {
            this.chatInfosCurr = this.chatInfosFaction;
        } else if (this.channelType == CHAT_CHANNELTYPE.ACTIVITY) {
            this.chatInfosCurr = this.chatInfosActivity;
        }
        let list_chat:fgui.GList = group_main.getChild("list_chat");
        if (this.chatInfosCurr) {
            if (isInit) {
                UtilsUI.setFguiGlistDelayNumItems(list_chat, this.chatInfosCurr.length, 0.01);
                list_chat.scrollPane.scrollBottom(false);
            } else {
                if (-list_chat.scrollPane._container.position.y > -list_chat.scrollPane._overlapSize.y + 100) {
                    UtilsUI.setFguiGlistDelayNumItems(list_chat, this.chatInfosCurr.length, 0.01);
                    // 无操作
                } else {
                    UtilsUI.setFguiGlistDelayNumItems(list_chat, this.chatInfosCurr.length, 0.01);
                    list_chat.scrollPane.scrollBottom(false);
                }
            }
        } else {
            list_chat.numItems = 0;
        }
    }
    
    public getIsViewMask():boolean {
        return false;
    }

    public static getChatContentEmoji(content:string):any {
        if (content.indexOf("{") == 0) {
            let id = content.substring(content.indexOf("{") + 1, content.indexOf("}"));
            let emojiItem = LocaleData.getChatEmojiItem(id);
            return emojiItem;
        }
    }

    public static isChatContentEmoji(content:string):boolean {
        if (content.indexOf("{") == 0) {
            return true;
        } else {
            return false;
        }
    }

    private static getChatShowChannel():CHAT_CHANNELTYPE {
        let world = GameServerData.getInstance().getChatRoomMsgs(CHAT_CHANNELTYPE.WORLD);
        let faction = GameServerData.getInstance().getChatRoomMsgs(CHAT_CHANNELTYPE.FACTION);
        if (world.length > 0 && faction.length == 0) {
            return CHAT_CHANNELTYPE.WORLD;
        } else if (world.length == 0 && faction.length > 0) {
            return CHAT_CHANNELTYPE.FACTION;
        } else if (world.length > 0 && faction.length > 0) {
            if (world[world.length - 1].time >= faction[faction.length - 1].time) {
                return CHAT_CHANNELTYPE.WORLD;
            } else {
                return CHAT_CHANNELTYPE.FACTION;
            }
        } else {
            return CHAT_CHANNELTYPE.WORLD;
        }
    }

    public static getChatShowMainPage():string {
        let msgs:Array<any>;
        if (this.getChatShowChannel() == CHAT_CHANNELTYPE.FACTION) {
            msgs = GameServerData.getInstance().getChatRoomMsgs(CHAT_CHANNELTYPE.FACTION);
        } else {
            msgs = GameServerData.getInstance().getChatRoomMsgs(CHAT_CHANNELTYPE.WORLD);
        }
        if (msgs.length > 0) {
            let chatInfo:any = msgs[msgs.length - 1];
            let newtext:string;
            let emojiItem = LyChatRoom.getChatContentEmoji(chatInfo.content);
            if (emojiItem) {
                newtext = emojiItem.describe;
            } else {
                newtext = chatInfo.content;
            }
            let channelText:string;
            if (chatInfo.channelType == CHAT_CHANNELTYPE.WORLD) {
                channelText = StrVal.LYCHATROOM.STR1;
            } else {
                channelText = StrVal.LYCHATROOM.STR2;
            }
            return UtilsTool.stringFormat(StrVal.LYCHATROOM.STR6, [channelText, chatInfo.senderInfo.name, newtext]);
        }
    }
}