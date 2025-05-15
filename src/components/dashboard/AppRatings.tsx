import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";
import ReactApexChart from "react-apexcharts";

interface Rating {
  rating: number;
  comment: string;
  email: string;
  timestamp: any;
}

export default function AppRatings() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const ratingsSnapshot = await getDocs(collection(db, "app_ratings"));
        const ratingsData = ratingsSnapshot.docs.map(doc => ({
          ...doc.data()
        })) as Rating[];
        setRatings(ratingsData);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  // Calculate ratings statistics
  const totalRatings = ratings.length;
  const averageRating = totalRatings > 0 
    ? (ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings).toFixed(1)
    : "0.0";

  // Count ratings by star level
  const ratingCounts = {
    5: ratings.filter(r => r.rating === 5).length,
    4: ratings.filter(r => r.rating === 4).length,
    3: ratings.filter(r => r.rating === 3).length,
    2: ratings.filter(r => r.rating === 2).length,
    1: ratings.filter(r => r.rating === 1).length,
  };

  // Calculate percentages for the progress bars
  const ratingPercentages = Object.entries(ratingCounts).reduce((acc, [rating, count]) => ({
    ...acc,
    [rating]: totalRatings > 0 ? (count / totalRatings) * 100 : 0
  }), {} as Record<string, number>);

  // Chart options for the rating distribution
  const chartOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '40%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + '%';
      },
      style: {
        fontSize: '12px',
      }
    },
    xaxis: {
      categories: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
      labels: {
        formatter: function (value: string) {
          return parseFloat(value).toFixed(1) + '%';
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
    colors: ['#10B981'],
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toFixed(1) + '%';
        },
      },
    },
  };

  const chartSeries = [{
    name: 'Ratings',
    data: [
      ratingPercentages[5],
      ratingPercentages[4],
      ratingPercentages[3],
      ratingPercentages[2],
      ratingPercentages[1],
    ]
  }];

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="flex animate-pulse flex-col gap-4">
          <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white">
            App Ratings Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Based on {totalRatings} user ratings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-4xl font-bold text-black dark:text-white">{averageRating}</span>
            <div className="flex flex-col items-start">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`h-5 w-5 ${
                      Number(averageRating) >= star
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Average rating
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={250}
        />
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Recent Reviews
        </h3>
        <div className="space-y-4">
          {ratings.slice(0, 3).map((rating, index) => (
            <div key={index} className="border-b border-stroke pb-4 dark:border-strokedark last:border-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          rating.rating > i
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {rating.comment || "No comment provided"}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(rating.timestamp.seconds * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 