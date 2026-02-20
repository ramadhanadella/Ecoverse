import Setor from "../models/SetorModel.js";
import User from "../models/UserModel.js";
import RW from "../models/RWModel.js";
import Sampah from "../models/SampahModel.js";
import { Op } from "sequelize";

export const getSetor = async (req, res) => {
  try {
    let response;
    if (req.user.role === "admin") {
      response = await Setor.findAll({
        attributes: ["id", "quantity", "unit", "date"],
        include: [
          { model: User, attributes: ["name", "nip", "role"] },
          { model: Sampah, attributes: ["id", "category"] },
          { model: RW, attributes: ["name"] },
        ],
        order: [["date", "DESC"]],
      });
    } else if (req.user.role === "visitor") {
      response = await Setor.findAll({
        attributes: ["id", "quantity", "unit", "date"],
        include: [
          { model: User, attributes: ["name", "nip", "role"] },
          { model: Sampah, attributes: ["id", "category"] },
          { model: RW, attributes: ["name"] },
        ],
        order: [["date", "DESC"]],
      });
    } else if (req.user.role === "koor") {
      response = await Setor.findAll({
        attributes: ["id", "quantity", "unit", "date"],
        where: { rwId: req.user.rwId },
        include: [
          { model: User, attributes: ["name", "nip", "role"] },
          { model: Sampah, attributes: ["id", "category"] },
          { model: RW, attributes: ["name"] },
        ],
        order: [["date", "DESC"]],
      });
    } else if (req.user.role === "pekerja") {
      response = await Setor.findAll({
        attributes: ["id", "quantity", "unit", "date"],
        where: { userId: req.user.id },
        include: [
          { model: User, attributes: ["name", "nip", "role"] },
          { model: Sampah, attributes: ["id", "category"] },
          { model: RW, attributes: ["name"] },
        ],
        order: [["date", "DESC"]],
      });
    } else {
      return res.status(403).json({ msg: "Akses tidak diizinkan" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSetorById = async (req, res) => {
  try {
    const setor = await Setor.findOne({
      where: { id: req.params.id },
    });
    if (!setor)
      return res.status(404).json({ msg: "Data setor tidak ditemukan" });
    let response;
    if (req.user.role === "admin") {
      response = await Setor.findOne({
        attributes: ["id", "quantity", "unit", "date"],
        where: { id: setor.id },
        include: [
          { model: User, attributes: ["name", "nip", "role"] },
          { model: Sampah, attributes: ["id", "category"] },
          { model: RW, attributes: ["name"] },
        ],
      });
    } else if (req.user.role === "koor") {
      if (setor.rwId !== req.user.rwId)
        return res.status(403).json({ msg: "Akses RW lain tidak diizinkan" });
      response = await Setor.findOne({
        attributes: ["id", "quantity", "unit", "date"],
        where: { id: setor.id, rwId: req.user.rwId },
        include: [
          { model: User, attributes: ["name", "nip", "role"] },
          { model: Sampah, attributes: ["id", "category"] },
          { model: RW, attributes: ["id"] },
        ],
      });
    } else if (req.user.role === "pekerja") {
      if (setor.userId !== req.user.id)
        return res
          .status(403)
          .json({ msg: "Akses dibatasi hanya data sendiri" });
      response = await Setor.findOne({
        attributes: ["id", "quantity", "unit", "date"],
        where: { id: setor.id, userId: req.user.id },
        include: [
          { model: User, attributes: ["name", "nip", "role"] },
          { model: Sampah, attributes: ["id", "category"] },
          { model: RW, attributes: ["name"] },
        ],
      });
    } else if (req.user.role === "visitor") {
      if (setor.userId !== req.userId)
        return res
          .status(403)
          .json({ msg: "Akses dibatasi hanya data sendiri" });
      response = await Setor.findOne({
        attributes: ["id", "quantity", "unit", "date"],
        include: [
          { model: User, attributes: ["name", "nip", "role"] },
          { model: Sampah, attributes: ["id", "category"] },
          { model: RW, attributes: ["id"] },
        ],
      });
    } else {
      return res.status(403).json({ msg: "Akses tidak diizinkan" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createSetor = async (req, res) => {
  const { quantity, unit, date, sampahId, rwId } = req.body;
  try {
    if (
      (req.user.role === "koor" || req.user.role === "pekerja") &&
      rwId !== req.user.rwId
    ) {
      return res
        .status(403)
        .json({ msg: "Tidak boleh membuat setor di RW lain" });
    }
    await Setor.create({
      quantity,
      unit,
      date,
      userId: req.user.id,
      sampahId,
      rwId,
    });
    res.status(201).json({ msg: "Setoran berhasil" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateSetor = async (req, res) => {
  try {
    const setor = await Setor.findOne({
      where: { id: req.params.id },
    });
    if (!setor)
      return res.status(404).json({ msg: "Data setor tidak ditemukan" });
    const { quantity, unit, date, sampahId, rwId } = req.body;
    if (req.user.role === "admin") {
      await Setor.update(
        { quantity, unit, date, sampahId, rwId },
        { where: { id: setor.id } },
      );
    } else if (req.user.role === "koor" || req.user.role === "pekerja") {
      if (setor.rwId !== req.user.rwId)
        return res.status(403).json({ msg: "Akses RW lain tidak diizinkan" });
      await Setor.update(
        { quantity, unit, date, sampahId, rwId },
        { where: { id: setor.id, rwId: req.user.rwId } },
      );
    } else {
      if (setor.userId !== req.userId)
        return res
          .status(403)
          .json({ msg: "Akses dibatasi hanya data sendiri" });
      await Setor.update(
        { quantity, unit, date, sampahId, rwId },
        { where: { id: setor.id, userId: req.userId } },
      );
    }
    res.status(200).json({ msg: "Data setor berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteSetor = async (req, res) => {
  try {
    const setor = await Setor.findOne({
      where: { id: req.params.id },
    });
    if (!setor)
      return res.status(404).json({ msg: "Data setor tidak ditemukan" });
    if (req.user.role === "admin") {
      await Setor.destroy({ where: { id: setor.id } });
    } else if (req.user.role === "koor" || req.user.role === "pekerja") {
      if (setor.rwId !== req.user.rwId)
        return res.status(403).json({ msg: "Akses RW lain tidak diizinkan" });
      await Setor.destroy({ where: { id: setor.id, rwId: req.user.rwId } });
    } else {
      if (setor.userId !== req.userId)
        return res
          .status(403)
          .json({ msg: "Akses dibatasi hanya data sendiri" });
      await Setor.destroy({ where: { id: setor.id, userId: req.userId } });
    }
    res.status(200).json({ msg: "Data setor berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getMonthlySummary = async (req, res) => {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const setor = await Setor.findAll({
      where: {
        date: {
          [Op.between]: [firstDay, lastDay],
        },
      },
      include: [{ model: Sampah, attributes: ["category"] }],
    });
    let organik = 0;
    let nonOrganik = 0;
    let residu = 0;
    let total = 0;
    setor.forEach((item) => {
      const qty = item.quantity;
      total += qty;
      switch (item.sampah.category.toLowerCase()) {
        case "organik":
          organik += qty;
          break;
        case "non organik":
        case "non-organik":
          nonOrganik += qty;
          break;
        case "residu":
          residu += qty;
          break;
      }
    });
    res.status(200).json({
      total,
      organik,
      nonOrganik,
      residu,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTotalSampah = async (req, res) => {
  try {
    const total = await Setor.sum("quantity");
    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSummaryByMonth = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const summaries = [];
    for (let i = 0; i < 12; i++) {
      const firstDay = new Date(currentYear, i, 1);
      const lastDay = new Date(currentYear, i + 1, 0);
      const setor = await Setor.findAll({
        where: {
          date: {
            [Op.between]: [firstDay, lastDay],
          },
        },
        include: [{ model: Sampah, attributes: ["category"] }],
      });
      let total = 0;
      setor.forEach((item) => {
        total += item.quantity;
      });
      summaries.push(total);
    }
    res.status(200).json(summaries);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getDataRW = async (req, res) => {
  try {
    const rws = await RW.findAll();
    const data = [];
    for (const rw of rws) {
      const users = await User.findAll({ where: { rwId: rw.id } });
      const koor = await User.findOne({
        where: { rwId: rw.id, role: "koor" },
      });
      const totalSampah = await Setor.sum("quantity", {
        where: { rwId: rw.id },
      });
      data.push({
        nama: koor ? koor.name : "Belum ada Koor",
        rw: rw.name,
        pekerja: users.length,
        jumlah: totalSampah,
      });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getDataRWMonthly = async (req, res) => {
  try {
    console.log("🔍 Query params:", req.query); // DEBUG

    // ✅ DEFAULT: Bulan & tahun ini jika tidak ada parameter
    const bulan = req.query.bulan || new Date().getMonth() + 1; // Bulan sekarang
    const tahun = req.query.tahun || new Date().getFullYear(); // Tahun sekarang

    console.log(`📅 Filter bulan: ${bulan}, tahun: ${tahun}`);

    const startDate = new Date(parseInt(tahun), parseInt(bulan) - 1, 1);
    const endDate = new Date(parseInt(tahun), parseInt(bulan), 0);

    console.log(`📅 Date range: ${startDate} to ${endDate}`);

    const rws = await RW.findAll();
    const data = [];

    for (const rwItem of rws) {
      const users = await User.findAll({ where: { rwId: rwItem.id } });
      const koor = await User.findOne({
        where: { rwId: rwItem.id, role: "koor" },
      });

      // ✅ OPTIMIZE: Single query dengan GROUP BY
      const setor = await Setor.findAll({
        where: {
          rwId: rwItem.id,
          date: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [{ model: Sampah, attributes: ["category"] }],
      });

      let organik = 0;
      let nonOrganik = 0;
      let residu = 0;
      let total = 0;

      setor.forEach((item) => {
        const qty = parseFloat(item.quantity) || 0; // ✅ Pastikan number
        total += qty;
        const category = item.sampah.category.toLowerCase();
        switch (category) {
          case "organik":
            organik += qty;
            break;
          case "non organik":
          case "non-organik":
            nonOrganik += qty;
            break;
          case "residu":
            residu += qty;
            break;
        }
      });

      data.push({
        rw: rwItem.name, // ✅ Sesuai type RWData
        organik: Math.round(organik * 100) / 100, // 2 desimal
        nonOrganik: Math.round(nonOrganik * 100) / 100,
        residu: Math.round(residu * 100) / 100,
        total: Math.round(total * 100) / 100,
      });
    }

    console.log("📊 Final data:", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ getDataRWMonthly ERROR:", error);
    res.status(500).json({ msg: error.message });
  }
};
