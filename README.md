# FlavourVerse

FlavourVerse is a full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to share blogs and recipes.

## Features

- **User Authentication**: Secure login and signup functionality using Passport.js.
- **Social Networking**: Users can follow other users, comment on posts, and more.
- **Profile Section**: Users can view their profile and see their posts, followers, and following.
- **Responsive Front-end**: The front-end is fully responsive and works across various devices.
- **Efficient Server-side Operations**: Robust server-side operations ensure smooth functioning of the application.
- **Robust Data Management**: Efficient handling and management of data using MongoDB.
- **Powerful Back-end**: Strong back-end functionalities built with Node.js and Express.js.

## Installation

To run this project locally, follow these steps:

1. Install dependencies for both backend and frontend:
    ```bash
    cd Backend
    npm install
    cd ../Frontend
    npm install
    ```
2. Create a `.env` file in the `Backend` directory and add the following environment variables:
    ```
    PORT=5000
    MONGO_URL=your_mongodb_uri
    GOOGLE_CLIENT_ID=YOUR_ACTUAL_GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET=YOUR_ACTUAL_GOOGLE_CLIENT_SECRET
    ```
3. Run the backend and frontend:
    ```bash
    cd Backend
    npm start
    cd ../Frontend
    npm run dev
    ```

## Usage

Once the project is up and running, you can:

- Sign up or log in to your account.
- Create, edit, or delete recipes and blogs.
- Follow other users and interact with their posts by liking or commenting.

## Technologies Used

- **Frontend**: React.js, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.
