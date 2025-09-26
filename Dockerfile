# Use Node.js base image
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# Copy the rest of the source code
COPY . .

# Expose the port React dev server runs on
EXPOSE 3000

# Start the React dev server
CMD ["npm", "start"]
