import { BrowserRouter } from 'react-router-dom';
import RoutesApp from './routes/routes';
import GlobalStyle from './styles/global';


function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <RoutesApp />
    </BrowserRouter>
  );
}

export default App;
