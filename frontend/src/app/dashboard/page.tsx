import { requiredAdmin } from "@/lib/auth";

export default async function Dashboard() {
  const user = await requiredAdmin();
  console.log(user);
  return <div>Dashboard</div>;
}
