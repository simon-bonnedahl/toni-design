import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

const OrderHistory = () => {
  //fetch orders which the user has made
  const { data: session } = useSession();
  const { data, isLoading, isError } = trpc.user.getOrders.useQuery({
    email: session?.user?.email || "",
  });
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Orderhistorik</h1>
      {data.length === 0 && <p>Du har inte gjort några beställningar</p>}
      {data?.map((order: any, key: number) => (
        <div key={key}>
          <p>Order #{order._id}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
