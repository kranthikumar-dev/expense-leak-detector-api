import * as service from "./auth.service.js";

export const register = async (req, res) => {
  const user = await service.register(req.body.email, req.body.password);
  res.json(user);
};

export const login = async (req, res) => {
  const data = await service.login(req.body.email, req.body.password);
  res.json(data);
};
