import { Bodies, Engine, Events, Render, World, Runner, Body, Collision} from "matter-js";
import { FRUITS_BASE } from "./fruits";

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background:"#F7F4C8",
    width: 620,
    height: 850
  }
});

let currentBody = null;
let currnetFruit = null;
let disableAction = false;

// #region 게임 스테이지 세팅
const world = engine.world;

const leftWall = Bodies.rectangle(15,395,30,790, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

const rightWall = Bodies.rectangle(605,395,30,790, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

const ground = Bodies.rectangle(310,820,620,60, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

const topLine = Bodies.rectangle(310,150,620,2, {
  isStatic: true,
  isSensor: true,
  render: {fillStyle: "#E6B143"}
});
// #endregion

// #region 과일 생성
function addFruit() {
  const index = Math.floor(Math.random() * 5);
  const fruit = FRUITS_BASE[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    index: index,
    isSleeping: true,
    render: {
      sprite: {texture: `${fruit.name}.png`}
    },
    restitution: 0.2
  });

  currentBody = body;
  currnetFruit = fruit;

  World.add(world, body);
}
// #endrigion

// #region 키입력 이벤트 처리
window.onkeydown = (e) => {
  if(disableAction) 
    return;

  switch(e.code) {
    case "KeyA":
      if(currentBody.position.x - currnetFruit.radius > 30) {
        Body.setPosition(currentBody, {
          x: currentBody.position.x - 5,
          y: currentBody.position.y
        });
      }
      break;
    case "KeyD":
      if(currentBody.position.x + currnetFruit.radius < 590) {
        Body.setPosition(currentBody, {
          x: currentBody.position.x + 5,
          y: currentBody.position.y
        });
      }
      break;
    case "KeyS":
      currentBody.isSleeping = false;
      disableAction = true;
      setTimeout(() => {
        addFruit();
        disableAction = false;
      }, 700); 
      break;
  }
}
// #endrigion

// #region 과일 충돌 판정
Events.on(engine, "collisionStart", (e) => {
  e.pairs.forEach((Collision) => {
    if(Collision.bodyA.index === Collision.bodyB.index) {
      const index = Collision.bodyA.index;
      if(index === FRUITS_BASE.length-1) {
        return;
      }
      World.remove(world, [Collision.bodyA, Collision.bodyB]);
      const newFruit = FRUITS_BASE[index+1];
      const newBody = Bodies.circle(
        Collision.collision.supports[0].x,
        Collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: {
            sprite: {texture: `${newFruit.name}.png`}
          },
          index: index +1
        }
      );
      World.add(world, newBody);
    }
  })
});
// #endrigion

addFruit();

World.add(world, [leftWall, rightWall, ground, topLine]);
Render.run(render);
Engine.run(engine);
