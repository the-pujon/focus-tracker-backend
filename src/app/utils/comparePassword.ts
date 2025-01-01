import bcrypt from "bcrypt";
async function comparePassword(plainPassword: string, hashedPassword: string) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export default comparePassword;
