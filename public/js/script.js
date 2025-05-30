const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('send location', {
            latitude: latitude,
            longitude: longitude
        },(error) => {
            if(error){
                return console.log('Error sending location:', error);
            }
            console.log('Location shared successfully');
        },{
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        }
    );
    })
}

const map = L.map('map').setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Soumyajit Khan & Contributors',
}).addTo(map);

const markers = {};
socket.on('recieve location', (data) => {
    const { id, latitude, longitude } = data;
    
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
    
    map.setView([latitude, longitude]);
});

socket.on('user disconnected', (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
    console.log(`User with ID ${id} disconnected`);
})