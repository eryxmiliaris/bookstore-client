import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../util/axios";

export function useAddToCart() {
  const queryClient = useQueryClient();

  const { mutate: addToCart, isLoading: isAdding } = useMutation({
    mutationFn: ({ bookId, bookType, paperBookId }) => {
      return axios.post("/cart", {
        bookId,
        bookType,
        paperBookId,
      });
    },
    onSuccess: () => {
      toast.success("Book successfully added to your cart!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return { isAdding, addToCart };
}
