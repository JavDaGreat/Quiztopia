import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LoginFrom from './Components/LoginFrom'
import QuizList from './Components/QuizList'

function App() {

  return (
    <div>
      <header>
      <LoginFrom/>
      <h1 className='font-bold text-lg p-2 m-2 text-center'>Welcome to Quiztopia</h1>
      </header>
      <main>
        <QuizList/>
      </main>
    

    </div>
 
  )
}

export default App
