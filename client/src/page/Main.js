import React, {useEffect, useState} from "react";
import styled from "styled-components";
import DragandDrop from "../component/draganddrop/DragandDrop";
import '../page/Main.css';
import Snowfall from 'react-snowfall';

function Main(){
  const [position, setPosition] = useState(0);
  const [coord, setCoord] = useState();
  const [card,setCard] = useState('img/animal.png');
  const [resultcard,setResultCard] = useState('img/animal_result.png');

 

  function change1(){
    setCard('img/car.png');
    setResultCard('img/car_result.png');
  }
  function change2(){
    setCard('img/07.png');
    setResultCard('img/07_result.png');
  }
  function change3(){
    setCard('img/building3.png');
    setResultCard('img/building3_result.png');
  }
  function change4(){
    setCard('img/animal.png');
    setResultCard('img/animal_result.png');
  }
  function change5(){
    setCard('img/dino.png');
    setResultCard('img/dino_result.png');
  }
  function onScroll() {
    setPosition(window.scrollY);
  }
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
  
  }, []);
  
  const handleMouseMove = (event) => {
    let coordnates = event.nativeEvent.offsetX;
    setCoord(coordnates);
  }


  console.log(coord);
  
  return(
    <World>
      <Snowfall
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
        }}
      />
          <MyWorld>
            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'100vh', background:'#F5F5F5'}}>
              <Top style={{display:'flex',justifyContent:'space-between', alignItems:'center', width:'100%', maxWidth:'1000px'}}>
                  <LeftTop style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', marginBottom:'50px'}}>
                    <Cat></Cat><br/><br/>
                    <h1 id="put"style={{fontWeight:700}}>Please put the image<br/> on the screen.</h1>
                  </LeftTop>
                  <RightTop id='mainDrag' style={{display:'flex', flexDirection:'column', alignItems:'center'}}> 
                      <DragandDrop /><br/>
                      <p style={{width:'95%',alignItems:'left', fontSize:'14px'}}>이미지 또는 URL을 업로드하시면 <a target="_blank" class="text-typo-secondary underline" draggable="false" href="/ko/tos">서비스 약관</a>에 동의하시는 것으로 간주합니다. 본 사이트는 hCaptcha의 보호를 받으며 <a target="_blank" rel="noopener" class="text-typo-secondary underline" draggable="false" href="https://hcaptcha.com/privacy">개인정보 보호정책</a> 및 <a target="_blank" rel="noopener" class="text-typo-secondary underline" draggable="false" href="https://hcaptcha.com/terms">서비스 약관</a>이 <br/>적용됩니다.</p><br/>
                  </RightTop>
              </Top>
            </div>
              <Section2>
                <div id="div1" style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'100%', height:"760px"}}>
                  <h1 id="intro1" style={{textAlign:'center', marginTop:480, fontWeight:'700'}}>DELETE THE DESIRED OBJECT WITH ONE CLICK!</h1>
                  <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:120}}>
                    <img id="imgLeft" src="img/07.png" alt="" style={{width:360, height:360,borderRadius:'20px'}}/>&nbsp;
                    <img id="imgRight" src="img/07.png" alt="" style={{width:360, height:360,borderRadius:'20px'}}/>
                  </div>
                  <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <img id="processImg" src="img/07_result.png" alt="" style={{width:512, height:512,borderRadius:'20px'}}/>
                  </div>
                </div>
              </Section2>

              <Section3>
                <h1 style={{display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>AMAZING QUALITY!</h1>
                <div style={{color:'#1e6b7b'}}>마우스를 사진 위로 올려 움직여보세요!</div>
                <div style={{marginTop:50}}>
                  <div id="hi" style={{position:'relative', display:'flex', justifyContent:'center', alignItems:'center', width:512, height:512}}
                       onMouseMove={(event) => handleMouseMove(event)}>
                      <img src={resultcard} style={{position:'absoulte',borderRadius:'20px'}} />
                      <img className='wiper' src={card} alt=""
                            style={{position:'absolute',borderRadius:'20px', width:512, height:512, clipPath: `polygon(0 0, ${coord}px 0, ${coord}px 100%, 0 100%)`}}>
                      </img>
                  </div>
                </div>
                <Butt>                
                    <button class="w-btn-outline w-btn-indigo-outline"  type="button" onClick={()=>change1()}>
                    
                    Car</button>
                    <button class="w-btn-outline w-btn-indigo-outline"  type="button" onClick={()=>change2()}>
                    
                    People</button>
                    <button class="w-btn-outline w-btn-indigo-outline"  type="button" onClick={()=>change3()}>
                   
                    Architecture</button>
                    <button class="w-btn-outline w-btn-indigo-outline"  type="button" onClick={()=>change4()}>
                    
                    Animals</button>
                    <button class="w-btn-outline w-btn-indigo-outline"  type="button" onClick={()=>change5()}>
                    
                    Graphics</button>
                </Butt>

              </Section3>

              <Section4>
                <h1 style={{display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700}}>WHO MADE THIS WEBSITE?</h1>
                <div style={{display:'flex', margin:80}}>
                  <Lee id="list">
                    <h5>Lee Chung Min</h5>
                    <b>Computer Engineering</b>
                    <span class="stack">Tech Stack</span>
                    <span class="info">Java, Python, Javascript, Spring, <br />Node.js, React, React Native, Kotlin</span>      
                  </Lee>
                  <Juho id="list">
                    <h5>Jeon Ju Ho</h5>
                    <b>Computer Engineering</b>
                    <span class="stack">Tech Stack</span>
                    <span class="info">Java, Python, Spring, <br /> Next.js, JSP, SQL, Git</span>
                  </Juho>
                  <Dackyy id="list">
                    <h5>Jeong Dae Ky</h5>
                    <b>AI Software</b>
                    <span class="stack">Tech Stack</span>
                    <span class="info">Java, Python, Spring, <br /> Flask, Data Analysis ,AI/ML</span>
                  </Dackyy>
                  <Choi id="list">
                    <h5>Choi Young Kyu</h5>
                    <b>AI Software</b>
                    <span class="stack">Tech Stack</span>
                    <span class="info">Java, Python, Javascript, Spring, <br />Node.js, React, React Native</span>   
                  </Choi>
                </div>
              </Section4>
              
              <Footer>
                <div style={{display:'flex', width:'100%', maxWidth:'1560px', justifyContent:'space-between', padding:'4rem 2rem'}}>
                  <div>
                    <p style={{color:'white', fontSize:'32px', marginBottom:0}}>Made by <b>GolaBlur</b></p>
                  </div>
                  <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <ul style={{display:'flex', color:'white', listStyle:'none', padding:'0', margin:'0', textAlign:'right', fontSize:'18px', fontWeight:'bold'}}>
                      <li style={{width:160}}><a href="https://hcaptcha.com/privacy" target='_blank' style={{color:'white'}}>개인정보 보호정책</a></li>
                      <li style={{width:100, marginLeft:50}}><a href="https://hcaptcha.com/terms" target='_blank' style={{color:'white'}}>서비스 약관</a></li>
                      <li style={{width:70, marginLeft:50}}><a href="https://github.com/GolaBlur" target='_blank' style={{color:'white'}}>GitHub</a></li>
                    </ul>
                  </div>
                </div>
              </Footer>
          </MyWorld>
      </World>
    )
  
}
export default Main;

let World = styled.div`
  display: relative;
  margin: 0 auto;
`

let MyWorld = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
let Top = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  gap: 40px;
`
let LeftTop = styled.div`
  display: flex;
  align-self: center;
`
let RightTop = styled.div`
  display: flex;
  align-self: center;
  height: 300px;
`
const Cat = styled.div`
  width: 420px;
  height: 420px;
  background: url('img/Rox.png');
  background-size: cover;
`
const Section2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const Section3 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 800px;
  background: #F5F5F5;
`

const Section4 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 800px;
  gap: 2%;
`

const Lee = styled.div`
  width: 360px;
  height: 360px;
  background: url('img/Lee.jpg');
  background-size: 100%;
  border-radius: 1rem;
`
const Juho = styled.div`
  width: 360px;
  height: 360px;
  background: url('img/Juho.jpg');
  background-size: 100%;
  border-radius: 1rem;
`
const Dackyy = styled.div`
  width: 360px;
  height: 360px;
  background: url('img/Dackyy.png');
  background-size: cover;
  border-radius: 1rem;
`
const Choi = styled.div`
  width: 360px;
  height: 360px;
  background: url('img/Choi.jpg');
  background-size: 100%;
  border-radius: 1rem;
`
const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 260px;
  background-color: #454545;
`
const Butt = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  gap: 20px;
`