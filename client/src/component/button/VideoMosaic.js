import React, {useEffect, useState} from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import 'react-awesome-button/dist/styles.css';
import Modal from "react-bootstrap/Modal";
import axios from 'axios';
import {CircleLoading} from 'loplat-ui';
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
import 'react-awesome-button/dist/styles.css';
import { useNavigate } from 'react-router-dom';
function VideoMosaic(props){
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    function save(){
        setLoading(true)
        console.log("fileid",props.items.file.file_ID)
        console.log("wordlist",props.word)
        const config = {"Content-Type": 'application/json'};
        const data={
            file_ID: props.items.file.file_ID,
            object_IDList: props.word,
        }
             
        axios.post(`${process.env.REACT_APP_LOCAL_URL}file/process/mosaic/one/video`, data,config)
    
        .then((res)=>{
            setLoading(false)
            console.log("video mosaic",res.data);
            setTimeout(() =>  navigate('/completepage'), 1000);
        
        })

    }
    return(
        <>
            <button class="w-btn-outline w-btn-green-outline" type="button" onClick={handleShow}>
            <img src="img/mosaic.png" width="15" height="15"/>&nbsp;Mosaic
            </button><br/>
            { props.items.length !==0 ?
           <Modal 
                   show={show}
                   onHide={handleClose}
                   backdrop="static"
                   keyboard={false}
               >

                   <Modal.Header closeButton>
                       <Modal.Title>비디오 모자이크</Modal.Title>
                   </Modal.Header>
                   <Modal.Body>
                       
                           <Form>
                            <MDBContainer fluid className="p-3 my-5">

                                   <MDBRow>
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
                                                <h3 style={{ whiteSpace: "nowrap", color: '#148CFF', marginBottom:'50px'}}>해당 동영상을 모자이크 중입니다. </h3>
                                                </div>
                                            </div>
                                        </div>:
                                       <MDBCol >
                                       <IImg>  
                                       <div><b>원본</b></div>
                                        <div>
                                            {console.log("드러옴?")}
                                        
                                        <video width="450" height="270" controls
                                        onloadeddata="myFunction()">
                                            <source src={`${process.env.REACT_APP_AMAZON_URL}`+props.items.file.path}  width="250px" height="200px"/>
                                        </video>
                                    
                                        </div>
                                       </IImg>
                                       <IImg> 
                                       <div><b>선택한 리스트</b></div>
                                       {  props.word ?
               
                                        props.word.map((it,index)=>
                                        <> {it}<br/></>
                                        )
                                        :""
                                        }
                                       </IImg>
                                       
                                       </MDBCol>
                                       
                                        }
                                   </MDBRow>

                                   </MDBContainer>
                           </Form>
                            
                   </Modal.Body>
                   <Modal.Footer>
                       <Button variant="secondary" onClick={save}>
                           모자이크
                       </Button>
                       <Button variant="secondary" onClick={handleClose}>
                           Close
                       </Button>
                   </Modal.Footer>
               </Modal>
                :""}  
        </>
    );
}
export default VideoMosaic;
let World = styled.div`
display: flex;
margin: 0 auto;
flex-direction: row;
`
let Edit = styled.div`
display: flex;
justify-content: center;
margin: 0 auto;
flex-direction: column;
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
    align-items: center;
`