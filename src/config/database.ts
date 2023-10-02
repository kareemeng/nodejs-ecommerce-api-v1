import mongoose from "mongoose";

// database connection
export const db_connection = () => {
  mongoose
    .connect(`${process.env.DATABASE}/${process.env.DB_NAME}`)
    .then((connect) => {
      console.log(`database connected: ${connect.connection.host}`);
    })
    .catch((error) => {
      console.log(`database connection error: ${error}`);
      process.exit(1);
    });
};
