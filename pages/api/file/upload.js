export default async function handler(req, res) {
  try {
    // const formData = await req.formData();
    // console.log(formData);

    // console.log(formData.getAll("files"));
    console.log("Here");

    return res.status(200).json({
      message: "Files Uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while uploading file" });
  }
}
