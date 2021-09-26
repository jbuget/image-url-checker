# image-url-checker

## Installation

Pré-requis : disposer d'une version opérationnelle de Node.js/npm sur son poste
* Node v14+ (recommended v14.17.6)
* npm 6+ (recommended v6.14.15)

Récupérer les sources : 
``` 
git clone https://github.com/jbuget/image-url-checker.git 
```

Se rendre dans le répertoire source : 
```
cd image-url-checker
```

Télécharger les dépendances : 
```
npm install
```

Compiler les sources : 
``` 
npm build
```

Exécuter le programme : 
```
node dist/index.js [-d ";"] [-o "output.txt"] file
```

## Usage

### Options

| option | description | default value |
| ------ | ----------- | ------------- |
| -d --delay _number_ | delay (in ms) between two URL calls | None |
| -b --bulk _number_ | number of concurrent HTTP calls during analysis phase | 10 |
| -f --from _number_ | line "from" | None |
| -s --separator _character_ | column separator | ; |
| -o --ouput _filepath_ | ouput file path | None |
| -f --to _number_ | line "to" | None |

### Input file

Supported file extension: `.csv`

Supported data format (without head line):
``` 
<reference>;<url>
```

### Output

![Screenshot](docs/image-url-checker_screenshot.png)

