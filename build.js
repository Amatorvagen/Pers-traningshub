/* Bygger index.html ur src.html.
   src.html = källan med JSX i <script type="text/babel"> plus inloggningslagret
   i egna block. Bygget rör bara babel-blocket: allt annat kopieras ordagrant. */
const babel = require("@babel/core");
const { minify } = require("terser");
const fs = require("fs");

const SRC = __dirname + "/traningshub.html";
const OUT = __dirname + "/index.html";

(async () => {
  const src = fs.readFileSync(SRC, "utf8");

  /* Plocka ut JSX-blocket */
  const open = '<script type="text/babel">';
  const i = src.indexOf(open);
  if (i < 0) throw new Error("hittar inte babel-blocket");
  const j = src.indexOf("</script>", i);
  if (j < 0) throw new Error("hittar inte slutet pa babel-blocket");
  const jsx = src.slice(i + open.length, j);
  fs.writeFileSync(__dirname + "/app.jsx", jsx);
  console.log("JSX:", jsx.length);

  /* Kompilera med classic runtime - automatic ger import-satser som spracker filen */
  const compiled = babel.transformSync(jsx, {
    presets: [["@babel/preset-react", { runtime: "classic", development: false }]],
    compact: false,
  }).code;
  fs.writeFileSync(__dirname + "/app.compiled.js", compiled);
  console.log("Kompilerad:", compiled.length);

  /* mangle:false bevarar funktionsnamn */
  const res = await minify(compiled, {
    compress: true,
    mangle: false,
    format: { comments: false },
  });
  if (res.error) throw res.error;
  const min = res.code;
  fs.writeFileSync(__dirname + "/app.min.js", min);
  const hasLineComment = min.replace(/:\/\//g, "").includes("//");
  console.log("Minifierad:", min.length, "· radkommentar kvar:", hasLineComment ? "JA - STOPP" : "nej");
  if (hasLineComment) throw new Error("radkommentar i minifierad kod");

  /* Satt ihop: babel-CDN bort, JSX-blocket byts mot fardig kod */
  let out = src.slice(0, i) + "<script>\n" + min + "\n" + src.slice(j);
  const cdn = '<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n';
  if (!out.includes(cdn)) throw new Error("hittar inte babel-CDN-raden");
  out = out.replace(cdn, "");

  if (out.includes('type="text/babel"')) throw new Error("babel-block kvar i bygget");
  fs.writeFileSync(OUT, out);
  console.log("index.html:", out.length);

  /* Inloggningen maste finnas kvar */
  const must = ["__startHub", "hubauth", "signInWithPassword", "onAuthStateChange"];
  for (const m of must) {
    const n = out.split(m).length - 1;
    console.log("  " + m + ":", n, n > 0 ? "ok" : "SAKNAS");
    if (n === 0) throw new Error("inloggningen saknas: " + m);
  }
})().catch((e) => {
  console.error("FEL:", e.message);
  process.exit(1);
});
