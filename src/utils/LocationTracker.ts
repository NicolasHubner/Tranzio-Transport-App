import axios from "axios";

export const UpdateStatusUserLocation = async (
  userId: string,
  status: boolean,
) => {
  try {
    const { data } = await axios.post(
      `${process.env.API_BASE_URL_LOCATION}/user/updateStatus/${userId}`,
      {
        status,
      },
    );
    console.log("return", data);
    return data;
  } catch (error) {
    throw error;
  }
};
