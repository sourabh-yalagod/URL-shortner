import { axiosInstance } from "./axiostInstance";


// Create a new short link
const createShortUrl = async (original_url: string, short_code?: string) => {
  return await axiosInstance.post("/api/links", {
    original_url,
    short_code,
  });
};

// Get all links
const getAllLinks = async () => {
  return await axiosInstance.get("/api/links");
};

// Get statistics for a specific short code
const getStatistics = async (code: string) => {
  return await axiosInstance.get(`/api/links/${code}`);
};

// Delete a link
const deleteLink = async (code: string) => {
  return await axiosInstance.delete(`/api/links/${code}`);
};

export { createShortUrl, getAllLinks, getStatistics, deleteLink };