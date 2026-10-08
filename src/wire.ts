export interface Commit { hash: string; subject: string; author: string; time: string }
export interface ChangedFile { path: string; status: string }
export interface PullRequest { number: number; title: string; url: string; state: string; baseRefName: string; isDraft: boolean }
export interface Summary {
  kind: 'repo' | 'not-repo' | 'unavailable'; message?: string;
  name?: string; branch?: string; detached?: boolean; ahead?: number; behind?: number;
  additions?: number; deletions?: number; binary?: number; files?: ChangedFile[]; untracked?: number;
  commits?: Commit[]; pr?: PullRequest | null; prMessage?: string; updatedAt: number;
}
export interface DiffPreview { text: string; truncated: boolean; message?: string }
