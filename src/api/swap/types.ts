import { BigNumber } from 'bignumber.js'
import { ITokenInterface } from '../../config/types';

export interface ISwapDataResponse {
  success: boolean;
  tokenIn: string;
  tokenOut: string;
  exchangeFee: BigNumber;
  lpTokenSupply: BigNumber;
  lpToken: ITokenInterface | undefined;
  tokenInPrecision?: BigNumber;
  tokenOutPrecision?: BigNumber;
  tokenInSupply: BigNumber;
  tokenOutSupply: BigNumber;
  target?: BigNumber;
}

export interface ICalculateTokenResponse {
    tokenOutAmount: BigNumber;
    fees: BigNumber;
    feePerc : BigNumber;
    minimumOut: BigNumber;
    exchangeRate: BigNumber;
    priceImpact: BigNumber;
    error?: any;
  }

export interface IRouterResponse {
  path: string[];
  tokenOutAmount: BigNumber;
  finalMinimumTokenOut: BigNumber;
  minimumTokenOut: BigNumber[];
  finalPriceImpact: BigNumber;
  finalFeePerc: BigNumber;
  feePerc: BigNumber[];
  isStable: boolean[];
  exchangeRate: BigNumber;
}

export interface IBestPathResponse {
  path: string[];
  bestPathSwapData : ISwapDataResponse[];
  tokenOutAmount: BigNumber;
  minimumTokenOut: BigNumber[];
  fees: BigNumber[];
  feePerc: BigNumber[];
  priceImpact: BigNumber[];
}

export const tezCtezStorageType : any = {
  "prim": "Pair",
  "args": [
    {
      "prim": "Pair",
      "args": [
        {
          "prim": "Pair",
          "args": [
            {
              "prim": "Pair",
              "args": [
                {
                  "prim": "False"
                },
                {
                  "string": "tz1NbDzUQCcV2kp3wxdVHVSZEDeq2h97mweW"
                }
              ]
            },
            {
              "string": "KT1SjXiUX63QvdNMcM2m492f7kuf8JxXRLp4"
            },
            {
              "int": "0"
            }
          ]
        },
        {
          "prim": "Pair",
          "args": [
            {
              "int": "17262413106"
            },
            {
              "string": "KT1GWnsoFZVHGh7roXEER3qeCcgJgrXT3de2"
            }
          ]
        },
        {
          "int": "1000"
        },
        {
          "string": "KT1DMnJvNrFYc8N9Ptxhw3NtqKN7AWqxCpkS"
        },
        {
          "int": "64067365458"
        }
      ]
    },
    {
      "prim": "Pair",
      "args": [
        {
          "prim": "Pair",
          "args": [
            {
              "prim": "None"
            },
            {
              "prim": "False"
            }
          ]
        },
        {
          "prim": "None"
        },
        {
          "prim": "None"
        }
      ]
    },
    {
      "prim": "Pair",
      "args": [
        {
          "prim": "False"
        },
        {
          "int": "49001167488"
        }
      ]
    },
    {
      "prim": "None"
    },
    {
      "prim": "None"
    },
    {
      "int": "0"
    }
  ]
}

export const stableswapStorageType : any ={
  "prim": "Pair",
  "args": [
    {
      "prim": "Pair",
      "args": [
        {
          "prim": "Pair",
          "args": [
            {
              "prim": "Pair",
              "args": [
                {
                  "string": "tz1NbDzUQCcV2kp3wxdVHVSZEDeq2h97mweW"
                },
                {
                  "int": "1000"
                }
              ]
            },
            {
              "string": "KT1Ah4Fe2hjcRdVCiCQDhRDZ2vDYLdYNjY51"
            },
            {
              "int": "118363489997237"
            }
          ]
        },
        {
          "prim": "Pair",
          "args": [
            {
              "prim": "False"
            },
            {
              "prim": "False"
            }
          ]
        },
        {
          "string": "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW"
        },
        {
          "prim": "True"
        },
        {
          "int": "0"
        }
      ]
    },
    {
      "prim": "Pair",
      "args": [
        {
          "prim": "Pair",
          "args": [
            {
              "int": "0"
            },
            {
              "int": "33247881732435488"
            }
          ]
        },
        {
          "int": "1"
        },
        {
          "string": "KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY"
        },
        {
          "prim": "True"
        }
      ]
    },
    {
      "prim": "Pair",
      "args": [
        {
          "int": "0"
        },
        {
          "int": "2"
        }
      ]
    },
    {
      "int": "85822482565"
    },
    {
      "int": "1000000"
    },
    {
      "prim": "None"
    }
  ]
}

export const volatileSwapStorageType : any = {
  "prim": "Pair",
  "args": [
    {
      "prim": "Pair",
      "args": [
        {
          "prim": "Pair",
          "args": [
            {
              "prim": "Pair",
              "args": [
                {
                  "string": "tz1NbDzUQCcV2kp3wxdVHVSZEDeq2h97mweW"
                },
                {
                  "int": "290"
                }
              ]
            },
            {
              "string": "KT1XpLzv4tqqsf2aLneDZgEeNFhKkH8JBGXv"
            },
            {
              "int": "40"
            }
          ]
        },
        {
          "prim": "Pair",
          "args": [
            {
              "prim": "False"
            },
            {
              "prim": "False"
            }
          ]
        },
        {
          "string": "KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY"
        },
        {
          "prim": "True"
        },
        {
          "int": "2"
        }
      ]
    },
    {
      "prim": "Pair",
      "args": [
        {
          "prim": "Pair",
          "args": [
            {
              "int": "0"
            },
            {
              "int": "31474281515"
            }
          ]
        },
        {
          "string": "KT1SjXiUX63QvdNMcM2m492f7kuf8JxXRLp4"
        },
        {
          "prim": "False"
        }
      ]
    },
    {
      "prim": "Pair",
      "args": [
        {
          "int": "0"
        },
        {
          "int": "0"
        }
      ]
    },
    {
      "int": "16501150538"
    },
    {
      "int": "22262435093"
    },
    {
      "prim": "None"
    }
  ]
}