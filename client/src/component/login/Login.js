
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import GoogleLogin from "./SocialLogin/GoogleLogin";
import KakaoLogin from "./SocialLogin/KakaoLogin";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import axios from 'axios';
import './Login.css';

import {
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBBtn,
    MDBIcon,
    MDBInput,
    MDBCheckbox
  }
  from 'mdb-react-ui-kit';


export default function Login() {
    // { isLogin, setIsLogin }
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handle2Show = () => setShow2(true);
    const handle2Close = () => setShow2(false);

    //회원가입 변수
    const [id,setId] = useState(""); // 로그인과 공용
    const [pw,setPw] = useState(""); // 로그인과 공용
    const [nickname,setNickname] = useState("");
    //400은 false 200이 true
    //로그인 동작
    const login = () =>{
        console.log("로그인 실행");
        // if(id ==="" && id ===null && id !== undefined){
        //     alert("아이디를 입력해주세요.");
        // }
        // if(pw === "" && pw ===null && pw !== undefined){
        //     alert("비밀번호를 입력해주세요");
        // }
        console.log("id: " + id);
        axios.post(`${process.env.REACT_APP_LOCAL_URL}user/normal/login`,null, {
            params:{
                User_ID:id,
                User_PW:pw,
            }
          
        })
            .then(res => {
                console.log(res);
                
                console.log("닉네임: ", res.data);
                console.log(typeof res.data);
                if(res.data == null || res.data == undefined || res.data == ""){
                    alert("로그인 실패");
                } else{
                    console.log(res.data);
                    alert("로그인에 성공하셨습니다.");
                    setShow(false);
                    axios.post(`${process.env.REACT_APP_LOCAL_URL}user/normal/login/duringWork`, null,{
                        params:{
                        User_ID:res.data.user_ID,
                        User_PW:res.data.user_PW,
                        sessionToken:sessionStorage.getItem("id")
                        }
                    })
                        .then(function (check) { //서버에서 주는 리턴값???
                            console.log(check); //data: '나 값이 들어온 것 같음', status: 200, statusText: '', headers: AxiosHeaders, config: {…}, …}
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                    console.log("dd"+res.data.user_Name);
                    sessionStorage.setItem('id',res.data.user_ID);
                    sessionStorage.setItem("nickname",res.data.user_Name);
                    console.log(sessionStorage.getItem("nickname"));
                    
                    document.location.href ='/';
                }

            })
            .catch(function (error){
            console.log(error);
        })
    }
    

    //회원가입 중복 체크
    const [checkId,setCheckId] = useState(false);

    // 회원 가입 동작
    const join = () => {
        console.log("회원가입 액션");
        if(checkId === false){
            alert("아이디 중복체크를 해주세요");
            return;
        }
         
        axios.post(`${process.env.REACT_APP_LOCAL_URL}user/signup`,null,{
            params:{
                User_ID:id,
                User_PW:pw,
                User_Name:nickname,
            
            }
        })
            .then(res => {
                console.log(res.data);
                alert("회원가입 성공~!");
                setShow2(false);
            })
            .catch(function (error){
                alert("제대로 기입해주세요.");
                console.log(error);
            })
    }
    // 회원가입시 아이디 체크
    const chId =() =>{
        console.log("아이디 체크")
        if(id==="")
        {
            alert("아이디를 입력해주세요.");
            return;
        }
        axios.post(`${process.env.REACT_APP_LOCAL_URL}user/id/check`,null,{
            params:{
                User_ID:id
            }
        }).then(res =>{
            console.log("아이디 중복 여부 : " + res.data);
            //400은 false 200이 true
            if(res.data === 400){
                alert("이미 존재하는 아이디입니다.");
                setCheckId(false);
                return;
            }
            else{
                alert("사용 가능한 아이디입니다.");
                setCheckId(true);
                return;
            }
        })
        .catch(function(error){
            console.log(error);
        })
    }
    return(
        <>
        <Logg>
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="40"strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" type="button" onClick={handleShow}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
        &nbsp; <Textt type="button"  onClick={handleShow}>Login</Textt>
        </Logg>

             <Modal 
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >

                    <Modal.Header closeButton>
                        <Modal.Title>로그인</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                            <Form>
                             <MDBContainer fluid className="p-3 my-5">

                                    <MDBRow>
                                        <h2 style={{color: '#6A24FE', fontWeight:600, marginBottom:'30px'}}>Login</h2>
                                        <MDBCol >
                                        <Form.Group className="mb-3" controlId="formBasicId">
                                        {/* <Form.Label>ID</Form.Label> */}
                                        <Form.Control type="text" placeholder="ID" onChange={(event)=>setId(event.target.value)} style={{height:48, background:'#F8F8F8'}}/>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                        {/* <Form.Label>Password</Form.Label> */}
                                        <Form.Control type="password" placeholder="Password" onChange={(event)=>setPw(event.target.value)} style={{height:48, background:'#F8F8F8'}}/>
                                        </Form.Group>

                                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                            {/* 아이디저장 */}
                                            <Form.Group controlId="formBasicCheckbox">
                                                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                                            </Form.Group>
                                            {/* 이벤트 두개 */}
                                            <a type="button" onClick={() => {handle2Show(); handleClose();}}><u style={{opacity:0.8}}>회원이 아니신가요?</u></a>
                                        </div><br/>
                                        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                            <Button variant="primary" onClick={login} style={{width:221.992, height:48.984, fontSize:16}}>Login</Button>
                                        </div><br/><br/>
                                       {/* <MDBBtn className="mb-4 w-100" size="lg" onClick={login}>Sign in</MDBBtn> */}
                                            <p className="text-center fw-bold mx-3 mb-0">Social Login</p><br/>
                                        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                                            {/* <MDBBtn style={{backgroundColor: '#3b5998', width:221.992, height:48.984}}>
                                                <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', fontSize:'13px'}}>
                                                    <MDBIcon fab icon="facebook-f"/>
                                                     Continue with face
                                                </div>
                                            </MDBBtn><br/> */}
                                            <KakaoLogin/>
                                        </div>

                                        </MDBCol>

                                    </MDBRow>

                                    </MDBContainer>
                            </Form>
                             
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>



                {/*회원가입*/}
                <Modal
                    show={show2}
                    onHide={handle2Close}
                    backdrop="static"
                    keyboard={false}
                >

                    <Modal.Header closeButton>
                        <Modal.Title>회원가입</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <MDBContainer fluid className="p-3 my-5">

                                <MDBRow>

                                    <MDBCol >

                                    <Form.Group className="mb-3" controlId="formBasicId">
                                    <Form.Label>아이디</Form.Label><Button variant="primary" onClick={chId}>아이디 확인</Button>
                                    <Form.Control type="text" placeholder="id" onChange={event => setId(event.target.value)}/>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>패스워드</Form.Label>
                                    <Form.Control type="password" placeholder="Password" onChange={event => setPw(event.target.value)}/>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicNickname">
                                    <Form.Label>닉네임</Form.Label>
                                     <Form.Control type="text" placeholder="Nickname" onChange={event => setNickname(event.target.value)}/>
                                    </Form.Group>

                                    
                                    <Button variant="primary" onClick={join}>submit</Button>

                                    </MDBCol>

                                </MDBRow>

                            </MDBContainer>
                            
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handle2Close}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

        </>
   );
}
let Logg = styled.div`
    display: flex;
    flex-direction: row;
`
let Textt = styled.div`
    font-size: 24px;
`