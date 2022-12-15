import React, {useEffect, useState} from "react";
import styled from "styled-components";
import 'react-awesome-button/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import AspectRatio from '@mui/joy/AspectRatio';
import DragandDrop from '../component/draganddrop/DragandDrop';
import axios from 'axios';
import Card from '@mui/joy/Card';
import '../component/button/EditButton.css'
import VideoMosaic from '../component/button/VideoMosaic';
function VideoPage(){
    const handleScroll = event => {
        console.log('scrollTop: ', event.currentTarget.scrollTop);
        console.log('offsetHeight: ', event.currentTarget.offsetHeight);
      };
    const navigate = useNavigate();
    const [ee , setEe] =useState([]);
    const [CheckList, setCheckList] = useState([])
    useEffect(() =>{
            let e=[];
            axios.post(`${process.env.REACT_APP_LOCAL_URL}page/video/editor`,null, {
                params:{
                    id: sessionStorage.getItem('id'),
                     }
            })
             //고유id로 소환사 티어(리그)정보 가져옴
            .then((res)=>{
                console.log(res.data);
                e.push(res.data);
                setEe(e[0]);
            })
        
      
      
     },[]);
     const result = ee.slice(0).reverse().map(num =>num);
     useEffect(() =>{
        // handleSelect(event)
        console.log(CheckList)
        },[CheckList]);


    const handleSelect = (event,i) => {

        // 체크할 시 CheckList에 id값 넣기
        if (event.target.checked) {
        setCheckList([...CheckList, event.target.value]);
        // 체크 해제할 시 CheckList에서 해당 id값이 `아닌` 값만 배열에 넣기
        } else {
        setCheckList(CheckList.filter((checkedId) => checkedId !== event.target.value ));
        }

    };

     
     function deepfake(item){
        console.log(item);
        sessionStorage.setItem('deepfake',JSON.stringify(item));

        navigate('/videodeepfake');
     }
     //동영상 리스트 삭제
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
     return(
        <Earth>
            <Dragg>
            <DragandDrop />
            </Dragg>
        {/* 삼항연산자 = result라는 배열이 null이라면 null값 띄우기 */}
        {result.length != 0 ?
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
        <World>
            <Edit>
            <Original>
                <div><b style={{color:"#77af9c"}}>원본</b></div>
                <AspectRatio ratio="1" sx={{ width: 250 }}>  
                   
                  
                 <video width="480" height="270" controls
                onloadeddata="myFunction()">
                    <source src={`${process.env.REACT_APP_AMAZON_URL}`+item.file.path}  type="video/mp4"width="300px" height="250px"/>
                </video> 
                </AspectRatio>
            </Original>
            </Edit>
            <Edit>
                <div><b style={{color:"#77af9c"}}>탐지 가능한 리스트</b></div>
                {console.log("ssssssss",result[i])}
                <div
                    // class="wrap-vertical"
                    style={{
                    //   border: '3px solid black',
                    width: '150px',
                    height: '250px',
                    overflow: 'scroll',
                    
                    }}
                    onScroll={handleScroll}
                >
                {  result[i].objectList ?
               
               result[i].objectList.map((it,index)=>
               <> 
               
                    <StyledLabel >
                    <StyledInput type="checkbox" id={it.object_Name} name={it.object_Name} value={it.object_Name} onClick={(event)=>{handleSelect(event,i)}}/>
                    <StyledP>{it.object_Name}</StyledP>
                    </StyledLabel>
               

                </>
                )
                :
                ""
                }
            </div>
            </Edit>
            
            <Edit2><br/>
                
                    <VideoMosaic items={item} result={result[i]} word={CheckList}/>
                    <button class="w-btn-outline w-btn-green-outline" type="button" onClick={()=>{deepfake(item)}}>
                    <img src="img/deepfake.png" width="18" height="18"/>&nbsp;
                    딥페이크</button>
            </Edit2>
            <img src="img/delete.png" width="30" height="30" type="button" style={{position:'absolute', top:20, right:20 }}  onClick={()=>{deleteone(item)}}/>
          
        </World>
        </Card>
        <br/><br/><br/><br/>
        </>
    )
    :
        <>
        <World>
           <>
           <h1>please upload a video</h1>
           </>
        </World>
       
        </>

        }
    </Earth>
    );
     
}
export default VideoPage;

let World = styled.div`
  display: flex;
  margin: 0 auto;
  flex-direction: row;
  gap: 160px;
`
let Edit = styled.div`
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  gap:20px;
`
let Edit2 = styled.div`
display: flex;
justify-content: center;
margin: 0 auto;
flex-direction: column;
gap:20px;
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
let Earth = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
let Original= styled.div`
    display: flex;
    flex-direction: column;
    
`



const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  user-select: none;
`;

const StyledP = styled.p`
  margin-left: 0.25rem;
`;
const StyledInput = styled.input`
  appearance: none;
  border: 1.5px solid gainsboro;
  border-radius: 0.35rem;
  width: 1.5rem;
  height: 1.5rem;

  &:checked {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: limegreen;
  }
`;