import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";

type TripMapProps = {
    latitude: number;
    longitude: number;
    destination: string;
    places?: MapPlace[];
    routes?: Record<number, [number, number][]>;
};

export type MapPlace = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    day: number;
};

const TripMap = ({
    latitude,
    longitude,
    destination,
    places = [],
    routes = {},
}: TripMapProps) => {

    const [selectedDay, setSelectedDay] = useState<number | "all">("all");

    const position: [number, number] = [latitude, longitude];

    const visiblePlaces =
        selectedDay === "all"
            ? places
            : places.filter((place) => place.day === selectedDay);

    const visibleRoutes =
        selectedDay === "all"
            ? Object.entries(routes)
            : Object.entries(routes).filter(
                ([day]) => Number(day) === selectedDay
            );

    const days = [...new Set(places.map((place) => place.day))].sort(
        (a, b) => a - b
    );
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "12px",
                }}
            >
                <button onClick={() => setSelectedDay("all")}>
                    Show All
                </button>

                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                    >
                        Day {day}
                    </button>
                ))}
            </div>
            <MapContainer
                center={position}
                zoom={12}
                style={{ height: "480px", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {places.length === 0 ? (
                    <Marker position={position}>
                        <Popup>{destination}</Popup>
                    </Marker>
                ) : (
                    visiblePlaces.map((place, index) => (
                        <Marker
                            key={place.id}
                            position={[place.latitude, place.longitude]}
                        >
                            <Popup>
                                <strong>
                                    {index + 1}. {place.name}
                                </strong>
                                <br />
                                Day {place.day}
                            </Popup>
                        </Marker>
                    ))
                )}

                {visibleRoutes.map(([day, coordinates]) => (
                    <Polyline
                        key={day}
                        positions={coordinates}
                    />
                ))}
            </MapContainer>
        </div>
    )
}
export default TripMap;