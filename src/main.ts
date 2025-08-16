import { bundle } from "./bundle";
import { registerServiceWorker } from "./service-worker-manager";
import "./style.css";

registerServiceWorker();

(document.querySelector("#app") as HTMLDivElement).innerHTML = `
  <div>
    <h1>Rolldown in the Browser</h1>
    <div class="card">
      <code>
        <pre id="utils-ts" contenteditable>
export function add(a: number, b: number) {
  return a + b;
}
</pre>
      </code>
      <code>
        <pre id="index-ts" contenteditable>
import { add } from "./utils.ts";
console.log("Hello, World", add(1, 2));
</pre>
      </code>
      <button id="counter" type="button">Bundle!</button>
      <code>
        <pre id="output"></pre>
      </code>
    </div>
  </div>
`;

const output = document.querySelector("#output") as HTMLPreElement;
const button = document.querySelector("#counter") as HTMLButtonElement;

button.addEventListener("click", async () => {
  output.textContent = "Loading...";
  const indexContent = document.querySelector("#index-ts")?.textContent ?? "";
  const utilsContent = document.querySelector("#utils-ts")?.textContent ?? "";
  const result = await bundle(
    {
      "/index.ts": indexContent,
      "/utils.ts": utilsContent,
    },
    ["./index.ts"],
  );

  output.textContent = String(result.output["index.js"]);
});
