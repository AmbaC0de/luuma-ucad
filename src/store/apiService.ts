import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";
import { RootState } from ".";
import { API_URL } from "@src/config/env";

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      body?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, body, params, headers }, { getState }) => {
    try {
      // const token = (getState() as RootState).auth.token;
      const result = await axios({
        url: baseUrl + url,
        method,
        data: data || body,
        params,
        headers: {
          ...headers,
          // ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const api = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: ["Tontine", "Tontines", "TontineParticipants", "Contributions"],
  endpoints: () => ({}),
  keepUnusedDataFor: 5 * 60, // 5 minutes
});
