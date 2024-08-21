
This is the backend component of the SomShop e-commerce platform, developed as part of the Webstack Portfolio Project. The backend is built using Node.js and Express, and it handles core functionalities such as user management, product management, order processing, and messaging. The backend also integrates with Redis and MongoDB for caching and database management, respectively.
Table of Contents
•	Requirements
•	Installation
•	Project Structure
•	Routes
•	Controllers
•	Utils
•	Usage
•	Contact
Requirements
To run this backend, ensure you have the following installed:
•	Node.js v12
•	Redis v6.0.16
•	MongoDB v6.0.16
Installation
1.	Clone the repository:
bash
Copy code
git clone https://github.com/abdiwoli/somShop.git
2.	Navigate to the backend directory:
bash
Copy code
cd somShop/backend/file-manager
3.	Install dependencies:
bash
Copy code
npm install
4.	Start Redis and MongoDB servers: Ensure Redis and MongoDB are running on their respective default ports.
5.	Start the server:
bash
Copy code
npm start
Project Structure
backend/file-manager/
├── README.md
├── babel.config.js
├── image_upload.py
├── package-lock.json
├── package.json
├── routes/
│   └── index.js
├── controllers/
├── utils/
├── test/
├── uploads/
└── worker.js
Key Files and Directories
•	routes/index.js: Defines all the API endpoints for the backend.
•	controllers/: Contains controllers that handle requests related to users, authentication, products, orders, and messages.
•	utils/: Utility functions, including Redis and MongoDB configurations, email handling, and payment processing.
•	worker.js: Manages background tasks, including email processing using a queue system.
Routes
Here’s an overview of the served routes:
•	Root and Status:
o	GET / - Check if the server is running.
o	GET /status - Get the status of the application.
o	GET /stats - Get statistical data about the application.
•	User Management:
o	POST /users - Register a new user.
o	POST /limit-user-acces/:id/:block - Block or unblock a user.
o	GET /users - Get all users.
o	POST /update-user - Update user information.
o	DELETE /users - Delete a user.
o	GET /users/me - Get current user details.
•	Authentication:
o	GET /connect - User login.
o	GET /disconnect - User logout.
•	Product Management:
o	POST /update-file/:id - Update a product.
o	GET /products - Get all products.
o	GET /owner/:id - Check product ownership.
o	DELETE /delete-product/:id - Delete a product.
o	POST /additional-image/:id - Add additional images to a product.
o	DELETE /delete-image/:id/:index - Delete a specific image from a product.
o	GET /latest - Get the latest products.
o	GET /trending - Get trending products.
•	File Management:
o	POST /files - Upload a file.
o	GET /files/:id - Get a specific file.
o	GET /files - Get all files.
o	PUT /files/:id/publish - Publish a file.
o	PUT /files/:id/unpublish - Unpublish a file.
o	GET /files/:id/data - Get data from a specific file.
•	Messaging:
o	POST /message - Send a new message.
o	POST /reply-message - Reply to a message.
o	GET /messages - Get all messages.
•	Orders and Payments:
o	POST /pay - Process payment via PayPal.
o	GET /complete-order - Complete an order after successful payment.
o	GET /cancel-order - Handle order cancellation.
o	GET /orders - Get all orders.
Controllers
The controllers/ directory includes:
•	AppController: Manages application status and statistics.
•	UsersController: Handles user-related operations.
•	AuthController: Manages user authentication.
•	FilesController: Manages file upload and retrieval.
•	ProductManager: Handles product-related operations.
•	orderController: Manages orders and order processing.
•	MessageController: Handles messaging between users.
Utils
The utils/ directory includes utility functions for:
•	Redis: Manages caching and session storage.
•	MongoDB: Handles database connections and operations.
•	sendEmail: Manages email sending.
•	PayPal Integration: Manages payment processing via PayPal.
Usage
To use the backend API, you can test the endpoints using tools like Postman or cURL, or by integrating with the SomShop frontend.
Contact
For any inquiries or issues, please contact me at abdiwolih@gmail.com
