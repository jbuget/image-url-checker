# URL-Checker

## Installation

Pré-requis : disposer d'une version opérationnelle de Node.js/npm sur son poste
* Node v14+ (recommended v14.17.6)
* npm 6+ (recommended v6.14.15)

Récupérer les sources : 
``` 
git clone https://github.com/jbuget/url-checker.git 
```

Se rendre dans le répertoire source : 
```
cd url-checker
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
| -d --delimiter _separator_ | column separator | ; |
| -p --ouput _filepath_ | ouput file path |  |

### Input file

Supported file extension: `.csv`

Supported data format (without head line):
``` 
<reference>;<url>
```

