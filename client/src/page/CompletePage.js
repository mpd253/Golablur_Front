import React, {useEffect, useState} from "react";
import styled from "styled-components";
import 'react-awesome-button/dist/styles.css';
import DownloadButton  from '../component/button/DownloadButton';
import axios from 'axios';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import DragandDrop from '../component/draganddrop/DragandDrop';
import Carousel from 'react-bootstrap/Carousel';
import ManyDownloadButton from "../component/button/ManyDownloadButton";
function CompletePage(){
    const [ee , setEe] =useState([]);
    const data=[];
    useEffect(() =>{
            let e=[];
            axios.post(`${process.env.REACT_APP_LOCAL_URL}page/result`,null, {
                params:{
                    id: sessionStorage.getItem('id'),
                     }
            })
            
            .then((res)=>{
                console.log("answer",res.data);
                e.push(res.data);
                setEe(e[0]);
            })
           
            
      
     },[]);
     
    
     const result = ee.slice(0).reverse().map(num =>num);
     console.log(result);
   

     useEffect(() =>{
        // handleSelect(event)
        console.log(result)
        },[result]);


     function deleteone(item){
        console.log("deleteone", item[0]);
        axios.post(`${process.env.REACT_APP_LOCAL_URL}file/loader/delete/one`,null, {
                params:{
                    file_ID: item[0].file_ID,
                     }
            })
      
            .then((res)=>{
                console.log(res.data);
                window.location.reload();
            })
    }

    
    function deletemany(item){
        console.log("deleteone", item[0]);
        axios.post(`${process.env.REACT_APP_LOCAL_URL}file/loader/delete/group`,null, {
                params:{
                    group_ID: item[0].group_ID,
                     }
            })
      
            .then((res)=>{
                console.log(res.data);
                window.location.reload();
            })
    }




    function downButton(item){
         if(item.length === 1){ } 
    }
    return(
        <Earth>
             <Dragg>
            <DragandDrop height ="200"/>
        </Dragg>
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
            <World>
            <Edit>
            <Original>
                
                
                <div><b style={{color:"#77af9c"}}>완성본</b></div>
                <AspectRatio ratio="1" sx={{ width: 250 }}>
                
                    {console.log(item[0].path)}
                    {item.length === 1 ?
                    //한장
                        item[0].file_Extension !== ".mp4" ?
                        <img src={`${process.env.REACT_APP_AMAZON_URL}`+item[0].path} />
                        :
                        <video width="480" height="270" controls
                        onloadeddata="myFunction()">
                            <source src={`${process.env.REACT_APP_AMAZON_URL}`+item[0].path} type="video/mp4" width="300px" height="250px" />
                        </video>
                        :
                        //여러장
                        <Carousel slide={true}>
                        {result[i].map((it)=>
                       <Carousel.Item>
                       
                       <img
                           width="100%"
                           height="100%"
                           maxWidth="400px"
                           src={`${process.env.REACT_APP_AMAZON_URL}`+it.path}
                           alt="First slide"
                           
                         />
                         
                        <Carousel.Caption>
                           
                           <p>{it.caption}</p>
                           </Carousel.Caption>
                           
                       </Carousel.Item>
                       )}
                     </Carousel>
                    
                    }
                    
                    </AspectRatio>
               
                </Original>
            </Edit>
        
            
            <Edit2>
                {result[i].length === 1 ?
                //한장 다운로드 버튼
                <DownloadButton items={item[0]}/>
                : 
                //여러장 다운로드 버튼
                <ManyDownloadButton items={item}/>
                } 
                
            </Edit2>
            {result[i].length === 1 ?
            //한장 다운로드 버튼
            <img src="img/delete.png" width="30" height="30" type="button" style={{position:'absolute', top:20, right:20 }} onClick={()=>{deleteone(item)}}/>
            :
            //여러장 다운로드 버튼
            <img src="img/delete.png" width="30" height="30" type="button" style={{position:'absolute', top:20, right:20 }} onClick={()=>{deletemany(item)}}/>
            }
            </World>
            </Card> 
            <br/><br/><br/><br/>
        </>
        )
        :
        <>
        
        <World>
           <>
           <br/><br/><br/>
           <h1>please upload file</h1>
           </>
        </World>
        </>
        } 
        </Earth>
    );
}
export default CompletePage;
let World = styled.div`
  display: flex;
  margin: 0 auto;
  flex-direction: row;
  gap: 200px;
`
let Edit = styled.div`
  display: flex;
  margin: 0 auto;
  flex-direction: column;
`
let Original= styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
let IImg= styled.div`
width:500px;
 height:350px;
`
let Earth = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
let Dragg= styled.div`
height:200px;
display: flex;
justify-content: center;
align-items: center;
`
let Edit2 = styled.div`
display: flex;
justify-content: center;
margin: 0 auto;
flex-direction: column;
gap:20px;
`