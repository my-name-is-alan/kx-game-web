//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { PErrCode } from "../Values/PErrCode";

enum WebSocketBinaryType {
    arraybuffer = "arraybuffer",
    blob = "blob",
}

export class SocketClient {

	private socket:WebSocket;

	private state:number;

	private static TCP_INIT:number = 1;
	private static TCP_CONNECTING:number = 2;
	private static TCP_CONNECTED:number = 3;
	private static TCP_CLOSED:number = 4;

	private recvKeepTime:number = 9999999999; // 接收数据最大空闲时间，服务器必须定时发送保活【用来检测网络中断情况】
	private lastRecvTime:number = 0; // 上次接收数据的时间【用来检测网络中断情况】

	private receiveCallback:Function;
	private becloseCallback:Function;
	private connectCallback:Function;

	public constructor () {
		this.state = SocketClient.TCP_INIT;
	}

	private createWebSocket(url:string):void {
		this.closeSocket();
		//创建 WebSocket 对象
        this.socket = new WebSocket(url);
        //设置数据格式为二进制，默认为字符串
        this.socket.binaryType = WebSocketBinaryType.arraybuffer;

        //添加链接打开侦听，连接成功会调用此方法
        this.socket.onopen = (ev: Event) => {
			console.log("onSocketOpen");
			this.state = SocketClient.TCP_CONNECTED;
			if (this.connectCallback) {
				this.connectCallback(0);
				this.connectCallback = null;
			}
		};
        //添加链接关闭侦听，手动关闭或者服务器关闭连接会调用此方法
		let onSocketClose = () => {
			if (this.state == SocketClient.TCP_CONNECTED) {
				this.closeSocket();
				if (this.becloseCallback) {
					this.becloseCallback();
				}
			}
			else if (this.state == SocketClient.TCP_CONNECTING) {
				this.closeSocket();
				if (this.connectCallback) {
					this.connectCallback(PErrCode.ERROR_CONNECT);
					this.connectCallback = null;
				}
			}
		}
		this.socket.onclose = (ev: Event) => {
			console.warn("onSocketClose");
			onSocketClose();
		};
        //添加异常侦听，出现异常会调用此方法
		this.socket.onerror = (ev: Event) => {
			// 连接时地址错误会触发这里，后再触发close。
			console.warn("onSocketError");
			onSocketClose(); // 小游戏只触发了onerror，后没触发onclose。
		};
		//添加收到数据侦听，收到数据会调用此方法
		this.socket.onmessage = (ev: MessageEvent<any>) => {
			// console.log("onSocketReceive");
			if (this.receiveCallback) {
				this.receiveCallback(ev.data);
			}
		};
	}

	private closeSocket():void {
		if (this.socket) {
			this.state = SocketClient.TCP_CLOSED;
			this.socket.onopen = null;
			this.socket.onclose = null;
			this.socket.onerror = null;
			this.socket.onmessage = null;
			if (this.socket.readyState == this.socket.CONNECTING || this.socket.readyState == this.socket.OPEN) {
				this.socket.close(); // 测试得出，关闭之后再关闭是被忽略的。
			}
			this.socket = null;
		}
	}

	public setRecvKeepTime(keepTime:number) {
		this.recvKeepTime = keepTime;
	}

	public setCallback(recCallback:Function, becCallback:Function):void {
		this.receiveCallback = recCallback;
		this.becloseCallback = becCallback;
	}

	public connect(callback:Function, url:string, host:string, port:number):void {
		// 测试得出，当已连接的时候再次连接相同地址（暂未测试前后不同地址）是没有任何效果，此操作被忽略了。// 这里依然加上判断。
		// 关闭之后，套接字是可以重复使用重新连接的。
		if (this.state == SocketClient.TCP_CONNECTED) {
			if (callback) {
				callback(PErrCode.ERROR_CONNECTED);
			}
		}
		else if (this.state == SocketClient.TCP_CONNECTING) {
			if (callback) {
				callback(PErrCode.ERROR_CONNECTING);
			}
		}
		else {
			this.connectCallback = callback;
			this.state = SocketClient.TCP_CONNECTING;
			if (url && url.length > 0) {
				this.createWebSocket(url);
			}
			else {
				// this.connectSocket(host, port);
			}
		}
	}

	public send(callback:Function, data:ArrayBuffer):void {
		if (this.state == SocketClient.TCP_CONNECTED) {
			this.socket.send(data);
			// 暂时假装每次操作都成功。
			if (callback) {
				callback(0);
			}
		}
		else {
			if (callback) {
				callback(PErrCode.ERROR_NOCONNECT);
			}
		}
	}

	public close():void {
		this.closeSocket();
	}
}