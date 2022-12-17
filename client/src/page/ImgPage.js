import React, {useEffect, useState} from "react";
import styled from "styled-components";
import 'react-awesome-button/dist/styles.css';
import EditButton from '../component/button/EditButton';
import DragandDrop from '../component/draganddrop/DragandDrop';
import axios from 'axios';
import Object from "../component/Object";
import MosaicButton from "../component/button/MosaicButton";
import { useNavigate } from 'react-router-dom';
import './Main.css';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';

 
function ImagePage(){
    const navigate = useNavigate();
    const [ee , setEe] =useState([]);
    //자식에서 부모로 받은 데이터
    const [data,setData] = useState([]);
    useEffect(() =>{
            let e=[];
            axios.post(`${process.env.REACT_APP_LOCAL_URL}page/image/editor`,null, {
                params:{
                    id: sessionStorage.getItem('id'),
                     }
            })
      
            .then((res)=>{
                console.log(res.data);
                e.push(res.data);
                setEe(e[0]);
            })
        
            
      
      
     },[]);
   
    
     const result = ee.slice(0).reverse().map(num =>num);

     
   
     const getData = (event) => {
     
        console.log(event);
        setData(event);
     }

     //딥페이크기능
     function deepfake(item){
        
        sessionStorage.setItem("deepfake", JSON.stringify(item));
        navigate("/imgdeepfake");
     }
     //이미지 리스트 삭제
     function deleteone(item){
        console.log("deleteone", item);
        axios.post(`${process.env.REACT_APP_LOCAL_URL}file/loader/delete/one`,null, {
                params:{
                    file_ID: item.file.file_ID,
                     }
            })
      
            .then((res)=>{
                console.log(res.data);
                window.location.reload();
            })
    }
    //객체 삭제 이동 추가 페이지 이동
    function deleteobj(item){
        console.log("deleteobj", item);
      
        sessionStorage.setItem("objectfile", JSON.stringify(item.file));
        sessionStorage.setItem("objectList", JSON.stringify(data));
        navigate('/objedit');
    }
    function setfiledata(item){
        console.log("editobj", item);
        sessionStorage.setItem("objectfile", JSON.stringify(item.file));
        sessionStorage.setItem("objectList", JSON.stringify(data));
    }
    return(
        <Earth>
            <Dragg>
            <DragandDrop height ="200"/>
            </Dragg>
        {/* 삼항연산자 = result라는 배열이 null이라면 null값 띄우기 */}
        {result.length !== 0 ?
        result.map((item,i) =>
        <>
        <Card
        position="relative"
        variant="outlined"
        row
        sx={{
            width: 1000,
            gap: 2,
            borderColor: '#77af9c',
            border: '3px solid #77af9c',
            '&:hover': { boxShadow: 'md', borderColor: 'green' },
        }}
        >
        <World >
            <Edit>
                <Original>
                
                 
                <div><b style={{color:"#77af9c"}}>원본</b></div>
                <AspectRatio ratio="1" sx={{ width: 250 }}>  
                    <img src={`${process.env.REACT_APP_AMAZON_URL}`+item.file.path}/>
                </AspectRatio>
                
                </Original>
                <div>
                   
                {item.objectList.length !== 0 ?
                <>
                <div><b style={{color:"#77af9c"}}>인식한 객체 리스트</b></div>
                <Object items={item} getData={getData}/>
                </>
                :
               ""
                }
  
                </div>
                 </Edit>
            <Edit>
                <button class="w-btn-outline w-btn-green-outline" type="button" onClick={()=>deleteobj(item)}>
                <img src="img/scissor.png" width="18" height="18"/>&nbsp;객체 편집
                </button>
                <MosaicButton items={item} delete={data}/>
                {console.log(item)}
                <EditButton  items={item}  onClick={()=>setfiledata(item)} />
                <button class="w-btn-outline w-btn-green-outline" type="button" onClick={()=>{deepfake(item)}}>
                    <img src="img/deepfake.png" width="18" height="18"/>&nbsp;
                    딥페이크</button>
            </Edit>
              
            <img src="img/delete.png" width="30" height="30" type="button" style={{position:'absolute', top:20, right:20 }} onClick={()=>{deleteone(item)}}/>
          
        </World>
        </Card>
        <br/><br/><br/><br/>
        </>
        
     )
    :
     
    <>
   <World>
           <>
           <h1>please upload a Image</h1>
           </>
    </World>
    </>
    } 

        </Earth>
       
    );
}
export default ImagePage;
let Earth = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
let World = styled.div`
display: flex;
margin: 0 auto;
flex-direction: row;
gap: 60px;
`
let Edit = styled.div`
display: flex;
justify-content: center;
margin: 0 auto;
flex-direction: column;
gap:20px;
`
let IImg= styled.div`
width:500px;
 height:350px;
`
let Dragg= styled.div`
 height:200px;
 display: flex;
 justify-content: center;
 align-items: center;
`
let Original= styled.div`
    display: flex;
    flex-direction: column;
    
`
let DeleteButton = styled.div`
 display: flex;
 justify-content: right_top;
 
`