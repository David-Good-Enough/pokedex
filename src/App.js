import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/header';
import Page1 from './components/page1/pages1';
import './App.css';

function App() {
  return (
    <Router>
      <div className="full-page-background">
        <Header />
          <Routes>
            <Route path="/" element={<Page1 />} />
        
          </Routes>  
      </div>
    
    
    
    
    </Router>
  );
}

export default App;
