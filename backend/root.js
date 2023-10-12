const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config();

function exchangeCode(code) {
  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: code,
  });

  return axios.post("https://github.com/login/oauth/access_token", params, {
    headers: {
      Accept: "application/json",
    },
  });
}

app.get("/githubauthorized", async (req, res) => {
  const code = req.query.code;
  try {
    const response = await exchangeCode(code);
    const tokenData = response.data;

    if (tokenData.access_token) {
      res.status(200).send(tokenData.access_token);
    } else {
      const render = `error`;

      res.send(render);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("error");
  }
});
app.post("/repository", async (req, res) => {
  const token = req.body.token;

  try {
    const params = {
      q: `${req.query.filter}`,
      sort: "stars",
      order: `${req.query.sort}`,
      per_page: 100,
    };

    const t = await axios.get("https://api.github.com/search/repositories", {
      params,
      headers: {
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = t.data.items;
    // console.log(t);

    const contri = [];

    await Promise.all(
      data.map(async (d) => {
        if (d.contributors_url) {
          const header = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          };

          const params = { per_page: 100 };
          try {
            const contributor = await axios.get(d.contributors_url, {
              headers: header,
              params,
            });

            contributor.data.forEach((cd) => {
              contri.push(cd);
            });
            contri.sort((a, b) => b.contributions - a.contributions);
          } catch (error) {
            console.error("Error fetching contributors:", error);
          }
        }
      })
    );

    console.log("contri length:", contri.length);
    res.status(200).json(contri);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/user", async (req, res) => {
  let cd = [];
  const token = req.body.token;
  const header = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  console.log(req.query.filter);
  const { data } = await axios.get(
    `https://api.github.com/users/${req.query.filter}`,
    { headers: header }
  );

  cd.push(data);

  res.status(200).json(cd);
});
app.get("/loggedIn", async (req, res) => {
  const token = req.query.token;

  const header = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const { data } = await axios.get("https://api.github.com/user", {
    headers: header,
  });
  //  console.log(data);
  res.status(200).json(data);
});
http: app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
