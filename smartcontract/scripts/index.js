const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const ethers = require("ethers");
const PushAPI = require("@pushprotocol/restapi");

require("dotenv").config();

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signer = new ethers.Wallet(process.env.PRIVATE_KEY);

const MATIC_PRICE = 2.1;
const ETH_PRICE = 2096;

const getChannel = async () => {
  const channelInstance = await PushAPI.PushAPI.initialize(signer, {
    env: PushAPI.CONSTANTS.ENV.STAGING,
    account: signer.address,
  });
  const channelDetails = await channelInstance.channel.info(
    `eip155:11155111:${signer.address}`
  );
  const channelSettings = JSON.parse(channelDetails.channel_settings);

  // Create an array of empty array with the same length as channelSettings
  const recipientsArr = Array.from(
    { length: channelSettings.length },
    () => []
  );

  const channelSubs = await channelInstance.channel.subscribers();

  // Define an asynchronous function to process each subscriber
  const processSubscriber = async (sub, index) => {
    const subscriptions = await channelInstance.notification.subscriptions({
      account: sub,
    });

    const userSetting = subscriptions.filter(
      (subscription) =>
        subscription.channel.toLowerCase() === signer.address.toLowerCase()
    );

    if (userSetting[0].user_settings == null) {
      for (let i = 0; i < channelSettings.length; i++) {
        if (
          channelSettings[i].type === 1 &&
          channelSettings[i].default === true
        ) {
          recipientsArr[i].push(sub);
        } else if (
          channelSettings[i].type === 2 &&
          channelSettings[i].enabled === true
        ) {
          if (i === 2 && channelSettings[i].default === MATIC_PRICE)
            recipientsArr[i].push(sub);
          if (i === 3 && channelSettings[i].default === ETH_PRICE)
            recipientsArr[i].push(sub);
        }
      }
    } else {
      const userSettingArr = JSON.parse(userSetting[0].user_settings);
      for (let i = 0; i < channelSettings.length; i++) {
        if (userSettingArr[i].type === 1 && userSettingArr[i].user === true) {
          recipientsArr[i].push(sub);
        } else if (
          userSettingArr[i].type === 2 &&
          userSettingArr[i].enabled === true
        ) {
          if (i === 2 && userSettingArr[i].user === MATIC_PRICE)
            recipientsArr[i].push(sub);
          if (i === 3 && userSettingArr[i].user === ETH_PRICE)
            recipientsArr[i].push(sub);
        }
      }
    }
  };

  // Use Promise.all to execute the asynchronous function for each subscriber
  await Promise.all(
    channelSubs.map((sub, index) => processSubscriber(sub, index))
  );

  await Promise.all(
    recipientsArr.map(async (recipient, index) => {

      if (recipient.length === 0) return;

      let notifBody = "";
      if (index === 0) {
        notifBody = `MATIC current price is ${MATIC_PRICE}$`;
      } else if (index === 1) {
        notifBody = `ETH current price is ${ETH_PRICE}$`;
      } else if (index === 2) {
        notifBody = `ALERT!!! MATIC price reached ${MATIC_PRICE}$`;
      } else if (index === 3) {
        notifBody = `ALERT!!! ETH price reached ${ETH_PRICE}$`;
      }

      const notification = {
        title: channelSettings[index].description,
        body: notifBody,
      };

      try {
        await channelInstance.channel.send(recipient, {
          notification: notification,
          payload: {
            category: index,
          },
        });
      } catch (err) {
        console.log(err);
      }
    })
  );
};

// Schedule a cron job to run every 14 minutes
cron.schedule("* * * * *", async () => {
  console.log("running again");
  await getChannel();
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
