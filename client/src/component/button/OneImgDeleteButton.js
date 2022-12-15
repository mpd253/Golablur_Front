import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import 'react-awesome-button/dist/styles.css';
import Modal from "react-bootstrap/Modal";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import './EditButton.css';
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
import axios from "axios";
import { Config } from "aws-sdk";
function OneImgDeleteButton(props){
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const navigate = useNavigate();
    function save(){
        const selects = [];
        for(var i=0;i<props.delete.length;i++){
            
            if(props.delete[i].isSelected === true){
                selects.push(props.delete[i].obj_ID)
            }
        }
        console.log("obj",selects)
        console.log("id",props.items.file.file_ID)
        const config = {"Content-Type": 'application/json'};
        const data={
            file_ID: props.items.file.file_ID,
            object_IDList:selects,
             }
        axios.post(`${process.env.REACT_APP_LOCAL_URL}file/process/delete/one/image`, data,config)

            .then((res)=>{
                console.log(res.data);
                setTimeout(() => navigate('/completepage'), 1000);
            })
    }
    return(
        <>
            <button class="w-btn-outline w-btn-green-outline" type="button" onClick={handleShow}>
            <img src="img/scissor.png" width="18" height="18"/>&nbsp;객체 삭제
            </button>
              { props.items.length !==0 ?
           
            <Modal 
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >

                    <Modal.Header closeButton>
                        <Modal.Title>객체 삭제</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                            <Form>
                             <MDBContainer fluid className="p-3 my-5">

                                    <MDBRow>

                                        <MDBCol >
                                        <IImg>  
                                        <img src={`${process.env.REACT_APP_AMAZON_URL}`+props.items.file.path} width="300" height="250"/>
                                        {console.log(props.delete)}
                                        </IImg>
                                        삭제할 객체리스트
                                        {props.delete.length !== 0 ? 
                                        <IImg>

                                        {props.delete.map((item)=>
                                        item.isSelected === true?
                                        <>
                                        <img src={item.src} width="100" height="80"/>&nbsp;&nbsp;&nbsp;&nbsp;
                                        </>
                                        :""
                                        )}
                                        </IImg>
                                        :""}
                                        </MDBCol>

                                    </MDBRow>

                                    </MDBContainer>
                            </Form>
                             
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={save}>
                            삭제
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
export default OneImgDeleteButton;

let IImg= styled.div`
width:300px;
 height:250px;
`