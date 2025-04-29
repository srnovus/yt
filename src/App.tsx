/**
 * Copyright (c) 2023 YouTube Music Downloader
 * Licensed under the AGPL-3.0 License
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Typography,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Home as HomeIcon,
  MusicNote as MusicIcon,
  Download as DownloadIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff0000',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#0f0f0f',
      paper: '#0f0f0f',
    },
  },
});

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleDownload = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/.netlify/functions/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al descargar el audio');
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      setAudioUrl(audioUrl);
      const newAudio = new Audio(audioUrl);
      setAudio(newAudio);

      // Obtener información del video
      const videoInfo = await fetch(`https://www.youtube.com/oembed?url=${url}&format=json`);
      const videoData = await videoInfo.json();
      setInfo(videoData);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `${info?.title || 'audio'}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              YouTube Music
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar música..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                  },
                }}
              />
              <IconButton 
                color="inherit" 
                onClick={handleDownload}
                disabled={loading || !url}
              >
                {loading ? <CircularProgress size={24} /> : <SearchIcon />}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 250, pt: 8 }}>
            <List>
              <ListItem button>
                <ListItemIcon><HomeIcon /></ListItemIcon>
                <ListItemText primary="Inicio" />
              </ListItem>
              <ListItem button>
                <ListItemIcon><MusicIcon /></ListItemIcon>
                <ListItemText primary="Música" />
              </ListItem>
            </List>
            <Divider />
          </Box>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
          <Container maxWidth="lg">
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {info && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card sx={{ backgroundColor: 'transparent' }}>
                    <CardMedia
                      component="img"
                      height="400"
                      image={info.thumbnail_url}
                      alt={info.title}
                    />
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        {info.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {info.author_name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <IconButton 
                          color="primary" 
                          onClick={togglePlay}
                          size="large"
                        >
                          {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </IconButton>
                        <IconButton 
                          color="primary" 
                          onClick={downloadAudio}
                          size="large"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 