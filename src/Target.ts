import {Updateable} from "./index";

export class Target implements Updateable {

  htmlElement: HTMLElement;
  isHit: boolean;

  constructor(domElement: HTMLElement, debug: boolean = false) {
    this.htmlElement = domElement;

    if (debug) {
      this.htmlElement.style.border = "1px solid black";
    }

    this.isHit = false;
  }

  setIsHit(isHit: boolean): void {
    // this.domElement.textContent = "_";
    this.htmlElement.style.backgroundColor = "purple";
    this.htmlElement.style.visibility = "hidden";
    this.isHit = isHit;
  }

  update() {

  }
}