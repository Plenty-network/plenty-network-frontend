import { store } from "../../redux";
import bribes from "../../assets/icon/bribes/bribesLanding.svg";
import Image from "next/image";
import Button from "../Button/Button";
import { SideBarHOC } from "../Sidebar/SideBarHOC";
export interface ILanding {
  setBribesMain: React.Dispatch<React.SetStateAction<boolean>>;
}
function Landing(props: ILanding) {
  const userAddress = store.getState().wallet.address;

  return (
    <SideBarHOC isBribesLanding={true} isBribes={true} makeTopBarScroll>
      <div className="flex px-5 mt-10 items-center justify-center">
        <div className="max-w-[557px] ">
          <div className="font-big  text-secondary-200">Boost your Token Liquidity</div>
          <div className="font-title-f20 text-text-50 mt-4">
            Bribe the voters and incentivise them to direct liquidity to your token pools.
          </div>
          <div className="mt-[40px] w-[350px]">
            <Button color={"primary"} onClick={() => props.setBribesMain(true)}>
              Enter dapp
            </Button>
          </div>
        </div>
        <div className="ml-5">
          <Image src={bribes} />
        </div>
      </div>
    </SideBarHOC>
  );
}

export default Landing;
