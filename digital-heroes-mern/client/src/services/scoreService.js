import api from "./api";

// Add a new golf score
export const addScore = async (scoreData) => {
    const response = await api.post("/scores", scoreData);

    return response.data;
};

// Get logged-in user's scores
export const getMyScores = async () => {
    const response = await api.get("/scores/my-scores");

    return response.data;
};

// Delete a score
export const deleteScore = async (scoreId) => {
    const response = await api.delete(`/scores/${scoreId}`);

    return response.data;
};