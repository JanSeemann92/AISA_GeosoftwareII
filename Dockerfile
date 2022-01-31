# Create a layer from the node:14 Docker image
FROM node:14

# Create an application directory
RUN mkdir -p /app

# Set /app directory as working directory
WORKDIR /app

# Install required frontend dependencies
COPY /package*.json ./

# Install node packages (in automated environment)
RUN npm ci

# Copy all files into current WORKDIR of docker image (/app)
COPY . .

#Expose port on container
EXPOSE 8781

# Start the app
CMD [ "npm", "start" ]

