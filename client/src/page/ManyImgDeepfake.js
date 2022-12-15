
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import 'react-awesome-button/dist/styles.css';
import DragandDrop from '../component/draganddrop/DragandDrop';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import ManyImgDragandDrop  from '../component/draganddrop/ManyImgDragandDrop';
import { useNavigate } from 'react-router-dom';
import {CircleLoading} from 'loplat-ui';
import Carousel from 'react-bootstrap/Carousel';
function ManyImgDeepfake(){
    const navigate = useNavigate();
    const [imgobject,setImgobj]= useState();
    const [loading,setLoading] = useState(false);
    // const [imglist,setImglist] = useState(JSON.parse(sessionStorage.getItem('deepfake')));
    const arrgroup =  JSON.parse(sessionStorage.getItem('deepfake'))

    //추후 경로 정해지면 수정
    // 딥페이크 db에서 올린 딥페이크 사진파일 path를 받아 s3에 접근하여 가져오기 
    useEffect(() => {
    
     axios.post(`${process.env.REACT_APP_LOCAL_URL}page/deepfake/group`,null, {
            params:{
                    source_file_group_ID: arrgroup[0].group_ID
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

        //경로 정해지면 수정
    function deepfake(){
        setLoading(true)
    
     axios.post(`${process.env.REACT_APP_LOCAL_URL}file/process/deepfake/alot/images`,null, {
        params:{
                source_file_ID: arrgroup[0].group_ID,
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
                navigate('/completepage')
            }

        })
        .catch(function (error){
        console.log(error);
    })
    

    }


    function back(){
        navigate('/manyimage')
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
                       <h3 style={{ whiteSpace: "nowrap", color: '#148CFF', marginBottom:'50px'}}>해당 이미지를 딥페이크 중입니다. </h3>
                     </div>
                   </div>
             </div>:
             <Dragg><ManyImgDragandDrop /></Dragg>
             }
        {/* deepfake 할 원본의 파일 데이터를 session에 저장하여 가져옴*/}
        {console.log('session-deepfake---console',JSON.parse(sessionStorage.getItem('deepfake')))}
        {console.log('arrgroup---console2',arrgroup)}

        {arrgroup.length !== 0 ?
       
        <>
        <World>
            <Edit>
                <IImg>  
                <div><b>원본</b></div>
                   
                     <>
                    <Carousel slide={true}>
                    {arrgroup.map((it)=>
                    <Carousel.Item>
                    
                    <img
                        width="100%"
                        height="100%"
                        maxWidth="400px"
                        src={it.image}
                        alt="First slide"
                        
                        />
                        
                    <Carousel.Caption>
                        <p>{it.caption}</p>
                        </Carousel.Caption>
                        
                    </Carousel.Item>
                    )}
                    </Carousel>
                    </>
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
export default ManyImgDeepfake;

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