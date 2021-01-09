const AWS = require("aws-sdk");
const fs = require("fs");
const Finance = require("financejs");
const dotenv = require("dotenv");
dotenv.config();

AWS.config.update({
  region: "us-east-2",
  endpoint: "https://s3.us-east-2.amazonaws.com",
  accessKeyId: process.env.S3_Access_Key_ID,
  secretAccessKey: process.env.S3_Secret_Access_Key,
});

const S3 = new AWS.S3({ apiVersion: "2006-03-01" });

const calculate = ({ cagr, time, sip }) => {
  function Amount(invested, accumulated) {
    this.investedAmount = invested;
    this.accumulatedAmount = Math.ceil(accumulated);
  }

  time = time === 0 ? 1 : time;
  const finance = new Finance();

  const returnPercent = (Math.pow(1 + cagr / 100, 1 / 12) - 1) * 100;
  let accumulatedAmount = 0,
    investedAmount = 0;
  const rows = [];
  for (let i = 1; i <= time * 12; i++) {
    investedAmount = sip * i;
    accumulatedAmount = finance.FV(returnPercent, sip + accumulatedAmount, 1);

    rows.push(new Amount(investedAmount, accumulatedAmount));
  }

  console.table(rows);
};

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
        // GrantFullControl: "READ",
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
    console.error(error);
    console.log("ERROR");
  }
};

calculate({ cagr: 5, time: 10, sip: 15000 });

// main();
