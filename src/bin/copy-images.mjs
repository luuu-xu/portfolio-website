import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';

const fsPromises = fs.promises;
const targetDir = path.join(process.cwd(), 'public/blogImages');
const blogsDir = path.join(process.cwd(), 'src/content');

async function createPostImageFoldersForCopy() {
  // Get every blog folder: blog-one, blog-two etc.
  let blogsSlugs = await fsPromises.readdir(blogsDir);
  
  // Get rid of MacOS's .DS_Store hidden file
  blogsSlugs = blogsSlugs.filter((slug) => !slug.startsWith('.'));

  for (const slug of blogsSlugs) {
    const allowedImageFileExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

    // Read all files inside current blog folder
    const blogDirFiles = await fsPromises.readdir(`${blogsDir}/${slug}`);

    // Filter out files with allowed file extension (images)
    const images = blogDirFiles.filter(file =>
      allowedImageFileExtensions.includes(path.extname(file)),
    );

    if (images.length) {
      // Create a folder for images of this post inside public
      await fsPromises.mkdir(`${targetDir}/${slug}`);

      await copyImagesToPublic(images, slug);
    }
  }
}

async function copyImagesToPublic(images, slug) {
  for (const image of images) {
    await fsPromises.copyFile(
      `${blogsDir}/${slug}/${image}`,
      `${targetDir}/${slug}/${image}`
    );
  }
}

await fsExtra.emptyDir(targetDir);
await createPostImageFoldersForCopy();