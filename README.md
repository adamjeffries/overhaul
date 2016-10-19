# typedef.js
> JavaScript Type Definition (Type Checking, Formatting, Annotations, & more)

[![npm version](https://badge.fury.io/js/typedef.js.svg)](https://badge.fury.io/js/typedef.js)

# NOT READY FOR USE YET! - Please check back soon


## Install
```
npm install --save typedef.js
```

## Quick Start
``` javascript
const t = require("typedef.js");

// Create a Type Definition
let def = t.required.object({
  a: t.string.toInteger.required.default(45),
  b: t.string.truncate(2),
  c: t.rename("d"),
  e: t.default("four")
});

// Get the Value
// - Throw Errors
// - Returns the new Value
let newValue = def.value({a: "one"});
```


### TypeDef Usage
``` javascript
const typedef = require("typedef.js");

// Instantiate without "new"
var def = typedef();
def instanceof typedef; //true

// Instantiate without even calling as a function - if a single definition is used
var def = typedef.string;
def instanceof typedef; //true
```

### Core Methods
* .value(value) - throws if any errors and returns the new value
* .serialize() - returns a string-ified form of the definition
* .definition() - json format of the chained arguments
* .register(name, definition) - registers a new definition

### Serialize and Deserialize a TypeDef
Note: works only for JSON serializable arguments

``` javascript
// Define
var def = TypeDef.object.required.keys.slice(2).stringify;

// Serialize
var str = def.serialize();

// Deserialize
var def2 = typedef(str);

// Compare
def == def2; // true
```

### Definitions

#### Types
All methods below have ("is", "to", and native)
* arguments
* array
* boolean
* collection??  array or object
* date
* element
* error
* function
* integer
* instance
* null
* number
* object
* regExp
* string
* undefined

#### Descriptors
* deprecated
* description
* example
* required
* default

#### Walkers (for nested objects and arrays)
* rename
* key
* parent
* delete
* clone
* index - same as key?

#### Modifiers
Lots and Lots....

#### Collection Modifiers

#### Array Modifiers

#### Object Modifiers
freeze?

#### Collection Modifiers (Array or Object)

#### Function Modifiers

#### String Modifiers

#### Number Modifiers

#### Array or String Modifiers (put in two places)

#### Boolean Modifiers

#### Any Modifiers
