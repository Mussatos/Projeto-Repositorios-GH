import { Routes, Route } from 'react-router-dom'

import Main from '../pages/Main'
import Repositorio from '../pages/Repositorio';

export default function RoutesApp(){
    return(
        <Routes>
            <Route path='/' element={<Main/>}/>
            <Route path='/repo/:repositorio' element={<Repositorio/>}/>
        </Routes>
    );
}