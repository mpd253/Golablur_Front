import React, {useEffect, useState,useRef} from "react";
import styled from "styled-components";
import { Gallery } from "react-grid-gallery";
import './Scroll.css';
import './button/EditButton.css';
import gsap from "gsap";
//imgpage에서 props받아옴


export default function Object (props){
  const handleScroll = event => {
    console.log('scrollTop: ', event.currentTarget.scrollTop);
    console.log('offsetHeight: ', event.currentTarget.offsetHeight);
  };
  
  //되는거
  const data=[];
  const formoon=()=>{
    console.log('2222',props.items.objectList[0].object_ID)
    { props.items.objectList.map((obitem,i)=>
      data.push({
        id: obitem.file_ID,
        obj_ID: obitem.object_ID,
        src:`${process.env.REACT_APP_AMAZON_URL}`+obitem.path,
        isSelected: false
          })
          )}
          
        }
    
            
            const [images, setImages] = useState(data);
            useEffect(() => {
              getData(images)
            }, [images]);
            
            const hasSelected = images.some((data) => data.isSelected);
 const handleSelect = (index) => {
   const nextImages = images.map((data, i) => i === index ? { ...data, isSelected: !data.isSelected }: data);
   setImages(nextImages);
      // getData(images)
      
    };
    const handleSelectAllClick = () => {
      const nextImages = images.map((image) => ({
        ...image,
        isSelected: !hasSelected,
  }));
     setImages(nextImages);
    //  getData(images)
 };



 let scrl = useRef(null);
 const [scrollX, setscrollX] = useState(0);
 const [scrolEnd, setscrolEnd] = useState(false);

 //Slide click
 const slide = (shift) => {
   scrl.current.scrollLeft += shift;
   setscrollX(scrollX + shift);

   if (
     Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <=
     scrl.current.offsetWidth
   ) {
     setscrolEnd(true);
   } else {
     setscrolEnd(false);
   }
 };

 //Anim
 const anim = (e) => {
   gsap.from(e.target, { scale: 1 });
   gsap.to(e.target, { scale: 1.5 });
 };
 const anim2 = (e) => {
   gsap.from(e.target, { scale: 1.5 });
   gsap.to(e.target, { scale: 1 });
 };

 const scrollCheck = () => {
   setscrollX(scrl.current.scrollLeft);
   if (
     Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <=
     scrl.current.offsetWidth
   ) {
     setscrolEnd(true);
   } else {
     setscrolEnd(false);
   }
 };
 
 const getData = (images) => {
  //자식에서 부모로 데이터 전달
  props.getData(images);
}
    return(
        <>
        {formoon()}
        {console.log(props.items.objectList)}
        {/* 인식된 객체가 없다면 */}
        { props.items.objectList.length !== 0?
        <>
        <button  class="w-btn w-btn-green" onClick={handleSelectAllClick}>
          {hasSelected ? "Clear selection" : "Select all"}
        </button>
        <div
        // class="wrap-vertical"
        style={{
        //   border: '3px solid black',
          width: '700px',
          height: '200px',
          overflow: 'scroll',
          color: 'white'
        }}
        onScroll={handleScroll}
      >
        
        <Gallery images={images} onSelect={handleSelect} width="100px" height="100px"/>
       </div>
      
       </>
      : 
      ""}
      
      </>
    );
}
