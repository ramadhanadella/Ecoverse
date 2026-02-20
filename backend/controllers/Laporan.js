import Setor from "../models/SetorModel.js";
import User from "../models/UserModel.js";
import RW from "../models/RWModel.js";
import Sampah from "../models/SampahModel.js";
import { Op, Sequelize } from "sequelize";

export const getLaporanSummary = async (req, res) => {
  try {
    const bulan = req.query.bulan || new Date().getMonth() + 1;
    const tahun = req.query.tahun || new Date().getFullYear();

    const startDate = new Date(parseInt(tahun), parseInt(bulan) - 1, 1);
    const endDate = new Date(parseInt(tahun), parseInt(bulan), 0);

    // 1. Total sampah per jenis
    const totals = await Setor.findAll({
      where: {
        date: { [Op.between]: [startDate, endDate] },
      },
      include: [{ model: Sampah, attributes: ["category"] }],
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "total"],
        [Sequelize.col("sampah.category"), "jenis"],
      ],
      group: ["sampah.category"],
      raw: true,
    });

    // 2. Total pekerja per RW
    const rws = await RW.findAll();
    const rwData = [];
    for (const rw of rws) {
      const pekerjaCount = await User.count({
        where: { rwId: rw.id, role: { [Op.in]: ["koor", "pekerja"] } },
      });
      const totalSampahRW =
        (await Setor.sum("quantity", {
          where: {
            rwId: rw.id,
            date: { [Op.between]: [startDate, endDate] },
          },
        })) || 0;

      rwData.push({
        rw: rw.name,
        pekerja: pekerjaCount,
        sampah: parseFloat(totalSampahRW.toFixed(2)),
      });
    }

    res.json({
      periode: `${bulan}/${tahun}`,
      totals,
      rwData,
      generatedAt: new Date().toLocaleString("id-ID"),
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getLaporanSetoran = async (req, res) => {
  try {
    const bulan = req.query.bulan || new Date().getMonth() + 1;
    const tahun = req.query.tahun || new Date().getFullYear();

    const startDate = new Date(parseInt(tahun), parseInt(bulan) - 1, 1);
    const endDate = new Date(parseInt(tahun), parseInt(bulan), 0);

    const data = await Setor.findAll({
      where: { date: { [Op.between]: [startDate, endDate] } },
      include: [
        { model: User, attributes: ["name", "nip", "role"] },
        { model: Sampah, attributes: ["category"] },
        { model: RW, attributes: ["name"] },
      ],
      order: [["date", "DESC"]],
    });

    res.json({ data, periode: `${bulan}/${tahun}` });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
