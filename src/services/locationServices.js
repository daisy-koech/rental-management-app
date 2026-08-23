// Nominatim for converting a typed location into coordinates.

const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search";

export async function geocodeArea(query) {
  const url =
    `${NOMINATIM_URL}?q=${encodeURIComponent(query + ", Kenya")}` +
    `&format=json&limit=1`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to reach location search.");
  }

  const data = await response.json();
  if (data.length === 0) {
    throw new Error(`No results found for "${query}".`);
  }

  return {
    name: data[0].display_name,
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}

