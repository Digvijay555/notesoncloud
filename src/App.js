import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import NoteState from './context/notes/NoteState'


function App() {
  return (
    <div >
      <NoteState>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/home'element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
        </Routes>
      </BrowserRouter>
      </NoteState>


    </div>
  );
}

export default App;
