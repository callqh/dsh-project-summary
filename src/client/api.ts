import type { DiffPreview, Summary } from '../wire.js';
export type Result<T> = { ok: true; value: T } | { ok: false; error: { message?: string } };
export interface Api { summary(sessionId: string): Promise<Result<Summary>>; diff(sessionId: string): Promise<Result<DiffPreview>> }
export const contribution = { package: 'dsh-project-summary', descriptors: ['summary', 'diff'].map(method => ({
  id: `dsh-project-summary#projectSummary/${method}`, service: 'projectSummary', namespace: 'projectSummary', method,
  invocation: { kind: 'direct' }, parameters: [{ name: 'sessionId', wire: 'sessionId', source: 'json', codec: {
    mode: 'strict', typeSymbol: `dsh-project-summary#projectSummary/${method}:sessionId`,
    create: () => ({ '~standard': { version: 1, vendor: 'dsh-project-summary', validate: (value: unknown) => typeof value === 'string' && value.length <= 200 ? { value } : { issues: [{ message: 'Expected session id' }] } } }),
  } }], result: { mode: 'src-json' },
})) };
export function unwrap<T>(result: Result<T>): T {
  if (result.ok) return result.value;
  throw new Error(result.error?.message || '与 Harness 通信失败');
}
