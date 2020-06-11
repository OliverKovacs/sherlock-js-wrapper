
## Overview

This is a JavaScript wrapper for Sherlock (https://github.com/sherlock-project/sherlock/). It automatically installs Sherlock upon the first time of importing it. If the installation fails, try running Node.js with admin privileges.

Note that you need to have Python 3.6 or higher, pip and Git installed and an internet connection in order for this to work.

Also note that any problems with the output (false positives/negatives) are most likely caused by Sherlock itself. Refer to https://github.com/sherlock-project/sherlock/issues.

Also note that I am not affiliated with the creator of Sherlock in any form.


## Installation

Download repository using Git:
```bash
$ git clone https://github.com/OliverKovacs/sherlock-js
```

## Usage

Import:
```js
const Sherlock = require("./sherlock/index.js");
```

Search for username:
```js
let json = Sherlock.search(username);
```

Other functions:
```js
Sherlock.username(json)     // returns the name of the target

Sherlock.positive(json)     // returns a list of all hits

Sherlock.negative(json)     // returns a list of all non-hits
```

Example:
```js
const Sherlock = require("./sherlock/index.js");

let json = Sherlock.search("oliverkovacs");

// json of all hits for "oliverkovacs"
console.log(Sherlock.positive(json));

// urls of all hits for "oliverkovacs"
console.log(Sherlock.positive(json).map(element => element.url));
```

Reload custom sites:
```js
Sherlock.reload()
```

Update Sherlock installation:
```js
Sherlock.update()
```

Delete Sherlock installation:
```js
Sherlock.delete()           // importing Sherlock will automatically reinstall it
```

## Config:


`config.python`

Your Python 3 command, default: `"python"`. Depending on your Python installations you may need to change this to `"python3"`, `"py"` or `"py -3"`.

`config.output`

The keys of the JSON object returned from `Sherlock.search()`. You probably shouldn't mess with this, unless you know what you're doing and you need to.

`config.add`

**Note:** You need to restart the process or call `Sherlock.reload()` after changing this options, otherwise nothing will happen.

Custom sites added to Sherlock data.json. Triple j Unearthed is added as default as an example, but you can remove or expand this as you like. For further information on adding sites to Sherlock, refer to https://github.com/sherlock-project/sherlock/wiki/Adding-Sites-To-Sherlock.