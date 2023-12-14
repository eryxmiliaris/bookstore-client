import Button from "../../components/Button";

function SubscriptionItem({ subscription, handleOrder, isOrdering }) {
  const { id, name, durationDays, price, description } = subscription;

  return (
    <div className="my-4 flex h-[370px] w-full flex-col items-center justify-between gap-3 border border-violet-300 bg-violet-200 px-6 py-6">
      <p className="text-2xl font-semibold">{name}</p>
      <p className="text-2xl font-semibold">{durationDays} days</p>
      <p className="text-lg">{description}</p>
      <div className="flex w-full flex-col items-center gap-4">
        <p className="text-2xl">{price} PLN</p>
        <Button
          disabledText="Ordering..."
          disabled={isOrdering}
          onClick={() => handleOrder(id)}
        >
          Order now
        </Button>
      </div>
    </div>
  );
}

export default SubscriptionItem;
