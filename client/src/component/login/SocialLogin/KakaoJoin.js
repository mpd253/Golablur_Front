// import axios from 'axios';
// import React, { Component, useEffect, useState } from 'react';
// import styled from 'styled-components';
// class KakaoJoin extends Component {
    
//      componentDidMount() {
//          const kakaoScript = document.createElement("script");
         
//         kakaoScript.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
//         document.head.appendChild(kakaoScript);

//          kakaoScript.onload = () => {
//             window.Kakao.init("1fdccc45f55037b9e2d3632409cad69b");

//             window.Kakao.Auth.createLoginButton({
//                 container: "#kakao-login-btn",
//                 success: (auth) => {
//                     console.log("Kakao 로그인 완료", auth.access_token);

//                     window.Kakao.API.request({
//                         url: "/v2/user/me",
//                         success:  (res) => {

//                             // 서버에 데이터 보낼값
//                             // 서버링크 / 로그인
//                             // 아이디, 이름
//                             // 스프링서버
//                             console.log(res.properties.nickname);
//                             // // 아이디체크
//                             // await axios.post('http://192.168.167.141:7080/user/social/signup',null,{
//                             //     params:{
//                             //         User_ID:res.id,
                                    
//                             //         User_Name:res.properties.nickname,
                                
//                             //     }
//                             // })
//                             //     .then(res => {
//                             //         console.log(res.data);
//                             //         // setShow2(false);
//                             //         if(res.data === 400){
//                             //             alert("이미 존재하는 아이디입니다.");
//                             //             // setCheckId(false);
                                       
//                             //         }
//                             //         else if(res.data === 200){
//                             //             alert("사용 가능한 아이디입니다.");
//                             //             // setCheckId(true);
                                       
//                             //         }
//                             //         else{
//                             //             alert("연결에 실패했습니다.");
                                        

//                             //         }
//                             //     })
//                             //     .catch (function (error){
//                             //         alert("회원가입 실패.");
//                             //         console.log(error);
                                    
                                    
//                             //      })
//                             //     .finally(function () {
//                             //         window.location.reload();
//                             //         return;
//                             //     })
                            
                            

//                             axios.post("http://192.168.167.141:7080/user/social/login/duringWork", {
//                                 id:res.id,
//                                 sessionToken:sessionStorage.getItem("id")
//                             })
//                                 .then(function (check) { //서버에서 주는 리턴값???
//                                     console.log(check); //data: '나 값이 들어온 것 같음', status: 200, statusText: '', headers: AxiosHeaders, config: {…}, …}
//                                 })
//                                 .catch(function (error) {
//                                     console.log(error);
//                                 });


//                             console.log("Kakao 사용자 정보", res);
//                             sessionStorage.setItem("id",res.id);
//                             sessionStorage.setItem("profile", res.properties.profile_image);
//                             sessionStorage.setItem("nickname", res.properties.nickname);
//                             console.log("ssssssssssssss",window.Kakao.Auth.getAccessToken());//토큰
//                             console.log("sssssssss",sessionStorage);//토큰


                            

//                            // 로그인 후 들어갈 곳
//                             window.location.reload();
//                         },
//                         fail: (err) => {
//                             console.log(err);
//                         },
//                     })
//                         .then(function (response) {
//                             console.log(response);
//                         })
//                         .catch(function (error) {
//                             console.log(error);
//                         });
//                 },
//                 fail: (err) => {
//                     console.log(err);
//                 },
//             });
//             window.Kakao.init();
//         };

//     }
    
//     render() {
        
        
//         return (
            
//             // <div>
//             //     <MDBBtn className="mb-4 w-100" id="kakao-login-btn"/>
//             /* <MDBBtn className="mb-4 w-100" size="lg" >
//                 <MDBIcon fab icon="kakao-k" className="mx-2"/>
//                 <img src="img/kakao.png" width="20" height="20"/>{" "}Continue with kakao
//             </MDBBtn> */
//             // </div>
//             <KakaoButton  id = "kakao-login-btn"> </KakaoButton>
//         )
//     }
// }

// export default KakaoJoin;

// let KakaoButton= styled.div`
//     display: flex;
//     justify-content: center;
//     width: 100%;
// `




