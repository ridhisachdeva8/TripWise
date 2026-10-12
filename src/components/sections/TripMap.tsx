import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

type TripMapProps ={
    latitude: number;
    longitude: number;
    destination: string;
};

const TripMap =({
    latitude,
    longitude,
    destination,
}:TripMapProps)=>{

    const position: [number, number] = [latitude, longitude];

    return (
       
        <MapContainer
        center={position}
        zoom={12}
        style={{height: "480px", width: "100%"}}
        >
            <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={position}>
                <Popup>{destination}</Popup>
            </Marker>
        </MapContainer>
    )
}
export default TripMap;