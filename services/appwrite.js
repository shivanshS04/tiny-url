import { Client, Databases, ID } from "appwrite";
import { NextResponse } from "next/server";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("64fc03471ea3ee466d78");

const database = new Databases(client);

export function createUrlRecord(url_id, url) {
  database
    .createDocument(
      "64fc044ee5653df6e0ae",
      "64fc045f87351bf03f53",
      ID.unique(),
      {
        url_id,
        url,
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