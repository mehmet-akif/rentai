import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

export const getListings = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/listings`, { params });
  return response.data;
};

export const getListingInsights = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/listings/${id}/insights`);
  return response.data;
};

export const getListingById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/listings/${id}`);
  return response.data;
};

export const getSimilarListings = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/listings/${id}/similar`);
  return response.data;
};

export const getPriceIntelligence = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/listings/${id}/price-intelligence`);
  return response.data;
};


export const createListing = async (listingData) => {
  const response = await axios.post(`${API_BASE_URL}/listings`, listingData);
  return response.data;
};