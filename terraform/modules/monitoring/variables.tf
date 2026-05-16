variable "environment" { type = string }
variable "region" { type = string }
variable "asg_name" { type = string }
variable "rds_identifier" { type = string }
variable "alert_email" { type = string; default = "" }
variable "log_retention_days" { type = number; default = 30 }
