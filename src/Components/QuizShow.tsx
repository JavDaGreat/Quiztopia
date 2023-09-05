import React, { useRef, useEffect, useState } from 'react';
import mapboxgl,{Map as MapGl} from "mapbox-gl" 
import 'mapbox-gl/dist/mapbox-gl.css';
mapboxgl.accessToken = 'pk.eyJ1IjoiamF2ZGFncmVhdCIsImEiOiJjbGx6ZmYzajAxMG9rM2RzNjh5MmZpeWxuIn0.Yk2H02NbIBK4P1Yl0zFtwA';



import {BsChevronDown} from "react-icons/bs"

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




function QuizShow({name,username,questions}:QuizShowProps) {
  const mapContainer = useRef(null);
const mapRef = useRef<MapGl | null>(null);
const [lng, setLng] = useState<number>(10);
const [lat, setLat] = useState<number>(20);
const [zoom, setZoom] = useState<number>(9);


async function geoLocation(){

  return new Promise((resolve,reject)=>{
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error)
      )})}

      useEffect(() => {
        const fetchData = async () => {
            const { coords }: any = await geoLocation();
            setLat(coords?.latitude);
            setLng(coords?.longitude);
         
        };
      
        fetchData();
      }, []);


  const handleMapShow = ()=>{

    if( mapRef.current || !mapContainer.current ) return
  
    mapRef.current = new MapGl({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
    const map: MapGl = mapRef.current
  
    questions.forEach((q)=>{
    
      let marker= new mapboxgl.Marker().setLngLat([Number(q.location.longitude),Number(q.location.latitude)]).addTo(map).setPopup(
        new mapboxgl.Popup({ offset: 10 }) 
          .setHTML(
            `<h2>${q.question} </h2><p> svar: ${q.answer}</p>`
          ))

    })


  }










 


  


  return (
    <details className='p-4   bg-gray-200 max-w-lg mx-auto my-4'>
      <summary className='flex justify-between'><BsChevronDown className="hover:cursor-pointer" /> <span> quiz Name :&nbsp;{name}</span> <span> By&nbsp;:&nbsp;{username} </span>  </summary>
      <button className='bg-gray-700 hover:bg-black p-1 m-1 rounded-md text-white' onClick={handleMapShow}>Show map</button>
      <div ref={mapContainer} className="map-container" />

				<p> Center position: {lat} lat, {lng} lng </p>

    </details>
  )
}

export default QuizShow