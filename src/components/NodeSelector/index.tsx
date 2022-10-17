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
import { setRpcNode } from "../../redux/userSettings/rpcNode";
import { store } from "../../redux";

export enum NODES {
  PLENTY = "Plenty node",
  GIGANODE = "Giganode",
  CRYPTOMIC = "Cryptonomic",
  CUSTOM = "",
}
export enum NODENAME {
  "PLENTY",
  "GIGANODE",
  "CRYPTOMIC",
  "CUSTOM",
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
  const Nodes = [
    { text: NODES.PLENTY, url: "https://mifx20dfsr.windmill.tools/", name: "PLENTY" },
    { text: NODES.GIGANODE, url: "https://mainnet-tezos.giganode.io/", name: "GIGANODE" },
    { text: NODES.CRYPTOMIC, url: "https://tezos-prod.cryptonomic-infra.tech/", name: "CRYPTOMIC" },
    { text: NODES.CUSTOM, url: "", name: "CUSTOM" },
  ];

  useEffect(() => {
    console.log(localStorage.getItem(RPC_NODE), props.rpcNode);
    var d = Nodes.find((e) => e.url === localStorage.getItem(RPC_NODE));
    d && setSelectedNode(d);
  }, [localStorage.getItem(RPC_NODE), props.rpcNode]);
  const [selectedNode, setSelectedNode] = useState(Nodes[0]);
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
      if (value === RPCNodeInLS) {
        matchedNode = RPCNodeInLS;
      }
    }

    if (matchedNode === "") {
      setCurrentRPC("CUSTOM");
      setCustomRPC(RPCNodeInLS);
      return;
    }

    setCurrentRPC(matchedNode);
  };
  const handleInput = (input: string) => {
    setCustomRPC(input);
  };
  const [errorMessage, setErrorMessage] = useState("");
  const setRPCInLS = async () => {
    if (currentRPC !== "CUSTOM") {
      const s = selectedNode.name;
      localStorage.setItem(RPC_NODE, selectedNode.url);
      props.setRpcNode(selectedNode.url);
    } else {
      let _customRPC = customRPC;
      if (!_customRPC.match(/\/$/)) {
        _customRPC += "/";
      }
      const response = await isValidURL(_customRPC);

      if (!response) {
        setErrorMessage("Invalid rpc");
        console.log("invalid url");
      } else {
        setErrorMessage("");
        localStorage.setItem(RPC_NODE, _customRPC);
        props.setRpcNode(_customRPC);
        // props.closeNodeSelectorModal(_customRPC);
      }
    }
    if (errorMessage !== "") {
      props.setShow(false);
    }
  };
  function Options(props: {
    onClick: Function;
    nodes: {
      text: NODES;
      url: string;
      name: string;
    };
  }) {
    if (props.nodes.text === NODES.CUSTOM) {
      return (
        <div className="flex gap-[15px]">
          <div
            className={clsx(
              " justify-center border  flex items-center h-[54px] w-[54px] z-10 cursor-pointer font-body4 rounded-2xl mt-4 ",
              props.nodes.text.includes(selectedNode.text)
                ? "bg-muted-500 border-primary-500  text-primary-500"
                : "text-text-700 bg-card-500 border-text-800"
            )}
            onClick={() => {
              props.onClick(props.nodes);
            }}
          >
            {" "}
            {props.nodes.text === selectedNode.text ? (
              <Image src={violetNode} height={"20px"} width={"20px"} />
            ) : (
              <Image src={greyNode} height={"20px"} width={"20px"} />
            )}
          </div>
          <div
            className={clsx(
              "  px-4 border  flex items-center h-[54px] z-10 w-[343px] cursor-pointer font-body4 rounded-2xl mt-4 ",
              errorMessage !== ""
                ? "bg-error-500"
                : props.nodes.text === selectedNode.text
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
              autoFocus
              value={customRPC}
              onChange={(e) => {
                handleInput(e.target.value);
              }}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div
          onClick={() => {
            props.onClick(props.nodes);
          }}
          className={clsx(
            "  px-4 border  flex items-center h-[54px] z-10 cursor-pointer font-body4 rounded-2xl mt-4 ",
            props.nodes.text === selectedNode.text
              ? "bg-muted-500 border-primary-500  text-primary-500"
              : "text-text-700 bg-card-500 border-text-800"
          )}
        >
          {props.nodes.text === selectedNode.text ? (
            <Image src={violetNode} height={"20px"} width={"20px"} />
          ) : (
            <Image src={greyNode} height={"20px"} width={"20px"} />
          )}
          <span className="ml-4">{props.nodes.text}</span>
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
              <Options onClick={setSelectedNode} key={`${text}_${i}`} nodes={text} />
            ))}
          </div>
          <div className="mt-[18px]">
            <Button color={"primary"} onClick={setRPCInLS}>
              Set Node
            </Button>
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
  setShow: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeSelector);
