



    maptilersdk.config.apiKey = key;

    const map = new maptilersdk.Map({
        container: "map",
        style: maptilersdk.MapStyle.STREETS,
        center:listing.geometry.coordinates,
        zoom: 10,
    });

    const popup = new maptilersdk.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title}</h4><p>Exact location will be provided after booking </p>`
    );

const homeIcon = document.createElement("div");
homeIcon.innerHTML = '<i class="fa-solid fa-house"></i>';

homeIcon.style.fontSize = "32px";
homeIcon.style.color = "#ff385c";   
homeIcon.style.cursor = "pointer";


const marker = new maptilersdk.Marker({element:homeIcon})
.setLngLat(listing.geometry.coordinates)
.setPopup(popup)
.addTo(map);