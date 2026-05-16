variable "environment" { type = string }
variable "subnet_ids" { type = list(string) }
variable "security_group_id" { type = string }
variable "instance_class" { type = string }
variable "multi_az" { type = bool }
variable "allocated_storage" { type = number; default = 20 }
variable "max_allocated_storage" { type = number; default = 100 }
variable "backup_retention_days" { type = number; default = 7 }
variable "deletion_protection" { type = bool; default = true }
variable "skip_final_snapshot" { type = bool; default = false }
