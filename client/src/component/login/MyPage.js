
import { Modal, Button, Container } from 'react-bootstrap';
import UserDelete from "./UserDelete";
import React, { useState} from "react";
// import '../../component/NavBar.css';
// import {
//   MDBContainer,
//   MDBInput,
//   MDBCheckbox,
//   MDBBtn,
//   MDBIcon
// }
// from 'mdb-react-ui-kit';



const MyPage = ({ show, onHide }) => {
  
  const [logOutModalOn, setLogOutModalOn] = useState(false);
  //계정삭제

  return(<>
     {/* 계정삭제 */}
    <UserDelete show={logOutModalOn} onHide={() => setLogOutModalOn(false)} />
    {/* 모달창 */}
    <Modal
            show={show}
            onHide={onHide}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Container>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                       마이페이지
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="d-grid gap-2" align="center">
                        <br></br>
                        
                        <div>
                           
                            <>
                             {/* 닉네임이 null인지 판단 */}
                                
                                  
                                  <>
                                  {/* 프로필이 null값인지 아닌지 판단 */}
                                    {sessionStorage.getItem("profile")!=null? 
                                    // null이 아니라면
                                    <><img src={sessionStorage.getItem("profile")} width="30" height="30" className='userImg' /></>
                                    //프로필이 null이라면
                                    :<><img src={"img/user.jpg"} width="30" height="30" className='userImg'/></>}
                                    
                                  <><b>{sessionStorage.getItem("nickname")}</b>님 입니다.{" "}</>
                                  
                                    </>
                                  
                               </>
                               <br/>
                                <Button color="inherit" variant='outlined' onClick={() => setLogOutModalOn(true)} >계정삭제</Button>
                              
                        </div>
                    </div>
                </Modal.Body>
            </Container>
        </Modal>
        </>
   
  );

  }
export default MyPage;