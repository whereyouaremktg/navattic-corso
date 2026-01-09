import { DemoProvider } from "@/lib/demo-context";
import { DemoLayout } from "@/components/demo/DemoLayout";
import { AdminDashboard } from "@/components/demo/admin/AdminDashboard";

export default function Home() {
  return (
    <DemoProvider>
      <DemoLayout variant="admin" activeModule="returns">
        <AdminDashboard />
      </DemoLayout>
    </DemoProvider>
  );
}
