const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { https } = require("firebase-functions/v2");

admin.initializeApp();

exports.setAuthLevel = functions.https.onCall((data, context) => {
  const email = data.email;
  const authLevel = data.authLevel;
  if (!["1", "2", "3"].includes(authLevel)) {
    throw new https.HttpsError("invalid-argument");
  }
  return admin
    .auth()
    .getUserByEmail(email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, {
        authLevel: authLevel,
      });
    })
    .then(() => {
      return {
        message: `Success! ${email}'s auth level is ${authLevel} now.`,
      };
    })
    .catch((err) => {
      throw err;
    });
});

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

exports.updateUser = functions.https.onCall((data, context) => {
  return admin.auth().getUser();
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
