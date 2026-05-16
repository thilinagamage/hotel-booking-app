output "ec2_role_arn"         { value = aws_iam_role.ec2.arn }
output "ec2_instance_profile_arn" { value = aws_iam_instance_profile.ec2.arn }
output "github_actions_role_arn" { value = aws_iam_role.github_actions.arn }
