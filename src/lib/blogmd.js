const fs = require("fs");
const path = require("path");
const matter = require('gray-matter');

// Get full path to the content directory of blogs folders, in this case /src/content
export function getPath(contentFolder) {
  return path.join(process.cwd(), `/${contentFolder}`);
}

// Get the markdown file data from its parent folder with the same name in the content directory
export function getFileContent(folderName, contentFolder) {
  const BLOGS_DIRS_PATH = getPath(contentFolder);

  // Create the full path to the .md file
  const filePath = path.join(BLOGS_DIRS_PATH, folderName, `${folderName}.md`);
  const fileData = fs.readFileSync(filePath, "utf-8");
  return fileData;
}

// Get a single blog from the content folder with the given slug
export function getSingleBlog(slug, contentFolder) {
  const source = getFileContent(slug, contentFolder);
  const { data, content } = matter(source);
  return {
    meta: data,
    content: content,
  }
}

// Get all blogs from the content folder
export function getAllBlogs(contentFolder) {
  const BLOGS_DIRS_PATH = getPath(contentFolder);

  // Get a list of all blog folders' names
  let folderNames = fs.readdirSync(BLOGS_DIRS_PATH);

  // Filter out the hidden files
  folderNames = folderNames.filter((fileName) => !fileName.startsWith('.'));

  // Using gray-matter to parse the markdown file and return meta, content and slug
  const blogs = folderNames.map((folderName) => {
    const source = getFileContent(folderName, contentFolder);
    const { data, content } = matter(source);
    return {
      meta: data,
      content: content,
      slug: folderName,
    }
  });
  return blogs;
}