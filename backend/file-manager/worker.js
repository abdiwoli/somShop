import Queue from 'bull';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import sendMail from './utils/sendmail';

dotenv.config();
const userQueue = new Queue('userQueue');

userQueue.process(async (job, done) => {
  const { user } = job.data;
  try {
    if (!user) {
      return done(new Error('User not found'));
    }

    console.log({ 'Sending email from:': process.env.EMAIL_USER, to: user.email });
    const content = user.text || 'wellcome to somShop\n you registration was succesfull';

    await sendMail(user.email, content, user.subject || null);

    console.log(`Welcome ${user.email}!`);
    done();
  } catch (error) {
    console.error('Error:', error.message);
    done(error);
  }
  return null;
});

const newProductQueue = new Queue('newProduct');
newProductQueue.process(async (job, done) => {
  const { product, emails } = job.data;

  if (!product && emails) {
    return done(new Error('Product not found'));
  }

  if (fs.existsSync(product.localPath)) {
    const fileName = path.basename(product.localPath);

    const content = `New Product Added:\nName: ${product.name}\nPrice: ${product.price}\nDescription: ${product.description}`;
    const attachments = [
      {
        filename: fileName,
        path: `https://som.abdiwoli.tech/images/${product.image}`
      },
    ];

    try {
      const to = emails.join(',');
      await sendMail(to, content, 'new product', attachments);
      done();
    } catch (error) {
      console.error('Error:', error.message);
      done(error);
    }
  } else {
    console.error('File not found:', product.localPath);
    done(new Error('File not found'));
  }
  return null;
});

console.log('Job processor is running and ready to process jobs...');
