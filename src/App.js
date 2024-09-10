import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, styled } from '@mui/material';
import { AppBar, Toolbar, Typography, Container, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#2c2c2c',
      paper: '#363636',
    },
    primary: {
      main: '#BB86FC',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const NeumorphicItem = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  boxShadow: '5px 5px 10px #2a2a2a, -5px -5px 10px #424242',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  position: 'relative',
  transition: 'box-shadow 0.3s ease-out',
}));

const NeumorphicButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: '2px 2px 5px #2a2a2a, -2px -2px 5px #424242',
  margin: theme.spacing(0, 0.5),
  transition: 'box-shadow 0.2s ease-out, transform 0.2s ease-out',
  '&:active': {
    boxShadow: 'inset 2px 2px 5px #2a2a2a, inset -2px -2px 5px #424242',
    transform: 'scale(0.95)',
  },
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    transition: 'box-shadow 0.3s ease-out',
    '&:hover': {
      boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.3)',
    },
  },
}));

function App() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemChapters, setNewItemChapters] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const filtered = items.filter(item => 
      item.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://vigorous-poised-staircase.glitch.me/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleChapterChange = async (id, change) => {
    try {
      const item = items.find(item => item.id === id);
      const updatedChapter = Math.max(1, item.chapitre + change);
      await axios.patch(`https://vigorous-poised-staircase.glitch.me/items/${id}`, { chapitre: updatedChapter });
      fetchItems();
    } catch (error) {
      console.error('Error updating chapter:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      await axios.post('https://vigorous-poised-staircase.glitch.me/items', { 
        nom: newItemName, 
        chapitre: parseInt(newItemChapters, 10) 
      });
      setNewItemName('');
      setNewItemChapters(1);
      setOpenDialog(false);
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await axios.delete(`https://vigorous-poised-staircase.glitch.me/items/${itemToDelete}`);
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'transparent' }}>
        <Toolbar>
          <Typography variant="h7" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            My Webtoons
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 2, height: 'calc(100vh - 128px)', overflow: 'auto', overflowX: 'hidden' }}>
        <SearchTextField
          fullWidth
          variant="outlined"
          placeholder="Search webtoons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
        {filteredItems.map((item) => (
          <NeumorphicItem key={item.id}>
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                padding: '4px',
              }}
              onClick={() => {
                setItemToDelete(item.id);
                setDeleteConfirmOpen(true);
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', wordBreak: 'break-word', mb: 1 }}>
                {item.nom}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Chapitre: {item.chapitre}
                </Typography>
                <Box>
                  <NeumorphicButton onClick={() => handleChapterChange(item.id, -1)}>
                    <RemoveIcon />
                  </NeumorphicButton>
                  <NeumorphicButton onClick={() => handleChapterChange(item.id, 1)}>
                    <AddIcon />
                  </NeumorphicButton>
                </Box>
              </Box>
            </Box>
          </NeumorphicItem>
        ))}
      </Container>
      <Fab 
        color="primary" 
        aria-label="add" 
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16, 
          boxShadow: '5px 5px 10px #2a2a2a, -5px -5px 10px #424242' 
        }} 
        onClick={() => setOpenDialog(true)}
      >
        <AddIcon />
      </Fab>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Webtoon</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Webtoon Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="chapters"
            label="Number of Chapters"
            type="number"
            fullWidth
            variant="outlined"
            value={newItemChapters}
            onChange={(e) => setNewItemChapters(e.target.value)}
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddItem} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this webtoon?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;