import Protected from "@/components/protected";
import DashboardContainer from "@/components/dashboard/dashboard-container";

export default function DashboardPage() {
  return (
    <Protected>
      <main className="min-h-screen px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl pb-8 font-semibold">
              
            </h1>
            
          </div>

          <DashboardContainer />
        </div>
      </main>
    </Protected>
  );
}
