import { useEffect, useState } from "react";
import axios from "axios";

import { GroupIcon, TrashBinIcon } from "../../icons";

export default function EcommerceMetrics() {
  const [totalPekerja, setTotalPekerja] = useState<number>(0);
  const [totalSampah, setTotalSampah] = useState<number>(0);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const responsePekerja = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/count-pekerja`,
          //          "http://localhost:5000/users/count-pekerja",
          {
            withCredentials: true,
          },
        );
        setTotalPekerja(responsePekerja.data.total);

        const responseSampah = await axios.get(
          `${import.meta.env.VITE_API_URL}/setor/total-sampah`,
          //          "http://localhost:5000/setor/total-sampah",
          {
            withCredentials: true,
          },
        );
        setTotalSampah(responseSampah.data.total);
      } catch (error) {
        console.error("Gagal mengambil total pekerja:", error);
      }
    };

    fetchTotal();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* === Total Pekerja === */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#092635] dark:bg-[#1B4242] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-[#BDED94] rounded-xl dark:bg-[#5C8374]">
          <GroupIcon className="text-[#285303] size-6 dark:text-[#092635]" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-[#ffffff]">
              Total Pekerja
            </span>
            <h4 className="mt-2 font-bold text-[#000000] text-title-sm dark:text-white/90">
              {totalPekerja}
            </h4>
          </div>
        </div>
      </div>
      {/* === Card Kedua (Opsional / Placeholder) === */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#092635] dark:bg-[#1B4242] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-[#BDED94] rounded-xl dark:bg-[#5C8374]">
          <TrashBinIcon className="text-[#285303] size-6 dark:text-[#092635]" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-[#ffffff]">
              Total Sampah
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalSampah} kg
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
