import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  if (req.session.userId) {
    return res.status(400).json({ msg: "Mohon logout terlebih dahulu" });
  }
  const user = await User.findOne({
    where: {
      nip: req.body.nip,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  const match = await argon2.verify(user.password, req.body.password);
  if (!match) return res.status(400).json({ msg: "Password salah!" });
  req.session.userId = user.id;
  const id = user.id;
  const nip = user.nip;
  const name = user.name;
  const role = user.role;
  const rw = user.rwId;
  res.status(200).json({ id, nip, name, role, rw });
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon login ke akun anda" });
  }
  const user = await User.findOne({
    attributes: ["id", "nip", "name", "role", "rwId"],
    where: {
      id: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  res.status(200).json(user);
};

export const Logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
    //tore.sync();
    res.clearCookie("connect.sid");
    res.status(200).json({ msg: "Anda telah logout" });
  });
};
