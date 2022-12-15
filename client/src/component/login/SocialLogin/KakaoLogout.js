import React, { Component, useEffect, useState } from 'react';

class KakaoLogout extends Component {

    componentDidMount() {
        const kakaoScript = document.createElement("script");

        kakaoScript.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
        document.head.appendChild(kakaoScript);

        kakaoScript.onload = () => {
            window.Kakao.init("1fdccc45f55037b9e2d3632409cad69b");

            window.Kakao.Auth.logout({
                success: (auth) => {
                    console.log("kakao 계정삭제",auth.access_token);
                    
                }
            })
            .then(function(response){
                console.log(response);
               
            })
            .catch(function (error){
                console.log(error);
                console.log('Not log in.')
            })

        };

    }
    render() {
        // const {user_id,nickName,profileImage} = this.state;

        return (
            <div>
                
                <div type="button" id="kakao-login-btn"></div>
            </div>
        )
    }
}

export default KakaoLogout;