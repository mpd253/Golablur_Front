import React, {useEffect, useState} from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import 'react-awesome-button/dist/styles.css';
import Modal from "react-bootstrap/Modal";
import Gallery from "../Gallery";
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
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from "reactstrap";
import {CircleLoading} from 'loplat-ui';
function ManyImgMosaic(props){
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    function save(){
        setLoading(true)
        // console.log("fileid",props.items.file.file_ID)
        // console.log("wordlist",props.word)
        const config = {"Content-Type": 'application/json'};
        const data={
            groupID: props.items[0].group_ID,
            objectNameList: props.word,
        }
             
        axios.post(`${process.env.REACT_APP_LOCAL_URL}file/process/mosaic/alot/images`, data,config)
    
        .then((res)=>{
            setLoading(false)
            console.log("video mosaic",res.data);
            setTimeout(() => navigate('/completepage'), 1000);
            
        })
        
    }
    return(
        <>
             <button class="w-btn-outline w-btn-green-outline" type="button" onClick={handleShow}>
            <img src="img/mosaic.png" width="15" height="15"/>&nbsp;Mosaic
            </button>{console.log(props.items)}
            { props.items.length !==0 ?
           <Modal 
                   show={show}
                   onHide={handleClose}
                   backdrop="static"
                   keyboard={false}
               >

                   <Modal.Header closeButton>
                       <Modal.Title>모자이크</Modal.Title>
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
                                                <h3 style={{ whiteSpace: "nowrap", color: '#148CFF', marginBottom:'50px'}}>해당 이미지를 모자이크 중입니다. </h3>
                                                </div>
                                            </div>
                                        </div>:
                                       <MDBCol >
                                       <IImg>  
                                       <Gallery items={props.items}  />
                                
                                       </IImg>
                                       <Edit>
                                            <div><b>선택한 리스트</b></div>
                                            <div>{props.word.map((item)=>
                                            <>
                                                <b>{item}</b><br/>
                                            </>
                                            )}</div>
                                    
                                        </Edit>
                                                                
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
export default ManyImgMosaic;
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
width:400px;
 height:300px;
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