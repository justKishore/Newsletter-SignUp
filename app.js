// https://mailchimp.com/developer/marketing/guides/create-your-first-audience/

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
// npm install @mailchimp/mailchimp_marketing
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
const port = 3000;

// for serving statics files like our css or images from local machine
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Sending signup page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// Setup mailchimp

mailchimp.setConfig({
  apiKey: "6f23d11bfcc1c33e5776e12d1820504f-us14",
  server: "us14",
});

// post request

app.post("/", function (req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const listId = "9096f0a341"; // mailchimp listid
  // console.log(`${fname}, ${lname}, ${email}`);

  // mailchimp required format for user data

  const subscribingUser = {
    firstName: fname,
    lastName: lname,
    email: email,
  };

  // sending data to mailchimp server
  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      });

      console.log(response);
      // res.send("Successfully subscriber to my newsletter!");
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      // res.send("Failed to subscriber to my newsletter");
      res.sendFile(__dirname + "/failure.html");
    }
  }

  //running code
  run();
});

// failure post route

app.post("/failure", function (req, res) {
  // take back to home page or home route
  res.redirect("/");
});

// Listen to dynamic port or our port 3000
app.listen(process.env.PORT || port, function () {
  console.log("Server running at port " + port);
});
