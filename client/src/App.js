import React, {useEffect, useState} from "react";
import './App.css';
import { BrowserRouter,Routes, Route} from 'react-router-dom';
import './component/NavBar';
import 'bootstrap/dist/css/bootstrap.css';
import NavBar from './component/NavBar';
import Main from './page/Main';
import CompletePage from './page/CompletePage';
import ImagePage from './page/ImgPage';
import ManyImagePage from './page/ManyImgPage';
import VideoPage from './page/VideoPage';
import ObjectEdit from './page/ObjectEdit';
import ImgDeepfake from './page/ImgDeepfake';
import VideoDeepfake from './page/VideoDeepfake';
import ManyImgDeepfake from './page/ManyImgDeepfake';
function App() {
  const [data,setData] = useState([]);
  const [item,setItem] = useState([]);
  const getData = (event) => {
     console.log(event);
     setData(event);
  }
  const getItem = (event) => {
    console.log(event);
     setItem(event);
  }
  return (
    <>
      <BrowserRouter>
      <NavBar/>
        <Routes>
          <Route path="/objedit" element={<ObjectEdit getData={data} getItem={item}/>}></Route>
          <Route path="/" element={<Main />}></Route>
          <Route path="/imgpage" element={<ImagePage getData={getData} getItem={getItem}/>}></Route>
          <Route path="/videopage" element={<VideoPage />}></Route>
          <Route path="/manyimage" element={<ManyImagePage />}></Route>
          <Route path="/completepage" element={<CompletePage />}></Route>
          <Route path="/imgdeepfake" element={<ImgDeepfake />}></Route>
          <Route path="/videodeepfake" element={<VideoDeepfake />}></Route>
          <Route path="/manyimgdeepfake" element={<ManyImgDeepfake />}></Route>
          
        </Routes>  
      </BrowserRouter>
    </>
  );
}

export default App;
