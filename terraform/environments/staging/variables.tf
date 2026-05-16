variable "environment" { type = string }
variable "aws_region" { type = string; default = "us-east-1" }
variable "domain_name" { type = string; default = "" }
variable "github_org" { type = string }
variable "github_repo" { type = string }
variable "alert_email" { type = string; default = "" }
variable "vpc_cidr" { type = string; default = "10.0.0.0/16" }
variable "public_subnet_cidrs" { type = list(string); default = ["10.0.1.0/24", "10.0.2.0/24"] }
variable "private_subnet_cidrs" { type = list(string); default = ["10.0.11.0/24", "10.0.12.0/24"] }
variable "database_subnet_cidrs" { type = list(string); default = ["10.0.21.0/24", "10.0.22.0/24"] }
variable "ec2_instance_type" { type = string; default = "t4g.small" }
variable "db_instance_class" { type = string; default = "db.t4g.medium" }
variable "multi_az" { type = bool; default = false }
variable "asg_min_size" { type = number; default = 1 }
variable "asg_max_size" { type = number; default = 2 }
variable "app_port" { type = number; default = 3000 }
