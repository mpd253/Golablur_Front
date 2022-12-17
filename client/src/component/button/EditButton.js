import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { AwesomeButton } from "react-awesome-button";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import 'react-awesome-button/dist/styles.css';
import Modal from "react-bootstrap/Modal";
import Canvas from '../Canvas.js';
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


function EditButton(props){
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    
  

    return(
        <>
           <button class="w-btn-outline w-btn-green-outline" type="button" onClick={()=>{handleShow()}}>
           <img src="img/pencil.png" width="18" height="18"/> &nbsp;Edit&nbsp;&nbsp;
            </button>

            <Modal 
                    id="editModal"
                    size='lg'
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    centered={true}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>이미지 편집</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                            <Form>
        
                                <MDBContainer fluid>

                                    <MDBRow>

                                        <MDBCol >
    
                                            <Canvas cImg={props.items}/>
                                       
                                        </MDBCol>
                                    </MDBRow>
                                </MDBContainer>
                            </Form>
                             
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
        </>
    );
}
export default EditButton;

let IImg= styled.div`
width:300px;
 height:250px;
`