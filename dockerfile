# ---------- Stage 1: Build the application ----------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app source code
COPY . .

# Build the app (for example, React / Next.js / Vue)
RUN npm run build

# ---------- Stage 2: Run the application ----------
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only the built output and needed files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN npm install --omit=dev

# Expose the application port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]