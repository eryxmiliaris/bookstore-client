import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "../../util/axios";

import Button from "../../components/Button";
import ModalWindow from "../../components/ModalWindow";
import ReviewForm from "./ReviewForm";

function Review({ bookId, review, currentUser, isAdmin }) {
  const queryClient = useQueryClient();
  const { mutate: deleteReview, isLoading: isDeletingReview } = useMutation({
    mutationFn: (reviewId) => {
      return axios.delete(`/reviews/${reviewId}`);
    },
    onSuccess: () => {
      toast.success("Review has been succeffully deleted!");
      queryClient.invalidateQueries([`book${bookId}`]);
      queryClient.invalidateQueries([`reviews`]);
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  const [updateReviewOpen, setUpdateReviewOpen] = useState(false);
  const { mutate: updateReview, isLoading: isUpdatingReview } = useMutation({
    mutationFn: ({ reviewId, reviewRating, reviewText }) => {
      return axios.put(`/reviews/${reviewId}`, {
        rating: reviewRating,
        text: reviewText,
      });
    },
    onSuccess: () => {
      toast.success("Review has been succeffully updated!");
      setUpdateReviewOpen(false);
      queryClient.invalidateQueries([`book${bookId}`]);
      queryClient.invalidateQueries([`reviews`]);
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return (
    <li className="flex w-full flex-col-reverse items-center justify-between sm:flex-row">
      <p className="w-4/5">{review.text}</p>
      <div className="flex flex-col items-center">
        <p className="font-semibold">{review.userName}</p>
        <p className="text-gray-500">
          {new Date(review.publicationDate).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p>{review.rating}/10</p>
        {(isAdmin || currentUser?.username === review.userName) && (
          <>
            <Button
              type="red"
              className="mt-2"
              disabled={isDeletingReview}
              onClick={() => deleteReview(review.id)}
            >
              Remove
            </Button>
            <Button
              className="mt-2"
              disabled={isUpdatingReview}
              onClick={() => setUpdateReviewOpen(true)}
            >
              Edit
            </Button>

            <ModalWindow
              open={updateReviewOpen}
              onClose={() => setUpdateReviewOpen(false)}
            >
              <ReviewForm
                reviewId={review.id}
                onSubmit={updateReview}
                isLoading={isUpdatingReview}
                initialValues={{ rating: review.rating, text: review.text }}
              />
            </ModalWindow>
          </>
        )}
      </div>
    </li>
  );
}

export default Review;
