class Line {
	constructor(
		source = null,
		target = null,
		entryX = null,
		entryY = null,
		exitX = null,
		exitY = null,
		type = "regular",        // regular | dot | double
		cardinality = "none"     // none | 0:1 | 0:N | M:N
	) {
		this.source = source;
		this.target = target;

		this.entryX = entryX;
		this.entryY = entryY;
		this.exitX = exitX;
		this.exitY = exitY;

		this.type = type;
		this.cardinality = cardinality;
	}

	init(_id, _parent) {
		this._id = _id;
		this._parent = _parent;
	}

	_edgeStyle() {
		let style = "";

		if (this.type === "regular") {
			style = "endArrow=none;html=1;rounded=0;";
		}

		if (this.type === "dot") {
			style = "endArrow=none;html=1;rounded=0;dashed=1;dashPattern=1 2;";
		}

		if (this.type === "double") {
			style = "shape=link;html=1;rounded=0;";
		}

		if (this.entryX !== null) style += `entryX=${this.entryX};`;
		if (this.entryY !== null) style += `entryY=${this.entryY};`;
		if (this.exitX !== null) style += `exitX=${this.exitX};`;
		if (this.exitY !== null) style += `exitY=${this.exitY};`;

		return style;
	}

	_renderCardinality(edgeId) {
		let xml = [];
		let nextId = Number(edgeId) + 1;

		const rightStyle =
			"resizable=0;html=1;whiteSpace=wrap;align=right;verticalAlign=bottom;";

		if (this.cardinality === "0:1") {
			xml.push(`
		<mxCell id="${nextId}" connectable="0" parent="${edgeId}"
			style="${rightStyle}"
			value="1" vertex="1">
			<mxGeometry relative="1" x="1" as="geometry"/>
		</mxCell>`);
			nextId++;
		}

		if (this.cardinality === "0:N") {
			xml.push(`
		<mxCell id="${nextId}" connectable="0" parent="${edgeId}"
			style="${rightStyle}"
			value="N" vertex="1">
			<mxGeometry relative="1" x="1" as="geometry"/>
		</mxCell>`);
			nextId++;
		}

		if (this.cardinality === "M:N") {
			// Left M
			xml.push(`
		<mxCell id="${nextId}" connectable="0" parent="${edgeId}"
			style="resizable=0;html=1;whiteSpace=wrap;align=left;verticalAlign=bottom;"
			value="M" vertex="1">
			<mxGeometry relative="1" x="-1" as="geometry"/>
		</mxCell>`);
			nextId++;

			// Right N
			xml.push(`
		<mxCell id="${nextId}" connectable="0" parent="${edgeId}"
			style="${rightStyle}"
			value="N" vertex="1">
			<mxGeometry relative="1" x="1" as="geometry"/>
		</mxCell>`);
			nextId++;
		}

		return xml.join("");
	}

	mxRender() {
		let edgeXML = `
		<mxCell id="${this._id}" edge="1" parent="${this._parent}"
			source="${this.source}" target="${this.target}"
			style="${this._edgeStyle()}"
			value="">
			<mxGeometry relative="1" as="geometry"/>
		</mxCell>`;

		return edgeXML + this._renderCardinality(this._id);
	}
}
