
import { Modal, Button, Container } from 'react-bootstrap';
import KakaoLogout from './SocialLogin/KakaoLogout';
import React, {useEffect, useState} from "react";
import axios from 'axios';


const chId =() =>{
    console.log("아이디 체크")
    
    axios.post(`${process.env.REACT_APP_LOCAL_URL}user/delete`,null,{
        params:{
            User_ID:sessionStorage.getItem('id')
        }
    }).then(res =>{
        console.log("아이디 중복 여부 : " + res.data);
        //400은 false 200이 true
        if(res.data !== 0){
            alert('계정삭제 되었습니다.');
            window.location.reload();
        }
        else{
            alert('계정삭제 실패.');
            window.location.reload();
        }
    })
    .catch(function(error){
        console.log(error);
        window.location.reload();
    })
}

const UserDelete = ({ show, onHide }) => {
    
    function logoutAll() {
        sessionStorage.clear();
        

        //카카오
        if (window.Kakao.Auth.getAccessToken()) {
            window.Kakao.API.request({
                url: "/v1/user/unlink",
                success: function (response) {
                    console.log(response);
                    //계정 삭제가 되면 리로드
                    window.location.reload();
                },
                fail: function (error) {
                    console.log(error);
                },
            });
            window.Kakao.Auth.setAccessToken(undefined);
        }
        sessionStorage.clear();
       
    }
    function handleClose() {
        onHide(false);
        window.location.replace("http://localhost:3000");
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Container>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                       계정삭제
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="d-grid gap-2" align="center">
                        <br></br>
                        정말 삭제 하시겠습니까?
                        <div>
                            <br></br>
                            <KakaoLogout />
                            <Button variant="outline-primary" onClick={() => {chId(); logoutAll();}}>Yes</Button>{' '}
                            <Button variant="outline-primary" onClick={onHide}>No</Button>{' '}
                        </div>
                    </div>
                </Modal.Body>
            </Container>
        </Modal>
    )
}

export default UserDelete;