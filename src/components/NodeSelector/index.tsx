import clsx from "clsx";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Image from "next/image";
import violetNode from "../../../src/assets/icon/common/violetNode.svg";
import greyNode from "../../../src/assets/icon/common/greyNode.svg";
import Button from "../Button/Button";
import { PopUpModal } from "../Modal/popupModal";
import { RPC_NODE } from "../../constants/localStorage";
import { connect } from "react-redux";
import { setRpcNode } from "../../redux/userSettings/rpcData";

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
  // const LOCAL_RPC_NODES: {
  //   [id: string]: string;
  // } = {
  //   PLENTY: "https://mifx20dfsr.windmill.tools/",
  //   GIGANODE: "https://mainnet-tezos.giganode.io/",
  //   CRYPTONOMIC: "https://tezos-prod.cryptonomic-infra.tech/",
  // };
  const LOCAL_RPC_NODES: {
    [id: string]: string;
  } = {
    TZKT: "https://rpc.tzkt.io/ghostnet/",
    SmartPY: "https://ghostnet.smartpy.io/",
  };
  // const nodeNames = {
  //   PLENTY: 'Plenty node',
  //   GIGANODE: 'Giganode',
  //   CRYPTONOMIC: 'Cryptonomic',
  // };
  const nodeNames = {
    TZKT: "TZKT",
    SmartPY: "SmartPY",
  };

  const [rpcNodeDetecting, setRpcNodeDetecting] = useState(false);
  const setRPCRunning = useRef(false);

  const closeModal = () => {
    props.setShow(false);
  };
  const [currentRPC, setCurrentRPC] = useState("");
  const [customRPC, setCustomRPC] = useState("");

  useEffect(() => {
    if (props.show && !setRPCRunning.current) {
      rpcNodeDetect();
    }
  }, [props.show]);
  useEffect(() => {
    if (currentRPC !== "") {
      setErrorMessage("");
    }
  }, [currentRPC]);
  const rpcNodeDetect = async () => {
    setRpcNodeDetecting(true);
    let RPCNodeInLS = props.rpcNode;

    if (!RPCNodeInLS) {
      handleInput("");

      props.setRpcNode(LOCAL_RPC_NODES["TZKT"]);
      setCurrentRPC(LOCAL_RPC_NODES["TZKT"]);
      RPCNodeInLS = LOCAL_RPC_NODES["TZKT"];
    }

    const valid = await isValidURL(RPCNodeInLS);
    if (!valid) {
      handleInput("");
      localStorage.setItem(RPC_NODE, LOCAL_RPC_NODES["SmartPY"]);
      props.setRpcNode(LOCAL_RPC_NODES["SmartPY"]);
      setCurrentRPC("SmartPY");
      setRpcNodeDetecting(false);
      return;
    }

    const matchedNode = Object.keys(LOCAL_RPC_NODES).find(
      (key) => LOCAL_RPC_NODES[key] === RPCNodeInLS
    );

    if (!matchedNode) {
      setCurrentRPC("CUSTOM");
      setCustomRPC(RPCNodeInLS);
      setRpcNodeDetecting(false);
      return;
    }
    setRpcNodeDetecting(false);
    setCurrentRPC(matchedNode);
  };

  const handleInput = (input: string) => {
    setCustomRPC(input);
  };
  const [errorMessage, setErrorMessage] = useState("");

  const setRPCInLS = async () => {
    setRPCRunning.current = true;
    if (currentRPC !== "CUSTOM") {
      handleInput("");
      setErrorMessage("");
      props.setRpcNode(LOCAL_RPC_NODES[currentRPC]);
      props.setShow(false);
    } else {
      let _customRPC = customRPC;
      if (!_customRPC.match(/\/$/)) {
        _customRPC += "/";
      }
      const response = await isValidURL(_customRPC);
      console.log(response);
      if (!response) {
        handleInput("");
        setErrorMessage("Please enter valid rpc");
      } else {
        setErrorMessage("");
        props.setRpcNode(_customRPC);
        props.setShow(false);
      }
    }
    // if (errorMessage === "") {

    //}
  };
  function Options(props: { currentRPC: string; identifier: string }) {
    return (
      <div
        onClick={() => setCurrentRPC(props.identifier)}
        className={clsx(
          "  px-4 border  flex items-center h-[54px] z-10 cursor-pointer font-body4 rounded-2xl mt-4 ",
          props.currentRPC === props.identifier
            ? "bg-muted-500 border-primary-500  text-primary-500"
            : "text-text-700 bg-card-500 border-text-800"
        )}
      >
        {props.currentRPC === props.identifier ? (
          <Image src={violetNode} height={"20px"} width={"20px"} />
        ) : (
          <Image src={greyNode} height={"20px"} width={"20px"} />
        )}
        <span className="ml-4">{props.identifier}</span>
      </div>
    );
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
            {Object.entries(nodeNames).map(([identifier, name]) => (
              <Options key={identifier} currentRPC={currentRPC} identifier={identifier} />
            ))}
            <div className="flex gap-[15px]">
              <div
                className={clsx(
                  " justify-center border  flex items-center h-[54px] w-[54px] z-10 cursor-pointer font-body4 rounded-2xl mt-4 ",
                  currentRPC === "CUSTOM"
                    ? "bg-muted-500 border-primary-500  text-primary-500"
                    : "text-text-700 bg-card-500 border-text-800"
                )}
                onClick={() => {
                  setCurrentRPC("CUSTOM");
                }}
              >
                {" "}
                {currentRPC === "CUSTOM" ? (
                  <Image src={violetNode} height={"20px"} width={"20px"} />
                ) : (
                  <Image src={greyNode} height={"20px"} width={"20px"} />
                )}
              </div>
              <div
                className={clsx(
                  "  px-4 border  flex items-center h-[54px] z-10 w-[343px] cursor-pointer font-body4 rounded-2xl mt-4 ",
                  currentRPC === "CUSTOM"
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
                    handleInput(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="text-error-500 font-body1 pl-20 mt-1">{errorMessage}</div>
          </div>
          <div className="mt-[18px]">
            <Button color={rpcNodeDetecting ? "disabled" : "primary"} onClick={setRPCInLS}>
              {"Set Node"}
            </Button>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

const mapStateToProps = (state: { rpcData: { rpcNode: any } }) => ({
  rpcNode: state.rpcData.rpcNode,
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
