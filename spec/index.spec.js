process.env.NODE_ENV = "test";
const mongoose = require("mongoose");
const app = require("../server.js");
const supertest = require("supertest");
const request = supertest(app);
const { expect } = require("chai");
const saveTestData = require("../seed/test.seed");

describe("API", () => {
  var usefulData;
  beforeEach(() => {
    return (
      mongoose.connection
        .dropDatabase()
        .then(saveTestData)
        .then(data => {
          usefulData = data;
        })
        // eslint-disable-next-line no-console
        .catch(err => console.log("error:", err))
    );
  });

  describe("GET /", () => {
    it("sends back the correct object with a status code of 200", () => {
      return request
        .get("/api/")
        .expect({ status: 200 })
        .then(res => {
          expect(res.body.status).to.equal(200);
        });
    });
  });

  describe("GET /TOPICS", () => {
    it("sends object containing all the topics and status code", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an("array");
          expect(res.body.topics.length).to.equal(usefulData.topics.length);
          expect(res.body.topics[0].title).to.be.a("string");
        });
    });
  });

  describe("GET /TOPICS/:TOPICNAME/ARTICLES", () => {
    it("sends back a specific topic of articles and code", () => {
      return request
        .get("/api/topics/football/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("array");
          expect(res.body.articles[0].body).to.be.a("string");
        });
    });
    it("sends a 404 error and message when a query value cannot be found", () => {
      var badTopicRequest = "bolserwood";
      return request
        .get(`/api/topics/${badTopicRequest}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal(
            `The requested topic "${badTopicRequest}" does not have any content.`
          );
        });
    });
  });

  describe("GET /ARTICLES", () => {
    it("gets all articles and status 200", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("array");
          expect(res.body.articles.length).to.equal(usefulData.articles.length);
          expect(res.body.articles[0].title).to.be.a("string");
        });
    });
  });
  describe("get API/ARTICLES/:ARTICLE_ID", () => {
    it("returns article by ID", () => {
      const article = usefulData.articles[0];
      const articleID = article._id;
      return request
        .get(`/api/articles/${articleID}`)
        .expect(200)
        .then(res => {
          expect(res.body.article).to.be.an("object");
          expect(res.body.article.title).to.equal(article.title);
          expect(res.body.article.body).to.equal(article.body);
        });
    });
    it("sends a 400 error and message when the query value is invalid", () => {
      const badArticleRequest = "bolserwood";
      return request
        .get(`/api/articles/${badArticleRequest}`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            `The requested topic "${badArticleRequest}" is invalid.`
          );
        });
    });
  });

  describe("Get API/ARTICLES/:ARTICLE_ID/COMMENTS", () => {
    it("sends back the comments for an individual article", () => {
      // console.log(usefulData)
      const article = usefulData.articles[0];
      const articleID = article._id.toString();
      return request
        .get(`/api/articles/${articleID}/comments`)
        .expect(200)
        .then(articleComments => {
          expect(articleComments.body.comments).to.be.a("array");
          expect(articleComments.body.comments[0]).to.be.a("object");
          expect(articleComments.body.comments[0].body).to.be.a("string");
          expect(articleComments.body.comments[0].belongs_to).to.equal(
            articleID
          );
        });
    });
    it("it handles bad requests for article comments", () => {
      const badArticleID = "1";
      return request
        .get(`/api/articles/${badArticleID}/comments`)
        .expect(400)
        .then(badArticleIDResponse => {
          expect(badArticleIDResponse.body.message).to.equal(
            `The requested article "${badArticleID}" does not have any comments.`
          );
        });
    });
    it("it handles requests where there is no data present", () => {
      const bogusArticleID = usefulData.articles[1]._id;
      return request
        .get(`/api/articles/${bogusArticleID}/comments`)
        .expect(404)
        .then(bogusArticleIDResponse => {
          expect(bogusArticleIDResponse.body.message).to.equal(
            `The requested article "${bogusArticleID}" does not have any comments.`
          );
        });
    });
  });

  describe("Put /ARTICLES/:ARTICLEID", () => {
    it("votes up on articles", () => {
      const artID = usefulData.articles[0]._id;
      return request.put(`/api/articles/${artID}?vote=up`).then(res => {
        expect(res.body.article.votes).to.equal(1);
      });
    });
    it("votes down on articles", () => {
      const artID2 = usefulData.articles[1]._id;
      return request
        .put(`/api/articles/${artID2}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(-1);
        });
    });
    it("handles votes up for articles that don't exist", () => {
      return request
        .put("/api/articles/fakeArticleID?vote=up")
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal("Invalid article ID");
        });
    });
    it("handles votes down for articles that don't exist", () => {
      return request
        .put("/api/articles/fakeArticleID?vote=down")
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal("Invalid article ID");
        });
    });
    it("handles misspelled query values", () => {
      const artID3 = usefulData.articles[0]._id;
      return request
        .put(`/api/articles/${artID3}?vote=typo`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            "Unable to process the query. Please provide a query in the format '?query=up' or '?query=down'."
          );
        });
    });
    it("handles misspelled query field names", () => {
      const artID4 = usefulData.articles[1]._id;
      return request
        .put(`/api/articles/${artID4}?typo=up`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            "Unable to process the query. Please provide a query in the format '?query=up' or '?query=down'."
          );
        });
    });
  });

  describe("Put /COMMENTS/:COMMENTID", () => {
    it("votes up on comments", () => {
      const comID = usefulData.comments[0]._id;
      return request.put(`/api/comments/${comID}?vote=up`).then(res => {
        expect(res.body.comment[0].votes).to.equal(1);
      });
    });
    it("votes down on comments", () => {
      var comID2 = usefulData.comments[0]._id;
      return request.put(`/api/comments/${comID2}?vote=down`).then(res => {
        expect(res.body.comment[0].votes).to.equal(-1);
      });
    });
    it("handles vote up on bad request comment IDs", () => {
      return request
        .put(`/api/comments/fakeCommentID/?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            'Cast to ObjectId failed for value "fakeCommentID" at path "_id" for model "comments"'
          );
          expect(res.body.error).to.be.an("object");
        });
    });
    it("handles vote down on bad request comment IDs", () => {
      return request
        .put(`/api/comments/fakeCommentID?vote=down`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            'Cast to ObjectId failed for value "fakeCommentID" at path "_id" for model "comments"'
          );
          expect(res.body.error).to.be.an("object");
        });
    });
    it("handles misspelled query values", () => {
      const commentID3 = usefulData.comments[0]._id;
      return request.put(`/api/comments/${commentID3}?vote=typo`).then(res => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal(
          "Unable to process the query. Please provide a query in the format '?query=up' or '?query=down'."
        );
      });
    });
    it("handles misspelled query field names", () => {
      const commentID4 = usefulData.comments[1]._id;
      return request.put(`/api/comments/${commentID4}`).then(res => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal(
          "Unable to process the query. Please provide a query in the format '?query=up' or '?query=down'."
        );
      });
    });
  });

  describe("Post ARTICLES/:ARTICLEID/COMMENTS", () => {
    it("adds a comment", () => {
      const articleID = usefulData.articles[0]._id;
      const commentContent = { comment: "HEY, I'M WALKING HERE!" };
      return request
        .post(`/api/articles/${articleID}/comments`)
        .set("Content-Type", "application/json")
        .send(commentContent)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.comment.body).to.equal(commentContent.comment);
        });
    });
    it("handles bad requests to comment on articles", () => {
      const commentContent2 = { comment: "HEY, I'M STILL WALKING HERE!" };
      return request
        .post("/api/articles/fakeArticleID/comments")
        .set("Content-Type", "application/json")
        .send(commentContent2)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            'The article ID "fakeArticleID" was not found. We were unable to post your comment, "HEY, I\'M STILL WALKING HERE!"'
          );
          expect(res.body.error).to.be.an("object");
          expect(res.body.error.name).to.equal("ValidationError");
        });
    });
  });

  describe("it DELETES /COMMENTS/:COMMENTID", () => {
    it("deletes a comment if done by the user (in this case northcoder)", () => {
      const comment = usefulData.comments[0];
      const commentID = comment._id;
      return request
        .delete(`/api/comments/${commentID}`, {
          "Content-Type": "application/x-www-form-urlencoded"
        })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal(
            `Comment "${commentID}" was deleted.`
          );
          expect(res.body.comment).to.be.an("object");
        });
    });
    it("stops you deleting comments you didn't author", () => {
      const comment2 = usefulData.comments[2];
      const commentID2 = comment2._id;
      return request
        .delete(`/api/comments/${commentID2}`, {
          "Content-Type": "application/x-www-form-urlencoded"
        })
        .then(res => {
          expect(res.body.message).to.equal(
            `You do not have permission to delete the comment with ID "${commentID2}".`
          );
          expect(res.status).to.equal(403);
          expect(res.body.error.name).to.equal("ValidationError");
        });
    });
    it("handles attempts to delete comments that do not exist", () => {
      const noSuchCommentID = "noSuchCommentID";
      return request
        .delete(`/api/comments/${noSuchCommentID}`, {
          "Content-Type": "application/x-www-form-urlencoded"
        })
        .then(res => {
          expect(res.body.message).to.equal(
            `The comment you are trying to delete does not exist.`
          );
          expect(res.body.error).to.be.an("object");
          expect(res.body.error.name).to.equal("CastError");
        });
    });
  });

  describe("GET /USER/:USERID", () => {
    it("retrieves all users if none specified", () => {
      return request.get("/api/users/").then(userResponse => {
        expect(userResponse.body.users[0].username).to.equal(
          usefulData.user.username
        );
      });
    });
    it("retrieves an individual user if specified", () => {
      return request.get("/api/users/northcoder").then(individualUser => {
        expect(individualUser.body.users[0].username).to.equal(
          usefulData.user.username
        );
        expect(individualUser.body.users[0].name).to.equal(
          usefulData.user.name
        );
      });
    });
    it("handles requests for users who do not exist", () => {
      const fakeUser = "fakeUser";
      return request
        .get(`/api/users/${fakeUser}`)
        .expect(404)
        .then(noUser => {
          expect(noUser.body.message).to.equal("No user found by this ID.");
        });
    });
  });
});