const ThreadModel = new (require("../../../models/thread"))();
const PostModel = new (require("../../../models/post"))();

module.exports = {
  threads: [
    {
      subject: "Labore id amet est do irure est esse tempor.",
      description:
        "Non velit do in amet velit laboris pariatur pariatur pariatur dolor adipisicing ullamco.",
      selectedRelatedQuizId: "1",
      userId: 1,
    },
    {
      subject:
        "Dolore mollit voluptate deserunt est enim ut aliqua esse laborum.",
      description:
        "Magna occaecat et ex elit aliqua veniam commodo in irure reprehenderit nulla incididunt.",
      selectedRelatedQuizId: "2",
      userId: 1,
    },
    {
      subject:
        "Laboris sint ex enim mollit excepteur id quis veniam deserunt cillum veniam aliquip.",
      description:
        "Culpa do cupidatat ullamco sint pariatur dolore adipisicing dolore.",
      selectedRelatedQuizId: "3",
      userId: 1,
    },
  ],
  posts: [
    {
      threadId: 1,
      content:
        "Dolore veniam mollit laboris tempor veniam dolore.Laboris tempor reprehenderit eiusmod ad sunt adipisicing velit tempor aute consequat exercitation sit laborum.",
      userId: 1,
    },
    {
      threadId: 2,
      content:
        "Sint commodo ex elit id nulla sit ipsum proident est minim elit voluptate non occaecat.",
      userId: 1,
    },
    {
      threadId: 3,
      content:
        "Fugiat id deserunt esse Lorem est ullamco dolore velit sit quis.",
      userId: 1,
    },
  ],
  addThread: async function(thread) {
    return await ThreadModel.addOne(thread);
  },
  addThreads: async function(threads) {
    for (let i = 0; i < threads.length; i++) {
      const thread = await module.exports.addThread(threads[i]);

      if (!thread.error) {
        threads[i].thread_id = thread.response.insertId;
        module.exports.posts[i].threadId = thread.response.insertId;
      }
    }
  },
  deleteThreads: async function(threads) {
    for (let i = 0; i < threads.length; i++) {
      const result = await ThreadModel.deleteOne(threads[i].thread_id);
    }
  },
  addPost: async function(post) {
    return await PostModel.addOne(post.threadId, post.content, post.userId);
  },
  addPosts: async function(posts) {
    for (let i = 0; i < posts.length; i++) {
      const post = await module.exports.addPost(posts[i]);

      if (!post.error) {
        posts[i].post_id = post.response.insertId;
      }
    }
  },
  deletePosts: async function(posts) {
    for (let i = 0; i < posts.length; i++) {
      const result = await PostModel.deleteOne(posts[i].post_id);
    }
  },
};
