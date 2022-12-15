
import 'antd/dist/antd.css';
import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import AWS, { DevOpsGuru } from 'aws-sdk';
import {Input, Alert } from 'reactstrap';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import '../draganddrop/DragandDrop.css';
import {CircleLoading} from 'loplat-ui';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;

//딥페이크 드래그앤 드랍
function DFDrangandDrop(){
  const navigate = useNavigate();
  const unique_id4 = uuid();
  const small_id = unique_id4.slice(0,8)
  const [loading,setLoading] = useState(false);

  const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.REACT_APP_SECRET_ACCESS_KEY;
const REGION = process.env.REACT_APP_REGION;
const S3_BUCKET =  process.env.REACT_APP_S3_BUCKET;
      
        AWS.config.update({
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY
      });
      
        const myBucket = new AWS.S3({
        params: { Bucket: S3_BUCKET},
        region: REGION,
      });
      
      const props = {
    
        name: 'file',
        multiple: false,
        beforeUpload(info) {
          
          
        },
        onDrop(e) {
          setLoading(true)
          const fileExt =  e.dataTransfer.files[0].name.split('.').pop();
          if(e.dataTransfer.files[0].uid !== undefined ){
            const params = {
              ACL: 'public-read',
              Body:  e.dataTransfer.files[0],
              Bucket: S3_BUCKET,
              //사용자id / 파일 uid로 파일 디렉토리 생성 / 파일 uid.jpg
              Key: sessionStorage.getItem("id")+"/" +JSON.parse(sessionStorage.getItem('deepfake')).file.file_ID  + "/deepfake/" +  small_id + "."+fileExt
            };
            
            myBucket.putObject(params)
              .on('httpUploadProgress', (evt) => {
               
              })
              .send((err) => {
                if (err) console.log(err)
                
              })





            {console.log(JSON.parse(sessionStorage.getItem('deepfake')).file.file_ID)}
            const jss = JSON.parse(sessionStorage.getItem('deepfake')).file.file_ID
               
                 //딥페이크 파일 
                  axios.post(`${process.env.REACT_APP_LOCAL_URL}file/process/deepfake/upload/target/image`,null, {
                    params:{
                          file_ID: jss,
                          target_file_ID:e.dataTransfer.files[0].uid,
                          user_ID: sessionStorage.getItem('id'),
                          file_Extension: "."+fileExt,
                          real_File_Name: e.dataTransfer.files[0].name,
                          path: sessionStorage.getItem("id")+"/" +JSON.parse(sessionStorage.getItem('deepfake')).file.file_ID  + "/deepfake/" +  small_id + "."+fileExt,
                  
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
                            // alert("DB 업로드 성공하셨습니다.");
                            window.location.reload();
                        }

                    })
                    .catch(function (error){
                    console.log(error);
                })
  
              
            
              //s3 저장
        
            }
            //인터넷에서 사진 올릴때
            else{
                
              //  db 에 파일 정보 저장
              axios.post(`${process.env.REACT_APP_LOCAL_URL}file/process/deepFake/upload/target/image`,null, {
                params:{
                    file_ID:JSON.parse(sessionStorage.getItem('deepfake')).file.file_ID ,
                    target_file_ID: small_id ,
                    user_ID: sessionStorage.getItem('id'),
                    file_Extension: "."+fileExt,
                    real_File_Name: e.dataTransfer.files[0].name,
                    path: sessionStorage.getItem("id")+"/" +  JSON.parse(sessionStorage.getItem('deepfake')).file.file_ID + "/deepfake/" +  small_id + "."+fileExt,
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
                        window.location.reload();
                    }
  
                })
                .catch(function (error){
                console.log(error);
            })
  
  
            //s3 저장
            const params = {
              ACL: 'public-read',
              Body:  e.dataTransfer.files[0],
              Bucket: S3_BUCKET,
              //사용자id / 파일 uid로 파일 디렉토리 생성 / 파일 uid.jpg
              Key: sessionStorage.getItem("id")+"/" +  sessionStorage.getItem("deepfake").file.file_ID  + "/deepfake/" + small_id + "."+fileExt
            };
            
            myBucket.putObject(params)
              .on('httpUploadProgress', (evt) => {
                console.log(evt);
                
              })
              .send((err) => {
                if (err) console.log(err)
                
              })
            
  
  
          }
        }}
       
    
    return(
        <>
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
              <h3 style={{ whiteSpace: "nowrap", color: '#148CFF', marginBottom:'50px'}}>해당 이미지의 객체를 인식중입니다. </h3>
            </div>
          </div>
    </div>
          :
        <div>
        <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">원본 인물의 바꾸고 싶은 얼굴의 사진을 놓아주세요</p>
        <p className="ant-upload-hint">
        Click or drag file to this area to upload
        </p>
      </Dragger>
           
        </div>
      }
    </>
    );
}

export default DFDrangandDrop;