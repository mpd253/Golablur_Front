import React, {useEffect, useState} from "react";
import styled from "styled-components";
import 'react-awesome-button/dist/styles.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import DFDrangandDrop from '../component/draganddrop/DFDragandDrop';
import { useNavigate } from 'react-router-dom';
import {CircleLoading} from 'loplat-ui';
function VideoDeepfake(){
    const navigate = useNavigate();
    const [imgobject,setImgobj]= useState();
    const [loading,setLoading] = useState(false);

    //추후 경로 정해지면 수정
    // 딥페이크 db에서 올린 딥페이크 사진파일 path를 받아 s3에 접근하여 가져오기 
    useEffect(() => {
        axios.post(`${process.env.REACT_APP_LOCAL_URL}page/deepfake/one`,null, {
               params:{
                       source_file_ID: JSON.parse(sessionStorage.getItem('deepfake')).file.file_ID
                   }
           })
               .then(res => {
                   if(res.data == null || res.data == undefined || res.data == ""){
                       alert("파일 DB 업로드 실패");
                   } else{
                       console.log("tt데이터",res.data);
                       //tartget data 가 null이 아니면 
                       // window.location.reload();
                       if(res.data.target !== null){
                       setImgobj(res.data.target);
                       }
                   }
   
               })
               .catch(function (error){
               console.log(error);
           })
       }, []);
      

    function deepfake(){
        setLoading(true)
        console.log('imgobject.object_ID',imgobject.object_ID)
        //딥페이크 파일 input output 두개의 파일 전송 
     axios.post(`${process.env.REACT_APP_LOCAL_URL}file/process/deepfake/one/video`,null, {
        params:{
                source_file_ID: JSON.parse(sessionStorage.getItem('deepfake')).file.file_ID,
                target_file_ID: imgobject.object_ID,
            }
    })
        .then(res => {
            console.log(res);
            console.log("닉네임: ", res.data);
            console.log(typeof res.data);
            if(res.data == null || res.data == undefined || res.data == ""){
                alert("파일 DB 업로드 실패");
            } else{
                console.log(res.data);
                setTimeout(() =>  navigate('/completepage'), 2000);
                
            }

        })
        .catch(function (error){
        console.log(error);
    })


    }


    function back(){
        navigate('/videopage')
    }
    return(
        <div>
        {loading === true ?
        <div>
               <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                 <CircleLoading
                   aria-describedby="example"
                   aria-labelledby="example"
                   duration={1300}
                   scale={1}
                   zIndex={0}
                   style={{ marginTop: "100px", marginBottom:"20px"}} />
                 <div style={{marginTop:30}}>
                   <h3 style={{ whiteSpace: "nowrap", color: '#148CFF', marginBottom:'50px'}}>해당 동영상을 딥페이크 중입니다. </h3>
                 </div>
               </div>
         </div>:
        <Dragg><DFDrangandDrop /></Dragg>}
    {/* deepfake 할 원본의 파일 데이터를 session에 저장하여 가져옴*/}
    {console.log(JSON.parse(sessionStorage.getItem('deepfake')).file)}
    {sessionStorage.getItem("deepfake").length !== 0 ?
   
    <>
    <World>
        <Edit>
            <IImg>  
            <div><b>원본</b></div>
               
                <video width="480" height="270" controls
                    onloadeddata="myFunction()">
                    <source src={`${process.env.REACT_APP_AMAZON_URL}`+JSON.parse(sessionStorage.getItem('deepfake')).file.path}  width="300px" height="250px"/>
                </video>
            </IImg>
        </Edit>
        <Edit>
            <div><b>바뀌는 인물</b></div>
            <div>
            {console.log("ssssssssssss",imgobject)}
            
            { imgobject !== undefined  ?
                <>
                    <img src={`${process.env.REACT_APP_AMAZON_URL}`+imgobject.path} width="350px" height="350px"/>
                </>
                :
                <>
                원하는 사진을 올려주세요
                </>
            }
            </div>
       
        </Edit>
        
        <Edit><br/>
            
                <Button variant="secondary" onClick={()=>deepfake()}>
                       딥페이크
                </Button><br/>
                <Button variant="secondary" onClick={()=>back()}>
                       뒤로가기
                </Button>
                
        </Edit>
    </World>
    
    </>

:
    <>
    <World>
        <Edit>
            <div><b>원본</b></div>
            <IImg >  
            <img src={"https://miro.medium.com/max/1400/1*i5wCTCPeXSWpH-uJmSYLVQ.jpeg"} width="300px" height="250px"/>
            </IImg>
        </Edit>
        <Edit>
            <div><b>탐지 가능한 리스트</b></div>
            <div>객체인식한 사진</div>
       
        </Edit>
        
    </World>
    <hr/>
    </>

    }
</div>
);
}
export default VideoDeepfake;

let World = styled.div`
  display: flex;
  margin: 0 auto;
  flex-direction: row;
`
let Edit = styled.div`
  display: flex;
  margin: 0 auto;
  flex-direction: column;
`
let IImg= styled.div`
width:300px;
 height:250px;
 `


let Dragg= styled.div`
 height:200px;
 display: flex;
 justify-content: center;
 align-items: center;
`