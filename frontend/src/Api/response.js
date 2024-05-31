  export function handleResponse(response) {
    return response.data;
  }
  
  export function handleError(error) {
    if (error.response?.data) {
      let detail = error.response.data.detail
        ? error.response.data.detail
        : error.response.data;
      let resp = { detail: detail, status: error.response?.status };
      throw resp;
    }
    if (error.response) {
      throw error.response;
    }
    if (error.data) {
      throw error.data;
    }
    throw error;
  }
  