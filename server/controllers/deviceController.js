import Device from "../models/deviceModel.js";

export const getDevices = async (req, res) => {
  const devices = await Device.find({
    userId: req.user.id,
  });

  res.json(devices);
};

export const removeDevice = async (req, res) => {
  await Device.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message: "Device removed",
  });
};