import axios from "axios";

export interface ILocation {
  lat: number;
  long: number;
}

interface ISendData {
  latitude: string;
  longitude: string;
  pnaeIdStrapi: string[];
  idUser: string;
  nameUser: string;
}

interface ISendBackEndDataLocation {
  latitude: string;
  longitude: string;
  nameUser: string;
  idUserStrapi: string;
  pnaeIdStrapiArray: string[];
}

export const SendData = async ({
  latitude,
  longitude,
  pnaeIdStrapi,
  idUser,
  nameUser,
}: ISendData) => {
  if (!latitude || !longitude) {
    return;
  }

  const newObject: ISendBackEndDataLocation = {
    latitude: latitude,
    longitude: longitude,
    nameUser,
    idUserStrapi: idUser,
    pnaeIdStrapiArray: pnaeIdStrapi,
  };

  try {
    const { data } = await axios.post(
      `${process.env.API_BASE_URL_LOCATION}/location`,
      newObject,
    );

    console.log("enviou Localização com pnae", data);
  } catch (error: any) {
    console.error("Error Location Tracking", error.message);
  }
};
