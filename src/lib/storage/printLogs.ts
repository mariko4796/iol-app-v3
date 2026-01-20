// src/lib/storage/printLogs.ts

import type { Answers } from "@/src/state/types";
import type { LensKey } from "@/src/domain/lens/lensTypes";

export const STORAGE_KEY = "iolapp_print_logs_v3";
export const SCHEMA_VERSION = 3;
const MAX_LOGS = 10;

export type PrintLogData = {
  finalKey: LensKey | null;
  finalLabel: string;
  finalLensType: string;
  finalDistanceText: string;
  reasonText: string;
  visionWarning: string;
  glassesWarning: string;
  retinaWarning: string;
  answers: Answers;
  extraConfirmations: string[];
  exceptionMessages: string[];
};

export type PrintLogEntry = {
  schemaVersion: number;
  createdAt: string;
  label: string;
  data: PrintLogData;
};

export function savePrintLog(entry: Omit<PrintLogEntry, "schemaVersion">): void {
  try {
    const payload: PrintLogEntry = {
      schemaVersion: SCHEMA_VERSION,
      ...entry,
    };

    let logs: PrintLogEntry[] = [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) logs = parsed;
      } catch {
        logs = [];
      }
    }

    const newLogs = [payload, ...logs].slice(0, MAX_LOGS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
  } catch (e) {
    console.error("localStorage 保存エラー:", e);
  }
}

export function loadPrintLogs(): PrintLogEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item.schemaVersion === SCHEMA_VERSION) as PrintLogEntry[];
  } catch {
    return [];
  }
}

export function clearPrintLogs(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("localStorage クリアエラー:", e);
  }
}
