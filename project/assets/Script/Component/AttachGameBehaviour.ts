import { Component } from 'cc';

export class AttachGameBehaviour extends Component {
    private updateFunc:Function;
    private lateUpdateFunc:Function;

    setUpdateFunc(func:Function) {
        this.updateFunc = func;
    }

    setLateUpdateFunc(func:Function) {
        this.lateUpdateFunc = func;
    }

    update(deltaTime: number) {
        if (this.updateFunc) {
            this.updateFunc(deltaTime);
        }
    }

    lateUpdate(dt: number): void {
        if (this.lateUpdateFunc) {
            this.lateUpdateFunc(dt);
        }
    }
}


