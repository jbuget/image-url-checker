"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContentTypeCheck {
    async check(response, analyzedLine) {
        if (!analyzedLine.error) {
            if (!response.headers['content-type'].trim().toLowerCase().startsWith('image/')) {
                analyzedLine.markInError('HTTP_ERROR', 'HTTP response content type is not an image');
            }
        }
        return analyzedLine;
    }
}
exports.default = ContentTypeCheck;
//# sourceMappingURL=ContentTypeCheck.js.map