import React, {useEffect, useState} from "react";
import Carousel from 'react-bootstrap/Carousel';
import './Gallery.css';

export default function Gallery (props){


    return(
      <>
       <Carousel slide={true}>
       {props.items.map((it)=>
      <Carousel.Item>
      
      <img
          width="100%"
          height="100%"
          maxWidth="400px"
          src={it.image}
          alt="First slide"
          
        />
        
       <Carousel.Caption>
          {/* <h3>{it.caption}</h3> */}
          <p>{it.caption}</p>
          </Carousel.Caption>
          
      </Carousel.Item>
      )}
    </Carousel>
      </>
      

    );
}