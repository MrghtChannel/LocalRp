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
          <SocialButton icon={PublicIcon} url="https://yoursite.com" />
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
          <Box key={item.id} sx={{ bgcolor: '#28283a', borderRadius: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: 250 }}>
            <img
              src={item.image ? baseUrl + item.image : defaultImage}
              alt={item.title}
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
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

const Content = ({ selectedServer, selectedTab, handleTabChange, servers }) => (
  <Box
    sx={{
      flexGrow: 1,
      bgcolor: '#1a1a2a',
      padding: { xs: 1, sm: 3 },
      height: '100vh',
      overflowY: 'hidden',
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
    {selectedTab === 0 && (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2, bgcolor: '#28283a' }}>
        <Button variant="contained" sx={{ backgroundColor: '#3b82f6' }}>
          Грати
        </Button>
        <Typography variant="h6" color="white">
          {servers[selectedServer]?.name || 'Сервер не выбран'}
        </Typography>
        <Typography variant="body1" color="gray">
          Онлайн: {servers[selectedServer]?.playersCount}/{servers[selectedServer]?.maxPlayersCount}
        </Typography>
      </Box>
    )}
    <Box sx={{ padding: 2, position: 'absolute', top: 'calc(50px + 56px)', width: '100%', height: 'calc(100vh - 100px)', overflowY: selectedTab === 1 ? 'auto' : 'hidden' }}>
      {selectedTab === 1 ? <NewsContent /> : null}
    </Box>
  </Box>
);

const App = () => {
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [servers, setServers] = useState([]);
  const localApiUrl = 'http://localhost:3000/api/server/server'; 
  const externalApiUrl = 'https://servers-frontend.fivem.net/api/servers/single';

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const localResponse = await fetch(localApiUrl);
        const localData = await localResponse.json();
        const localServers = localData.servers;

        const matchedServers = await Promise.all(
          localServers.map(async (localServer) => {
            const externalResponse = await fetch(`${externalApiUrl}/${localServer.ip_address}`);
            const externalData = await externalResponse.json();

            if (externalData && externalData.Data) {
              return {
                name: localServer.name,
                playersCount: externalData.Data.selfReportedClients,
                maxPlayersCount: externalData.Data.vars.sv_maxClients,
              };
            }

            return null;
          })
        );

        const validServers = matchedServers.filter((server) => server !== null);
        setServers(validServers);
      } catch (error) {
        console.error('Ошибка при загрузке серверов:', error);
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
