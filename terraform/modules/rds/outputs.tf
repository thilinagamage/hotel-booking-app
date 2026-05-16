output "endpoint"      { value = aws_db_instance.main.endpoint }
output "database_name" { value = aws_db_instance.main.db_name }
output "username"      { value = aws_db_instance.main.username }
output "password"      { value = random_password.db_master.result; sensitive = true }
output "connection_string_ssm_path" { value = aws_ssm_parameter.db_connection_string.name }
