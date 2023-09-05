
interface ApiResponse{
  message?:string,
  success:boolean,
  token?:string
  quizId?:string
}




const handleSignUp = async(username:string,password:string,setOpen:React.Dispatch<React.SetStateAction<boolean>>,setMessage:React.Dispatch<React.SetStateAction<string>>)=>{
  const resp = await fetch("https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup",{
    method:"POST",
    headers:{"Content-Type": "application/json"},
    body:JSON.stringify({username,password})
  })

  const data: ApiResponse =await resp.json()
  if(data.success === true){
   setOpen(false)
    setMessage("")
  }else{
    setMessage("User already exist")
  } }

  const handleLogin =async(username:string,password:string,setOpen:React.Dispatch<React.SetStateAction<boolean>>,setMessage:React.Dispatch<React.SetStateAction<string>>,setToken:React.Dispatch<React.SetStateAction<string>>,setDisplayName:React.Dispatch<React.SetStateAction<string>>)=>{
    const resp= await fetch("https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login",{
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({username,password})
    })
    const data:ApiResponse = await resp.json()
    console.log(data);
    if(data.success === true){
      setOpen(false)
      setMessage("")
      setDisplayName(username)
      if (!data.token) return 
      setToken(data.token)
    } else{
      setMessage("Password or username not valid")
    }} 

    const handleCreateQuiz = async (token:string,quizName:string,setCheckQuiz:React.Dispatch<React.SetStateAction<boolean>>)=>{
      console.log(quizName);
      
      
      
      

      const resp = await fetch("https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz",{
        method:"POST",
        headers:{Authorization: `Bearer ${token}`},
        body: JSON.stringify({
          name: quizName,
        })
        
      }

      )
      const data:ApiResponse =await resp.json()
      console.log(data);
      
      if(!data.success){
        setCheckQuiz(true)
      }else{
        setCheckQuiz(false)
      }
      


    }
  
export{handleLogin,handleSignUp,handleCreateQuiz}