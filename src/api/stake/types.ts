export interface IVePLYData {
  tokenId: string;
  boostValue: string;
  votingPower: string;
};

export interface IVePLYListResponse {
  success: boolean;
  vePLYData: IVePLYData[];
  error?: string;
}