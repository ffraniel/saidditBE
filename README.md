# Saiddit: A Reddit Clone RESTful API Backend 

Powered by Node.js, Express.js and MongoDB.  
By Francis Whitehead  

## Versions  
------------
Node.js : 8.3.0  
MongoDB : 3.6

This API can be found at
### https://vast-tundra-92428.herokuapp.com/api/  

# Routes 
----------

## __GET__ 

#### /api/topics

Returns all of the topics available

#### /api/topics/:topic/articles  

Return all the articles for a certain topic  

 #### /api/articles  

Returns all the articles

#### /api/articles/:articleID  

One can return a single article using the params articleID.  

#### /api/articles/:article_id/comments  

Get all the comments for a individual article  

#### /api/users/:username  

Returns a JSON object with the profile data for the specified user.  

## __POST__  
#### /api/articles/:article_id/comments  

Add a new comment to an article. This route requires a JSON body with a comment key and value pair e.g: {"comment": "This is my new comment"}  

## __PUT__    
#### /api/articles/:article_id  

Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down' e.g: https://vast-tundra-92428.herokuapp.com/api/articles/:article_id?vote=up  

#### /api/comments/:comment_id  

Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down' e.g: https://vast-tundra-92428.herokuapp.com/api/comments/:comment_id?vote=down  

## __DELETE__  
#### /api/comments/:comment_id  

Deletes a comment if the comment was created by the default user, 'Northcoder'. Currently this is the only user.  

# Background  
------------

The database has been populated with seed data. It is hosted on mLabs. Requests to the API return the data in json.  

# Setup  
----------
To check if Node.js is installed on your machine open a terminal window and enter:

```node -v```

If you do not already have Node.js installed please follow the instructions on this guide - https://nodejs.org/en/download/package-manager/.

To check if npm is installed on your machine enter this command in you terminal window:

```npm -v```

If you do not have npm already installed please follow this guide to set it up -
https://www.npmjs.com/get-npm.

To check if git is installed on your machine please enter the following commitng in your terminal window:

```git --version```

If you do not already have git installed on your machine please follow this guide -
https://git-scm.com/.

If you do not have MongoDB already installed, please follow this guide -
https://docs.mongodb.com/manual/installation/.



# Installation  
----------------

To run this project you will need to clone it onto your local machine and install all dependencies.

Use the command line to navigate to your preferred directory on your local machine and enter the following command on the terminal window:

```git clone https://github.com/ffraniel/BE-northcoders-news```

Navigate inside the folder and install all dependencies by entering the following command on your terminal window:

```npm install```

Enter the following command in your terminal window to connect to the database and keep it running:

```mongod```

Open another terminal window, navigate inside the project folder and enter the following command to populate the database:

```node seed/seed.js```

Finally to run the server enter the following command in your terminal window:

```npm start```

This will run the server on port 3000. All endpoints as described above can be found locally on http://localhost:3000 .