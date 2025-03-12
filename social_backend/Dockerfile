# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of your application code
COPY . .

# Expose the port on which the app will run (5000 in this case)
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
