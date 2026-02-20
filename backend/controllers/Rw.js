import RW from "../models/RWModel.js";

export const getRW = async (req, res) => {
  try {
    const response = await RW.findAll({
      attributes: ["id", "name"],
      order: [["id", "ASC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getRWById = async (req, res) => {
  try {
    const rw = await RW.findOne({
      where: { id: req.params.id },
    });
    if (!rw) {
      return res.status(404).json({ msg: "Data RW tidak ditemukan" });
    }
    res.status(200).json(rw);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createRW = async (req, res) => {
  const { name } = req.body;
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Akses ditolak" });
    await RW.create({
      name: name,
    });
    res.status(201).json({ msg: "RW berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateRW = async (req, res) => {
  try {
    const rw = await RW.findOne({
      where: { id: req.params.id },
    });
    if (!rw) return res.status(404).json({ msg: "Data Rw tidak ditemukan" });
    if (req.role !== "admin")
      return res.status(403).json({ msg: "Akses ditolak" });
    const { name } = req.body;
    await RW.update({ name }, { where: { id: rw.id } });
    res.status(200).json({ msg: "Data RW berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteRW = async (req, res) => {
  try {
    const rw = await RW.findOne({
      where: { id: req.params.id },
    });
    if (!rw) return res.status(404).json({ msg: "Data RW tidak ditemukan" });
    if (req.role !== "admin")
      return res.status(403).json({ msg: "Akses ditolak" });
    await RW.destroy({
      where: { id: rw.id },
    });
    res.status(200).json({ msg: "Data RW berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
