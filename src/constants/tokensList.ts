import ctez from "../assets/Tokens/ctez.png";
import ETHtz from "../assets/Tokens/ethtz.png";
import gif from "../assets/Tokens/gif-dao-token.png";
import hDAO from "../assets/Tokens/hdao.png";
import KALAM from "../assets/Tokens/kalam.png";
import kusd from "../assets/Tokens/kusd.png";
import plenty from "../assets/Tokens/plenty.png";
import QUIPU from "../assets/Tokens/quipu.png";
import SMAK from "../assets/Tokens/smak-swap.png";
import usdtz from "../assets/Tokens/usdtz.png";
import tzBTC from "../assets/Tokens/tzbtc-swap.png";
import wbusd from "../assets/Tokens/wBUSD.png";
import wDAI from "../assets/Tokens/wdai.png";
import wlink from "../assets/Tokens/wlink.png";
import wmatic from "../assets/Tokens/wmatic.png";
import WRAP from "../assets/Tokens/wrap.png";
import wusdc from "../assets/Tokens/wusdc.png";
import wUSDT from "../assets/Tokens/wUSDT.png";
import wwbtc from "../assets/Tokens/wwbtc.png";
import wWETH from "../assets/Tokens/wweth.png";
import uDEFI from "../assets/Tokens/uDEFI.png";
import UNO from "../assets/Tokens/uno.png";
import uUSD from "../assets/Tokens/uUSD.png";
import youGov from "../assets/Tokens/you-gov.png";
import CRUNCH from "../assets/Tokens/CRUNCH.png";
import crDAO from "../assets/Tokens/crDAO.png";
import FLAME from "../assets/Tokens/FLAME.png";
import INSTA from "../assets/Tokens/INSTA.png";
import kDAO from "../assets/Tokens/kDAO.png";
import PXL from "../assets/Tokens/PXL.png";
import PAUL from "../assets/Tokens/PAUL.png";
import tez from "../assets/Tokens/tez.png";
import doga from "../assets/Tokens/doga.png";
import usdce from "../assets/Tokens/usdce.png";
import wbtce from "../assets/Tokens/wbtce.png";
import weth_normal from "../assets/Tokens/weth_icon.svg";
import dai_normal from "../assets/Tokens/dai_icon.svg";
import link_normal from "../assets/Tokens/link_icon.svg";
import matic_normal from "../assets/Tokens/matic_icon.svg";
import busd_normal from "../assets/Tokens/busd_icon.svg";
import usdt_normal from "../assets/Tokens/usdt_icon.svg";
import ageure from "../assets/Tokens/ageure.png";
import eurl from "../assets/Tokens/eurl.png";
import usdt from "../assets/Tokens/usdt.png";
import xtz from "../assets/Tokens/XTZ.png";
import ply from "../assets/Tokens/ply.png";
import sirs from "../assets/Tokens/SIRS.png";
import up from "../assets/Tokens/UP.png";
import { StaticImageData } from "next/image";
export const tokensList = [
  {
    name: "WBTC.e",
    image: wbtce,
    new: true,
    chainType: "ETHEREUM",
    address: "KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY",
  },
  {
    name: "USDC.e",
    image: usdce,
    new: true,
    chainType: "ETHEREUM",
    address: "KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY",
  },
  {
    name: "DAI.e",
    image: dai_normal,
    new: true,
    chainType: "ETHEREUM",
    address: "KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY",
  },
  {
    name: "WETH.e",
    image: weth_normal,
    new: true,
    chainType: "ETHEREUM",
    address: "KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY",
  },
  {
    name: "LINK.e",
    image: link_normal,
    new: true,
    chainType: "ETHEREUM",
    address: "KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY",
  },
  {
    name: "MATIC.e",
    image: matic_normal,
    new: true,
    chainType: "ETHEREUM",
    address: "KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY",
  },
  {
    name: "BUSD.e",
    image: busd_normal,
    new: true,
    chainType: "ETHEREUM",
    address: "KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY",
  },
  {
    name: "USDT.e",
    image: usdt_normal,
    new: true,
    chainType: "ETHEREUM",
    address: "KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY",
  },
  {
    name: "DOGA",
    image: doga,
    new: false,
    chainType: "TEZOS",
    address: "KT1Ha4yFVeyzw6KRAdkzq6TxDHB97KG4pZe8",
  },
  {
    name: "CRUNCH",
    image: CRUNCH,
    new: false,
    chainType: "TEZOS",
    address: "KT1BHCumksALJQJ8q8to2EPigPW6qpyTr7Ng",
  },
  {
    name: "crDAO",
    image: crDAO,
    new: false,
    chainType: "TEZOS",
    address: "KT1XPFjZqCULSnqfKaaYy8hJjeY63UNSGwXg",
  },
  {
    name: "tez",
    image: tez,
    new: false,
    chainType: "TEZOS",
    address: "",
  },
  {
    name: "ctez",
    image: ctez,
    new: false,
    chainType: "TEZOS",
    extra: {
      text: "Get ctez",
      link: "https://ctez.app",
    },
    address: "KT1SjXiUX63QvdNMcM2m492f7kuf8JxXRLp4",
  },
  {
    name: "ETHtz",
    image: ETHtz,
    new: false,
    chainType: "TEZOS",
    address: "KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8",
  },
  {
    name: "FLAME",
    image: FLAME,
    new: false,
    chainType: "TEZOS",
    address: "KT1Wa8yqRBpFCusJWgcQyjhRz7hUQAmFxW7j",
  },
  {
    name: "GIF",
    image: gif,
    new: false,
    chainType: "TEZOS",
    address: "KT1XTxpQvo7oRCqp85LikEZgAZ22uDxhbWJv",
  },
  {
    name: "INSTA",
    image: INSTA,
    new: false,
    chainType: "TEZOS",
    address: "KT19y6R8x53uDKiM46ahgguS6Tjqhdj2rSzZ",
  },
  {
    name: "hDAO",
    image: hDAO,
    new: false,
    chainType: "TEZOS",
    address: "KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW",
  },
  {
    name: "KALAM",
    image: KALAM,
    new: false,
    chainType: "TEZOS",
    address: "KT1A5P4ejnLix13jtadsfV9GCnXLMNnab8UT",
  },
  {
    name: "kDAO",
    image: kDAO,
    new: false,
    chainType: "TEZOS",
    address: "KT1JkoE42rrMBP9b2oDhbx6EUr26GcySZMUH",
  },
  {
    name: "kUSD",
    image: kusd,
    new: false,
    chainType: "TEZOS",
    address: "KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV",
  },
  {
    name: "PAUL",
    image: PAUL,
    new: false,
    chainType: "TEZOS",
    address: "KT19DUSZw7mfeEATrbWVPHRrWNVbNnmfFAE6",
  },
  {
    name: "PLENTY",
    image: plenty,
    new: false,
    chainType: "TEZOS",
    address: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
  },
  {
    name: "PXL",
    image: PXL,
    new: false,
    chainType: "TEZOS",
    address: "KT1F1mn2jbqQCJcsNgYKVAQjvenecNMY2oPK",
  },
  {
    name: "QUIPU",
    image: QUIPU,
    new: false,
    chainType: "TEZOS",
    address: "KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb",
  },
  {
    name: "SMAK",
    image: SMAK,
    new: false,
    chainType: "TEZOS",
    address: "KT1TwzD6zV3WeJ39ukuqxcfK2fJCnhvrdN1X",
  },
  {
    name: "USDtz",
    image: usdtz,
    new: false,
    chainType: "TEZOS",
    address: "KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9",
  },
  {
    name: "tzBTC",
    image: tzBTC,
    new: false,
    chainType: "TEZOS",
    address: "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
  },

  {
    name: "WRAP",
    image: WRAP,
    new: false,
    chainType: "TEZOS",
    address: "KT1LRboPna9yQY9BrjtQYDS1DVxhKESK4VVd",
  },

  {
    name: "uDEFI",
    image: uDEFI,
    new: false,
    chainType: "TEZOS",
    extra: {
      text: "Get uDEFI",
      link: "https://app.youves.com/udefi/minting/start",
    },
    address: "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW",
  },
  {
    name: "UNO",
    image: UNO,
    new: false,
    chainType: "TEZOS",
    address: "KT1ErKVqEhG9jxXgUG2KGLW3bNM7zXHX8SDF",
  },
  {
    name: "uUSD",
    image: uUSD,
    new: false,
    chainType: "TEZOS",
    address: "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW",
  },
  {
    name: "YOU",
    image: youGov,
    new: false,
    chainType: "TEZOS",
    address: "KT1Xobej4mc6XgEjDoJoHtTKgbD1ELMvcQuL",
  },
  // {
  //   name: 'USDt',
  //   image: usdt,
  //   new: true,
  // chainType : 'TEZOS'
  // },
  // {
  //   name: 'EURL',
  //   image: eurl,
  //   new: true,
  // chainType : 'TEZOS'
  // },
  // {
  //   name: 'agEUR.e',
  //   image: ageure,
  //   new: true,
  // chainType : 'ETHEREUM'
  // },
];

export const tokenIcons: { [token: string]: StaticImageData } = {
  "WBTC.e": wbtce,
  "USDC.e": usdce,
  "DAI.e": dai_normal,
  "WETH.e": weth_normal,
  "LINK.e": link_normal,
  "MATIC.e": matic_normal,
  "BUSD.e": busd_normal,
  "USDT.e": usdt_normal,
  DOGA: doga,
  XTZ: xtz,
  TEZ: xtz,
  CTEZ: ctez,
  CTez: ctez,
  ETHtz: ETHtz,
  PLENTY: plenty,
  USDtz: usdtz,
  tzBTC: tzBTC,
  WRAP: WRAP,
  PLY: ply,
  kUSD: kusd,
  SIRS: sirs,
  UP: up,
};
