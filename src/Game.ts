// 'use strict';
//
// import Rocket from './Rocket';
// import Bullet from './Bullet';
// import Target from './Target';
// import {Keys} from "./keys";
//
// const FPS = 60;
// const ROCKET_DOM_ID = "rocket";
// const BULLET_DOM_ID = "bulletContainer";
// const TARGET_CONTAINER_ID = "targetContainer";
// const TARGET_WRAP_TAG = "SPAN";
//
// /*
//  * GameLoop Tutorial von
//  * http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/
//  */
// export default class Game {
//
//     private fps: number;
//     private rocket: Rocket;
//     private bullets: Bullet[];
//     private targets: Target[];
//     private interval: number;
//     private keys: Keys;
//
//     constructor() {
//     this.fps = FPS;
//     this.rocket = new Rocket(document.getElementById(ROCKET_DOM_ID));
//     this.bullets = [];
//     this.targets = this.initTargets();
//     this.interval = setInterval(this.run.bind(this), 1000 / this.fps);
//     this.keys = new Keys(document);
//   }
//
//   initTargets(): Target[] {
//       let allTextNodes = getTextNodes(document.getElementById(TARGET_CONTAINER_ID));
//
//     if (!allTextNodes) {
//         throw new Error("text nodes are empty!");
//     }
//
//     allTextNodes.forEach(textNode => wrapEachCharacter(textNode, TARGET_WRAP_TAG));
//
//     // @ts-ignore
//       let targetDoms = document.getElementById(TARGET_CONTAINER_ID).getElementsByTagName(TARGET_WRAP_TAG);
//
//     let targets = [];
//     for(var i = 0; i < targetDoms.length; i++) {
//       if(targetDoms[i].textContent !== " ") {
//         targets.push(new Target(targetDoms[i]));
//       }
//     }
//     return targets;
//   }
//
//   update() {
//
//     /* fire new bullet if space is pressed */
//     if(this.keys.gotClicked("space")) {
//       var coordX = this.rocket.getCoordX();
//       // @ts-ignore
//         this.bullets.push(new Bullet(document.getElementById(BULLET_DOM_ID), coordX+25));
//     }
//
//     /* update all game elements */
//     this.rocket.update();
//     this.bullets.forEach(bullet => bullet.update());
//     this.targets.forEach(target => target.update());
//
//     /* check for hits */
//     this.bullets.forEach(bullet => {
//       this.targets.forEach(target => {
//         if(hit(target.domElement, bullet.htmlElement)) {
//           target.setIsHit(true);
//           bullet.setHasHit();
//         }
//       });
//     });
//
//     this.bullets = this.bullets.filter(bullet => !bullet.hasHit);
//     this.targets = this.targets.filter(target => !target.isHit);
//   }
//
//   stop() {
//     clearInterval(this.interval);
//   }
//
//   run() {
//     this.update();
//   }
// }
//
// /* start game */
// new Game();
//
// function hit(node1: any, node2: any) {
//   if(Math.abs(node1.getBoundingClientRect().bottom - node2.getBoundingClientRect().bottom) < 10) {
//     if(Math.abs(node1.getBoundingClientRect().left - node2.getBoundingClientRect().left) < 10) {
//       return true;
//     } else {
//       return false;
//     }
//   } else {
//     return false;
//   }
// }
//
// /**
//  * http://stackoverflow.com/a/5062698
//  * recursively get all text nodes as an array for a given element
//  */
// function getTextNodes(node: any |any[]) {
//     var childTextNodes = [];
//
//     if (!node.hasChildNodes()) {
//         return;
//     }
//
//     var childNodes = node.childNodes;
//     for (var i = 0; i < childNodes.length; i++) {
//         if (childNodes[i].nodeType == Node.TEXT_NODE) {
//             childTextNodes.push(childNodes[i]);
//         }
//         else if (childNodes[i].nodeType == Node.ELEMENT_NODE) {
//             // @ts-ignore
//             Array.prototype.push.apply(childTextNodes, getTextNodes(childNodes[i]));
//         }
//     }
//
//     return childTextNodes;
// }
//
// /**
//  * given a text node, wrap each character in the
//  * given tag.
//  */
// function wrapEachCharacter(textNode: any, tag: any) {
//     var text = textNode.nodeValue;
//     var parent = textNode.parentNode;
//
//     var characters = text.split('');
//     characters.forEach(function(character : string) {
//         var element = document.createElement(tag);
//         var characterNode = document.createTextNode(character);
//         element.appendChild(characterNode);
//
//         parent.insertBefore(element, textNode);
//     });
//
//     parent.removeChild(textNode);
// }
