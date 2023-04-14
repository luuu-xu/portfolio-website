const fs = require("fs");
const path = require("path");
const matter = require('gray-matter');

// Get full path to the content directory of blogs folders
export function getPath(folder) {
  return path.join(process.cwd(), `/${folder}`);
}

// Get the markdown file data from the folder
export function getFileContent(folderName, folder) {
  const BLOGS_DIRS_PATH = getPath(folder);

  // Create the full path to the .md file
  const filePath = path.join(BLOGS_DIRS_PATH, folderName, `${folderName}.md`);
  const fileData = fs.readFileSync(filePath, "utf-8");
  return fileData;
}

// Get all blogs from the content folder
export function getAllBlogs(folder) {
  const BLOGS_DIRS_PATH = getPath(folder);

  // Get a list of all blog folders' names
  let folderNames = fs.readdirSync(BLOGS_DIRS_PATH);

  // Filter out the hidden files
  folderNames = folderNames.filter((fileName) => !fileName.startsWith('.'));

  // Using gray-matter to parse the markdown file and return meta, content and slug
  const blogs = folderNames.map((folderName) => {
    const source = getFileContent(folderName, folder);
    const { data, content } = matter(source);
    return {
      meta: data,
      content: content,
      slug: folderName,
    }
  });
  return blogs;
}

// Get a single blog from the content folder with the given slug
export function getSingleBlog(slug, folder) {
  const source = getFileContent(slug, folder);
  const { data, content } = matter(source);
  return {
    meta: data,
    content: content,
  }
}