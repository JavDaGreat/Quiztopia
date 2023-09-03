import {useState} from 'react'
import QuizShow from './QuizShow';

function QuizList() {
  const [quizes,setQuizes]=useState<Quiz[]|undefined>(undefined)
 
interface Location {
    longitude: string;
    latitude: string;
}

interface Question {
    question: string;
    answer: string;
    location: Location;
}

interface Quiz {
    questions: Question[];
    username: string;
    quizId: string;
    userId: string;
}

interface ApiResponse {
    success: boolean;
    quizzes: Quiz[];
}

const fetchQuizList = async()=>{
  const resp=await fetch("https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz")
  const data:ApiResponse= await resp.json()
  setQuizes(data.quizzes)
  
  

}


const content = quizes?.map((quiz)=>{
  console.log(quiz);
  
  
  return <QuizShow name={quiz.quizId} username={quiz.username} questions={quiz.questions}/>
})



  return (
    <div >
     {!content ? <p className='bg-gray-700 text-white rounded p-2 mx-auto text-center w-28 hover:cursor-pointer hover:bg-black ' onClick={fetchQuizList}>Show Quizes </p>: content}
      
    
    </div>
  )
}

export default QuizList