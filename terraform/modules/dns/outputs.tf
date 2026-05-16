output "certificate_arn" {
  value = var.domain_name != "" ? aws_acm_certificate.main[0].arn : ""
}
output "domain_name" { value = var.domain_name }
