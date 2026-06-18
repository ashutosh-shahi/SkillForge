import api from "./axios";

export const getProfile = async (
  token: string
) => {
  const res = await api.get(
    "/users/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const updateProfile =
  async (
    token: string,
    profileData: any
  ) => {
    const res = await api.put(
      "/users/profile",
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  export const getPublicProfile =
  async (id: string) => {
    const response =
      await api.get(
        `/users/${id}`
      );

    return response.data;
  };