//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import { FmDebugStatus } from "../Views/FmDebugStatus";
import { FmGuideFifgtPower } from "../Views/FmGuideFifgtPower";
import { FmMsgTip } from "../Views/FmMsgTip";
import { FmWait, FmMask } from "../Views/FmWait";
import { LyAttachEquip } from "../Views/LyAttachEquip";
import { LyBattleMain } from "../Views/LyBattleMain";
import { LyBattleResult } from "../Views/LyBattleResult";
import { LyGuideStart } from "../Views/LyGuideStart";
import { LyLogin } from "../Views/LyLogin";
import { LyLoginAccount } from "../Views/LyLoginAccount";
import { LyLoginNotice } from "../Views/LyLoginNotice";
import { LyLoginServerList } from "../Views/LyLoginServerList";
import { LyLogo } from "../Views/LyLogo";
import { LyLogoUpdate } from "../Views/LyLogoUpdate";
import { LyMainPage } from "../Views/LyMainPage";
import { LyMsgBox, FmMsgBox } from "../Views/LyMsgBox";
import { LyThunder } from "../Views/LyThunder";

class LyDefault extends ViewLayer {
    public onViewCreate(params: any): void {}
}

export class VarFunc {
    public static PRIORITYS = [
        // 登录前期
        LyLogo,
        LyLogin,
        LyLoginNotice,
        LyLoginServerList,
        LyLoginAccount,
        LyLogoUpdate,

        // 主界面
        LyMainPage,
        // 普通界面默认值
        LyDefault,
        // 装备
        LyAttachEquip,
        // 战斗
        LyBattleMain,
        LyBattleResult,
        // 渡劫
        LyThunder,
        // 引导指引
        LyGuideStart,

        // 以下是弹窗
        LyMsgBox,
        FmGuideFifgtPower,
        FmMsgTip,
        FmWait,
        FmMask,
        FmMsgBox, // 系统消息
        FmDebugStatus, // 状态调试面板
    ]

    public static getViewPriority(viewCtor: new () => ViewLayer):number {
        for (let priority = 0; priority < this.PRIORITYS.length; priority++) {
            if (this.PRIORITYS[priority] == viewCtor) {
                return priority;
            }
        }
        return this.getViewPriority(LyDefault);
    }
}