import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
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
  req.user = user;
  next();
};

export const roleMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ msg: "Mohon login ke akun anda" });
    }
    const user = await User.findOne({
      attributes: ["id", "nip", "name", "role", "rwId"],
      where: { id: req.session.userId },
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ msg: "Akses terlarang" });
    }
    req.user = user;
    next();
  };
};
