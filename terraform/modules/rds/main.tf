resource "random_password" "db_master" {
  length  = 24
  special = false
}

resource "aws_db_subnet_group" "main" {
  name        = "serenestay-${var.environment}"
  subnet_ids  = var.subnet_ids
  description = "Database subnet group for Serene Stay"

  tags = { Name = "serenestay-${var.environment}-db-subnet-group" }
}

resource "aws_db_parameter_group" "main" {
  name        = "serenestay-${var.environment}-pg"
  family      = "postgres16"
  description = "Serene Stay PostgreSQL parameter group"

  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }

  tags = { Name = "serenestay-${var.environment}-pg" }
}

resource "aws_db_instance" "main" {
  identifier = "serenestay-${var.environment}"

  engine            = "postgres"
  engine_version    = "16.3"
  instance_class    = var.instance_class
  db_name           = "serenestay"
  username          = "serenestay_admin"
  password          = random_password.db_master.result
  port              = 5432

  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true

  multi_az               = var.multi_az
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.security_group_id]
  parameter_group_name   = aws_db_parameter_group.main.name

  backup_retention_period = var.backup_retention_days
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:05:00-sun:06:00"

  deletion_protection = var.deletion_protection
  skip_final_snapshot = var.skip_final_snapshot

  monitoring_interval = 30
  monitoring_role_arn = aws_iam_role.rds_enhanced.arn

  enabled_cloudwatch_logs_exports = ["postgresql"]

  tags = { Name = "serenestay-${var.environment}" }
}

resource "aws_iam_role" "rds_enhanced" {
  name = "serenestay-${var.environment}-rds-monitoring"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "monitoring.rds.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "rds_enhanced" {
  role       = aws_iam_role.rds_enhanced.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

resource "aws_ssm_parameter" "db_connection_string" {
  name  = "/hotel-booking/${var.environment}/DATABASE_URL"
  type  = "SecureString"
  value = "postgresql://${aws_db_instance.main.username}:${urlencode(random_password.db_master.result)}@${aws_db_instance.main.endpoint}/${aws_db_instance.main.db_name}?sslmode=require"
}
