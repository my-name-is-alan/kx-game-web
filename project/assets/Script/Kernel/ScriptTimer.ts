//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

// ViewLayer拷贝的相同代码，请同步修改。
export class ScriptTimer {
    private constructor () {}

    private static intervalIds:Array<number> = new Array<number>();
    private static timeoutIds:Array<number> = new Array<number>();

    public static clear() {
        for (let i = 0; i < ScriptTimer.intervalIds.length; i++) {
            clearInterval(ScriptTimer.intervalIds[i]);
        }
        ScriptTimer.intervalIds = new Array<number>();
        for (let i = 0; i < ScriptTimer.timeoutIds.length; i++) {
            clearTimeout(ScriptTimer.timeoutIds[i]);
        }
        ScriptTimer.timeoutIds = new Array<number>();
    }

    /**
     * 设置定时器，指定毫秒间隔时间循环触发。
     */
    public static setInterval(callback:TimerHandler, millisecond:number):number {
        let intervalId:number = setInterval(callback, millisecond);
        ScriptTimer.intervalIds.push(intervalId);
        return intervalId;
    }

    /**
     * 清除定时器。
     */
    public static clearInterval(intervalId:number) {
        let hitIndex:number = -1;
        for (let i = 0; i < ScriptTimer.intervalIds.length; i++) {
            if (ScriptTimer.intervalIds[i] == intervalId) {
                hitIndex = i;
                break;
            }
        }
        if (hitIndex >= 0) {
            ScriptTimer.intervalIds.splice(hitIndex, 1);
            clearInterval(intervalId);
        }
    }

    /**
     * 设置超时器，指定毫秒间隔单次触发结束。
     */
    public static setTimeout(callback:Function, millisecond:number):number {
        // 中间再嵌套一层回调，结束后自动移除。
        let timeoutId:number = 0;
        let handler:TimerHandler = () => {
			ScriptTimer.clearTimeout(timeoutId);
            callback();
		};
        timeoutId = setTimeout(handler, millisecond);
        ScriptTimer.timeoutIds.push(timeoutId);
        return timeoutId;
    }

    /**
     * 清除超时器。
     */
    public static clearTimeout(timeoutId:number) {
        let hitIndex:number = -1;
        for (let i = 0; i < ScriptTimer.timeoutIds.length; i++) {
            if (ScriptTimer.timeoutIds[i] == timeoutId) {
                hitIndex = i;
                break;
            }
        }
        if (hitIndex >= 0) {
            ScriptTimer.timeoutIds.splice(hitIndex, 1);
            clearTimeout(timeoutId);
        }
    }
}