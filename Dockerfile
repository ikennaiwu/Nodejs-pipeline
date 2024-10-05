# Dockerfile example
FROM node:14

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app files
COPY . .

# Expose the application port
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]

