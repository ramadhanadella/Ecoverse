import { useState, useEffect } from "react";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import axios from "axios";
import { useUser } from "../../../context/UserContext";
import { TrashBinIcon, PencilIcon } from "../../../icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

type SetoranData = {
  id: number;
  quantity: number;
  unit: string;
  date: string;
  user: {
    name: string;
    nip: string;
    role: string;
  };
  sampah: {
    category: string;
  };
  rw: {
    name: string;
  };
};

export default function RiwayatSetoranTable() {
  const [data, setData] = useState<SetoranData[]>([]);
  const [selectedRW, setSelectedRW] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState<string>("all");
  const [filterTanggal, setFilterTanggal] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { userRole } = useUser();

  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const [editingSetoran, setEditingSetoran] = useState<SetoranData | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSetoran = async () => {
      try {
        const response = await axios.get("http://localhost:5000/setor", {
          withCredentials: true,
        });
        setData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data setoran:", error);
      }
    };
    fetchSetoran();
  }, []);

  const filteredData = data.filter((item) => {
    const matchesSearch = item.user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesJenis =
      filterJenis === "all" ||
      item.sampah.category.toLowerCase() === filterJenis.toLowerCase();
    const matchesTanggal = !filterTanggal || item.date === filterTanggal;
    const matchesRW = selectedRW === "all" || item.rw.name === selectedRW;
    return matchesSearch && matchesJenis && matchesTanggal && matchesRW;
  });

  const sortedData = filteredData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (item: SetoranData) => {
    setEditingSetoran(item);
    openEditModal();
  };

  const handleUpdate = async () => {
    if (!editingSetoran) return;
    try {
      await axios.patch(
        `http://localhost:5000/setor/${editingSetoran.id}`,
        {
          quantity: editingSetoran.quantity,
          date: editingSetoran.date,
        },
        { withCredentials: true }
      );
      setData(
        data.map((item) =>
          item.id === editingSetoran.id ? editingSetoran : item
        )
      );
      closeEditModal();
    } catch (error) {
      console.error("Gagal mengupdate setoran:", error);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await axios.delete(`http://localhost:5000/setor/${deletingId}`, {
        withCredentials: true,
      });
      setData(data.filter((item) => item.id !== deletingId));
      closeDeleteModal();
    } catch (error) {
      console.error("Gagal menghapus setoran:", error);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-[#092635] dark:bg-[#1B4242]">
      {/* Modal Edit & Delete */}
      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-[#092635] lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Setoran
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Edit data setoran.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Data Setoran
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Jumlah (kg)</Label>
                    <Input
                      type="number"
                      value={editingSetoran?.quantity || ""}
                      onChange={(e) => {
                        if (editingSetoran) {
                          setEditingSetoran({
                            ...editingSetoran,
                            quantity: parseInt(e.target.value),
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Tanggal</Label>
                    <Input
                      type="date"
                      value={editingSetoran?.date || ""}
                      onChange={(e) => {
                        if (editingSetoran) {
                          setEditingSetoran({
                            ...editingSetoran,
                            date: e.target.value,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeEditModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleUpdate}>
                Simpan
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        className="max-w-[400px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[400px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-[#092635] lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Hapus Setoran
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Apakah Anda yakin ingin menghapus setoran ini?
            </p>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeDeleteModal}>
              Batal
            </Button>
            <Button size="sm" onClick={handleDelete}>
              Hapus
            </Button>
          </div>
        </div>
      </Modal>

      {/* Filter */}
      <div className="flex flex-wrap items-center justify-between mb-4 px-4 gap-4">
        <div>
          <label className="font-medium text-gray-700 dark:text-white px-1">
            Cari Nama
          </label>
          <input
            type="text"
            placeholder="Cari nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="font-medium text-gray-700 dark:text-white px-1">
            Jenis Sampah
          </label>
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="mt-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-400"
          >
            <option value="all">Semua Jenis</option>
            <option value="organik">Organik</option>
            <option value="non organik">Non Organik</option>
            <option value="residu">Residu</option>
          </select>
        </div>
        <div>
          <label className="font-medium text-gray-700 dark:text-white px-1">
            Tanggal
          </label>
          <input
            type="date"
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            className="mt-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="font-medium text-gray-700 dark:text-white px-1">
            Filter RW
          </label>
          <select
            value={selectedRW}
            onChange={(e) => setSelectedRW(e.target.value)}
            className="mt-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-400"
          >
            <option value="all">Semua RW</option>
            <option value="RW 1">RW 1</option>
            <option value="RW 2">RW 2</option>
            <option value="RW 3">RW 3</option>
            <option value="RW 4">RW 4</option>
            <option value="RW 5">RW 5</option>
            <option value="RW 6">RW 6</option>
          </select>
        </div>
      </div>

      {/* Tabel */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#80BC4D] border-b border-gray-100 dark:bg-[#9EC8B9] dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-[#285303] text-start dark:text-[#092635]"
              >
                No
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-[#285303] text-start dark:text-[#092635] min-w-[200px]"
              >
                Nama
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-[#285303] text-start dark:text-[#092635]"
              >
                RW
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-[#285303] text-start dark:text-[#092635]"
              >
                Jenis Sampah
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-[#285303] text-start dark:text-[#092635]"
              >
                Jumlah (kg)
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-[#285303] text-start dark:text-[#092635]"
              >
                Tanggal
              </TableCell>
              {userRole === "admin" && (
                <TableCell
                  isHeader
                  className="px-5 py-3 font-bold text-[#285303] text-end dark:text-[#092635]"
                >
                  Action
                </TableCell>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="px-5 py-4 text-start dark:text-white">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell className="px-5 py-4 text-start dark:text-white min-w-[200px]">
                  {item.user.name}
                </TableCell>
                <TableCell className="px-5 py-4 text-start dark:text-white">
                  {item.rw.name}
                </TableCell>
                <TableCell className="px-5 py-4 text-start dark:text-white">
                  {item.sampah.category}
                </TableCell>
                <TableCell className="px-5 py-4 text-start dark:text-white">
                  {item.quantity} kg
                </TableCell>
                <TableCell className="px-5 py-4 text-start dark:text-white">
                  {item.date}
                </TableCell>
                {userRole === "admin" && (
                  <TableCell className="px-5 py-4 text-end dark:text-white">
                    <div className="flex justify-end gap-2">
                      <button
                        className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-[#285303] bg-[#BDED94] dark:text-[#fff] dark:bg-[#5C8374] dark:hover:bg-[#9EC8B9] rounded hover:bg-[#80BC4D]"
                        onClick={() => handleEdit(item)}
                      >
                        <PencilIcon className="size-4" />
                        Edit
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-[#820404] bg-[#FBC1C1] dark:text-[#ffffff] dark:bg-[#FF6969] dark:hover:bg-[#5C0000] rounded hover:bg-[#F66363]"
                        onClick={() => {
                          setDeletingId(item.id);
                          openDeleteModal();
                        }}
                      >
                        <TrashBinIcon className="size-4" />
                        Hapus
                      </button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6 px-4 gap-2 pb-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-[#80BC4D] text-white disabled:bg-gray-300 hover:bg-[#285303] dark:bg-[#5C8374] dark:hover:bg-[#092635] dark:disabled:bg-[#1B4242] transition"
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-[#80BC4D] text-white disabled:bg-gray-300 hover:bg-[#285303] dark:bg-[#5C8374] dark:hover:bg-[#092635] dark:disabled:bg-[#1B4242] transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
