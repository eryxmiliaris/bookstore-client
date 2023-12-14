import { useQuery } from "@tanstack/react-query";
import axios from "../../util/axios";

export function useBook(id) {
  const {
    data: book,
    isLoading,
    error,
  } = useQuery([`book${id}`], async () => {
    const response = await axios.get(`/books/${id}`);
    return response.data;
  });
  return { book, isLoading, error };
}
