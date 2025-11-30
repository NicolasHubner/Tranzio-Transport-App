import { otkApi } from "../index";

interface OtkAuthResponse {
  accessToken: string;
}

export const otkApiFunctions = {
  otkLogin: async () => {
    try {
      const email = process.env.OTK_EMAIL;
      const password = process.env.OTK_PASSWORD;

      const result = await otkApi.post<OtkAuthResponse>("/autenticar", {
        email,
        password,
      });

      otkApi.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.data.accessToken}`;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  verificaEstoque: async (productId: string) => {
    try {
      await otkApiFunctions.otkLogin();
      const result = await otkApi.get(`/estoque/produto/${productId}`);
      return result.data.data;
    } catch (error) {
      console.error("erro >>>>>>>", error);
      throw error;
    }
  },
};
