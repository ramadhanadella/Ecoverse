import { useEffect, useState } from "react";
import axios from "axios";
import { TrashBinIcon } from "../../icons";

interface WasteData {
  total: number;
  organik: number;
  nonOrganik: number;
  residu: number;
}

export default function TotalWasteMetrics() {
  const [wasteData, setWasteData] = useState<WasteData>({
    total: 0,
    organik: 0,
    nonOrganik: 0,
    residu: 0,
  });

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
        setWasteData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data sampah:", error);
      }
    };

    fetchWasteData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* === Total Sampah Organik === */}
      <div className="w-full rounded-2xl border border-gray-200 bg-[#285303] p-5 dark:border-[#092635] dark:bg-[#1B4242] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-[#ffffff] rounded-xl dark:bg-[#5C8374]">
          <TrashBinIcon className="text-[#285303] size-6 dark:text-[#BDED94]" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-m text-[#ffffff] dark:text-[#ffffff]">
              Total Sampah Organik
            </span>
            <h4 className="mt-2 font-bold text-[#ffffff] text-title-sm dark:text-white/90">
              {wasteData.organik} kg
            </h4>
          </div>
        </div>
      </div>

      {/* === Total Sampah Non-Organik === */}
      <div className="w-full rounded-2xl border border-gray-200 bg-[#80BC4D] p-5 dark:border-[#092635] dark:bg-[#1B4242] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-[#ffffff] rounded-xl dark:bg-[#5C8374]">
          <TrashBinIcon className="text-[#80BC4D] size-6 dark:text-[#BDED94]" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-m text-[#ffffff] dark:text-[#ffffff]">
              Total Sampah Non Organik
            </span>
            <h4 className="mt-2 font-bold text-[#ffffff] text-title-sm dark:text-white/90">
              {wasteData.nonOrganik} kg
            </h4>
          </div>
        </div>
      </div>

      {/* === Total Sampah Residu === */}
      <div className="w-full rounded-2xl border border-gray-200 bg-[#BDED94] p-5 dark:border-[#092635] dark:bg-[#1B4242] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-[#ffffff] rounded-xl dark:bg-[#5C8374]">
          <TrashBinIcon className="text-[#BDED94] size-6 dark:text-[#BDED94]" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-m text-[#ffffff] dark:text-[#ffffff]">
              Total Sampah Residu
            </span>
            <h4 className="mt-2 font-bold text-[#ffffff] text-title-sm dark:text-white/90">
              {wasteData.residu} kg
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
