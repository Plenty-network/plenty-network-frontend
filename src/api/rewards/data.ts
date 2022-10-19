export const gaugeStorageType: any = {
  prim: "pair",
  args: [
    {
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
                      prim: "nat",
                    },
                  ],
                  annots: ["%attached_tokens"],
                },
                {
                  prim: "big_map",
                  args: [
                    {
                      prim: "address",
                    },
                    {
                      prim: "nat",
                    },
                  ],
                  annots: ["%balances"],
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
                      prim: "address",
                    },
                    {
                      prim: "nat",
                    },
                  ],
                  annots: ["%derived_balances"],
                },
                {
                  prim: "nat",
                  annots: ["%derived_supply"],
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
                  prim: "nat",
                  annots: ["%last_update_time"],
                },
                {
                  prim: "address",
                  annots: ["%lp_token_address"],
                },
              ],
            },
            {
              prim: "pair",
              args: [
                {
                  prim: "nat",
                  annots: ["%period_finish"],
                },
                {
                  prim: "address",
                  annots: ["%ply_address"],
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
              prim: "pair",
              args: [
                {
                  prim: "big_map",
                  args: [
                    {
                      prim: "nat",
                    },
                    {
                      prim: "unit",
                    },
                  ],
                  annots: ["%recharge_ledger"],
                },
                {
                  prim: "nat",
                  annots: ["%reward_per_token"],
                },
              ],
            },
            {
              prim: "pair",
              args: [
                {
                  prim: "nat",
                  annots: ["%reward_rate"],
                },
                {
                  prim: "big_map",
                  args: [
                    {
                      prim: "address",
                    },
                    {
                      prim: "nat",
                    },
                  ],
                  annots: ["%rewards"],
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
                  prim: "nat",
                  annots: ["%total_supply"],
                },
                {
                  prim: "big_map",
                  args: [
                    {
                      prim: "address",
                    },
                    {
                      prim: "nat",
                    },
                  ],
                  annots: ["%user_reward_per_token_debt"],
                },
              ],
            },
            {
              prim: "pair",
              args: [
                {
                  prim: "address",
                  annots: ["%ve_address"],
                },
                {
                  prim: "address",
                  annots: ["%voter"],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
