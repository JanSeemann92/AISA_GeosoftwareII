FROM node:14

# Create an application directory
RUN mkdir -p /app

# The /app directory should act as the main application directory
WORKDIR /app

# RUN npm install

# Install frontend dependencies
COPY /package*.json ./

# Install node packages
RUN npm ci

# Copy or project directory (locally) in the current directory of our docker image (/app)
COPY . .
#frontend/ ./

# Build the app 
# RUN npm run build 

EXPOSE 8781

# Start the app
CMD [ "npm", "start" ]

