import { store } from "../../redux";
import bribes from "../../assets/icon/bribes/bribesLanding.svg";
import Image from "next/image";
import Button from "../Button/Button";
import { SideBarHOC } from "../Sidebar/SideBarHOC";
import Link from "next/link";
export interface ILanding {
  setBribesMain: React.Dispatch<React.SetStateAction<boolean>>;
}
function Landing(props: ILanding) {
  const userAddress = store.getState().wallet.address;

  return (
    <SideBarHOC isBribesLanding={true} isBribes={true} makeTopBarScroll>
      <div className="md:flex px-5 mt-10 items-center justify-center">
        <div className="md:max-w-[557px] ">
          <div className="font-big1 md:font-big  text-secondary-200">
            Boost your Token Liquidity
          </div>
          <div className="font-subtitle5  md:font-title-f20 text-text-50 mt-4">
            Bribe the voters and incentivise them to direct liquidity to your token pools.
          </div>
          <div className="mt-5 md:mt-[40px] md:w-[350px]">
            <Link href={"/bribes/dapp"}>
              <Button color={"primary"}>Enter dapp</Button>
            </Link>
          </div>
        </div>
        <div className="mt-10 md:mt-0 md:ml-5">
          <Image src={bribes} />
        </div>
      </div>
    </SideBarHOC>
  );
}

export default Landing;
