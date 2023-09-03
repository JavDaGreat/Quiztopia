import {useState,useRef,useEffect} from "react"
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import {AiOutlinePlus} from "react-icons/ai"
import { handleSignUp,handleLogin,handleCreateQuiz } from "./functions";
import mapboxgl,{Map as MapGl} from "mapbox-gl" 
import 'mapbox-gl/dist/mapbox-gl.css';
import { log } from "console";
mapboxgl.accessToken = 'pk.eyJ1IjoiamF2ZGFncmVhdCIsImEiOiJjbGx6ZmYzajAxMG9rM2RzNjh5MmZpeWxuIn0.Yk2H02NbIBK4P1Yl0zFtwA';


function LoginFrom() {



  const[username,setUsername]=useState<string>("")
  const[password,setpassword]=useState<string>("")
  const [token, setToken] = useState<string>("") 
  const [open, setOpen] = useState<boolean>(false);
  const[message,setMessage] =useState<string>("")
  const[displayName,setDisplayName]= useState<string>("")
  const[addquiz,setAddQuiz] =useState<boolean>(false); 
  const[quizName,setQuizName]=useState<string>("")
  const[checkQuizName,seCheckQuizName] =useState<boolean>(false);
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

        const handleMapShow = async ()=>{
         
          if( !mapContainer.current ) return
  
        
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


 

    
    const handleCreateQuestions=async()=>{
      const resp = await fetch("https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question",{
        method:"POST",
        headers:{Authorization: `Bearer ${token}`},
        body: JSON.stringify({
          name: "test007",
          question: "string",
          answer: "string",
          location: {
            longitude: "string",
            latitude: "string"
          }
        })
        
      }

      )
      const data:any =await resp.json()
      console.log(data);


    }
     
  return (

    <div>
      {!displayName ?<button className="bg-gray-700 hover:bg-gray-950 text-white w-24 p-2 m-1 rounded-md" onClick={() => setOpen(true)}>
        Login
      </button>:
      <div className="flex gap-12">
      <button className="bg-gray-700 hover:bg-gray-950 text-white w-24 p-2 m-1 rounded-md" onClick={()=>window.location.reload()}>Sign out</button>
      <button onClick={() => setAddQuiz(true)} className="flex gap-2 m-1  justify-center items-center bg-slate-600 text-white p-2  rounded-md"><AiOutlinePlus/> <p>Add new Quiz</p></button>
      </div>
      
      }
      
      <Modal open={open} onClose={() => {setOpen(false), setMessage("")} } center>
    
  <div className="w-full max-w-xs rounded-md">
 <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input onChange={e=>{setUsername(e.target.value)}} className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight " id="username" type="text" placeholder="Username"/>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input className="shadow  border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight " id="password" type="password" placeholder="***********" onChange={e=>{setpassword(e.target.value)}}/>
        <p className="text-red-500 text-xs italic">{message}</p>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={()=>handleLogin(username,password,setOpen,setMessage,setToken,setDisplayName)} className="bg-gray-700 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded " type="button">
          Sign In
        </button>
        <button onClick={()=>handleSignUp(username,password,setOpen,setMessage)} className="bg-gray-700 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded " type="button">
          Sign Up
        </button>
        <div ref={mapContainer} className="map-container" />

        
      </div>
    </form>
    </div>
   
  
  </Modal>
  <Modal open={addquiz} onClose={() => {setAddQuiz(false)} }  classNames={{
          
          modal: 'customModal',
        }}   center>
  <div className="w-full max-w-xs">
  <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="QuizName">
        Quiz Name
      </label>
      <input className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight " id="QuizName" type="text" placeholder="My quiz" onChange={e=>setQuizName(e.target.value)}/>
     
    </div>
    <button onClick={()=>handleCreateQuiz(token,quizName)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  m-2" type="button">
       Check Avialiblity      
       </button>
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Question">
        Question
      </label>
      <input className="shadow border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight " id="Question" type="text" placeholder="Here is the oldest church."/>
    </div>

    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Answer">
        Answer
      </label>
      <input className="shadow border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight " id="Answer" type="text" placeholder="Domkycrcka"/>
    </div>

    <p>Click to pin a locationon the Map</p>

   
 <button onClick={handleMapShow}
 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  m-2" type="button">
Show Map   </button>

<div ref={mapContainer} className="map-container" />
<p> Center position: {lat} lat, {lng} lng </p>

       
   
  </form>
  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  m-2" type="button">
Submit       
</button>
 
 
</div>
   
  </Modal>


  </div>
  
  )
}

export default LoginFrom