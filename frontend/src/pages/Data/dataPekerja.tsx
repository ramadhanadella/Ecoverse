import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import axios from "axios";
import DataPekerjaTable from "../../components/tables/BasicTables/BasicTablePekerja";
import { useUser } from "../../context/UserContext";

export default function DataPekerjaPage() {
  const { userRole } = useUser();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    password: "",
    confPassword: "",
    role: "pekerja",
    rw: 1,
  });

  const openAddModal = () => setIsAddOpen(true);
  const closeAddModal = () => setIsAddOpen(false);

  const handleAdd = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          name: newUser.name,
          password: newUser.password,
          confPassword: newUser.confPassword,
          role: newUser.role,
          rwId: ["koor", "pekerja"].includes(newUser.role) ? newUser.rw : null,
        },
        { withCredentials: true },
      );
      closeAddModal();
      setNewUser({
        name: "",
        password: "",
        confPassword: "",
        role: "pekerja",
        rw: 1,
      });
    } catch (error) {
      console.error("Gagal menambah pekerja:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold mb-4 text-[#000000] dark:text-white">
          Data Pekerja
        </h1>
        {userRole === "admin" && (
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#285303] rounded hover:bg-[#80BC4D]"
            onClick={openAddModal}
          >
            Tambah
          </button>
        )}
      </div>
      <DataPekerjaTable />
      <Modal
        isOpen={isAddOpen}
        onClose={closeAddModal}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Tambah Pekerja
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Tambahkan data pekerja baru.
            </p>
          </div>
          <form className="flex flex-col">
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
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      value={newUser.confPassword}
                      onChange={(e) =>
                        setNewUser({ ...newUser, confPassword: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Role</Label>
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
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
                  {["koor", "pekerja"].includes(newUser.role) && (
                    <div className="col-span-2 lg:col-span-1">
                      <Label>RW</Label>
                      <Input
                        type="number"
                        value={newUser.rw}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            rw: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  )}
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
