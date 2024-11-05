document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.image-item');
    images.forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.style.filter = 'none';
        });

        image.addEventListener('mouseleave', function() {
            this.style.filter = 'grayscale(100%)';
        });
    });

    let servers = [];
    let totalPlayers = 0;

    const fetchServers = () => {
        fetch('http://localhost:3000/api/server')
            .then(response => response.json())
            .then(data => {
                if (data.servers && data.servers.length) {
                    servers = data.servers.map(server => ({
                        ip: server.ip_address 
                    }));
                    servers.forEach((server, index) => {
                        fetchServerData(server, index + 1); 
                    });
                } else {
                    console.error('Список серверів порожній або не вдалося отримати дані з API.');
                }
            })
            .catch(error => {
                console.error('Помилка при отриманні серверів:', error);
            });
    };
    
    const fetchServerData = (server, index) => {
        fetch(`https://servers-frontend.fivem.net/api/servers/single/${server.ip}`)
            .then(response => response.json())
            .then(data => {
                const serverId = `server${index}`;
                const onlineCountElement = document.getElementById(`${serverId}-online-count`);

                if (data && data.Data) {
                    const serverData = data.Data;
                    const onlinePlayers = serverData.selfReportedClients;
                    const maxPlayers = serverData.vars.sv_maxClients;

                    if (onlineCountElement) {
                        onlineCountElement.textContent = `${onlinePlayers} / ${maxPlayers}`;
                    } else {
                        console.error(`Елемент для ${serverId}-online-count не знайдено`);
                    }
                    totalPlayers += onlinePlayers;
                } else {
                    if (onlineCountElement) {
                        onlineCountElement.textContent = 'Немає даних';
                    }
                }
                updateTotalPlayers();
            })
            .catch(error => {
                console.error(`Помилка при отриманні даних для server${index}:`, error);
                const onlineCountElement = document.getElementById(`server${index}-online-count`);
                if (onlineCountElement) {
                    onlineCountElement.textContent = 'Помилка';
                }
                updateTotalPlayers();
            });
    };

    const updateTotalPlayers = () => {
        document.querySelector('.online-count-unique .count').textContent = totalPlayers;
    };

    fetchServers();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/api/news")
        .then((response) => response.json())
        .then((data) => {
            const newsList = document.getElementById("news-list");
            data.slice(0, 3).forEach((newsItem) => {
                const imageUrl = newsItem.image
                    ? (newsItem.image.startsWith('/uploads') ? `http://localhost:3000${newsItem.image}` : newsItem.image)
                    : './img/bg.png';
                    
                const newsElement = document.createElement("div");
                newsElement.className = "news-item";
                newsElement.innerHTML = `
                    <img src="${imageUrl}" alt="Новина">
                    <button class="read-btn">Читати</button>
                `;
                newsList.appendChild(newsElement);
            });
        })
        .catch((error) => console.error("Помилка завантаження новин:", error));
});
