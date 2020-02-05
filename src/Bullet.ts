'use strict';

import {Keys} from "./keys";

const DISTANCE = 2;

export default class Bullet {

    htmlElement: HTMLElement;
    hasHit: boolean;
    private keys: Keys;

    constructor(container: HTMLElement, x: number, y: number) {

        // TODO: Refactor into constructor parameter
        this.keys = new Keys(document);

        this.htmlElement = document.createElement("div");
        this.htmlElement.setAttribute("class", "bullet");
        var icon = document.createTextNode("*");
        this.htmlElement.appendChild(icon);
        this.htmlElement.style.bottom = "30px";
        this.htmlElement.style.position = "fixed";
        this.htmlElement.style.color = getRandomColor();
        this.htmlElement.style.width = "10px";
        this.htmlElement.style.height = "10px";
        this.htmlElement.style.backgroundColor = "blue";
        container.appendChild(this.htmlElement);
        this.setCoordX(x);
        this.setCoordY(y);
        this.hasHit = false;
    }

    moveLeft() {
        var coordX = this.getCoordX();
        if (coordX >= 5) {
            coordX = coordX -= DISTANCE;
        }
        this.setCoordX(coordX);
    }

    moveRight() {
        var coordX = this.getCoordX();
        coordX = coordX += DISTANCE;
        this.setCoordX(coordX);
    }

    moveUp() {
        var coordY = this.getCoordY();
        coordY = coordY += DISTANCE;
        this.setCoordY(coordY);
    }

    moveDown() {
        var coordY = this.getCoordY();
        coordY = coordY -= DISTANCE;
        this.setCoordY(coordY);
    }

    getCoordX() {
        return (this.htmlElement.style.left === "") ? 0 : parseInt(this.htmlElement.style.left);
    }

    setCoordX(value: number) {
        this.htmlElement.style.left = `${value}px`;
    }

    getCoordY() {
        return (this.htmlElement.style.bottom === "") ? 0 : parseInt(this.htmlElement.style.bottom);
    }

    setCoordY(value: number) {
        this.htmlElement.style.bottom = `${value}px`;
    }

    setHasHit() {
        this.hasHit = true;
        this.htmlElement.style.backgroundColor = "orange";
        this.htmlElement.style.display = "none";
        // @ts-ignore
        // this.htmlElement.parentNode.removeChild(this.htmlElement);
    }

    checkViewport() {
        if (!isElementInViewport(this.htmlElement)) {
            this.hasHit = true;
            // @ts-ignore
            this.htmlElement.parentNode.removeChild(this.htmlElement);
            console.log("Bullet has left viewport!!");
        }
    }

    update() {
        this.checkViewport();
        this.moveUp();
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/*
 * Check if element is in current viewport
 * from: http://stackoverflow.com/a/7557433/4187312
 */
function isElementInViewport(el: HTMLElement) {

    const rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}
