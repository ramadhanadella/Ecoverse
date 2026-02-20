import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

type RWData = {
  nama: string;
  rw: string;
  pekerja: number;
  jumlah: number;
};

export default function WeeklyStatusTable() {
  const [data, setData] = useState<RWData[]>([]);

  useEffect(() => {
    const fetchWeeklyStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/setor/data-rw",
          {
            withCredentials: true,
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data status mingguan:", error);
      }
    };
    fetchWeeklyStatus();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-[#092635] dark:bg-[#1B4242]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#BDED94] border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-[#285303] text-start text-theme-l dark:text-[#ffffff]"
              >
                Nama
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-[#285303] text-start text-theme-l dark:text-[#ffffff]"
              >
                RW
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-[#285303] text-start text-theme-l dark:text-[#ffffff]"
              >
                Pekerja
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-[#285303] text-start text-theme-l dark:text-[#ffffff]"
              >
                Total Sampah
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="px-5 py-4 text-[#000000] text-start text-theme-l dark:text-[#ffffff]">
                  {item.nama}
                </TableCell>
                <TableCell className="px-5 py-4 text-[#000000] text-start text-theme-l dark:text-[#ffffff]">
                  {item.rw}
                </TableCell>
                <TableCell className="px-5 py-4 text-[#000000] text-start text-theme-l dark:text-[#ffffff]">
                  {item.pekerja}
                </TableCell>
                <TableCell className="px-5 py-4 text-[#000000] text-start text-theme-l dark:text-[#ffffff]">
                  {item.jumlah} kg
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
