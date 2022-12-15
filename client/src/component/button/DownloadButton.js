
import 'react-awesome-button/dist/styles.css';
import React, {useEffect, useState} from "react";
import AWS from 'aws-sdk';
function DownloadButton(props){
 


  const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;
  const SECRET_ACCESS_KEY = process.env.REACT_APP_SECRET_ACCESS_KEY;
  const REGION = process.env.REACT_APP_REGION;
  const S3_BUCKET =  process.env.REACT_APP_S3_BUCKET;

  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY
  });

  const handleDownload = () => {
    const s3 = new AWS.S3();
    
    
    s3.getObject(
        { Bucket:S3_BUCKET, Key: props.items.path },
        function (error, data) {
            if (error != null) {
                alert("Failed to retrieve an object: " + error);
        } else {
          //나중에 경로에 reslut붙여야함
      fetch(`${process.env.REACT_APP_AMAZON_URL}`+props.items.path, { method: 'GET' })
      .then((res) => {
          console.log('test');
          return res.blob() // raw 데이터를 받아온다
          })
          .then((blob) => {
            console.log('text');
            console.log(blob);
            // alert(blob);
            const url = window.URL.createObjectURL(blob) // 받아온 날 상태의 data를 현재 window에서만 사용하는 url로 바꾼다
            const a = document.createElement('a')
            a.href = url
            a.download = props.items.real_File_Name// 원하는 이름으로 파일명 지정
            document.body.appendChild(a)
            a.click() // 자동으로 눌러버리기
            setTimeout((_) => {
              window.URL.revokeObjectURL(url) // 해당 url을 더 사용 못하게 날려버린다
            }, 1000)
            // s3.download("D:\create-react-app\nosanggwan\Client_Front\client\public\img",props.items.real_File_Name)
            a.remove() // a를 다 사용했으니 지워준다
          })
          .catch((err) => {
            console.error('err: ', err)
          })
          
        
            }
          }
      );
    

}

    return(
        <>
        
        <button 
        class="w-btn-outline w-btn-green-outline" 
        type="button"
        onClick={handleDownload}
             >
              <img src="img/down-arrow.png" width="18" height="18"/>&nbsp;
              다운로드</button>
          
     
        </>
    );
}
export default DownloadButton;