import { useQuery } from "@tanstack/react-query";
import axios from "../../util/axios";

export function useWishlist() {
  const {
    data: wishlist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async function () {
      const response = await axios.get("/wishlist");
      return response.data;
    },
  });
  return { wishlist, isLoading, error };
}
