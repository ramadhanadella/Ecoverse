import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import axios from "axios";

export default function WasteSummaryChart() {
  const [data, setData] = useState([0, 0, 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/setor/summary-monthly`,

          //"http://localhost:5000/setor/summary-monthly",
          {
            withCredentials: true,
          },
        );
        const { organik, nonOrganik, residu } = response.data;
        setData([organik, nonOrganik, residu]);
      } catch (error) {
        console.error("Gagal mengambil data sampah:", error);
        setData([0, 0, 0]);
      } finally {
        setLoading(false);
      }
    };

    fetchWasteData();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "pie",
      fontFamily: "Outfit, sans-serif",
      height: 300,
    },
    labels: ["Organik", "Non-Organik", "Residu"],
    colors: ["#285303", "#80BC4D", "#BDED94"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    dataLabels: {
      style: {
        colors: ["#ffffff", "#ffffff", "#ffffff"],
        fontSize: "14px",
        fontWeight: "bold",
      },
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} kg`,
      },
    },
  };

  const series = data;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#092635] dark:bg-[#1B4242] md:p-6">
      <h3 className="text-l font-semibold text-gray-800 dark:text-[#ffffff] mb-4">
        Distribusi Sampah Bulan Ini
      </h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Chart options={options} series={series} type="pie" height={300} />
      )}
    </div>
  );
}
