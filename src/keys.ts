import keycode from "keycode";

export class Keys {

    downKeys: { [key: number]: boolean };
    clickedKeys: { [key: number]: boolean };
    debugStr?: string

    constructor(document: HTMLDocument, debugStr?: string) {
        this.downKeys = {};
        this.clickedKeys = {};
        document.addEventListener('keydown', this.onkeydown.bind(this));
        document.addEventListener('keyup', this.onkeyup.bind(this));
    }

    isPressed(name: string) {
        const code = keycode(name);
        return this.isPressedKey(code);
    }

    gotClicked(name: string) {
        const code = keycode(name);
        return this.gotClickedKey(code);
    }

    onkeyup(event: KeyboardEvent) {
        this.downKeys[event.keyCode] = false;
    };

    onkeydown(event: KeyboardEvent) {
        this.downKeys[event.keyCode] = true;
        this.clickedKeys[event.keyCode] = true;
    };

    isPressedKey(key: number) {
        if (this.downKeys.hasOwnProperty(key)) {
            return this.downKeys[key];
        } else {
            return false;
        }
    }

    gotClickedKey(key: number) {
        if (this.clickedKeys.hasOwnProperty(key)) {
            const value = this.clickedKeys[key];
            this.clickedKeys[key] = false;
            return value;
        } else {
            return false;
        }
    }
}
