import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Slider,
} from '@mui/material';
import { Save as SaveIcon, ContentCopy as CopyIcon } from '@mui/icons-material';
import axios from 'axios';
import { saveAs } from 'file-saver';

function App() {
  const [content, setContent] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [numCards, setNumCards] = useState(5);
  const [flippedCards, setFlippedCards] = useState({});

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError('Please enter some content first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/generate-cards', {
        content,
        num_cards: numCards,
      });
      setCards(response.data.cards);
      setFlippedCards({});
    } catch (err) {
      setError('Failed to generate flashcards. Please try again.');
    }
    setLoading(false);
  };

  const handleExport = () => {
    const text = cards
      .map((card, index) => `Card ${index + 1}:\nQ: ${card.question}\nA: ${card.answer}\n`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'flashcards.txt');
  };

  const toggleCard = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Flashcard Generator
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Enter your educational content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Typography gutterBottom>Number of Cards: {numCards}</Typography>
        <Slider
          value={numCards}
          onChange={(_, value) => setNumCards(value)}
          min={1}
          max={10}
          marks
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerate}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Flashcards'}
        </Button>
      </Box>

      {cards.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleExport}
            sx={{ mb: 2 }}
          >
            Export Flashcards
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {cards.map((card, index) => (
          <Card
            key={index}
            sx={{
              cursor: 'pointer',
              transform: 'perspective(1000px)',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              transform: flippedCards[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
            onClick={() => toggleCard(index)}
          >
            <CardContent
              sx={{
                backfaceVisibility: 'hidden',
                transform: flippedCards[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {flippedCards[index] ? 'Answer' : 'Question'}
              </Typography>
              <Typography variant="body1">
                {flippedCards[index] ? card.answer : card.question}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App; 