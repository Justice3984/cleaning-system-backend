exports.assignAvailableStaff = () => {
  return "sampleStaffId"; // mock for demo
};

exports.sendNotification = (userId, message) => {
  console.log(`Notification to ${userId}: ${message}`);
};

exports.generateRandom6Digit = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
