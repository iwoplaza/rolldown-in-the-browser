import { bundle } from "./bundle";
import { registerServiceWorker } from "./service-worker-manager";
import "./style.css";

(document.querySelector("#app") as HTMLDivElement).innerHTML = `
  <div>
    <h1>Rolldown in the Browser</h1>
    <div class="card">
      <button id="counter" type="button">Bundle!</button>
    </div>
  </div>
`;

const button = document.querySelector("#counter") as HTMLButtonElement;

button.addEventListener("click", async () => {
  console.log("Registering service worker...");
  await registerServiceWorker();

  console.log("Trying to bundle...");
  const result = await bundle(
    {
      "index.ts": 'console.log("Hello, World");',
    },
    ["./index.ts"],
  );

  console.log(result);
});
