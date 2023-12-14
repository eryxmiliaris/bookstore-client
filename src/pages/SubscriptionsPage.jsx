import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import axios from "../util/axios";
import { useAuth } from "../features/auth/AuthContext";

import Spinner from "../components/Spinner";
import ErrorPage from "../components/ErrorPage";
import SubscriptionItem from "../features/subscriptions/SubscriptionItem";

function SubscriptionsPage() {
  const {
    data: subscriptions,
    isLoading: isLoadingSubscriptions,
    error: subscriptionsError,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async function () {
      const response = await axios.get(`/subscriptions`);
      return response.data;
    },
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const { mutate: order, isLoading: isOrdering } = useMutation({
    mutationFn: (id) => {
      return axios.post(`subscriptions/order/${id}`);
    },
    onSuccess: (response) => {
      window.location.href = response.data.message;
    },
    onError: (err) => toast.error(err.response.data.message),
  });
  const handleOrder = async (id) => {
    if (!user) {
      navigate("/signin");
      return;
    }
    order(id);
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const orderState = searchParams.get("orderState");
  const { mutate: confirmPayment } = useMutation({
    mutationFn: () => {
      return axios.post("/subscriptions/confirmPayment");
    },
    onSuccess: () => {
      window.location.replace("/profile");
    },
    onError: (err) => {
      console.log(err);
      setSearchParams({});
    },
  });

  useEffect(() => {
    if (orderState === "paymentSuccess") {
      confirmPayment();
    }
  }, [orderState, confirmPayment]);

  if (orderState === "paymentSuccess" || isLoadingSubscriptions) {
    return <Spinner />;
  }

  if (subscriptionsError) {
    return <ErrorPage error={subscriptionsError} />;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="my-4 text-center text-4xl font-semibold">Subscriptions</h1>
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        {subscriptions.map((sub) => (
          <SubscriptionItem
            key={sub.id}
            subscription={sub}
            handleOrder={handleOrder}
            isOrdering={isOrdering}
          />
        ))}
      </div>
    </div>
  );
}

export default SubscriptionsPage;
