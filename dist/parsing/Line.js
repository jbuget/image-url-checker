"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Line {
    constructor(index, rawLine, separator) {
        this.index = index;
        this.raw = rawLine;
        this.separator = separator;
        const [reference, url] = rawLine.split(this.separator);
        this.reference = reference;
        this.url = url;
    }
}
exports.default = Line;
