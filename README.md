# Keyboard ER Diagram Generator

A keyboard-centric ER (Entity–Relationship) diagram generator that exports valid mxGraph XML (compatible with draw.io / diagrams.net).

No drag-and-drop.  
No framework.  
No backend.  
Pure state + deterministic export.

Hosted easily via GitHub Pages.

---

# Philosophy

This tool is designed for:

- Fast keyboard-driven diagram creation
- Deterministic behavior
- Stateless XML export
- Minimal UI surface
- Clean internal architecture

All structure is stored in:

- `objects[]`
- `lines[]`

Everything else is rendering.

---

# Architecture

## State

```js
objects[]   // Entities, Attributes, Relationships
lines[]     // Connections between objects
````

Undo/redo snapshots store deep copies of these two arrays only.

Camera (zoom/focus) is NOT part of undo history.

---

# Command System

Commands are entered in the input field and executed on `Enter`.

All parsing is space-separated with support for quoted strings:

```
new Entity vxy "Book Title" 100 200
```

Quoted values preserve spaces.

---

# General Grammar

## Object Creation

```
new <ClassName> <flags> <values>
```

Flags are compact and order-sensitive.

Example:

```
new Entity vxy "Author" 100 100
```

---

## Object Modification

```
<index> <flags> <values>
```

Example:

```
0 xy 200 300
```

---

## Object Deletion

```
del <index>
```

Deletes object and any connected lines.
Line indices are automatically reindexed.

---

## Line Creation

```
new Line <sourceIndex> <targetIndex> <flags> <values>
```

Example:

```
new Line 0 3 tc r N
```

---

## Line Modification

```
line <index> <flags> <values>
```

Source and target cannot be modified.

---

## Line Deletion

```
del line <index>
```

---

## Undo / Redo

```
undo
redo
```

* Only structural changes are stored.
* Camera changes are not stored.
* Redo stack clears after new mutation.

---

## Copy XML

```
copy
```

Copies compacted mxGraph XML to clipboard.

Paste into:

* draw.io
* diagrams.net
* mxGraph import dialog

---

# Object Classes

```
Entity
WeakEntity
RoundEntity
Attribute
KeyAttribute
WeakKeyAttribute
DerivedAttribute
MultivaluedAttribute
Relationship
```

---

# Object Flags

| Flag | Meaning            |
| ---- | ------------------ |
| w    | width              |
| h    | height             |
| x    | x position         |
| y    | y position         |
| v    | value (text label) |

Example:

```
new Attribute vxy "Name" 50 200
```

---

# Line Flags

| Flag | Meaning     |
| ---- | ----------- |
| t    | type        |
| c    | cardinality |
| x    | exitX       |
| y    | exitY       |
| e    | entryX      |
| f    | entryY      |

---

## Line Types (`t`)

| Value | Meaning |
| ----- | ------- |
| r     | regular |
| d     | dotted  |
| b     | double  |

Example:

```
new Line 0 1 t r
```

---

## Cardinality (`c`)

| Value | Meaning |
| ----- | ------- |
| n     | none    |
| 1     | 0:1     |
| N     | 0:N     |
| M     | M:N     |

Example:

```
new Line 0 1 tc r N
```

---

# Anchors

Anchors control where lines attach to objects.

| Flag | Meaning |
| ---- | ------- |
| x    | exitX   |
| y    | exitY   |
| e    | entryX  |
| f    | entryY  |

Values are ratios:

* 0 → left/top
* 0.5 → center
* 1 → right/bottom

Example:

```
new Line 0 1 efxy 0.5 1 0.5 0
```

---

# Grid

* Minor grid every 50 units
* Major grid every 200 units
* Coordinates displayed along edges only
* Fully camera-aware
* No snapping

---

# Tab Completion

Supports:

* Root commands (`new`, `del`, `line`, etc.)
* Class names after `new`
* `line` after `del`

Single-match completion only.

---

# Example ER Diagram

Create a simple Author–Book relationship:

```
new Entity vxy "Author" 100 100
new Entity vxy "Book" 500 100
new Relationship vxy "Writes" 300 100

new KeyAttribute vxy "AuthorID" 20 80
new Attribute vxy "Name" 20 140
new KeyAttribute vxy "ISBN" 650 80
new Attribute vxy "Title" 650 140

new Line 0 2 tc r M
new Line 2 1 tc r N
```

Then:

```
copy
```

Paste into draw.io XML import.

---

# Deployment

This is a static project.

To deploy via GitHub Pages:

1. Push repo
2. Settings → Pages
3. Select `main` branch
4. Root folder
5. Save

Access via:

```
https://<username>.github.io/<repo>/
```

---

# Design Guarantees

* Deterministic output
* No hidden state
* Stateless XML generation
* Prototype-safe undo/redo
* No framework dependencies

---

# Limitations (By Design)

* No drag-and-drop
* No snapping
* No GUI editing
* No XML import
* No auto-layout

This is a keyboard-driven structural editor.
