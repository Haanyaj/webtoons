import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import MyNavbar from './component/MyNavbar';
import MyItemList from './component/MyItemList';
import ItemDetail from './component/ItemDetail';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <MyNavbar />
        <Routes>
          <Route path="/" element={<MyItemList />} />
          <Route path="/item/:id" element={<ItemDetail />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;