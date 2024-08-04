document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('video-modal-overlay');
    const modalContent = document.querySelector('.video-modal-content');
    const closeButton = document.querySelector('.close-button');
    const playButtons = document.querySelectorAll('.play-button-unique');

    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video');
            document.getElementById('video-frame').setAttribute('src', videoUrl);
            modal.style.display = 'block';
        });
    });

    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
        document.getElementById('video-frame').setAttribute('src', '');
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.getElementById('video-frame').setAttribute('src', '');
        }
    });

    const images = document.querySelectorAll('.image-item');
    images.forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.style.filter = 'none';
        });

        image.addEventListener('mouseleave', function() {
            this.style.filter = 'grayscale(100%)';
        });
    });

    const servers = [
        { id: 'server1', ip: 'start.unrealrp.com.ua:22005' },
        { id: 'server2', ip: 'english.gtahub.gg:22005' },
        { id: 'server3', ip: 'nami.swat-gw.de:22005' }
    ];

    let totalPlayers = 0; 

    const fetchServerData = (server) => {
        fetch('https://cdn.rage.mp/master/')
            .then(response => response.json())
            .then(data => {
                const serverElement = document.getElementById(`${server.id}-status`);
                const onlineCountElement = document.getElementById(`${server.id}-online-count`);

                if (data && data[server.ip]) {
                    const serverData = data[server.ip];
                    onlineCountElement.textContent = `${serverData.players} / ${serverData.maxplayers}`;
                    totalPlayers += serverData.players; 
                } else {
                    onlineCountElement.textContent = 'Немає даних';
                }
                updateTotalPlayers(); 
            })
            .catch(error => {
                console.error(`Помилка при отриманні даних для ${server.id}:`, error);
                const onlineCountElement = document.getElementById(`${server.id}-online-count`);
                onlineCountElement.textContent = 'Помилка';
                updateTotalPlayers(); 
            });
    };

    const updateTotalPlayers = () => {
        document.querySelector('.online-count-unique .count').textContent = totalPlayers;
    };

    servers.forEach(fetchServerData);
});

document.addEventListener('DOMContentLoaded', function() {
    const registerButton = document.querySelector('.register-button-unique');
    const modalOverlay = document.getElementById('register-modal-overlay');
    const closeButton = modalOverlay.querySelector('.close-button');

    registerButton.addEventListener('click', function() {
        modalOverlay.style.display = 'flex';
    });

    closeButton.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    });
});
