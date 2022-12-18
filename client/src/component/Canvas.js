import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import rough from "roughjs/bundled/rough.esm";
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import axios from 'axios';
import AWS, { DevOpsGuru } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import './button/EditButton.css';
import {CircleLoading} from 'loplat-ui';
const Canvas = (props) => {
    const [status, setStatus] = useState(); // 0: draw 1: erase 2: text

    const [viewEdit, setViewEdit] = useState(false);
    const [viewDelete, setViewDelete] = useState(true);
    
    const [imageW, setImageW] = useState();
    const [imageH, setImageH] = useState();

    const [originImageW, setOriginImageW] = useState();
    const [originImageH, setOriginImageH] = useState();

    const [canWidth, setCanWidth] = useState();
    const [canHeight, setCanHeight] = useState();

    const [data, setData] = useState();
    const [loading,setLoading] = useState(false);
    const [objID, setObjID] = useState();
    const navigate = useNavigate();

    const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;
    const SECRET_ACCESS_KEY = process.env.REACT_APP_SECRET_ACCESS_KEY;
    const REGION = process.env.REACT_APP_REGION;
    const S3_BUCKET =  process.env.REACT_APP_S3_BUCKET;


    useEffect(() => {
        const unique_id = uuid();
        const small_id = unique_id.slice(0,8) //uuid
        sessionStorage.setItem("small_id", small_id);
    })

    AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY
    });

    const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
    });

    const generator = rough.generator();

    const canvasRef = useRef(null);
    const ctx = useRef(null);

    const canvasRefFront = useRef(null);
    const ctxFront = useRef(null);

    // 합치기
    const canvasRefSubmit = useRef(null);
    const ctxSubmit = useRef(null);

    const BASE_COLOR = "black";
    var isDrag = false;

    const useConfirm = (message = null, onConfirm, onCancel) => {
        if (!onConfirm || typeof onConfirm !== "function") {
          return;
        }
        if (onCancel && typeof onCancel !== "function") {
          return;
        }
      
        const confirmAction = () => {
          if (window.confirm(message)) {
            onConfirm();
          } else {
            onCancel();
          }
        };
      
        return confirmAction;
    };

    const drawCanvas = function () {
        const image = new Image();
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const whiteSpace = new Image();
        const canvasFront = canvasRefFront.current;
        const contextFront = canvasFront.getContext('2d');
        if (context) {
            image.crossOrigin = "Anonymous";
            image.src= `${process.env.REACT_APP_AMAZON_URL}`+props.cImg.file.path;

            var originImgW = image.naturalWidth;
            var originImgH = image.naturalHeight;
            setOriginImageW(originImgW);
            setOriginImageH(originImgH);

            image.onload = function () {
                // 이미지 크기 알아내기
                let inW = image.width;
                let inH = image.height;

                // console.log("이미지 크기", inW, inH);

                // 캔버스 기본 크기
                let canW = canvas.width;
                let canH = canvas.height;

                // 캔버스 크기 결정
                let reCanW = canvasRef.current.clientWidth;
                let reCanH = canvasRef.current.clientHeight;

                setCanWidth(reCanW);
                setCanHeight(reCanH);
                
                // 이미지 크기 조정
                let imgW;
                let imgH;
                let ratioW = reCanW / inW;
                let ratioH = reCanH / inH;
                // console.log("레이티오", ratioW, ratioH);

                if( reCanW >= inW ){
                    // console.log("캔버스 넓이 > 이미지 원본 넓이");
                    if( reCanH >= inH ){
                    // console.log("캔버스 높이 > 이미지 원본 높이");
                    imgW= inW
                    imgH= inH
                    } else {
                    // console.log("캔버스 높이 < 이미지 원본 높이");
                    imgW= inW * ratioH
                    imgH= reCanH
                    }
                } else {
                    // console.log("캔버스 넓이 < 이미지 원본 넓이");
                    if( reCanH >= inH ){
                    // console.log("캔버스 높이 > 이미지 원본 높이");
                    imgW= reCanW
                    imgH= inH * ratioW
                    } else {
                    // console.log("캔버스 높이 < 이미지 원본 높이");
                    if(ratioW > ratioH){
                        imgW= inW * ratioH
                        imgH= inH * ratioH
                    } else {
                        imgW= inW * ratioW
                        imgH= inH * ratioW
                    }
                    }
                }
                canvas.width = imgW;
                canvas.height = imgH;
                
                if(imgW > imgH) {
                    var ratio1 = imageH/imageW;
                    canvas.style.cssText = 'width:100%; height:'+parseInt(100*ratio1)+'%;'
                    // console.log("aaa");
                } else {
                    var ratio2 = imageW/imageH;
                    canvas.style.cssText = 'width:'+parseInt(100*ratio2)+'%; height:100%;, max-height:368px;'
                    // console.log("bbb");
                    // console.log("ratio2", ratio2);
                }

                setImageW(imgW);
                setImageH(imgH);

                context.clearRect(0, 0, canvas.width, canvas.height);
                // 비율 맞춰서 출력
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
            }
        } if (contextFront) {
            canvasFront.width = canWidth;
            canvasFront.height = canHeight;
            canvasFront.backgroundColor = "transparent";
        } else {
            throw new Error('Could not get context')
        }
    };

    let painting = false;

    const startPainting = ({ nativeEvent }) => {
        if(status === 2) return;

        const x = nativeEvent.offsetX;
        const y = nativeEvent.offsetY;
        painting = true; 
        
        // console.log("클릭", { x, y });
    };

    const stopPainting = () => { painting = false; };

    const onMouseMove = ({ nativeEvent }) => {
        if(status === 2 ){
            return;
        }
        const x = nativeEvent.offsetX;
        const y = nativeEvent.offsetY;
        // if (!ctx.current) return;
        if (!ctxFront.current) return;
        if (!painting) {
            // console.log("현재 마우스 좌표는", x, y);
            ctxFront.current.beginPath();
            ctxFront.current.moveTo(x, y);
        } else {
            // console.log("그린 좌표는", x, y);
            ctxFront.current.lineTo(x, y);
            ctxFront.lineCap = "round";
            ctxFront.lineJoin = "round";
            ctxFront.current.stroke();
        }
    };

    const handleColorClick = (e) => {
        ctx.current.strokeStyle = e.target.style.backgroundColor;
        ctxFront.current.strokeStyle = e.target.style.backgroundColor;
        ctx.current.fillStyle = e.target.style.backgroundColor;
        ctxFront.current.fillStyle = e.target.style.backgroundColor;
    };

    const handleRangeChange = (e) => {
        const size = e.target.value;
        ctx.current.lineWidth = size;
        ctxFront.current.lineWidth = size;
    };

    useEffect(() => {
        drawCanvas()
    })

    useEffect(() => {
        if (canvasRef.current) {
            ctx.current = canvasRef.current.getContext("2d");
            ctx.current.strokeStyle = BASE_COLOR;
            ctx.current.fillStyle = BASE_COLOR;
        }

        if (canvasRefFront.current) {
            ctxFront.current = canvasRefFront.current.getContext("2d");
            ctxFront.current.strokeStyle = BASE_COLOR;
            ctxFront.current.fillStyle = BASE_COLOR;
        }
    })

    const setToDraw = () => {
        // setStatus(0);
        // console.log("Draw 눌렀음");
        canvasRef.current.getContext('2d').globalCompositeOperation = "source-over";
        canvasRefFront.current.getContext('2d').globalCompositeOperation = "source-over";
        // canvasRefSee.current.getContext('2d').globalCompositeOperation = "source-over";
    }

    const setToErase = () => {
        // setStatus(1);
        // console.log("eraser 눌렀음");
        canvasRef.current.getContext('2d').globalCompositeOperation = "destination-out";
        canvasRefFront.current.getContext('2d').globalCompositeOperation = "destination-out";
        // canvasRefSee.current.getContext('2d').globalCompositeOperation = "destination-out";
    }

    const drawText = () => {
        // setStatus(2);
        // console.log("Text 눌렀음");
        var canvasTop = document.getElementById("canvasTop");
        var ctxTop = canvasTop.getContext('2d');

        // Variables to store mouseX, mouseY positions
        var mouseX = 0; 
        var mouseY = 0;
        var startingX = 0;

        // An Array to store every word
        var recentWords = [];
        // An array for backspace
        var undoList = [];
        // A function to save canvas state after every key press
        function saveState() {
            undoList.push(canvasTop.toDataURL());
        }

        // By default, save the canvas state first
        saveState();

        // A function to be called when backspace is pressed
        function undo() {
            undoList.pop();

            var imgData = undoList[undoList.length - 1];
            var image = new Image();

            // Display old saved state
            image.src = imgData;
            image.onload = function() {
                ctxTop.clearRect(0, 0, canvasTop.width, canvasTop.height);
                ctxTop.drawImage(image, 0, 0, canvasTop.width, canvasTop.height, 0, 0, canvasTop.width, canvasTop.height);
            }
        }

        canvasTop.addEventListener("click", function (e) {
            mouseX = e.offsetX;
            mouseY = e.offsetY;
            startingX = mouseX;
            // console.log("저 여기 눌렀어요!!", mouseX, mouseY);

            recentWords = [];
        }, false);

        // console.log("하이ㅇㅇㅇ");

        document.addEventListener("keydown", function (e) {
            // console.log("텍스트 나오세요!")
            ctxTop.font = "16px Arial";

            if(e.key === "Backspace" || e.key === 8) {
                console.log("백스페이스 눌렀음")
                // Backspace key
                undo();
                // Remove recent word
                var recentWord = recentWords[recentWords.length - 1];
                // Move the cursor back
                mouseX -= ctxTop.measureText(recentWord).width;
                recentWords.pop();
            } else if(e.key === "Enter") {
                // Enter key
                mouseX = startingX;
                mouseY += 20;
            } else {
                // Write text to canvas
                ctxTop.fillText(e.key, mouseX, mouseY );
                // Move cursor forward after every key press
                mouseX += ctxTop.measureText(e.key).width;

                saveState();
                recentWords.push(e.key);
            }
        })
    }

    const deleteConfirm = () => { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const canvasFront = canvasRefFront.current;
        const ctxFront = canvasFront.getContext('2d');
        ctxFront.clearRect(0, 0, canvasFront.width, canvasFront.height);
        // console.log("삭제했습니다.");
        setViewDelete(true);
        setViewEdit(false);
    }

    const cancelConfirm = () => {};
    
    const confirmDelete = useConfirm(
        "Edit to Delete.",
        deleteConfirm,
        cancelConfirm
    );
    
    const deleteConfirm2 = () => { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const canvasFront = canvasRefFront.current;
        const ctxFront = canvasFront.getContext('2d');
        ctxFront.clearRect(0, 0, canvasFront.width, canvasFront.height);
        // console.log("삭제했습니다.");
        setViewDelete(false);
        setViewEdit(true);
    }

    const cancelConfirm2 = () => {};
    
    const confirmDelete2 = useConfirm(
        "Delete to Edit.",
        deleteConfirm2,
        cancelConfirm2
    );

    function dataURItoBlob(dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    }

    function DownloadCanvas() {
        const canvas = canvasRef.current;
        const canvasFront = canvasRefFront.current;
        const canvasSubmit = canvasRefSubmit.current;
        const ctx = canvas.getContext('2d')
        const ctxFront = canvasFront.getContext('2d')
        const ctxSubmit = canvasSubmit.getContext('2d')
        
        let inW2 = imageW;
        let inH2 = imageH;
        
        let reCanW2 = originImageW;
        let reCanH2 = originImageH;
        // console.log("리캔", reCanW2, reCanH2);
            
        let imgW2;
        let imgH2;
        let ratioW2 = reCanW2 / inW2;
        let ratioH2 = reCanH2 / inH2;
            
        if(reCanW2 >= inW2) {
            if(reCanH2 >= inH2) {
                imgW2 = inW2;
                imgH2 = inH2;
            } else {
                imgW2 = inW2 * ratioH2;
                imgH2 = reCanH2;
            }
        } else {
            if(reCanH2 >= inH2) {
                imgW2 = reCanW2;
                imgH2 = inH2 * ratioW2;
            } else {
                if(ratioW2 > ratioH2) {
                    imgW2 = inW2 * ratioH2;
                    imgH2 = inW2 * ratioH2;
                } else {
                    imgW2 = inW2 * ratioW2;
                    imgH2 = inH2 * ratioW2;
                }
            }
        }
        canvasSubmit.width = originImageW;
        canvasSubmit.height = originImageH;
        
        // console.log("canvasDownload", canvasSubmit.width, canvasSubmit.height);
        
        if(imageW > imageH) {
            canvasSubmit.style.cssText = 'display:none; width:100%; height:auto%';
        } else {
            canvasSubmit.style.cssText = 'display:none; width:auto, height:100%';
        }
        // setDownloadW(imgW2);
        // setDownloadH(imgH2);
        
        // console.log("imgW2, imgH2", imgW2, imgH2);
        
        ctxSubmit.clearRect(0, 0, canvasSubmit.width, canvasSubmit.height);
        // 두 캔버스를 저장용 캔버스에 그린다 (먼저 그린쪽이 아래에 있는 레이어가 된다)
        
        // ctxSubmit.drawImage(canvas, 0, 0, imgW2, imgH2);
        // ctxSubmit.drawImage(canvasFront, 0, 0, imgW2, imgH2);
        
        ctxSubmit.drawImage(canvas, 0, 0, originImageW, originImageH);
        ctxSubmit.drawImage(canvasFront, 0, 0, originImageW, originImageH);
        
        // --------------------------------------------------------------------------
        const unique_id = uuid();
        const small_id = unique_id.slice(0,8) //uuid
        const fileExt =  props.cImg.file.real_File_Name.split('.').pop();

        setObjID(small_id);
        console.log("Download Canvas", objID);
        
        //s3 저장
        var dataUrl = canvasSubmit.toDataURL("images/jpg");
        
        console.log('데이터유알엘', dataUrl);
        var blobData = dataURItoBlob(dataUrl);
        
        var params = {
            Body: blobData,
            Bucket: S3_BUCKET,
            Key: sessionStorage.getItem("id")+"/" + JSON.parse(sessionStorage.getItem('objectfile')).file_ID+ "/result/" + sessionStorage.getItem("small_id") + "."+fileExt,
        };
        
        myBucket.upload(params, function(err, data) {
            if(err) { console.log(err, err.stack); }
            else { console.log(data) };
        });
        
        axios.post(`${process.env.REACT_APP_LOCAL_URL}file/loader/save/custom`, null, {
            params:{
                file_ID: sessionStorage.getItem("small_id"),
                user_ID: sessionStorage.getItem('id'),
                original_File_ID: props.cImg.file.file_ID,
                real_File_Name: props.cImg.file.real_File_Name,
                file_Extension: "."+fileExt,
                path: sessionStorage.getItem("id")+"/" +  JSON.parse(sessionStorage.getItem('objectfile')).file_ID+ "/result/" + sessionStorage.getItem("small_id") + "."+fileExt,
            }
        })
        .then((res) => {
            console.log(res.data);
            setTimeout(() => navigate('/completepage'), 2000);
        })

    }
        
     function AiApiDownload() {
        setLoading(true);
        const canvas = canvasRef.current;
        console.log("오냐?????????????//");
        const ctx = canvas.getContext('2d');
        const canvasFront = canvasRefFront.current;
        const ctxFront = canvasFront.getContext('2d');
        const canvasSubmit = canvasRefSubmit.current;
        const ctxSubmit = canvasSubmit.getContext('2d')

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        canvasSubmit.width = originImageW;
        canvasSubmit.height = originImageH;

        if(imageW > imageH) {
            canvasSubmit.style.cssText = 'display:none; width:100%; height:60%';
        } else {
            canvasSubmit.style.cssText = 'display:none; width:60%, height:100%';
        }
        
        // console.log("캔버스서브밑", canvasSubmit.width, canvasSubmit.height);
        
        ctxSubmit.clearRect(0, 0, canvasSubmit.width, canvasSubmit.height);

        ctxSubmit.drawImage(canvas, 0, 0, originImageW, originImageH);
        ctxSubmit.drawImage(canvasFront, 0, 0, originImageW, originImageH);

        // var link = document.createElement('a');
        // link.download = 'filename.png';
        // link.href = canvasSubmit.toDataURL()
        // link.click();

         // --------------------------------------------------------------------------
        const unique_id = uuid();
        const small_id = unique_id.slice(0,8) //uuid
        const fileExt =  props.cImg.file.real_File_Name.split('.').pop();
        const objid = sessionStorage.getItem("small_id")
        console.log("AI/API", objID);

        
        
        //s3 저장
        var dataUrl = canvasSubmit.toDataURL("images/png");
        var blobData = dataURItoBlob(dataUrl);
        
        const params = {
            ACL: 'public-read',
            Body: blobData,
            Bucket: S3_BUCKET,
            Key: sessionStorage.getItem("id")+"/" +  props.cImg.file.file_ID + "/object/" +objid + "."+fileExt,
        };
        const params2 = {
            ACL: 'public-read',
            Body: blobData,
            Bucket: S3_BUCKET,
            Key: sessionStorage.getItem("id")+"/" +  props.cImg.file.file_ID + "/object/" +objid+'_mask'+ "."+fileExt,
        };
       
        myBucket.putObject(params2)
        .on('httpUploadProgress', (evt) => {

        })
        .send((err) => {
            if (err) console.log(err)
            
          })
        
        myBucket.putObject(params)
        .on('httpUploadProgress', (evt) => {
            console.log("progresss",Math.round((evt.loaded / evt.total) * 100))
                if(Math.round((evt.loaded / evt.total) * 100) === 100){
                    console.log("complete")
            
                const config = {"Content-Type": "application/json"};
                const datas = {
                    object_ID: objid,
                    file_ID:  props.cImg.file.file_ID,
                    user_ID: sessionStorage.getItem("id"),
                    object_Name: "deleteobj",
                    file_Extension:"."+fileExt,
                    path:sessionStorage.getItem("id")+"/" +  props.cImg.file.file_ID + "/object/" +  objid+ "."+fileExt,
                    xtl:"0",
                    ytl:"0",
                    xbr:originImageW,
                    ybr:originImageH,
                }
               axios.post(`${process.env.REACT_APP_LOCAL_URL}file/loader/save/custom/delete/object`, datas, config) 
                .then((res) => {
                    console.log(res.data);
                    console.log(objid);
                    const config2 = {"Content-Type": "application/json"};
                    const data2 = {
                        file_ID: props.cImg.file.file_ID,
                        object_IDList:[objid],
                    }
                    axios.post(`${process.env.REACT_APP_LOCAL_URL}file/process/delete/one/image`, data2, config2) 
                    .then((res) => {
                        console.log(res.data);
                        setLoading(false);
                        setTimeout(() => navigate('/completepage'), 2000);
                })
               })
        
               
            };
        })
        .send((err) => {
            if (err) console.log(err)
            
          })
        
    }

    return (
        <>
            <CanvasContainer>
                <FlexController>
                    <canvas style={{position:"absolute", maxWidth:"100%"}}
                        id="canvasBottom"
                        ref={canvasRef}
                    // onMouseMove={onMouseMove} 
                    // onMouseDown={startPainting}
                    // onMouseUp={stopPainting} 
                    // onMouseLeave={stopPainting}
                    >
                    </canvas>
                    <canvas style={{position:"absolute", opacity: "1", float:"left"}}
                        id="canvasTop"
                        ref={canvasRefFront}
                        onMouseMove={onMouseMove}
                        onMouseDown={startPainting}
                        onMouseUp={stopPainting}
                        onMouseLeave={stopPainting}
                    />
                    <canvas
                        style={{ display: 'none', position:'absolute' }}
                        id="canvasSubmit"
                        ref={canvasRefSubmit}
                    />
                </FlexController>
                <CanvasTools>
                    <div style={{width:"100%", paddingBottom:"15%"}}>
                    
                        <Button style={{width:"50%"}} onClick={confirmDelete}>객체 삭제</Button>
                        <Button style={{width:"50%"}} onClick={confirmDelete2}>그림판</Button>
                    </div>
                        {viewEdit && (
                            <> 
                            <div style={{display:'flex', flexDirection:'column', justifyContent:"space-between", height:"100%"}}>
                                <div style={{width:"100%"}}>
                                    <Button style={{width:"32%"}} onClick={setToDraw}>그리기</Button>
                                    <Button style={{width:"32%", marginRight:"2%", marginLeft:"2%"}} onClick={setToErase}>지우개</Button>
                                    <Button style={{width:"32%"}} onClick={drawText}>텍스트</Button>
                                </div>
                                <div className="controls__range">
                                    <h6>브러시 사이즈</h6>
                                    <input type="range" style={{width:"300px", maxWidth:"100%"}} min="5" max="20" defaultValue={"5"} onChange={handleRangeChange} step="0.1" />
                                </div>
                                <div>
                                    <Button onClick={handleColorClick} style={{ backgroundColor: "#ffffff", padding: 15, borderRadius: 25 }} />
                                    <Button onClick={handleColorClick} style={{ backgroundColor: "#ff0000", padding: 15, borderRadius: 25 }} />
                                    <Button onClick={handleColorClick} style={{ backgroundColor: "#ff8c00", padding: 15, borderRadius: 25 }} />
                                    <Button onClick={handleColorClick} style={{ backgroundColor: "#ffff00", padding: 15, borderRadius: 25 }} />
                                    <Button onClick={handleColorClick} style={{ backgroundColor: "#008000", padding: 15, borderRadius: 25 }} />
                                    <Button onClick={handleColorClick} style={{ backgroundColor: "#0000ff", padding: 15, borderRadius: 25 }} />
                                    <Button onClick={handleColorClick} style={{ backgroundColor: "#4b0082", padding: 15, borderRadius: 25 }} />
                                    <Button onClick={handleColorClick} style={{ backgroundColor: "#800080", padding: 15, borderRadius: 25 }} />
                                    <Button onClick={handleColorClick} style={{ backgroundColor: "#000000", padding: 15, borderRadius: 25 }} /><br />
                                </div>
                                <div>
                                    <Button onClick={DownloadCanvas} style={{width:"50%", borderRadius:"10px"}}>저장하기</Button>
                                    {/* <Button onClick={AiApiDownload}>AI/API</Button> */}
                                 </div>
                            </div>
                            </>
                        )}
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
                                    <h3 style={{ whiteSpace: "nowrap", color: '#148CFF', marginBottom:'50px'}}>편집중 입니다. </h3>
                                    </div>
                                </div>
                            </div>:
                        viewDelete && (
                            <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', height:"100%"}}>
                                <div style={{width:"100%"}}>
                                    <Button style={{width:"49%", marginRight:"2%"}} onClick={setToDraw}>그리기</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button style={{width:"49%"}} onClick={setToErase}>지우개</Button>
                                </div>
                                <div className="controls__range">
                                    <h6>브러시 사이즈</h6>
                                    <input type="range" style={{width:"300px", maxWidth:"100%"}} min="5" max="20" defaultValue={"5"} onChange={handleRangeChange} step="0.1" />
                                </div>
                                <div>
                                    <Button onClick={AiApiDownload} style={{width:"50%", borderRadius:"10px"}}>저장하기</Button>
                                    {/* <Button onClick={AiApiDownload}>AI/API</Button> */}
                                </div>
                            </div>
                        )}
                </CanvasTools>
            </CanvasContainer>
        </>
    )
}

export default Canvas;

const CanvasContainer = styled.div`
    display: flex;
    float: left;
    font-size: 0;
    width: 100%;
    height: 374px;
    /* border: 3px solid blue; */
`

const FlexController = styled.div`
    display: flex;
    float: left;
    flex-direction: column;
    position: relative;
    width: 100%;
    padding: 3%;
    height: 100%;
    justify-content: center;
    border-color: #F5F5F5;
    /* @media (max-width: 991px) {
        display: flex;
        flex-direction: column;
        position: relative;
    } */
`

const CanvasTools = styled.div`
    display: flex;
    flex-direction: column;
    float:left;
    padding: 0 3%;
    padding-top: 2%;
    position: relative; 
    width: 50%;
    height: 368px;
    text-align: center;
`