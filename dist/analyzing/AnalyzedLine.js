"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Line_1 = __importDefault(require("../parsing/Line"));
class AnalyzedLine extends Line_1.default {
    constructor(line) {
        super(line.index, line.raw, line.separator);
        this.status = '-';
        this.comments = [];
    }
    markInSuccess() {
        this.status = 'OK';
    }
    markInError(errorType, errorMessage) {
        this.status = 'KO';
        this.error = errorType;
        this.comments.push(errorMessage);
    }
}
exports.default = AnalyzedLine;
//# sourceMappingURL=AnalyzedLine.js.map