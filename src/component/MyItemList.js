import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Link } from '@mui/material';

const MyItemList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://vigorous-poised-staircase.glitch.me/items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  return (
    <Grid container spacing={3} sx={{ padding: 3 }}>
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
              <Link component={RouterLink} to={`/item/${item.id}`}>
                View Details
              </Link>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MyItemList;