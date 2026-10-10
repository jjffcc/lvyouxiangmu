const fs = require("fs");
const path = require("path");

const assets = path.join(__dirname, "..", "assets");

function stubElement() {
  return {
    innerHTML: "",
    value: "",
    textContent: "",
    style: {},
    addEventListener() {},
    setAttribute() {},
    getAttribute() { return null; },
    querySelector() { return stubElement(); },
    querySelectorAll() { return []; },
    appendChild() {},
    closest() { return stubElement(); }
  };
}

global.window = global;
global.document = {
  addEventListener() {},
  getElementById() { return stubElement(); },
  createElement() { return stubElement(); },
  title: ""
};
global.location = { hash: "#/trips" };

for (const file of ["icons.js", "data.js", "core.js", "views-trip.js", "views-plan.js", "views-manage.js", "views-live.js"]) {
  const code = fs.readFileSync(path.join(assets, file), "utf8");
  new Function(code)();
}

const App = window.App;
const cases = [
  [["trips"], {}],
  [["trip", "new"], {}],
  [["trip", "hz-family", "plan"], { id: "hz-family" }],
  [["trip", "cd-cq-friends", "plan"], { id: "cd-cq-friends" }],
  [["trip", "hz-family", "discover"], { id: "hz-family" }],
  [["trip", "cd-cq-friends", "discover"], { id: "cd-cq-friends" }],
  [["trip", "hz-family", "features"], { id: "hz-family" }],
  [["trip", "cd-cq-friends", "features"], { id: "cd-cq-friends" }],
  [["trip", "hz-family", "food"], { id: "hz-family" }],
  [["trip", "cd-cq-friends", "food"], { id: "cd-cq-friends" }],
  [["trip", "hz-family", "library"], { id: "hz-family" }],
  [["trip", "hz-family", "compare"], { id: "hz-family" }],
  [["trip", "hz-family", "map"], { id: "hz-family" }],
  [["trip", "cd-cq-friends", "map"], { id: "cd-cq-friends" }],
  [["trip", "hz-family", "place"], { id: "hz-family" }],
  [["trip", "hz-family", "orders"], { id: "hz-family" }],
  [["trip", "hz-family", "orders", "import"], { id: "hz-family" }],
  [["trip", "hz-family", "expenses"], { id: "hz-family" }],
  [["trip", "cd-cq-friends", "expenses"], { id: "cd-cq-friends" }],
  [["trip", "hz-family", "members"], { id: "hz-family" }],
  [["trip", "hz-family", "prepare"], { id: "hz-family" }],
  [["trip", "hz-family", "today"], { id: "hz-family" }],
  [["trip", "cd-cq-friends", "today"], { id: "cd-cq-friends" }],
  [["trip", "hz-family", "review"], { id: "hz-family" }],
  [["trip", "hz-family", "more"], { id: "hz-family" }],
  [["settings"], {}]
];

let failed = 0;
for (const [routePath, params] of cases) {
  const route = App.ROUTES.find((r) => r.path.length === routePath.length && r.path.every((seg, i) => seg.startsWith(":") || seg === routePath[i]));
  const label = routePath.join("/");
  if (!route) {
    console.log("MISSING ROUTE", label);
    failed++;
    continue;
  }
  try {
    const result = route.view(params);
    const html = result && result.html ? result.html : "";
    if (html.length < 200) {
      console.log("TOO SHORT", label, html.length);
      failed++;
    } else {
      console.log("OK   ", label, html.length);
    }
  } catch (err) {
    console.log("ERROR", label, err.message);
    failed++;
  }
}

console.log("routes registered:", App.ROUTES.length, "| failures:", failed);
process.exitCode = failed ? 1 : 0;
