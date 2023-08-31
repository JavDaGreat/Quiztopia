import {useState} from "react"
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';


function LoginFrom() {
  const[username,setUsername]=useState<string>("")
  const[password,setpassword]=useState<string>("")
  const [token, setToken] = useState<string>("") 
  const [open, setOpen] = useState<boolean>(false);
  const[message,setMessage] =useState<string>("")
  const[displayName,setDisplayName]= useState<string>("")




  interface LoginFormApi{
    message?:string,
    success:boolean,
    token?:string
  }

  const handleSignUp = async()=>{
    const resp = await fetch("https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup",{
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({username,password})
    })

    const data: LoginFormApi =await resp.json()
    console.log(data);


    if(data.success === true){
    
      setOpen(false)
      setMessage("")
    }else{
      setMessage("User already exist")
    }
  }
 
  const handleLogin =async()=>{
    const resp= await fetch("https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login",{
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({username,password})
      
    })
    const data:LoginFormApi = await resp.json()
    console.log(data);
    if(data.success === true){
      setOpen(false)
      setMessage("")
      setDisplayName(`Hi,${username}`)


    }
    else{
      setMessage("Password or username not valid")
    }
    

  }



  return (

    <div>
      {!displayName ?<button className="bg-gray-700 hover:bg-gray-950 text-white w-24 p-2 m-1 rounded-md" onClick={() => setOpen(true)}>
        Login
      </button>:<button className="bg-gray-700 hover:bg-gray-950 text-white w-24 p-2 m-1 rounded-md" onClick={()=>window.location.reload()}>Sign out</button>}
      
      <Modal open={open} onClose={() => {setOpen(false), setMessage("")} } center>
    
  <div className="w-full max-w-xs rounded-md">
 <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input onChange={e=>{setUsername(e.target.value)}} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"/>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="***********" onChange={e=>{setpassword(e.target.value)}}/>
        <p className="text-red-500 text-xs italic">{message}</p>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={handleLogin} className="bg-gray-700 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          Sign In
        </button>
        <button onClick={handleSignUp} className="bg-gray-700 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          Sign Up
        </button>
        
      </div>
    </form>
    </div>
   
  
  </Modal>
  </div>
  
  )
}

export default LoginFrom