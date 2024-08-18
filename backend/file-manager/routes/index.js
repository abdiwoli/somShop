import { Router } from 'express';
import multer from 'multer';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';
import Helper from '../controllers/utils';
import Product from '../controllers/ProductManager';
import { createOrder, capturePayment, formatOrders } from '../utils/services/paypal';
import Orders from '../controllers/orderController';
import MessageController from '../controllers/MessageController';

const router = Router();
const upload = multer();

router.get('/', (req, res) => {
  res.send({ status: process.env.BASE_URL, status: 'working' });
});
router.post('/update-file/:id', Product.updateProduct);
router.get('/products', Product.getFiles);
router.get('/owner/:id', Helper.authAdmin, Product.isOwner);
router.delete('/delete-product/:id', Helper.authUser, Product.deleteProduct);

router.get('/status', AppController.getStatus);
router.post('/subscribe/:email', Helper.Subscribe)
router.post('/message', upload.none(), MessageController.newMessage)
router.post('/reply-message', upload.none(), MessageController.replyMessage)
router.get('/messages', Helper.authUser, MessageController.getMessage)
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.post('/limit-user-acces/:id/:block', Helper.authAdmin, UsersController.BlockUser);
router.get('/users', Helper.authUser, UsersController.getAll);
router.post('/update-user', Helper.authUser, UsersController.updateUser);
router.delete('/users', Helper.authUser, UsersController.delUser);
router.delete('/delete-image/:id/:index', Helper.authUser, Product.deleteImage);
router.post('/additional-image/:id', Helper.authUser, Product.AddAdditionalImage);
router.get('/collections', Helper.authUser, FilesController.delete);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', Helper.authUser, AuthController.getDisconnect);
router.get('/users/me', Helper.authUser, UsersController.getMe);
router.get('/latest', Product.Latets)
router.get('/trending', Product.Trending)
router.post('/files', Helper.authUser, FilesController.postUpload);
router.get('/files/:id', Helper.authUser, FilesController.getShow);
router.get('/files', Helper.authUser, FilesController.getIndex);
router.put('/files/:id/publish', Helper.authUser, FilesController.putPublish);
router.put('/files/:id/unpublish', Helper.authUser, FilesController.putUnpublish);
router.get('/files/:id/data', FilesController.getFile);

router.get('/complete-order', async (req, res) => {
  try {
    await capturePayment(req.query.token);
    res.redirect('http://localhost:3000/orders?status=complete');
  } catch (err) {
    console.log(err);
    res.send({ error: err });
  }
});

router.get('/cancel-order', (req, res) => {
  res.redirect('http://localhost:3000');
});

router.post('/pay', async (req, res) => {
  // return res.send(process.env.PAYPAL_CLIENT_SECRET);
  const { orders, userToken } = req.body;
  const user = Helper.userOrder(userToken);
  if (!user) {
    return res.redirect('http://localhost:3000/login');
  }
  const parsedOrders = JSON.parse(orders);
  const formated = formatOrders(parsedOrders);
  console.log(formated);
  try {
    const url = await createOrder(formated, user._id);
    return res.redirect(url);
  } catch (err) {
    return res.send({ error: err });
  }
});

router.get('/orders', Helper.authUser, Orders.getOrders);
export default router;
