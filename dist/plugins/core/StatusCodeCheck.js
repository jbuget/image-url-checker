"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatusCodeCheck {
    async check(response, analyzedLine) {
        if (!analyzedLine.error) {
            if (response.statusCode !== 200) {
                analyzedLine.markInError('HTTP_ERROR', 'HTTP status is not 200(OK)');
            }
        }
        return analyzedLine;
    }
}
exports.default = StatusCodeCheck;
//# sourceMappingURL=StatusCodeCheck.js.map