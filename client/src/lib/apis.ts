import { axiosInstance } from "./axiostInstance"

const createShortUrl = async (url: string) => {
    return await axiosInstance.post("/api/shorten", { url })
}

const getStatistics = async (shortCode: string) => {
    return await axiosInstance.get(`/api/stats/${shortCode}`)
}

export { createShortUrl, getStatistics };