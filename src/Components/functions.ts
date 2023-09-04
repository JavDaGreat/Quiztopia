
interface ApiResponse{
  message?:string,
  success:boolean,
  token?:string
  quizId?:string
}




const handleSignUp = async(username:string,password:string,setOpen:React.Dispatch<React.SetStateAction<boolean>>,setMessage)=>{
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

  const handleLogin =async(username,password,setOpen,setMessage,setToken,setDisplayName)=>{
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
      setDisplayName(`Hi,${username}`)
      if (!data.token) return 
      setToken(data.token)
    } else{
      setMessage("Password or username not valid")
    }} 

    const handleCreateQuiz = async (token:string,quizName:string,setCheckQuiz)=>{
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

export{handleLogin,handleSignUp,handleCreateQuiz,handleCreateQuestions}