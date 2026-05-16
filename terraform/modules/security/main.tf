resource "aws_security_group" "alb" {
  name        = "serenestay-${var.environment}-alb-sg"
  description = "ALB security group"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS from anywhere"
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP redirect to HTTPS"
  }

  egress {
    from_port   = var.app_port
    to_port     = var.app_port
    protocol    = "tcp"
    security_groups = [aws_security_group.ec2.id]
    description = "Forward to EC2 instances"
  }

  tags = { Name = "serenestay-${var.environment}-alb-sg" }
}

resource "aws_security_group" "ec2" {
  name        = "serenestay-${var.environment}-ec2-sg"
  description = "EC2 security group"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = var.app_port
    to_port         = var.app_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
    description     = "ALB traffic"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Outbound internet"
  }

  tags = { Name = "serenestay-${var.environment}-ec2-sg" }
}

resource "aws_security_group" "rds" {
  name        = "serenestay-${var.environment}-rds-sg"
  description = "RDS security group"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
    description     = "PostgreSQL from EC2"
  }

  tags = { Name = "serenestay-${var.environment}-rds-sg" }
}

resource "aws_kms_key" "rds" {
  description             = "RDS encryption key for Serene Stay ${var.environment}"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = { Name = "serenestay-${var.environment}-rds-kms" }
}

resource "aws_kms_alias" "rds" {
  name          = "alias/serenestay-${var.environment}-rds"
  target_key_id = aws_kms_key.rds.key_id
}
