import axios from "axios";

export async function createPaymentLink(formData) {
  try {
    const res = await axios({
      method: "POST",
      url: `http://localhost:3030/order/create`,
      data: formData,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getListBank(){
    try {
        const res = await axios({
          method: "GET",
          url: `https://api.vietqr.io/v2/banks`,
          headers: {
            "Content-Type": "application/json",
          },
        });
        return res.data;
      } catch (error) {
        return error.response.data;
      }
}
export async function getOrder(orderId){
  try {
      const res = await axios({
        method: "GET",
        url: `http://localhost:3030/order/${orderId}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      return error.response.data;
    }
}
export async function cancelOrder(orderId){
  try {
      const res = await axios({
        method: "POST",
        url: `http://localhost:3030/order/${orderId}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      return error.response.data;
    }
}

