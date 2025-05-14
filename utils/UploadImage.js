import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

export async function uploadImageAsync(localUri, path = "events") {
  const response = await fetch(localUri);
  const blob = await response.blob();

  // e.g. "events/uniquename.jpg"
  const filename = `${path}/${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, blob); // upload :contentReference[oaicite:5]{index=5}
  const url = await getDownloadURL(storageRef); // get public URL :contentReference[oaicite:6]{index=6}
  return url;
}
