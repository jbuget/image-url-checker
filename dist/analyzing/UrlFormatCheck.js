"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
class UrlFormatCheck {
    async check(line, analyzedLine) {
        if (!analyzedLine.error) {
            try {
                new url_1.URL(line.url);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (error) {
                analyzedLine.markInError('FORMAT_ERROR', error.message);
            }
        }
        return analyzedLine;
    }
}
exports.default = UrlFormatCheck;
//# sourceMappingURL=UrlFormatCheck.js.map