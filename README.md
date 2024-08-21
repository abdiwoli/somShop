SomShop
SomShop is a comprehensive e-commerce application featuring a backend built with Node.js and Express, and a frontend developed with React. This project is part of my Webstack Portfolio Project, showcasing my backend specializations.
Table of Contents
•	Project Structure
•	Backend Overview
o	File Manager
o	Server Configuration
o	Controllers
o	Worker & Utils
•	Frontend Overview
•	Installation
•	Usage
•	Contact
Project Structure
The project is organized into two main directories:
•	backend/ - Contains the Node.js and Express server code.
•	frontend/ - Contains the React code for the frontend.
Backend Overview
The backend of SomShop is built using Node.js and Express, focusing on efficient management of files, user authentication, product management, and order processing.
File Manager
The backend/file-manager directory is an extended version of the alx-files_manager project, enhanced with additional features to support SomShop.
Directory structure:
backend/file-manager/
├── README.md
├── babel.config.js
├── image_upload.py
├── package-lock.json
├── package.json
├── routes/
├── controllers/
├── utils/
├── test/
├── uploads/
└── worker.js
Server Configuration
•	Server: The server is powered by Express and is initialized in server.js.
•	Routes: All routes are defined in routes/index.js, ensuring a clean separation of concerns and easy scalability.
Controllers
Controllers manage the core functionalities of the backend:
•	UserController: Manages user-related actions such as registration and authentication.
•	AuthController: Handles user authentication processes.
•	ProductsManager: Manages product-related actions including creation, updating, and deletion of products.
•	Orders: Handles order processing, tracking, and management.
•	Messages: Manages communication and messaging within the platform.
Worker & Utils
•	Worker (worker.js): Contains a queue system to handle background tasks such as processing emails.
•	Utils:
o	sendEmail: Utility for handling email sending.
o	Redis: Redis configuration and utility functions.
o	db: MongoDB connection and utility functions.
Frontend Overview
The frontend: of SomShop is built with React, utilizing JSX and CSS to create an interactive and user-friendly interface. It seamlessly connects with the backend to provide a full-featured e-commerce experience.
Installation
To run the project locally, follow these steps:
Backend: use Node 12
1.	Navigate to the somShop/backend/file-manager  directory.
2.	Remove any existing installation

rm -rf node_modules
rm package-lock.json
3.	Install the necessary dependencies:
npm install
4.	Start the server:
npm start
Frontend: use Node 18
1.	Navigate to the frontend/ directory.
2.	Install the necessary dependencies:
rm -rf node_modules
rm package-lock.json
npm install
3.	Start the frontend:
bash
Copy code
npm start
Usage 
you will need to setup environment variable REACT_APP_BACKEND_API=http://localhost:5000
After installation, the backend will be accessible via the configured port, typically http://localhost:3000, and the frontend via http://localhost:3001. You can explore the various features, including file management, user authentication, product management, and order processing.

