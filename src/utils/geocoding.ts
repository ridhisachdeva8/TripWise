export const getCoordinates = async (destination: string)=>{
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`
    );

    const data= await response.json();

    if(!data.length){
        throw new Error("Location not found");
    }

    return {
        latitude: Number(data[0].lat),
        longitude: Number(data[0].lon),
    };
};