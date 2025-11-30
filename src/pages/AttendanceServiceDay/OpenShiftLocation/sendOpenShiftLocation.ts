import axios from "axios";

interface IInitShiftStart {
  latitude: string;
  longitude: string;
  idUser: string;
  nameUser: string;
}

export const sendOpenShiftLocation = async ({
  latitude,
  longitude,
  idUser,
  nameUser,
}: IInitShiftStart) => {
  if (!latitude || !longitude) {
    return;
  }

  const newObjectStartShift = {
    latitude: latitude,
    longitude: longitude,
    nameUser,
    idUserStrapi: idUser,
  };

  // console.log("newObjectStartShift", newObjectStartShift);
  try {
    const { data } = await axios.post(
      `${process.env.API_BASE_URL_LOCATION}/location/user`,
      newObjectStartShift,
    );
    console.log("enviou", data);
  } catch (error: any) {
    console.error("Error Sending Location User", error.message);
  }
};
