import { Account, Client, Databases, ID } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("64fc03471ea3ee466d78");

const account = new Account(client);

export async function createUser(email, password) {
  let res = await account.create(ID.unique(), email, password).then(
    (response) => {
      console.log(response);
      return "success";
    },
    (error) => {
      console.error(error);
      return error;
    }
  );
  return res;
}

export async function login(email, password) {
  let res = await account.createEmailSession(email, password).then(
    (response) => {
      console.log(response);
      return "success";
    },
    (error) => {
      console.error(error);
      return error;
    }
  );
  return res;
}

const database = new Databases(client);

export function createUrlRecord(url_id, url, user) {
  database
    .createDocument(
      "64fc044ee5653df6e0ae",
      "64fc045f87351bf03f53",
      ID.unique(),
      {
        url_id,
        url,
        user,
      }
    )
    .then(
      function (response) {
        console.log(response);
        return "success";
      },
      function (error) {
        console.log(error);
        return "error";
      }
    );
}

export async function getUrlRecord(url_id) {
  let result = await database
    .listDocuments("64fc044ee5653df6e0ae", "64fc045f87351bf03f53")
    .then(
      function (response) {
        const data = response.documents.filter((item) => item.url_id == url_id);
        console.log(data);
        if (data.length > 0) {
          console.log(data[0].url);
          return data[0].url;
        } else {
          console.log("not found");
          return "not found";
        }
      },
      function (error) {
        console.log(error);
      }
    );
  return result;
}

export async function getUserUrls(user) {
  let result = await database
    .listDocuments("64fc044ee5653df6e0ae", "64fc045f87351bf03f53")
    .then(
      function (response) {
        const data = response.documents.filter((item) => item.user == user);
        return data;
      },
      function (error) {
        return error;
      }
    );
  return result;
}



<script src="https://gist.github.com/shivanshS04/e621504fc088d80d06891f398ca96b87.js"></script>;