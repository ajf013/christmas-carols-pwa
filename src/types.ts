export interface SongLine {
  tamil: string;
  english: string;
  meaning?: string;
  repeat?: number;
}

export interface SongSection {
  type: 'chorus' | 'verse';
  label: string;
  lines: SongLine[];
}

export interface Song {
  id: number;
  titleTamil: string;
  titleEnglish: string;
  category: string;
  preview: string;
  sections: SongSection[];
}

export type ViewMode = 'tamil' | 'english' | 'both';
