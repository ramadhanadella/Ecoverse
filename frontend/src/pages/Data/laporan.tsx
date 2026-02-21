import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../components/ui/button/Button";
import { TrashBinIcon } from "../../icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface SummaryData {
  periode: string;
  totals: Array<{ jenis: string; total: number; "sampah.category": string }>;
  rwData: Array<{ rw: string; pekerja: number; sampah: number }>;
  generatedAt: string;
}

export default function LaporanPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/laporan/summary?bulan=${bulan}&tahun=${tahun}`,
        //"`http://localhost:5000/laporan/summary?bulan=${bulan}&tahun=${tahun}`,
        { withCredentials: true },
      );
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetch laporan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, [bulan, tahun]);

  const downloadPDF = async () => {
    if (!summary) {
      alert("Data belum siap. Tunggu loading selesai.");
      return;
    }
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(20);
    doc.text("LAPORAN PENGELOLAAN SAMPAH", 20, 20);
    doc.setFontSize(12);
    doc.text(`Ecoverse - Periode: ${summary.periode}`, 20, 30);
    doc.text(`Generated: ${summary.generatedAt}`, 20, 40);
    let y = 60;
    doc.text("RINGKASAN JENIS SAMPAH:", 20, y);
    y += 10;
    summary.totals.forEach((item, i) => {
      doc.text(`${item.jenis}: ${item.total} kg`, 25, y + i * 7);
    });
    y = 120;
    doc.text("RINGKASAN PER RW:", 20, y);
    y += 10;
    summary.rwData.forEach((rw, i) => {
      doc.text(
        `${rw.rw}: ${rw.sampah} kg (${rw.pekerja} pekerja)`,
        25,
        y + i * 7,
      );
    });
    doc.save(`laporan-ecoverse-${summary.periode}.pdf`);
  };

  const downloadExcel = async () => {
    if (!summary) {
      alert("Data belum siap. Tunggu loading selesai.");
      return;
    }
    const XLSX = await import("xlsx");
    const data = [
      ["LAPORAN ECOVERSE", "", "", `Periode: ${summary.periode}`],
      [],
      ["RINGKASAN JENIS SAMPAH"],
      ["Jenis", "Total (kg)"],
      ...summary.totals.map((item) => [item.jenis, item.total]),
      [],
      ["RINGKASAN PER RW"],
      ["RW", "Pekerja", "Total Sampah (kg)"],
      ...summary.rwData.map((rw) => [rw.rw, rw.pekerja, rw.sampah]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, `laporan-ecoverse-${summary.periode}.xlsx`);
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-[#092635] dark:bg-[#1B4242] p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading laporan...
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4 text-[#000000] dark:text-white">
        Laporan
      </h1>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Filter + Buttons */}
        <div className="col-span-12 space-y-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-[#092635] dark:bg-[#1B4242] p-6 md:p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-[#285303] dark:text-white">
                Filter Periode Laporan
              </h2>
              <div className="flex flex-wrap gap-3">
                <select
                  value={bulan}
                  onChange={(e) => setBulan(Number(e.target.value))}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80BC4D] focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-[#BDED94] disabled:opacity-50"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {(i + 1).toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <select
                  value={tahun}
                  onChange={(e) => setTahun(Number(e.target.value))}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#80BC4D] focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-[#BDED94] disabled:opacity-50"
                >
                  {[2023, 2024, 2025, 2026].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={downloadPDF}
                  disabled={loading || !summary}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#285303] rounded-xl hover:bg-[#80BC4D] disabled:opacity-50 shadow-sm dark:bg-[#5C8374] dark:hover:bg-[#9EC8B9]"
                >
                  Download PDF
                </Button>
                <Button
                  onClick={downloadExcel}
                  disabled={loading || !summary}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#285303] rounded-xl hover:bg-[#80BC4D] disabled:opacity-50 shadow-sm dark:bg-[#5C8374] dark:hover:bg-[#9EC8B9]"
                >
                  Download Excel
                </Button>
              </div>
              {summary && (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-right mb-4">
                  Generated: {summary.generatedAt}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="col-span-12 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {summary.totals.map((item, i) => (
                <div
                  key={i}
                  className="w-full rounded-2xl border border-gray-200 bg-[#285303]  p-6 dark:border-[#092635] dark:bg-[#1B4242]"
                >
                  <div className="flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                    <TrashBinIcon className="text-white size-7" />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm text-white/90 mb-2 capitalize tracking-wide">
                      {item.jenis.replace(/-/g, " ")}
                    </span>
                    <h4 className="text-3xl font-bold text-white mb-1">
                      {item.total.toLocaleString()} kg
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RW Table */}
        <div className="col-span-12 xl:col-span-12">
          {summary ? (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-[#092635] dark:bg-[#1B4242]">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-6 text-[#285303] dark:text-white">
                  Ringkasan Per RW - Periode {summary.periode}
                </h2>
                <div className="max-w-full overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#BDED94] border-b border-gray-100 dark:border-white/[0.05] dark:bg-[#9EC8B9]">
                      <TableRow>
                        <TableCell
                          isHeader
                          className="px-6 py-4 font-bold text-[#285303] text-start text-theme-l dark:text-[#1B4242]"
                        >
                          RW
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-6 py-4 font-bold text-[#285303] text-start text-theme-l dark:text-[#1B4242]"
                        >
                          Jumlah Pekerja
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-6 py-4 font-bold text-[#285303] text-start text-theme-l dark:text-[#1B4242]"
                        >
                          Total Sampah
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {summary.rwData.map((rw, i) => (
                        <TableRow
                          key={i}
                          className="hover:bg-gray-50 dark:hover:bg-[#092635]/50"
                        >
                          <TableCell className="px-6 py-5 text-[#000000] text-start text-theme-l dark:text-[#ffffff] font-semibold">
                            {rw.rw}
                          </TableCell>
                          <TableCell className="px-6 py-5 text-[#000000] text-start text-theme-l dark:text-[#ffffff]">
                            {rw.pekerja}
                          </TableCell>
                          <TableCell className="px-6 py-5 text-[#285303] text-start text-theme-l dark:text-[#BDED94] font-bold">
                            {rw.sampah.toLocaleString()} kg
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-span-12 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-[#092635] dark:bg-[#1B4242] p-12">
              <div className="text-center text-gray-500 dark:text-gray-400">
                Tidak ada data untuk periode yang dipilih
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
