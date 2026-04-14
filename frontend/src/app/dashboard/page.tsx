import { Orders } from "@/components/dashboard/orders";
import { getToken, requiredAdmin } from "@/lib/auth";

export default async function Dashboard() {
  await requiredAdmin();
  const token = await getToken();

  return <Orders token={token!} />;
}
