import TotalWasteMetrics from "../../components/sampah/TotalWasteMetrics";
import WasteSummaryChart from "../../components/sampah/WasteSummaryChart";
import WasteSummaryTable from "../../components/sampah/WasteSummaryTable";
import PageMeta from "../../components/common/PageMeta";

export default function DataSampahPage() {
  return (
    <>
      <PageMeta
        title="Data Sampah - Ecoverse"
        description="Rekap dan statistik pengumpulan sampah organik, non-organik, dan residu"
      />
      <h1 className="text-2xl font-semibold mb-4 text-[#000000] dark:text-white">
        Data Sampah
      </h1>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6">
          <TotalWasteMetrics />
        </div>
        <div className="col-span-12 xl:col-span-7">
          <WasteSummaryTable />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <WasteSummaryChart />
        </div>
        <div className="col-span-12"></div>
      </div>
    </>
  );
}
