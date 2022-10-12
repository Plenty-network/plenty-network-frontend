import HeadInfo from "../HeadInfo";
import { BribesMainProps } from "./types";

import { useEffect, useState, useRef } from "react";
import { CardHeader } from "../Pools/Cardheader";
import { BribesCardHeader, BribesHeader } from "./BribesHeader";
import { IAllLocksPositionData } from "../../api/portfolio/types";
import { getAllLocksPositionData } from "../../api/portfolio/locks";
import { store } from "../../redux";
import { PoolsTableBribes } from "./PoolsTableBribes";
import AddBribes from "./AddBribes";
import { tokenParameter } from "../../constants/swap";
import { MyBribesTableBribes } from "./MyBribes";
import { SideBarHOC } from "../Sidebar/SideBarHOC";

function BribesMain() {
  const [searchValue, setSearchValue] = useState("");
  const [bribeToken, setBribeToken] = useState({} as tokenParameter);
  const [bribeInputValue, setBribeInputValue] = useState("");
  const [showAddBribes, setShowAddBribes] = useState(false);
  const [locksPosition, setLocksPosition] = useState<{
    data: IAllLocksPositionData[];
    isfetched: boolean;
  }>({ data: [] as IAllLocksPositionData[], isfetched: false });
  const [activeStateTab, setActiveStateTab] = useState<BribesCardHeader | string>(
    BribesCardHeader.Pools
  );
  const userAddress = store.getState().wallet.address;
  useEffect(() => {
    getAllLocksPositionData(userAddress).then((res) => {
      console.log(res);
      setLocksPosition({ data: res.allLocksData.reverse(), isfetched: true });
    });
  }, [userAddress]);

  return (
    <SideBarHOC isBribes={true} makeTopBarScroll>
      <div>
        <HeadInfo
          className="px-2 md:px-5"
          title="Bribes"
          toolTipContent=""
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <BribesHeader
          activeStateTab={activeStateTab}
          setActiveStateTab={setActiveStateTab}
          className="md:px-3"
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        {activeStateTab === BribesCardHeader.Pools && (
          <PoolsTableBribes
            className="md:px-5 md:py-4   py-4"
            locksPosition={locksPosition.data}
            isfetched={locksPosition.isfetched}
            setShowAddBribes={setShowAddBribes}
          />
        )}
        {activeStateTab === BribesCardHeader.Mybribes && (
          <MyBribesTableBribes
            className="md:px-5 md:py-4   py-4"
            locksPosition={locksPosition.data}
            isfetched={locksPosition.isfetched}
            setShowAddBribes={setShowAddBribes}
          />
        )}
        {showAddBribes && (
          <AddBribes
            show={showAddBribes}
            setShow={setShowAddBribes}
            setBribeInputValue={setBribeInputValue}
            bribeInputValue={bribeInputValue}
            setBribeToken={setBribeToken}
            bribeToken={bribeToken}
          />
        )}
      </div>
    </SideBarHOC>
  );
}

export default BribesMain;
