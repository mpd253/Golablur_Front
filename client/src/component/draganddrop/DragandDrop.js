
// import {Button,Upload} from 'antd';
// import { Spin } from 'antd';
import 'antd/dist/antd.css';
// import styled from 'styled-components';
import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
// import AWS from 'aws-sdk';
import AWS, { DevOpsGuru } from 'aws-sdk';
import {Input, Alert } from 'reactstrap';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import '../draganddrop/DragandDrop.css';
// import S3Upload from '../fileupload/S3Upload';
// import axios from 'axios';
import {CircleLoading} from 'loplat-ui';
import { BackwardOutlined, InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;

export default function DragandDrop() {
  
  const navigate = useNavigate();
  
  const [progress , setProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [loading,setLoading] = useState(false);
 const [dropInfo,setDropInfo] =useState();
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
const [files, setFiles] = useState([]);
const unique_id4 = uuid();

  
 //useEffect를 사용하여 원래있던 데이터 렌더링 시 날아간거 다시 넣기
  useEffect(() =>{
    //그룹아이디를 위해 useEffect
    const unique_id2 = uuid();
    const small_id2 = unique_id2.slice(0,8) //uuid
    sessionStorage.setItem('group',small_id2)
    console.log(progress)
  },[progress]);

  //인터넷에서 파일을 올릴때
  async function oneImgbrowserfile(e){
    console.log("들어오나?")
    const fileExt =  e.dataTransfer.files[0].name.split('.').pop();


           //s3 저장
    const params = {
      ACL: 'public-read',
      Body:  e.dataTransfer.files[0],
      Bucket: S3_BUCKET,
      //사용자id / 파일 uid로 파일 디렉토리 생성 / 파일 uid.jpg
      Key: sessionStorage.getItem("id")+"/" +  unique_id4 + "/" + unique_id4 + "."+fileExt
    };

    myBucket.putObject(params)
    .on('httpUploadProgress', (evt) => {
      
      console.log(evt);
      setProgress(Math.round((evt.loaded / evt.total) * 100))
      console.log(e.dataTransfer.files[0])
      if(Math.round((evt.loaded / evt.total) * 100) === 100){
        axios.post(`${process.env.REACT_APP_LOCAL_URL}file/loader/detect/objects`,null, {
          params:{
            file_ID: unique_id4,
          }
        
      })
          .then(res => {
              console.log(res);
              console.log("닉네임: ", res.data);
              console.log(typeof res.data);
              if(res.data == null || res.data == undefined || res.data == ""){
                  alert("파일 DB 업로드 실패");
                  console.log("들어오나?")
              } else{
                  console.log(res.data);
                  console.log("들어오나?")
              const fileExt1 =  res.data.split('.').pop();
              if(fileExt1 ==="png"){
              
                navigate("/imgpage");
                window.location.reload();
              }
              else if(fileExt1 ==="jpg"){
              
                navigate("/imgpage");
              
                window.location.reload();
              }
              else if(fileExt1 ==="jpeg"){
              
                navigate("/imgpage");
              
                window.location.reload();
              }
              
              else if(fileExt1 ==="mp4"){
              
                navigate("/videopage");
              
                window.location.reload();
              }
    
              }
    
          })
          .catch(function (error){
          console.log(error);
          console.log("들어오나?")
      })
      }
      setShowAlert(true);
    })
    .send((err) => {
      if (err) console.log(err)
      
    })
        setLoading(true)
        try{
          console.log("들어오나?")
        await axios.post(`${process.env.REACT_APP_LOCAL_URL}file/loader/upload/one`,null, {
          params:{
            file_ID: unique_id4 ,
            user_ID: sessionStorage.getItem('id'),
            file_Extension: "."+fileExt,
            real_File_Name: e.dataTransfer.files[0].name,
            path: sessionStorage.getItem("id")+"/" + unique_id4  + "/" +  unique_id4 + "."+fileExt,
         }
        
      })
          .then(res => {
              console.log(res);
              console.log("닉네임: ", res.data);
              console.log(typeof res.data);
              if(res.data == null || res.data == undefined || res.data == ""){
                  alert("파일 DB 업로드 실패");
                  console.log("들어오나?")
              } else{
                  console.log(res.data);
                  alert("DB 업로드 성공하셨습니다.");
                  console.log("들어오나?")
              }

          })
          .catch(function (error){
          console.log(error);
          console.log("들어오나?")
      })

  }
  catch(error){
    console.log(error);
  }

  
  }

  //로컬에서 파일을 올릴떄
  async function oneImglocalfile(e){
        console.log("들어오나?")

        const fileExt =  e.dataTransfer.files[0].name.split('.').pop();
        // setLoading(true)
        
              //s3 저장
        const params = {
          ACL: 'public-read',
          Body:  e.dataTransfer.files[0],
          Bucket: S3_BUCKET,
          //사용자id / 파일 uid로 파일 디렉토리 생성 / 파일 uid.jpg
          Key: sessionStorage.getItem("id")+"/" +  e.dataTransfer.files[0].uid + "/" +  e.dataTransfer.files[0].uid + "."+fileExt
      };

        myBucket.putObject(params)
        .on('httpUploadProgress', (evt) => {
          
          console.log(evt);
          setProgress(Math.round((evt.loaded / evt.total) * 100))
          console.log(e.dataTransfer.files[0])
          if(Math.round((evt.loaded / evt.total) * 100) === 100){
            axios.post(`${process.env.REACT_APP_LOCAL_URL}file/loader/detect/objects`,null, {
              params:{
                file_ID: JSON.parse(sessionStorage.getItem('Droppedfiles'))[0].uid,
              }
            
          })
              .then(res => {
                  console.log(res);
                  console.log("닉네임: ", res.data);
                  console.log(typeof res.data);
                  if(res.data == null || res.data == undefined || res.data == ""){
                      alert("파일 DB 업로드 실패");
                      console.log("들어오나?")
                  } else{
                      console.log(res.data);
                      console.log("들어오나?")
                  const fileExt1 =  res.data.split('.').pop();
                  if(fileExt1 ==="png"){
                  
                    navigate("/imgpage");
                    window.location.reload();
                  }
                  else if(fileExt1 ==="jpg"){
                  
                    navigate("/imgpage");
                  
                    window.location.reload();
                  }
                  else if(fileExt1 ==="jpeg"){
                  
                    navigate("/imgpage");
                  
                    window.location.reload();
                  }
                  
                  else if(fileExt1 ==="mp4"){
                  
                    navigate("/videopage");
                  
                    window.location.reload();
                  }
        
                  }
        
              })
              .catch(function (error){
              console.log(error);
              console.log("들어오나?")
              alert("파일을 다시 올려주세요");
              window.location.reload();
          })
          }
          setShowAlert(true);
        })
        .send((err) => {
          if (err) console.log(err)
        })
        
            setLoading(true)
            try{
             
              console.log("들어오나?")
            await axios.post(`${process.env.REACT_APP_LOCAL_URL}file/loader/upload/one`,null, {
              params:{
                file_ID: e.dataTransfer.files[0].uid,
                    user_ID: sessionStorage.getItem('id'),
                    file_Extension: "."+fileExt,
                    real_File_Name:e.dataTransfer.files[0].name,
                    path: sessionStorage.getItem("id")+"/" + e.dataTransfer.files[0].uid + "/" +e.dataTransfer.files[0].uid + "."+fileExt,
                 }
            
          })
              .then(res => {
                  console.log(res);
                  console.log("닉네임: ", res.data);
                  console.log(typeof res.data);
                  if(res.data == null || res.data == undefined || res.data == ""){
                      alert("파일 DB 업로드 실패");
                      console.log("들어오나?")
                  } else{
                      console.log(res.data);
                      // alert("DB 업로드 성공하셨습니다.");
                      console.log("들어오나?")
                  }
        
              })
              .catch(function (error){
              console.log(error);
              console.log("들어오나?")
          })
        
        }
        catch(error){
        console.log(error);
        }
        
        
        
        

      
  }
  
    function ManyImglocalfile(e){
    setLoading(true)
    console.log("아니")
    for(var i=0;i<e.dataTransfer.files.length;i++){
      console.log("아니 3번도나?")
      console.log("sss", e.dataTransfer);
      console.log( "4545465",e.dataTransfer.files.length);
      console.log( "5",e.dataTransfer.files[i]);
      const size = e.dataTransfer.files.length;
      const fileExt =  e.dataTransfer.files[i].name.split('.').pop();
      if(fileExt ==='jpg' || fileExt ==='jpeg' || fileExt ==='png'){
       
            //  db 에 파일 정보 저장
        axios.post(`${process.env.REACT_APP_LOCAL_URL}file/loader/upload/one`,null, {
              params:{
                  file_ID:  e.dataTransfer.files[i].uid,
                  user_ID: sessionStorage.getItem('id'),
                  file_Extension: "."+fileExt,
                  real_File_Name: e.dataTransfer.files[i].name,
                  group_ID:sessionStorage.getItem("group") ,
                  path: sessionStorage.getItem("id")+"/" + sessionStorage.getItem("group")  + "/" +  e.dataTransfer.files[i].uid + "."+fileExt,
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
                      console.log("iiiiiiiiiiiiiiii",i);
                      console.log("eeeeeeeeeeeeeeee",size);
                      // if(i === size){
                      // navigate('/manyimage')
                      // window.location.reload();
                      // }
                  }
  
              })
              .catch(function (error){
              console.log(error);
          })
      
    }
    }
      
  }

  const props = {
    
    name: 'file',
    multiple: true,
    beforeUpload(info) {
        console.log("ww777",info);
       
        
    },
    onDrop(e) {
      sessionStorage.setItem('Droppedfiles', JSON.stringify(e.dataTransfer.files));
      console.log('333',e.dataTransfer.files);
      //비로그인 작업 시 uuid 랜덤으로 주기
        if(sessionStorage.getItem('id')==null){
          const unique_id = uuid();
          const small_id = unique_id.slice(0,8) //uuid
          sessionStorage.setItem('id',small_id)
        }
        //비로그인 시 작업중 일때와 로그인 했을 경우 
        else{
          sessionStorage.setItem('id',sessionStorage.getItem('id'));
          console.log('sese',sessionStorage.getItem('file'));
          }
        sessionStorage.setItem('file', JSON.stringify(files));


      //한장의 파일만 올릴때
      if( e.dataTransfer.files.length === 1){
        
        console.log("들어오나?")
        //로컬에서 사진올릴때 
        if(e.dataTransfer.files[0].uid !== undefined ){
          console.log("들어오나?")
          oneImglocalfile(e)
        }
        //인터넷 올릴때 
        else{
          oneImgbrowserfile(e)
        }
      }
     
      //여러장의 파일을 올릴때 
      else{
        var stack = 0;
        var stackres = 0;
        for(var i=0;i<e.dataTransfer.files.length;i++){
        const fileExt =  e.dataTransfer.files[i].name.split('.').pop();
        if(fileExt ==='jpg' || fileExt ==='jpeg' || fileExt ==='png'){

        const params = {
          ACL: 'public-read',
          Body:  e.dataTransfer.files[i],
          Bucket: S3_BUCKET,
          //사용자id / 파일 uid로 파일 디렉토리 생성 / 파일 uid.jpg
          Key: sessionStorage.getItem("id")+"/" +  sessionStorage.getItem("group") + "/" +  e.dataTransfer.files[i].uid + "."+fileExt
        };
        
        myBucket.putObject(params)
          .on('httpUploadProgress', (evt) => {
            // console.log(evt);
            setProgress(Math.round((evt.loaded / evt.total) * 100))
            setShowAlert(true);
            
            if(Math.round((evt.loaded / evt.total) * 100) === 100){
              stack = stack + 1;
              const x = JSON.parse(sessionStorage.getItem('Droppedfiles'))
              const l = Object.keys(x).length
              if(stack === l-1){
              
              
              console.log("xxxxxxxxx",l)
              // for(var i =0; i<JSON.parse(sessionStorage.getItem('Droppedfiles')).length; i++){
                for(var j=0;j<l;j++){
                  console.log("xxxxxxi",i)
                  console.log("xxxxxxj",j)
               axios.post(`${process.env.REACT_APP_LOCAL_URL}file/loader/detect/objects`,null, {
                params:{
                  file_ID: JSON.parse(sessionStorage.getItem('Droppedfiles'))[j].uid,
                }
                
              
            })
                .then(res => {
                    
                    console.log(res);
                    console.log("닉네임: ", res.data);
                    console.log(typeof res.data);
                    if(res.data == null || res.data == undefined || res.data == ""){
                        alert("파일 DB 업로드 실패");
                        console.log("들어오나?")
                    } else{
                        console.log(res.data);
                        
                        stackres = stackres + 1;
                        console.log("stackres",stackres)
                        console.log("들어오나?")
                        if(stackres === l){
                        navigate('/manyimage')
                        window.location.reload();
                        }
          
                    }
          
                })
                .catch(function (error){
                console.log(error);
                console.log("들어오나?")
            })

                }
              



            }
          }
          })
          .send((err) => {
            if (err) console.log(err)
            
          })
        }
      }
        ManyImglocalfile(e);
    }
    },
  };

  return (
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
              <h3 style={{ whiteSpace: "nowrap", color: '#148CFF', marginBottom:'50px'}}>해당 파일의 객체를 인식중입니다. </h3>
            </div>
          </div>
    </div>
          :
    
    <div>
    
    <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text" style={{fontSize:'20px', marginBottom:'20px'}}>Click or drag file to this area to upload</p>
    <p className="ant-upload-hint" style={{fontSize:'18px'}}>
      Support for a single or bulk upload. Strictly prohibit from uploading company data or other
      band files
    </p>
  </Dragger>
       
    </div>
}
</>
  );
}