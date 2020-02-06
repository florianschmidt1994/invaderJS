import {Keys} from "./keys";
import Bullet from "./Bullet";
import {Target} from "./Target";

function createLeaf(el: HTMLElement): TargetNode {
    return new TargetNode(new Target(<HTMLElement>el), []);
}

function createTargets(el: HTMLElement): TargetNode {

    let children = el.children;

    if (children.length === 0) {
        return createLeaf(el);
    } else {
        // @ts-ignore
        return new TargetNode(new Target(el), [].map.call(children, el => createTargets(el)))
    }
}

class TargetNode {
    children: TargetNode[];
    self: Target;

    constructor(self: Target, children: TargetNode[]) {
        this.self = self;
        this.children = children;
    }

    update() {
        this.self.update();
        for (let child of this.children) {
            child.update();
        }
    }

    checkHasHitAny(bullet: Bullet): boolean {
        if (this.children.length === 0) {

            if (this.self.isHit) {
                return false;
            }

            if (hit(bullet, this.self)) {
                this.self.setIsHit(true);
                return true;
            } else {
                return false;
            }
        } else {

            if (!hit(bullet, this.self)) {
                return false;
            }

            let hasHitAny: boolean = false;

            for (let child of this.children) {
                hasHitAny = hasHitAny || child.checkHasHitAny(bullet);
            }

            return hasHitAny;
        }

    }
}

function hellWorld() {

    const fps = 60;

    parseDom(document.body);
    const rocketHtmlElement = addRocket(document);
    const bulletsHtmlContainer = addBullets(document);

    document.body.style.marginBottom = "100px";

    const rocket = new Rocket(rocketHtmlElement, new Keys(document, "test"));
    const gameKeys = new Keys(document);

    let bullets: Bullet[] = [];
    let targets = createTargets(document.body);

    window.addEventListener('keydown', function (e) {
        if (e.keyCode == 32 && e.target == document.body) {
            e.preventDefault();
        }
    });

    setInterval(() => {
        rocket.update();

        if (gameKeys.gotClicked("space")) {
            const {x, y} = rocket.getBulletCenter();
            bullets.push(new Bullet(bulletsHtmlContainer, x, y));
        }

        bullets.forEach(b => b.update());

        targets.update();

        bullets.forEach(bullet => {
            const isHit = targets.checkHasHitAny(bullet);
            if (isHit) {
                bullet.setHasHit();
            }
        });

        bullets = bullets.filter(bullet => !bullet.hasHit);

    }, 1000 / fps);
}

// check if a bullet is hitting a target
function hit(bullet: Bullet, target: Target) {

    const rectA = bullet.htmlElement.getBoundingClientRect();
    const rectB = target.htmlElement.getBoundingClientRect();

    return !(rectB.left >= rectA.right ||
        rectB.right <= rectA.left ||
        rectB.top >= rectA.bottom ||
        rectB.bottom <= rectA.top);
}

let count: number = 0;

function generateId(): string {
    return (count++).toString();
}

function parseDom(e: HTMLElement) {

    if (e.children.length === 0) {
        addId(e);
    } else {
        for (let i = 0; i < e.children.length; i++) {
            parseDom(<HTMLElement>e.children[i]);
        }
    }
}

function addId(e: HTMLElement) {
    if (e.innerText && e.innerText !== "") {

        const innerText = e.innerText;
        e.innerText = "";

        for (let letter of innerText.split("")) {
            let newChild = document.createElement("span");
            newChild.innerText = letter;
            newChild.setAttribute("data-spaceinvader-id", generateId());
            e.appendChild(newChild);
        }
    }
}

function addRocket(doc: HTMLDocument): HTMLElement {
    const el = document.createElement("div");
    el.setAttribute("data-spaceinvader-rocket", "rocket");
    doc.body.appendChild(el);

    return el;
}

function addBullets(doc: HTMLDocument): HTMLElement {
    const el = document.createElement("div");
    el.setAttribute("data-spaceinvader-bullets", "bullets");
    el.style.cssText = "position: fixed; bottom: 0; left: 0; width: 0; height: 0; background-color: red";
    doc.body.appendChild(el);

    return el;
}

const DISTANCE = 2;

class Rocket implements Updateable {

    private keys: Keys;
    private domNode: HTMLElement;

    constructor(domNode: HTMLElement, keys: Keys) {
        this.keys = keys;
        this.domNode = domNode;

        this.domNode.style.position = "fixed";
        this.domNode.style.bottom = "10px";
        // this.domNode.style.width = "100px";
        // this.domNode.style.height = "50px";
        // this.domNode.style.backgroundColor = "orange";
        this.domNode.style.fontFamily = "monospace";
        this.domNode.innerHTML = "\n" +
            "&nbsp;&nbsp;&nbsp;/\\<br />\n" +
            "&nbsp;&nbsp;|&nbsp;&nbsp;|<br />\n" +
            "&nbsp;&nbsp;|&nbsp;&nbsp;|<br />\n" +
            "&nbsp;/|/\\|\\<br />\n" +
            "/_||||_\\<br />"
    }

    update() {
        if (this.keys.isPressed("left")) {
            this.moveLeft();
        } else if (this.keys.isPressed("right")) {
            this.moveRight();
        }
    }

    private moveLeft() {
        var coordX = this.getCoordX();
        if (coordX >= 5) {
            coordX = coordX -= DISTANCE;
        }
        this.setCoordX(coordX);
    }

    private moveRight() {
        var coordX = this.getCoordX();
        coordX = coordX += DISTANCE;
        this.setCoordX(coordX);
    }

    getCoordX() {
        return (this.domNode.style.left === "") ? 0 : parseInt(this.domNode.style.left);
    }

    private setCoordX(value: number) {
        this.domNode.style.left = value + "px";
    }

    getBulletCenter(): { x: number, y: number } {
        const x = this.domNode.getBoundingClientRect().x + (this.domNode.getBoundingClientRect().width / 2);
        const y = this.domNode.getBoundingClientRect().height;

        return {x, y};
    }
}

export interface Updateable {
    update: () => void;
}


hellWorld();

