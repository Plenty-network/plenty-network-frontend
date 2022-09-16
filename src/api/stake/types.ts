import { ELocksState } from "../votes/types";

export interface IVePLYData {
  tokenId: string;
  boostValue: string;
  votingPower: string;
  lockState: ELocksState
};

export interface IVePLYListResponse {
  success: boolean;
  vePLYData: IVePLYData[];
  error?: string;
}