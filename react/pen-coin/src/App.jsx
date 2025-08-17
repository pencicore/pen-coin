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
function App() {

  return (
      <BrowserRouter>
        <div className="App">
          <div className="Menu">
              <MenuButton name={"home"} url={"/"}></MenuButton>
              <MenuButton name={"guide"} url={"/guide"}></MenuButton>
              <MenuButton name={"wheel"} url={"/wheel"}></MenuButton>
              <MenuButton name={"Auction"} url={"/Auction"}></MenuButton>
              <MenuButton name={"NFT"} url={"/NFT"}></MenuButton>
          </div>
            <div className="Header">
                <LoginButton name={"login"} handleClick={()=>{alert("click login")}}></LoginButton>
            </div>
            <div className="Main">
                <Routes>
                    <Route path="/" element={<HomeCheckin />} />
                    <Route path="/guide" element={<HomeGuide />} />
                    <Route path="/wheel" element={<Wheel />} />
                    <Route path="/Auction" element={<Auction />} />
                    <Route path="/NFT" element={<NftTrade />} />
                </Routes>
            </div>
        </div>
      </BrowserRouter>
  )
}

export default App
