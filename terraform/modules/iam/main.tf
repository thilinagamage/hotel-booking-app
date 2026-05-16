resource "aws_iam_role" "ec2" {
  name = "serenestay-${var.environment}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
  })

  tags = { Name = "serenestay-${var.environment}-ec2-role" }
}

data "aws_iam_policy_document" "ec2_s3" {
  statement {
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:PutObjectAcl",
      "s3:ListBucket",
    ]
    resources = [
      "arn:aws:s3:::serenestay-uploads-${var.environment}-*",
      "arn:aws:s3:::serenestay-uploads-${var.environment}-*/*",
    ]
  }
}

resource "aws_iam_policy" "ec2_s3" {
  name   = "serenestay-${var.environment}-s3-upload"
  policy = data.aws_iam_policy_document.ec2_s3.json
}

data "aws_iam_policy_document" "ec2_ssm" {
  statement {
    effect = "Allow"
    actions = [
      "ssm:GetParameter",
      "ssm:GetParameters",
      "ssm:GetParametersByPath",
    ]
    resources = ["arn:aws:ssm:${var.region}:${data.aws_caller_identity.current.account_id}:parameter/hotel-booking/${var.environment}/*"]
  }
}

data "aws_caller_identity" "current" {}

resource "aws_iam_policy" "ec2_ssm" {
  name   = "serenestay-${var.environment}-ssm-read"
  policy = data.aws_iam_policy_document.ec2_ssm.json
}

resource "aws_iam_role_policy_attachment" "ec2_s3" {
  role       = aws_iam_role.ec2.name
  policy_arn = aws_iam_policy.ec2_s3.arn
}

resource "aws_iam_role_policy_attachment" "ec2_ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = aws_iam_policy.ec2_ssm.arn
}

resource "aws_iam_role_policy_attachment" "ec2_cloudwatch" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_role_policy_attachment" "ec2_ssm_core" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2" {
  name = "serenestay-${var.environment}-ec2-profile"
  role = aws_iam_role.ec2.name
}

resource "aws_iam_role" "github_actions" {
  name = "serenestay-${var.environment}-github-actions"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:${var.github_org}/${var.github_repo}:*"
        }
      }
    }]
  })
}

resource "aws_iam_policy" "github_actions_deploy" {
  name = "serenestay-${var.environment}-github-deploy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        effect = "Allow"
        actions = [
          "autoscaling:StartInstanceRefresh",
          "autoscaling:DescribeAutoScalingGroups",
        ]
        resources = ["*"]
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "github_actions_deploy" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.github_actions_deploy.arn
}

resource "aws_ssm_parameter" "session_secret" {
  name  = "/hotel-booking/${var.environment}/SESSION_SECRET"
  type  = "SecureString"
  value = random_password.session_secret.result
}

resource "random_password" "session_secret" {
  length  = 48
  special = true
}

resource "aws_ssm_parameter" "node_env" {
  name  = "/hotel-booking/${var.environment}/NODE_ENV"
  type  = "String"
  value = "production"
}

resource "aws_ssm_parameter" "aws_region" {
  name  = "/hotel-booking/${var.environment}/AWS_REGION"
  type  = "String"
  value = var.region
}
