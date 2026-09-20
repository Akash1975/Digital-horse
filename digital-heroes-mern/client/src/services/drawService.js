import api from "./api";

// Get all published draws
export const getPublishedDraws = async () => {
    const response = await api.get("/draws");

    return response.data;
};

// Get a single draw
export const getDrawById = async (drawId) => {
    const response = await api.get(`/draws/${drawId}`);

    return response.data;
};

// Enter a draw
export const enterDraw = async (drawId, entryData = {}) => {
    const response = await api.post(
        `/draws/${drawId}/enter`,
        entryData
    );

    return response.data;
};

// Get current user's draw entries
export const getMyEntries = async () => {
    const response = await api.get(
        "/draws/user/my-entries"
    );

    return response.data;
};