import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const ItemDetail = () => {
  const [item, setItem] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`https://vigorous-poised-staircase.glitch.me/items/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    fetchItem();
  }, [id]);

  if (!item) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {item.nom}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Chapitre: {item.chapitre}
          </Typography>
          <Button component={RouterLink} to="/" variant="contained" color="primary">
            Back to List
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ItemDetail;