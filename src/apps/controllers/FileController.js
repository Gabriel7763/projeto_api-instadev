require('dotenv').config();

const B2 = require('backblaze-b2');
const fsp = require('fs/promises');

const {
  APPLICATION_KEY_ID,
  APPLICATION_KEY,
  BUCKET_ID,
  BASE_URL_BACKBLAZE,
} = process.env;

const b2 = new B2({
  applicationKeyId: APPLICATION_KEY_ID,
  applicationKey: APPLICATION_KEY,
});

const unlinkAsync = fsp.unlink;

class FileController {
  async upload(req, res) {
    const { filename, path } = req.file;

    try {
      const file = await fsp.readFile(`uploads/${filename}`, (err, data) => {
        if (err) {
          throw err;
        }

        return data;
      });

      await b2.authorize();

      const { data: { uploadUrl, authorizationToken } } = await b2.getUploadUrl({
        bucketId: BUCKET_ID,
      });

      const { data } = await b2.uploadFile({
        uploadUrl,
        uploadAuthToken: authorizationToken,
        fileName: filename,
        data: file,
      });

      await unlinkAsync(path);

      return res.send({
        url: `${BASE_URL_BACKBLAZE}${data.fileName}`,
      });
    } catch (error) {
      return res.send(400).send({ message: 'Failed to upload file' });
    }
  }
}

module.exports = new FileController();
