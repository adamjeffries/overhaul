# Overhaul
> Type Checking, Formatting, Annotations, & more

[![npm version](https://badge.fury.io/js/overhaul.svg)](https://badge.fury.io/js/overhaul)



## Table of Contents

* [Quick Start](#quick-start)
* [Usage](#usage)
    * [Constructor](#constructor)
    * [Value](#value)
    * [Register](#register)
    * [Definition](#definition)
    * [Serialize](#serialize)
* [Definitions](#definitions)
    * [Types](#types)
    * [Traversals](#traversals)
    * [Modifiers](#modifiers)
    * [Annotations](#annotations)
    * [Lodash](#lodash)
* [Installation](#installation)
* [License: MIT](#license)



## Quick Start
```js
const oh = require("overhaul");

let format = oh.object({
  id: oh.required.toString.description("User Id"),
  state: oh.default("WA").values(["CA", "OR", "WA"]),
  age: oh.integer.within(10, 20).deprecated,
  filter: oh.object({
    start: oh.default(0).toNumber,
    end: oh.default(() => 5000).number
  })
});

let req = format.value({
  id: 123,
  age: 15,
  filter: {start: "100"}
});

// req === { id: '123', age: 15, state: 'WA', filter: { start: 100, end: 5000 } }
```


## Usage

### Constructor

### Value

### Register

### Definition

### Serialize

[↑ Back to top](#table-of-contents)

## Definitions

### Types

#### Arguments

``` javascript

```

#### Array

``` javascript

```

#### Boolean

``` javascript

```

#### Date

``` javascript

```

#### Element

``` javascript

```

#### Empty

``` javascript

```

#### Error

``` javascript

```

#### Finite

``` javascript

```

#### Instance

``` javascript

```

#### NaN

``` javascript

```

#### Null

``` javascript

```

#### Number

``` javascript

```

#### Object (Plain Object)

``` javascript

```

#### RegExp

``` javascript

```

#### String

``` javascript

```

#### Undefined

``` javascript

```

### Traversals

#### Copy

``` javascript

```

#### Delete

``` javascript

```

#### Index

``` javascript

```

#### Key

``` javascript

```

#### Move

``` javascript

```

#### Parent

``` javascript

```

#### Sibling

``` javascript

```

### Modifiers

#### Default

``` javascript

```

#### Freeze

``` javascript

```

#### Noop

``` javascript

```

#### Parse

``` javascript

```

#### Required

``` javascript

```

#### Stringify

``` javascript

```

### Annotations

#### Example

``` javascript

```

#### Description

``` javascript

```

#### Deprecated

``` javascript

```

### Lodash

https://lodash.com/docs

[↑ Back to top](#table-of-contents)

## Installation
```bash
npm install --save overhaul
```

[↑ Back to top](#table-of-contents)

## License

overhaul is licensed under the [MIT license](LICENSE.md).

[↑ Back to top](#table-of-contents)
