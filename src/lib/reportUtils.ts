import type { Box } from "@/stores/appStore";

export const getCurrentWeekRange = () => {
  const now = new Date();
  const start = new Date(now);
  const day = start.getDay() || 7;
  start.setDate(start.getDate() - day + 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

export const isDateInRange = (dateValue: string | Date | null | undefined, start: Date, end: Date) => {
  if (!dateValue) return false;
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  return date >= start && date <= end;
};

export const calculateDoctorWorkedSeconds = (boxes: Box[], medicoId: number, start: Date, end: Date) => {
  return boxes.reduce((total, box) => {
    if (box.medicoId !== medicoId || !box.horaInicioReal || !isDateInRange(box.horaInicioReal, start, end)) return total;
    const from = new Date(box.horaInicioReal).getTime();
    const to = box.horaTerminoReal ? new Date(box.horaTerminoReal).getTime() : Date.now();
    return total + Math.max(0, Math.floor((to - from) / 1000));
  }, 0);
};

export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};