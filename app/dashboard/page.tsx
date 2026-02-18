import Protected from "@/components/protected";
import DashboardContainer from "@/components/dashboard/dashboard-container";

export default function DashboardPage() {
  return (
    <Protected>
      <main className="min-h-screen px-3 py-6 sm:px-6 sm:py-8 md:py-10">
        <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
          <DashboardContainer />
        </div>
      </main>
    </Protected>
  );
}