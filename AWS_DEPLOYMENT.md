# AWS Deployment Guide for Zephyr Social Network

## Architecture Options

### Option 1: ECS Fargate (Recommended for scalability)
- **Frontend**: ECS Fargate + Application Load Balancer + CloudFront
- **Backend**: ECS Fargate + Application Load Balancer
- **Database**: RDS PostgreSQL
- **Storage**: S3 for uploads (profile pictures, post images)
- **Secrets**: AWS Secrets Manager

### Option 2: EC2 + Docker Compose (Simple deployment)
- **Compute**: EC2 instance running docker-compose
- **Database**: RDS PostgreSQL
- **Storage**: EFS or S3 for uploads
- **Load Balancer**: Application Load Balancer (optional)

### Option 3: Elastic Beanstalk (Managed platform)
- **Frontend**: Elastic Beanstalk (Node.js platform)
- **Backend**: Elastic Beanstalk (Python platform)
- **Database**: RDS PostgreSQL
- **Storage**: S3 for uploads

---

## Recommended: ECS Fargate Deployment

### Prerequisites
1. AWS CLI installed and configured
2. ECR repositories created for frontend and backend images
3. RDS PostgreSQL database provisioned
4. S3 bucket for uploads
5. VPC with public and private subnets

### Step 1: Push Docker Images to ECR

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
cd backend
docker build -t zephyr-backend .
docker tag zephyr-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/zephyr-backend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/zephyr-backend:latest

# Build and push frontend
cd ../frontend
docker build -t zephyr-frontend .
docker tag zephyr-frontend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/zephyr-frontend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/zephyr-frontend:latest
```

### Step 2: Create ECS Task Definitions

**Backend Task Definition** (`backend-task-def.json`):
```json
{
  "family": "zephyr-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/zephyr-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "API_PREFIX",
          "value": "/api"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT:secret:zephyr/database-url"
        },
        {
          "name": "SECRET_KEY",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT:secret:zephyr/secret-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/zephyr-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

**Frontend Task Definition** (`frontend-task-def.json`):
```json
{
  "family": "zephyr-frontend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/zephyr-frontend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NEXT_PUBLIC_API_URL",
          "value": "https://api.yourdomain.com/api"
        },
        {
          "name": "NEXT_PUBLIC_BACKEND_URL",
          "value": "https://api.yourdomain.com"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/zephyr-frontend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Step 3: Create ECS Services

```bash
# Create backend service
aws ecs create-service \
  --cluster zephyr-cluster \
  --service-name backend-service \
  --task-definition zephyr-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=backend,containerPort=8000"

# Create frontend service
aws ecs create-service \
  --cluster zephyr-cluster \
  --service-name frontend-service \
  --task-definition zephyr-frontend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=frontend,containerPort=3000"
```

### Step 4: Configure S3 for File Uploads

Update backend to use S3 instead of local storage. Install boto3:
```bash
pip install boto3
```

Modify `backend/app/upload_utils.py` to use S3:
```python
import boto3
from botocore.exceptions import ClientError

s3_client = boto3.client('s3')
BUCKET_NAME = 'zephyr-uploads'

async def save_upload_file(file: UploadFile, subfolder: str) -> str:
    file_extension = file.filename.split('.')[-1]
    unique_filename = f"{uuid4()}.{file_extension}"
    s3_key = f"{subfolder}/{unique_filename}"
    
    try:
        s3_client.upload_fileobj(
            file.file,
            BUCKET_NAME,
            s3_key,
            ExtraArgs={'ContentType': file.content_type}
        )
        return f"/{s3_key}"
    except ClientError as e:
        raise HTTPException(status_code=500, detail="Upload failed")
```

### Step 5: Environment Variables in AWS

Store secrets in AWS Secrets Manager:
```bash
aws secretsmanager create-secret \
  --name zephyr/database-url \
  --secret-string "postgresql://user:pass@rds-endpoint:5432/db"

aws secretsmanager create-secret \
  --name zephyr/secret-key \
  --secret-string "your-production-secret-key"
```

### Step 6: Configure Application Load Balancer

1. **Backend ALB**: Route `/api/*` to backend target group
2. **Frontend ALB**: Route `/*` to frontend target group
3. Configure health checks:
   - Backend: `/health`
   - Frontend: `/`

### Step 7: Configure CloudFront (Optional)

For better performance, put CloudFront in front of your ALB:
- Frontend distribution pointing to frontend ALB
- Backend distribution pointing to backend ALB
- Configure custom domain and SSL certificate

---

## Quick Deployment: EC2 with Docker Compose

### Step 1: Launch EC2 Instance
- **AMI**: Amazon Linux 2023
- **Instance Type**: t3.medium (or larger)
- **Security Group**: Allow ports 22, 80, 443, 3000, 8000

### Step 2: Install Docker
```bash
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Docker
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 3: Deploy Application
```bash
# Clone repository
git clone https://github.com/yourusername/social-networking-app.git
cd social-networking-app

# Copy AWS environment file
cp .env.aws .env

# Edit .env with your RDS endpoint and other configs
nano .env

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Step 4: Configure RDS
- Create RDS PostgreSQL instance
- Update `DATABASE_URL` in `.env`
- Ensure security group allows connection from EC2

---

## Cost Optimization Tips

1. **Use RDS Aurora Serverless** for variable workloads
2. **Enable ECS Service Auto Scaling** based on CPU/memory
3. **Use CloudFront** to reduce ALB requests and improve performance
4. **S3 Intelligent-Tiering** for upload storage
5. **Reserved Instances** for predictable workloads
6. **Spot Instances** for non-critical environments

---

## Monitoring & Logging

- **CloudWatch**: Monitor ECS tasks, RDS, and ALB metrics
- **CloudWatch Logs**: Centralized logging for containers
- **X-Ray**: Distributed tracing (optional)
- **CloudWatch Alarms**: Alert on high CPU, memory, errors

---

## Security Checklist

- [ ] Use HTTPS with ACM certificates
- [ ] Store secrets in AWS Secrets Manager
- [ ] Enable RDS encryption at rest
- [ ] Use S3 bucket encryption
- [ ] Configure security groups with minimal access
- [ ] Enable VPC Flow Logs
- [ ] Use IAM roles for ECS tasks (not access keys)
- [ ] Enable AWS WAF on ALB (optional)
- [ ] Regular security patching of images
