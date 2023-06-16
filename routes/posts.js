const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const Posts = require("../schemas/posts");

router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find();

    const postsData = posts.map((data) => {
      return {
        postId: data.postId,
        user: data.user,
        title: data.title,
        createdAt: data.createdAt,
      };
    });

    return res.status(200).json({ data: postsData });
  } catch (error) {
    return res
      .status(400)
      .json({ error, message: "데이터 형식이 올바르지 않습니다." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { user, password, title, content } = req.body;

    if (!(user && password && title && content)) {
      return res
        .status(400)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
    const createdPost = await Posts.create({
      postId: uuidv4(),
      user,
      password,
      title,
      content,
    });

    return res.status(201).json({ message: "게시글을 생성하였습니다." });
  } catch (error) {
    return res
      .status(400)
      .json({ error, message: "데이터 형식이 올바르지 않습니다." });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Posts.findOne({ postId });

    if (!post) {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    return res.status(200).json({
      data: {
        postId,
        user: post.user,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
      },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ error, message: "데이터 형식이 올바르지 않습니다." });
  }
});

router.put("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { user, password, title, content } = req.body;

    const post = await Posts.findOne({ postId });

    if (!(user && password && title && content)) {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    if (!post) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    }

    if (post.password === password) {
      await Posts.updateOne({ postId }, { $set: { title, content } });
    } else {
      return res.status(401).json({ message: "비빌번호가 올바르지 않습니다." });
    }
    return res.status(200).json({ message: "게시글을 수정하였습니다." });
  } catch (error) {
    return res
      .status(400)
      .json({ error, message: "데이터 형식이 올바르지 않습니다." });
  }
});

router.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { password } = req.body;

    const post = await Posts.findOne({ postId });

    if (!(password && postId)) {
      return res
        .status(400)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
    if (!post) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    }

    if (post.password === password) {
      await Posts.deleteOne({ postId });
    } else {
      return res.status(401).json({ message: "비빌번호가 올바르지 않습니다." });
    }

    return res.status(200).json({ message: "게시글을 삭제 하였습니다." });
  } catch (error) {
    return res
      .status(400)
      .json({ error, message: "데이터 형식이 올바르지 않습니다." });
  }
});

module.exports = router;
