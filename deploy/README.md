# Terraform

## Required env vars

Here we will use IAM token instead of service-account key.

```bash
# GitHub OAuth / Personal Access Token (requires Administration and Environments permissions)
export GITHUB_TOKEN=<token>
export YC_TOKEN=`yc iam create-token`
# AWS provider require auth
export AWS_ACCESS_KEY_ID=123
export AWS_SECRET_ACCESS_KEY=123
```
