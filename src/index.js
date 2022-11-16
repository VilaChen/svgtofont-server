const svgtofont = require("svgtofont");
const path = require("path");

svgtofont({
	src: path.resolve(process.cwd(), "icon"),
	dist: path.resolve(process.cwd(), "fonts"),
	fontName: "svgtofont",
	css: true,
}).then(() => {
	console.log("done");
});
