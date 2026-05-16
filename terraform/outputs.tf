output "vpc_id" {
  value = module.vpc.vpc_id
}

output "alb_dns_name" {
  value = module.ec2.alb_dns_name
}

output "alb_zone_id" {
  value = module.ec2.alb_zone_id
}

output "rds_endpoint" {
  value     = module.rds.endpoint
  sensitive = true
}

output "rds_database_name" {
  value = module.rds.database_name
}

output "rds_master_username" {
  value     = module.rds.username
  sensitive = true
}

output "s3_bucket_name" {
  value = module.s3.bucket_name
}

output "ec2_instance_role_arn" {
  value = module.iam.ec2_role_arn
}

output "ec2_security_group_id" {
  value = module.security.ec2_sg_id
}

output "app_url" {
  value = var.domain_name != "" ? "https://${var.domain_name}" : module.ec2.alb_dns_name
}
