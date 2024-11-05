import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Typography,
  Divider,
  IconButton,
  CircularProgress,
  Dialog,
  DialogContent,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import PublicIcon from '@mui/icons-material/Public';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ForumIcon from '@mui/icons-material/Forum';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
const SocialButton = ({ icon: Icon, url }) => (
  <IconButton sx={{ color: 'white' }} onClick={() => window.electron.openExternalLink(url)}>
    <Icon />
  </IconButton>
);

const Sidebar = ({ servers, selectedServer, handleServerSelect, handleTabChange }) => {
  const totalOnline = servers.reduce((acc, server) => acc + server.playersCount, 0);

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: 250 },
        height: '100vh',
        bgcolor: '#151520',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <img
          src="./src/assets/logo.png"
          alt="LocalRp"
          style={{ marginBottom: 20, width: 100, height: 100, objectFit: 'contain' }}
        />
        <Typography variant="h6" color="white" gutterBottom>
          Список серверів
        </Typography>
        <Typography color="gray" sx={{ marginBottom: 2 }}>
          Гравців онлайн: {totalOnline}
        </Typography>
        {servers.map((server, index) => (
          <Button
            key={index}
            variant={selectedServer === index ? 'contained' : 'outlined'}
            onClick={() => {
              handleServerSelect(index);
              handleTabChange(null, 0);
            }}
            sx={{
              mb: 1,
              width: '100%',
              justifyContent: 'space-between',
              color: 'white',
              borderColor: '#3b82f6',
            }}
          >
            {server.name}
            <Typography color="gray">{server.playersCount}/{server.maxPlayersCount}</Typography>
          </Button>
        ))}
      </Box>
      <Box>
        <Divider sx={{ borderColor: '#28283a' }} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            paddingTop: 2,
            paddingBottom: 4,
            flexWrap: 'wrap',
          }}
        >
          <SocialButton icon={FacebookIcon} url="https://facebook.com" />
          <SocialButton icon={ForumIcon} url="https://forum.localhost.com" />
          <SocialButton icon={YouTubeIcon} url="https://youtube.com" />
          <SocialButton icon={PublicIcon} url="http://localhost:8000/" />
        </Box>
      </Box>
    </Box>
  );
};

const NewsContent = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const defaultImage = './src/assets/bg.png';
  const baseUrl = 'http://localhost:3000';
  const discordUrl = 'https://discord.gg';

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/news');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleBannerClick = () => {
    window.electron.openExternalLink(discordUrl);
  };

  return (
    <Box
      sx={{
        padding: 2,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 2,
        paddingRight: 7,
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 100px)',
      }}
    >
      <Typography variant="h4" color="white" gutterBottom sx={{ gridColumn: 'span 3' }}>
        Новини
      </Typography>
      {loading ? (
        <Box sx={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress color="primary" />
        </Box>
      ) : news.length === 0 ? (
        <Typography variant="body1" color="gray" sx={{ gridColumn: 'span 3' }}>
          Немає новин
        </Typography>
      ) : (
        news.map((item) => (
          <Box
            key={item.id}
            sx={{ bgcolor: '#28283a', borderRadius: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: 250 }}
            onClick={handleBannerClick}
          >
            <img
              src={item.image ? baseUrl + item.image : defaultImage}
              alt={item.title}
              style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
            />
            <Box sx={{ padding: 1, flexGrow: 1 }}>
              <Typography variant="h6" color="white" noWrap>
                {item.title}
              </Typography>
              <Typography variant="body2" color="gray" sx={{ marginTop: 1 }}>
                {new Date(item.date).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

const HomeContent = ({ selectedServer, servers }) => {
  const server = servers[selectedServer];

  return (
    <Box
      sx={{
        backgroundColor: '#1f2937',
        padding: 3,
        borderRadius: 2,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        maxWidth: 800,
        margin: '450px auto 0',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{
            zIndex: 10,
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: 'bold',
            paddingX: 2,
            paddingY: 1,
            '&:hover': {
              backgroundColor: '#2563eb',
            },
          }}
          onClick={() => {
            const serverIp = server?.ip_address;
            if (serverIp) {
              window.electron.connectToServer(serverIp);
            } else {
              console.error('IP адреса сервера не знайдена або сервер не вибраний.');
            }
          }}
          disabled={!server} 
        >
          Грати
        </Button>

        <Typography variant="h6" color="white" sx={{ textAlign: 'center', flex: 1 }}>
          {server ? server.name : 'Сервер не вибраний'}
        </Typography>

        <Typography variant="body2" color="gray">
          Онлайн: {server?.playersCount || 0}/{server?.maxPlayersCount || 0}
        </Typography>
      </Box>
    </Box>
  );
};

const Content = ({ selectedServer, selectedTab, handleTabChange, servers }) => (
  <Box
    sx={{
      flexGrow: 1,
      bgcolor: '#1a1a2a',
      padding: { xs: 1, sm: 3 },
      height: '100vh',
      position: 'relative',
    }}
  >
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #28283a' }}>
      <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
        <Tabs value={selectedTab} onChange={handleTabChange} textColor="inherit">
          <Tab label="Головна" sx={{ color: 'white' }} />
          <Tab label="Новини" sx={{ color: 'white' }} />
        </Tabs>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ color: 'white' }} onClick={() => window.electron.minimizeApp()}>
            <MinimizeIcon />
          </IconButton>
          <IconButton sx={{ color: 'white' }} onClick={() => window.electron.closeApp()}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
    
    {selectedTab === 0 && <HomeContent selectedServer={selectedServer} servers={servers} />}
    
    <Box sx={{ padding: 2, position: 'absolute', top: 'calc(50px + 56px)', width: '100%', height: 'calc(100vh - 100px)', overflowY: selectedTab === 1 ? 'auto' : 'hidden' }}>
      {selectedTab === 1 ? <NewsContent /> : null}
    </Box>
  </Box>
);



const App = () => {
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [servers, setServers] = useState([]);
  const localApiUrl = 'http://localhost:3000/api/server'; 
  const externalApiUrl = 'https://servers-frontend.fivem.net/api/servers/single';

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const localResponse = await fetch(localApiUrl);
        const localData = await localResponse.json();
        const localServers = localData.servers || [];
  
        const matchedServers = await Promise.all(
          localServers.map(async (localServer) => {
            try {
              const externalResponse = await fetch(`${externalApiUrl}/${localServer.ip_address}`);
              const externalData = await externalResponse.json();
              return externalData && externalData.Data
                ? {
                    name: localServer.name,
                    ip_address: localServer.ip_address,
                    playersCount: externalData.Data.selfReportedClients,
                    maxPlayersCount: externalData.Data.vars.sv_maxClients,
                  }
                : null;
            } catch {
              return null;
            }
          })
        );
  
        const validServers = matchedServers.filter((server) => server !== null);
        setServers(validServers);
      } catch (error) {
        console.error('Помилка під час завантаження серверів:', error);
      }
    };
  
    fetchServers();
  }, [localApiUrl]);  

  const handleServerSelect = (index) => {
    setSelectedServer(index);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar servers={servers} selectedServer={selectedServer} handleServerSelect={handleServerSelect} handleTabChange={handleTabChange} />
      <Content selectedServer={selectedServer} selectedTab={selectedTab} handleTabChange={handleTabChange} servers={servers} />
    </Box>
  );
};

export default App;
