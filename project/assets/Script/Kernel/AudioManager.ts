//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { AudioClip, AudioSource, director, resources } from "cc";
// 这里如果导入PlatformAPI会导致循环引用，什么情况？

export class AudioManager {
	private constructor() { }

	private static isOpenBGM: boolean = true;
	private static isOpenEFT: boolean = true;

	private static volumeALL:number = 100;
	private static volumeBGM:number = 100;
	private static volumeBGMMix:number = 1;
	private static volumeEFT:number = 100;
	private static volumeEFTMix:number = 1;

	private static sourceBGM:AudioSource;
	private static backBGMPaths:Array<string> = new Array<string>();

	public static setALLVolume(volume:number): void {
		AudioManager.volumeALL = volume;
		AudioManager.setBGMVolume(AudioManager.volumeBGM);
		AudioManager.setEFTVolume(AudioManager.volumeEFT);
	}

	public static setBGMVolume(volume:number): void {
		AudioManager.volumeBGM = volume;
		AudioManager.volumeBGMMix = AudioManager.volumeALL * AudioManager.volumeBGM / 10000;

		// 设置当前
		if (AudioManager.sourceBGM) {
			AudioManager.sourceBGM.volume = AudioManager.volumeBGMMix;
		}
	}

	public static setEFTVolume(volume:number): void {
		AudioManager.volumeEFT = volume;
		AudioManager.volumeEFTMix = AudioManager.volumeALL * AudioManager.volumeEFT / 10000;
	}

	private static deleteSourceBGM(): void {
		if (AudioManager.sourceBGM) {
			AudioManager.sourceBGM.destroy();
			AudioManager.sourceBGM = null;
		}
	}

	private static createAudioSource(): AudioSource {
		let source:AudioSource = director.getScene().getChildByName('Canvas').addComponent(AudioSource);
		source.playOnAwake = false;
		return source;
	}

	private static doPlayBGM(path: string): void {
		if (path != AudioManager.backBGMPaths[AudioManager.backBGMPaths.length - 1]) {
			if (AudioManager.sourceBGM) {
				if (AudioManager.sourceBGM.playing) {
					AudioManager.sourceBGM.stop();
				}
				AudioManager.sourceBGM.destroy();
				AudioManager.sourceBGM = null;
			}
			if (path && path.length > 0) {
				AudioManager.backBGMPaths.push(path);
				// 删除下，不要累积太多
				if (AudioManager.backBGMPaths.length > 20) {
					AudioManager.backBGMPaths.shift();
				}
				
				if (!AudioManager.isOpenBGM) {
					return;
				}
				
				resources.load(path, (err:Error, asset:AudioClip) => {
					if (asset) {
						if (!AudioManager.isOpenBGM) {
							return;
						}
						if (path != AudioManager.backBGMPaths[AudioManager.backBGMPaths.length - 1]) {
							return;
						}

						if (!AudioManager.sourceBGM) {
							AudioManager.sourceBGM = AudioManager.createAudioSource();
							AudioManager.sourceBGM.loop = true;
							AudioManager.sourceBGM.volume = AudioManager.volumeBGMMix;
						}
						AudioManager.sourceBGM.clip = asset;
						AudioManager.sourceBGM.play();
					}
				});
			}
		}
	}

	/**
	 * 是否播放背景音乐。
	 */
	public static setBGMEnabled(bool: boolean): void {
		if (AudioManager.isOpenBGM != bool) {
			AudioManager.isOpenBGM = bool;
			if (bool) {
				if (AudioManager.backBGMPaths.length > 0) {
					AudioManager.doPlayBGM(AudioManager.backBGMPaths.pop());
				}
			} else {
				AudioManager.deleteSourceBGM();
			}
		}
	}
	public static isBGMEnabled(): boolean {
		return AudioManager.isOpenBGM;
	}

	/**
	 * 是否暂停背景音乐。
	 */
	public static setBGMPause(bool: boolean): void {
		if (AudioManager.sourceBGM) {
			if (bool) {
				if (AudioManager.sourceBGM.playing) {
					AudioManager.sourceBGM.pause();
				}
			} else {
				if (!AudioManager.sourceBGM.playing) {
					AudioManager.sourceBGM.play();
				}
			}
		}
	}

	/**
	 * 是否播放音效。
	 */
	public static setEFTEnabled(bool: boolean): void {
		AudioManager.isOpenEFT = bool;
		fgui.GRoot.inst.volumeScale = bool ? 1 : 0
	}
	public static isEFTEnabled(): boolean {
		return AudioManager.isOpenEFT;
	}

	/**
	 * 播放背景音乐，同时只能播放一个背景音乐，队列播放。
	 */
	public static playBGM(path: string): void {
		AudioManager.doPlayBGM(path);
	}

	/**
	 * 播放背景音乐，回到上次播放。
	 */
	public static playBGMBack(): void {
		if (AudioManager.backBGMPaths.length > 0) {
			AudioManager.backBGMPaths.pop();
		}
		if (AudioManager.backBGMPaths.length > 0) {
			AudioManager.doPlayBGM(AudioManager.backBGMPaths.pop());
		} else {
			AudioManager.deleteSourceBGM();
		}
	}

	/**
	 * 播放音频特效，单次。
	 */
	public static playEFT(path: string): void {
		if (path && path.length > 0) {
			if (!AudioManager.isOpenEFT) {
				return;
			}

			resources.load(path, (err:Error, asset:AudioClip) => {
				if (asset) {
					if (!AudioManager.isOpenEFT) {
						return;
					}

					/*
					let source:AudioSource = AudioManager.createAudioSource();
					source.loop = false;
					source.volume = AudioManager.volumeEFTMix;
					source.clip = asset;
					source.play();
					*/
					// 采用同一个对象挂载。
					if (!AudioManager.sourceBGM) {
						AudioManager.sourceBGM = AudioManager.createAudioSource();
						AudioManager.sourceBGM.loop = true;
						AudioManager.sourceBGM.volume = AudioManager.volumeBGMMix;
					}
					AudioManager.sourceBGM.playOneShot(asset, AudioManager.volumeEFTMix / AudioManager.volumeBGMMix);
				}
			});
		}
	}

	/**
	 * 清空管理器。
	 */
	public static clear(): void {
		AudioManager.deleteSourceBGM();
		AudioManager.backBGMPaths = new Array<string>();
		// 其余的再次初始化时会设置。
	}
}