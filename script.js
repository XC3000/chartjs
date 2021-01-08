const AWS = require("aws-sdk");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

AWS.config.update({
  region: "us-east-2",
  endpoint: "https://s3.us-east-2.amazonaws.com",
  accessKeyId: process.env.S3_Access_Key_ID,
  secretAccessKey: process.env.S3_Secret_Access_Key,
});

const S3 = new AWS.S3({ apiVersion: "2006-03-01" });

const listItems = () =>
  new Promise((res, rej) => {
    S3.listObjects(
      {
        Bucket: "chartsjs",
      },
      (err, data) => {
        if (err) {
          console.error(err);
          rej(null);
        } else res(data);
      }
    );
  });

const deleteItems = (items = []) =>
  new Promise((res, rej) => {
    S3.deleteObjects(
      {
        Bucket: "chartsjs",
        Delete: {
          Objects: items.map((key) => {
            return { Key: key };
          }),
        },
      },
      (err, data) => {
        if (err) {
          console.error(err);
          rej(null);
        } else {
          res(data);
        }
      }
    );
  });

const listFiles = () =>
  new Promise((res, rej) => {
    fs.readdir("./dist", (err, files) => {
      if (err) {
        console.error(err);
        rej(null);
      } else {
        res(files);
      }
    });
  });

const uploadFile = (key) =>
  new Promise((res, rej) => {
    S3.upload(
      {
        Bucket: "chartsjs",
        Key: key,
        Body: fs.readFileSync(`./dist/${key}`),
        ACL: "public-read-write",
      },
      {},
      (err, data) => {
        if (err) {
          console.error(err);
          rej(null);
        } else {
          res(data);
        }
      }
    );
  });

const uploadFiles = async (files = []) => {
  for (let i = 0; i < files.length; i++) {
    try {
      await uploadFile(files[i]);
      console.log(`Uploaded ${i + 1}/${files.length}`);
    } catch (error) {
      console.error(error);
    }
  }

  console.log("\x1b[32m%s", "All Files Successfully Uploaded");
};

const main = async () => {
  try {
    const { Contents: items } = await listItems();
    console.log("S3 Bucket Items Listed.");

    const itemsToDelete = items
      .map((item) => item.Key)
      .filter((key) => !key.endsWith("png"));

    await deleteItems(itemsToDelete);
    console.log("Bucket Items Deleted");

    const files = await listFiles();
    console.log("Local Files Listed");

    uploadFiles(files);
  } catch (error) {
    console.log("ERROR");
  }
};

main();
