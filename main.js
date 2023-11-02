import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import { FRUITS_BASE } from "./fruits";
import { createRender } from "./render";

/** Engine Configuration */
const engine = Engine.create();
const render = createRender(engine);

/** World configurations */
const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" },
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" },
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: { fillStyle: "#E6B143" },
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
  name: "topLine",
  isStatic: true,
  isSensor: true,
  render: { fillStyle: "#E6B143" },
});

/** Run the game */
World.add(world, [leftWall, rightWall, ground, topLine]);
Render.run(render);
Runner.run(engine);

/** Functions */

/** Variables */
let currentBody = null;
let currentFruit = null;
let disableAction = false;
let interval = null;

/** Add a fruit */
function addFruit() {
  const index = Math.floor(Math.random() * 5);
  const fruit = FRUITS_BASE[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    index: index,
    isSleeping: true,
    render: {
      sprite: { texture: `${fruit.name}.png` },
    },
    restitution: 0.2,
  });

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
}

/** OnKeyDown Event */
window.onkeydown = (event) => {
  if (disableAction) {
    return;
  }

  switch (event.code) {
    case "ArrowLeft":
      if (interval) return;

      interval = setInterval(() => {
        if (currentBody.position.x - currentFruit.radius > 30)
          Body.setPosition(currentBody, {
            x: currentBody.position.x - 1,
            y: currentBody.position.y,
          });
      }, 5);
      break;

    case "ArrowRight":
      if (interval) return;

      interval = setInterval(() => {
        if (currentBody.position.x + currentFruit.radius < 590)
          Body.setPosition(currentBody, {
            x: currentBody.position.x + 1,
            y: currentBody.position.y,
          });
      }, 5);
      break;

    case "ArrowDown":
      currentBody.isSleeping = false;
      disableAction = true;
      setTimeout(() => {
        addFruit();
        disableAction = false;
      }, 500);
      break;
  }
};

window.onkeyup = (event) => {
  switch (event.code) {
    case "ArrowLeft":
    case "ArrowRight":
      clearInterval(interval);
      interval = null;
  }
};

/** Fruit Collision Event */
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if (collision.bodyA.index === collision.bodyB.index) {
      const index = collision.bodyA.index;

      // Exemption for watermelon
      if (index === FRUITS_BASE.length - 1) {
        return;
      }

      World.remove(world, [collision.bodyA, collision.bodyB]);

      // New fruit when collision
      const newFruit = FRUITS_BASE[index + 1];

      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: {
            sprite: { texture: `${newFruit.name}.png` },
          },
          index: index + 1,
        }
      );

      World.add(world, newBody);
    }

    // Game Over if the fruit hits the top line
    if (
      collision.bodyA.name === "topLine" ||
      collision.bodyB.name === "topLine"
    ) {
      if (
        !disableAction &&
        (collision.bodyA.name === "topLine" ||
          collision.bodyB.name === "topLine")
      ) {
        alert("Game Over");
      }
    }
  });
});

addFruit();
