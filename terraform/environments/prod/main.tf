module "vpc" {
  source = "../modules/vpc"

  environment           = var.environment
  region                = var.aws_region
  vpc_cidr              = var.vpc_cidr
  azs                   = slice(data.aws_availability_zones.available.names, 0, 2)
  public_subnet_cidrs   = var.public_subnet_cidrs
  private_subnet_cidrs  = var.private_subnet_cidrs
  database_subnet_cidrs = var.database_subnet_cidrs
}

module "security" {
  source = "../modules/security"

  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  app_port    = var.app_port
}

module "iam" {
  source = "../modules/iam"

  environment = var.environment
  region      = var.aws_region
  github_org  = var.github_org
  github_repo = var.github_repo
}

module "rds" {
  source = "../modules/rds"

  environment          = var.environment
  subnet_ids           = module.vpc.database_subnets
  security_group_id    = module.security.rds_sg_id
  instance_class       = var.db_instance_class
  multi_az             = var.multi_az
  deletion_protection  = var.environment == "prod"
  skip_final_snapshot  = var.environment != "prod"
}

module "s3" {
  source = "../modules/s3"

  environment  = var.environment
  ec2_role_arn = module.iam.ec2_role_arn
}

module "ec2" {
  source = "../modules/ec2"

  environment          = var.environment
  vpc_id               = module.vpc.vpc_id
  subnet_ids           = module.vpc.private_subnets
  public_subnet_ids    = module.vpc.public_subnets
  security_group_id    = module.security.ec2_sg_id
  alb_security_group_id = module.security.alb_sg_id
  instance_profile_arn = module.iam.ec2_instance_profile_arn
  certificate_arn      = module.dns.certificate_arn
  sns_topic_arn        = module.monitoring.sns_topic_arn
  instance_type        = var.ec2_instance_type
  app_port             = var.app_port
  asg_min_size         = var.asg_min_size
  asg_max_size         = var.asg_max_size
  github_repo          = var.github_repo
}

module "dns" {
  source = "../modules/dns"

  environment = var.environment
  domain_name = var.domain_name
  alb_dns_name = module.ec2.alb_dns_name
  alb_zone_id  = module.ec2.alb_zone_id
}

module "monitoring" {
  source = "../modules/monitoring"

  environment    = var.environment
  region         = var.aws_region
  asg_name       = module.ec2.asg_name
  rds_identifier = module.rds.database_name
  alert_email    = var.alert_email
}
