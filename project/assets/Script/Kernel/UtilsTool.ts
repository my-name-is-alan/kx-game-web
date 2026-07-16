//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { Base64 } from "../Protos/Base64";
import { StrVal } from "../Values/StrVal";
import { GameServerData } from "./GameServerData";
import { LocaleData } from "./LocaleData";

export class UtilsTool {
    private constructor() { }

    public static ONEDAY_MILLISECONDS = 86400000;

    /**
     * 字符格式化。
     */
    public static stringFormat(text: string, values: Array<any>): string {
        return text.replace(/\{(\d+)\}/g, (match, index) => {
            if (values.length > index) {
                return values[index];
            } else {
                return "";
            }
        });
    }

    /**
     * 整型number秒时间分割为 {hour:_hour, minute:_minute, second:_second}。
     */
    public static splitTime(num: number): any {
        num = Math.max(num, 0);
        let _hour: number = Math.floor(num / 3600);
        let _remain: number = num % 3600;
        let _minute: number = Math.floor(_remain / 60);
        let _second: number = Math.floor(_remain % 60);
        return { hour: _hour, minute: _minute, second: _second };
    }


    /**
     * 时间转换为 正常北京时间(string类型) 默认格式:m-d H-i-s或Y-m-d H-i-s
     * @param unixTimestamp 秒，时间戳(服务端发过来的一般都是用秒为单位的时间戳)
     * @param showYear 是否显示年份 (不传则默认为false不显示)
     * @constructor
     */
    public static TimeToStr(unixTimestamp: string | number, splitStr?:string, isShowYear = false): string {
        unixTimestamp = Number(unixTimestamp);
        if (!splitStr) { splitStr = '-'}
        let date = new Date(unixTimestamp * 1000);
        let Str = (isShowYear ? date.getFullYear() + splitStr : "")
            + (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1) + splitStr
            + (date.getDate() < 10 ? "0" : "") + date.getDate() + ' '
            + (date.getHours() < 10 ? "0" : "") + date.getHours() + ':'
            + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes() + ':'
            + (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
        return Str;
    }

    /**
     * 获得年-月-日（1970-01-01）
     */
    public static TimeToDateStr(time:number, split?:string) {
        if (!split) {
            split = "-";
        }
        let date = new Date(time * 1000);
        let Str = (date.getFullYear() + split)
            + (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1) + split
            + (date.getDate() < 10 ? "0" : "") + date.getDate();
        return Str;
    }

    /**多少天前 或多少小时前 或多少分钟前 或在线 */
    public static pastTimeToString(num: number) {
        if (num <= 0) return StrVal.COMMON.STR17;
        let pastTime: number = GameServerData.getInstance().getServerTime() - num;
        let day = pastTime / (24 * 60 * 60);
        if (day >= 1) return UtilsTool.stringFormat(StrVal.COMMON.STR14, [Math.floor(day)>7?7:Math.floor(day)]);
        let hour = pastTime / (60 * 60);
        if (hour >= 1) return UtilsTool.stringFormat(StrVal.COMMON.STR15, [Math.floor(hour)]);
        let minute = pastTime / (60);
        if (minute >= 1) return UtilsTool.stringFormat(StrVal.COMMON.STR16, [Math.floor(minute)]);
        return StrVal.COMMON.STR17;
    }

    /**
     * 传入seconds秒获得当前时间字符串（00:00:00 昨天 前天 三天以前）
     */
    public static timeToAgo(seconds: number): string {
        let todayStart = UtilsTool.getStartDateTime(GameServerData.getInstance().getServerTime() * 1000);
        let todayTime = seconds * 1000 - todayStart;
        if (todayTime >= 0) {
            return UtilsTool.splitTimeString(todayTime / 1000, true);
        } else if (todayTime >= 0 - UtilsTool.ONEDAY_MILLISECONDS) {
            return StrVal.COMMON.STR20;
        } else if (todayTime >= 2 * (0 - UtilsTool.ONEDAY_MILLISECONDS)) {
            return StrVal.COMMON.STR21;
        } else {
            return StrVal.COMMON.STR22;
        }
    }


    /**
     * Y-m-d H-i-s 格式转换为倒计时， 用于显示cd时间。
     */
    public static ymdToAgo(strTime){
        let tdata = new Date(Date.parse(strTime));
        let endTime = tdata.getTime() / 1000
        return this.parseTimeToString(Number(endTime)  - GameServerData.getInstance().getServerTime()) 
    }

    /**
     * 整型number秒时间计算出 天 小时 分 秒， 用于显示cd时间。
     */
    public static parseTimeToString(num: number): string {
        let timeSplit = UtilsTool.splitTime(num);
        let day = Math.floor(timeSplit.hour / 24);
        let hour = timeSplit.hour % 24;
        let minute = timeSplit.minute;
        let sec = timeSplit.second;
        if (day > 0) {
            if (hour > 0) {
                return UtilsTool.stringFormat(StrVal.COMMON.STR205, [day, hour]);
            } else {
                return UtilsTool.stringFormat(StrVal.COMMON.STR201, [day]);
            }
        } else {
            if (hour > 0) {
                if (minute > 0) {
                    return UtilsTool.stringFormat(StrVal.COMMON.STR206, [hour, minute]);
                } else {
                    return UtilsTool.stringFormat(StrVal.COMMON.STR202, [hour]);
                }
            } else {
                if (minute > 0) {
                    if (sec > 0) {
                        return UtilsTool.stringFormat(StrVal.COMMON.STR207, [minute, sec]);
                    } else {
                        return UtilsTool.stringFormat(StrVal.COMMON.STR203, [minute]);
                    }
                }
            }
        }

        return UtilsTool.stringFormat(StrVal.COMMON.STR204, [sec]);
    }

    /**
     * 整型number秒时间分割为00:00:00字符串。
     */
    public static splitTimeString(num: number, isMustHour?:boolean): string {
        let time: any = UtilsTool.splitTime(num);
        let text: string = "";
        if (isMustHour || time.hour > 0) {
            text = text + (time.hour < 10 ? "0" + time.hour : time.hour) + ":";
        }
        text = text + (time.minute < 10 ? "0" + time.minute : time.minute) + ":";
        text = text + (time.second < 10 ? "0" + time.second : time.second);
        return text;
    }

    /**
     * 获得由此时间戳开始算，下一个星期几0时0分0秒的时间戳（0星期天-6星期六）。
     */
    public static getNextSpecificTimeByDay(milliseconds:number, day: number): number {
        for (let i = 1; i < 8; i++) {
            let date = new Date(milliseconds + i * UtilsTool.ONEDAY_MILLISECONDS);
            if (date.getDay() == day) {
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                return date.getTime();
            }
        }
    }

    /**
     * 获得由此时间戳开始算，返回当天结束的时间戳（毫秒），也就是第二天的0时0分0秒的时间戳。
     */
    public static getNextDateTime(milliseconds:number, addDay?:number): number {
        let date = new Date(milliseconds + UtilsTool.ONEDAY_MILLISECONDS + (addDay ? (addDay * UtilsTool.ONEDAY_MILLISECONDS) : 0));
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.getTime();
    }

    /**
     * 获得由此时间戳开始算，返回当天开始的时间戳（毫秒），也就是今天的0时0分0秒的时间戳。
     */
    public static getStartDateTime(milliseconds:number): number {
        let date = new Date(milliseconds);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.getTime();
    }

    /**
     * 转换字符串2021-09-13 11:00:00为时间戳。
     */
    public static getUnixTimeMilliseconds(timestr:string): number {
        if (!timestr) {
            timestr = "2024-01-01 00:00:00";
        }
        let ttt = timestr.split(" ");
        let ymd = ttt[0].split("-");
        let hms = ttt[1].split(":");
        let date = new Date();
        date.setFullYear(Number(ymd[0]), Number(ymd[1]) - 1, Number(ymd[2]));
        date.setHours(Number(hms[0]), Number(hms[1]), Number(hms[2]), 0);
        return date.getTime();
    }

    /**
     * 整型值转换成万或亿保留2位有效数字。
     */
    public static nToFStr(num: number|string): string {
        num = Number(num);
        if (num >= 1000000000000) {
            num = num / 1000000000000;
            return UtilsTool.stringFormat(StrVal.COMMON.STR10, [num.toFixed(2)]);
        }
        else if (num >= 100000000) { // 1000000000就是超过10亿才会改
            num = num / 100000000;
            return UtilsTool.stringFormat(StrVal.COMMON.STR13, [num.toFixed(2)]);
        }
        else if (num >= 100000) {
            num = num / 10000;
            return UtilsTool.stringFormat(StrVal.COMMON.STR12, [num.toFixed(2)]);
        }
        else {
            return String(num);
        }
    }

    /**
     * 随机一个整数在两个数之间[num1, num2]，参数可以是小数，得出来的值做Math.round()向下或向上取整。
     */
    public static random(num1: number, num2: number): number {
        let min: number = 0;
        let max: number = 0;
        if (num1 > num2) {
            min = num2;
            max = num1;
        }
        else if (num2 > num1) {
            min = num1;
            max = num2;
        }
        else {
            return Math.round(num1);
        }
        let rand = Math.random();
        return Math.round(min + (max - min) * rand);
    }

    private static regEn = /[ `~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
    private static regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    private static regAc = /^[A-Za-z0-9_]+$/; // 字母数字下划线组合
    /**
     * 含特殊字符？
     */
    public static hasSpecial(text: string): boolean {
        if (UtilsTool.regEn.test(text) || UtilsTool.regCn.test(text)) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * 含敏感词？
     */
    public static hasSensitive(text: string): boolean {
        let words: Array<string> = LocaleData.getSensitiveWords();
        for (let i = 0; i < words.length; i++) {
            if (text.indexOf(words[i]) >= 0) {
                return true;
            }
        }
        return false
    }

    /**
     * 替换字符串中的敏感字。
     */
    public static replaceSensitive(text: string): string {
        let content: string = text;
        let words: Array<string> = LocaleData.getSensitiveWords();
        for (let i = 0; i < words.length; i++) {
            let reg: string = words[i];
            if (content.indexOf(reg) >= 0) {
                content = content.replace(new RegExp(reg, 'g'), new Array(reg.length + 1).join("*"));
            }
        }
        return content;
    }

    /**
     * 账号名非法？
     */
    public static illegalAccount(text: string): boolean {
        if (UtilsTool.regAc.test(text)) {
            return false;
        }
        else {
            return true;
        }
    }

    /**
     * 计算UTF8字符串长度。改自 https://www.jianshu.com/p/39dab8d61473
     */
    public static getUTF8Length(str: string): number {
        let length: number = 0;
        for (let i = 0; i < str.length; i++) {
            let c: number = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                length += 4;
            }
            else if (c >= 0x000800 && c <= 0x00FFFF) {
                length += 3;
            }
            else if (c >= 0x000080 && c <= 0x0007FF) {
                length += 2;
            }
            else {
                length += 1;
            }
        }
        return length;
    }

    /**
     * 计算UTF8字符串宽度数量（1个汉字的宽度顶2个字母宽度）。
     */
    public static getUTF8Count(str: string): number {
        let count: number = 0;
        for (let i = 0; i < str.length; i++) {
            let c: number = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                count += 2;
            }
            else if (c >= 0x000800 && c <= 0x00FFFF) {
                count += 2;
            }
            else if (c >= 0x000080 && c <= 0x0007FF) {
                count += 2;
            }
            else {
                count += 1;
            }
        }
        return count;
    }

    /**
     * 获得某字符串重复多少次后的串
     */
     public static stringRepeat(str: string, times: number): string {
        return new Array(times + 1).join(str);
    }

    public static base64Encode(str: string): string {
        return Base64.encode(str);
    }

    public static base64Decode(str: string): string {
        return Base64.decode(str);
    }

    public static getObjLength(obj: any): number {
        if (obj instanceof Array) {
            return obj.length;
        } else {
            return 0;
        }
    }

    //大数带单位
    public static getBigNumToUnit(value: number|string):string{
        value = Number(value)
        let str: string = ""
        let k: number = 10000
      
        let i:number;
        if (value < k) {
            str = value.toFixed(2)
        } else {
            i = Math.floor(Math.log(value) / Math.log(k))
            str = UtilsTool.stringFormat("{0}{1}", [((value / Math.pow(k, i))).toFixed(2), StrVal.UNIT_STR[i]])
        }
        return str
    }

    public static isNotEmptyObject(obj: any): boolean {
        return  Object.keys(obj).length != 0;
    }

    public static addEntitiAttrVal(vals:Array<string>, type:number, val:number | string):void {
        vals[type - 1] = String(Number(vals[type - 1]) + Number(val))
    }

    public static deepCopy(obj:any) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * UTF8字符串转换为字节数组。（没用到先屏蔽省资源）出自 https://www.jianshu.com/p/39dab8d61473
     */
    /*
    public static stringToBytes(str:string):Array<number> {
        let bytes:Array<number> = new Array();
        for (let i = 0; i < str.length; i++) {
            let c:number = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            }
            else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            }
            else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            }
            else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;
    }
    */

    /**
     * 字节数组转换为UTF8字符串。（没用到先屏蔽省资源）出自 https://www.jianshu.com/p/39dab8d61473
     */
    /*
    public static bytesToString(bytes:Array<number>):string {
        let str = "";
        for (let i = 0; i < bytes.length; i++) {
            let one:string = bytes[i].toString(2);
            let v = one.match(/^1+?(?=0)/);
            if (v && one.length == 8) {
                let bytesLength = v[0].length;
                let store = bytes[i].toString(2).slice(7 - bytesLength);
                for (let st = 1; st < bytesLength; st++) {
                    store += bytes[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            }
            else {
                str += String.fromCharCode(bytes[i]);
            }
        }
        return str;
    }
    */
}