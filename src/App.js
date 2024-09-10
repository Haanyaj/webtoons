import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';
import axios from 'axios';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://vigorous-poised-staircase.glitch.me/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleBackClick = () => {
    setSelectedItem(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My App
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        {selectedItem ? (
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {selectedItem.nom}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Chapitre: {selectedItem.chapitre}
              </Typography>
              <Button onClick={handleBackClick} variant="contained" color="primary">
                Back to List
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {item.nom}
                    </Typography>
                    <Typography color="text.secondary">
                      Chapitre: {item.chapitre}
                    </Typography>
                    <Button onClick={() => handleItemClick(item)}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;