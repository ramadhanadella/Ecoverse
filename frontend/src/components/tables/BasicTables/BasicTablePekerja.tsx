import { useState, useEffect, useCallback } from "react";
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

type WorkerData = {
  id: number;
  nama: string;
  rw: number;
  role: string;
  nip: string;
};

export default function DataPekerjaTable() {
  const [data, setData] = useState<WorkerData[]>([]);
  const [selectedRW, setSelectedRW] = useState<string>("all");
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

  const [editingUser, setEditingUser] = useState<WorkerData | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchWorkers = useCallback(async () => {
    try {
      console.log("Fetching workers...");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/pekerja`,
        //"http://localhost:5000/pekerja",
        {
          withCredentials: true,
        },
      );
      setData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pekerja:", error);
    }
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const filteredData =
    selectedRW === "all"
      ? data
      : data.filter((item) => item.rw === parseInt(selectedRW));

  const sortedData = filteredData.sort((a, b) => {
    if (a.rw !== b.rw) {
      return a.rw - b.rw;
    }
    if (a.role === "koor" && b.role !== "koor") return -1;
    if (a.role !== "koor" && b.role === "koor") return 1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (item: WorkerData) => {
    console.log("handleEdit called:", item);
    setEditingUser({ ...item });
    openEditModal();
  };

  const handleUpdate = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    console.log("🟢 handleUpdate DIPANGGIL!");
    console.log("editingUser saat update:", editingUser);

    if (!editingUser) {
      console.log("❌ editingUser NULL!");
      return;
    }

    try {
      console.log("Mengirim PATCH request...");
      const response = await axios.patch(
        //`http://localhost:5000/users/
        `${import.meta.env.VITE_API_URL}/users/${editingUser.id}`,
        {
          name: editingUser.nama,
          role: editingUser.role,
          rwId: ["koor", "pekerja"].includes(editingUser.role)
            ? editingUser.rw
            : null,
        },
        { withCredentials: true },
      );
      console.log("✅ Response:", response.data);

      await fetchWorkers();
      closeEditModal();
      setEditingUser(null);
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  const handleDelete = async () => {
    console.log("handleDelete called, deletingId:", deletingId);
    if (!deletingId) return;
    try {
      await axios.delete(
        //`http://localhost:5000/users/
        `${import.meta.env.VITE_API_URL}/users/${deletingId}`,
        {
          withCredentials: true,
        },
      );
      setData(data.filter((item) => item.id !== deletingId));
      closeDeleteModal();
    } catch (error) {
      console.error("Gagal menghapus pekerja:", error);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-[#092635] dark:bg-[#1B4242]">
      {/* Modal Edit - FIXED */}
      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-[#092635] lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Pekerja
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Edit data pekerja.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Data Pekerja
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nama</Label>
                    <Input
                      type="text"
                      value={editingUser?.nama || ""}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev
                            ? {
                                ...prev,
                                nama: e.target.value,
                              }
                            : null,
                        )
                      }
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Role</Label>
                    <select
                      value={editingUser?.role || ""}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev
                            ? {
                                ...prev,
                                role: e.target.value,
                              }
                            : null,
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-400"
                    >
                      {["admin", "visitor", "koor", "pekerja"].map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {["koor", "pekerja"].includes(editingUser?.role || "") && (
                    <div className="col-span-2 lg:col-span-1">
                      <Label>RW</Label>
                      <Input
                        type="number"
                        value={editingUser?.rw || ""}
                        onChange={(e) =>
                          setEditingUser((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  rw:
                                    e.target.value === ""
                                      ? 0
                                      : parseInt(e.target.value),
                                }
                              : null,
                          )
                        }
                      />
                    </div>
                  )}
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

      {/* Modal Delete */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        className="max-w-[400px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[400px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-[#092635] lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Hapus Pekerja
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Apakah Anda yakin ingin menghapus pekerja ini?
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

      {/* Table dan pagination code sama seperti sebelumnya */}
      <div className="flex flex-wrap items-center justify-between mb-4 px-4 gap-4">
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
            <option value="1">RW 1</option>
            <option value="2">RW 2</option>
            <option value="3">RW 3</option>
            <option value="4">RW 4</option>
            <option value="5">RW 5</option>
            <option value="6">RW 6</option>
          </select>
        </div>
      </div>

      {/* Table content sama persis */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start dark:text-white"
              >
                Nama
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start dark:text-white"
              >
                RW
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start dark:text-white"
              >
                Role
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start dark:text-white"
              >
                NIP
              </TableCell>
              {userRole === "admin" && (
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start dark:text-white"
                >
                  Aksi
                </TableCell>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-5 py-4 text-start dark:text-white">
                  {item.nama}
                </TableCell>
                <TableCell className="px-5 py-4 text-start dark:text-white">
                  {item.rw}
                </TableCell>
                <TableCell className="px-5 py-4 text-start dark:text-white">
                  {item.role}
                </TableCell>
                <TableCell className="px-5 py-4 text-start dark:text-white">
                  {item.nip}
                </TableCell>
                {userRole === "admin" && (
                  <TableCell className="px-5 py-4 text-start dark:text-white">
                    <div className="flex gap-2">
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
