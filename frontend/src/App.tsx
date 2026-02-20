import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import DataPekerjaPage from "./pages/Data/dataPekerja";
import DataSampahPage from "./pages/Data/dataSampah";
import LaporanPage from "./pages/Data/laporan";
import RiwayatSetoranPage from "./pages/Data/riwayatSetoran";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route index element={<Navigate to="/signin" replace />} />

          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/data-pekerja" element={<DataPekerjaPage />} />
            <Route path="/data-sampah" element={<DataSampahPage />} />
            <Route path="/laporan" element={<LaporanPage />} />
            <Route path="/riwayat-setoran" element={<RiwayatSetoranPage />} />
            <Route path="/blank" element={<Blank />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
