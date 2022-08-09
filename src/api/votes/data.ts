export const voterStorageType = {
  prim: "pair",
  args: [
    {
      prim: "pair",
      args: [
        {
          prim: "pair",
          args: [
            {
              prim: "big_map",
              args: [
                {
                  prim: "address",
                },
                {
                  prim: "pair",
                  args: [
                    {
                      prim: "address",
                      annots: ["%gauge"],
                    },
                    {
                      prim: "address",
                      annots: ["%bribe"],
                    },
                  ],
                },
              ],
              annots: ["%amm_to_gauge_bribe"],
            },
            {
              prim: "pair",
              args: [
                {
                  prim: "address",
                  annots: ["%core_factory"],
                },
                {
                  prim: "pair",
                  args: [
                    {
                      prim: "nat",
                      annots: ["%base"],
                    },
                    {
                      prim: "pair",
                      args: [
                        {
                          prim: "nat",
                          annots: ["%genesis"],
                        },
                        {
                          prim: "nat",
                          annots: ["%real"],
                        },
                      ],
                    },
                  ],
                  annots: ["%emission"],
                },
              ],
            },
          ],
        },
        {
          prim: "pair",
          args: [
            {
              prim: "nat",
              annots: ["%epoch"],
            },
            {
              prim: "pair",
              args: [
                {
                  prim: "big_map",
                  args: [
                    {
                      prim: "nat",
                    },
                    {
                      prim: "timestamp",
                    },
                  ],
                  annots: ["%epoch_end"],
                },
                {
                  prim: "address",
                  annots: ["%fee_distributor"],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      prim: "pair",
      args: [
        {
          prim: "pair",
          args: [
            {
              prim: "address",
              annots: ["%ply_address"],
            },
            {
              prim: "pair",
              args: [
                {
                  prim: "big_map",
                  args: [
                    {
                      prim: "pair",
                      args: [
                        {
                          prim: "nat",
                          annots: ["%token_id"],
                        },
                        {
                          prim: "pair",
                          args: [
                            {
                              prim: "address",
                              annots: ["%amm"],
                            },
                            {
                              prim: "nat",
                              annots: ["%epoch"],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      prim: "nat",
                    },
                  ],
                  annots: ["%token_amm_votes"],
                },
                {
                  prim: "big_map",
                  args: [
                    {
                      prim: "pair",
                      args: [
                        {
                          prim: "address",
                          annots: ["%amm"],
                        },
                        {
                          prim: "nat",
                          annots: ["%epoch"],
                        },
                      ],
                    },
                    {
                      prim: "nat",
                    },
                  ],
                  annots: ["%total_amm_votes"],
                },
              ],
            },
          ],
        },
        {
          prim: "pair",
          args: [
            {
              prim: "big_map",
              args: [
                {
                  prim: "nat",
                },
                {
                  prim: "nat",
                },
              ],
              annots: ["%total_epoch_votes"],
            },
            {
              prim: "pair",
              args: [
                {
                  prim: "big_map",
                  args: [
                    {
                      prim: "pair",
                      args: [
                        {
                          prim: "nat",
                          annots: ["%token_id"],
                        },
                        {
                          prim: "nat",
                          annots: ["%epoch"],
                        },
                      ],
                    },
                    {
                      prim: "nat",
                    },
                  ],
                  annots: ["%total_token_votes"],
                },
                {
                  prim: "address",
                  annots: ["%ve_address"],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const voteEscrowStorageType = 
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
              "prim": "pair",
              "args": [
                {
                  "prim": "big_map",
                  "args": [
                    {
                      "prim": "nat"
                    },
                    {
                      "prim": "address"
                    }
                  ],
                  "annots": [
                    "%attached"
                  ]
                },
                {
                  "prim": "address",
                  "annots": [
                    "%base_token"
                  ]
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "big_map",
                  "args": [
                    {
                      "prim": "pair",
                      "args": [
                        {
                          "prim": "nat",
                          "annots": [
                            "%token_id"
                          ]
                        },
                        {
                          "prim": "nat",
                          "annots": [
                            "%epoch"
                          ]
                        }
                      ]
                    },
                    {
                      "prim": "unit"
                    }
                  ],
                  "annots": [
                    "%claim_ledger"
                  ]
                },
                {
                  "prim": "big_map",
                  "args": [
                    {
                      "prim": "nat"
                    },
                    {
                      "prim": "nat"
                    }
                  ],
                  "annots": [
                    "%epoch_inflation"
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
                    "%gc_index"
                  ]
                },
                {
                  "prim": "big_map",
                  "args": [
                    {
                      "prim": "nat"
                    },
                    {
                      "prim": "pair",
                      "args": [
                        {
                          "prim": "nat",
                          "annots": [
                            "%slope"
                          ]
                        },
                        {
                          "prim": "pair",
                          "args": [
                            {
                              "prim": "nat",
                              "annots": [
                                "%bias"
                              ]
                            },
                            {
                              "prim": "nat",
                              "annots": [
                                "%ts"
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  "annots": [
                    "%global_checkpoints"
                  ]
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "big_map",
                  "args": [
                    {
                      "prim": "pair",
                      "args": [
                        {
                          "prim": "address"
                        },
                        {
                          "prim": "nat"
                        }
                      ]
                    },
                    {
                      "prim": "nat"
                    }
                  ],
                  "annots": [
                    "%ledger"
                  ]
                },
                {
                  "prim": "nat",
                  "annots": [
                    "%locked_supply"
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
                  "prim": "big_map",
                  "args": [
                    {
                      "prim": "nat"
                    },
                    {
                      "prim": "pair",
                      "args": [
                        {
                          "prim": "nat",
                          "annots": [
                            "%base_value"
                          ]
                        },
                        {
                          "prim": "nat",
                          "annots": [
                            "%end"
                          ]
                        }
                      ]
                    }
                  ],
                  "annots": [
                    "%locks"
                  ]
                },
                {
                  "prim": "big_map",
                  "args": [
                    {
                      "prim": "nat"
                    },
                    {
                      "prim": "nat"
                    }
                  ],
                  "annots": [
                    "%num_token_checkpoints"
                  ]
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "big_map",
                  "args": [
                    {
                      "prim": "pair",
                      "args": [
                        {
                          "prim": "address",
                          "annots": [
                            "%owner"
                          ]
                        },
                        {
                          "prim": "pair",
                          "args": [
                            {
                              "prim": "address",
                              "annots": [
                                "%operator"
                              ]
                            },
                            {
                              "prim": "nat",
                              "annots": [
                                "%token_id"
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "prim": "unit"
                    }
                  ],
                  "annots": [
                    "%operators"
                  ]
                },
                {
                  "prim": "big_map",
                  "args": [
                    {
                      "prim": "nat"
                    },
                    {
                      "prim": "nat"
                    }
                  ],
                  "annots": [
                    "%slope_changes"
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
                  "prim": "big_map",
                  "args": [
                    {
                      "prim": "pair",
                      "args": [
                        {
                          "prim": "nat"
                        },
                        {
                          "prim": "nat"
                        }
                      ]
                    },
                    {
                      "prim": "pair",
                      "args": [
                        {
                          "prim": "nat",
                          "annots": [
                            "%slope"
                          ]
                        },
                        {
                          "prim": "pair",
                          "args": [
                            {
                              "prim": "nat",
                              "annots": [
                                "%bias"
                              ]
                            },
                            {
                              "prim": "nat",
                              "annots": [
                                "%ts"
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  "annots": [
                    "%token_checkpoints"
                  ]
                },
                {
                  "prim": "big_map",
                  "args": [
                    {
                      "prim": "nat"
                    },
                    {
                      "prim": "pair",
                      "args": [
                        {
                          "prim": "nat",
                          "annots": [
                            "%token_id"
                          ]
                        },
                        {
                          "prim": "map",
                          "args": [
                            {
                              "prim": "string"
                            },
                            {
                              "prim": "bytes"
                            }
                          ],
                          "annots": [
                            "%token_info"
                          ]
                        }
                      ]
                    }
                  ],
                  "annots": [
                    "%token_metadata"
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
                    "%uid"
                  ]
                },
                {
                  "prim": "address",
                  "annots": [
                    "%voter"
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
