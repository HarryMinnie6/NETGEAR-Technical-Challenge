FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Install dependencies: build-base for compiling TypeScript if needed
RUN apk add --no-cache build-base

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN yarn install

# Install TypeScript globally
RUN yarn global add typescript

# Copy everything from the current directory (including src) into /app
COPY . .

# Install ts-node globally
RUN yarn global add ts-node

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["ts-node", "src/index.ts"]
