const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { https } = require("firebase-functions/v2");

admin.initializeApp();

exports.createUser = functions.https.onCall((data, context) => {
  if (!["1", "2", "3"].includes(data.authLevel)) {
    throw new https.HttpsError("invalid-argument");
  }
  return admin
    .auth()
    .createUser({
      email: data.email,
      password: data.password,
      displayName: data.displayName,
    })
    .then((user) => {
      admin.auth().setCustomUserClaims(user.uid, { authLevel: data.authLevel });
      return {
        message: `Success! Created user with ${data.email} email.`,
      };
    })
    .catch((err) => {
      throw err;
    });
});

exports.getLecturerUID = functions.https.onCall((data, context) => {
  const email = data.email;
  return admin
    .auth()
    .getUserByEmail(email)
    .then((user) => {
      if (user.customClaims["authLevel"] === "2") {
        return user.uid;
      } else {
        throw new https.HttpsError("failed-precondition");
      }
    })
    .catch((err) => {
      throw err;
    });
});

exports.getUsers = functions.https.onCall((data, context) => {
  let users = [];
  return admin
    .auth()
    .listUsers()
    .then((listUsersResult) => {
      listUsersResult.users.forEach((user) => {
        if (user.customClaims["authLevel"] === data.authLevel) {
          users.push(user.toJSON());
        }
      });
      return users;
    })
    .catch((err) => {
      throw err;
    });
});

exports.getUser = functions.https.onCall((data, context) => {
  return admin
    .auth()
    .getUser(data.uid)
    .then((userRecord) => {
      return userRecord;
    })
    .catch((err) => {
      throw err;
    });
});

exports.getDisplayNameFromUID = functions.https.onCall((data, context) => {
  return admin
    .auth()
    .getUser(data.uid)
    .then((user) => {
      return user.displayName;
    })
    .catch((err) => {
      throw err;
    });
});

exports.deleteUser = functions.https.onCall((data, context) => {
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      return admin
        .auth()
        .deleteUser(user.uid)
        .then(() => {
          return { message: `Success. ${user.email} has been deleted.` };
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    })
    .catch((err) => {
      return Promise.reject(err);
    });
});
