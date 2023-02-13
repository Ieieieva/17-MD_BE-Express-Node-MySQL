/* eslint-disable prettier/prettier */
import express from "express";
import { Request, Response } from "express";
import bodyparser from "body-parser";
import cors from "cors";
import mysql from "mysql2";

const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  port: 3306,
  database: "Blog"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


app.use(bodyparser.json());
app.use(cors({ origin: "*" }));

app.get("/", (req: Request, res: Response) => {
  res.send("Application works!");
});


app.get("/posts", (req: Request, res: Response) => {
  const quer = "SELECT * FROM posts"
  connection.query(quer, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})


app.get("/posts/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const quer = `SELECT * FROM posts WHERE id = ${id}`;
  connection.query(quer, (err, data) => {
    if(err) throw err;
    res.json(data);
    console.log(data)
  })
})


app.get("/comments", (req: Request, res: Response) => {
  const quer = "SELECT * FROM comments"
  connection.query(quer, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

// app.get("/comments/:id", (req: Request, res: Response) => {
//   const id = req.params.id;
//   const quer = `SELECT * FROM comments WHERE post_id = ${id};`;
//   connection.query(quer, (err, data) => {
//     if (err) return res.json(err)
//     res.send(data)
//     console.log(data)
//   })
// })


app.post("/comments", (req: Request, res: Response) => {
  const quer = "INSERT INTO comments (comment, image, author) VALUES (?)";
  const values = [
    req.body.comment,
    req.body.image,
    req.body.author,
  ];

  console.log(req.body.comment)

  connection.query(quer, [values], (err, data) => {
    if (err) {
      return res.json(err);
    } 
    return res.json('Successfully added comment');
  })
})


app.delete("/comments/:id", (req: Request, res: Response) => {
  const commentId = req.params.id;
  const quer = "DELETE FROM comments WHERE id = ?"

  connection.query(quer, [commentId], (err, data) => {
    if (err) {
      return res.json(err);
    } 
    return res.json('Successfully deleted comment');
  })
})


app.post("/posts", (req: Request, res: Response) => {
  const quer = "INSERT INTO posts (image, title, content) VALUES (?)";
  const values = [
    req.body.image,
    req.body.title,
    req.body.content,
  ];

  connection.query(quer, [values], (err, data) => {
    if (err) {
      return res.json(err);
    } 
    return res.json('Successfully added post');
  })
})


app.put("/posts/:id", (req: Request, res: Response) => {
  const postId = req.params.id;
  const quer = `UPDATE posts SET image = ?, title = ?, content = ? WHERE id = ${postId}`;

  const values = [
    req.body.image,
    req.body.title,
    req.body.content,
  ]

  connection.query(quer, [...values, postId], (err, data) => {
    if (err) {
      return res.json(err);
    } 
    return res.json('Successfully deleted post');
  })
})


app.delete("/posts/:id", (req: Request, res: Response) => {
  const postId = req.params.id;
  const quer = `DELETE FROM posts WHERE id = ${postId}`

  connection.query(quer, [postId], (err, data) => {
    if (err) {
      return res.json(err);
    } 
    return res.json('Successfully deleted post');
  })
})


app.listen(3004, () => {
  console.log("Application started on port 3004!");
});
