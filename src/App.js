import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/header';
import Page1 from './components/page1/page1';

function App() {
  return (
    <Router>
        <div style={{ backgroundColor: 'rgb(66, 71, 94)'}}>
        <Header />
          <Routes>
            <Route path="/" element={<Page1 />} />
        
          </Routes>  
      </div>
    
    
    
    
    </Router>
  );
}

export default App;
