# image-url-checker

A small Node.js tool & library that checks image URL from a given CSV input file and report the analysis results in a new CSV output file. 

## Usage

### Prerequisites

You need a working version of:
* Node v14+ (recommended v14.17.6)
* npm 6+ (recommended v6.14.15)

### As a tool

```bash
npx image-url-checker -i input_file.csv -o output_file.csv
```

**Options:**

| option | description | default value |
| ------ | ----------- | ------------- |
| -d --delay _number_ | delay (in ms) between two URL calls | None |
| -b --bulk _number_ | number of concurrent HTTP calls during analysis phase | 10 |
| -f --from _number_ | line "from" | None |
| (required) -i --input _input_file_ | input file path | None |
| -s --separator _character_ | column separator | ; |
| -o --ouput _filepath_ | ouput file path | None |
| -f --to _number_ | line "to" | None |

**Input file:**

Supported file extension: `.csv`

Supported data format (without head line):
``` 
<reference>;<url>
```

**Output file:**

![Screenshot](docs/image-url-checker_screenshot.png)

### As a library

```bash
npm install image-url-checker
```

```javascript
import Program from './Program';

const program = new Program();

program.run('my-app -i input_file.csv -o output_file.csv').then(() => process.exit(0));
```
