import { getStorage } from "firebase/storage";
import app from "./app";

const storage = getStorage(app);
export default storage;
