import { Render, Runner } from "matter-js";
const createRender = (engine) => {
  const render = Render.create({
    engine,
    element: document.body,
    options: {
      wireframes: false,
      background: "#F7F4C8",
      width: 620,
      height: 850,
    },
  });

  Render.run(render);
  Runner.run(engine);

  return render;
};

export { createRender };
