export interface IEpochListObject {
  epochNumber: number;
  isCurrent: boolean;
  startTimestamp: number;
  endTimestamp: number;
}

export interface IEpochDataResponse {
  success: boolean;
  epochData: IEpochListObject[];
  error?: string;
}