
import 'react-awesome-button/dist/styles.css';
import React, {useEffect, useState} from "react";
import * as AWS from 'aws-sdk';
// import { PassThrough } from 'stream';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
function ManyDownloadButton(props){
  const urls =[]
  props.items.map((number, idx) => {
     urls.push(`${process.env.REACT_APP_AMAZON_URL}`+number.path)
})


  const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;
  const SECRET_ACCESS_KEY = process.env.REACT_APP_SECRET_ACCESS_KEY;
  const REGION = process.env.REACT_APP_REGION;
  const S3_BUCKET =  process.env.REACT_APP_S3_BUCKET;

  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY
  });
 

  async function handleDownloadClick() {
   console.log('downlossad',urls)
   const saveZip = (filename, urls) => {
      if(!urls) return;

      const zip = new JSZip();
      const folder = zip.folder("files"); // folder name where all files will be placed in 

      urls.forEach((url) => {
          const blobPromise = fetch(url).then((r) => {
              if (r.status === 200) return r.blob();
              return Promise.reject(new Error(r.statusText));
          });
          const name = url.substring(url.lastIndexOf("/") + 1);
          folder.file(name, blobPromise);
      });

      zip.generateAsync({ type: "blob" }).then((blob) => saveAs(blob, filename));

  };
  saveZip("download.zip", urls);
}
    return(
        <>
        
        <button 
        class="w-btn-outline w-btn-green-outline" 
        type="button"
        onClick={handleDownloadClick}
             >
              <img src="img/down-arrow.png" width="18" height="18"/>&nbsp;
              다운로드</button>
          
     
        </>
    );
}
export default ManyDownloadButton;