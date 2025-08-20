import './App.css'
import './Common.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuButton from "./components/MenuButton.jsx";
import LoginButton from "./components/LoginButton.jsx";
import HomeGuide from "./pages/home_guide/HomeGuide.jsx";
import HomeCheckin from "./pages/home_checkin/HomeCheckin.jsx";
import Wheel from "./pages/wheel/Wheel.jsx";
import Auction from "./pages/auction/Auction.jsx";
import NftTrade from "./pages/nft/NftTrade.jsx";
import User from "./pages/user/User.jsx";
import Trade from "./pages/trade/Trade.jsx";
import {useState} from "react";
import ScreenWindow, {FullWindowController} from "./containers/ScreenWindow.jsx";
import Place from "./components/Place.jsx";
import Login from "./pages/login/Login.jsx";

function App() {

    const [login, setLogin] = useState(false)

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
                  <LoginButton name={"LOGIN"} handleClick={()=>{FullWindowController.open(<Login></Login>)}}></LoginButton>
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
      </BrowserRouter>
  )
}

export default App
