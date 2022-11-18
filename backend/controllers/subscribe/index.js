const { Subscriber } = require("./email.subscribe");
const { getSubscriberFromDb } = require("./getSubscriber");
module.exports = {
  Subscriber,
  getSubscriberFromDb,
};
