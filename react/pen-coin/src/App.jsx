import './App.css'
import './Common.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuButton from "./components/MenuButton.jsx";
import LoginButton from "./components/LoginButton.jsx";
import HomeGuide from "./pages/guide/HomeGuide.jsx";
import HomeCheckin from "./pages/checkin/HomeCheckin.jsx";
import Wheel from "./pages/wheel/Wheel.jsx";
import Auction from "./pages/auction/Auction.jsx";
import NftTrade from "./pages/nft/NftTrade.jsx";
import User from "./pages/user/User.jsx";
import Trade from "./pages/trade/Trade.jsx";
import ScreenWindow, {FullWindowController} from "./containers/ScreenWindow.jsx";
import Login from "./pages/login/Login.jsx";
import {ToastContainer} from "react-toastify";
import userStore from "./store/userStore.js";
import HeaderInfo from "./components/HeaderInfo.jsx";
import {useEffect} from "react";
import maskUtil from "./utils/maskUtil.js";
import Logout from "./pages/logout/Logout.jsx";
import erc20ContractApi from "./api/erc20ContractApi.js";
import nftContractApi from "./api/nftContractApi.js";
import {ContractAddressConfig} from "./config/contractAddressConfig.js";
import swapContractApi from "./api/swapContractApi.js";
import tradeStore from "./store/tradeStore.js";
import {ethers} from "ethers";

function App() {

    const {setPricePEN, setPriceETH} = tradeStore()
    const {login, setLogin, setAddress, setEthCount, setPenCount, playCount, setNftPenCount, setPenTradeCount} = userStore()

    useEffect(() => {
        async function fun() {
            if(!await maskUtil.isEmpty()){
                setLogin(true)
            }
        }
        fun().then()
    }, []);

    useEffect(() => {
        async function fun() {
            if (!login) return
            const address = await maskUtil.getAddress()
            setAddress(address)
            setEthCount((await maskUtil.getBalance()))
            setPenCount((await erc20ContractApi.balanceOf(address)))
            setNftPenCount(await nftContractApi.balanceOf(address))
            setPenTradeCount(await erc20ContractApi.allowance(address, ContractAddressConfig.ERC721))
            swapContractApi.getPENPriceInETH().then(price => {
                setPricePEN(ethers.formatUnits(price, 18))
            })
            swapContractApi.getETHPriceInPEN().then(price => {
                setPriceETH(ethers.formatUnits(price, 18))
            })
            console.log("登录成功", address)
        }
        fun().then()
    }, [login, playCount]);

  return (
      <BrowserRouter>
          <div className="App">
              <div className="Menu">
                  <MenuButton name={"home"} url={"/"}></MenuButton>
                  <MenuButton name={"guide"} url={"/guide"}></MenuButton>
                  <MenuButton name={"wheel"} url={"/wheel"}></MenuButton>
                  <MenuButton name={"Auction"} url={"/Auction"}></MenuButton>
                  <MenuButton name={"NFT"} url={"/NFT"}></MenuButton>
                  <MenuButton name={"User"} url={"/User"}></MenuButton>
                  <MenuButton name={"Trade"} url={"/trade"}></MenuButton>
              </div>
              <div className="Header">
                  {!login && <LoginButton name={"LOGIN"} handleClick={()=>{FullWindowController.open("login", <Login></Login>)}}></LoginButton>}
                  {login && <HeaderInfo handleClick={()=>{FullWindowController.open("logout", <Logout></Logout>)}}></HeaderInfo>}
              </div>
              <div className="Main">
                <Routes>
                    <Route path="/" element={<HomeCheckin />} />
                    <Route path="/guide" element={<HomeGuide />} />
                    <Route path="/wheel" element={<Wheel />} />
                    <Route path="/Auction" element={<Auction />} />
                    <Route path="/NFT" element={<NftTrade />} />
                    <Route path="/User" element={<User />} />
                    <Route path="/Trade" element={<Trade />} />
                </Routes>
              </div>
          </div>
          <ScreenWindow></ScreenWindow>
          <ToastContainer />
      </BrowserRouter>
  )
}

export default App
