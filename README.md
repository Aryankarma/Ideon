# Ideon
**Ideon** is a **real-time collaborative content platform** that enables teams to **create, edit, and manage multimedia content** together.  
It combines the best features of Notion, Figma, and a headless CMS — built with modern full-stack technologies and scalable cloud architecture.

## Key Features
- **Real-time collaboration** with WebSockets (multi-user editing & live presence)
- **Secure file uploads** to AWS S3 with automatic image/video processing
- **Version history** and rollback for all documents
- **Role-based access control (RBAC)** for teams and organizations
- **Full-text search** powered by AWS OpenSearch / Elasticsearch
- **Background job processing** using Redis + BullMQ
- **Scalable Dockerized backend** with CI/CD and Terraform-based AWS infrastructure
- **Analytics dashboard** for tracking document activity and engagement
- **Deployed on AWS** (EC2/ECS, S3, RDS, ElastiCache, CloudFront)

## Installation

1. Clone the repository
2. Install the dependencies

```
npm install
```

3. Set up the environment variables

```
will be updated shortly
```

```
docker run -d --name mongo -p 27017:27017 mongo:6
docker run -d --name redis -p 6379:6379 redis:7
```

```
npm run dev
```