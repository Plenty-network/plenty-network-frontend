import clsx from "clsx";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Image from "next/image";
import violetNode from "../../../src/assets/icon/common/violetNode.svg";
import greyNode from "../../../src/assets/icon/common/greyNode.svg";
import Button from "../Button/Button";
import { PopUpModal } from "../Modal/popupModal";
import { RPC_NODE } from "../../constants/localStorage";
import { connect } from "react-redux";
import { setRpcNode } from "../../redux/wallet/wallet";

interface INodeSelectorProps {
  show: boolean;
  // content: string;
  setShow: any;
  // onBtnClick: any;
}
export enum NODES {
  PLENTY = "Plenty node",
  GIGANODE = "Giganode",
  CRYPTOMIC = "Cryptonomic",
  CUSTOM = "",
}
export enum NODENAME {
  PLENTY,
  GIGANODE,
  CRYPTOMIC,
  CUSTOM,
}
async function isValidURL(userInput: string) {
  try {
    const response = await axios({
      method: "get",
      baseURL: userInput,
      url: "/chains/main/blocks",
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}
function NodeSelector(props: any) {
  const Nodes = [NODES.PLENTY, NODES.GIGANODE, NODES.CRYPTOMIC, NODES.CUSTOM];
  const [selectedNode, setSelectedNode] = useState(NODES.PLENTY);
  const closeModal = () => {
    props.setShow(false);
  };
  const [currentRPC, setCurrentRPC] = useState("");
  const [customRPC, setCustomRPC] = useState("");

  const LOCAL_RPC_NODES = {
    PLENTY: "https://mifx20dfsr.windmill.tools/",
    GIGANODE: "https://mainnet-tezos.giganode.io/",
    CRYPTONOMIC: "https://tezos-prod.cryptonomic-infra.tech/",
  };

  useEffect(() => {
    rpcNodeDetect();
  }, []);
  const rpcNodeDetect = async () => {
    let RPCNodeInLS = localStorage.getItem(RPC_NODE);

    if (!RPCNodeInLS) {
      localStorage.setItem(RPC_NODE, LOCAL_RPC_NODES["CRYPTONOMIC"]);
      props.setRpcNode(LOCAL_RPC_NODES["CRYPTONOMIC"]);
      setCurrentRPC(LOCAL_RPC_NODES["CRYPTONOMIC"]);
      RPCNodeInLS = LOCAL_RPC_NODES["CRYPTONOMIC"];
    }

    const valid = await isValidURL(RPCNodeInLS);
    if (!valid) {
      localStorage.setItem(RPC_NODE, LOCAL_RPC_NODES["PLENTY"]);
      props.setRpcNode(LOCAL_RPC_NODES["PLENTY"]);
      setCurrentRPC(LOCAL_RPC_NODES["PLENTY"]);
      return;
    }
    var matchedNode = "";
    for (const [key, value] of Object.entries(LOCAL_RPC_NODES)) {
      console.log(`${key}: ${value}`);
      if (value === RPCNodeInLS) {
        matchedNode = RPCNodeInLS;
      }
    }
    // const matchedNode = Object.keys(LOCAL_RPC_NODES).find((value) => {
    //   console.log(value, RPCNodeInLS);
    // });

    if (matchedNode === "") {
      setCurrentRPC("CUSTOM");
      setCustomRPC(RPCNodeInLS);
      return;
    }

    setCurrentRPC(matchedNode);
  };

  // const setRPCInLS = async () => {
  //   if (currentRPC !== "CUSTOM") {
  //     localStorage.setItem(RPC_NODE, LOCAL_RPC_NODES[currentRPC]);
  //     props.setNode(LOCAL_RPC_NODES[currentRPC]);
  //     //props.closeNodeSelectorModal();
  //   } else {
  //     let _customRPC = customRPC;
  //     if (!_customRPC.match(/\/$/)) {
  //       _customRPC += "/";
  //     }
  //     const response = await isValidURL(_customRPC);

  //     if (!response) {
  //       props.setLoaderMessage({ type: "error", message: "Invalid RPC URL" });
  //       setTimeout(() => {
  //         props.setLoaderMessage({});
  //       }, 5000);
  //     } else {
  //       localStorage.setItem(RPC_NODE, _customRPC);
  //       props.setNode(_customRPC);
  //       // props.closeNodeSelectorModal(_customRPC);
  //     }
  //   }
  // };
  function Options(props: { onClick: Function; text: string }) {
    if (props.text === "") {
      return (
        <div
          className="flex gap-[15px]"
          onClick={() => {
            props.onClick(props.text);
          }}
        >
          <div
            className={clsx(
              " justify-center border  flex items-center h-[54px] w-[54px] z-10 cursor-pointer font-body4 rounded-2xl mt-4 ",
              props.text === selectedNode
                ? "bg-muted-500 border-primary-500  text-primary-500"
                : "text-text-700 bg-card-500 border-text-800"
            )}
          >
            {" "}
            {props.text === selectedNode ? (
              <Image src={violetNode} height={"20px"} width={"20px"} />
            ) : (
              <Image src={greyNode} height={"20px"} width={"20px"} />
            )}
          </div>
          <div
            className={clsx(
              "  px-4 border  flex items-center h-[54px] z-10 w-[343px] cursor-pointer font-body4 rounded-2xl mt-4 ",
              props.text === selectedNode
                ? "bg-muted-500 border-primary-500  text-primary-500"
                : "text-text-700 bg-card-500 border-text-800"
            )}
          >
            <input
              type="text"
              className={clsx(
                "text-white bg-card-500/[0.1] text-left border-0 font-body3 outline-none w-[100%] placeholder:text-text-700"
              )}
              placeholder="https://custom.tezos.node"
              value={customRPC}
              onChange={(e) => {
                setCustomRPC(e.target.value);
              }}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div
          onClick={() => {
            props.onClick(props.text);
          }}
          className={clsx(
            "  px-4 border  flex items-center h-[54px] z-10 cursor-pointer font-body4 rounded-2xl mt-4 ",
            props.text === selectedNode
              ? "bg-muted-500 border-primary-500  text-primary-500"
              : "text-text-700 bg-card-500 border-text-800"
          )}
        >
          {props.text === selectedNode ? (
            <Image src={violetNode} height={"20px"} width={"20px"} />
          ) : (
            <Image src={greyNode} height={"20px"} width={"20px"} />
          )}
          <span className="ml-4">{props.text}</span>
        </div>
      );
    }
  }

  return props.show ? (
    <PopUpModal
      title="Node Selector"
      noGlassEffect={true}
      isAnimteToLoader={true}
      onhide={closeModal}
    >
      {
        <>
          <div className=" mt-5 text-text-250 font-body3 px-2 ">
            The Plenty node can be overloaded sometimes. When your data doesn’t load properly, try
            switching to a different node, or use a custom node.
          </div>
          <div className="px-2">
            {Nodes.map((text, i) => (
              <Options onClick={setSelectedNode} key={`${text}_${i}`} text={text} />
            ))}
          </div>
          <div className="mt-[18px]">
            <Button color={"primary"}>Set Node</Button>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

const mapStateToProps = (state: { wallet: { rpcNode: any } }) => ({
  rpcNode: state.wallet.rpcNode,
});

const mapDispatchToProps = (dispatch: (arg0: any) => any) => ({
  setRpcNode: (rpcNode: string) => dispatch(setRpcNode(rpcNode)),
});

NodeSelector.propTypes = {
  rpcNode: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeSelector);
