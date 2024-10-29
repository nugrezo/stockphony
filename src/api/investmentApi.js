import axios from "axios";
import apiUrl from "../apiConfig";

// Buy action (create or update an investment)
export const createInvestment = (investmentData, userToken) => {
  return axios({
    method: "POST",
    url: `${apiUrl}/buy`, // POST to /buy for creating an investment
    headers: {
      Authorization: `Token token=${userToken}`,
    },
    data: {
      investment: investmentData,
    },
  });
};

// Fetch all investments for the logged-in user
export const fetchInvestments = async (user) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${apiUrl}/investments`, // GET from /investments
      headers: {
        Authorization: `Token token=${user.token}`,
      },
    });
    return response.data.investments;
  } catch (error) {
    console.error("Failed to fetch investments:", error);
    throw error;
  }
};

// Sell shares of an investment
export const updateInvestment = (investmentId, updateData, userToken) => {
  return axios({
    method: "PATCH",
    url: `${apiUrl}/${investmentId}/sell`, // PATCH to /sell for selling
    headers: {
      Authorization: `Token token=${userToken}`,
    },
    data: {
      investment: updateData,
    },
  });
};

// Delete an investment record (if required)
export const deleteInvestment = (investmentId, userToken) => {
  return axios({
    method: "DELETE",
    url: `${apiUrl}/investments/${investmentId}`, // DELETE from /investments/:id
    headers: {
      Authorization: `Token token=${userToken}`,
    },
  });
};
