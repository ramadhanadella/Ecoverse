import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MonthlyTarget() {
  const [data, setData] = useState({
    total: 0,
    organik: 0,
    nonOrganik: 0,
    residu: 0,
  });
  const [series, setSeries] = useState([0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/setor/summary-monthly",
          {
            withCredentials: true,
          }
        );
        const { total, organik, nonOrganik, residu } = response.data;
        setData({ total, organik, nonOrganik, residu });
        setSeries([total]);
      } catch (error) {
        console.error("Error fetching monthly summary:", error);
      }
    };
    fetchData();
  }, []);

  const options: ApexOptions = {
    colors: ["#80BC4D"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + " kg";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#80BC4D"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-[#092635] dark:bg-[#1B4242]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-[#092635] sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-[#ffffff]">
              Sampah Bulan Ini
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-[#ffffff]">
              Rekap Pengelolaan Sampah Bulan Ini
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="max-h-[330px]" id="chartDarkStyle">
            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={500}
            />
          </div>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-[#285303] sm:text-base dark:text-[#ffffff]">
          Semangat ya, terus tingkatkan pengelolaan sampah Anda!
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-[#ffffff] sm:text-sm">
            Organik
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-[#285303] dark:text-white/90 sm:text-lg">
            {data.organik} kg
          </p>
        </div>
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-[#ffffff] sm:text-sm">
            Non Organik
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-[#285303] dark:text-white/90 sm:text-lg">
            {data.nonOrganik} kg
          </p>
        </div>
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-[#ffffff] sm:text-sm">
            Residu
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-[#285303] dark:text-white/90 sm:text-lg">
            {data.residu} kg
          </p>
        </div>
      </div>
    </div>
  );
}
