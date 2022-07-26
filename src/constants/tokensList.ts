import ctez from '../assets/Tokens/ctez.png';
import ETHtz from '../assets/Tokens/ethtz.png';
import gif from '../assets/Tokens/gif-dao-token.png';
import hDAO from '../assets/Tokens/hdao.png';
import KALAM from '../assets/Tokens/kalam.png';
import kusd from '../assets/Tokens/kusd.png';
import plenty from '../assets/Tokens/plenty.png';
import QUIPU from '../assets/Tokens/quipu.png';
import SMAK from '../assets/Tokens/smak-swap.png';
import usdtz from '../assets/Tokens/usdtz.png';
import tzBTC from '../assets/Tokens/tzbtc-swap.png';
import wbusd from '../assets/Tokens/wBUSD.png';
import wDAI from '../assets/Tokens/wdai.png';
import wlink from '../assets/Tokens/wlink.png';
import wmatic from '../assets/Tokens/wmatic.png';
import WRAP from '../assets/Tokens/wrap.png';
import wusdc from '../assets/Tokens/wusdc.png';
import wUSDT from '../assets/Tokens/wUSDT.png';
import wwbtc from '../assets/Tokens/wwbtc.png';
import wWETH from '../assets/Tokens/wweth.png';
import uDEFI from '../assets/Tokens/uDEFI.png';
import UNO from '../assets/Tokens/uno.png';
import uUSD from '../assets/Tokens/uUSD.png';
import youGov from '../assets/Tokens/you-gov.png';
import CRUNCH from '../assets/Tokens/CRUNCH.png';
import crDAO from '../assets/Tokens/crDAO.png';
import FLAME from '../assets/Tokens/FLAME.png';
import INSTA from '../assets/Tokens/INSTA.png';
import kDAO from '../assets/Tokens/kDAO.png';
import PXL from '../assets/Tokens/PXL.png';
import PAUL from '../assets/Tokens/PAUL.png';
import tez from '../assets/Tokens/tez.png';
import doga from '../assets/Tokens/doga.png';
import usdce from '../assets/Tokens/usdce.png';
import wbtce from '../assets/Tokens/wbtce.png';
import weth_normal from '../assets/Tokens/weth_icon.svg';
import dai_normal from '../assets/Tokens/dai_icon.svg';
import link_normal from '../assets/Tokens/link_icon.svg';
import matic_normal from '../assets/Tokens/matic_icon.svg';
import busd_normal from '../assets/Tokens/busd_icon.svg';
import usdt_normal from '../assets/Tokens/usdt_icon.svg';
import ageure from '../assets/Tokens/ageure.png';
import eurl from '../assets/Tokens/eurl.png';
import usdt from '../assets/Tokens/usdt.png';
export const tokens = [
  {
    name: 'DOGA',
    image: doga,
    new: true,
    chainType : 'TEZOS'
  },
  {
    name: 'WBTC.e',
    image: wbtce,
    new: true,
    chainType : 'ETHEREUM'
  },
  {
    name: 'USDC.e',
    image: usdce,
    new: true,
    chainType : 'ETHEREUM'
  },
  {
    name: 'DAI.e',
    image: dai_normal,
    new: true,
    chainType : 'ETHEREUM'
  },
  {
    name: 'WETH.e',
    image: weth_normal,
    new: true,
    chainType : 'ETHEREUM'
  },
  {
    name: 'LINK.e',
    image: link_normal,
    new: true,
    chainType : 'ETHEREUM'
  },
  {
    name: 'MATIC.e',
    image: matic_normal,
    new: true,
    chainType : 'ETHEREUM'
  },
  {
    name: 'BUSD.e',
    image: busd_normal,
    new: true,
    chainType : 'ETHEREUM'
  },
  {
    name: 'USDT.e',
    image: usdt_normal,
    new: true,
    chainType : 'ETHEREUM'
  },
  {
    name: 'CRUNCH',
    image: CRUNCH,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'crDAO',
    image: crDAO,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'tez',
    image: tez,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'ctez',
    image: ctez,
    new: false,
    chainType: 'TEZOS',
    extra: {
      text: 'Get ctez',
      link: 'https://ctez.app',
    },
  },
  {
    name: 'ETHtz',
    image: ETHtz,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'FLAME',
    image: FLAME,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'GIF',
    image: gif,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'INSTA',
    image: INSTA,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'hDAO',
    image: hDAO,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'KALAM',
    image: KALAM,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'kDAO',
    image: kDAO,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'kUSD',
    image: kusd,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'PAUL',
    image: PAUL,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'PLENTY',
    image: plenty,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'PXL',
    image: PXL,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'QUIPU',
    image: QUIPU,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'SMAK',
    image: SMAK,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'USDtz',
    image: usdtz,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'tzBTC',
    image: tzBTC,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'wBUSD',
    image: wbusd,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'wDAI',
    image: wDAI,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'wLINK',
    image: wlink,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'wMATIC',
    image: wmatic,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'WRAP',
    image: WRAP,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'wUSDC',
    image: wusdc,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'wUSDT',
    image: wUSDT,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'wWBTC',
    image: wwbtc,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'wWETH',
    image: wWETH,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'uDEFI',
    image: uDEFI,
    new: false,
    chainType: 'TEZOS',
    extra: {
      text: 'Get uDEFI',
      link: 'https://app.youves.com/udefi/minting/start',
    },
  },
  {
    name: 'UNO',
    image: UNO,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'uUSD',
    image: uUSD,
    new: false,
    chainType: 'TEZOS'
  },
  {
    name: 'YOU',
    image: youGov,
    new: false,
    chainType: 'TEZOS'
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
