const lines = [];
const history = [];
let historyIndex = -1;

let camera = {
	scale: 1,        // 1 = 100%
	cx: 0,           // world center x
	cy: 0            // world center y
};

const CLASS_MAP = {
	Attribute,
	KeyAttribute,
	Entity,
	RoundEntity,
	WeakEntity,
	WeakKeyAttribute,
	DerivedAttribute,
	MultivaluedAttribute,
	Relationship
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const input = document.getElementById("cmd");
const log = document.getElementById("log");

const objects = [];

function logMsg(msg) {
	log.innerHTML += msg + "<br/>";
	log.scrollTop = log.scrollHeight;
}

function getAnchor(obj, xRatio, yRatio) {
	return {
		x: obj.x + obj.w * (xRatio ?? 0.5),
		y: obj.y + obj.h * (yRatio ?? 0.5)
	};
}

function generateXML() {
	let xml = [];

	xml.push(`<mxGraphModel>`);
	xml.push(`  <root>`);
	xml.push(`    <mxCell id="0"/>`);
	xml.push(`    <mxCell id="1" parent="0"/>`);

	// ---- OBJECTS ----
	// Objects start at ID 2
	let currentId = 2;

	const objectIdMap = [];

	objects.forEach((obj, i) => {
		const id = String(currentId++);
		objectIdMap[i] = id;

		obj.init(id, "1");
		xml.push(obj.mxRender());
	});

	// ---- LINES ----
	lines.forEach((line) => {

		const edgeId = String(currentId++);
		line.init(edgeId, "1");

		// Convert object indices to mxCell IDs

		const originalSource = line.source;
		const originalTarget = line.target;

		line.source = objectIdMap[originalSource];
		line.target = objectIdMap[originalTarget];

		xml.push(line.mxRender());

		line.source = originalSource;
		line.target = originalTarget;


		// Cardinality may have generated extra IDs
		if (line.cardinality === "0:1" ||
		    line.cardinality === "0:N") {
			currentId += 1;
		}

		if (line.cardinality === "M:N") {
			currentId += 2;
		}
	});

	xml.push(`  </root>`);
	xml.push(`</mxGraphModel>`);

	return xml.join("\n");
}

function drawLineIndexMarker(line, index) {
	const src = objects[line.source];
	const tgt = objects[line.target];
	if (!src || !tgt) return;

	const p1 = getAnchor(src, line.exitX, line.exitY);
	const p2 = getAnchor(tgt, line.entryX, line.entryY);

	const cx = (p1.x + p2.x) / 2;
	const cy = (p1.y + p2.y) / 2;

	const r = 6;

	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, Math.PI * 2);
	ctx.fillStyle = "black";
	ctx.fill();

	ctx.fillStyle = "white";
	ctx.font = "10px monospace";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(index, cx, cy);
}


function drawCardinality(line, p1, p2) {
	if (line.cardinality === "none") return;

	const mx = (p1.x + p2.x) / 2;
	const my = (p1.y + p2.y) / 2;

	ctx.fillStyle = "black";
	ctx.font = "14px monospace";
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";

	if (line.cardinality === "0:1") {
		ctx.fillText("1", p2.x, p2.y - 5);
	}

	if (line.cardinality === "0:N") {
		ctx.fillText("N", p2.x, p2.y - 5);
	}

	if (line.cardinality === "M:N") {
		ctx.fillText("M", p1.x, p1.y - 5);
		ctx.fillText("N", p2.x, p2.y - 5);
	}
}


function drawLine(line) {
	const src = objects[line.source];
	const tgt = objects[line.target];

	if (!src || !tgt) return;

	const p1 = getAnchor(src, line.exitX, line.exitY);
	const p2 = getAnchor(tgt, line.entryX, line.entryY);

	ctx.beginPath();

	if (line.type === "dot") {
		ctx.setLineDash([4, 4]);
	} else {
		ctx.setLineDash([]);
	}

	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.stroke();

	// Double line
	if (line.type === "double") {
		const dx = p2.y - p1.y;
		const dy = -(p2.x - p1.x);
		const len = Math.hypot(dx, dy) || 1;

		const offset = 3;
		const ox = (dx / len) * offset;
		const oy = (dy / len) * offset;

		ctx.beginPath();
		ctx.moveTo(p1.x + ox, p1.y + oy);
		ctx.lineTo(p2.x + ox, p2.y + oy);
		ctx.stroke();
	}

	ctx.setLineDash([]);

	drawCardinality(line, p1, p2);
}

function drawGrid() {
	ctx.save();
	const minor = 50;
	const major = 200;

	// Compute visible world bounds
	const left   = camera.cx - (canvas.width  / 2) / camera.scale;
	const right  = camera.cx + (canvas.width  / 2) / camera.scale;
	const top    = camera.cy - (canvas.height / 2) / camera.scale;
	const bottom = camera.cy + (canvas.height / 2) / camera.scale;

	const startX = Math.floor(left / minor) * minor;
	const endX   = Math.ceil(right / minor) * minor;
	const startY = Math.floor(top / minor) * minor;
	const endY   = Math.ceil(bottom / minor) * minor;

	ctx.lineWidth = 1;

	// ---- Minor grid ----
	ctx.strokeStyle = "#e6e6e6";
	ctx.setLineDash([]);

	for (let x = startX; x <= endX; x += minor) {
		ctx.beginPath();
		ctx.moveTo(x, startY);
		ctx.lineTo(x, endY);
		ctx.stroke();
	}

	for (let y = startY; y <= endY; y += minor) {
		ctx.beginPath();
		ctx.moveTo(startX, y);
		ctx.lineTo(endX, y);
		ctx.stroke();
	}

	// ---- Major grid ----
	ctx.strokeStyle = "#cccccc";

	for (let x = startX; x <= endX; x += major) {
		ctx.beginPath();
		ctx.moveTo(x, startY);
		ctx.lineTo(x, endY);
		ctx.stroke();
	}

	for (let y = startY; y <= endY; y += major) {
		ctx.beginPath();
		ctx.moveTo(startX, y);
		ctx.lineTo(endX, y);
		ctx.stroke();
	}

	// ---- Edge coordinates only (major lines) ----
	ctx.fillStyle = "#888";
	ctx.font = "10px monospace";

	// Top edge X labels
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	for (let x = startX; x <= endX; x += major) {
		ctx.fillText(`${x}`, x, top + 2);
	}

	// Left edge Y labels
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	for (let y = startY; y <= endY; y += major) {
		ctx.fillText(`${y}`, left + 2, y);
	}
	ctx.restore();
}


function redraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.save();

	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.scale(camera.scale, camera.scale);
	ctx.translate(-camera.cx, -camera.cy);
	drawGrid();

	// Draw lines first
	lines.forEach((line, i) => {
		drawLine(line);
		drawLineIndexMarker(line, i);
	});

	// Then objects
	objects.forEach((obj, i) => {
		drawShape(obj);
		drawIndexMarker(obj, i);
	});

	ctx.restore();
}



function drawIndexMarker(obj, index) {
	const r = 6;
	const cx = obj.x - 10;
	const cy = obj.y - 10;

	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, Math.PI * 2);
	ctx.fillStyle = "black";
	ctx.fill();

	ctx.fillStyle = "white";
	ctx.font = "10px monospace";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(index, cx, cy);
}

function drawShape(obj) {
	if (obj instanceof Relationship) {
		drawDiamond(obj);
	} else if (obj instanceof WeakEntity) {
		drawRect(obj, true);
	} else if (obj instanceof RoundEntity) {
		drawRoundedRect(obj);
	} else if (obj instanceof Entity) {
		drawRect(obj, false);
	} else if (
		obj instanceof Attribute ||
		obj instanceof KeyAttribute ||
		obj instanceof DerivedAttribute ||
		obj instanceof MultivaluedAttribute ||
		obj instanceof WeakKeyAttribute
	) {
		drawEllipse(obj);
	}
}

function drawRect(obj, doubleBorder) {
	if (doubleBorder) {
		ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
		ctx.strokeRect(obj.x + 4, obj.y + 4, obj.w - 8, obj.h - 8);
	} else {
		ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
	}
	drawText(obj);
}

function drawRoundedRect(obj) {
	const r = 10;
	ctx.beginPath();
	ctx.moveTo(obj.x + r, obj.y);
	ctx.lineTo(obj.x + obj.w - r, obj.y);
	ctx.quadraticCurveTo(obj.x + obj.w, obj.y, obj.x + obj.w, obj.y + r);
	ctx.lineTo(obj.x + obj.w, obj.y + obj.h - r);
	ctx.quadraticCurveTo(obj.x + obj.w, obj.y + obj.h, obj.x + obj.w - r, obj.y + obj.h);
	ctx.lineTo(obj.x + r, obj.y + obj.h);
	ctx.quadraticCurveTo(obj.x, obj.y + obj.h, obj.x, obj.y + obj.h - r);
	ctx.lineTo(obj.x, obj.y + r);
	ctx.quadraticCurveTo(obj.x, obj.y, obj.x + r, obj.y);
	ctx.stroke();
	drawText(obj);
}


function drawEllipse(obj) {
	const cx = obj.x + obj.w / 2;
	const cy = obj.y + obj.h / 2;
	const rx = obj.w / 2;
	const ry = obj.h / 2;

	// DerivedAttribute → dashed ellipse
	if (obj instanceof DerivedAttribute) {
		ctx.setLineDash([6, 4]);
	} else {
		ctx.setLineDash([]);
	}

	// Outer ellipse
	ctx.beginPath();
	ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
	ctx.stroke();

	// MultivaluedAttribute → double ellipse
	if (obj instanceof MultivaluedAttribute) {
		const inset = 6;

		ctx.beginPath();
		ctx.ellipse(
			cx,
			cy,
			rx - inset,
			ry - inset,
			0,
			0,
			Math.PI * 2
		);
		ctx.stroke();
	}

	ctx.setLineDash([]); // always reset
	drawText(obj);
}



function drawDiamond(obj) {
	ctx.beginPath();
	ctx.moveTo(obj.x + obj.w / 2, obj.y);
	ctx.lineTo(obj.x + obj.w, obj.y + obj.h / 2);
	ctx.lineTo(obj.x + obj.w / 2, obj.y + obj.h);
	ctx.lineTo(obj.x, obj.y + obj.h / 2);
	ctx.closePath();
	ctx.stroke();
	drawText(obj);
}

function drawText(obj) {
	ctx.fillStyle = "black";
	ctx.font = "14px monospace";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	const cx = obj.x + obj.w / 2;
	const cy = obj.y + obj.h / 2;

	ctx.fillText(obj.value, cx, cy);

	// ---- Underline logic ----
	if (obj instanceof KeyAttribute || obj instanceof WeakKeyAttribute) {

		const metrics = ctx.measureText(obj.value);
		const textWidth = metrics.width;

		const underlineY = cy + 8; // adjust slightly if needed

		ctx.beginPath();
		ctx.moveTo(cx - textWidth / 2, underlineY);
		ctx.lineTo(cx + textWidth / 2, underlineY);

		ctx.lineWidth = 1;
		ctx.strokeStyle = "black";

		// Dotted for WeakKeyAttribute
		if (obj instanceof WeakKeyAttribute) {
			ctx.setLineDash([2, 2]);
		} else {
			ctx.setLineDash([]);
		}

		ctx.stroke();
		ctx.setLineDash([]); // reset
	}
}


function parseLineFlags(line, flags, values) {
	let vi = 0;

	for (let c of flags) {
		switch (c) {
			case "t": {
				const v = values[vi++];
				if (v === "r") line.type = "regular";
				if (v === "d") line.type = "dot";
				if (v === "b") line.type = "double";
				break;
			}

			case "c": {
				const v = values[vi++];
				if (v === "n") line.cardinality = "none";
				if (v === "1") line.cardinality = "0:1";
				if (v === "N") line.cardinality = "0:N";
				if (v === "M") line.cardinality = "M:N";
				break;
			}

			case "x":
				line.exitX = Number(values[vi++]);
				break;

			case "y":
				line.exitY = Number(values[vi++]);
				break;

			case "e":
				line.entryX = Number(values[vi++]);
				break;

			case "f":
				line.entryY = Number(values[vi++]);
				break;
		}
	}
}


function parseFlags(obj, flags, values) {
	let vi = 0;
	for (let c of flags) {
		switch (c) {
			case "w": obj.w = Number(values[vi++]); break;
			case "h": obj.h = Number(values[vi++]); break;
			case "x": obj.x = Number(values[vi++]); break;
			case "y": obj.y = Number(values[vi++]); break;
			case "v": obj.value = values[vi++]; break;
		}
	}
}

function tokenize(input) {
	const tokens = [];
	let current = "";
	let inQuotes = false;

	for (let i = 0; i < input.length; i++) {
		const ch = input[i];

		if (ch === '"') {
			inQuotes = !inQuotes;
			continue;
		}

		if (ch === " " && !inQuotes) {
			if (current.length > 0) {
				tokens.push(current);
				current = "";
			}
		} else {
			current += ch;
		}
	}

	if (current.length > 0) {
		tokens.push(current);
	}

	return tokens;
}


function completeInput(value) {
	const parts = tokenize(value);
	if (parts.length === 0) return value;

	const last = parts[parts.length - 1];
	const first = parts[0];

	let candidates = [];

	const rootCommands = [
		"new", "line", "del", "rel", "zoom", "focus", "copy"
	];

	const classNames = [
		"Entity",
		"WeakEntity",
		"RoundEntity",
		"Attribute",
		"KeyAttribute",
		"WeakKeyAttribute",
		"DerivedAttribute",
		"MultivaluedAttribute",
		"Relationship",
		"Line"
	];

	// First token completion
	if (parts.length === 1) {
		candidates = rootCommands;
	}

	// After "new"
	else if (first === "new" && parts.length === 2) {
		candidates = classNames;
	}

	// After "del"
	else if (first === "del" && parts.length === 2) {
		candidates = ["line"];
	}

	else {
		return value; // no completion context
	}

	const matches = candidates.filter(c =>
		c.toLowerCase().startsWith(last.toLowerCase())
	);

	if (matches.length === 1) {
		parts[parts.length - 1] = matches[0];
		return parts.join(" ");
	}

	return value;
}


input.addEventListener("keydown", e => {


	if (e.key === "Tab") {
		e.preventDefault();
		input.value = completeInput(input.value);
		return;
	}


	if (e.key === "ArrowUp") {
		if (history.length === 0) return;

		historyIndex--;
		if (historyIndex < 0) historyIndex = 0;

		input.value = history[historyIndex];
		e.preventDefault();
		return;
	}

	if (e.key === "ArrowDown") {
		if (history.length === 0) return;

		historyIndex++;
		if (historyIndex >= history.length) {
			historyIndex = history.length;
			input.value = "";
		} else {
			input.value = history[historyIndex];
		}

		e.preventDefault();
		return;
	}

	if (e.key !== "Enter") return;

	const line = input.value.trim();
	if (line) {
		history.push(line);
		historyIndex = history.length;
	}
	input.value = "";
	if (!line) return;

	logMsg("> " + line);

	const parts = tokenize(line);
	if (parts[0] === "focus") {

		// Relative focus
		if (parts[1] === "rel") {
			const flags = parts[2];
			const values = parts.slice(3);

			let idx = 0;
			for (let c of flags) {
				if (c === "x") camera.cx += Number(values[idx++]);
				if (c === "y") camera.cy += Number(values[idx++]);
			}

			redraw();
			return;
		}

		// Absolute focus
		if (parts[1] === "xy" || parts[1] === "x" || parts[1] === "y") {
			let vi = 0;
			const flags = parts[1];
			const values = parts.slice(2);

			let x = camera.cx;
			let y = camera.cy;

			let idx = 0;
			for (let c of flags) {
				if (c === "x") x = Number(values[idx++]);
				if (c === "y") y = Number(values[idx++]);
			}

			camera.cx = x;
			camera.cy = y;
			redraw();
			return;
		}

	}



	if (parts[0] === "zoom") {
		const percent = Number(parts[1]);
		if (!isNaN(percent)) {
			camera.scale = percent / 100;
			redraw();
		}
		return;
	}

	if (parts[0] === "copy") {
		let xml = generateXML();
		xml = xml.replace(/\n/g, "");
		xml = xml.replace(/\t/g, " ");
		xml = xml.replace(/ {2,}/g, " ");
		navigator.clipboard.writeText(xml);
		logMsg("Copied XML");
		return;
	}

	if (parts[0] === "new" && parts[1] === "Line") {
		const source = Number(parts[2]);
		const target = Number(parts[3]);

		if (!objects[source] || !objects[target]) {
			logMsg("Invalid source/target");
			return;
		}

		const flags = parts[4] || "";
		const values = parts.slice(5);

		const line = new Line(source, target);

		parseLineFlags(line, flags, values);

		lines.push(line);
		redraw();
		return;
	}

	if (parts[0] === "line") {
		const index = Number(parts[1]);

		if (!lines[index]) {
			logMsg("Invalid line index");
			return;
		}

		const flags = parts[2] || "";
		const values = parts.slice(3);

		parseLineFlags(lines[index], flags, values);
		redraw();
		return;
	}

	if (parts[0] === "del" && parts[1] === "line") {
		const index = Number(parts[2]);

		if (isNaN(index) || !lines[index]) {
			logMsg("Invalid line index");
			return;
		}

		lines.splice(index, 1);
		redraw();
		return;
	}

	if (parts[0] === "del") {

		// Object deletion
		const i = Number(parts[1]);

		if (isNaN(i) || !objects[i]) {
			logMsg("Invalid object index");
			return;
		}

		// Remove lines referencing this object
		for (let j = lines.length - 1; j >= 0; j--) {
			const line = lines[j];

			if (line.source === i || line.target === i) {
				lines.splice(j, 1);
				continue;
			}

			// Re-index references
			if (line.source > i) line.source--;
			if (line.target > i) line.target--;
		}

		// Remove object
		objects.splice(i, 1);

		redraw();
		return;
	}

	if (parts[0] === "new") {
		const className = parts[1];
		const flags = parts[2] || "";
		const values = parts.slice(3);

		const Cls = CLASS_MAP[className];
		if (!Cls) {
			logMsg("Invalid class");
		return;
		}

		const obj = new Cls();


		parseFlags(obj, flags, values);

		objects.push(obj);
		redraw();
		return;
	}

	if (parts[0] === "rel") {
		const a = Number(parts[1]);
		const b = Number(parts[2]);
		const flags = parts[3];
		const values = parts.slice(4);

		if (!objects[a] || !objects[b]) return;

		let vi = 0;
		let dx = 0, dy = 0;

		for (let c of flags) {
			if (c === "x") dx = Number(values[vi++]);
			if (c === "y") dy = Number(values[vi++]);
		}

		objects[a].x = objects[b].x + dx;
		objects[a].y = objects[b].y + dy;

		redraw();
		return;
	}

	const index = Number(parts[0]);
	if (!objects[index]) return;

	const flags = parts[1] || "";
	const values = parts.slice(2);
	
	parseFlags(objects[index], flags, values);
	redraw();
});


function resizeCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	redraw();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

