import { BigNumber } from 'bignumber.js'
import { IConfigLPToken } from '../../config/types';

export interface ISwapDataResponse {
  success: boolean;
  tokenIn: string;
  tokenOut: string;
  exchangeFee: BigNumber;
  lpTokenSupply: BigNumber;
  lpToken: IConfigLPToken | undefined;
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
  userFinalTokenOut ?: BigNumber;
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
  "prim": "pair",
  "args": [
    {
      "prim": "pair",
      "args": [
        {
          "prim": "pair",
          "args": [
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "bool",
                  "annots": [
                    "%Locked"
                  ]
                },
                {
                  "prim": "address",
                  "annots": [
                    "%admin"
                  ]
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "address",
                  "annots": [
                    "%ctezAddress"
                  ]
                },
                {
                  "prim": "nat",
                  "annots": [
                    "%ctezFee"
                  ]
                }
              ]
            }
          ]
        },
        {
          "prim": "pair",
          "args": [
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "nat",
                  "annots": [
                    "%ctezPool"
                  ]
                },
                {
                  "prim": "address",
                  "annots": [
                    "%ctez_admin"
                  ]
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "nat",
                  "annots": [
                    "%lpFee"
                  ]
                },
                {
                  "prim": "pair",
                  "args": [
                    {
                      "prim": "address",
                      "annots": [
                        "%lqtAddress"
                      ]
                    },
                    {
                      "prim": "nat",
                      "annots": [
                        "%lqtTotal"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "prim": "pair",
      "args": [
        {
          "prim": "pair",
          "args": [
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "option",
                  "args": [
                    {
                      "prim": "nat"
                    }
                  ],
                  "annots": [
                    "%minAmount"
                  ]
                },
                {
                  "prim": "bool",
                  "annots": [
                    "%paused"
                  ]
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "option",
                  "args": [
                    {
                      "prim": "address"
                    }
                  ],
                  "annots": [
                    "%recipient"
                  ]
                },
                {
                  "prim": "option",
                  "args": [
                    {
                      "prim": "address"
                    }
                  ],
                  "annots": [
                    "%sender"
                  ]
                }
              ]
            }
          ]
        },
        {
          "prim": "pair",
          "args": [
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "bool",
                  "annots": [
                    "%state"
                  ]
                },
                {
                  "prim": "nat",
                  "annots": [
                    "%tezPool"
                  ]
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "option",
                  "args": [
                    {
                      "prim": "nat"
                    }
                  ],
                  "annots": [
                    "%tradeAmount"
                  ]
                },
                {
                  "prim": "pair",
                  "args": [
                    {
                      "prim": "option",
                      "args": [
                        {
                          "prim": "address"
                        }
                      ],
                      "annots": [
                        "%voterContract"
                      ]
                    },
                    {
                      "prim": "nat",
                      "annots": [
                        "%xtzFee"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

export const stableswapStorageType : any = {
  "prim": "pair",
  "args": [
    {
      "prim": "pair",
      "args": [
        {
          "prim": "pair",
          "args": [
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "address",
                  "annots": [
                    "%admin"
                  ]
                },
                {
                  "prim": "nat",
                  "annots": [
                    "%lpFee"
                  ]
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "address",
                  "annots": [
                    "%lqtAddress"
                  ]
                },
                {
                  "prim": "nat",
                  "annots": [
                    "%lqtTotal"
                  ]
                }
              ]
            }
          ]
        },
        {
          "prim": "pair",
          "args": [
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "bool",
                  "annots": [
                    "%paused"
                  ]
                },
                {
                  "prim": "bool",
                  "annots": [
                    "%state"
                  ]
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "address",
                  "annots": [
                    "%token1Address"
                  ]
                },
                {
                  "prim": "pair",
                  "args": [
                    {
                      "prim": "bool",
                      "annots": [
                        "%token1Check"
                      ]
                    },
                    {
                      "prim": "nat",
                      "annots": [
                        "%token1Fee"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "prim": "pair",
      "args": [
        {
          "prim": "pair",
          "args": [
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "nat",
                  "annots": [
                    "%token1Id"
                  ]
                },
                {
                  "prim": "nat",
                  "annots": [
                    "%token1Pool"
                  ]
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "nat",
                  "annots": [
                    "%token1Precision"
                  ]
                },
                {
                  "prim": "pair",
                  "args": [
                    {
                      "prim": "address",
                      "annots": [
                        "%token2Address"
                      ]
                    },
                    {
                      "prim": "bool",
                      "annots": [
                        "%token2Check"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "prim": "pair",
          "args": [
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "nat",
                  "annots": [
                    "%token2Fee"
                  ]
                },
                {
                  "prim": "nat",
                  "annots": [
                    "%token2Id"
                  ]
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "nat",
                  "annots": [
                    "%token2Pool"
                  ]
                },
                {
                  "prim": "pair",
                  "args": [
                    {
                      "prim": "nat",
                      "annots": [
                        "%token2Precision"
                      ]
                    },
                    {
                      "prim": "option",
                      "args": [
                        {
                          "prim": "address"
                        }
                      ],
                      "annots": [
                        "%voterContract"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

export const volatileSwapStorageType : any = {
  "prim": "pair",
  "args": [
    {
      "prim": "pair",
      "args": [
        {
          "prim": "pair",
          "args": [
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "address",
                  "annots": [
                    "%admin"
                  ]
                },
                {
                  "prim": "nat",
                  "annots": [
                    "%lpFee"
                  ]
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "address",
                  "annots": [
                    "%lpTokenAddress"
                  ]
                },
                {
                  "prim": "nat",
                  "annots": [
                    "%maxSwapLimit"
                  ]
                }
              ]
            }
          ]
        },
        {
          "prim": "pair",
          "args": [
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "bool",
                  "annots": [
                    "%paused"
                  ]
                },
                {
                  "prim": "bool",
                  "annots": [
                    "%state"
                  ]
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "address",
                  "annots": [
                    "%token1Address"
                  ]
                },
                {
                  "prim": "pair",
                  "args": [
                    {
                      "prim": "bool",
                      "annots": [
                        "%token1Check"
                      ]
                    },
                    {
                      "prim": "nat",
                      "annots": [
                        "%token1Id"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "prim": "pair",
      "args": [
        {
          "prim": "pair",
          "args": [
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "nat",
                  "annots": [
                    "%token1_Fee"
                  ]
                },
                {
                  "prim": "nat",
                  "annots": [
                    "%token1_pool"
                  ]
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "address",
                  "annots": [
                    "%token2Address"
                  ]
                },
                {
                  "prim": "bool",
                  "annots": [
                    "%token2Check"
                  ]
                }
              ]
            }
          ]
        },
        {
          "prim": "pair",
          "args": [
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "nat",
                  "annots": [
                    "%token2Id"
                  ]
                },
                {
                  "prim": "nat",
                  "annots": [
                    "%token2_Fee"
                  ]
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "nat",
                  "annots": [
                    "%token2_pool"
                  ]
                },
                {
                  "prim": "pair",
                  "args": [
                    {
                      "prim": "nat",
                      "annots": [
                        "%totalSupply"
                      ]
                    },
                    {
                      "prim": "option",
                      "args": [
                        {
                          "prim": "address"
                        }
                      ],
                      "annots": [
                        "%voterContract"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}