import Sampah from "../models/SampahModel.js";
import { Op, where } from "sequelize";

export const getSampah = async (req, res) => {
  try {
    const response = await Sampah.findAll({
      attributes: ["id", "category"],
      order: [["id", "ASC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSampahById = async (req, res) => {
  try {
    const sampah = await Sampah.findOne({
      where: { id: req.params.id },
    });
    if (!sampah) {
      return res.status(404).json({ msg: "Data sampah tidak ditemukan" });
    }
    res.status(200).json(sampah);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createSampah = async (req, res) => {
  const { id, category } = req.body;
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Akses ditolak" });
    await Sampah.create({
      id: id,
      category: category,
    });
    res.status(201).json({ msg: "Data sampah berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateSampah = async (req, res) => {
  try {
    const sampah = await Sampah.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!sampah)
      return res.status(404).json({ msg: "Data sampah tidak ditemukan" });
    if (req.role !== "admin")
      return res.status(404).json({ msg: "Akses ditolak" });
    const { id, category } = req.body;
    await Sampah.update(
      {
        id: id,
        category: category,
      },
      {
        where: { id: Sampah.id },
      }
    );
    res.status(200).json("Data sampah berhasil diperbarui");
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteSampah = async (req, res) => {
  try {
    const sampah = await Sampah.findOne({
      where: { id: req.params.id },
    });
    if (!sampah)
      return res.status(404).json({ msg: "Data sampah tidak ditemukan" });
    if (req.role !== "admin")
      return res.status(403).json({ msg: "Akses ditolak" });
    await Sampah.destroy({
      where: { id: Sampah.id },
    });
    res.status(200).json({ msg: "Data sampah berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
