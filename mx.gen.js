class Attribute {
	constructor(value = "Attribute", w = 100, h = 40, x = 0, y = 0) {
		this.value = value;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	init(_id, _parent) {
		this._id = _id;
		this._parent = _parent;
	}

	_escape(val) {
		return val
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	mxRender() {
		return `
<mxCell id="${this._id}" parent="${this._parent}"
	style="ellipse;whiteSpace=wrap;html=1;align=center;"
	value="${this._escape(this.value)}"
	vertex="1">
	<mxGeometry x="${this.x}" y="${this.y}"
		width="${this.w}" height="${this.h}"
		as="geometry"/>
</mxCell>`;
	}
}


class KeyAttribute {
	constructor(value = "KeyAttribute", w = 100, h = 40, x = 0, y = 0) {
		this.value = value;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	init(_id, _parent) {
		this._id = _id;
		this._parent = _parent;
	}

	_escape(val) {
		return val
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	mxRender() {
		return `
<mxCell id="${this._id}" parent="${this._parent}"
	style="ellipse;whiteSpace=wrap;html=1;align=center;fontStyle=4;"
	value="${this._escape(this.value)}"
	vertex="1">
	<mxGeometry x="${this.x}" y="${this.y}"
		width="${this.w}" height="${this.h}"
		as="geometry"/>
</mxCell>`;
	}
}


class Entity {
	constructor(value = "Entity", w = 100, h = 40, x = 0, y = 0) {
		this.value = value;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	init(_id, _parent) {
		this._id = _id;
		this._parent = _parent;
	}

	_escape(val) {
		return val
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	mxRender() {
		return `
<mxCell id="${this._id}" parent="${this._parent}"
	style="whiteSpace=wrap;html=1;align=center;"
	value="${this._escape(this.value)}"
	vertex="1">
	<mxGeometry x="${this.x}" y="${this.y}"
		width="${this.w}" height="${this.h}"
		as="geometry"/>
</mxCell>`;
	}
}


class RoundEntity {
	constructor(value = "RoundEntity", w = 100, h = 40, x = 0, y = 0) {
		this.value = value;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	init(_id, _parent) {
		this._id = _id;
		this._parent = _parent;
	}

	_escape(val) {
		return val
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	mxRender() {
		return `
<mxCell id="${this._id}" parent="${this._parent}"
	style="rounded=1;arcSize=10;whiteSpace=wrap;html=1;align=center;"
	value="${this._escape(this.value)}"
	vertex="1">
	<mxGeometry x="${this.x}" y="${this.y}"
		width="${this.w}" height="${this.h}"
		as="geometry"/>
</mxCell>`;
	}
}


class WeakEntity {
	constructor(value = "WeakEntity", w = 100, h = 40, x = 0, y = 0) {
		this.value = value;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	init(_id, _parent) {
		this._id = _id;
		this._parent = _parent;
	}

	_escape(val) {
		return val
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	mxRender() {
		return `
<mxCell id="${this._id}" parent="${this._parent}"
	style="shape=ext;margin=3;double=1;whiteSpace=wrap;html=1;align=center;"
	value="${this._escape(this.value)}"
	vertex="1">
	<mxGeometry x="${this.x}" y="${this.y}"
		width="${this.w}" height="${this.h}"
		as="geometry"/>
</mxCell>`;
	}
}


class WeakKeyAttribute {
	constructor(value = "WeakKeyAttribute", w = 100, h = 40, x = 0, y = 0) {
		this.value = value;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	init(_id, _parent) {
		this._id = _id;
		this._parent = _parent;
	}

	mxRender() {
		const formatted =
			`&lt;span style=&quot;border-bottom: 1px dotted&quot;&gt;${this.value}&lt;/span&gt;`;

		return `
<mxCell id="${this._id}" parent="${this._parent}"
	style="ellipse;whiteSpace=wrap;html=1;align=center;"
	value="${formatted}"
	vertex="1">
	<mxGeometry x="${this.x}" y="${this.y}"
		width="${this.w}" height="${this.h}"
		as="geometry"/>
</mxCell>`;
	}
}


class DerivedAttribute {
	constructor(value = "DerivedAttribute", w = 100, h = 40, x = 0, y = 0) {
		this.value = value;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	init(_id, _parent) {
		this._id = _id;
		this._parent = _parent;
	}

	_escape(val) {
		return val
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	mxRender() {
		return `
<mxCell id="${this._id}" parent="${this._parent}"
	style="ellipse;whiteSpace=wrap;html=1;align=center;dashed=1;"
	value="${this._escape(this.value)}"
	vertex="1">
	<mxGeometry x="${this.x}" y="${this.y}"
		width="${this.w}" height="${this.h}"
		as="geometry"/>
</mxCell>`;
	}
}


class MultivaluedAttribute {
	constructor(value = "MultivaluedAttribute", w = 100, h = 40, x = 0, y = 0) {
		this.value = value;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	init(_id, _parent) {
		this._id = _id;
		this._parent = _parent;
	}

	_escape(val) {
		return val
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	mxRender() {
		return `
<mxCell id="${this._id}" parent="${this._parent}"
	style="ellipse;shape=doubleEllipse;margin=3;whiteSpace=wrap;html=1;align=center;"
	value="${this._escape(this.value)}"
	vertex="1">
	<mxGeometry x="${this.x}" y="${this.y}"
		width="${this.w}" height="${this.h}"
		as="geometry"/>
</mxCell>`;
	}
}

class Relationship {
	constructor(value = "Relationship", w = 120, h = 60, x = 0, y = 0) {
		this.value = value;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	init(_id, _parent) {
		this._id = _id;
		this._parent = _parent;
	}

	_escape(val) {
		return val
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	mxRender() {
		return `
<mxCell id="${this._id}" parent="${this._parent}"
	style="shape=rhombus;perimeter=rhombusPerimeter;whiteSpace=wrap;html=1;align=center;"
	value="${this._escape(this.value)}"
	vertex="1">
	<mxGeometry x="${this.x}" y="${this.y}"
		width="${this.w}" height="${this.h}"
		as="geometry"/>
</mxCell>`;
	}
}


