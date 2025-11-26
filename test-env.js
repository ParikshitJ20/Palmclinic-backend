import dotenv from "dotenv";
dotenv.config();

console.log("HOST =", process.env.DB_HOST);
console.log("USER =", process.env.DB_USER);
console.log("PASS =", process.env.DB_PASSWORD);
console.log("DB   =", process.env.DB_NAME);
