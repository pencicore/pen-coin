import './App.css'
import './Common.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Place from "./components/Place.jsx";
import MenuButton from "./components/MenuButton.jsx";
import LoginButton from "./components/LoginButton.jsx";
import HomeGuide from "./pages/HomeGuide.jsx";
function App() {

  return (
      <BrowserRouter>
        <div className="App">
          <div className="Menu">
              <MenuButton name={"home"} url={"/"}></MenuButton>
              <MenuButton name={"page1"} url={"/page1"}></MenuButton>
              <MenuButton name={"page2"} url={"/page2"}></MenuButton>
          </div>
            <div className="Header">
                <LoginButton name={"login"} handleClick={()=>{alert("click login")}}></LoginButton>
            </div>
            <div className="Main">
                <Routes>
                    <Route path="/" element={<HomeGuide />} />
                    <Route path="/page1" element={<Place name={"page1"} />} />
                    <Route path="/page2" element={<Place name={"page2"} />} />
                </Routes>
            </div>
        </div>
      </BrowserRouter>
  )
}

export default App
