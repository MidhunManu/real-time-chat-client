import { Route, Routes } from 'react-router-dom';
import './App.css';
import Avatars from './components/Avatars';
import Home from './components/Home';
import Login from './components/Login';
import Message from './components/Message';
import Messager from './components/Messager';
import Signup from './components/Signup';

function App() {
  return (
	  <>
		<Routes>
			<Route path='/' element={<Login/>}></Route>
			<Route path='/signup' element={<Signup/>}></Route>
			<Route path='/avatars' element={<Avatars/>}></Route>
			<Route path='/home' element={<Home/>}></Route>
			<Route path='/message' element={<Message/>}></Route>
			<Route path='/test' element={<Messager/>}></Route>
		</Routes>
	  </>
  );
}

export default App;
