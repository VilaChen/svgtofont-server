const express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
const { exec } = require("child_process");
const JSZip = require("jszip");

const zip = new JSZip();
const app = express();
const port = 8082;
// create application/json parser
var jsonParser = bodyParser.json();

app.post("/file", jsonParser, (req, res) => {
	console.log(req.body, 123);
	try {
		req.body.data.forEach((item) => {
			var base64Data = item.data.replace(/^data:image\/svg\+xml;base64,/, "");
			fs.writeFile(`svg/${item.name}`, base64Data, "base64", function (err) {
				console.log(err);
			});
		});
		res.send({ response: { status: "success" } });
	} catch (error) {
		res.send(error);
	}
});

app.get("file", (req, res) => {
	try {
		exec("npm run font", (err, stdout, stderr) => {
			if (err) return;
			const fontData = [
				"font/font.css",
				"font/font.eot",
				"font/font.json",
				"font/font.less",
				"font/font.scss",
				"font/font.styl",
				"font/font.svg",
				"font/font.ttf",
				"font/font.woff",
				"font/font.woff2",
				"font/font.module.less",
				"font/font.symbol.svg",
			];

			fontData.forEach((item) => {
				const fileData = fs.readFileSync("font/font.css");
				zip.file(item.replace(/^font\//, ""), fileData);
			});

			zip
				.generateNodeStream({ type: "nodebuffer ", streamFiles: true })
				.pipe(fs.createWriteStream("font.zip"))
				.on("finish", function () {
					console.log("font.zip written.");
					const zipfile = `${__dirname}/font.zip`;
					exec("npm run clean");
					res.download(zipfile); // Set disposition and send it.
				});
		});
	} catch (error) {
		res.send("error");
	}
});
