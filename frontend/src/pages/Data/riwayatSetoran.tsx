import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import axios from "axios";
import RiwayatSetoranTable from "../../components/tables/BasicTables/BasicTableSetoran";
import { useUser } from "../../context/UserContext";

export default function RiwayatSetoranPage() {
  const { userRole } = useUser();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSetor, setNewSetor] = useState({
    quantity: 0,
    unit: "kg",
    date: "",
    sampahId: 1,
    rwId: 1,
  });

  const openAddModal = () => setIsAddOpen(true);
  const closeAddModal = () => setIsAddOpen(false);

  const handleAdd = async () => {
    try {
      await axios.post("http://localhost:5000/setor", newSetor, {
        withCredentials: true,
      });
      closeAddModal();
      // Refresh tabel jika perlu (biasanya dilakukan dengan callback atau context)
    } catch (error) {
      console.error("Gagal menambah data setor:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold mb-4 text-[#000000] dark:text-white">
          Riwayat Setoran
        </h1>
        {userRole === "koor" ||
          (userRole === "pekerja" && (
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#285303] rounded hover:bg-[#80BC4D]"
              onClick={openAddModal}
            >
              Tambah
            </button>
          ))}
      </div>
      <RiwayatSetoranTable />
      <Modal
        isOpen={isAddOpen}
        onClose={closeAddModal}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Tambah Data Setor
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Tambahkan data setor baru.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Data Setor
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={newSetor.quantity}
                      onChange={(e) =>
                        setNewSetor({
                          ...newSetor,
                          quantity: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Unit</Label>
                    <select
                      value={newSetor.unit}
                      onChange={(e) =>
                        setNewSetor({ ...newSetor, unit: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-400"
                    >
                      <option value="kg">kg</option>
                    </select>
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newSetor.date}
                      onChange={(e) =>
                        setNewSetor({ ...newSetor, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Sampah ID</Label>
                    <Input
                      type="number"
                      value={newSetor.sampahId}
                      onChange={(e) =>
                        setNewSetor({
                          ...newSetor,
                          sampahId: parseInt(e.target.value),
                        })
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      1 = Organik, 2 = Non Organik, 3 = Residu
                    </p>
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>RW ID</Label>
                    <Input
                      type="number"
                      value={newSetor.rwId}
                      onChange={(e) =>
                        setNewSetor({
                          ...newSetor,
                          rwId: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeAddModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleAdd}>
                Tambah
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
