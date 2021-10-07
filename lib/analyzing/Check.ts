import AnalyzedLine from './AnalyzedLine';
import Line from '../parsing/Line';
import { HttpResponse } from '../tools/HttpClient';

export interface Check {
  check(line: Line, analyzedLine: AnalyzedLine): Promise<AnalyzedLine>;
}

export interface HttpCheck {
  check(response: HttpResponse, analyzedLine: AnalyzedLine): Promise<AnalyzedLine>;
}
