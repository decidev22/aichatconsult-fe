interface ConsultData {
  message: string;
}

const getConsult = async (data?: ConsultData) => {
  try {
    const response = await fetch("http://localhost:3000/consult", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // console.log(response);

    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getConsult;
