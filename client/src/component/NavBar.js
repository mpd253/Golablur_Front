
import '../component/NavBar.css';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Login from './login/Login';
import MyPage from './login/MyPage';
import Button from "react-bootstrap/Button";

import { useEffect, useState,Navigate } from 'react';
import styled from "styled-components";



function NavBar(){
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  
  const [myPage, setmyPage] = useState(false);
  //로그아웃 동작
  const logout =() =>{
    console.log("로그아웃 동작");
    sessionStorage.removeItem("nickname"); 
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("profile");// 세션 제거
    sessionStorage.removeItem("file");
    alert("로그아웃 하셨습니다.");
    document.location.href ='/';
}

  return(
    <>
    <MyPage show={myPage}  onHide={() => setmyPage(false)} />
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand href="/"><img src='./img/MainLogo3.png' width='170' height='170'/></Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">홈</Nav.Link>
          <Nav.Link href="/imgpage">이미지 편집기</Nav.Link>
          <Nav.Link href="/videopage">동영상 편집기</Nav.Link>
          <Nav.Link href="/manyimage">여러장</Nav.Link>
          <Nav.Link href="/completepage" style={{marginRight:0}}>완성본</Nav.Link>
        </Nav>
        
        <div style={{}}>{/* 닉네임이 null인지 판단 */}
            {sessionStorage.getItem("nickname")==null?
            //닉네임이  null이라면
               <Login/>
               :
               //닉네임이  null이 아니라면
               <>
                <Mymy>
               {/* 프로필이 null값인지 아닌지 판단 */}
                {sessionStorage.getItem("profile")!=null? 
                // null이 아니라면
                <><img src={sessionStorage.getItem("profile")} type ="button" width="30" height="30" className='userImg' onClick={()=>setmyPage(true)}/>&nbsp;</>
                //프로필이 null이라면
                :<div style={{display:'flex', justifyContent:'center', alignItems:'center'}}><img src={'img/user.jpg'} type ="button" width="30" height="30" className='userImg' onClick={()=>setmyPage(true)}/>&nbsp;</div>}
               
               <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}><b type ="button" onClick={()=>setmyPage(true)}>{sessionStorage.getItem("nickname")}</b>님 안녕하세요.</div>&nbsp;
               
                <Logg>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="40" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={logout}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                &nbsp; <Textt type="button" onClick={logout}>Logout</Textt>
                </Logg>
                </Mymy>
                </>
                
               }

        </div>
      </Container>
    </Navbar>
  </>
  );
}
export default NavBar;
let Logg = styled.div`
  display: flex;
  flex-direction: row;
`
let Textt = styled.div`
  font-size: 24px;
`
let Mymy = styled.div`
  display: flex;
  flex-direction: row;
`