mapboxgl.accessToken = MAPTOKEN;//MAPTOKEN is defined in show.ejs because public foledr  cant access env file.
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
// Create a new marker.
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${listing.title}</h4>`))
    .addTo(map);

// Add geolocate control to the map.
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,

        // if showUserLocation is true , a transparent circle will be drawn around the user location indicating the accuracy (95% confidence level) of the user's location. 
        showUserLocation: true,
    })
);
