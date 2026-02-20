import { Op } from "sequelize";
import User from "../models/UserModel.js";
import RW from "../models/RWModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    let response;
    if (req.user.role === "admin" || req.user.role === "visitor") {
      response = await User.findAll({
        attributes: ["id", "nip", "name", "role", "rwId"],
        order: [["id", "ASC"]],
      });
    } else if (req.user.role === "koor" || req.user.role === "pekerja") {
      response = await User.findAll({
        attributes: ["id", "nip", "name", "role", "rwId"],
        where: { rwId: req.user.rwId },
        order: [["id", "ASC"]],
      });
    } else {
      return res.status(403).json({ msg: "Akses tidak diizinkan" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ["id", "nip", "name", "role", "rwId"],
      where: {
        id: req.params.id,
      },
    });
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, password, confPassword, role, rwId } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok" });
  const hashPassword = await argon2.hash(password);
  let lastUser = await User.findOne({ order: [["createdAt", "DESC"]] });
  let lastNumber = 0;
  if (lastUser && lastUser.nip && lastUser.nip.includes("-")) {
    lastNumber = parseInt(lastUser.nip.split("-")[1]) || 0;
  }
  const newNip = `ECOV-${String(lastNumber + 1).padStart(4, "0")}`;
  try {
    await User.create({
      nip: newNip,
      name: name,
      password: hashPassword,
      role: role,
      rwId: role === "admin" || role === "visitor" ? null : rwId,
    });
    res.status(201).json({ msg: "User berhasil dibuat!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    console.log("PATCH /users/:id - req.body:", req.body);

    const user = await User.findOne({
      where: { id: req.params.id },
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const { name, password, confPassword, role, rwId } = req.body;

    let hashPassword = user.password;
    if (
      password &&
      password !== "" &&
      confPassword &&
      password === confPassword
    ) {
      hashPassword = await argon2.hash(password);
    } else if (password && confPassword && password !== confPassword) {
      return res
        .status(400)
        .json({ msg: "Password dan Confirm Password tidak cocok" });
    }

    await User.update(
      {
        name: name || user.name,
        password: hashPassword,
        role: role || user.role,
        rwId: role === "admin" || role === "visitor" ? null : rwId || user.rwId,
      },
      { where: { id: user.id } },
    );

    const updatedUser = await User.findOne({
      where: { id: user.id },
      attributes: ["id", "nip", "name", "role", "rwId"],
    });

    res.status(200).json({
      msg: "User berhasil diupdate",
      data: {
        // ✅ Format sesuai frontend
        id: updatedUser.id,
        nama: updatedUser.name,
        rw: updatedUser.rwId || null,
        role: updatedUser.role,
        nip: updatedUser.nip,
      },
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error); // ✅ Log error
    res.status(500).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  try {
    await User.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "User Bberhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const countPekerja = async (req, res) => {
  try {
    const total = await User.count({
      where: {
        role: {
          [Op.in]: ["admin", "koor", "pekerja"],
        },
      },
    });
    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["id", "nip", "name", "role", "rwId", "foto"],
      include: [
        {
          model: RW,
          attributes: ["name"],
          as: "RW",
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }
    res.status(200).json({
      name: user.name,
      rw: user.RW?.name || "",
      role: user.role,
      nip: user.nip,
      foto: user.foto || "/images/user/owner.jpg",
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getWorkers = async (req, res) => {
  try {
    let workers;
    if (req.user.role === "admin" || req.user.role === "visitor") {
      workers = await User.findAll({
        attributes: ["id", "nip", "name", "role", "rwId"],
        where: {
          role: {
            [Op.in]: ["koor", "pekerja"],
          },
        },
        order: [["id", "ASC"]],
      });
    } else if (req.user.role === "koor" || req.user.role === "pekerja") {
      workers = await User.findAll({
        attributes: ["id", "nip", "name", "role", "rwId"],
        where: {
          role: {
            [Op.in]: ["koor", "pekerja"],
          },
          rwId: req.user.rwId,
        },
        order: [["id", "ASC"]],
      });
    } else {
      return res.status(403).json({ msg: "Akses tidak diizinkan" });
    }
    const formattedWorkers = workers.map((worker) => ({
      id: worker.id,
      nama: worker.name,
      rw: worker.rwId,
      role: worker.role,
      nip: worker.nip,
    }));
    res.status(200).json(formattedWorkers);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
