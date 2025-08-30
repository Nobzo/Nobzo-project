Recursion Practice: Fetch All Posts Recursively
As part of learning Data Structures and Algorithms (DSA), we explored recursive thinking using a practical example within this project.

Instead of using a loop to paginate through all blog posts, we implemented a recursive function to fetch all posts 10 at a time.

Recursive Function

const getAllPostsRecursively = async (page = 1, allPosts = []) => {
  const limit = 10;
  const posts = await BlogPost.find()
    .skip((page - 1) * limit)
    .limit(limit);

  if (posts.length === 0) return allPosts;

  allPosts.push(...posts);

  return getAllPostsRecursively(page + 1, allPosts);
};

This simulates recursive logic and helps reinforce thinking in terms of smaller sub-problems — a key concept in DSA.

Why is this recursive thing important
It is important because it will help us to reinforce the idea of base cases and recursive calls

It will give us a deeper understanding of control flow

And it lays a foundation for solving problems involving trees, graphs, and nested structures











