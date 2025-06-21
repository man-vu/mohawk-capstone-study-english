import ThreadModelClass from "../../../models/thread";
import PostModelClass from "../../../models/post";

const ThreadModel = new ThreadModelClass();
const PostModel = new PostModelClass();

export const threads = [
  {
    subject: "Labore id amet est do irure est esse tempor.",
    description:
      "Non velit do in amet velit laboris pariatur pariatur pariatur dolor adipisicing ullamco.",
    selectedRelatedQuizId: "1",
    userId: 1,
  },
  {
    subject: "Dolore mollit voluptate deserunt est enim ut aliqua esse laborum.",
    description:
      "Magna occaecat et ex elit aliqua veniam commodo in irure reprehenderit nulla incididunt.",
    selectedRelatedQuizId: "2",
    userId: 1,
  },
  {
    subject:
      "Laboris sint ex enim mollit excepteur id quis veniam deserunt cillum veniam aliquip.",
    description: "Culpa do cupidatat ullamco sint pariatur dolore adipisicing dolore.",
    selectedRelatedQuizId: "3",
    userId: 1,
  },
];

export const posts = [
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
    content: "Fugiat id deserunt esse Lorem est ullamco dolore velit sit quis.",
    userId: 1,
  },
];

export async function addThread(thread: any) {
  return await ThreadModel.addOne(thread);
}

export async function addThreads(list: any[]) {
  for (let i = 0; i < list.length; i++) {
    const thread = await addThread(list[i]);

    if (!thread.error) {
      list[i].thread_id = thread.response.insertId;
      posts[i].threadId = thread.response.insertId;
    }
  }
}

export async function deleteThreads(list: any[]) {
  for (let i = 0; i < list.length; i++) {
    await ThreadModel.deleteOne(list[i].thread_id);
  }
}

export async function addPost(post: any) {
  return await PostModel.addOne(post.threadId, post.content, post.userId);
}

export async function addPosts(list: any[]) {
  for (let i = 0; i < list.length; i++) {
    const post = await addPost(list[i]);

    if (!post.error) {
      list[i].post_id = post.response.insertId;
    }
  }
}

export async function deletePosts(list: any[]) {
  for (let i = 0; i < list.length; i++) {
    await PostModel.deleteOne(list[i].post_id);
  }
}
