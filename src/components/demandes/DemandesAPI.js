import axios from "axios";

const API_URL = "https://67719603ee76b92dd49017b3.mockapi.io/louriga2mehdi/Demandes";

class DemandesAPI {
  // Get all demandes
  static async getAll() {
    try {
      console.log("Fetching demandes from:", API_URL);
      const response = await axios.get(API_URL);
      console.log("Demandes received:", response.data.length, "items");
      return response.data;
    } catch (error) {
      console.error("Error fetching demandes:", error);
      throw error;
    }
  }

  // Create new demande
  static async create(demande) {
    try {
      console.log("Creating demande:", demande);
      const response = await axios.post(API_URL, demande);
      console.log("Demande created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating demande:", error);
      throw error;
    }
  }

  // Update demande
  static async update(id, updates) {
    try {
      console.log(`Updating demande ${id}:`, updates);
      const response = await axios.put(`${API_URL}/${id}`, updates);
      console.log("Demande updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating demande:", error);
      throw error;
    }
  }

  // Delete demande
  static async delete(id) {
    try {
      console.log(`Deleting demande ${id}`);
      await axios.delete(`${API_URL}/${id}`);
      console.log("Demande deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting demande:", error);
      throw error;
    }
  }

  // Get single demande by ID
  static async getById(id) {
    try {
      console.log(`Fetching demande ${id}`);
      const response = await axios.get(`${API_URL}/${id}`);
      console.log("Demande found:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching demande:", error);
      throw error;
    }
  }

  // Get demandes by user ID
  static async getByUserId(userId) {
    try {
      console.log(`Fetching demandes for user ${userId}`);
      const response = await axios.get(API_URL);
      const userDemandes = response.data.filter(d => d.userId === userId);
      console.log("User demandes found:", userDemandes.length, "items");
      return userDemandes;
    } catch (error) {
      console.error("Error fetching user demandes:", error);
      throw error;
    }
  }
}

export default DemandesAPI;