
FROM node:22.12.0-alpine



WORKDIR /app



COPY package*.json  ./
RUN npm install

#RUN commads for image optimisation/ deletion of unecessary files // to be discussed

COPY public/ ./public
COPY src/ ./src
COPY vite.config.* ./
COPY tsconfig.* ./
COPY index.html ./
COPY eslint.* ./

#commented due to build errors
#RUN npm run build

# Expose the port that the application listens on.
EXPOSE 5173

# Run the application.
CMD npm run dev
