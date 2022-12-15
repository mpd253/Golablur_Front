import React, {useEffect, useState, useRef} from "react";
import styled from "styled-components";
import Card from '@mui/joy/Card';
import axios from 'axios';
import { renderMatches, useNavigate } from 'react-router-dom';
import {CircleLoading} from 'loplat-ui';
import { Stage, Layer, Image, Transformer, Circle, Rect } from "react-konva";
import useImage from "use-image";
import { v4 as uuid } from 'uuid';
import AWS, { DevOpsGuru } from 'aws-sdk';

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

const URLImage = ({
    image,
    shapeProps,
    unSelectShape,
    isSelected,
    onSelect,
    onChange,
    stageScale,
    onDelete
}) => {
const shapeRef = React.useRef();
const trRef = React.useRef();
const deleteButton = React.useRef();
const [img] = useImage(image.src, 'anonymous');

let x;
let y;

React.useEffect(() => {
    if (isSelected) {
    // we need to attach transformer manually
    trRef.current.nodes([shapeRef.current]);
    trRef.current.getLayer().batchDraw();
    }
}, [isSelected]);

const onMouseEnter = (event) => {
    if (isSelected) {
    event.target.getStage().container().style.cursor = "move";
    }
    if (!isSelected) {
    event.target.getStage().container().style.cursor = "pointer";
    }
};

const onMouseLeave = (event) => {
    event.target.getStage().container().style.cursor = "default";
};

const handleDelete = () => {
    unSelectShape(null);
    onDelete(shapeRef.current);
};

return (
    <React.Fragment>
    <Image
        image={img}
        x={image.x}
        y={image.y}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        // I will use offset to set origin to the center of the image
        offsetX={img ? img.width / 2 : 0}
        offsetY={img ? img.height / 2 : 0}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
        onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y()
        });
        }}
        onTransformEnd={(e) => {
        // transformer is changing scale of the node
        // and NOT its width or height
        // but in the store we have only width and height
        // to match the data better we will reset scale on transform end
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // we will reset it back
        node.scaleX(1);
        node.scaleY(1);
        onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY)
        });
        }}
    />
    {isSelected && (
        <Transformer
        ref={trRef}
        boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
            return oldBox;
            }
            return newBox;
        }}
        >
        <Circle
            radius={8}
            fill="red"
            ref={deleteButton}
            onClick={handleDelete}
            x={shapeRef.current.width() * stageScale}
        ></Circle>
        </Transformer>
    )}
    </React.Fragment>
    );
};

function ObjectEdit (){
   const navigate = useNavigate();
   const [file,setFile] = useState(JSON.parse(sessionStorage.getItem("objectfile")))
   const [obj,setObj] = useState(JSON.parse(sessionStorage.getItem("objectList")))
   const [loading,setLoading] = useState(false);
   const handleScroll = event => {
    console.log('scrollTop: ', event.currentTarget.scrollTop);
    console.log('offsetHeight: ', event.currentTarget.offsetHeight);
  };
  const dragUrl = React.useRef();
  const stageRef = React.useRef();
  const [images, setImages] = React.useState([]);
  const [selectedId, selectShape] = React.useState(null);



  
  const url = `${process.env.REACT_APP_AMAZON_URL}`+file.path;
  const [imgElement] = useImage(url, 'anonymous');

 
  const [stageSpec, setStageSpec] = useState({
      scale: 1,
      x: 0,
      y: 0
  });
  const handleWheel = (e) => {
      e.evt.preventDefault();

      const scaleBy = 1.1;
      const stage = e.target.getStage();
      const oldScale = stage.scaleX();
      const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
      };

      const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      
      setStageSpec({
      scale: newScale,
      x: (stage.getPointerPosition().x / newScale - mousePointTo.x) * newScale,
      y: (stage.getPointerPosition().y / newScale - mousePointTo.y) * newScale
      });
  };

  const handleRemove = (index) => {
      const newList = images.filter((item) => item.index !== index);

      setImages(newList);
  };

  const checkDeselect = (e) => {
      // deselect when clicked on empty area
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
      selectShape(null);
      }
  };

  const unSelectShape = (prop) => {
      selectShape(prop);
  };

  const onDeleteImage = (node) => {
      const newImages = [...images];
      newImages.splice(node.index, 1);
      setImages(newImages);
  };

  function downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
   
   async function del(){
    setLoading(true)
    const selects = [];
    for(var i=0;i<obj.length;i++){
        
        if(obj[i].isSelected === true){
            selects.push(obj[i].obj_ID)
        }
    }
    console.log("obj",selects)
    console.log("id",file.file_ID)
    const config = {"Content-Type": 'application/json'};
    const data={
        file_ID: file.file_ID,
        object_IDList:selects,
    }
         
    await axios.post(`${process.env.REACT_APP_LOCAL_URL}file/process/delete/one/image`, data,config)

        .then((res)=>{
            console.log(res.data);
            sessionStorage.setItem("objectfile",JSON.stringify(res.data));
            setLoading(false);
            window.location.reload();
        })
    }

    function dataURItoBlob(dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    }

    async function save(){
        // setLoading(true);

        const unique_id = uuid();
        const small_id = unique_id.slice(0,8) //uuid
        const fileExt = file.real_File_Name.split('.').pop();

        console.log('파일아이디', file.file_ID);
        console.log('스몰아이디', small_id);

        // s3 저장
        const uri = stageRef.current.toDataURL();
        console.log(uri);
        // downloadURI(uri, 'stage.png');
        const blobData = dataURItoBlob(uri);
        
        console.log('블롭데이터', blobData);

        const params = {
            Body: blobData,
            Bucket: S3_BUCKET,
            Key: sessionStorage.getItem("id")+"/" +  JSON.parse(sessionStorage.getItem('objectfile')).original_File_ID + "/result/" + small_id + "." + fileExt,
        }

        myBucket.upload(params, function(err, data) {
            if(err) { console.log(err, err.stack); }
            else { console.log(data) };
        });

      
        console.log('이거야', file.file_ID);
        await axios.post(`${process.env.REACT_APP_LOCAL_URL}file/loader/save/custom`, null, {
            params:{
                file_ID: small_id,
                user_ID: sessionStorage.getItem('id'),
                original_File_ID:JSON.parse(sessionStorage.getItem('objectfile')).file_ID,
                real_File_Name: JSON.parse(sessionStorage.getItem("objectfile")).real_File_Name,
                file_Extension: JSON.parse(sessionStorage.getItem("objectfile")).file_Extension,
                path: sessionStorage.getItem("id")+"/" + JSON.parse(sessionStorage.getItem('objectfile')).original_File_ID + "/result/" + small_id + "." + fileExt,
            }
        })
            .then((res)=>{
                console.log(res.data);
                setTimeout(() =>  navigate('/completepage'), 1000);
                // setLoading(false);
               
            })
        }
        
        console.log('스몰아이디 뭐 가짐?', JSON.parse(sessionStorage.getItem("objectfile")));
    function back(){
        navigate('/imgpage');
    }
   
   return(
        <Earth>
            <br/><br/><br/>
            {loading &&
            <>
                <CircleLoading
                aria-describedby="example"
                aria-labelledby="example"
                duration={1300}
                scale={1}
                zIndex={0}
                style={{ marginTop: "100px", marginBottom:"20px" }} />
                <div style={{marginTop:30}}>
                <h3 style={{ whiteSpace: "nowrap", color: '#148CFF' }}>해당 이미지의 객체를 삭제 중입니다. </h3>
                </div>
            </>}
            <b>객체 편집</b>
            <br/>
            <Card
            position="relative"
            variant="outlined"
            row
            sx={{
                width: 1000,
                gap: 2,
                borderColor: '#77af9c',
                border: '3px solid #77af9c',
                '&:hover': { boxShadow: 'md', borderColor: 'green' },
            }}
            >
            {console.log("ss",JSON.parse(sessionStorage.getItem("objectfile")))}
            <Gap>
            <div
            onDrop={(e) => {
            //   e.preventDefault();
              console.log("sssssss",e)
              // register event position
              stageRef.current.setPointersPositions(e);
              // add image
              setImages(
                images.concat([
                  {
                    ...stageRef.current.getRelativePointerPosition(),
                    src: dragUrl.current
                  }
                ])
              );
            }}
            onDragOver={(e) => e.preventDefault()}
          >
          <div id="container"></div>
            {console.log("images =", images)}
            <Stage
              className='box'
              width={512}
              height={512}
              ref={stageRef}
              onMouseDown={checkDeselect}
              onTouchStart={checkDeselect}
              style={{
                border: "1px solid grey",
                width:'512px',
                height: '512px',
              }}
              // draggable="true"
              scaleX={stageSpec.scale}
              scaleY={stageSpec.scale}
              x={stageSpec.x}
              y={stageSpec.y}
            //   onWheel={handleWheel}
            >
              <Layer>
                <Rect
                    width={512}
                    height={512}
                    fillPatternImage={imgElement}
                    fillPatternRepeat='no-repeat'
                    
                />
              </Layer>
              <Layer>
                {images.map((image, index) => {
                  return (
                    <URLImage
                      image={image}
                      key={index}
                      shapeProps={image}
                      stageScale={stageSpec.scale}
                      isSelected={image === selectedId}
                      unSelectShape={unSelectShape}
                      onClick={handleRemove}
                      onSelect={() => {
                        selectShape(image);
                      }}
                      onChange={(newAttrs) => {
                        const rects = images.slice();
                        rects[index] = newAttrs;
                        setImages(rects);
                      }}
                      onDelete={onDeleteImage}
                    />
                  );       
                })}
              </Layer>
            </Stage>
          </div>
            <List>
                <div>선택한 객체 리스트</div>
                <div
                    // class="wrap-vertical"
                    style={{
                    //   border: '3px solid black',
                    width: '200px',
                    height: '300px',
                    overflow: 'scroll',
                    color: 'white'
                    }}
                    onScroll={handleScroll}
                >
                <Objlist>
                {obj.map((item)=>
                    item.isSelected === true?
                    <>
                    <img 
                        src={item.src}
                        width="100" 
                        height="80"
                        draggable="true"
                        onDragStart={(e) => {
                            dragUrl.current = e.target.src;
                        }}
                    />&nbsp;&nbsp;&nbsp;&nbsp;
                    </>
                    :""
                )}
                </Objlist>
                </div>
            </List>
            
            
            

            <Butt>
                <button class="w-btn-outline w-btn-green-outline" type="button" onClick={()=>{del()}}>
                        <img src="img/scissor.png" width="18" height="18"/>&nbsp;
                        객체 삭제</button>
                <button class="w-btn-outline w-btn-green-outline" type="button" onClick={()=>{save()}}>
                        <img src="img/save.png" width="17" height="17"/>&nbsp;
                        완성본 가기</button>
            
                <button class="w-btn-outline w-btn-green-outline" type="button" onClick={()=>{back()}}>
                        <img src="img/return.png" width="17" height="17"/>&nbsp;
                        뒤로 가기</button>
            </Butt>
            </Gap>
            
        </Card>
        </Earth>
    );
}

export default ObjectEdit;

let Earth = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
let List = styled.div`
    display: flex;
    flex-direction: column;

`
let Gap = styled.div`
    display: flex;
    flex-direction: row;
    gap:160px;
`
let Objlist = styled.div`
 display: flex;
 flex-direction: row;
`
let Butt = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
`