import React, { useRef, useEffect, useState } from 'react';
import mapboxgl,{Map as MapGl} from "mapbox-gl" 
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = 'pk.eyJ1IjoiamF2ZGFncmVhdCIsImEiOiJjbGx6ZmYzajAxMG9rM2RzNjh5MmZpeWxuIn0.Yk2H02NbIBK4P1Yl0zFtwA';

import {BsChevronDown} from "react-icons/bs"
import { log } from 'console';

interface Question {
  question: string;
  answer: string;
  location: {
      longitude: string;
      latitude: string;
  }
}


interface QuizShowProps {

  name: string;
  username: string;
  questions: Question[]

}




function QuizShow(props:QuizShowProps) {
  const mapContainer = useRef(null);
const mapRef = useRef<MapGl | null>(null);
const [lng, setLng] = useState<number>(50);
const [lat, setLat] = useState<number>(42.35);
const [zoom, setZoom] = useState<number>(9);
async function geoLocation(){

  return new Promise((resolve,reject)=>{
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error)
    );
    
  })
  
  

}


 

  const handleMapShow = async()=>{
    const {coords}:any = await geoLocation()
    console.log(coords);
    
    setLng(coords.longitude)
    setLat(coords.latitude)
    if( mapRef.current || !mapContainer.current ) return
  
    mapRef.current = new MapGl({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
    const map: MapGl = mapRef.current
  
    map.on('move', () => {
      interface Position {
        lng: number;
        lat: number;
      }
      const position: Position = map.getCenter()
      setLat(Number(position.lat.toFixed(4)))
      setLng(Number(position.lng.toFixed(4)))
      setZoom(map.getZoom());
    })

    
  }










  const content=props.questions.map((question)=>{
    return <div>
      <p className='hover:cursor-pointer' onClick={handleMapShow}>{question.question}</p>
    </div>
  
  })


  


  return (
    <details className='p-4   bg-gray-200 max-w-lg mx-auto my-4'>
      <summary className='flex justify-between'><BsChevronDown className="hover:cursor-pointer" /> <span> quiz Name :&nbsp;{props.name}</span> <span> By&nbsp;:&nbsp;{props.username} </span>  </summary>
      {content}
      <div ref={mapContainer} className="map-container" />

				<p> Center position: {lat} lat, {lng} lng </p>

    </details>
  )
}

export default QuizShow