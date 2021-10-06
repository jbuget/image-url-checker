"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const fs_1 = require("fs");
const Reporter_1 = require("./Reporter");
class CsvFileReporter extends Reporter_1.AbstractReporter {
    constructor(options) {
        super(options);
        this.output = options.output;
        this.separator = options.separator || ';';
    }
    writeOutputLines(analyzedLines) {
        return new Promise((resolve) => {
            (0, assert_1.strict)(!!this.output, 'Options "output" must be specified');
            const outputStream = (0, fs_1.createWriteStream)(this.output, { flags: 'w' });
            outputStream.on('finish', resolve);
            analyzedLines.forEach((line) => {
                outputStream.write([line.reference, line.url, line.status].join(this.separator));
                if (line.error) {
                    outputStream.write(`${this.separator}${line.error}${this.separator}`);
                    line.comments.forEach((comment) => outputStream.write(`${comment}`));
                }
                outputStream.write('\n');
            });
            outputStream.end();
        });
    }
}
exports.default = CsvFileReporter;
//# sourceMappingURL=CsvFileReporter.js.map