export type ISchedules = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};

export type IFilterRequest = {
  startDate?: string | undefined;
  endDate?: string | undefined;
};
