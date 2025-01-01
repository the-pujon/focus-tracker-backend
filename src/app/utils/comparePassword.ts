import bcrypt from "bcrypt";
async function isPasswordMatch(plainPassword: string, hashedPassword: string) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export default isPasswordMatch;
