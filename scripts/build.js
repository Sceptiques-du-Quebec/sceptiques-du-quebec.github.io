const path = require("node:path");
const fs   = require("node:fs");
const { buildCSS, buildJS } = require("chokibasic");


const srcin        = path.resolve(__dirname, "../src/");
const jsin         = path.resolve(srcin, "scripts/sceptiques.core.js");
const jsout        = path.resolve(srcin, "scripts/sceptiques.core.min.js");
const cssin        = path.resolve(srcin, "styles/sceptiques.core.scss");
const cssout       = path.resolve(srcin, "styles/sceptiques.core.min.css");
const changelogIn  = path.resolve(__dirname, "../changelog.md");
const changelogOut = path.resolve(srcin, "changelog.md");


(async () => {
	await buildJS(jsin, jsout);
	await buildCSS(cssin, cssout);
	fs.copyFileSync(changelogIn, changelogOut);
	console.log(`✅ Changelog copied: ${changelogOut}`);
})();