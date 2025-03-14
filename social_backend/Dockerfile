# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Install tini (a minimal init process)
RUN apk add --no-cache tini

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of your application code
COPY . .

# Expose the port on which the app will run
EXPOSE 5000

# Use tini as the entrypoint to forward signals properly
ENTRYPOINT ["/sbin/tini", "--"]

# Start the backend server
CMD ["npm","start"]
