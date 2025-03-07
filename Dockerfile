    FROM node:20 AS builder

    WORKDIR /app
    
    COPY package.json package-lock.json ./
    
    RUN npm install
    
    COPY . .
    
    RUN npx prisma generate
    
    RUN npm run build
    
    FROM node:20 AS runner
    
    WORKDIR /app
    
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/node_modules ./node_modules
    
    COPY --from=builder /app/prisma ./prisma
    
    ENV NODE_ENV=production
    
    EXPOSE 3000
    
    CMD ["node", "dist/server.js"]
    