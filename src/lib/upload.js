
const upload = async (file) => {
  if (!file) return null;

  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'using-for-chat-app');
  data.append('cloud_name', 'ddo8blgoh');

  const res = await fetch(import.meta.env.VITE_FIREBASE_CLOUDINARY, {
    method: 'POST',
    body: data,
  });

  const result = await res.json();

  return result.url; // or use secure_url
};

export default upload;
