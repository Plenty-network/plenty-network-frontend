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

export const voteEscrowStorageType = {
  // TODO : Add VE Storage
}
