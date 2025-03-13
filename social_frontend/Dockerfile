# Stage 1: Build the React application
FROM node:18-alpine as build

# Set working directory and install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy the rest of your application source code
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the built app using Nginx
FROM nginx:alpine

# Remove the default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the previous stage to Nginx's html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
