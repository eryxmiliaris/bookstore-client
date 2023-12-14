import { useQuery } from "@tanstack/react-query";
import axios from "../../util/axios";

export function useAddresses() {
  const {
    data: addresses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: async function () {
      const response = await axios.get("/addresses");
      return response.data;
    },
  });
  return { addresses, isLoading, error };
}
