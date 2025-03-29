const db = require("../db");

const getDriverByPhoneAndLicense = async (phoneNumber, licenseNumber) => {
  const result = await db.query(
    "SELECT * FROM drivers WHERE phone_number = ? AND license_number = ?",
    [phoneNumber, licenseNumber]
  );
  return result.length > 0 ? result[0] : null;
};

const createDriver = async (phoneNumber, licenseNumber) => {
  await db.query(
    "INSERT INTO drivers (phone_number, license_number) VALUES (?, ?)",
    [phoneNumber, licenseNumber]
  );
  return getDriverByPhoneAndLicense(phoneNumber, licenseNumber);
};

const saveOtp = async (phoneNumber, otp) => {
  await db.query(
    "UPDATE drivers SET otp = ?, otp_expiry = NOW() + INTERVAL 5 MINUTE WHERE phone_number = ?",
    [otp, phoneNumber]
  );
};

const verifyOtp = async (phoneNumber, otp) => {
  const result = await db.query(
    "SELECT otp FROM drivers WHERE phone_number = ? AND otp = ?",
    [phoneNumber, otp]
  );
  return result.length > 0;
};

const clearOtp = async (phoneNumber) => {
  await db.query("UPDATE drivers SET otp = NULL WHERE phone_number = ?", [
    phoneNumber,
  ]);
};

module.exports = {
  getDriverByPhoneAndLicense,
  createDriver,
  saveOtp,
  verifyOtp,
  clearOtp,
};
