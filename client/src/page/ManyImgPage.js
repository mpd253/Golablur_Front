import React, {useEffect, useState} from "react";
import styled from "styled-components";
import 'react-awesome-button/dist/styles.css';
import DragandDrop from '../component/draganddrop/DragandDrop';
import axios from 'axios';
import Gallery from "../component/Gallery";
import ManyImgMosaic from "../component/button/ManyImgMosaic";
import '../component/Gallery.css';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import { useNavigate } from 'react-router-dom';
function ManyImagePage(){
    const handleScroll = event => {
        console.log('scrollTop: ', event.currentTarget.scrollTop);
        console.log('offsetHeight: ', event.currentTarget.offsetHeight);
      };
    const [ee , setEe] =useState([]);
    const data=[];
    const [CheckList, setCheckList] = useState([])
    const navigate = useNavigate();
    
    useEffect(() =>{
        let e=[];
        axios.post(`${process.env.REACT_APP_LOCAL_URL}page/list/image/editor`,null, {
            params:{
                    id: sessionStorage.getItem('id'),
                }
            })
            
            .then((res)=>{
                console.log("ss",res.data);
                e.push(res.data);
                setEe(e[0]);
            })
        },[]);

    useEffect(() =>{
        console.log(CheckList)
        },[CheckList]);

        const result = ee.slice(0).reverse().map(num =>num);
    
        
        
        const formoon=()=>{
            console.log("formmmoonjaein")
            for(var i=0;i<result.length;i++){
                const obj =[];
                for(var j=0;j<result[i].groupFileEntity.length;j++) {
                    obj.push({
                            image: `${process.env.REACT_APP_AMAZON_URL}`+result[i].groupFileEntity[j].path,
                            caption: result[i].groupFileEntity[j].real_File_Name,
                            file_ID: result[i].groupFileEntity[j].file_ID,
                            group_ID:result[i].groupFileEntity[j].group_ID,
                        })    
                    }
                    data.push(obj);
                }
        }
        
    
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
    sessionStorage.setItem("deepfake", JSON.stringify(item));
    navigate("/manyimgdeepfake");
  }


  //여러장 이미지 삭제
  function deleteone(i){
    console.log("deleteone", result[i].groupFileEntity[0].group_ID);
    axios.post(`${process.env.REACT_APP_LOCAL_URL}file/loader/delete/group`,null, {
            params:{
                group_ID:  result[i].groupFileEntity[0].group_ID,
                 }
        })
  
        .then((res)=>{
            console.log("삭제",res.data);
            window.location.reload();
        })
    }
    return(
       
        <Earth>
        {formoon()}
        {console.log(data)}
        <Dragg>
            <DragandDrop />
        </Dragg>
        {data.length != 0 ?
        data.map((item,i) =>
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
            <Edit>여러장
            <AspectRatio ratio="1" sx={{ width: 300 }}>
            {/* <IImg id="manyImg">   */}
                <Gallery items={item} index={i}/>
            {/* </IImg> */}
            </AspectRatio>
            </Edit>
            
            <Edit>
                
                
                <div><b>탐지 가능한 리스트</b></div>
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
                {  result[i].objectNameList ?
               
               result[i].objectNameList.map((it,index)=>
               <> 
                    <StyledLabel >
                    <StyledInput type="checkbox" id={it} name={it} value={it} onClick={(event)=>{handleSelect(event,i)}}/>
                    <StyledP>{it}</StyledP>
                    </StyledLabel>
                  

                </>
                )
                :
                ""
                }
                 </div>
            </Edit>
            
            <Edit2><br/>
                {console.log(item)}
                {/* 모자이크 딥페이크 */}
                <ManyImgMosaic items={item} result={result[i]} word={CheckList}/>
                <button class="w-btn-outline w-btn-green-outline" type="button" onClick={()=>(deepfake(item))}>
                    <img src="img/deepfake.png" width="18" height="18"/>&nbsp;
                    딥페이크</button>
                
            </Edit2>
            <img src="img/delete.png" width="30" height="30" type="button" style={{position:'absolute', top:20, right:20 }}  onClick={()=>{deleteone(i)}}/>
          
        </World>
        </Card>
        <br/><br/><br/><br/>
        </>
 )
        :
            <>
            <World>
           <>
           <h1>please upload many Images</h1>
           </>
            </World>
            </>
            }  

</Earth>
    );
}
export default ManyImagePage;

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
`
let Dragg= styled.div`
height:200px;
display: flex;
justify-content: center;
align-items: center;
`
let IImg= styled.div`
width:700px;
// height:300px;
 `
 let Earth = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
let Edit2 = styled.div`
display: flex;
justify-content: center;
margin: 0 auto;
flex-direction: column;
gap:20px;
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
