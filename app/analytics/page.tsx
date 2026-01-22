import Protected from "@/components/protected";
import AnalyticsContainer from "@/components/analytics/analytics-container";

export default function AnalyticsPage() {
  return (
    <Protected>
      <main className="min-h-screen px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-semibold">
              Analytics
            </h1>
            <p className="text-gray-400 mt-1">
              Overview of your link performance
            </p>
          </div>

          <AnalyticsContainer />
        </div>
      </main>
    </Protected>
  );
}
