import {Keys} from "./keys";
import Bullet from "./Bullet";
import {Target} from "./Target";

function createTargets(document: Document): Target[] {
    // TODO: Verify type system stuff here!
    const elements: NodeList = <NodeList><unknown>document.querySelectorAll("[data-spaceinvader-id]");

    const targets = [];
    for (let i = 0; i < elements.length; i++) {
        const curr = elements[i];
        targets.push(new Target(<HTMLElement>curr));
    }

    return targets;
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
    let targets = createTargets(document);

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
        targets.forEach(target => target.update());

        bullets.forEach(bullet => {
            targets.forEach(target => {
                if (hit(bullet, target)) {
                    target.setIsHit(true);
                    bullet.setHasHit();
                }
            });
        });

        bullets = bullets.filter(bullet => !bullet.hasHit);
        targets = targets.filter(target => !target.isHit);

    }, 1000 / fps);
}

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

function parseDom(e: Element) {
    if (e.children.length === 0) {
        addId(e, generateId());
    } else {
        for (let i = 0; i < e.children.length; i++) {
            parseDom(e.children[i]);
        }
    }
}

function addId(e: Element, id: string) {
    e.setAttribute("data-spaceinvader-id", id)
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

    getBulletCenter() : {x: number, y: number} {
        const x = this.domNode.getBoundingClientRect().x + (this.domNode.getBoundingClientRect().width / 2);
        const y = this.domNode.getBoundingClientRect().height;

        return {x, y};
    }
}

export interface Updateable {
    update: () => void;
}


hellWorld();

