export interface TrainerInfo {
  name: string;
  tid: number;
  sid: number;
  displayTID: string;
  displaySID: string;
  gender: number;
  money: number;
  region: string;
  language: number;
  gameVersion: number;
  badges: boolean[];
  playTime: PlayTime;
  rival?: string;
}

export interface PlayTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export function formatPlayTime(pt: PlayTime): string {
  return `${pt.hours}h ${pt.minutes.toString().padStart(2, '0')}m ${pt.seconds.toString().padStart(2, '0')}s`;
}

export function formatTID(tid: number, sid: number, gen: number): { displayTID: string; displaySID: string } {
  if (gen >= 7) {
    const full = (sid << 16) | tid;
    return {
      displayTID: (full % 1000000).toString().padStart(6, '0'),
      displaySID: Math.floor(full / 1000000).toString().padStart(4, '0'),
    };
  }
  return {
    displayTID: tid.toString().padStart(5, '0'),
    displaySID: sid.toString().padStart(5, '0'),
  };
}
